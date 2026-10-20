import type { ReactNode, SVGProps } from "react";

type IconName = "arrow" | "arrow-up" | "terminal" | "copy";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 17, ...props }: IconProps) {
  const paths: Record<typeof name, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    "arrow-up": (
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    ),
    terminal: (
      <>
        <path d="m4 7 5 5-5 5M12 17h8" />
        <rect x="2" y="3" width="20" height="18" rx="3" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
