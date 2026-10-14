/* eslint-env jest */
// cspell:ignore Abril Fatface .
import { CATALOG_RENDER_CAP, filterCatalogOptions } from '../../token-controls/helpers/catalog-filter';

describe('filterCatalogOptions', () => {
	const options = [
		{ value: 'Abel', label: 'Abel' },
		{ value: 'Abril Fatface', label: 'Abril Fatface' },
		{ value: 'Georgia', label: 'Georgia' },
	];

	it('matches case-insensitively by substring', () => {
		expect(filterCatalogOptions(options, 'abr')).toEqual({
			visible: [options[1]],
			truncated: false,
		});
	});

	it('returns every option, capped, for an empty query', () => {
		expect(filterCatalogOptions(options, '')).toEqual({ visible: options, truncated: false });
		expect(filterCatalogOptions(options, undefined)).toEqual({ visible: options, truncated: false });
	});

	it('returns no matches for a query nothing contains', () => {
		expect(filterCatalogOptions(options, 'zzz')).toEqual({ visible: [], truncated: false });
	});

	it('caps the visible rows and reports truncation once matches exceed the cap', () => {
		const many = Array.from({ length: 5 }, (_, i) => ({ value: `Font ${i}`, label: `Font ${i}` }));

		expect(filterCatalogOptions(many, 'font', 3)).toEqual({
			visible: many.slice(0, 3),
			truncated: true,
		});
	});

	it('defaults the cap to CATALOG_RENDER_CAP', () => {
		const many = Array.from({ length: CATALOG_RENDER_CAP + 5 }, (_, i) => ({
			value: `Font ${i}`,
			label: `Font ${i}`,
		}));

		const { visible, truncated } = filterCatalogOptions(many, '');

		expect(visible).toHaveLength(CATALOG_RENDER_CAP);
		expect(truncated).toBe(true);
	});
});
