import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LiveIndicator } from "@/components/badges";
import { signOut } from "@/lib/auth";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger />
                <div className="hidden md:block">
                  <LiveIndicator />
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="h-9 px-3 rounded-lg border bg-card hover:bg-accent text-sm font-medium text-foreground"
              >
                Выйти
              </button>
            </div>
          </header>
          <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 text-[11px] font-semibold uppercase tracking-wider">
          {badge}
        </div>
      )}
      <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>}
    </div>
  );
}
