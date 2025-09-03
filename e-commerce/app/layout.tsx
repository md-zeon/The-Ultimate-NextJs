import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My E-Commerce Store",
  description: "The best place to buy amazing things.",
};
// Type definition for the RootLayout props
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link> | <Link href="/products">Products</Link> |{" "}
          <Link href="/cart">Cart</Link> | <Link href="/account">Account</Link>
        </nav>
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
