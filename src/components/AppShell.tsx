import { useState, type ReactNode } from "react";
import { useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Settings as SettingsIcon, Building2, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LiveIndicator } from "@/components/badges";
import { AiAssistant } from "@/components/AiAssistant";
import { signOut, getSession } from "@/lib/auth";
import { NOTIFICATION_LOG } from "@/lib/app-data";

function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const email = getSession()?.email ?? "demo@tender.kz";
  const letter = email[0]?.toUpperCase() ?? "Д";

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg border bg-card hover:bg-accent transition"
      >
        <span className="w-7 h-7 rounded-md bg-gradient-brand text-white text-xs font-semibold flex items-center justify-center">
          {letter}
        </span>
        <span className="hidden sm:block text-sm text-foreground max-w-[160px] truncate">{email}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-card shadow-card z-40 overflow-hidden">
            <div className="px-3 py-3 border-b">
              <div className="text-sm font-medium text-foreground truncate">{email}</div>
              <div className="text-[11px] text-muted-foreground">Демо-аккаунт</div>
            </div>
            <Link to="/supplier" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-accent">
              <Building2 className="w-4 h-4 text-muted-foreground" /> Профиль поставщика
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-accent">
              <SettingsIcon className="w-4 h-4 text-muted-foreground" /> Настройки
            </Link>
            <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-risk hover:bg-accent border-t">
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationsBell() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const unread = NOTIFICATION_LOG.filter((n) => n.unread).length;
  const active = path === "/notifications";
  return (
    <Link
      to="/notifications"
      className={`relative h-9 w-9 rounded-lg border flex items-center justify-center transition ${
        active ? "bg-brand/10 border-brand/30 text-brand" : "bg-card hover:bg-accent text-foreground"
      }`}
      aria-label="Уведомления"
    >
      <Bell className="w-4 h-4" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-risk text-white text-[10px] font-semibold flex items-center justify-center">
          {unread}
        </span>
      )}
    </Link>
  );
}

function GlobalSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/tenders", search: { q: q.trim() || undefined } });
      }}
      className="hidden md:block flex-1 max-w-sm"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по тендерам…"
          className="h-9 w-full pl-9 pr-3 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>
    </form>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
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
              <GlobalSearch />
              <div className="flex items-center gap-2">
                <NotificationsBell />
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
      <AiAssistant />
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
