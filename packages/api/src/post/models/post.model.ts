import GraphQLJSON from 'graphql-type-json';
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { TagGq } from 'src/tag/models/tag.model';

export enum PostStatusEnum {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}
// graphql 에 타입 등록
registerEnumType(PostStatusEnum, { name: 'PostStatus' });

@ObjectType()
export class PostGq {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field() slug: string;
  @Field(() => PostStatusEnum) status: PostStatusEnum;
  @Field({ nullable: true }) excerpt?: string;
  @Field({ nullable: true }) coverImage?: string;
  @Field(() => GraphQLJSON) contentBlocks: any;
  @Field({ nullable: true }) contentHtml: string;
  @Field(() => [TagGq]) tags: TagGq[];
  @Field({ nullable: true }) authorId: string;
}

@InputType()
export class UpsertPostInputGq {
  @Field({ nullable: true }) id?: string;
  @Field() title!: string;
  @Field() slug!: string;
  @Field(() => PostStatusEnum, { defaultValue: PostStatusEnum.draft })
  status?: PostStatusEnum;
  @Field({ nullable: true }) excerpt?: string;
  @Field({ nullable: true }) coverImage?: string;
  @Field(() => GraphQLJSON) contentBlocks!: any;
  @Field({ nullable: true }) contentHtml?: string;
  @Field(() => [String], { defaultValue: [] }) tagIds!: string[]; // Tag ObjectId 문자열
  @Field({ nullable: true }) publishedAt?: Date;
}

@InputType()
export class PostsFilterInputGq {
  @Field(() => [String], { nullable: true }) tagIdsAll?: string[]; // 모두 포함(AND)
  @Field(() => [String], { nullable: true }) tagIdsAny?: string[]; // 하나라도 포함(OR)
  @Field(() => PostStatusEnum, { nullable: true }) status?: PostStatusEnum;
  @Field({ nullable: true }) q?: string; // 제목/요약 검색
  @Field({ nullable: true, defaultValue: 'publishedAt:desc' }) sort?: string; // 'field:asc|desc'
  @Field({ nullable: true, defaultValue: '0' }) skip?: number;
  @Field({ nullable: true, defaultValue: '10' }) limit?: number;
}
