import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check, X, Plus, MapPin, Wallet } from "lucide-react";
import { getSession } from "@/lib/auth";
import { SEARCH_PROFILE, ALL_REGIONS } from "@/lib/app-data";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Настройка профиля · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: OnboardingPage,
});

const STEPS = ["Ключевые слова", "Регионы", "Бюджет"];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [keywords, setKeywords] = useState<string[]>(SEARCH_PROFILE.keywords);
  const [kw, setKw] = useState("");
  const [regions, setRegions] = useState<string[]>(SEARCH_PROFILE.regions);
  const [budgetMin, setBudgetMin] = useState(SEARCH_PROFILE.budgetMin);
  const [budgetMax, setBudgetMax] = useState(SEARCH_PROFILE.budgetMax);

  function addKw() {
    const v = kw.trim().toLowerCase();
    if (v && !keywords.includes(v)) setKeywords([...keywords, v]);
    setKw("");
  }
  function toggleRegion(r: string) {
    setRegions((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));
  }
  function finish() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "qaztender.profile",
        JSON.stringify({ keywords, regions, budgetMin, budgetMax }),
      );
      window.localStorage.setItem("qaztender.onboarded", "1");
    }
    navigate({ to: "/dashboard" });
  }

  const input = "h-11 w-full px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
            <span className="font-display font-bold text-white">QT</span>
          </div>
          <div className="font-display text-2xl font-semibold tracking-tight">
            <span className="text-primary">QazTender</span> <span className="text-brand">AI</span>
          </div>
        </div>

        <div className="bg-card border rounded-2xl shadow-card p-7">
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-brand" : "bg-muted"}`} />
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Шаг {step + 1} из {STEPS.length}
          </div>

          {step === 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Что вы продаёте?</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                AI будет искать тендеры по этим словам в названии лота.
              </p>
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
                <input value={kw} onChange={(e) => setKw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKw()} placeholder="Например: обучение" className={input} />
                <button onClick={addKw} className="h-11 px-3 rounded-lg bg-primary text-primary-foreground inline-flex items-center gap-1 text-sm font-medium shrink-0">
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand" /> Где работаете?
              </h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Будем показывать только лоты с поставкой в выбранные регионы.
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_REGIONS.map((r) => {
                  const on = regions.includes(r);
                  return (
                    <button key={r} onClick={() => toggleRegion(r)} className={`px-3 py-1.5 rounded-md text-sm border transition ${on ? "bg-brand/10 text-brand border-brand/30" : "bg-background text-muted-foreground border-border hover:text-foreground"}`}>
                      {on && <Check className="w-3 h-3 inline mr-1" />}{r}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5 text-brand" /> Бюджет лотов
              </h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Диапазон суммы закупки, который вам интересен.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm">
                  <span className="text-muted-foreground">От, ₸</span>
                  <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(+e.target.value)} className={`${input} mt-1`} />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">До, ₸</span>
                  <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(+e.target.value)} className={`${input} mt-1`} />
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-7">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="h-10 px-4 rounded-lg border bg-background hover:bg-accent text-sm font-medium inline-flex items-center gap-1 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1">
                Далее <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={finish} className="h-10 px-5 rounded-lg bg-success text-success-foreground text-sm font-medium inline-flex items-center gap-1">
                <Check className="w-4 h-4" /> Готово, в систему
              </button>
            )}
          </div>
        </div>

        <button onClick={() => navigate({ to: "/dashboard" })} className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-4">
          Пропустить настройку
        </button>
      </div>
    </div>
  );
}
