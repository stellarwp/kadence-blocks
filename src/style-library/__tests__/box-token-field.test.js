/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import {
	BoxTokenField,
	semanticDefaultOf,
	toControlValue,
	tokensForField,
	toStoredValue,
	withoutSemanticSlots,
} from '../components/molecules/fields/BoxTokenField';
import { PICKABLE_TOKENS_GLOBAL } from '../constants';

// A stub, not the real control: `BoxControl` renders a deep tree of pickers and popovers that have
// nothing to do with what this suite is after. Standing in for it exposes exactly the props
// `BoxTokenField` computes — `unit`, `breakpoint`, and the callbacks a real slot/unit/breakpoint pick
// would invoke — which is what the test drives and asserts on, never the adapter's internal state.
let latestBoxControlProps;

jest.mock('../../token-controls/controls/BoxControl', () => ({
	BoxControl: (props) => {
		latestBoxControlProps = props;

		return null;
	},
}));

describe('toControlValue', () => {
	it('wraps a bare token id into the alias the control matches against', () => {
		expect(toControlValue('semantic.dimension.radius-sm')).toBe('{semantic.dimension.radius-sm}');
		expect(toControlValue('primitive.dimension.radius-lg')).toBe('{primitive.dimension.radius-lg}');
	});

	it('splits a literal down to its bare number, the unit being the control-wide one', () => {
		expect(toControlValue('0.1875rem')).toBe(0.1875);
		expect(toControlValue('12px')).toBe(12);
	});

	it('passes an unparsable literal through rather than blanking it', () => {
		expect(toControlValue('auto')).toBe('auto');
	});

	it('reads an unset slot as unset', () => {
		expect(toControlValue('')).toBe('');
		expect(toControlValue(undefined)).toBe('');
	});
});

describe('toStoredValue', () => {
	it('unwraps an alias back to the bare id a preset stores', () => {
		expect(toStoredValue('{semantic.dimension.radius-sm}', 'rem')).toBe('semantic.dimension.radius-sm');
	});

	it('rejoins a number with the active unit', () => {
		expect(toStoredValue(0.1875, 'rem')).toBe('0.1875rem');
		expect(toStoredValue(12, 'px')).toBe('12px');
	});

	it('keeps zero unitless, so it still equals the None token and does not dirty a clean preset', () => {
		expect(toStoredValue(0, 'px')).toBe('0');
		expect(toStoredValue('0', 'rem')).toBe('0');
	});

	it('writes an unset slot as empty', () => {
		expect(toStoredValue('', 'px')).toBe('');
		expect(toStoredValue(null, 'px')).toBe('');
	});

	/**
	 * A fixed sentinel's keyword is stored verbatim — it is not a token id to unwrap, nor a number to
	 * suffix with a unit.
	 *
	 * @return {void}
	 */
	it('round-trips a fixed sentinel keyword unchanged', () => {
		expect(toStoredValue('ss-auto', 'px')).toBe('ss-auto');
	});
});

describe('the conversion pair', () => {
	it('round-trips every shape a preset slot can hold', () => {
		for (const [stored, unit] of [
			['semantic.dimension.radius-sm', 'rem'],
			['0.1875rem', 'rem'],
			['12px', 'px'],
			['0', 'px'],
			['', 'px'],
		]) {
			expect(toStoredValue(toControlValue(stored), unit)).toBe(stored);
		}
	});
});

describe('withoutSemanticSlots', () => {
	it('blanks a semantic-bound scalar, so the field reads as unset rather than as a selection', () => {
		expect(withoutSemanticSlots('semantic.spacing.media-padding')).toBe('');
	});

	it('leaves a primitive and a literal alone', () => {
		expect(withoutSemanticSlots('primitive.dimension.spacing.sm')).toBe('primitive.dimension.spacing.sm');
		expect(withoutSemanticSlots('1.5rem')).toBe('1.5rem');
	});

	it('blanks only the semantic corners of a mixed slot list', () => {
		expect(withoutSemanticSlots(['semantic.radius.media', 'primitive.dimension.radius.sm', '4px', ''])).toEqual([
			'',
			'primitive.dimension.radius.sm',
			'4px',
			'',
		]);
	});
});

