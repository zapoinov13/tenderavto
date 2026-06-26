import { createFileRoute, redirect } from "@tanstack/react-router";
import { Users, Trophy, TrendingDown, Target, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { COMPETITORS, COMPETITOR_SUMMARY, type Threat } from "@/lib/ai";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/competitors")({
  head: () => ({ meta: [{ title: "Анализ конкурентов · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: CompetitorsPage,
});

function threatMeta(t: Threat): { cls: string; label: string } {
  if (t === "high") return { cls: "bg-risk/10 text-risk border-risk/20", label: "высокая угроза" };
  if (t === "medium") return { cls: "bg-warning/10 text-warning border-warning/20", label: "средняя угроза" };
  return { cls: "bg-muted text-muted-foreground border-border", label: "слабая угроза" };
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg border bg-brand/10 text-brand border-brand/20 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 font-display text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function CompetitorsPage() {
  return (
    <AppShell>
      <PageHeader
        badge="AI-аналитика"
        title="Анализ конкурентов"
        subtitle="Кто регулярно выигрывает в вашей нише, с каким снижением цены и где пересекается с вами. AI подсказывает, с кем реально бороться."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat icon={Users} label="Отслеживается" value={`${COMPETITOR_SUMMARY.tracked} конкурента`} />
        <Stat icon={Trophy} label="Самый активный" value={COMPETITOR_SUMMARY.mostActive} />
        <Stat icon={Target} label="Среднее поле" value={`${COMPETITOR_SUMMARY.avgFieldSize} участника`} />
      </div>

      <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-5 flex gap-3">
        <Sparkles className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div>
          <div className="text-[11px] font-semibold text-brand uppercase tracking-wider mb-1">Вывод AI</div>
          <p className="text-sm text-foreground/90 leading-relaxed">{COMPETITOR_SUMMARY.verdict}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {COMPETITORS.map((c) => {
          const tm = threatMeta(c.threat);
          return (
            <div key={c.name} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground">{c.name}</h3>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{c.vsYou}</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${tm.cls}`}>
                  {tm.label}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Win-rate</div>
                  <div className="mt-1 font-display font-semibold text-foreground">{c.winRate}%</div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-brand rounded-full" style={{ width: `${c.winRate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Побед</div>
                  <div className="mt-1 font-display font-semibold text-foreground">{c.wins} из {c.participations}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Сред. снижение</div>
                  <div className="mt-1 font-display font-semibold text-foreground inline-flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-warning" /> {c.avgDrop}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Участий</div>
                  <div className="mt-1 font-display font-semibold text-foreground">{c.participations}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
