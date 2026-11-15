// src/components/resources/ResourceDetail.jsx
import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { estimateReadingTime, formatPublicationDate, getCategoryLabel } from '../../utils/resourceLibraryHelpers';
import ArticleCover from './ArticleCover';
import ContentBlocks from './ContentBlocks';
import SourceList from './SourceList';

export default function ResourceDetail({ item, onBack }) {
  const isSiwakArticle = item?.slug === 'le-siwak-sothiou-histoire-et-usages';
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (!item) return undefined;
    const oldTitle = document.title;
    document.title = `${item.title} | Africa Global — Resource Library`;
    let descriptionTag = document.querySelector('meta[name="description"]');
    const createdDescription = !descriptionTag;
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    const description = String(item.excerpt || item.title).replace(/\s+/g, ' ').slice(0, 160);
    descriptionTag.setAttribute('content', description);
    return () => {
      document.title = oldTitle;
      if (createdDescription) descriptionTag.remove();
    };
  }, [item]);

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-20">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6F6259] hover:text-[#B85C38] transition-colors">
          <ArrowLeft size={15} /> Retour à la bibliothèque
        </button>

        <div className="mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A6B59]">
            <span className="px-3 py-1.5 bg-[#E9DED0] text-[#70422E]">{getCategoryLabel(item.category)}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={13} />{formatPublicationDate(item.publishedAt)}</span>
            {item.kind === 'article' && <span className="flex items-center gap-1.5"><Clock3 size={13} />{estimateReadingTime(item.content)} min de lecture</span>}
          </div>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-tight text-[#211B18]">{item.title}</h1>
          {item.excerpt && <p className="mt-6 font-serif italic text-xl md:text-2xl leading-relaxed text-[#716259]">{item.excerpt}</p>}
        </div>

        <figure className="mt-9 border border-black/10 bg-[#E5D9CB]">
          <ArticleCover item={item} className="w-full max-h-[620px] object-cover object-center" />
          {isSiwakArticle && (
            <figcaption className="px-4 py-3 bg-[#F0E8DD] text-[11px] leading-5 text-[#695A4E]">
              Photo : Kriplozoik, « Miswak.jpg », Wikimedia Commons, licence <a className="underline underline-offset-2" href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. L’image est présentée sans modification.
              {' '}<a className="underline underline-offset-2" href="https://commons.wikimedia.org/wiki/File:Miswak.jpg" target="_blank" rel="noreferrer">Voir la source</a>.
            </figcaption>
          )}
        </figure>

        {item.kind === 'article' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-10">
            <aside className="md:col-span-3">
              <div className="md:sticky md:top-24 border-t border-black/15 pt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8A6B59]">Dans cet article</p>
                <p className="mt-3 text-sm leading-6 text-[#766960]">Histoire, usages, vocabulaire, transmission et limites des connaissances.</p>
                <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#8A6B59]"><CheckCircle2 size={15} className="shrink-0 mt-0.5" /><span>Contenu éditorial associé à des sources consultables.</span></div>
              </div>
            </aside>
            <article className="md:col-span-9 min-w-0">
              <ContentBlocks content={item.content} />
              {isSiwakArticle && (
                <div className="mt-10 border border-[#D8C5B2] bg-[#F0E8DD] p-5 md:p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7C432B]">Note de lecture</p>
                  <p className="mt-2 text-sm leading-7 text-[#514943]">Cet article présente des usages culturels et des publications scientifiques ; il ne remplace pas un avis dentaire. Les études sur le siwak signalent des résultats variables selon les techniques d’utilisation, et certaines rapportent des risques de récession gingivale en cas de pratiques traumatiques. Pour un problème bucco-dentaire, consulte un professionnel de santé.</p>
                </div>
              )}
              <SourceList sources={item.sources} />
            </article>
          </div>
        ) : (
          <div className="max-w-3xl mt-10">
            <ContentBlocks content={item.content || item.excerpt} />
            {item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 bg-[#2E1B20] text-[#F9F8F6] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] hover:bg-[#B85C38] transition-colors">Consulter la ressource d’origine <ArrowUpRight size={15} /></a>}
          </div>
        )}

        <div className="mt-16 border-t border-black/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#96877B]">
          <span>Africa Global · Resource Library</span>
          <a href={canonicalUrl} className="hover:text-[#B85C38]">Lien de cet article</a>
        </div>
      </div>
    </main>
  );
}