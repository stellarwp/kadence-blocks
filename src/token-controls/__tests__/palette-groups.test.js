/* eslint-env jest */
/**
 * Internal dependencies
 */
import {
	mapPaletteToColorControlGroups,
	mapPaletteToSwatchGroups,
	reshapePaletteRows,
} from '../helpers/palette-groups';

const effectivePalette = () => ({
	id: 'default',
	label: 'Default',
	groups: [
		{
			id: 'accent',
			label: 'Accent',
			swatches: [
				{ token: 'primitive.color.brand.primary', label: 'Main 1', $value: '#112233', overridden: false },
				{ token: 'primitive.color.brand.secondary', label: 'Main 2', $value: '#445566', overridden: true },
			],
		},
		{
			id: 'contrast',
			label: 'Contrast',
			swatches: [
				{ token: 'primitive.color.neutral.100', label: 'Neutral 100', $value: '#ffffff', overridden: false },
			],
		},
	],
});

describe('reshapePaletteRows', () => {
	it('reshapes flat is_default/is_current/user_created flags into defaultId/currentId/userCreated pointers', () => {
		const rows = [
			{
				id: 'default',
				label: 'Default',
				is_default: true,
				is_current: false,
				user_created: false,
				_embedded: { self: [{ groups: [{ id: 'accent', label: 'Accent', swatches: [] }] }] },
			},
			{
				id: 'brand-b',
				label: 'Brand B',
				is_default: false,
				is_current: true,
				user_created: true,
				_embedded: { self: [{ groups: [] }] },
			},
		];

		expect(reshapePaletteRows(rows)).toEqual({
			defaultId: 'default',
			currentId: 'brand-b',
			palettes: [
				{ id: 'default', label: 'Default', groups: [{ id: 'accent', label: 'Accent', swatches: [] }] },
				{ id: 'brand-b', label: 'Brand B', groups: [] },
			],
			userCreated: ['brand-b'],
		});
	});
});

describe('mapPaletteToSwatchGroups', () => {
	it('maps a palette effective view onto SwatchGrid items', () => {
		expect(mapPaletteToSwatchGroups(effectivePalette())).toEqual([
			{
				id: 'accent',
				label: 'Accent',
				pendingDelete: false,
				items: [
					{
						id: 'primitive.color.brand.primary',
						name: 'Main 1',
						subLine: '#112233',
						value: '#112233',
						overridden: false,
						pendingDelete: false,
					},
					{
						id: 'primitive.color.brand.secondary',
						name: 'Main 2',
						subLine: '#445566',
						value: '#445566',
						overridden: true,
						pendingDelete: false,
					},
				],
			},
			{
				id: 'contrast',
				label: 'Contrast',
				pendingDelete: false,
				items: [
					{
						id: 'primitive.color.neutral.100',
						name: 'Neutral 100',
						subLine: '#ffffff',
						value: '#ffffff',
						overridden: false,
						pendingDelete: false,
					},
				],
			},
		]);
	});

	it('returns an empty array for a null or group-less palette', () => {
		expect(mapPaletteToSwatchGroups(null)).toEqual([]);
		expect(mapPaletteToSwatchGroups({})).toEqual([]);
	});
});

describe('mapPaletteToColorControlGroups', () => {
	/**
	 * ColorControl's `groups` prop needs `{ id, label, value, alias }` per swatch — `id` for the React
	 * key and the current-pick check mark's identity, `alias` as the bracket-wrapped string ColorControl compares
	 * against its bound `value` and writes back on pick, and `label`/`value` as the display name and
	 * resolved literal. The raw palette shape carries the token dot-path as `token` and the literal as
	 * `$value`, with no bracket form — this bridges that gap rather than reusing
	 * `mapPaletteToSwatchGroups`, whose `items` shape (`name`/`subLine`, no `alias`) exists for the
	 * Color Palette Screen's `SwatchGrid` and is a different, incompatible consumer.
	 */
	it('maps a palette effective view onto ColorControl swatches, deriving a bracket alias from each token', () => {
		expect(mapPaletteToColorControlGroups(effectivePalette())).toEqual([
			{
				id: 'accent',
				label: 'Accent',
				swatches: [
					{
						id: 'primitive.color.brand.primary',
						label: 'Main 1',
						value: '#112233',
						alias: '{primitive.color.brand.primary}',
					},
					{
						id: 'primitive.color.brand.secondary',
						label: 'Main 2',
						value: '#445566',
						alias: '{primitive.color.brand.secondary}',
					},
				],
			},
			{
				id: 'contrast',
				label: 'Contrast',
				swatches: [
					{
						id: 'primitive.color.neutral.100',
						label: 'Neutral 100',
						value: '#ffffff',
						alias: '{primitive.color.neutral.100}',
					},
				],
			},
		]);
	});

	it('returns an empty array for a null or group-less palette', () => {
		expect(mapPaletteToColorControlGroups(null)).toEqual([]);
		expect(mapPaletteToColorControlGroups({})).toEqual([]);
	});
});
