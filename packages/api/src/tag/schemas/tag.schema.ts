import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'tags' })
export class Tag extends Document {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, trim: true, unique: true }) slug: string;
  @Prop({ nullable: true, trim: true }) description?: string;
  @Prop({ type: Number, required: true, default: 0 }) postCount: number;
}
export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.index({ name: 1 });
