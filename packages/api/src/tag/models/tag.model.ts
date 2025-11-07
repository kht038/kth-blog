import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagGq {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() slug: string;
  @Field({ nullable: true }) description: string;
  @Field(() => Number) postCount: number;
}

@InputType()
export class UpsertTagInputGq {
  @Field({ nullable: true }) id?: string;
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) slug?: string;
  @Field({ nullable: true }) description?: string;
}
