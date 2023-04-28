import { Button as CoreButton } from '@wordpress/components';

/**
 * @param {object} props
 * @param {ReactNode} props.children
 * @param {string} props.describedBy
 * @param {boolean} props.focus
 * @param {IconProps[ 'icon' ]} icon
 * @param {'left' | 'right'} iconPosition
 * @param {IconProps[ 'size' ]} iconSize
 * @param {boolean} isBusy
 * @param {boolean} isDestructive
 * @param {boolean} isPressed
 * @param {boolean} isSmall
 * @param {string} label
 * @param {string | { display: string; ariaLabel: string }} shortcut
 * @param {boolean} showTooltip
 * @param {string} text
 * @param {PopoverProps[ 'position' ]} tooltipPosition
 * @param {'primary' | 'secondary' | 'tertiary' | 'link'} variant
 * @param {boolean} __experimentalIsFocusable
 */
export function Button(props) {
	const { className = '', ...rest } = props;

	return <CoreButton className={ `stellarwp ${ className }` } { ...rest } />;
}

