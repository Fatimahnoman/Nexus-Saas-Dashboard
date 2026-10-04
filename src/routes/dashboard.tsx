import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Bell, Bot, ChevronLeft, Download, LayoutDashboard, LineChart, Search, Settings, Sparkles,
  Workflow, DollarSign, HeartPulse, Plus, X, Home, Activity, Gauge,
} from "lucide-react";
import { Backdrop } from "@/components/Backdrop";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NEXUS AI" },
      { name: "description", content: "Live analytics: revenue, AI agents, API throughput and system health." },
      { property: "og:title", content: "NEXUS AI Analytics Dashboard" },
      { property: "og:description", content: "Real-time revenue, agent and telemetry analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tabs = [
  { id: "Overview", icon: LayoutDashboard },
  { id: "AI Workflows", icon: Workflow },
  { id: "Analytics", icon: LineChart },
  { id: "Revenue", icon: DollarSign },
  { id: "System Health", icon: HeartPulse },
  { id: "Settings", icon: Settings },
] as const;
type Tab = (typeof tabs)[number]["id"];

const range = { Daily: 24, Weekly: 7, Monthly: 12 } as const;
type Range = keyof typeof range;

function series(r: Range) {
  const n = range[r];
  const labels =
    r === "Daily" ? Array.from({ length: n }, (_, i) => `${i}:00`)
    : r === "Weekly" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return labels.map((name, i) => ({
    name,
    revenue: Math.round(4000 + Math.sin(i / 1.7) * 1800 + i * 420 + (i * 137) % 900),
    performance: Math.round(3000 + Math.cos(i / 2.1) * 1400 + i * 300 + (i * 91) % 700),
  }));
}

const categories = [
  { name: "Automation", value: 38, color: "var(--primary)" },
  { name: "Telemetry", value: 26, color: "var(--teal)" },
  { name: "Routing", value: 22, color: "var(--cyan)" },
  { name: "Security", value: 14, color: "var(--chart-4)" },
];

const events = [
  ["Agent #402 deployed", "success"], ["API Key Revoked", "danger"], ["Webhook triggered", "info"],
  ["Model routed → Claude", "info"], ["Workflow 'Invoice-Sync' completed", "success"],
  ["Rate limit warning: us-east", "warn"], ["Agent #118 self-corrected", "success"], ["New SSO login", "info"],
] as const;
const badge: Record<string, string> = {
  success: "bg-teal/15 text-teal", danger: "bg-destructive/15 text-destructive",
  info: "bg-primary/15 text-primary", warn: "bg-chart-4/15 text-chart-4",
};

