"use client";
import styled from "styled-components";
import Link from "next/link";

const Wrap = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const Btn = styled(Link)<{ $disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
`;

const Info = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.subtext};
  margin: 0 4px;
`;

export function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  const build = (p: number) => {
    const q = new URLSearchParams({
      ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      page: String(p),
    });
    return `/blog?${q.toString()}`;
  };
  return (
    <Wrap>
      <Btn href={build(page - 1)} $disabled={page <= 1}>
        이전
      </Btn>
      <Info>
        Page {page} / {totalPages}
      </Info>
      <Btn href={build(page + 1)} $disabled={page >= totalPages}>
        다음
      </Btn>
    </Wrap>
  );
}
