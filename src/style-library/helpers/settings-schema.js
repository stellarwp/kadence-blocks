/**
 * Pure helpers behind the settings panel: normalizing an authored schema to the canonical panel
 * shape, resolving a field type to its component through the registry, dot-path value access, a
 * value equality check for dirty tracking, and the responsive-value slot helpers.
 *
 * `box-sides` value shape (Border Radius / Border Width / Spacing): linked is a token-id string;
 * unlinked is a 4-element positional array `[top, right, bottom, left]`, never a named object —
 * see `components/molecules/fields/BoxSidesField.js`'s module docblock for why.
 */

/**
 * Internal dependencies
 */
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';
import { RESPONSIVE_BREAKPOINTS } from './tokens';

/**
 * Field types already warned about in this session, so an unregistered type logs once rather than
 * once per render.
 *
 * @since TBD
 */
const warnedTypes = new Set();

/**
 * Field paths already warned about for carrying `responsive: true` on a non-capable type, so the
 * warning logs once rather than once per render.
 *
 * @since TBD
 */
const warnedResponsiveFields = new Set();

/**
 * The desktop (base value) breakpoint key — the base `$value` itself, never a `responsive` map
 * entry, mirroring `Schema\Vocabulary\Responsive`'s shape.
 *
 * @since TBD
 */
export const DESKTOP_BREAKPOINT = 'desktop';

/**
 * Every breakpoint a responsive-capable field can be edited at, desktop first.
 *
 * @since TBD
 */
export const BREAKPOINTS = [DESKTOP_BREAKPOINT, ...RESPONSIVE_BREAKPOINTS];

/**
 * Normalize an authored settings schema to the canonical `{ panels: [{ id, title, initialOpen,
 * fields }] }` shape: drop fields with an unregistered type, default `readOnly` to `false`, and
 * demote `responsive: true` to `false` on a type outside `RESPONSIVE_CAPABLE_FIELD_TYPES` (each
 * warns once in dev rather than throwing). A top-level `fields` array is wrapped in a single
 * untitled panel.
 *
 * @param {Object} schema The authored schema.
 *
 * @since TBD
 *
 * @return {Object} The canonical schema.
 */
export function normalizeSchema(schema) {
	const rawPanels = Array.isArray(schema?.panels)
		? schema.panels
		: [{ id: 'default', title: '', initialOpen: true, fields: schema?.fields || [] }];

	return {
		panels: rawPanels.map((panel) => ({
			id: panel.id,
			title: panel.title || '',
			initialOpen: panel.initialOpen !== false,
			fields: (panel.fields || [])
				.filter((field) => {
					if (fieldComponentFor(field.type)) {
						return true;
					}

					if (process.env.NODE_ENV !== 'production' && !warnedTypes.has(field.type)) {
						warnedTypes.add(field.type);
						// eslint-disable-next-line no-console
						console.warn(`Style Library settings schema: unregistered field type "${field.type}".`);
					}

					return false;
				})
				.map((field) => {
					const isCapable = RESPONSIVE_CAPABLE_FIELD_TYPES.includes(field.type);
					const responsive = field.responsive === true && isCapable;

					if (field.responsive === true && !isCapable) {
						const warnKey = `${field.type}:${field.path}`;

						if (process.env.NODE_ENV !== 'production' && !warnedResponsiveFields.has(warnKey)) {
							warnedResponsiveFields.add(warnKey);
							// eslint-disable-next-line no-console
							console.warn(
								`Style Library settings schema: "${field.type}" (field "${field.path}") is not ` +
									'responsive-capable; ignoring `responsive: true`.'
							);
						}
					}

					return { ...field, readOnly: field.readOnly === true, responsive };
				}),
		})),
	};
}

/**
 * The component registered for a field type, or null.
 *
 * @param {string} type The field type string.
 *
 * @since TBD
 *
 * @return {?Function} The field component.
 */
export function fieldComponentFor(type) {
	return FIELD_TYPES[type] || null;
}

/**
 * Read a dot-path from a values object ('' when absent).
 *
 * @param {Object} values The values object.
 * @param {string} path   The dot path (e.g. 'border.top').
 *
 * @since TBD
 *
 * @return {*} The value.
 */
