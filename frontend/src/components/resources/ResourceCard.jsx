// src/components/resources/ResourceCard.jsx
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { formatPublicationDate, getCategoryLabel } from '../../utils/resourceLibraryHelpers';
import ArticleCover from './ArticleCover';

export default function ResourceCard({ item, onOpen }) {
  return (
    <article className="group flex flex-col border border-black/10 bg-[#FFFEFC] hover:border-[#B85C38]/60 transition-colors duration-300">
      <button type="button" onClick={() => onOpen(item)} className="relative block w-full overflow-hidden text-left bg-[#E4D8C8]">
        <ArticleCover item={item} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-4 top-4 bg-[#F9F8F6]/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#70422E]">{getCategoryLabel(item.category)}</span>
        <span className="absolute right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-sm group-hover:bg-[#D4A84B] group-hover:text-[#211B18] group-hover:border-[#D4A84B] transition-colors"><ArrowUpRight size={17} /></span>
      </button>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.15em] text-[#97877B] font-bold">
          <span>{item.kind === 'article' ? 'Article éditorial' : 'Ressource externe'}</span>
          <span>·</span>
          <span>{formatPublicationDate(item.publishedAt)}</span>
        </div>
        <button type="button" onClick={() => onOpen(item)} className="mt-4 text-left font-serif text-2xl leading-tight text-[#211B18] group-hover:text-[#8B442A] transition-colors">{item.title}</button>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#766960] line-clamp-3">{item.excerpt || 'Explorez ce contenu dans la Resource Library d’Africa Global.'}</p>
        <button type="button" onClick={() => onOpen(item)} className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2E1B20]">
          <span>{item.kind === 'article' ? 'Lire l’article' : 'Découvrir la ressource'}</span><ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}