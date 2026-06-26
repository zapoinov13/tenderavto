import { formatKzt, type Tender, type Decision } from "@/lib/tenders";

/* ───────────────────── AI-обоснование релевантности ───────────────────── */
export interface ReasonItem {
  ok: boolean;
  text: string;
}

export function matchReasons(t: Tender): ReasonItem[] {
  if (t.matches) {
    const r: ReasonItem[] = [
      { ok: true, text: "Способ закупки — ЗЦП: исход решают цена и скорость подачи" },
      { ok: true, text: `Совпадение с профилем по словам: ${(t.keywords ?? []).join(", ")}` },
      { ok: true, text: `Регион поставки (${t.region}) входит в зону работы компании` },
      { ok: true, text: "Соответствует ОКЭД 85.59 «образование» и опыту (4 похожие победы)" },
    ];
    if (t.decision === "УЧАСТВОВАТЬ" && t.recommendedPrice && t.cost) {
      const margin = Math.round(((t.recommendedPrice - t.cost) / t.cost) * 100);
      r.push({ ok: true, text: `Цена проходит: рекомендуемая ниже потолка, маржа ≈ ${margin}%` });
    }
    if (t.decision === "НЕ ВЫГОДНО") {
      r.push({ ok: false, text: "Себестоимость с минимальной маржой выше потолка — участие убыточно" });
    }
    return r;
  }

  const base: ReasonItem[] = [];
  const reason = t.rejectReason ?? "";
  if (reason.includes("ключевы")) {
    base.push({ ok: false, text: "В названии нет слов из профиля компании" });
    base.push({ ok: true, text: "Способ закупки подходит, но тематика не ваша" });
  } else if (reason.includes("регион")) {
    base.push({ ok: false, text: `Регион поставки (${t.region}) вне зоны работы компании` });
    base.push({ ok: true, text: "По тематике лот подходящий" });
  } else if (reason.includes("не ЗЦП")) {
    base.push({ ok: false, text: `Способ закупки «${t.method}» — не ЗЦП, гонка за секунды неприменима` });
    base.push({ ok: true, text: "Тематика совпадает с профилем" });
  } else {
    base.push({ ok: false, text: t.rejectReason ?? "Не соответствует профилю" });
  }
  return base;
}

/* ───────────────────── Генерация текста предложения ───────────────────── */
export function proposalText(args: {
  title: string;
  announcement: string;
  region: string;
  recommendedPrice?: number;
  supplierName: string;
}): { tech: string; commercial: string } {
  const price = args.recommendedPrice ? formatKzt(args.recommendedPrice) : "по расчёту";
  const tech =
    `${args.supplierName} предлагает оказать услуги по предмету закупки «${args.title}» ` +
    `(объявление №${args.announcement}) в полном соответствии с технической спецификацией заказчика. ` +
    `Работы выполняются силами штатных аттестованных специалистов с подтверждённым опытом аналогичных ` +
    `закупок. Место оказания услуг — ${args.region}. Сроки и объёмы соответствуют требованиям ` +
    `конкурсной документации; гарантируется методическое сопровождение и выдача документов ` +
    `установленного образца.`;
  const commercial =
    `Коммерческое предложение: общая стоимость — ${price}, включая все налоги и сопутствующие расходы. ` +
    `Цена сформирована с учётом себестоимости и конкурентного снижения относительно объявленной суммы. ` +
    `Условия оплаты — согласно проекту договора. Предложение действительно в течение срока приёма заявок.`;
  return { tech, commercial };
}

/* ───────────────────── Анализ заказчика (демо) ───────────────────── */
export const CUSTOMER = {
  name: "ГУ «Управление образования города Алматы»",
  bin: "990140000123",
  stats: {
    purchasesYear: 47,
    avgBudget: 14_800_000,
    avgDrop: 8.4,
    avgParticipants: 3.2,
  },
  verdict:
    "Заказчик регулярный, закупки распределяются между несколькими поставщиками — нет признака «заточки» под одного. " +
    "Среднее снижение умеренное (8.4%). Шансы реальные: чтобы пройти по цене, ориентируйтесь на снижение около 7–9% от потолка.",
  topWinners: [
    { name: "ТОО «Пример Безопасность» (вы)", wins: 5, avgDrop: 8 },
    { name: "ТОО «КазОбразование»", wins: 7, avgDrop: 11 },
    { name: "ТОО «Учебный центр ПБ»", wins: 4, avgDrop: 6 },
  ],
  recent: [
    { title: "Обучение охране труда", date: "05.2026", winner: "ТОО «КазОбразование»", amount: 16_200_000, drop: 9 },
    { title: "Курс промышленной безопасности", date: "04.2026", winner: "ТОО «Пример Безопасность»", amount: 17_900_000, drop: 8 },
    { title: "Аттестация ИТР", date: "03.2026", winner: "ТОО «Учебный центр ПБ»", amount: 9_400_000, drop: 6 },
    { title: "Пожарно-технический минимум", date: "02.2026", winner: "ТОО «КазОбразование»", amount: 12_100_000, drop: 13 },
  ],
};

