import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView } from 'framer-motion';

/* Animated number that counts up when scrolled into view */
export function Counter({
  to, duration = 1.8, decimals = 0, prefix = '', suffix = '', className = '',
}: { to: number; duration?: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(2, -9 * t);
      setValue(to * (t === 1 ? 1 : eased / (1 - Math.pow(2, -9))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span ref={ref} className={className}>{prefix}{formatted}{suffix}</span>;
}

/* Section eyebrow + serif headline */
export function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display font-light text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.06] tracking-[-0.01em] mt-5 text-[#F1EEFB]">
        {title}
      </h2>
      {sub && <p className="mt-5 text-[15px] leading-7 text-[#9B94B8] max-w-xl">{sub}</p>}
    </div>
  );
}

/* Circular percentage gauge */
export function Gauge({ pct, size = 132, stroke = 9, label, sub }: { pct: number; size?: number; stroke?: number; label?: string; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [off, setOff] = useState(c);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setOff(c * (1 - pct / 100)), 120);
      return () => clearTimeout(t);
    }
  }, [inView, pct, c]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(197,172,255,.09)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={r} stroke="url(#gaugeGold)" strokeWidth={stroke} fill="none"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} className="gauge-ring"
            style={{ filter: 'drop-shadow(0 0 10px rgba(245,197,24,.45))' }}
          />
          <defs>
            <linearGradient id="gaugeGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="45%" stopColor="#F5C518" />
              <stop offset="100%" stopColor="#C9930B" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[1.65rem] leading-none text-[#FFF6D8]">
            <Counter to={pct} decimals={pct % 1 ? 2 : 0} duration={1.6} />
            <span className="text-[1rem] align-top text-[#F5C518]">%</span>
          </span>
        </div>
      </div>
      {label && <p className="mt-3 text-[13px] font-semibold text-[#EDEAF8]">{label}</p>}
      {sub && <p className="text-[11px] text-[#8B84AB] mt-0.5 text-center leading-4">{sub}</p>}
    </div>
  );
}
