import { Tables } from "@/types/supabase";

/**
 * Represents a Mind entity which includes associated summaries and their authors.
 *
 * @typedef {Object} Mind
 * @extends {Tables<"minds">}
 * @property {Tables<"summaries"> & { authors: Tables<"authors"> }} summaries - The summaries associated with the mind, including their authors.
 */
export type Mind = Tables<"minds"> & {
  summaries: Tables<"summaries"> & {
    authors: Tables<"authors">;
  };
};

/**
 * Represents a function that sets the state of a mind.
 *
 * @typedef {function(boolean): void} setMind
 * @param {boolean} value - The new state value for the mind.
 */
export type setMind = (value: boolean) => void;
