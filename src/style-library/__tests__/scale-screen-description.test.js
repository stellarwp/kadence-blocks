/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ScaleScreen } from '../components/pages/ScaleScreen';
import { useScaleScreen } from '../hooks/use-scale-screen';
import { useDraftChannel } from '../hooks/use-draft-channel';
import { SCREEN_DOCS } from '../constants/screen-docs';

// `use-scale-screen.js` reaches the REST client and the data store; the screen only reads the
// hook's return value, so a stand-in is enough — see `preset-screen.test.js` for the same
// reasoning about `@wordpress/api-fetch` not being an installed dependency.
jest.mock('../hooks/use-scale-screen', () => ({
	useScaleScreen: jest.fn(),
}));

jest.mock('../hooks/use-draft-channel', () => ({
	useDraftChannel: jest.fn(),
}));

// The nested `@wordpress/components` copy resolves its own react/react-dom, a different module
// instance than the top-level renderer this test uses — stand-ins sidestep the cross-copy
// "Invalid hook call" guard.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isBusy, ...props }) => <button {...props}>{children}</button>,
	Notice: ({ children, isDismissible, ...props }) => <div {...props}>{children}</div>,
	ExternalLink: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	plus: 'plus',
	dragHandle: 'drag-handle',
}));

const CONFIG = {
	id: 'border-radius',
	title: 'Corner Radius',
	addLabel: 'Add Border Radius',
	renderPreview: () => <span />,
};

describe('ScaleScreen helper copy', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		useDraftChannel.mockReturnValue(null);
		useScaleScreen.mockReturnValue({
			rows: [],
			selectedId: '',
			selectToken: jest.fn(),
			isBusy: false,
			addError: null,
			orderError: null,
			clearAddError: jest.fn(),
			clearOrderError: jest.fn(),
			addToken: jest.fn(),
			reorderTokens: jest.fn(),
		});
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		jest.clearAllMocks();
	});

	/**
	 * Render `ScaleScreen` on the given route.
	 *
	 * @param {string} screen The route's screen id.
	 *
	 * @return {void}
	 */
	const renderOn = (screen) => {
		act(() =>
			root.render(
				<ScaleScreen
					config={CONFIG}
					route={{ screen, item: '' }}
					navigate={jest.fn()}
					library={{ feed: {}, refreshFeed: jest.fn() }}
				/>
			)
		);
	};

	/**
	 * The six scale screens all render through this one container, so the route's own screen id
	 * is what picks the sentence and the link.
	 *
	 * @return {void}
	 */
	it('renders the current screen helper copy under the header row', () => {
		renderOn('border-radius');

		const description = container.querySelector('.kadence-blocks-style-library__screen-description');

		expect(description.textContent).toContain(SCREEN_DOCS['border-radius'].description);
		expect(description.querySelector('a').getAttribute('href')).toBe('https://evnt.is/kadence-border-radius');
	});

	/**
	 * An unknown screen id renders no description rather than an empty paragraph.
	 *
	 * @return {void}
	 */
	it('renders no description for a screen the copy catalog does not cover', () => {
		renderOn('not-a-screen');

		expect(container.querySelector('.kadence-blocks-style-library__screen-description')).toBeNull();
	});
});
