/* eslint-env jest */
import {
	aliasToId,
	idToAlias,
	resolveTokenValue,
	isNonScalarPresetValue,
	presetRows,
	presetInitialValues,
	presetSaveTokens,
	presetStoredTokens,
	nextPresetSlug,
	getButtonPresetProperties,
	overlayPresetRows,
	resolveSwatchColor,
	presetNameSchema,
} from '../helpers/presets';
import { BUTTON_PRESET } from '../presets/button-preset';

describe('aliasToId', () => {
	it('strips the braces off an alias', () => {
		expect(aliasToId('{semantic.color.action-primary}')).toBe('semantic.color.action-primary');
	});

	it('passes a literal value through unchanged', () => {
		expect(aliasToId('#3633e1')).toBe('#3633e1');
	});

	it('round-trips through idToAlias', () => {
		expect(idToAlias(aliasToId('{semantic.color.action-primary}'))).toBe('{semantic.color.action-primary}');
	});
});

describe('idToAlias', () => {
	it('wraps a bare id in braces', () => {
		expect(idToAlias('semantic.color.action-primary')).toBe('{semantic.color.action-primary}');
	});

	it('passes an already-wrapped value through unchanged', () => {
		expect(idToAlias('{semantic.color.action-primary}')).toBe('{semantic.color.action-primary}');
	});

	it('passes an empty value through unchanged', () => {
		expect(idToAlias('')).toBe('');
	});
});

describe('resolveTokenValue', () => {
	const values = { 'semantic.color.action-primary': '#3633e1' };

	it('resolves an alias against the values map', () => {
		expect(resolveTokenValue(values, '{semantic.color.action-primary}')).toBe('#3633e1');
	});

	it('returns a literal value verbatim', () => {
		expect(resolveTokenValue(values, 'transparent')).toBe('transparent');
	});

	it('resolves a dangling alias to an empty string', () => {
		expect(resolveTokenValue(values, '{semantic.color.does-not-exist}')).toBe('');
	});

	it('unwraps a responsive envelope to its base $value, ignoring breakpoint overrides', () => {
		const envelope = {
			$value: '{semantic.color.action-primary}',
			$extensions: {
				'com.kadence.designTokens': {
					responsive: { tablet: '#000000', mobile: '#111111' },
				},
			},
		};

		expect(resolveTokenValue(values, envelope)).toBe('#3633e1');
	});

	it('unwraps an envelope whose base $value is itself a literal', () => {
		const envelope = {
			$value: '4px',
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: '2px' } } },
		};

		expect(resolveTokenValue(values, envelope)).toBe('4px');
	});

	it('resolves a per-corner slot list to a space-joined CSS value', () => {
		const dimensionValues = { 'radius.lg': '1rem', 'radius.none': '0' };
		const slots = ['{radius.lg}', '{radius.none}', '{radius.lg}', '{radius.none}'];

		expect(resolveTokenValue(dimensionValues, slots)).toBe('1rem 0 1rem 0');
	});

	it('resolves a per-corner slot list of mixed aliases and literals', () => {
		const dimensionValues = { 'radius.lg': '1rem' };
		const slots = ['{radius.lg}', '4px', '{radius.lg}', '4px'];

		expect(resolveTokenValue(dimensionValues, slots)).toBe('1rem 4px 1rem 4px');
	});

	it('resolves a slot list with a dangling alias to an empty string, not a partial shorthand', () => {
		const dimensionValues = { 'radius.lg': '1rem' };
		const slots = ['{radius.lg}', '{radius.does-not-exist}', '{radius.lg}', '{radius.lg}'];

		// Joining the resolved slots would emit `1rem  1rem 1rem` — valid CSS, but a different
		// radius than the one stored.
		expect(resolveTokenValue(dimensionValues, slots)).toBe('');
	});

	it('resolves a slot list holding a non-string slot to an empty string', () => {
		const dimensionValues = { 'radius.lg': '1rem' };

		expect(resolveTokenValue(dimensionValues, ['{radius.lg}', 4, '{radius.lg}', '{radius.lg}'])).toBe('');
		expect(resolveTokenValue(dimensionValues, [1, 2, 3, 4])).toBe('');
	});

	it('keeps a zero-valued slot, which resolves to a real value rather than nothing', () => {
		const dimensionValues = { 'radius.none': '0' };
		const slots = ['{radius.none}', '{radius.none}', '{radius.none}', '{radius.none}'];

		expect(resolveTokenValue(dimensionValues, slots)).toBe('0 0 0 0');
	});

	it('unwraps an envelope whose base $value is a per-corner slot list', () => {
		const dimensionValues = { 'radius.lg': '1rem' };
		const envelope = {
			$value: ['{radius.lg}', '0', '{radius.lg}', '0'],
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: ['0', '0', '0', '0'] } } },
		};

		expect(resolveTokenValue(dimensionValues, envelope)).toBe('1rem 0 1rem 0');
	});

	it('degrades an unresolvable non-string, non-array, non-envelope entry to an empty string rather than garbage', () => {
		expect(resolveTokenValue(values, null)).toBe('');
		expect(resolveTokenValue(values, undefined)).toBe('');
	});
});

