import { __ } from '@wordpress/i18n';
import { Fragment, useMemo, useState, useEffect, useCallback } from '@wordpress/element';
import { toggleFormat, applyFormat, registerFormatType, useAnchorRef } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	Popover,
	ToggleControl,
	Button,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';

const icon = <svg xmlns="http://www.w3.org/2000/svg" width="800"	height="800" version="1.1" viewBox="0 0 496.8 496.8" xmlSpace="preserve"><path fill="#FFF" d="M480 385.2c0 12.8-10.4 23.2-23.2 23.2H31.2C18.4 408.4 8 398 8 385.2V103.6c0-12.8 10.4-23.2 23.2-23.2h426.4c12.8 0 23.2 10.4 23.2 23.2v281.6h-.8z"></path><path fill="#000" d="M460.8 96.4c6.4 0 11.2 3.2 11.2 9.6v284.8c0 6.4-4.8 9.6-11.2 9.6H35.2c-6.4 0-11.2-3.2-11.2-9.6V106c0-6.4 4.8-9.6 11.2-9.6H464m-3.2-24H35.2C16 72.4 0 86.8 0 106v284.8c0 19.2 16 33.6 35.2 33.6h426.4c19.2 0 35.2-14.4 35.2-33.6V106c-.8-19.2-16.8-33.6-36-33.6z"></path><path fill="#4C5654" d="M420 354c-6.4 0-12-5.6-12-12V154c0-6.4 5.6-12 12-12s12 5.6 12 12v188c0 7.2-5.6 12-12 12z"></path><g fill="#000"><circle cx="184" cy="248.4" r="45.6"></circle><circle cx="312" cy="248.4" r="45.6"></circle></g></svg>;

const name = 'kadence/typed';
const allowedBlocks = [ 'kadence/advancedheading' ];

