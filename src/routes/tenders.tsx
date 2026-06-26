import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { getSession } from "@/lib/auth";
import { TENDERS, type Tender, type Method } from "@/lib/tenders";
import { AppShell, PageHeader } from "@/components/AppShell";
import { TenderRow } from "@/components/TenderRow";
import { DraftModal, type DraftView } from "@/components/DraftModal";

export const Route = createFileRoute("/tenders")({
  head: () => ({ meta: [{ title: "Лента тендеров · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: TendersPage,
});

const METHODS: (Method | "Все")[] = ["Все", "ЗЦП", "Конкурс", "Аукцион"];

function TendersPage() {
  const [open, setOpen] = useState<DraftView | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "matching" | "rejected">("all");
  const [method, setMethod] = useState<(Method | "Все")>("Все");

  const filtered = useMemo(() => {
    return TENDERS.filter((t) => {
      if (tab === "matching" && !t.matches) return false;
      if (tab === "rejected" && t.matches) return false;
      if (method !== "Все" && t.method !== method) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.announcement.includes(q) ||
        t.region.toLowerCase().includes(q)
      );
    });
  }, [query, tab, method]);

  const openTender = (t: Tender) =>
    setOpen({
      announcement: t.announcement, region: t.region, title: t.title,
      amount: t.amount, cost: t.cost, recommendedPrice: t.recommendedPrice, decision: t.decision,
    });

  return (
    <AppShell>
      <PageHeader
        badge="Мониторинг"
        title="Лента тендеров"
        subtitle="Все обнаруженные лоты с госзакупок. AI помечает подходящие под ваш профиль и отсеивает остальные с указанием причины."
      />

      <div className="rounded-2xl border bg-card p-4 shadow-soft mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию, №, региону…"
              className="h-10 w-full pl-9 pr-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-lg border bg-background">
            {[
              { id: "all", label: "Все" },
              { id: "matching", label: "Подходят" },
              { id: "rejected", label: "Отсеяны" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`h-8 px-3 rounded-md text-xs font-medium transition ${
                  tab === t.id ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-lg border bg-background">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`h-8 px-2.5 rounded-md text-xs font-medium transition ${
                  method === m ? "bg-brand/10 text-brand" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Показано {filtered.length} из {TENDERS.length}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <TenderRow key={t.id} tender={t} onOpen={openTender} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
            Ничего не найдено
          </div>
        )}
      </div>

      {open && <DraftModal item={open} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}
