/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { deriveMeasureMode } from '../../../extension/token-indicators/normalize';

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
 * @param {string}   config.previewDevice The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 * @param {Function} config.setAttributes The block's `setAttributes`.
 * @param {*}        [config.resetOn]     A value that, when it changes, clears any remembered override
 *                                        for every device — e.g. the active preset, so a choice made
 *                                        about one preset's slots doesn't stick onto the next. Omit to
 *                                        never auto-clear.
 *
 * @since TBD
 *
 * @return {{isLinked: boolean, toggleLink: Function}} Whether the active device reads as linked, and
 *  the toggle handler.
 */
export function useLinkedMeasureState({ forDevice, previewDevice, setAttributes, resetOn }) {
	const [modeOverride, setModeOverride] = useState({});

	// The override records a choice made about the PREVIOUS preset's slots, so selecting another preset
	// drops it — otherwise an explicit "link" would stick and hide a new preset's per-slot measure.
	useEffect(() => {
		setModeOverride({});
	}, [resetOn]);

	const isLinked = 'linked' === (modeOverride[previewDevice] ?? deriveMeasureMode(forDevice.value));

	const toggleLink = () => {
		if (!isLinked) {
			const slots = forDevice.value ?? [];
			const first = slots[0] ?? '';
			const isEmpty = slots.every((value) => '' === value || undefined === value);

			if (isEmpty) {
				// Nothing stored, so nothing to collapse. Writing the inherited value here would turn a
				// display fallback into a real override off a single link click.
				setModeOverride((current) => ({ ...current, [previewDevice]: 'linked' }));

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
