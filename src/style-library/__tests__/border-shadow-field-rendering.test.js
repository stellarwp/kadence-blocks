/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PICKABLE_TOKENS_GLOBAL } from '../constants';

// Stubs, not the real controls: `BorderControl`/`BoxShadowControl` render a deep tree of pickers and
// popovers that have nothing to do with what this suite is after. Standing in for them exposes
// exactly the props the adapters compute, which is what these tests drive and assert on.
let latestBorderControlProps;
let latestBoxShadowControlProps;

jest.mock('../../token-controls/controls/BorderControl', () => ({
	BorderControl: (props) => {
		latestBorderControlProps = props;

		return null;
	},
}));

jest.mock('../../token-controls/controls/BoxShadowControl', () => ({
	BoxShadowControl: (props) => {
		latestBoxShadowControlProps = props;

		return null;
	},
}));

// eslint-disable-next-line import/first -- must follow the jest.mock calls above.
import { BorderField } from '../components/molecules/fields/BorderField';
// eslint-disable-next-line import/first -- must follow the jest.mock calls above.
import { BoxShadowField, resolveShadowPick } from '../components/molecules/fields/BoxShadowField';

describe('BorderField', () => {
	let container;
	let root;
	const originalPool = window[PICKABLE_TOKENS_GLOBAL];

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		window[PICKABLE_TOKENS_GLOBAL] = {
			tokens: [
				{ id: 'primitive.dimension.border-width.sm', label: 'Small', type: 'dimension', role: 'border-width' },
				{
					id: 'semantic.border-width.default',
					label: 'Border Width',
					type: 'dimension',
					role: 'border-width',
				},
				{ id: 'primitive.dimension.radius.sm', label: 'Radius Small', type: 'dimension', role: 'radius' },
			],
			values: { brand: { 'primitive.dimension.border-width.sm': '1px' } },
		};
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
		latestBorderControlProps = undefined;
		window[PICKABLE_TOKENS_GLOBAL] = originalPool;
	});

	it("sources widthTokens from the 'border-width' role only, excluding radius", () => {
		const field = { label: 'Border', path: 'tokens.button-border', responsive: true };

		act(() => {
			root.render(createElement(BorderField, { field, values: {}, onValueChange: jest.fn() }));
		});

		// The role's fixed "None" entry is prepended ahead of the role's own matched tokens.
		expect(latestBorderControlProps.widthTokens.map((token) => token.id)).toEqual([
			'ss-none-border-width',
			'primitive.dimension.border-width.sm',
		]);
		expect(latestBorderControlProps.widthTokens[1].alias).toBe('{primitive.dimension.border-width.sm}');
	});

	it('forwards the field\'s defaultValue to BorderControl, so a reset width shows muted "Default" instead of blank', () => {
		const field = { label: 'Border', path: 'tokens.button-border', defaultValue: '1px' };

		act(() => {
			root.render(createElement(BorderField, { field, values: {}, onValueChange: jest.fn() }));
		});

		expect(latestBorderControlProps.defaultValue).toBe('1px');
	});

	it("shows the preset's own stored width as bound, not the generic literal fallback, once the draft is reset", () => {
		const field = { label: 'Border', path: 'tokens.button-border', defaultValue: '1px' };

		act(() => {
			root.render(
				createElement(BorderField, {
					field,
					values: {},
					originalValues: { tokens: { 'button-border-width': 'semantic.border-width.default' } },
					onValueChange: jest.fn(),
				})
			);
		});

		expect(latestBorderControlProps.value.width).toBe('{semantic.border-width.default}');
	});

	it('falls back to the generic literal defaultValue when the preset has no stored width either', () => {
		const field = { label: 'Border', path: 'tokens.button-border', defaultValue: '1px' };

		act(() => {
			root.render(
				createElement(BorderField, {
					field,
					values: {},
					originalValues: { tokens: {} },
					onValueChange: jest.fn(),
				})
			);
		});

		expect(latestBorderControlProps.value.width).toBe('');
		expect(latestBorderControlProps.defaultValue).toBe('1px');
	});

	it('shows a semantic-bound width as unset rather than listing the semantic', () => {
		const field = { label: 'Border', path: 'tokens.button-border' };

		act(() => {
			root.render(
				createElement(BorderField, {
					field,
					values: { tokens: { 'button-border-width': 'semantic.border-width.default' } },
					onValueChange: jest.fn(),
				})
			);
		});

		// The pool stays the role's primitive scale (behind the shared fixed "None" sentinel): a semantic
		// is the block's role-based default, not something a site owner picked, so it is never offered as
		// a peer of the steps.
		expect(latestBorderControlProps.widthTokens.map((token) => token.id)).toEqual([
			'ss-none-border-width',
			'primitive.dimension.border-width.sm',
		]);

		// And the width reads as unset rather than as the raw dot-path it would otherwise render,
		// having no pool entry to name it.
		expect(latestBorderControlProps.value.width).toBe('');
	});

	it('threads breakpoints only when the field is responsive', () => {
		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border', responsive: true },
					values: {},
					onValueChange: jest.fn(),
				})
			);
		});
		expect(latestBorderControlProps.breakpoints).toEqual(['desktop', 'tablet', 'mobile']);

		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border' },
					values: {},
					onValueChange: jest.fn(),
				})
			);
		});
		expect(latestBorderControlProps.breakpoints).toBeNull();
	});

	it('writes each axis to its own sibling path, in the stored (not control) shape', () => {
		const onValueChange = jest.fn();

		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border' },
					values: {},
					onValueChange,
				})
			);
		});

		act(() => {
			latestBorderControlProps.onChange({ width: 2, style: 'solid', color: '#000' });
		});

		expect(onValueChange).toHaveBeenCalledWith('tokens.button-border-width', '2px');
		expect(onValueChange).toHaveBeenCalledWith('tokens.button-border-style', 'solid');
		expect(onValueChange).toHaveBeenCalledWith('tokens.button-border-color', '#000');
	});

	it('never calls onValueChange when the field is read-only', () => {
		const onValueChange = jest.fn();

		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border', readOnly: true },
					values: {},
					onValueChange,
				})
			);
		});

		act(() => {
			latestBorderControlProps.onChange({ width: 2, style: 'solid', color: '#000' });
		});

		expect(onValueChange).not.toHaveBeenCalled();
		expect(latestBorderControlProps.disabled).toBe(true);
	});

	it('renders the color sub-field through the existing TokenColorSelectField, not a new component', () => {
		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border' },
					values: {},
					onValueChange: jest.fn(),
				})
			);
		});

		const element = latestBorderControlProps.renderColor({ value: '', onChange: jest.fn() });

		expect(element.type.name).toBe('TokenColorSelectField');
	});

	it('a width pick writes only the width path, a style change writes only the style path, color stays where it was', () => {
		const onValueChange = jest.fn();

		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border' },
					values: { tokens: { 'button-border-color': '#171717' } },
					onValueChange,
				})
			);
		});

		act(() => {
			latestBorderControlProps.onChange({
				width: '{primitive.dimension.border-width.sm}',
				style: 'none',
				color: '#171717',
			});
		});

		expect(onValueChange).toHaveBeenCalledWith('tokens.button-border-width', 'primitive.dimension.border-width.sm');
		expect(onValueChange).toHaveBeenCalledWith('tokens.button-border-style', 'none');
		expect(onValueChange).toHaveBeenCalledWith('tokens.button-border-color', '#171717');
	});

	it('clicking unlink switches to per-side editing, survives a same-side edit, and leaves the other sides untouched', () => {
		// A real, stateful host — not a fresh mock per assertion — because the bug this guards against
		// only shows up across a render cycle: the field re-deriving `linked` from the just-written
		// value, not from what `onToggleLink` was told.
		function Harness({ field }) {
			const [values, setValues] = useState({});

			const onValueChange = (path, next) => {
				setValues((current) => ({ ...current, tokens: { ...current.tokens, [path.split('.')[1]]: next } }));
			};

			return createElement(BorderField, { field, values, onValueChange });
		}

		act(() => {
			root.render(createElement(Harness, { field: { label: 'Border', path: 'tokens.button-border' } }));
		});

		// Starts linked: nothing stored yet, no unlink chosen.
		expect(latestBorderControlProps.isLinked).toBe(true);

		// Click unlink. The stored value is still '' (a scalar), so this must not write anything —
		// this is exactly the step that used to bounce straight back to linked.
		act(() => {
			latestBorderControlProps.onToggleLink();
		});

		expect(latestBorderControlProps.isLinked).toBe(false);

		// Edit one side only (top's width, via a picked alias), leaving style/color untouched — the
		// shape a real unlinked `BorderControl` edit produces.
		act(() => {
			latestBorderControlProps.onChange({
				width: ['{primitive.dimension.border-width.sm}', '', '', ''],
				style: 'none',
				color: '',
			});
		});

		// Still unlinked after the write — the toggle does not snap back.
		expect(latestBorderControlProps.isLinked).toBe(false);

		// The stored value reflects only the edited side; the other three are untouched. Width and style
		// are independent axes now (each its own sibling path), so the style axis — never diverged in
		// this edit — stays the scalar it was rather than being forced into a four-slot list just
		// because width became one.
		const controlValue = latestBorderControlProps.value;

		expect(controlValue.width).toEqual(['{primitive.dimension.border-width.sm}', '', '', '']);
		expect(controlValue.style).toBe('none');
	});
});

