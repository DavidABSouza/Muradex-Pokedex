import Link from "next/link"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body>
        {children}</body>
    </html>
  );
}
