import type { Metadata } from "next";
import Providers from "./providers";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "KTH Blog",
  description: "토이 블로그 + 자기소개",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <main
            style={{ maxWidth: 820, margin: "0 auto", padding: "32px 16px" }}
          >
            {children}
          </main>
          <footer
            style={{ textAlign: "center", padding: "48px 0", color: "#666" }}
          >
            © {new Date().getFullYear()} KTH
          </footer>
        </Providers>
      </body>
    </html>
  );
}
