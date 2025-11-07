// src/tags/tags.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './schemas/tag.schema';
import { UpsertTagInputGq } from './models/tag.model';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private model: Model<Tag>) {}

  findAll() {
    return this.model.find().sort({ name: 1 }).lean();
  }
  findBySlug(slug: string) {
    return this.model.findOne({ slug }).lean();
  }
  upsert(input: UpsertTagInputGq) {
    const { id, ...data } = input;
    if (id) return this.model.findByIdAndUpdate(id, data, { new: true });
    return this.model.create(data);
  }
}
