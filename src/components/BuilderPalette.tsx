import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PALETTE } from '../data/flow';
import { Plus, Workflow, Trash2, MousePointerClick, Check } from 'lucide-react';

interface PlacedNode { uid: number; paletteId: string; }

const ACCENTS: Record<string, string> = {
  TRIGGER: 'from-[#8B5CF6] to-[#6D28D9] text-white',
  COMPUTE: 'from-[#FFD84D] to-[#D4910A] text-[#2A1E00]',
  ACTION: 'from-[#38BDF8] to-[#0369A1] text-white',
  LOGIC: 'from-[#34D399] to-[#047857] text-[#03150C]',
  EVENT: 'from-[#FB7185] to-[#BE123D] text-white',
};

export default function BuilderPalette() {
  const [placed, setPlaced] = useState<PlacedNode[]>([
    { uid: 1, paletteId: 'webhook2' },
    { uid: 2, paletteId: 'pyfn' },
    { uid: 3, paletteId: 'guard' },
  ]);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [deployed, setDeployed] = useState(false);
  const uidRef = { current: 4 };

  const byId = useMemo(() => Object.fromEntries(PALETTE.map((p) => [p.id, p])), []);

  const add = (paletteId: string) => {
    if (placed.length >= 7) return;
    setPlaced((p) => [...p, { uid: uidRef.current++, paletteId }]);
    setJustAdded(Date.now());
    window.setTimeout(() => setJustAdded(null), 650);
  };
  const remove = (uid: number) => setPlaced((p) => p.filter((n) => n.uid !== uid));
  const deploy = () => { setDeployed(true); window.setTimeout(() => setDeployed(false), 2400); };

  return (
    <div className="ff-panel overflow-hidden">
      <div className="flex items-center gap-3 border-b hairline bg-[rgba(20,16,36,.55)] px-5 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] to-[#5B21B6] text-white"><Workflow size={14} strokeWidth={2.2} /></span>
        <p className="text-[12px] font-semibold text-[#F4F1FC]">Visual Builder <span className="font-normal text-[#8B84AB]">— click blocks to compose a flow</span></p>
        <button onClick={deploy} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#FFE066] to-[#D4910A] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#241A00] shadow-[0_4px_18px_rgba(245,197,24,.4)] transition hover:brightness-105">
          {deployed ? <><Check size={11} strokeWidth={3.5} /> Deployed · live in 0.8s</> : <><Plus size={11} strokeWidth={3.5} /> Deploy flow</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.35fr]">
        {/* palette */}
        <div className="border-b hairline p-4 lg:border-b-0 lg:border-r">
          <p className="mb-2 flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[.2em] text-[#8B84AB]"><MousePointerClick size={10} /> step library · {PALETTE.length} blocks</p>
          <div className="grid grid-cols-2 gap-1.5">
            {PALETTE.map((p) => {
              const Icon = p.icon;
              return (
                <button key={p.id} onClick={() => add(p.id)} disabled={placed.length >= 7}
                  className="group flex items-center gap-2 rounded-xl border hairline bg-[rgba(26,21,48,.5)] p-2 text-left transition-all duration-200 hover:border-[rgba(245,197,24,.4)] hover:bg-[rgba(40,32,72,.6)] hover:-translate-y-0.5 disabled:opacity-40">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${ACCENTS[p.tag]}`}><Icon size={13} strokeWidth={2.1} /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-[9.5px] font-semibold leading-tight text-[#EDEAF8]">{p.label}</span>
                    <span className="block truncate text-[7.5px] text-[#7B739E]">{p.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* canvas strip */}
        <div className="flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono2 text-[9px] uppercase tracking-[.2em] text-[#8B84AB]">your flow · {placed.length}/7 steps</p>
            <button onClick={() => setPlaced([])} className="flex items-center gap-1 font-mono2 text-[8.5px] uppercase tracking-widest text-[#6E6694] transition hover:text-rose-300"><Trash2 size={10} /> clear</button>
          </div>
          <div className="ff-dots flex min-h-[132px] flex-1 flex-wrap content-start items-center gap-1.5 rounded-2xl border border-dashed border-[rgba(197,172,255,.2)] bg-[rgba(8,6,17,.5)] p-3">
            <AnimatePresence mode="popLayout">
              {placed.map((n) => {
                const p = byId[n.paletteId];
                const Icon = p.icon;
                return (
                  <motion.div
                    key={n.uid}
                    layout
                    initial={{ opacity: 0, scale: 0.4, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className="group relative flex items-center gap-1.5 rounded-xl border border-[rgba(197,172,255,.22)] bg-gradient-to-br from-[#221C40] to-[#161029] py-1.5 pl-1.5 pr-2 shadow-[0_6px_20px_rgba(0,0,0,.4)]"
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${ACCENTS[p.tag]}`}><Icon size={12} strokeWidth={2.2} /></span>
                    <span className="max-w-[72px]">
                      <span className="block truncate text-[8.5px] font-semibold leading-tight text-[#EDEAF8]">{p.label}</span>
                      <span className="block font-mono2 text-[6.5px] text-[#6E6694]">{p.tag}</span>
                    </span>
                    <button onClick={() => remove(n.uid)} aria-label={`Remove ${p.label}`} className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-rose-400/50 bg-[#2B0A18] text-[10px] leading-none text-rose-300 opacity-0 transition-opacity duration-150 hover:bg-[#3E0E22] group-hover:opacity-100 focus-visible:opacity-100">×</button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {placed.length === 0 && <p className="m-auto font-mono2 text-[10px] text-[#57507C]">canvas empty — add a trigger to begin</p>}
          </div>
          <div className="mt-2 flex items-center gap-3 overflow-hidden">
            <p className="font-mono2 text-[8px] text-[#57507C]">{placed.length >= 7 ? 'MAX DEPTH — flow ready to ship' : `pipeline depth ${placed.length} · avg step 41ms · deploys to 34 edge regions`}</p>
            {justAdded && <span className="ml-auto font-mono2 text-[8px] text-emerald-400">+ step added ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
