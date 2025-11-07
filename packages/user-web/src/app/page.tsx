"use client";
import styled from "styled-components";

const Title = styled.h1`
  margin: 0 0 8px;
`;
const Sub = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.subtext};
`;
const Section = styled.section`
  margin-top: 32px;
`;
const Li = styled.li`
  margin: 6px 0;
`;

export default function HomePage() {
  return (
    <>
      <Title>고태형 — 소개</Title>
      <Sub>React / NestJS / GraphQL / MongoDB</Sub>

      <Section>
        <h2>경력</h2>
        <ul>
          <Li>2021–현재: 풀스택 (React/Nest/MongoDB)</Li>
          <Li>관심: Editor.js, GraphQL, AWS CI/CD</Li>
        </ul>
      </Section>

      <Section>
        <h2>스킬</h2>
        <ul>
          <Li>Frontend: React, Next.js, styled-components</Li>
          <Li>Backend: NestJS, GraphQL (Apollo v5)</Li>
          <Li>Infra: AWS, Docker, PNPM Monorepo</Li>
        </ul>
      </Section>
    </>
  );
}
