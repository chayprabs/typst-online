import type { Metadata } from "next";
import { Playground } from "@/components/Playground";

export const metadata: Metadata = {
  title: "Typst Playground — TypstBox",
  description:
    "Free online Typst playground with live PDF preview, multi-file editor, templates, and pinned compiler versions.",
};

export default function TypstPlaygroundPage() {
  return <Playground />;
}
