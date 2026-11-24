/**
 * Gets the units a responsive field offers on a breakpoint, and how its unit is shared.
 *
 * A field whose unit is shared keeps every unit on the first breakpoint, and the others get the stored
 * unit alone, pinned.
 *
 * @param {Object}  args               The field's props.
 * @param {string}  [args.unit]        The stored unit.
 * @param {Array}   [args.units]       The selectable units.
 * @param {?Array}  [args.breakpoints] The breakpoint keys, the first one owning the unit.
 * @param {?string} [args.breakpoint]  The active breakpoint.
 * @param {boolean} [args.unitShared]  Whether one unit serves every breakpoint.
 *
 * @since 3.9.2
 *
 * @return {{units: (Array|undefined), unitShared: boolean, unitPinned: boolean}} The units to offer, and
 *     whether the unit is shared and pinned on this breakpoint.
 */
export function getSharedUnit({ unit = '', units, breakpoints = null, breakpoint = null, unitShared = false }) {
	if (!unitShared || !Array.isArray(breakpoints) || breakpoints.length < 2 || !units?.length) {
		return { units, unitShared: false, unitPinned: false };
	}

	const unitPinned = breakpoint !== breakpoints[0] && '' !== unit;

	return { units: unitPinned ? [unit] : units, unitShared: true, unitPinned };
}

/**
 * Gets the units a control that renders the active device itself offers on that device.
 *
 * Desktop keeps every unit. The other devices get the stored unit alone.
 *
 * @param {Array}  units  The selectable units.
 * @param {string} unit   The stored unit.
 * @param {string} device The active device: 'Desktop', 'Tablet' or 'Mobile'.
 *
 * @since 3.9.2
 *
 * @return {Array} The units to offer on that device.
 */
export function getUnitsForDevice(units, unit, device) {
	return 'Desktop' === device || !unit ? units : [unit];
}
