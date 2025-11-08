import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email.toLowerCase() }).lean();
  }

  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async createAdmin(email: string, name: string, password: string) {
    const exists = await this.findByEmail(email);

    if (exists) return exists;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return await this.userModel.create({
      email: email.toLowerCase(),
      name,
      passwordHash,
    });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+passwordHash +refreshTokenSha256');
  }

  async setRefreshTokenSha256(userId: string, sha256: string | null) {
    return await this.userModel.updateOne(
      { _id: userId },
      { $set: { refreshTokenSha256: sha256, lastLoginAt: new Date() } },
    );
  }
}
