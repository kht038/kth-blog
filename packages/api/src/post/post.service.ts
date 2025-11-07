import { Injectable } from '@nestjs/common';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { PostStatusEnum, UpsertPostInputGq } from './models/post.model';

type Filter = {
  tagIdsAll?: string[];
  tagIdsAny?: string[];
  status?: 'draft' | 'published' | 'archived';
  q?: string;
  sort?: string;
  skip?: number;
  limit?: number;
};

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private model: Model<Post>) {}

  async findAll(filter: Filter = {}) {
    const q: FilterQuery<Post> = {};

    // 상태 필터링
    if (filter.status) q.status = filter.status;

    // 태그 필터 (AND | OR)
    if (filter.tagIdsAll?.length) {
      q.tagIds = { $all: filter.tagIdsAll.map((id) => new Types.ObjectId(id)) };
    } else if (filter.tagIdsAny?.length) {
      q.tagIds = { $in: filter.tagIdsAny.map((id) => new Types.ObjectId(id)) };
    }

    // 제목/요약 검색
    if (filter.q) {
      q.$text = { $search: filter.q };
    }

    // Generic Type 주석 업데이트 필요
    // 정렬 규칙 filter:asc(desc)
    let sort: Record<string, 1 | -1> = { publishedAt: -1, createdAt: -1 };
    if (filter.sort) {
      const [field, dir] = filter.sort.split(':');
      sort = { [field]: dir === 'asc' ? 1 : -1 };
    }

    const skip = filter.skip ?? 0;
    const limit = filter.skip ?? 10;

    //mongoDb find 쿼리 객체
    const cursor = this.model
      .find(q)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('tagIds'); // join

    // lean()을 사용하여 Mongoose Document 객체 대신 순수 자바스크립트 객체로 겨과를 반환
    // 조회만 할떄는 lean이 훨씬 효율적임.
    const [items, total] = await Promise.all([
      cursor.lean(),
      this.model.countDocuments(q),
    ]);

    return { items, total };
  }

  findBySlug(slug: string) {
    return this.model.findOne({ slug }).populate('tagIds').lean();
  }

  async upsert(input: UpsertPostInputGq) {
    const { id, status, ...rest } = input;

    // 수정용 객체
    const patch: Partial<UpsertPostInputGq> = { ...rest, status };

    if (status === PostStatusEnum.published) {
      patch.publishedAt = input.publishedAt;
    } else if (status === PostStatusEnum.draft) {
      patch.publishedAt = undefined;
    }

    if (id) {
      // 수정후의 최신 데이터 반환 및 id로 저장된 태그 정보를 실제 TAG 객체로 채우기
      return this.model
        .findByIdAndUpdate(id, patch, { new: true })
        .populate('tagIds');
    }

    return (await this.model.create(patch)).toObject();
  }

  async remove(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    return !!res;
  }
}
