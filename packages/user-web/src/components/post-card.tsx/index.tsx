"use client";
import styled from "styled-components";
import Link from "next/link";

const Card = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const Thumb = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
`;

const Body = styled.div`
  padding: 14px 16px 18px;
`;

const Title = styled.h3`
  margin: 8px 0 6px;
  font-size: 18px;
  line-height: 1.35;
`;

const Excerpt = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 14px;
`;

const Tags = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  span {
    font-size: 12px;
    background: #f5f5f5;
    padding: 3px 8px;
    border-radius: 9999px;
  }
`;

const Meta = styled.time`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtext};
`;

export function PostCard({ post }: { post: any }) {
  return (
    <Card>
      {post.coverImage && <Thumb src={post.coverImage} alt="" />}
      <Body>
        <Meta>
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : "초안"}
        </Meta>
        <Title>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </Title>
        {post.excerpt && <Excerpt>{post.excerpt}</Excerpt>}
        <Tags>
          {(post.tags ?? []).map((t: any) => (
            <span key={t.id}>#{t.name}</span>
          ))}
        </Tags>
      </Body>
    </Card>
  );
}
