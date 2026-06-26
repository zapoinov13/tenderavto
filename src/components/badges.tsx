import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { Tender } from "@/lib/tenders";

export function MethodBadge({ method }: { method: Tender["method"] }) {
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

export function DecisionBadge({ decision }: { decision: NonNullable<Tender["decision"]> }) {
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

export function LiveIndicator() {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
      <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-success" />
      <span className="text-xs font-semibold text-success tracking-wide">
        LIVE · мониторинг каждые 20 сек
      </span>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Готов к подписи": "bg-brand/10 text-brand border-brand/20",
    "На проверке": "bg-warning/10 text-warning border-warning/20",
    "Подписан": "bg-success/10 text-success border-success/20",
    "Подан": "bg-success/15 text-success border-success/30",
    "Черновик": "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {status}
    </span>
  );
}
