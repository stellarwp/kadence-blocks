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
