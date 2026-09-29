/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { AppShell } from '../components/templates/AppShell';

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

describe('AppShell', () => {
	/**
	 * While blocked, the busy overlay sits inside the body region and draws no header of its own,
	 * so the real header stays on screen and is the only header in the frame.
	 *
	 * @return {void}
	 */
	it('keeps the real header uncovered while blocked', () => {
		act(() => {
			root.render(
				createElement(AppShell, {
					header: createElement('span', { id: 'real-header' }),
					sidebar: null,
					content: null,
					isBlocked: true,
				})
			);
		});

		const blocker = container.querySelector('.kadence-blocks-style-library__blocker');

		expect(blocker).not.toBeNull();
		expect(blocker.parentElement.classList.contains('kadence-blocks-style-library__body')).toBe(true);
		expect(container.querySelectorAll('.kadence-blocks-style-library__header')).toHaveLength(1);
		expect(container.querySelector('.kadence-blocks-style-library__header #real-header')).not.toBeNull();
	});

	/**
	 * Without `isBlocked` no overlay is rendered at all.
	 *
	 * @return {void}
	 */
	it('renders no overlay when not blocked', () => {
		act(() => {
			root.render(
				createElement(AppShell, {
					header: null,
					sidebar: null,
					content: null,
					isBlocked: false,
				})
			);
		});

		expect(container.querySelector('.kadence-blocks-style-library__blocker')).toBeNull();
	});

	/**
	 * The shell has no settings column: the editor is a popover mounted outside it.
	 *
	 * @return {void}
	 */
	it('renders no settings aside', () => {
		act(() => {
			root.render(createElement(AppShell, { header: null, sidebar: null, content: null }));
		});

		expect(container.querySelector('aside')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__content--has-settings')).toBeNull();
	});
});