/* ───────────────────── Чат-ассистент (скриптованный) ───────────────────── */
export interface ChatMsg {
  role: "user" | "ai";
  text: string;
}

export function aiRespond(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("подход") || q.includes("сегодня") || q.includes("какие") || q.includes("лот")) {
    return (
      "Сегодня под ваш профиль подходят 4 лота из 9 проверенных:\n" +
      "• №901001-1 — Обучение ПБ, Алматы, 18 млн ₸ — рекомендую УЧАСТВОВАТЬ\n" +
      "• №901003-1 — VR-тренажёры ОТ, Астана, 42 млн ₸ — УЧАСТВОВАТЬ\n" +
      "• №901014-1 — Курс ПБ для ИТР, Астана, 15.5 млн ₸ — УЧАСТВОВАТЬ\n" +
      "• №901009-1 — Обучение ОТ, Алматы, 10.5 млн ₸ — НЕ ВЫГОДНО (себестоимость выше потолка)\n" +
      "Открыть черновик по любому — в разделе «Лента тендеров»."
    );
  }
  if (q.includes("заказчик") || q.includes("разбер") || q.includes("901001")) {
    return (
      "Заказчик по №901001-1 — Управление образования г. Алматы. За год 47 закупок, " +
      "среднее снижение 8.4%, в среднем 3 участника. Закупки делятся между несколькими поставщиками — " +
      "не «заточено» под одного. Шансы реальные. Полный разбор — кнопка «Анализ заказчика» на карточке лота."
    );
  }
  if (q.includes("цен") || q.includes("скольк") || q.includes("сниз")) {
    return (
      "По №901001-1: потолок 18 млн ₸, ваша себестоимость 12 млн ₸. Рекомендую цену 17.1 млн ₸ " +
      "(−5% от потолка, маржа ≈ 42%). У этого заказчика среднее снижение 8%, так что цена конкурентна. " +
      "Финальное решение и подпись — за вами."
    );
  }
  if (q.includes("предложен") || q.includes("собери") || q.includes("подготов") || q.includes("черновик")) {
    return (
      "Готов собрать черновик ценового предложения: техническое и коммерческое предложение, расчёт цены и " +
      "чек-лист документов подставятся автоматически. Откройте лот в «Ленте тендеров» и нажмите «Открыть черновик» — " +
      "там же кнопка подписи ЭЦП."
    );
  }
  return (
    "Я помогаю по тендерам: подскажу подходящие лоты, разберу заказчика, посоветую цену и соберу черновик предложения.\n" +
    "Спросите, например: «какие тендеры сегодня подходят?», «разбери заказчика по №901001», «какую цену ставить?»."
  );
}

export const CHAT_SUGGESTIONS = [
  "Какие тендеры сегодня подходят?",
  "Разбери заказчика по №901001",
  "Какую цену ставить?",
  "Собери черновик предложения",
];

/* ───────────────────── Проверка пакета документов ───────────────────── */
export type DocStatus = "ready" | "warning" | "missing";
export interface RequiredDoc {
  name: string;
  status: DocStatus;
  note: string;
}

export const REQUIRED_DOCS: RequiredDoc[] = [
  { name: "Ценовое предложение, подписанное ЭЦП", status: "ready", note: "сформировано AI, осталось подписать" },
  { name: "Лицензия на образовательную деятельность", status: "ready", note: "KZ83LAA00012345 · до 12.2028" },
  { name: "Аттестат по промышленной безопасности", status: "ready", note: "ПБ-2024-0456 · до 06.2027" },
  { name: "Сертификат ISO 9001:2015", status: "ready", note: "ISO-9001-7788 · до 03.2026" },
  { name: "Справка об отсутствии налоговой задолженности", status: "warning", note: "получается за 1 рабочий день" },
  { name: "Допуск СРО на проектные работы", status: "missing", note: "не оформлен — заявку отклонят" },
];

export function docVerdict(docs: RequiredDoc[]): { ready: number; total: number; percent: number; text: string } {
  const total = docs.length;
  const ready = docs.filter((d) => d.status === "ready").length;
  const missing = docs.filter((d) => d.status === "missing").map((d) => d.name);
  const warning = docs.filter((d) => d.status === "warning").map((d) => d.name);
  const percent = Math.round((ready / total) * 100);
  let text = `Пакет готов на ${percent}% (${ready} из ${total}). `;
  if (missing.length) {
    text += `Критично не хватает: ${missing.join(", ")} — без этого заявку отклонят. `;
  }
  if (warning.length) {
    text += `Можно дооформить: ${warning.join(", ")}. `;
  }
  if (!missing.length && !warning.length) {
    text += "Пакет полный, можно подавать.";
  }
  return { ready, total, percent, text };
}
