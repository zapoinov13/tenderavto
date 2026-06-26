import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, FileText, Clock,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { METRICS, TENDERS, formatKzt, type Tender } from "@/lib/tenders";
import { DRAFTS } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";
import { TenderRow } from "@/components/TenderRow";
import { DraftModal, type DraftView } from "@/components/DraftModal";
import { StatusBadge } from "@/components/badges";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Дашборд · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: DashboardPage,
});

function MetricCard({
  label, value, hint, tone = "default", icon: Icon, featured,
}: {
  label: string; value: number; hint?: string;
  tone?: "default" | "success" | "warning" | "brand"; icon: React.ElementType; featured?: boolean;
}) {
  const toneAccent =
    tone === "success" ? "text-success bg-success/10 border-success/20"
    : tone === "warning" ? "text-warning bg-warning/10 border-warning/20"
    : tone === "brand" ? "text-brand bg-brand/10 border-brand/20"
    : "text-primary bg-primary/5 border-primary/10";

  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary text-white p-6 shadow-card">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-medium">{label}</span>
            <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-4 font-display text-4xl font-semibold tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-xs text-white/60">{hint}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-card border p-5 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${toneAccent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function DashboardPage() {
  const [open, setOpen] = useState<DraftView | null>(null);
  const matching = TENDERS.filter((t) => t.matches).slice(0, 4);
  const readyDrafts = DRAFTS.filter(
    (d) => d.status === "Готов к подписи" || d.status === "На проверке",
  );

  const openTender = (t: Tender) =>
    setOpen({
      announcement: t.announcement, region: t.region, title: t.title,
      amount: t.amount, cost: t.cost, recommendedPrice: t.recommendedPrice, decision: t.decision,
    });

  return (
    <AppShell>
      <PageHeader
        badge="AI-ассистент"
        title="Дашборд госзакупок"
        subtitle="Способ «Запрос ценовых предложений» — где секунды решают. AI отбирает лоты под ваш профиль и готовит черновик предложения."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard featured label="Проверено лотов" value={METRICS.checked} hint="за последние 30 минут" icon={TrendingUp} />
        <MetricCard label="Подходят под профиль" value={METRICS.matching} hint="прошли AI-фильтр" tone="brand" icon={Sparkles} />
        <MetricCard label="К участию" value={METRICS.recommended} hint="маржа выше 10%" tone="success" icon={CheckCircle2} />
        <MetricCard label="С риском" value={METRICS.risky} hint="требуют решения" tone="warning" icon={ShieldAlert} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Подходящие лоты</h2>
            <Link to="/tenders" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              Вся лента <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {matching.map((t) => (
              <TenderRow key={t.id} tender={t} onOpen={openTender} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Черновики</h2>
            <Link to="/drafts" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              Все <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {readyDrafts.map((d) => (
              <div key={d.id} className="rounded-xl border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">№{d.announcement}</span>
                  <StatusBadge status={d.status} />
                </div>
                <div className="mt-2 text-sm font-medium text-foreground line-clamp-2">{d.title}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display font-semibold text-foreground">{formatKzt(d.recommendedPrice)}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-warning">
                    <Clock className="w-3 h-3" /> {d.deadlineHours} ч
                  </span>
                </div>
              </div>
            ))}
            <Link
              to="/drafts"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition"
            >
              <FileText className="w-4 h-4" /> Открыть все черновики
            </Link>
          </div>
        </section>
      </div>

      {open && <DraftModal item={open} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}
