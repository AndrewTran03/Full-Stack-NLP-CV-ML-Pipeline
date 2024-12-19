// Reference: https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const BACKEND_URL_BASE = 'http://localhost:3000' as const;
