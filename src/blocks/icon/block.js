/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icon stuff
 */
import icons from './icon';

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
	ToggleControl,
	Modal,
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
		icon: {
			type: 'string',
			default: 'fe_aperture',
		},
		iconTitle: {
			type: 'string',
			default: '',
		},
		iconSize: {
			type: 'number',
			default: '50',
		},
		iconWidth: {
			type: 'number',
			default: '2',
		},
		iconColor: {
			type: 'string',
			default: '#444444',
		},
		iconBackground: {
			type: 'string',
			default: '',
		},
		iconBorder: {
			type: 'string',
			default: '#444444',
		},
		iconBorderWidth: {
			type: 'number',
			default: '2',
		},
		iconBorderRadius: {
			type: 'number',
			default: '0',
		},
		iconPadding: {
			type: 'number',
			default: '20',
		},
		iconStyle: {
			type: 'string',
			default: 'default',
		},
		iconLink: {
			type: 'string',
			default: '',
		},
		iconLinkTarget: {
			type: 'string',
			default: '_self',
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
		const { attributes: { icon, iconTitle, iconSize, iconColor, iconStyle, iconPadding, iconBackground, iconBorderRadius, iconBorder, iconBorderWidth, iconWidth, iconLink, iconLinkTarget, blockAlignment, textAlignment }, className, setAttributes, toggleSelection } = props;
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
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
					<PanelBody>
						<FontIconPicker
							icons={ IcoNames }
							value={ icon }
							onChange={ icon => setAttributes ( { 
								icon: icon,
							} ) }
							appendTo="body"
							renderFunc={ renderSVG }
							theme="default"
							isMulti={ false }
						/>
						<RangeControl
							label={ __( 'Icon Size' ) }
							value={ iconSize }
							onChange={ iconSize => setAttributes( { iconSize } ) }
							min={ 5 }
							max={ 250 }
						/>
						{ icon && 'fe' === icon.substring(0, 2) && (
							<RangeControl
								label={ __( 'Line Width' ) }
								value={ iconWidth }
								onChange={ iconWidth => setAttributes( { iconWidth } ) }
								min={ 0.5 }
								max={ 4 }
							/>
						) }
						<PanelColor
							title={ __( 'Icon Color' ) }
							colorValue={ iconColor }
						>
							<ColorPalette
								value={ iconColor }
								onChange={ iconColor => setAttributes( { iconColor } ) }
							/>
						</PanelColor>
						<SelectControl
							label={ __( 'Icon Style' ) }
							value={ iconStyle }
							options={ [
								{ value: 'default', label: __( 'Default' ) },
								{ value: 'stacked', label: __( 'Stacked' ) },
							] }
							onChange={ iconStyle => setAttributes( { iconStyle } ) }
						/>
						{ iconStyle != 'default' && (
							<PanelColor
								title={ __( 'Icon Background' ) }
								colorValue={ iconBackground }
							>
								<ColorPalette
									value={ iconBackground }
									onChange={ iconBackground => setAttributes( { iconBackground } ) }
								/>
							</PanelColor>
						) }
						{ iconStyle != 'default' && (
							<PanelColor
								title={ __( 'Border Color' ) }
								colorValue={ iconBorder }
							>
								<ColorPalette
									value={ iconBorder }
									onChange={ iconBorder => setAttributes( { iconBorder } ) }
								/>
							</PanelColor>
						) }
						{ iconStyle != 'default' && (
							<RangeControl
								label={ __( 'Border Size (px)' ) }
								value={ iconBorderWidth }
								onChange={ iconBorderWidth => setAttributes( { iconBorderWidth } ) }
								min={ 0 }
								max={ 20 }
							/>
						) }
						{ iconStyle != 'default' && (
							<RangeControl
								label={ __( 'Border Radius (%)' ) }
								value={ iconBorderRadius }
								onChange={ iconBorderRadius => setAttributes( { iconBorderRadius } ) }
								min={ 0 }
								max={ 50 }
							/>
						) }
						{ iconStyle != 'default' && (
							<RangeControl
								label={ __( 'Padding (px)' ) }
								value={ iconPadding }
								onChange={ iconPadding => setAttributes( { iconPadding } ) }
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
							value={ iconLink }
							onChange={ iconLink => setAttributes( { iconLink } ) }
						/>
						<SelectControl
							label={ __( 'Link Target' ) }
							value={ iconLinkTarget }
							options={ [
								{ value: '_self', label: __( 'Same Window' ) },
								{ value: '_blank', label: __( 'New Window' ) },
							] }
							onChange={iconLinkTarget => setAttributes( { iconLinkTarget } ) }
						/>
						<TextControl
							label={ __( 'Title for Accessibility' ) }
							value={ iconTitle }
							onChange={ iconTitle => setAttributes( { iconTitle } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ `kt-svg-icons kt-svg-style-${ iconStyle }` } style={ {
					textAlign: ( textAlignment ? textAlignment : undefined ),
				 } } >
					{ icon && (
						<GenIcon className={ `kt-svg-icon kt-svg-icon-${ icon }`} name={ icon } size={ iconSize } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? iconWidth : undefined ) } title={ ( iconTitle ? iconTitle : '' ) } style={ {
							color: ( iconColor ? iconColor : undefined ),
							backgroundColor: ( iconBackground && iconStyle != 'default' ? iconBackground : undefined ),
							padding: ( iconPadding && iconStyle !== 'default' ? iconPadding + 'px' : undefined ),
							borderColor: ( iconBorder && iconStyle !== 'default' ? iconBorder : undefined ),
							borderWidth: ( iconBorderWidth && iconStyle !== 'default' ? iconBorderWidth + 'px' : undefined ),
							borderRadius: ( iconBorderRadius && iconStyle !== 'default' ? iconBorderRadius + '%' : undefined ),
						} } />
					) }
				</div>
			</div>
		);
	},

	save: props => {
		const { attributes: { icon, iconTitle, iconSize, iconColor, iconStyle, iconPadding, iconBackground, iconBorderRadius, iconBorder, iconBorderWidth, iconLink, iconLinkTarget, iconWidth, blockAlignment, textAlignment }, className } = props;
		return (
			<div className={ `kt-svg-icons kt-svg-style-${ iconStyle } align${ blockAlignment }` } style={ {
				textAlign: ( textAlignment ? textAlignment : undefined ),
			 } } >
				{ icon && iconLink && (
					<a href={ iconLink } className={ 'kt-svg-icon-link' } target={ iconLinkTarget }>
						<GenIcon className={ `kt-svg-icon kt-svg-icon-${ icon }`} name={ icon } size={ iconSize } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? iconWidth : undefined ) } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } title={ ( iconTitle ? iconTitle : '' ) } style={ {
							color: ( iconColor ? iconColor : undefined ),
							backgroundColor: ( iconBackground && iconStyle != 'default' ? iconBackground : undefined ),
							padding: ( iconPadding && iconStyle !== 'default' ? iconPadding + 'px' : undefined ),
							borderColor: ( iconBorder && iconStyle !== 'default' ? iconBorder : undefined ),
							borderWidth: ( iconBorderWidth && iconStyle !== 'default' ? iconBorderWidth + 'px' : undefined ),
							borderRadius: ( iconBorderRadius && iconStyle !== 'default' ? iconBorderRadius + '%' : undefined ),
						} } />
					</a>
				) }
				{ icon && ! iconLink && (
					<GenIcon className={ `kt-svg-icon kt-svg-icon-${ icon }`} name={ icon } size={ iconSize } strokeWidth={ ( 'fe' === icon.substring( 0, 2 ) ? iconWidth : undefined ) } icon={ ( 'fa' === icon.substring( 0, 2 ) ? FaIco[ icon ] : Ico[ icon ] ) } title={ ( iconTitle ? iconTitle : '' ) } style={ {
						color: ( iconColor ? iconColor : undefined ),
						backgroundColor: ( iconBackground && iconStyle != 'default' ? iconBackground : undefined ),
						padding: ( iconPadding && iconStyle !== 'default' ? iconPadding + 'px' : undefined ),
						borderColor: ( iconBorder && iconStyle !== 'default' ? iconBorder : undefined ),
						borderWidth: ( iconBorderWidth && iconStyle !== 'default' ? iconBorderWidth + 'px' : undefined ),
						borderRadius: ( iconBorderRadius && iconStyle !== 'default' ? iconBorderRadius + '%' : undefined ),
					} } />
				) }
			</div>
		);
	},
} );
