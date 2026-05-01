import type { ReactNode } from "react";

type StudentPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function StudentPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: StudentPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.28em] text-secondary">
          {eyebrow}
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}
