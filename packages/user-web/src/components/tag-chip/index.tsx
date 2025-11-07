"use client";
import styled from "styled-components";
import Link from "next/link";

const Chip = styled(Link)<{ $active?: boolean }>`
  display: inline-block;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.border};
  color: ${({ theme, $active }) => ($active ? "#fff" : theme.colors.text)};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.surface};
  &:hover {
    opacity: 0.9;
  }
`;

export function TagChip({
  slug,
  name,
  active,
}: {
  slug: string;
  name: string;
  active?: boolean;
}) {
  const href = slug ? `/blog?tag=${encodeURIComponent(slug)}` : "/blog";
  return (
    <Chip href={href} $active={active}>
      #{name}
    </Chip>
  );
}
