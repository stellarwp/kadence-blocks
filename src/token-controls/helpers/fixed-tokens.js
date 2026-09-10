/**
 * The two kinds of pickable option every `token-controls` box/border/shadow control needs beyond
 * its role's own registered scale: a "None" choice on every dimension/shadow property, and an
 * "Auto" choice on Margin only. Neither is a registered DTCG token — a registered token can be
 * renamed, deleted, or repointed to a different value from its Style Library screen, which is
 * exactly what a sentinel meant to always resolve to the same literal must not allow. `fixed: true`
 * is what lets `token-summary.js`'s `findTokenEntry()` match one of these by plain equality
 * instead of requiring the bracket-wrapped alias form a real token id takes.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * A role's "None" sentinel value. Radius/spacing/border-width collapse to the bare number `0` —
 * the box-control write paths (`toStoredValue`, `toStoredWidth`, and the editor's raw attribute
 * write) already special-case a literal `0` as a clean, unitless value, so no further conversion
 * is needed anywhere else. Shadow can't collapse to a number; its resolved value is the same
 * `box-shadow` shorthand shape a real shadow token's `value` already carries.
 *
 * @since TBD
 */
const NONE_VALUE_BY_ROLE = {
	radius: 0,
	spacing: 0,
	'border-width': 0,
	shadow: '0px 0px 0px 0px transparent',
};

/**
 * Build the fixed "None" entry for a role.
 *
 * @param {string} role The token role ('radius' | 'spacing' | 'border-width' | 'shadow').
 *
 * @since TBD
 *
 * @return {?Object} The fixed entry, or null when the role has no "None".
 */
export function noneEntryForRole(role) {
	if (!Object.prototype.hasOwnProperty.call(NONE_VALUE_BY_ROLE, role)) {
		return null;
	}

	const alias = NONE_VALUE_BY_ROLE[role];

	return {
		id: `ss-none-${role}`,
		label: __('None', 'kadence-blocks'),
		value: String(alias),
		alias,
		fixed: true,
		type: role === 'shadow' ? 'shadow' : 'dimension',
		role,
	};
}

/**
 * Margin's "Auto" sentinel: the CSS keyword `auto`, not a length, so — like "None" above — it is
 * deliberately never a registered token (see `declarations.php`'s comment on `$spacing_slugs`).
 *
 * @since TBD
 *
 * @return {Object} The fixed entry.
 */
export function autoEntry() {
	return {
		id: 'ss-auto',
		label: __('Auto', 'kadence-blocks'),
		value: 'auto',
		alias: 'ss-auto',
		fixed: true,
		type: 'dimension',
		role: 'spacing',
	};
}
