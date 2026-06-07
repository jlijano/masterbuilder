import { ReactNode } from "react";

export function MainContent({ children }: Readonly<{ children: ReactNode }>) {
  return <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>;
}
