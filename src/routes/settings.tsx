import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { X, Plus, Check, KeyRound, Sliders, MapPin, Server } from "lucide-react";
import { getSession } from "@/lib/auth";
import { SEARCH_PROFILE, ALL_REGIONS, PLATFORMS } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Настройки · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: SettingsPage,
});

function Card({ icon: Icon, title, desc, children }: { icon: React.ElementType; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-brand" />
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
      </div>
      {desc && <p className="text-xs text-muted-foreground mb-4">{desc}</p>}
      {children}
    </div>
  );
}

const PROFILE_KEY = "qaztender.profile";
function loadSaved(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(PROFILE_KEY) || "{}");
  } catch {
    return {};
  }
}

function SettingsPage() {
  const saved = loadSaved();
  const [keywords, setKeywords] = useState<string[]>((saved.keywords as string[]) ?? SEARCH_PROFILE.keywords);
  const [kw, setKw] = useState("");
  const [regions, setRegions] = useState<string[]>((saved.regions as string[]) ?? SEARCH_PROFILE.regions);
  const [budgetMin, setBudgetMin] = useState((saved.budgetMin as number) ?? SEARCH_PROFILE.budgetMin);
  const [budgetMax, setBudgetMax] = useState((saved.budgetMax as number) ?? SEARCH_PROFILE.budgetMax);
  const [discount, setDiscount] = useState((saved.targetDiscount as number) ?? SEARCH_PROFILE.targetDiscount);
  const [margin, setMargin] = useState((saved.minMargin as number) ?? SEARCH_PROFILE.minMargin);
  const [interval, setIntervalSec] = useState((saved.intervalSec as number) ?? SEARCH_PROFILE.intervalSec);
  const [token, setToken] = useState("");
  const [savedFlag, setSavedFlag] = useState(false);

  function addKw() {
    const v = kw.trim().toLowerCase();
    if (v && !keywords.includes(v)) setKeywords([...keywords, v]);
    setKw("");
  }
  function toggleRegion(r: string) {
    setRegions((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));
  }
  function save() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ keywords, regions, budgetMin, budgetMax, targetDiscount: discount, minMargin: margin, intervalSec: interval }),
      );
    }
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2500);
  }

  const input = "h-10 w-full px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition";

  return (
    <AppShell>
      <PageHeader
        badge="Организация"
        title="Настройки поиска"
        subtitle="Профиль, по которому AI отбирает тендеры и считает цену. Чем точнее настройка — тем меньше шума и выше попадание."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card icon={Sliders} title="Ключевые слова" desc="Лот подходит, если название содержит одно из слов.">
          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 text-sm">
                {k}
                <button onClick={() => setKeywords(keywords.filter((x) => x !== k))} className="hover:text-risk">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKw()}
              placeholder="Добавить слово…"
              className={input}
            />
            <button onClick={addKw} className="h-10 px-3 rounded-lg bg-primary text-primary-foreground shrink-0 inline-flex items-center gap-1 text-sm font-medium">
              <Plus className="w-4 h-4" /> Добавить
            </button>
          </div>
        </Card>

        <Card icon={MapPin} title="Регионы" desc="Только лоты с поставкой в выбранные регионы.">
          <div className="flex flex-wrap gap-2">
            {ALL_REGIONS.map((r) => {
              const on = regions.includes(r);
              return (
                <button
                  key={r}
                  onClick={() => toggleRegion(r)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition ${
                    on ? "bg-brand/10 text-brand border-brand/30" : "bg-background text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {on && <Check className="w-3 h-3 inline mr-1" />}
                  {r}
                </button>
              );
            })}
          </div>
        </Card>

        <Card icon={Sliders} title="Бюджет и стратегия цены">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="text-muted-foreground">Бюджет от, ₸</span>
              <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(+e.target.value)} className={`${input} mt-1`} />
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Бюджет до, ₸</span>
              <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(+e.target.value)} className={`${input} mt-1`} />
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Снижение от потолка, %</span>
              <input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} className={`${input} mt-1`} />
            </label>
            <label className="text-sm">
              <span className="text-muted-foreground">Мин. маржа, %</span>
              <input type="number" value={margin} onChange={(e) => setMargin(+e.target.value)} className={`${input} mt-1`} />
            </label>
          </div>
          <label className="text-sm block mt-3">
            <span className="text-muted-foreground">Интервал опроса, сек</span>
            <input type="number" value={interval} onChange={(e) => setIntervalSec(+e.target.value)} className={`${input} mt-1`} />
          </label>
        </Card>

        <Card icon={Server} title="Площадки и интеграция">
          <div className="space-y-2 mb-4">
            {PLATFORMS.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5">
                <span className={`w-2 h-2 rounded-full ${p.on ? "bg-success" : "bg-muted-foreground/40"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.note}</div>
                </div>
                <span className={`text-[11px] font-medium ${p.on ? "text-success" : "text-muted-foreground"}`}>
                  {p.on ? "активна" : "позже"}
                </span>
              </div>
            ))}
          </div>
          <label className="text-sm block">
            <span className="text-muted-foreground inline-flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> API-токен goszakup.gov.kz
            </span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="вставьте Bearer-токен для боевого режима"
              className={`${input} mt-1 font-mono`}
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Без токена система работает на демо-данных.
            </span>
          </label>
        </Card>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {savedFlag && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <Check className="w-4 h-4" /> Настройки сохранены
          </span>
        )}
        <button onClick={save} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-soft">
          Сохранить настройки
        </button>
      </div>
    </AppShell>
  );
}
