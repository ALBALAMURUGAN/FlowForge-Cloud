import { DAILY_RUNS, FAILURE_MODES } from '../data/flow';
import { Counter } from './primitives';
import { TrendingUp, Activity, ShieldCheck, TimerReset } from 'lucide-react';

function AreaChart() {
  const w = 560, h = 150, pad = 6;
  const max = Math.max(...DAILY_RUNS) * 1.08;
  const pts = DAILY_RUNS.map((v, i) => {
    const x = pad + (i / (DAILY_RUNS.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h - pad} L${pts[0][0].toFixed(1)},${h - pad} Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Executions per day, last 14 days">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5C518" stopOpacity=".32" />
          <stop offset=".55" stopColor="#8B5CF6" stopOpacity=".12" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset=".45" stopColor="#C4B5FD" />
          <stop offset=".6" stopColor="#FFE066" />
          <stop offset="1" stopColor="#F5C518" />
        </linearGradient>
      </defs>
      {[0.33, 0.66, 1].map((f, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={(h - pad) * f} y2={(h - pad) * f} stroke="rgba(197,172,255,.08)" strokeDasharray="3 5" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="url(#lineGold)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(245,197,24,.35))' }} />
      <circle cx={lx} cy={ly} r="3.4" fill="#FFE066" stroke="#0A0714" strokeWidth="1.6">
        <animate attributeName="r" values="3.4;5.2;3.4" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const total = DAILY_RUNS.reduce((a, b) => a + b, 0);
  return (
    <div className="ff-panel overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 border-b hairline bg-[rgba(20,16,36,.55)] px-5 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFD84D] to-[#B45309] text-[#231A02]"><Activity size={14} strokeWidth={2.4} /></span>
        <div>
          <p className="text-[12px] font-semibold text-[#F4F1FC]">Performance Intelligence</p>
          <p className="font-mono2 text-[9px] uppercase tracking-[.16em] text-[#7B739E]">last 14 days · production workspace · all regions</p>
        </div>
        <span className="chip ml-auto !border-emerald-400/25 !text-emerald-300"><TrendingUp size={11} /> +13.4% vs prior period</span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[rgba(197,172,255,.07)] sm:grid-cols-4">
        {[
          { icon: Activity, v: total, suffix: '', label: 'executions', d: '+13.4% WoW', dec: 0 },
          { icon: ShieldCheck, v: 99.97, suffix: '%', label: 'success rate', d: 'SLO 99.9 met', dec: 2 },
          { icon: TimerReset, v: 812, suffix: 'ms', label: 'p50 latency', d: 'p99 1.9s', dec: 0 },
          { icon: TrendingUp, v: 1.84, suffix: 'M', label: 'auto-recoveries', d: 'this month', dec: 2 },
        ].map(({ icon: Icon, v, suffix, label, d, dec }, i) => (
          <div key={i} className="bg-[#120E22] px-4 py-4">
            <Icon size={13} className="mb-1.5 text-[#A78BFA]" strokeWidth={2.2} />
            <p className="font-display text-xl leading-none text-[#F4F1FC]"><Counter to={v} decimals={dec} suffix={suffix} duration={1.6} /></p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.14em] text-[#8B84AB]">{label}</p>
            <p className="text-[8.5px] text-emerald-400/90">{d}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
        {/* chart */}
        <div className="border-b hairline p-5 lg:border-b-0 lg:border-r">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#8B84AB]">Executions / day</p>
            <p className="font-mono2 text-[9px] text-[#6E6694]">peak 634,200 · oct 23</p>
          </div>
          <div className="h-[150px] w-full"><AreaChart /></div>
          <div className="mt-1.5 flex justify-between font-mono2 text-[8px] text-[#57507C]"><span>OCT 10</span><span>OCT 14</span><span>OCT 17</span><span>OCT 20</span><span>OCT 23</span></div>
        </div>

        {/* failure modes */}
        <div className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#8B84AB]">Where failures come from</p>
          <div className="mt-2.5 space-y-2">
            {FAILURE_MODES.map((f) => (
              <div key={f.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[9.5px] text-[#BDB5DD]">{f.label}</span>
                  <span className="font-mono2 text-[9px] text-[#FFD84D]">{f.pct}%</span>
                </div>
                <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-[rgba(197,172,255,.09)]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#F5C518]" style={{ width: `${f.pct}%`, boxShadow: '0 0 8px rgba(167,139,250,.4)' }} />
                </div>
                <p className="mt-0.5 font-mono2 text-[7.5px] text-[#57507C]">→ {f.heal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
