/**
 * Resolves how a responsive field presents a unit that every breakpoint shares.
 *
 * A host that stores one unit attribute for all breakpoints cannot let a narrower breakpoint choose its
 * own: the choice would change the wider ones as well. On the first breakpoint the unit stays
 * selectable; on the others it is pinned to the stored unit, which a single-entry list already renders
 * as read-only.
 *
 * @param {Object}        args              The field's props.
 * @param {string}        [args.unit]       The stored unit.
 * @param {Array}         [args.units]      The selectable units.
 * @param {?Array}        [args.breakpoints] Breakpoint keys; the first is the one that owns the unit.
 * @param {?string}       [args.breakpoint] The active breakpoint.
 * @param {boolean}       [args.unitShared] Whether one unit serves every breakpoint.
 *
 * @since TBD
 *
 * @return {{units: (Array|undefined), unitShared: boolean, unitPinned: boolean}} The units to offer and
 *     how the unit is shared.
 */
export function getSharedUnit({ unit = '', units, breakpoints = null, breakpoint = null, unitShared = true }) {
	const responsive = Array.isArray(breakpoints) && breakpoints.length > 1;

	if (!unitShared || !responsive || !units || units.length === 0) {
		return { units, unitShared: false, unitPinned: false };
	}

	const unitPinned = breakpoint !== breakpoints[0] && '' !== unit;

	return { units: unitPinned ? [unit] : units, unitShared: true, unitPinned };
}

/**
 * Limits a unit list for a control that renders the active device itself, as the legacy responsive
 * controls do. Desktop keeps the whole list and the other devices get the stored unit alone.
 *
 * @param {Array}  units  The selectable units.
 * @param {string} unit   The stored unit.
 * @param {string} device The active device: 'Desktop', 'Tablet' or 'Mobile'.
 *
 * @since TBD
 *
 * @return {Array} The units to offer on that device.
 */
export function getUnitsForDevice(units, unit, device) {
	return 'Desktop' === device || !unit ? units : [unit];
}
