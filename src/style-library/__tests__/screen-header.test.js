/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../components/organisms/ScreenHeader';

describe('ScreenHeader', () => {
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
	});

	/**
	 * The title and the action slots share one flex row inside the header block.
	 *
	 * @return {void}
	 */
	it('wraps the title and the action slots in a row inside the header block', () => {
		act(() => root.render(<ScreenHeader title="Corner Radius" primaryAction={<button>Add</button>} />));

		const header = container.querySelector('.kadence-blocks-style-library__screen-header');
		const row = header.querySelector(':scope > .kadence-blocks-style-library__screen-header-row');

		expect(row).not.toBeNull();
		expect(row.querySelector('.kadence-blocks-style-library__screen-header-title').textContent).toBe(
			'Corner Radius'
		);
		expect(row.querySelector('.kadence-blocks-style-library__screen-header-trail button')).not.toBeNull();
	});

	/**
	 * A header with no description renders exactly the row, so a screen without helper copy keeps
	 * the spacing it had before the slot existed.
	 *
	 * @return {void}
	 */
	it('renders no extra node when no description is passed', () => {
		act(() => root.render(<ScreenHeader title="Corner Radius" />));

		const header = container.querySelector('.kadence-blocks-style-library__screen-header');

		expect(header.children).toHaveLength(1);
	});

	/**
	 * The description sits after the header block, not inside it, so inside the app shell it stays
	 * in the scrolling body while the block moves to the fixed slot.
	 *
	 * @return {void}
	 */
	it('renders the description after the header block, outside it', () => {
		act(() => root.render(<ScreenHeader title="Corner Radius" description={<p>What this screen does.</p>} />));

		const header = container.querySelector('.kadence-blocks-style-library__screen-header');

		expect(header.children).toHaveLength(1);
		expect(header.nextElementSibling.textContent).toBe('What this screen does.');
	});

	/**
	 * `ScreenDescription` returns null for a screen with no copy, so the header must not draw a
	 * wrapper around nothing.
	 *
	 * @return {void}
	 */
	it('renders nothing extra when the description slot renders null', () => {
		const EmptyDescription = () => null;

		act(() => root.render(<ScreenHeader title="Corner Radius" description={<EmptyDescription />} />));

		const header = container.querySelector('.kadence-blocks-style-library__screen-header');

		expect(header.children).toHaveLength(1);
		expect(header.nextElementSibling).toBeNull();
	});
});
