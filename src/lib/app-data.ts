import type { Decision } from "@/lib/tenders";

/* ─────────────── Поставщик (наша компания) ─────────────── */
export const SUPPLIER_PROFILE = {
  name: "ТОО «Пример Безопасность»",
  bin: "123456789012",
  address: "г. Алматы, ул. Примерная, 12, офис 3",
  director: "Иванов Иван Иванович",
  bank: "АО «Народный Банк Казахстана»",
  iik: "KZ12 3456 7890 1234 5678",
  bik: "HSBKKZKX",
  phone: "+7 727 000 00 00",
  email: "info@primer-safety.kz",
};

export const SUPPLIER_OKEDS = [
  { code: "85.59", name: "Прочие виды образования, не включённые в другие группировки" },
  { code: "74.90", name: "Прочая профессиональная, научная и техническая деятельность" },
  { code: "71.20", name: "Технические испытания и анализ" },
];

export const SUPPLIER_LICENSES = [
  { name: "Лицензия на образовательную деятельность", number: "KZ83LAA00012345", valid: "до 12.2028", ok: true },
  { name: "Аттестат по промышленной безопасности", number: "ПБ-2024-0456", valid: "до 06.2027", ok: true },
  { name: "Сертификат ISO 9001:2015", number: "ISO-9001-7788", valid: "до 03.2026", ok: true },
  { name: "Допуск СРО на проектные работы", number: "—", valid: "не оформлен", ok: false },
];

export const WIN_HISTORY = [
  { id: "w1", title: "Обучение охране труда — АО «КазМунайГаз»", date: "12.05.2026", amount: 16_200_000, drop: 9 },
  { id: "w2", title: "Курс промышленной безопасности — ТОО «Казцинк»", date: "28.04.2026", amount: 21_800_000, drop: 12 },
  { id: "w3", title: "Аттестация ИТР — АО «Самрук-Энерго»", date: "15.04.2026", amount: 9_400_000, drop: 7 },
  { id: "w4", title: "VR-тренажёр ОТ — ТОО «ERG»", date: "02.04.2026", amount: 38_500_000, drop: 5 },
];

/* ─────────────── Черновики ─────────────── */
export type DraftStatus = "Готов к подписи" | "На проверке" | "Подписан" | "Подан";

export interface Draft {
  id: string;
  tenderId: string;
  announcement: string;
  title: string;
  region: string;
  amount: number;
  cost: number;
  recommendedPrice: number;
  decision: Decision;
  status: DraftStatus;
  deadlineHours: number;
  updated: string;
}

export const DRAFTS: Draft[] = [
  {
    id: "d1", tenderId: "1", announcement: "901001-1",
    title: "Услуги по обучению промышленной безопасности", region: "Алматы",
    amount: 18_000_000, cost: 12_000_000, recommendedPrice: 17_100_000,
    decision: "УЧАСТВОВАТЬ", status: "Готов к подписи", deadlineHours: 18, updated: "2 мин назад",
  },
  {
    id: "d2", tenderId: "2", announcement: "901003-1",
    title: "Закупка VR-тренажёров для охраны труда", region: "Астана",
    amount: 42_000_000, cost: 28_000_000, recommendedPrice: 39_900_000,
    decision: "УЧАСТВОВАТЬ", status: "На проверке", deadlineHours: 31, updated: "9 мин назад",
  },
  {
    id: "d3", tenderId: "3", announcement: "901014-1",
    title: "Курс по промышленной безопасности для ИТР", region: "Астана",
    amount: 15_500_000, cost: 12_000_000, recommendedPrice: 14_725_000,
    decision: "УЧАСТВОВАТЬ", status: "Подписан", deadlineHours: 44, updated: "1 ч назад",
  },
  {
    id: "d4", tenderId: "x4", announcement: "900880-1",
    title: "Обучение по электробезопасности — группа допуска", region: "Алматы",
    amount: 13_400_000, cost: 9_000_000, recommendedPrice: 12_730_000,
    decision: "УЧАСТВОВАТЬ", status: "Подан", deadlineHours: 0, updated: "вчера",
  },
];

/* ─────────────── Аналитика ─────────────── */
export const WEEKLY = [
  { day: "Пн", found: 142, matched: 9 },
  { day: "Вт", found: 168, matched: 12 },
  { day: "Ср", found: 151, matched: 7 },
  { day: "Чт", found: 189, matched: 14 },
  { day: "Пт", found: 203, matched: 16 },
  { day: "Сб", found: 64, matched: 3 },
  { day: "Вс", found: 38, matched: 2 },
];

export const BY_METHOD = [
  { name: "ЗЦП", value: 63 },
  { name: "Конкурс", value: 24 },
  { name: "Аукцион", value: 13 },
];

