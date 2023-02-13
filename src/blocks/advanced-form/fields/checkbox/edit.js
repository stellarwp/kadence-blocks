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
	Button
} from '@wordpress/components';

import { useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { times, filter } from 'lodash';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';

function FieldCheckbox( {
						  attributes,
						  setAttributes,
						  isSelected,
						  name
					  }  ) {

	const { required, label, showLabel, helpText, options, width, ariaDescription } = attributes;

	const [ rerender, setRerender ] = useState( 0 );

	const updateOption = ( index, value ) => {
		const newOptions = options.map( ( item, iteration ) => {
			if ( index === iteration ) {
				item = { ...item, ...value };
			}
			return item;
		} );

		setAttributes( {
			options: newOptions,
		} );
	};

	const toggleSelected = ( index, value ) => {
		updateOption( index, { selected: !options[ index ].selected } );
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
		if ( ! options ) {
			return;
		}

		let tmpValue = options[ newIndex ];

		options.splice( newIndex, 1, options[ oldIndex ] );
		options.splice( oldIndex, 1, tmpValue );

		setAttributes( { options: options } );
	}

	const removeOptionItem = ( previousIndex ) => {
		const amount = Math.abs( options.length );
		if ( amount === 1 ) {
			return;
		}
		const currentItems = filter( options, ( item, i ) => previousIndex !== i );
		setAttributes( { options: currentItems } );
	};

	const classes = classNames( {
		'kb-advanced-form-field': true,
		[ `kb-field-desk-width-${width[0]}` ]: true,
		[ `kb-field-tablet-width-${width[1]}` ]: width[1] !== '',
		[ `kb-field-mobile-width-${width[2]}` ]: width[2] !== '',
	});

	return (
		<div className={ classes }>
			<InspectorControls>

				<PanelBody
					title={ __( 'Field Controls', 'kadence-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Required', 'kadence-blocks' ) }
						checked={ required }
						onChange={ ( value ) => setAttributes( { required: value } ) }
					/>

					<ToggleControl
						label={ __( 'Show Label', 'kadence-blocks' ) }
						checked={ showLabel }
						onChange={ ( value ) => setAttributes( { showLabel: value } ) }
					/>

					<div className='kb-field-options-wrap'>
					{times( options.length , n => (
						<div className="field-options-wrap">

							<hr/>

							<TextControl
								className={'kb-option-text-control'}
								key={n}
								label={__( 'Option', 'kadence-blocks' ) + ' ' + ( n + 1 )}
								placeholder={__( 'Option', 'kadence-blocks' )}
								value={( undefined !== options[ n ].label ? options[ n ].label : '' )}
								onChange={( text ) => updateOption( n, { label: text } )}
							/>
							<TextControl
								label={__( 'Value', 'kadence-blocks' )}
								placeholder={options[ n ].label}
								value={( undefined !== options[ n ].value ? options[ n ].value : '' )}
								onChange={( text ) => updateOption( n, { value: text } )}
							/>
							<div className="kadence-blocks-list-item__control-menu">
								<Button
									icon="arrow-up"
									onClick={n === 0 ? undefined : onOptionMoveUp( n )}
									className="kadence-blocks-list-item__move-up"
									label={__( 'Move Item Up' )}
									aria-disabled={n === 0}
									disabled={n === 0}
								/>
								<Button
									icon="arrow-down"
									onClick={( n + 1 ) === options.length ? undefined : onOptionMoveDown( n )}
									className="kadence-blocks-list-item__move-down"
									label={__( 'Move Item Down' )}
									aria-disabled={( n + 1 ) === options.length}
									disabled={( n + 1 ) === options.length}
								/>
								<Button
									icon="no-alt"
									onClick={() => removeOptionItem( n )}
									className="kadence-blocks-list-item__remove"
									label={__( 'Remove Item' )}
									disabled={1 === options.length}
								/>
							</div>
						</div>
					) )}
					</div>
					<Button
						className="kb-add-option"
						isPrimary={ true }
						onClick={() => {
							const newOptions = options;
							newOptions.push( {
								value: '',
								label: '',
							} );
							setAttributes( { options: newOptions } );
							setRerender( Math.random() );
						}}
					>
						<Dashicon icon="plus"/>
						{__( 'Add Option', 'kadence-blocks' )}
					</Button>

					<TextControl
						label={ __( 'Help Text', 'kadence-blocks' ) }
						value={ helpText }
						onChange={ ( value ) => setAttributes( { helpText: value } ) }
					/>

					<TextControl
						label={ __( 'Input aria description', 'kadence-blocks' ) }
						value={ ariaDescription }
						onChange={ ( value ) => setAttributes( { ariaDescription: value } ) }
					/>

				</PanelBody>
			</InspectorControls>
			<>
				<FormFieldLabel
					required={ required }
					label={ label }
					showLabel={ showLabel }
					setAttributes={ setAttributes }
					isSelected={ isSelected }
					name={ name }
				/>

				{ isSelected ?
						<div className={'kb-form-field kb-form-multi'}>
							{times( options.length, n => (
								<div className={'kb-checkbox-item'} key={n}>
									<input key={ 'cb' + n} type="checkbox" name={'kb_field'} className={'kb-sub-field kb-checkbox-style'} onChange={( value ) => toggleSelected( n, value.target.value )} checked={ options[ n ].selected }/>
									<input key={ 'text' + n} type={'text'} value={options[ n ].label} className={ 'ignore-field-styles' } onChange={( value ) => updateOption( n, { label: value.target.value } )}/>
									<Button onClick={() => removeOptionItem( n )}>
										<span className="dashicons dashicons-trash"></span>
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
								setAttributes( { options: newOptions } );
								setRerender( Math.random() );
							}}
						>
							<Dashicon icon="plus"/>
							{__( 'Add Option', 'kadence-blocks' )}
						</Button>
					</div>
					:
					<>
						{times( options.length , n => (
							<div className={ 'kb-checkbox-item' } key={ n }>
								<input type="checkbox" name={ 'kb_field' } className={ 'kb-sub-field kb-checkbox-style' } checked={ options[ n ].selected } />
								<label htmlFor={ 'kb_field' }>{ options[ n ].label }</label>
							</div>
						) )}
					</>
				}

				{ helpText && <span className="kb-form-field-help">{ helpText }</span> }

			</>
		</div>
	);
}

export default FieldCheckbox;
