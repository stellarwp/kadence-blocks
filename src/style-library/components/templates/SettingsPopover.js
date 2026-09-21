// cspell:ignore labelledby -- the ARIA attribute name.
/**
 * The popover that holds the open item's settings editor. It attaches to the element the item was
 * clicked on, found through the item anchor registry, so the editor opens next to what it edits.
 */

/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './SettingsPopover.scss';
import { SETTINGS_PANEL_TITLE_ID } from './SettingsPanel';
import { useItemAnchor } from '../../hooks/use-item-anchor';

/**
 * Render the settings popover.
 *
 * The children are always mounted, even before the item's element exists (a list still loading, a
 * deep link), because the panel's own effects publish its draft and clear a stale item. Until the
 * anchor is known they sit in a hidden wrapper instead of the popover.
 *
 * @param {Object}      props                        The component props.
 * @param {string}      props.itemId                 The open item's id.
 * @param {Function}    props.onClose                Called when the popover asks to close (Escape).
 * @param {boolean}     [props.ignoreFocusOutside]   Skip the focus-outside close, for as long as
 *                                                   something outside the popover (the unsaved
 *                                                   changes modal) has taken focus on purpose.
 * @param {JSX.Element} props.children               The settings panel.
 *
 * @since TBD
 *
 * @return {JSX.Element} The popover, or the hidden wrapper while there is no anchor.
 */
export function SettingsPopover({ itemId, onClose, ignoreFocusOutside = false, children }) {
	const anchor = useItemAnchor(itemId);

	if (!anchor) {
		return <div hidden>{children}</div>;
	}

	const handleFocusOutside = () => {
		if (!ignoreFocusOutside) {
			onClose();
		}
	};

	return (
		<Popover
			className="kadence-blocks-style-library__settings-popover"
			anchor={anchor.element}
			placement={anchor.placement}
			offset={8}
			shift
			expandOnMobile
			focusOnMount="firstElement"
			aria-labelledby={SETTINGS_PANEL_TITLE_ID}
			onClose={onClose}
			onFocusOutside={handleFocusOutside}
		>
			{children}
		</Popover>
	);
}
