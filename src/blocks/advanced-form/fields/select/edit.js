/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import {
	TextControl,
	ToggleControl,
	PanelBody,
	Dashicon,
	Button,
	IconButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { times, filter, random } from 'lodash';

import { compose } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { withSelect, withDispatch } from '@wordpress/data';
import { getPreviewSize } from '@kadence/helpers';

import { ColumnWidth, GetHelpStyles, GetInputStyles, GetLabelStyles } from '../../components';

function FieldSelect( {
						  attributes,
						  setAttributes,
						  isSelected,
						  name,
						  previewDevice,
						  context,
					  } ) {

	const { required, label, showLabel, value, helpText, options, width, multiSelect, ariaDescription, placeholder, textColor } = attributes;

	function saveFieldsOptions( value, subIndex ) {
		const newOptions = options.map( ( item, thisIndex ) => {
			if ( subIndex === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( { options: newOptions } );
	}

	function onOptionMoveUp( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			onOptionMove( oldIndex, oldIndex - 1 );
		};
	}

	function onOptionMoveDown( oldIndex ) {
		return () => {
			if ( oldIndex === options.length - 1 ) {
				return;
			}
			onOptionMove( oldIndex, oldIndex + 1 );
		};
	}

	function onOptionMove( oldIndex, newIndex ) {
		if ( !options ) {
			return;
		}

		let tmpValue = options[ newIndex ];

		options.splice( newIndex, 1, options[ oldIndex ] );
		options.splice( oldIndex, 1, tmpValue );

		setAttributes( { options: options, rerender: random( 1.1, 99.9 ) } );
	}

	const removeOptionItem = ( previousIndex ) => {
		const amount = Math.abs( options.length );
		if ( amount === 1 ) {
			return;
		}
		const currentItems = filter( options, ( item, i ) => previousIndex !== i );
		setAttributes( { options: currentItems } );
	};

	let optionsWithPlaceholder = options;
	if ( placeholder !== '' ) {
		optionsWithPlaceholder = [ { label: placeholder, value: placeholder, disabled: true, selected: ( '' === value ? true : false ) } ].concat( options );
	}

	const parentFieldStyle = context['kadence/advanced-form/field-style'];
	const parentLabelStyle = context['kadence/advanced-form/label-style'];
	const parentHelpStyle = context['kadence/advanced-form/help-style'];

	const previewStyles = GetInputStyles( previewDevice, parentFieldStyle );
	const labelStyles = GetLabelStyles( previewDevice, parentLabelStyle );
	const helpStyles = GetHelpStyles( previewDevice, parentHelpStyle );

	const previewWidth = getPreviewSize( previewDevice, width[ 0 ], width[ 1 ], width[ 2 ] ) ;

	return (
		<div className={'kadence-blocks-form-field kb-input-size-standard'}>
			<InspectorControls>

				<PanelBody
					title={__( 'Field Controls', 'kadence-blocks' )}
					initialOpen={true}
				>
					<ToggleControl
						label={__( 'Required', 'kadence-blocks' )}
						checked={required}
						onChange={( value ) => setAttributes( { required: value } )}
					/>

					<ToggleControl
						label={__( 'Show Label', 'kadence-blocks' )}
						checked={showLabel}
						onChange={( value ) => setAttributes( { showLabel: value } )}
					/>


					{times( options.length, n => (
						<div className="field-options-wrap">

							<TextControl
								className={'kb-option-text-control'}
								key={n}
								label={__( 'Option', 'kadence-blocks' ) + ' ' + ( n + 1 )}
								placeholder={__( 'Option', 'kadence-blocks' )}
								value={( undefined !== options[ n ].label ? options[ n ].label : '' )}
								onChange={( text ) => saveFieldsOptions( { label: text, value: text }, n )}
							/>
							<div className="kadence-blocks-list-item__control-menu">
								<IconButton
									icon="arrow-up"
									onClick={n === 0 ? undefined : onOptionMoveUp( n )}
									className="kadence-blocks-list-item__move-up"
									label={__( 'Move Item Up' )}
									aria-disabled={n === 0}
									disabled={n === 0}
								/>
								<IconButton
									icon="arrow-down"
									onClick={( n + 1 ) === options.length ? undefined : onOptionMoveDown( n )}
									className="kadence-blocks-list-item__move-down"
									label={__( 'Move Item Down' )}
									aria-disabled={( n + 1 ) === options.length}
									disabled={( n + 1 ) === options.length}
								/>
								<IconButton
									icon="no-alt"
									onClick={() => removeOptionItem( n )}
									className="kadence-blocks-list-item__remove"
									label={__( 'Remove Item' )}
									disabled={1 === options.length}
								/>
							</div>
						</div>
					) )}

					<Button
						className="kb-add-option"
						isPrimary={true}
						onClick={() => {
							const newOptions = options;
							newOptions.push( {
								value: '',
								label: '',
							} );
							setAttributes( { options: newOptions, rerender: random( 1.1, 99.9 ) } );
						}}
					>
						<Dashicon icon="plus"/>
						{__( 'Add Option', 'kadence-blocks' )}
					</Button>


					<ToggleControl
						label={__( 'Multi Select', 'kadence-blocks' )}
						checked={multiSelect}
						onChange={( value ) => setAttributes( { multiSelect: value } )}
					/>

					<TextControl
						label={__( 'Field Placeholder', 'kadence-blocks' )}
						value={placeholder}
						onChange={( value ) => setAttributes( { placeholder: value } )}
					/>

					<TextControl
						label={__( 'Default Value', 'kadence-blocks' )}
						value={value}
						onChange={( value ) => setAttributes( { value: value } )}
					/>

					<TextControl
						label={__( 'Help Text', 'kadence-blocks' )}
						value={helpText}
						onChange={( value ) => setAttributes( { helpText: value } )}
					/>

					<TextControl
						label={__( 'Input aria description', 'kadence-blocks' )}
						value={ariaDescription}
						onChange={( value ) => setAttributes( { ariaDescription: value } )}
					/>

					<ColumnWidth saveSubmit={ setAttributes } width={ width } />

				</PanelBody>
			</InspectorControls>
			<div className={'kb-form-field-container'}>
				<FormFieldLabel
					required={required}
					label={label}
					showLabel={showLabel}
					setAttributes={setAttributes}
					isSelected={isSelected}
					name={name}
					textColor={textColor}
					labelStyles={ labelStyles }
					fieldStyle={ parentFieldStyle }
				/>

				{isSelected ?
					<div className={'kb-form-field kb-form-multi'}>
						{times( options.length, n => (
							<div className={'kb-checkbox-item'} key={n}>
								<TextControl value={options[ n ].label} onChange={( value ) => setLabel( n, value )}/>
								<Button onClick={() => removeOptionItem( n )}>
									<span className="dashicon dashicons dashicons-trash"></span>
								</Button>
							</div>
						) )}

						<Button
							variant={'primary'}
							className={'kb-form-multi__add-option'}
							onClick={() => {
								const newOptions = options;
								newOptions.push( {
									value: '',
									label: '',
								} );
								setAttributes( { options: newOptions, rerender: random( 1.1, 99.9 ) } );
							}}
						>
							<Dashicon icon="plus"/>
							{__( 'Add Option', 'kadence-blocks' )}
						</Button>
					</div>
					:
					<select
						multiple={multiSelect}
						className={`kb-field`}
						data-required={'yes'}
						style={{
							background       : previewStyles.background,
							color            : previewStyles.color,
							fontSize         : previewStyles.fontSize,
							lineHeight       : previewStyles.lineHeight,
							borderRadius     : previewStyles.borderRadius,
							borderTopWidth   : previewStyles.borderTopWidth,
							borderRightWidth : previewStyles.borderRightWidth,
							borderBottomWidth: previewStyles.borderBottomWidth,
							borderLeftWidth  : previewStyles.borderLeftWidth,
							borderColor      : previewStyles.borderColor,
							boxShadow        : previewStyles.boxShadow,
							width: previewWidth + '%',
						}}>
					</select>
				}

				{helpText && <span style={ helpStyles } className="kb-form-field-help">{helpText}</span>}
			</div>
		</div>
	);
}

export default compose( [
	withSelect( ( select ) => {
		return {
			previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		addUniqueID: ( value, clientID ) => dispatch( 'kadenceblocks/data' ).addUniqueID( value, clientID ),
	} ) ),
] )( FieldSelect );
