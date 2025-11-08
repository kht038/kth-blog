import { Field, ObjectType } from '@nestjs/graphql';
import { UserGq } from 'src/user/models/user.model';

@ObjectType()
export class AuthPayload {
  @Field() accessToken!: string;
  @Field(() => UserGq) user!: UserGq;
}
