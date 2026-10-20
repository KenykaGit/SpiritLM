export type ModelProvider = "openai" | "anthropic";

export type Model = {
  id: string;
  name: string;
  pricePerMillionTokens: string;
};

export type ModelGroup = {
  provider: ModelProvider;
  name: string;
  icon: string;
  models: Model[];
};
