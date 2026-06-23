import { Sidebar } from "@/components/app/sidebar";
import { DocumentsProvider } from "@/components/app/documents-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocumentsProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="app-surface flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </DocumentsProvider>
  );
}
