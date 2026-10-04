import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { toast } from "sonner";
import {
  ArrowRight, Bot, Check, Cpu, Activity, ShieldCheck, Network, Sparkles, Menu, X,
} from "lucide-react";
import { Backdrop } from "@/components/Backdrop";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXUS AI — Agentic Intelligence & Real-Time Analytics" },
      { name: "description", content: "Empower your workflow with autonomous AI agents and real-time predictive insights." },
      { property: "og:title", content: "NEXUS AI — Agentic Intelligence & Real-Time Analytics" },
      { property: "og:description", content: "Autonomous AI agents and real-time predictive insights for modern teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Tilt({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current!.style.transform = `perspective(1000px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(0)`;
  };
  const reset = () => (ref.current!.style.transform = "perspective(1000px) rotateX(0) rotateY(0)");
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}

const nav = [
  ["Features", "#features"], ["Solutions", "#solutions"], ["Pricing", "#pricing"],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 shadow-glow">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="bg-gradient-brand grid h-8 w-8 place-items-center rounded-lg text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
          NEXUS <span className="text-gradient">AI</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {nav.map(([l, h]) => <a key={l} href={h} className="transition hover:text-foreground">{l}</a>)}
          <Link to="/dashboard" className="transition hover:text-foreground">Analytics Demo</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/dashboard" className="bg-gradient-brand hidden rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-105 sm:inline-flex">
            Launch Dashboard
          </Link>
          <button className="glass grid h-10 w-10 place-items-center rounded-full md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="glass animate-slide-down mx-auto mt-2 flex max-w-6xl flex-col gap-3 rounded-2xl p-5 md:hidden">
          {nav.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
          <Link to="/dashboard" className="bg-gradient-brand rounded-full px-5 py-2.5 text-center font-semibold text-primary-foreground">Launch Dashboard</Link>
        </div>
      )}
    </header>
  );
}

