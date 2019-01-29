/**
 * BLOCK: Kadence Split Content
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Import Icons
 */
import icons from '../../icons';
import TypographyControls from '../../typography-control';
import MeasurementControls from '../../measurement-control';
import WebfontLoader from '../../fontloader';
import hexToRGBA from '../../hex-to-rgba';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import IcoNames from '../../svgiconsnames';
import FaIco from '../../faicons';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	MediaUpload,
	URLInput,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	ColorPalette,
	BlockControls,
	MediaPlaceholder,
} = wp.editor;
const {
	Button,
	IconButton,
	TabPanel,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
	TextControl,
	ToggleControl,
	SelectControl,
} = wp.components;
/**
 * Build the overlay edit
 */
class KadenceInfoBox extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( this.props.attributes.uniqueID && this.props.attributes.uniqueID !== '_' + this.props.clientId.substr( 2, 9 ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
		if ( this.props.attributes.mediaStyle[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyle[ 0 ].borderWidth[ 1 ] && this.props.attributes.mediaStyle[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyle[ 0 ].borderWidth[ 2 ] && this.props.attributes.mediaStyle[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyle[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { mediaBorderControl: 'linked' } );
		} else {
			this.setState( { mediaBorderControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyle[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyle[ 0 ].padding[ 1 ] && this.props.attributes.mediaStyle[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyle[ 0 ].padding[ 2 ] && this.props.attributes.mediaStyle[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyle[ 0 ].padding[ 3 ] ) {
			this.setState( { mediaPaddingControl: 'linked' } );
		} else {
			this.setState( { mediaPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyle[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyle[ 0 ].margin[ 1 ] && this.props.attributes.mediaStyle[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyle[ 0 ].margin[ 2 ] && this.props.attributes.mediaStyle[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyle[ 0 ].margin[ 3 ] ) {
			this.setState( { mediaMarginControl: 'linked' } );
		} else {
			this.setState( { mediaMarginControl: 'individual' } );
		}
		if ( this.props.attributes.containerBorderWidth[ 0 ] === this.props.attributes.containerBorderWidth[ 1 ] && this.props.attributes.containerBorderWidth[ 0 ] === this.props.attributes.containerBorderWidth[ 2 ] && this.props.attributes.containerBorderWidth[ 0 ] === this.props.attributes.containerBorderWidth[ 3 ] ) {
			this.setState( { containerBorderControl: 'linked' } );
		} else {
			this.setState( { containerBorderControl: 'individual' } );
		}
		if ( this.props.attributes.containerPadding[ 0 ] === this.props.attributes.containerPadding[ 1 ] && this.props.attributes.containerPadding[ 0 ] === this.props.attributes.containerPadding[ 2 ] && this.props.attributes.containerPadding[ 0 ] === this.props.attributes.containerPadding[ 3 ] ) {
			this.setState( { containerPaddingControl: 'linked' } );
		} else {
			this.setState( { containerPaddingControl: 'individual' } );
		}
	}
	render() {
		const { attributes: { uniqueID, link, linkProperty, target, hAlign, containerBackground, containerHoverBackground, containerBorder, containerHoverBorder, containerBorderWidth, containerBorderRadius, containerPadding, mediaType, mediaImage, mediaIcon, mediaStyle, mediaAlign, displayTitle, title, titleColor, titleHoverColor, titleFont, displayText, contentText, textColor, textHoverColor, textFont, displayLearnMore, learnMore, learnMoreStyles, displayShadow, shadow, shadowHover }, className, setAttributes, isSelected } = this.props;
		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl } = this.state;
		const onChangeTitle = value => {
			setAttributes( { title: value } );
		};
		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const tgconfig = {
			google: {
				families: [ textFont[ 0 ].family + ( textFont[ 0 ].variant ? ':' + textFont[ 0 ].variant : '' ) ],
			},
		};
		const lgconfig = {
			google: {
				families: [ learnMoreStyles[ 0 ].family + ( learnMoreStyles[ 0 ].variant ? ':' + learnMoreStyles[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const tconfig = ( textFont[ 0 ].google ? tgconfig : '' );
		const lconfig = ( learnMoreStyles[ 0 ].google ? lgconfig : '' );
		const titleTagName = 'h' + titleFont[ 0 ].level;
		const ALLOWED_MEDIA_TYPES = [ 'image' ];
		const onSelectImage = media => {
			saveMediaImage( {
				id: media.id,
				url: media.url,
				alt: media.alt,
				width: media.width,
				height: media.height,
				maxWidth: media.width,
			} );
		};
		const onSelectFlipImage = media => {
			saveMediaImage( {
				flipId: media.id,
				flipUrl: media.url,
				flipAlt: media.alt,
				flipWidth: media.width,
				flipHeight: media.height,
			} );
		};
		const isSelectedClass = ( isSelected ? 'is-selected' : 'not-selected' );
		const saveMediaImage = ( value ) => {
			const newUpdate = mediaImage.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaImage: newUpdate,
			} );
		};
		const saveMediaIcon = ( value ) => {
			const newUpdate = mediaIcon.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaIcon: newUpdate,
			} );
		};
		const saveMediaStyle = ( value ) => {
			const newUpdate = mediaStyle.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaStyle: newUpdate,
			} );
		};
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
		const saveLearnMoreStyles = ( value ) => {
			const newUpdate = learnMoreStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				learnMoreStyles: newUpdate,
			} );
		};
		const saveShadow = ( value ) => {
			const newUpdate = shadow.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				shadow: newUpdate,
			} );
		};
		const saveHoverShadow = ( value ) => {
			const newUpdate = shadowHover.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				shadowHover: newUpdate,
			} );
		};
		const mediaImagedraw = ( 'drawborder' === mediaImage[ 0 ].hoverAnimation || 'grayscale-border-draw' === mediaImage[ 0 ].hoverAnimation ? true : false );
		const renderCSS = (
			<style>
				{ ( mediaIcon[ 0 ].hoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-info-svg-icon { color: ${ mediaIcon[ 0 ].hoverColor } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].borderRadius ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media img { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }` : '' ) }
				{ ( titleHoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-title { color: ${ titleHoverColor } !important; }` : '' ) }
				{ ( textHoverColor ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text { color: ${ textHoverColor } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].colorHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { color: ${ learnMoreStyles[ 0 ].colorHover } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].borderHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { border-color: ${ learnMoreStyles[ 0 ].borderHover } !important; }` : '' ) }
				{ ( learnMoreStyles[ 0 ].backgroundHover ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { background-color: ${ learnMoreStyles[ 0 ].backgroundHover } !important; }` : '' ) }
				{ ( containerHoverBackground ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { background: ${ containerHoverBackground } !important; }` : '' ) }
				{ ( containerHoverBorder ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { border-color: ${ containerHoverBorder } !important; }` : '' ) }
				{ ( displayShadow ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover { box-shadow: ${ shadowHover[ 0 ].hOffset + 'px ' + shadowHover[ 0 ].vOffset + 'px ' + shadowHover[ 0 ].blur + 'px ' + shadowHover[ 0 ].spread + 'px ' + hexToRGBA( shadowHover[ 0 ].color, shadowHover[ 0 ].opacity ) } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBackground ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { background: ${ mediaStyle[ 0 ].hoverBackground } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'icon' === mediaType && 'drawborder' !== mediaIcon[ 0 ].hoverAnimation ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ mediaStyle[ 0 ].hoverBorder } !important; }` : '' ) }
				{ ( mediaStyle[ 0 ].hoverBorder && 'image' === mediaType && true !== mediaImagedraw ? `#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${ mediaStyle[ 0 ].hoverBorder } !important; }` : '' ) }
				{ 'icon' === mediaType && 'drawborder' === mediaIcon[ 0 ].hoverAnimation && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ mediaStyle[ 0 ].hoverBorder } ; border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-bottom-color: ${ mediaStyle[ 0 ].hoverBorder } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
				{ 'image' === mediaType && true === mediaImagedraw && (
					`#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px ${ mediaStyle[ 0 ].border }; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${ mediaStyle[ 0 ].borderRadius }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${ mediaStyle[ 0 ].hoverBorder } ; border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-bottom-color: ${ mediaStyle[ 0 ].hoverBorder } }
					#kt-info-box${ uniqueID } .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${ mediaStyle[ 0 ].hoverBorder }; border-right-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-bottom-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; border-top-width: ${ mediaStyle[ 0 ].borderWidth[ 0 ] }px; }`
				) }
			</style>
		);
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		return (
			<div id={ `kt-info-box${ uniqueID }` } className={ className }>
				{ renderCSS }
				<BlockControls key="controls">
					{ 'image' === mediaType && mediaImage[ 0 ].url && (
						<Toolbar>
							<MediaUpload
								onSelect={ onSelectImage }
								type="image"
								value={ mediaImage[ 0 ].id }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								render={ ( { open } ) => (
									<IconButton
										className="components-toolbar__control"
										label={ __( 'Edit Media' ) }
										icon="edit"
										onClick={ open }
									/>
								) }
							/>
						</Toolbar>
					) }
					<AlignmentToolbar
						value={ hAlign }
						onChange={ value => setAttributes( { hAlign: value } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody>
						<div className="kt-controls-link-wrap">
							<h2>{ __( 'Link' ) }</h2>
							<URLInput
								value={ link }
								onChange={ value => setAttributes( { link: value } ) }
							/>
						</div>
						<SelectControl
							label={ __( 'Link Target' ) }
							value={ target }
							options={ [
								{ value: '_self', label: __( 'Same Window' ) },
								{ value: '_blank', label: __( 'New Window' ) },
							] }
							onChange={ value => setAttributes( { target: value } ) }
						/>
						<SelectControl
							label={ __( 'Link Content' ) }
							value={ linkProperty }
							options={ [
								{ value: 'box', label: __( 'Entire Box' ) },
								{ value: 'learnmore', label: __( 'Only Learn More Text' ) },
							] }
							onChange={ value => setAttributes( { linkProperty: value } ) }
						/>
						<SelectControl
							label={ __( 'Content Align' ) }
							value={ hAlign }
							options={ [
								{ value: 'center', label: __( 'Center' ) },
								{ value: 'left', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
							onChange={ value => setAttributes( { hAlign: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Container Settings' ) }
						initialOpen={ false }
					>
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
						<RangeControl
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
													<h2>{ __( 'Container Hover Background' ) }</h2>
													<ColorPalette
														value={ containerHoverBackground }
														onChange={ value => setAttributes( { containerHoverBackground: value } ) }
													/>
													<h2>{ __( 'Container Hover Border' ) }</h2>
													<ColorPalette
														value={ containerHoverBorder }
														onChange={ value => setAttributes( { containerHoverBorder: value } ) }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<h2>{ __( 'Container Background' ) }</h2>
													<ColorPalette
														value={ containerBackground }
														onChange={ value => setAttributes( { containerBackground: value } ) }
													/>
													<h2>{ __( 'Container Border' ) }</h2>
													<ColorPalette
														value={ containerBorder }
														onChange={ value => setAttributes( { containerBorder: value } ) }
													/>
												</Fragment>
											);
										}
									}
									return <div>{ tabout }</div>;
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
						title={ __( 'Media Settings' ) }
						initialOpen={ false }
					>
						<SelectControl
							label={ __( 'Media Align' ) }
							value={ mediaAlign }
							options={ [
								{ value: 'top', label: __( 'Top' ) },
								{ value: 'left', label: __( 'Left' ) },
								{ value: 'right', label: __( 'Right' ) },
							] }
							onChange={ value => setAttributes( { mediaAlign: value } ) }
						/>
						<SelectControl
							label={ __( 'Media Type' ) }
							value={ mediaType }
							options={ [
								{ value: 'icon', label: __( 'Icon' ) },
								{ value: 'image', label: __( 'Image' ) },
							] }
							onChange={ value => setAttributes( { mediaType: value } ) }
						/>
						{ 'image' === mediaType && (
							<Fragment>
								<RangeControl
									label={ __( 'Max Image Width' ) }
									value={ mediaImage[ 0 ].maxWidth }
									onChange={ value => saveMediaImage( { maxWidth: value } ) }
									min={ 5 }
									max={ 800 }
									step={ 1 }
								/>
								<SelectControl
									label={ __( 'Image Hover Animation' ) }
									value={ mediaImage[ 0 ].hoverAnimation }
									options={ [
										{ value: 'none', label: __( 'None' ) },
										{ value: 'grayscale', label: __( 'Grayscale to Color' ) },
										{ value: 'drawborder', label: __( 'Border Spin In' ) },
										{ value: 'grayscale-border-draw', label: __( 'Grayscale to Color & Border Spin In' ) },
										{ value: 'flip', label: __( 'Flip to Another Image' ) },
									] }
									onChange={ value => saveMediaImage( { hoverAnimation: value } ) }
								/>
								{ 'flip' === mediaImage[ 0 ].hoverAnimation && (
									<Fragment>
										<h2>{ __( 'Flip Image (Use same size as start image' ) }</h2>
										<MediaUpload
											onSelect={ onSelectFlipImage }
											type="image"
											value={ mediaImage[ 0 ].flipId }
											render={ ( { open } ) => (
												<Button
													className={ 'components-button components-icon-button kt-cta-upload-btn' }
													onClick={ open }
												>
													<Dashicon icon="format-image" />
													{ __( 'Select Image' ) }
												</Button>
											) }
										/>
									</Fragment>
								) }
								<MeasurementControls
									label={ __( 'Image Border' ) }
									measurement={ mediaStyle[ 0 ].borderWidth }
									control={ mediaBorderControl }
									onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
									onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
									min={ 0 }
									max={ 40 }
									step={ 1 }
								/>
								<RangeControl
									label={ __( 'Image Border Radius (px)' ) }
									value={ mediaStyle[ 0 ].borderRadius }
									onChange={ value => saveMediaStyle( { borderRadius: value } ) }
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
															<h2>{ __( 'Image Hover Background' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].hoverBackground }
																onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
															/>
															<h2>{ __( 'Image Hover Border' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].hoverBorder }
																onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<h2>{ __( 'Image Background' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].background }
																onChange={ value => saveMediaStyle( { background: value } ) }
															/>
															<h2>{ __( 'Image Border' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].border }
																onChange={ value => saveMediaStyle( { border: value } ) }
															/>
														</Fragment>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
							</Fragment>
						) }
						{ 'icon' === mediaType && (
							<Fragment>
								<FontIconPicker
									icons={ IcoNames }
									value={ mediaIcon[ 0 ].icon }
									onChange={ value => saveMediaIcon( { icon: value } ) }
									appendTo="body"
									renderFunc={ renderSVG }
									theme="default"
									isMulti={ false }
								/>
								<RangeControl
									label={ __( 'Icon Size' ) }
									value={ mediaIcon[ 0 ].size }
									onChange={ value => saveMediaIcon( { size: value } ) }
									min={ 5 }
									max={ 250 }
									step={ 1 }
								/>
								{ mediaIcon[ 0 ].icon && 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) && (
									<RangeControl
										label={ __( 'Icon Line Width' ) }
										value={ mediaIcon[ 0 ].width }
										onChange={ value => saveMediaIcon( { width: value } ) }
										step={ 0.5 }
										min={ 0.5 }
										max={ 4 }
									/>
								) }
								<MeasurementControls
									label={ __( 'Icon Border' ) }
									measurement={ mediaStyle[ 0 ].borderWidth }
									control={ mediaBorderControl }
									onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
									onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
									min={ 0 }
									max={ 40 }
									step={ 1 }
								/>
								<RangeControl
									label={ __( 'Icon Border Radius (px)' ) }
									value={ mediaStyle[ 0 ].borderRadius }
									onChange={ value => saveMediaStyle( { borderRadius: value } ) }
									step={ 1 }
									min={ 0 }
									max={ 200 }
								/>
								<SelectControl
									label={ __( 'Icon Hover Animation' ) }
									value={ mediaIcon[ 0 ].hoverAnimation }
									options={ [
										{ value: 'none', label: __( 'None' ) },
										{ value: 'drawborder', label: __( 'Border Spin In' ) },
										{ value: 'flip', label: __( 'Flip to Another Icon' ) },
									] }
									onChange={ value => saveMediaIcon( { hoverAnimation: value } ) }
								/>
								{ mediaIcon[ 0 ].hoverAnimation === 'flip' && (
									<FontIconPicker
										icons={ IcoNames }
										value={ mediaIcon[ 0 ].flipIcon }
										onChange={ value => saveMediaIcon( { flipIcon: value } ) }
										appendTo="body"
										renderFunc={ renderSVG }
										theme="default"
										isMulti={ false }
									/>
								) }
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
															<h2>{ __( 'Icon Hover Color' ) }</h2>
															<ColorPalette
																value={ mediaIcon[ 0 ].hoverColor }
																onChange={ value => saveMediaIcon( { hoverColor: value } ) }
															/>
															<h2>{ __( 'Icon Hover Background' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].hoverBackground }
																onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
															/>
															<h2>{ __( 'Icon Hover Border Color' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].hoverBorder }
																onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<h2>{ __( 'Icon Color' ) }</h2>
															<ColorPalette
																value={ mediaIcon[ 0 ].color }
																onChange={ value => saveMediaIcon( { color: value } ) }
															/>
															<h2>{ __( 'Icon Background' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].background }
																onChange={ value => saveMediaStyle( { background: value } ) }
															/>
															<h2>{ __( 'Icon Border Color' ) }</h2>
															<ColorPalette
																value={ mediaStyle[ 0 ].border }
																onChange={ value => saveMediaStyle( { border: value } ) }
															/>
														</Fragment>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
								<TextControl
									label={ __( 'Icon Title for Accessibility' ) }
									value={ mediaIcon[ 0 ].title }
									onChange={ value => saveMediaIcon( { title: value } ) }
								/>
							</Fragment>
						) }
						<MeasurementControls
							label={ __( 'Media Padding' ) }
							measurement={ mediaStyle[ 0 ].padding }
							control={ mediaPaddingControl }
							onChange={ ( value ) => saveMediaStyle( { padding: value } ) }
							onControl={ ( value ) => this.setState( { mediaPaddingControl: value } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<MeasurementControls
							label={ __( 'Media Margin' ) }
							measurement={ mediaStyle[ 0 ].margin }
							control={ mediaMarginControl }
							onChange={ ( value ) => saveMediaStyle( { margin: value } ) }
							onControl={ ( value ) => this.setState( { mediaMarginControl: value } ) }
							min={ -200 }
							max={ 200 }
							step={ 1 }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Title Settings' ) }
						initialOpen={ false }
					>
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
														<ColorPalette
															value={ titleHoverColor }
															onChange={ value => setAttributes( { titleHoverColor: value } ) }
														/>
													);
												} else {
													tabout = (
														<ColorPalette
															value={ titleColor }
															onChange={ value => setAttributes( { titleColor: value } ) }
														/>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
								<TypographyControls
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
							</Fragment>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Text Settings' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Show Text' ) }
							checked={ displayText }
							onChange={ ( value ) => setAttributes( { displayText: value } ) }
						/>
						{ displayText && (
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
														<ColorPalette
															value={ textHoverColor }
															onChange={ value => setAttributes( { textHoverColor: value } ) }
														/>
													);
												} else {
													tabout = (
														<ColorPalette
															value={ textColor }
															onChange={ value => setAttributes( { textColor: value } ) }
														/>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
								<TypographyControls
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
								/>
							</Fragment>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Learn More Settings' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Show Learn More' ) }
							checked={ displayLearnMore }
							onChange={ ( value ) => setAttributes( { displayLearnMore: value } ) }
						/>
						{ displayLearnMore && (
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
														<Fragment>
															<h2>{ __( 'HOVER: Learn More Color' ) }</h2>
															<ColorPalette
																value={ learnMoreStyles[ 0 ].colorHover }
																onChange={ value => saveLearnMoreStyles( { colorHover: value } ) }
															/>
															<h2>{ __( 'HOVER: Learn More Background' ) }</h2>
															<ColorPalette
																value={ learnMoreStyles[ 0 ].backgroundHover }
																onChange={ value => saveLearnMoreStyles( { backgroundHover: value } ) }
															/>
															<h2>{ __( 'HOVER: Learn More Border Color' ) }</h2>
															<ColorPalette
																value={ learnMoreStyles[ 0 ].borderHover }
																onChange={ value => saveLearnMoreStyles( { borderHover: value } ) }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<h2>{ __( 'Learn More Color' ) }</h2>
															<ColorPalette
																value={ learnMoreStyles[ 0 ].color }
																onChange={ value => saveLearnMoreStyles( { color: value } ) }
															/>
															<h2>{ __( 'Learn More Background' ) }</h2>
															<ColorPalette
																value={ learnMoreStyles[ 0 ].background }
																onChange={ value => saveLearnMoreStyles( { background: value } ) }
															/>
															<h2>{ __( 'Learn More Border Color' ) }</h2>
															<ColorPalette
																value={ learnMoreStyles[ 0 ].border }
																onChange={ value => saveLearnMoreStyles( { border: value } ) }
															/>
														</Fragment>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
								<MeasurementControls
									label={ __( 'Learn More Border Width (px)' ) }
									measurement={ learnMoreStyles[ 0 ].borderWidth }
									control={ learnMoreStyles[ 0 ].borderControl }
									onChange={ ( value ) => saveLearnMoreStyles( { borderWidth: value } ) }
									onControl={ ( value ) => saveLearnMoreStyles( { borderControl: value } ) }
									min={ 0 }
									max={ 40 }
									step={ 1 }
								/>
								<RangeControl
									label={ __( 'Learn More Border Radius (px)' ) }
									value={ learnMoreStyles[ 0 ].borderRadius }
									onChange={ value => saveLearnMoreStyles( { borderRadius: value } ) }
									step={ 1 }
									min={ 0 }
									max={ 200 }
								/>
								<TypographyControls
									fontSize={ learnMoreStyles[ 0 ].size }
									onFontSize={ ( value ) => saveLearnMoreStyles( { size: value } ) }
									fontSizeType={ learnMoreStyles[ 0 ].sizeType }
									onFontSizeType={ ( value ) => saveLearnMoreStyles( { sizeType: value } ) }
									lineHeight={ learnMoreStyles[ 0 ].lineHeight }
									onLineHeight={ ( value ) => saveLearnMoreStyles( { lineHeight: value } ) }
									lineHeightType={ learnMoreStyles[ 0 ].lineType }
									onLineHeightType={ ( value ) => saveLearnMoreStyles( { lineType: value } ) }
									letterSpacing={ learnMoreStyles[ 0 ].letterSpacing }
									onLetterSpacing={ ( value ) => saveLearnMoreStyles( { letterSpacing: value } ) }
									fontFamily={ learnMoreStyles[ 0 ].family }
									onFontFamily={ ( value ) => saveLearnMoreStyles( { family: value } ) }
									onFontChange={ ( select ) => {
										saveLearnMoreStyles( {
											family: select.value,
											google: select.google,
										} );
									} }
									onFontArrayChange={ ( values ) => saveLearnMoreStyles( values ) }
									googleFont={ learnMoreStyles[ 0 ].google }
									onGoogleFont={ ( value ) => saveLearnMoreStyles( { google: value } ) }
									loadGoogleFont={ learnMoreStyles[ 0 ].loadGoogle }
									onLoadGoogleFont={ ( value ) => saveLearnMoreStyles( { loadGoogle: value } ) }
									fontVariant={ learnMoreStyles[ 0 ].variant }
									onFontVariant={ ( value ) => saveLearnMoreStyles( { variant: value } ) }
									fontWeight={ learnMoreStyles[ 0 ].weight }
									onFontWeight={ ( value ) => saveLearnMoreStyles( { weight: value } ) }
									fontStyle={ learnMoreStyles[ 0 ].style }
									onFontStyle={ ( value ) => saveLearnMoreStyles( { style: value } ) }
									fontSubset={ learnMoreStyles[ 0 ].subset }
									onFontSubset={ ( value ) => saveLearnMoreStyles( { subset: value } ) }
									padding={ learnMoreStyles[ 0 ].padding }
									onPadding={ ( value ) => saveLearnMoreStyles( { padding: value } ) }
									paddingControl={ learnMoreStyles[ 0 ].paddingControl }
									onPaddingControl={ ( value ) => saveLearnMoreStyles( { paddingControl: value } ) }
									margin={ learnMoreStyles[ 0 ].margin }
									onMargin={ ( value ) => saveLearnMoreStyles( { margin: value } ) }
									marginControl={ learnMoreStyles[ 0 ].marginControl }
									onMarginControl={ ( value ) => saveLearnMoreStyles( { marginControl: value } ) }
								/>
							</Fragment>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Container Shaddow' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Enable Shadow' ) }
							checked={ displayShadow }
							onChange={ value => setAttributes( { displayShadow: value } ) }
						/>
						{ displayShadow && (
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
														<p className="kt-setting-label">{ __( 'Shadow Color' ) }</p>
														<ColorPalette
															value={ shadowHover[ 0 ].color }
															onChange={ value => saveHoverShadow( { color: value } ) }
														/>
														<RangeControl
															label={ __( 'Shadow Opacity' ) }
															value={ shadowHover[ 0 ].opacity }
															onChange={ value => saveHoverShadow( { opacity: value } ) }
															min={ 0 }
															max={ 1 }
															step={ 0.1 }
														/>
														<RangeControl
															label={ __( 'Shadow Blur' ) }
															value={ shadowHover[ 0 ].blur }
															onChange={ value => saveHoverShadow( { blur: value } ) }
															min={ 0 }
															max={ 100 }
															step={ 1 }
														/>
														<RangeControl
															label={ __( 'Shadow Spread' ) }
															value={ shadowHover[ 0 ].spread }
															onChange={ value => saveHoverShadow( { spread: value } ) }
															min={ -100 }
															max={ 100 }
															step={ 1 }
														/>
														<RangeControl
															label={ __( 'Shadow Vertical Offset' ) }
															value={ shadowHover[ 0 ].vOffset }
															onChange={ value => saveHoverShadow( { vOffset: value } ) }
															min={ -100 }
															max={ 100 }
															step={ 1 }
														/>
														<RangeControl
															label={ __( 'Shadow Horizontal Offset' ) }
															value={ shadowHover[ 0 ].hOffset }
															onChange={ value => saveHoverShadow( { hOffset: value } ) }
															min={ -100 }
															max={ 100 }
															step={ 1 }
														/>
													</Fragment>
												);
											} else {
												tabout = (
													<Fragment>
														<p className="kt-setting-label">{ __( 'Shadow Color' ) }</p>
														<ColorPalette
															value={ shadow[ 0 ].color }
															onChange={ value => saveShadow( { color: value } ) }
														/>
														<RangeControl
															label={ __( 'Shadow Opacity' ) }
															value={ shadow[ 0 ].opacity }
															onChange={ value => saveShadow( { opacity: value } ) }
															min={ 0 }
															max={ 1 }
															step={ 0.1 }
														/>
														<RangeControl
															label={ __( 'Shadow Blur' ) }
															value={ shadow[ 0 ].blur }
															onChange={ value => saveShadow( { blur: value } ) }
															min={ 0 }
															max={ 100 }
															step={ 1 }
														/>
														<RangeControl
															label={ __( 'Shadow Spread' ) }
															value={ shadow[ 0 ].spread }
															onChange={ value => saveShadow( { spread: value } ) }
															min={ -100 }
															max={ 100 }
															step={ 1 }
														/>
														<RangeControl
															label={ __( 'Shadow Vertical Offset' ) }
															value={ shadow[ 0 ].vOffset }
															onChange={ value => saveShadow( { vOffset: value } ) }
															min={ -100 }
															max={ 100 }
															step={ 1 }
														/>
														<RangeControl
															label={ __( 'Shadow Horizontal Offset' ) }
															value={ shadow[ 0 ].hOffset }
															onChange={ value => saveShadow( { hOffset: value } ) }
															min={ -100 }
															max={ 100 }
															step={ 1 }
														/>
													</Fragment>
												);
											}
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
						) }
					</PanelBody>
				</InspectorControls>
				<div className={ `kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-${ mediaAlign } ${ isSelectedClass } kt-info-halign-${ hAlign }` } style={ {
					boxShadow: ( displayShadow ? shadow[ 0 ].hOffset + 'px ' + shadow[ 0 ].vOffset + 'px ' + shadow[ 0 ].blur + 'px ' + shadow[ 0 ].spread + 'px ' + hexToRGBA( shadow[ 0 ].color, shadow[ 0 ].opacity ) : undefined ),
					borderColor: containerBorder,
					background: containerBackground,
					borderRadius: containerBorderRadius + 'px',
					borderWidth: ( containerBorderWidth ? containerBorderWidth[ 0 ] + 'px ' + containerBorderWidth[ 1 ] + 'px ' + containerBorderWidth[ 2 ] + 'px ' + containerBorderWidth[ 3 ] + 'px' : '' ),
					padding: ( containerPadding ? containerPadding[ 0 ] + 'px ' + containerPadding[ 1 ] + 'px ' + containerPadding[ 2 ] + 'px ' + containerPadding[ 3 ] + 'px' : '' ),
				} } >
					<div className={ `kt-blocks-info-box-media kt-info-media-animate-${ 'image' === mediaType ? mediaImage[ 0 ].hoverAnimation : mediaIcon[ 0 ].hoverAnimation }` } style={ {
						borderColor: mediaStyle[ 0 ].border,
						backgroundColor: mediaStyle[ 0 ].background,
						borderRadius: mediaStyle[ 0 ].borderRadius + 'px',
						borderWidth: ( mediaStyle[ 0 ].borderWidth ? mediaStyle[ 0 ].borderWidth[ 0 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 1 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 2 ] + 'px ' + mediaStyle[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
						padding: ( mediaStyle[ 0 ].padding ? mediaStyle[ 0 ].padding[ 0 ] + 'px ' + mediaStyle[ 0 ].padding[ 1 ] + 'px ' + mediaStyle[ 0 ].padding[ 2 ] + 'px ' + mediaStyle[ 0 ].padding[ 3 ] + 'px' : '' ),
						margin: ( mediaStyle[ 0 ].margin ? mediaStyle[ 0 ].margin[ 0 ] + 'px ' + mediaStyle[ 0 ].margin[ 1 ] + 'px ' + mediaStyle[ 0 ].margin[ 2 ] + 'px ' + mediaStyle[ 0 ].margin[ 3 ] + 'px' : '' ),
					} } >
						{ ! mediaImage[ 0 ].url && 'image' === mediaType && (
							<MediaPlaceholder
								icon="format-image"
								labels={ {
									title: __( 'Media area' ),
								} }
								onSelect={ onSelectImage }
								accept="image/*"
								allowedTypes={ ALLOWED_MEDIA_TYPES }
							/>
						) }
						{ mediaImage[ 0 ].url && 'image' === mediaType && (
							<div className="kadence-info-box-image-inner-intrisic-container" style={ {
								maxWidth: mediaImage[ 0 ].maxWidth + 'px',
							} } >
								<div className={ `kadence-info-box-image-intrisic kt-info-animate-${ mediaImage[ 0 ].hoverAnimation }` } style={ {
									paddingBottom: ( ( mediaImage[ 0 ].height / mediaImage[ 0 ].width ) * 100 ) + '%',
								} } >
									<div className="kadence-info-box-image-inner-intrisic">
										<img
											src={ mediaImage[ 0 ].url }
											alt={ mediaImage[ 0 ].alt }
											width={ mediaImage[ 0 ].width }
											height={ mediaImage[ 0 ].height }
											className={ mediaImage[ 0 ].id ? `kt-info-box-image wp-image-${ mediaImage[ 0 ].id }` : 'kt-info-box-image wp-image-offsite' }
										/>
										{ mediaImage[ 0 ].flipUrl && 'flip' === mediaImage[ 0 ].hoverAnimation && (
											<img
												src={ mediaImage[ 0 ].flipUrl }
												alt={ mediaImage[ 0 ].flipAlt }
												width={ mediaImage[ 0 ].flipWidth }
												height={ mediaImage[ 0 ].flipHeight }
												className={ mediaImage[ 0 ].flipId ? `kt-info-box-image-flip wp-image-${ mediaImage[ 0 ].flipId }` : 'kt-info-box-image-flip wp-image-offsite' }
											/>
										) }
									</div>
								</div>
							</div>
						) }
						{ 'icon' === mediaType && (
							<div className={ `kadence-info-box-icon-container kt-info-icon-animate-${ mediaIcon[ 0 ].hoverAnimation }` } >
								<div className={ 'kadence-info-box-icon-inner-container' } >
									<GenIcon className={ `kt-info-svg-icon kt-info-svg-icon-${ mediaIcon[ 0 ].icon }` } name={ mediaIcon[ 0 ].icon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } icon={ ( 'fa' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? FaIco[ mediaIcon[ 0 ].icon ] : Ico[ mediaIcon[ 0 ].icon ] ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
										display: 'block',
										color: ( mediaIcon[ 0 ].color ? mediaIcon[ 0 ].color : undefined ),
									} } />
									{ mediaIcon[ 0 ].flipIcon && 'flip' === mediaIcon[ 0 ].hoverAnimation && (
										<GenIcon className={ `kt-info-svg-icon-flip kt-info-svg-icon-${ mediaIcon[ 0 ].flipIcon }` } name={ mediaIcon[ 0 ].flipIcon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } icon={ ( 'fa' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? FaIco[ mediaIcon[ 0 ].flipIcon ] : Ico[ mediaIcon[ 0 ].flipIcon ] ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
											display: 'block',
											color: ( mediaIcon[ 0 ].hoverColor ? mediaIcon[ 0 ].hoverColor : undefined ),
										} } />
									) }
								</div>
							</div>
						) }
					</div>
					<div className={ 'kt-infobox-textcontent' } >
						{ displayTitle && titleFont[ 0 ].google && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
						{ displayTitle && (
							<RichText
								className="kt-blocks-info-box-title"
								tagName={ titleTagName }
								placeholder={ __( 'Title' ) }
								onChange={ onChangeTitle }
								value={ title }
								style={ {
									fontWeight: titleFont[ 0 ].weight,
									fontStyle: titleFont[ 0 ].style,
									color: titleColor,
									fontSize: titleFont[ 0 ].size[ 0 ] + titleFont[ 0 ].sizeType,
									lineHeight: ( titleFont[ 0 ].lineHeight && titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] + titleFont[ 0 ].lineType : undefined ),
									letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
									fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
									padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
									margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
								} }
								keepPlaceholderOnFocus
							/>
						) }
						{ displayText && textFont[ 0 ].google && (
							<WebfontLoader config={ tconfig }>
							</WebfontLoader>
						) }
						{ displayText && (
							<RichText
								className="kt-blocks-info-box-text"
								tagName={ 'p' }
								placeholder={ __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam dolor, accumsan sed rutrum vel, dapibus et leo.' ) }
								onChange={ ( value ) => setAttributes( { contentText: value } ) }
								value={ contentText }
								style={ {
									fontWeight: textFont[ 0 ].weight,
									fontStyle: textFont[ 0 ].style,
									color: textColor,
									fontSize: textFont[ 0 ].size[ 0 ] + textFont[ 0 ].sizeType,
									lineHeight: ( textFont[ 0 ].lineHeight && textFont[ 0 ].lineHeight[ 0 ] ? textFont[ 0 ].lineHeight[ 0 ] + textFont[ 0 ].lineType : undefined ),
									letterSpacing: textFont[ 0 ].letterSpacing + 'px',
									fontFamily: ( textFont[ 0 ].family ? textFont[ 0 ].family : '' ),
								} }
								keepPlaceholderOnFocus
							/>
						) }
						{ displayLearnMore && learnMoreStyles[ 0 ].google && (
							<WebfontLoader config={ lconfig }>
							</WebfontLoader>
						) }
						{ displayLearnMore && (
							<div className="kt-blocks-info-box-learnmore-wrap" style={ {
								margin: ( learnMoreStyles[ 0 ].margin ? learnMoreStyles[ 0 ].margin[ 0 ] + 'px ' + learnMoreStyles[ 0 ].margin[ 1 ] + 'px ' + learnMoreStyles[ 0 ].margin[ 2 ] + 'px ' + learnMoreStyles[ 0 ].margin[ 3 ] + 'px' : '' ),
							} } >
								<RichText
									className="kt-blocks-info-box-learnmore"
									tagName={ 'div' }
									placeholder={ __( 'Learn More' ) }
									onChange={ value => setAttributes( { learnMore: value } ) }
									value={ learnMore }
									style={ {
										fontWeight: learnMoreStyles[ 0 ].weight,
										fontStyle: learnMoreStyles[ 0 ].style,
										color: learnMoreStyles[ 0 ].color,
										borderRadius: learnMoreStyles[ 0 ].borderRadius + 'px',
										background: learnMoreStyles[ 0 ].background,
										borderColor: learnMoreStyles[ 0 ].border,
										fontSize: learnMoreStyles[ 0 ].size[ 0 ] + learnMoreStyles[ 0 ].sizeType,
										lineHeight: ( learnMoreStyles[ 0 ].lineHeight && learnMoreStyles[ 0 ].lineHeight[ 0 ] ? learnMoreStyles[ 0 ].lineHeight[ 0 ] + learnMoreStyles[ 0 ].lineType : undefined ),
										letterSpacing: learnMoreStyles[ 0 ].letterSpacing + 'px',
										fontFamily: ( learnMoreStyles[ 0 ].family ? learnMoreStyles[ 0 ].family : '' ),
										borderWidth: ( learnMoreStyles[ 0 ].borderWidth ? learnMoreStyles[ 0 ].borderWidth[ 0 ] + 'px ' + learnMoreStyles[ 0 ].borderWidth[ 1 ] + 'px ' + learnMoreStyles[ 0 ].borderWidth[ 2 ] + 'px ' + learnMoreStyles[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
										padding: ( learnMoreStyles[ 0 ].padding ? learnMoreStyles[ 0 ].padding[ 0 ] + 'px ' + learnMoreStyles[ 0 ].padding[ 1 ] + 'px ' + learnMoreStyles[ 0 ].padding[ 2 ] + 'px ' + learnMoreStyles[ 0 ].padding[ 3 ] + 'px' : '' ),
									} }
									keepPlaceholderOnFocus
								/>
							</div>
						) }
					</div>
				</div>
			</div>
		);
	}
}
export default ( KadenceInfoBox );
