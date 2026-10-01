/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ItemAnchorProvider, useItemAnchor, useItemAnchorRef } from '../hooks/use-item-anchor';
import { PresetGrid } from '../components/templates/PresetGrid';
import { RowList } from '../components/templates/RowList';
import { SwatchGrid } from '../components/organisms/SwatchGrid';

jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	dragHandle: 'dragHandle',
}));

let container;
let root;
let latest;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	latest = {};
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
});

/**
 * A stand-in card that registers its root element under an id.
 *
 * @param {Object} props           The component props.
 * @param {string} props.id        The item id.
 * @param {string} props.placement The placement to register.
 *
 * @since TBD
 *
 * @return {JSX.Element} The card.
 */
function Card({ id, placement }) {
	const ref = useItemAnchorRef(id, placement);

	return <div ref={ref} data-card={id} />;
}

/**
 * A stand-in reader that records what the registry returns for an id.
 *
 * @param {Object} props    The component props.
 * @param {string} props.id The item id to read.
 *
 * @since TBD
 *
 * @return {null} Nothing.
 */
function Reader({ id }) {
	latest[id] = useItemAnchor(id);

	return null;
}

/**
 * Render nodes under the provider.
 *
 * @param {...JSX.Element} nodes The nodes to render.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderWithProvider(...nodes) {
	act(() => {
		root.render(createElement(ItemAnchorProvider, null, ...nodes));
	});
}

describe('item anchor registry', () => {
	/**
	 * A registered card is readable by id with its element and placement.
	 *
	 * @return {void}
	 */
	it('registers an element and placement on mount', () => {
		renderWithProvider(<Card id="a" placement="right-start" />, <Reader id="a" />);

		expect(latest.a.element).toBe(container.querySelector('[data-card="a"]'));
		expect(latest.a.placement).toBe('right-start');
	});

	/**
	 * Reading an id nobody registered gives null.
	 *
	 * @return {void}
	 */
	it('returns null for an unknown id', () => {
		renderWithProvider(<Reader id="missing" />);

		expect(latest.missing).toBeNull();
	});

	/**
	 * Unmounting a card releases its id.
	 *
	 * @return {void}
	 */
	it('unregisters when the card unmounts', () => {
		function Toggle() {
			const [shown, setShown] = useState(true);

			return (
				<>
					<button type="button" onClick={() => setShown(false)} />
					{shown && <Card id="a" placement="bottom-start" />}
					<Reader id="a" />
				</>
			);
		}

		renderWithProvider(<Toggle />);
		expect(latest.a).not.toBeNull();

		act(() => container.querySelector('button').click());

		expect(latest.a).toBeNull();
	});

	/**
	 * A card that changes id frees the old id and takes the new one.
	 *
	 * @return {void}
	 */
	it('re-registers when the id changes', () => {
		renderWithProvider(<Card id="a" placement="bottom-start" />, <Reader id="a" />, <Reader id="b" />);
		renderWithProvider(<Card id="b" placement="bottom-start" />, <Reader id="a" />, <Reader id="b" />);

		expect(latest.a).toBeNull();
		expect(latest.b.element).toBe(container.querySelector('[data-card="b"]'));
	});

	/**
	 * A reader mounted first sees a card that registers afterward.
	 *
	 * @return {void}
	 */
	it('shows a card registered after the reader mounted', () => {
		renderWithProvider(<Reader id="late" />);
		expect(latest.late).toBeNull();

		renderWithProvider(<Reader id="late" />, <Card id="late" placement="right-start" />);

		expect(latest.late.placement).toBe('right-start');
	});

	/**
	 * With no provider mounted, the ref is a harmless no-op.
	 *
	 * @return {void}
	 */
	it('renders a card without a provider', () => {
		act(() => {
			root.render(<Card id="a" placement="right-start" />);
		});

		expect(container.querySelector('[data-card="a"]')).not.toBeNull();
	});
});

describe('list and grid registration', () => {
	const items = [
		{ id: 'one', name: 'One' },
		{ id: 'two', name: 'Two' },
	];

	/**
	 * Every row in a `RowList` registers with the bottom-start placement.
	 *
	 * @return {void}
	 */
	it('registers RowList rows as bottom-start', () => {
		renderWithProvider(<RowList items={items} onSelect={() => {}} />, <Reader id="one" />, <Reader id="two" />);

		expect(latest.one.placement).toBe('bottom-start');
		expect(latest.two.element).toBeInstanceOf(HTMLElement);
	});

	/**
	 * Every card in a `PresetGrid`, the pinned default included, registers as right-start.
	 *
	 * @return {void}
	 */
	it('registers PresetGrid cards, including the pinned default, as right-start', () => {
		renderWithProvider(
			<PresetGrid
				items={[{ id: 'default', name: 'Default' }, ...items]}
				defaultId="default"
				onSelect={() => {}}
			/>,
			<Reader id="default" />,
			<Reader id="one" />
		);

		expect(latest.default.placement).toBe('right-start');
		expect(latest.one.placement).toBe('right-start');
	});

	/**
	 * Grid swatches register as right-start and list swatches as bottom-start.
	 *
	 * @return {void}
	 */
	it('registers SwatchGrid items by view', () => {
		const groups = [
			{ id: 'g', label: 'G', pendingDelete: false, items: [{ id: 'one', name: 'One', subLine: '#111111' }] },
		];
		const grid = (view) => (
			<SwatchGrid groups={groups} onSelect={() => {}} onAdd={() => {}} addLabel="Add color" view={view} />
		);

		renderWithProvider(grid('grid'), <Reader id="one" />);
		expect(latest.one.placement).toBe('right-start');

		renderWithProvider(grid('list'), <Reader id="one" />);
		expect(latest.one.placement).toBe('bottom-start');
	});

	/**
	 * The lists still render when no provider is mounted.
	 *
	 * @return {void}
	 */
	it('renders without a provider', () => {
		act(() => {
			root.render(<RowList items={items} onSelect={() => {}} />);
		});

		expect(container.querySelectorAll('li')).toHaveLength(2);
	});
});
