"use client";

import styled from "styled-components";

const Title = styled.h1`
  font-size: 28px;
  margin: 0 0 8px;
`;
const Meta = styled.p`
  color: ${({ theme }) => theme.colors.subtext};
  margin: 0 0 16px;
`;
const Cover = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.radius.lg};
  margin: 16px 0;
`;
const Content = styled.div`
  margin-top: 16px;
  line-height: 1.75;
`;
const Tags = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.subtext};
`;

export default function PostDetailView({ post }: { post: any }) {
  return (
    <article>
      <Title>{post.title}</Title>
      <Meta>
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleString()
          : "초안"}
      </Meta>
      {post.coverImage && <Cover src={post.coverImage} alt="" />}
      {post.contentHtml && (
        <Content dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      )}
      {post.tags?.length > 0 && (
        <Tags>태그: {post.tags.map((t: any) => `#${t.name}`).join(" ")}</Tags>
      )}
    </article>
  );
}
