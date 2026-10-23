import { useEffect, useState, type FormEvent } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import WorkflowRunner from './components/WorkflowRunner';
import Debugger from './components/Debugger';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BuilderPalette from './components/BuilderPalette';
import { Counter, Gauge, SectionHeading } from './components/primitives';
import { INTEGRATIONS } from './data/flow';
import {
  ArrowRight, Sparkles, Zap, GitBranch, Boxes, History, ShieldCheck, Globe2,
  Webhook, Timer, CloudUpload, Rocket, Check, X, CircleCheck, ChevronDown,
  Quote, BadgeCheck, Play, Database, Server, FileCode2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   FlowForge Cloud — the serverless workflow automation platform
   ═══════════════════════════════════════════════════════════ */

const AVATARS = ['AR', 'MK', 'JS', 'TP', 'EW'];
const AVATAR_COLORS = ['#7C3AED', '#F5C518', '#0EA5E9', '#EC4899', '#10B981'];

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4200); return () => clearTimeout(t); }, [onClose]);
  return (
    <div role="status" className="animate-toast fixed bottom-6 left-1/2 z-[60] flex w-[min(92vw,430px)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-400/30 bg-[#0D1A14]/95 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,.6),0_0_30px_rgba(52,211,153,.12)] backdrop-blur-xl">
      <CircleCheck size={20} className="shrink-0 text-emerald-400" />
      <p className="text-[12px] leading-5 text-emerald-100">{msg}</p>
      <button onClick={onClose} aria-label="Dismiss" className="ml-auto text-emerald-500 hover:text-emerald-200"><X size={16} /></button>
    </div>
  );
}

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [deploySent, setDeploySent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  const notify = (msg: string) => setToast(msg);

  const submitDeploy = (e: FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(clean)) {
      notify('Please enter a valid work email — e.g. you@company.com');
      return;
    }
    setDeploySent(true);
    notify(`Welcome to FlowForge, ${name.trim() || clean.split('@')[0]}! Your sandbox + 10,000 free runs are provisioning now.`);
    setEmail('');
  };

  return (
    <div id="top" className="relative min-h-screen bg-[#0A0714] text-[#EDEAF8] antialiased">
      <Nav onCta={() => document.getElementById('deploy')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="ff-noise relative overflow-hidden pt-16">
        {/* atmosphere */}
        <div aria-hidden className="absolute inset-0">
          <img src="/img/hero-core.png" alt="" className="h-full w-full object-cover object-[72%_center] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0714] via-[#0A0714]/78 to-[#0A0714]/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0714] via-transparent to-[#0A0714]/60" />
          <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,.28), transparent 70%)' }} />
        </div>

        <div className="ff-container relative z-10 grid items-center gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.02fr_1fr] lg:gap-12 lg:pb-24">
          {/* copy */}
          <div className="min-w-0">
            <a href="#debugger" className="group inline-flex items-center gap-2 rounded-full border border-[rgba(245,197,24,.28)] bg-[rgba(245,197,24,.07)] py-1.5 pl-1.5 pr-3 backdrop-blur-sm transition hover:border-[rgba(245,197,24,.5)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5C518]"><Sparkles size={11} strokeWidth={2.6} className="text-[#241A00]" /></span>
              <span className="text-[10.5px] font-semibold tracking-wide text-[#FFE066]">New — Time-travel Step Debugger</span>
              <ArrowRight size={11} className="text-[#FFD84D] transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            <h1 className="font-display mt-6 font-light leading-[1.02] tracking-[-0.015em]">
              <span className="block text-[2.05rem] text-[#F4F1FC] sm:text-6xl xl:text-[4.35rem]">Ship workflows.</span>
              <span className="block text-[2.05rem] sm:text-6xl xl:text-[4.35rem]"><span className="text-gold-grad sheen">Not servers.</span></span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-[#C9C4E2]">
              FlowForge is the serverless orchestration platform for mission-critical automation.
              Compose multi-step flows visually, trigger them on <span className="text-white">schedules, webhooks, or uploads</span>,
              run them on <span className="text-white">Node &amp; Python functions</span> — and watch every execution, failure, and retry.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => document.getElementById('deploy')?.scrollIntoView({ behavior: 'smooth' })} className="btn-gold">Start building — it's free <ArrowRight size={15} strokeWidth={2.6} /></button>
              <a href="#debugger" className="btn-ghost"><Play size={13} fill="currentColor" /> Watch the debugger</a>
            </div>

            {/* social proof row */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a, i) => (
                  <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0A0714] text-[9px] font-bold text-[#14082B]" style={{ background: AVATAR_COLORS[i] }}>{a}</span>
                ))}
              </div>
              <div className="text-[11px] leading-4 text-[#9B94B8]">
                <p className="font-semibold text-[#EDEAF8]">12,400+ teams in production</p>
                <p>Stripe · Vercel · Notion · Shopify · Ramp</p>
              </div>
            </div>
          </div>

          {/* live runner console */}
          <div className="relative min-w-0">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem]" style={{ background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(124,58,237,.35), transparent 65%)' }} />
            <div className="animate-float">
              <WorkflowRunner compact showLogs />
            </div>
            <div className="mt-3 hidden items-center justify-between rounded-xl border hairline bg-[rgba(13,10,25,.7)] px-4 py-2 backdrop-blur-md lg:flex">
              <span className="flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[.2em] text-[#8B84AB]"><span className="live-dot" /> 1.9M executions — last 24h</span>
              <span className="font-mono2 text-[9px] text-[#57507C]">p50 812ms · p99 1.9s</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ LOGO MARQUEE + STAT BAND ══════════════════════ */}
      <section className="relative overflow-hidden border-y hairline bg-[#0C0917] py-4">
        <div className="flex items-center gap-6">
          <p className="hidden shrink-0 pl-6 font-mono2 text-[9px] uppercase tracking-[.28em] text-[#57507C] md:block">Powering automations at</p>
          <div className="min-w-0 flex-1 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
            <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
              {[...INTEGRATIONS, ...INTEGRATIONS].map((n, i) => (
                <span key={i} className="font-display text-[15px] font-medium tracking-wide text-[#6E6694] transition-colors hover:text-[#FFD84D]">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* big percentage proof band */}
      <section className="relative overflow-hidden border-b hairline bg-gradient-to-b from-[#0C0917] to-[#0A0714]">
        <div className="ff-container grid grid-cols-2 divide-x divide-[rgba(197,172,255,.07)] py-10 md:grid-cols-4">
          {[
            { v: 99.995, suffix: '%', dec: 3, label: 'Platform uptime — trailing 12 months' },
            { v: 1.9, suffix: 'B', dec: 1, label: 'Steps executed since 2023 launch' },
            { v: 812, suffix: 'ms', dec: 0, label: 'Median end-to-end run, cold to committed' },
            { v: 91, suffix: '%', dec: 0, label: 'Failures auto-resolved without a human' },
          ].map((s, i) => (
            <div key={i} className="px-4 text-center md:px-6">
              <p className="font-display text-[1.9rem] leading-none text-[#FFF3C4] sm:text-4xl"><Counter to={s.v} decimals={s.dec} suffix={s.suffix} duration={2} /></p>
              <p className="mx-auto mt-2 max-w-[22ch] text-[9px] leading-4 text-[#8B84AB] sm:text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ PLATFORM / VISUAL BUILDER ══════════════════════ */}
      <section id="product" className="relative overflow-hidden py-20 sm:py-24">
        <div aria-hidden className="absolute right-[-10rem] top-24 h-[28rem] w-[28rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(109,40,217,.2), transparent 70%)' }} />
        <div className="ff-container relative">
          <div className="grid items-end gap-8 lg:grid-cols-[1.25fr_1fr]">
            <div className="min-w-0"><SectionHeading
              eyebrow="Visual Builder"
              title={<>From idea to <span className="text-lilac-grad">production flow</span> in minutes</>}
              sub="Drag triggers, functions, and policies onto a canvas that compiles to a durable, versioned execution plan — deployed globally in one click. No YAML archaeology. No snowflake servers."
            /></div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {['Versioned deploys', 'Git-backed', '34 edge regions', 'Instant rollback'].map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
          <div className="mt-10"><BuilderPalette /></div>
        </div>
      </section>

      {/* ══════════════════════ TRIGGERS ══════════════════════ */}
      <section className="relative border-t hairline bg-[#0C0917] py-16">
        <div className="ff-container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="min-w-0">
            <p className="eyebrow">Every entry point</p>
            <h3 className="font-display mt-4 text-3xl font-light leading-tight text-[#F1EEFB]">One canvas,<br /><span className="text-gold-grad">every trigger.</span></h3>
            <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#9B94B8]">Fire the same flow from an API call, a 3am cron, an S3 object landing, or a customer's file upload. Routing, auth, and backpressure included.</p>
            <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 break-all rounded-xl border border-[#A78BFA]/25 bg-[#8B5CF6]/10 px-4 py-2.5 font-mono2 text-[10.5px] leading-5 text-[#C4B5FD]"><span className="text-[#57507C]">$</span> curl -X POST https://hooks.flowforge.dev/<span className="text-[#FFD84D]">t_8f3ka2</span><span className="caret-blink text-[#FFD84D]">▊</span></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Webhook, title: 'Webhooks', code: 'POST /hooks/:id', desc: 'HMAC-verified, retried, and rate-limited at the edge.', stat: '≤ 40ms ack' },
              { icon: Timer, title: 'Schedules', code: 'cron("*/5 * * * *")', desc: 'Millisecond-accurate cron with jitter and catch-up policies.', stat: 'exactly-once' },
              { icon: CloudUpload, title: 'File uploads', code: 'on: s3://bucket/**', desc: 'S3, GCS & Azure events wire straight into your flow.', stat: 'event-native' },
            ].map(({ icon: Icon, title, code, desc, stat }) => (
              <div key={title} className="group rounded-2xl border hairline bg-gradient-to-b from-[#161129] to-[#110D22] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(245,197,24,.3)] hover:shadow-[0_24px_60px_rgba(0,0,0,.5),0_0_40px_rgba(245,197,24,.06)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2A2148] to-[#1A1430] text-[#FFD84D] ring-1 ring-[rgba(245,197,24,.25)] transition-transform duration-300 group-hover:scale-110"><Icon size={20} strokeWidth={1.9} /></span>
                <p className="mt-4 text-[14px] font-bold text-[#F4F1FC]">{title}</p>
                <p className="mt-0.5 font-mono2 text-[9px] text-[#A78BFA]">{code}</p>
                <p className="mt-2 text-[11px] leading-5 text-[#9B94B8]">{desc}</p>
                <p className="mt-3 inline-flex rounded-md bg-[rgba(245,197,24,.1)] px-2 py-1 font-mono2 text-[8.5px] uppercase tracking-[.18em] text-[#FFD84D]">{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ DEBUGGER (SIGNATURE) ══════════════════════ */}
      <section id="debugger" className="relative overflow-hidden py-20 sm:py-24">
        <img src="/img/cta-nebula.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-[.16]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0714] via-[#0A0714]/40 to-[#0A0714]" />
        <div className="ff-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center" style={{ justifyContent: 'center' }}>The FlowForge Debugger <span className="ml-1 rounded border border-[#F5C518]/40 bg-[#F5C518]/10 px-1.5 py-0.5 text-[8px] text-[#FFD84D]">ONLY ON FLOWFORGE</span></p>
            <h2 className="font-display mt-5 font-light leading-[1.05] text-4xl text-[#F4F1FC] sm:text-5xl">See <span className="text-gold-grad">exactly</span> which step<br />failed — and why.</h2>
            <p className="mx-auto mt-4 max-w-lg text-[14px] leading-6 text-[#9B94B8]">Every run is recorded step-by-step. Rewind to the failure, inspect the payload, replay just that step — and watch the rest of the flow heal itself.</p>
          </div>
          <div className="mt-12"><Debugger /></div>
        </div>
      </section>

      {/* ══════════════════════ ANALYTICS ══════════════════════ */}
      <section id="analytics" className="relative overflow-hidden border-t hairline py-20 sm:py-24">
        <div aria-hidden className="absolute left-[-8rem] top-1/4 h-96 w-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,197,24,.07), transparent 70%)' }} />
        <div className="ff-container relative grid gap-12 lg:grid-cols-[1fr_1.55fr] lg:items-center">
          <div className="min-w-0">
            <SectionHeading eyebrow="Performance intelligence" title={<>Success rates you can <span className="text-lilac-grad">actually trust</span></>} sub="Every step, every queue, every retry — measured. Spot degradation before your customers do, with SLO burn-down alerts wired into Slack and PagerDuty." />
            <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8">
              <Gauge pct={99.97} label="Success rate" sub="trailing 90 days" />
              <Gauge pct={91} label="Auto-healed" sub="zero human touch" size={118} />
              <Gauge pct={87} label="Cache hit rate" sub="enrichment layer" size={104} />
            </div>
          </div>
          <div className="min-w-0"><AnalyticsDashboard /></div>
        </div>
      </section>

      {/* ══════════════════════ BENTO ══════════════════════ */}
      <section className="relative border-t hairline bg-[#0C0917] py-20">
        <div className="ff-container">
          <SectionHeading eyebrow="The platform" title={<>Everything between the <span className="text-gold-grad">trigger</span> and the <span className="text-lilac-grad">side-effect</span></>} />
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            {/* durability big card */}
            <div className="group relative col-span-full overflow-hidden rounded-2xl border hairline bg-gradient-to-br from-[#1D1636] to-[#12102A] p-6 transition-colors duration-300 hover:border-[rgba(245,197,24,.28)] md:col-span-3">
              <div aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#7C3AED]/20 blur-3xl transition duration-500 group-hover:bg-[#7C3AED]/30" />
              <History size={20} className="text-[#A78BFA]" strokeWidth={1.8} />
              <h3 className="mt-3 text-[16px] font-bold text-[#F4F1FC]">Durable execution ledger</h3>
              <p className="mt-1.5 max-w-[46ch] text-[12px] leading-6 text-[#9B94B8]">Every step journaled to PostgreSQL before and after it runs. Crash mid-flight? The runner resumes from the last committed step — never re-executes, never double-charges.</p>
              <div className="mt-4 flex items-center gap-3 font-mono2 text-[9px] text-[#6E6694]"><Database size={11} /> WAL-level audit · 13-mo retention <span className="text-[#3E3757]">•</span> <Server size={11} /> 99.995% durability SLA</div>
            </div>
            {/* retries */}
            <div className="col-span-full rounded-2xl border hairline bg-gradient-to-br from-[#241D10] to-[#171208] p-6 transition-colors duration-300 hover:border-[rgba(245,197,24,.35)] sm:col-span-3 md:col-span-3">
              <GitBranch size={20} className="text-[#FFD84D]" strokeWidth={1.8} />
              <h3 className="mt-3 text-[16px] font-bold text-[#FFF3C4]">Retries that actually work</h3>
              <p className="mt-1.5 text-[12px] leading-6 text-[#B4A98C]">Per-step policy: attempts, backoff curve, jitter, dead-letter queue. 91% of failures never reach a human.</p>
              <p className="mt-3 font-mono2 text-[9px] text-[#8a7648]">retry: [3×] · exp(2s→32s) · jitter ±20% · DLQ → slack</p>
            </div>
            {/* multi-runtime */}
            <div className="col-span-full rounded-2xl border hairline bg-gradient-to-br from-[#121826] to-[#0F1220] p-6 md:col-span-2">
              <Boxes size={20} className="text-[#7DD3FC]" strokeWidth={1.8} />
              <h3 className="mt-3 text-[14px] font-bold text-[#F4F1FC]">Python + Node</h3>
              <p className="mt-1.5 text-[11px] leading-5 text-[#9B94B8]">One runtime contract for both. Shared secrets, queues, and tracing — functions deploy in one click.</p>
              <div className="mt-3 flex gap-1.5 font-mono2 text-[8px] text-[#7DD3FC]"><span className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5">node20</span><span className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5">py3.12</span><span className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5">bun</span></div>
            </div>
            {/* security */}
            <div className="col-span-full rounded-2xl border hairline bg-gradient-to-br from-[#141226] to-[#100E22] p-6 sm:col-span-3 md:col-span-2">
              <ShieldCheck size={20} className="text-emerald-400" strokeWidth={1.8} />
              <h3 className="mt-3 text-[14px] font-bold text-[#F4F1FC]">Zero-trust by default</h3>
              <p className="mt-1.5 text-[11px] leading-5 text-[#9B94B8]">mTLS everywhere, scoped IAM per step, secrets in KMS, SOC 2 Type II + ISO 27001.</p>
            </div>
            {/* edge */}
            <div className="col-span-full rounded-2xl border hairline bg-gradient-to-br from-[#161129] to-[#110D22] p-6 sm:col-span-3 md:col-span-2">
              <Globe2 size={20} className="text-[#C4B5FD]" strokeWidth={1.8} />
              <h3 className="mt-3 text-[14px] font-bold text-[#F4F1FC]">Edge-orchestrated</h3>
              <p className="mt-1.5 text-[11px] leading-5 text-[#9B94B8]">Triggers ack in ≤40ms from 34 regions; compute runs next to your data.</p>
              <p className="mt-3 font-mono2 text-[9px] text-[#A78BFA]">fra1 · iad · sfo · sin · syd · gru +29</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ STACK + QUOTE SPLIT ══════════════════════ */}
      <section className="border-t hairline py-16">
        <div className="ff-container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <p className="eyebrow">Under the hood</p>
            <h3 className="font-display mt-4 text-3xl font-light leading-tight text-[#F1EEFB]">Boring tech.<br /><span className="text-lilac-grad">Extraordinary results.</span></h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { i: FileCode2, n: 'React', d: 'Console UI' },
                { i: Server, n: 'Node.js', d: 'Control plane' },
                { i: Boxes, n: 'Python', d: 'DB & analytics' },
                { i: Zap, n: 'Serverless', d: 'Step compute' },
                { i: GitBranch, n: 'Kafka + SQS', d: 'Queue fabric' },
                { i: Database, n: 'PostgreSQL', d: 'Run ledger' },
              ].map(({ i: Icon, n, d }) => (
                <div key={n} className="rounded-xl border hairline bg-[rgba(20,16,36,.4)] px-3 py-3 text-center transition hover:border-[rgba(197,172,255,.3)]">
                  <Icon size={16} className="mx-auto text-[#FFD84D]" strokeWidth={1.9} />
                  <p className="mt-1.5 text-[11px] font-bold text-[#EDEAF8]">{n}</p>
                  <p className="text-[8px] uppercase tracking-[.14em] text-[#6E6694]">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <figure className="relative rounded-3xl border border-[rgba(245,197,24,.2)] bg-gradient-to-br from-[#1E1830] to-[#141026] p-8 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
            <Quote size={34} className="text-[#F5C518]/30" fill="currentColor" strokeWidth={0} />
            <blockquote className="font-display mt-4 text-[1.35rem] font-light leading-snug text-[#F4F1FC]">
              “FlowForge cut our order-pipeline MTTR from <span className="text-gold-grad">47 minutes to 2.3 seconds</span>. The debugger alone justified the migration — we find the failing step before PagerDuty even fires.”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F5C518] to-[#B45309] text-[12px] font-black text-[#241A00]">MK</span>
              <span>
                <span className="block text-[13px] font-bold text-[#EDEAF8]">Maya Krishnamurthy</span>
                <span className="block text-[10.5px] text-[#8B84AB]">VP Infrastructure, Northwind Commerce — <span className="text-[#FFD84D]">$2.1B GMV processed</span></span>
              </span>
              <BadgeCheck size={18} className="ml-auto text-[#7DD3FC]" />
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ══════════════════════ PRICING ══════════════════════ */}
      <section id="pricing" className="relative border-t hairline bg-[#0C0917] py-20 sm:py-24">
        <div className="ff-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Pricing" title={<>Pay for runs,<br />not for <span className="text-gold-grad">idle servers</span></>} />
            <div className="flex items-center gap-3 rounded-full border hairline bg-[rgba(20,16,36,.6)] p-1.5">
              {(['monthly', 'annual'] as const).map((m) => (
                <button key={m} onClick={() => setBilling(m)} className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] transition ${billing === m ? 'bg-[#F5C518] text-[#241A00]' : 'text-[#A79CCB]'}`}>
                  {m}{m === 'annual' && <span className="ml-1 text-[8px] align-top">−20%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Launch', tag: 'For side-projects & prototypes', price: billing === 'annual' ? 0 : 0, note: 'forever free', cta: 'Start free', features: ['10,000 runs / month', '5 active flows', '7-day execution history', 'Community support', '1 concurrent queue'], featured: false },
              { name: 'Production', tag: 'For teams shipping real automation', price: billing === 'annual' ? 49 : 59, note: `/ mo · annual`, cta: 'Start 14-day trial', features: ['1,000,000 runs / month', 'Unlimited flows & steps', 'Time-travel Debugger', '90-day history + ledger', 'Auto-retry intelligence · 99.95% SLO', 'Slack + PagerDuty alerts'], featured: true },
              { name: 'Enterprise', tag: 'For fleets that cannot fail', price: -1, note: 'annual agreement', cta: 'Talk to us', features: ['Unlimited runs · dedicated pools', 'Private regions & VPC peering', 'SAML / SCIM · audit export', '99.995% SLA · 15-min response', 'Named solution architect', 'Custom data residency'], featured: false },
            ].map((tier) => (
              <div key={tier.name} className={`relative flex flex-col rounded-3xl border p-6 transition-transform duration-300 ${tier.featured ? 'border-[rgba(245,197,24,.45)] bg-gradient-to-b from-[#231C0E] via-[#1A1530] to-[#141026] shadow-[0_0_80px_rgba(245,197,24,.12),0_40px_90px_rgba(0,0,0,.5)] lg:-my-4 lg:scale-[1.02]' : 'hairline bg-[#131022]'}`}>
                {tier.featured && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#FFE066] to-[#D4910A] px-4 py-1.5 font-mono2 text-[9px] font-extrabold uppercase tracking-[.22em] text-[#241A00] shadow-[0_4px_20px_rgba(245,197,24,.5)]">Most deployed</span>}
                <p className={`font-mono2 text-[10px] uppercase tracking-[.26em] ${tier.featured ? 'text-[#FFD84D]' : 'text-[#A78BFA]'}`}>{tier.name}</p>
                <p className="mt-1 text-[11px] text-[#8B84AB]">{tier.tag}</p>
                <p className="mt-5 font-display text-5xl font-light text-[#F4F1FC]">
                  {tier.price === -1 ? 'Custom' : <><span className="text-2xl align-top text-[#8B84AB]">$</span>{tier.price}<span className="text-base text-[#8B84AB]">{tier.price === 0 ? '' : ' / mo'}</span></>}
                </p>
                <p className="mt-1 font-mono2 text-[9px] uppercase tracking-[.2em] text-[#6E6694]">{tier.note}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[11.5px] leading-5 text-[#C9C4E2]"><Check size={13} strokeWidth={3} className={`mt-0.5 shrink-0 ${tier.featured ? 'text-[#FFD84D]' : 'text-emerald-400'}`} />{f}</li>
                  ))}
                </ul>
                <button
                  onClick={() => notify(tier.name === 'Enterprise' ? 'Our sales team will reach out within one business hour.' : 'Your workspace is being provisioned — check your inbox for the magic link.')}
                  className={`mt-6 w-full justify-center ${tier.featured ? 'btn-gold' : 'btn-ghost'}`}>{tier.cta}</button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-mono2 text-[9px] uppercase tracking-[.22em] text-[#57507C]">No credit card required · runs never expire · one-click export of every flow</p>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section className="border-t hairline py-16">
        <div className="ff-container grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="min-w-0">
            <p className="eyebrow">Questions</p>
            <h3 className="font-display mt-4 text-3xl font-light text-[#F1EEFB]">Before you<br />forge ahead.</h3>
            <p className="mt-4 text-[12px] text-[#8B84AB]">Still curious? <a href="#deploy" className="text-[#FFD84D] underline underline-offset-2">Talk to an engineer</a> — not a chatbot.</p>
          </div>
          <div className="divide-y divide-[rgba(197,172,255,.1)] border-y hairline">
            {[
              { q: 'How is FlowForge different from a workflow engine or a queue?', a: 'Queues move messages; engines orchestrate code you still have to babysit. FlowForge is a complete execution fabric: triggers, retries, state, observability, and a debugger that replays a single step — with no servers to patch.' },
              { q: 'What does a run actually cost?', a: 'A typical 7-step flow costs $0.00021 per execution — about $0.21 per thousand runs. You pay per step-millisecond, so a cached 40ms function is nearly free. See the live cost meter in any run\'s detail panel.' },
              { q: 'Can I bring my existing Node and Python code?', a: 'Yes. Paste a function or point at a git repo. Your code runs as-is on our Node 20 / Python 3.12 pools with your secrets injected via KMS. No framework lock-in, no rewrite.' },
              { q: 'What happens when a step fails at 3am?', a: 'FlowForge retries it per your policy — exponential backoff, jitter, dead-letter. If it still fails, the Debugger shows the exact step, payload, and upstream response, and on-call gets paged with a deep link to replay just that step.' },
              { q: 'Can I self-host or run in a private VPC?', a: 'Enterprise tier ships private regions, VPC peering, and data residency in EU, US, and APAC — with your keys, your audit log, our runtime.' },
            ].map((item, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left" aria-expanded={openFaq === i}>
                  <span className="text-[13.5px] font-semibold text-[#EDEAF8]">{item.q}</span>
                  <ChevronDown size={16} className={`shrink-0 text-[#A78BFA] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="animate-[toast-in_.3s_ease_both] -mt-2 pb-5 pr-10 text-[12px] leading-6 text-[#9B94B8]">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FINAL CTA / SIGNUP ══════════════════════ */}
      <section id="deploy" className="relative overflow-hidden border-t hairline">
        <img src="/img/cta-nebula.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0714]/95 via-[#0A0714]/60 to-[#0A0714]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0714] via-transparent to-[#0A0714]/70" />
        <div className="ff-container relative grid gap-10 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div className="min-w-0">
            <p className="eyebrow">Deploy in 40 seconds</p>
            <h2 className="font-display mt-5 font-light leading-[1.03] text-4xl text-[#FFF8DC] sm:text-6xl">Forge your first<br />flow <span className="text-gold-grad sheen">tonight.</span></h2>
            <p className="mt-5 max-w-md text-[14px] leading-7 text-[#D9D4EE]">10,000 free runs every month. No credit card. Your first webhook is one copy-paste away — and your first failed run will introduce you to the best debugger in the industry.</p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono2 text-[9px] uppercase tracking-[.2em] text-[#A99FD0]">
              {['SOC 2 Type II', 'GDPR & DPA', '99.995% SLA', 'Cancel anytime'].map((t) => <span key={t} className="flex items-center gap-1.5"><Check size={11} className="text-[#FFD84D]" strokeWidth={3} />{t}</span>)}
            </div>
          </div>

          <form onSubmit={submitDeploy} className="ff-panel self-center p-6 sm:p-7">
            <p className="flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[.26em] text-[#FFD84D]"><Rocket size={12} /> Provision workspace</p>
            {deploySent ? (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-[rgba(6,78,59,.25)] p-6 text-center">
                <CircleCheck size={40} className="mx-auto text-emerald-400" strokeWidth={1.6} />
                <p className="font-display mt-3 text-2xl text-emerald-200">You're in.</p>
                <p className="mt-1 text-[12px] text-emerald-100/70">Check your inbox — a magic link and 10,000 runs are waiting.</p>
                <button type="button" onClick={() => setDeploySent(false)} className="mt-4 font-mono2 text-[9px] uppercase tracking-widest text-emerald-400/80 underline underline-offset-2">provision another workspace</button>
              </div>
            ) : (
              <>
                <label className="mt-5 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#A79CCB]" htmlFor="ff-name">Full name</label>
                <input id="ff-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" className="mt-1.5 w-full rounded-xl border hairline bg-[rgba(8,6,17,.6)] px-4 py-3 text-[13px] text-white placeholder-[#57507C] outline-none transition focus:border-[rgba(245,197,24,.5)] focus:ring-2 focus:ring-[rgba(245,197,24,.15)]" />
                <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#A79CCB]" htmlFor="ff-email">Work email</label>
                <input id="ff-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1.5 w-full rounded-xl border hairline bg-[rgba(8,6,17,.6)] px-4 py-3 text-[13px] text-white placeholder-[#57507C] outline-none transition focus:border-[rgba(245,197,24,.5)] focus:ring-2 focus:ring-[rgba(245,197,24,.15)]" />
                <button type="submit" className="btn-gold mt-5 w-full justify-center !py-3.5">Create my workspace <ArrowRight size={15} strokeWidth={2.6} /></button>
                <p className="mt-3 text-center font-mono2 text-[8.5px] text-[#57507C]">Free tier · no credit card · flows never expire</p>
              </>
            )}
          </form>
        </div>
      </section>

      <Footer />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
