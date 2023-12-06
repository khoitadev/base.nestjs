import { Model, ObjectId } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '~/interface';
import { CreateAdminDto } from '~/dto';
import { encryptionPassword } from '~/helper/auth.helper';

@Injectable()
export class AdminService {
  constructor(
    @Inject('ADMIN_MODEL') private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async transformAdmin(admin: Admin): Promise<any> {
    const result: any = JSON.parse(JSON.stringify(admin));
    delete result.password;
    const payload = { email: result.email, id: result._id, role: admin.role };
    result.accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_TOKEN,
      expiresIn: '30d',
    });
    return result;
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    let { email, password } = createAdminDto;
    password = encryptionPassword(password);
    email = email.trim().toLowerCase();
    const admin = await this.adminModel.create({
      ...createAdminDto,
      email,
      password,
    });
    return this.transformAdmin(admin);
  }

  async get(id: ObjectId): Promise<Admin> {
    return this.adminModel.findById(id).select(['-password']).exec();
  }

  async getByEmail(email: string): Promise<Admin> {
    return this.adminModel.findOne({ email: email.toLowerCase() }).exec();
  }
}
