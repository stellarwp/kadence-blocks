/**
 * The button's own literal per-side defaults for Padding and Margin — read by both `button-preset.js`
 * (the Style Library's Button screen) and `src/blocks/singlebtn/edit.js` (the block editor sidebar),
 * so the two hosts can never independently drift on what "the button's own default" means.
 *
 * Lives here, not beside the block, because those two hosts are separate apps that stay uncoupled:
 * `src/token-controls/` is the one place both already read from, so the shared value has a home that
 * neither app has to reach into the other to find.
 */

/**
 * The literal each padding side falls back to — also what `src/blocks/advancedbtn/style.scss`'s
 * default rule uses, top/right/bottom/left order.
 *
 * @since TBD
 */
export const BUTTON_PADDING_FALLBACK = ['0.4em', '1em', '0.4em', '1em'];

/**
 * The literal each margin side falls back to.
 *
 * @since TBD
 */
export const BUTTON_MARGIN_FALLBACK = ['0', '0', '0', '0'];
