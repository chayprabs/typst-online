import type { Metadata } from "next";
import { TemplateLanding } from "@/components/TemplateLanding";

export const metadata: Metadata = {
  title: "Typst Resume Template Online — TypstBox",
  description: "Create a professional resume with Typst online. Modern and classic templates, instant PDF export.",
};

export default function TypstResumePage() {
  return (
    <TemplateLanding
      title="Typst Resume Templates"
      description="Start from modern or classic resume templates and export a polished PDF in seconds."
      templateIds={["resume-modern", "resume-classic"]}
    />
  );
}
