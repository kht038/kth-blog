// auth/types.ts
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGq {
  @Field() id!: string;
  @Field() email!: string;
  @Field() name!: string;
  @Field(() => GraphQLISODateTime, { nullable: true }) lastLoginAt?:
    | Date
    | undefined;
}
