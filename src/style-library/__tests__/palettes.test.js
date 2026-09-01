/* eslint-env jest */
import {
	addGroupToGroups,
	addSwatchToGroups,
	applyOptimisticOverlay,
	customColorTokenId,
	findSwatch,
	inheritedSwatchCount,
	isCustomColorToken,
	isDefaultPalette,
	isDuplicatePaletteLabel,
	isUserCreatedPalette,
	mapPaletteToSwatchGroups,
	newSwatchValue,
	nextCustomColorSlug,
	paletteDisplayLabel,
	paletteShowsInheritance,
	paletteSuccessorOptions,
	removeGroupFromGroups,
	removeSwatchFromGroups,
	renameGroupInGroups,
	renameSwatchInGroups,
	reorderGroupSwatches,
	reshapePaletteRows,
	resolveEditingPaletteId,
	slugifyPaletteLabel,
	stripEffectiveFlags,
	swatchInitialValues,
	swatchPillVariant,
	validateNewGroupLabel,
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

	it('defaults defaultId/currentId to an empty string and groups to [] when a row carries neither flag nor an embedded view', () => {
		const rows = [{ id: 'default', label: 'Default', is_default: false, is_current: false, user_created: false }];

		expect(reshapePaletteRows(rows)).toEqual({
			defaultId: '',
			currentId: '',
			palettes: [{ id: 'default', label: 'Default', groups: [] }],
			userCreated: [],
		});
	});
});

