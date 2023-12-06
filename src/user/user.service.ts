import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpGenerator, UpdateInfoSocial, User } from '~/interface';
import {
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserDto,
  UpdatePasswordDto,
} from '~/dto';
import { EmailService } from '~/email/email.service';
import { MailKeyword, StatusGeneratorOtp, TypeOtp } from '~/enum';
import { encryptionPassword, validatePassword } from '~/helper/auth.helper';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ _id: id }, updateUserDto)
      .select('-password');
  }

  async get(id: ObjectId): Promise<User> {
    return await this.userModel.findById(id).select(['-password']).exec();
  }

  async findOne(query: any): Promise<User> {
    return await this.userModel.findOne(query).select(['-password']).exec();
  }

  async getByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async delete(id: ObjectId): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }

  async list(): Promise<User[]> {
    return this.userModel.find().select(['-password']).exec();
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const { password, code, email } = resetPasswordDto;
    const user: User = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('user-not-found', HttpStatus.NOT_FOUND);

    const status: boolean = await this.emailService.verifyOtp({
      code,
      type: TypeOtp.ForgotPassword,
      email,
    });
    if (!status)
      throw new HttpException(
        'code-not-verify',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newPassword = encryptionPassword(password);

    return this.userModel
      .findByIdAndUpdate(user._id, {
        password: newPassword,
      })
      .select('-password');
  }

  async updatePassword(
    id: ObjectId,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    const { oldPassword, newPassword } = updatePasswordDto;
    if (oldPassword === newPassword)
      throw new HttpException('new-password-must-not-old-password', 422);

    const user: User = await this.userModel.findById(id);
    const validateOldPass = validatePassword(oldPassword, user.password);
    if (!validateOldPass)
      throw new HttpException(
        'old-password-is-incorrect',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newPasswordEncrypt = encryptionPassword(newPassword);

    return this.userModel
      .findByIdAndUpdate(user._id, {
        password: newPasswordEncrypt,
      })
      .select('-password');
  }

  async updateInfoSocial(
    id: ObjectId,
    updateInfoSocial: UpdateInfoSocial,
  ): Promise<any> {
    return this.userModel
      .findByIdAndUpdate(id, updateInfoSocial, { new: true })
      .select('-password')
      .exec();
  }

  async sendMailOtp(id: ObjectId): Promise<any> {
    const user: User = await this.userModel.findById(id);
    if (user.emailVerified)
      throw new HttpException('email-verified', HttpStatus.CONFLICT);

    const generator: OtpGenerator = await this.emailService.generatorOtp({
      email: user.email,
      type: TypeOtp.VerifyEmail,
    });

    if (generator.status === StatusGeneratorOtp.New) {
      this.emailService.sendMail({
        to: user.email,
        language: user.language,
        keyword: MailKeyword.Verify,
        name: user.name,
        otp: generator.otp.code,
      });
    }

    return { message: 'success', status: 200 };
  }

  async verifyEmail(id: ObjectId, code: string): Promise<any> {
    const user: User = await this.userModel.findById(id);
    const status: boolean = await this.emailService.verifyOtp({
      code,
      type: TypeOtp.VerifyEmail,
      email: user.email,
    });
    if (!status)
      throw new HttpException(
        'code-not-verify',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          emailVerified: true,
        },
        { new: true },
      )
      .select('-password');
  }
}
