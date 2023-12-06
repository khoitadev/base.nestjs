import { Injectable, Inject } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import nodemailer from 'nodemailer';
import { CreateEmailDto, UpdateEmailDto } from '~/dto';
import { StatusGeneratorOtp } from '~/enum';
import {
  DataSendMail,
  EmailTemplate,
  DataGeneratorOtp,
  MailContent,
  OptionContent,
  OptionSendMail,
  Otp,
  VerifyOtp,
  OtpGenerator,
} from '~/interface';

const MAIL_USERNAME = process.env.MAIL_USERNAME;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_TEMPLATE_MODEL') private emailModel: Model<EmailTemplate>,
    @Inject('OTP_MODEL') private otpModel: Model<Otp>,
  ) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  private replaceContent(
    content: string,
    { email, name, otp, amount }: any,
  ): string {
    return content.replace(
      /{{([^{}]+)}}/g,
      function (keyExpr: string, key: string) {
        switch (key) {
          case 'EMAIL':
            return email;
          case 'NAME':
            return name;
          case 'OTP':
            return otp;
          case 'AMOUNT':
            return new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'VND',
            }).format(amount);
        }
      },
    );
  }

  private send(mailOptions: OptionSendMail) {
    return this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('send mail error ::: ', error);
        return error;
      }
      console.log('send mail success : ', info);
      return info;
    });
  }

  private generateCode(): string {
    const stringOtp = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += stringOtp.charAt(Math.floor(Math.random() * 10));
    }
    return otp;
  }

  async generatorOtp(data: DataGeneratorOtp): Promise<OtpGenerator> {
    const exist: Otp = await this.otpModel.findOne(data);
    if (exist)
      return {
        status: StatusGeneratorOtp.Exist,
        otp: exist,
      };

    const otp = this.generateCode();
    const newOtp = await this.otpModel.create({ ...data, code: otp });

    return {
      status: StatusGeneratorOtp.New,
      otp: newOtp,
    };
  }

  async verifyOtp(data: VerifyOtp): Promise<boolean> {
    const exist: Otp = await this.otpModel.findOne(data);
    if (exist) {
      await this.otpModel.deleteOne({ id: exist._id });
      return data.code === exist.code;
    }
    return false;
  }

  async create(createEmailDto: CreateEmailDto): Promise<EmailTemplate> {
    return this.emailModel.create(createEmailDto);
  }

  async sendMail(dataSendMail: DataSendMail): Promise<any> {
    const { language, keyword, to, ...dataReplace } = dataSendMail;
    const template: EmailTemplate = await this.emailModel.findOne({
      keyword,
    });
    const content: MailContent = template.content;

    let { subject, body }: OptionContent = content[language];
    subject = this.replaceContent(subject, dataReplace);
    body = this.replaceContent(body, dataReplace);

    const mailOptions: OptionSendMail = {
      from: 'nestjs@gmail.com',
      to,
      subject,
      html: body,
    };

    return this.send(mailOptions);
  }

  async list(): Promise<EmailTemplate[]> {
    return this.emailModel.find();
  }

  async getById(id: ObjectId): Promise<object> {
    return this.emailModel.findById(id);
  }

  async update(id: ObjectId, updateEmailDto: UpdateEmailDto) {
    return this.emailModel.findByIdAndUpdate(id, updateEmailDto);
  }
}
