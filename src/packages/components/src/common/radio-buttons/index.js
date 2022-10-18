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
 * WordPress dependencies
 */
 import { useInstanceId } from '@wordpress/compose';
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
		const instanceId = useInstanceId( KadenceRadioButtons );
		const id = `inspector-radio-control-${ instanceId }`;
	return (
		<div className={ `components-base-control kadence-radio-buttons-wrap${ className ? ' ' + className : '' }` }>
			{ label && (
				<label
					htmlFor={ id }
					className="kadence-radio-control-label components-radio-control__label"
				>
					{ label }
				</label>
			) }
			<ButtonGroup id={ id } className={ `kadence-radio-container-control${ wrap ? ' kadence-radio-control-flexwrap' : '' }` }>
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
