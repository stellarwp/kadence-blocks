/* eslint-env jest */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { SelectDropdown } from '../components/molecules/SelectDropdown';

describe('SelectDropdown loading state', () => {
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

	it('shows skeleton rows in the open menu instead of an empty list while loading', async () => {
		await act(async () =>
			root.render(<SelectDropdown value="" options={[]} onChange={() => {}} isLoading valueLabel="Loading…" />)
		);

		const toggle = container.querySelector('.kadence-blocks-style-library__select-dropdown-toggle');
		await act(async () => toggle.click());

		// The open menu renders through `Popover`'s own portal, appended to `document.body` as a
		// sibling of `container` rather than a descendant of it — the menu content is looked up
		// against `document` for that reason, while the toggle above (rendered in place) stays a
		// `container` lookup.
		const skeletonRows = document.querySelectorAll('.kadence-blocks-style-library__select-dropdown-skeleton-row');
		expect(skeletonRows.length).toBeGreaterThan(0);
		expect(document.querySelectorAll('[role="menuitemradio"]').length).toBe(0);

		// A screen-reader user opening the menu while it loads must be told content is on the
		// way — the skeleton rows sit inside a status region, not silently in place of the
		// options.
		const statusRegion = document.querySelector('.kadence-blocks-style-library__select-dropdown-skeleton-group');
		expect(statusRegion).not.toBeNull();
		expect(statusRegion.getAttribute('role')).toBe('status');
		expect(statusRegion.getAttribute('aria-live')).toBe('polite');
		expect(statusRegion.getAttribute('aria-busy')).toBe('true');
		expect(statusRegion.getAttribute('aria-label')).toBe('Loading options…');
		expect(statusRegion.contains(skeletonRows[0])).toBe(true);
	});

	it('shows real options once loaded, never skeleton rows', async () => {
		await act(async () =>
			root.render(
				<SelectDropdown
					value="a"
					options={[{ value: 'a', label: 'Option A' }]}
					onChange={() => {}}
					isLoading={false}
				/>
			)
		);

		const toggle = container.querySelector('.kadence-blocks-style-library__select-dropdown-toggle');
		await act(async () => toggle.click());

		// See the note in the test above — the open menu is looked up against `document`, not
		// `container`, because `Popover` portals it to `document.body`.
		expect(document.querySelectorAll('.kadence-blocks-style-library__select-dropdown-skeleton-row').length).toBe(0);
		expect(document.querySelectorAll('[role="menuitemradio"]').length).toBe(1);
	});
});

describe('SelectDropdown look', () => {
	let container;
	let root;

	const OPTIONS = [
		{ value: 'a', label: 'Option A', badges: [{ text: 'Active', variant: 'state' }] },
		{ value: 'b', label: 'Option B' },
	];

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
	 * Render the dropdown over two options with "a" current, and open its menu.
	 *
	 * @param {Object} props Extra props for the dropdown.
	 *
	 * @return {Promise<void>} Resolves once the menu is open.
	 */
	async function renderOpen(props = {}) {
		await act(async () =>
			root.render(<SelectDropdown value="a" options={OPTIONS} onChange={() => {}} {...props} />)
		);

		await act(async () => container.querySelector('.kadence-blocks-style-library__select-dropdown-toggle').click());
	}

	/**
	 * The large size is opt-in: only a dropdown asked to be large carries the modifier class its
	 * bigger label hangs on.
	 *
	 * @return {Promise<void>}
	 */
	it('adds the large modifier only when size is large', async () => {
		await act(async () => root.render(<SelectDropdown value="a" options={OPTIONS} onChange={() => {}} />));

		const wrapper = container.querySelector('.kadence-blocks-style-library__select-dropdown');

		expect(wrapper.classList.contains('kadence-blocks-style-library__select-dropdown--large')).toBe(false);

		await act(async () =>
			root.render(<SelectDropdown value="a" options={OPTIONS} onChange={() => {}} size="large" />)
		);

		expect(wrapper.classList.contains('kadence-blocks-style-library__select-dropdown--large')).toBe(true);
	});

	/**
	 * The current row is marked through `aria-checked` alone, which is what the stylesheet fills;
	 * no check icon is drawn on any row.
	 *
	 * @return {Promise<void>}
	 */
	it('marks the current row with aria-checked and draws no check icon', async () => {
		await renderOpen();

		const rows = [...document.querySelectorAll('[role="menuitemradio"]')];

		expect(rows.map((row) => row.getAttribute('aria-checked'))).toEqual(['true', 'false']);
		expect(document.querySelector('[class*="select-dropdown-check"]')).toBeNull();
	});

	/**
	 * An option's badges render on its own row and nowhere else.
	 *
	 * @return {Promise<void>}
	 */
	it('renders badges only on the rows that carry them', async () => {
		await renderOpen();

		const rows = [...document.querySelectorAll('[role="menuitemradio"]')];
		const badgesOf = (row) =>
			[...row.querySelectorAll('.kadence-blocks-style-library__select-dropdown-badge')].map(
				(badge) => badge.textContent
			);

		expect(badgesOf(rows[0])).toEqual(['Active']);
		expect(badgesOf(rows[1])).toEqual([]);
	});

	/**
	 * The trailing action starts with an icon, ahead of its label.
	 *
	 * @return {Promise<void>}
	 */
	it('starts the trailing action with an icon', async () => {
		await renderOpen({ trailingAction: { label: 'New Thing', onClick: () => {} } });

		const action = document.querySelector('.kadence-blocks-style-library__select-dropdown-trailing-action');

		expect(action.textContent).toBe('New Thing');
		expect(action.firstElementChild.tagName.toLowerCase()).toBe('svg');
	});
});
