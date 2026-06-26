import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  FileCheck2,
  Settings,
  Building2,
  BarChart3,
  Users,
  Bell,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth";

const mainItems = [
  { title: "Дашборд", url: "/dashboard", icon: LayoutDashboard },
  { title: "Лента тендеров", url: "/tenders", icon: ListChecks },
  { title: "Черновики", url: "/drafts", icon: FileText },
  { title: "Проверка документов", url: "/documents", icon: FileCheck2 },
  { title: "Аналитика", url: "/analytics", icon: BarChart3 },
  { title: "Конкуренты", url: "/competitors", icon: Users },
];

const orgItems = [
  { title: "Поставщик", url: "/supplier", icon: Building2 },
  { title: "Уведомления", url: "/notifications", icon: Bell },
  { title: "Настройки", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) => currentPath === path;

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow">
            <span className="font-display font-bold text-white text-sm">QT</span>
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-semibold text-sidebar-foreground tracking-tight">
                QazTender <span className="text-sidebar-primary">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
                Госзакупки РК
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-wider">
            Основное
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-wider">
            Организация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {orgItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/support")} tooltip="Поддержка">
              <Link to="/support" className="gap-3">
                <LifeBuoy className="h-4 w-4" />
                <span>Поддержка</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Выйти">
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="mx-2 mb-2 mt-1 rounded-lg bg-sidebar-accent/60 px-3 py-2.5 text-[11px] text-sidebar-foreground/70">
            <div className="font-medium text-sidebar-foreground">Демо-режим</div>
            <div className="mt-0.5">Данные имитируют реальный поток ЗЦП.</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
