import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { applyFilters } from '@wordpress/hooks';
import {
	MeasurementControls,
	TypographyControls,
	KadencePanelBody,
	PopColorControl,
	BoxShadowControl,
} from '@kadence/components';

import {
	Dashicon,
	TabPanel,
	SelectControl,
	ButtonGroup,
	Button,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ColumnWidth } from '../../../components';

export default function SubmitButtonStyles( { setAttributes, saveSubmit, submit, submitMargin, submitFont, submitLabel } ) {

	const btnSizes = [
		{ key: 'small', name: __( 'S', 'kadence-blocks' ) },
		{ key: 'standard', name: __( 'M', 'kadence-blocks' ) },
		{ key: 'large', name: __( 'L', 'kadence-blocks' ) },
		{ key: 'custom', name: <Dashicon icon="admin-generic"/> },
	];

	const btnWidths = [
		{ key: 'auto', name: __( 'Auto' ) },
		{ key: 'fixed', name: __( 'Fixed' ) },
		{ key: 'full', name: __( 'Full' ) },
	];

	const marginTypes = [
		{ key: 'px', name: 'px' },
		{ key: 'em', name: 'em' },
		{ key: '%', name: '%' },
		{ key: 'vh', name: 'vh' },
		{ key: 'rem', name: 'rem' },
	];

	const bgType = [
		{ key: 'solid', name: __( 'Solid', 'kadence-blocks' ) },
		{ key: 'gradient', name: __( 'Gradient', 'kadence-blocks' ) },
	];

	const gradTypes = [
		{ key: 'linear', name: __( 'Linear' ) },
		{ key: 'radial', name: __( 'Radial' ) },
	];

	const [ submitBorderControl, setSubmitBorderControl ] = useState( 'linked' );
	const [ submitMobilePaddingControl, setSubmitMobilePaddingControl ] = useState( 'linked' );
	const [ submitTabletPaddingControl, setSubmitTabletPaddingControl ] = useState( 'linked' );
	const [ submitDeskPaddingControl, setSubmitDeskPaddingControl ] = useState( 'linked' );

	const marginUnit = ( undefined !== submitMargin && undefined !== submitMargin && submitMargin.unit ? submitMargin.unit : 'px' );
	const marginMin = ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -100 );
	const marginMax = ( marginUnit === 'em' || marginUnit === 'rem' ? 12 : 100 );
	const marginStep = ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 );

	const saveSubmitMargin = ( value ) => {
		setAttributes( { submitMargin: { ...submitMargin, ...value } } );
	};

	const saveSubmitGradient = ( value, index ) => {

		const newItems = submit.gradient.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );

		setAttributes( { gradient: newItems } );
	};

	const saveSubmitGradientHover = ( value, index ) => {

		const newItems = submit.gradientHover.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );

		setAttributes( { gradientHover: newItems } );
	};

	const saveSubmitFont = ( value ) => {
		setAttributes( {
			submitFont: { ...submitFont, ...value },
		} );
	};

	const saveSubmitBoxShadowHover = ( value, index ) => {

		const newItems = submit.boxShadowHover.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		setAttributes( { boxShadowHover: newItems } );
	};

	const saveSubmitBoxShadow = ( value, index ) => {
		const newItems = submit.boxShadow.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );

		saveSubmit( { boxShadow: newItems } );
	};

	return (
		<>
			<h2 className="kt-heading-size-title kt-secondary-color-size">{__( 'Column Width', 'kadence-blocks' )}</h2>

			<ColumnWidth saveSubmit={saveSubmit} width={submit.width}/>

			<div className="kt-btn-size-settings-container">
				<h2 className="kt-beside-btn-group">{__( 'Button Size' )}</h2>
				<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Button Size', 'kadence-blocks' )}>
					{map( btnSizes, ( { name, key } ) => (
						<Button
							key={key}
							className="kt-btn-size-btn"
							isSmall
							isPrimary={submit.size === key}
							aria-pressed={submit.size === key}
							onClick={() => saveSubmit( { size: key } )}
						>
							{name}
						</Button>
					) )}
				</ButtonGroup>
			</div>
			{'custom' === submit.size && (
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
											<Fragment>
												<MeasurementControls
													label={__( 'Mobile Padding', 'kadence-blocks' )}
													measurement={submit.mobilePadding}
													control={submitMobilePaddingControl}
													onChange={( value ) => saveSubmit( { mobilePadding: value } )}
													onControl={( value ) => setSubmitMobilePaddingControl( value )}
													min={0}
													max={100}
													step={1}
												/>
											</Fragment>
										);
									} else if ( 'tablet' === tab.name ) {
										tabout = (
											<MeasurementControls
												label={__( 'Tablet Padding', 'kadence-blocks' )}
												measurement={submit.tabletPadding}
												control={submitTabletPaddingControl}
												onChange={( value ) => saveSubmit( { tabletPadding: value } )}
												onControl={( value ) => setSubmitTabletPaddingControl( value )}
												min={0}
												max={100}
												step={1}
											/>
										);
									} else {
										tabout = (
											<MeasurementControls
												label={__( 'Desktop Padding', 'kadence-blocks' )}
												measurement={submit.deskPadding}
												control={submitDeskPaddingControl}
												onChange={( value ) => saveSubmit( { deskPadding: value } )}
												onControl={( value ) => setSubmitDeskPaddingControl( value )}
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
			<div className="kt-btn-size-settings-container">
				<h2 className="kt-beside-btn-group">{__( 'Button Width' )}</h2>
				<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Button Width' )}>
					{map( btnWidths, ( { name, key } ) => (
						<Button
							key={key}
							className="kt-btn-size-btn"
							isSmall
							isPrimary={submit.widthType === key}
							aria-pressed={submit.widthType === key}
							onClick={() => saveSubmit( { widthType: key } )}
						>
							{name}
						</Button>
					) )}
				</ButtonGroup>
			</div>
			{'fixed' === submit.widthType && (
				<div className="kt-inner-sub-section">
					<h2 className="kt-heading-size-title kt-secondary-color-size">{__( 'Fixed Width' )}</h2>
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
											<Fragment>
												<RangeControl
													value={( submit.fixedWidth && undefined !== submit.fixedWidth[ 2 ] ? submit.fixedWidth[ 2 ] : undefined )}
													onChange={value => {
														saveSubmit( { fixedWidth: [ ( undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 0 ] ? submit.fixedWidth[ 0 ] : '' ), ( undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 1 ] ? submit.fixedWidth[ 1 ] : '' ), value ] } );
													}}
													min={10}
													max={500}
												/>
											</Fragment>
										);
									} else if ( 'tablet' === tab.name ) {
										tabout = (
											<Fragment>
												<RangeControl
													value={( submit.fixedWidth && undefined !== submit.fixedWidth[ 1 ] ? submit.fixedWidth[ 1 ] : undefined )}
													onChange={value => {
														saveSubmit( { fixedWidth: [ ( undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 0 ] ? submit.fixedWidth[ 0 ] : '' ), value, ( undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 2 ] ? submit.fixedWidth[ 2 ] : '' ) ] } );
													}}
													min={10}
													max={500}
												/>
											</Fragment>
										);
									} else {
										tabout = (
											<Fragment>
												<RangeControl
													value={( submit.fixedWidth && undefined !== submit.fixedWidth[ 0 ] ? submit.fixedWidth[ 0 ] : undefined )}
													onChange={value => {
														saveSubmit( { fixedWidth: [ value, ( undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 1 ] ? submit.fixedWidth[ 1 ] : '' ), ( undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 2 ] ? submit.fixedWidth[ 2 ] : '' ) ] } );
													}}
													min={10}
													max={500}
												/>
											</Fragment>
										);
									}
								}
								return <div className={tab.className} key={tab.className}>{tabout}</div>;
							}
						}
					</TabPanel>
				</div>
			)}

			<h2 className="kt-heading-size-title kt-secondary-color-size">{__( 'Button Colors', 'kadence-blocks' )}</h2>

			<br/>

			<TabPanel className="kt-inspect-tabs kt-hover-tabs"
					  activeClass="active-tab"
					  tabs={[
						  {
							  name     : 'normal',
							  title    : __( 'Normal', 'kadence-blocks' ),
							  className: 'kt-normal-tab',
						  },
						  {
							  name     : 'hover',
							  title    : __( 'Hover', 'kadence-blocks' ),
							  className: 'kt-hover-tab',
						  },
					  ]}>
				{
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							if ( 'hover' === tab.name ) {
								tabout = (
									<Fragment>
										<PopColorControl
											label={__( 'Text Hover Color', 'kadence-blocks' )}
											value={( submit.colorHover ? submit.colorHover : '' )}
											default={''}
											onChange={value => {
												saveSubmit( { colorHover: value } );
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
														isPrimary={( undefined !== submit.backgroundHoverType ? submit.backgroundHoverType : 'solid' ) === key}
														aria-pressed={( undefined !== submit.backgroundHoverType ? submit.backgroundHoverType : 'solid' ) === key}
														onClick={() => saveSubmit( { backgroundHoverType: key } )}
													>
														{name}
													</Button>
												) )}
											</ButtonGroup>
										</div>
										{'gradient' !== submit.backgroundHoverType && (
											<div className="kt-inner-sub-section">
												<PopColorControl
													label={__( 'Button Hover Background', 'kadence-blocks' )}
													value={( submit.backgroundHover ? submit.backgroundHover : '' )}
													default={''}
													onChange={value => {
														saveSubmit( { backgroundHover: value } );
													}}
													opacityValue={submit.backgroundHoverOpacity}
													onOpacityChange={value => saveSubmit( { backgroundHoverOpacity: value } )}
													onArrayChange={( color, opacity ) => saveSubmit( { backgroundHover: color, backgroundHoverOpacity: opacity } )}
												/>
											</div>
										)}
										{'gradient' === submit.backgroundHoverType && (
											<div className="kt-inner-sub-section">
												<PopColorControl
													label={__( 'Gradient Color 1', 'kadence-blocks' )}
													value={( submit.backgroundHover ? submit.backgroundHover : '' )}
													default={''}
													onChange={value => {
														saveSubmit( { backgroundHover: value } );
													}}
													opacityValue={submit.backgroundHoverOpacity}
													onOpacityChange={value => saveSubmit( { backgroundHoverOpacity: value } )}
													onArrayChange={( color, opacity ) => saveSubmit( { backgroundHover: color, backgroundHoverOpacity: opacity } )}
												/>
												<RangeControl
													label={__( 'Location', 'kadence-blocks' )}
													value={( submit.gradientHover && undefined !== submit.gradientHover[ 2 ] ? submit.gradientHover[ 2 ] : 0 )}
													onChange={( value ) => {
														saveSubmitGradientHover( value, 2 );
													}}
													min={0}
													max={100}
												/>
												<PopColorControl
													label={__( 'Gradient Color 2', 'kadence-blocks' )}
													value={( submit.gradientHover && undefined !== submit.gradientHover[ 0 ] ? submit.gradientHover[ 0 ] : '#999999' )}
													default={'#999999'}
													opacityValue={( submit.gradientHover && undefined !== submit.gradientHover[ 1 ] ? submit.gradientHover[ 1 ] : 1 )}
													onChange={value => {
														saveSubmitGradientHover( value, 0 );
													}}
													onOpacityChange={value => {
														saveSubmitGradientHover( value, 1 );
													}}
												/>
												<RangeControl
													label={__( 'Location' )}
													value={( submit.gradientHover && undefined !== submit.gradientHover[ 3 ] ? submit.gradientHover[ 3 ] : 100 )}
													onChange={( value ) => {
														saveSubmitGradientHover( value, 3 );
													}}
													min={0}
													max={100}
												/>
												<div className="kt-btn-size-settings-container">
													<h2 className="kt-beside-btn-group">{__( 'Gradient Type', 'kadence-blocks' )}</h2>
													<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Gradient Type', 'kadence-blocks' )}>
														{map( gradTypes, ( { name, key } ) => (
															<Button
																key={key}
																className="kt-btn-size-btn"
																isSmall
																isPrimary={( submit.gradientHover && undefined !== submit.gradientHover[ 4 ] ? submit.gradientHover[ 4 ] : 'linear' ) === key}
																aria-pressed={( submit.gradientHover && undefined !== submit.gradientHover[ 4 ] ? submit.gradientHover[ 4 ] : 'linear' ) === key}
																onClick={() => {
																	saveSubmitGradientHover( key, 4 );
																}}
															>
																{name}
															</Button>
														) )}
													</ButtonGroup>
												</div>
												{'radial' !== ( submit.gradientHover && undefined !== submit.gradientHover[ 4 ] ? submit.gradientHover[ 4 ] : 'linear' ) && (
													<RangeControl
														label={__( 'Gradient Angle', 'kadence-blocks' )}
														value={( submit.gradientHover && undefined !== submit.gradientHover[ 5 ] ? submit.gradientHover[ 5 ] : 180 )}
														onChange={( value ) => {
															saveSubmitGradientHover( value, 5 );
														}}
														min={0}
														max={360}
													/>
												)}
												{'radial' === ( submit.gradientHover && undefined !== submit.gradientHover[ 4 ] ? submit.gradientHover[ 4 ] : 'linear' ) && (
													<SelectControl
														label={__( 'Gradient Position', 'kadence-blocks' )}
														value={( submit.gradientHover && undefined !== submit.gradientHover[ 6 ] ? submit.gradientHover[ 6 ] : 'center center' )}
														options={[
															{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
															{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
															{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
															{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
															{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
															{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
															{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
															{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
															{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
														]}
														onChange={value => {
															saveSubmitGradientHover( value, 6 );
														}}
													/>
												)}
											</div>
										)}
										<PopColorControl
											label={__( 'Button Hover Border', 'kadence-blocks' )}
											value={( submit.borderHover ? submit.borderHover : '' )}
											default={''}
											onChange={value => {
												saveSubmit( { borderHover: value } );
											}}
											opacityValue={submit.borderHoverOpacity}
											onOpacityChange={value => saveSubmit( { borderHoverOpacity: value } )}
											onArrayChange={( color, opacity ) => saveSubmit( { borderHover: color, borderHoverOpacity: opacity } )}
										/>
										<BoxShadowControl
											label={__( 'Button Hover Box Shadow', 'kadence-blocks' )}
											enable={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 0 ] ? submit.boxShadowHover[ 0 ] : false )}
											color={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 1 ] ? submit.boxShadowHover[ 1 ] : '#000000' )}
											default={'#000000'}
											opacity={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 2 ] ? submit.boxShadowHover[ 2 ] : 0.4 )}
											hOffset={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 3 ] ? submit.boxShadowHover[ 3 ] : 2 )}
											vOffset={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 4 ] ? submit.boxShadowHover[ 4 ] : 2 )}
											blur={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 5 ] ? submit.boxShadowHover[ 5 ] : 3 )}
											spread={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 6 ] ? submit.boxShadowHover[ 6 ] : 0 )}
											inset={( undefined !== submit.boxShadowHover && undefined !== submit.boxShadowHover[ 7 ] ? submit.boxShadowHover[ 7 ] : false )}
											onEnableChange={value => {
												saveSubmitBoxShadowHover( value, 0 );
											}}
											onColorChange={value => {
												saveSubmitBoxShadowHover( value, 1 );
											}}
											onOpacityChange={value => {
												saveSubmitBoxShadowHover( value, 2 );
											}}
											onHOffsetChange={value => {
												saveSubmitBoxShadowHover( value, 3 );
											}}
											onVOffsetChange={value => {
												saveSubmitBoxShadowHover( value, 4 );
											}}
											onBlurChange={value => {
												saveSubmitBoxShadowHover( value, 5 );
											}}
											onSpreadChange={value => {
												saveSubmitBoxShadowHover( value, 6 );
											}}
											onInsetChange={value => {
												saveSubmitBoxShadowHover( value, 7 );
											}}
										/>
									</Fragment>
								);
							} else {
								tabout = (
									<Fragment>
										<PopColorControl
											label={__( 'Text Color', 'kadence-blocks' )}
											value={( submit.color ? submit.color : '' )}
											default={''}
											onChange={value => {
												saveSubmit( { color: value } );
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
														isPrimary={( undefined !== submit.backgroundType ? submit.backgroundType : 'solid' ) === key}
														aria-pressed={( undefined !== submit.backgroundType ? submit.backgroundType : 'solid' ) === key}
														onClick={() => saveSubmit( { backgroundType: key } )}
													>
														{name}
													</Button>
												) )}
											</ButtonGroup>
										</div>
										{'gradient' !== submit.backgroundType && (
											<div className="kt-inner-sub-section">
												<PopColorControl
													label={__( 'Button Background', 'kadence-blocks' )}
													value={( submit.background ? submit.background : '' )}
													default={''}
													onChange={value => {
														saveSubmit( { background: value } );
													}}
													opacityValue={submit.backgroundOpacity}
													onOpacityChange={value => saveSubmit( { backgroundOpacity: value } )}
													onArrayChange={( color, opacity ) => saveSubmit( { background: color, backgroundOpacity: opacity } )}
												/>
											</div>
										)}
										{'gradient' === submit.backgroundType && (
											<div className="kt-inner-sub-section">
												<PopColorControl
													label={__( 'Gradient Color 1', 'kadence-blocks' )}
													value={( submit.background ? submit.background : '' )}
													default={''}
													onChange={value => {
														saveSubmit( { background: value } );
													}}
													opacityValue={submit.backgroundOpacity}
													onOpacityChange={value => saveSubmit( { backgroundOpacity: value } )}
													onArrayChange={( color, opacity ) => saveSubmit( { background: color, backgroundOpacity: opacity } )}
												/>
												<RangeControl
													label={__( 'Location', 'kadence-blocks' )}
													value={( submit.gradient && undefined !== submit.gradient[ 2 ] ? submit.gradient[ 2 ] : 0 )}
													onChange={( value ) => {
														saveSubmitGradient( value, 2 );
													}}
													min={0}
													max={100}
												/>
												<PopColorControl
													label={__( 'Gradient Color 2', 'kadence-blocks' )}
													value={( submit.gradient && undefined !== submit.gradient[ 0 ] ? submit.gradient[ 0 ] : '#999999' )}
													default={'#999999'}
													opacityValue={( submit.gradient && undefined !== submit.gradient[ 1 ] ? submit.gradient[ 1 ] : 1 )}
													onChange={value => {
														saveSubmitGradient( value, 0 );
													}}
													onOpacityChange={value => {
														saveSubmitGradient( value, 1 );
													}}
												/>
												<RangeControl
													label={__( 'Location', 'kadence-blocks' )}
													value={( submit.gradient && undefined !== submit.gradient[ 3 ] ? submit.gradient[ 3 ] : 100 )}
													onChange={( value ) => {
														saveSubmitGradient( value, 3 );
													}}
													min={0}
													max={100}
												/>
												<div className="kt-btn-size-settings-container">
													<h2 className="kt-beside-btn-group">{__( 'Gradient Type', 'kadence-blocks' )}</h2>
													<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Gradient Type', 'kadence-blocks' )}>
														{map( gradTypes, ( { name, key } ) => (
															<Button
																key={key}
																className="kt-btn-size-btn"
																isSmall
																isPrimary={( submit.gradient && undefined !== submit.gradient[ 4 ] ? submit.gradient[ 4 ] : 'linear' ) === key}
																aria-pressed={( submit.gradient && undefined !== submit.gradient[ 4 ] ? submit.gradient[ 4 ] : 'linear' ) === key}
																onClick={() => {
																	saveSubmitGradient( key, 4 );
																}}
															>
																{name}
															</Button>
														) )}
													</ButtonGroup>
												</div>
												{'radial' !== ( submit.gradient && undefined !== submit.gradient[ 4 ] ? submit.gradient[ 4 ] : 'linear' ) && (
													<RangeControl
														label={__( 'Gradient Angle', 'kadence-blocks' )}
														value={( submit.gradient && undefined !== submit.gradient[ 5 ] ? submit.gradient[ 5 ] : 180 )}
														onChange={( value ) => {
															saveSubmitGradient( value, 5 );
														}}
														min={0}
														max={360}
													/>
												)}
												{'radial' === ( submit.gradient && undefined !== submit.gradient[ 4 ] ? submit.gradient[ 4 ] : 'linear' ) && (
													<SelectControl
														label={__( 'Gradient Position', 'kadence-blocks' )}
														value={( submit.gradient && undefined !== submit.gradient[ 6 ] ? submit.gradient[ 6 ] : 'center center' )}
														options={[
															{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
															{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
															{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
															{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
															{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
															{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
															{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
															{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
															{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
														]}
														onChange={value => {
															saveSubmitGradient( value, 6 );
														}}
													/>
												)}
											</div>
										)}
										<PopColorControl
											label={__( 'Button Border', 'kadence-blocks' )}
											value={( submit.border ? submit.border : '' )}
											default={''}
											onChange={value => {
												saveSubmit( { border: value } );
											}}
											opacityValue={submit.borderOpacity}
											onOpacityChange={value => saveSubmit( { borderOpacity: value } )}
											onArrayChange={( color, opacity ) => saveSubmit( { border: color, borderOpacity: opacity } )}
										/>
										<BoxShadowControl
											label={__( 'Button Box Shadow', 'kadence-blocks' )}
											enable={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 0 ] ? submit.boxShadow[ 0 ] : false )}
											color={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 1 ] ? submit.boxShadow[ 1 ] : '#000000' )}
											default={'#000000'}
											opacity={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 2 ] ? submit.boxShadow[ 2 ] : 0.4 )}
											hOffset={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 3 ] ? submit.boxShadow[ 3 ] : 2 )}
											vOffset={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 4 ] ? submit.boxShadow[ 4 ] : 2 )}
											blur={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 5 ] ? submit.boxShadow[ 5 ] : 3 )}
											spread={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 6 ] ? submit.boxShadow[ 6 ] : 0 )}
											inset={( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 7 ] ? submit.boxShadow[ 7 ] : false )}
											onEnableChange={value => {
												saveSubmitBoxShadow( value, 0 );
											}}
											onColorChange={value => {
												saveSubmitBoxShadow( value, 1 );
											}}
											onOpacityChange={value => {
												saveSubmitBoxShadow( value, 2 );
											}}
											onHOffsetChange={value => {
												saveSubmitBoxShadow( value, 3 );
											}}
											onVOffsetChange={value => {
												saveSubmitBoxShadow( value, 4 );
											}}
											onBlurChange={value => {
												saveSubmitBoxShadow( value, 5 );
											}}
											onSpreadChange={value => {
												saveSubmitBoxShadow( value, 6 );
											}}
											onInsetChange={value => {
												saveSubmitBoxShadow( value, 7 );
											}}
										/>
									</Fragment>
								);
							}
						}
						return <div className={tab.className} key={tab.className}>{tabout}</div>;
					}
				}
			</TabPanel>
			<h2>{__( 'Border Settings', 'kadence-blocks' )}</h2>
			<MeasurementControls
				label={__( 'Border Width', 'kadence-blocks' )}
				measurement={submit.borderWidth}
				control={submitBorderControl}
				onChange={( value ) => saveSubmit( { borderWidth: value } )}
				onControl={( value ) => setSubmitBorderControl( value )}
				min={0}
				max={20}
				step={1}
			/>
			<RangeControl
				label={__( 'Border Radius', 'kadence-blocks' )}
				value={submit.borderRadius}
				onChange={value => {
					saveSubmit( { borderRadius: value } );
				}}
				min={0}
				max={50}
			/>
			<TypographyControls
				fontSize={submitFont.size}
				onFontSize={( value ) => saveSubmitFont( { size: value } )}
				fontSizeType={submitFont.sizeType}
				onFontSizeType={( value ) => saveSubmitFont( { sizeType: value } )}
				lineHeight={submitFont.lineHeight}
				onLineHeight={( value ) => saveSubmitFont( { lineHeight: value } )}
				lineHeightType={submitFont.lineType}
				onLineHeightType={( value ) => saveSubmitFont( { lineType: value } )}
			/>
			<KadencePanelBody
				title={__( 'Advanced Button Settings', 'kadence-blocks' )}
				initialOpen={false}
				panelName={'kb-form-advanced-button-settings'}
			>
				<TypographyControls
					letterSpacing={submitFont.letterSpacing}
					onLetterSpacing={( value ) => saveSubmitFont( { letterSpacing: value } )}
					textTransform={submitFont.textTransform}
					onTextTransform={( value ) => saveSubmitFont( { textTransform: value } )}
					fontFamily={submitFont.family}
					onFontFamily={( value ) => saveSubmitFont( { family: value } )}
					onFontChange={( select ) => {
						saveSubmitFont( {
							family: select.value,
							google: select.google,
						} );
					}}
					onFontArrayChange={( values ) => saveSubmitFont( values )}
					googleFont={submitFont.google}
					onGoogleFont={( value ) => saveSubmitFont( { google: value } )}
					loadGoogleFont={submitFont.loadGoogle}
					onLoadGoogleFont={( value ) => saveSubmitFont( { loadGoogle: value } )}
					fontVariant={submitFont.variant}
					onFontVariant={( value ) => saveSubmitFont( { variant: value } )}
					fontWeight={submitFont.weight}
					onFontWeight={( value ) => saveSubmitFont( { weight: value } )}
					fontStyle={submitFont.style}
					onFontStyle={( value ) => saveSubmitFont( { style: value } )}
					fontSubset={submitFont.subset}
					onFontSubset={( value ) => saveSubmitFont( { subset: value } )}
				/>
				<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={__( 'Margin Type', 'kadence-blocks' )}>
					{map( marginTypes, ( { name, key } ) => (
						<Button
							key={key}
							className="kt-size-btn"
							isSmall
							isPrimary={marginUnit === key}
							aria-pressed={marginUnit === key}
							onClick={() => saveSubmitMargin( { unit: key } )}
						>
							{name}
						</Button>
					) )}
				</ButtonGroup>
				<h2 className="kt-heading-size-title kt-secondary-color-size">{__( 'Margin Unit', 'kadence-blocks' )}</h2>
				<h2 className="kt-heading-size-title">{__( 'Margin', 'kadence-blocks' )}</h2>
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
										<Fragment>
											<MeasurementControls
												label={__( 'Mobile Margin', 'kadence-blocks' )}
												measurement={( undefined !== submitMargin && undefined !== submitMargin && submitMargin.mobile ? submitMargin.mobile : [ '', '', '', '' ] )}
												control={( undefined !== submitMargin && undefined !== submitMargin && submitMargin.control ? submitMargin.control : 'linked' )}
												onChange={( value ) => saveSubmitMargin( { mobile: value } )}
												onControl={( value ) => saveSubmitMargin( { control: value } )}
												min={marginMin}
												max={marginMax}
												step={marginStep}
												allowEmpty={true}
											/>
										</Fragment>
									);
								} else if ( 'tablet' === tab.name ) {
									tabout = (
										<Fragment>
											<MeasurementControls
												label={__( 'Tablet Margin', 'kadence-blocks' )}
												measurement={( undefined !== submitMargin && undefined !== submitMargin && submitMargin.tablet ? submitMargin.tablet : [ '', '', '', '' ] )}
												control={( undefined !== submitMargin && undefined !== submitMargin && submitMargin.control ? submitMargin.control : 'linked' )}
												onChange={( value ) => saveSubmitMargin( { tablet: value } )}
												onControl={( value ) => saveSubmitMargin( { control: value } )}
												min={marginMin}
												max={marginMax}
												step={marginStep}
												allowEmpty={true}
											/>
										</Fragment>
									);
								} else {
									tabout = (
										<Fragment>
											<MeasurementControls
												label={__( 'Desktop Margin', 'kadence-blocks' )}
												measurement={( undefined !== submitMargin && undefined !== submitMargin && submitMargin.desk ? submitMargin.desk : [ '', '', '', '' ] )}
												control={( undefined !== submitMargin && undefined !== submitMargin && submitMargin.control ? submitMargin.control : 'linked' )}
												onChange={( value ) => saveSubmitMargin( { desk: value } )}
												onControl={( value ) => saveSubmitMargin( { control: value } )}
												min={marginMin}
												max={marginMax}
												step={marginStep}
												allowEmpty={true}
											/>
										</Fragment>
									);
								}
							}
							return <div className={tab.className} key={tab.className}>{tabout}</div>;
						}
					}
				</TabPanel>
			</KadencePanelBody>

			<TextControl
				label={__( 'Submit aria description', 'kadence-blocks' )}
				help={__( 'Provide more context for screen readers', 'kadence-blocks' )}
				value={( undefined !== submitLabel ? submitLabel : '' )}
				onChange={( value ) => setAttributes( { submitLabel: value } )}
			/>
		</>
	);

}
