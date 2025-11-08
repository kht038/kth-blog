import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user', timestamps: true })
export class User {
  @Prop({ type: mongoose.Types.ObjectId })
  _id: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  // 속도 및 성능이슈때문에 bcrypt 대신 토큰은 SHA-256으로 저장
  @Prop({ type: String, select: false, default: null })
  refreshTokenSha256?: string | null;

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
