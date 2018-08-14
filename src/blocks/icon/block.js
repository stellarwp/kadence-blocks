/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icon stuff
 */
import icons from './icon';
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
const { withState } = wp.compose;
const {
	InspectorControls,
	ColorPalette,
	URLInput,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	PanelColor,
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
} = wp.components;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/icon', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Icon' ), // Block title.
	icon: {
		src: icons.block,
	},
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'icon' ),
		__( 'svg' ),
		__( 'KT' ),
	],
	attributes: {
		icons: {
			type: 'array',
			default: [ {
				icon: 'fe_aperture',
				link: '',
				target: '_self',
				size: 18,
				width: 2,
				title: '',
				color: '#444444',
				background: 'transparent',
				border: '#444444',
				borderRadius: 0,
				borderWidth: 2,
				padding: 20,
				style: 'default',
			}],
		},
		iconCount: {
			type: 'number',
			default: 1,
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
		blockAlignment: {
			type: 'string',
			default: 'center',
		},
		textAlignment: {
			type: 'string',
			default: 'center',
		},
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit: props => {
		const { attributes: { iconCount, icons, blockAlignment, textAlignment, uniqueID }, className, setAttributes } = props;
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const saveArray = ( key, value, index ) => {
			if ( ! uniqueID ) {
				setAttributes( { 
					uniqueID : '_' + Math.random().toString( 36 ).substr( 2, 9 ),
				} );
			}
			let newicons = [];
			{ times( iconCount, n => {
				newicons[ n ] = icons[ n ];
				if ( n === index ) {
					newicons[ n ][ key ] = value;
				}
			} ); }
			setAttributes( { 
				icons: newicons,
			} );
		};
		const renderIconSettings = (index) => {
			return (
				<div>
					<PanelBody
						title={ __( 'Icon' ) + ' ' + (index+1) + ' ' + __( 'Settings' ) }
						initialOpen={ ( 1 == iconCount ? true : false ) }
					>
						<FontIconPicker
							icons={ IcoNames }
							value={ icons[ index ].icon }
							onChange={ value => {
								return saveArray( 'icon', value, index);
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
								return saveArray( 'size', value, index);
							} }
							min={ 5 }
							max={ 250 }
						/>
						{ icons[ index ].icon && 'fe' === icons[ index ].icon.substring(0, 2) && (
							<RangeControl
								label={ __( 'Line Width' ) }
								value={ icons[ index ].width }
								onChange={ value => {
									return saveArray( 'width', value, index);
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
									return saveArray( 'color', value, index);
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
								return saveArray( 'style', value, index);
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
										return saveArray( 'background', value, index);
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
										return saveArray( 'border', value, index);
									} }
								/>
							</PanelColor>
						) }
						{ icons[ index ].style != 'default' && (
							<RangeControl
								label={ __( 'Border Size (px)' ) }
								value={ icons[ index ].borderWidth }
								onChange={ value => {
									return saveArray( 'borderWidth', value, index);
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
									return saveArray( 'borderRadius', value, index);
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
									return saveArray( 'padding', value, index);
								} }
								min={ 0 }
								max={ 180 }
							/>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Link Settings' ) }
						initialOpen={ false }
					>
						<label class="components-base-control__label">{ __( 'Link' ) }</label>
						<URLInput
							value={ icons[ index ].link }
							onChange={ value => {
								return saveArray( 'link', value, index);
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
								return saveArray( 'target', value, index);
							} }
						/>
						<TextControl
							label={ __( 'Title for Accessibility' ) }
							value={ icons[ index ].title }
							onChange={ value => {
								return saveArray( 'title', value, index);
							} }
						/>
					</PanelBody>
				</div>
			);
		};
		const renderSettings = (
			<div>
				{ times( iconCount, n => renderIconSettings( n ) ) }
			</div>
		);
		const renderIconsPreview = (index) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style }` } >
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
		const renderIcons = (
			<div>
				{ times( iconCount, n => renderIconsPreview( n ) ) }
			</div>
		);
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
								if (newicons.length < newcount) {
									let amount = Math.abs(newcount - newicons.length); 
									{ times( amount, n => {
										newicons.push( {
											icon: 'fe_aperture',
											link: '',
											target: '_self',
											size: 18,
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
				<div className={ `kt-svg-icons` } style={ {
					textAlign: ( textAlignment ? textAlignment : undefined ),
				} } >
					{ renderIcons }
				</div>
			</div>
		);
	},

	save: props => {
		const { attributes: { icons, iconCount, blockAlignment, textAlignment, uniqueID }, className } = props;
		const renderSaveIcons = (index) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
					{ icons[ index ].icon && icons[ index ].link && (
						<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ icons[ index ].target }>
							<GenIcon className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
								color: ( icons[ index ].color ? icons[ index ].color : undefined ),
								backgroundColor: ( icons[ index ].background && icons[ index ].style != 'default' ? icons[ index ].background : undefined ),
								padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
								borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
								borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
								borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							} } />
						</a>
					) }
					{ icons[ index ].icon && ! icons[ index ].link && (
						<GenIcon className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }`} name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } icon={ ( 'fa' === icons[ index ].icon.substring( 0, 2 ) ? FaIco[ icons[ index ].icon ] : Ico[ icons[ index ].icon ] ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
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
		}
		return (
			<div className={ `kt-svg-icons kt-svg-icons-${ uniqueID } align${ blockAlignment }` } style={ {
				textAlign: ( textAlignment ? textAlignment : undefined ),
			} } >
				{ times( iconCount, n => renderSaveIcons( n ) ) }
			</div>
		);
	},
} );
