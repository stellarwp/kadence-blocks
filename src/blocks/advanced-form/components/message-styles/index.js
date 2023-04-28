import { __ } from '@wordpress/i18n';
import {
	KadencePanelBody,
	PopColorControl,
	TypographyControls,
	ColorGroup,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	ResponsiveMeasureRangeControl,
} from '@kadence/components';

export default function MessageOptions( { setAttributes, attributes } ) {
	const { messageFont, messageColor, messageColorError, messageBackground, messageBackgroundError, messageBorderRadius, messageBorderRadiusUnit, messageBorderSuccess, tabletMessageBorderSuccess, mobileMessageBorderSuccess, messageBorderError, tabletMessageBorderError, mobileMessageBorderError, messagePadding, messagePaddingUnit, tabletMessagePadding, mobileMessagePadding, messageMargin, messageMarginUnit, tabletMessageMargin, mobileMessageMargin } = attributes;

	const saveMessageFont = ( value ) => {
		const newUpdate = messageFont.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			messageFont: newUpdate,
		} );
	};

	return (
		<>
			<ColorGroup label={ __( 'Success Message Colors', 'kadence-blocks' ) }>
				<PopColorControl
					label={__( 'Text Color', 'kadence-blocks' )}
					value={( messageColor ? messageColor : '' )}
					default={''}
					onChange={value => {
						setAttributes( { messageColor: value } );
					}}
				/>
				<PopColorControl
					label={__( 'Background Color', 'kadence-blocks' )}
					value={( messageBackground ? messageBackground : '' )}
					default={''}
					onChange={value => {
						setAttributes( { messageBackground: value } );
					}}
				/>
				<ResponsiveBorderControl
					label={__( 'Border', 'kadence-blocks' )}
					value={messageBorderSuccess}
					tabletValue={tabletMessageBorderSuccess}
					mobileValue={mobileMessageBorderSuccess}
					onChange={( value ) => setAttributes( { messageBorderSuccess: value } )}
					onChangeTablet={( value ) => setAttributes( { tabletMessageBorderSuccess: value } )}
					onChangeMobile={( value ) => setAttributes( { mobileMessageBorderSuccess: value } )}
				/>
			</ColorGroup>
			<ColorGroup label={ __( 'Error Message Colors', 'kadence-blocks' ) }>
				<PopColorControl
					label={__( 'Error Message Color', 'kadence-blocks' )}
					value={( messageColorError ? messageColorError : '' )}
					default={''}
					onChange={value => {
						setAttributes( { messageColorError: value } );
					}}
				/>
				<PopColorControl
					label={__( 'Error Message Background', 'kadence-blocks' )}
					value={( messageBackgroundError ? messageBackgroundError : '' )}
					default={''}
					onChange={value => {
						setAttributes( { messageBackgroundError: value } );
					}}
				/>
				<ResponsiveBorderControl
					label={__( 'Border', 'kadence-blocks' )}
					value={messageBorderError}
					tabletValue={tabletMessageBorderError}
					mobileValue={mobileMessageBorderError}
					onChange={( value ) => setAttributes( { messageBorderError: value } )}
					onChangeTablet={( value ) => setAttributes( { tabletMessageBorderError: value } )}
					onChangeMobile={( value ) => setAttributes( { mobileMessageBorderError: value } )}
				/>
			</ColorGroup>
			<TypographyControls
				fontSize={messageFont[0].size}
				onFontSize={( value ) => saveMessageFont( { size: value } )}
				fontSizeType={messageFont[0].sizeType}
				onFontSizeType={( value ) => saveMessageFont( { sizeType: value } )}
				lineHeight={messageFont[0].lineHeight}
				onLineHeight={( value ) => saveMessageFont( { lineHeight: value } )}
				lineHeightType={messageFont[0].lineType}
				onLineHeightType={( value ) => saveMessageFont( { lineType: value } )}
				textTransform={messageFont[0].textTransform}
				onTextTransform={( value ) => saveMessageFont( { textTransform: value } )}
			/>
			<ResponsiveMeasurementControls
				label={__( 'Border Radius', 'kadence-blocks' )}
				value={messageBorderRadius}
				tabletValue={tabletMessageBorderRadius}
				mobileValue={mobileMessageBorderRadius}
				onChange={( value ) => setAttributes( { messageBorderRadius: value } )}
				onChangeTablet={( value ) => setAttributes( { tabletMessageBorderRadius: value } )}
				onChangeMobile={( value ) => setAttributes( { mobileMessageBorderRadius: value } )}
				unit={messageBorderRadiusUnit}
				units={[ 'px', 'em', 'rem', '%' ]}
				onUnit={( value ) => setAttributes( { messageBorderRadiusUnit: value } )}
				max={(messageBorderRadiusUnit === 'em' || messageBorderRadiusUnit === 'rem' ? 24 : 500)}
				step={(messageBorderRadiusUnit === 'em' || messageBorderRadiusUnit === 'rem' ? 0.1 : 1)}
				min={ 0 }
				isBorderRadius={ true }
				allowEmpty={true}
			/>
			<KadencePanelBody
				title={__( 'Advanced Message Font Settings', 'kadence-blocks' )}
				initialOpen={false}
				panelName={'kb-form-advanced-message-font-settings'}
			>
				<TypographyControls
					reLetterSpacing={messageFont[0].letterSpacing}
					onLetterSpacing={( value ) => saveMessageFont( { letterSpacing: value } )}
					fontFamily={messageFont[0].family}
					onFontFamily={( value ) => saveMessageFont( { family: value } )}
					onFontChange={( select ) => {
						saveMessageFont( {
							family: select.value,
							google: select.google,
						} );
					}}
					onFontArrayChange={( values ) => saveMessageFont( values )}
					googleFont={messageFont[0].google}
					onGoogleFont={( value ) => saveMessageFont( { google: value } )}
					loadGoogleFont={messageFont[0].loadGoogle}
					onLoadGoogleFont={( value ) => saveMessageFont( { loadGoogle: value } )}
					fontVariant={messageFont[0].variant}
					onFontVariant={( value ) => saveMessageFont( { variant: value } )}
					fontWeight={messageFont[0].weight}
					onFontWeight={( value ) => saveMessageFont( { weight: value } )}
					fontStyle={messageFont[0].style}
					onFontStyle={( value ) => saveMessageFont( { style: value } )}
					fontSubset={messageFont[0].subset}
					onFontSubset={( value ) => saveMessageFont( { subset: value } )}
				/>
			</KadencePanelBody>
			<ResponsiveMeasureRangeControl
				label={__( 'Padding', 'kadence-blocks' )}
				value={ messagePadding }
				tabletValue={tabletMessagePadding}
				mobileValue={mobileMessagePadding}
				onChange={( value ) => {
					setAttributes( { messagePadding: value } );
				}}
				onChangeTablet={( value ) => {
					setAttributes( { tabletMessagePadding: value } );
				}}
				onChangeMobile={( value ) => {
					setAttributes( { mobileMessagePadding: value } );
				}}
				min={ 0 }
				max={ ( messagePaddingUnit === 'em' || messagePaddingUnit === 'rem' ? 24 : 500 ) }
				step={ ( messagePaddingUnit === 'em' || messagePaddingUnit === 'rem' ? 0.1 : 1 ) }
				unit={ messagePaddingUnit }
				units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
				onUnit={( value ) => setAttributes( { messagePaddingUnit: value } )}
			/>
			<ResponsiveMeasureRangeControl
				label={__( 'Margin', 'kadence-blocks' )}
				value={messageMargin}
				tabletValue={tabletMessageMargin}
				mobileValue={mobileMessageMargin}
				onChange={( value ) => {
					setAttributes( { messageMargin: value } );
				}}
				onChangeTablet={( value ) => {
					setAttributes( { tabletMessageMargin: value } );
				}}
				onChangeMobile={( value ) => {
					setAttributes( { mobileMessageMargin: value } );
				}}
				min={ ( messageMarginUnit === 'em' || messageMarginUnit === 'rem' ? -24 : -500 ) }
				max={ ( messageMarginUnit === 'em' || messageMarginUnit === 'rem' ? 24 : 500 ) }
				step={ ( messageMarginUnit === 'em' || messageMarginUnit === 'rem' ? 0.1 : 1 ) }
				unit={ messageMarginUnit }
				units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
				onUnit={ ( value ) => setAttributes( { messageMarginUnit: value } ) }
			/>
		</>
	);

}
