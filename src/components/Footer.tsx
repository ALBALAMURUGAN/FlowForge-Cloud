import { Hexagon, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const COLS: { title: string; links: string[] }[] = [
  { title: 'Platform', links: ['Visual Builder', 'Serverless Runtime', 'Step Debugger', 'Queues & Backpressure', 'Saga Compensation', 'Edge Regions ×34'] },
  { title: 'Triggers', links: ['Webhooks', 'Cron Schedules', 'File Uploads', 'Event Streams', 'Retries & Backoff', 'Idempotency Keys'] },
  { title: 'Observability', links: ['Execution History', 'Performance Analytics', 'Failure Ledger', 'Audit Logs', 'OpenTelemetry Export', 'Status Page'] },
  { title: 'Company', links: ['Customers', 'Changelog', 'Security & SOC 2', 'Trust Center', 'Careers — 14 open', 'Contact Sales'] },
];

export default function Footer() {
  return (
    <footer className="relative border-t hairline bg-[#0C0917]">
      <div className="ff-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.35fr_repeat(4,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <Hexagon size={26} strokeWidth={1.7} className="text-[#F5C518]" fill="rgba(245,197,24,.12)" strokeLinejoin="round" />
              <span className="font-display text-xl font-medium text-[#F4F1FC]">Flow<span className="text-gold-grad">Forge</span></span>
            </a>
            <p className="mt-4 max-w-[26ch] text-[12px] leading-6 text-[#8B84AB]">The serverless orchestration layer for teams who ship workflows, not infrastructure.</p>
            <div className="mt-5 flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[.22em] text-[#57507C]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> All systems operational · 99.995% 12-mo uptime
            </div>
            <div className="mt-5 flex gap-2">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#top" aria-label="Social link" className="flex h-8 w-8 items-center justify-center rounded-lg border hairline text-[#A79CCB] transition hover:border-[rgba(245,197,24,.4)] hover:text-[#FFD84D]">
                  <Icon size={15} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="font-mono2 text-[9.5px] uppercase tracking-[.24em] text-[#C4B5FD]">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#top" className="text-[12px] text-[#8B84AB] transition-colors hover:text-white">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t hairline pt-6 sm:flex-row sm:items-center">
          <p className="font-mono2 text-[9px] uppercase tracking-[.2em] text-[#57507C]">© 2026 FlowForge Systems Inc · SOC 2 Type II · ISO 27001 · GDPR ready</p>
          <div className="flex items-center gap-5 font-mono2 text-[9px] uppercase tracking-[.2em] text-[#6E6694]">
            <a href="#top" className="transition hover:text-white">Privacy</a>
            <a href="#top" className="transition hover:text-white">Terms</a>
            <a href="#top" className="transition hover:text-white">DPA</a>
            <a href="#top" className="transition hover:text-white">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
