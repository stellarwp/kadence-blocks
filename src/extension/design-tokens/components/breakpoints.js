/**
 * The spelling bridge between the editor's device names and the token vocabulary's breakpoint keys.
 *
 * The editor names its devices `Desktop`/`Tablet`/`Mobile` and keeps the active one in its own store;
 * the shared `token-controls` library speaks the lowercase keys the token vocabulary uses. Every
 * editor-side adapter over a responsive token control needs the same two-way mapping, so it lives
 * here rather than being restated per control — two copies is exactly how the switcher and the
 * provider end up disagreeing about which device is active.
 */

/**
 * The control's breakpoint key for an editor device name.
 *
 * @since TBD
 *
 * @type {Object<string, string>}
 */
export const BREAKPOINT_FOR_DEVICE = {
	Desktop: 'desktop',
	Tablet: 'tablet',
	Mobile: 'mobile',
};

/**
 * The editor device name for a control breakpoint key — the inverse of `BREAKPOINT_FOR_DEVICE`.
 *
 * @param {string} breakpoint The control's breakpoint key (`desktop`/`tablet`/`mobile`).
 *
 * @since TBD
 *
 * @return {string} The matching editor device name, defaulting to `Desktop`.
 */
export function deviceForBreakpoint(breakpoint) {
	return Object.keys(BREAKPOINT_FOR_DEVICE).find((name) => BREAKPOINT_FOR_DEVICE[name] === breakpoint) ?? 'Desktop';
}
