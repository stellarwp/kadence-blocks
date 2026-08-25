/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SlotGrid } from '../templates/SlotGrid';

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
 * Render a `SlotGrid` with a bare-bones `renderSlot` that just tags its output with the index it
 * received, and return the container to assert against.
 *
 * @param {Object} props Props to merge over the defaults.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container `SlotGrid` rendered into.
 */
function renderSlotGrid(props = {}) {
	act(() => {
		root.render(
			createElement(SlotGrid, {
				value: '4px',
				onChange: () => {},
				isLinked: false,
				role: 'sides',
				renderSlot: ({ index }) =>
					createElement('div', { className: 'stub-slot', 'data-index': index ?? 'linked' }),
				...props,
			})
		);
	});

	return container;
}

describe('SlotGrid glyph', () => {
	it('renders a row per slot, each holding a glyph before the field', () => {
		renderSlotGrid();

		const rows = container.querySelectorAll('.kb-token-control__row');

		expect(rows).toHaveLength(4);
		rows.forEach((row) => {
			const glyph = row.querySelector('.kb-token-control__glyph');

			expect(glyph).not.toBeNull();
			expect(row.querySelector('.stub-slot')).not.toBeNull();
			// The glyph precedes the field within the row.
			expect(row.firstElementChild).toBe(glyph);
		});
	});

	it('highlights the single matching edge for a sides slot', () => {
		renderSlotGrid({ role: 'sides' });

		const glyphs = [...container.querySelectorAll('.kb-token-control__glyph')];
		const positions = glyphs.map((glyph) => glyph.className);

		expect(positions[0]).toContain('kb-token-control__glyph--top');
		expect(positions[1]).toContain('kb-token-control__glyph--right');
		expect(positions[2]).toContain('kb-token-control__glyph--bottom');
		expect(positions[3]).toContain('kb-token-control__glyph--left');
	});

	it('highlights the corner-named position for a corners slot, walking clockwise', () => {
		renderSlotGrid({ role: 'corners' });

		const glyphs = [...container.querySelectorAll('.kb-token-control__glyph')];
		const positions = glyphs.map((glyph) => glyph.className);

		// SLOT_LABELS.corners is already clockwise, and the stacked-row grid renders that order
		// directly: top-left, top-right, bottom-right, bottom-left.
		expect(positions[0]).toContain('kb-token-control__glyph--top-left');
		expect(positions[1]).toContain('kb-token-control__glyph--top-right');
		expect(positions[2]).toContain('kb-token-control__glyph--bottom-right');
		expect(positions[3]).toContain('kb-token-control__glyph--bottom-left');
	});

	it('tags every glyph with its role', () => {
		renderSlotGrid({ role: 'corners' });

		container.querySelectorAll('.kb-token-control__glyph').forEach((glyph) => {
			expect(glyph.className).toContain('kb-token-control__glyph--corners');
		});
	});

	it('renders one row with the "all" glyph variant while linked, for the sides role', () => {
		renderSlotGrid({ isLinked: true, role: 'sides' });

		const rows = container.querySelectorAll('.kb-token-control__row');

		expect(rows).toHaveLength(1);

		const glyph = rows[0].querySelector('.kb-token-control__glyph');

		expect(glyph.className).toContain('kb-token-control__glyph--sides');
		expect(glyph.className).toContain('kb-token-control__glyph--all');
		expect(rows[0].querySelector('.stub-slot').dataset.index).toBe('linked');
	});

	it('renders one row with the "all" glyph variant while linked, for the corners role', () => {
		renderSlotGrid({ isLinked: true, role: 'corners' });

		const glyph = container.querySelector('.kb-token-control__glyph');

		expect(glyph.className).toContain('kb-token-control__glyph--corners');
		expect(glyph.className).toContain('kb-token-control__glyph--all');
	});

	it('wraps unlinked rows in the flex-column grid container', () => {
		renderSlotGrid({ isLinked: false });

		expect(container.querySelector('.kb-token-control__grid')).not.toBeNull();
	});

	it('does not wrap the single linked row in the grid container', () => {
		renderSlotGrid({ isLinked: true });

		expect(container.querySelector('.kb-token-control__grid')).toBeNull();
	});
});
