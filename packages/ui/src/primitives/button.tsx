import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  ghost: "border border-transparent text-slate-200 hover:bg-white/10",
  primary: "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30 hover:bg-cyan-300",
  secondary: "border border-white/15 bg-white/10 text-slate-100 hover:bg-white/15"
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      ].join(" ")}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
