type IconProps = { className?: string };

const base = {
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  "aria-hidden": true,
  focusable: false,
} as const;

export function Arrow({ className = "" }: IconProps) {
  return (
    <svg {...base} className={`icon ${className}`}>
      <path d="M3 10h13.5M11.5 4.5 17 10l-5.5 5.5" />
    </svg>
  );
}

export function ArrowBack({ className = "" }: IconProps) {
  return (
    <svg {...base} className={`icon ${className}`}>
      <path d="M17 10H3.5M8.5 4.5 3 10l5.5 5.5" />
    </svg>
  );
}

export function ArrowUpRight({ className = "" }: IconProps) {
  return (
    <svg {...base} className={`icon ${className}`}>
      <path d="M5.5 14.5 14.5 5.5M7 5.5h7.5V13" />
    </svg>
  );
}

export function Chevron({ className = "" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 10 10" className={className}>
      <path d="M1.5 3.5 5 7l3.5-3.5" />
    </svg>
  );
}

export function Plus({ className = "" }: IconProps) {
  return (
    <svg {...base} className={`icon ${className}`}>
      <path d="M10 3v14M3 10h14" />
    </svg>
  );
}
