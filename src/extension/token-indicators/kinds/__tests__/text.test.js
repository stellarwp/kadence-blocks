/* eslint-env jest */
import { matchesPreset } from '../../normalize';

describe('matchesPreset text', () => {
	it('matches trimmed equal strings', () => {
		expect(matchesPreset('text', ' bold ', '', 'bold')).toBe(true);
	});

	it('does not match differing strings', () => {
		expect(matchesPreset('text', 'bold', '', 'normal')).toBe(false);
	});
});
