/* eslint-env jest */
import {
	defaultSummary,
	fieldSummary,
	findTokenEntry,
	hasValue,
	isTokenAlias,
	resolveDefaultValue,
} from '../helpers/token-summary';

const TOKENS = [
	{ id: 'none', label: 'None', value: '0', alias: '{primitive.dimension.radius-none}' },
	{ id: 'sm', label: 'Small', value: '0.1875rem', alias: '{primitive.dimension.radius-sm}' },
	{ id: 'lg', label: 'Large', value: '0.5rem', alias: '{primitive.dimension.radius-lg}' },
];

// A `fixed` entry (e.g. Margin's `Auto`) has no DTCG registration behind it, so its `alias` is a bare
// slug rather than a bracket-wrapped dot path — the shape `kadence/singlebtn`'s `edit.js` appends for
// `ss-auto`.
const TOKENS_WITH_FIXED = [...TOKENS, { id: 'ss-auto', label: 'Auto', value: 'auto', alias: 'ss-auto', fixed: true }];

describe('isTokenAlias', () => {
	it('accepts a brace-wrapped dot path', () => {
		expect(isTokenAlias('{primitive.dimension.radius-sm}')).toBe(true);
	});

	it('rejects a bare id, a literal and a non-string', () => {
		expect(isTokenAlias('primitive.dimension.radius-sm')).toBe(false);
		expect(isTokenAlias('0.5rem')).toBe(false);
		expect(isTokenAlias(12)).toBe(false);
	});
});

describe('hasValue', () => {
	it('treats empty string, null and undefined as unset, and zero as set', () => {
		expect(hasValue('')).toBe(false);
		expect(hasValue(null)).toBe(false);
		expect(hasValue(undefined)).toBe(false);
		expect(hasValue(0)).toBe(true);
	});
});

describe('findTokenEntry', () => {
	it('matches on alias, not id', () => {
		expect(findTokenEntry(TOKENS, '{primitive.dimension.radius-sm}').label).toBe('Small');
		expect(findTokenEntry(TOKENS, 'sm')).toBeNull();
	});

	it('tolerates an absent list', () => {
		expect(findTokenEntry(undefined, '{x}')).toBeNull();
	});

	it('matches a fixed entry on its bare alias, since it has no bracket form', () => {
		expect(findTokenEntry(TOKENS_WITH_FIXED, 'ss-auto').label).toBe('Auto');
	});

	it('never matches a non-fixed entry on a bare literal, even one equal to its alias text', () => {
		expect(findTokenEntry(TOKENS, 'primitive.dimension.radius-sm')).toBeNull();
	});
});

describe('resolveDefaultValue', () => {
	it('resolves an alias through the pickable list', () => {
		expect(resolveDefaultValue('{primitive.dimension.radius-lg}', TOKENS, 'px')).toBe('0.5rem');
	});

	it('resolves a dangling alias to nothing rather than leaking the dot path', () => {
		expect(resolveDefaultValue('{primitive.dimension.gone}', TOKENS, 'px')).toBe('');
	});

	it('completes an inherited bare number with the control unit', () => {
		expect(resolveDefaultValue(8, TOKENS, 'px', true)).toBe('8px');
	});

	it('leaves a preset literal alone, since it already carries its unit', () => {
		expect(resolveDefaultValue('3px', TOKENS, 'rem', false)).toBe('3px');
	});

	it('does not append a unit to a non-inherited number, so a unitless token stays comparable', () => {
		expect(resolveDefaultValue('0', TOKENS, 'px', false)).toBe('0');
	});

	it('is empty for an unset default', () => {
		expect(resolveDefaultValue('', TOKENS, 'px')).toBe('');
		expect(resolveDefaultValue(null, TOKENS, 'px')).toBe('');
	});

	it("resolves a fixed entry (Margin's Auto) through the pickable list, same as a bracketed alias", () => {
		expect(resolveDefaultValue('ss-auto', TOKENS_WITH_FIXED, 'px', true)).toBe('auto');
	});
});

describe('defaultSummary', () => {
	it('names the default by the token that resolves to the same value', () => {
		expect(defaultSummary('0.1875rem', TOKENS)).toEqual({ label: 'Small', value: '0.1875rem' });
	});

	it('shows the value alone when no token matches it', () => {
		expect(defaultSummary('7px', TOKENS)).toEqual({ label: '', value: '7px' });
	});

	it('is blank when there is no default', () => {
		expect(defaultSummary('', TOKENS)).toEqual({ label: '', value: '' });
	});
});

describe('fieldSummary', () => {
	it('names a bound token and its resolved value', () => {
		expect(fieldSummary('{primitive.dimension.radius-lg}', TOKENS, 'px', 'Custom')).toEqual({
			label: 'Large',
			value: '0.5rem',
		});
	});

	it('falls back to the dot path when the bound token is missing from the list', () => {
		expect(fieldSummary('{primitive.dimension.gone}', TOKENS, 'px', 'Custom')).toEqual({
			label: 'primitive.dimension.gone',
			value: '',
		});
	});

	it('labels a literal Custom and appends the control unit', () => {
		expect(fieldSummary(12, TOKENS, 'px', 'Custom')).toEqual({ label: 'Custom', value: '12px' });
	});

	it('summarizes an unset slot to nothing, so the caller can show the default instead', () => {
		expect(fieldSummary('', TOKENS, 'px', 'Custom')).toEqual({ label: '', value: '' });
	});

	it("names a fixed entry (Margin's Auto) by its label and resolved value, not as a Custom literal", () => {
		expect(fieldSummary('ss-auto', TOKENS_WITH_FIXED, 'px', 'Custom')).toEqual({
			label: 'Auto',
			value: 'auto',
		});
	});

	it("never reads a hand-typed literal equal to a fixed entry's alias as that entry", () => {
		// cspell:disable-next-line
		expect(fieldSummary('ss-auto', TOKENS, 'px', 'Custom')).toEqual({ label: 'Custom', value: 'ss-autopx' });
	});
});

describe('defaultSummary naming', () => {
	const tokens = [{ id: 'radius.sm', alias: '{radius.sm}', label: 'Small', value: '0.1875rem' }];

	it('names a fallback that matches a token after that token', () => {
		expect(defaultSummary('0.1875rem', tokens, 'Default')).toEqual({ label: 'Small', value: '0.1875rem' });
	});

	it('names a literal fallback after the state it is in, never Custom', () => {
		// `Custom` is what a value the user SET is called; reusing it here would make "nothing is set" and
		// "a custom value is set" render the same.
		expect(defaultSummary('0.4em', tokens, 'Default')).toEqual({ label: 'Default', value: '0.4em' });
		expect(defaultSummary('0.4em', tokens, 'Inherited')).toEqual({ label: 'Inherited', value: '0.4em' });
	});

	it('says nothing when there is no fallback at all', () => {
		expect(defaultSummary('', tokens, 'Default')).toEqual({ label: '', value: '' });
	});
});
