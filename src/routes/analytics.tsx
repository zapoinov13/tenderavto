import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import { Trophy, TrendingDown, Percent, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { WEEKLY, BY_METHOD, BY_REGION, FUNNEL, KPI } from "@/lib/app-data";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Аналитика · QazTender AI" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getSession()) throw redirect({ to: "/" });
  },
  component: AnalyticsPage,
});

const COLORS = ["#2E6DA4", "#1F3A5F", "#94a3b8"];

function KpiCard({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg border bg-brand/10 text-brand border-brand/20 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 font-display text-3xl font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <h3 className="font-display font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Аналитика"
        title="Аналитика и результаты"
        subtitle="Эффективность участия: сколько лотов проверено, конверсия в победы, среднее снижение цены и сэкономленное время."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Trophy} label="Конверсия в победу" value={`${KPI.winRate}%`} hint="из поданных заявок" />
        <KpiCard icon={TrendingDown} label="Среднее снижение" value={`${KPI.avgDrop}%`} hint="на аукционах ЗЦП" />
        <KpiCard icon={Percent} label="Средняя маржа" value={`${KPI.avgMargin}%`} hint="по выигранным" />
        <KpiCard icon={Clock} label="Сэкономлено" value={`${KPI.hoursSaved} ч`} hint="времени в месяц" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Поток тендеров за неделю">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="found" name="Найдено" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="matched" name="Подходят" fill="#2E6DA4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="По способу закупки">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={BY_METHOD} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={3}>
                {BY_METHOD.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Подходящие лоты по регионам">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BY_REGION} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="region" width={88} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="value" name="Лотов" fill="#1F3A5F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Воронка участия">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FUNNEL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="value" name="Кол-во" fill="#2E7D32" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </AppShell>
  );
}
