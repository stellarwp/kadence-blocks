/* eslint-env jest */
import {
	addGroupToGroups,
	addSwatchToGroups,
	customColorTokenId,
	findSwatch,
	isCustomColorToken,
	isDefaultPalette,
	isDuplicatePaletteLabel,
	mapPaletteToSwatchGroups,
	newSwatchValue,
	nextCustomColorSlug,
	paletteDisplayLabel,
	removeSwatchFromGroups,
	renameSwatchInGroups,
	reorderGroupSwatches,
	resolveEditingPaletteId,
	slugifyPaletteLabel,
	stripEffectiveFlags,
	swatchInitialValues,
} from '../helpers/palettes';

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

describe('mapPaletteToSwatchGroups', () => {
	it('maps groups and swatches to grid ids/names/subLines', () => {
		const groups = mapPaletteToSwatchGroups(effectivePalette());

		expect(groups).toEqual([
			{
				id: 'accent',
				label: 'Accent',
				items: [
					{
						id: 'primitive.color.brand.primary',
						name: 'Main 1',
						subLine: '#112233',
						value: '#112233',
						overridden: false,
					},
					{
						id: 'primitive.color.brand.secondary',
						name: 'Main 2',
						subLine: '#445566',
						value: '#445566',
						overridden: true,
					},
				],
			},
			{
				id: 'contrast',
				label: 'Contrast',
				items: [
					{
						id: 'primitive.color.neutral.100',
						name: 'Neutral 100',
						subLine: '#ffffff',
						value: '#ffffff',
						overridden: false,
					},
				],
			},
		]);
	});

	it('uses the token as the item id and carries overridden through', () => {
		const [accent] = mapPaletteToSwatchGroups(effectivePalette());

		expect(accent.items[0].id).toBe('primitive.color.brand.primary');
		expect(accent.items[1].overridden).toBe(true);
	});

	it('returns [] for a null/empty palette', () => {
		expect(mapPaletteToSwatchGroups(null)).toEqual([]);
		expect(mapPaletteToSwatchGroups({})).toEqual([]);
	});
});

describe('findSwatch', () => {
	it('finds a swatch by token and returns null for a missing one', () => {
		expect(findSwatch(effectivePalette(), 'primitive.color.neutral.100')).toEqual({
			token: 'primitive.color.neutral.100',
			label: 'Neutral 100',
			$value: '#ffffff',
			overridden: false,
		});
		expect(findSwatch(effectivePalette(), 'primitive.color.missing')).toBeNull();
	});
});

describe('swatchInitialValues', () => {
	it('returns { label, value } and empty strings when the token is missing', () => {
		expect(swatchInitialValues(effectivePalette(), 'primitive.color.brand.primary')).toEqual({
			label: 'Main 1',
			value: '#112233',
		});
		expect(swatchInitialValues(effectivePalette(), 'primitive.color.missing')).toEqual({ label: '', value: '' });
	});
});

describe('isDefaultPalette', () => {
	it('matches $default and fails closed on a missing pointer', () => {
		expect(isDefaultPalette({ defaultId: 'default' }, 'default')).toBe(true);
		expect(isDefaultPalette({ defaultId: 'default' }, 'sunset')).toBe(false);
		expect(isDefaultPalette({ defaultId: '' }, 'sunset')).toBe(true);
		expect(isDefaultPalette({}, 'sunset')).toBe(true);
	});
});

describe('resolveEditingPaletteId', () => {
	const listing = {
		currentId: 'scratch-two',
		palettes: [
			{ id: 'default', label: 'Default' },
			{ id: 'sunset', label: 'Sunset' },
			{ id: 'scratch-two', label: 'Scratch Two' },
		],
	};

	it('resolves to the active palette when the route carries no scope', () => {
		expect(resolveEditingPaletteId('', listing)).toBe('scratch-two');
		expect(resolveEditingPaletteId(undefined, listing)).toBe('scratch-two');
	});

	it('resolves to scope when it names a palette in the listing', () => {
		expect(resolveEditingPaletteId('sunset', listing)).toBe('sunset');
	});

	it('falls back to the active palette when scope names no palette in the listing', () => {
		// A deleted palette's id lingering in scope, or a hand-edited/stale deep link — either way
		// this must resolve to something real rather than an id nothing can look up.
		expect(resolveEditingPaletteId('long-gone', listing)).toBe('scratch-two');
	});

	it('falls back to an empty string when the listing itself has no current pointer yet', () => {
		expect(resolveEditingPaletteId('sunset', { currentId: '', palettes: [] })).toBe('');
		expect(resolveEditingPaletteId('', {})).toBe('');
	});
});

