/**
 * Editor binding/override state for design-token-mapped controls.
 *
 * `usePresetBinding` computes, for the block's currently selected preset, a per-attribute map the
 * indicator layer reads: whether each mapped control is bound to the active preset and whether it has
 * been overridden away from it, plus the preset's resolved value so a reset knows what to restore to.
 *
 * Detection matches how a block is bound. Buttons bind via CSS retarget, so a bound-but-untouched
 * attribute stays EMPTY — there `empty => bound`, `non-empty && value != presetValue => overridden`.
 * (A block that binds by seeding a block attribute — image's borderRadius — is never empty; there the
 * test is a pure value-compare. This module keeps `presetValue` as the primary signal so that path is a
 * one-line change when a seeded block is wired later. See the Phase 3 recipe caveat.)
 */

import { get } from 'lodash';
import {
	activeLibrary,
	activePresetFor,
	blockProperties,
	blockPresetValues,
	blockPresetReferences,
	blockPresetResponsive,
} from '../preset-picker';
import { isEmptyValue, matchesPreset, presetValueForDevice } from './normalize';
import './token-indicators.scss';

export { TOKEN_INDICATORS_STORE } from './store';
export { TokenIndicator } from './components/TokenIndicator';
export { TokenLabel } from './components/TokenLabel';
export { TokenControlRow } from './components/TokenControlRow';

/**
 * The device-specific attribute name for a dimension control, by the same `tablet${Capitalized}` /
 * `mobile${Capitalized}` convention `resetAttrPatch` clears — the single spelling, so a reader that
 * only checks the desktop attribute cannot silently disagree with the one that resets all three.
 *
 * @param {string} attr   The desktop attribute name.
 * @param {string} device The active preview device ('Desktop' | 'Tablet' | 'Mobile'); defaults to
 *                          desktop for a caller with no device context.
 *
 * @since TBD
 *
 * @return {string} The attribute the given device stores its value in.
 */
function deviceAttrFor(attr, device) {
	if ('Tablet' !== device && 'Mobile' !== device) {
		return attr;
	}

	const capitalized = attr.charAt(0).toUpperCase() + attr.slice(1);

	return `${device.toLowerCase()}${capitalized}`;
}

/**
 * The companion unit attribute for a dimension control, by convention `${attr}Unit` (e.g. `borderRadius`
 * -> `borderRadiusUnit`). Returns '' for non-dimension kinds.
 *
 * @param {string} kind The property kind.
 * @param {string} attr The primary attribute name.
 *
 * @since TBD
 *
 * @return {string} The unit attribute name, or ''.
 */
function unitAttrFor(kind, attr) {
	return kind === 'dimension' ? `${attr}Unit` : '';
}

/**
 * The axis a property owns within a composite control attribute (`'border-width'`, `'border-style'`,
 * `'border-color'`), or `''` for the ordinary case where the control attribute holds the property's own
 * value directly. This is the kind `normalize.js`'s `isEmptyValue`/`matchesPreset` read for it.
 *
 * Several properties sharing a single `control_attr` is correct where the block's native attribute is one
 * nested per-side/per-axis shape that one control edits with no per-axis reset — the border trio and its
 * `[{ top: [color, style, size], ... }]` attribute. But it means PHP's generic `Preset_Bindings::kind()`
 * (name/token-group classification, with no notion of that nested shape) cannot tell such properties
 * apart: a width property reads as a plain 'dimension' and both style and color read as a plain 'color'.
 * Passed straight through, the existing 'dimension'/'color' branches would read the nested shape as a flat
 * scalar/4-side value and never match.
 *
 * So the axis is DECLARED, per binding, in `declarations.php`, and travels through the preset catalog to
 * here. Reading it rather than matching property names means a second block declaring the same composite
 * under its own property keys (Advanced Text's `borderWidth`/`borderStyle`/`borderColor`, against the
 * Button's `button-border-*`) works with no change in this file.
 *
 * Exported so a caller outside this module that also needs to tell a composite-axis property apart from a
 * plain one (e.g. `capture.js`'s "save as a new preset" flow, which cannot read the nested shape through
 * its own flat control_attr model) resolves it the same way instead of re-deriving it.
 *
 * @param {Object} property The catalog property entry.
 *
 * @since TBD
 *
 * @return {string} The declared axis, or '' when the property owns its control attribute outright.
 */
export function propertyAxis(property) {
	return typeof property?.axis === 'string' ? property.axis : '';
}

