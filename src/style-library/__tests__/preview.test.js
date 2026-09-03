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
	 * AC4/AC3: a whitespace-only value is as empty as '' — it must resolve to undefined too, not to
	 * an empty string, so the style prop is dropped rather than set to nothing.
	 */
	it('returns undefined for a whitespace-only value', () => {
		expect(capBoxSides('   ', '2rem')).toBeUndefined();
	});
});