describe('paletteDisplayLabel', () => {
	it('falls back to the id for an empty label', () => {
		expect(paletteDisplayLabel({ id: 'sunset', label: 'Sunset' })).toBe('Sunset');
		expect(paletteDisplayLabel({ id: 'sunset', label: '' })).toBe('sunset');
	});
});

describe('slugifyPaletteLabel / isDuplicatePaletteLabel', () => {
	it('kebab-cases the label', () => {
		expect(slugifyPaletteLabel('Sunset Glow')).toBe('sunset-glow');
	});

	it('detects a collision against the listing', () => {
		const listing = { palettes: [{ id: 'sunset', label: 'Sunset' }] };

		expect(isDuplicatePaletteLabel('Sunset', listing)).toBe(true);
		expect(isDuplicatePaletteLabel('Forest', listing)).toBe(false);
		expect(isDuplicatePaletteLabel('   ', listing)).toBe(false);
	});
});

describe('stripEffectiveFlags', () => {
	it('removes overridden and nothing else, immutably', () => {
		const groups = effectivePalette().groups;
		const stripped = stripEffectiveFlags(groups);

		expect(stripped).toEqual([
			{
				id: 'accent',
				label: 'Accent',
				swatches: [
					{ token: 'primitive.color.brand.primary', label: 'Main 1', $value: '#112233' },
					{ token: 'primitive.color.brand.secondary', label: 'Main 2', $value: '#445566' },
				],
			},
			{
				id: 'contrast',
				label: 'Contrast',
				swatches: [{ token: 'primitive.color.neutral.100', label: 'Neutral 100', $value: '#ffffff' }],
			},
		]);
		expect(groups[0].swatches[0].overridden).toBe(false);
	});
});

describe('addSwatchToGroups', () => {
	it('appends to the right group', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = addSwatchToGroups(groups, 'contrast', {
			token: 'primitive.color.custom.custom-1',
			label: 'New Color',
			$value: '#000000',
		});

		expect(next.find((group) => group.id === 'contrast').swatches).toHaveLength(2);
		expect(groups.find((group) => group.id === 'contrast').swatches).toHaveLength(1);
	});

	it('no-ops (same reference) on an unknown group', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);

		expect(addSwatchToGroups(groups, 'ghost', { token: 'x', label: 'x', $value: '#000000' })).toBe(groups);
	});
});

describe('removeSwatchFromGroups', () => {
	it('removes the swatch and drops a group left empty', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = removeSwatchFromGroups(groups, 'primitive.color.neutral.100');

		expect(next).toHaveLength(1);
		expect(next[0].id).toBe('accent');
	});

	it('no-ops on an unknown token', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);

		expect(removeSwatchFromGroups(groups, 'primitive.color.missing')).toBe(groups);
	});
});

describe('renameSwatchInGroups', () => {
	it('changes only the target swatch label', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = renameSwatchInGroups(groups, 'primitive.color.brand.primary', 'Renamed');
		const accent = next.find((group) => group.id === 'accent');

		expect(accent.swatches[0].label).toBe('Renamed');
		expect(accent.swatches[1].label).toBe('Main 2');
	});
});

