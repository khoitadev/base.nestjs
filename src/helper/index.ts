import * as childProcess from 'child_process';
import TelegramBot from 'node-telegram-bot-api';
import { promisify } from 'util';
import * as crypto from 'crypto';
import { config } from 'dotenv';
import requestIp from 'request-ip';
import satelize from 'satelize';
import randomString from 'randomstring';
config();
const execOrigin = promisify(childProcess.exec);

const TIME_REQUIREMENT = process.env.TIME_REQUIREMENT ?? 30;
const KEY_VERSION_SIGN = process.env.KEY_VERSION_SIGN;
const KEY_SECRET_SIGN = process.env.KEY_SECRET_SIGN;

const BOT_TELEGRAM = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '');

const helper = {
  sha256Hash: (input: string) => {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
  },
  sendMsgTele: async function (msg: string, group: string): Promise<void> {
    const data = await BOT_TELEGRAM.sendMessage(group, msg);
    console.log('exec: ', data);
  },
  sendMsgTeleOptions: async function (): Promise<void> {
    BOT_TELEGRAM.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const opts: any = {
        reply_markup: {
          keyboard: [
            ['Option 1', 'Option 2'],
            ['Option 3'],
            ['Custom Options'],
          ],
          one_time_keyboard: true,
        },
      };

      BOT_TELEGRAM.sendMessage(
        chatId,
        "Hello! I'm an example bot. Choose an option:",
        opts,
      );
    });

    BOT_TELEGRAM.onText(/Option (\d+)/, (msg, match: any) => {
      const chatId = msg.chat.id;
      const selectedOption = match[1];

      BOT_TELEGRAM.sendMessage(chatId, `You selected Option ${selectedOption}`);
    });

    BOT_TELEGRAM.onText(/Custom Options/, (msg) => {
      const chatId = msg.chat.id;
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Inline Option 1', callback_data: 'inline_option_1' }],
            [{ text: 'Inline Option 2', callback_data: 'inline_option_2' }],
            [{ text: 'Back to Menu', callback_data: 'back_to_menu' }],
          ],
        },
      };

      BOT_TELEGRAM.sendMessage(chatId, 'Custom options:', opts);
    });

    BOT_TELEGRAM.on('callback_query', (query: any) => {
      const chatId = query.message.chat.id;
      const option = query.data;

      switch (option) {
        case 'inline_option_1':
          BOT_TELEGRAM.sendMessage(chatId, 'You selected Inline Option 1');
          break;
        case 'inline_option_2':
          BOT_TELEGRAM.sendMessage(chatId, 'You selected Inline Option 2');
          break;
        case 'back_to_menu':
          BOT_TELEGRAM.sendMessage(chatId, 'Back to the main menu');
          break;
        default:
          break;
      }
    });
  },
  exec: async function (cmd: string) {
    console.log('exec: ', cmd);
    return execOrigin(cmd);
  },
  formatTimeWithHours: (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  },
  getTimeByTimezone: function (ip: string) {
    return satelize.satelize({ ip }, (err: any, payload: any) => {
      return payload;
    });
  },
  getIpByRequest: function (req: any) {
    return requestIp.getClientIp(req);
  },
  getCurrentTimestamp: function () {
    return Math.round(new Date().getTime() / 1000);
  },
  stringToTime: function (str: string) {
    return Math.round(Date.parse(str) / 1000);
  },
  getUniqueString: function (data: string) {
    return (
      helper.sha256Hash(data + Math.round(new Date().getTime() / 1000)) +
      randomString.generate()
    );
  },
  randomCode: function ({ length, type }: any) {
    const options: any = {};
    if (length) options.length = length;
    if (type) options.type = type;
    return randomString.generate(options);
  },
  generateFileName: function (originalname: any) {
    const c = originalname.lastIndexOf('.');
    let extension = originalname.slice(c + 1);
    let name = originalname.slice(0, c);
    name = name.replace(/\n|[^\w\s]/gi, '');
    extension = extension.toLowerCase();
    const unique = name.replaceAll(' ', '_').slice(0, 20) + '_' + Date.now();
    return `${unique}.${extension}`;
  },
  generateCode: function (): string {
    const stringOtp = '0123456789';
    let otp = '';
    for (let i = 0; i < 8; i++) {
      otp += stringOtp.charAt(Math.floor(Math.random() * 10));
    }
    return otp;
  },
  getFolderNameByMonth: function () {
    const d = new Date();
    return `${d.getMonth() + 1}-${d.getFullYear()}`;
  },
  sortObject: (o: any) =>
    Object.keys(o)
      .sort((a, b) => a.localeCompare(b))
      .reduce((r: any, k) => {
        r[k] = o[k];
        return r;
      }, {}),
  objToString: (obj: any): string => {
    let dataMd5 = '';
    for (const key in obj) {
      dataMd5 += key + obj[key];
    }
    return dataMd5;
  },
  generateParamsSignUrl: function (params: any) {
    const keySecret = KEY_SECRET_SIGN;
    const month = new Date().getMonth();
    const v = `${KEY_VERSION_SIGN}${month % 4}`;
    params.nonce = crypto.randomBytes(16).toString('base64');
    params.time = Date.now();
    const dataEncrypt = helper.objToString(
      helper.sortObject({ ...params, keySecret, v }),
    );
    params.sign = helper.sha256Hash(dataEncrypt);
    return params;
  },
  validateSign: function (params: any): boolean {
    const { sign, ...data } = params;
    const month = new Date().getMonth();
    const keySecret = KEY_SECRET_SIGN;
    const v = `${KEY_VERSION_SIGN}${month % 4}`;
    const dataEncrypt: string = helper.objToString(
      helper.sortObject({ ...data, keySecret, v }),
    );
    const signBe = helper.sha256Hash(dataEncrypt);
    return signBe === sign;
  },
  validateSignRequest: function (data: any, MoleculerClientError: any) {
    const { time, sign } = data;
    const timeRequest = (Date.now() - time) / 1000;
    if (timeRequest > +TIME_REQUIREMENT)
      throw new MoleculerClientError('server-is-busy!', 503, 'server-is-busy!');
    if (!sign || !helper.validateSign(data))
      throw new MoleculerClientError('bad-request!', 400, 'bad-request!');
  },
  getRandomArbitrary: function (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  removeAccent: function (str: string): string {
    str = str.replace(/[\u00E0-\u00E5\u0102-\u0103\u00C0-\u00C5]/g, 'a');
    str = str.replace(/[\u0110-\u0111]/g, 'd');
    str = str.replace(/[\u00E8-\u00EB\u00C8-\u00CB]/g, 'e');
    str = str.replace(/[\u00EC-\u00EF\u00CC-\u00CF]/g, 'i');
    str = str.replace(/[\u00F2-\u00F6\u00D2-\u00D6\u01A0-\u01A1]/g, 'o');
    str = str.replace(/[\u00F9-\u00FC\u00D9-\u00DC\u01AF-\u01B0]/g, 'u');
    str = str.replace(/[\u00FD-\u00FF\u00DD-\u00DF]/g, 'y');
    str = str.replace(/\s+/g, '-');
    str = str.replace(/[^\w+]/g, '-');
    str = str.replace(/_+/g, '-');
    return str;
  },
  typeValue: function (value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1);
  },
  objectToQueryString: (obj: any) =>
    Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
      )
      .join('&'),
  deepFlatten: (arr: any) =>
    [].concat(
      ...arr.map((v: any) => (Array.isArray(v) ? helper.deepFlatten(v) : v)),
    ),
  fromCamelCase: (str: string, separator = '_') =>
    str
      .replace(/(\[a-z\\d\])(\[A-Z\])/g, '$1' + separator + '$2')
      .replace(/(\[A-Z\]+)(\[A-Z\]\[a-z\\d\]+)/g, '$1' + separator + '$2')
      .toLowerCase(),
  isAbsoluteURL: (str: string) => /^\[a-z\]\[a-z0-9+.-\]\*:/.test(str),
  getDaysDiffBetweenDates: (dateInitial: any, dateFinal: any) =>
    (dateFinal - dateInitial) / (1000 * 3600 * 24),
  uniqueElementsBy: (arr: any, fn: (v: any, x: any) => any) =>
    arr.reduce((acc: any, v: any) => {
      if (!acc.some((x: any) => fn(v, x))) acc.push(v);
      return acc;
    }, []),
};

export default helper;
