/**
 * BLOCK: Kadence Counter Up
 */

/**
 * External dependencies
 */
import map from 'lodash/map';

/**
 * Internal dependencies
 */
import TypographyControls from '../../typography-control';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import KadenceRange from '../../kadence-range-control';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
	TextControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	TabPanel,
	Dashicon
} = wp.components;

/**
 * Counter Up Settings
 */
class Inspector extends Component {
	constructor() {
		super( ...arguments );
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
			start,
			end,
			prefix,
			suffix,
			duration,
			separator,
			displayTitle,
			titleFont,
			titleColor,
			titleHoverColor,
			titleMinHeight,
			numberColor,
			numberHoverColor,
			numberMinHeight,
			numberFont
		} = attributes;

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

		const saveNumberFont = ( value ) => {
			const newUpdate = numberFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				numberFont: newUpdate,
			} );
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Counter Up Settings' ) }
						initialOpen={ true }>

						<div className="kt-columns-control">
							<RangeControl
								label={ __( 'Starting Number' ) }
								value={ start }
								onChange={ (value) => setAttributes({ start: value }) }
								min={ -1000 }
								max={ 1000 }
								step={ 1 }
							/>

							<RangeControl
								label={ __( 'Ending Number' ) }
								value={ end }
								onChange={ (value) => setAttributes({ end: value }) }
								min={ -9000 }
								max={ 90000000 }
								step={ 1 }
							/>

							<TextControl
								label={ __( 'Number Prefix' ) }
								value={ prefix }
								onChange={ value => setAttributes( { prefix: value } ) }
							/>

							<TextControl
								label={ __( 'Number Suffix' ) }
								value={ suffix }
								onChange={ value => setAttributes( { suffix: value } ) }
							/>

							<RangeControl
								label={ __( 'Animation Duration' ) }
								value={ duration }
								onChange={ (value) => setAttributes({ duration: value }) }
								min={ 1 }
								max={ 50 }
								step={ 1 }
							/>

							<ToggleControl
								label={ __( 'Thousand Separator' ) }
								checked={ separator }
								onChange={ ( value ) => setAttributes( { separator: value } ) }
							/>
						</div>
					</PanelBody>

					<PanelBody
						title={ __( 'Title Settings' ) }
						initialOpen={ false }>
						<ToggleControl
							label={ __( 'Show Title' ) }
							checked={ displayTitle }
							onChange={ ( value ) => setAttributes( { displayTitle: value } ) }
						/>
						{
							displayTitle &&
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
									onMarginControl={ ( value ) => saveTitleFont( { marginControl: value } ) } />
							</Fragment>
						}
					</PanelBody>

					<PanelBody
						title={ __( 'Number Settings' ) }
						initialOpen={ false }>
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
													colorValue={ ( numberHoverColor ? numberHoverColor : '' ) }
													colorDefault={ '' }
													onColorChange={ value => setAttributes( { numberHoverColor: value } ) }
												/>
											);
										} else {
											tabout = (
												<AdvancedPopColorControl
													label={ __( 'Number Color' ) }
													colorValue={ ( numberColor ? numberColor : '' ) }
													colorDefault={ '' }
													onColorChange={ value => setAttributes( { numberColor: value } ) }
												/>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>

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
													value={ ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 2 ] ) ? numberMinHeight[ 2 ] : '' ) }
													onChange={ value => setAttributes( { numberMinHeight: [ ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 0 ] ) ? numberMinHeight[ 0 ] : '' ), ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 1 ] ) ? numberMinHeight[ 1 ] : '' ), value ] } ) }
													step={ 1 }
													min={ 0 }
													max={ 600 }
												/>
											);
										} else if ( 'tablet' === tab.name ) {
											tabout = (
												<KadenceRange
													value={ ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 1 ] ) ? numberMinHeight[ 1 ] : '' ) }
													onChange={ value => setAttributes( { numberMinHeight: [ ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 0 ] ) ? numberMinHeight[ 0 ] : '' ), value, ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 2 ] ) ? numberMinHeight[ 2 ] : '' ) ] } ) }
													step={ 1 }
													min={ 0 }
													max={ 600 }
												/>
											);
										} else {
											tabout = (
												<KadenceRange
													value={ ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 0 ] ) ? numberMinHeight[ 0 ] : '' ) }
													onChange={ value => setAttributes( { numberMinHeight: [ value, ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 1 ] ) ? numberMinHeight[ 1 ] : '' ), ( ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 2 ] ) ? numberMinHeight[ 2 ] : '' ) ] } ) }
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
						<TypographyControls
							fontGroup={ 'heading' }
							tagLevel={ numberFont[ 0 ].level }
							fontSize={ numberFont[ 0 ].size }
							onFontSize={ ( value ) => saveNumberFont( { size: value } ) }
							fontSizeType={ numberFont[ 0 ].sizeType }
							onFontSizeType={ ( value ) => saveNumberFont( { sizeType: value } ) }
							lineHeight={ numberFont[ 0 ].lineHeight }
							onLineHeight={ ( value ) => saveNumberFont( { lineHeight: value } ) }
							lineHeightType={ numberFont[ 0 ].lineType }
							onLineHeightType={ ( value ) => saveNumberFont( { lineType: value } ) }
							letterSpacing={ numberFont[ 0 ].letterSpacing }
							onLetterSpacing={ ( value ) => saveNumberFont( { letterSpacing: value } ) }
							fontFamily={ numberFont[ 0 ].family }
							onFontFamily={ ( value ) => saveNumberFont( { family: value } ) }
							onFontChange={ ( select ) => {
								saveNumberFont( {
									family: select.value,
									google: select.google,
								} );
							} }
							onFontArrayChange={ ( values ) => saveNumberFont( values ) }
							googleFont={ numberFont[ 0 ].google }
							onGoogleFont={ ( value ) => saveNumberFont( { google: value } ) }
							loadGoogleFont={ numberFont[ 0 ].loadGoogle }
							onLoadGoogleFont={ ( value ) => saveNumberFont( { loadGoogle: value } ) }
							fontVariant={ numberFont[ 0 ].variant }
							onFontVariant={ ( value ) => saveNumberFont( { variant: value } ) }
							fontWeight={ numberFont[ 0 ].weight }
							onFontWeight={ ( value ) => saveNumberFont( { weight: value } ) }
							fontStyle={ numberFont[ 0 ].style }
							onFontStyle={ ( value ) => saveNumberFont( { style: value } ) }
							fontSubset={ numberFont[ 0 ].subset }
							onFontSubset={ ( value ) => saveNumberFont( { subset: value } ) }
							padding={ numberFont[ 0 ].padding }
							onPadding={ ( value ) => saveNumberFont( { padding: value } ) }
							paddingControl={ numberFont[ 0 ].paddingControl }
							onPaddingControl={ ( value ) => saveNumberFont( { paddingControl: value } ) }
							margin={ numberFont[ 0 ].margin }
							onMargin={ ( value ) => saveNumberFont( { margin: value } ) }
							marginControl={ numberFont[ 0 ].marginControl }
							onMarginControl={ ( value ) => saveNumberFont( { marginControl: value } ) } />
					</PanelBody>
	            </InspectorControls>
	        </Fragment>
		);
	}
}

export default Inspector;
