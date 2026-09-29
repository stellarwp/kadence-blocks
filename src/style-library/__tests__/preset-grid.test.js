/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PresetGrid } from '../components/templates/PresetGrid';
import { pinDefaultFirst, splitDefaultItem } from '../helpers/preset-grid';

jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	dragHandle: 'dragHandle',
}));

describe('splitDefaultItem', () => {
	const items = [{ id: 'outline' }, { id: 'default' }, { id: 'ghost' }];

	it('pulls the default item out and keeps the others in order', () => {
		expect(splitDefaultItem(items, 'default')).toEqual({
			pinned: { id: 'default' },
			sortable: [{ id: 'outline' }, { id: 'ghost' }],
		});
	});

	it('pins nothing when the default id matches no item', () => {
		expect(splitDefaultItem(items, 'missing')).toEqual({ pinned: null, sortable: items });
	});

	it('pins nothing when there is no default id', () => {
		expect(splitDefaultItem(items, '')).toEqual({ pinned: null, sortable: items });
	});
});

describe('pinDefaultFirst', () => {
	it('puts the default slug back at the front of a reordered list', () => {
		expect(pinDefaultFirst(['ghost', 'outline'], 'default', true)).toEqual(['default', 'ghost', 'outline']);
	});

	it('returns the order unchanged when no default card is pinned', () => {
		expect(pinDefaultFirst(['ghost', 'outline'], 'default', false)).toEqual(['ghost', 'outline']);
	});
});

describe('PresetGrid', () => {
	const CARD = '.kadence-blocks-style-library__preset-card';
	const HANDLE = '.kadence-blocks-style-library__drag-handle';
	const ITEMS = [
		{ id: 'outline', label: 'Outline' },
		{ id: 'default', label: 'Default' },
		{ id: 'ghost', label: 'Ghost' },
	];

	let container;
	let root;

	/**
	 * Render a `PresetGrid` with the given props over sensible defaults.
	 *
	 * @param {Object} props The props to override.
	 *
	 * @since TBD
	 *
	 * @return {HTMLElement} The container the grid was rendered into.
	 */
	function renderGrid(props = {}) {
		act(() => {
			root.render(
				createElement(PresetGrid, { items: ITEMS, defaultId: 'default', onSelect: () => {}, ...props })
			);
		});

		return container;
	}

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
	});

	it('renders the default card first, with the badge and without a drag handle', () => {
		renderGrid();
		const cards = container.querySelectorAll(CARD);

		expect(cards).toHaveLength(3);
		expect(cards[0].querySelector(`${CARD}-title`).textContent).toBe('Default');
		expect(cards[0].querySelector(`${CARD}-badge`)).not.toBeNull();
		expect(cards[0].querySelector(HANDLE)).toBeNull();
	});

	it('gives every other card a drag handle and keeps their order', () => {
		renderGrid();
		const cards = container.querySelectorAll(CARD);

		expect(cards[1].querySelector(`${CARD}-title`).textContent).toBe('Outline');
		expect(cards[2].querySelector(`${CARD}-title`).textContent).toBe('Ghost');
		expect(cards[1].querySelector(HANDLE)).not.toBeNull();
		expect(cards[2].querySelector(HANDLE)).not.toBeNull();
	});

	it('pins no card when the block has no default preset', () => {
		renderGrid({ defaultId: '' });

		expect(container.querySelector(`${CARD}-badge`)).toBeNull();
		expect(container.querySelectorAll(HANDLE)).toHaveLength(3);
	});

	it('marks the selected card', () => {
		renderGrid({ selectedId: 'ghost' });

		expect(container.querySelectorAll(`${CARD}--selected`)).toHaveLength(1);
	});

	it('renders the empty slot inside the bordered box when there are no items', () => {
		renderGrid({ items: [], empty: createElement('p', { className: 'nothing' }, 'None') });

		expect(container.querySelector('.kadence-blocks-style-library__preset-grid')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__preset-grid-empty .nothing')).not.toBeNull();
	});
});
