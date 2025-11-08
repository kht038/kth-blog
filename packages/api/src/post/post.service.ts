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

    // 상태
    if (filter.status) q.status = filter.status;

    // 태그 (AND | OR)
    if (filter.tagIdsAll?.length) {
      q.tagIds = { $all: filter.tagIdsAll.map((id) => new Types.ObjectId(id)) };
    } else if (filter.tagIdsAny?.length) {
      q.tagIds = { $in: filter.tagIdsAny.map((id) => new Types.ObjectId(id)) };
    }

    // 텍스트 검색
    if (filter.q) q.$text = { $search: filter.q };

    // ---- 정렬 ----
    let sort: Record<string, 1 | -1> = { publishedAt: -1, createdAt: -1 };

    // filter.sort 문자열을 안전하게 파싱하도록 개선
    if (typeof filter.sort === 'string') {
      // "field:dir" 형태만 허용
      const i = filter.sort.indexOf(':');
      if (i > 0 && i < filter.sort.length - 1) {
        const field: string = filter.sort.slice(0, i).trim();
        const dirStr = filter.sort
          .slice(i + 1)
          .trim()
          .toLowerCase();

        // Set을 활용한 필드 화이트리스트 처리
        const allowedFields = new Set(['publishedAt', 'createdAt', 'title']);
        const isAllowed = allowedFields.size === 0 || allowedFields.has(field);

        // TS 2464 에러 때문에 field를 string으로 강제 캐스팅
        if (
          field !== '' &&
          isAllowed &&
          (dirStr === 'asc' || dirStr === 'desc')
        ) {
          const dir: 1 | -1 = dirStr === 'asc' ? 1 : -1;
          sort = { [field]: dir }; // field는 여기서 확실히 string
        }
      }
    }
    // -------------------------------------------------------

    const skip = filter.skip ?? 0;
    const limit = filter.limit ?? 10; // (오타 수정)

    const cursor = this.model
      .find(q)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('tagIds');

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
