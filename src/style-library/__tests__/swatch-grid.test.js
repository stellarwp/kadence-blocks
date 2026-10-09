/* eslint-env jest */
/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SwatchGrid, SwatchGroupGhost } from '../components/organisms/SwatchGrid';
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
	 * The card is marked with the pill-slot modifier only when the slot actually renders, because
	 * the card's lower inset moves onto the slot when it is there and has to stay on the button
	 * when it is not.
	 *
	 * @return void
	 */
	it('flags only the cards whose pill slot renders', () => {
		renderGrid(makeGroup());

		expect(container.querySelector('.kadence-blocks-style-library__swatch-card--with-pill-slot')).toBeNull();

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

		expect(container.querySelectorAll('.kadence-blocks-style-library__swatch-card--with-pill-slot')).toHaveLength(
			2
		);
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
	 * The slot sits above the selecting button's hit area, so a click on a static pill has to be
	 * handed back to the card or that patch of the surface would stop selecting.
	 *
	 * @return void
	 */
	it('selects the card when a static pill is clicked', () => {
		const onSelect = jest.fn();
		renderCard({ onSelect, pill: <span data-testid="pill">From Default</span> });

		act(() => cardContainer.querySelector('[data-testid="pill"]').click());

		expect(onSelect).toHaveBeenCalledWith('primitive.color.brand.primary');
	});

	/**
	 * A control pill owns its click; the card must not also select on it.
	 *
	 * @return void
	 */
	it('does not select the card when a button pill is clicked', () => {
		const onSelect = jest.fn();
		renderCard({ onSelect, pill: <button type="button" data-testid="pill" /> });

		act(() => cardContainer.querySelector('[data-testid="pill"]').click());

		expect(onSelect).not.toHaveBeenCalled();
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

describe('SwatchGrid group drag handle', () => {
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
	 * Render `SwatchGrid` with the given groups and a marker in every heading's actions slot.
	 *
	 * @param {Array<Object>} groups The groups to render.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderGrid(groups) {
		act(() => {
			root.render(
				<SwatchGrid
					groups={groups}
					selectedId=""
					onSelect={() => {}}
					onAdd={() => {}}
					addLabel="Add color"
					groupActions={() => <button type="button" data-testid="group-menu-trigger" />}
				/>
			);
		});
	}

	/**
	 * The group handle buttons currently rendered, in DOM order.
	 *
	 * @since TBD
	 *
	 * @return {Array<HTMLButtonElement>} The handles inside a heading row.
	 */
	function groupHandles() {
		return [
			...container.querySelectorAll(
				'.kadence-blocks-style-library__section-heading-row .kadence-blocks-style-library__drag-handle'
			),
		];
	}

	it('renders one named handle per group, first in the heading row, before the title and the actions', () => {
		renderGrid([makeGroup(), makeGroup({ id: 'contrast', label: 'Contrast' })]);

		const handles = groupHandles();
		expect(handles.map((button) => button.getAttribute('aria-label'))).toEqual([
			'Drag to reorder Accent',
			'Drag to reorder Contrast',
		]);

		handles.forEach((button) => {
			const row = button.closest('.kadence-blocks-style-library__section-heading-row');
			expect(row.firstElementChild).toBe(button);
			expect(row.querySelector('h3')).not.toBeNull();
			expect(row.querySelector('[data-testid="group-menu-trigger"]')).not.toBeNull();
		});
	});

	it('still renders the handle when the grid holds a single group', () => {
		renderGrid([makeGroup()]);

		expect(groupHandles().map((button) => button.getAttribute('aria-label'))).toEqual(['Drag to reorder Accent']);
	});

	it('renders no group handle for a group that is pending delete', () => {
		renderGrid([makeGroup({ pendingDelete: true }), makeGroup({ id: 'contrast', label: 'Contrast' })]);

		expect(groupHandles().map((button) => button.getAttribute('aria-label'))).toEqual(['Drag to reorder Contrast']);
	});

	it('keeps the swatch handles with their own generic name, separate from the group handles', () => {
		renderGrid([
			makeGroup({
				items: [{ id: 'primitive.color.brand.primary', name: 'Main 1', subLine: '#111111', isDraggable: true }],
			}),
			makeGroup({ id: 'contrast', label: 'Contrast' }),
		]);

		const swatchHandles = [
			...container.querySelectorAll(
				'.kadence-blocks-style-library__swatch-card .kadence-blocks-style-library__drag-handle'
			),
		];
		expect(swatchHandles).toHaveLength(1);
		expect(swatchHandles[0].getAttribute('aria-label')).toBe('Drag to reorder');
		expect(groupHandles()).toHaveLength(2);
	});

	it('renders no group ghost while nothing is being dragged', () => {
		renderGrid([makeGroup(), makeGroup({ id: 'contrast', label: 'Contrast' })]);

		expect(document.querySelector('.kadence-blocks-style-library__swatch-group-ghost')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__swatch-group--placeholder')).toBeNull();
	});

	it('renders the whole group in the ghost: handle, title, actions, and every swatch', () => {
		const group = makeGroup({
			items: [
				{ id: 'primitive.color.brand.primary', name: 'Main 1', subLine: '#111111', isDraggable: true },
				{ id: 'primitive.color.brand.secondary', name: 'Main 2', subLine: '#222222' },
			],
		});

		act(() => {
			root.render(
				<SwatchGroupGhost
					group={group}
					selectedId=""
					addLabel="Add color"
					groupActions={() => <button type="button" data-testid="group-menu-trigger" />}
				/>
			);
		});

		const ghost = container.querySelector('.kadence-blocks-style-library__swatch-group-ghost');
		expect(ghost.querySelector('h3').textContent).toBe('Accent');
		expect(ghost.querySelector('[aria-label="Drag to reorder Accent"]')).not.toBeNull();
		expect(ghost.querySelector('[data-testid="group-menu-trigger"]')).not.toBeNull();
		expect(
			[...ghost.querySelectorAll('.kadence-blocks-style-library__swatch-card-name')].map((n) => n.textContent)
		).toEqual(['Main 1', 'Main 2']);
	});

	it('makes the ghost inert and hidden from the accessibility tree', () => {
		const group = makeGroup();

		act(() => {
			root.render(<SwatchGroupGhost group={group} selectedId="" addLabel="Add color" />);
		});

		const ghost = container.querySelector('.kadence-blocks-style-library__swatch-group-ghost');
		expect(ghost.getAttribute('inert')).toBe('');
		expect(ghost.getAttribute('aria-hidden')).toBe('true');
	});

	it('sizes the drag handle icon only inside a group heading row', () => {
		const scss = fs.readFileSync(path.join(__dirname, '../components/organisms/SwatchGrid.scss'), 'utf8');
		const rule = scss.match(/([^{}]*drag-handle-icon)\s*{([^}]*)}/);

		expect(rule[1]).toContain('__section-heading-row');
		expect(rule[2]).toMatch(/width:\s*0\.875rem/);
		expect(rule[2]).toMatch(/height:\s*0\.875rem/);

		renderGrid([makeGroup({ items: [{ id: 'a', name: 'A', subLine: '#111', isDraggable: true }] })]);

		const swatchHandle = container.querySelector(
			'.kadence-blocks-style-library__swatch-card .kadence-blocks-style-library__drag-handle'
		);
		expect(swatchHandle.closest('.kadence-blocks-style-library__section-heading-row')).toBeNull();
		expect(groupHandles()[0].closest('.kadence-blocks-style-library__section-heading-row')).not.toBeNull();
	});
});

describe('SwatchGrid list view', () => {
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
	 * Render `SwatchGrid` with the given groups and extra props.
	 *
	 * @param {Array<Object>} groups The groups to render.
	 * @param {Object}        [props] Props merged over the required ones.
	 *
	 * @since TBD
	 *
	 * @return {Object} The `onAdd` spy.
	 */
	function renderGrid(groups, props = {}) {
		const onAdd = jest.fn();

		act(() => {
			root.render(
				<SwatchGrid
					groups={groups}
					selectedId=""
					onSelect={() => {}}
					onAdd={onAdd}
					addLabel="Add color"
					{...props}
				/>
			);
		});

		return onAdd;
	}

	const q = (selector) => container.querySelector(selector);
	const qa = (selector) => container.querySelectorAll(selector);

	/**
	 * Without a view prop the grid keeps rendering cards.
	 *
	 * @return {void}
	 */
	it('renders cards by default', () => {
		renderGrid([makeGroup()]);

		expect(q('.kadence-blocks-style-library__swatch-grid--list')).toBeNull();
		expect(qa('.kadence-blocks-style-library__swatch-card')).toHaveLength(2);
		expect(q('.kadence-blocks-style-library__swatch-row')).toBeNull();
	});

	/**
	 * List view renders one bordered box per group with one row per item and no cards.
	 *
	 * @return {void}
	 */
	it('renders one list box per group and one row per item in list view', () => {
		renderGrid([makeGroup(), makeGroup({ id: 'base', label: 'Base' })], { view: 'list' });

		expect(q('.kadence-blocks-style-library__swatch-grid--list')).not.toBeNull();
		expect(qa('.kadence-blocks-style-library__swatch-group-list')).toHaveLength(2);
		expect(qa('.kadence-blocks-style-library__swatch-row')).toHaveLength(4);
		expect(q('.kadence-blocks-style-library__swatch-card')).toBeNull();
		expect(q('.kadence-blocks-style-library__add-tile')).toBeNull();
	});

	/**
	 * Rows without a pill render no pill slot, and there is no reserved slot in list view.
	 *
	 * @return {void}
	 */
	it('renders no pill slot on rows without a pill', () => {
		renderGrid([makeGroup()], { view: 'list' });

		expect(q('.kadence-blocks-style-library__swatch-row-pill-slot')).toBeNull();
	});

	/**
	 * The footer link adds a color to its own group.
	 *
	 * @return {void}
	 */
	it('calls onAdd with the group id from the footer link', () => {
		const onAdd = renderGrid([makeGroup()], { view: 'list' });

		act(() => q('.kadence-blocks-style-library__swatch-group-list-footer button').click());

		expect(onAdd).toHaveBeenCalledWith('accent');
	});

	/**
	 * The footer link is disabled while that group's add is in flight or the group is pending delete.
	 *
	 * @return {void}
	 */
	it('disables the footer link while adding or pending delete', () => {
		renderGrid([makeGroup()], { view: 'list', addingGroupIds: ['accent'] });
		expect(q('.kadence-blocks-style-library__add-link').disabled).toBe(true);

		renderGrid([makeGroup({ pendingDelete: true })], { view: 'list' });
		expect(q('.kadence-blocks-style-library__add-link').disabled).toBe(true);

		renderGrid([makeGroup()], { view: 'list' });
		expect(q('.kadence-blocks-style-library__add-link').disabled).toBe(false);
	});

	/**
	 * A pending-delete group dims its heading and hides its actions, same as the card view.
	 *
	 * @return {void}
	 */
	it('dims the heading and hides the group actions while the group is pending delete', () => {
		const groupActions = jest.fn(() => <button type="button" data-testid="group-menu-trigger" />);

		renderGrid([makeGroup({ pendingDelete: true })], { view: 'list', groupActions });

		expect(q(`.${HEADING_PENDING_DELETE_CLASS}`)).not.toBeNull();
		expect(groupActions).not.toHaveBeenCalled();
		expect(q('[data-testid="group-menu-trigger"]')).toBeNull();
	});

	/**
	 * The row matching `selectedId` carries the selected modifier.
	 *
	 * @return {void}
	 */
	it('marks the selected row', () => {
		renderGrid([makeGroup()], { view: 'list', selectedId: 'primitive.color.brand.secondary' });

		const rows = qa('.kadence-blocks-style-library__swatch-row');

		expect(rows[0].classList.contains('kadence-blocks-style-library__swatch-row--selected')).toBe(false);
		expect(rows[1].classList.contains('kadence-blocks-style-library__swatch-row--selected')).toBe(true);
	});
});
