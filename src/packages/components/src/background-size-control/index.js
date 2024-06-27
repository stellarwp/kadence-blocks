/**
 * Basic Background Control.
 */

/**
 * Import External
 */
import { get, map } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
 import { useInstanceId } from '@wordpress/compose';
 import { useState, useEffect } from '@wordpress/element';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Import Kadence Icons
 */
 import { settings } from '@wordpress/icons';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup, Icon, __experimentalUnitControl as UnitControl } from '@wordpress/components';
function isCustomOption( optionsArray, value ) {
	if ( ! value ) {
		return false;
	}
	if ( ! optionsArray ) {
		return false;
	}
	return (
		! optionsArray.find( ( option ) => option.value === value )
	);
}

/**
 * Tabs for Background Control.
 */
 export default function BackgroundSizeControl( {
	label,
	value,
	onChange,
	options = [
		{ value: 'cover', label: __( 'Cover', 'kadence-blocks' ) },
		{ value: 'contain', label: __( 'Contain', 'kadence-blocks' ) },
		{ value: 'auto', label: __( 'Auto', 'kadence-blocks' ) },
	],
	allowCustom = true,
} ) {
	const instanceId = useInstanceId( BackgroundSizeControl );
	const id = `inspector-background-size-control-${ instanceId }`;
	const [ isCustom, setIsCustom ] = useState( false );
	useEffect( () => {
		setIsCustom( isCustomOption( options, value ) );
	}, [] );
	let width = 'auto';
	let height = 'auto';
	const sizeArray = value.split( ' ' );
	if ( undefined !== sizeArray[0] ) {
		width = ( undefined !== sizeArray[0] && sizeArray[0] ? sizeArray[0] : 'auto' );
		height = ( undefined !== sizeArray[1] && sizeArray[1] ? sizeArray[1] : 'auto' ); 
	}
	const onWidthChange = ( newWidth ) => {
		const sizeArray = value.split( ' ' );
		let newHeight = 'auto';
		if ( undefined !== sizeArray[0] ) {
			newHeight = ( undefined !== sizeArray[1] && sizeArray[1] ? sizeArray[1] : 'auto' ); 
		}
		onChange( newWidth + ' ' + newHeight );
	}
	const onHeightChange = ( newHeight ) => {
		const sizeArray = value.split( ' ' );
		let newWidth = 'auto';
		if ( undefined !== sizeArray[0] ) {
			newWidth = ( undefined !== sizeArray[0] && sizeArray[0] ? sizeArray[0] : 'auto' ); 
		}
		onChange( newWidth + ' ' + newHeight );
	}
	return (
		<div className="components-base-control kadence-background-size-control">
			{ label && (
				<label
					htmlFor={ id }
					className="kadence-radio-control-label components-background-size-control__label"
				>
					{ label }
				</label>
			) }
			{ ! isCustom && (
				<div className={ 'kadence-controls-content' }>
					<ButtonGroup className="kadence-radio-container-control">
						{ options.map( ( option, index ) =>
							<Button
								key={`${option.label}-${option.value}-${index}`}
								className={'kadence-radio-item radio-' + option.value}
								icon={ undefined !== option.icon ? option.icon : undefined }
								aria-pressed={value === option.value}
								variant={value === option.value ? 'primary' : 'tertiary'}
								onClick={ () => {
									onChange( option.value ) }
								}
							>
								{option.label}
							</Button>
						)}
						{ allowCustom && (
							<Button
								className={'kadence-radio-item radio-custom only-icon'}
								label={ __( 'Set custom size', 'kadence-blocks' ) }
								icon={ settings }
								onClick={ () => setIsCustom( true ) }
								isPressed={ false }
								variant={'tertiary'}
							/>
						) }
					</ButtonGroup>
				</div>
			) }
			{ isCustom && (
				<div className={ 'kadence-controls-content' }>
					<UnitControl
						labelPosition="top"
						label={ __( 'Width', 'kadence-blocks' ) }
						max={ 4000 }
						min={ 0 }
						units={ [ { value: '%', label: '%' }, { value: 'px', label: 'px' } ] }
						value={ width }
						onChange={ onWidthChange }
						className='kb-background-size-custom-input'
						placeholder={ 'auto' }
					/>
					<UnitControl
						labelPosition="top"
						label={ __( 'Height', 'kadence-blocks' ) }
						max={ 4000 }
						min={ 0 }
						value={ height }
						units={ [ { value: '%', label: '%' }, { value: 'px', label: 'px' } ] }
						onChange={ onHeightChange }
						className='kb-background-size-custom-input'
						placeholder={ 'auto' }
					/>
					{ allowCustom && (
						<ButtonGroup className="kadence-radio-container-control kadence-small-radio-container">
							<Button
								className={'kadence-radio-item radio-custom only-icon'}
								label={ __( 'Use size preset', 'kadence-blocks' ) }
								icon={ settings }
								onClick={ () => setIsCustom( false ) }
								isPressed={ true }
								variant={'primary'}
							/>
						</ButtonGroup>
					) }
				</div>
			) }
		</div>
	)
}
