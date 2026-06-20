interface Props {
  className?: string;
  dark?: boolean;
}

export default function HashXLogo({ className = "h-8 w-auto", dark = false }: Props) {
  const textColor = dark ? "#0b1340" : "#ffffff";

  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HashX Labs"
      role="img"
    >
      {/* HASH */}
      <text
        x="0"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="28"
        fill={textColor}
        letterSpacing="-1"
      >
        HASH
      </text>

      {/* X — blue gradient */}
      <defs>
        <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077ff" />
          <stop offset="100%" stopColor="#00aaff" />
        </linearGradient>
      </defs>
      <text
        x="78"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="28"
        fill="url(#xGrad)"
        letterSpacing="-1"
      >
        X
      </text>

      {/* LABS */}
      <text
        x="97"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="28"
        fill={textColor}
        letterSpacing="-1"
      >
        LABS
      </text>
    </svg>
  );
}
