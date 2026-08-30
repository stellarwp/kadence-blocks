/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SwatchGrid } from '../components/organisms/SwatchGrid';
import { SwatchCard } from '../components/molecules/SwatchCard';

const HEADING_PENDING_DELETE_CLASS = 'kadence-blocks-style-library__swatch-group-heading--pending-delete';

function makeGroup(overrides = {}) {
	return {
		id: 'accent',
		label: 'Accent',
		pendingDelete: false,
		items: [
			{ id: 'primitive.color.brand.primary', name: 'Main 1', subLine: '#111111' },
			{ id: 'primitive.color.brand.secondary', name: 'Main 2', subLine: '#222222' },
		],
		...overrides,
	};
}

describe('SwatchGrid group pendingDelete', () => {
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
	 * Render `SwatchGrid` with one group and a `groupActions` spy that renders a marker node so its
	 * presence (or absence) can be asserted.
	 *
	 * @param {Object} group The group to render.
	 *
	 * @since TBD
	 *
	 * @return {Function} `groupActions` invocation spy.
	 */
	function renderGrid(group) {
		const groupActions = jest.fn(() => <button type="button" data-testid="group-menu-trigger" />);

		act(() => {
			root.render(
				<SwatchGrid
					groups={[group]}
					selectedId=""
					onSelect={() => {}}
					onAdd={() => {}}
					addLabel="Add color"
					groupActions={groupActions}
				/>
			);
		});

		return groupActions;
	}

	it('dims the heading and disables the Add-color tile while the group is pending delete', () => {
		renderGrid(makeGroup({ pendingDelete: true }));

		const heading = container.querySelector(`.${HEADING_PENDING_DELETE_CLASS}`);
		expect(heading).not.toBeNull();

		const addTile = container.querySelector('.kadence-blocks-style-library__add-tile');
		expect(addTile.disabled).toBe(true);
	});

	it('hides the Rename/Delete actions while the group is pending delete', () => {
		const groupActions = renderGrid(makeGroup({ pendingDelete: true }));

		expect(groupActions).not.toHaveBeenCalled();
		expect(container.querySelector('[data-testid="group-menu-trigger"]')).toBeNull();
	});

	it('re-enables the heading, actions, and Add-color tile once the group is no longer pending delete', () => {
		const groupActions = renderGrid(makeGroup({ pendingDelete: false }));

		expect(container.querySelector(`.${HEADING_PENDING_DELETE_CLASS}`)).toBeNull();
		expect(groupActions).toHaveBeenCalled();
		expect(container.querySelector('[data-testid="group-menu-trigger"]')).not.toBeNull();

		const addTile = container.querySelector('.kadence-blocks-style-library__add-tile');
		expect(addTile.disabled).toBe(false);
	});
});

describe('SwatchCard pill slot', () => {
	let cardContainer;
	let cardRoot;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		cardContainer = document.createElement('div');
		document.body.appendChild(cardContainer);
		cardRoot = createRoot(cardContainer);
	});

	afterEach(() => {
		act(() => cardRoot.unmount());
		cardContainer.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
	});

	/**
	 * Render a card with the given extra props.
	 *
	 * @param {Object} props Props merged over the card's required ones.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderCard(props = {}) {
		act(() =>
			cardRoot.render(
				<SwatchCard
					id="primitive.color.brand.primary"
					preview={null}
					name="Main 1"
					subLine="#111111"
					onSelect={() => {}}
					{...props}
				/>
			)
		);
	}

	/**
	 * The pill renders inside the card's bordered box, beside the selecting button rather than
	 * inside it — a button inside a button is invalid and would swallow the pill's own clicks.
	 *
	 * @return void
	 */
	it('renders the pill inside the bordered box but outside the selecting button', () => {
		renderCard({ pill: <button type="button" data-testid="pill" /> });

		const main = cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-main');
		const select = cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-select');
		const pill = cardContainer.querySelector('[data-testid="pill"]');

		expect(main.tagName).toBe('DIV');
		expect(main.contains(pill)).toBe(true);
		expect(select.contains(pill)).toBe(false);
	});

	/**
	 * The slot is present with no pill in it, so a card with nothing to say keeps the same height
	 * as its neighbors.
	 *
	 * @return void
	 */
	it('reserves the pill slot even when no pill is supplied', () => {
		renderCard();

		expect(cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-pill-slot')).not.toBeNull();
	});

	/**
	 * Selecting the card still works through the inner button, which carries the pending-delete
	 * disabled state the whole card used to carry.
	 *
	 * @return void
	 */
	it('selects through the inner button and disables it while pending delete', () => {
		const onSelect = jest.fn();

		renderCard({ onSelect });
		act(() => cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-select').click());

		expect(onSelect).toHaveBeenCalledWith('primitive.color.brand.primary');

		renderCard({ onSelect, isPendingDelete: true });

		expect(cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-select').disabled).toBe(true);
	});
});
