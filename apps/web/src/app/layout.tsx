import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { SeoBar } from "@/components/SeoBar";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "TypstBox — Online Typst Editor & PDF Compiler",
  description:
    "Compile Typst documents to PDF, SVG, PNG and HTML online with pinned versions, package universe, fonts and a live editor playground.",
  keywords: [
    "typst",
    "typst-online",
    "typst-playground",
    "typesetting",
    "latex-alternative",
    "pdf",
    "document-rendering",
    "typst-editor",
    "typst-universe",
    "typst-templates",
    "live-preview",
    "web-editor",
    "online-editor",
    "pdf-generation",
    "online-tool",
  ],
  openGraph: {
    title: "TypstBox",
    description: "Online Typst editor with live PDF preview",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <TopBar />
        <SeoBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
