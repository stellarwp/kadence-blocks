/* eslint-env jest */

describe('PlaceholderScreen', () => {
	const originalNodeEnv = process.env.NODE_ENV;
	let mounted;

	afterEach(() => {
		if (mounted) {
			mounted.act(() => mounted.root.unmount());
			mounted.container.remove();
			mounted = null;
		}

		process.env.NODE_ENV = originalNodeEnv;
		jest.resetModules();
	});

	/**
	 * Render the screen from a fresh module registry, so a `NODE_ENV` set by the test is the one the
	 * module reads. React and the component load in the same registry on purpose: a component that
	 * uses hooks must share one React copy with the renderer.
	 *
	 * @param {Object} props The props to render `PlaceholderScreen` with.
	 *
	 * @return {{PlaceholderScreen: Function, container: HTMLElement}} The component and its mount node.
	 */
	function renderPlaceholderScreen(props) {
		jest.isolateModules(() => {
			const { act, createElement } = require('react');
			const { createRoot } = require('react-dom/client');
			const { PlaceholderScreen } = require('../components/pages/PlaceholderScreen');

			global.IS_REACT_ACT_ENVIRONMENT = true;

			const container = document.createElement('div');
			document.body.appendChild(container);

			const root = createRoot(container);
			act(() => root.render(createElement(PlaceholderScreen, props)));

			mounted = { act, root, container, PlaceholderScreen };
		});

		return mounted;
	}

	it('renders only the label and the coming-soon copy', () => {
		const { container } = renderPlaceholderScreen({ label: 'Tabs', route: { item: '' }, navigate: () => {} });

		const screen = container.querySelector('.kadence-blocks-style-library__placeholder-screen');

		expect(screen.children).toHaveLength(2);
		expect(screen.querySelector('h2').textContent).toBe('Tabs');
		expect(screen.querySelector('p').textContent).toBe('This screen is coming soon.');
	});

	it('renders no controls and owns no settings panel in a development build', () => {
		process.env.NODE_ENV = 'development';

		const { container, PlaceholderScreen } = renderPlaceholderScreen({
			label: 'Tabs',
			route: { item: 'stale-item' },
			navigate: () => {},
		});

		expect(container.querySelector('button')).toBeNull();
		expect(PlaceholderScreen.SettingsPanel).toBeUndefined();
	});
});