describe('semanticDefaultOf', () => {
	const pool = [
		{ id: 'semantic.spacing.media-padding', value: '0' },
		{ id: 'semantic.radius.media', value: '0.5rem' },
		{ id: 'primitive.dimension.radius.sm', value: '0.25rem' },
	];

	it("resolves a semantic scalar to the literal that becomes the field's default", () => {
		expect(semanticDefaultOf('semantic.spacing.media-padding', pool)).toBe('0');
	});

	it('returns null when nothing binds a semantic, leaving the field default in charge', () => {
		expect(semanticDefaultOf('primitive.dimension.radius.sm', pool)).toBeNull();
		expect(semanticDefaultOf('1.5rem', pool)).toBeNull();
		expect(semanticDefaultOf('', pool)).toBeNull();
	});

	it('resolves the semantic corners of a mixed list and reads the rest from the field default', () => {
		expect(
			semanticDefaultOf(['semantic.radius.media', 'primitive.dimension.radius.sm', '4px', ''], pool, '2px')
		).toEqual(['0.5rem', '2px', '2px', '2px']);
	});

	it("takes each corner's own field default when the declared default is itself a slot list", () => {
		expect(
			semanticDefaultOf(['semantic.radius.media', 'primitive.dimension.radius.sm', '4px', ''], pool, [
				'1px',
				'2px',
				'3px',
				'4px',
			])
		).toEqual(['0.5rem', '2px', '3px', '4px']);
	});

	it('leaves the non-semantic corners empty when the field declares no default', () => {
		expect(semanticDefaultOf(['semantic.radius.media', 'primitive.dimension.radius.sm', '4px', ''], pool)).toEqual([
			'0.5rem',
			'',
			'',
			'',
		]);
	});

	it('resolves an unknown semantic to empty rather than to its raw dot-path', () => {
		expect(semanticDefaultOf('semantic.spacing.gone', pool)).toBe('');
	});

	/**
	 * A binding may point at a semantic that was never declared as a pickable token — eleven of the
	 * shipped bindings do — so a value the picker cannot offer still has to resolve. Searching only the
	 * pickable list blanked those fields instead of showing the value in effect.
	 */
	describe('a semantic the pickable list does not carry', () => {
		const originalPool = window[PICKABLE_TOKENS_GLOBAL];
		const originalFeed = window.kadenceDesignTokens;

		beforeEach(() => {
			window.kadenceDesignTokens = { slug: 'brand' };
			window[PICKABLE_TOKENS_GLOBAL] = {
				tokens: [],
				values: { brand: { 'semantic.spacing.heading-padding': '0' } },
			};
		});

		afterEach(() => {
			window[PICKABLE_TOKENS_GLOBAL] = originalPool;
			window.kadenceDesignTokens = originalFeed;
		});

		it('resolves it through the library rather than blanking the field', () => {
			expect(semanticDefaultOf('semantic.spacing.heading-padding', pool)).toBe('0');
		});

		it('resolves it in every corner of a slot list', () => {
			const slots = Array(4).fill('semantic.spacing.heading-padding');

			expect(semanticDefaultOf(slots, pool)).toEqual(['0', '0', '0', '0']);
		});

		it("falls back to the field's declared default when it resolves nowhere at all", () => {
			expect(semanticDefaultOf('semantic.spacing.gone', pool, '2px')).toBe('2px');
		});
	});
});

