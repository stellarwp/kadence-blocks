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
import map from 'lodash/map';
import times from 'lodash/times';
import TypographyControls from '../../typography-control';
import MeasurementControls from '../../measurement-control';
import WebfontLoader from '../../fontloader';
import hexToRGBA from '../../hex-to-rgba';
import GenIcon from '../../genicon';
import FaIco from '../../faicons';
import AdvancedColorControl from '../../advanced-color-control';
import Slider from 'react-slick';
import IconControl from '../../icon-control';
import IconRender from '../../icon-render';
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
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
} = wp.blockEditor;
const {
	Button,
	IconButton,
	ButtonGroup,
	Dashicon,
	PanelBody,
	RangeControl,
	Toolbar,
	TextControl,
	ToggleControl,
	SelectControl,
	Tooltip,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktTestimonialsUniqueIDs = [];
/**
 * Build the overlay edit
 */
class KadenceTestimonials extends Component {
	constructor() {
		super( ...arguments );
		this.onMove = this.onMove.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMoveBackward = this.onMoveBackward.bind( this );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
			titlePaddingControl: 'linked',
			titleMarginControl: 'individual',
			ratingMarginControl: 'individual',
			iconBorderControl: 'linked',
			iconMarginControl: 'linked',
			iconPaddingControl: 'linked',
			showPreset: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/testimonials' ] !== undefined && typeof blockConfigObject[ 'kadence/testimonials' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/testimonials' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/testimonials' ][ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			if ( this.props.attributes.showPresets ) {
				this.setState( { showPreset: true } );
			}
			ktTestimonialsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktTestimonialsUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktTestimonialsUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktTestimonialsUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.mediaStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyles[ 0 ].borderWidth[ 1 ] && this.props.attributes.mediaStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyles[ 0 ].borderWidth[ 2 ] && this.props.attributes.mediaStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.mediaStyles[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { mediaBorderControl: 'linked' } );
		} else {
			this.setState( { mediaBorderControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyles[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyles[ 0 ].padding[ 1 ] && this.props.attributes.mediaStyles[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyles[ 0 ].padding[ 2 ] && this.props.attributes.mediaStyles[ 0 ].padding[ 0 ] === this.props.attributes.mediaStyles[ 0 ].padding[ 3 ] ) {
			this.setState( { mediaPaddingControl: 'linked' } );
		} else {
			this.setState( { mediaPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.mediaStyles[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyles[ 0 ].margin[ 1 ] && this.props.attributes.mediaStyles[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyles[ 0 ].margin[ 2 ] && this.props.attributes.mediaStyles[ 0 ].margin[ 0 ] === this.props.attributes.mediaStyles[ 0 ].margin[ 3 ] ) {
			this.setState( { mediaMarginControl: 'linked' } );
		} else {
			this.setState( { mediaMarginControl: 'individual' } );
		}
		if ( this.props.attributes.titleFont[ 0 ].padding[ 0 ] === this.props.attributes.titleFont[ 0 ].padding[ 1 ] && this.props.attributes.titleFont[ 0 ].padding[ 0 ] === this.props.attributes.titleFont[ 0 ].padding[ 2 ] && this.props.attributes.titleFont[ 0 ].padding[ 0 ] === this.props.attributes.titleFont[ 0 ].padding[ 3 ] ) {
			this.setState( { titlePaddingControl: 'linked' } );
		} else {
			this.setState( { titlePaddingControl: 'individual' } );
		}
		if ( this.props.attributes.titleFont[ 0 ].margin[ 0 ] === this.props.attributes.titleFont[ 0 ].margin[ 1 ] && this.props.attributes.titleFont[ 0 ].margin[ 0 ] === this.props.attributes.titleFont[ 0 ].margin[ 2 ] && this.props.attributes.titleFont[ 0 ].margin[ 0 ] === this.props.attributes.titleFont[ 0 ].margin[ 3 ] ) {
			this.setState( { titleMarginControl: 'linked' } );
		} else {
			this.setState( { titleMarginControl: 'individual' } );
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
		if ( this.props.attributes.ratingStyles[ 0 ].margin[ 0 ] === this.props.attributes.ratingStyles[ 0 ].margin[ 1 ] && this.props.attributes.ratingStyles[ 0 ].margin[ 0 ] === this.props.attributes.ratingStyles[ 0 ].margin[ 2 ] && this.props.attributes.ratingStyles[ 0 ].margin[ 0 ] === this.props.attributes.ratingStyles[ 0 ].margin[ 3 ] ) {
			this.setState( { ratingMarginControl: 'linked' } );
		} else {
			this.setState( { ratingMarginControl: 'individual' } );
		}
		if ( undefined !== this.props.attributes.iconStyles[ 0 ].borderWidth && undefined !== this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] && this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.iconStyles[ 0 ].borderWidth[ 1 ] && this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.iconStyles[ 0 ].borderWidth[ 2 ] && this.props.attributes.iconStyles[ 0 ].borderWidth[ 0 ] === this.props.attributes.iconStyles[ 0 ].borderWidth[ 3 ] ) {
			this.setState( { iconBorderControl: 'linked' } );
		} else {
			this.setState( { iconBorderControl: 'individual' } );
		}
		if ( undefined !== this.props.attributes.iconStyles[ 0 ].padding && undefined !== this.props.attributes.iconStyles[ 0 ].padding[ 0 ] && this.props.attributes.iconStyles[ 0 ].padding[ 0 ] === this.props.attributes.iconStyles[ 0 ].padding[ 1 ] && this.props.attributes.iconStyles[ 0 ].padding[ 0 ] === this.props.attributes.iconStyles[ 0 ].padding[ 2 ] && this.props.attributes.iconStyles[ 0 ].padding[ 0 ] === this.props.attributes.iconStyles[ 0 ].padding[ 3 ] ) {
			this.setState( { iconPaddingControl: 'linked' } );
		} else {
			this.setState( { iconPaddingControl: 'individual' } );
		}
		if ( this.props.attributes.iconStyles[ 0 ].margin[ 0 ] === this.props.attributes.iconStyles[ 0 ].margin[ 1 ] && this.props.attributes.iconStyles[ 0 ].margin[ 0 ] === this.props.attributes.iconStyles[ 0 ].margin[ 2 ] && this.props.attributes.iconStyles[ 0 ].margin[ 0 ] === this.props.attributes.iconStyles[ 0 ].margin[ 3 ] ) {
			this.setState( { iconMarginControl: 'linked' } );
		} else {
			this.setState( { iconMarginControl: 'individual' } );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/testimonials' ] !== undefined && typeof blockSettings[ 'kadence/testimonials' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/testimonials' ] } );
		}
	}
	onMove( oldIndex, newIndex ) {
		const testimonials = [ ...this.props.attributes.testimonials ];
		testimonials.splice( newIndex, 1, this.props.attributes.testimonials[ oldIndex ] );
		testimonials.splice( oldIndex, 1, this.props.attributes.testimonials[ newIndex ] );
		this.props.setAttributes( { testimonials } );
	}

	onMoveForward( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.attributes.testimonials.length - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveBackward( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
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
	render() {
		const { attributes: { uniqueID, testimonials, style, hAlign, layout, itemsCount, containerBackground, containerBorder, containerBorderWidth, containerBorderRadius, containerPadding, mediaStyles, displayTitle, titleFont, displayContent, contentFont, displayName, displayMedia, nameFont, displayShadow, shadow, displayRating, ratingStyles, displayOccupation, occupationFont, containerBackgroundOpacity, containerBorderOpacity, containerMaxWidth, columnGap, autoPlay, autoSpeed, transSpeed, slidesScroll, arrowStyle, dotStyle, columns, columnControl, displayIcon, iconStyles }, setAttributes, isSelected } = this.props;
		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, titlePaddingControl, titleMarginControl, ratingMarginControl, iconBorderControl, iconPaddingControl, iconMarginControl } = this.state;
		const onColumnChange = ( value ) => {
			let columnarray = [];
			if ( 1 === value ) {
				columnarray = [ 1, 1, 1, 1, 1, 1 ];
			} else if ( 2 === value ) {
				columnarray = [ 2, 2, 2, 2, 1, 1 ];
			} else if ( 3 === value ) {
				columnarray = [ 3, 3, 3, 2, 1, 1 ];
			} else if ( 4 === value ) {
				columnarray = [ 4, 4, 4, 3, 2, 2 ];
			} else if ( 5 === value ) {
				columnarray = [ 5, 5, 5, 4, 4, 3 ];
			}
			setAttributes( { columns: columnarray } );
		};
		const setInitalLayout = ( key ) => {
			if ( 'skip' === key ) {
			} else if ( 'basic' === key ) {
				setAttributes( { style: 'basic' } );
			} else if ( 'card' === key ) {
				setAttributes( { style: 'card' } );
			} else if ( 'bubble' === key ) {
				setAttributes( { style: 'bubble' } );
			} else if ( 'inlineimage' === key ) {
				setAttributes( { style: 'inlineimage' } );
			}
		};
		const styleOptions = [
			{ key: 'basic', name: __( 'Basic' ), icon: icons.testimonialBasic },
			{ key: 'card', name: __( 'Card' ), icon: icons.testimonialCard },
			{ key: 'bubble', name: __( 'Bubble' ), icon: icons.testimonialBubble },
			{ key: 'inlineimage', name: __( 'Image In Content' ), icon: icons.testimonialInline },
		];
		const startlayoutOptions = [
			{ key: 'skip', name: __( 'Skip' ), icon: __( 'Skip' ) },
			{ key: 'basic', name: __( 'Basic' ), icon: icons.testimonialBasic },
			{ key: 'card', name: __( 'Card' ), icon: icons.testimonialCard },
			{ key: 'bubble', name: __( 'Bubble' ), icon: icons.testimonialBubble },
			{ key: 'inlineimage', name: __( 'Image In Content' ), icon: icons.testimonialInline },
		];
		const columnControlTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: __( 'Linked' ) },
			{ key: 'individual', name: __( 'Individual' ), icon: __( 'Individual' ) },
		];
		const columnControls = (
			<Fragment>
				<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Column Control Type' ) }>
					{ map( columnControlTypes, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-size-btn"
								isSmall
								isPrimary={ columnControl === key }
								aria-pressed={ columnControl === key }
								onClick={ () => setAttributes( { columnControl: key } ) }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
				{ columnControl && columnControl !== 'individual' && (
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns[ 2 ] }
						onChange={ onColumnChange }
						min={ 1 }
						max={ 5 }
					/>
				) }
				{ columnControl && columnControl === 'individual' && (
					<Fragment>
						<h4>{ __( 'Columns' ) }</h4>
						<RangeControl
							label={ __( 'Screen Above 1500px' ) }
							value={ columns[ 0 ] }
							onChange={ ( value ) => setAttributes( { columns: [ value, columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 1200px - 1499px' ) }
							value={ columns[ 1 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], value, columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 992px - 1199px' ) }
							value={ columns[ 2 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], value, columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 768px - 991px' ) }
							value={ columns[ 3 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], value, columns[ 4 ], columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 544px - 767px' ) }
							value={ columns[ 4 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], value, columns[ 5 ] ] } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen Below 543px' ) }
							value={ columns[ 5 ] }
							onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], value ] } ) }
							min={ 1 }
							max={ 5 }
						/>
					</Fragment>
				) }
			</Fragment>
		);
		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const tgconfig = {
			google: {
				families: [ contentFont[ 0 ].family + ( contentFont[ 0 ].variant ? ':' + contentFont[ 0 ].variant : '' ) ],
			},
		};
		const lgconfig = {
			google: {
				families: [ nameFont[ 0 ].family + ( nameFont[ 0 ].variant ? ':' + nameFont[ 0 ].variant : '' ) ],
			},
		};
		const ogconfig = {
			google: {
				families: [ occupationFont[ 0 ].family + ( occupationFont[ 0 ].variant ? ':' + occupationFont[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const tconfig = ( contentFont[ 0 ].google ? tgconfig : '' );
		const lconfig = ( nameFont[ 0 ].google ? lgconfig : '' );
		const oconfig = ( occupationFont[ 0 ].google ? ogconfig : '' );
		const saveTestimonials = ( value, thisIndex ) => {
			const newUpdate = testimonials.map( ( item, index ) => {
				if ( index === thisIndex ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				testimonials: newUpdate,
			} );
		};
		const ALLOWED_MEDIA_TYPES = [ 'image' ];
		function CustomNextArrow( props ) {
			const { className, style, onClick } = props;
			return (
				<button
					className={ className }
					style={ { ...style, display: 'block' } }
					onClick={ onClick }
				>
					<Dashicon icon="arrow-right-alt2" />
				</button>
			);
		}

		function CustomPrevArrow( props ) {
			const { className, style, onClick } = props;
			return (
				<button
					className={ className }
					style={ { ...style, display: 'block' } }
					onClick={ onClick }
				>
					<Dashicon icon="arrow-left-alt2" />
				</button>
			);
		}
		const sliderSettings = {
			dots: ( dotStyle === 'none' ? false : true ),
			arrows: ( arrowStyle === 'none' ? false : true ),
			infinite: true,
			speed: transSpeed,
			autoplaySpeed: autoSpeed,
			autoplay: autoPlay,
			slidesToShow: columns[ 0 ],
			slidesToScroll: ( slidesScroll === 'all' ? columns[ 0 ] : 1 ),
			nextArrow: <CustomNextArrow />,
			prevArrow: <CustomPrevArrow />,
		};
		const isSelectedClass = ( isSelected ? 'is-selected' : 'not-selected' );
		const savemediaStyles = ( value ) => {
			const newUpdate = mediaStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				mediaStyles: newUpdate,
			} );
		};
		const saveIconStyles = ( value ) => {
			const newUpdate = iconStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				iconStyles: newUpdate,
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
		const saveContentFont = ( value ) => {
			const newUpdate = contentFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				contentFont: newUpdate,
			} );
		};
		const saveNameFont = ( value ) => {
			const newUpdate = nameFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				nameFont: newUpdate,
			} );
		};
		const saveOccupationFont = ( value ) => {
			const newUpdate = occupationFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				occupationFont: newUpdate,
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
		const saveRatingStyles = ( value ) => {
			const newUpdate = ratingStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				ratingStyles: newUpdate,
			} );
		};
		const renderTestimonialSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Testimonial' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings' ) }
					initialOpen={ ( 1 === itemsCount ? true : false ) }
				>
					<SelectControl
						label={ __( 'Media Type' ) }
						value={ testimonials[ index ].media }
						options={ [
							{ value: 'image', label: __( 'Image' ) },
							{ value: 'icon', label: __( 'Icon' ) },
						] }
						onChange={ value => saveTestimonials( { media: value }, index ) }
					/>
					{ 'icon' === testimonials[ index ].media && (
						<Fragment>
							<IconControl
								value={ testimonials[ index ].icon }
								onChange={ value => {
									saveTestimonials( { icon: value }, index );
								} }
							/>
							<RangeControl
								label={ __( 'Icon Size' ) }
								value={ testimonials[ index ].isize }
								onChange={ value => {
									saveTestimonials( { isize: value }, index );
								} }
								min={ 5 }
								max={ 250 }
							/>
							{ testimonials[ index ].icon && 'fe' === testimonials[ index ].icon.substring( 0, 2 ) && (
								<RangeControl
									label={ __( 'Line Width' ) }
									value={ testimonials[ index ].istroke }
									onChange={ value => {
										saveTestimonials( { istroke: value }, index );
									} }
									step={ 0.5 }
									min={ 0.5 }
									max={ 4 }
								/>
							) }
							<AdvancedColorControl
								label={ __( 'Icon Color' ) }
								colorValue={ ( testimonials[ index ].color ? testimonials[ index ].color : '#555555' ) }
								colorDefault={ '#555555' }
								onColorChange={ ( value ) => saveTestimonials( { color: value }, index ) }
							/>
						</Fragment>
					) }
					<RangeControl
						label={ __( 'Rating' ) }
						value={ testimonials[ index ].rating }
						onChange={ value => {
							saveTestimonials( { rating: value }, index );
						} }
						step={ 1 }
						min={ 1 }
						max={ 5 }
					/>
				</PanelBody>
			);
		};
		const renderSettings = (
			<div>
				{ times( itemsCount, n => renderTestimonialSettings( n ) ) }
			</div>
		);
		const renderTestimonialIcon = ( index ) => {
			return (
				<div className="kt-svg-testimonial-global-icon-wrap" style={ {
					margin: ( iconStyles[ 0 ].margin ? iconStyles[ 0 ].margin[ 0 ] + 'px ' + iconStyles[ 0 ].margin[ 1 ] + 'px ' + iconStyles[ 0 ].margin[ 2 ] + 'px ' + iconStyles[ 0 ].margin[ 3 ] + 'px' : '' ),
				} } >
					<IconRender className={ `kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${ iconStyles[ 0 ].icon }` } name={ iconStyles[ 0 ].icon } size={ iconStyles[ 0 ].size } title={ ( iconStyles[ 0 ].title ? iconStyles[ 0 ].title : '' ) } strokeWidth={ ( 'fe' === iconStyles[ 0 ].icon.substring( 0, 2 ) ? iconStyles[ 0 ].stroke : undefined ) } style={ {
						color: ( iconStyles[ 0 ].color ? iconStyles[ 0 ].color : undefined ),
						borderRadius: iconStyles[ 0 ].borderRadius + 'px',
						borderTopWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 0 ] ? iconStyles[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
						borderRightWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 1 ] ? iconStyles[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
						borderBottomWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 2 ] ? iconStyles[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
						borderLeftWidth: ( iconStyles[ 0 ].borderWidth && undefined !== iconStyles[ 0 ].borderWidth[ 3 ] ? iconStyles[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
						background: ( iconStyles[ 0 ].background ? hexToRGBA( iconStyles[ 0 ].background, ( undefined !== iconStyles[ 0 ].backgroundOpacity ? iconStyles[ 0 ].backgroundOpacity : 1 ) ) : undefined ),
						borderColor: ( iconStyles[ 0 ].border ? hexToRGBA( iconStyles[ 0 ].border, ( undefined !== iconStyles[ 0 ].borderOpacity ? iconStyles[ 0 ].borderOpacity : 1 ) ) : undefined ),
						padding: ( iconStyles[ 0 ].padding ? iconStyles[ 0 ].padding[ 0 ] + 'px ' + iconStyles[ 0 ].padding[ 1 ] + 'px ' + iconStyles[ 0 ].padding[ 2 ] + 'px ' + iconStyles[ 0 ].padding[ 3 ] + 'px' : '' ),
					} } />
				</div>
			);
		};
		const renderTestimonialMedia = ( index ) => {
			let urlOutput = testimonials[ index ].url;
			if ( testimonials[ index ].sizes && undefined !== testimonials[ index ].sizes.thumbnail ) {
				if ( ( 'card' === style && containerMaxWidth > 500 ) || mediaStyles[ 0 ].width > 600 ) {
					urlOutput = testimonials[ index ].url;
				} else if ( 'card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100 ) {
					if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 1000 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( 'card' === style && containerMaxWidth <= 100 ) {
					if ( testimonials[ index ].sizes.medium && testimonials[ index ].sizes.medium.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.medium.url;
					} else if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( mediaStyles[ 0 ].width <= 600 && mediaStyles[ 0 ].width > 100 ) {
					if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 1000 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( mediaStyles[ 0 ].width <= 100 && mediaStyles[ 0 ].width > 75 ) {
					if ( testimonials[ index ].sizes.medium && testimonials[ index ].sizes.medium.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.medium.url;
					} else if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				} else if ( mediaStyles[ 0 ].width <= 75 ) {
					if ( testimonials[ index ].sizes.thumbnail && testimonials[ index ].sizes.thumbnail.width > 140 ) {
						urlOutput = testimonials[ index ].sizes.thumbnail.url;
					} else if ( testimonials[ index ].sizes.medium && testimonials[ index ].sizes.medium.width > 140 ) {
						urlOutput = testimonials[ index ].sizes.medium.url;
					} else if ( testimonials[ index ].sizes.large && testimonials[ index ].sizes.large.width > 200 ) {
						urlOutput = testimonials[ index ].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div className="kt-testimonial-media-inner-wrap" style={ {
						width: 'card' !== style ? mediaStyles[ 0 ].width + 'px' : undefined,
						borderColor: mediaStyles[ 0 ].border,
						backgroundColor: ( mediaStyles[ 0 ].background ? hexToRGBA( mediaStyles[ 0 ].background, ( undefined !== mediaStyles[ 0 ].backgroundOpacity ? mediaStyles[ 0 ].backgroundOpacity : 1 ) ) : undefined ),
						borderRadius: mediaStyles[ 0 ].borderRadius + 'px',
						borderWidth: ( mediaStyles[ 0 ].borderWidth ? mediaStyles[ 0 ].borderWidth[ 0 ] + 'px ' + mediaStyles[ 0 ].borderWidth[ 1 ] + 'px ' + mediaStyles[ 0 ].borderWidth[ 2 ] + 'px ' + mediaStyles[ 0 ].borderWidth[ 3 ] + 'px' : '' ),
						padding: ( mediaStyles[ 0 ].padding ? mediaStyles[ 0 ].padding[ 0 ] + 'px ' + mediaStyles[ 0 ].padding[ 1 ] + 'px ' + mediaStyles[ 0 ].padding[ 2 ] + 'px ' + mediaStyles[ 0 ].padding[ 3 ] + 'px' : '' ),
						marginTop: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 0 ] ? mediaStyles[ 0 ].margin[ 0 ] + 'px' : undefined ),
						marginRight: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 1 ] ? mediaStyles[ 0 ].margin[ 1 ] + 'px' : undefined ),
						marginBottom: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 2 ] ? mediaStyles[ 0 ].margin[ 2 ] + 'px' : undefined ),
						marginLeft: ( mediaStyles[ 0 ].margin && undefined !== mediaStyles[ 0 ].margin[ 3 ] ? mediaStyles[ 0 ].margin[ 3 ] + 'px' : undefined ),
					} } >
						<div className={ 'kadence-testimonial-image-intrisic' } style={ {
							paddingBottom: ( 'card' === style && ( undefined !== mediaStyles[ 0 ].ratio || '' !== mediaStyles[ 0 ].ratio ) ? mediaStyles[ 0 ].ratio + '%' : undefined ),
						} }>
							{ 'icon' === testimonials[ index ].media && testimonials[ index ].icon && (
								<IconRender className={ `kt-svg-testimonial-icon kt-svg-testimonial-icon-${ testimonials[ index ].icon }` } name={ testimonials[ index ].icon } size={ testimonials[ index ].isize } title={ ( testimonials[ index ].ititle ? testimonials[ index ].ititle : '' ) } strokeWidth={ ( 'fe' === testimonials[ index ].icon.substring( 0, 2 ) ? testimonials[ index ].istroke : undefined ) } style={ {
									display: 'flex',
									color: ( testimonials[ index ].color ? testimonials[ index ].color : undefined ),
								} } />
							) }
							{ 'icon' !== testimonials[ index ].media && testimonials[ index ].url && (
								<MediaUpload
									onSelect={ media => {
										saveTestimonials( {
											id: media.id,
											url: media.url,
											alt: media.alt,
											subtype: media.subtype,
											sizes: media.sizes,
										}, index );
									} }
									type="image"
									value={ ( testimonials[ index ].id ? testimonials[ index ].id : '' ) }
									allowedTypes={ ALLOWED_MEDIA_TYPES }
									render={ ( { open } ) => (
										<Tooltip text={ __( 'Edit Image' ) }>
											<Button
												style={ {
													backgroundImage: 'url("' + urlOutput + '")',
													backgroundSize: ( 'card' === style ? mediaStyles[ 0 ].backgroundSize : undefined ),
													borderRadius: mediaStyles[ 0 ].borderRadius + 'px',
												} }
												className={ 'kt-testimonial-image' }
												onClick={ open }
											/>
										</Tooltip>
									) }
								/>
							) }
							{ 'icon' !== testimonials[ index ].media && ! testimonials[ index ].url && (
								<MediaUpload
									onSelect={ media => {
										saveTestimonials( {
											id: media.id,
											url: media.url,
											alt: media.alt,
											sizes: media.sizes,
											subtype: media.subtype,
										}, index );
									} }
									type="image"
									value={ '' }
									allowedTypes={ ALLOWED_MEDIA_TYPES }
									render={ ( { open } ) => (
										<IconButton
											className="kt-testimonial-image-placeholder"
											label={ __( 'Add Image' ) }
											icon="format-image"
											style={ {
												borderRadius: mediaStyles[ 0 ].borderRadius + 'px',
											} }
											onClick={ open }
										/>
									) }
								/>
							) }
						</div>
					</div>
				</div>
			);
		};
		const containerStyles = {
			boxShadow: ( displayShadow ? shadow[ 0 ].hOffset + 'px ' + shadow[ 0 ].vOffset + 'px ' + shadow[ 0 ].blur + 'px ' + shadow[ 0 ].spread + 'px ' + hexToRGBA( ( undefined !== shadow[ 0 ].color && '' !== shadow[ 0 ].color ? shadow[ 0 ].color : '#000000' ), ( shadow[ 0 ].opacity ? shadow[ 0 ].opacity : 0.2 ) ) : undefined ),
			borderColor: ( containerBorder ? hexToRGBA( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : hexToRGBA( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ),
			background: ( containerBackground ? hexToRGBA( containerBackground, ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) : undefined ),
			borderRadius: containerBorderRadius + 'px',
			borderTopWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 0 ] ? containerBorderWidth[ 0 ] + 'px' : undefined ),
			borderRightWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 1 ] ? containerBorderWidth[ 1 ] + 'px' : undefined ),
			borderBottomWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 2 ] ? containerBorderWidth[ 2 ] + 'px' : undefined ),
			borderLeftWidth: ( containerBorderWidth && undefined !== containerBorderWidth[ 3 ] ? containerBorderWidth[ 3 ] + 'px' : undefined ),
			padding: ( containerPadding ? containerPadding[ 0 ] + 'px ' + containerPadding[ 1 ] + 'px ' + containerPadding[ 2 ] + 'px ' + containerPadding[ 3 ] + 'px' : '' ),
			maxWidth: ( 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px' ),
		};
		const renderTestimonialPreview = ( index ) => {
			return (
				<div className={ `kt-testimonial-item-wrap kt-testimonial-item-${ index }` } style={ ( 'bubble' !== style && 'inlineimage' !== style ? containerStyles : {
					maxWidth: containerMaxWidth + 'px',
					paddingTop: ( displayIcon && iconStyles[ 0 ].icon && iconStyles[ 0 ].margin && iconStyles[ 0 ].margin[ 0 ] && ( iconStyles[ 0 ].margin[ 0 ] < 0 ) ? Math.abs( iconStyles[ 0 ].margin[ 0 ] ) + 'px' : undefined ),
				} ) }>
					{ itemsCount > 1 && (
						<div className="kt-testimonial-item__move-menu">
							<IconButton
								icon="arrow-left"
								onClick={ 0 === index ? undefined : this.onMoveBackward( index ) }
								className="kt-testimonial-item__move-backward"
								label={ __( 'Move Testimonial Backward' ) }
								aria-disabled={ 0 === index }
							/>
							<IconButton
								icon="arrow-right"
								onClick={ itemsCount === ( index + 1 ) ? undefined : this.onMoveForward( index ) }
								className="kt-testimonial-item__move-forward"
								label={ __( 'Move Testimonial Forward' ) }
								aria-disabled={ itemsCount === ( index + 1 ) }
							/>
						</div>
					) }
					<div className="kt-testimonial-text-wrap" style={ ( 'bubble' === style || 'inlineimage' === style ? containerStyles : undefined ) }>
						{ displayIcon && iconStyles[ 0 ].icon && 'card' !== style && (
							renderTestimonialIcon( index )
						) }
						{ displayMedia && ( 'card' === style || 'inlineimage' === style ) && (
							renderTestimonialMedia( index )
						) }
						{ displayIcon && iconStyles[ 0 ].icon && 'card' === style && (
							renderTestimonialIcon( index )
						) }
						{ displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText
									tagName={ 'h' + titleFont[ 0 ].level }
									value={ testimonials[ index ].title }
									onChange={ value => {
										saveTestimonials( { title: value }, index );
									} }
									placeholder={ __( 'Best product I have ever used!' ) }
									style={ {
										fontWeight: titleFont[ 0 ].weight,
										fontStyle: titleFont[ 0 ].style,
										color: titleFont[ 0 ].color,
										fontSize: titleFont[ 0 ].size[ 0 ] + titleFont[ 0 ].sizeType,
										lineHeight: ( titleFont[ 0 ].lineHeight && titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] + titleFont[ 0 ].lineType : undefined ),
										letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
										textTransform: ( titleFont[ 0 ].textTransform ? titleFont[ 0 ].textTransform : undefined ),
										fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
										padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
										margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
									} }
									className={ 'kt-testimonial-title' }
								/>
							</div>
						) }
						{ displayRating && (
							<div className={ `kt-testimonial-rating-wrap kt-testimonial-rating-${ testimonials[ index ].rating }` } style={ {
								margin: ( ratingStyles[ 0 ].margin ? ratingStyles[ 0 ].margin[ 0 ] + 'px ' + ratingStyles[ 0 ].margin[ 1 ] + 'px ' + ratingStyles[ 0 ].margin[ 2 ] + 'px ' + ratingStyles[ 0 ].margin[ 3 ] + 'px' : '' ),
							} }>
								<GenIcon className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } icon={ FaIco[ 'fas_star' ] } style={ { color: ratingStyles[ 0 ].color } } />
								{ testimonials[ index ].rating > 1 && (
									<GenIcon className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } icon={ FaIco[ 'fas_star' ] } style={ { color: ratingStyles[ 0 ].color } } />
								) }
								{ testimonials[ index ].rating > 2 && (
									<GenIcon className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } icon={ FaIco[ 'fas_star' ] } style={ { color: ratingStyles[ 0 ].color } } />
								) }
								{ testimonials[ index ].rating > 3 && (
									<GenIcon className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } icon={ FaIco[ 'fas_star' ] } style={ { color: ratingStyles[ 0 ].color } } />
								) }
								{ testimonials[ index ].rating > 4 && (
									<GenIcon className={ 'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5' } name={ 'fas_star' } size={ ratingStyles[ 0 ].size } icon={ FaIco[ 'fas_star' ] } style={ { color: ratingStyles[ 0 ].color } } />
								) }
							</div>
						) }
						{ displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText
									tagName={ 'div' }
									placeholder={ __( 'I have been looking for a product like this for years. I have tried everything and nothing did what I wanted until using this product. I am so glad I found it!' ) }
									value={ testimonials[ index ].content }
									onChange={ value => {
										saveTestimonials( { content: value }, index );
									} }
									style={ {
										fontWeight: contentFont[ 0 ].weight,
										fontStyle: contentFont[ 0 ].style,
										color: contentFont[ 0 ].color,
										fontSize: contentFont[ 0 ].size[ 0 ] + contentFont[ 0 ].sizeType,
										lineHeight: ( contentFont[ 0 ].lineHeight && contentFont[ 0 ].lineHeight[ 0 ] ? contentFont[ 0 ].lineHeight[ 0 ] + contentFont[ 0 ].lineType : undefined ),
										textTransform: ( contentFont[ 0 ].textTransform ? contentFont[ 0 ].textTransform : undefined ),
										letterSpacing: contentFont[ 0 ].letterSpacing + 'px',
										fontFamily: ( contentFont[ 0 ].family ? contentFont[ 0 ].family : '' ),
									} }
									className={ 'kt-testimonial-content' }
								/>
							</div>
						) }
					</div>
					{ ( ( displayMedia && ( 'card' !== style && 'inlineimage' !== style ) ) || displayOccupation || displayName ) && (
						<div className="kt-testimonial-meta-wrap">
							{ displayMedia && ( 'card' !== style && 'inlineimage' !== style ) && (
								renderTestimonialMedia( index )
							) }
							<div className="kt-testimonial-meta-name-wrap">
								{ displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText
											tagName={ 'div' }
											placeholder={ __( 'Sophia Reily' ) }
											value={ testimonials[ index ].name }
											onChange={ value => {
												saveTestimonials( { name: value }, index );
											} }
											style={ {
												fontWeight: nameFont[ 0 ].weight,
												fontStyle: nameFont[ 0 ].style,
												color: nameFont[ 0 ].color,
												fontSize: nameFont[ 0 ].size[ 0 ] + nameFont[ 0 ].sizeType,
												lineHeight: ( nameFont[ 0 ].lineHeight && nameFont[ 0 ].lineHeight[ 0 ] ? nameFont[ 0 ].lineHeight[ 0 ] + nameFont[ 0 ].lineType : undefined ),
												textTransform: ( nameFont[ 0 ].textTransform ? nameFont[ 0 ].textTransform : undefined ),
												letterSpacing: nameFont[ 0 ].letterSpacing + 'px',
												fontFamily: ( nameFont[ 0 ].family ? nameFont[ 0 ].family : '' ),
											} }
											className={ 'kt-testimonial-name' }
										/>
									</div>
								) }
								{ displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText
											tagName={ 'div' }
											placeholder={ __( 'CEO of Company' ) }
											value={ testimonials[ index ].occupation }
											onChange={ value => {
												saveTestimonials( { occupation: value }, index );
											} }
											style={ {
												fontWeight: occupationFont[ 0 ].weight,
												fontStyle: occupationFont[ 0 ].style,
												color: occupationFont[ 0 ].color,
												fontSize: occupationFont[ 0 ].size[ 0 ] + occupationFont[ 0 ].sizeType,
												lineHeight: ( occupationFont[ 0 ].lineHeight && occupationFont[ 0 ].lineHeight[ 0 ] ? occupationFont[ 0 ].lineHeight[ 0 ] + occupationFont[ 0 ].lineType : undefined ),
												textTransform: ( occupationFont[ 0 ].textTransform ? occupationFont[ 0 ].textTransform : undefined ),
												letterSpacing: occupationFont[ 0 ].letterSpacing + 'px',
												fontFamily: ( occupationFont[ 0 ].family ? occupationFont[ 0 ].family : '' ),
											} }
											className={ 'kt-testimonial-occupation' }
										/>
									</div>
								) }
							</div>
						</div>
					) }
				</div>
			);
		};
		return (
			<div id={ `kt-blocks-testimonials-wrap${ uniqueID }` } className={ `wp-block-kadence-testimonials kt-testimonial-halign-${ hAlign } kt-testimonial-style-${ style } kt-testimonials-media-${ ( displayMedia ? 'on' : 'off' ) } kt-testimonials-icon-${ ( displayIcon ? 'on' : 'off' ) } kt-testimonial-columns-${ columns[ 0 ] }` }>
				<style>
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .slick-slide { padding: 0 ${ columnGap / 2 }px; }` : '' ) }
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-blocks-carousel .slick-slider { margin: 0 -${ columnGap / 2 }px; }` : '' ) }
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-blocks-carousel .slick-prev { left: ${ columnGap / 2 }px; }` : '' ) }
					{ ( layout === 'carousel' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-blocks-carousel .slick-next { right: ${ columnGap / 2 }px; }` : '' ) }
					{ ( style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-testimonial-text-wrap:after { margin-top: ${ containerBorderWidth && undefined !== containerBorderWidth[ 2 ] ? containerBorderWidth[ 2 ] : '1' }px; }` : '' ) }
					{ ( style === 'bubble' || style === 'inlineimage' ? `#kt-blocks-testimonials-wrap${ uniqueID } .kt-testimonial-text-wrap:after { border-top-color: ${ ( containerBorder ? hexToRGBA( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : hexToRGBA( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ) } }` : '' ) }
				</style>
				{ this.showSettings( 'allSettings' ) && (
					<Fragment>
						<BlockControls key="controls">
							<AlignmentToolbar
								value={ hAlign }
								onChange={ value => setAttributes( { hAlign: value } ) }
							/>
						</BlockControls>
						<InspectorControls>
							<PanelBody>
								{ this.showSettings( 'layoutSettings' ) && (
									<SelectControl
										label={ __( 'Layout' ) }
										value={ layout }
										options={ [
											{ value: 'grid', label: __( 'Grid' ) },
											{ value: 'carousel', label: __( 'Carousel' ) },
										] }
										onChange={ value => setAttributes( { layout: value } ) }
									/>
								) }
								{ this.showSettings( 'styleSettings' ) && (
									<Fragment>
										<p className="components-base-control__label">{ __( 'Testimonial Style' ) }</p>
										<ButtonGroup className="kt-style-btn-group" aria-label={ __( 'Testimonial Style' ) }>
											{ map( styleOptions, ( { name, key, icon } ) => (
												<Tooltip text={ name }>
													<Button
														key={ key }
														className="kt-style-btn"
														isSmall
														isPrimary={ style === key }
														aria-pressed={ style === key }
														onClick={ () => setAttributes( { style: key } ) }
													>
														{ icon }
													</Button>
												</Tooltip>
											) ) }
										</ButtonGroup>
									</Fragment>
								) }
								<RangeControl
									label={ __( 'Testimonial Items' ) }
									value={ itemsCount }
									onChange={ newcount => {
										const newitems = this.props.attributes.testimonials;
										if ( newitems.length < newcount ) {
											const amount = Math.abs( newcount - newitems.length );
											{ times( amount, n => {
												newitems.push( {
													url: newitems[ 0 ].url,
													id: newitems[ 0 ].id,
													alt: newitems[ 0 ].alt,
													width: newitems[ 0 ].width,
													height: newitems[ 0 ].height,
													maxWidth: newitems[ 0 ].maxWidth,
													subtype: newitems[ 0 ].subtype,
													media: newitems[ 0 ].media,
													icon: newitems[ 0 ].icon,
													isize: newitems[ 0 ].isize,
													istroke: newitems[ 0 ].istroke,
													ititle: newitems[ 0 ].ititle,
													color: newitems[ 0 ].color,
													title: '',
													content: '',
													name: '',
													occupation: '',
													rating: newitems[ 0 ].rating,
												} );
											} ); }
											setAttributes( { testimonials: newitems } );
											saveTestimonials( { ititle: testimonials[ 0 ].ititle }, 0 );
										}
										setAttributes( { itemsCount: newcount } );
									} }
									min={ 1 }
									max={ 20 }
								/>
								{ this.showSettings( 'columnSettings' ) && (
									<Fragment>
										{ columnControls }
										<RangeControl
											label={ __( 'Column Gap' ) }
											value={ columnGap }
											onChange={ ( value ) => setAttributes( { columnGap: value } ) }
											min={ 0 }
											max={ 80 }
										/>
									</Fragment>
								) }
							</PanelBody>
							{ layout && layout === 'carousel' && (
								<Fragment>
									{ this.showSettings( 'carouselSettings' ) && (
										<PanelBody
											title={ __( 'Carousel Settings' ) }
											initialOpen={ false }
										>
											<ToggleControl
												label={ __( 'Carousel Auto Play' ) }
												checked={ autoPlay }
												onChange={ ( value ) => setAttributes( { autoPlay: value } ) }
											/>
											{ autoPlay && (
												<RangeControl
													label={ __( 'Autoplay Speed' ) }
													value={ autoSpeed }
													onChange={ ( value ) => setAttributes( { autoSpeed: value } ) }
													min={ 500 }
													max={ 15000 }
													step={ 10 }
												/>
											) }
											<RangeControl
												label={ __( 'Carousel Slide Transition Speed' ) }
												value={ transSpeed }
												onChange={ ( value ) => setAttributes( { transSpeed: value } ) }
												min={ 100 }
												max={ 2000 }
												step={ 10 }
											/>
											<SelectControl
												label={ __( 'Slides to Scroll' ) }
												options={ [
													{
														label: __( 'One' ),
														value: '1',
													},
													{
														label: __( 'All' ),
														value: 'all',
													},
												] }
												value={ slidesScroll }
												onChange={ ( value ) => setAttributes( { slidesScroll: value } ) }
											/>
											<SelectControl
												label={ __( 'Arrow Style' ) }
												options={ [
													{
														label: __( 'White on Dark' ),
														value: 'whiteondark',
													},
													{
														label: __( 'Black on Light' ),
														value: 'blackonlight',
													},
													{
														label: __( 'Outline Black' ),
														value: 'outlineblack',
													},
													{
														label: __( 'Outline White' ),
														value: 'outlinewhite',
													},
													{
														label: __( 'None' ),
														value: 'none',
													},
												] }
												value={ arrowStyle }
												onChange={ ( value ) => setAttributes( { arrowStyle: value } ) }
											/>
											<SelectControl
												label={ __( 'Dot Style' ) }
												options={ [
													{
														label: __( 'Dark' ),
														value: 'dark',
													},
													{
														label: __( 'Light' ),
														value: 'light',
													},
													{
														label: __( 'Outline Dark' ),
														value: 'outlinedark',
													},
													{
														label: __( 'Outline Light' ),
														value: 'outlinelight',
													},
													{
														label: __( 'None' ),
														value: 'none',
													},
												] }
												value={ dotStyle }
												onChange={ ( value ) => setAttributes( { dotStyle: value } ) }
											/>
										</PanelBody>
									) }
								</Fragment>
							) }
							{ this.showSettings( 'containerSettings' ) && (
								<PanelBody
									title={ __( 'Container Settings' ) }
									initialOpen={ false }
								>
									<div className="kt-spacer-sidebar-15"></div>
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
									<AdvancedColorControl
										label={ __( 'Container Background' ) }
										colorValue={ ( containerBackground ? containerBackground : '' ) }
										colorDefault={ '' }
										onColorChange={ value => setAttributes( { containerBackground: value } ) }
										opacityValue={ containerBackgroundOpacity }
										onOpacityChange={ value => setAttributes( { containerBackgroundOpacity: value } ) }
									/>
									<AdvancedColorControl
										label={ __( 'Container Border' ) }
										colorValue={ ( containerBorder ? containerBorder : '' ) }
										colorDefault={ '' }
										onColorChange={ value => setAttributes( { containerBorder: value } ) }
										opacityValue={ containerBorderOpacity }
										onOpacityChange={ value => setAttributes( { containerBorderOpacity: value } ) }
									/>
									<div className="kt-spacer-sidebar-15"></div>
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
									<RangeControl
										label={ __( 'Container Max Width (px)' ) }
										value={ containerMaxWidth }
										onChange={ value => setAttributes( { containerMaxWidth: value } ) }
										step={ 5 }
										min={ 50 }
										max={ 2000 }
									/>
								</PanelBody>
							) }
							{ this.showSettings( 'iconSettings' ) && (
								<PanelBody
									title={ __( 'Icon Settings' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Show Top Icon' ) }
										checked={ displayIcon }
										onChange={ ( value ) => setAttributes( { displayIcon: value } ) }
									/>
									{ displayIcon && (
										<Fragment>
											<IconControl
												value={ iconStyles[ 0 ].icon }
												onChange={ value => {
													saveIconStyles( { icon: value } );
												} }
											/>
											<RangeControl
												label={ __( 'Icon Size' ) }
												value={ iconStyles[ 0 ].size }
												onChange={ value => saveIconStyles( { size: value } ) }
												step={ 1 }
												min={ 1 }
												max={ 120 }
											/>
											{ iconStyles[ 0 ].icon && 'fe' === iconStyles[ 0 ].icon.substring( 0, 2 ) && (
												<RangeControl
													label={ __( 'Line Width' ) }
													value={ iconStyles[ 0 ].stroke }
													onChange={ value => {
														saveIconStyles( { stroke: value } );
													} }
													step={ 0.5 }
													min={ 0.5 }
													max={ 4 }
												/>
											) }
											<AdvancedColorControl
												label={ __( 'Color' ) }
												colorValue={ ( iconStyles[ 0 ].color ? iconStyles[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ ( value ) => saveIconStyles( { color: value } ) }
											/>
											<div className="kt-spacer-sidebar-15"></div>
											<MeasurementControls
												label={ __( 'Icon Border Width (px)' ) }
												measurement={ iconStyles[ 0 ].borderWidth }
												control={ iconBorderControl }
												onChange={ ( value ) => saveIconStyles( { borderWidth: value } ) }
												onControl={ ( value ) => this.setState( { iconBorderControl: value } ) }
												min={ 0 }
												max={ 40 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Icon Border Radius (px)' ) }
												value={ iconStyles[ 0 ].borderRadius }
												onChange={ value => saveIconStyles( { borderRadius: value } ) }
												step={ 1 }
												min={ 0 }
												max={ 200 }
											/>
											<AdvancedColorControl
												label={ __( 'Icon Background' ) }
												colorValue={ ( iconStyles[ 0 ].background ? iconStyles[ 0 ].background : '' ) }
												colorDefault={ '' }
												onColorChange={ value => saveIconStyles( { background: value } ) }
												opacityValue={ iconStyles[ 0 ].backgroundOpacity }
												onOpacityChange={ value => saveIconStyles( { backgroundOpacity: value } ) }
											/>
											<AdvancedColorControl
												label={ __( 'Icon Border Color' ) }
												colorValue={ ( iconStyles[ 0 ].border ? iconStyles[ 0 ].border : '' ) }
												colorDefault={ '' }
												onColorChange={ value => saveIconStyles( { border: value } ) }
												opacityValue={ iconStyles[ 0 ].borderOpacity }
												onOpacityChange={ value => saveIconStyles( { borderOpacity: value } ) }
											/>
											<div className="kt-spacer-sidebar-15"></div>
											<MeasurementControls
												label={ __( 'Icon Padding' ) }
												measurement={ iconStyles[ 0 ].padding }
												control={ iconPaddingControl }
												onChange={ ( value ) => saveIconStyles( { padding: value } ) }
												onControl={ ( value ) => this.setState( { iconPaddingControl: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
											<MeasurementControls
												label={ __( 'Icon Margin' ) }
												measurement={ iconStyles[ 0 ].margin }
												control={ iconMarginControl }
												onChange={ ( value ) => saveIconStyles( { margin: value } ) }
												onControl={ ( value ) => this.setState( { iconMarginControl: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'titleSettings' ) && (
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
											<AdvancedColorControl
												label={ __( 'Color Settings' ) }
												colorValue={ ( titleFont[ 0 ].color ? titleFont[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ value => saveTitleFont( { color: value } ) }
											/>
											<TypographyControls
												tagLevel={ titleFont[ 0 ].level }
												tagLowLevel={ 2 }
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
												textTransform={ titleFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveTitleFont( { textTransform: value } ) }
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
												paddingControl={ titlePaddingControl }
												onPaddingControl={ ( value ) => this.setState( { titlePaddingControl: value } ) }
												margin={ titleFont[ 0 ].margin }
												onMargin={ ( value ) => saveTitleFont( { margin: value } ) }
												marginControl={ titleMarginControl }
												onMarginControl={ ( value ) => this.setState( { titleMarginControl: value } ) }
											/>
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'ratingSettings' ) && (
								<PanelBody
									title={ __( 'Rating Settings' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Show Rating' ) }
										checked={ displayRating }
										onChange={ ( value ) => setAttributes( { displayRating: value } ) }
									/>
									{ displayRating && (
										<Fragment>
											<AdvancedColorControl
												label={ __( 'Color' ) }
												colorValue={ ( ratingStyles[ 0 ].color ? ratingStyles[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ ( value ) => saveRatingStyles( { color: value } ) }
											/>
											<RangeControl
												label={ __( 'Icon Size' ) }
												value={ ratingStyles[ 0 ].size }
												onChange={ value => saveRatingStyles( { size: value } ) }
												step={ 1 }
												min={ 1 }
												max={ 120 }
											/>
											<MeasurementControls
												label={ __( 'Rating Margin' ) }
												measurement={ ratingStyles[ 0 ].margin }
												control={ ratingMarginControl }
												onChange={ ( value ) => saveRatingStyles( { margin: value } ) }
												onControl={ ( value ) => this.setState( { ratingMarginControl: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'contentSettings' ) && (
								<PanelBody
									title={ __( 'Content Settings' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Show Content' ) }
										checked={ displayContent }
										onChange={ ( value ) => setAttributes( { displayContent: value } ) }
									/>
									{ displayContent && (
										<Fragment>
											<AdvancedColorControl
												label={ __( 'Color' ) }
												colorValue={ ( contentFont[ 0 ].color ? contentFont[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ value => saveContentFont( { color: value } ) }
											/>
											<TypographyControls
												fontSize={ contentFont[ 0 ].size }
												onFontSize={ ( value ) => saveContentFont( { size: value } ) }
												fontSizeType={ contentFont[ 0 ].sizeType }
												onFontSizeType={ ( value ) => saveContentFont( { sizeType: value } ) }
												lineHeight={ contentFont[ 0 ].lineHeight }
												onLineHeight={ ( value ) => saveContentFont( { lineHeight: value } ) }
												lineHeightType={ contentFont[ 0 ].lineType }
												onLineHeightType={ ( value ) => saveContentFont( { lineType: value } ) }
												letterSpacing={ contentFont[ 0 ].letterSpacing }
												onLetterSpacing={ ( value ) => saveContentFont( { letterSpacing: value } ) }
												textTransform={ contentFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveContentFont( { textTransform: value } ) }
												fontFamily={ contentFont[ 0 ].family }
												onFontFamily={ ( value ) => saveContentFont( { family: value } ) }
												onFontChange={ ( select ) => {
													saveContentFont( {
														family: select.value,
														google: select.google,
													} );
												} }
												onFontArrayChange={ ( values ) => saveContentFont( values ) }
												googleFont={ contentFont[ 0 ].google }
												onGoogleFont={ ( value ) => saveContentFont( { google: value } ) }
												loadGoogleFont={ contentFont[ 0 ].loadGoogle }
												onLoadGoogleFont={ ( value ) => saveContentFont( { loadGoogle: value } ) }
												fontVariant={ contentFont[ 0 ].variant }
												onFontVariant={ ( value ) => saveContentFont( { variant: value } ) }
												fontWeight={ contentFont[ 0 ].weight }
												onFontWeight={ ( value ) => saveContentFont( { weight: value } ) }
												fontStyle={ contentFont[ 0 ].style }
												onFontStyle={ ( value ) => saveContentFont( { style: value } ) }
												fontSubset={ contentFont[ 0 ].subset }
												onFontSubset={ ( value ) => saveContentFont( { subset: value } ) }
											/>
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'mediaSettings' ) && (
								<PanelBody
									title={ __( 'Media Settings' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Show Media' ) }
										checked={ displayMedia }
										onChange={ ( value ) => setAttributes( { displayMedia: value } ) }
									/>
									{ displayMedia && (
										<Fragment>
											{ 'card' !== style && (
												<RangeControl
													label={ __( 'Media Max Size' ) }
													value={ mediaStyles[ 0 ].width }
													onChange={ value => savemediaStyles( { width: value } ) }
													step={ 1 }
													min={ 2 }
													max={ 800 }
												/>
											) }
											<MeasurementControls
												label={ __( 'Media Border Width (px)' ) }
												measurement={ mediaStyles[ 0 ].borderWidth }
												control={ mediaBorderControl }
												onChange={ ( value ) => savemediaStyles( { borderWidth: value } ) }
												onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
												min={ 0 }
												max={ 40 }
												step={ 1 }
											/>
											<RangeControl
												label={ __( 'Media Border Radius (px)' ) }
												value={ mediaStyles[ 0 ].borderRadius }
												onChange={ value => savemediaStyles( { borderRadius: value } ) }
												step={ 1 }
												min={ 0 }
												max={ 200 }
											/>
											<AdvancedColorControl
												label={ __( 'Media Background' ) }
												colorValue={ ( mediaStyles[ 0 ].background ? mediaStyles[ 0 ].background : '' ) }
												colorDefault={ '' }
												onColorChange={ value => savemediaStyles( { background: value } ) }
												opacityValue={ mediaStyles[ 0 ].backgroundOpacity }
												onOpacityChange={ value => savemediaStyles( { backgroundOpacity: value } ) }
											/>
											<AdvancedColorControl
												label={ __( 'Media Border Color' ) }
												colorValue={ ( mediaStyles[ 0 ].border ? mediaStyles[ 0 ].border : '' ) }
												colorDefault={ '' }
												onColorChange={ value => savemediaStyles( { border: value } ) }
												opacityValue={ mediaStyles[ 0 ].borderOpacity }
												onOpacityChange={ value => savemediaStyles( { borderOpacity: value } ) }
											/>
											<div className="kt-spacer-sidebar-15"></div>
											<MeasurementControls
												label={ __( 'Media Padding' ) }
												measurement={ mediaStyles[ 0 ].padding }
												control={ mediaPaddingControl }
												onChange={ ( value ) => savemediaStyles( { padding: value } ) }
												onControl={ ( value ) => this.setState( { mediaPaddingControl: value } ) }
												min={ 0 }
												max={ 100 }
												step={ 1 }
											/>
											<MeasurementControls
												label={ __( 'Media Margin' ) }
												measurement={ mediaStyles[ 0 ].margin }
												control={ mediaMarginControl }
												onChange={ ( value ) => savemediaStyles( { margin: value } ) }
												onControl={ ( value ) => this.setState( { mediaMarginControl: value } ) }
												min={ -100 }
												max={ 100 }
												step={ 1 }
											/>
											{ 'card' === style && (
												<Fragment>
													<SelectControl
														label={ __( 'Image Size' ) }
														options={ [
															{
																label: __( 'Cover' ),
																value: 'cover',
															},
															{
																label: __( 'Contain' ),
																value: 'Contain',
															},
															{
																label: __( 'Auto' ),
																value: 'auto',
															},
														] }
														value={ mediaStyles[ 0 ].backgroundSize }
														onChange={ ( value ) => savemediaStyles( { backgroundSize: value } ) }
													/>
													<SelectControl
														label={ __( 'Image Ratio' ) }
														options={ [
															{
																label: __( 'Landscape 4:2' ),
																value: '50',
															},
															{
																label: __( 'Landscape 3:2' ),
																value: '66.67',
															},
															{
																label: __( 'Landscape 4:3' ),
																value: '75',
															},
															{
																label: __( 'Portrait 3:4' ),
																value: '133.33',
															},
															{
																label: __( 'Portrait 2:3' ),
																value: '150',
															},
															{
																label: __( 'Square 1:1' ),
																value: '100',
															},
														] }
														value={ ( undefined === mediaStyles[ 0 ].ratio || '' === mediaStyles[ 0 ].ratio ? '50' : mediaStyles[ 0 ].ratio ) }
														onChange={ ( value ) => savemediaStyles( { ratio: value } ) }
													/>
												</Fragment>
											) }
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'nameSettings' ) && (
								<PanelBody
									title={ __( 'Name Settings' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Show Name' ) }
										checked={ displayName }
										onChange={ ( value ) => setAttributes( { displayName: value } ) }
									/>
									{ displayName && (
										<Fragment>
											<AdvancedColorControl
												label={ __( 'Color' ) }
												colorValue={ ( nameFont[ 0 ].color ? nameFont[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ ( value ) => saveNameFont( { color: value } ) }
											/>
											<TypographyControls
												fontSize={ nameFont[ 0 ].size }
												onFontSize={ ( value ) => saveNameFont( { size: value } ) }
												fontSizeType={ nameFont[ 0 ].sizeType }
												onFontSizeType={ ( value ) => saveNameFont( { sizeType: value } ) }
												lineHeight={ nameFont[ 0 ].lineHeight }
												onLineHeight={ ( value ) => saveNameFont( { lineHeight: value } ) }
												lineHeightType={ nameFont[ 0 ].lineType }
												onLineHeightType={ ( value ) => saveNameFont( { lineType: value } ) }
												letterSpacing={ nameFont[ 0 ].letterSpacing }
												onLetterSpacing={ ( value ) => saveNameFont( { letterSpacing: value } ) }
												textTransform={ nameFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveNameFont( { textTransform: value } ) }
												fontFamily={ nameFont[ 0 ].family }
												onFontFamily={ ( value ) => saveNameFont( { family: value } ) }
												onFontChange={ ( select ) => {
													saveNameFont( {
														family: select.value,
														google: select.google,
													} );
												} }
												onFontArrayChange={ ( values ) => saveNameFont( values ) }
												googleFont={ nameFont[ 0 ].google }
												onGoogleFont={ ( value ) => saveNameFont( { google: value } ) }
												loadGoogleFont={ nameFont[ 0 ].loadGoogle }
												onLoadGoogleFont={ ( value ) => saveNameFont( { loadGoogle: value } ) }
												fontVariant={ nameFont[ 0 ].variant }
												onFontVariant={ ( value ) => saveNameFont( { variant: value } ) }
												fontWeight={ nameFont[ 0 ].weight }
												onFontWeight={ ( value ) => saveNameFont( { weight: value } ) }
												fontStyle={ nameFont[ 0 ].style }
												onFontStyle={ ( value ) => saveNameFont( { style: value } ) }
												fontSubset={ nameFont[ 0 ].subset }
												onFontSubset={ ( value ) => saveNameFont( { subset: value } ) }
											/>
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'occupationSettings' ) && (
								<PanelBody
									title={ __( 'Occupation Settings' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Show Occupation' ) }
										checked={ displayOccupation }
										onChange={ ( value ) => setAttributes( { displayOccupation: value } ) }
									/>
									{ displayOccupation && (
										<Fragment>
											<AdvancedColorControl
												label={ __( 'Color' ) }
												colorValue={ ( occupationFont[ 0 ].color ? occupationFont[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ ( value ) => saveOccupationFont( { color: value } ) }
											/>
											<TypographyControls
												fontSize={ occupationFont[ 0 ].size }
												onFontSize={ ( value ) => saveOccupationFont( { size: value } ) }
												fontSizeType={ occupationFont[ 0 ].sizeType }
												onFontSizeType={ ( value ) => saveOccupationFont( { sizeType: value } ) }
												lineHeight={ occupationFont[ 0 ].lineHeight }
												onLineHeight={ ( value ) => saveOccupationFont( { lineHeight: value } ) }
												lineHeightType={ occupationFont[ 0 ].lineType }
												onLineHeightType={ ( value ) => saveOccupationFont( { lineType: value } ) }
												textTransform={ occupationFont[ 0 ].textTransform }
												onTextTransform={ ( value ) => saveOccupationFont( { textTransform: value } ) }
												letterSpacing={ occupationFont[ 0 ].letterSpacing }
												onLetterSpacing={ ( value ) => saveOccupationFont( { letterSpacing: value } ) }
												fontFamily={ occupationFont[ 0 ].family }
												onFontFamily={ ( value ) => saveOccupationFont( { family: value } ) }
												onFontChange={ ( select ) => {
													saveOccupationFont( {
														family: select.value,
														google: select.google,
													} );
												} }
												onFontArrayChange={ ( values ) => saveOccupationFont( values ) }
												googleFont={ occupationFont[ 0 ].google }
												onGoogleFont={ ( value ) => saveOccupationFont( { google: value } ) }
												loadGoogleFont={ occupationFont[ 0 ].loadGoogle }
												onLoadGoogleFont={ ( value ) => saveOccupationFont( { loadGoogle: value } ) }
												fontVariant={ occupationFont[ 0 ].variant }
												onFontVariant={ ( value ) => saveOccupationFont( { variant: value } ) }
												fontWeight={ occupationFont[ 0 ].weight }
												onFontWeight={ ( value ) => saveOccupationFont( { weight: value } ) }
												fontStyle={ occupationFont[ 0 ].style }
												onFontStyle={ ( value ) => saveOccupationFont( { style: value } ) }
												fontSubset={ occupationFont[ 0 ].subset }
												onFontSubset={ ( value ) => saveOccupationFont( { subset: value } ) }
											/>
										</Fragment>
									) }
								</PanelBody>
							) }
							{ this.showSettings( 'shadowSettings' ) && (
								<PanelBody
									title={ __( 'Container Shadow' ) }
									initialOpen={ false }
								>
									<ToggleControl
										label={ __( 'Enable Shadow' ) }
										checked={ displayShadow }
										onChange={ value => setAttributes( { displayShadow: value } ) }
									/>
									{ displayShadow && (
										<Fragment>
											<AdvancedColorControl
												label={ __( 'Shadow Color' ) }
												colorValue={ ( shadow[ 0 ].color ? shadow[ 0 ].color : '' ) }
												colorDefault={ '' }
												onColorChange={ value => saveShadow( { color: value } ) }
												opacityValue={ shadow[ 0 ].opacity }
												onOpacityChange={ value => saveShadow( { opacity: value } ) }
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
									) }
								</PanelBody>
							) }
							<div className="kt-sidebar-settings-spacer"></div>
							{ this.showSettings( 'individualSettings' ) && (
								<PanelBody
									title={ __( 'Individual Settings' ) }
									initialOpen={ false }
								>
									{ renderSettings }
								</PanelBody>
							) }
						</InspectorControls>
					</Fragment>
				) }
				{ this.state.showPreset && (
					<div className="kt-select-starter-style-tabs kt-select-starter-style-infobox">
						<div className="kt-select-starter-style-tabs-title">
							{ __( 'Select Initial Style' ) }
						</div>
						<ButtonGroup className="kt-init-tabs-btn-group" aria-label={ __( 'Initial Style' ) }>
							{ map( startlayoutOptions, ( { name, key, icon } ) => (
								<Button
									key={ key }
									className="kt-inital-tabs-style-btn"
									isSmall
									onClick={ () => {
										setInitalLayout( key );
										this.setState( { showPreset: false } );
									} }
								>
									{ icon }
								</Button>
							) ) }
						</ButtonGroup>
					</div>
				) }
				{ ! this.state.showPreset && (
					<Fragment>
						{ layout && layout === 'carousel' && (
							<div className={ `kt-blocks-carousel kt-carousel-container-dotstyle-${ dotStyle }` }>
								{ itemsCount !== 1 && (
									<Slider className={ `kt-carousel-arrowstyle-${ arrowStyle } kt-carousel-dotstyle-${ dotStyle }` } { ...sliderSettings }>
										{ times( itemsCount, n =>
											<div className="kt-blocks-testimonial-carousel-item" key={ n }>
												{ renderTestimonialPreview( n ) }
											</div>
										) }
									</Slider>
								) }
								{ itemsCount === 1 && (
									times( itemsCount, n => renderTestimonialPreview( n ) )
								) }
							</div>
						) }
						{ layout && layout === 'grid' && (
							<div className={ 'kt-testimonial-grid-wrap' } style={ {
								'grid-row-gap': columnGap + 'px',
								'grid-column-gap': columnGap + 'px',
							} }>
								{ times( itemsCount, n => renderTestimonialPreview( n ) ) }
							</div>
						) }
						{ displayTitle && titleFont[ 0 ].google && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
						{ displayContent && contentFont[ 0 ].google && (
							<WebfontLoader config={ tconfig }>
							</WebfontLoader>
						) }
						{ displayName && nameFont[ 0 ].google && (
							<WebfontLoader config={ lconfig }>
							</WebfontLoader>
						) }
						{ displayOccupation && occupationFont[ 0 ].google && (
							<WebfontLoader config={ oconfig }>
							</WebfontLoader>
						) }
					</Fragment>
				) }
			</div>
		);
	}
}
export default ( KadenceTestimonials );
