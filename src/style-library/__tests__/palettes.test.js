/* eslint-env jest */
import {
	addGroupToGroups,
	addSwatchToGroups,
	customColorTokenId,
	findSwatch,
	isCustomColorToken,
	isDefaultPalette,
	isDeletableGroup,
	isDuplicatePaletteLabel,
	isUserCreatedPalette,
	mapPaletteToSwatchGroups,
	newSwatchValue,
	nextCustomColorSlug,
	paletteDisplayLabel,
	paletteSuccessorOptions,
	removeGroupFromGroups,
	removeSwatchFromGroups,
	renameGroupInGroups,
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
				{
					token: 'primitive.color.brand.primary',
					label: 'Main 1',
					$value: '#112233',
					overridden: false,
					baseline: true,
				},
				{
					token: 'primitive.color.brand.secondary',
					label: 'Main 2',
					$value: '#445566',
					overridden: true,
					baseline: true,
				},
			],
		},
		{
			id: 'contrast',
			label: 'Contrast',
			swatches: [
				{
					token: 'primitive.color.neutral.100',
					label: 'Neutral 100',
					$value: '#ffffff',
					overridden: false,
					baseline: true,
				},
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
						baseline: true,
					},
					{
						id: 'primitive.color.brand.secondary',
						name: 'Main 2',
						subLine: '#445566',
						value: '#445566',
						overridden: true,
						baseline: true,
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
						baseline: true,
					},
				],
			},
		]);
	});

	it('carries the baseline flag through, failing closed when the view omits it', () => {
		const [group] = mapPaletteToSwatchGroups({
			groups: [
				{
					id: 'accent',
					label: 'Accent',
					swatches: [
						{ token: 'primitive.color.custom.a1b2c3', label: 'Brand', $value: '#111', baseline: false },
						// A view that predates the flag: treated as baseline, never as removable.
						{ token: 'primitive.color.brand.primary', label: 'Main 1', $value: '#222' },
					],
				},
			],
		});

		expect(group.items[0].baseline).toBe(false);
		expect(group.items[1].baseline).toBe(true);
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
			baseline: true,
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

	it('excludes the given id from the collision check, so renaming to its own label is allowed', () => {
		const listing = {
			palettes: [
				{ id: 'sunset', label: 'Sunset' },
				{ id: 'forest', label: 'Forest' },
			],
		};

		// Retyping "Sunset" while renaming the "sunset" palette itself is not a collision…
		expect(isDuplicatePaletteLabel('Sunset', listing, 'sunset')).toBe(false);
		// …but retyping a name that belongs to a DIFFERENT palette still is.
		expect(isDuplicatePaletteLabel('Forest', listing, 'sunset')).toBe(true);
	});
});

describe('stripEffectiveFlags', () => {
	it('removes the view-only flags and nothing else, immutably', () => {
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
		renameGroupInGroups(groups, 'accent', 'Renamed Accent');
		removeGroupFromGroups(groups, 'accent');

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

describe('renameGroupInGroups', () => {
	it('relabels only the target group and preserves its id', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = renameGroupInGroups(groups, 'accent', 'Renamed Accent');
		const renamed = next.find((group) => group.label === 'Renamed Accent');

		// The regression test for the `template_slot_for()` misfiling hazard: a rename must never
		// touch the id a swatch-placement lookup depends on.
		expect(renamed.id).toBe('accent');
		expect(next.find((group) => group.id === 'contrast').label).toBe('Contrast');
	});

	it('leaves every group’s swatches untouched', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = renameGroupInGroups(groups, 'accent', 'Renamed Accent');

		expect(next.find((group) => group.id === 'accent').swatches).toEqual(
			groups.find((group) => group.id === 'accent').swatches
		);
	});

	it('changes no labels when the group id matches nothing', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = renameGroupInGroups(groups, 'ghost', 'Renamed');

		expect(next.map((group) => group.label)).toEqual(groups.map((group) => group.label));
	});
});

describe('removeGroupFromGroups', () => {
	it('removes the target group and only it, keeping sibling order', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);
		const next = removeGroupFromGroups(groups, 'accent');

		expect(next).toHaveLength(1);
		expect(next[0].id).toBe('contrast');
	});

	it('returns the same reference when the id matches nothing', () => {
		const groups = stripEffectiveFlags(effectivePalette().groups);

		expect(removeGroupFromGroups(groups, 'ghost')).toBe(groups);
	});

	it('does not block removing the only remaining group — the server owns that rejection', () => {
		const groups = [stripEffectiveFlags(effectivePalette().groups)[0]];

		expect(removeGroupFromGroups(groups, 'accent')).toEqual([]);
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

describe('paletteSuccessorOptions', () => {
	const listing = {
		defaultId: 'default',
		palettes: [
			{ id: 'default', label: 'Default' },
			{ id: 'sunset', label: 'Sunset' },
			{ id: 'forest', label: '' },
		],
	};

	it('offers every palette but the one being deleted, in listing order', () => {
		expect(paletteSuccessorOptions(listing, 'sunset')).toEqual([
			{ id: 'default', label: 'Default' },
			{ id: 'forest', label: '' },
		]);
	});

	it('keeps the default palette as a candidate', () => {
		expect(paletteSuccessorOptions(listing, 'forest').map((row) => row.id)).toContain('default');
	});

	it('returns nothing for a listing that has not loaded', () => {
		expect(paletteSuccessorOptions(undefined, 'sunset')).toEqual([]);
		expect(paletteSuccessorOptions({}, 'sunset')).toEqual([]);
	});
});

describe('isUserCreatedPalette', () => {
	const listing = { defaultId: 'default', userCreated: ['ocean'] };

	it('reports a palette the listing names as user-created', () => {
		expect(isUserCreatedPalette(listing, 'ocean')).toBe(true);
	});

	it('reports a baseline palette as not user-created', () => {
		expect(isUserCreatedPalette(listing, 'sunset')).toBe(false);
		expect(isUserCreatedPalette(listing, 'default')).toBe(false);
	});

	it('fails closed when the listing carries no signal', () => {
		expect(isUserCreatedPalette({}, 'ocean')).toBe(false);
		expect(isUserCreatedPalette(undefined, 'ocean')).toBe(false);
		expect(isUserCreatedPalette(listing, '')).toBe(false);
	});
});

describe('isDeletableGroup', () => {
	const item = (id, baseline) => ({ id, baseline });

	it('reports a group of only user-added swatches as deletable', () => {
		expect(isDeletableGroup({ items: [item('primitive.color.custom.a1', false)] })).toBe(true);
	});

	it('refuses a group carrying any baseline swatch', () => {
		expect(
			isDeletableGroup({
				items: [item('primitive.color.custom.a1', false), item('primitive.color.brand.button', true)],
			})
		).toBe(false);
	});

	it('fails closed on a group whose items carry no signal', () => {
		expect(isDeletableGroup({ items: [{ id: 'primitive.color.brand.button' }] })).toBe(false);
	});

	it('treats an empty or absent group as deletable, leaving the caller its own guards', () => {
		expect(isDeletableGroup({ items: [] })).toBe(true);
		expect(isDeletableGroup(undefined)).toBe(true);
	});
});
