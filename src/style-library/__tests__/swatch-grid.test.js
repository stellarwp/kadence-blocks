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
