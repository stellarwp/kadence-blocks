/* eslint-env jest */

/**
 * Internal dependencies
 */
import { parseResolvedShadow } from '../helpers/shadow-shorthand';

describe('parseResolvedShadow', () => {
	it('parses a non-inset shorthand', () => {
		expect(parseResolvedShadow('0px 2px 8px 0px #1717171f')).toEqual({
			color: '#1717171f',
			offsetX: '0px',
			offsetY: '2px',
			blur: '8px',
			spread: '0px',
			inset: false,
		});
	});

	it('parses an inset shorthand', () => {
		expect(parseResolvedShadow('inset 0px 2px 8px 0px rgba(23, 23, 23, 0.12)')).toEqual({
			color: 'rgba(23, 23, 23, 0.12)',
			offsetX: '0px',
			offsetY: '2px',
			blur: '8px',
			spread: '0px',
			inset: true,
		});
	});

	it('returns the default composite for an unparsable value', () => {
		expect(parseResolvedShadow('not-a-shadow')).toEqual({
			color: 'transparent',
			offsetX: '0px',
			offsetY: '0px',
			blur: '0px',
			spread: '0px',
			inset: false,
		});
		expect(parseResolvedShadow(undefined)).toEqual({
			color: 'transparent',
			offsetX: '0px',
			offsetY: '0px',
			blur: '0px',
			spread: '0px',
			inset: false,
		});
	});

	it('parses a shadow with rgba color format', () => {
		expect(parseResolvedShadow('2px 3px 4px 5px #111111')).toEqual({
			color: '#111111',
			offsetX: '2px',
			offsetY: '3px',
			blur: '4px',
			spread: '5px',
			inset: false,
		});
	});

	it('parses an inset shadow with rgba color', () => {
		expect(parseResolvedShadow('inset 2px 3px 4px 5px rgba(17, 17, 17, 0.5)')).toEqual({
			color: 'rgba(17, 17, 17, 0.5)',
			offsetX: '2px',
			offsetY: '3px',
			blur: '4px',
			spread: '5px',
			inset: true,
		});
	});
});