describe('isNonScalarPresetValue', () => {
	it('is true for a responsive envelope', () => {
		expect(isNonScalarPresetValue({ $value: '4px' })).toBe(true);
	});

	it('is true for a four-entry per-corner slot list', () => {
		expect(isNonScalarPresetValue(['1rem', '0', '1rem', '0'])).toBe(true);
	});

	it('is false for a bare alias or literal', () => {
		expect(isNonScalarPresetValue('{semantic.dimension.radius-md}')).toBe(false);
		expect(isNonScalarPresetValue('4px')).toBe(false);
	});

	it('is false for an empty or non-four-entry array (not a valid slot list)', () => {
		expect(isNonScalarPresetValue([])).toBe(false);
		expect(isNonScalarPresetValue(['1rem', '0'])).toBe(false);
	});
});

describe('presetRows', () => {
	const values = {
		'semantic.color.action-primary': '#3633e1',
		'semantic.color.on-primary': '#ffffff',
	};

	it('maps the payload to row view models in payload order, resolving preview values', () => {
		const payload = {
			userCreated: [],
			presets: {
				primary: {
					label: 'Primary',
					tokens: {
						'button-bg': '{semantic.color.action-primary}',
						'button-text': '{semantic.color.on-primary}',
						'button-radius': '0.5rem',
					},
				},
				secondary: {
					label: 'Secondary',
					tokens: {
						'button-bg': 'transparent',
						'button-text': '{semantic.color.action-primary}',
						'button-radius': '0.25rem',
					},
				},
			},
		};

		const rows = presetRows(payload, values, BUTTON_PRESET.preview);

		expect(rows.map((row) => row.id)).toEqual(['primary', 'secondary']);
		expect(rows[0]).toEqual({
			id: 'primary',
			label: 'Primary',
			userCreated: false,
			preview: { background: '#3633e1', color: '#ffffff', borderRadius: '0.5rem' },
		});
		expect(rows[1].preview).toEqual({ background: 'transparent', color: '#3633e1', borderRadius: '0.25rem' });
	});

	it('resolves a responsive preview at the breakpoint being viewed', () => {
		// The row and overlay paths both pass a breakpoint through to the preview callback. Ignoring
		// it renders every step with the desktop value, so Tablet and Mobile silently preview wrong.
		const responsiveValues = { ...values, 'semantic.color.action-secondary': '#00ff00' };
		const payload = {
			userCreated: [],
			presets: {
				primary: {
					label: 'Primary',
					tokens: {
						'button-bg': {
							$value: '{semantic.color.action-primary}',
							$extensions: {
								'com.kadence.designTokens': {
									responsive: { tablet: '{semantic.color.action-secondary}' },
								},
							},
						},
						'button-text': '{semantic.color.on-primary}',
						'button-radius': '0.5rem',
					},
				},
			},
		};

		const desktop = presetRows(payload, responsiveValues, BUTTON_PRESET.preview, 'desktop');
		const tablet = presetRows(payload, responsiveValues, BUTTON_PRESET.preview, 'tablet');

		expect(desktop[0].preview.background).toBe('#3633e1');
		expect(tablet[0].preview.background).toBe('#00ff00');
	});

	it('falls back to the slug for a label-less preset', () => {
		const payload = { userCreated: [], presets: { outline: { tokens: {} } } };

		expect(presetRows(payload, values, BUTTON_PRESET.preview)[0].label).toBe('outline');
	});

	it('marks userCreated true only for the listed slugs', () => {
		const payload = {
			userCreated: ['outline'],
			presets: { primary: { tokens: {} }, outline: { tokens: {} } },
		};

		const rows = presetRows(payload, values, BUTTON_PRESET.preview);

		expect(rows.find((row) => row.id === 'primary').userCreated).toBe(false);
		expect(rows.find((row) => row.id === 'outline').userCreated).toBe(true);
	});

	it('marks nothing user-created when the payload has no userCreated key (fail closed)', () => {
		const payload = { presets: { primary: { tokens: {} }, outline: { tokens: {} } } };

		const rows = presetRows(payload, values, BUTTON_PRESET.preview);

		expect(rows.every((row) => row.userCreated === false)).toBe(true);
	});
});

