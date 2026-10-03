interface Props {
  className?: string;
  /** @deprecated Colour now follows the theme via `currentColor`. */
  dark?: boolean;
}

/** Original HashX Labs wordmark: HASH / gradient X / LABS. */
export default function HashXLogo({ className = "h-8 w-auto" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HashX Labs"
      role="img"
    >
      <defs>
        <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077ff" />
          <stop offset="100%" stopColor="#00aaff" />
        </linearGradient>
      </defs>
      <text x="0" y="30" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="28" fill="currentColor" letterSpacing="-1">HASH</text>
      <text x="78" y="30" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="28" fill="url(#xGrad)" letterSpacing="-1">X</text>
      <text x="97" y="30" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="28" fill="currentColor" letterSpacing="-1">LABS</text>
    </svg>
  );
}
