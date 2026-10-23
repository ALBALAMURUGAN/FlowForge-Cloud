import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import { FLOW_NODES, failedRunStatuses, idleStatuses, CHARGE_ERROR, type NodeStatus } from '../data/flow';
import { Bug, RotateCw, ChevronRight, CheckCircle2, ShieldAlert, Braces, ListTree, GaugeCircle, ArrowRight, Layers, Eye, Zap, Check } from 'lucide-react';
import { Counter } from './primitives';

type Phase = 'failed' | 'retrying' | 'recovered';
type Tab = 'error' | 'payload' | 'blast';

export default function Debugger() {
  const [phase, setPhase] = useState<Phase>('failed');
  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>(() => failedRunStatuses());
  const [tab, setTab] = useState<Tab>('error');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const retry = () => {
    if (phase !== 'failed') return;
    setPhase('retrying');
    setStatuses((s) => ({ ...s, charge: 'retrying' }));
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(1350, () => setStatuses((s) => ({ ...s, charge: 'success' })));
    at(1750, () => setStatuses((s) => ({ ...s, record: 'running' })));
    at(2300, () => setStatuses((s) => ({ ...s, record: 'success' })));
    at(2620, () => setStatuses((s) => ({ ...s, notify: 'running' })));
    at(3300, () => { setStatuses((s) => ({ ...s, notify: 'success' })); setPhase('recovered'); });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('failed');
    setTab('error');
    setStatuses(failedRunStatuses());
  };

  return (
    <div className="ff-panel relative overflow-hidden">
      {/* chrome */}
      <div className="flex flex-wrap items-center gap-3 border-b hairline bg-[rgba(20,16,36,.55)] px-5 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FB7185] to-[#9F1239] text-white shadow-[0_2px_12px_rgba(244,63,94,.4)]"><Bug size={14} strokeWidth={2.4} /></span>
        <div>
          <p className="text-[12px] font-semibold leading-tight text-[#F4F1FC]">Step Debugger <span className="text-[#8B84AB] font-normal">— run 01J9ZV3K</span></p>
          <p className="font-mono2 text-[9px] uppercase tracking-[.16em] text-[#7B739E]">time-travel · step isolation · partial replay</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {phase === 'recovered' ? (
            <span className="chip !border-emerald-400/30 !text-emerald-300"><Check size={11} strokeWidth={3} /> RECOVERED · 7/7</span>
          ) : (
            <span className="chip !border-rose-400/30 !text-rose-300"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" />STEP 5 OF 7 FAILED</span>
          )}
          <button onClick={reset} className="rounded-full border hairline px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-widest text-[#A79CCB] transition hover:border-[rgba(197,172,255,.35)] hover:text-white">Replay failure</button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.65fr_1fr]">
        {/* canvas side */}
        <div className="border-b hairline p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <Canvas statuses={statuses} selectedId="charge" />
          {/* failure → propagation timeline */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {FLOW_NODES.map((n, i) => {
              const st = statuses[n.id];
              const color = st === 'success' ? '#34D399' : st === 'failed' ? '#FB7185' : st === 'skipped' ? '#5E577F' : st === 'retrying' ? '#FFD84D' : st === 'running' ? '#F5C518' : '#8B84AB';
              return (
                <div key={n.id} className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-all duration-500" style={{ borderColor: `${color}55`, background: `${color}14` }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                    <span className="font-mono2 text-[8.5px] text-[#BDB5DD]">{i + 1}. {n.label.split(' ')[0].toLowerCase()}</span>
                    <span className="font-mono2 text-[8px]" style={{ color }}>{st === 'skipped' ? 'NEVER RAN' : `${n.p50}ms`}</span>
                  </div>
                  {i < FLOW_NODES.length - 1 && <ChevronRight size={11} className="text-[#4A4266]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* inspector side */}
        <div className="flex flex-col p-4 sm:p-5">
          {/* tabs */}
          <div className="flex items-center gap-1 rounded-xl border hairline bg-[rgba(10,7,20,.6)] p-1">
            {([
              { id: 'error', label: 'Why it failed', icon: ShieldAlert },
              { id: 'payload', label: 'Payload', icon: Braces },
              { id: 'blast', label: 'Blast radius', icon: ListTree },
            ] as { id: Tab; label: string; icon: typeof ShieldAlert }[]).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-all duration-200 ${tab === id ? 'bg-[#241D44] text-[#FFD84D] shadow-inner' : 'text-[#8B84AB] hover:text-[#C4B5FD]'}`}>
                <Icon size={11} strokeWidth={2.2} />{label}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-[132px] flex-1">
            {tab === 'error' && (
              <div className="animate-[toast-in_.35s_ease_both]">
                <div className="rounded-xl border border-rose-400/25 bg-[rgba(80,14,32,.28)] p-3">
                  <p className="font-mono2 text-[11px] font-semibold text-rose-300">{CHARGE_ERROR.code}</p>
                  <p className="mt-0.5 font-mono2 text-[9px] text-rose-200/70">{CHARGE_ERROR.reason} · {CHARGE_ERROR.upstream}</p>
                </div>
                <div className="mt-2 rounded-xl border hairline bg-[rgba(8,6,17,.7)] p-3 font-mono2 text-[9px] leading-[1.8] text-[#A79CCB]">
                  {CHARGE_ERROR.stack.map((l, i) => <p key={i} className={i === 0 ? 'text-rose-300/90' : ''}>{l}</p>)}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9B94B8]"><Zap size={10} className="text-[#FFD84D]" />{CHARGE_ERROR.attempt} · idempotency key reused — <span className="text-emerald-400">no double-charge possible</span></p>
              </div>
            )}
            {tab === 'payload' && (
              <div className="animate-[toast-in_.35s_ease_both] rounded-xl border hairline bg-[rgba(8,6,17,.7)] p-3 font-mono2 text-[9.5px] leading-[1.9]">
                <p className="text-[#57507C]">{'{'}</p>
                {CHARGE_ERROR.payload.map((p) => (
                  <p key={p.k} className="pl-4"><span className="text-[#C4B5FD]">"{p.k}"</span><span className="text-[#57507C]">: </span><span className="text-[#FFD84D]">{p.v}</span><span className="text-[#57507C]">,</span></p>
                ))}
                <p className="text-[#57507C]">{'}'}</p>
                <p className="mt-1.5 text-[8.5px] text-[#6E6694]">PII redacted by field policy · full payload retained 30d in run ledger</p>
              </div>
            )}
            {tab === 'blast' && (
              <div className="animate-[toast-in_.35s_ease_both]">
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#8B84AB]">Downstream steps never executed</p>
                <ul className="mt-2 space-y-1.5">
                  {CHARGE_ERROR.blast.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 rounded-lg border hairline bg-[rgba(20,16,36,.5)] px-2.5 py-2 text-[10px] text-[#BDB5DD]">
                      <span className="mt-0.5 font-mono2 text-[9px] text-[#6E6694]">0{i + 1}</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* retry CTA */}
          {phase === 'failed' && (
            <button onClick={retry}
              className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FFD84D] via-[#F5C518] to-[#D4910A] px-4 py-3.5 text-[12px] font-extrabold uppercase tracking-[.1em] text-[#241A00] shadow-[0_10px_38px_rgba(245,197,24,.4)] transition-transform duration-200 hover:scale-[1.02] active:scale-[.98]">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <RotateCw size={15} strokeWidth={2.6} /> Retry step 5
              <ArrowRight size={14} strokeWidth={2.6} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
          {phase === 'retrying' && (
            <div className="mt-3 rounded-xl border border-[#FFD84D]/35 bg-[rgba(245,197,24,.08)] px-4 py-3.5 text-center">
              <p className="flex items-center justify-center gap-2 font-mono2 text-[11px] font-semibold text-[#FFD84D]"><RotateCw size={13} className="animate-spin" /> RE-SNAPSHOTTING · RE-INVOKING CHARGE…</p>
              <p className="mt-1 text-[9px] text-[#9B94AB]">steps 1–4 reused from memo cache — zero upstream re-calls</p>
            </div>
          )}
          {phase === 'recovered' && (
            <div className="animate-[toast-in_.4s_ease_both] mt-3 rounded-xl border border-emerald-400/35 bg-[rgba(6,78,59,.3)] px-4 py-3">
              <p className="flex items-center justify-center gap-2 text-[12px] font-bold text-emerald-300"><CheckCircle2 size={15} /> Step recovered — workflow resumed from step 5</p>
              <p className="mt-1 text-center font-mono2 text-[9px] text-emerald-200/60">record +132ms · notify +608ms · steps 1–4 skipped via memoization</p>
              <button onClick={reset} className="mx-auto mt-2 block font-mono2 text-[9px] uppercase tracking-widest text-emerald-400/80 underline underline-offset-2 hover:text-emerald-300">run again</button>
            </div>
          )}

          {/* outcome stats */}
          <div className="mt-3 grid grid-cols-3 divide-x divide-[rgba(197,172,255,.1)] rounded-xl border hairline bg-[rgba(13,10,25,.6)] py-2.5 text-center">
            {[
              { v: '2.3s', l: 'MTTR with debugger', d: 'vs 47 min paging' },
              { v: '91%', l: 'failures self-heal', d: '3 retries, backoff' },
              { v: '$0', l: 'double-charges', d: 'idempotency keys' },
            ].map((s) => (
              <div key={s.l} className="px-2">
                <p className="font-display text-lg text-[#FFE066]">{s.v}</p>
                <p className="text-[8.5px] font-semibold leading-tight text-[#C9C4E2]">{s.l}</p>
                <p className="text-[7.5px] text-[#6E6694]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* bottom strip — why developers love it */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t hairline bg-[rgba(16,12,32,.6)] px-5 py-2.5">
        {[{ i: Layers, t: 'Time-travel replay' }, { i: Eye, t: 'Live step inspection' }, { i: GaugeCircle, t: 'Per-step p50 / p99' }].map(({ i: Icon, t }, i) => (
          <span key={i} className="flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[.18em] text-[#8B84AB]"><Icon size={11} className="text-[#A78BFA]" />{t}</span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[.18em] text-[#57507C]"><Zap size={11} className="text-[#F5C518]" /> flows healed this month: <Counter to={1841200} duration={2} className="text-[#FFD84D]" /></span>
      </div>
    </div>
  );
}
