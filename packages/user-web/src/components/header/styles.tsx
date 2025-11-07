import Link from "next/link";
import { styled } from "styled-components";

export const Bar = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Wrap = styled.nav`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Brand = styled(Link)`
  font-weight: 800;
  font-size: 1.1rem;
`;

export const NavLink = styled(Link)`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.subtext};
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;
