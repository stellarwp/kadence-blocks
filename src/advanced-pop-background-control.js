/**
 * Advanced Color Control.
 *
 */

/**
 * Import Icons
 */
import cIcons from './kadence-color-icons';
import KadenceColorPicker from './kadence-color-picker';
import { hexToRGBA } from '@kadence/helpers';
import get from 'lodash/get';
import map from 'lodash/map';

/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
import { MediaUpload } from '@wordpress/block-editor';
const {
	Button,
	Popover,
	ColorIndicator,
	Tooltip,
	Dashicon,
	ButtonGroup,
	ToggleControl,
	FocalPointPicker,
	TabPanel,
} = wp.components;
import { withSelect } from '@wordpress/data';
/* global kadence_blocks_params */
// eslint-disable-next-line camelcase
const isKadenceT = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.isKadenceT ? true : false );
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class AdvancedPopBackgroundControl extends Component {
	constructor() {
		super( ...arguments );
		this.onChangeState = this.onChangeState.bind( this );
		this.onChangeComplete = this.onChangeComplete.bind( this );
		this.onPositionChange = this.onPositionChange.bind( this );
		this.state = {
			alpha: false === this.props.alpha ? false : true,
			isVisible: false,
			colors: [],
			position: {},
			classSat: 'first',
			currentColor: '',
			currentOpacity: this.props.opacityValue !== undefined ? this.props.opacityValue : 1,
			isPalette: ( ( isKadenceT && this.props.colorValue && this.props.colorValue.startsWith( 'palette' ) ) || ( isKadenceT && this.props.colorDefault && this.props.colorDefault.startsWith( 'palette' ) ) ? true : false ),
		};
	}
	convertPosition( position ) {
		if ( ! position ) {
			return { x: 0.5, y: 0.5 }
		}
		let positionX = 0.5;
		let positionY = 0.5;
		const positionArray = position.split(" ");
		console.log( positionArray );
		if ( positionArray && positionArray[0] ) {
			switch ( positionArray[0] ) {
				case 'left':
					positionX = 0;
					break;
				case 'right':
					positionX = 1;
					break;
				case 'center':
					positionX = 0.5;
					break;
				default:
					positionX = parseInt( positionArray[0], 10 ) / 100;
					break;
			}
		}
		if ( positionArray && positionArray[ 1 ] ) {
			switch ( positionArray[ 1 ] ) {
				case 'top':
					positionY = 0;
					break;
				case 'bottom':
					positionY = 1;
					break;
				case 'center':
					positionY = 0.5;
					break;
				default:
					positionY = parseInt( positionArray[ 1 ], 10 ) / 100;
					break;
			}
		}
		return { x: { positionX }, y: { positionY } }
	}
	onPositionChange( position ) {
		this.setState( { position: position } );
		let focalPoint;
		console.log( position );
		if ( position && position.x ) {
			focalPoint = position.x * 100 + '% ' + position.y * 100 + '%';
		}
		console.log( focalPoint );
		this.props.onImagePosition( focalPoint );
	}
	render() {
		const toggleVisible = () => {
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			if ( this.state.isVisible === true ) {
				this.setState( { isVisible: false } );
			}
		};
		let currentColorString = ( this.state.isPalette && this.props.colors && this.props.colors[ parseInt( this.props.colorValue.slice( -1 ), 10 ) - 1 ] ? this.props.colors[ parseInt( this.props.colorValue.slice( -1 ), 10 ) - 1 ].color : this.props.colorValue );
		if ( '' === currentColorString ) {
			currentColorString = this.props.colorDefault;
		}
		if ( this.props.onOpacityChange && ! this.state.isPalette ) {
			currentColorString = hexToRGBA( currentColorString, ( this.props.opacityValue !== undefined ? this.props.opacityValue : 1 ) );
		}
		const defaultParams = {
			responsive: [ 'mobile', 'tablet', 'desktop' ],
			repeat: {
				'no-repeat': {
					name: __( 'No Repeat', 'kadence-blocks' ),
				},
				'repeat': {
					name: __( 'Repeat', 'kadence-blocks' ),
				},
				'repeat-x': {
					name: __( 'Repeat-X', 'kadence-blocks' ),
				},
				'repeat-y': {
					name: __( 'Repeat-y', 'kadence-blocks' ),
				},
			},
			size: {
				auto: {
					name: __( 'Auto', 'kadence-blocks' ),
				},
				cover: {
					name: __( 'Cover', 'kadence-blocks' ),
				},
				contain: {
					name: __( 'Contain', 'kadence-blocks' ),
				},
			},
			attachment: {
				scroll: {
					name: __( 'Scroll', 'kadence-blocks' ),
				},
				fixed: {
					name: __( 'Fixed', 'kadence-blocks' ),
				},
			},
		};
		const getRadioClassName = ( item, control ) => {
			let itemClass = 'radio-' + item;
			return itemClass;
		}
		const initialTab = ( this.props.imageValue || this.props.imageValueURL ? 'image' : 'color' );
		const tabOptions = [
			{
				name: 'color',
				title: __( 'Color', 'kadence-blocks' ),
				className: 'kadence-color-background',
			},
			{
				name: 'image',
				title: __( 'Image', 'kadence-blocks' ),
				className: 'kadence-image-background',
			},
		];
		const imagePosition = this.state.position ? this.state.position : this.convertPosition( this.props.imagePosition );
		return (
			<div className="kt-color-popover-container new-kadence-advanced-colors">
				<div className="kt-advanced-color-settings-container">
					{ this.props.label && (
						<h2 className="kt-beside-color-label">{ this.props.label }</h2>
					) }
					{ this.props.colorValue && this.props.colorValue !== this.props.colorDefault && (
						<Tooltip text={ __( 'Clear' ) }>
							<Button
								className="components-color-palette__clear"
								type="button"
								onClick={ () => {
									this.setState( { currentColor: this.props.colorDefault, isPalette: ( isKadenceT && this.props.colorDefault && this.props.colorDefault.startsWith( 'palette' ) ? true : false ) } );
									this.props.onColorChange( undefined );
									if ( this.props.onColorClassChange ) {
										this.props.onColorClassChange( '' );
									}
								} }
								isSmall
							>
								<Dashicon icon="redo" />
							</Button>
						</Tooltip>
					) }
					<div className="kt-beside-color-click">
						{ this.state.isVisible && (
							<Popover position="top left" className="kt-popover-color new-kadence-advanced-colors-pop" onClose={ toggleClose }>
								<TabPanel className="kadence-popover-tabs kadence-background-tabs"
									activeClass="active-tab"
									initialTabName={ initialTab }
									tabs={ tabOptions }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'image' === tab.name ) {
													tabout = (
														<Fragment>
															<MediaUpload
																onSelect={ this.props.onSelectImage }
																type="image"
																value={ ( this.props.imageValue ? this.props.imageValue : '' ) }
																render={ ( { open } ) => (
																	<Button
																		className={ 'components-button components-icon-button kt-cta-upload-btn' }
																		onClick={ open }
																	>
																		{ __( 'Select Image', 'kadence-blocks' ) }
																	</Button>
																) }
															/>
															{ this.props.imageValueURL && (
																<Fragment>
																	<Tooltip text={ __( 'Remove Image', 'kadence-blocks' ) }>
																		<Button
																			className={ 'components-button components-icon-button kt-remove-img kt-cta-upload-btn' }
																			onClick={ this.props.onRemoveImage }
																			icon="no-alt"
																		/>
																	</Tooltip>
																	{ this.props.imageValueURL && (
																		<Fragment>
																			<FocalPointPicker
																				url={ this.props.imageValueURL }
																				value={ imagePosition }
																				onChange={ ( focalPoint ) => this.onPositionChange( focalPoint ) }
																			/>
																		</Fragment>
																	) }
																</Fragment>
															) }
															{/* <span className="customize-control-title">{ __( 'Background Repeat', 'kadence' ) }</span>
															<ButtonGroup className="kadence-radio-container-control">
																{ Object.keys( defaultParams.repeat ).map( ( item ) => {
																	return (
																		<Button
																			key={ item }
																			isTertiary
																			className={ getRadioClassName( item, 'repeat' ) }
																			onClick={ () => {
																				let value = this.state.value;
																				if ( undefined === value[ this.state.currentDevice ] ) {
																					value[ this.state.currentDevice ] = {};
																				}
																				if ( undefined === value[ this.state.currentDevice ].image ) {
																					value[ this.state.currentDevice ].image = {};
																				}
																				if ( undefined === value[ this.state.currentDevice ].image.repeat ) {
																					value[ this.state.currentDevice ].image.repeat = '';
																				}
																				value[ this.state.currentDevice ].image.repeat = item;
																				this.updateValues( value );
																			} }
																		>
																			{ defaultParams.repeat[ item ].name && (
																				defaultParams.repeat[ item ].name
																			) }
																		</Button>
																	);
																} ) }
															</ButtonGroup>
															<span className="customize-control-title">{ __( 'Background Size', 'kadence' ) }</span>
															<ButtonGroup className="kadence-radio-container-control">
																{ Object.keys( defaultParams.size ).map( ( item ) => {
																	return (
																		<Button
																			key={ item }
																			isTertiary
																			className={ getRadioClassName( item, this.state.currentDevice, 'size' ) }
																			onClick={ () => {
																				let value = this.state.value;
																				if ( undefined === value[ this.state.currentDevice ] ) {
																					value[ this.state.currentDevice ] = {};
																				}
																				if ( undefined === value[ this.state.currentDevice ].image ) {
																					value[ this.state.currentDevice ].image = {};
																				}
																				if ( undefined === value[ this.state.currentDevice ].image.size ) {
																					value[ this.state.currentDevice ].image.size = '';
																				}
																				value[ this.state.currentDevice ].image.size = item;
																				this.updateValues( value );
																			} }
																		>
																			{ defaultParams.size[ item ].name && (
																				defaultParams.size[ item ].name
																			) }
																		</Button>
																	);
																} ) }
															</ButtonGroup>
															<span className="customize-control-title">{ __( 'Background Attachment', 'kadence' ) }</span>
															<ButtonGroup className="kadence-radio-container-control">
																{ Object.keys( defaultParams.attachment ).map( ( item ) => {
																	return (
																		<Button
																			isTertiary
																			key={ item }
																			className={ getRadioClassName( item, this.state.currentDevice, 'attachment' ) }
																			onClick={ () => {
																				let value = this.state.value;
																				if ( undefined === value[ this.state.currentDevice ] ) {
																					value[ this.state.currentDevice ] = {};
																				}
																				if ( undefined === value[ this.state.currentDevice ].image ) {
																					value[ this.state.currentDevice ].image = {};
																				}
																				if ( undefined === value[ this.state.currentDevice ].image.attachment ) {
																					value[ this.state.currentDevice ].image.attachment = '';
																				}
																				value[ this.state.currentDevice ].image.attachment = item;
																				this.updateValues( value );
																			} }
																		>
																			{ defaultParams.attachment[ item ].name && (
																				defaultParams.attachment[ item ].name
																			) }
																		</Button>
																	);
																} ) }
															</ButtonGroup> */}
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															{ this.state.classSat === 'first' && ! this.props.disableCustomColors && (
																<KadenceColorPicker
																	color={ currentColorString }
																	onChange={ ( color ) => this.onChangeState( color, '' ) }
																	onChangeComplete={ ( color ) => {
																		this.onChangeComplete( color, '' );
																		if ( this.props.onColorClassChange ) {
																			this.props.onColorClassChange( '' );
																		}
																	} }
																/>
															) }
															{ this.state.classSat !== 'first' && ! this.props.disableCustomColors && (
																<KadenceColorPicker
																	color={ currentColorString }
																	onChange={ ( color ) => this.onChangeState( color, '' ) }
																	onChangeComplete={ ( color ) => {
																		this.onChangeComplete( color, '' );
																		if ( this.props.onColorClassChange ) {
																			this.props.onColorClassChange( '' );
																		}
																	} }
																/>
															) }
															{ this.props.colors && (
																<div className="components-color-palette">
																	{ map( this.props.colors, ( { color, slug, name } ) => {
																		const style = { color };
																		const palette = slug.replace( 'theme-', '' );
																		const isActive = ( ( isKadenceT && palette === this.props.colorValue ) || ( ! slug.startsWith( 'theme-palette' ) && this.props.colorValue === color ) );
																		return (
																			<div key={ color } className="components-color-palette__item-wrapper">
																				<Tooltip
																					text={ name ||
																						// translators: %s: color hex code e.g: "#f00".
																						sprintf( __( 'Color code: %s' ), color )
																					}>
																					<Button
																						type="button"
																						className={ `components-color-palette__item ${ ( isActive ? 'is-active' : '' ) }` }
																						style={ style }
																						onClick={ () => {
																							if ( isKadenceT && slug.startsWith( 'theme-palette' ) ) {
																								this.onChangeComplete( color, palette );
																							} else {
																								this.onChangeComplete( color, false );
																							}
																							if ( this.props.onColorClassChange ) {
																								this.props.onColorClassChange( slug );
																							}
																							if ( 'first' === this.state.classSat ) {
																								this.setState( { classSat: 'second' } );
																							} else {
																								this.setState( { classSat: 'first' } );
																							}
																						} }
																						aria-label={ name ?
																							// translators: %s: The name of the color e.g: "vivid red".
																							sprintf( __( 'Color: %s' ), name ) :
																							// translators: %s: color hex code e.g: "#f00".
																							sprintf( __( 'Color code: %s' ), color ) }
																						aria-pressed={ isActive }
																					/>
																				</Tooltip>
																				{ isKadenceT && palette === this.props.colorValue && <Dashicon icon="admin-site" /> }
																				{ ! slug.startsWith( 'theme-palette' ) && this.props.colorValue === color && <Dashicon icon="saved" /> }
																			</div>
																		);
																	} ) }
																</div>
															) }
														</Fragment>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</Popover>
						) }
						{ this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.state.alpha ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleClose }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ currentColorString } />
									{ '' === currentColorString && (
										<span className="color-indicator-icon">{ cIcons.inherit }</span>
									) }
									{ this.state.isPalette && (
										<span className="color-indicator-icon">{ <Dashicon icon="admin-site" /> }</span>
									) }
								</Button>
							</Tooltip>
						) }
						{ ! this.state.isVisible && (
							<Tooltip text={ __( 'Select Color' ) }>
								<Button className={ `kt-color-icon-indicate ${ ( this.state.alpha ? 'kt-has-alpha' : 'kt-no-alpha' ) }` } onClick={ toggleVisible }>
									<ColorIndicator className="kt-advanced-color-indicate" colorValue={ currentColorString } />
									{ '' === currentColorString && (
										<span className="color-indicator-icon">{ cIcons.inherit }</span>
									) }
									{ this.state.isPalette && (
										<span className="color-indicator-icon">{ <Dashicon icon="admin-site" /> }</span>
									) }
								</Button>
							</Tooltip>
						) }
					</div>
				</div>
			</div>
		);
	}
	onChangeState( color, palette ) {
		let opacity = 1;
		let newColor;
		if ( palette ) {
			newColor = palette;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			if ( this.props.onOpacityChange ) {
				newColor = color.hex;
				opacity = color.rgb.a;
			} else {
				newColor = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
			}
		} else if ( undefined !== color.hex ) {
			newColor = color.hex;
		} else {
			newColor = color;
		}
		this.setState( { currentColor: newColor, currentOpacity: opacity, isPalette: ( palette ? true : false ) } );
		if ( undefined !== this.props.onChange ) {
			this.props.onChange( newColor );
		}
	}
	onChangeComplete( color, palette ) {
		let opacity = 1;
		let newColor;
		if ( palette ) {
			newColor = palette;
		} else if ( undefined !== color.rgb && undefined !== color.rgb.a && 1 !== color.rgb.a ) {
			if ( this.props.onOpacityChange ) {
				newColor = color.hex;
				opacity = color.rgb.a;
			} else {
				newColor = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
			}
		} else if ( undefined !== color.hex ) {
			newColor = color.hex;
		} else {
			newColor = color;
		}
		this.setState( { currentColor: newColor, currentOpacity: opacity, isPalette: ( palette ? true : false ) } );
		this.props.onColorChange( newColor );
		if ( undefined !== this.props.onOpacityChange ) {
			this.props.onOpacityChange( opacity );
		}
	}
}
export default withSelect( ( select, ownProps ) => {
	const settings = select( 'core/block-editor' ).getSettings();
	const colors = get( settings, [ 'colors' ], [] );
	const disableCustomColors = ownProps.disableCustomColors === undefined ? settings.disableCustomColors : ownProps.disableCustomColors;
	return {
		colors,
		disableCustomColors,
	};
} )( AdvancedPopBackgroundControl );
