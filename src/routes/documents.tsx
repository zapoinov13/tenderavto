// route: /documents — AI-проверка пакета документов
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, XCircle, Sparkles, FileText } from "lucide-react";
import { getSession } from "@/lib/auth";
import { REQUIRED_DOCS, docVerdict, type DocStatus } from "@/lib/ai";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Проверка документов · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: DocumentsPage,
});

const statusUi: Record<DocStatus, { icon: React.ElementType; cls: string; label: string }> = {
  ready: { icon: CheckCircle2, cls: "text-success", label: "есть" },
  warning: { icon: AlertTriangle, cls: "text-warning", label: "дооформить" },
  missing: { icon: XCircle, cls: "text-risk", label: "нет" },
};

function DocumentsPage() {
  const [uploaded, setUploaded] = useState(false);
  const v = docVerdict(REQUIRED_DOCS);

  return (
    <AppShell>
      <PageHeader
        badge="AI-проверка"
        title="Проверка пакета документов"
        subtitle="Загрузите документы — AI сверит их с требованиями лота и покажет, чего не хватает, до подачи заявки."
      />

      {!uploaded ? (
        <button
          onClick={() => setUploaded(true)}
          className="w-full rounded-2xl border-2 border-dashed border-border hover:border-brand/40 bg-card/60 hover:bg-card transition py-14 flex flex-col items-center justify-center gap-3 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="font-display text-lg font-semibold text-foreground">Загрузить пакет документов</div>
          <div className="text-sm text-muted-foreground">Перетащите PDF или нажмите, чтобы выбрать (демо)</div>
        </button>
      ) : (
        <>
          <div className="rounded-2xl border bg-card p-5 shadow-soft mb-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-4 h-4 text-brand" />
              <span className="text-sm text-foreground">Загружено: <b>пакет_документов.pdf</b> · 12 страниц</span>
              <button onClick={() => setUploaded(false)} className="ml-auto text-[11px] text-muted-foreground hover:text-foreground">
                Загрузить заново
              </button>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-brand rounded-full transition-all" style={{ width: `${v.percent}%` }} />
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">Готовность пакета: {v.percent}%</div>
          </div>

          <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5 flex gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-brand uppercase tracking-wider mb-1">Вывод AI</div>
              <p className="text-sm text-foreground/90 leading-relaxed">{v.text}</p>
            </div>
          </div>

          <div className="space-y-2">
            {REQUIRED_DOCS.map((d) => {
              const ui = statusUi[d.status];
              return (
                <div key={d.name} className="flex items-start gap-3 rounded-xl border bg-card px-4 py-3 shadow-soft">
                  <ui.icon className={`w-5 h-5 shrink-0 mt-0.5 ${ui.cls}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{d.name}</div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">{d.note}</div>
                  </div>
                  <span className={`text-[11px] font-semibold shrink-0 ${ui.cls}`}>{ui.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
