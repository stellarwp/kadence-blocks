/* eslint-env jest */
/**
 * A unit stored once for every breakpoint can only be changed on the first breakpoint. The other
 * breakpoints show it pinned, so choosing a unit there cannot change the wider breakpoints too.
 *
 * @since TBD
 */
import { getSharedUnit, getUnitsForDevice } from '../helpers/shared-unit';

describe('getSharedUnit', () => {
	const breakpoints = ['desktop', 'tablet', 'mobile'];
	const units = ['px', 'em', 'rem'];

	/**
	 * The first breakpoint owns the unit, so it keeps the full list and is told the unit is shared.
	 *
	 * @return {void}
	 */
	it('keeps every unit selectable on the first breakpoint', () => {
		expect(getSharedUnit({ unit: 'em', units, breakpoints, breakpoint: 'desktop' })).toEqual({
			units,
			unitShared: true,
			unitPinned: false,
		});
	});

	/**
	 * Every other breakpoint is pinned to the stored unit, so its unit list has one entry.
	 *
	 * @return {void}
	 */
	it('pins the unit on the other breakpoints', () => {
		expect(getSharedUnit({ unit: 'em', units, breakpoints, breakpoint: 'tablet' })).toEqual({
			units: ['em'],
			unitShared: true,
			unitPinned: true,
		});
		expect(getSharedUnit({ unit: 'em', units, breakpoints, breakpoint: 'mobile' }).units).toEqual(['em']);
	});

	/**
	 * A field that is not responsive or has no units is left as it was.
	 *
	 * @return {void}
	 */
	it('leaves a field that is not responsive or has no units alone', () => {
		const untouched = { units, unitShared: false, unitPinned: false };

		expect(getSharedUnit({ unit: 'em', units, breakpoints: null, breakpoint: null })).toEqual(untouched);
		expect(getSharedUnit({ unit: 'em', units: undefined, breakpoints, breakpoint: 'mobile' }).unitShared).toBe(
			false
		);
	});

	/**
	 * A breakpoint with no stored unit has nothing to pin to, so it keeps the full list.
	 *
	 * @return {void}
	 */
	it('does not pin a breakpoint when no unit is stored', () => {
		expect(getSharedUnit({ unit: '', units, breakpoints, breakpoint: 'mobile' }).units).toEqual(units);
	});
});

describe('getUnitsForDevice', () => {
	/**
	 * Desktop keeps the whole list and the other devices get the stored unit alone.
	 *
	 * @return {void}
	 */
	it('pins the unit on every device but desktop', () => {
		const units = ['px', 'em', 'rem'];

		expect(getUnitsForDevice(units, 'em', 'Desktop')).toEqual(units);
		expect(getUnitsForDevice(units, 'em', 'Tablet')).toEqual(['em']);
		expect(getUnitsForDevice(units, 'em', 'Mobile')).toEqual(['em']);
		expect(getUnitsForDevice(units, '', 'Mobile')).toEqual(units);
	});
});
