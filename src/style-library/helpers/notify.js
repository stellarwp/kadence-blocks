/**
 * Snackbar transaction feedback for the Style Library app: confirms a write's success or explains
 * its failure via `@wordpress/notices`, the same mechanism the Gutenberg post editor uses for
 * "Post updated." — `dispatch('core/notices')` (the imperative form, not the `useDispatch` hook)
 * because these are called from plain write-flow wrappers in `hooks/use-*.js`, not from inside a
 * component render. `style-library`'s own store, and WP core's `core/notices` store, both register
 * on the SAME default `@wordpress/data` registry (confirmed: no `RegistryProvider`/custom registry
 * anywhere in this app's production code), so this needs no extra store wiring — it is a drop-in,
 * the same pattern `src/dashboard/notices.js` already uses for a different admin page.
 */

/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Show a transient success confirmation.
 *
 * `id` defaults to the message text itself, not a random per-call id: `createNotice` replaces an
 * existing notice sharing the same `id` instead of stacking a second one, so two rapid writes that
 * resolve with the same message (e.g. two quick swatch saves) refresh one snackbar's timer rather
 * than piling up two identical toasts. A caller with genuinely distinct concurrent actions already
 * gets distinct messages (different token/item names baked into the text by the caller), which
 * naturally produces distinct ids too — no separate per-item namespacing needed.
 *
 * @param {string} message The confirmation text (e.g. "Color saved.").
 *
 * @since TBD
 *
 * @return {void}
 */
export function notifySuccess(message) {
	dispatch('core/notices').createNotice('success', message, { type: 'snackbar', isDismissible: true, id: message });
}

/**
 * Show a transient failure explanation.
 *
 * Same `id`-equals-`message` de-duplication as `notifySuccess` — see its docblock.
 *
 * @param {string} message The failure text — typically a REST error's own message.
 *
 * @since TBD
 *
 * @return {void}
 */
export function notifyError(message) {
	dispatch('core/notices').createNotice('error', message, { type: 'snackbar', isDismissible: true, id: message });
}
