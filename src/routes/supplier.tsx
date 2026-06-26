import { createFileRoute, redirect } from "@tanstack/react-router";
import { Building2, CheckCircle2, XCircle, Trophy, FileBadge } from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatKzt } from "@/lib/tenders";
import { SUPPLIER_PROFILE, SUPPLIER_OKEDS, SUPPLIER_LICENSES, WIN_HISTORY } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/supplier")({
  head: () => ({ meta: [{ title: "Поставщик · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: SupplierPage,
});

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-foreground text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function SupplierPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Организация"
        title="Профиль поставщика"
        subtitle="Реквизиты вашей компании, виды деятельности и допуски. Эти данные AI подставляет в черновики ценовых предложений."
      />

      <div className="rounded-2xl border bg-card p-6 shadow-soft mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow shrink-0">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">{SUPPLIER_PROFILE.name}</h2>
          <div className="text-sm text-muted-foreground font-mono mt-0.5">БИН {SUPPLIER_PROFILE.bin}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-2">Реквизиты</h3>
          <Field label="Директор" value={SUPPLIER_PROFILE.director} />
          <Field label="Адрес" value={SUPPLIER_PROFILE.address} />
          <Field label="Банк" value={SUPPLIER_PROFILE.bank} />
          <Field label="ИИК" value={SUPPLIER_PROFILE.iik} mono />
          <Field label="БИК" value={SUPPLIER_PROFILE.bik} mono />
          <Field label="Телефон" value={SUPPLIER_PROFILE.phone} />
          <Field label="Email" value={SUPPLIER_PROFILE.email} />
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold text-foreground mb-3">Виды деятельности (ОКЭД)</h3>
          <div className="space-y-2">
            {SUPPLIER_OKEDS.map((o) => (
              <div key={o.code} className="flex items-start gap-3 rounded-lg border bg-background px-3 py-2.5">
                <span className="font-mono text-sm text-brand font-semibold shrink-0">{o.code}</span>
                <span className="text-sm text-muted-foreground">{o.name}</span>
              </div>
            ))}
          </div>

          <h3 className="font-display font-semibold text-foreground mt-6 mb-3 flex items-center gap-2">
            <FileBadge className="w-4 h-4 text-brand" /> Лицензии и допуски
          </h3>
          <div className="space-y-2">
            {SUPPLIER_LICENSES.map((l) => (
              <div key={l.name} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5">
                {l.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-risk shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{l.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {l.number} · {l.valid}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-soft">
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-success" /> История выигранных закупок
        </h3>
        <div className="space-y-2">
          {WIN_HISTORY.map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground line-clamp-1">{w.title}</div>
                <div className="text-[11px] text-muted-foreground">{w.date} · снижение {w.drop}%</div>
              </div>
              <span className="font-display font-semibold text-foreground shrink-0">{formatKzt(w.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
