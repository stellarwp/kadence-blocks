import { __ } from '@wordpress/i18n';

import {
	PopColorControl,
	TypographyControls,
	KadencePanelBody,
} from '@kadence/components';

import { useState } from '@wordpress/element';

export default function HelpTextOptions( { setAttributes, helpFont } ) {

	const [ labelPaddingControl, setLabelPaddingControl ] = useState( 'individual' );
	const [ labelMarginControl, setLabelMarginControl ] = useState( 'individual' );

	const saveHelpFont = ( value ) => {
		setAttributes( { ...helpFont, ...value }, 'helpFont' );
	};

	return (
		<>
			<PopColorControl
				label={__( 'Label Color', 'kadence-blocks' )}
				value={( helpFont.color ? helpFont.color : '' )}
				default={''}
				onChange={value => {
					saveHelpFont( { color: value } );
				}}
			/>
			<TypographyControls
				fontSize={helpFont.size}
				onFontSize={( value ) => saveHelpFont( { size: value } )}
				fontSizeType={helpFont.sizeType}
				onFontSizeType={( value ) => saveHelpFont( { sizeType: value } )}
				lineHeight={helpFont.lineHeight}
				onLineHeight={( value ) => saveHelpFont( { lineHeight: value } )}
				lineHeightType={helpFont.lineType}
				onLineHeightType={( value ) => saveHelpFont( { lineType: value } )}
				disableLineHeightUnits={ true }
			/>
			<KadencePanelBody
				title={__( 'Advanced Help Text Settings', 'kadence-blocks' )}
				initialOpen={false}
				panelName={'kb-form-advanced-label-settings'}
			>
				<TypographyControls
					fontGroup={'body'}
					reLetterSpacing={helpFont.letterSpacing}
					onLetterSpacing={( value ) => saveHelpFont( { letterSpacing: value } )}
					letterSpacingType={helpFont.letterType}
					onLetterSpacingType={( value ) => saveHelpFont( { letterType: value } )}
					textTransform={helpFont.textTransform}
					onTextTransform={( value ) => saveHelpFont( { textTransform: value } )}
					fontFamily={helpFont.family}
					onFontFamily={( value ) => saveHelpFont( { family: value } )}
					onFontChange={( select ) => {
						saveHelpFont( {
							family: select.value,
							google: select.google,
						} );
					}}
					onFontArrayChange={( values ) => saveHelpFont( values )}
					googleFont={helpFont.google}
					onGoogleFont={( value ) => saveHelpFont( { google: value } )}
					loadGoogleFont={helpFont.loadGoogle}
					onLoadGoogleFont={( value ) => saveHelpFont( { loadGoogle: value } )}
					fontVariant={helpFont.variant}
					onFontVariant={( value ) => saveHelpFont( { variant: value } )}
					fontWeight={helpFont.weight}
					onFontWeight={( value ) => saveHelpFont( { weight: value } )}
					fontStyle={helpFont.style}
					onFontStyle={( value ) => saveHelpFont( { style: value } )}
					fontSubset={helpFont.subset}
					onFontSubset={( value ) => saveHelpFont( { subset: value } )}
					padding={helpFont.padding}
					onPadding={( value ) => saveHelpFont( { padding: value } )}
					paddingControl={labelPaddingControl}
					onPaddingControl={( value ) => setLabelPaddingControl( value )}
					margin={helpFont.margin}
					onMargin={( value ) => saveHelpFont( { margin: value } )}
					marginControl={labelMarginControl}
					onMarginControl={( value ) => setLabelMarginControl( value )}
					disableLetterSpacingUnits={ true }
				/>
			</KadencePanelBody>
		</>
	);

}
