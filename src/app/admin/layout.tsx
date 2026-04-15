import { SidebarProvider } from "@/components/SidebarProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
