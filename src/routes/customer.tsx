import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Trophy, TrendingDown, Users, ShoppingCart, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatKzt } from "@/lib/tenders";
import { CUSTOMER } from "@/lib/ai";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/customer")({
  head: () => ({ meta: [{ title: "Анализ заказчика · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: CustomerPage,
});

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg border bg-brand/10 text-brand border-brand/20 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 font-display text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function CustomerPage() {
  return (
    <AppShell>
      <Link to="/tenders" className="inline-flex items-center gap-1 text-sm text-brand hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> К ленте тендеров
      </Link>

      <PageHeader badge="AI-аналитика" title="Анализ заказчика" />

      <div className="rounded-2xl border bg-card p-6 shadow-soft mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow shrink-0">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">{CUSTOMER.name}</h2>
          <div className="text-sm text-muted-foreground font-mono mt-0.5">БИН {CUSTOMER.bin}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={ShoppingCart} label="Закупок за год" value={String(CUSTOMER.stats.purchasesYear)} />
        <Stat icon={Building2} label="Средний бюджет" value={formatKzt(CUSTOMER.stats.avgBudget)} />
        <Stat icon={TrendingDown} label="Среднее снижение" value={`${CUSTOMER.stats.avgDrop}%`} />
        <Stat icon={Users} label="Среднее число участников" value={String(CUSTOMER.stats.avgParticipants)} />
      </div>

      <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-5 flex gap-3">
        <Sparkles className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div>
          <div className="text-[11px] font-semibold text-brand uppercase tracking-wider mb-1">Вывод AI</div>
          <p className="text-sm text-foreground/90 leading-relaxed">{CUSTOMER.verdict}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-success" /> Частые победители
          </h3>
          <div className="space-y-2">
            {CUSTOMER.topWinners.map((w) => (
              <div key={w.name} className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2.5">
                <span className="text-sm text-foreground">{w.name}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {w.wins} побед · снижение {w.avgDrop}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-3">Последние закупки</h3>
          <div className="space-y-2">
            {CUSTOMER.recent.map((r, i) => (
              <div key={i} className="rounded-lg border bg-background px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground line-clamp-1">{r.title}</span>
                  <span className="font-display font-semibold text-foreground shrink-0">{formatKzt(r.amount)}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {r.date} · {r.winner} · снижение {r.drop}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
