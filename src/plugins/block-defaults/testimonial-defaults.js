import MeasurementControls from '../../measurement-control';
import map from 'lodash/map';
import OpacityControl from '../../opacity-control';
import { hexToRGBA } from '@kadence/helpers';
import { IconControl, TypographyControls } from '@wordpress/components';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
} = wp.blockEditor;
const {
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Modal,
	ColorIndicator,
	ButtonGroup,
	Tooltip,
} = wp.components;

import icons from '../../icons';

class KadenceTestimonialDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
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
			user: ( kadence_blocks_params.user ? kadence_blocks_params.user : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		const testimonialConfig = ( this.state.configuration && this.state.configuration[ 'kadence/testimonials' ] ? this.state.configuration[ 'kadence/testimonials' ] : {} );
		if ( testimonialConfig.mediaStyle && testimonialConfig.mediaStyle[0] ) {
			if ( testimonialConfig.mediaStyle[ 0 ].borderWidth && testimonialConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === testimonialConfig.mediaStyle[ 0 ].borderWidth[ 1 ] && testimonialConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === testimonialConfig.mediaStyle[ 0 ].borderWidth[ 2 ] && testimonialConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === testimonialConfig.mediaStyle[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { mediaBorderControl: 'linked' } );
			} else {
				this.setState( { mediaBorderControl: 'individual' } );
			}
			if ( testimonialConfig.mediaStyle[ 0 ].padding && testimonialConfig.mediaStyle[ 0 ].padding[ 0 ] === testimonialConfig.mediaStyle[ 0 ].padding[ 1 ] && testimonialConfig.mediaStyle[ 0 ].padding[ 0 ] === testimonialConfig.mediaStyle[ 0 ].padding[ 2 ] && testimonialConfig.mediaStyle[ 0 ].padding[ 0 ] === testimonialConfig.mediaStyle[ 0 ].padding[ 3 ] ) {
				this.setState( { mediaPaddingControl: 'linked' } );
			} else {
				this.setState( { mediaPaddingControl: 'individual' } );
			}
			if ( testimonialConfig.mediaStyle[ 0 ].margin && testimonialConfig.mediaStyle[ 0 ].margin[ 0 ] === testimonialConfig.mediaStyle[ 0 ].margin[ 1 ] && testimonialConfig.mediaStyle[ 0 ].margin[ 0 ] === testimonialConfig.mediaStyle[ 0 ].margin[ 2 ] && testimonialConfig.mediaStyle[ 0 ].margin[ 0 ] === testimonialConfig.mediaStyle[ 0 ].margin[ 3 ] ) {
				this.setState( { mediaMarginControl: 'linked' } );
			} else {
				this.setState( { mediaMarginControl: 'individual' } );
			}
			if ( testimonialConfig.containerBorderWidth[ 0 ] === testimonialConfig.containerBorderWidth[ 1 ] && testimonialConfig.containerBorderWidth[ 0 ] === testimonialConfig.containerBorderWidth[ 2 ] && testimonialConfig.containerBorderWidth[ 0 ] === testimonialConfig.containerBorderWidth[ 3 ] ) {
				this.setState( { containerBorderControl: 'linked' } );
			} else {
				this.setState( { containerBorderControl: 'individual' } );
			}
			if ( testimonialConfig.containerPadding[ 0 ] === testimonialConfig.containerPadding[ 1 ] && testimonialConfig.containerPadding[ 0 ] === testimonialConfig.containerPadding[ 2 ] && testimonialConfig.containerPadding[ 0 ] === testimonialConfig.containerPadding[ 3 ] ) {
				this.setState( { containerPaddingControl: 'linked' } );
			} else {
				this.setState( { containerPaddingControl: 'individual' } );
			}
		}
		if ( testimonialConfig.mediaStyle && testimonialConfig.mediaStyle[ 0 ] ) {
			if ( testimonialConfig.mediaStyle[ 0 ].borderWidth && testimonialConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === testimonialConfig.mediaStyle[ 0 ].borderWidth[ 1 ] && testimonialConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === testimonialConfig.mediaStyle[ 0 ].borderWidth[ 2 ] && testimonialConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === testimonialConfig.mediaStyle[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { mediaBorderControl: 'linked' } );
			} else {
				this.setState( { mediaBorderControl: 'individual' } );
			}
			if ( testimonialConfig.mediaStyle[ 0 ].padding && testimonialConfig.mediaStyle[ 0 ].padding[ 0 ] === testimonialConfig.mediaStyle[ 0 ].padding[ 1 ] && testimonialConfig.mediaStyle[ 0 ].padding[ 0 ] === testimonialConfig.mediaStyle[ 0 ].padding[ 2 ] && testimonialConfig.mediaStyle[ 0 ].padding[ 0 ] === testimonialConfig.mediaStyle[ 0 ].padding[ 3 ] ) {
				this.setState( { mediaPaddingControl: 'linked' } );
			} else {
				this.setState( { mediaPaddingControl: 'individual' } );
			}
			if ( testimonialConfig.mediaStyle[ 0 ].margin && testimonialConfig.mediaStyle[ 0 ].margin[ 0 ] === testimonialConfig.mediaStyle[ 0 ].margin[ 1 ] && testimonialConfig.mediaStyle[ 0 ].margin[ 0 ] === testimonialConfig.mediaStyle[ 0 ].margin[ 2 ] && testimonialConfig.mediaStyle[ 0 ].margin[ 0 ] === testimonialConfig.mediaStyle[ 0 ].margin[ 3 ] ) {
				this.setState( { mediaMarginControl: 'linked' } );
			} else {
				this.setState( { mediaMarginControl: 'individual' } );
			}
		}
		if ( testimonialConfig.titleFont && testimonialConfig.titleFont[ 0 ] ) {
			if ( testimonialConfig.titleFont[ 0 ].padding && testimonialConfig.titleFont[ 0 ].padding[ 0 ] === testimonialConfig.titleFont[ 0 ].padding[ 1 ] && testimonialConfig.titleFont[ 0 ].padding[ 0 ] === testimonialConfig.titleFont[ 0 ].padding[ 2 ] && testimonialConfig.titleFont[ 0 ].padding[ 0 ] === testimonialConfig.titleFont[ 0 ].padding[ 3 ] ) {
				this.setState( { titlePaddingControl: 'linked' } );
			} else {
				this.setState( { titlePaddingControl: 'individual' } );
			}
			if ( testimonialConfig.titleFont[ 0 ].margin && testimonialConfig.titleFont[ 0 ].margin[ 0 ] === testimonialConfig.titleFont[ 0 ].margin[ 1 ] && testimonialConfig.titleFont[ 0 ].margin[ 0 ] === testimonialConfig.titleFont[ 0 ].margin[ 2 ] && testimonialConfig.titleFont[ 0 ].margin[ 0 ] === testimonialConfig.titleFont[ 0 ].margin[ 3 ] ) {
				this.setState( { titleMarginControl: 'linked' } );
			} else {
				this.setState( { titleMarginControl: 'individual' } );
			}
		}
		if ( testimonialConfig.containerBorderWidth && testimonialConfig.containerBorderWidth[ 0 ] ) {
			if ( testimonialConfig.containerBorderWidth[ 0 ] === testimonialConfig.containerBorderWidth[ 1 ] && testimonialConfig.containerBorderWidth[ 0 ] === testimonialConfig.containerBorderWidth[ 2 ] && testimonialConfig.containerBorderWidth[ 0 ] === testimonialConfig.containerBorderWidth[ 3 ] ) {
				this.setState( { containerBorderControl: 'linked' } );
			} else {
				this.setState( { containerBorderControl: 'individual' } );
			}
		}
		if ( testimonialConfig.containerPadding && testimonialConfig.containerPadding[ 0 ] ) {
			if ( testimonialConfig.containerPadding[ 0 ] === testimonialConfig.containerPadding[ 1 ] && testimonialConfig.containerPadding[ 0 ] === testimonialConfig.containerPadding[ 2 ] && testimonialConfig.containerPadding[ 0 ] === testimonialConfig.containerPadding[ 3 ] ) {
				this.setState( { containerPaddingControl: 'linked' } );
			} else {
				this.setState( { containerPaddingControl: 'individual' } );
			}
		}
		if ( testimonialConfig.ratingStyles && testimonialConfig.ratingStyles[ 0 ] ) {
			if ( testimonialConfig.ratingStyles[ 0 ].margin && testimonialConfig.ratingStyles[ 0 ].margin[ 0 ] === testimonialConfig.ratingStyles[ 0 ].margin[ 1 ] && testimonialConfig.ratingStyles[ 0 ].margin[ 0 ] === testimonialConfig.ratingStyles[ 0 ].margin[ 2 ] && testimonialConfig.ratingStyles[ 0 ].margin[ 0 ] === testimonialConfig.ratingStyles[ 0 ].margin[ 3 ] ) {
				this.setState( { ratingMarginControl: 'linked' } );
			} else {
				this.setState( { ratingMarginControl: 'individual' } );
			}
		}
		if ( testimonialConfig.iconStyles && testimonialConfig.iconStyles[ 0 ] ) {
			if ( testimonialConfig.iconStyles[ 0 ].border && testimonialConfig.iconStyles[ 0 ].border[ 0 ] === testimonialConfig.iconStyles[ 0 ].border[ 1 ] && testimonialConfig.iconStyles[ 0 ].border[ 0 ] === testimonialConfig.iconStyles[ 0 ].border[ 2 ] && testimonialConfig.iconStyles[ 0 ].border[ 0 ] === testimonialConfig.iconStyles[ 0 ].border[ 3 ] ) {
				this.setState( { iconBorderControl: 'linked' } );
			} else {
				this.setState( { iconBorderControl: 'individual' } );
			}
			if ( testimonialConfig.iconStyles[ 0 ].padding && testimonialConfig.iconStyles[ 0 ].padding[ 0 ] === testimonialConfig.iconStyles[ 0 ].padding[ 1 ] && testimonialConfig.iconStyles[ 0 ].padding[ 0 ] === testimonialConfig.iconStyles[ 0 ].padding[ 2 ] && testimonialConfig.iconStyles[ 0 ].padding[ 0 ] === testimonialConfig.iconStyles[ 0 ].padding[ 3 ] ) {
				this.setState( { iconPaddingControl: 'linked' } );
			} else {
				this.setState( { iconPaddingControl: 'individual' } );
			}
			if ( testimonialConfig.iconStyles[ 0 ].margin && testimonialConfig.iconStyles[ 0 ].margin[ 0 ] === testimonialConfig.iconStyles[ 0 ].margin[ 1 ] && testimonialConfig.iconStyles[ 0 ].margin[ 0 ] === testimonialConfig.iconStyles[ 0 ].margin[ 2 ] && testimonialConfig.iconStyles[ 0 ].margin[ 0 ] === testimonialConfig.iconStyles[ 0 ].margin[ 3 ] ) {
				this.setState( { iconMarginControl: 'linked' } );
			} else {
				this.setState( { iconMarginControl: 'individual' } );
			}
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/testimonials' ] !== undefined && typeof blockSettings[ 'kadence/testimonials' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/testimonials' ] } );
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
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} );
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, configuration: config, isOpen: false } );
			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/testimonials' ] === undefined || config[ 'kadence/testimonials' ].length == 0 ) {
			config[ 'kadence/testimonials' ] = {};
		}
		config[ 'kadence/testimonials' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl, titlePaddingControl, titleMarginControl, ratingMarginControl, iconBorderControl, iconPaddingControl, iconMarginControl, configuration, isOpen, } = this.state;
		const testimonialConfig = ( configuration && configuration[ 'kadence/testimonials' ] ? configuration[ 'kadence/testimonials' ] : {} );
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
			this.saveConfigState( 'columns', columnarray );
		};
		const styleOptions = [
			{ key: 'basic', name: __( 'Basic' ), icon: icons.testimonialBasic },
			{ key: 'card', name: __( 'Card' ), icon: icons.testimonialCard },
			{ key: 'bubble', name: __( 'Bubble' ), icon: icons.testimonialBubble },
			{ key: 'inlineimage', name: __( 'Image In Content' ), icon: icons.testimonialInline },
		];
		const columnControlTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: __( 'Linked' ) },
			{ key: 'individual', name: __( 'Individual' ), icon: __( 'Individual' ) },
		];
		const columnControl = ( undefined !== testimonialConfig.columnControl ? testimonialConfig.columnControl : 'linked' );
		const columns = ( undefined !== testimonialConfig.columns && undefined !== testimonialConfig.columns[ 2 ] ? testimonialConfig.columns : [ 1, 1, 1, 1, 1, 1 ] );
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
								onClick={ () => this.saveConfigState( 'columnControl', key ) }
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
							onChange={ ( value ) => this.saveConfigState( 'columns', [ value, columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 1200px - 1499px' ) }
							value={ columns[ 1 ] }
							onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ], value, columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 992px - 1199px' ) }
							value={ columns[ 2 ] }
							onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ], columns[ 1 ], value, columns[ 3 ], columns[ 4 ], columns[ 5 ] ] ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 768px - 991px' ) }
							value={ columns[ 3 ] }
							onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ], columns[ 1 ], columns[ 2 ], value, columns[ 4 ], columns[ 5 ] ] ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen 544px - 767px' ) }
							value={ columns[ 4 ] }
							onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], value, columns[ 5 ] ] ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label={ __( 'Screen Below 543px' ) }
							value={ columns[ 5 ] }
							onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], value ] ) }
							min={ 1 }
							max={ 5 }
						/>
					</Fragment>
				) }
			</Fragment>
		);
		const mediaStylesDefaultStyles = [ {
			width: 60,
			backgroundSize: 'cover',
			background: '',
			backgroundOpacity: 1,
			border: '#555555',
			borderRadius: '',
			borderWidth: [ 0, 0, 0, 0 ],
			padding: [ 0, 0, 0, 0 ],
			margin: [ '', '', '', '' ],
			ratio: '',
		} ];
		const mediaStyles = ( undefined !== testimonialConfig.mediaStyles && testimonialConfig.mediaStyles[ 0 ] ? testimonialConfig.mediaStyles : mediaStylesDefaultStyles );
		const savemediaStyles = ( value ) => {
			const newUpdate = mediaStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'mediaStyles', newUpdate );
		};
		const iconStylesDefaultStyles = [ {
			size: 30,
			margin: [ '', '', '', '' ],
			padding: [ '', '', '', '' ],
			borderWidth: [ '', '', '', '' ],
			borderRadius: '',
			border: '',
			borderOpacity: 1,
			color: '',
			background: '',
			backgroundOpacity: 1,
			title: '',
			icon: 'fas_quote-left',
			stroke: 2,
		} ];
		const iconStyles = ( undefined !== testimonialConfig.iconStyles && testimonialConfig.iconStyles[ 0 ] ? testimonialConfig.iconStyles : iconStylesDefaultStyles );
		const saveIconStyles = ( value ) => {
			const newUpdate = iconStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'iconStyles', newUpdate );
		};
		const titleFontDefaultStyles = [ {
			color: '',
			level: 2,
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 0, 0 ],
			margin: [ 0, 0, 15, 0 ],
		} ];
		const titleFont = ( undefined !== testimonialConfig.titleFont && testimonialConfig.titleFont[ 0 ] ? testimonialConfig.titleFont : titleFontDefaultStyles );
		const saveTitleFont = ( value ) => {
			const newUpdate = titleFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'titleFont', newUpdate );
		};
		const contentFontDefaultStyles = [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ];
		const contentFont = ( undefined !== testimonialConfig.contentFont && testimonialConfig.contentFont[ 0 ] ? testimonialConfig.contentFont : contentFontDefaultStyles );
		const saveContentFont = ( value ) => {
			const newUpdate = contentFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'contentFont', newUpdate );
		};
		const nameFontDefaultStyles = [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ];
		const nameFont = ( undefined !== testimonialConfig.nameFont && testimonialConfig.nameFont[ 0 ] ? testimonialConfig.nameFont : nameFontDefaultStyles );
		const saveNameFont = ( value ) => {
			const newUpdate = nameFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'nameFont', newUpdate );
		};
		const occupationFontDefaultStyles = [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ];
		const occupationFont = ( undefined !== testimonialConfig.occupationFont && testimonialConfig.occupationFont[ 0 ] ? testimonialConfig.occupationFont : occupationFontDefaultStyles );
		const saveOccupationFont = ( value ) => {
			const newUpdate = occupationFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'occupationFont', newUpdate );
		};
		const shadowDefaultStyles = [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ];
		const shadow = ( undefined !== testimonialConfig.shadow && testimonialConfig.shadow[ 0 ] ? testimonialConfig.shadow : shadowDefaultStyles );
		const saveShadow = ( value ) => {
			const newUpdate = shadow.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'shadow', newUpdate );
		};
		const ratingStylesDefaultStyles = [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ];
		const ratingStyles = ( undefined !== testimonialConfig.ratingStyles && testimonialConfig.ratingStyles[ 0 ] ? testimonialConfig.ratingStyles : ratingStylesDefaultStyles );
		const saveRatingStyles = ( value ) => {
			const newUpdate = ratingStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'ratingStyles', newUpdate );
		};
		const style = ( undefined !== testimonialConfig.style ? testimonialConfig.style : 'basic' );
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.testimonialBlock }</span>
					{ __( 'Testimonials' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Testimonials' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/testimonials', testimonialConfig );
						} }>
						{ this.showSettings( 'allSettings' ) && (
							<Fragment>
								<PanelBody>
									{ this.showSettings( 'styleSettings' ) && (
										<ToggleControl
											label={ __( 'Show Presets' ) }
											checked={ ( undefined !== testimonialConfig.showPresets ? testimonialConfig.showPresets : true ) }
											onChange={ value => this.saveConfigState( 'showPresets', value ) }
										/>
									) }
									<SelectControl
										label={ __( 'Content Align' ) }
										value={ ( undefined !== testimonialConfig.hAlign ? testimonialConfig.hAlign : 'center' ) }
										options={ [
											{ value: 'center', label: __( 'Center' ) },
											{ value: 'left', label: __( 'Left' ) },
											{ value: 'right', label: __( 'Right' ) },
										] }
										onChange={ value => this.saveConfigState( 'hAlign', value ) }
									/>
									{ this.showSettings( 'layoutSettings' ) && (
										<SelectControl
											label={ __( 'Layout' ) }
											value={ ( undefined !== testimonialConfig.layout ? testimonialConfig.layout : 'grid' ) }
											options={ [
												{ value: 'grid', label: __( 'Grid' ) },
												{ value: 'carousel', label: __( 'Carousel' ) },
											] }
											onChange={ value => this.saveConfigState( 'layout', value ) }
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
															onClick={ () => this.saveConfigState( 'style', key ) }
														>
															{ icon }
														</Button>
													</Tooltip>
												) ) }
											</ButtonGroup>
										</Fragment>
									) }
									{ this.showSettings( 'columnSettings' ) && (
										<Fragment>
											{ columnControls }
											<RangeControl
												label={ __( 'Column Gap' ) }
												value={ ( undefined !== testimonialConfig.columnGap ? testimonialConfig.columnGap : 30 ) }
												onChange={ ( value ) => this.saveConfigState( 'columnGap', value ) }
												min={ 0 }
												max={ 80 }
											/>
										</Fragment>
									) }
								</PanelBody>
								{ this.showSettings( 'carouselSettings' ) && (
									<PanelBody
										title={ __( 'Carousel Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Carousel Auto Play' ) }
											checked={ ( undefined !== testimonialConfig.autoPlay ? testimonialConfig.autoPlay : false ) }
											onChange={ ( value ) => this.saveConfigState( 'autoPlay', value ) }
										/>
										<RangeControl
											label={ __( 'Autoplay Speed' ) }
											value={ ( undefined !== testimonialConfig.autoSpeed ? testimonialConfig.autoSpeed : 7000 ) }
											onChange={ ( value ) => this.saveConfigState( 'autoSpeed', value ) }
											min={ 500 }
											max={ 15000 }
											step={ 10 }
										/>
										<RangeControl
											label={ __( 'Carousel Slide Transition Speed' ) }
											value={ ( undefined !== testimonialConfig.transSpeed ? testimonialConfig.transSpeed : 400 ) }
											onChange={ ( value ) => this.saveConfigState( 'transSpeed', value ) }
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
											value={ ( undefined !== testimonialConfig.slidesScroll ? testimonialConfig.slidesScroll : '1' ) }
											onChange={ ( value ) => this.saveConfigState( 'slidesScroll', value ) }
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
											value={ ( undefined !== testimonialConfig.arrowStyle ? testimonialConfig.arrowStyle : 'whiteondark' ) }
											onChange={ ( value ) => this.saveConfigState( 'arrowStyle', value ) }
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
											value={ ( undefined !== testimonialConfig.dotStyle ? testimonialConfig.dotStyle : 'dark' ) }
											onChange={ ( value ) => this.saveConfigState( 'dotStyle', value ) }
										/>
									</PanelBody>
								) }
								{ this.showSettings( 'containerSettings' ) && (
									<PanelBody
										title={ __( 'Container Settings' ) }
										initialOpen={ false }
									>
										<MeasurementControls
											label={ __( 'Container Border Width (px)' ) }
											measurement={ ( undefined !== testimonialConfig.containerBorderWidth ? testimonialConfig.containerBorderWidth : [ '', '', '', '' ] ) }
											control={ containerBorderControl }
											onChange={ ( value ) => this.saveConfigState( 'containerBorderWidth', value ) }
											onControl={ ( value ) => this.setState( { containerBorderControl: value } ) }
											min={ 0 }
											max={ 40 }
											step={ 1 }
										/>
										<RangeControl
											label={ __( 'Container Border Radius (px)' ) }
											value={ ( undefined !== testimonialConfig.containerBorderRadius ? testimonialConfig.containerBorderRadius : 0 ) }
											onChange={ value => this.saveConfigState( 'containerBorderRadius', value ) }
											step={ 1 }
											min={ 0 }
											max={ 200 }
										/>
										<h2>{ __( 'Container Background' ) }</h2>
										<ColorIndicator className="kt-color-indicate" colorValue={ ( undefined === testimonialConfig.containerBackground ? '' : hexToRGBA( testimonialConfig.containerBackground, ( testimonialConfig.containerBackgroundOpacity !== undefined ? testimonialConfig.containerBackgroundOpacity : 1 ) ) ) } />
										<ColorPalette
											value={ ( undefined !== testimonialConfig.containerBackground ? testimonialConfig.containerBackground : '' ) }
											onChange={ value => this.saveConfigState( 'containerBackground', value ) }
										/>
										<OpacityControl
											value={ ( undefined !== testimonialConfig.containerBackgroundOpacity ? testimonialConfig.containerBackgroundOpacity : 1 ) }
											onChanged={ value => this.saveConfigState( 'containerBackgroundOpacity', value ) }
											label={ __( 'Background Opacity' ) }
										/>
										<h2>{ __( 'Container Border' ) }</h2>
										<ColorIndicator className="kt-color-indicate" colorValue={ ( undefined === testimonialConfig.containerBorder ? '#eeeeee' : hexToRGBA( testimonialConfig.containerBorder, ( testimonialConfig.containerBorderOpacity !== undefined ? testimonialConfig.containerBorderOpacity : 1 ) ) ) } />
										<ColorPalette
											value={ ( undefined !== testimonialConfig.containerBorder ? testimonialConfig.containerBorder : '#eeeeee' ) }
											onChange={ value => this.saveConfigState( 'containerBorder', value ) }
										/>
										<OpacityControl
											value={ ( undefined !== testimonialConfig.containerBorderOpacity ? testimonialConfig.containerBorderOpacity : 1 ) }
											onChanged={ value => this.saveConfigState( 'containerBorderOpacity', value ) }
											label={ __( 'Border Opacity' ) }
										/>
										<div className="kt-spacer-sidebar-15"></div>
										<MeasurementControls
											label={ __( 'Container Padding' ) }
											measurement={ ( undefined !== testimonialConfig.containerPadding ? testimonialConfig.containerPadding : [ 20, 20, 20, 20 ] ) }
											control={ containerPaddingControl }
											onChange={ ( value ) => this.saveConfigState( 'containerPadding', value ) }
											onControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
											min={ 0 }
											max={ 100 }
											step={ 1 }
										/>
										<RangeControl
											label={ __( 'Container Max Width (px)' ) }
											value={ ( undefined !== testimonialConfig.containerMaxWidth ? testimonialConfig.containerMaxWidth : 500 ) }
											onChange={ value => this.saveConfigState( 'containerMaxWidth', value ) }
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
											checked={ ( undefined !== testimonialConfig.displayIcon ? testimonialConfig.displayIcon : false ) }
											onChange={ ( value ) => this.saveConfigState( 'displayIcon', value ) }
										/>
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
										<h2 className="kt-tab-wrap-title">{ __( 'Color' ) }</h2>
										<ColorPalette
											value={ iconStyles[ 0 ].color }
											onChange={ ( value ) => saveIconStyles( { color: value } ) }
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
										<h2>{ __( 'Icon Background' ) }</h2>
										<ColorIndicator className="kt-color-indicate" colorValue={ ( undefined === iconStyles[ 0 ].background ? '' : hexToRGBA( iconStyles[ 0 ].background, ( iconStyles[ 0 ].backgroundOpacity !== undefined ? iconStyles[ 0 ].backgroundOpacity : 1 ) ) ) } />
										<ColorPalette
											value={ iconStyles[ 0 ].background }
											onChange={ value => saveIconStyles( { background: value } ) }
										/>
										<OpacityControl
											value={ iconStyles[ 0 ].backgroundOpacity }
											onChanged={ value => saveIconStyles( { backgroundOpacity: value } ) }
											label={ __( 'Background Opacity' ) }
										/>
										<h2>{ __( 'Icon Border Color' ) }</h2>
										<ColorPalette
											value={ iconStyles[ 0 ].border }
											onChange={ value => saveIconStyles( { border: value } ) }
										/>
										<OpacityControl
											value={ iconStyles[ 0 ].borderOpacity }
											onChanged={ value => saveIconStyles( { borderOpacity: value } ) }
											label={ __( 'Border Opacity' ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'titleSettings' ) && (
									<PanelBody
										title={ __( 'Title Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Show Title' ) }
											checked={ ( undefined !== testimonialConfig.displayTitle ? testimonialConfig.displayTitle : true ) }
											onChange={ ( value ) => this.saveConfigState( 'displayTitle', value ) }
										/>
										<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
										<ColorPalette
											value={ titleFont[ 0 ].color }
											onChange={ value => saveTitleFont( { color: value } ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'ratingSettings' ) && (
									<PanelBody
										title={ __( 'Rating Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Show Rating' ) }
											checked={ ( undefined !== testimonialConfig.displayRating ? testimonialConfig.displayRating : false ) }
											onChange={ ( value ) => this.saveConfigState( 'displayRating', value ) }
										/>
										<h2 className="kt-tab-wrap-title">{ __( 'Color' ) }</h2>
										<ColorPalette
											value={ ratingStyles[ 0 ].color }
											onChange={ ( value ) => saveRatingStyles( { color: value } ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'contentSettings' ) && (
									<PanelBody
										title={ __( 'Content Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Show Content' ) }
											checked={ ( undefined !== testimonialConfig.displayContent ? testimonialConfig.displayContent : true ) }
											onChange={ ( value ) => this.saveConfigState( 'displayContent', value ) }
										/>
										<h2 className="kt-tab-wrap-title">{ __( 'Color' ) }</h2>
										<ColorPalette
											value={ contentFont[ 0 ].color }
											onChange={ value => saveContentFont( { color: value } ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'mediaSettings' ) && (
									<PanelBody
										title={ __( 'Media Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Show Media' ) }
											checked={ ( undefined !== testimonialConfig.displayMedia ? testimonialConfig.displayMedia : true ) }
											onChange={ ( value ) => this.saveConfigState( 'displayMedia', value ) }
										/>
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
										<h2>{ __( 'Media Background' ) }</h2>
										<ColorPalette
											value={ mediaStyles[ 0 ].background }
											onChange={ value => savemediaStyles( { background: value } ) }
										/>
										<OpacityControl
											value={ mediaStyles[ 0 ].backgroundOpacity }
											onChanged={ value => savemediaStyles( { backgroundOpacity: value } ) }
											label={ __( 'Background Opacity' ) }
										/>
										<h2>{ __( 'Media Border Color' ) }</h2>
										<ColorPalette
											value={ mediaStyles[ 0 ].border }
											onChange={ value => savemediaStyles( { border: value } ) }
										/>
										<OpacityControl
											value={ mediaStyles[ 0 ].borderOpacity }
											onChanged={ value => savemediaStyles( { borderOpacity: value } ) }
											label={ __( 'Border Opacity' ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'nameSettings' ) && (
									<PanelBody
										title={ __( 'Name Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Show Name' ) }
											checked={ ( undefined !== testimonialConfig.displayName ? testimonialConfig.displayName : true ) }
											onChange={ ( value ) => this.saveConfigState( 'displayName', value ) }
										/>
										<h2 className="kt-tab-wrap-title">{ __( 'Color' ) }</h2>
										<ColorPalette
											value={ nameFont[ 0 ].color }
											onChange={ ( value ) => saveNameFont( { color: value } ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'occupationSettings' ) && (
									<PanelBody
										title={ __( 'Occupation Settings' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Show Occupation' ) }
											checked={ ( undefined !== testimonialConfig.displayOccupation ? testimonialConfig.displayOccupation : true ) }
											onChange={ ( value ) => this.saveConfigState( 'displayOccupation', value ) }
										/>
										<h2 className="kt-tab-wrap-title">{ __( 'Color' ) }</h2>
										<ColorPalette
											value={ occupationFont[ 0 ].color }
											onChange={ ( value ) => saveOccupationFont( { color: value } ) }
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
											letterSpacing={ occupationFont[ 0 ].letterSpacing }
											onLetterSpacing={ ( value ) => saveOccupationFont( { letterSpacing: value } ) }
											textTransform={ occupationFont[ 0 ].textTransform }
											onTextTransform={ ( value ) => saveOccupationFont( { textTransform: value } ) }
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
									</PanelBody>
								) }
								{ this.showSettings( 'shadowSettings' ) && (
									<PanelBody
										title={ __( 'Container Shadow' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Enable Shadow' ) }
											checked={ ( undefined !== testimonialConfig.displayShadow ? testimonialConfig.displayShadow : true ) }
											onChange={ value => this.saveConfigState( 'displayShadow', value ) }
										/>
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
									</PanelBody>
								) }
							</Fragment>
						) }
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/testimonials', testimonialConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceTestimonialDefault;
