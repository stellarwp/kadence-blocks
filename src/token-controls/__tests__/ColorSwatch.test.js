/* eslint-env jest */
/**
 * Internal dependencies
 */
import { colorSwatchStyle } from '../atoms/ColorSwatch';

describe('colorSwatchStyle', () => {
	it("uses the entry's own literal value when it has one", () => {
		const entry = {
			id: 'custom-1',
			label: 'Custom 1',
			value: '#3182CE',
			alias: '{primitive.color.custom.custom-1}',
		};

		expect(colorSwatchStyle(entry)).toEqual({ background: '#3182CE' });
	});

	it('falls back to the token CSS variable, keyed on alias, when the entry has no literal value', () => {
		const entry = { id: 'brand-primary', label: 'Brand primary', alias: '{primitive.color.brand.primary}' };

		expect(colorSwatchStyle(entry)).toEqual({
			background: 'var(--kb-token--primitive--color--brand--primary)',
		});
	});

	it('falls back to the token CSS variable, keyed on id, when the entry has neither value nor alias', () => {
		const entry = { id: 'primitive.color.brand.primary', label: 'Brand primary' };

		expect(colorSwatchStyle(entry)).toEqual({
			background: 'var(--kb-token--primitive--color--brand--primary)',
		});
	});

	it('uses the raw literal value prop when there is no entry — a Custom-tab pick', () => {
		expect(colorSwatchStyle(null, '#ff00aa')).toEqual({ background: '#ff00aa' });
	});

	it('falls back to transparent when there is neither an entry nor a value', () => {
		expect(colorSwatchStyle(null, null)).toEqual({ background: 'transparent' });
		expect(colorSwatchStyle(undefined, undefined)).toEqual({ background: 'transparent' });
	});
});