const kadenceTypedText = {
	title     : __( 'Typed Text' ),
	tagName   : 'span',
	className : 'kt-typed-text',
	keywords  : [ __( 'typed' ), __( 'typing' ) ],
	attributes: {
		strings       : 'data-strings',
		cursorChar    : 'data-cursor-char',
		startDelay    : 'data-start-delay',
		backDelay     : 'data-back-delay',
		typeSpeed     : 'data-type-speed',
		backSpeed     : 'data-back-speed',
		smartBackspace: 'data-smart-backspace',
		loop          : 'data-loop',
		loopCount     : 'data-loop-count',
		shuffle       : 'data-shuffle',
	},
	edit( { activeAttributes, isActive, value, onChange, contentRef } ) {
		const selectedBlock = useSelect( ( select ) => {
			return select( 'core/block-editor' ).getSelectedBlock();
		}, [] );
		if ( undefined === selectedBlock?.name ) {
			return null;
		}
		if ( selectedBlock && !allowedBlocks.includes( selectedBlock.name ) ) {
			return null;
		}
		const [ isEditingTyped, setIsEditingTyped ] = useState( false );
		const onToggle = () => onChange( toggleFormat( value, { type: name } ) );

		const defaultAttributes = {
			strings       : JSON.stringify( [ '' ] ),
			cursorChar    : '_',
			startDelay    : 0,
			backDelay     : 700,
			typeSpeed     : 40,
			backSpeed     : 30,
			smartBackspace: 'false',
			loop          : 'true',
			loopCount     : 'false',
			shuffle       : 'false',
		};

		const getCurrentSettings = () => {
			let response = { ...defaultAttributes, ...activeAttributes };

			try {
				response.strings = JSON.parse( response.strings );
			} catch ( e ) {
				console.log( 'Error parsing strings', e );
			}

			return response;
		};

		const updateFormat = ( newValue ) => {
			let newAttributes = {
				...activeAttributes,
				...newValue,
			};

			if ( typeof newAttributes.strings === 'object' ) {
				try {
					newAttributes.strings = JSON.stringify( newAttributes.strings );
				} catch ( e ) {
					console.log( 'Error encoding strings', e );
				}
			}

			onChange(
				applyFormat( value, {
					type      : name,
					attributes: newAttributes,
				} ),
			);
		};

		const settings = getCurrentSettings();

		// useAnchorRef was deprecated in 6.1 in favor of useAnchor, but will remain in WP through 6.3
		const anchorRef = useAnchorRef( { ref: contentRef, value } );
		useEffect( () => {
			if ( isActive ) {
				setIsEditingTyped( true );
			} else {
				setIsEditingTyped( false );
			}
		}, [ isActive ] );
		return (
			<>
				<RichTextToolbarButton
					icon={icon}
					title={__( 'Typed Text' )}
					onClick={onToggle}
					isActive={isActive}
					className={`toolbar-button-with-text toolbar-button__${name}`}
				/>

				{isActive && isEditingTyped && (
					<Popover
						className="kb-typing-popover"
						position="bottom center right"
						placement="bottom"
						noArrow={false}
						focusOnMount={false}
						anchor={anchorRef}
					>

						<KadencePanelBody
							initialOpen={true}
							panelName={'kb-typing-basic-settings'}
						>
							<h2 style={{ marginTop: '0px' }}>{__( 'Typed Text', 'kadence-blocks' )}</h2>

							<div
								style={{
									display       : 'flex',
									flexDirection : 'row',
									justifyContent: 'space-between',
									alignItems    : 'flex-end',
								}}
							>

								<div
									style={{ flexBasis: '40%' }}
								>

									<TextControl
										label={__( 'Cursor', 'kadence-blocks' )}
										value={settings.cursorChar}
										onChange={( newValue ) => updateFormat( { cursorChar: newValue } )}
									/>
								</div>
								<div>


									<ToggleControl
										label={__( 'Loop Typing', 'kadence-blocks' )}
										checked={( settings.loop === 'true' ? true : false )}
										onChange={( val ) => {
											updateFormat( { loop: ( val ? 'true' : 'false' ) } );
										}}
									/>
								</div>

							</div>

						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Additional Strings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-typing-additional-strings'}
						>
							<ToggleControl
								label={__( 'Shuffle Strings', 'kadence-blocks' )}
								checked={( settings.shuffle === 'true' ? true : false )}
								onChange={( val ) => {
									updateFormat( { shuffle: ( val ? 'true' : 'false' ) } );
								}}
							/>

							<ToggleControl
								label={__( 'Smart Backspace', 'kadence-blocks' )}
								help={__( 'Only backspace what doesn\'t match the previous string.', 'kadence-blocks' )}
								checked={( settings.smartBackspace === 'true' ? true : false )}
								onChange={( val ) => {
									updateFormat( { smartBackspace: ( val ? 'true' : 'false' ) } );
								}}
							/>

							{settings.strings.map( ( part, i ) => (
								<TextControl
									label={`String ${i + 1}`}
									value={part}
									onChange={( val ) => {
										const newValue = [ ...settings.strings ];
										newValue[ i ] = val;
										updateFormat( { strings: newValue } );
									}}
								/>
							) )}

							<Button
								isPrimary={true}
								style={{ marginRight: '20px' }}
								onClick={() => {
									const newVal = [ ...settings.strings ];
									newVal.push( '' );
									updateFormat( { strings: newVal } );
								}}
							>
								{__( 'Add String', 'kadence-blocks' )}
							</Button>

							<Button
								isDestructive={true}
								onClick={() => {
									if ( settings.strings.length > 1 ) {
										const value = [ ...settings.strings ];
										value.splice( ( settings.strings.length - 1 ), 1 );

										updateFormat( { strings: value } );
									} else {
										updateFormat( { strings: [ '' ] } );
									}
								}}
							>
								{__( 'Remove String', 'kadence-blocks' )}
							</Button>

						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Speed Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-typing-delay-settings'}
						>
							<NumberControl
								label={__( 'Start Delay (ms)', 'kadence-blocks' )}
								value={settings.startDelay}
								onChange={( newValue ) => updateFormat( { startDelay: ( newValue ? newValue.toString() : "0" ) } )}
								required={true}
								min={0}
								shiftStep={25}
							/>

							<NumberControl
								label={__( 'Back Delay (ms)', 'kadence-blocks' )}
								value={settings.backDelay}
								onChange={( newValue ) => { updateFormat( { backDelay: ( newValue ? newValue.toString() : "0" ) } ) } }
								required={true}
								min={0}
								shiftStep={25}
							/>

							<NumberControl
								label={__( 'Type Speed (ms)', 'kadence-blocks' )}
								value={settings.typeSpeed}
								onChange={( newValue ) => updateFormat( { typeSpeed: ( newValue ? newValue.toString() : "0" ) } )}
								required={true}
								min={0}
								shiftStep={25}
							/>

							<NumberControl
								label={__( 'Backspace Speed (ms)', 'kadence-blocks' )}
								value={settings.backSpeed}
								onChange={( newValue ) => updateFormat( { backSpeed: ( newValue ? newValue.toString() : "0" ) } )}
								required={true}
								min={0}
								shiftStep={25}
							/>
						</KadencePanelBody>

					</Popover>
				)}
			</>
		);
	},
};

registerFormatType( name, kadenceTypedText );
