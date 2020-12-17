/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * External dependencies
 */
import map from 'lodash/map';

/**
 * Internal dependencies
 */
import AdvancedPopColorControl from '../../../../advanced-pop-color-control';
import TypographyControls from '../../../../typography-control';
import KadenceRange from '../../../../kadence-range-control';
import MeasurementControls from '../../../../measurement-control';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls, ContrastChecker, PanelColorSettings, AlignmentToolbar } = wp.blockEditor;
const {
	TextControl,
	SelectControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	BaseControl,
	ButtonGroup,
	Button,
	ColorPicker,
	TextareaControl,
	CheckboxControl,
	Tooltip,
	TabPanel,
	Dashicon
} = wp.components;


/**
 * Menu category Settings
 */
class Inspector extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			containerMarginControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
		};
	}

	render() {
		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes,
		} = this.props;

		const {
			displayTitle,
			titleColor,
			titleMinHeight,
			titleHoverColor,
			titleFont,

			displayText,
			textColor,
			textMinHeight,
			textHoverColor,
			textFont,

			displayAmount,
			priceColor,
			priceMinHeight,
			priceHoverColor,
			priceFont,

			containerBackground,
			containerBackgroundOpacity,
			containerHoverBackground,
			containerHoverBackgroundOpacity,
			containerBorder,
			containerBorderOpacity,
			containerHoverBorder,
			containerHoverBorderOpacity,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,

		} = attributes;

		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, containerMarginControl } = this.state;

		const saveTitleFont = ( value ) => {
			const newUpdate = titleFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				titleFont: newUpdate,
			} );
		};

		const saveTextFont = ( value ) => {
			const newUpdate = textFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				textFont: newUpdate,
			} );
		};

		const savePriceFont = ( value ) => {
			const newUpdate = priceFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				priceFont: newUpdate,
			} );
		};

		return (
			<Fragment>
				<InspectorControls>

					<PanelBody
						title={ __( 'Container Settings' ) }
						initialOpen={ false }>
						<MeasurementControls
								label={ __( 'Container Border Width (px)' ) }
								measurement={ containerBorderWidth }
								control={ containerBorderControl }
								onChange={ ( value ) => setAttributes( { containerBorderWidth: value } ) }
								onControl={ ( value ) => this.setState( { containerBorderControl: value } ) }
								min={ 0 }
								max={ 40 }
								step={ 1 }
						/>
						<KadenceRange
							label={ __( 'Container Border Radius (px)' ) }
							value={ containerBorderRadius }
							onChange={ value => setAttributes( { containerBorderRadius: value } ) }
							step={ 1 }
							min={ 0 }
							max={ 200 }
						/>
						<TabPanel className="kt-inspect-tabs kt-hover-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'normal',
									title: __( 'Normal' ),
									className: 'kt-normal-tab',
								},
								{
									name: 'hover',
									title: __( 'Hover' ),
									className: 'kt-hover-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'hover' === tab.name ) {
											tabout = (
												<Fragment>
													<AdvancedPopColorControl
														label={ __( 'Hover Background' ) }
														colorValue={ ( containerHoverBackground ? containerHoverBackground : '#f2f2f2' ) }
														colorDefault={ '#f2f2f2' }
														opacityValue={ containerHoverBackgroundOpacity }
														onColorChange={ value => setAttributes( { containerHoverBackground: value } ) }
														onOpacityChange={ value => setAttributes( { containerHoverBackgroundOpacity: value } ) }
													/>
													<AdvancedPopColorControl
														label={ __( 'Hover Border' ) }
														colorValue={ ( containerHoverBorder ? containerHoverBorder : '#eeeeee' ) }
														colorDefault={ '#eeeeee' }
														opacityValue={ containerHoverBorderOpacity }
														onColorChange={ value => setAttributes( { containerHoverBorder: value } ) }
														onOpacityChange={ value => setAttributes( { containerHoverBorderOpacity: value } ) }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<AdvancedPopColorControl
														label={ __( 'Container Background' ) }
														colorValue={ ( containerBackground ? containerBackground : '#f2f2f2' ) }
														colorDefault={ '#f2f2f2' }
														opacityValue={ containerBackgroundOpacity }
														onColorChange={ value => setAttributes( { containerBackground: value } ) }
														onOpacityChange={ value => setAttributes( { containerBackgroundOpacity: value } ) }
													/>
													<AdvancedPopColorControl
														label={ __( 'Container Border' ) }
														colorValue={ ( containerBorder ? containerBorder : '#eeeeee' ) }
														colorDefault={ '#eeeeee' }
														opacityValue={ containerBorderOpacity }
														onColorChange={ value => setAttributes( { containerBorder: value } ) }
														onOpacityChange={ value => setAttributes( { containerBorderOpacity: value } ) }
													/>
												</Fragment>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
						<MeasurementControls
							label={ __( 'Container Padding' ) }
							measurement={ containerPadding }
							control={ containerPaddingControl }
							onChange={ ( value ) => setAttributes( { containerPadding: value } ) }
							onControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
					</PanelBody>

					<PanelBody
						title={ __( 'Title Settings' ) }
						initialOpen={ false }>
						<ToggleControl
							label={ __( 'Show Title' ) }
							checked={ displayTitle }
							onChange={ ( value ) => setAttributes( { displayTitle: value } ) }
						/>

						{ displayTitle && (
							<Fragment>
								<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
								<TabPanel className="kt-inspect-tabs kt-hover-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'normal',
											title: __( 'Normal' ),
											className: 'kt-normal-tab',
										},
										{
											name: 'hover',
											title: __( 'Hover' ),
											className: 'kt-hover-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													tabout = (
														<AdvancedPopColorControl
															label={ __( 'Hover Color' ) }
															colorValue={ ( titleHoverColor ? titleHoverColor : '' ) }
															colorDefault={ '' }
															onColorChange={ value => setAttributes( { titleHoverColor: value } ) }
														/>
													);
												} else {
													tabout = (
														<AdvancedPopColorControl
															label={ __( 'Title Color' ) }
															colorValue={ ( titleColor ? titleColor : '' ) }
															colorDefault={ '' }
															onColorChange={ value => setAttributes( { titleColor: value } ) }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
								<TypographyControls
									fontGroup={ 'heading' }
									tagLevel={ titleFont[ 0 ].level }
									onTagLevel={ ( value ) => saveTitleFont( { level: value } ) }
									fontSize={ titleFont[ 0 ].size }
									onFontSize={ ( value ) => saveTitleFont( { size: value } ) }
									fontSizeType={ titleFont[ 0 ].sizeType }
									onFontSizeType={ ( value ) => saveTitleFont( { sizeType: value } ) }
									lineHeight={ titleFont[ 0 ].lineHeight }
									onLineHeight={ ( value ) => saveTitleFont( { lineHeight: value } ) }
									lineHeightType={ titleFont[ 0 ].lineType }
									onLineHeightType={ ( value ) => saveTitleFont( { lineType: value } ) }
									letterSpacing={ titleFont[ 0 ].letterSpacing }
									onLetterSpacing={ ( value ) => saveTitleFont( { letterSpacing: value } ) }
									fontFamily={ titleFont[ 0 ].family }
									onFontFamily={ ( value ) => saveTitleFont( { family: value } ) }
									onFontChange={ ( select ) => {
										saveTitleFont( {
											family: select.value,
											google: select.google,
										} );
									} }
									onFontArrayChange={ ( values ) => saveTitleFont( values ) }
									googleFont={ titleFont[ 0 ].google }
									onGoogleFont={ ( value ) => saveTitleFont( { google: value } ) }
									loadGoogleFont={ titleFont[ 0 ].loadGoogle }
									onLoadGoogleFont={ ( value ) => saveTitleFont( { loadGoogle: value } ) }
									fontVariant={ titleFont[ 0 ].variant }
									onFontVariant={ ( value ) => saveTitleFont( { variant: value } ) }
									fontWeight={ titleFont[ 0 ].weight }
									onFontWeight={ ( value ) => saveTitleFont( { weight: value } ) }
									fontStyle={ titleFont[ 0 ].style }
									onFontStyle={ ( value ) => saveTitleFont( { style: value } ) }
									fontSubset={ titleFont[ 0 ].subset }
									onFontSubset={ ( value ) => saveTitleFont( { subset: value } ) }
									padding={ titleFont[ 0 ].padding }
									onPadding={ ( value ) => saveTitleFont( { padding: value } ) }
									paddingControl={ titleFont[ 0 ].paddingControl }
									onPaddingControl={ ( value ) => saveTitleFont( { paddingControl: value } ) }
									margin={ titleFont[ 0 ].margin }
									onMargin={ ( value ) => saveTitleFont( { margin: value } ) }
									marginControl={ titleFont[ 0 ].marginControl }
									onMarginControl={ ( value ) => saveTitleFont( { marginControl: value } ) }
								/>
								<h2 className="kt-heading-size-title">{ __( 'Min Height' ) }</h2>
								<TabPanel className="kt-size-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'desk',
											title: <Dashicon icon="desktop" />,
											className: 'kt-desk-tab',
										},
										{
											name: 'tablet',
											title: <Dashicon icon="tablet" />,
											className: 'kt-tablet-tab',
										},
										{
											name: 'mobile',
											title: <Dashicon icon="smartphone" />,
											className: 'kt-mobile-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'mobile' === tab.name ) {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) }
															onChange={ value => setAttributes( { titleMinHeight: [ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ), ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ), value ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ) }
															onChange={ value => setAttributes( { titleMinHeight: [ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ), value, ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												} else {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ) ? titleMinHeight[ 0 ] : '' ) }
															onChange={ value => setAttributes( { titleMinHeight: [ value, ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 1 ] ) ? titleMinHeight[ 1 ] : '' ), ( ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 2 ] ) ? titleMinHeight[ 2 ] : '' ) ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</Fragment>
						) }
					</PanelBody>


					<PanelBody
						title={ __( 'Text Settings' ) }
						initialOpen={ false }>
						<ToggleControl
							label={ __( 'Show Text' ) }
							checked={ displayText }
							onChange={ ( value ) => setAttributes( { displayText: value } ) }
						/>

						{ displayText && (
							<Fragment>
								<h2 className="kt-tab-wrap-text">{ __( 'Color Settings' ) }</h2>
								<TabPanel className="kt-inspect-tabs kt-hover-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'normal',
											title: __( 'Normal' ),
											className: 'kt-normal-tab',
										},
										{
											name: 'hover',
											title: __( 'Hover' ),
											className: 'kt-hover-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													tabout = (
														<AdvancedPopColorControl
															label={ __( 'Hover Color' ) }
															colorValue={ ( textHoverColor ? textHoverColor : '' ) }
															colorDefault={ '' }
															onColorChange={ value => setAttributes( { textHoverColor: value } ) }
														/>
													);
												} else {
													tabout = (
														<AdvancedPopColorControl
															label={ __( 'Title Color' ) }
															colorValue={ ( textColor ? textColor : '' ) }
															colorDefault={ '' }
															onColorChange={ value => setAttributes( { textColor: value } ) }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
								<TypographyControls
									fontGroup={ 'heading' }
									tagLevel={ textFont[ 0 ].level }
									onTagLevel={ ( value ) => saveTextFont( { level: value } ) }
									fontSize={ textFont[ 0 ].size }
									onFontSize={ ( value ) => saveTextFont( { size: value } ) }
									fontSizeType={ textFont[ 0 ].sizeType }
									onFontSizeType={ ( value ) => saveTextFont( { sizeType: value } ) }
									lineHeight={ textFont[ 0 ].lineHeight }
									onLineHeight={ ( value ) => saveTextFont( { lineHeight: value } ) }
									lineHeightType={ textFont[ 0 ].lineType }
									onLineHeightType={ ( value ) => saveTextFont( { lineType: value } ) }
									letterSpacing={ textFont[ 0 ].letterSpacing }
									onLetterSpacing={ ( value ) => saveTextFont( { letterSpacing: value } ) }
									fontFamily={ textFont[ 0 ].family }
									onFontFamily={ ( value ) => saveTextFont( { family: value } ) }
									onFontChange={ ( select ) => {
										saveTextFont( {
											family: select.value,
											google: select.google,
										} );
									} }
									onFontArrayChange={ ( values ) => saveTextFont( values ) }
									googleFont={ textFont[ 0 ].google }
									onGoogleFont={ ( value ) => saveTextFont( { google: value } ) }
									loadGoogleFont={ textFont[ 0 ].loadGoogle }
									onLoadGoogleFont={ ( value ) => saveTextFont( { loadGoogle: value } ) }
									fontVariant={ textFont[ 0 ].variant }
									onFontVariant={ ( value ) => saveTextFont( { variant: value } ) }
									fontWeight={ textFont[ 0 ].weight }
									onFontWeight={ ( value ) => saveTextFont( { weight: value } ) }
									fontStyle={ textFont[ 0 ].style }
									onFontStyle={ ( value ) => saveTextFont( { style: value } ) }
									fontSubset={ textFont[ 0 ].subset }
									onFontSubset={ ( value ) => saveTextFont( { subset: value } ) }
									padding={ textFont[ 0 ].padding }
									onPadding={ ( value ) => saveTextFont( { padding: value } ) }
									paddingControl={ textFont[ 0 ].paddingControl }
									onPaddingControl={ ( value ) => saveTextFont( { paddingControl: value } ) }
									margin={ textFont[ 0 ].margin }
									onMargin={ ( value ) => saveTextFont( { margin: value } ) }
									marginControl={ textFont[ 0 ].marginControl }
									onMarginControl={ ( value ) => saveTextFont( { marginControl: value } ) }
								/>
								<h2 className="kt-heading-size-text">{ __( 'Min Height' ) }</h2>
								<TabPanel className="kt-size-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'desk',
											title: <Dashicon icon="desktop" />,
											className: 'kt-desk-tab',
										},
										{
											name: 'tablet',
											title: <Dashicon icon="tablet" />,
											className: 'kt-tablet-tab',
										},
										{
											name: 'mobile',
											title: <Dashicon icon="smartphone" />,
											className: 'kt-mobile-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'mobile' === tab.name ) {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) }
															onChange={ value => setAttributes( { textMinHeight: [ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ), ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ), value ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ) }
															onChange={ value => setAttributes( { textMinHeight: [ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ), value, ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												} else {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ) ? textMinHeight[ 0 ] : '' ) }
															onChange={ value => setAttributes( { textMinHeight: [ value, ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 1 ] ) ? textMinHeight[ 1 ] : '' ), ( ( undefined !== textMinHeight && undefined !== textMinHeight[ 2 ] ) ? textMinHeight[ 2 ] : '' ) ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</Fragment>
						) }
					</PanelBody>


					<PanelBody
						title={ __( 'Price Settings' ) }
						initialOpen={ false }>
						<ToggleControl
							label={ __( 'Show Price' ) }
							checked={ displayAmount }
							onChange={ ( value ) => setAttributes( { displayAmount: value } ) }
						/>

						{ displayAmount && (
							<Fragment>
								<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
								<TabPanel className="kt-inspect-tabs kt-hover-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'normal',
											title: __( 'Normal' ),
											className: 'kt-normal-tab',
										},
										{
											name: 'hover',
											title: __( 'Hover' ),
											className: 'kt-hover-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'hover' === tab.name ) {
													tabout = (
														<AdvancedPopColorControl
															label={ __( 'Hover Color' ) }
															colorValue={ ( priceHoverColor ? priceHoverColor : '' ) }
															colorDefault={ '' }
															onColorChange={ value => setAttributes( { priceHoverColor: value } ) }
														/>
													);
												} else {
													tabout = (
														<AdvancedPopColorControl
															label={ __( 'Title Color' ) }
															colorValue={ ( priceColor ? priceColor : '' ) }
															colorDefault={ '' }
															onColorChange={ value => setAttributes( { priceColor: value } ) }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
								<TypographyControls
									fontGroup={ 'heading' }
									tagLevel={ priceFont[ 0 ].level }
									onTagLevel={ ( value ) => savePriceFont( { level: value } ) }
									fontSize={ priceFont[ 0 ].size }
									onFontSize={ ( value ) => savePriceFont( { size: value } ) }
									fontSizeType={ priceFont[ 0 ].sizeType }
									onFontSizeType={ ( value ) => savePriceFont( { sizeType: value } ) }
									lineHeight={ priceFont[ 0 ].lineHeight }
									onLineHeight={ ( value ) => savePriceFont( { lineHeight: value } ) }
									lineHeightType={ priceFont[ 0 ].lineType }
									onLineHeightType={ ( value ) => savePriceFont( { lineType: value } ) }
									letterSpacing={ priceFont[ 0 ].letterSpacing }
									onLetterSpacing={ ( value ) => savePriceFont( { letterSpacing: value } ) }
									fontFamily={ priceFont[ 0 ].family }
									onFontFamily={ ( value ) => savePriceFont( { family: value } ) }
									onFontChange={ ( select ) => {
										savePriceFont( {
											family: select.value,
											google: select.google,
										} );
									} }
									onFontArrayChange={ ( values ) => savePriceFont( values ) }
									googleFont={ priceFont[ 0 ].google }
									onGoogleFont={ ( value ) => savePriceFont( { google: value } ) }
									loadGoogleFont={ priceFont[ 0 ].loadGoogle }
									onLoadGoogleFont={ ( value ) => savePriceFont( { loadGoogle: value } ) }
									fontVariant={ priceFont[ 0 ].variant }
									onFontVariant={ ( value ) => savePriceFont( { variant: value } ) }
									fontWeight={ priceFont[ 0 ].weight }
									onFontWeight={ ( value ) => savePriceFont( { weight: value } ) }
									fontStyle={ priceFont[ 0 ].style }
									onFontStyle={ ( value ) => savePriceFont( { style: value } ) }
									fontSubset={ priceFont[ 0 ].subset }
									onFontSubset={ ( value ) => savePriceFont( { subset: value } ) }
									padding={ priceFont[ 0 ].padding }
									onPadding={ ( value ) => savePriceFont( { padding: value } ) }
									paddingControl={ priceFont[ 0 ].paddingControl }
									onPaddingControl={ ( value ) => savePriceFont( { paddingControl: value } ) }
									margin={ priceFont[ 0 ].margin }
									onMargin={ ( value ) => savePriceFont( { margin: value } ) }
									marginControl={ priceFont[ 0 ].marginControl }
									onMarginControl={ ( value ) => savePriceFont( { marginControl: value } ) }
								/>
								<h2 className="kt-heading-size-price">{ __( 'Min Height' ) }</h2>
								<TabPanel className="kt-size-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'desk',
											title: <Dashicon icon="desktop" />,
											className: 'kt-desk-tab',
										},
										{
											name: 'tablet',
											title: <Dashicon icon="tablet" />,
											className: 'kt-tablet-tab',
										},
										{
											name: 'mobile',
											title: <Dashicon icon="smartphone" />,
											className: 'kt-mobile-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'mobile' === tab.name ) {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 2 ] ) ? priceMinHeight[ 2 ] : '' ) }
															onChange={ value => setAttributes( { priceMinHeight: [ ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 0 ] ) ? priceMinHeight[ 0 ] : '' ), ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 1 ] ) ? priceMinHeight[ 1 ] : '' ), value ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 1 ] ) ? priceMinHeight[ 1 ] : '' ) }
															onChange={ value => setAttributes( { priceMinHeight: [ ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 0 ] ) ? priceMinHeight[ 0 ] : '' ), value, ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 2 ] ) ? priceMinHeight[ 2 ] : '' ) ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												} else {
													tabout = (
														<KadenceRange
															value={ ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 0 ] ) ? priceMinHeight[ 0 ] : '' ) }
															onChange={ value => setAttributes( { priceMinHeight: [ value, ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 1 ] ) ? priceMinHeight[ 1 ] : '' ), ( ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 2 ] ) ? priceMinHeight[ 2 ] : '' ) ] } ) }
															step={ 1 }
															min={ 0 }
															max={ 600 }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</Fragment>
						) }
					</PanelBody>

	            </InspectorControls>
	        </Fragment>
		);
	}
}

export default Inspector;
