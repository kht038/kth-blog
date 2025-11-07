// src/posts/posts.resolver.ts
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import {
  PostGq,
  PostsFilterInputGq,
  UpsertPostInputGq,
} from './models/post.model';

@ObjectType()
class PostList {
  @Field(() => [PostGq]) items: PostGq[];
  @Field(() => Int) total: number;
}

@Resolver(() => PostGq)
export class PostResolver {
  constructor(private readonly svc: PostService) {}

  @Query(() => PostList, { name: 'posts' })
  posts(@Args('filter', { nullable: true }) filter?: PostsFilterInputGq) {
    return this.svc.findAll(filter ?? {});
  }

  @Query(() => PostGq, { name: 'postBySlug', nullable: true })
  postBySlug(@Args('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Mutation(() => PostGq, { name: 'upsertPost' })
  upsertPost(@Args('input') input: UpsertPostInputGq) {
    return this.svc.upsert(input);
  }

  @Mutation(() => Boolean, { name: 'removePost' })
  removePost(@Args('id') id: string) {
    return this.svc.remove(id);
  }
}
