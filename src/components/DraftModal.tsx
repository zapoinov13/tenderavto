import { useEffect, useState } from "react";
import { X, Building2, ShieldAlert, FileSignature, Sparkles, CheckCircle2, Printer } from "lucide-react";
import { formatKzt, type Decision } from "@/lib/tenders";
import { DecisionBadge } from "@/components/badges";
import { SUPPLIER_PROFILE } from "@/lib/app-data";
import { proposalText, participationVerdict } from "@/lib/ai";

export interface DraftView {
  announcement: string;
  region: string;
  title: string;
  amount: number;
  cost?: number;
  recommendedPrice?: number;
  decision?: Decision;
}

export function DraftModal({ item, onClose }: { item: DraftView; onClose: () => void }) {
  const [signed, setSigned] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const decision: Decision = item.decision ?? "НА ГРАНИ";
  const verdict = participationVerdict({
    amount: item.amount, cost: item.cost, recommendedPrice: item.recommendedPrice, decision: item.decision,
  });
  const verdictCls =
    verdict.level === "УЧАСТВОВАТЬ"
      ? "border-success/30 bg-success/5"
      : verdict.level === "ОСТОРОЖНО"
      ? "border-warning/30 bg-warning/5"
      : "border-risk/30 bg-risk/5";
  const verdictText =
    verdict.level === "УЧАСТВОВАТЬ" ? "text-success" : verdict.level === "ОСТОРОЖНО" ? "text-warning" : "text-risk";
  const proposal = proposalText({
    title: item.title, announcement: item.announcement, region: item.region,
    recommendedPrice: item.recommendedPrice, supplierName: SUPPLIER_PROFILE.name,
  });
  function printDraft() {
    if (typeof window === "undefined") return;
    const w = window.open("", "_blank", "width=820,height=920");
    if (!w) return;
    const f = (n?: number) => (n ? new Intl.NumberFormat("ru-RU").format(n) + " \u20B8" : "\u2014");
    w.document.write(
      "<html><head><meta charset='utf-8'><title>\u0426\u0435\u043D\u043E\u0432\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 " + item.announcement + "</title>" +
      "<style>body{font-family:Arial,sans-serif;color:#16202E;max-width:720px;margin:32px auto;padding:0 24px;line-height:1.5}h1{color:#1F3A5F;font-size:20px;margin-bottom:4px}h2{color:#2E6DA4;font-size:13px;text-transform:uppercase;margin-top:22px;border-bottom:1px solid #eee;padding-bottom:4px}.kv{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f3f3f3;font-size:14px}p{font-size:14px}.muted{color:#667}</style></head><body>" +
      "<h1>\u0426\u0435\u043D\u043E\u0432\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435</h1>" +
      "<p class='muted'>\u2116 " + item.announcement + " \u00B7 " + item.region + " \u00B7 " + item.title + "</p>" +
      "<h2>\u0420\u0430\u0441\u0447\u0451\u0442 \u0446\u0435\u043D\u044B</h2>" +
      "<div class='kv'><span>\u041F\u043E\u0442\u043E\u043B\u043E\u043A</span><b>" + f(item.amount) + "</b></div>" +
      "<div class='kv'><span>\u0421\u0435\u0431\u0435\u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</span><b>" + f(item.cost) + "</b></div>" +
      "<div class='kv'><span>\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u0430\u044F \u0446\u0435\u043D\u0430</span><b>" + f(item.recommendedPrice) + "</b></div>" +
      "<div class='kv'><span>\u0420\u0435\u0448\u0435\u043D\u0438\u0435 AI</span><b>" + verdict.level + "</b></div>" +
      "<h2>\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435</h2><p>" + proposal.tech + "</p>" +
      "<h2>\u041A\u043E\u043C\u043C\u0435\u0440\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435</h2><p>" + proposal.commercial + "</p>" +
      "<h2>\u041F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A</h2>" +
      "<div class='kv'><span>\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F</span><b>" + SUPPLIER_PROFILE.name + "</b></div>" +
      "<div class='kv'><span>\u0411\u0418\u041D</span><b>" + SUPPLIER_PROFILE.bin + "</b></div>" +
      "</body></html>"
    );
    w.document.close();
    w.focus();
    w.print();
  }
  const margin =
    item.cost && item.recommendedPrice
      ? Math.round(((item.recommendedPrice - item.cost) / item.cost) * 100)
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
              №{item.announcement} · {item.region}
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold text-foreground">
              Черновик ценового предложения
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{item.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section className={`rounded-xl border p-4 ${verdictCls}`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${verdictText}`} />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Рекомендация AI: стоит ли участвовать
              </span>
            </div>
            <div className={`mt-2 font-display text-lg font-semibold ${verdictText}`}>{verdict.level}</div>
            <p className="mt-1 text-sm text-foreground/90">{verdict.summary}</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] font-medium text-success mb-1">За участие</div>
                <ul className="space-y-1">
                  {verdict.pros.map((x) => (
                    <li key={x} className="flex items-start gap-1.5 text-[13px] text-foreground/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-medium text-warning mb-1">Риски и нюансы</div>
                <ul className="space-y-1">
                  {verdict.cons.map((x) => (
                    <li key={x} className="flex items-start gap-1.5 text-[13px] text-foreground/90">
                      <ShieldAlert className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Расчёт цены
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3 border">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Потолок</div>
                <div className="mt-1 font-display font-semibold text-foreground">{formatKzt(item.amount)}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 border">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Себестоимость</div>
                <div className="mt-1 font-display font-semibold text-foreground">
                  {item.cost ? formatKzt(item.cost) : "—"}
                </div>
              </div>
              <div className="bg-brand/5 border border-brand/30 rounded-xl p-3">
                <div className="text-[11px] text-brand uppercase tracking-wider font-medium">Рекомендуемая цена</div>
                <div className="mt-1 font-display font-semibold text-foreground">
                  {item.recommendedPrice ? formatKzt(item.recommendedPrice) : "—"}
                </div>
                {margin !== null && (
                  <div className="text-[11px] text-muted-foreground mt-0.5">маржа ≈ {margin}%</div>
                )}
              </div>
              <div className="rounded-xl p-3 border flex flex-col justify-center items-start gap-1.5">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Решение AI</div>
                <DecisionBadge decision={decision} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Поставщик</h3>
            <div className="mt-3 bg-muted/50 rounded-xl p-4 border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand border border-brand/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{SUPPLIER_PROFILE.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-mono">БИН {SUPPLIER_PROFILE.bin}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand" /> Предложение (черновик AI)
            </h3>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border bg-muted/40 p-3">
                <div className="text-[11px] text-brand font-medium mb-1">Техническое предложение</div>
                <p className="text-[13px] text-foreground/90 leading-relaxed">{proposal.tech}</p>
              </div>
              <div className="rounded-xl border bg-muted/40 p-3">
                <div className="text-[11px] text-brand font-medium mb-1">Коммерческое предложение</div>
                <p className="text-[13px] text-foreground/90 leading-relaxed">{proposal.commercial}</p>
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
              ].map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm rounded-lg border bg-card px-3 py-2.5">
                  <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded border-2 border-border bg-background shrink-0" />
                  <span className="text-foreground">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-foreground flex gap-3">
            <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-warning">Внимание.</span> Цену и подпись подтверждает
              оператор — это рекомендация, а не автоматическая подача.
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex items-center justify-between gap-3 bg-muted/30 rounded-b-2xl">
          {signed ? (
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <CheckCircle2 className="w-5 h-5" /> Заявка подписана ЭЦП и подана (демо)
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              Подпись выполняется через NCALayer ключом вашей компании
            </span>
          )}
          <div className="flex items-center gap-3">
            <button onClick={printDraft} className="h-10 px-4 rounded-lg border bg-background hover:bg-accent text-sm font-medium inline-flex items-center gap-1.5">
              <Printer className="w-4 h-4" /> PDF
            </button>
            <button onClick={onClose} className="h-10 px-4 rounded-lg border bg-background hover:bg-accent text-sm font-medium">
              Закрыть
            </button>
            {!signed && (
              <button
                onClick={() => setSigned(true)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium shadow-soft"
              >
                <FileSignature className="w-4 h-4" /> Подписать ЭЦП и подать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
