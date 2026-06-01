import type { Metadata } from "next";
import { TemplateForkPage } from "@/components/TemplateForkPage";
import { fetchTemplateProject } from "@/lib/worker";

type Props = { params: Promise<{ templateId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { templateId } = await params;
  const title = templateId.replace(/-/g, " ");
  return {
    title: `${title} — TypstBox Template`,
    description: `Fork and edit the ${title} Typst template online. Compile to PDF with live preview.`,
  };
}

export default async function TemplateRoutePage({ params }: Props) {
  const { templateId } = await params;
  const project = await fetchTemplateProject(templateId);
  return <TemplateForkPage templateId={templateId} initialProject={project} />;
}
