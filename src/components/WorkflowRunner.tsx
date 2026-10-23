import { useCallback, useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import { FLOW_NODES, idleStatuses, type NodeStatus } from '../data/flow';
import { Play, RotateCcw, Terminal, Zap } from 'lucide-react';

export interface LogLine { id: number; ts: string; text: string; tone: 'ok' | 'run' | 'err' | 'info' | 'warn' }

export const now = () => new Date().toTimeString().slice(0, 8) + '.' + String(new Date().getMilliseconds()).padStart(3, '0');

export default function WorkflowRunner({
  autoStart = true,
  showLogs = true,
  compact = true,
  onFinish,
}: {
  autoStart?: boolean;
  showLogs?: boolean;
  compact?: boolean;
  onFinish?: (ok: boolean) => void;
}) {
  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>(() => idleStatuses());
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 0, ts: now(), text: 'flowforge runtime v2.4.1 · node20 + python3.12 pools warm', tone: 'info' },
  ]);
  const [running, setRunning] = useState(false);
  const [statusLabel, setStatusLabel] = useState<'idle' | 'running' | 'success'>('idle');
  const timers = useRef<number[]>([]);
  const idRef = useRef(1);
  const logBox = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  const pushLog = useCallback((text: string, tone: LogLine['tone']) => {
    setLogs((prev) => [...prev.slice(-40), { id: idRef.current++, ts: now(), text, tone }]);
  }, []);

  useEffect(() => {
    if (logBox.current) logBox.current.scrollTop = logBox.current.scrollHeight;
  }, [logs]);

  const clearTimers = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  useEffect(() => clearTimers, []);

  const run = useCallback(() => {
    clearTimers();
    setStatuses(idleStatuses());
    setRunning(true);
    runningRef.current = true;
    setStatusLabel('running');
    setLogs([{ id: idRef.current++, ts: now(), text: '▸ execution plan built · 7 steps · 3 retries armed on charge', tone: 'info' }]);

    const at = (ms: number, fn: () => void) => {
      const t = window.setTimeout(fn, ms);
      timers.current.push(t);
    };
    const setStatus = (id: string, s: NodeStatus) => setStatuses((p) => ({ ...p, [id]: s }));

    let t = 320;
    pushLog('trigger received · POST /hooks/orders/shopify', 'info');

    FLOW_NODES.forEach((node) => {
      const speed = node.p50;
      const runningMs = Math.max(280, Math.min(560, speed + 210));
      const start = t;
      at(start, () => { setStatus(node.id, 'running'); pushLog(node.logs.run, 'run'); });
      t += runningMs;
      at(t, () => { setStatus(node.id, 'success'); pushLog(node.logs.ok, 'ok'); });
      t += 170;
    });

    at(t + 120, () => {
      setRunning(false);
      runningRef.current = false;
      setStatusLabel('success');
      pushLog('✓ run 01J9Z… completed · 7/7 steps · total 812ms · $0.00021', 'ok');
      onFinish?.(true);
    });
  }, [pushLog, onFinish]);

  /* autoplay loop */
  useEffect(() => {
    if (!autoStart) return;
    const kickoff = window.setTimeout(run, 900);
    const loop = window.setInterval(() => { if (!runningRef.current) run(); }, 15000);
    return () => { window.clearTimeout(kickoff); window.clearInterval(loop); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const dot = statusLabel === 'success' ? '#34D399' : running ? '#F5C518' : '#8B84AB';

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(197,172,255,.18)] bg-[rgba(13,10,25,.88)] shadow-[0_40px_120px_rgba(0,0,0,.6),inset_0_1px_0_rgba(233,213,255,.08)] backdrop-blur-xl">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-[rgba(197,172,255,.1)] bg-[rgba(20,16,36,.7)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-3 hidden items-center gap-2 rounded-md border border-[rgba(197,172,255,.12)] bg-[rgba(10,7,20,.6)] px-3 py-1 font-mono2 text-[10px] text-[#A79CCB] sm:flex">
          <Zap size={10} className="text-[#F5C518]" /> app.flowforge.dev/workflows/order-fulfilment
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="chip !py-1 !text-[9px]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />{statusLabel === 'running' ? 'EXECUTING' : statusLabel === 'success' ? 'RUN SUCCEEDED' : 'READY'}</span>
          <button
            onClick={run}
            disabled={running}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-[rgba(245,197,24,.35)] bg-[rgba(245,197,24,.12)] text-[#FFD84D] transition hover:bg-[rgba(245,197,24,.22)] disabled:opacity-40"
            aria-label="Replay run"
          >
            {running ? <RotateCcw size={11} className="animate-spin" /> : <Play size={11} fill="currentColor" />}
          </button>
        </div>
      </div>

      <div className="p-3">
        <Canvas statuses={statuses} compact={compact} />

        {showLogs && (
          <div className="mt-3 rounded-xl border border-[rgba(197,172,255,.1)] bg-[rgba(8,6,17,.85)]">
            <div className="flex items-center justify-between border-b border-[rgba(197,172,255,.08)] px-3 py-1.5">
              <span className="flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[.18em] text-[#8B84AB]"><Terminal size={10} /> live execution log</span>
              <span className="font-mono2 text-[9px] text-[#6E6694]">run_01J9ZW4E…</span>
            </div>
            <div ref={logBox} className="h-[104px] overflow-y-auto px-3 py-2 font-mono2 text-[9.5px] leading-[1.75]">
              {logs.map((l) => (
                <div key={l.id} className="flex gap-2 whitespace-nowrap">
                  <span className="text-[#57507C]">{l.ts}</span>
                  <span className={
                    l.tone === 'ok' ? 'text-emerald-400' :
                    l.tone === 'err' ? 'text-rose-400' :
                    l.tone === 'warn' ? 'text-amber-300' :
                    l.tone === 'run' ? 'text-[#C4B5FD]' : 'text-[#7B739E]'
                  }>{l.text}</span>
                </div>
              ))}
              {running && <span className="caret-blink text-[#FFD84D]">▊</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
