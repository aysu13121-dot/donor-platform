// Xarici illüstrasiya kitabxanalarının əksəriyyəti (unDraw və s.) build zamanı
// fetch olunası SVG faylı kimi deyil, JS SPA arxasında verilir - etibarlı şəkildə
// çəkib gömmək mümkün olmadı. Onun əvəzinə marka rənglərində, lisenziya
// qeydiyyəti tələb etməyən sadə, orijinal bir inline SVG motivi çəkilib.
export default function HeroIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      role="img"
      aria-label=""
      aria-hidden="true"
    >
      <circle cx="240" cy="252" r="190" className="fill-accent" />
      <circle cx="240" cy="252" r="190" className="fill-primary/[0.04]" />

      <polyline
        points="30,300 130,300 165,210 200,370 232,250 264,320 296,300 450,300"
        className="stroke-primary/25"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M240,90 C240,90 148,224 148,304 C148,357 189,400 240,400 C291,400 332,357 332,304 C332,224 240,90 240,90 Z"
        className="fill-primary"
      />
      <ellipse cx="205" cy="230" rx="18" ry="28" className="fill-white/25" transform="rotate(-18 205 230)" />

      <circle cx="96" cy="150" r="8" className="fill-primary/40" />
      <circle cx="392" cy="130" r="6" className="fill-primary/30" />
      <circle cx="418" cy="360" r="10" className="fill-primary/20" />
      <circle cx="70" cy="380" r="6" className="fill-primary/30" />
    </svg>
  );
}