describe('presetInitialValues', () => {
	beforeEach(() => {
		// `BUTTON_PRESET.properties` derives from the feed on every access (see `button-preset.js`),
		// so every test in this block needs it stubbed, not just the one that inspects the result.
		window.kadenceDesignTokens = {
			presets: {
				'kadence/singlebtn': {
					properties: [
						'button-bg',
						'button-text',
						'button-bg-hover',
						'button-text-hover',
						'button-radius',
						'button-padding',
						'button-margin',
					],
				},
			},
		};
	});

	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	it('seeds every bound property as a bare id', () => {
		const payload = {
			presets: {
				primary: {
					label: 'Primary',
					tokens: {
						'button-bg': '{semantic.color.action-primary}',
						'button-text': '{semantic.color.on-primary}',
						'button-bg-hover': '{semantic.color.action-primary-hover}',
						'button-text-hover': '{semantic.color.on-primary}',
						'button-radius': '0.5rem',
					},
				},
			},
		};

		expect(presetInitialValues(payload, 'primary', BUTTON_PRESET.properties)).toEqual({
			label: 'Primary',
			tokens: {
				'button-bg': 'semantic.color.action-primary',
				'button-text': 'semantic.color.on-primary',
				'button-bg-hover': 'semantic.color.action-primary-hover',
				'button-text-hover': 'semantic.color.on-primary',
				'button-radius': '0.5rem',
				// Bound but unvalued by this preset, so they seed empty — the shape that keeps a button's
				// spacing owned by its size class until someone sets one.
				'button-padding': '',
				'button-margin': '',
			},
		});
	});

	it('returns null for an unknown slug', () => {
		expect(presetInitialValues({ presets: {} }, 'missing', BUTTON_PRESET.properties)).toBeNull();
	});

	it('returns null for a null payload, indistinguishable from an unknown slug', () => {
		// Pins the contract `ButtonSettings` relies on: a still-loading fetch (`payload === null`) and
		// a genuinely unknown slug both read as null here, which is exactly why the panel gates on
		// `!isLoading` before treating a null seed as a stale deep link rather than "not landed yet".
		expect(presetInitialValues(null, 'secondary', BUTTON_PRESET.properties)).toBeNull();
	});

	it('seeds real values once the payload lands for a slug that first read null while loading', () => {
		window.kadenceDesignTokens = {
			presets: {
				'kadence/singlebtn': {
					properties: ['button-bg', 'button-text', 'button-bg-hover', 'button-text-hover', 'button-radius'],
				},
			},
		};

		const slug = 'secondary';
		const loading = presetInitialValues(null, slug, BUTTON_PRESET.properties);
		const loaded = presetInitialValues(
			{ presets: { secondary: { label: 'Secondary', tokens: { 'button-bg': 'transparent' } } } },
			slug,
			BUTTON_PRESET.properties
		);

		expect(loading).toBeNull();
		expect(loaded).not.toBeNull();
		expect(loaded.label).toBe('Secondary');
	});
});