describe('BoxShadowField', () => {
	let container;
	let root;
	const originalPool = window[PICKABLE_TOKENS_GLOBAL];

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		// Mirrors the real pool: three scale primitives plus two `Brand`-group semantics
		// (`semantic.shadow.media` / `semantic.shadow.button`) that are application-level defaults for
		// other blocks' default CSS, never meant to be end-user-pickable here. All five share the derived
		// `role` of "shadow" — `Pickable_Tokens_Catalog::role_of()` reads it off the id's second
		// dot-segment, which is `shadow` for every one of them.
		window[PICKABLE_TOKENS_GLOBAL] = {
			tokens: [
				{ id: 'primitive.shadow.xs', label: 'XS', type: 'shadow', role: 'shadow' },
				{ id: 'primitive.shadow.sm', label: 'SM', type: 'shadow', role: 'shadow' },
				{ id: 'primitive.shadow.md', label: 'MD', type: 'shadow', role: 'shadow' },
				{ id: 'semantic.shadow.media', label: 'Media Shadow', type: 'shadow', role: 'shadow' },
				{ id: 'semantic.shadow.button', label: 'Button Shadow', type: 'shadow', role: 'shadow' },
			],
			values: {},
		};
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
		latestBoxShadowControlProps = undefined;
		window[PICKABLE_TOKENS_GLOBAL] = originalPool;
	});

	it("sources tokens via pickableTokensForType('shadow', 'shadow', ...), excluding the Brand-group semantics", () => {
		act(() => {
			root.render(createElement(BoxShadowField, { field: { label: 'Shadow' }, value: '', onChange: jest.fn() }));
		});

		expect(latestBoxShadowControlProps.tokens.map((token) => token.id)).toEqual([
			'ss-none-shadow',
			'primitive.shadow.xs',
			'primitive.shadow.sm',
			'primitive.shadow.md',
		]);
		expect(latestBoxShadowControlProps.tokens[1].alias).toBe('{primitive.shadow.xs}');
	});

	it('shows a semantic-bound shadow as unset rather than listing the semantic', () => {
		act(() => {
			root.render(
				createElement(BoxShadowField, {
					field: { label: 'Shadow' },
					// A BARE id, which is what a draft holds: `presetInitialValues` runs every seeded
					// value through `aliasToIdDeep`. The braced form is accepted too, but never arrives.
					value: 'semantic.shadow.button',
					onChange: jest.fn(),
				})
			);
		});

		// The list stays the Shadow screen's own three steps (behind the shared fixed "None" sentinel) —
		// no Brand-group semantic among them.
		expect(latestBoxShadowControlProps.tokens.map((token) => token.id)).toEqual([
			'ss-none-shadow',
			'primitive.shadow.xs',
			'primitive.shadow.sm',
			'primitive.shadow.md',
		]);

		// Unset, not the composite-shadow reading. Passing the semantic through left the control with no
		// matching entry and it labelled the trigger `Custom`, which claims a shadow was composed by hand.
		expect(latestBoxShadowControlProps.value).toBeUndefined();
	});

	it('does not error and exempts nothing when the value is a composite shadow object, not a token reference', () => {
		act(() => {
			root.render(
				createElement(BoxShadowField, {
					field: { label: 'Shadow' },
					value: { color: '#000', hOffset: 0, vOffset: 4, blur: 8, spread: 0 },
					onChange: jest.fn(),
				})
			);
		});

		expect(latestBoxShadowControlProps.tokens.map((token) => token.id)).toEqual([
			'ss-none-shadow',
			'primitive.shadow.xs',
			'primitive.shadow.sm',
			'primitive.shadow.md',
		]);
	});

	it('wraps a primitive-bound bare id into the alias the control matches its list against', () => {
		act(() => {
			root.render(
				createElement(BoxShadowField, {
					field: { label: 'Shadow' },
					value: 'primitive.shadow.sm',
					onChange: jest.fn(),
				})
			);
		});

		// Without the wrap the control finds no entry for the bare id and labels the trigger `Custom`,
		// which claims a shadow was composed by hand.
		expect(latestBoxShadowControlProps.value).toBe('{primitive.shadow.sm}');
		expect(latestBoxShadowControlProps.breakpoints).toBeUndefined();
	});

	it('writes a pick back as a bare id, so the panel can tell a saved preset is no longer dirty', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(createElement(BoxShadowField, { field: { label: 'Shadow' }, value: '', onChange }));
		});

		act(() => {
			latestBoxShadowControlProps.onChange('{primitive.shadow.md}');
		});

		// Bare, matching every other field and the shape `presetInitialValues` seeds. Storing the braced
		// form would leave the draft permanently unequal to its seeded value and Save enabled forever.
		expect(onChange).toHaveBeenCalledWith('primitive.shadow.md');
	});

	it('passes a composite shadow object through untouched', () => {
		const onChange = jest.fn();
		const composite = { color: '#000', hOffset: 0, vOffset: 4, blur: 8, spread: 0 };

		act(() => {
			root.render(createElement(BoxShadowField, { field: { label: 'Shadow' }, value: composite, onChange }));
		});

		expect(latestBoxShadowControlProps.value).toBe(composite);

		act(() => {
			latestBoxShadowControlProps.onChange(composite);
		});

		expect(onChange).toHaveBeenCalledWith(composite);
	});

	it('never calls onChange when the field is read-only', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				createElement(BoxShadowField, { field: { label: 'Shadow', readOnly: true }, value: '', onChange })
			);
		});

		act(() => {
			latestBoxShadowControlProps.onChange('{semantic.shadow.card}');
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(latestBoxShadowControlProps.disabled).toBe(true);
	});
});

