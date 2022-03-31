/**
 * BLOCK: Kadence Count Up
 */

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import TypographyControls from '../../components/typography/typography-control';
import PopColorControl from '../../components/color/pop-color-control';
import KadenceRange from '../../components/range/range-control';
import ResponsiveAlignControls from '../../components/align/responsive-align-control';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
import KadencePanelBody from '../../components/KadencePanelBody';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
	TextControl,
	RangeControl,
	ToggleControl,
	TabPanel,
	Dashicon,
	SelectControl,
} = wp.components;

import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

/**
 * Count Up Settings
 */
class Inspector extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			titlePaddingControl: 'individual',
			titleMarginControl: 'individual',
			numberPaddingControl: 'individual',
			numberMarginControl: 'individual',
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/countup' ] !== undefined && typeof blockSettings[ 'kadence/countup' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/countup' ] } );
		}
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}

	render() {
		const {
			attributes,
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
			titleAlign,
			titleColor,
			titleMinHeight,
			titlePadding,
			titleMobilePadding,
			titleMobileMargin,
			titleTabletMargin,
			titleTabletPadding,
			titleMargin,
			titlePaddingType,
			titleMarginType,
			numberColor,
			numberMinHeight,
			numberFont,
			numberAlign,
			numberPadding,
			numberMobilePadding,
			numberMobileMargin,
			numberTabletMargin,
			numberTabletPadding,
			numberMargin,
			numberPaddingType,
			numberMarginType,
			decimalSpaces,
			decimal,
		} = attributes;
		const { titlePaddingControl, titleMarginControl, numberPaddingControl, numberMarginControl } = this.state;
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
		let theSeparator = ( separator === true ? ',' : separator );
		theSeparator = ( theSeparator === false ? '' : theSeparator );
		return (
			<Fragment>
				<InspectorControls>
					<KadencePanelBody
						title={ __( 'Count Up Settings' ) }
						initialOpen={ true }
						panelName={ 'kb-inspector-countup-settings' }
					>

						<div className="kt-columns-control">

							<div style={ { marginBottom: '15px'} }>
								<NumberControl
									label={ __( 'Starting Number', 'kadence-blocks' ) }
									value={ start }
									onChange={ (value) => setAttributes({ start: parseInt(value) }) }
									min={ 0 }
									isShiftStepEnabled={ true }
									shiftStep={ 10 }
								/>
							</div>

							<div style={ { marginBottom: '15px'} }>
								<NumberControl
									label={ __( 'Ending Number', 'kadence-blocks' ) }
									value={ end }
									onChange={ (value) => setAttributes({ end: parseInt(value) }) }
									min={ 0 }
									isShiftStepEnabled={ true }
									shiftStep={ 10 }
								/>
							</div>

							<TextControl
								label={ __( 'Number Prefix', 'kadence-blocks' ) }
								value={ prefix }
								onChange={ value => setAttributes( { prefix: value } ) }
							/>

							<TextControl
								label={ __( 'Number Suffix', 'kadence-blocks' ) }
								value={ suffix }
								onChange={ value => setAttributes( { suffix: value } ) }
							/>

							<RangeControl
								label={ __( 'Animation Duration', 'kadence-blocks' ) }
								value={ duration }
								onChange={ (value) => setAttributes({ duration: value }) }
								min={ 0.1 }
								max={ 25 }
								step={ 0.1 }
							/>

							<SelectControl
								label={ __( 'Thousand Separator', 'kadence-blocks' ) }
								value={ theSeparator }
								options={ [
									{ value: '', label: __( 'None', 'kadence-blocks' ) },
									{ value: ',', label: ',' },
									{ value: '.', label: '.' },
								] }
								onChange={ value => setAttributes( { separator: value } ) }
							/>
							<SelectControl
								label={ __( 'Decimal', 'kadence-blocks' ) }
								value={ decimal }
								options={ [
									{ value: '', label: __( 'None', 'kadence-blocks' ) },
									{ value: '.', label: '.' },
									{ value: ',', label: ',' },
								] }
								onChange={ value => setAttributes( { decimal: value } ) }
							/>
							{ decimal && (
								<RangeControl
									label={ __( 'Decimal Spaces', 'kadence-blocks' ) }
									value={ decimalSpaces }
									onChange={ (value) => setAttributes({ decimalSpaces: value }) }
									min={ 1 }
									max={ 25 }
									step={ 1 }
								/>
							) }
						</div>
					</KadencePanelBody>

					<KadencePanelBody
						title={ __( 'Title Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-inspector-title-settings' }
					>
						<ToggleControl
							label={ __( 'Show Title', 'kadence-blocks' ) }
							checked={ displayTitle }
							onChange={ ( value ) => setAttributes( { displayTitle: value } ) }
						/>
						{
							displayTitle &&
							<Fragment>
								<PopColorControl
									label={ __( 'Title Color', 'kadence-blocks' ) }
									value={ ( titleColor ? titleColor : '' ) }
									default={ '' }
									onChange={ value => setAttributes( { titleColor: value } ) }
								/>
								<ResponsiveAlignControls
									label={ __( 'Text Alignment', 'kadence-blocks' ) }
									value={ ( titleAlign && titleAlign[ 0 ] ? titleAlign[ 0 ] : '' ) }
									mobileValue={ ( titleAlign && titleAlign[ 2 ] ? titleAlign[ 2 ] : '' ) }
									tabletValue={ ( titleAlign && titleAlign[ 1 ] ? titleAlign[ 1 ] : '' ) }
									onChange={ ( nextAlign ) => setAttributes( { titleAlign: [ nextAlign, ( titleAlign && titleAlign[ 1 ] ? titleAlign[ 1 ] : '' ), ( titleAlign && titleAlign[ 2 ] ? titleAlign[ 2 ] : '' ) ] } ) }
									onChangeTablet={ ( nextAlign ) => setAttributes( { titleAlign: [ ( titleAlign && titleAlign[ 0 ] ? titleAlign[ 0 ] : '' ), nextAlign, ( titleAlign && titleAlign[ 2 ] ? titleAlign[ 2 ] : '' ) ] } ) }
									onChangeMobile={ ( nextAlign ) => setAttributes( { titleAlign: [ ( titleAlign && titleAlign[ 0 ] ? titleAlign[ 0 ] : '' ), ( titleAlign && titleAlign[ 1 ] ? titleAlign[ 1 ] : '' ), nextAlign ] } ) }
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
								<TypographyControls
									fontGroup={ 'heading' }
									tagLowLevel={ 2 }
									tagHighLevel={ 7 }
									otherTags={ { 'p': true, 'span': true, 'div': true } }
									tagLevel={ titleFont[ 0 ].level }
									htmlTag={ titleFont[ 0 ].htmlTag }
									onTagLevel={ ( value ) => saveTitleFont( { level: value } ) }
									onTagLevelHTML={ ( level, tag ) => {
										saveTitleFont( { level: level, htmlTag: tag } );
									} }
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
								/>
								<ResponsiveMeasurementControls
									label={ __( 'Title Padding', 'kadence-blocks' ) }
									value={ titlePadding }
									control={ titlePaddingControl }
									tabletValue={ titleTabletPadding }
									mobileValue={ titleMobilePadding }
									onChange={ ( value ) => setAttributes( { titlePadding: value } ) }
									onChangeTablet={ ( value ) => setAttributes( { titleTabletPadding: value } ) }
									onChangeMobile={ ( value ) => setAttributes( { titleMobilePadding: value } ) }
									onChangeControl={ ( value ) => this.setState( { titlePaddingControl: value } ) }
									min={ 0 }
									max={ ( titlePaddingType === 'em' || titlePaddingType === 'rem' ? 12 : 200 ) }
									step={ ( titlePaddingType === 'em' || titlePaddingType === 'rem' ? 0.1 : 1 ) }
									unit={ titlePaddingType }
									units={ [ 'px', 'em', 'rem', '%' ] }
									onUnit={ ( value ) => setAttributes( { titlePaddingType: value } ) }
								/>
								<ResponsiveMeasurementControls
									label={ __( 'Title Margin', 'kadence-blocks' ) }
									value={ titleMargin }
									control={ titleMarginControl }
									tabletValue={ titleTabletMargin }
									mobileValue={ titleMobileMargin }
									onChange={ ( value ) => setAttributes( { titleMargin: value } ) }
									onChangeTablet={ ( value ) => setAttributes( { titleTabletMargin: value } ) }
									onChangeMobile={ ( value ) => setAttributes( { titleMobileMargin: value } ) }
									onChangeControl={ ( value ) => this.setState( { titleMarginControl: value } ) }
									min={ ( titleMarginType === 'em' || titleMarginType === 'rem' ? -12 : -200 ) }
									max={ ( titleMarginType === 'em' || titleMarginType === 'rem' ? 12 : 200 ) }
									step={  ( titleMarginType === 'em' || titleMarginType === 'rem' ? 0.1 : 1 ) }
									unit={ titleMarginType }
									units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
									onUnit={ ( value ) => setAttributes( { titleMarginType: value } ) }
								/>
							</Fragment>
						}
					</KadencePanelBody>

					<KadencePanelBody
						title={ __( 'Number Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						panelName={ 'kb-inspector-number-settings' }
					>
						<PopColorControl
							label={ __( 'Number Color', 'kadence-blocks' ) }
							value={ ( numberColor ? numberColor : '' ) }
							default={ '' }
							onChange={ value => setAttributes( { numberColor: value } ) }
						/>
						<ResponsiveAlignControls
							label={ __( 'Text Alignment', 'kadence-blocks' ) }
							value={ ( numberAlign && numberAlign[ 0 ] ? numberAlign[ 0 ] : '' ) }
							mobileValue={ ( numberAlign && numberAlign[ 2 ] ? numberAlign[ 2 ] : '' ) }
							tabletValue={ ( numberAlign && numberAlign[ 1 ] ? numberAlign[ 1 ] : '' ) }
							onChange={ ( nextAlign ) => setAttributes( { numberAlign: [ nextAlign, ( numberAlign && numberAlign[ 1 ] ? numberAlign[ 1 ] : '' ), ( numberAlign && numberAlign[ 2 ] ? numberAlign[ 2 ] : '' ) ] } ) }
							onChangeTablet={ ( nextAlign ) => setAttributes( { numberAlign: [ ( numberAlign && numberAlign[ 0 ] ? numberAlign[ 0 ] : '' ), nextAlign, ( numberAlign && numberAlign[ 2 ] ? numberAlign[ 2 ] : '' ) ] } ) }
							onChangeMobile={ ( nextAlign ) => setAttributes( { numberAlign: [ ( numberAlign && numberAlign[ 0 ] ? numberAlign[ 0 ] : '' ), ( numberAlign && numberAlign[ 1 ] ? numberAlign[ 1 ] : '' ), nextAlign ] } ) }
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
							fontGroup={ 'number' }
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
						/>
						<ResponsiveMeasurementControls
							label={ __( 'Number Padding', 'kadence-blocks' ) }
							value={ numberPadding }
							control={ numberPaddingControl }
							tabletValue={ numberTabletPadding }
							mobileValue={ numberMobilePadding }
							onChange={ ( value ) => setAttributes( { numberPadding: value } ) }
							onChangeTablet={ ( value ) => setAttributes( { numberTabletPadding: value } ) }
							onChangeMobile={ ( value ) => setAttributes( { numberMobilePadding: value } ) }
							onChangeControl={ ( value ) => this.setState( { numberPaddingControl: value } ) }
							min={ 0 }
							max={ ( numberPaddingType === 'em' || numberPaddingType === 'rem' ? 12 : 200 ) }
							step={ ( numberPaddingType === 'em' || numberPaddingType === 'rem' ? 0.1 : 1 ) }
							unit={ numberPaddingType }
							units={ [ 'px', 'em', 'rem', '%' ] }
							onUnit={ ( value ) => setAttributes( { numberPaddingType: value } ) }
						/>
						<ResponsiveMeasurementControls
							label={ __( 'Number Margin', 'kadence-blocks' ) }
							value={ numberMargin }
							control={ numberMarginControl }
							tabletValue={ numberTabletMargin }
							mobileValue={ numberMobileMargin }
							onChange={ ( value ) => setAttributes( { numberMargin: value } ) }
							onChangeTablet={ ( value ) => setAttributes( { numberTabletMargin: value } ) }
							onChangeMobile={ ( value ) => setAttributes( { numberMobileMargin: value } ) }
							onChangeControl={ ( value ) => this.setState( { numberMarginControl: value } ) }
							min={ ( numberMarginType === 'em' || numberMarginType === 'rem' ? -12 : -200 ) }
							max={ ( numberMarginType === 'em' || numberMarginType === 'rem' ? 12 : 200 ) }
							step={  ( numberMarginType === 'em' || numberMarginType === 'rem' ? 0.1 : 1 ) }
							unit={ numberMarginType }
							units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
							onUnit={ ( value ) => setAttributes( { numberMarginType: value } ) }
						/>
					</KadencePanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export default Inspector;
