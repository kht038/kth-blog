"use client";
import styled from "styled-components";
import Link from "next/link";
import { Bar, Brand, NavLink, Wrap } from "./styles";

export default function Header() {
  return (
    <Bar>
      <Wrap>
        <Brand href="/">KTH</Brand>
        <NavLink href="/blog">Blog</NavLink>
      </Wrap>
    </Bar>
  );
}
