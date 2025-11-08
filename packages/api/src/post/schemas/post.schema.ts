import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostStatus = 'draft' | 'published' | 'archived';

@Schema({ timestamps: true, collection: 'posts' })
export class Post extends Document {
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: PostStatus;

  @Prop({ trim: true }) excerpt?: string;
  @Prop() coverImage?: string;

  @Prop({ type: Object, requried: true }) contentBlocks: any;
  @Prop() contentHtml: string;

  @Prop({ type: [Types.ObjectId], ref: 'Tag', default: [] })
  tagIds: Types.ObjectId[];

  @Prop() publishedAt?: Date;

  @Prop({ type: String }) authorId?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ status: 1, publishedAt: -1 }); // 목록 정렬/필터
PostSchema.index({ tagIds: 1 }); // 태그 필터
PostSchema.index({ title: 'text', excerpt: 'text' }); // 제목/요약 검색(텍스트)