describe('the pending unit', () => {
	let container;
	let root;
	let field;
	let value;
	let onChange;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		field = { tokenType: 'dimension', responsive: true, units: ['px', 'em', 'rem', '%'] };
		value = '';
		onChange = jest.fn((next) => {
			value = next;
		});
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
		latestBoxControlProps = undefined;
	});

	/**
	 * Render `BoxTokenField` with whatever `value` currently holds, refreshing the captured
	 * `BoxControl` props.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderField() {
		act(() => {
			root.render(createElement(BoxTokenField, { field, value, onChange, slots: 'sides' }));
		});
	}

	it('does not leak a unit picked with no value on one breakpoint into another breakpoint', () => {
		renderField();

		// On Desktop, pick `em` without typing a value — the choice has nowhere to persist yet.
		act(() => {
			latestBoxControlProps.onUnit('em');
		});
		expect(latestBoxControlProps.unit).toBe('em');

		// Switch to Tablet: a fresh breakpoint must not already read as `em`.
		act(() => {
			latestBoxControlProps.onBreakpointChange('tablet');
		});
		expect(latestBoxControlProps.unit).toBe('px');

		// On Tablet, set the unit to `px` and type `8`.
		act(() => {
			latestBoxControlProps.onUnit('px');
		});
		act(() => {
			latestBoxControlProps.onChange(8);
		});
		renderField();
		expect(latestBoxControlProps.unit).toBe('px');

		// Switch back to Desktop: the pending `em` picked there must still be in effect.
		act(() => {
			latestBoxControlProps.onBreakpointChange('desktop');
		});
		expect(latestBoxControlProps.unit).toBe('em');
	});
});

describe('tokensForField', () => {
	/**
	 * Only a margin field offers the fixed "Auto" sentinel — padding has no auto behavior to express,
	 * so offering it there would be a pick the block cannot honor.
	 *
	 * @return {void}
	 */
	it('offers Auto only for a margin field, not padding', () => {
		const marginTokens = tokensForField(
			{ path: 'tokens.button-margin', tokenType: 'dimension', role: 'spacing' },
			''
		);
		const paddingTokens = tokensForField(
			{ path: 'tokens.button-padding', tokenType: 'dimension', role: 'spacing' },
			''
		);

		expect(marginTokens.some((token) => token.id === 'ss-auto')).toBe(true);
		expect(paddingTokens.some((token) => token.id === 'ss-auto')).toBe(false);
	});

	/**
	 * The None sentinel's alias is the bare number 0, not a `{...}` id string: it has no registered
	 * token behind it, so bracket-wrapping it would store a dot-path that resolves to nothing.
	 *
	 * @return {void}
	 */
	it('resolves a None pick to the bare number 0, not a bracket string', () => {
		const marginTokens = tokensForField(
			{ path: 'tokens.button-margin', tokenType: 'dimension', role: 'spacing' },
			''
		);
		const none = marginTokens.find((token) => token.id === 'ss-none-spacing');

		expect(none.alias).toBe(0);
	});
});

describe('what a reset draft shows', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
		latestBoxControlProps = undefined;
	});

	/**
	 * Render `BoxTokenField` with the given draft/original values.
	 *
	 * @param {Object}  props                The field's `value`/`originalValue` to render with.
	 * @param {*}       [props.defaultValue] The schema's declared default; `null` declares none.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderField({ value, originalValue, defaultValue = '0.1875rem' }) {
		act(() => {
			root.render(
				createElement(BoxTokenField, {
					field: {
						path: 'tokens.radius',
						tokenType: 'dimension',
						role: 'radius',
						responsive: true,
						defaultValue,
					},
					value,
					originalValue,
					onChange: jest.fn(),
					slots: 'corners',
				})
			);
		});
	}

	/**
	 * A reset reads as unset with the schema's default shown muted; the preset's stored value is never
	 * put back into the control as a bold, set value.
	 *
	 * @return {void}
	 */
	it("shows a reset draft as unset with the muted Default, never the preset's stored value as bound", () => {
		renderField({ value: '', originalValue: 'primitive.dimension.radius-lg' });

		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.defaultValue).toBe('0.1875rem');
		expect(latestBoxControlProps.inherited).toBe(false);
	});

	/**
	 * With nothing stored anywhere the schema's declared default is all there is to show.
	 *
	 * @return {void}
	 */
	it("falls back to the schema's declared default when the preset has no stored value either", () => {
		renderField({ value: '', originalValue: '' });

		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.defaultValue).toBe('0.1875rem');
	});

	/**
	 * A draft that carries a real edit is shown as-is.
	 *
	 * @return {void}
	 */
	it('shows the draft value untouched when the field actually carries an edit', () => {
		renderField({ value: '0.5rem', originalValue: 'semantic.radius.control' });

		expect(latestBoxControlProps.value).toEqual(toControlValue('0.5rem'));
	});

	/**
	 * A schema with no declared default still has something honest to show muted: the preset's own
	 * stored desktop value, which is what the omitted property resolves back to once saved.
	 *
	 * @return {void}
	 */
	it("shows the preset's stored desktop value muted, as the Default, when the schema declares none", () => {
		renderField({ value: '', originalValue: '0.75rem', defaultValue: null });

		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.defaultValue).toBe('0.75rem');
		expect(latestBoxControlProps.inherited).toBe(false);
	});

	/**
	 * A desktop base reset inside an envelope that keeps a tablet override reads as unset at desktop,
	 * with the schema's default muted — not the stored desktop value the user just reset.
	 *
	 * @return {void}
	 */
	it('shows Default at desktop once the base is reset while a tablet override stands, not the stored desktop value', () => {
		const NS = 'com.kadence.designTokens';

		renderField({
			value: { $value: null, $extensions: { [NS]: { responsive: { tablet: 'primitive.dimension.radius-xs' } } } },
			originalValue: 'primitive.dimension.radius-lg',
		});

		// `BoxControl` is stubbed; its `value` prop is what the field resolved to show at the active
		// breakpoint (desktop by default).
		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.defaultValue).toBe('0.1875rem');
	});
});

