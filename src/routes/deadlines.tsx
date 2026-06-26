import { createFileRoute, redirect } from "@tanstack/react-router";
import { Calendar, Clock, Flame, MapPin } from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatKzt } from "@/lib/tenders";
import { DEADLINES, type Deadline } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/badges";

export const Route = createFileRoute("/deadlines")({
  head: () => ({ meta: [{ title: "Дедлайны · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: DeadlinesPage,
});

function fmtLeft(h: number): string {
  if (h < 24) return `${h} ч`;
  const d = Math.floor(h / 24);
  const r = h % 24;
  return r ? `${d} дн ${r} ч` : `${d} дн`;
}

function urgency(h: number): { label: string; cls: string; hot: boolean } {
  if (h < 12) return { label: "горит", cls: "text-risk border-risk/30 bg-risk/5", hot: true };
  if (h < 24) return { label: "сегодня", cls: "text-warning border-warning/30 bg-warning/5", hot: false };
  return { label: "в графике", cls: "text-brand border-brand/20 bg-brand/5", hot: false };
}

function Stat({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className={`font-display text-3xl font-semibold ${cls}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Row({ d }: { d: Deadline }) {
  const u = urgency(d.hoursLeft);
  return (
    <div className={`rounded-2xl border bg-card p-5 shadow-soft border-l-4 ${u.hot ? "border-l-risk" : d.hoursLeft < 24 ? "border-l-warning" : "border-l-brand/40"}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
            <span className="font-mono">№{d.announcement}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.region}</span>
            <StatusBadge status={d.status} />
          </div>
          <h3 className="mt-2 font-display text-base font-semibold text-foreground">{d.title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">{formatKzt(d.amount)}</div>
        </div>
        <div className="text-right shrink-0">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${u.cls}`}>
            {u.hot ? <Flame className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {u.label}
          </span>
          <div className="mt-2 font-display text-lg font-semibold text-foreground">{fmtLeft(d.hoursLeft)}</div>
          <div className="text-[11px] text-muted-foreground">до окончания подачи</div>
        </div>
      </div>
    </div>
  );
}

function DeadlinesPage() {
  const sorted = [...DEADLINES].sort((a, b) => a.hoursLeft - b.hoursLeft);
  const hot = DEADLINES.filter((d) => d.hoursLeft < 12).length;
  const today = DEADLINES.filter((d) => d.hoursLeft >= 12 && d.hoursLeft < 24).length;
  const planned = DEADLINES.filter((d) => d.hoursLeft >= 24).length;

  return (
    <AppShell>
      <PageHeader
        badge="Сроки"
        title="Календарь дедлайнов"
        subtitle="Сроки подачи по активным заявкам, отсортированные по срочности. Красное «горит» — меньше 12 часов до окончания приёма."
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Горит (< 12 ч)" value={hot} cls="text-risk" />
        <Stat label="Сегодня (< 24 ч)" value={today} cls="text-warning" />
        <Stat label="В графике" value={planned} cls="text-brand" />
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" /> Ближайшие сроки подачи
      </div>

      <div className="space-y-3">
        {sorted.map((d) => (
          <Row key={d.id} d={d} />
        ))}
      </div>
    </AppShell>
  );
}
