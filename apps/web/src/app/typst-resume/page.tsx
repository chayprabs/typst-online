import { TemplateLanding } from "@/components/TemplateLanding";

export default function TypstResumePage() {
  return (
    <TemplateLanding
      title="Typst Resume Templates"
      description="Start from modern or classic resume templates and export a polished PDF in seconds."
      templateIds={["resume-modern", "resume-classic"]}
    />
  );
}
