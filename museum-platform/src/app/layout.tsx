import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUSEA — Museum Operations",
  description: "Nền tảng quản lý và khám phá di sản bảo tàng.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
