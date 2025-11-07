import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  // ✅ 이 모듈에서 사용할 Mongoose 스키마를 등록
  // name: 모델 이름 (MongoDB 컬렉션명과 연결)
  // schema: 실제 스키마 정의 (post.schema.ts에서 export한 것)
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],

  // ✅ 비즈니스 로직과 GraphQL Resolver 등록
  // providers는 Nest가 DI(의존성 주입)할 대상 클래스들을 의미함
  providers: [PostResolver, PostService],

  // ✅ 다른 모듈에서 PostService를 사용할 수 있게 export (선택 사항)
  // 예: TagModule에서 PostService를 사용하고 싶을 때
  exports: [PostService],
})
export class PostModule {}
