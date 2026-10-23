import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight, Hexagon } from 'lucide-react';

const LINKS = [
  { label: 'Platform', href: '#product' },
  { label: 'Debugger', href: '#debugger' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Nav({ onCta }: { onCta: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-bar' : 'border-b border-transparent'}`}>
      <div className="ff-container flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5" aria-label="FlowForge home">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <Hexagon size={30} strokeWidth={1.6} className="absolute text-[#F5C518]" fill="rgba(245,197,24,.12)" strokeLinejoin="round" />
            <span className="font-display text-[15px] font-semibold text-[#FFE066]">F</span>
          </span>
          <span className="font-display text-[1.35rem] font-medium tracking-tight text-[#F4F1FC]">Flow<span className="text-gold-grad">Forge</span>
            <span className="ml-1.5 align-super font-mono2 text-[8px] font-medium uppercase tracking-[.22em] text-[#A78BFA]">Cloud</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-[13px] font-medium text-[#B9B3D6] transition-colors hover:text-white">{l.label}</a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#debugger" className="text-[12px] font-semibold text-[#C4B5FD] transition hover:text-white">Sign in</a>
          <button onClick={onCta} className="btn-gold !px-5 !py-2.5 !text-[12px]">Start free <ArrowRight size={13} strokeWidth={2.8} /></button>
        </div>

        <button className="text-[#C4B5FD] md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="glass-bar border-t hairline px-6 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block border-b hairline py-3.5 text-[15px] font-medium text-[#D9D4EE]">{l.label}</a>
          ))}
          <button onClick={() => { setOpen(false); onCta(); }} className="btn-gold mt-4 w-full justify-center">Start free — 10k runs/mo <ArrowRight size={14} /></button>
        </div>
      )}
    </header>
  );
}
