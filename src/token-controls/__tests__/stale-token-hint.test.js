/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { StaleTokenTooltip } from '../atoms/StaleTokenHint';

// Same stand-in as `font-family-selector.test.js`, for the same reason: the nested
// `@wordpress/components` copy resolves its own `react`, which trips the hook guard. The tooltip
// text lands on a wrapper so a test can read which explanation the trigger carries.
jest.mock('@wordpress/components', () => ({
	Icon: () => null,
	Tooltip: ({ text, children }) => <span data-tooltip={text}>{children}</span>,
}));

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
 * Render the tooltip around a plain button.
 *
 * @param {Object} props Tooltip props.
 *
 * @since TBD
 *
 * @return {?string} The tooltip text the wrapper carries, or null when nothing wraps the button.
 */
function renderTooltip(props) {
	act(() => root.render(createElement(StaleTokenTooltip, props, createElement('button', null, 'trigger'))));

	return container.querySelector('button').parentElement.getAttribute('data-tooltip');
}

describe('StaleTokenTooltip', () => {
	/**
	 * With no text given, the tooltip explains a deleted token — the case every token field shares.
	 *
	 * @return {void}
	 */
	it('defaults to the deleted-token explanation', () => {
		expect(renderTooltip({ active: true })).toContain('deleted from the Style Library');
	});

	/**
	 * A caller with a different reason for the stale value shows its own explanation instead.
	 *
	 * @return {void}
	 */
	it('shows the text a caller passes', () => {
		expect(renderTooltip({ active: true, text: 'Custom reason' })).toBe('Custom reason');
	});

	/**
	 * An inactive tooltip renders the trigger untouched, so a field can wrap it unconditionally.
	 *
	 * @return {void}
	 */
	it('renders the trigger untouched when inactive', () => {
		expect(renderTooltip({ active: false })).toBeNull();
	});
});
