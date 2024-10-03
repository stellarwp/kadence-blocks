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
		allowClear = false,
		...props
	} ) {
		const instanceId = useInstanceId( KadenceRadioButtons );
		const id = `inspector-radio-control-${ instanceId }`;
	return (
		<div className={ `components-base-control kadence-radio-buttons-wrap${ className ? ' ' + className : '' }` }>
			{ label && (
				<div className='kadence-component__header'>
					<label
						htmlFor={ id }
						className="kadence-radio-control-label components-radio-control__label kadence-component__header__title"
					>
						{ label }
					</label>
				</div>
			) }
			<ButtonGroup id={ id } className={ `kadence-radio-container-control${ wrap ? ' kadence-radio-control-flexwrap' : '' }` }>
				{ options.map( ( option, index ) =>
					<Button
						key={`${option.label}-${option.value}-${index}`}
						isTertiary={value !== option.value}
						className={`kadence-radio-item radio-${ option.value}${ ( hideLabel ? ' radio-no-label' : '' ) }${ (  undefined !== option?.isDisabled && option.isDisabled ? ' kb-disabled-btn' : '' ) }` }
						isPrimary={value === option.value}
						icon={ undefined !== option.icon ? option.icon : undefined }
						iconSize={ undefined !== option.icon && undefined !== option.iconSize ? option.iconSize : undefined }
						aria-pressed={value === option.value}
						onClick={() => {
							if ( undefined !== option?.isDisabled && option.isDisabled ) {
								
							} else {
								if ( allowClear && option.value === value ) {
									onChange( '')
								} else {
									onChange( option.value );
								}
							}
						} }
						label={ ( hideLabel ? option.label : option?.tooltip )}
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
