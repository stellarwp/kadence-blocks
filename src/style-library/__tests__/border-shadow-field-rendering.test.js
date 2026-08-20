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
		const field = { label: 'Border', responsive: true };

		act(() => {
			root.render(createElement(BorderField, { field, value: '', onChange: jest.fn() }));
		});

		expect(latestBorderControlProps.widthTokens.map((token) => token.id)).toEqual([
			'primitive.dimension.border-width.sm',
		]);
		expect(latestBorderControlProps.widthTokens[0].alias).toBe('{primitive.dimension.border-width.sm}');
	});

	it('threads breakpoints only when the field is responsive', () => {
		act(() => {
			root.render(
				createElement(BorderField, {
					field: { label: 'Border', responsive: true },
					value: '',
					onChange: jest.fn(),
				})
			);
		});
		expect(latestBorderControlProps.breakpoints).toEqual(['desktop', 'tablet', 'mobile']);

		act(() => {
			root.render(createElement(BorderField, { field: { label: 'Border' }, value: '', onChange: jest.fn() }));
		});
		expect(latestBorderControlProps.breakpoints).toBeNull();
	});

	it('writes through onChange with the stored (not control) shape', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(createElement(BorderField, { field: { label: 'Border' }, value: '', onChange }));
		});

		act(() => {
			latestBorderControlProps.onChange({ width: 2, style: 'solid', color: '#000' });
		});

		expect(onChange).toHaveBeenCalledWith({ width: '2px', style: 'solid', color: '#000' });
	});

	it('never calls onChange when the field is read-only', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				createElement(BorderField, { field: { label: 'Border', readOnly: true }, value: '', onChange })
			);
		});

		act(() => {
			latestBorderControlProps.onChange({ width: 2, style: 'solid', color: '#000' });
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(latestBorderControlProps.disabled).toBe(true);
	});

	it('renders the color sub-field through the existing TokenColorSelectField, not a new component', () => {
		act(() => {
			root.render(createElement(BorderField, { field: { label: 'Border' }, value: '', onChange: jest.fn() }));
		});

		const element = latestBorderControlProps.renderColor({ value: '', onChange: jest.fn() });

		expect(element.type.name).toBe('TokenColorSelectField');
	});

	it('clicking unlink switches to per-side editing, survives a same-side edit, and leaves the other sides untouched', () => {
		// A real, stateful host — not a fresh mock per assertion — because the bug this guards against
		// only shows up across a render cycle: the field re-deriving `linked` from the just-written
		// value, not from what `onToggleLink` was told.
		function Harness({ field }) {
			const [value, setValue] = useState('');

			return createElement(BorderField, { field, value, onChange: setValue });
		}

		act(() => {
			root.render(createElement(Harness, { field: { label: 'Border' } }));
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

		// The stored value reflects only the edited side; the other three are untouched.
		const controlValue = latestBorderControlProps.value;

		expect(controlValue.width).toEqual(['{primitive.dimension.border-width.sm}', '', '', '']);
		expect(controlValue.style).toEqual(['none', 'none', 'none', 'none']);
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

		window[PICKABLE_TOKENS_GLOBAL] = {
			tokens: [{ id: 'semantic.shadow.card', label: 'Card', type: 'shadow' }],
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

	it("sources tokens via pickableTokensForType('shadow') with an alias attached", () => {
		act(() => {
			root.render(createElement(BoxShadowField, { field: { label: 'Shadow' }, value: '', onChange: jest.fn() }));
		});

		expect(latestBoxShadowControlProps.tokens).toEqual([
			{ id: 'semantic.shadow.card', label: 'Card', value: '', role: null, alias: '{semantic.shadow.card}' },
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
