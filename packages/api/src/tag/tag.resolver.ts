// src/tags/tags.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { TagGq, UpsertTagInputGq } from './models/tag.model';

@Resolver(() => TagGq)
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
