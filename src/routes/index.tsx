import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { signIn, getSession, DEMO_CREDENTIALS } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QazTender AI — AI-ассистент по госзакупкам РК" },
      {
        name: "description",
        content:
          "AI-мониторинг и черновики ценовых предложений для госзакупок Казахстана.",
      },
    ],
  }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && getSession()) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
        <span className="font-display font-bold text-white">QT</span>
      </div>
      <div className="font-display text-2xl font-semibold tracking-tight leading-none">
        <span className="text-primary">QazTender</span>
        <span className="text-brand"> AI</span>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = signIn(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />

        <div className="relative">
          <Logo className="[&_.text-primary]:text-white" />
        </div>

        <div className="relative space-y-8 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> AI-мониторинг госзакупок РК
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight">
            Секунды решают, кто выиграет тендер.
          </h2>
          <p className="text-white/70 leading-relaxed">
            QazTender AI следит за объявлениями ЗЦП, отбирает подходящие лоты под ваш профиль
            и готовит черновик ценового предложения — пока конкуренты только узнали о
            тендере.
          </p>

          <div className="grid gap-3 pt-2">
            {[
              { icon: Zap, text: "Мониторинг каждые 20 секунд" },
              { icon: Sparkles, text: "AI-фильтр по ключевым словам и регионам" },
              { icon: ShieldCheck, text: "Расчёт маржи и решение «участвовать»" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                  <f.icon className="w-4 h-4" />
                </div>
                <span className="text-white/90">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/50">
          © {new Date().getFullYear()} QazTender AI · Госзакупки Республики Казахстан
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo />
          </div>

          <div className="bg-card border rounded-2xl p-8 shadow-card">
            <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
              С возвращением
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Войдите в личный кабинет, чтобы продолжить
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3.5 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  placeholder="you@company.kz"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3.5 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-sm text-risk bg-risk/5 border border-risk/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-60 shadow-soft"
              >
                {loading ? "Входим…" : "Войти в систему"}
                {!loading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                )}
              </button>

              <div className="text-center text-sm">
                <a href="#demo" className="text-brand hover:underline font-medium">
                  Нет аккаунта? Запросить демо
                </a>
              </div>
            </form>
          </div>

          <button
            onClick={fillDemo}
            className="mt-4 w-full text-left bg-card border border-dashed border-brand/40 rounded-xl px-4 py-3 text-sm hover:bg-accent transition group"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-primary">Демо-доступ</div>
              <span className="text-xs text-brand opacity-0 group-hover:opacity-100 transition">
                Подставить →
              </span>
            </div>
            <div className="text-muted-foreground mt-0.5 font-mono text-xs">
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </div>
          </button>

          <p className="lg:hidden text-center text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} QazTender AI · Госзакупки РК
          </p>
        </div>
      </div>
    </div>
  );
}
