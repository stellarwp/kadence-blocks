/* eslint-env jest */
import {
	aliasToId,
	idToAlias,
	resolveTokenValue,
	presetRows,
	presetInitialValues,
	presetSaveTokens,
	nextPresetSlug,
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
	it('seeds all five bound properties as bare ids', () => {
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

describe('nextPresetSlug', () => {
	it('mints the bare base when free', () => {
		expect(nextPresetSlug([], 'button')).toBe('button');
	});

	it('mints a numeric suffix against taken slugs', () => {
		expect(nextPresetSlug(['button'], 'button')).toBe('button-2');
		expect(nextPresetSlug(['button', 'button-2'], 'button')).toBe('button-3');
	});
});