function HeroMockup() {
  const bars = [40, 65, 48, 80, 58, 92, 74, 88, 62, 96, 78, 100];
  return (
    <Tilt max={14} className="relative mx-auto w-full max-w-xl">
      <div className="glass glow-border glow-border-on relative rounded-3xl p-6 shadow-glow">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">LIVE REVENUE</p>
            <p className="font-display text-3xl font-bold">$128,420</p>
          </div>
          <span className="rounded-full bg-teal/15 px-3 py-1 font-mono text-xs text-teal">+14.2%</span>
        </div>
        <div className="flex h-40 items-end gap-2">
          {bars.map((b, i) => (
            <div key={i} className="bg-gradient-brand flex-1 rounded-t-md opacity-80 transition-all hover:opacity-100" style={{ height: `${b}%` }} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[["Agents", "1,420"], ["Req/s", "8.2K"], ["Uptime", "99.8%"]].map(([k, v]) => (
            <div key={k} className="rounded-xl border bg-background/40 p-3">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">{k}</p>
              <p className="font-display font-semibold">{v}</p>
            </div>
          ))}
        </div>
        {[["top-[38%] left-[30%]"], ["top-[52%] left-[72%]"], ["top-[30%] left-[88%]"]].map(([pos], i) => (
          <span key={i} className={`animate-pulse-ring absolute h-3 w-3 rounded-full bg-teal ${pos}`} />
        ))}
      </div>
      <div className="glass animate-float absolute -bottom-8 -left-6 hidden rounded-2xl p-4 sm:block">
        <p className="flex items-center gap-2 text-sm"><Bot className="h-4 w-4 text-teal" /> Agent #402 deployed</p>
      </div>
      <div className="glass animate-float absolute -right-4 -top-6 hidden rounded-2xl p-3 [animation-delay:-3s] sm:block">
        <p className="font-mono text-xs text-primary">● GPT-5 → Claude routed</p>
      </div>
    </Tilt>
  );
}

const features = [
  { icon: Cpu, title: "Autonomous Workflow Automation", body: "Agents that plan, act and self-correct across your entire stack.", tone: "text-primary" },
  { icon: Activity, title: "Real-Time Telemetry", body: "Millisecond-level streaming insights with predictive anomaly alerts.", tone: "text-teal" },
  { icon: ShieldCheck, title: "Enterprise Security", body: "SOC 2, SSO, audit trails and zero-retention model routing.", tone: "text-cyan" },
  { icon: Network, title: "Multi-LLM Routing", body: "Route every request to the best model for cost, speed and quality.", tone: "text-primary" },
];

const tiers = [
  { name: "Starter", price: 29, desc: "For solo builders", items: ["5 AI agents", "100K requests/mo", "Basic analytics", "Email support"] },
  { name: "Pro", price: 99, desc: "For scaling teams", popular: true, items: ["50 AI agents", "5M requests/mo", "Real-time telemetry", "Multi-LLM routing", "Priority support"] },
  { name: "Enterprise", price: 399, desc: "For global orgs", items: ["Unlimited agents", "Unlimited requests", "Dedicated cluster", "SSO & audit logs", "24/7 SLA"] },
];

function Landing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Backdrop />
      <Header />

      <section className="mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-36 lg:grid-cols-2 lg:pt-44">
        <div className="animate-fade-in">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse-ring" /> v4.0 · Agentic Engine is live
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Next-Gen Agentic Intelligence</span> & Real-Time Data Analytics
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Empower your workflow with autonomous AI agents and real-time predictive insights.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => toast.success("Free trial activated", { description: "14 days of NEXUS Pro, on us." })}
              className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:scale-105"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/dashboard" className="glass rounded-full px-7 py-3.5 font-semibold transition hover:shadow-glow-teal">
              View Live Dashboard
            </Link>
          </div>
        </div>
        <HeroMockup />
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">Capabilities</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">An operating system for autonomous work</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <Tilt key={f.title} max={8}>
              <div className="glass glow-border group h-full rounded-3xl p-8 transition duration-500 hover:-translate-y-1 hover:shadow-glow">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border bg-background/50 transition group-hover:scale-110 group-hover:rotate-6">
                  <f.icon className={`h-6 w-6 ${f.tone}`} />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.body}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      <section id="solutions" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16">
        <div className="glass grid gap-8 rounded-3xl p-10 sm:grid-cols-3">
          {[["12B+", "Tokens routed monthly"], ["3.4×", "Faster ops cycles"], ["99.98%", "Platform uptime"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-gradient font-display text-4xl font-bold">{v}</p>
              <p className="mt-1 text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Scale intelligence, not cost</h2>
          <div className="relative mt-8 inline-flex">
            <div className="glass inline-flex rounded-full p-1">
              {["Monthly", "Yearly"].map((l, i) => (
                <button key={l} onClick={() => setYearly(i === 1)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition ${yearly === (i === 1) ? "bg-gradient-brand text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
                  {l}
                </button>
              ))}
            </div>
            <span className="animate-float absolute -right-16 -top-5 rounded-full bg-teal px-2.5 py-1 font-mono text-[10px] font-bold text-background">SAVE 20%</span>
          </div>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => {
            const price = yearly ? Math.round(t.price * 0.8) : t.price;
            return (
              <div key={t.name}
                className={`glass glow-border relative flex flex-col rounded-3xl p-8 transition duration-500 hover:-translate-y-2 ${t.popular ? "glow-border-on shadow-glow lg:scale-105" : ""}`}>
                {t.popular && <span className="bg-gradient-brand absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-primary-foreground">Most Popular</span>}
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <p className="mt-6 font-display text-5xl font-bold">${price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.items.map((i) => (
                    <li key={i} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-teal" />{i}</li>
                  ))}
                </ul>
                <button onClick={() => toast.success(`${t.name} plan selected`, { description: yearly ? "Billed yearly" : "Billed monthly" })}
                  className={`mt-8 rounded-full py-3 font-semibold transition hover:scale-[1.02] ${t.popular ? "bg-gradient-brand text-primary-foreground shadow-glow" : "border bg-background/40"}`}>
                  {t.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t px-5 py-10 text-sm text-muted-foreground">
        © 2026 NEXUS AI. Built for the autonomous era.
      </footer>
    </div>
  );
}
