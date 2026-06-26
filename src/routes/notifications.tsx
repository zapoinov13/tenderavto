import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Send, MessageCircle, Mail, Sparkles, Clock, Activity } from "lucide-react";
import { getSession } from "@/lib/auth";
import { NOTIFICATION_CHANNELS, NOTIFICATION_TRIGGERS, NOTIFICATION_LOG } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Уведомления · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: NotificationsPage,
});

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition shrink-0 ${on ? "bg-success" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

const channelIcon: Record<string, React.ElementType> = { tg: Send, wa: MessageCircle, email: Mail };
const logIcon: Record<string, React.ElementType> = { match: Sparkles, deadline: Clock, status: Activity };

function NotificationsPage() {
  const [channels, setChannels] = useState(NOTIFICATION_CHANNELS);
  const [triggers, setTriggers] = useState(NOTIFICATION_TRIGGERS);

  return (
    <AppShell>
      <PageHeader
        badge="Организация"
        title="Уведомления"
        subtitle="Куда и о чём присылать сигналы. Чем быстрее уведомление — тем больше времени на подачу, а в ЗЦП секунды решают."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3">Каналы доставки</h3>
            <div className="space-y-2">
              {channels.map((c) => {
                const Icon = channelIcon[c.id] ?? Bell;
                return (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-3">
                    <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{c.value}</div>
                    </div>
                    <Toggle
                      on={c.enabled}
                      onClick={() =>
                        setChannels((p) => p.map((x) => (x.id === c.id ? { ...x, enabled: !x.enabled } : x)))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3">Когда уведомлять</h3>
            <div className="space-y-2">
              {triggers.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-3">
                  <span className="text-sm text-foreground flex-1">{t.label}</span>
                  <Toggle
                    on={t.enabled}
                    onClick={() =>
                      setTriggers((p) => p.map((x) => (x.id === t.id ? { ...x, enabled: !x.enabled } : x)))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand" /> Последние уведомления
          </h3>
          <div className="space-y-2">
            {NOTIFICATION_LOG.map((n) => {
              const Icon = logIcon[n.kind] ?? Bell;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-3 ${n.unread ? "bg-brand/5 border-brand/20" : "bg-background"}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{n.title}</span>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">{n.detail}</div>
                    <div className="text-[11px] text-muted-foreground/70 mt-1">{n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