/**
 * The mapped control attributes for a block's set, as `[{ attr, kind }]` — the surface reset-all clears.
 * Skips properties with no control attribute. Independent of the selected preset (reset-all clears every
 * mapped override regardless of which preset is active).
 *
 * The three border-axis properties share one `control_attr` (see `propertyAxis`), so they would
 * otherwise produce three entries for the same attribute, each with a different (and individually wrong)
 * kind for `resetAttrPatch`. Deduping by attribute and reporting the combined `'border'` kind for any of
 * them keeps reset-all's one patch-per-attribute clearing every axis at once, matching `resetAttrPatch`'s
 * own `'border'` case.
 *
 * @param {string} blockName The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Array} The mapped attributes ([{ attr, kind }]).
 */
export function mappedAttrsFor(blockName, library) {
	const seen = new Set();
	const attrs = [];

	blockProperties(blockName, library || activeLibrary())
		.filter((property) => !!property.control_attr)
		.forEach((property) => {
			const attr = property.control_attr;

			if (seen.has(attr)) {
				return;
			}

			seen.add(attr);
			attrs.push({ attr, kind: propertyAxis(property) ? 'border' : property.kind });
		});

	return attrs;
}

/**
 * The design-token binding state for a block's mapped controls, keyed by the control's attribute name.
 *
 * @param {string} blockName     The block name (e.g. 'kadence/singlebtn').
 * @param {Object} attributes    The block's current attributes.
 * @param {string} [library]     The token library slug; defaults to the active library — pass the
 *                                caller's resolved library so the binding can't disagree with the
 *                                rest of its UI.
 * @param {string} [previewDevice] The active preview device ('Desktop' | 'Tablet' | 'Mobile'); a
 *                                dimension control reads and reports `overridden` for THIS device's
 *                                own attribute (`tabletBorderRadius`, not `borderRadius`, on Tablet) —
 *                                omit it only for a caller with no device context, e.g. a block-wide
 *                                "is anything overridden" summary that doesn't distinguish devices.
 *
 * @since TBD
 *
 * @return {Object} attrName => { property, token, kind, presetValue, responsive, bound, overridden }.
 *                   Keyed by the DESKTOP attribute name even when `overridden` reflects another
 *                   device, so a caller can still look a control up by its one stable key. The
 *                   `borderStyle` entry is the one exception: `kind` is `'border'` and `property`/
 *                   `token`/`presetValue`/`responsive` are each `{ width, style, color }` objects,
 *                   one slot per axis, combining the three properties that share that attribute (see
 *                   `propertyAxis`); `overridden` is true when any axis diverges from its own
 *                   preset value.
 */
export function usePresetBinding(blockName, attributes, library, previewDevice) {
	const resolvedLibrary = library || activeLibrary();
	const properties = blockProperties(blockName, resolvedLibrary);
	const values = blockPresetValues(blockName, resolvedLibrary);
	const responsive = blockPresetResponsive(blockName, resolvedLibrary);

	// The preset whose surface drives the indicators: the explicit selection, or the set's authoritative
	// default preset when none is chosen or the selection no longer exists (kbPreset is '' on every
	// freshly inserted block, so this fallback runs constantly and must use the catalog's declared
	// default, not JSON key order). When neither resolves, no control is bound.
	const activePreset = activePresetFor(blockName, attributes, resolvedLibrary);
	const presetValues = get(values, activePreset, {});
	const presetBreakpoints = get(responsive, activePreset, {});

	const state = {};

	properties.forEach((property) => {
		const attr = property.control_attr;

		// A property with no mapped control attribute, or one the active preset does not define, is not
		// surfaced — only a property the selected preset sets is "bound" (the binding-set collapse
		// interlock: the per-preset surface, not just the block's full property list, gates binding).
		if (!attr || !(property.key in presetValues)) {
			return;
		}

		// A property that owns one axis of a composite control attribute keys its compare off that declared
		// axis rather than PHP's generic `property.kind` — see `propertyAxis`'s docblock for why.
		const axis = propertyAxis(property);
		const kind = axis || property.kind;
		const presetValue = presetValues[property.key];
		const propertyBreakpoints = {
			tablet: get(presetBreakpoints, ['tablet', property.key]),
			mobile: get(presetBreakpoints, ['mobile', property.key]),
		};

		// `overridden` compares like against like: a dimension OR border control reads its OWN device's
		// stored attribute (`tabletBorderRadius`/`tabletBorderStyle` on Tablet), against the preset value
		// in effect at that same device (its tablet override where the preset declares one, else the
		// base). Comparing a Tablet-stored value to the desktop preset value — or reporting the desktop
		// attribute's state while Tablet is open — would show the wrong mark for the device actually
		// being edited. Border shares this device-awareness with dimension (not just the axis kinds'
		// nested-shape read) because `resetAttrPatch`'s own `'border'` case already clears the tablet/
		// mobile companions — the compare and the reset must agree on which attribute is "the" one.
		const isDeviceAware = kind === 'dimension' || !!axis;
		const deviceAttr = isDeviceAware ? deviceAttrFor(attr, previewDevice) : attr;
		const devicePresetValue = isDeviceAware
			? presetValueForDevice(presetValue, propertyBreakpoints, previewDevice)
			: presetValue;
		const value = get(attributes, deviceAttr, '');
		const unit = unitAttrFor(kind, attr) ? get(attributes, unitAttrFor(kind, attr), '') : '';

		const empty = isEmptyValue(kind, value);
		const overridden = !empty && !matchesPreset(kind, value, unit, devicePresetValue);

		// Width, style and color share the `borderStyle` attribute (one `EditorBorderControl`, no
		// per-axis reset), so their three iterations combine into ONE entry rather than overwrite each
		// other: `property`/`token`/`presetValue`/`responsive` become axis-keyed ('width'/'style'/
		// 'color') objects, and `overridden` is true when ANY axis diverges from ITS OWN preset value —
		// a stored border only reads as "matches the preset" once every axis does.
		if (axis) {
			const axisKey = axis.replace('border-', '');
			const combined = state[attr] || {
				property: {},
				token: {},
				kind: 'border',
				presetValue: {},
				responsive: {},
				bound: true,
				overridden: false,
			};

			combined.property[axisKey] = property.key;
			combined.token[axisKey] = property.token;
			combined.presetValue[axisKey] = presetValue;
			combined.responsive[axisKey] = propertyBreakpoints;
			combined.overridden = combined.overridden || overridden;

			state[attr] = combined;

			return;
		}

		state[attr] = {
			property: property.key,
			token: property.token,
			kind,
			presetValue,
			responsive: propertyBreakpoints,
			bound: true,
			overridden,
		};
	});

	return state;
}

