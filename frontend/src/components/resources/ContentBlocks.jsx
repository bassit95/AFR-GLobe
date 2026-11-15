// src/components/resources/ContentBlocks.jsx
export default function ContentBlocks({ content = '' }) {
  const lines = String(content).replace(/\r/g, '').replace(/\*([^*]+)\*/g, '$1').split('\n');
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', value: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'list', value: [...list] });
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (line.startsWith('## ')) { flushParagraph(); flushList(); blocks.push({ type: 'heading', value: line.slice(3) }); }
    else if (line.startsWith('### ')) { flushParagraph(); flushList(); blocks.push({ type: 'subheading', value: line.slice(4) }); }
    else if (line.startsWith('> ')) { flushParagraph(); flushList(); blocks.push({ type: 'quote', value: line.slice(2) }); }
    else if (line.startsWith('- ')) { flushParagraph(); list.push(line.slice(2)); }
    else { flushList(); paragraph.push(line); }
  }
  flushParagraph();
  flushList();

  return (
    <div className="resource-prose space-y-5">
      {blocks.map((block, index) => {
        if (block.type === 'heading') return <h2 key={index} className="font-serif text-2xl md:text-3xl text-[#211B18] mt-10 mb-3">{block.value}</h2>;
        if (block.type === 'subheading') return <h3 key={index} className="font-semibold text-lg text-[#2E1B20] mt-7">{block.value}</h3>;
        if (block.type === 'quote') return <blockquote key={index} className="border-l-2 border-[#B85C38] pl-5 py-1 font-serif text-xl md:text-2xl italic leading-relaxed text-[#2E1B20]">{block.value}</blockquote>;
        if (block.type === 'list') return <ul key={index} className="list-disc space-y-2 pl-6 text-[#514943] leading-8">{block.value.map((value, i) => <li key={i}>{value}</li>)}</ul>;
        return <p key={index} className="text-[#514943] leading-8 md:text-[17px]">{block.value}</p>;
      })}
    </div>
  );
}