describe('presetSaveTokens', () => {
	it('wraps bare ids as aliases', () => {
		expect(presetSaveTokens({ 'button-bg': 'semantic.color.action-primary' })).toEqual({
			'button-bg': '{semantic.color.action-primary}',
		});
	});

	it('omits a bound property the preset leaves unset, rather than sending an empty literal', () => {
		// `button-padding` and `button-margin` are bound for every button preset, so a preset that
		// sets neither seeds them as ''. Sending that empty literal fails the server's document
		// validation and takes the whole save down with it, including a label-only edit.
		expect(
			presetSaveTokens({
				'button-bg': '{semantic.color.action-primary}',
				'button-padding': '',
				'button-margin': '',
			})
		).toEqual({ 'button-bg': '{semantic.color.action-primary}' });
	});

	it('omits a per-corner property whose slots are all cleared', () => {
		expect(presetSaveTokens({ 'button-radius': ['', '', '', ''] })).toEqual({});
	});

	it('keeps a per-corner property when any slot carries a value', () => {
		// Asserts only that the property survives the unset guard: how the slots themselves are
		// wrapped is the aliasing helper's business, and it changes in a later slice.
		const result = presetSaveTokens({ 'button-radius': ['', 'primitive.dimension.radius.lg', '', ''] });

		expect(Object.keys(result)).toEqual(['button-radius']);
	});

	it('keeps a zero literal, which is a real value rather than an unset one', () => {
		expect(presetSaveTokens({ 'button-radius': '0' })).toEqual({ 'button-radius': '0' });
	});

	it('passes an already-wrapped alias through unchanged', () => {
		expect(presetSaveTokens({ 'button-bg': '{semantic.color.action-primary}' })).toEqual({
			'button-bg': '{semantic.color.action-primary}',
		});
	});

	it('passes a literal value through unchanged', () => {
		expect(presetSaveTokens({ 'button-bg': 'transparent' })).toEqual({ 'button-bg': 'transparent' });
	});

	it('with no initialTokens/storedTokens, treats every entry as touched (the create-flow shape)', () => {
		const slots = ['{radius.lg}', '0', '{radius.lg}', '0'];

		expect(presetSaveTokens({ 'button-radius': slots })).toEqual({ 'button-radius': slots });
	});

	it('carries an untouched non-scalar property over from storedTokens byte-for-byte', () => {
		const storedRadius = {
			$value: '{semantic.dimension.radius-md}',
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: '{semantic.dimension.radius-sm}' } } },
		};
		const draftTokens = { 'button-radius': storedRadius };
		const initialTokens = { 'button-radius': storedRadius };
		const storedTokens = { 'button-radius': storedRadius };

		const result = presetSaveTokens(draftTokens, initialTokens, storedTokens);

		expect(result['button-radius']).toBe(storedRadius);
	});

	it('writes a fresh alias for a property the draft changed, even with storedTokens present', () => {
		const initialTokens = { 'button-bg': 'semantic.color.action-primary' };
		const storedTokens = { 'button-bg': '{semantic.color.action-primary}' };
		const draftTokens = { 'button-bg': 'semantic.color.action-primary-hover' };

		expect(presetSaveTokens(draftTokens, initialTokens, storedTokens)).toEqual({
			'button-bg': '{semantic.color.action-primary-hover}',
		});
	});

	it('falls back to a fresh alias when a draft property has no stored counterpart', () => {
		const result = presetSaveTokens({ 'button-radius': 'semantic.dimension.radius-md' }, {}, {});

		expect(result).toEqual({ 'button-radius': '{semantic.dimension.radius-md}' });
	});

	/**
	 * A never-set scalar property (e.g. `button-padding` on a fresh preset) seeds the draft as `''`
	 * — see `presetInitialValues`'s `tokens[property] ?? ''`. Sending that empty string is what the
	 * server rejects (SOFT-4083's #1289 regression); the property must be omitted instead.
	 *
	 * @return void
	 */
	it('omits a property whose draft value is an empty string rather than sending it', () => {
		const result = presetSaveTokens({ 'button-bg': 'semantic.color.action-primary', 'button-padding': '' });

		expect(result).toEqual({ 'button-bg': '{semantic.color.action-primary}' });
		expect(result).not.toHaveProperty('button-padding');
	});

	/**
	 * An unlinked box field (four independently-edited sides) clears to a slot list of four empty
	 * strings rather than a bare `''`; the omission must recognize that shape too.
	 *
	 * @return void
	 */
	it('omits a property whose draft value is a slot list of only empty strings', () => {
		const result = presetSaveTokens({ 'button-margin': ['', '', '', ''] });

		expect(result).toEqual({});
	});

	/**
	 * A property with at least one non-empty slot is a genuine partial edit, not an unset field, so
	 * it is still written through untouched.
	 *
	 * @return void
	 */
	it('does not omit a slot list carrying at least one non-empty side', () => {
		const result = presetSaveTokens({ 'button-margin': ['4px', '', '', ''] });

		expect(result).toEqual({ 'button-margin': ['4px', '', '', ''] });
	});

	/**
	 * Omitting a property that was previously stored genuinely clears it: the write endpoint
	 * (`Presets_Controller::create_item()`) replaces a preset's whole token map wholesale rather than
	 * merging it property by property, so this function's output is the complete desired map and an
	 * omitted property does not survive the write.
	 *
	 * @return void
	 */
	it('omits an already-stored property the draft cleared back to empty', () => {
		const initialTokens = { 'button-padding': '0.4em' };
		const storedTokens = { 'button-padding': '0.4em' };

		const result = presetSaveTokens({ 'button-padding': '' }, initialTokens, storedTokens);

		expect(result).not.toHaveProperty('button-padding');
	});
});

