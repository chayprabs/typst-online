import type { Metadata } from "next";
import { TemplateLanding } from "@/components/TemplateLanding";

export const metadata: Metadata = {
  title: "Typst Invoice Template — TypstBox",
  description: "Generate professional invoices with Typst. Free online template with PDF download.",
};

export default function TypstInvoicePage() {
  return (
    <TemplateLanding
      title="Typst Invoice Template"
      description="Create professional invoices with Typst and download PDF instantly."
      templateIds={["invoice"]}
    />
  );
}
