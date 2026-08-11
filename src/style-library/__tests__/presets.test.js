/* eslint-env jest */
import {
	aliasToId,
	idToAlias,
	resolveTokenValue,
	isNonScalarPresetValue,
	presetRows,
	presetInitialValues,
	presetSaveTokens,
	nextPresetSlug,
	getButtonPresetProperties,
	overlayPresetRows,
	resolveSwatchColor,
	buttonSettingsSchema,
} from '../helpers/presets';

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

		const rows = presetRows(payload, values);

		expect(rows.map((row) => row.id)).toEqual(['primary', 'secondary']);
		expect(rows[0]).toEqual({
			id: 'primary',
			label: 'Primary',
			userCreated: false,
			preview: { background: '#3633e1', color: '#ffffff', borderRadius: '0.5rem' },
		});
		expect(rows[1].preview).toEqual({ background: 'transparent', color: '#3633e1', borderRadius: '0.25rem' });
	});

	it('falls back to the slug for a label-less preset', () => {
		const payload = { userCreated: [], presets: { outline: { tokens: {} } } };

		expect(presetRows(payload, values)[0].label).toBe('outline');
	});

	it('marks userCreated true only for the listed slugs', () => {
		const payload = {
			userCreated: ['outline'],
			presets: { primary: { tokens: {} }, outline: { tokens: {} } },
		};

		const rows = presetRows(payload, values);

		expect(rows.find((row) => row.id === 'primary').userCreated).toBe(false);
		expect(rows.find((row) => row.id === 'outline').userCreated).toBe(true);
	});

	it('marks nothing user-created when the payload has no userCreated key (fail closed)', () => {
		const payload = { presets: { primary: { tokens: {} }, outline: { tokens: {} } } };

		const rows = presetRows(payload, values);

		expect(rows.every((row) => row.userCreated === false)).toBe(true);
	});
});

describe('presetInitialValues', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	it('seeds all five bound properties as bare ids', () => {
		window.kadenceDesignTokens = {
			presets: {
				'kadence/singlebtn': {
					properties: ['button-bg', 'button-text', 'button-bg-hover', 'button-text-hover', 'button-radius'],
				},
			},
		};

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

		expect(presetInitialValues(payload, 'primary')).toEqual({
			label: 'Primary',
			tokens: {
				'button-bg': 'semantic.color.action-primary',
				'button-text': 'semantic.color.on-primary',
				'button-bg-hover': 'semantic.color.action-primary-hover',
				'button-text-hover': 'semantic.color.on-primary',
				'button-radius': '0.5rem',
			},
		});
	});

	it('returns null for an unknown slug', () => {
		expect(presetInitialValues({ presets: {} }, 'missing')).toBeNull();
	});

	it('returns null for a null payload, indistinguishable from an unknown slug', () => {
		// Pins the contract `ButtonSettings` relies on: a still-loading fetch (`payload === null`) and
		// a genuinely unknown slug both read as null here, which is exactly why the panel gates on
		// `!isLoading` before treating a null seed as a stale deep link rather than "not landed yet".
		expect(presetInitialValues(null, 'secondary')).toBeNull();
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
		const loading = presetInitialValues(null, slug);
		const loaded = presetInitialValues(
			{ presets: { secondary: { label: 'Secondary', tokens: { 'button-bg': 'transparent' } } } },
			slug
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

	it('passes an already-wrapped alias through unchanged', () => {
		expect(presetSaveTokens({ 'button-bg': '{semantic.color.action-primary}' })).toEqual({
			'button-bg': '{semantic.color.action-primary}',
		});
	});

	it('passes a literal value through unchanged', () => {
		expect(presetSaveTokens({ 'button-bg': 'transparent' })).toEqual({ 'button-bg': 'transparent' });
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

		const next = overlayPresetRows(rows, 'primary', draft, values);

		expect(next[0]).toEqual({
			id: 'primary',
			label: 'Primary CTA',
			userCreated: false,
			preview: { background: '#ffffff', color: '#3633e1', borderRadius: '1rem' },
		});
		expect(next[1]).toBe(rows[1]);
	});

	it('returns the same array reference for a null draft', () => {
		expect(overlayPresetRows(rows, 'primary', null, values)).toBe(rows);
	});

	it('returns the same array reference for an item id matching no row', () => {
		const draft = { label: 'Ghost', tokens: {} };

		expect(overlayPresetRows(rows, 'missing', draft, values)).toBe(rows);
	});

	it('leaves non-matching rows object identity untouched', () => {
		const draft = { label: 'Primary CTA', tokens: {} };

		const next = overlayPresetRows(rows, 'primary', draft, values);

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

describe('buttonSettingsSchema', () => {
	it('lists NAME, the Text/Background color fields, and the role-narrowed Radius field on the Normal tab', () => {
		const schema = buttonSettingsSchema('normal');
		const paths = schema.panels.flatMap((panel) => panel.fields.map((field) => field.path));

		expect(paths).toEqual(['label', 'tokens.button-text', 'tokens.button-bg', 'tokens.button-radius']);

		const radiusField = schema.panels
			.flatMap((panel) => panel.fields)
			.find((field) => field.path === 'tokens.button-radius');

		expect(radiusField).toMatchObject({ type: 'token-select', tokenType: 'dimension', role: 'radius' });
	});

	it('lists NAME and the hover color fields, with no radius field, on the Hover tab', () => {
		const schema = buttonSettingsSchema('hover');
		const paths = schema.panels.flatMap((panel) => panel.fields.map((field) => field.path));

		expect(paths).toEqual(['label', 'tokens.button-text-hover', 'tokens.button-bg-hover']);
		expect(paths).not.toContain('tokens.button-radius');
	});
});
