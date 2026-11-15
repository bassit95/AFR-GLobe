import { Check } from 'lucide-react';

export default function FilterChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors sm:px-4 ${
        active ? 'border-[#2E1B20] bg-[#2E1B20] text-[#F9F8F6]' : 'border-black/15 bg-white/70 text-black/70 hover:border-[#B85C38] hover:text-[#7C432B]'
      }`}
    >
      {active && <Check size={12} />}
      {children}
    </button>
  );
}