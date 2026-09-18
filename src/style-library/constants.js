/**
 * Default token library slug exposed by the REST API.
 *
 * @since TBD
 */
export const DEFAULT_LIBRARY_SLUG = 'default';

/**
 * Global injected by the admin feed localizer.
 *
 * @since TBD
 */
export const DESIGN_TOKENS_GLOBAL = 'kadenceDesignTokens';

/**
 * Global injected on the Style Library admin bundle by the pickable-token localizer (the same
 * payload the block editor's token picker reads). Read by `helpers/tokens.js`'s
 * `getPickableTokensPool()`.
 *
 * @since TBD
 */
export const PICKABLE_TOKENS_GLOBAL = 'kadenceDesignTokensPickable';