function useLog() {
  type Entry = { id: number; text: string; kind: string; t: string };
  const [log, setLog] = useState<Entry[]>(() =>
    events.slice(0, 6).map((e, i) => ({ id: i, text: e[0], kind: e[1], t: `${i * 7 + 2}s ago` })));
  useEffect(() => {
    let id = 100;
    const iv = setInterval(() => {
      const e = events[Math.floor(Math.random() * events.length)]!;
      const text = e[0].replace(/#\d+/, `#${Math.floor(100 + Math.random() * 900)}`);
      setLog((l) => [{ id: id++, text, kind: e[1], t: "just now" }, ...l].slice(0, 14));
    }, 2600);
    return () => clearInterval(iv);
  }, []);
  return [log, setLog] as const;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass glow-border rounded-2xl p-5 transition duration-500 hover:shadow-glow ${className}`}>{children}</div>;
}

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");
  const [r, setR] = useState<Range>("Weekly");
  const [hidden, setHidden] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [notifs, setNotifs] = useState(3);
  const [log, setLog] = useLog();
  const data = useMemo(() => series(r), [r]);
  const pie = categories.filter((c) => !hidden.includes(c.name));

  const metrics = [
    { label: "Total Revenue", value: "$128.4K", sub: "+14% vs last period", icon: DollarSign, tone: "text-teal" },
    { label: "Active AI Agents", value: "1,420", sub: "Active", icon: Bot, tone: "text-primary" },
    { label: "API Requests/sec", value: "8,214", sub: "99.8% Uptime", icon: Gauge, tone: "text-cyan" },
    { label: "Conversion Rate", value: "4.2%", sub: "+0.6pt this week", icon: Activity, tone: "text-teal" },
  ];

  const exportCsv = () => {
    const csv = ["period,revenue,performance", ...data.map((d) => `${d.name},${d.revenue},${d.performance}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `nexus-report-${r.toLowerCase()}.csv`;
    a.click();
    toast.success("Report exported", { description: `${data.length} rows downloaded as CSV` });
  };

  const Sidebar = (
    <aside className={`glass flex h-full flex-col rounded-3xl p-3 transition-all duration-300 ${collapsed ? "w-[76px]" : "w-64"}`}>
      <div className="flex items-center justify-between px-2 py-3">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="bg-gradient-brand grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
          {!collapsed && <span>NEXUS <span className="text-gradient">AI</span></span>}
        </Link>
      </div>
      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setMobileNav(false); }} title={t.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${tab === t.id ? "bg-sidebar-accent text-foreground shadow-glow" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
            <t.icon className={`h-5 w-5 shrink-0 ${tab === t.id ? "text-primary" : ""}`} />
            {!collapsed && t.id}
          </button>
        ))}
      </nav>
      <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
        <Home className="h-5 w-5 shrink-0" />{!collapsed && "Landing Page"}
      </Link>
      <button onClick={() => setCollapsed(!collapsed)} className="mt-1 hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground lg:flex">
        <ChevronLeft className={`h-5 w-5 shrink-0 transition ${collapsed ? "rotate-180" : ""}`} />{!collapsed && "Collapse"}
      </button>
    </aside>
  );

  const showMain = ["Overview", "Analytics", "Revenue"].includes(tab);
  const showPie = ["Overview", "Analytics", "AI Workflows"].includes(tab);
  const showLog = ["Overview", "AI Workflows", "System Health"].includes(tab);

  return (
    <div className="relative flex min-h-screen gap-4 p-4">
      <Backdrop />
      <div className="sticky top-4 hidden h-[calc(100vh-2rem)] lg:block">{Sidebar}</div>
      {mobileNav && (
        <div className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur lg:hidden" onClick={() => setMobileNav(false)}>
          <div className="h-full w-fit" onClick={(e) => e.stopPropagation()}>{Sidebar}</div>
        </div>
      )}

      <main className="min-w-0 flex-1 space-y-5">
        <header className="glass flex items-center gap-3 rounded-2xl p-3">
          <button onClick={() => setMobileNav(true)} className="grid h-10 w-10 place-items-center rounded-full border lg:hidden" aria-label="Menu">
            <LayoutDashboard className="h-4 w-4" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search agents, workflows, metrics…" className="w-full rounded-full border bg-background/40 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <ThemeToggle />
          <button onClick={() => { setNotifs(0); toast("All caught up", { description: "Notifications marked as read" }); }}
            className="glass relative grid h-10 w-10 place-items-center rounded-full" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {notifs > 0 && <span className="animate-pulse-ring absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-teal font-mono text-[9px] font-bold text-background">{notifs}</span>}
          </button>
          <div className="bg-gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-primary-foreground">FN</div>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">Dashboard Mode</p>
            <h1 className="mt-1 text-3xl font-bold">{tab}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:shadow-glow-teal">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={() => setModal(true)} className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-105">
              <Plus className="h-4 w-4" /> Deploy Agent
            </button>
          </div>
        </div>

        {tab !== "Settings" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((m) => (
              <Card key={m.label}>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <m.icon className={`h-5 w-5 ${m.tone}`} />
                </div>
                <p className="mt-3 font-display text-3xl font-bold">{m.value}</p>
                <p className={`mt-1 font-mono text-xs ${m.tone}`}>{m.sub}</p>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-3">
          {showMain && (
            <Card className="xl:col-span-2">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Revenue & Performance</h3>
                  <p className="text-xs text-muted-foreground">Hover for details</p>
                </div>
                <div className="flex rounded-full border bg-background/40 p-1">
                  {(Object.keys(range) as Range[]).map((k) => (
                    <button key={k} onClick={() => setR(k)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${r === k ? "bg-gradient-brand text-primary-foreground" : "text-muted-foreground"}`}>{k}</button>
                  ))}
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gPerf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gRev)" animationDuration={800} />
                    <Area type="monotone" dataKey="performance" stroke="var(--teal)" strokeWidth={2} fill="url(#gPerf)" animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {showPie && (
            <Card>
              <h3 className="font-semibold">Category Distribution</h3>
              <p className="text-xs text-muted-foreground">Click legend to toggle</p>
              <div className="relative h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pie} dataKey="value" innerRadius={60} outerRadius={88} paddingAngle={4} stroke="none">
                      {pie.map((c) => <Cell key={c.name} fill={c.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} itemStyle={{ color: "var(--foreground)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div><p className="font-display text-2xl font-bold">{pie.reduce((s, c) => s + c.value, 0)}%</p><p className="text-xs text-muted-foreground">shown</p></div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((c) => {
                  const off = hidden.includes(c.name);
                  return (
                    <button key={c.name} onClick={() => setHidden((h) => off ? h.filter((x) => x !== c.name) : [...h, c.name])}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition ${off ? "opacity-40" : "bg-background/40"}`}>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.name}
                      <span className="ml-auto font-mono text-muted-foreground">{c.value}%</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {showLog && (
            <Card className={showPie && !showMain ? "xl:col-span-2" : showMain && showPie ? "xl:col-span-3" : "xl:col-span-3"}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Live Activity Stream</h3>
                <span className="flex items-center gap-2 font-mono text-xs text-teal"><span className="animate-pulse-ring h-2 w-2 rounded-full bg-teal" />LIVE</span>
              </div>
              <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {log.map((e) => (
                  <li key={e.id} className="animate-slide-down flex items-center gap-3 rounded-xl border bg-background/30 px-3 py-2.5 text-sm">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${badge[e.kind]}`}>{e.kind}</span>
                    <span className="flex-1 truncate">{e.text}</span>
                    <span className="font-mono text-xs text-muted-foreground">{e.t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {tab === "System Health" && (
            <Card className="xl:col-span-3">
              <h3 className="mb-4 font-semibold">Regions</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[["us-east-1", 99.99, 42], ["eu-west-2", 99.97, 58], ["ap-south-1", 99.81, 77]].map(([reg, up, load]) => (
                  <div key={reg as string} className="rounded-xl border bg-background/30 p-4">
                    <p className="font-mono text-sm">{reg}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{up}% uptime · {load}% load</p>
                    <div className="mt-3 h-2 rounded-full bg-muted"><div className="bg-gradient-brand h-2 rounded-full" style={{ width: `${load}%` }} /></div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "Settings" && (
            <Card className="xl:col-span-3">
              <h3 className="mb-4 font-semibold">Workspace Settings</h3>
              <div className="space-y-3">
                {["Real-time alerts", "Auto-scale agents", "Zero data retention", "Weekly digest email"].map((s, i) => (
                  <SettingRow key={s} label={s} initial={i !== 3} />
                ))}
                <div className="flex items-center justify-between rounded-xl border bg-background/30 p-4">
                  <span className="text-sm">Theme</span><ThemeToggle />
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {modal && (
        <DeployModal
          onClose={() => setModal(false)}
          onDeploy={(name, model) => {
            setModal(false);
            setLog((l) => [{ id: Date.now(), text: `Agent "${name}" deployed on ${model}`, kind: "success", t: "just now" }, ...l]);
            toast.success("Agent deployed", { description: `${name} is now live on ${model}` });
          }}
        />
      )}
    </div>
  );
}

function SettingRow({ label, initial }: { label: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between rounded-xl border bg-background/30 p-4">
      <span className="text-sm">{label}</span>
      <button onClick={() => { setOn(!on); toast(`${label} ${!on ? "enabled" : "disabled"}`); }}
        className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-brand shadow-glow" : "bg-muted"}`} aria-pressed={on}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function DeployModal({ onClose, onDeploy }: { onClose: () => void; onDeploy: (n: string, m: string) => void }) {
  const [name, setName] = useState("Revenue-Forecaster");
  const [model, setModel] = useState("Auto-route");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass glow-border glow-border-on w-full max-w-md rounded-3xl p-7 shadow-glow animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Deploy New AI Agent</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <label className="mt-6 block text-sm text-muted-foreground">Agent name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border bg-background/40 px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        <label className="mt-4 block text-sm text-muted-foreground">Model</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {["Auto-route", "GPT-5", "Claude", "Gemini"].map((m) => (
            <button key={m} onClick={() => setModel(m)}
              className={`rounded-xl border px-3 py-2.5 text-sm transition ${model === m ? "border-primary bg-primary/15 text-foreground" : "bg-background/30 text-muted-foreground"}`}>{m}</button>
          ))}
        </div>
        <button disabled={!name.trim()} onClick={() => onDeploy(name.trim(), model)}
          className="bg-gradient-brand mt-7 w-full rounded-full py-3 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-50">
          Deploy Agent
        </button>
      </div>
    </div>
  );
}
