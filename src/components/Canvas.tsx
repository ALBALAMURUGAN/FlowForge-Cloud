import type { NodeStatus } from '../data/flow';
import { FLOW_NODES, NODE_W, NODE_H, CANVAS_W, CANVAS_H } from '../data/flow';
import { Check, X, Loader2, Clock3, Ban, RotateCw } from 'lucide-react';

/* Status → visual language */
const STATUS_STYLE: Record<NodeStatus, { ring: string; chip: string; glow?: string }> = {
  idle:     { ring: 'rgba(197,172,255,.16)',  chip: 'rgba(197,172,255,.14)', },
  queued:   { ring: 'rgba(148,197,255,.4)',   chip: 'rgba(125,211,252,.16)' },
  running:  { ring: '#F5C518',                chip: 'rgba(245,197,24,.2)',  glow: '0 0 0 1px rgba(245,197,24,.55), 0 0 44px rgba(245,197,24,.28), 0 18px 50px rgba(0,0,0,.5)' },
  success:  { ring: 'rgba(52,211,153,.55)',   chip: 'rgba(52,211,153,.16)' },
  failed:   { ring: '#FB7185',                chip: 'rgba(251,113,133,.18)', glow: '0 0 0 1px rgba(251,113,133,.6), 0 0 44px rgba(244,63,94,.35), 0 18px 50px rgba(0,0,0,.5)' },
  retrying: { ring: '#FFD84D',                chip: 'rgba(255,216,77,.2)',  glow: '0 0 0 1px rgba(255,216,77,.6), 0 0 44px rgba(245,197,24,.3), 0 18px 50px rgba(0,0,0,.5)' },
  skipped:  { ring: 'rgba(155,148,184,.22)',  chip: 'rgba(155,148,184,.12)' },
};

function StatusBadge({ status }: { status: NodeStatus }) {
  if (status === 'running' || status === 'retrying')
    return <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: STATUS_STYLE[status].chip }}><Loader2 size={12} strokeWidth={2.6} className="animate-spin text-[#FFD84D]" /></span>;
  if (status === 'success')
    return <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(52,211,153,.15)]"><Check size={12} strokeWidth={3} className="text-emerald-400" /></span>;
  if (status === 'failed')
    return <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(251,113,133,.16)]"><X size={12} strokeWidth={3} className="text-rose-400" /></span>;
  if (status === 'queued')
    return <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(125,211,252,.14)]"><Clock3 size={11} strokeWidth={2.4} className="text-sky-300" /></span>;
  if (status === 'skipped')
    return <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(155,148,184,.12)]"><Ban size={11} strokeWidth={2.4} className="text-[#8B84AB]" /></span>;
  return <span className="h-5 w-5 rounded-full border border-dashed border-[rgba(197,172,255,.25)]" />;
}

const ACCENT: Record<string, string> = {
  violet: 'from-[#8B5CF6] to-[#6D28D9]',
  gold: 'from-[#FFD84D] to-[#D4910A]',
  emerald: 'from-[#34D399] to-[#059669]',
  rose: 'from-[#FB7185] to-[#E11D48]',
  sky: 'from-[#7DD3FC] to-[#0284C7]',
};