describe('presetStoredTokens', () => {
	it("reads the preset's raw stored token map, unmodified", () => {
		const tokens = { 'button-bg': '{semantic.color.action-primary}', 'button-radius': ['1rem', '0', '1rem', '0'] };
		const payload = { presets: { primary: { tokens } } };

		expect(presetStoredTokens(payload, 'primary')).toBe(tokens);
	});

	it('returns an empty object for an unknown slug', () => {
		expect(presetStoredTokens({ presets: {} }, 'missing')).toEqual({});
	});

	it('returns an empty object for a null payload', () => {
		expect(presetStoredTokens(null, 'primary')).toEqual({});
	});
});

describe('getButtonPresetProperties', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	it('derives the property list from the feed when present', () => {
		window.kadenceDesignTokens = {
			presets: {
				'kadence/singlebtn': {
					properties: ['button-bg', 'button-text', 'button-radius'],
				},
			},
		};

		expect(getButtonPresetProperties()).toEqual(['button-bg', 'button-text', 'button-radius']);
	});

	it('throws when the feed is absent', () => {
		delete window.kadenceDesignTokens;

		expect(() => getButtonPresetProperties()).toThrow(/properties is missing or empty/);
	});

	it('throws when the button block is missing from the feed', () => {
		window.kadenceDesignTokens = { presets: { 'kadence/other-block': { properties: ['x'] } } };

		expect(() => getButtonPresetProperties()).toThrow(/properties is missing or empty/);
	});

	it('throws when the feed has an empty properties array', () => {
		window.kadenceDesignTokens = { presets: { 'kadence/singlebtn': { properties: [] } } };

		expect(() => getButtonPresetProperties()).toThrow(/properties is missing or empty/);
	});
});

describe('nextPresetSlug', () => {
	it('mints the bare base when free', () => {
		expect(nextPresetSlug([], 'button')).toBe('button');
	});

	it('mints a numeric suffix against taken slugs', () => {
		expect(nextPresetSlug(['button'], 'button')).toBe('button-2');
		expect(nextPresetSlug(['button', 'button-2'], 'button')).toBe('button-3');
	});
});

