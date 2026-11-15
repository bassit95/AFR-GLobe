export default function PageIntro({ eyebrow, title, description }) {
  return <section className="page-intro"><div className="section-label">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</section>;
}
