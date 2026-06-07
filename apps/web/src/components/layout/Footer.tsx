import { PRODUCT_NAME } from "@house-designer/shared";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 px-4 py-3 text-xs text-slate-400 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>{PRODUCT_NAME} workspace shell</p>
        <p>Global navigation stays persistent while page content changes.</p>
      </div>
    </footer>
  );
}