describe('overlayPresetRows', () => {
	const values = {
		'semantic.color.action-primary': '#3633e1',
		'semantic.color.on-primary': '#ffffff',
	};

	const rows = [
		{
			id: 'primary',
			label: 'Primary',
			userCreated: false,
			preview: { background: '#3633e1', color: '#ffffff', borderRadius: '0.5rem' },
		},
		{
			id: 'secondary',
			label: 'Secondary',
			userCreated: false,
			preview: { background: 'transparent', color: '#3633e1', borderRadius: '0.25rem' },
		},
	];

	it('overlays label and re-resolved preview values for the matching row only', () => {
		const draft = {
			label: 'Primary CTA',
			tokens: {
				'button-bg': 'semantic.color.on-primary',
				'button-text': 'semantic.color.action-primary',
				'button-bg-hover': 'semantic.color.action-primary',
				'button-text-hover': 'semantic.color.on-primary',
				'button-radius': '1rem',
			},
		};

		const next = overlayPresetRows(rows, 'primary', draft, values, BUTTON_PRESET.preview);

		expect(next[0]).toEqual({
			id: 'primary',
			label: 'Primary CTA',
			userCreated: false,
			preview: { background: '#ffffff', color: '#3633e1', borderRadius: '1rem' },
		});
		expect(next[1]).toBe(rows[1]);
	});

	it('returns the same array reference for a null draft', () => {
		expect(overlayPresetRows(rows, 'primary', null, values, BUTTON_PRESET.preview)).toBe(rows);
	});

	it('returns the same array reference for an item id matching no row', () => {
		const draft = { label: 'Ghost', tokens: {} };

		expect(overlayPresetRows(rows, 'missing', draft, values, BUTTON_PRESET.preview)).toBe(rows);
	});

	it('leaves non-matching rows object identity untouched', () => {
		const draft = { label: 'Primary CTA', tokens: {} };

		const next = overlayPresetRows(rows, 'primary', draft, values, BUTTON_PRESET.preview);

		expect(next[1]).toBe(rows[1]);
	});
});

describe('resolveSwatchColor', () => {
	const options = [{ id: 'semantic.color.action-primary', value: '#3633e1' }];
	const values = { 'semantic.color.action-primary': '#000000', 'primitive.color.gray-100': '#eeeeee' };

	it("prefers the matching option's own resolved value", () => {
		expect(resolveSwatchColor(options, values, 'semantic.color.action-primary')).toBe('#3633e1');
	});

	it('falls back to the values map for an id outside the options pool', () => {
		expect(resolveSwatchColor(options, values, 'primitive.color.gray-100')).toBe('#eeeeee');
	});

	it('returns an empty string when unresolvable by either source', () => {
		expect(resolveSwatchColor(options, values, 'semantic.color.does-not-exist')).toBe('');
	});
});

describe('presetNameSchema', () => {
	it('carries only the label field, since the name is tab-independent', () => {
		const schema = presetNameSchema();
		const fields = schema.panels.flatMap((panel) => panel.fields);

		expect(fields).toHaveLength(1);
		expect(fields[0]).toMatchObject({ type: 'text', path: 'label' });
	});
});

