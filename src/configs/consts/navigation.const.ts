import { PATHS } from "@/configs/paths/pages.paths";
import { IMAGES } from "@/configs/paths/images.paths";

export const DASHBOARD_NAV_ITEMS = [
  { id: "HOME", href: PATHS.DASHBOARD.ROOT, icon: IMAGES.ICONS.HOME },
  { id: "MODELS", href: PATHS.DASHBOARD.MODELS, icon: IMAGES.ICONS.AI },
  { id: "DOCS", href: PATHS.DASHBOARD.DOCS, icon: IMAGES.ICONS.DOCS },
  { id: "KEYS", href: PATHS.DASHBOARD.KEYS, icon: IMAGES.ICONS.KEY },
  {
    id: "SUBSCRIPTION",
    href: PATHS.DASHBOARD.SUBSCRIPTION,
    icon: IMAGES.ICONS.SUBSCRIPTION,
  },
] as const;
