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
	GradientControl,
	HoverToggleControl,
	BackgroundTypeControl,
	KadenceRadioButtons,
	ResponsiveGapSizeControl,
	ResponsiveMeasureRangeControl,
} from '@kadence/components';
import { useSetting } from '@wordpress/block-editor';

import { default as useColorIsDark } from '../../use-color-is-dark';

export default function FieldStyles( { setMetaAttribute, inputFont, style, useFormMeta } ) {

	const [ fieldBorderRadius ] = useFormMeta( '_kad_form_fieldBorderRadius' );
	const [ tabletFieldBorderRadius ] = useFormMeta( '_kad_form_tabletFieldBorderRadius' );
	const [ mobileFieldBorderRadius ] = useFormMeta( '_kad_form_mobileFieldBorderRadius' );
	const [ fieldBorderRadiusUnit ] = useFormMeta( '_kad_form_fieldBorderRadiusUnit' );

	const [ fieldBorderStyle ] = useFormMeta( '_kad_form_fieldBorderStyle' );
	const [ tabletFieldBorderStyle ] = useFormMeta( '_kad_form_tabletFieldBorderStyle' );
	const [ mobileFieldBorderStyle ] = useFormMeta( '_kad_form_mobileFieldBorderStyle' );
	const colors = useSetting( 'color.palette' );
	const saveStyle = ( value ) => {
		setMetaAttribute( { ...style, ...value }, 'style');
	}
	const btnSizes = [
		{ value: 'small', label: __( 'SM' , 'kadence-blocks') },
		{ value: 'standard', label: __( 'MD', 'kadence-blocks' ) },
		{ value: 'large', label: __( 'LG', 'kadence-blocks' ) },
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
			<ResponsiveGapSizeControl
				label={__( 'Field Row Gap', 'kadence-blocks' )}
				value={ ( undefined !== style?.gap?.[0] ? style.gap[0] : '' ) }
				onChange={ value => saveStyle( { gap: [value,( undefined !== style?.gap?.[1] ? style.gap[1] : '' ),( undefined !== style?.gap?.[2] ? style.gap[2] : '' )] } )}
				tabletValue={( undefined !== style?.gap?.[1] ? style.gap[1] : '' )}
				onChangeTablet={( value ) => saveStyle( { gap: [( undefined !== style?.gap?.[0] ? style.gap[0] : '' ),value,( undefined !== style?.gap?.[2] ? style.gap[2] : '' )] } )}
				mobileValue={( undefined !== style?.gap?.[2] ? style.gap[2] : '' )}
				onChangeMobile={( value ) => saveStyle( { gap: [( undefined !== style?.gap?.[0] ? style.gap[0] : '' ),( undefined !== style?.gap?.[1] ? style.gap[1] : '' ),value] } )}
				min={0}
				max={( style?.rowGapUnit === 'px' ? 200 : 12 )}
				step={( style?.rowGapUnit === 'px' ? 1 : 0.1 )}
				unit={ style?.rowGapUnit ? rowGapUnit : 'px' }
				onUnit={( value ) => {
					saveStyle( { rowGapUnit: value } );
				}}
				units={[ 'px', 'em', 'rem' ]}
			/>
			<KadenceRadioButtons
				value={ style?.size ? style?.size : 'standard' }
				options={ btnSizes }
				hideLabel={false}
				label={__( 'Input Size', 'kadence-blocks' ) }
				onChange={ value => {
					saveStyle( { size: value } );
				}}
			/>
			<HoverToggleControl
				hoverTab={ __( 'Focus', 'kadence-blocks' ) }
				hover={
					<>
						<PopColorControl
							label={__( 'Input Focus Color', 'kadence-blocks' )}
							value={( inputFont?.colorActive ? inputFont.colorActive : '' )}
							default={''}
							onChange={( value ) => {
								saveInputFont( { colorActive: value } );
							}}
						/>
						<BackgroundTypeControl
							label={ __( 'Focus Type', 'kadence-blocks' ) }
							type={ style?.backgroundActiveType ? style.backgroundActiveType : 'normal' }
							onChange={ value => saveStyle( { backgroundActiveType: value } ) }
							allowedTypes={ [ 'normal', 'gradient' ] }
						/>
						{'gradient' !== style?.backgroundActiveType && (
							<PopColorControl
								label={__( 'Input Focus Background', 'kadence-blocks' )}
								value={( style?.backgroundActive ? style.backgroundActive : '' )}
								default={''}
								onChange={( value ) => {
									saveStyle( { backgroundActive: value } );
								}}
							/>
						)}
						{'gradient' === style?.backgroundActiveType && (
							<GradientControl
								value={ style.gradientActive }
								onChange={ value => saveStyle( { gradientActive: value } ) }
								gradients={ [] }
							/>
						) }
						<BoxShadowControl
							label={__( 'Input Focus Box Shadow', 'kadence-blocks' )}
							enable={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 0 ] ? style.boxShadowActive[ 0 ] : false )}
							color={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 1 ] ? style.boxShadowActive[ 1 ] : '#000000' )}
							default={'#000000'}
							opacity={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 2 ] ? style.boxShadowActive[ 2 ] : 0.4 )}
							hOffset={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 3 ] ? style.boxShadowActive[ 3 ] : 2 )}
							vOffset={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 4 ] ? style.boxShadowActive[ 4 ] : 2 )}
							blur={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 5 ] ? style.boxShadowActive[ 5 ] : 3 )}
							spread={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 6 ] ? style.boxShadowActive[ 6 ] : 0 )}
							inset={( undefined !== style?.boxShadowActive && undefined !== style.boxShadowActive[ 7 ] ? style.boxShadowActive[ 7 ] : false )}
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
							value={( style?.borderActive ? style.borderActive : '' )}
							default={''}
							onChange={ ( value ) => {
								saveStyle( { borderActive: value } );
							}}
						/>
					</>
				}
				normal={
					<>
						<PopColorControl
							label={__( 'Input Color', 'kadence-blocks' )}
							value={( inputFont?.color ? inputFont.color : '' )}
							default={''}
							onChange={ ( value ) => {
								saveInputFont( { color: value } );
							}}
						/>
						<PopColorControl
							label={__( 'Placeholder Color', 'kadence-blocks' )}
							value={( style?.placeholderColor ? style.placeholderColor : '' )}
							default={''}
							onChange={ ( value ) => {
								saveStyle( { placeholderColor: value } );
							}}
						/>
						<BackgroundTypeControl
							label={ __( 'Background Type', 'kadence-blocks' ) }
							type={ style?.backgroundType ? style.backgroundType : 'normal' }
							onChange={ value => saveStyle( { backgroundType: value } ) }
							allowedTypes={ [ 'normal', 'gradient' ] }
						/>
						{'gradient' !== style?.backgroundType && (
							<PopColorControl
								label={__( 'Input Background', 'kadence-blocks' )}
								value={( style?.background ? style.background : '' )}
								default={''}
								onChange={ ( value ) => {
									const isColorDark = useColorIsDark( value, colors );
									saveStyle( { background: value, isDark: isColorDark } );
								}}
							/>
						)}
						{'gradient' === style?.backgroundType && (
							<GradientControl
								value={ style?.gradient }
								onChange={ value => {
									saveStyle( { gradient: value, isDark: false } ) 
								}}
								gradients={ [] }
							/>
						)}
						<BoxShadowControl
							label={__( 'Input Box Shadow', 'kadence-blocks' )}
							enable={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 0 ] ? style.boxShadow[ 0 ] : false )}
							color={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 1 ] ? style.boxShadow[ 1 ] : '#000000' )}
							default={'#000000'}
							opacity={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 2 ] ? style.boxShadow[ 2 ] : 0.4 )}
							hOffset={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 3 ] ? style.boxShadow[ 3 ] : 2 )}
							vOffset={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 4 ] ? style.boxShadow[ 4 ] : 2 )}
							blur={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 5 ] ? style.boxShadow[ 5 ] : 3 )}
							spread={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 6 ] ? style.boxShadow[ 6 ] : 0 )}
							inset={( undefined !== style?.boxShadow && undefined !== style?.boxShadow[ 7 ] ? style.boxShadow[ 7 ] : false )}
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
						<h2>{__( 'Border Settings', 'kadence-blocks' )}</h2>
						<ResponsiveBorderControl
							label={__( 'Border', 'kadence-blocks' )}
							value={ [ fieldBorderStyle ] }
							tabletValue={ [tabletFieldBorderStyle] }
							mobileValue={ [mobileFieldBorderStyle] }
							onChange={( value ) => setMetaAttribute( value[0], 'fieldBorderStyle' ) }
							onChangeTablet={( value ) => setMetaAttribute( value[0], 'tabletFieldBorderStyle')}
							onChangeMobile={( value ) => setMetaAttribute( value[0], 'mobileFieldBorderStyle' )}
						/>y
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
						<KadencePanelBody
							title={__( 'Advanced Field Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-advanced-field-settings'}
						>
							<TypographyControls
								fontGroup={'body'}
								reLetterSpacing={inputFont.letterSpacing}
								onLetterSpacing={( value ) => saveInputFont( { letterSpacing: value } )}
								letterSpacingType={inputFont?.letterType}
								onLetterSpacingType={( value ) => saveInputFont( { letterType: value } )}
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
							<ResponsiveMeasurementControls
								label={__( 'Input Padding', 'kadence-blocks' )}
								value={ style?.padding}
								onChange={( value ) => saveStyle( { padding: value } )}
								tabletValue={ style?.tabletPadding}
								onChangeTablet={( value ) => saveStyle( { tabletPadding: value } )}
								mobileValue={ style?.mobilePadding}
								onChangeMobile={( value ) => saveStyle( { mobilePadding: value } )}
								min={0}
								max={( style?.paddingUnit === 'em' || style?.paddingUnit === 'rem' ? 12 : 200 )}
								step={( style?.paddingUnit === 'em' || style?.paddingUnit === 'rem' ? 0.1 : 1 )}
								unit={ style?.paddingUnit ? style?.paddingUnit : 'px' }
								units={[ 'px', 'em', 'rem' ]}
								onUnit={( value ) => saveStyle( { paddingUnit: value } )}
								allowEmpty={true}
							/>
						</KadencePanelBody>
					</>
				}
			/>
		</>
	);

}
