import { PAGE_ANCHORS } from "./paths";

export const SITE_LINKS = {
  home: PAGE_ANCHORS.home,
  models: PAGE_ANCHORS.models,
  quickStart: PAGE_ANCHORS.quickStart,
  navbarAction: PAGE_ANCHORS.models,
} as const;

export const SITE_LABELS = {
  navbarAction: "Перейти",
  navbarLogin: "Войти",
  catalogTitle: "Выберите модель",
  catalogDescription: "Один API для Claude и GPT",
  modelAction: "Использовать модель",
  priceUnit: "за 1 MTok",
} as const;
