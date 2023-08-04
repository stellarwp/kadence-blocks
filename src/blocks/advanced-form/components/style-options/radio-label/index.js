import { __ } from '@wordpress/i18n';

import {
	PopColorControl,
	TypographyControls,
	KadencePanelBody,
} from '@kadence/components';

import {
	SelectControl,
	ToggleControl
} from '@wordpress/components';

import { useState } from '@wordpress/element';

export default function RadioLabelOptions( { setAttributes, radioLabelFont } ) {

	const saveRadioLabelFont = ( value ) => {
		setAttributes( { ...radioLabelFont, ...value }, 'radioLabelFont' );
	};
	return (
		<>
			<PopColorControl
				label={__( 'Label Color', 'kadence-blocks' )}
				value={( radioLabelFont?.color ? radioLabelFont?.color : '' )}
				default={''}
				onChange={value => {
					saveRadioLabelFont( { color: value } );
				}}
			/>
			<TypographyControls
				fontSize={radioLabelFont?.size ? radioLabelFont?.size : undefined }
				onFontSize={( value ) => saveRadioLabelFont( { size: value } )}
				fontSizeType={radioLabelFont?.sizeType ? radioLabelFont?.sizeType : 'px'}
				onFontSizeType={( value ) => saveRadioLabelFont( { sizeType: value } )}
				lineHeight={radioLabelFont?.lineHeight}
				onLineHeight={( value ) => saveRadioLabelFont( { lineHeight: value } )}
				lineHeightType={radioLabelFont?.lineType}
				onLineHeightType={( value ) => saveRadioLabelFont( { lineType: value } )}
			/>
			<KadencePanelBody
				title={__( 'Advanced Label Settings', 'kadence-blocks' )}
				initialOpen={false}
				panelName={'kb-form-advanced-label-settings'}
			>
				<TypographyControls
					fontGroup={'body'}
					reLetterSpacing={radioLabelFont?.letterSpacing}
					onLetterSpacing={( value ) => saveRadioLabelFont( { letterSpacing: value } )}
					letterSpacingType={radioLabelFont?.letterType}
					onLetterSpacingType={( value ) => saveRadioLabelFont( { letterType: value } )}
					textTransform={radioLabelFont?.textTransform}
					onTextTransform={( value ) => saveRadioLabelFont( { textTransform: value } )}
					fontFamily={radioLabelFont?.family}
					onFontFamily={( value ) => saveRadioLabelFont( { family: value } )}
					onFontChange={( select ) => {
						saveRadioLabelFont( {
							family: select.value,
							google: select.google,
						} );
					}}
					onFontArrayChange={( values ) => saveRadioLabelFont( values )}
					googleFont={radioLabelFont?.google}
					onGoogleFont={( value ) => saveRadioLabelFont( { google: value } )}
					loadGoogleFont={radioLabelFont?.loadGoogle}
					onLoadGoogleFont={( value ) => saveRadioLabelFont( { loadGoogle: value } )}
					fontVariant={radioLabelFont?.variant}
					onFontVariant={( value ) => saveRadioLabelFont( { variant: value } )}
					fontWeight={radioLabelFont?.weight}
					onFontWeight={( value ) => saveRadioLabelFont( { weight: value } )}
					fontStyle={radioLabelFont?.style}
					onFontStyle={( value ) => saveRadioLabelFont( { style: value } )}
					fontSubset={radioLabelFont?.subset}
					onFontSubset={( value ) => saveRadioLabelFont( { subset: value } )}
				/>
			</KadencePanelBody>
		</>
	);

}
