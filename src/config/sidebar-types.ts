/**
 * Every `_meta.ts` in the project exports this shape.
 *
 * - String value  → page or directory (builder checks filesystem)
 * - Object value  → sidebar group; key = group label, value = group children
 * - Empty string  → auto-derive label from slug via prettifier
 * - No imports needed — just a plain object
 */
export type MetaConfig = Record<string, string | Record<string, string>>;