/**
 * The active preset's resolved value for one property key, at the given device — for a property with
 * no `control_attr` at all, whose native attribute `usePresetBinding` has nothing to key it by (a
 * `css_var`-only binding). `usePresetBinding` skips these properties entirely, so a caller that only
 * needs "what does the active preset resolve this to" — e.g. a dimension control's `defaultValue`,
 * shown muted once the control's own override is cleared — reads it directly here instead.
 *
 * @param {string} blockName     The block name (e.g. 'kadence/singlebtn').
 * @param {string} propertyKey   The binding's property key (e.g. 'button-radius').
 * @param {Object} attributes    The block's current attributes — read for `kbPreset`, so a
 *                                user-selected preset (not just the block's default) resolves.
 * @param {string} [library]     The token library slug; defaults to the active library.
 * @param {string} [previewDevice] The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 *
 * @since TBD
 *
 * @return {*} The resolved literal value, or `undefined` when the active preset does not set it.
 */
export function presetPropertyValueForDevice(blockName, propertyKey, attributes, library, previewDevice) {
	const resolvedLibrary = library || activeLibrary();
	const activePreset = activePresetFor(blockName, attributes, resolvedLibrary);
	const presetValues = get(blockPresetValues(blockName, resolvedLibrary), activePreset, {});
	const presetBreakpoints = get(blockPresetResponsive(blockName, resolvedLibrary), activePreset, {});

	return presetValueForDevice(
		presetValues[propertyKey],
		{
			tablet: get(presetBreakpoints, ['tablet', propertyKey]),
			mobile: get(presetBreakpoints, ['mobile', propertyKey]),
		},
		previewDevice
	);
}

/**
 * The active preset's CSS REFERENCE for one property — the `var()` chain the projected CSS uses, rather
 * than the flattened literal `presetPropertyValueForDevice` returns.
 *
 * For an editor render path that has to apply a preset value itself instead of letting a stylesheet do
 * it. Painting the reference rather than the literal is what keeps such a path following a per-block
 * color palette: the projector's `[data-kb-palette]` layer redefines the token variables, and the editor
 * mirrors the block's selected palette onto its wrapper, so the chain resolves through whichever palette
 * the block is on. A literal was flattened against the default palette upstream and cannot follow.
 *
 * Not device-aware, deliberately: a breakpoint override is carried as a literal in the responsive map,
 * and there is no per-breakpoint reference to hand back. A caller that needs the value AT a device wants
 * `presetPropertyValueForDevice`; this answers "what does the preset point this property at".
 *
 * @param {string} blockName   The block name.
 * @param {string} propertyKey The binding's property key.
 * @param {Object} attributes  The block's current attributes — read for `kbPreset`.
 * @param {string} [library]   The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {*} The `var()` chain, or `undefined` when the active preset does not set the property.
 */
