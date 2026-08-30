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

describe('SwatchGrid pill slot reservation', () => {
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
	 * Render `SwatchGrid` with one group.
	 *
	 * @param {Object} group The group to render.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderGrid(group) {
		act(() => {
			root.render(
				<SwatchGrid groups={[group]} selectedId="" onSelect={() => {}} onAdd={() => {}} addLabel="Add color" />
			);
		});
	}

	/**
	 * When no item in the group carries a pill, the row has nothing to align, so no card renders
	 * the slot at all — this is the dead-space fix.
	 *
	 * @return void
	 */
	it('renders no pill slot when no item in the group has a pill', () => {
		renderGrid(makeGroup());

		expect(container.querySelector('.kadence-blocks-style-library__swatch-card-pill-slot')).toBeNull();
	});

	/**
	 * When at least one item in the group has a pill, every card in that group reserves the slot,
	 * including the ones without a pill of their own — this is the alignment guarantee the
	 * per-row reservation exists for.
	 *
	 * @return void
	 */
	it('reserves the pill slot on every card in the group when at least one item has a pill', () => {
		renderGrid(
			makeGroup({
				items: [
					{
						id: 'primitive.color.brand.primary',
						name: 'Main 1',
						subLine: '#111111',
						pill: <button type="button" data-testid="pill" />,
					},
					{ id: 'primitive.color.brand.secondary', name: 'Main 2', subLine: '#222222' },
				],
			})
		);

		const cards = container.querySelectorAll('.kadence-blocks-style-library__swatch-card');
		expect(cards).toHaveLength(2);

		cards.forEach((card) => {
			expect(card.querySelector('.kadence-blocks-style-library__swatch-card-pill-slot')).not.toBeNull();
		});
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
	 * With no pill and no reservation, the card has nothing under its sub-line to say, so the
	 * slot is skipped rather than leaving an empty strip.
	 *
	 * @return void
	 */
	it('does not render the pill slot when there is no pill and the slot is not reserved', () => {
		renderCard();

		expect(cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-pill-slot')).toBeNull();
	});

	/**
	 * A card with a pill always renders the slot, regardless of `reservePillSlot`.
	 *
	 * @return void
	 */
	it('renders the pill slot when a pill is supplied', () => {
		renderCard({ pill: <button type="button" data-testid="pill" /> });

		expect(cardContainer.querySelector('.kadence-blocks-style-library__swatch-card-pill-slot')).not.toBeNull();
	});

	/**
	 * `reservePillSlot` keeps the slot present even without a pill of its own — this is how the
	 * grid keeps a mixed row on one baseline.
	 *
	 * @return void
	 */
	it('renders the pill slot when reservePillSlot is set even without a pill', () => {
		renderCard({ reservePillSlot: true });

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
