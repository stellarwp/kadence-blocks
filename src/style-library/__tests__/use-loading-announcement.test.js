/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { useLoadingAnnouncement } from '../hooks/use-loading-announcement';

describe('useLoadingAnnouncement', () => {
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
	 * Mount `useLoadingAnnouncement` behind a single probe component type, so a re-render updates
	 * the mounted hook (and its `isLoading` transition) rather than remounting it.
	 *
	 * @since TBD
	 *
	 * @return {{rerender: Function}} Re-renders the mounted probe with new props.
	 */
	function mountProbe() {
		function Probe({ isLoading, message }) {
			useLoadingAnnouncement(isLoading, message);
			return null;
		}

		const rerender = (props) => act(() => root.render(<Probe {...props} />));

		return { rerender };
	}

	/**
	 * Find the live-region node this hook appends directly to `document.body`.
	 *
	 * @since TBD
	 *
	 * @return {?Element} The node, or null if none is mounted.
	 */
	function announcerNode() {
		return document.body.querySelector('.screen-reader-text[aria-live="polite"]');
	}

	it('appends a visually-hidden, polite live region on mount, empty until a load completes', () => {
		const { rerender } = mountProbe();

		rerender({ isLoading: true, message: 'Color Palette loaded.' });

		const node = announcerNode();
		expect(node).not.toBeNull();
		expect(node.getAttribute('role')).toBe('status');
		expect(node.textContent).toBe('');
	});

	it('writes the message once isLoading flips from true to false', () => {
		const { rerender } = mountProbe();

		rerender({ isLoading: true, message: 'Color Palette loaded.' });
		expect(announcerNode().textContent).toBe('');

		rerender({ isLoading: false, message: 'Color Palette loaded.' });
		expect(announcerNode().textContent).toBe('Color Palette loaded.');
	});

	it('does not write anything on mount already idle — only a true→false transition announces', () => {
		const { rerender } = mountProbe();

		rerender({ isLoading: false, message: 'Color Palette loaded.' });

		expect(announcerNode().textContent).toBe('');
	});

	it('removes its live-region node on unmount', () => {
		mountProbe().rerender({ isLoading: true, message: 'Color Palette loaded.' });

		expect(announcerNode()).not.toBeNull();

		act(() => root.unmount());

		expect(announcerNode()).toBeNull();
	});
});
