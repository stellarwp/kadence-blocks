/* eslint-env jest */
import { fontOptions, fontSizeDisplayValue } from '../helpers/typography';

describe('fontOptions', () => {
	it('returns [] for a missing schema or unknown group', () => {
		expect(fontOptions(undefined, {}, 'Font Family')).toEqual([]);
		expect(fontOptions({ groups: {} }, {}, 'Font Family')).toEqual([]);
		expect(fontOptions({ groups: { Other: [] } }, {}, 'Font Family')).toEqual([]);
	});

	it('maps id, first-family label, and the full stack in feed order', () => {
		const schema = {
			groups: {
				'Font Family': [
					{ id: 'primitive.font-family.sans' },
					{ id: 'primitive.font-family.serif' },
					{ id: 'primitive.font-family.mono' },
				],
			},
		};
		const values = {
			'primitive.font-family.sans': 'Inter, system-ui, sans-serif',
			'primitive.font-family.serif': 'Georgia, Cambria, serif',
			'primitive.font-family.mono': 'Menlo, Consolas, monospace',
		};

		expect(fontOptions(schema, values, 'Font Family')).toEqual([
			{ id: 'primitive.font-family.sans', label: 'Inter', stack: 'Inter, system-ui, sans-serif' },
			{ id: 'primitive.font-family.serif', label: 'Georgia', stack: 'Georgia, Cambria, serif' },
			{ id: 'primitive.font-family.mono', label: 'Menlo', stack: 'Menlo, Consolas, monospace' },
		]);
	});

	it('strips wrapping quotes from a quoted first family', () => {
		const schema = { groups: { 'Font Family': [{ id: 'primitive.font-family.sans' }] } };
		const values = { 'primitive.font-family.sans': '"Inter", system-ui, sans-serif' };

		expect(fontOptions(schema, values, 'Font Family')[0].label).toBe('Inter');
	});
});

describe('fontSizeDisplayValue', () => {
	it('extracts the clamp max from a clamp string', () => {
		expect(fontSizeDisplayValue('clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)')).toBe('0.9rem');
	});

	it('returns a plain dimension verbatim', () => {
		expect(fontSizeDisplayValue('1.5rem')).toBe('1.5rem');
	});

	it('returns a malformed clamp string verbatim', () => {
		expect(fontSizeDisplayValue('clamp(1rem, 2rem)')).toBe('clamp(1rem, 2rem)');
	});

	it('returns an empty value verbatim', () => {
		expect(fontSizeDisplayValue('')).toBe('');
	});
});
