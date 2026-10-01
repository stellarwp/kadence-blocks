/* eslint-env jest */
/**
 * Internal dependencies
 */
import { capBoxSides } from '../helpers/preview';

describe('capBoxSides', () => {
	/**
	 * AC4: a single length is wrapped in min() against the cap.
	 */
	it('caps a single length', () => {
		expect(capBoxSides('6rem', '2rem')).toBe('min(6rem, 2rem)');
	});

	/**
	 * AC4: each side of a shorthand is capped independently.
	 */
	it('caps each side of a shorthand', () => {
		expect(capBoxSides('0.4em 1em 0.4em 1em', '2rem')).toBe(
			'min(0.4em, 2rem) min(1em, 2rem) min(0.4em, 2rem) min(1em, 2rem)'
		);
	});

	/**
	 * A per-axis pair lands each cap on the shorthand's real axis: even positions are vertical
	 * (top, and bottom in the 3-value form), odd positions horizontal.
	 */
	it('caps each axis with its own length when given a per-axis pair', () => {
		const caps = { vertical: '50vh', horizontal: '50vw' };

		expect(capBoxSides('3rem 10rem 3rem 10rem', caps)).toBe(
			'min(3rem, 50vh) min(10rem, 50vw) min(3rem, 50vh) min(10rem, 50vw)'
		);
		expect(capBoxSides('0.4em 1em', caps)).toBe('min(0.4em, 50vh) min(1em, 50vw)');
	});

	/**
	 * AC4: a unitless zero stays unwrapped — min(0, 2rem) mixes a number with a length,
	 * which is invalid CSS and would drop the whole declaration.
	 */
	it('leaves a unitless component untouched', () => {
		expect(capBoxSides('0 1rem 0 1rem', '2rem')).toBe('0 min(1rem, 2rem) 0 min(1rem, 2rem)');
	});

	/**
	 * AC4: an explicitly signed length is still a number with a unit, so it is capped like any other
	 * — an unwrapped `+100rem` would escape the very bound the cap exists to impose.
	 */
	it('caps an explicitly signed length', () => {
		expect(capBoxSides('+100rem', '2rem')).toBe('min(+100rem, 2rem)');
	});

	/**
	 * AC4/AC3: nothing to apply resolves to undefined so a JSX style prop drops the property.
	 */
	it('returns undefined for an empty value', () => {
		expect(capBoxSides('', '2rem')).toBeUndefined();
	});

	/**
	 * AC4: a one-value shorthand covers all four sides, so a per-axis cap expands it to the
	 * vertical/horizontal pair rather than holding left and right to the vertical bound.
	 */
	it('expands a one-value shorthand against a per-axis cap', () => {
		expect(capBoxSides('6rem', { vertical: '50vh', horizontal: '50vw' })).toBe('min(6rem, 50vh) min(6rem, 50vw)');
	});

	/**
	 * AC4: a three-value shorthand already reads top, horizontal, bottom, so alternating the per-axis
	 * cap by index caps it correctly with no expansion.
	 */
	it('caps a three-value shorthand per axis', () => {
		expect(capBoxSides('1rem 2rem 3rem', { vertical: '50vh', horizontal: '50vw' })).toBe(
			'min(1rem, 50vh) min(2rem, 50vw) min(3rem, 50vh)'
		);
	});

	/**
	 * AC4: a single cap string still applies to a one-value shorthand unchanged — the expansion is
	 * only needed when the two axes can differ.
	 */
	it('leaves a one-value shorthand unexpanded under a single cap', () => {
		expect(capBoxSides('6rem', '2rem')).toBe('min(6rem, 2rem)');
	});

	/**
	 * AC4/AC3: a whitespace-only value is as empty as '' — it must resolve to undefined too, not to
	 * an empty string, so the style prop is dropped rather than set to nothing.
	 */
	it('returns undefined for a whitespace-only value', () => {
		expect(capBoxSides('   ', '2rem')).toBeUndefined();
	});
});
