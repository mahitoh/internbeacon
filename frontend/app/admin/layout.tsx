import { AdminAppShell } from "@/components/shells/AdminAppShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAppShell>{children}</AdminAppShell>;
}
