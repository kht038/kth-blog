"use client";

import styled from "styled-components";
import { Pagination } from "../pagination/pagination";
import { PostCard } from "../post-card.tsx";
import { TagChip } from "../tag-chip";

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;
const SearchRow = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  input {
    flex: 1;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    padding: 10px 12px;
    background: ${({ theme }) => theme.colors.surface};
  }
  button {
    padding: 10px 14px;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border: 0;
  }
`;
const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;
const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
`;

export default function BlogListView({
  q,
  tagSlug,
  page,
  totalPages,
  tags,
  items,
}: {
  q?: string;
  tagSlug?: string;
  page: number;
  totalPages: number;
  tags: any[];
  items: any[];
}) {
  return (
    <section>
      <Title>블로그</Title>

      <SearchRow action="/blog">
        <input name="q" placeholder="제목/요약 검색" defaultValue={q ?? ""} />
        {tagSlug && <input type="hidden" name="tag" value={tagSlug} />}
        <button>검색</button>
      </SearchRow>

      <TagRow>
        <TagChip slug="" name="전체" active={!tagSlug} />
        {tags.map((t) => (
          <TagChip
            key={t.id}
            slug={t.slug}
            name={t.name}
            active={t.slug === tagSlug}
          />
        ))}
      </TagRow>

      <Grid>
        {items.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </Grid>

      <Pagination
        page={page}
        totalPages={totalPages}
        params={{ q, tag: tagSlug }}
      />
    </section>
  );
}
