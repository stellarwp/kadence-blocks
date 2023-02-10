/**
 * Range Control
 *
 */
/**
 * WordPress dependencies
 */
 import { useState } from '@wordpress/element';
 
/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
import {
	Button,
} from '@wordpress/components';
/**
 * Import Icons
 */
import {
	hoverToggle,
	click
} from '@kadence/icons';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function HoverToggleControl( {
	label = __( 'Hover Styles', 'kadence-blocks' ),
	activeLabel = __( 'Active Styles', 'kadence-blocks' ),
	initial = 'normal',
	active,
	hover,
	normal,
	className = '',
	icon = hoverToggle,
	activeIcon = click,
} ) {
	const [ isHover, setIsHover ] = useState( initial === 'hover' ? true : false );
	const [ isActive, setIsActive ] = useState( initial === 'active' ? true : false );

	return [
		<div className={ `components-base-control kb-hover-toggle-control${ className ? ' ' + className : '' }` }>
			<div className={ 'kb-hover-toggle-control-toggle' }>
				{ hover && (
					<Button
						className={'kb-hover-toggle-btn'}
						isPrimary={isHover}
						icon={ icon }
						aria-pressed={isHover}
						label={ label }
						onClick={ () => {
							setIsActive( false );
							setIsHover( !isHover );
						} }
					>
					</Button>
				)}
				{ active && (
					<Button
						className={'kb-active-toggle-btn'}
						isPrimary={isActive}
						icon={ activeIcon }
						aria-pressed={isActive}
						label={ activeLabel }
						onClick={ () => {
							setIsHover( false );
							setIsActive( !isActive );
						} }
					>
					</Button>
				)}
			</div>
			<div className={ 'kb-hover-toggle-area' }>
				{ isHover && (
					<div className='kb-hover-control-wrap'>{ hover }</div>
				)}
				{ isActive && (
					<div className='kb-active-control-wrap'>{ active }</div>
				)}
				{ !isHover && !isActive && (
					<>{ normal }</>
				)}
			</div>
		</div>
	];
}
