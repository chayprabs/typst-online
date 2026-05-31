import type { Metadata } from "next";
import { TemplateLanding } from "@/components/TemplateLanding";

export const metadata: Metadata = {
  title: "Typst Paper Template — IEEE Style — TypstBox",
  description: "Academic paper template for Typst. IEEE-style layout, compile to PDF online.",
};

export default function TypstPaperPage() {
  return (
    <TemplateLanding
      title="Typst Paper Template"
      description="IEEE-style paper starter for academic and technical writing."
      templateIds={["paper-ieee"]}
    />
  );
}
