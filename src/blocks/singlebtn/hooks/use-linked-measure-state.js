/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { deriveMeasureMode } from '../../../extension/token-indicators/normalize';

/**
 * The value a token in `tokens` resolves to, matched back to the alias that produced it.
 *
 * The preset surface carries resolved literals, not aliases (`blockPresetValues` flattens them so the
 * overridden-check can be a plain compare), so the literal is matched back to the token that produced
 * it. Writing the alias keeps a collapsed slot bound to the token (e.g. `None`) rather than landing as
 * a custom literal that merely happens to look the same.
 *
 * @param {Array}  tokens The pickable tokens for this control, each `{ value, alias }`.
 * @param {*}      value  The resolved literal to match back to its token.
 *
 * @since TBD
 *
 * @return {string} The matching token's alias, or the literal itself when no token matches.
 */
function aliasForValue(tokens, value) {
	return tokens.find((token) => token.value === value)?.alias ?? value ?? '';
}

/**
 * The linked/individual state — and its toggle — for a responsive 4-slot measure control (Border
 * Radius's corners, Padding's sides, and any control sharing that shape).
 *
 * A responsive measure control keeps ONE linked/individual mode but writes a different attribute per
 * breakpoint, so the mode must be read from — and "link" must collapse — whichever device is active.
 * The mode describes what THIS device stores, not what it inherits: a breakpoint that stores nothing
 * has nothing that differs, so it reads as linked — deriving from the inherited slots instead would
 * split an all-empty Tablet into four identical blank fields, showing a difference the user cannot see.
 * Where the value comes from is surfaced by the field's popover, not by the link toggle.
 *
 * @param {Object}   config               The hook's configuration.
 * @param {Object}   config.forDevice     The active device's attribute and value, i.e.
 *                                        `measureAttrsForDevice()`'s return shape (`{ attr, value }`).
 * @param {Object}   config.inherited     What each slot inherits at the active device, i.e.
 *                                        `inheritedMeasureSlots()`'s return shape (`{ values, inherited }`).
 * @param {string}   config.previewDevice The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 * @param {*}        config.presetValue   The selected preset's value for the property.
 * @param {Array}    config.tokens        The pickable tokens for this control, each `{ value, alias }`.
 * @param {Function} config.setAttributes The block's `setAttributes`.
 * @param {*}        [config.resetOn]     A value that, when it changes, clears any remembered override
 *                                        for every device — e.g. the active preset, so a choice made
 *                                        about one preset's slots doesn't stick onto the next. Omit to
 *                                        never auto-clear.
 *
 * @since TBD
 *
 * @return {{isLinked: boolean, toggleLink: Function}} Whether the active device reads as linked, and
 *  the toggle handler. `inheritedValues`/`inheritedFirstValue` are computed internally (the toggle
 *  handler needs them) but not returned — no call site has needed them outside the hook so far.
 */
export function useLinkedMeasureState({
	forDevice,
	inherited,
	previewDevice,
	presetValue,
	tokens,
	setAttributes,
	resetOn,
}) {
	const [modeOverride, setModeOverride] = useState({});

	// The override records a choice made about the PREVIOUS preset's slots, so selecting another preset
	// drops it — otherwise an explicit "link" would stick and hide a new preset's per-slot measure.
	useEffect(() => {
		setModeOverride({});
	}, [resetOn]);

	const isLinked = 'linked' === (modeOverride[previewDevice] ?? deriveMeasureMode(forDevice.value, presetValue));

	// What the slots inherit, and whether that inheritance is uniform. A per-slot inheritance is the
	// case where linking is a real change rather than a no-op.
	const inheritedValues = inherited.values;
	const inheritedValuesDiffer =
		Array.isArray(inheritedValues) && inheritedValues.some((value) => value !== inheritedValues[0]);
	const inheritedFirstValue = Array.isArray(inheritedValues) ? aliasForValue(tokens, inheritedValues[0]) : '';

	const toggleLink = () => {
		if (!isLinked) {
			const slots = forDevice.value ?? [];
			const first = slots[0] ?? '';
			const isEmpty = slots.every((value) => '' === value || undefined === value);

			if (isEmpty) {
				// Nothing stored on this device, so ordinarily there is nothing to collapse — the slots
				// are empty because they inherit, and writing the inherited value would silently pin
				// Tablet/Mobile to Desktop's current measure.
				//
				// Unless what is inherited differs slot to slot: then "link" genuinely changes the
				// result, and storing nothing would leave the control showing one value while the block
				// still renders four, with the indicator insisting it matches the preset. Collapsing to
				// the first slot is the write that makes the three agree.
				if (!inheritedValuesDiffer) {
					setModeOverride((current) => ({ ...current, [previewDevice]: 'linked' }));

					return;
				}

				setAttributes({
					[forDevice.attr]: [
						inheritedFirstValue,
						inheritedFirstValue,
						inheritedFirstValue,
						inheritedFirstValue,
					],
				});
				setModeOverride((current) => ({ ...current, [previewDevice]: undefined }));

				return;
			}

			// Every slot matches the first, blank included, and only on the ACTIVE device.
			setAttributes({ [forDevice.attr]: [first, first, first, first] });
			// Equal slots derive linked on their own — except blank ones under a per-slot preset.
			setModeOverride((current) => ({
				...current,
				[previewDevice]: '' === first ? 'linked' : undefined,
			}));

			return;
		}

		// Unlinking equal slots leaves the values untouched, so remember the choice for this session AND
		// this device; a differing slot would derive individual on its own.
		setModeOverride((current) => ({ ...current, [previewDevice]: 'individual' }));
	};

	return { isLinked, toggleLink };
}
