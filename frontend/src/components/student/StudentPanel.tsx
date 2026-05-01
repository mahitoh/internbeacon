import type { ReactNode } from "react";

type StudentPanelProps = {
  children: ReactNode;
  className?: string;
};

export function StudentPanel({ children, className = "" }: StudentPanelProps) {
  return (
    <section
      className={`rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] ${className}`.trim()}
    >
      {children}
    </section>
  );
}
