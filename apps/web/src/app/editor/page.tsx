import { Suspense } from "react";
import { EditorClient } from "../../features/projects/EditorClient";

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
          <p className="text-sm font-semibold text-cyan-100">Loading editor...</p>
        </main>
      }
    >
      <EditorClient />
    </Suspense>
  );
}
