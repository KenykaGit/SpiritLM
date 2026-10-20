import {
  IconArrowRight,
  IconArrowUp,
  IconClipboard,
  IconTerminal2,
} from "@tabler/icons-react";

const icons = {
  arrow: IconArrowRight,
  "arrow-up": IconArrowUp,
  terminal: IconTerminal2,
  copy: IconClipboard,
};

type IconProps = {
  name: keyof typeof icons;
  size?: number;
};

export function Icon({ name, size = 17 }: IconProps) {
  const TablerIcon = icons[name];

  return <TablerIcon size={size} stroke={1.7} aria-hidden="true" />;
}
