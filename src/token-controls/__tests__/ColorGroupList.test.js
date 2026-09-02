/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorGroupList } from '../molecules/ColorGroupList';

// Matches `token-popover.test.js`'s stand-in: `@wordpress/components` resolves its own nested
// `react` copy, a different module instance than the top-level `react-dom/client` this test renders
// with, which trips React's "Invalid hook call" guard.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isPressed, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock('@wordpress/icons', () => ({ check: 'check', Icon: ({ icon, ...props }) => <span {...props}>{icon}</span> }));

const GROUPS = [
	{
		id: 'accent',
		label: 'Accent',
		swatches: [
			{
				id: 'primitive.color.brand.primary',
				label: 'Main 1',
				value: '#112233',
				alias: '{primitive.color.brand.primary}',
			},
			{
				id: 'primitive.color.brand.secondary',
				label: 'Main 2',
				value: '#445566',
				alias: '{primitive.color.brand.secondary}',
			},
		],
	},
	{
		id: 'contrast',
		label: 'Contrast',
		swatches: [
			{
				id: 'primitive.color.neutral.100',
				label: 'Neutral 100',
				value: '#ffffff',
				alias: '{primitive.color.neutral.100}',
			},
		],
	},
];

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
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render `ColorGroupList` with the given props.
 *
 * @param {Object} props The component props.
 *
 * @since TBD
 *
 * @return {void}
 */
function render(props = {}) {
	act(() =>
		root.render(
			createElement(ColorGroupList, {
				groups: GROUPS,
				value: '',
				onPick: jest.fn(),
				onClose: jest.fn(),
				...props,
			})
		)
	);
}

describe('ColorGroupList', () => {
	/**
	 * Every group renders its label followed by each of its swatches' labels, in group order.
	 *
	 * @return {void}
	 */
	it('renders every group with its label and swatch labels', () => {
		render();

		const groupLabels = Array.from(container.querySelectorAll('.kb-color-control__group-label')).map(
			(el) => el.textContent
		);
		expect(groupLabels).toEqual(['Accent', 'Contrast']);

		const itemLabels = Array.from(container.querySelectorAll('.kb-color-control__item-label')).map(
			(el) => el.textContent
		);
		expect(itemLabels).toEqual(['Main 1', 'Main 2', 'Neutral 100']);
	});

	/**
	 * Only the swatch whose alias matches the bound value shows a check mark.
	 *
	 * @return {void}
	 */
	it('shows a check mark only on the swatch matching the current value', () => {
		render({ value: '{primitive.color.brand.secondary}' });

		const items = container.querySelectorAll('.kb-color-control__item');
		expect(within(items[0]).hasCheck()).toBe(false);
		expect(within(items[1]).hasCheck()).toBe(true);
		expect(within(items[2]).hasCheck()).toBe(false);
	});

	/**
	 * The check mark's color adapts to the swatch it sits on, so it stays legible against dark and
	 * light colors alike — a fixed mark color would vanish against roughly half of any palette.
	 *
	 * @return {void}
	 */
	it("colors the check mark for legibility against its own swatch's color", () => {
		render({ value: '{primitive.color.brand.primary}' });

		const check = container.querySelector('.kb-color-control__item-check');
		// #112233 is a dark swatch (Main 1's `value` above); the mark should read light against it.
		expect(check.style.color).toBe('rgb(255, 255, 255)');
	});

	/**
	 * Clicking a swatch calls `onPick` with its alias, then `onClose` — applying immediately and
	 * closing the popover, matching `StyleLibraryTab`'s existing token rows.
	 *
	 * @return {void}
	 */
	it('calls onPick with the alias then onClose when a swatch is clicked', () => {
		const onPick = jest.fn();
		const onClose = jest.fn();

		render({ onPick, onClose });

		const items = container.querySelectorAll('.kb-color-control__item');
		act(() => items[1].dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onPick).toHaveBeenCalledWith('{primitive.color.brand.secondary}');
		expect(onClose).toHaveBeenCalled();
		expect(onPick.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0]);
	});
});

/**
 * A small assertion helper scoped to one rendered swatch button, so the check-mark test above reads
 * as "does this item show the check icon" rather than groping through raw DOM queries.
 *
 * @param {Element} el The rendered `.kb-color-control__item` button.
 *
 * @since TBD
 *
 * @return {{hasCheck: () => boolean}} The scoped helper.
 */
function within(el) {
	return {
		hasCheck: () => Array.from(el.querySelectorAll('span')).some((span) => span.textContent === 'check'),
	};
}