describe('resolveShadowPick', () => {
	const NONE_TOKEN = {
		id: 'ss-none-shadow',
		label: 'None',
		value: '0px 0px 0px 0px transparent',
		alias: '0px 0px 0px 0px transparent',
		fixed: true,
		type: 'shadow',
		role: 'shadow',
	};

	const REAL_TOKEN = {
		id: 'primitive.shadow.sm',
		label: 'Small',
		value: '0px 2px 8px 0px #1717171f',
		alias: '{primitive.shadow.sm}',
		type: 'shadow',
		role: 'shadow',
	};

	/**
	 * A fixed sentinel has no registered token behind it for PHP to resolve later, so it is stored as
	 * its literal composite at pick time rather than kept as a live alias.
	 *
	 * @return {void}
	 */
	it('resolves a fixed None pick to the literal zero composite', () => {
		expect(resolveShadowPick(NONE_TOKEN.alias, [NONE_TOKEN, REAL_TOKEN])).toEqual({
			color: 'transparent',
			offsetX: '0px',
			offsetY: '0px',
			blur: '0px',
			spread: '0px',
			inset: false,
		});
	});

	/**
	 * A real token stays a live alias, so a later edit to its scale still cascades into this preset.
	 *
	 * @return {void}
	 */
	it('keeps a real token pick as its live alias', () => {
		expect(resolveShadowPick(REAL_TOKEN.alias, [NONE_TOKEN, REAL_TOKEN])).toBe(REAL_TOKEN.alias);
	});

	/**
	 * A hand-composed shadow is already literal and passes through untouched.
	 *
	 * @return {void}
	 */
	it('passes a Custom-tab composite through unchanged', () => {
		const composite = {
			color: '#ff0000',
			offsetX: '1px',
			offsetY: '1px',
			blur: '2px',
			spread: '0px',
			inset: false,
		};

		expect(resolveShadowPick(composite, [NONE_TOKEN, REAL_TOKEN])).toBe(composite);
	});
});