export function getValueAtPath(values, path) {
	if (!values || !path) {
		return '';
	}

	let current = values;

	for (const segment of path.split('.')) {
		if (current === null || typeof current !== 'object') {
			return '';
		}

		current = current[segment];
	}

	return current === undefined ? '' : current;
}

/**
 * Immutably set a dot-path on a values object, creating intermediate objects.
 *
 * @param {Object} values The values object.
 * @param {string} path   The dot path.
 * @param {*}      value  The value to write.
 *
 * @since TBD
 *
 * @return {Object} A new values object.
 */
export function setValueAtPath(values, path, value) {
	const segments = path.split('.');
	const root = { ...(values || {}) };
	let cursor = root;

	segments.forEach((segment, index) => {
		if (index === segments.length - 1) {
			cursor[segment] = value;

			return;
		}

		cursor[segment] = { ...(cursor[segment] || {}) };
		cursor = cursor[segment];
	});

	return root;
}

/**
 * Read one breakpoint's slot out of a leaf value: a plain scalar, or the structured
 * `{ base, responsive: { tablet, mobile } }` / `{ base, clamp: { min, preferred, max } }` shape
 * `Schema\Vocabulary\Responsive` defines and `Admin\Feed\Responsive_Feed` emits. A `clamp` leaf has
 * no discrete per-breakpoint step — every breakpoint reads `base` until a clamp-specific editor
 * exists; this does not surface `clamp`'s own slots.
 *
 * @param {*}      raw        The leaf value (scalar, or the structured responsive/clamp shape).
 * @param {string} breakpoint One of `BREAKPOINTS`.
 *
 * @since TBD
 *
 * @return {*} The value at that breakpoint ('' when the leaf carries no override for it yet).
 */
export function readResponsiveSlot(raw, breakpoint) {
	if (raw === null || typeof raw !== 'object') {
		return breakpoint === DESKTOP_BREAKPOINT ? (raw ?? '') : '';
	}

	if (breakpoint === DESKTOP_BREAKPOINT || raw.clamp) {
		return raw.base ?? '';
	}

	return raw.responsive?.[breakpoint] ?? '';
}

/**
 * Write one breakpoint's slot into a leaf value, upgrading a plain scalar to the structured
 * `{ base, responsive }` shape the first time a tablet/mobile override is written — a field only
 * ever edited at desktop round-trips as a flat scalar, same as a non-responsive field. `clamp` and
 * `responsive` are mutually exclusive on the DTCG shape, so writing a stepped override here drops
 * any existing `clamp`.
 *
 * @param {*}      raw        The current leaf value (scalar, or the structured responsive/clamp shape).
 * @param {string} breakpoint One of `BREAKPOINTS`.
 * @param {*}      value      The value to write at that breakpoint.
 *
 * @since TBD
 *
 * @return {*} The next leaf value.
 */
export function writeResponsiveSlot(raw, breakpoint, value) {
	const isStructured = raw !== null && typeof raw === 'object';

	if (breakpoint === DESKTOP_BREAKPOINT) {
		return isStructured ? { ...raw, base: value } : value;
	}

	const base = isStructured ? (raw.base ?? '') : (raw ?? '');
	const responsive = isStructured && raw.responsive ? raw.responsive : {};

	return { base, responsive: { ...responsive, [breakpoint]: value } };
}

/**
 * Read a responsive-capable field's value at one breakpoint from a dot path.
 *
 * @param {Object} values     The values object.
 * @param {string} path       The dot path.
 * @param {string} breakpoint One of `BREAKPOINTS`.
 *
 * @since TBD
 *
 * @return {*} The value at that path and breakpoint.
 */
export function getResponsiveValueAtPath(values, path, breakpoint) {
	return readResponsiveSlot(getValueAtPath(values, path), breakpoint);
}

/**
 * A hand-rolled deep-equality check over plain JSON-shaped values (objects, arrays, and scalars) —
 * enough for comparing draft settings values against their persisted counterpart, without adding a
 * dependency.
 *
 * @param {*} a The first value.
 * @param {*} b The second value.
 *
 * @since TBD
 *
 * @return {boolean} True when the two values are deeply equal.
 */
export function isEqual(a, b) {
	if (a === b) {
		return true;
	}

	if (typeof a !== typeof b || a === null || b === null) {
		return false;
	}

	if (typeof a !== 'object') {
		return false;
	}

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	return aKeys.every((key) => isEqual(a[key], b[key]));
}