describe('BUTTON_PRESET.schemaFor', () => {
	it('lists the Text/Background color fields and the role-narrowed Radius field on the Normal tab', () => {
		const schema = BUTTON_PRESET.schemaFor('normal');
		const paths = schema.panels.flatMap((panel) => panel.fields.map((field) => field.path));

		expect(paths).toEqual([
			'tokens.button-text',
			'tokens.button-bg',
			'tokens.button-radius',
			'tokens.button-padding',
			'tokens.button-margin',
		]);

		const radiusField = schema.panels
			.flatMap((panel) => panel.fields)
			.find((field) => field.path === 'tokens.button-radius');

		expect(radiusField).toMatchObject({ type: 'radius', tokenType: 'dimension', role: 'radius' });
	});

	it('lists the hover color fields, with no radius field, on the Hover tab', () => {
		const schema = BUTTON_PRESET.schemaFor('hover');
		const paths = schema.panels.flatMap((panel) => panel.fields.map((field) => field.path));

		expect(paths).toEqual(['tokens.button-text-hover', 'tokens.button-bg-hover']);
		expect(paths).not.toContain('tokens.button-radius');
	});

	it('leaves the name out of both tabs, so it cannot render twice', () => {
		for (const tab of ['normal', 'hover']) {
			const paths = BUTTON_PRESET.schemaFor(tab).panels.flatMap((panel) =>
				panel.fields.map((field) => field.path)
			);

			expect(paths).not.toContain('label');
		}
	});

	describe('padding/margin defaultValue', () => {
		const originalFeed = window.kadenceDesignTokens;

		afterEach(() => {
			window.kadenceDesignTokens = originalFeed;
		});

		/**
		 * Read a field's `defaultValue` off the Normal tab's spacing panel.
		 *
		 * @param {string} path The field's `path`, e.g. `'tokens.button-padding'`.
		 *
		 * @return {*} The field's `defaultValue`.
		 */
		function defaultValueFor(path) {
			return BUTTON_PRESET.schemaFor('normal')
				.panels.flatMap((panel) => panel.fields)
				.find((field) => field.path === path).defaultValue;
		}

		it('resolves the padding default from the semantic.spacing.button-padding-* tokens', () => {
			window.kadenceDesignTokens = {
				values: {
					'semantic.spacing.button-padding-top': '0.5em',
					'semantic.spacing.button-padding-right': '1.25em',
					'semantic.spacing.button-padding-bottom': '0.5em',
					'semantic.spacing.button-padding-left': '1.25em',
				},
			};

			expect(defaultValueFor('tokens.button-padding')).toEqual(['0.5em', '1.25em', '0.5em', '1.25em']);
		});

		it('resolves the margin default from the semantic.spacing.button-margin-* tokens', () => {
			window.kadenceDesignTokens = {
				values: {
					'semantic.spacing.button-margin-top': '4px',
					'semantic.spacing.button-margin-right': '0',
					'semantic.spacing.button-margin-bottom': '4px',
					'semantic.spacing.button-margin-left': '0',
				},
			};

			expect(defaultValueFor('tokens.button-margin')).toEqual(['4px', '0', '4px', '0']);
		});

		it('falls back to the button literal default when a token is missing from the feed', () => {
			window.kadenceDesignTokens = { values: {} };

			expect(defaultValueFor('tokens.button-padding')).toEqual(['0.4em', '1em', '0.4em', '1em']);
			expect(defaultValueFor('tokens.button-margin')).toEqual(['0', '0', '0', '0']);
		});

		it('falls back to the literal default when the feed itself is absent', () => {
			delete window.kadenceDesignTokens;

			expect(defaultValueFor('tokens.button-padding')).toEqual(['0.4em', '1em', '0.4em', '1em']);
		});
	});
});

describe('presetSaveTokens with non-scalar values', () => {
	const NS = 'com.kadence.designTokens';

	it('aliases the ids inside a responsive envelope, not just a bare scalar', () => {
		const draft = {
			'button-radius': {
				$value: 'primitive.dimension.radius-sm',
				$extensions: { [NS]: { responsive: { tablet: 'primitive.dimension.radius-xs' } } },
			},
		};

		const written = presetSaveTokens(draft, {}, {});

		expect(written['button-radius'].$value).toBe('{primitive.dimension.radius-sm}');
		expect(written['button-radius'].$extensions[NS].responsive.tablet).toBe('{primitive.dimension.radius-xs}');
	});

	it('aliases every id in a per-corner slot list', () => {
		const draft = {
			'button-radius': ['semantic.dimension.control-radius', '0.5rem', 'primitive.dimension.radius-sm', ''],
		};

		expect(presetSaveTokens(draft, {}, {})['button-radius']).toEqual([
			'{semantic.dimension.control-radius}',
			'0.5rem',
			'{primitive.dimension.radius-sm}',
			'',
		]);
	});

	it('leaves an untouched non-scalar exactly as it was stored', () => {
		const stored = { $value: '{primitive.dimension.radius-lg}' };
		const seeded = { $value: '{primitive.dimension.radius-lg}' };

		const written = presetSaveTokens(
			{ 'button-radius': seeded },
			{ 'button-radius': seeded },
			{
				'button-radius': stored,
			}
		);

		expect(written['button-radius']).toBe(stored);
	});
});

