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
} from '@kadence/icons';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function HoverToggleControl( {
	label = __( 'Hover Styles', 'kadence-blocks' ),
	initial = 'normal',
	hover,
	normal,
	className = '',
	icon = hoverToggle,
} ) {
	const [ isToggled, setIsToggled ] = useState( initial === 'hover' ? true : false );
	return [
		<div className={ `components-base-control kb-hover-toggle-control${ className ? ' ' + className : '' }` }>
			<div className={ 'kb-hover-toggle-control-toggle' }>
				<Button
					className={'kb-hover-toggle-btn'}
					isPrimary={isToggled}
					icon={ icon }
					aria-pressed={isToggled}
					label={ label }
					onClick={ () => {
						setIsToggled( !isToggled );
					} }
				>
				</Button>
			</div>
			<div className={ 'kb-hover-toggle-area' }>
				{ isToggled && (
					<>{ hover }</>
				)}
				{ !isToggled && (
					<>{ normal }</>
				)}
			</div>
		</div>
	];
}
