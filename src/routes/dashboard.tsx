import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  FileSignature,
  Building2,
} from "lucide-react";
import { getSession, signOut } from "@/lib/auth";
import { METRICS, TENDERS, formatKzt, type Tender } from "@/lib/tenders";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Дашборд · QazTender AI" }],
  }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/" });
    }
  },
  component: DashboardRoute,
});

function MethodBadge({ method }: { method: Tender["method"] }) {
  const map = {
    "ЗЦП": "bg-brand/10 text-brand border-brand/20",
    "Конкурс": "bg-muted text-muted-foreground border-border",
    "Аукцион": "bg-muted text-muted-foreground border-border",
  } as const;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide border ${map[method]}`}
    >
      {method}
    </span>
  );
}

function DecisionBadge({ decision }: { decision: NonNullable<Tender["decision"]> }) {
  const map = {
    "УЧАСТВОВАТЬ": "bg-success/10 text-success border-success/20",
    "НЕ ВЫГОДНО": "bg-risk/10 text-risk border-risk/20",
    "НА ГРАНИ": "bg-warning/10 text-warning border-warning/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border ${map[decision]}`}
    >
      {decision === "УЧАСТВОВАТЬ" && <CheckCircle2 className="w-3 h-3" />}
      {decision === "НЕ ВЫГОДНО" && <ShieldAlert className="w-3 h-3" />}
      {decision}
    </span>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "default",
  icon: Icon,
  featured,
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "brand";
  icon: React.ElementType;
  featured?: boolean;
}) {
  const toneAccent =
    tone === "success"
      ? "text-success bg-success/10 border-success/20"
      : tone === "warning"
      ? "text-warning bg-warning/10 border-warning/20"
      : tone === "brand"
      ? "text-brand bg-brand/10 border-brand/20"
      : "text-primary bg-primary/5 border-primary/10";

  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary text-white p-6 shadow-card">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-medium">
              {label}
            </span>
            <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-4 font-display text-4xl font-semibold tracking-tight">
            {value}
          </div>
          {hint && <div className="mt-1 text-xs text-white/60">{hint}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border p-5 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${toneAccent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function TenderRow({ tender, onOpen }: { tender: Tender; onOpen: (t: Tender) => void }) {
  if (!tender.matches) {
    return (
      <div className="group rounded-xl border bg-card/60 px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-card transition">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
            <span className="font-mono">№{tender.announcement}</span>
            <MethodBadge method={tender.method} />
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {tender.region}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {tender.title} · {formatKzt(tender.amount)}
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-muted text-muted-foreground border">
          <X className="w-3 h-3" /> {tender.rejectReason}
        </span>
      </div>
    );
  }

  const accent =
    tender.decision === "НЕ ВЫГОДНО"
      ? "before:bg-risk"
      : tender.decision === "НА ГРАНИ"
      ? "before:bg-warning"
      : "before:bg-success";

  return (
    <div
      className={`relative rounded-2xl bg-card border p-5 shadow-soft hover:shadow-card transition-all
        before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:rounded-r-full ${accent}`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-success/10 text-success border border-success/20">
              <Sparkles className="w-3 h-3" /> ПОДХОДИТ
            </span>
            <MethodBadge method={tender.method} />
            <span className="text-[11px] text-muted-foreground font-mono">
              №{tender.announcement}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3" /> {tender.region}
            </span>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
            {tender.title}
          </h3>
          <div className="mt-1 text-sm text-muted-foreground">
            Сумма объявления:{" "}
            <span className="text-foreground font-semibold">{formatKzt(tender.amount)}</span>
          </div>

          {tender.keywords && tender.keywords.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {tender.keywords.map((k) => (
                <span
                  key={k}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-accent text-accent-foreground border"
                >
                  #{k}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {tender.decision && <DecisionBadge decision={tender.decision} />}
          {tender.recommendedPrice && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Рекомендуемая цена
              </div>
              <div className="font-display text-base font-semibold text-foreground">
                {formatKzt(tender.recommendedPrice)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap pt-3 border-t">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          обнаружено {tender.detectedMinutesAgo} мин. назад
        </span>
        <button
          onClick={() => onOpen(tender)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-soft"
        >
          <FileSignature className="w-4 h-4" /> Открыть черновик
        </button>
      </div>
    </div>
  );
}

function DraftModal({ tender, onClose }: { tender: Tender; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const decision = tender.decision ?? "НА ГРАНИ";
  const supplier = tender.supplier ?? { name: "—", bin: "—" };
  const margin =
    tender.cost && tender.recommendedPrice
      ? Math.round(((tender.recommendedPrice - tender.cost) / tender.cost) * 100)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-2xl shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-start justify-between gap-4 bg-gradient-surface rounded-t-2xl">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
              №{tender.announcement} · {tender.region}
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold text-foreground">
              Черновик ценового предложения
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{tender.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Расчёт цены
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3 border">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Потолок
                </div>
                <div className="mt-1 font-display font-semibold text-foreground">
                  {formatKzt(tender.amount)}
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 border">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Себестоимость
                </div>
                <div className="mt-1 font-display font-semibold text-foreground">
                  {tender.cost ? formatKzt(tender.cost) : "—"}
                </div>
              </div>
              <div className="bg-brand/5 border border-brand/30 rounded-xl p-3">
                <div className="text-[11px] text-brand uppercase tracking-wider font-medium">
                  Рекомендуемая цена
                </div>
                <div className="mt-1 font-display font-semibold text-foreground">
                  {tender.recommendedPrice ? formatKzt(tender.recommendedPrice) : "—"}
                </div>
                {margin !== null && (
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    маржа ≈ {margin}%
                  </div>
                )}
              </div>
              <div className="rounded-xl p-3 border flex flex-col justify-center items-start gap-1.5">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Решение AI
                </div>
                <DecisionBadge decision={decision} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Поставщик
            </h3>
            <div className="mt-3 bg-muted/50 rounded-xl p-4 border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand border border-brand/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{supplier.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                  БИН {supplier.bin}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Чек-лист документов
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                "Ценовое предложение, подписанное ЭЦП",
                "Подтверждение квалификации",
                "Справка об отсутствии налоговой задолженности",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm rounded-lg border bg-card px-3 py-2.5"
                >
                  <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded border-2 border-border bg-background shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-foreground flex gap-3">
            <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-warning">Внимание.</span> Цену и подпись
              подтверждает оператор — это рекомендация, а не автоматическая подача.
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex items-center justify-end gap-3 bg-muted/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg border bg-background hover:bg-accent text-sm font-medium"
          >
            Закрыть
          </button>
          <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium shadow-soft">
            <FileSignature className="w-4 h-4" />
            Подписать ЭЦП и подать
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveIndicator() {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
      <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-success" />
      <span className="text-xs font-semibold text-success tracking-wide">
        LIVE · мониторинг каждые 20 сек
      </span>
    </div>
  );
}

function DashboardRoute() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="bg-background">
          <Dashboard />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<Tender | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "matching" | "rejected">("all");

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  const filtered = useMemo(() => {
    return TENDERS.filter((t) => {
      if (tab === "matching" && !t.matches) return false;
      if (tab === "rejected" && t.matches) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.announcement.includes(q) ||
        t.region.toLowerCase().includes(q)
      );
    });
  }, [query, tab]);

  return (
    <div>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger />
            <div className="hidden md:block">
              <LiveIndicator />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по тендерам…"
                className="h-9 w-64 pl-9 pr-3 rounded-lg border bg-card text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
            <button
              onClick={handleSignOut}
              className="h-9 px-3 rounded-lg border bg-card hover:bg-accent text-sm font-medium text-foreground"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto">
        <div className="md:hidden mb-4">
          <LiveIndicator />
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> AI-ассистент
            </div>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Дашборд госзакупок
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Способ «Запрос ценовых предложений» — где секунды решают. AI отбирает лоты под
              ваш профиль и готовит черновик предложения.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            featured
            label="Проверено лотов"
            value={METRICS.checked}
            hint="за последние 30 минут"
            icon={TrendingUp}
          />
          <MetricCard
            label="Подходят под профиль"
            value={METRICS.matching}
            hint="прошли AI-фильтр"
            tone="brand"
            icon={Sparkles}
          />
          <MetricCard
            label="К участию"
            value={METRICS.recommended}
            hint="маржа выше 10%"
            tone="success"
            icon={CheckCircle2}
          />
          <MetricCard
            label="С риском"
            value={METRICS.risky}
            hint="требуют решения"
            tone="warning"
            icon={ShieldAlert}
          />
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Лента тендеров
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Обновлено только что · {filtered.length} из {TENDERS.length}
              </p>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-lg border bg-card">
              {[
                { id: "all", label: "Все" },
                { id: "matching", label: "Подходят" },
                { id: "rejected", label: "Отсеяны" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`h-8 px-3 rounded-md text-xs font-medium transition ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <div className="w-px h-5 bg-border mx-1" />
              <button className="h-8 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Фильтры
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((t) => (
              <TenderRow key={t.id} tender={t} onOpen={setOpen} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
                Ничего не найдено
              </div>
            )}
          </div>
        </section>
      </main>

      {open && <DraftModal tender={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
