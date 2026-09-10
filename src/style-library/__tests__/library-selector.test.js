/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { LibrarySelector } from '../components/organisms/LibrarySelector';
import { useDraftChannel } from '../hooks/use-draft-channel';

// Same convention `scale-settings.test.js` uses for this hook: a bare `jest.fn()` stand-in whose
// return value each test sets, rather than automocking the module.
jest.mock('../hooks/use-draft-channel', () => ({
	useDraftChannel: jest.fn(),
}));

// `SelectDropdown` and `CreateLibraryModal` both render `@wordpress/components` controls, which
// ship their own nested `react` copy and trip React's "Invalid hook call" guard under this test's
// top-level renderer (see `scale-settings.test.js`'s identical note). Stand-ins that expose only
// what these tests need — a change trigger and the trailing action's click — keep the tests about
// guard routing rather than dropdown or modal internals.
jest.mock('../components/molecules/SelectDropdown', () => ({
	SelectDropdown: ({ onChange, trailingAction }) => (
		<div>
			<button data-testid="choose-brand" onClick={() => onChange('brand')}>
				choose brand
			</button>
			<button data-testid="trailing-action" onClick={() => trailingAction.onClick()}>
				{trailingAction.label}
			</button>
		</div>
	),
}));

jest.mock('../components/organisms/CreateLibraryModal', () => ({
	CreateLibraryModal: () => <div data-testid="create-library-modal" />,
}));

const LIBRARIES = [{ slug: 'default', title: 'Default' }];

let container;
let root;

/**
 * Render `LibrarySelector` with a fresh set of prop spies, so each test can assert on calls
 * without wiring its own boilerplate.
 *
 * @since TBD
 *
 * @return {{onOpen: Function}} The spies the component was rendered with.
 */
function renderSelector(onOpen = jest.fn(() => Promise.resolve())) {
	act(() => {
		root.render(
			createElement(LibrarySelector, {
				libraries: LIBRARIES,
				activeSlug: 'default',
				editingSlug: 'default',
				editingTitle: 'Default',
				isBusy: false,
				isLoading: false,
				isSwapping: false,
				openError: null,
				createError: null,
				onOpen,
				onCreate: jest.fn(() => Promise.resolve()),
				onClearOpenError: jest.fn(),
				onClearCreateError: jest.fn(),
			})
		);
	});

	return { onOpen };
}

/**
 * Click a button rendered by the mocked `SelectDropdown`.
 *
 * @param {string} testId The button's `data-testid`.
 *
 * @since TBD
 *
 * @return {void}
 */
function clickButton(testId) {
	act(() => {
		container.querySelector(`[data-testid="${testId}"]`).click();
	});
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	useDraftChannel.mockReset();
	useDraftChannel.mockReturnValue(null);
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('LibrarySelector draft-channel guard', () => {
	/**
	 * With no channel mounted, choosing a library opens it directly.
	 *
	 * @return {void}
	 */
	it('opens a library directly when no channel is mounted', () => {
		const { onOpen } = renderSelector();

		clickButton('choose-brand');

		expect(onOpen).toHaveBeenCalledWith('brand');
	});

	/**
	 * With a channel mounted, choosing a library routes through `channel.guard` and does not open
	 * the library until the guarded callback runs — only then does `onOpen` fire, with the chosen
	 * slug.
	 *
	 * @return {void}
	 */
	it('guards opening a library when a channel is mounted', () => {
		const guard = jest.fn();
		useDraftChannel.mockReturnValue({ guard });
		const { onOpen } = renderSelector();

		clickButton('choose-brand');

		expect(guard).toHaveBeenCalledTimes(1);
		expect(onOpen).not.toHaveBeenCalled();

		act(() => {
			guard.mock.calls[0][0]();
		});

		expect(onOpen).toHaveBeenCalledWith('brand');
	});

	/**
	 * A rejected open is still swallowed once it runs behind a mounted channel's guard — the
	 * rejection must not surface as an unhandled rejection.
	 *
	 * @return {void}
	 */
	it('swallows a rejected open behind a mounted channel', async () => {
		const guard = jest.fn();
		useDraftChannel.mockReturnValue({ guard });
		const onOpen = jest.fn(() => Promise.reject(new Error('boom')));
		renderSelector(onOpen);

		clickButton('choose-brand');

		await act(async () => {
			guard.mock.calls[0][0]();
			await Promise.resolve();
		});

		expect(onOpen).toHaveBeenCalledWith('brand');
	});

	/**
	 * With a channel mounted, clicking the trailing action routes through `channel.guard` and does
	 * not open the create modal until the guarded callback runs.
	 *
	 * @return {void}
	 */
	it('guards opening the create modal when a channel is mounted', () => {
		const guard = jest.fn();
		useDraftChannel.mockReturnValue({ guard });
		renderSelector();

		clickButton('trailing-action');

		expect(guard).toHaveBeenCalledTimes(1);
		expect(container.querySelector('[data-testid="create-library-modal"]')).toBeNull();

		act(() => {
			guard.mock.calls[0][0]();
		});

		expect(container.querySelector('[data-testid="create-library-modal"]')).not.toBeNull();
	});

	/**
	 * With no channel mounted, clicking the trailing action opens the create modal directly.
	 *
	 * @return {void}
	 */
	it('opens the create modal directly when no channel is mounted', () => {
		renderSelector();

		clickButton('trailing-action');

		expect(container.querySelector('[data-testid="create-library-modal"]')).not.toBeNull();
	});
});
