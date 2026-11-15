import React from 'react';

function EditorialLabel({ prefix, text, light = false }) {
  return (
    <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${light ? 'text-white/60' : 'text-gray-500'}`}>
      {prefix && <span className="font-mono">{prefix}</span>}
      <span className={`w-8 h-px ${light ? 'bg-white/30' : 'bg-gray-400'}`} />
      <span>{text}</span>
    </div>
  );
}

export default EditorialLabel;