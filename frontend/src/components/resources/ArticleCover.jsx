// src/components/resources/ArticleCover.jsx
import { useEffect, useState } from 'react';
import { FALLBACK_IMAGE, getImage } from '../../utils/resourceLibraryHelpers';

export default function ArticleCover({ item, className = '' }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? FALLBACK_IMAGE : getImage(item);

  useEffect(() => setFailed(false), [item?.coverImage, item?.slug]);

  return (
    <img
      src={src}
      alt={item?.title ? `Illustration : ${item.title}` : 'Illustration éditoriale Africa Global'}
      className={className}
      loading="lazy"
      onError={() => { if (!failed) setFailed(true); }}
    />
  );
}