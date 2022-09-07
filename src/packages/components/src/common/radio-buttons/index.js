/**
 * Radio Buttons control.
 *
 */
/**
 * Import Css
 */
 import './editor.scss';

import {
	Button,
	ButtonGroup,
} from '@wordpress/components';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function KadenceRadioButtons( {
		label,
		value,
		onChange,
		options = [],
		className,
		hideLabel=false,
		wrap=false,
		...props
	} ) {
	return (
		<div className={ `kadence-radio-buttons-wrap${ className ? ' ' + className : '' }` }>
			{ label && (
				<h2>{ label }</h2>
			) }
			<ButtonGroup className={ `kadence-radio-container-control${ wrap ? ' kadence-radio-control-flexwrap' : '' }` }>
				{ options.map( ( option, index ) =>
					<Button
						key={`${option.label}-${option.value}-${index}`}
						isTertiary={value !== option.value}
						className={`kadence-radio-item radio-${ option.value}${ ( hideLabel ? ' radio-no-label' : '' ) }` }
						isPrimary={value === option.value}
						icon={ undefined !== option.icon ? option.icon : undefined }
						aria-pressed={value === option.value}
						onClick={() => onChange( option.value )}
						label={ ( hideLabel ? option.label : undefined )}
					>
					{ ! hideLabel &&  (
						option.label
					) }
					</Button>
				)}
			</ButtonGroup>
		</div>
	);
}
