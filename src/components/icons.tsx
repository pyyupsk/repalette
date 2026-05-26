type IconProps = { size?: number; className?: string };

const base = (className?: string, size = 14) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export const IconSun = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
  </svg>
);

export const IconMoon = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
  </svg>
);

export const IconMonitor = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <rect x="3" y="4" width="18" height="13" rx="1.5" />
    <path d="M8 21h8m-4-4v4" />
  </svg>
);

export const IconUpload = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <path d="M12 4v12m0-12-4 4m4-4 4 4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
  </svg>
);

export const IconDownload = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <path d="M12 4v12m0 0-4-4m4 4 4-4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
  </svg>
);

export const IconRotate = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
  </svg>
);

export const IconCheck = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <path d="m4 12 5 5L20 6" />
  </svg>
);

export const IconCopy = ({ size, className }: IconProps) => (
  <svg {...base(className, size)}>
    <rect x="9" y="9" width="11" height="11" rx="1.5" />
    <path d="M5 15V5a1 1 0 0 1 1-1h10" />
  </svg>
);
