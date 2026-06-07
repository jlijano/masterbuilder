import { Suspense } from "react";
import { EditorClient } from "../../features/projects/EditorClient";

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[calc(100vh-8rem)] place-items-center text-slate-100">
          <p className="text-sm font-semibold text-cyan-100">Loading editor...</p>
        </div>
      }
    >
      <EditorClient />
    </Suspense>
  );
}
