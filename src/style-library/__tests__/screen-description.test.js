/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * WordPress dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { ScreenDescription } from '../components/molecules/ScreenDescription';
import { SCREEN_DOCS, SCREEN_DOCS_FILTER } from '../constants/screen-docs';

// `jest.config.js` maps `@wordpress/components` to a copy that resolves its own react/react-dom,
// a different module instance than the top-level `react-dom/client` this test renders with —
// mounting the real `ExternalLink` under the top-level renderer trips React's "Invalid hook call"
// guard. The stand-in keeps the anchor and the href, which is all this test asserts on.
jest.mock('@wordpress/components', () => ({
	ExternalLink: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

describe('ScreenDescription', () => {
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
		removeFilter(SCREEN_DOCS_FILTER, 'test/screen-description');
	});

	/**
	 * Render the molecule for one screen id.
	 *
	 * @param {string} screenId The screen id to render for.
	 *
	 * @return {void}
	 */
	const render = (screenId) => {
		act(() => root.render(<ScreenDescription screenId={screenId} />));
	};

	/**
	 * A screen with copy shows its sentence and, at the end of it, the documentation link.
	 *
	 * @return {void}
	 */
	it('renders the screen sentence followed by a documentation link', () => {
		render('border-radius');

		const paragraph = container.querySelector('.kadence-blocks-style-library__screen-description');

		expect(paragraph).not.toBeNull();
		expect(paragraph.textContent).toContain(SCREEN_DOCS['border-radius'].description);

		const link = paragraph.querySelector('a');

		expect(link.getAttribute('href')).toBe('https://evnt.is/kadence-border-radius');
		expect(link.textContent).toBe('Learn more');
	});

	/**
	 * A screen with no catalog entry renders nothing at all — not an empty paragraph — so its
	 * spacing is unchanged from before helper copy existed.
	 *
	 * @return {void}
	 */
	it('renders nothing for a screen with no helper copy', () => {
		render('blocks/acme/widget');

		expect(container.innerHTML).toBe('');
	});

	/**
	 * An entry whose link was dropped still shows its sentence, with no dangling link markup.
	 *
	 * @return {void}
	 */
	it('renders the sentence with no link when the entry has no usable URL', () => {
		addFilter(SCREEN_DOCS_FILTER, 'test/screen-description', (docs) => ({
			...docs,
			'blocks/acme/widget': { description: 'Style the widget.', docUrl: '' },
		}));

		render('blocks/acme/widget');

		const paragraph = container.querySelector('.kadence-blocks-style-library__screen-description');

		expect(paragraph.textContent.trim()).toBe('Style the widget.');
		expect(paragraph.querySelector('a')).toBeNull();
	});
});
