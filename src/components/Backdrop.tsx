import { useEffect, useRef } from "react";

/** Animated particle network + floating gradient orbs. */
export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0004,
    }));
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    const move = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    resize();
    addEventListener("resize", resize);
    addEventListener("mousemove", move);
    const color = () => getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    let col = color();
    const iv = setInterval(() => (col = color()), 1000);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      ctx.fillStyle = col;
      ctx.strokeStyle = col;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]!, ax = a.x * w, ay = a.y * h;
        const dm = Math.hypot(ax - mouse.x, ay - mouse.y);
        ctx.globalAlpha = dm < 160 ? 0.9 : 0.4;
        ctx.beginPath(); ctx.arc(ax, ay, 1.4, 0, 7); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]!, d = Math.hypot(ax - b.x * w, ay - b.y * h);
          if (d < 130) {
            ctx.globalAlpha = (1 - d / 130) * 0.18;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf); clearInterval(iv);
      removeEventListener("resize", resize); removeEventListener("mousemove", move);
    };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="orb left-[-10%] top-[-10%] h-[40rem] w-[40rem] bg-primary" />
      <div className="orb right-[-15%] top-[20%] h-[34rem] w-[34rem] bg-teal [animation-delay:-5s]" />
      <div className="orb bottom-[-20%] left-[30%] h-[30rem] w-[30rem] bg-cyan [animation-delay:-9s]" />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}
