import { EmployerAppShell } from "@/components/shells/EmployerAppShell";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployerAppShell>{children}</EmployerAppShell>;
}
