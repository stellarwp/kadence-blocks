/**
 * Default token library slug exposed by the REST API.
 *
 * @since 3.8.0
 */
export const DEFAULT_LIBRARY_SLUG = 'default';

/**
 * Global injected by the admin feed localizer.
 *
 * @since 3.8.0
 */
export const DESIGN_TOKENS_GLOBAL = 'kadenceDesignTokens';

/**
 * Global injected on the Style Library admin bundle by the pickable-token localizer (the same
 * payload the block editor's token picker reads). Read by `helpers/tokens.js`'s
 * `getPickableTokensPool()`.
 *
 * @since 3.8.0
 */
export const PICKABLE_TOKENS_GLOBAL = 'kadenceDesignTokensPickable';
