import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, Mail, Send, MessageCircle, ChevronDown } from "lucide-react";
import { getSession } from "@/lib/auth";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Поддержка · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: SupportPage,
});

const FAQ = [
  { q: "Откуда берутся тендеры?", a: "Система опрашивает официальный API госзакупок РК каждые 10–30 секунд. В демо-режиме данные имитируют реальный поток ЗЦП." },
  { q: "Подаёт ли система заявку сама?", a: "Нет. AI готовит черновик и рекомендует цену, но финальное решение и подпись ЭЦП остаются за оператором." },
  { q: "Как настроить отбор под мою компанию?", a: "В разделе «Настройки» задайте ключевые слова, регионы, бюджет и стратегию цены. AI будет отбирать лоты по этому профилю." },
  { q: "Что нужно для боевого режима?", a: "API-токен goszakup.gov.kz из личного кабинета. Вставьте его в «Настройки» — и лента наполнится живыми тендерами." },
];

function SupportPage() {
  const [openItem, setOpenItem] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const input = "h-10 w-full px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition";

  return (
    <AppShell>
      <PageHeader badge="Помощь" title="Поддержка" subtitle="Ответы на частые вопросы и связь с командой." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display font-semibold text-foreground">Частые вопросы</h3>
          {FAQ.map((f, i) => (
            <div key={i} className="rounded-xl border bg-card shadow-soft overflow-hidden">
              <button
                onClick={() => setOpenItem(openItem === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-sm font-medium text-foreground">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition ${openItem === i ? "rotate-180" : ""}`} />
              </button>
              {openItem === i && <div className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-brand" /> Контакты
            </h3>
            <div className="space-y-2 text-sm">
              <a href="mailto:support@qaztender.ai" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Mail className="w-4 h-4" /> support@qaztender.ai
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Send className="w-4 h-4" /> @qaztender_support
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" /> +7 727 000 00 00
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3">Написать в поддержку</h3>
            {sent ? (
              <div className="text-sm text-success py-6 text-center">Сообщение отправлено. Ответим в течение дня.</div>
            ) : (
              <div className="space-y-3">
                <input placeholder="Тема" className={input} />
                <textarea placeholder="Опишите вопрос…" rows={4} className={`${input} h-auto py-2 resize-none`} />
                <button
                  onClick={() => setSent(true)}
                  className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                >
                  Отправить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
