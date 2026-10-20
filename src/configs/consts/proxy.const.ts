export const CHEAPVIBE_BASE_URL = "https://ru.cheapvibecode.ru/v1";

// Customer prices remain samples until explicitly approved by the product owner.
// Enabling paid requests also requires implementing transactional reservations
// and settlement; this flag alone must never enable customer generation.
export const CUSTOMER_GENERATION_ENABLED = false;

export const PROXY_LIMITS = {
  BODY_BYTES: 1_048_576,
  TIMEOUT_MS: 90_000,
  REQUESTS_PER_MINUTE: 20,
  CONCURRENT_REQUESTS: 2,
  ACTIVE_KEYS: 20,
} as const;
