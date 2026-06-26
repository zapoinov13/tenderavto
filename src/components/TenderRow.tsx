import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sparkles, MapPin, Clock, X, FileSignature, ChevronDown, CheckCircle2, BarChart3,
} from "lucide-react";
import { formatKzt, type Tender } from "@/lib/tenders";
import { MethodBadge, DecisionBadge } from "@/components/badges";
import { matchReasons } from "@/lib/ai";

function ReasonsBlock({ tender }: { tender: Tender }) {
  const reasons = matchReasons(tender);
  return (
    <div className="mt-3 rounded-xl border bg-muted/30 p-3 space-y-1.5 animate-fade-up">
      <div className="text-[11px] font-semibold text-brand uppercase tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Обоснование AI
      </div>
      {reasons.map((r, i) => (
        <div key={i} className="flex items-start gap-2 text-[13px]">
          {r.ok ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
          ) : (
            <X className="w-3.5 h-3.5 text-risk shrink-0 mt-0.5" />
          )}
          <span className="text-foreground/90">{r.text}</span>
        </div>
      ))}
    </div>
  );
}

export function TenderRow({ tender, onOpen }: { tender: Tender; onOpen: (t: Tender) => void }) {
  const [why, setWhy] = useState(false);
  const navigate = useNavigate();

  if (!tender.matches) {
    return (
      <div className="group rounded-xl border bg-card/60 px-5 py-3.5 hover:bg-card transition">
        <div className="flex items-center justify-between gap-4">
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
          <button
            onClick={() => setWhy((v) => !v)}
            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-muted text-muted-foreground border hover:text-foreground"
          >
            <X className="w-3 h-3" /> {tender.rejectReason}
            <ChevronDown className={`w-3 h-3 transition ${why ? "rotate-180" : ""}`} />
          </button>
        </div>
        {why && <ReasonsBlock tender={tender} />}
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
            <span className="text-[11px] text-muted-foreground font-mono">№{tender.announcement}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3" /> {tender.region}
            </span>
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{tender.title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">
            Сумма объявления:{" "}
            <span className="text-foreground font-semibold">{formatKzt(tender.amount)}</span>
          </div>

          {tender.keywords && tender.keywords.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {tender.keywords.map((k) => (
                <span key={k} className="text-[11px] px-2 py-0.5 rounded-md bg-accent text-accent-foreground border">
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
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Рекомендуемая цена</div>
              <div className="font-display text-base font-semibold text-foreground">
                {formatKzt(tender.recommendedPrice)}
              </div>
            </div>
          )}
        </div>
      </div>

      {why && <ReasonsBlock tender={tender} />}

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap pt-3 border-t">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="w-3.5 h-3.5" /> обнаружено {tender.detectedMinutesAgo} мин. назад
          </span>
          <button
            onClick={() => setWhy((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline"
          >
            <Sparkles className="w-3 h-3" /> {why ? "Скрыть обоснование" : "Почему подходит"}
          </button>
          <button
            onClick={() => navigate({ to: "/customer" })}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="w-3 h-3" /> Анализ заказчика
          </button>
        </div>
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
