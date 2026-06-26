import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, signOut } from "@/lib/auth";
import { METRICS, TENDERS, formatKzt, type Tender } from "@/lib/tenders";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Дашборд · ТендерАвто" }],
  }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) {
      throw redirect({ to: "/" });
    }
  },
  component: Dashboard,
});

function Logo() {
  return (
    <div className="text-xl font-semibold tracking-tight">
      <span className="text-primary">Тендер</span>
      <span className="text-brand">Авто</span>
    </div>
  );
}

function MethodBadge({ method }: { method: Tender["method"] }) {
  const map = {
    "ЗЦП": "bg-brand/10 text-brand border-brand/20",
    "Конкурс": "bg-muted text-muted-foreground border-border",
    "Аукцион": "bg-muted text-muted-foreground border-border",
  } as const;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${map[method]}`}>
      {method}
    </span>
  );
}

function DecisionBadge({ decision }: { decision: NonNullable<Tender["decision"]> }) {
  const map = {
    "УЧАСТВОВАТЬ": "bg-success text-success-foreground",
    "НЕ ВЫГОДНО": "bg-risk text-risk-foreground",
    "НА ГРАНИ": "bg-warning text-warning-foreground",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${map[decision]}`}>
      {decision}
    </span>
  );
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "warning";
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="bg-card border rounded-xl p-5 shadow-soft">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

function TenderCard({ tender, onOpen }: { tender: Tender; onOpen: (t: Tender) => void }) {
  if (!tender.matches) {
    return (
      <div className="bg-card border rounded-xl p-4 opacity-70">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono">№{tender.announcement}</span>
              <MethodBadge method={tender.method} />
              <span className="text-xs text-muted-foreground">· {tender.region}</span>
            </div>
            <h3 className="mt-1.5 text-base font-medium text-foreground truncate">{tender.title}</h3>
            <div className="mt-1 text-sm text-muted-foreground">{formatKzt(tender.amount)}</div>
          </div>
          <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground border">
            Отсеяно: {tender.rejectReason}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-5 shadow-soft border-l-4 border-l-success">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-success/10 text-success border border-success/20">
              ПОДХОДИТ
            </span>
            <MethodBadge method={tender.method} />
            <span className="text-xs text-muted-foreground font-mono">№{tender.announcement}</span>
            <span className="text-xs text-muted-foreground">· {tender.region}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">{tender.title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">
            Сумма объявления: <span className="text-foreground font-medium">{formatKzt(tender.amount)}</span>
          </div>

          {tender.keywords && tender.keywords.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">Ключевые слова:</span>
              {tender.keywords.map((k) => (
                <span key={k} className="text-xs px-2 py-0.5 rounded-md bg-accent text-accent-foreground border">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {tender.decision && <DecisionBadge decision={tender.decision} />}
          {tender.recommendedPrice && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Рекомендуемая цена</div>
              <div className="text-sm font-semibold text-foreground">{formatKzt(tender.recommendedPrice)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap pt-3 border-t">
        <span className="text-xs text-muted-foreground">
          ⏱ обнаружено {tender.detectedMinutesAgo} минут назад
        </span>
        <button
          onClick={() => onOpen(tender)}
          className="inline-flex items-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
        >
          Открыть черновик
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border rounded-2xl shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground font-mono">№{tender.announcement} · {tender.region}</div>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Черновик ценового предложения</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{tender.title}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Расчёт цены */}
          <section>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Расчёт цены</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Потолок / объявлено</div>
                <div className="mt-1 font-semibold text-foreground">{formatKzt(tender.amount)}</div>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Себестоимость</div>
                <div className="mt-1 font-semibold text-foreground">{tender.cost ? formatKzt(tender.cost) : "—"}</div>
              </div>
              <div className="bg-brand/5 border border-brand/20 rounded-lg p-3">
                <div className="text-xs text-brand">Рекомендуемая цена</div>
                <div className="mt-1 font-semibold text-foreground">
                  {tender.recommendedPrice ? formatKzt(tender.recommendedPrice) : "—"}
                </div>
              </div>
              <div className="rounded-lg p-3 flex flex-col justify-center items-start gap-1.5"
                style={{ background: "color-mix(in oklab, var(--color-card) 100%, transparent)" }}
              >
                <div className="text-xs text-muted-foreground">Решение</div>
                <DecisionBadge decision={decision} />
              </div>
            </div>
          </section>

          {/* Поставщик */}
          <section>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Поставщик</h3>
            <div className="mt-3 bg-muted/40 rounded-lg p-4">
              <div className="font-medium text-foreground">{supplier.name}</div>
              <div className="text-sm text-muted-foreground mt-0.5">БИН {supplier.bin}</div>
            </div>
          </section>

          {/* Чек-лист */}
          <section>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Чек-лист документов</h3>
            <ul className="mt-3 space-y-2">
              {[
                "Ценовое предложение, подписанное ЭЦП",
                "Подтверждение квалификации",
                "Справка об отсутствии налоговой задолженности",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md border-2 border-border bg-background shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 text-sm text-foreground">
            <span className="font-medium text-warning">Внимание.</span> Цену и подпись подтверждает оператор — это рекомендация, а не автоматическая подача.
          </div>
        </div>

        <div className="p-6 border-t flex items-center justify-end gap-3 bg-muted/30">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border bg-background hover:bg-accent text-sm font-medium">
            Закрыть
          </button>
          <button className="h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
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
      <span className="text-xs font-medium text-success">LIVE · мониторинг каждые 20 сек</span>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<Tender | null>(null);

  function handleSignOut() {
    signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo />
          <div className="hidden md:block">
            <LiveIndicator />
          </div>
          <button
            onClick={handleSignOut}
            className="h-9 px-3 rounded-lg border bg-background hover:bg-accent text-sm font-medium text-foreground"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="md:hidden mb-4"><LiveIndicator /></div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            AI-ассистент по госзакупкам
          </h1>
          <p className="mt-2 text-muted-foreground">
            Госзакупки РК · способ «Запрос ценовых предложений» (ЗЦП) — где секунды решают.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Проверено лотов" value={METRICS.checked} />
          <MetricCard label="Подходят под профиль" value={METRICS.matching} tone="success" />
          <MetricCard label="Рекомендовано участвовать" value={METRICS.recommended} tone="success" />
          <MetricCard label="Отмечены риском" value={METRICS.risky} tone="warning" />
        </div>

        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Лента тендеров</h2>
            <span className="text-xs text-muted-foreground">Обновлено только что</span>
          </div>
          <div className="space-y-3">
            {TENDERS.map((t) => (
              <TenderCard key={t.id} tender={t} onOpen={setOpen} />
            ))}
          </div>
        </section>
      </main>

      {open && <DraftModal tender={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