describe('a reset responsive field', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		latestBoxControlProps = undefined;
	});

	/**
	 * Render a responsive `BoxTokenField` and switch it to `breakpoint`.
	 *
	 * @param {Object} props        The field's `value`/`originalValue`/`defaultValue`.
	 * @param {string} breakpoint   The breakpoint to switch to.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderAt({ value, originalValue, defaultValue }, breakpoint) {
		act(() => {
			root.render(
				createElement(BoxTokenField, {
					field: {
						path: 'tokens.radius',
						tokenType: 'dimension',
						role: 'radius',
						responsive: true,
						defaultValue,
					},
					value,
					originalValue,
					onChange: jest.fn(),
					slots: 'corners',
				})
			);
		});
		act(() => latestBoxControlProps.onBreakpointChange(breakpoint));
	}

	/**
	 * A function default is called with the active breakpoint, so a default that varies by
	 * breakpoint (a hover field's resting radius) reads the breakpoint's own value, not desktop's.
	 *
	 * @return {void}
	 */
	it('resolves a function default at the active breakpoint', () => {
		const defaultValue = jest.fn((breakpoint) => (breakpoint === 'tablet' ? '0' : '0.5rem'));

		renderAt({ value: '', originalValue: '', defaultValue }, 'tablet');

		expect(defaultValue).toHaveBeenCalledWith('tablet');
		expect(latestBoxControlProps.defaultValue).toBe('0');
	});

	/**
	 * A draft that carries only a desktop value inherits it at Tablet: the control reads unset there,
	 * tagged Inherited, with the desktop literal as the muted value.
	 *
	 * @return {void}
	 */
	it('shows the desktop value muted as Inherited at Tablet when the draft stores no tablet override', () => {
		renderAt({ value: '0.75rem', originalValue: '0.75rem' }, 'tablet');

		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.inherited).toBe(true);
		expect(latestBoxControlProps.defaultValue).toBe('0.75rem');
	});

	/**
	 * Mobile steps through tablet first, so a tablet override is what Mobile inherits.
	 *
	 * @return {void}
	 */
	it('inherits a tablet override over the desktop value at Mobile', () => {
		const envelope = {
			$value: '0.75rem',
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: '0.5rem' } } },
		};

		renderAt({ value: envelope, originalValue: envelope }, 'mobile');

		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.inherited).toBe(true);
		expect(latestBoxControlProps.defaultValue).toBe('0.5rem');
	});

	/**
	 * A fully reset draft has no breakpoint to inherit from, so Tablet shows the preset's stored
	 * desktop value muted as a plain Default rather than as bound or as Inherited.
	 *
	 * @return {void}
	 */
	it("shows the preset's stored value muted, not bound, at Tablet once the whole draft is reset", () => {
		renderAt({ value: '', originalValue: '0.75rem' }, 'tablet');

		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
		expect(latestBoxControlProps.inherited).toBe(false);
		expect(latestBoxControlProps.defaultValue).toBe('0.75rem');
	});
});

describe('switching unit on a reset field', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		latestBoxControlProps = undefined;
	});

	/**
	 * The unit switcher retypes what the field is SHOWING, and a reset field shows nothing of its own:
	 * the preset's stored value stays a muted default and is never materialized into the draft, so a
	 * reset that is only followed by a unit switch stays reset.
	 *
	 * @return {void}
	 */
	it("leaves a reset draft empty rather than retyping the preset's stored value into it", () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				createElement(BoxTokenField, {
					field: { path: 'tokens.radius', tokenType: 'dimension', role: 'radius' },
					value: '',
					originalValue: '1rem',
					onChange,
					slots: 'corners',
				})
			);
		});

		act(() => latestBoxControlProps.onUnit('px'));

		expect(onChange).not.toHaveBeenCalledWith('1px');
		expect(latestBoxControlProps.unit).toBe('px');
		expect(latestBoxControlProps.value).toEqual(toControlValue(''));
	});
});