describe('mapPaletteToSwatchGroups', () => {
	it('maps groups and swatches to grid ids/names/subLines', () => {
		const groups = mapPaletteToSwatchGroups(effectivePalette());

		expect(groups).toEqual([
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

	it('uses the token as the item id and carries overridden through', () => {
		const [accent] = mapPaletteToSwatchGroups(effectivePalette());

		expect(accent.items[0].id).toBe('primitive.color.brand.primary');
		expect(accent.items[1].overridden).toBe(true);
	});

	it('threads pendingDelete through for both a group-level and a swatch-level flag', () => {
		const palette = effectivePalette();
		palette.groups[0].pendingDelete = true;
		palette.groups[1].swatches[0].pendingDelete = true;

		const groups = mapPaletteToSwatchGroups(palette);

		expect(groups[0].pendingDelete).toBe(true);
		expect(groups[1].pendingDelete).toBe(false);
		expect(groups[1].items[0].pendingDelete).toBe(true);
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

describe('applyOptimisticOverlay', () => {
	it('returns the same palette reference when nothing is pending', () => {
		const palette = effectivePalette();
		const emptyOverlay = {
			patches: {},
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [],
		};

		const result = applyOptimisticOverlay(palette, emptyOverlay);

		expect(result).toBe(palette);
	});

	it('returns the original palette unchanged when palette is null', () => {
		const overlay = {
			patches: { token: { label: 'New' } },
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [],
		};

		expect(applyOptimisticOverlay(null, overlay)).toBeNull();
	});

	it('merges patches into matching swatches', () => {
		const palette = effectivePalette();
		const overlay = {
			patches: {
				'primitive.color.brand.primary': { label: 'Updated Primary', $value: '#ff0000' },
			},
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		const primary = result.groups[0].swatches[0];
		expect(primary.label).toBe('Updated Primary');
		expect(primary.$value).toBe('#ff0000');
		expect(result.groups[0].swatches[1].label).toBe('Main 2');
	});

	it('marks a deleted token with pendingDelete: true without removing it', () => {
		const palette = effectivePalette();
		const overlay = {
			patches: {},
			deletedTokens: ['primitive.color.brand.primary'],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		const primary = result.groups[0].swatches[0];
		expect(primary.pendingDelete).toBe(true);
		expect(result.groups[0].swatches).toHaveLength(2);
	});

	it('marks a deleted group and cascades pendingDelete onto all its swatches', () => {
		const palette = effectivePalette();
		const overlay = {
			patches: {},
			deletedTokens: [],
			deletedGroups: ['accent'],
			addedSwatches: [],
			addedGroups: [],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		const accentGroup = result.groups[0];
		expect(accentGroup.pendingDelete).toBe(true);
		expect(accentGroup.swatches[0].pendingDelete).toBe(true);
		expect(accentGroup.swatches[1].pendingDelete).toBe(true);
	});

	it('appends an added swatch to its target group with pendingDelete: false', () => {
		const palette = effectivePalette();
		const overlay = {
			patches: {},
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [
				{
					groupId: 'accent',
					token: 'primitive.color.custom.custom-1',
					label: 'New Color',
					$value: '#123456',
				},
			],
			addedGroups: [],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		const accentGroup = result.groups[0];
		expect(accentGroup.swatches).toHaveLength(3);
		const newSwatch = accentGroup.swatches[2];
		expect(newSwatch.token).toBe('primitive.color.custom.custom-1');
		expect(newSwatch.label).toBe('New Color');
		expect(newSwatch.pendingDelete).toBe(false);
	});

	it('appends an added group as a new top-level group', () => {
		const palette = effectivePalette();
		const overlay = {
			patches: {},
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [
				{
					id: 'background',
					label: 'Background',
					swatches: [
						{
							token: 'primitive.color.custom.custom-1',
							label: 'BG Color',
							$value: '#999999',
						},
					],
				},
			],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		expect(result.groups).toHaveLength(3);
		const newGroup = result.groups[2];
		expect(newGroup.id).toBe('background');
		expect(newGroup.pendingDelete).toBe(false);
		expect(newGroup.swatches[0].pendingDelete).toBe(false);
	});

	it('does not duplicate an added swatch the real data already carries', () => {
		// Simulates the window after `onReceive` has landed the write's confirmed row but before the
		// caller's `.finally()` has cleared the overlay — the real group already has the swatch.
		const palette = effectivePalette();
		palette.groups[0].swatches.push({
			token: 'primitive.color.custom.custom-1',
			label: 'New Color',
			$value: '#123456',
			overridden: false,
		});

		const overlay = {
			patches: {},
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [
				{
					groupId: 'accent',
					token: 'primitive.color.custom.custom-1',
					label: 'New Color',
					$value: '#123456',
				},
			],
			addedGroups: [],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		const accentGroup = result.groups[0];
		expect(
			accentGroup.swatches.filter((swatch) => swatch.token === 'primitive.color.custom.custom-1')
		).toHaveLength(1);
	});

	it('does not duplicate an added group the real data already carries', () => {
		// Same window as above, for a group addition: `onReceive` already landed the confirmed group.
		const palette = effectivePalette();
		palette.groups.push({
			id: 'background',
			label: 'Background',
			swatches: [{ token: 'primitive.color.custom.custom-1', label: 'BG Color', $value: '#999999' }],
		});

		const overlay = {
			patches: {},
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [
				{
					id: 'background',
					label: 'Background',
					swatches: [
						{
							token: 'primitive.color.custom.custom-1',
							label: 'BG Color',
							$value: '#999999',
						},
					],
				},
			],
		};

		const result = applyOptimisticOverlay(palette, overlay);

		expect(result.groups.filter((group) => group.id === 'background')).toHaveLength(1);
	});
});

describe('validateNewGroupLabel', () => {
	it('rejects an empty label with an error message', () => {
		const palette = effectivePalette();
		const result = validateNewGroupLabel('', palette);

		expect(result.groupId).toBeNull();
		expect(result.error).toBeTruthy();
	});

	it('rejects a label that slugifies to empty', () => {
		const palette = effectivePalette();
		const result = validateNewGroupLabel('   ', palette);

		expect(result.groupId).toBeNull();
		expect(result.error).toBeTruthy();
	});

	it('rejects a label whose slug matches an existing group', () => {
		const palette = effectivePalette();
		const result = validateNewGroupLabel('Accent', palette);

		expect(result.groupId).toBeNull();
		expect(result.error).toBeTruthy();
	});

	it('accepts a valid label and returns the slugified id', () => {
		const palette = effectivePalette();
		const result = validateNewGroupLabel('New Group', palette);

		expect(result.groupId).toBe('new-group');
		expect(result.error).toBeNull();
	});

	it('handles a null palette gracefully', () => {
		const result = validateNewGroupLabel('New Group', null);

		expect(result.groupId).toBe('new-group');
		expect(result.error).toBeNull();
	});
});

describe('paletteShowsInheritance', () => {
	/**
	 * A non-default palette inherits from the default one, so its cards carry the pill.
	 *
	 * @return void
	 */
	it('is true for a palette that is not the default', () => {
		expect(paletteShowsInheritance({ defaultId: 'default' }, 'secondary')).toBe(true);
	});

	/**
	 * The default palette defines the values, so it has no source to name and no delta to reset.
	 *
	 * @return void
	 */
	it('is false for the default palette itself', () => {
		expect(paletteShowsInheritance({ defaultId: 'default' }, 'default')).toBe(false);
	});

	/**
	 * A listing with no `$default` pointer cannot say what inherits from what, so no card claims
	 * a source it has not verified.
	 *
	 * @return void
	 */
	it('is false when the listing has no default pointer', () => {
		expect(paletteShowsInheritance({}, 'secondary')).toBe(false);
	});

	/**
	 * No palette is open yet on a cold load, and an unnamed palette shows nothing.
	 *
	 * @return void
	 */
	it('is false when no palette is being edited', () => {
		expect(paletteShowsInheritance({ defaultId: 'default' }, '')).toBe(false);
	});
});

describe('swatchPillVariant', () => {
	/**
	 * On the default palette a shipped swatch still carrying its shipped value states that it is
	 * the default — there is no other palette to name, and nothing to undo.
	 *
	 * @return void
	 */
	it('marks an untouched shipped swatch on the default palette as the default', () => {
		expect(swatchPillVariant({ isDefault: true, isCustom: false, overridden: false })).toBe('default');
	});

	/**
	 * Changed away from its shipped value, the same swatch offers the way back.
	 *
	 * @return void
	 */
	it('offers reset for a changed shipped swatch on the default palette', () => {
		expect(swatchPillVariant({ isDefault: true, isCustom: false, overridden: true })).toBe('reset');
	});

	/**
	 * A color someone added has no shipped value behind it, so it can claim neither the default
	 * pill nor a reset. Its card carries no pill at all — Delete is its affordance, in the
	 * settings panel.
	 *
	 * @return void
	 */
	it('gives a user-added color on the default palette no pill', () => {
		expect(swatchPillVariant({ isDefault: true, isCustom: true, overridden: false })).toBeNull();
	});

	/**
	 * A user-added color is never marked overridden on the default palette, but the rule holds
	 * even if a stale view says otherwise: with no shipped value there is nothing to reset to.
	 *
	 * @return void
	 */
	it('gives a user-added color no pill even when the view calls it overridden', () => {
		expect(swatchPillVariant({ isDefault: true, isCustom: true, overridden: true })).toBeNull();
	});

	/**
	 * On any other palette an un-overridden swatch names the palette it follows, exactly as before.
	 *
	 * @return void
	 */
	it('marks an un-overridden swatch on another palette as inherited', () => {
		expect(swatchPillVariant({ isDefault: false, isCustom: false, overridden: false })).toBe('inherited');
	});

	/**
	 * And an overridden one offers the way back to that palette.
	 *
	 * @return void
	 */
	it('offers reset for an overridden swatch on another palette', () => {
		expect(swatchPillVariant({ isDefault: false, isCustom: false, overridden: true })).toBe('reset');
	});

	/**
	 * A user-added color still inherits its value from the default palette when viewed anywhere
	 * else, so the custom flag changes nothing off the default palette.
	 *
	 * @return void
	 */
	it('treats a user-added color on another palette like any other swatch', () => {
		expect(swatchPillVariant({ isDefault: false, isCustom: true, overridden: false })).toBe('inherited');
		expect(swatchPillVariant({ isDefault: false, isCustom: true, overridden: true })).toBe('reset');
	});
});

describe('inheritedSwatchCount', () => {
	/**
	 * Counts every swatch across every group that still has no value of its own.
	 *
	 * @return void
	 */
	it('counts the un-overridden swatches across all groups', () => {
		const groups = [
			{
				id: 'accent',
				pendingDelete: false,
				items: [
					{ id: 'a', overridden: false, pendingDelete: false },
					{ id: 'b', overridden: true, pendingDelete: false },
				],
			},
			{
				id: 'neutral',
				pendingDelete: false,
				items: [{ id: 'c', overridden: false, pendingDelete: false }],
			},
		];

		expect(inheritedSwatchCount(groups)).toBe(2);
	});

	/**
	 * A swatch or a group that is mid-delete is on its way out, so counting it would state a
	 * number the grid is about to contradict.
	 *
	 * @return void
	 */
	it('skips swatches and groups that are pending delete', () => {
		const groups = [
			{
				id: 'accent',
				pendingDelete: false,
				items: [
					{ id: 'a', overridden: false, pendingDelete: true },
					{ id: 'b', overridden: false, pendingDelete: false },
				],
			},
			{
				id: 'going',
				pendingDelete: true,
				items: [{ id: 'c', overridden: false, pendingDelete: false }],
			},
		];

		expect(inheritedSwatchCount(groups)).toBe(1);
	});

	/**
	 * An empty or missing group list counts as nothing rather than throwing.
	 *
	 * @return void
	 */
	it('returns 0 for an empty list', () => {
		expect(inheritedSwatchCount([])).toBe(0);
	});
});