describe('reorderGroupSwatches', () => {
	it('applies the ordered token list within one group only', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = reorderGroupSwatches(groups, 'accent', [
			'primitive.color.brand.secondary',
			'primitive.color.brand.primary',
		]);
		const accent = next.find((group) => group.id === 'accent');

		expect(accent.swatches.map((swatch) => swatch.token)).toEqual([
			'primitive.color.brand.secondary',
			'primitive.color.brand.primary',
		]);
		expect(next.find((group) => group.id === 'contrast')).toEqual(groups.find((group) => group.id === 'contrast'));
	});

	it('keeps tokens missing from the order at the end in their relative position', () => {
		const groups = [
			{
				id: 'accent',
				label: 'Accent',
				swatches: [
					{ token: 'a', label: 'A', $value: '#111' },
					{ token: 'b', label: 'B', $value: '#222' },
					{ token: 'c', label: 'C', $value: '#333' },
				],
			},
		];
		const next = reorderGroupSwatches(groups, 'accent', ['c']);

		expect(next[0].swatches.map((swatch) => swatch.token)).toEqual(['c', 'a', 'b']);
	});

	it('no-ops on an unknown group id', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);

		expect(reorderGroupSwatches(groups, 'ghost', [])).toBe(groups);
	});
});

describe('addGroupToGroups', () => {
	it('appends the group', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const newGroup = {
			id: 'background',
			label: 'Background',
			swatches: [{ token: 'x', label: 'X', $value: '#000' }],
		};
		const next = addGroupToGroups(groups, newGroup);

		expect(next).toHaveLength(3);
		expect(next[2]).toEqual(newGroup);
	});
});

describe('immutability', () => {
	it('every node-edit helper leaves its input un-mutated', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const frozen = JSON.parse(JSON.stringify(groups));

		deepFreeze(groups);

		addSwatchToGroups(groups, 'accent', { token: 'x', label: 'x', $value: '#000' });
		removeSwatchFromGroups(groups, 'primitive.color.brand.primary');
		renameSwatchInGroups(groups, 'primitive.color.brand.primary', 'Renamed');
		reorderGroupSwatches(groups, 'accent', ['primitive.color.brand.secondary', 'primitive.color.brand.primary']);
		addGroupToGroups(groups, { id: 'x', label: 'X', swatches: [] });

		expect(groups).toEqual(frozen);
	});
});

describe('nextCustomColorSlug', () => {
	it('starts at custom-1 and skips existing suffixes', () => {
		expect(nextCustomColorSlug([])).toBe('custom-1');
		expect(nextCustomColorSlug(['primitive.color.custom.custom-1'])).toBe('custom-2');
		expect(nextCustomColorSlug(['primitive.color.custom.custom-1', 'primitive.color.custom.custom-2'])).toBe(
			'custom-3'
		);
		expect(nextCustomColorSlug(['primitive.color.custom.custom-2'])).toBe('custom-1');
	});
});

describe('customColorTokenId', () => {
	it('prefixes primitive.color.custom.', () => {
		expect(customColorTokenId('custom-1')).toBe('primitive.color.custom.custom-1');
	});
});

describe('newSwatchValue', () => {
	it("copies the group's last swatch value and falls back to #000000", () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);

		expect(newSwatchValue(groups, 'accent')).toBe('#445566');
		expect(newSwatchValue(groups, 'ghost')).toBe('#000000');
		expect(newSwatchValue([], 'accent')).toBe('#000000');
	});
});

describe('isCustomColorToken', () => {
	it('matches only the custom prefix', () => {
		expect(isCustomColorToken('primitive.color.custom.custom-1')).toBe(true);
		expect(isCustomColorToken('primitive.color.brand.primary')).toBe(false);
		expect(isCustomColorToken('')).toBe(false);
	});
});

/**
 * Deep-freeze a fixture so an accidental mutation inside a helper throws instead of silently
 * passing under strict mode, or passes visibly under sloppy mode via the equality check above.
 *
 * @param {Object} value The value to freeze, recursively.
 *
 * @since TBD
 *
 * @return {Object} The same value, frozen.
 */
function deepFreeze(value) {
	Object.values(value).forEach((prop) => {
		if (prop && typeof prop === 'object' && !Object.isFrozen(prop)) {
			deepFreeze(prop);
		}
	});

	return Object.freeze(value);
}
