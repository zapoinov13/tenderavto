export type Decision = "УЧАСТВОВАТЬ" | "НЕ ВЫГОДНО" | "НА ГРАНИ";
export type Method = "ЗЦП" | "Конкурс" | "Аукцион";

export interface Tender {
  id: string;
  announcement: string;
  title: string;
  region: string;
  method: Method;
  amount: number; // ceiling, KZT
  detectedMinutesAgo: number;
  matches: boolean;
  rejectReason?: string;
  keywords?: string[];
  cost?: number;
  recommendedPrice?: number;
  decision?: Decision;
  supplier?: { name: string; bin: string };
}

const SUPPLIER = { name: 'ТОО «Пример Безопасность»', bin: "123456789012" };

export const TENDERS: Tender[] = [
  {
    id: "1",
    announcement: "901001-1",
    title: "Услуги по обучению промышленной безопасности",
    region: "Алматы",
    method: "ЗЦП",
    amount: 18_000_000,
    detectedMinutesAgo: 2,
    matches: true,
    keywords: ["обучение", "промышленная безопасность"],
    cost: 12_000_000,
    recommendedPrice: 17_100_000,
    decision: "УЧАСТВОВАТЬ",
    supplier: SUPPLIER,
  },
  {
    id: "2",
    announcement: "901003-1",
    title: "Закупка VR-тренажёров для охраны труда",
    region: "Астана",
    method: "ЗЦП",
    amount: 42_000_000,
    detectedMinutesAgo: 5,
    matches: true,
    keywords: ["тренажер", "vr"],
    cost: 28_000_000,
    recommendedPrice: 39_900_000,
    decision: "УЧАСТВОВАТЬ",
    supplier: SUPPLIER,
  },
  {
    id: "3",
    announcement: "901014-1",
    title: "Курс по промышленной безопасности для ИТР",
    region: "Астана",
    method: "ЗЦП",
    amount: 15_500_000,
    detectedMinutesAgo: 8,
    matches: true,
    keywords: ["обучение"],
    cost: 12_000_000,
    recommendedPrice: 14_725_000,
    decision: "УЧАСТВОВАТЬ",
    supplier: SUPPLIER,
  },
  {
    id: "4",
    announcement: "901009-1",
    title: "Обучение охране труда (низкий бюджет)",
    region: "Алматы",
    method: "ЗЦП",
    amount: 10_500_000,
    detectedMinutesAgo: 12,
    matches: true,
    keywords: ["охрана труда"],
    cost: 12_000_000,
    recommendedPrice: 13_200_000,
    decision: "НЕ ВЫГОДНО",
    supplier: SUPPLIER,
  },
  {
    id: "5",
    announcement: "901002-1",
    title: "Поставка канцелярских товаров",
    region: "Алматы",
    method: "ЗЦП",
    amount: 500_000,
    detectedMinutesAgo: 15,
    matches: false,
    rejectReason: "нет ключевых слов",
  },
  {
    id: "6",
    announcement: "901004-1",
    title: "Обучение промышленной безопасности (Шымкент)",
    region: "Шымкент",
    method: "ЗЦП",
    amount: 9_000_000,
    detectedMinutesAgo: 18,
    matches: false,
    rejectReason: "чужой регион",
  },
  {
    id: "7",
    announcement: "901005-1",
    title: "Обучение по охране труда (конкурс)",
    region: "Алматы",
    method: "Конкурс",
    amount: 30_000_000,
    detectedMinutesAgo: 22,
    matches: false,
    rejectReason: "не ЗЦП",
  },
  {
    id: "8",
    announcement: "901021-1",
    title: "Текущий ремонт кровли административного здания",
    region: "Астана",
    method: "ЗЦП",
    amount: 7_800_000,
    detectedMinutesAgo: 27,
    matches: false,
    rejectReason: "нет ключевых слов",
  },
  {
    id: "9",
    announcement: "901027-1",
    title: "Поставка спецодежды и СИЗ",
    region: "Алматы",
    method: "Аукцион",
    amount: 22_000_000,
    detectedMinutesAgo: 32,
    matches: false,
    rejectReason: "не ЗЦП",
  },
];

export const METRICS = {
  checked: TENDERS.length,
  matching: TENDERS.filter((t) => t.matches).length,
  recommended: TENDERS.filter((t) => t.decision === "УЧАСТВОВАТЬ").length,
  risky: TENDERS.filter((t) => t.decision === "НЕ ВЫГОДНО" || t.decision === "НА ГРАНИ").length,
};

export function formatKzt(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₸";
}
