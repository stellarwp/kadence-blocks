/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icon stuff
 */
import times from 'lodash/times';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
import IcoNames from '../../svgiconsnames';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	InspectorControls,
	ColorPalette,
	URLInput,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Component,
} = wp.element;
const {
	PanelColor,
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
} = wp.components;

class KadenceIcons extends Component {
	constructor() {
		super( ...arguments );
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
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { icons } = attributes;

		let newItems = icons.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( { 
			icons: newItems,
		} );
	}
	render() {
		const { attributes: { iconCount, icons, blockAlignment, textAlignment, uniqueID }, className, setAttributes, clientId } = this.props;
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const renderIconSettings = (index) => {
			return (
				<PanelBody
					title={ __( 'Icon' ) + ' ' + (index+1) + ' ' + __( 'Settings' ) }
					initialOpen={ ( 1 == iconCount ? true : false ) }
				>
					<FontIconPicker
						icons={ IcoNames }
						value={ icons[ index ].icon }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
						appendTo="body"
						renderFunc={ renderSVG }
						theme="default"
						isMulti={ false }
					/>
					<RangeControl
						label={ __( 'Icon Size' ) }
						value={ icons[ index ].size }
						onChange={ value => {
							this.saveArrayUpdate( { size: value }, index);
						} }
						min={ 5 }
						max={ 250 }
					/>
					{ icons[ index ].icon && 'fe' === icons[ index ].icon.substring(0, 2) && (
						<RangeControl
							label={ __( 'Line Width' ) }
							value={ icons[ index ].width }
							onChange={ value => {
								this.saveArrayUpdate( { width: value }, index);
							} }
							min={ 0.5 }
							max={ 4 }
						/>
					) }
					<PanelColor
						title={ __( 'Icon Color' ) }
						colorValue={ icons[ index ].color }
					>
						<ColorPalette
							value={ icons[ index ].color }
							onChange={ value => {
								this.saveArrayUpdate( { color: value }, index);
							} }
						/>
					</PanelColor>
					<SelectControl
						label={ __( 'Icon Style' ) }
						value={ icons[ index ].style }
						options={ [
							{ value: 'default', label: __( 'Default' ) },
							{ value: 'stacked', label: __( 'Stacked' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { style: value }, index);
						} }
					/>
					{ icons[ index ].style != 'default' && (
						<PanelColor
							title={ __( 'Icon Background' ) }
							colorValue={ icons[ index ].background }
						>
							<ColorPalette
								value={ icons[ index ].background }
								onChange={ value => {
									this.saveArrayUpdate( { background: value }, index);
								} }
							/>
						</PanelColor>
					) }
					{ icons[ index ].style != 'default' && (
						<PanelColor
							title={ __( 'Border Color' ) }
							colorValue={ icons[ index ].border }
						>
							<ColorPalette
								value={ icons[ index ].border }
								onChange={ value => {
									this.saveArrayUpdate( { border: value }, index);
								} }
							/>
						</PanelColor>
					) }
					{ icons[ index ].style != 'default' && (
						<RangeControl
							label={ __( 'Border Size (px)' ) }
							value={ icons[ index ].borderWidth }
							onChange={ value => {
								this.saveArrayUpdate( { borderWidth: value }, index);
							} }
							min={ 0 }
							max={ 20 }
						/>
					) }
					{ icons[ index ].style != 'default' && (
						<RangeControl
							label={ __( 'Border Radius (%)' ) }
							value={ icons[ index ].borderRadius }
							onChange={ value => {
								this.saveArrayUpdate( { borderRadius: value }, index);
							} }
							min={ 0 }
							max={ 50 }
						/>
					) }
					{ icons[ index ].style != 'default' && (
						<RangeControl
							label={ __( 'Padding (px)' ) }
							value={ icons[ index ].padding }
							onChange={ value => {
								this.saveArrayUpdate( { padding: value }, index);
							} }
							min={ 0 }
							max={ 180 }
						/>
					) }
					<label class="components-base-control__label">{ __( 'Link' ) }</label>
					<URLInput
						value={ icons[ index ].link }
						onChange={ value => {
							this.saveArrayUpdate( { link: value }, index);
						} }
					/>
					<SelectControl
						label={ __( 'Link Target' ) }
						value={ icons[ index ].target }
						options={ [
							{ value: '_self', label: __( 'Same Window' ) },
							{ value: '_blank', label: __( 'New Window' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { target: value }, index);
						} }
					/>
					<TextControl
						label={ __( 'Title for Accessibility' ) }
						value={ icons[ index ].title }
						onChange={ value => {
							this.saveArrayUpdate( { title: value }, index );
						} }
					/>
				</PanelBody>
			);
		};
		const renderSettings = (
			<div>
				{ times( iconCount, n => renderIconSettings( n ) ) }
			</div>
		);
		const renderIconsPreview = (index) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` } >
					{ icons[ index ].icon && (
						<GenIcon className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }`} name={ icons[ index ].icon } size={ icons[ index ].size } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
							color: ( icons[ index ].color ? icons[ index ].color : undefined ),
							backgroundColor: ( icons[ index ].background && icons[ index ].style != 'default' ? icons[ index ].background : undefined ),
							padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
							borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
							borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
						} } />
					) }
				</div>
			);
		};
		return (
			<div className={ className }>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ blockAlignment => setAttributes( { blockAlignment } ) }
					/>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ textAlignment => setAttributes( { textAlignment } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody
						title={ __( 'Icon Count' ) }
						initialOpen={ true }
					>
						<RangeControl
							label={ __( 'Number of Icons' ) }
							value={ iconCount }
							onChange={ newcount => {
								let newicons = icons;
								if ( newicons.length < newcount ) {
									let amount = Math.abs(newcount - newicons.length); 
									{ times( amount, n => {
										newicons.push( {
											icon: 'fe_aperture',
											link: '',
											target: '_self',
											size: 50,
											width: 2,
											title: '',
											color: '#444444',
											background: 'transparent',
											border: '#444444',
											borderRadius: 0,
											borderWidth: 2,
											padding: 20,
											style: 'default',
										} );
									} ) };
									setAttributes( { icons: newicons } );
								}
								setAttributes( { iconCount: newcount } );
							} }
							min={ 1 }
							max={ 10 }
						/>
					</PanelBody>
					{ renderSettings }
				</InspectorControls>
				<div className={ `kt-svg-icons ${clientId}` } style={ {
					textAlign: ( textAlignment ? textAlignment : undefined ),
				} } >
					{ times( iconCount, n => renderIconsPreview( n ) ) }
				</div>
			</div>
		);
	}
}
export default ( KadenceIcons );

