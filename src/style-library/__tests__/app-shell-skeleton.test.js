/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { AppShellSkeleton } from '../components/organisms/AppShellSkeleton';

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('AppShellSkeleton', () => {
	/**
	 * The whole placeholder is a single `role="status"`/`aria-busy` region, so a screen reader
	 * announces one busy region instead of the header-bar and sidebar skeletons separately.
	 *
	 * @return {void}
	 */
	it('renders a single busy status container', () => {
		act(() => {
			root.render(createElement(AppShellSkeleton));
		});

		const status = container.querySelector('[role="status"]');

		expect(status).not.toBeNull();
		expect(status.getAttribute('aria-busy')).toBe('true');
		expect(status.getAttribute('aria-live')).toBe('polite');
	});

	/**
	 * The header-bar-shaped region contains at least one `Skeleton` atom, matching the shape of the
	 * real `AppHeader` markup it is standing in for.
	 *
	 * @return {void}
	 */
	it('fills the header-bar region with skeleton shapes', () => {
		act(() => {
			root.render(createElement(AppShellSkeleton));
		});

		const headerBar = container.querySelector('.kadence-blocks-style-library__header-bar');

		expect(headerBar).not.toBeNull();
		expect(headerBar.querySelectorAll('.kadence-blocks-style-library__skeleton').length).toBeGreaterThan(0);
	});

	/**
	 * The sidebar-nav-shaped region contains multiple `Skeleton` atoms, matching the shape of the
	 * real `AppSidebar` nav list it is standing in for.
	 *
	 * @return {void}
	 */
	it('fills the nav region with skeleton shapes', () => {
		act(() => {
			root.render(createElement(AppShellSkeleton));
		});

		const nav = container.querySelector('.kadence-blocks-style-library__nav');

		expect(nav).not.toBeNull();
		expect(nav.querySelectorAll('.kadence-blocks-style-library__skeleton').length).toBeGreaterThan(0);
	});

	/**
	 * The nav and header shapes sit inside the real `AppShell` wrappers, which are what carry the
	 * frame's opaque surface and column widths — without them the library-switch overlay's
	 * translucent scrim would leave the outgoing library's own header and nav showing through.
	 *
	 * @return {void}
	 */
	it('wraps its regions in the real shell frame elements', () => {
		act(() => {
			root.render(createElement(AppShellSkeleton));
		});

		const header = container.querySelector('.kadence-blocks-style-library__header');
		const sidebar = container.querySelector('.kadence-blocks-style-library__sidebar');

		expect(header).not.toBeNull();
		expect(header.querySelector('.kadence-blocks-style-library__header-bar')).not.toBeNull();
		expect(sidebar).not.toBeNull();
		expect(sidebar.querySelector('.kadence-blocks-style-library__nav')).not.toBeNull();
	});
});