export default function Canvas({
  statuses,
  selectedId,
  onSelect,
  compact = false,
}: {
  statuses: Record<string, NodeStatus>;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  compact?: boolean;
}) {
  const H = CANVAS_H;
  const center = (n: { y: number }) => n.y + NODE_H / 2;

  return (
    <div className="relative w-full">
      <div className="relative w-full overflow-hidden rounded-2xl ff-dots" style={{ aspectRatio: `${CANVAS_W} / ${H}` }}>
        {/* ambient glows */}
        <div aria-hidden className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,.22) 0%, transparent 70%)' }} />
        <div aria-hidden className="absolute right-[-3rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,197,24,.14) 0%, transparent 70%)' }} />

        {/* SVG edges */}
        <svg viewBox={`0 0 ${CANVAS_W} ${H}`} className="absolute inset-0 h-full w-full" fill="none">
          {FLOW_NODES.slice(0, -1).map((n, i) => {
            const next = FLOW_NODES[i + 1];
            const x1 = n.x + NODE_W, y1 = center(n), x2 = next.x, y2 = center(next);
            const mx = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
            const fromStatus = statuses[n.id];
            const lit = fromStatus === 'success';
            const broken = fromStatus === 'failed';
            const activeEdge = statuses[n.id] === 'running' || statuses[n.id] === 'retrying';
            const stroke = broken ? 'rgba(251,113,133,.65)' : lit ? 'url(#edgeGold)' : activeEdge ? '#F5C518' : 'rgba(197,172,255,.22)';
            return (
              <g key={n.id}>
                <path d={d} stroke={stroke} strokeWidth={broken ? 2 : lit || activeEdge ? 2.4 : 1.6}
                  className={lit || activeEdge ? 'edge-flow' : ''}
                  style={lit || activeEdge ? { filter: 'drop-shadow(0 0 6px rgba(245,197,24,.5))' } : undefined} />
                {lit && (
                  <circle r="3.2" fill="#FFE066" style={{ filter: 'drop-shadow(0 0 5px #F5C518)' }}>
                    <animateMotion dur="1.6s" repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
          <defs>
            <linearGradient id="edgeGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8B5CF6" />
              <stop offset=".55" stopColor="#B98A0B" />
              <stop offset="1" stopColor="#F5C518" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {FLOW_NODES.map((n) => {
          const status = statuses[n.id];
          const s = STATUS_STYLE[status];
          const selected = selectedId === n.id;
          const Icon = n.icon;
          const dim = status === 'skipped' || status === 'idle';
          return (
            <button
              key={n.id}
              onClick={() => onSelect?.(n.id)}
              className="group absolute text-left outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#F5C518] rounded-2xl"
              style={{
                left: `${(n.x / CANVAS_W) * 100}%`,
                top: `${(n.y / H) * 100}%`,
                width: `${(NODE_W / CANVAS_W) * 100}%`,
                height: `${(NODE_H / H) * 100}%`,
                opacity: dim ? 0.55 : 1,
                zIndex: selected ? 20 : 10,
              }}
              aria-label={`${n.label} — ${status}`}
            >
              <div
                className="relative flex h-full w-full flex-col justify-between rounded-2xl border p-2 backdrop-blur-md transition-shadow duration-500"
                style={{
                  borderColor: s.ring,
                  boxShadow: s.glow ?? (selected ? '0 0 0 1.5px rgba(245,197,24,.7), 0 0 34px rgba(245,197,24,.18)' : '0 14px 38px rgba(0,0,0,.45)'),
                  background: 'linear-gradient(160deg, rgba(30,25,54,.96) 0%, rgba(17,13,34,.96) 100%)',
                }}
              >
                {/* running sweep line */}
                {(status === 'running' || status === 'retrying') && (
                  <span aria-hidden className="pointer-events-none absolute inset-x-3 top-0 h-px overflow-hidden">
                    <span className="block h-full w-1/3 animate-[node-sweep_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#FFE066] to-transparent" />
                  </span>
                )}
                <div className="flex items-start justify-between gap-1">
                  <span className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-gradient-to-br text-[#171029] ${ACCENT[n.accent]} shadow-[0_2px_10px_rgba(0,0,0,.4)]`}>
                    <Icon size={compact ? 11 : 13} strokeWidth={2.2} className={n.accent === 'gold' ? 'text-[#2A1E00]' : 'text-white'} />
                  </span>
                  <StatusBadge status={status} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[8px] sm:text-[9.5px] font-semibold leading-tight text-[#F1EEFB]">{n.label}</p>
                  <p className="hidden truncate font-mono2 text-[6.5px] sm:block sm:text-[7px] leading-tight text-[#8B84AB]">{n.sub}</p>
                  <p className="hidden truncate font-mono2 text-[6.5px] sm:block sm:text-[6.5px] leading-tight text-[#6E6694]">{n.meta}</p>
                </div>
                {status === 'retrying' && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD84D] text-[#332400] shadow-[0_0_14px_rgba(255,216,77,.6)]">
                    <RotateCw size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <style>{`@keyframes node-sweep { 0% { transform: translateX(-120%) } 100% { transform: translateX(400%) } }`}</style>
    </div>
  );
}
