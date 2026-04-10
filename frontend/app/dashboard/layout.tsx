import { StudentAppShell } from "@/components/shells/StudentAppShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentAppShell>{children}</StudentAppShell>;
}