export const BY_REGION = [
  { region: "Алматы", value: 38 },
  { region: "Астана", value: 31 },
  { region: "Шымкент", value: 11 },
  { region: "Караганда", value: 9 },
  { region: "Прочие", value: 11 },
];

export const FUNNEL = [
  { stage: "Найдено", value: 955 },
  { stage: "Подходят", value: 63 },
  { stage: "Поданы", value: 21 },
  { stage: "Выиграны", value: 9 },
];

export const KPI = {
  winRate: 43, // %
  avgDrop: 8.4, // среднее снижение цены, %
  avgMargin: 31, // %
  hoursSaved: 168, // часов в месяц
};

/* ─────────────── Настройки / профиль поиска ─────────────── */
export const SEARCH_PROFILE = {
  keywords: ["обучение", "промышленная безопасность", "охрана труда", "тренажер", "vr"],
  regions: ["Алматы", "Астана"],
  methods: ["ЗЦП"],
  budgetMin: 5_000_000,
  budgetMax: 100_000_000,
  targetDiscount: 5,
  minMargin: 10,
  intervalSec: 20,
};

export const ALL_REGIONS = [
  "Алматы", "Астана", "Шымкент", "Караганда", "Актобе",
  "Атырау", "Павлодар", "Костанай", "Усть-Каменогорск", "Кызылорда",
];

export const PLATFORMS = [
  { id: "goszakup", name: "goszakup.gov.kz", note: "Госзакупки · официальный API", on: true },
  { id: "samruk", name: "zakup.sk.kz", note: "Самрук-Казына · этап 2", on: false },
  { id: "nadloc", name: "nadloc.kz", note: "Недропользователи · этап 2", on: false },
  { id: "ets", name: "ets-tender.kz", note: "Коммерческие · этап 2", on: false },
];

/* ─────────────── Уведомления ─────────────── */
export const NOTIFICATION_CHANNELS = [
  { id: "tg", name: "Telegram", value: "@primer_safety_bot", enabled: true },
  { id: "wa", name: "WhatsApp", value: "+7 727 000 00 00", enabled: false },
  { id: "email", name: "Email", value: "info@primer-safety.kz", enabled: true },
];

export const NOTIFICATION_TRIGGERS = [
  { id: "new", label: "Новый подходящий тендер", enabled: true },
  { id: "deadline", label: "Дедлайн подачи менее 6 часов", enabled: true },
  { id: "status", label: "Изменение статуса заявки", enabled: true },
  { id: "competitor", label: "Активность постоянного конкурента", enabled: false },
];

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: "match" | "deadline" | "status";
  unread: boolean;
}

export const NOTIFICATION_LOG: NotificationItem[] = [
  { id: "n1", title: "Новый тендер под профиль", detail: "№901001-1 · Обучение ПБ · 18 000 000 ₸", time: "2 мин назад", kind: "match", unread: true },
  { id: "n2", title: "Новый тендер под профиль", detail: "№901003-1 · VR-тренажёры · 42 000 000 ₸", time: "5 мин назад", kind: "match", unread: true },
  { id: "n3", title: "Дедлайн приближается", detail: "№901014-1 · до окончания подачи 6 часов", time: "40 мин назад", kind: "deadline", unread: false },
  { id: "n4", title: "Заявка подана", detail: "№900880-1 · Электробезопасность · подписано ЭЦП", time: "вчера", kind: "status", unread: false },
];

/* ───────────────────── Дедлайны подачи ───────────────────── */
export interface Deadline {
  id: string;
  announcement: string;
  title: string;
  region: string;
  amount: number;
  hoursLeft: number;
  status: DraftStatus;
}

export const DEADLINES: Deadline[] = [
  { id: "dl1", announcement: "901001-1", title: "Услуги по обучению промышленной безопасности", region: "Алматы", amount: 18_000_000, hoursLeft: 6, status: "Готов к подписи" },
  { id: "dl2", announcement: "901003-1", title: "Закупка VR-тренажёров для охраны труда", region: "Астана", amount: 42_000_000, hoursLeft: 18, status: "На проверке" },
  { id: "dl3", announcement: "901031-1", title: "Курс по пожарно-техническому минимуму", region: "Алматы", amount: 8_900_000, hoursLeft: 22, status: "Готов к подписи" },
  { id: "dl4", announcement: "901014-1", title: "Курс по промышленной безопасности для ИТР", region: "Астана", amount: 15_500_000, hoursLeft: 31, status: "Подписан" },
  { id: "dl5", announcement: "901042-1", title: "Аттестация по электробезопасности", region: "Алматы", amount: 11_200_000, hoursLeft: 52, status: "На проверке" },
  { id: "dl6", announcement: "901055-1", title: "Обучение оказанию первой помощи", region: "Астана", amount: 6_400_000, hoursLeft: 96, status: "Готов к подписи" },
];
