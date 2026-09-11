import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import EmployerSidebar from "@/components/employer/Sidebar";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // TODO: Add role check to ensure user is an employer
  // For MVP, we'll just allow any logged-in user to view it

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <EmployerSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header (simplified) */}
        <header className="lg:hidden h-16 bg-surface border-b border-border flex items-center px-4 justify-between sticky top-0 z-20">
          <div className="font-bold text-ink flex items-center gap-2">
            Lokers<span className="text-warning">!</span> Employer
          </div>
          {/* Mobile menu button could go here */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
