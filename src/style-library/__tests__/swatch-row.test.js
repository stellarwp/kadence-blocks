/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SwatchRow } from '../components/molecules/SwatchRow';

// `@wordpress/icons` nests its own `react` copy; the glyph is only passed through as a prop here.
jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	dragHandle: 'dragHandle',
}));

const ROW = 'kadence-blocks-style-library__swatch-row';

describe('SwatchRow', () => {
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
	 * Render a row with sensible defaults.
	 *
	 * @param {Object} [props] Props merged over the defaults.
	 *
	 * @since TBD
	 *
	 * @return {Object} The `onSelect` spy.
	 */
	function renderRow(props = {}) {
		const onSelect = jest.fn();

		act(() =>
			root.render(
				<SwatchRow
					id="accent.one"
					name="Main 1"
					subLine="#111111"
					preview={<i />}
					isDraggable
					onSelect={onSelect}
					{...props}
				/>
			)
		);

		return onSelect;
	}

	const q = (selector) => container.querySelector(selector);

	/**
	 * The parts sit in reading order: handle, select button, then the value.
	 *
	 * @return {void}
	 */
	it('orders handle, select button, and sub-line', () => {
		renderRow();

		const children = [...q(`.${ROW}`).children];

		expect(children[0].className).toBe(`${ROW}-handle-slot`);
		expect(children[1].className).toBe(`${ROW}-select`);
		expect(children[children.length - 1].className).toBe(`${ROW}-sub-line`);
		expect(q(`.${ROW}-select .${ROW}-preview`)).not.toBeNull();
		expect(q(`.${ROW}-select .${ROW}-name`).textContent).toBe('Main 1');
	});

	/**
	 * A pill is a sibling of the select button, never inside it, and comes before the value.
	 *
	 * @return {void}
	 */
	it('renders the pill outside the select button and before the sub-line', () => {
		renderRow({ pill: <span className="pill">From Base</span> });

		expect(q(`.${ROW}-select .pill`)).toBeNull();

		const children = [...q(`.${ROW}`).children];

		expect(children[2].className).toBe(`${ROW}-pill-slot`);
		expect(children[3].className).toBe(`${ROW}-sub-line`);
	});

	/**
	 * A static pill selects the row; a button pill keeps its own click.
	 *
	 * @return {void}
	 */
	it('selects on a static pill click but not on a button pill click', () => {
		const onSelect = renderRow({ pill: <span className="pill">From Base</span> });

		act(() => q('.pill').click());
		expect(onSelect).toHaveBeenCalledWith('accent.one');

		const buttonSelect = renderRow({
			pill: (
				<button type="button" className="pill-button">
					Reset
				</button>
			),
		});

		act(() => q('.pill-button').click());
		expect(buttonSelect).not.toHaveBeenCalled();
	});

	/**
	 * The select button selects, and is disabled while the swatch is pending delete.
	 *
	 * @return {void}
	 */
	it('selects from the select button and disables it while pending delete', () => {
		const onSelect = renderRow();

		act(() => q(`.${ROW}-select`).click());
		expect(onSelect).toHaveBeenCalledWith('accent.one');

		renderRow({ isPendingDelete: true, pill: <span className="pill">From Base</span> });

		expect(q(`.${ROW}-select`).disabled).toBe(true);
		expect(q(`.${ROW}-select`).getAttribute('aria-disabled')).toBe('true');
	});

	/**
	 * A pending-delete row ignores a pill click too.
	 *
	 * @return {void}
	 */
	it('does not select from a pill click while pending delete', () => {
		const onSelect = renderRow({ isPendingDelete: true, pill: <span className="pill">From Base</span> });

		act(() => q('.pill').click());

		expect(onSelect).not.toHaveBeenCalled();
	});

	/**
	 * The drag handle shows only for a draggable row that is not pending delete.
	 *
	 * @return {void}
	 */
	it('renders the handle only when draggable and not pending delete', () => {
		renderRow();
		expect(q('.kadence-blocks-style-library__drag-handle')).not.toBeNull();

		renderRow({ isDraggable: false });
		expect(q('.kadence-blocks-style-library__drag-handle')).toBeNull();

		renderRow({ isPendingDelete: true });
		expect(q('.kadence-blocks-style-library__drag-handle')).toBeNull();
	});

	/**
	 * State flags map to modifier classes.
	 *
	 * @return {void}
	 */
	it('applies the selected, placeholder, and pending-delete modifiers', () => {
		renderRow({ isSelected: true, isDragging: true, isPendingDelete: true });

		const row = q(`.${ROW}`);

		expect(row.classList.contains(`${ROW}--selected`)).toBe(true);
		expect(row.classList.contains(`${ROW}--placeholder`)).toBe(true);
		expect(row.classList.contains(`${ROW}--pending-delete`)).toBe(true);
	});

	/**
	 * No pill means no pill slot at all.
	 *
	 * @return {void}
	 */
	it('renders no pill slot without a pill', () => {
		renderRow();

		expect(q(`.${ROW}-pill-slot`)).toBeNull();
	});
});
