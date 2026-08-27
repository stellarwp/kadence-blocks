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
import { BoxShadowField } from '../components/molecules/fields/BoxShadowField';

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

		expect(latestBorderControlProps.widthTokens.map((token) => token.id)).toEqual([
			'primitive.dimension.border-width.sm',
		]);
		expect(latestBorderControlProps.widthTokens[0].alias).toBe('{primitive.dimension.border-width.sm}');
	});

	it('exempts the bound width token from the primitive narrowing, so a bound semantic stays pickable', () => {
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

		expect(latestBorderControlProps.widthTokens.map((token) => token.id)).toEqual(
			expect.arrayContaining(['semantic.border-width.default'])
		);

		const boundToken = latestBorderControlProps.widthTokens.find(
			(token) => token.id === 'semantic.border-width.default'
		);

		expect(boundToken.label).toBe('Border Width');
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

	it("passes the field's defaultValue through to BorderControl, so an unset width falls back to it instead of collapsing to nothing", () => {
		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border', defaultValue: '1px' },
					values: {},
					onValueChange: jest.fn(),
				})
			);
		});

		expect(latestBorderControlProps.defaultValue).toBe('1px');
	});

	it('passes no defaultValue when the field declares none, matching every existing caller', () => {
		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', path: 'tokens.button-border' },
					values: {},
					onValueChange: jest.fn(),
				})
			);
		});

		expect(latestBorderControlProps.defaultValue).toBeUndefined();
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

	it("sources tokens via pickableTokensForType('shadow', 'shadow', ...), excluding the Brand-group semantics except the fixed None entry", () => {
		act(() => {
			root.render(createElement(BoxShadowField, { field: { label: 'Shadow' }, value: '', onChange: jest.fn() }));
		});

		// `shadowNoneEntry()` leads the list — the one deliberate re-admission of a Brand-group semantic
		// (`semantic.shadow.button`, relabeled "None"); every other Brand-group semantic stays excluded.
		expect(latestBoxShadowControlProps.tokens.map((token) => token.id)).toEqual([
			'semantic.shadow.button',
			'primitive.shadow.xs',
			'primitive.shadow.sm',
			'primitive.shadow.md',
		]);
		expect(latestBoxShadowControlProps.tokens[0].label).toBe('None');
		expect(latestBoxShadowControlProps.tokens[0].alias).toBe('{semantic.shadow.button}');
		expect(latestBoxShadowControlProps.tokens[1].alias).toBe('{primitive.shadow.xs}');
	});

	it('exempts the bound token from the primitive narrowing when it is a Brand-group semantic', () => {
		act(() => {
			root.render(
				createElement(BoxShadowField, {
					field: { label: 'Shadow' },
					value: '{semantic.shadow.button}',
					onChange: jest.fn(),
				})
			);
		});

		expect(latestBoxShadowControlProps.tokens.map((token) => token.id)).toEqual(
			expect.arrayContaining(['semantic.shadow.button'])
		);
		expect(latestBoxShadowControlProps.tokens).not.toEqual(
			expect.arrayContaining([expect.objectContaining({ id: 'semantic.shadow.media' })])
		);
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
			'semantic.shadow.button',
			'primitive.shadow.xs',
			'primitive.shadow.sm',
			'primitive.shadow.md',
		]);
	});

	it('passes the value straight through with no envelope/breakpoint handling', () => {
		act(() => {
			root.render(
				createElement(BoxShadowField, {
					field: { label: 'Shadow' },
					value: '{semantic.shadow.card}',
					onChange: jest.fn(),
				})
			);
		});

		expect(latestBoxShadowControlProps.value).toBe('{semantic.shadow.card}');
		expect(latestBoxShadowControlProps.breakpoints).toBeUndefined();
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