export function presetPropertyReference(blockName, propertyKey, attributes, library) {
	const resolvedLibrary = library || activeLibrary();
	const activePreset = activePresetFor(blockName, attributes, resolvedLibrary);

	return get(blockPresetReferences(blockName, resolvedLibrary), [activePreset, propertyKey]);
}

/**
 * The `setAttributes` patch that clears a mapped control's attribute(s) back to their block.json default
 * shape, so the block falls back to the existing preset-scoped CSS (the `.wp-block-*.kb-preset--<preset>`
 * retarget) or the preset default — no new render path. A `color`/`text` control clears its single
 * attribute to `''`. A `dimension` control also clears its `tablet*`/`mobile*` companions by convention,
 * and its unit companion where the block has one.
 *
 * What a dimension clears TO depends on the shape the block declares for it, which is why the block's
 * attribute schema is passed in. A measure control's attribute is a 4-side array and resets to
 * `['', '', '', '']` with its unit back to `'px'` (`borderRadiusUnit`'s own declared default), not to a
 * bare `''`. A scalar dimension — `kadence/single-icon`'s `size`, one number written into the SVG's
 * geometry attributes — resets to `''`; giving it the array shape stores an array in a scalar attribute,
 * which the control reads back as a custom value. With no schema passed, the 4-side shape stands, which is
 * what every caller that omits it wants.
 *
 * A `border` control (the combined `borderStyle` width/style/color entry) clears its `tablet*`/`mobile*`
 * companions the same way, but to an empty ARRAY (`[]`), not `['', '', '', '']` — `EditorBorderControl`'s
 * `fromNativeBorder` reads `[]` (or `undefined`) as "never written" via its `!native?.[0]` short-circuit,
 * which is what makes the control read as bound again. `block.json`'s own declared default is a
 * fully-populated-but-blank per-side object (`[{ top: ['', '', ''], ... }]`); that shape is NOT empty by
 * `fromNativeBorder`'s own test (its `source` is truthy), so resetting to it would leave the control
 * reading as overridden instead of bound.
 *
 * Shared by the per-control reset (`resetAttr`) and the picker's reset-all, so their clearing convention
 * cannot drift.
 *
 * @param {string}  attr       The primary attribute name.
 * @param {string}  kind       The property kind, so a dimension/border also clears its companions.
 * @param {?Object} [declared] The block's declared attributes (`getBlockType(name).attributes`), read for
 *                             the shape a dimension clears to and which companions exist. Omit when the
 *                             caller has no block to read it from.
 *
 * @since TBD
 *
 * @return {Object} The attribute patch to pass to `setAttributes`.
 */
export function resetAttrPatch(attr, kind, declared) {
	if (kind === 'border') {
		return {
			[attr]: [],
			[deviceAttrFor(attr, 'Tablet')]: [],
			[deviceAttrFor(attr, 'Mobile')]: [],
		};
	}

	if (kind !== 'dimension') {
		return { [attr]: '' };
	}

	// A dimension is not always a measure control's 4-side array. `kadence/single-icon`'s `size` is a
	// single number written into the SVG's geometry attributes, and clearing it to `['', '', '', '']`
	// stores an array in a scalar attribute — which the control then reads back as a custom value.
	// The block's own schema already says which shape it is, so it is passed in rather than assumed;
	// with no schema (a caller that has none) the historical 4-side shape stands.
	const isSides = !declared || Array.isArray(declared[attr]?.default);

	if (!isSides) {
		return withDeviceCompanions({ [attr]: '' }, attr, declared, '');
	}

	const emptySides = ['', '', '', ''];
	const patch = withDeviceCompanions({ [attr]: emptySides }, attr, declared, emptySides);

	// Only when the block declares the companion: `borderRadius` has `borderRadiusUnit`, `size` has no
	// `sizeUnit`, and writing one would leave an attribute the block never reads.
	if (!declared || declared[`${attr}Unit`]) {
		patch[`${attr}Unit`] = 'px';
	}

	return patch;
}

/**
 * Add a dimension's per-device companion attributes to a reset patch, cleared to the same shape as the
 * primary.
 *
 * The companions are named by the `tablet`/`mobile` prefix convention. A block that declares them under
 * that convention gets them cleared; one that does not is left alone rather than gaining attributes it
 * never declared.
 *
 * @param {Object}  patch    The patch so far.
 * @param {string}  attr     The primary attribute name.
 * @param {?Object} declared The block's declared attributes, or undefined when unknown.
 * @param {*}       empty    The cleared value to write.
 *
 * @since TBD
 *
 * @return {Object} The patch, with any companions added.
 */
