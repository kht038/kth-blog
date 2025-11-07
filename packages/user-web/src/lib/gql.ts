import { GraphQLClient } from "graphql-request";

export function getGqlClient() {
  // 서버 컴포넌트에서도 안전하게 읽히도록 fallback 포함
  const endpoint =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ?? // 필요시 .env.local에 API_URL만 넣어도 동작
    "http://localhost:8000/graphql"; // 최종 안전 기본값

  if (!endpoint || !/^https?:\/\//.test(endpoint)) {
    throw new Error(
      `GraphQL endpoint is invalid. Set NEXT_PUBLIC_API_URL or API_URL. current="${endpoint}"`
    );
  }

  return new GraphQLClient(endpoint, {
    headers: { "content-type": "application/json" },
  });
}

export const GQL = {
  Posts: /* GraphQL */ `
    query Posts($filter: PostsFilterInputGq) {
      posts(filter: $filter) {
        items {
          id
          title
          slug
          status
          excerpt
          coverImage
          contentBlocks
          contentHtml
          tags {
            id
            name
            slug
            description
            postCount
          }
          authorId
        }
        total
      }
    }
  `,
  Tags: /* GraphQL */ `
    query Tags {
      tags {
        id
        name
        slug
      }
    }
  `,
  PostBySlug: /* GraphQL */ `
    query PostBySlug($slug: String!) {
      postBySlug(slug: $slug) {
        id
        title
        slug
        excerpt
        coverImage
        status
        publishedAt
        contentHtml
        tags {
          id
          name
          slug
        }
      }
    }
  `,
};
