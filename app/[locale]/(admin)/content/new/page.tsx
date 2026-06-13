import { ContentForm } from "@/components/cms/content-form";

export default function NewContentPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Nový obsah</h1>
      <div className="mt-6">
        <ContentForm />
      </div>
    </div>
  );
}