function withDeviceCompanions(patch, attr, declared, empty) {
	['Tablet', 'Mobile'].forEach((device) => {
		const companion = deviceAttrFor(attr, device);

		if (!declared || declared[companion]) {
			patch[companion] = empty;
		}
	});

	return patch;
}

/**
 * Clear a mapped control's attribute(s) back to their block.json default shape (see `resetAttrPatch`).
 *
 * @param {string}   attr          The primary attribute name.
 * @param {Function} setAttributes The block's setAttributes.
 * @param {string}   kind          The property kind, so a dimension also clears its companions.
 *
 * @since TBD
 *
 * @return {void}
 */
export function resetAttr(attr, setAttributes, kind, declared) {
	setAttributes(resetAttrPatch(attr, kind, declared));
}

/**
 * The design-token binding state for a NON-Normal state's own attribute (Hover, Sticky, and so on),
 * derived from the SHARED `usePresetBinding` entry Normal's own control already carries plus this
 * state's own current value at the active device.
 *
 * There is only one border-radius/border preset property per block, so every state shares Normal's
 * `tokenBinding.borderRadius`/`tokenBinding.borderStyle` for `bound`, `presetValue`, and `responsive`
 * — but `overridden` cannot be shared: Normal's entry only ever compares Normal's own attribute, so
 * reusing it on e.g. Sticky would report Normal's divergence on Sticky's field, and its `onReset`
 * would clear Normal's attributes instead of Sticky's. This computes `overridden` fresh from the
 * state's own value, using the exact `isEmptyValue`/`matchesPreset` calls `usePresetBinding`'s own
 * loop already runs internally — just invoked here directly instead of through that loop's
 * `control_attr`-driven dispatch, since a per-state attribute is never itself a `control_attr`.
 *
 * @param {Object} shared            The shared binding entry from `usePresetBinding` this state's
 *                                    property maps to (`tokenBinding.borderRadius` or
 *                                    `tokenBinding.borderStyle`), carrying the combined `presetValue`/
 *                                    `responsive` this function reuses rather than re-deriving.
 * @param {string} kind              'dimension' (radius) or 'border' (the combined width/style/color
 *                                    entry), matching `resetAttrPatch`'s own kind vocabulary.
 * @param {*}      value             This state's own resolved value at the active device (e.g.
 *                                    `borderStickyRadiusForDevice.value`, or the border attribute read
 *                                    at the active device for `kind: 'border'`).
 * @param {string}   [unit]          This state's own unit at the active device ('dimension' only;
 *                                    unused for 'border', whose unit lives on the value itself).
 * @param {*}        [devicePresetValue] For 'dimension': the shared preset value already resolved at
 *                                    the active device (e.g. `borderRadiusPresetValue`, computed once
 *                                    and shared across every state). Unused for 'border', which
 *                                    resolves each axis's own device preset value from `shared`
 *                                    directly (mirroring `usePresetBinding`'s own per-axis loop).
 * @param {string}   [previewDevice] The active preview device ('Desktop' | 'Tablet' | 'Mobile') — only
 *                                    needed for 'border', to resolve each axis's device preset value.
 *
 * @since TBD
 *
 * @return {{ bound: boolean, overridden: boolean }} This state's own binding state, the shape
 *                                    `EditorBoxControl`/`EditorBorderControl`'s `state` prop expects.
 */
export function deriveStateBinding({ shared, kind, value, unit = '', devicePresetValue, previewDevice }) {
	if (!shared?.bound) {
		return { bound: false, overridden: false };
	}

	if (kind === 'border') {
		const empty = isEmptyValue('border-width', value);
		// Only an axis the active preset actually binds is compared: `shared.presetValue` is keyed by
		// exactly the axes `usePresetBinding` combined (see its own docblock), so an axis this preset
		// never sets has no key here — checking it anyway would compare against `undefined` and read a
		// matching border as overridden.
		const overridden =
			!empty &&
			Object.keys(shared.presetValue || {}).some((axis) => {
				const axisPresetValue = presetValueForDevice(
					shared.presetValue?.[axis],
					shared.responsive?.[axis],
					previewDevice
				);

				return !matchesPreset(`border-${axis}`, value, '', axisPresetValue);
			});

		return { bound: true, overridden };
	}

	const empty = isEmptyValue(kind, value);
	const overridden = !empty && !matchesPreset(kind, value, unit, devicePresetValue);

	return { bound: true, overridden };
}
