import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import {
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	TabPanel,
	SelectControl
} from '@wordpress/components';

import {
	MeasurementControls,
	ResponsiveRangeControls,
	PopColorControl,
	TypographyControls,
	BoxShadowControl,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	KadencePanelBody,
	GradientControl
} from '@kadence/components';

export default function FieldStyles( { setMetaAttribute, inputFont, style, useFormMeta } ) {

	const [ fieldBorderRadius ] = useFormMeta( '_kad_form_fieldBorderRadius' );
	const [ tabletFieldBorderRadius ] = useFormMeta( '_kad_form_tabletFieldBorderRadius' );
	const [ mobileFieldBorderRadius ] = useFormMeta( '_kad_form_mobileFieldBorderRadius' );
	const [ fieldBorderRadiusUnit ] = useFormMeta( '_kad_form_fieldBorderRadiusUnit' );

	const [ fieldBorderStyle ] = useFormMeta( '_kad_form_fieldBorderStyle' );
	const [ tabletFieldBorderStyle ] = useFormMeta( '_kad_form_tabletFieldBorderStyle' );
	const [ mobileFieldBorderStyle ] = useFormMeta( '_kad_form_mobileFieldBorderStyle' );

	const saveStyle = ( value ) => {
		setMetaAttribute( { ...style, ...value }, 'style');
	}

	const btnSizes = [
		{ key: 'small', name: __( 'S', 'kadence-blocks' ) },
		{ key: 'standard', name: __( 'M', 'kadence-blocks' ) },
		{ key: 'large', name: __( 'L', 'kadence-blocks' ) },
		{ key: 'custom', name: <Dashicon icon="admin-generic"/> },
	];

	const bgType = [
		{ key: 'solid', name: __( 'Solid', 'kadence-blocks' ) },
		{ key: 'gradient', name: __( 'Gradient', 'kadence-blocks' ) },
	];

	const saveStyleBoxShadow = ( value, index ) => {

		const newItems = style.boxShadow.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );

		saveStyle( { boxShadow: newItems } );
	};
	const saveStyleBoxShadowActive = ( value, index ) => {

		const newItems = style.boxShadowActive.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );

		saveStyle( { boxShadowActive: newItems } );
	};

	const saveInputFont = ( value ) => {
		setMetaAttribute( { ...inputFont, ...value }, 'inputFont');
	};

	return (
		<>
			<TypographyControls
				fontSize={inputFont.size}
				onFontSize={( value ) => saveInputFont( { size: value } )}
				fontSizeType={inputFont.sizeType}
				onFontSizeType={( value ) => saveInputFont( { sizeType: value } )}
				lineHeight={inputFont.lineHeight}
				onLineHeight={( value ) => saveInputFont( { lineHeight: value } )}
				lineHeightType={inputFont.lineType}
				onLineHeightType={( value ) => saveInputFont( { lineType: value } )}
			/>

			<div className="kt-btn-size-settings-container">
				<h2 className="kt-beside-btn-group">{__( 'Input Size' )}</h2>
				<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Input Size', 'kadence-blocks' )}>
					{map( btnSizes, ( { name, key } ) => (
						<Button
							key={key}
							className="kt-btn-size-btn"
							isSmall
							isPrimary={style.size === key}
							aria-pressed={style.size === key}
							onClick={ () => {
								if( style.size === key ) {
									saveStyle( { size: '' } )
								} else {
									saveStyle( { size: key } )
								}
							} }
						>
							{name}
						</Button>
					) )}
				</ButtonGroup>
			</div>
			{'custom' === style.size && (
				<div className="kt-inner-sub-section">
					<h2 className="kt-heading-size-title kt-secondary-color-size">{__( 'Input Padding', 'kadence-blocks' )}</h2>
					<TabPanel className="kt-size-tabs"
							  activeClass="active-tab"
							  tabs={[
								  {
									  name     : 'desk',
									  title    : <Dashicon icon="desktop"/>,
									  className: 'kt-desk-tab',
								  },
								  {
									  name     : 'tablet',
									  title    : <Dashicon icon="tablet"/>,
									  className: 'kt-tablet-tab',
								  },
								  {
									  name     : 'mobile',
									  title    : <Dashicon icon="smartphone"/>,
									  className: 'kt-mobile-tab',
								  },
							  ]}>
						{
							( tab ) => {
								let tabout;
								if ( tab.name ) {
									if ( 'mobile' === tab.name ) {
										tabout = (
											<>
												<MeasurementControls
													label={__( 'Mobile Padding', 'kadence-blocks' )}
													measurement={style.mobilePadding}
													onChange={( value ) => saveStyle( { mobilePadding: value } )}
													min={0}
													max={100}
													step={1}
												/>
											</>
										);
									} else if ( 'tablet' === tab.name ) {
										tabout = (
											<MeasurementControls
												label={__( 'Tablet Padding', 'kadence-blocks' )}
												measurement={style.tabletPadding}
												onChange={( value ) => saveStyle( { tabletPadding: value } )}
												min={0}
												max={100}
												step={1}
											/>
										);
									} else {
										tabout = (
											<MeasurementControls
												label={__( 'Desktop Padding', 'kadence-blocks' )}
												measurement={style.deskPadding}
												onChange={( value ) => saveStyle( { deskPadding: value } )}
												min={0}
												max={100}
												step={1}
											/>
										);
									}
								}
								return <div className={tab.className} key={tab.className}>{tabout}</div>;
							}
						}
					</TabPanel>
				</div>
			)}

			<TabPanel className="kt-inspect-tabs kt-hover-tabs"
					  activeClass="active-tab"
					  tabs={[
						  {
							  name     : 'normal',
							  title    : __( 'Normal', 'kadence-blocks' ),
							  className: 'kt-normal-tab',
						  },
						  {
							  name     : 'focus',
							  title    : __( 'Focus', 'kadence-blocks' ),
							  className: 'kt-focus-tab',
						  },
					  ]}>
				{
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							if ( 'focus' === tab.name ) {
								tabout = (
									<>
										<PopColorControl
											label={__( 'Input Focus Color', 'kadence-blocks' )}
											value={( inputFont.colorActive ? inputFont.colorActive : '' )}
											default={''}
											onChange={( value ) => {
												saveInputFont( { colorActive: value } );
											}}
										/>
										<div className="kt-btn-size-settings-container">
											<h2 className="kt-beside-btn-group">{__( 'Background Type', 'kadence-blocks' )}</h2>
											<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Background Type', 'kadence-blocks' )}>
												{map( bgType, ( { name, key } ) => (
													<Button
														key={key}
														className="kt-btn-size-btn"
														isSmall
														isPrimary={( undefined !== style.backgroundActiveType ? style.backgroundActiveType : 'solid' ) === key}
														aria-pressed={( undefined !== style.backgroundActiveType ? style.backgroundActiveType : 'solid' ) === key}
														onClick={() => saveStyle( { backgroundActiveType: key } )}
													>
														{name}
													</Button>
												) )}
											</ButtonGroup>
										</div>
										{'gradient' !== style.backgroundActiveType && (
											<div className="kt-inner-sub-section">
												<PopColorControl
													label={__( 'Input Focus Background', 'kadence-blocks' )}
													value={( style.backgroundActive ? style.backgroundActive : '' )}
													default={''}
													onChange={( value ) => {
														saveStyle( { backgroundActive: value } );
													}}
													opacityValue={style.backgroundActiveOpacity}
													onOpacityChange={( value ) => saveStyle( { backgroundActiveOpacity: value } )}
													onArrayChange={( color, opacity ) => saveStyle( { backgroundActive: color, backgroundActiveOpacity: opacity } )}
												/>
											</div>
										)}
										{'gradient' === style.backgroundActiveType && (
											<div className="kt-inner-sub-section">
												<GradientControl
													value={ style.gradientActive }
													onChange={ value => saveStyle( { gradientActive: value } ) }
													gradients={ [] }
												/>
											</div>
										)}
										<BoxShadowControl
											label={__( 'Input Focus Box Shadow', 'kadence-blocks' )}
											enable={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 0 ] ? style.boxShadowActive[ 0 ] : false )}
											color={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 1 ] ? style.boxShadowActive[ 1 ] : '#000000' )}
											default={'#000000'}
											opacity={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 2 ] ? style.boxShadowActive[ 2 ] : 0.4 )}
											hOffset={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 3 ] ? style.boxShadowActive[ 3 ] : 2 )}
											vOffset={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 4 ] ? style.boxShadowActive[ 4 ] : 2 )}
											blur={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 5 ] ? style.boxShadowActive[ 5 ] : 3 )}
											spread={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 6 ] ? style.boxShadowActive[ 6 ] : 0 )}
											inset={( undefined !== style.boxShadowActive && undefined !== style.boxShadowActive[ 7 ] ? style.boxShadowActive[ 7 ] : false )}
											onEnableChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 0 );
											}}
											onColorChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 1 );
											}}
											onOpacityChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 2 );
											}}
											onHOffsetChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 3 );
											}}
											onVOffsetChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 4 );
											}}
											onBlurChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 5 );
											}}
											onSpreadChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 6 );
											}}
											onInsetChange={ ( value ) => {
												saveStyleBoxShadowActive( value, 7 );
											}}
										/>
										<PopColorControl
											label={__( 'Input Focus Border', 'kadence-blocks' )}
											value={( style.borderActive ? style.borderActive : '' )}
											default={''}
											onChange={ ( value ) => {
												saveStyle( { borderActive: value } );
											}}
											opacityValue={style.borderActiveOpacity}
											onOpacityChange={ ( value ) => saveStyle( { borderActiveOpacity: value } )}
											onArrayChange={( color, opacity ) => saveStyle( { borderActive: color, borderActiveOpacity: opacity } )}
										/>
									</>
								);
							} else {
								tabout = (
									<>
										<PopColorControl
											label={__( 'Input Color', 'kadence-blocks' )}
											value={( style.color ? style.color : '' )}
											default={''}
											onChange={ ( value ) => {
												saveStyle( { color: value } );
											}}
										/>
										<div className="kt-btn-size-settings-container">
											<h2 className="kt-beside-btn-group">{__( 'Background Type', 'kadence-blocks' )}</h2>
											<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Background Type', 'kadence-blocks' )}>
												{map( bgType, ( { name, key } ) => (
													<Button
														key={key}
														className="kt-btn-size-btn"
														isSmall
														isPrimary={( undefined !== style.backgroundType ? style.backgroundType : 'solid' ) === key}
														aria-pressed={( undefined !== style.backgroundType ? style.backgroundType : 'solid' ) === key}
														onClick={() => saveStyle( { backgroundType: key } )}
													>
														{name}
													</Button>
												) )}
											</ButtonGroup>
										</div>
										{'gradient' !== style.backgroundType && (
											<div className="kt-inner-sub-section">
												<PopColorControl
													label={__( 'Input Background', 'kadence-blocks' )}
													value={( style.background ? style.background : '' )}
													default={''}
													onChange={ ( value ) => {
														saveStyle( { background: value } );
													}}
													opacityValue={style.backgroundOpacity}
													onOpacityChange={ ( value ) => saveStyle( { backgroundOpacity: value } )}
													onArrayChange={( color, opacity ) => saveStyle( { background: color, backgroundOpacity: opacity } )}
												/>
											</div>
										)}
										{'gradient' === style.backgroundType && (
											<div className="kt-inner-sub-section">
												<GradientControl
													value={ style.gradient }
													onChange={ value => saveStyle( { gradient: value } ) }
													gradients={ [] }
												/>
											</div>
										)}
										<BoxShadowControl
											label={__( 'Input Box Shadow', 'kadence-blocks' )}
											enable={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 0 ] ? style.boxShadow[ 0 ] : false )}
											color={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 1 ] ? style.boxShadow[ 1 ] : '#000000' )}
											default={'#000000'}
											opacity={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 2 ] ? style.boxShadow[ 2 ] : 0.4 )}
											hOffset={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 3 ] ? style.boxShadow[ 3 ] : 2 )}
											vOffset={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 4 ] ? style.boxShadow[ 4 ] : 2 )}
											blur={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 5 ] ? style.boxShadow[ 5 ] : 3 )}
											spread={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 6 ] ? style.boxShadow[ 6 ] : 0 )}
											inset={( undefined !== style.boxShadow && undefined !== style.boxShadow[ 7 ] ? style.boxShadow[ 7 ] : false )}
											onEnableChange={ ( value ) => {
												saveStyleBoxShadow( value, 0 );
											}}
											onColorChange={ ( value ) => {
												saveStyleBoxShadow( value, 1 );
											}}
											onOpacityChange={ ( value ) => {
												saveStyleBoxShadow( value, 2 );
											}}
											onHOffsetChange={ ( value ) => {
												saveStyleBoxShadow( value, 3 );
											}}
											onVOffsetChange={ ( value ) => {
												saveStyleBoxShadow( value, 4 );
											}}
											onBlurChange={ ( value ) => {
												saveStyleBoxShadow( value, 5 );
											}}
											onSpreadChange={ ( value ) => {
												saveStyleBoxShadow( value, 6 );
											}}
											onInsetChange={ ( value ) => {
												saveStyleBoxShadow( value, 7 );
											}}
										/>
									</>
								);
							}
						}
						return <div className={tab.className} key={tab.className}>{tabout}</div>;
					}
				}
			</TabPanel>
			<h2>{__( 'Border Settings', 'kadence-blocks' )}</h2>
			<ResponsiveBorderControl
				label={__( 'Border', 'kadence-blocks' )}
				value={ [ fieldBorderStyle ] }
				tabletValue={tabletFieldBorderStyle}
				mobileValue={mobileFieldBorderStyle}
				onChange={( value ) => setMetaAttribute( value[0], 'fieldBorderStyle' ) }
				onChangeTablet={( value ) => setMetaAttribute( value[0], 'tabletFieldBorderStyle')}
				onChangeMobile={( value ) => setMetaAttribute( value[0], 'mobileFieldBorderStyle' )}
			/>
			<ResponsiveMeasurementControls
				label={__( 'Border Radius', 'kadence-blocks' )}
				value={fieldBorderRadius}
				tabletValue={tabletFieldBorderRadius}
				mobileValue={mobileFieldBorderRadius}
				onChange={( value ) => setMetaAttribute( value, 'fieldBorderRadius')}
				onChangeTablet={( value ) => setMetaAttribute( value, 'tabletFieldBorderRadius' )}
				onChangeMobile={( value ) => setMetaAttribute( value, 'mobileFieldBorderRadius' )}
				unit={fieldBorderRadiusUnit}
				units={[ 'px', 'em', 'rem', '%' ]}
				onUnit={( value ) => setMetaAttribute( value, 'fieldBorderRadiusUnit' ) }
				max={(fieldBorderRadiusUnit === 'em' || fieldBorderRadiusUnit === 'rem' ? 24 : 500)}
				step={(fieldBorderRadiusUnit === 'em' || fieldBorderRadiusUnit === 'rem' ? 0.1 : 1)}
				min={ 0 }
				isBorderRadius={ true }
				allowEmpty={true}
			/>
			<ResponsiveRangeControls
				label={__( 'Field Row Gap', 'kadence-blocks' )}
				value={( undefined !== style.rowGap ? style.rowGap : '' )}
				onChange={ ( value ) => {
					saveStyle( { rowGap: value.toString() } );
				}}
				tabletValue={( undefined !== style.tabletRowGap ? style.tabletRowGap : '' )}
				onChangeTablet={ ( value ) => {
					saveStyle( { tabletRowGap: value.toString() } );
				}}
				mobileValue={( undefined !== style.mobileRowGap ? style.mobileRowGap : '' )}
				onChangeMobile={ ( value ) => {
					saveStyle( { mobileRowGap: value.toString() } );
				}}
				min={0}
				max={100}
				step={1}
				showUnit={true}
				unit={'px'}
				units={[ 'px' ]}
			/>

			<h2>{__( 'Placeholder Settings', 'kadence-blocks' )}</h2>
			<PopColorControl
				label={__( 'Placeholder Color', 'kadence-blocks' )}
				value={( style.placeholderColor ? style.placeholderColor : '' )}
				default={''}
				onChange={ ( value ) => {
					saveStyle( { placeholderColor: value } );
				}}
			/>

			<KadencePanelBody
				title={__( 'Advanced Field Settings', 'kadence-blocks' )}
				initialOpen={false}
				panelName={'kb-form-advanced-field-settings'}
			>
				<TypographyControls
					letterSpacing={inputFont.letterSpacing}
					onLetterSpacing={( value ) => saveInputFont( { letterSpacing: value.toString() } )}
					textTransform={inputFont.textTransform}
					onTextTransform={( value ) => saveInputFont( { textTransform: value } )}
					fontFamily={inputFont.family}
					onFontFamily={( value ) => saveInputFont( { family: value } )}
					onFontChange={( select ) => {
						saveInputFont( {
							family: select.value,
							google: select.google,
						} );
					}}
					onFontArrayChange={( values ) => saveInputFont( values )}
					googleFont={inputFont.google}
					onGoogleFont={( value ) => saveInputFont( { google: value } )}
					loadGoogleFont={inputFont.loadGoogle}
					onLoadGoogleFont={( value ) => saveInputFont( { loadGoogle: value } )}
					fontVariant={inputFont.variant}
					onFontVariant={( value ) => saveInputFont( { variant: value } )}
					fontWeight={inputFont.weight}
					onFontWeight={( value ) => saveInputFont( { weight: value } )}
					fontStyle={inputFont.style}
					onFontStyle={( value ) => saveInputFont( { style: value } )}
					fontSubset={inputFont.subset}
					onFontSubset={( value ) => saveInputFont( { subset: value } )}
				/>
			</KadencePanelBody>
		</>
	);

}