describe('seed/save round trip', () => {
	const NS = 'com.kadence.designTokens';

	it('seeds a responsive envelope as bare ids so a saved draft stops being dirty', () => {
		const stored = {
			$value: '{primitive.dimension.radius-sm}',
			$extensions: { [NS]: { responsive: { tablet: '{primitive.dimension.radius-lg}' } } },
		};

		const seeded = presetInitialValues(
			{ presets: { primary: { label: 'Primary', tokens: { 'button-radius': stored } } } },
			'primary',
			['button-radius']
		);

		// What the panel compares its draft against: every nested alias unwrapped, matching exactly
		// what the field writes back into the draft.
		expect(seeded.tokens['button-radius']).toEqual({
			$value: 'primitive.dimension.radius-sm',
			$extensions: { [NS]: { responsive: { tablet: 'primitive.dimension.radius-lg' } } },
		});

		// And re-aliasing that seed reproduces the stored shape, so an untouched draft is byte-identical
		// to what is already on the server.
		expect(presetSaveTokens({ 'button-radius': seeded.tokens['button-radius'] }, {}, {})).toEqual({
			'button-radius': stored,
		});
	});

	it('seeds a per-corner slot list as bare ids', () => {
		const seeded = presetInitialValues(
			{
				presets: {
					primary: {
						tokens: {
							'button-radius': [
								'{primitive.dimension.radius-sm}',
								'0.5rem',
								'',
								'{semantic.dimension.control-radius}',
							],
						},
					},
				},
			},
			'primary',
			['button-radius']
		);

		expect(seeded.tokens['button-radius']).toEqual([
			'primitive.dimension.radius-sm',
			'0.5rem',
			'',
			'semantic.dimension.control-radius',
		]);
	});
});

describe('resolveTokenValue at a breakpoint', () => {
	const NS = 'com.kadence.designTokens';
	const values = { 'radius.sm': '0.1875rem', 'radius.lg': '0.5rem', 'radius.none': '0' };

	const envelope = {
		$value: '{radius.sm}',
		$extensions: { [NS]: { responsive: { tablet: '{radius.lg}' } } },
	};

	it('resolves the breakpoint override when one exists', () => {
		expect(resolveTokenValue(values, envelope, 'tablet')).toBe('0.5rem');
	});

	it('steps an unset mobile down to the tablet override, not to desktop', () => {
		// The projected tablet media query covers mobile widths, so tablet is what actually renders here.
		expect(resolveTokenValue(values, envelope, 'mobile')).toBe('0.5rem');
	});

	it('falls through to the base value when no breakpoint above is set either', () => {
		expect(resolveTokenValue(values, { $value: '{radius.sm}' }, 'mobile')).toBe('0.1875rem');
	});

	it('resolves the base value at desktop, and by default', () => {
		expect(resolveTokenValue(values, envelope, 'desktop')).toBe('0.1875rem');
		expect(resolveTokenValue(values, envelope)).toBe('0.1875rem');
	});

	it('resolves a slot list held at a breakpoint into the shorthand', () => {
		const perCorner = {
			$value: '{radius.sm}',
			$extensions: { [NS]: { responsive: { tablet: ['{radius.lg}', '{radius.none}', '{radius.lg}', '0'] } } },
		};

		expect(resolveTokenValue(values, perCorner, 'tablet')).toBe('0.5rem 0 0.5rem 0');
	});
});
