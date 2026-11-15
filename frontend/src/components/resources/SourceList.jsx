// src/components/resources/SourceList.jsx
import { BookOpen, ExternalLink } from 'lucide-react';
import { formatPublicationDate } from '../../utils/resourceLibraryHelpers';

export default function SourceList({ sources = [] }) {
  if (!sources.length) return null;
  return (
    <section className="mt-12 border-t border-black/10 pt-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#E9DED0] text-[#7C432B]"><BookOpen size={17} /></div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A6B59] font-bold">Pour approfondir</p>
          <h2 className="font-serif text-2xl text-[#211B18]">Sources & références</h2>
        </div>
      </div>
      <ol className="space-y-3">
        {sources.map((source, index) => (
          <li key={source.id || source.url || index} className="flex gap-3 border-b border-black/5 pb-3 last:border-0">
            <span className="font-mono text-xs text-[#B85C38] pt-1">{String(index + 1).padStart(2, '0')}</span>
            <div className="flex-1 min-w-0">
              <a href={source.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-2 font-medium text-sm text-[#302722] hover:text-[#B85C38]">
                <span>{source.title || source.publisher || source.url}</span><ExternalLink size={13} className="shrink-0 mt-1" />
              </a>
              <p className="mt-1 text-xs text-[#81766E]">{[source.publisher, source.published_at ? formatPublicationDate(source.published_at) : null].filter(Boolean).join(' · ')}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}