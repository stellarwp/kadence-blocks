/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SettingsPopover } from '../components/templates/SettingsPopover';
import { ItemAnchorProvider, useItemAnchorRef } from '../hooks/use-item-anchor';

let popoverProps;

// The nested `@wordpress/components` copy resolves its own react, so a stand-in records the props
// the popover received and renders its children.
jest.mock('@wordpress/components', () => ({
	Popover: ({ children, ...props }) => {
		popoverProps = props;

		return <div data-popover>{children}</div>;
	},
}));

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	popoverProps = null;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
});

/**
 * A stand-in card that registers itself as the anchor for an id.
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
	return <div ref={useItemAnchorRef(id, placement)} data-card={id} />;
}

/**
 * Render a popover for an item, optionally with its card registered.
 *
 * @param {Object}  options              The render options.
 * @param {boolean} options.withCard     Whether the item's card is mounted.
 * @param {Object}  options.popoverProps Extra props for the popover.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderPopover({ withCard = true, ...props } = {}) {
	act(() => {
		root.render(
			<ItemAnchorProvider>
				{withCard && <Card id="a" placement="right-start" />}
				<SettingsPopover itemId="a" onClose={() => {}} {...props}>
					<span data-child />
				</SettingsPopover>
			</ItemAnchorProvider>
		);
	});
}

describe('SettingsPopover', () => {
	/**
	 * With no anchor yet the children still mount, hidden and outside the popover, so the panel's
	 * own effects keep running.
	 *
	 * @return {void}
	 */
	it('mounts the children hidden while there is no anchor', () => {
		renderPopover({ withCard: false });

		expect(popoverProps).toBeNull();
		expect(container.querySelector('[hidden] [data-child]')).not.toBeNull();
	});

	/**
	 * Once the card is registered the popover attaches to it with the registered placement.
	 *
	 * @return {void}
	 */
	it('attaches to the registered element with its placement', () => {
		renderPopover();

		expect(popoverProps.anchor).toBe(container.querySelector('[data-card="a"]'));
		expect(popoverProps.placement).toBe('right-start');
		expect(popoverProps.offset).toBe(8);
		expect(popoverProps.shift).toBe(true);
		expect(popoverProps.expandOnMobile).toBe(true);
		expect(container.querySelector('[data-popover] [data-child]')).not.toBeNull();
	});

	/**
	 * Escape (the popover's own close) calls the given close handler.
	 *
	 * @return {void}
	 */
	it('calls onClose when the popover asks to close', () => {
		const onClose = jest.fn();

		renderPopover({ onClose });
		popoverProps.onClose();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	/**
	 * Focus leaving the popover closes it.
	 *
	 * @return {void}
	 */
	it('closes on focus outside', () => {
		const onClose = jest.fn();

		renderPopover({ onClose });
		popoverProps.onFocusOutside();

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	/**
	 * While the unsaved-changes modal holds focus, focus outside must not close or re-guard.
	 *
	 * @return {void}
	 */
	it('ignores focus outside while told to', () => {
		const onClose = jest.fn();

		renderPopover({ onClose, ignoreFocusOutside: true });
		popoverProps.onFocusOutside();

		expect(onClose).not.toHaveBeenCalled();
	});
});
