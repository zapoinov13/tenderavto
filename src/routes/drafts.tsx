import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, MapPin, FileSignature } from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatKzt } from "@/lib/tenders";
import { DRAFTS, type Draft, type DraftStatus } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/badges";
import { DraftModal, type DraftView } from "@/components/DraftModal";

export const Route = createFileRoute("/drafts")({
  head: () => ({ meta: [{ title: "Черновики · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: DraftsPage,
});

const STATUSES: (DraftStatus | "Все")[] = ["Все", "Готов к подписи", "На проверке", "Подписан", "Подан"];

function DraftsPage() {
  const [open, setOpen] = useState<DraftView | null>(null);
  const [status, setStatus] = useState<(DraftStatus | "Все")>("Все");

  const filtered = useMemo(
    () => DRAFTS.filter((d) => status === "Все" || d.status === status),
    [status],
  );

  const count = (s: DraftStatus) => DRAFTS.filter((d) => d.status === s).length;

  const openDraft = (d: Draft) =>
    setOpen({
      announcement: d.announcement, region: d.region, title: d.title,
      amount: d.amount, cost: d.cost, recommendedPrice: d.recommendedPrice, decision: d.decision,
    });

  return (
    <AppShell>
      <PageHeader
        badge="Документы"
        title="Черновики предложений"
        subtitle="AI собирает ценовое предложение по каждому подходящему лоту. Оператор проверяет цену и подписывает ЭЦП — система не подаёт заявку сама."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {([
          { s: "Готов к подписи", tone: "text-brand" },
          { s: "На проверке", tone: "text-warning" },
          { s: "Подписан", tone: "text-success" },
          { s: "Подан", tone: "text-success" },
        ] as const).map((x) => (
          <div key={x.s} className="rounded-xl border bg-card p-4 shadow-soft">
            <div className={`font-display text-2xl font-semibold ${x.tone}`}>{count(x.s)}</div>
            <div className="text-xs text-muted-foreground mt-1">{x.s}</div>
          </div>
        ))}
      </div>

      <div className="inline-flex items-center gap-1 p-1 rounded-lg border bg-card mb-5 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`h-8 px-3 rounded-md text-xs font-medium transition ${
              status === s ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((d) => (
          <div key={d.id} className="rounded-2xl border bg-card p-5 shadow-soft hover:shadow-card transition">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                  <span className="font-mono">№{d.announcement}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.region}</span>
                  <StatusBadge status={d.status} />
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{d.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Цена: <span className="text-foreground font-semibold">{formatKzt(d.recommendedPrice)}</span>
                  </span>
                  <span className="text-muted-foreground">Обновлён: {d.updated}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {d.status !== "Подан" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-warning">
                    <Clock className="w-3 h-3" /> до подачи {d.deadlineHours} ч
                  </span>
                )}
                <button
                  onClick={() => openDraft(d)}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-soft"
                >
                  <FileSignature className="w-4 h-4" /> Открыть
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
            Нет черновиков в этом статусе
          </div>
        )}
      </div>

      {open && <DraftModal item={open} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}
