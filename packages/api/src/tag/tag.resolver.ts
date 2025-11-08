// src/tags/tags.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { TagGq, UpsertTagInputGq } from './models/tag.model';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => TagGq)
@UseGuards(GqlAuthGuard)
export class TagResolver {
  constructor(private readonly svc: TagService) {}

  @Query(() => [TagGq], { name: 'tags' })
  tags() {
    return this.svc.findAll();
  }

  @Query(() => TagGq, { name: 'tagBySlug', nullable: true })
  tagBySlug(@Args('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Mutation(() => TagGq, { name: 'upsertTag' })
  upsertTag(@Args('input') input: UpsertTagInputGq) {
    return this.svc.upsert(input);
  }
}
