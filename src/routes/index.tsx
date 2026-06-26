import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { signIn, getSession, DEMO_CREDENTIALS } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ТендерАвто — AI-ассистент по госзакупкам РК" },
      { name: "description", content: "AI-мониторинг и черновики ценовых предложений для госзакупок Казахстана." },
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
    <div className={`text-2xl font-semibold tracking-tight ${className}`}>
      <span className="text-primary">Тендер</span>
      <span className="text-brand">Авто</span>
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-accent">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="text-3xl" />
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-foreground">С возвращением</h1>
          <p className="text-sm text-muted-foreground mt-1">Войдите в личный кабинет</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                placeholder="you@company.kz"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground">Пароль</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
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
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? "Входим…" : "Войти в систему"}
            </button>

            <div className="text-center text-sm">
              <a href="#demo" className="text-brand hover:underline">Нет аккаунта? Запросить демо</a>
            </div>
          </form>
        </div>

        <button
          onClick={fillDemo}
          className="mt-4 w-full text-left bg-accent/60 border border-dashed border-brand/40 rounded-xl px-4 py-3 text-sm text-foreground hover:bg-accent transition"
        >
          <div className="font-medium text-primary">Демо-доступ</div>
          <div className="text-muted-foreground mt-0.5 font-mono text-xs">
            {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </div>
          <div className="text-xs text-brand mt-1">Нажмите, чтобы подставить</div>
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} ТендерАвто · Госзакупки РК
        </p>
      </div>
    </div>
  );
}
