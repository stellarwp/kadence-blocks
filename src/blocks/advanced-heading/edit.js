/**
 * BLOCK: Kadence Advanced Heading
 *
 */

/**
 * Import Css
 */
import './editor.scss';
import './markformat';
import range from 'lodash/range';
import map from 'lodash/map';
import hexToRGBA from '../../hex-to-rgba';
import TypographyControls from '../../typography-control';
import WebfontLoader from '../../fontloader';

import icons from '../../icons';
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	createBlock,
} = wp.blocks;
const {
	InspectorControls,
	ColorPalette,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
} = wp.editor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	Toolbar,
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	TabPanel,
	SelectControl,
	TextControl,
} = wp.components;
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

class KadenceAdvancedHeading extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			isVisible: false,
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
	}
	render() {
		const { attributes: { uniqueID, align, level, content, color, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, marginType, topMargin, bottomMargin, markSize, markSizeType, markLineHeight, markLineType, markLetterSpacing, markTypography, markGoogleFont, markLoadGoogleFont, markFontSubset, markFontVariant, markFontWeight, markFontStyle, markPadding, markPaddingControl, markColor, markBG, markBGOpacity, markBorder, markBorderWidth, markBorderOpacity, markBorderStyle, anchor }, className, setAttributes, mergeBlocks, insertBlocksAfter, onReplace } = this.props;
		const markBGString = ( markBG ? hexToRGBA( markBG, markBGOpacity ) : '' );
		const markBorderString = ( markBorder ? hexToRGBA( markBorder, markBorderOpacity ) : '' );
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const sgconfig = {
			google: {
				families: [ markTypography + ( markFontVariant ? ':' + markFontVariant : '' ) ],
			},
		};
		const config = ( googleFont ? gconfig : '' );
		const sconfig = ( markGoogleFont ? sgconfig : '' );
		const tagName = 'h' + level;
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		const marginTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: '%', name: __( '%' ) },
		];
		const fontMin = ( sizeType === 'em' ? 0.2 : 5 );
		const marginMin = ( marginType === 'em' ? 0.1 : 1 );
		const marginMax = ( marginType === 'em' ? 12 : 100 );
		const marginStep = ( marginType === 'em' ? 0.1 : 1 );
		const fontMax = ( sizeType === 'em' ? 12 : 200 );
		const fontStep = ( sizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineType === 'em' ? 0.2 : 5 );
		const lineMax = ( lineType === 'em' ? 12 : 200 );
		const lineStep = ( lineType === 'em' ? 0.1 : 1 );
		const createLevelControl = ( targetLevel ) => {
			return [ {
				icon: 'heading',
				// translators: %s: heading level e.g: "1", "2", "3"
				title: sprintf( __( 'Heading %d' ), targetLevel ),
				isActive: targetLevel === level,
				onClick: () => setAttributes( { level: targetLevel } ),
				subscript: String( targetLevel ),
			} ];
		};
		const createLevelControlToolbar = ( targetLevel ) => {
			return [ {
				icon: icons[ 'h' + targetLevel ],
				// translators: %s: heading level e.g: "1", "2", "3"
				title: sprintf( __( 'Heading %d' ), targetLevel ),
				isActive: targetLevel === level,
				onClick: () => setAttributes( { level: targetLevel } ),
				subscript: String( targetLevel ),
			} ];
		};
		const deskControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Font Size' ) }
					value={ ( size ? size : '' ) }
					onChange={ ( value ) => setAttributes( { size: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Line Height' ) }
					value={ ( lineHeight ? lineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { lineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const tabletControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Font Size' ) }
					value={ ( tabSize ? tabSize : '' ) }
					onChange={ ( value ) => setAttributes( { tabSize: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Line Height' ) }
					value={ ( tabLineHeight ? tabLineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { tabLineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const mobileControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ sizeType === key }
							aria-pressed={ sizeType === key }
							onClick={ () => setAttributes( { sizeType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Font Size' ) }
					value={ ( mobileSize ? mobileSize : '' ) }
					onChange={ ( value ) => setAttributes( { mobileSize: value } ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ lineType === key }
							aria-pressed={ lineType === key }
							onClick={ () => setAttributes( { lineType: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Line Height' ) }
					value={ ( mobileLineHeight ? mobileLineHeight : '' ) }
					onChange={ ( value ) => setAttributes( { mobileLineHeight: value } ) }
					min={ lineMin }
					max={ lineMax }
					step={ lineStep }
				/>
			</PanelBody>
		);
		const tabControls = (
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
								tabout = mobileControls;
							} else if ( 'tablet' === tab.name ) {
								tabout = tabletControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		return (
			<Fragment>
				<style>
					{ `.kt-adv-heading${ uniqueID } mark {
						color: ${ markColor };
						background: ${ ( markBG ? markBGString : 'transparent' ) };
						font-weight: ${ ( markTypography && markFontWeight ? markFontWeight : 'inherit' ) };
						font-style: ${ ( markTypography && markFontStyle ? markFontStyle : 'inherit' ) };
						font-size: ${ ( markSize && markSize[ 0 ] ? markSize[ 0 ] + markSizeType : 'inherit' ) };
						line-height: ${ ( markLineHeight && markLineHeight[ 0 ] ? markLineHeight[ 0 ] + markLineType : 'inherit' ) };
						letter-spacing: ${ ( markLetterSpacing ? markLetterSpacing + 'px' : 'inherit' ) };
						font-family: ${ ( markTypography ? markTypography : 'inherit' ) };
						border-color: ${ ( markBorder ? markBorderString : 'transparent' ) };
						border-width: ${ ( markBorderWidth ? markBorderWidth + 'px' : '0' ) };
						border-style: ${ ( markBorderStyle ? markBorderStyle : 'solid' ) };
						padding: ${ ( markPadding ? markPadding[ 0 ] + 'px ' + markPadding[ 1 ] + 'px ' + markPadding[ 2 ] + 'px ' + markPadding[ 3 ] + 'px' : '' ) };
					}` }
				</style>
				<BlockControls>
					<Toolbar
						isCollapsed={ true }
						icon={ icons[ 'h' + level ] }
						label={ __( 'Change Heading Level' ) }
						controls={ range( 1, 7 ).map( createLevelControlToolbar ) }
					/>
					<AlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Heading Settings' ) }>
						<p>{ __( 'HTML Tag' ) }</p>
						<Toolbar controls={ range( 1, 7 ).map( createLevelControl ) } />
						<p>{ __( 'Text Alignment' ) }</p>
						<AlignmentToolbar
							value={ align }
							onChange={ ( nextAlign ) => {
								setAttributes( { align: nextAlign } );
							} }
						/>
						<p className="kt-setting-label">{ __( 'Heading Color' ) }</p>
						<ColorPalette
							value={ color }
							onChange={ ( value ) => setAttributes( { color: value } ) }
						/>
						<h2 className="kt-heading-size-title">{ __( 'Size Controls' ) }</h2>
						{ tabControls }
						<TypographyControls
							letterSpacing={ letterSpacing }
							onLetterSpacing={ ( value ) => setAttributes( { letterSpacing: value } ) }
							fontFamily={ typography }
							onFontFamily={ ( value ) => setAttributes( { typography: value } ) }
							onFontChange={ ( select ) => {
								setAttributes( {
									typography: select.value,
									googleFont: select.google,
								} );
							} }
							googleFont={ googleFont }
							onGoogleFont={ ( value ) => setAttributes( { googleFont: value } ) }
							loadGoogleFont={ loadGoogleFont }
							onLoadGoogleFont={ ( value ) => setAttributes( { loadGoogleFont: value } ) }
							fontVariant={ fontVariant }
							onFontVariant={ ( value ) => setAttributes( { fontVariant: value } ) }
							fontWeight={ fontWeight }
							onFontWeight={ ( value ) => setAttributes( { fontWeight: value } ) }
							fontStyle={ fontStyle }
							onFontStyle={ ( value ) => setAttributes( { fontStyle: value } ) }
							fontSubset={ fontSubset }
							onFontSubset={ ( value ) => setAttributes( { fontSubset: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Highlight Settings' ) }
						initialOpen={ false }
					>
						<h2>{ __( 'Highlight Color' ) }</h2>
						<ColorPalette
							value={ markColor }
							onChange={ value => setAttributes( { markColor: value } ) }
						/>
						<h2>{ __( 'Highlight Background' ) }</h2>
						<ColorPalette
							value={ markBG }
							onChange={ value => setAttributes( { markBG: value } ) }
						/>
						<RangeControl
							label={ __( 'Highlight Background Opacity' ) }
							value={ markBGOpacity }
							onChange={ value => setAttributes( { markBGOpacity: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
						<h2>{ __( 'Highlight Border Color' ) }</h2>
						<ColorPalette
							value={ markBorder }
							onChange={ value => setAttributes( { markBorder: value } ) }
						/>
						<RangeControl
							label={ __( 'Highlight Border Opacity' ) }
							value={ markBorderOpacity }
							onChange={ value => setAttributes( { markBorderOpacity: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
						<SelectControl
							label={ __( 'Highlight Border Style' ) }
							value={ markBorderStyle }
							options={ [
								{ value: 'solid', label: __( 'Solid' ) },
								{ value: 'dashed', label: __( 'Dashed' ) },
								{ value: 'dotted', label: __( 'Dotted' ) },
							] }
							onChange={ value => setAttributes( { markBorderStyle: value } ) }
						/>
						<RangeControl
							label={ __( 'Highlight Border Width' ) }
							value={ markBorderWidth }
							onChange={ value => setAttributes( { markBorderWidth: value } ) }
							min={ 0 }
							max={ 20 }
							step={ 1 }
						/>
						<TypographyControls
							fontSize={ markSize }
							onFontSize={ ( value ) => setAttributes( { markSize: value } ) }
							fontSizeType={ markSizeType }
							onFontSizeType={ ( value ) => setAttributes( { markSizeType: value } ) }
							lineHeight={ markLineHeight }
							onLineHeight={ ( value ) => setAttributes( { markLineHeight: value } ) }
							lineHeightType={ markLineType }
							onLineHeightType={ ( value ) => setAttributes( { markLineType: value } ) }
							letterSpacing={ markLetterSpacing }
							onLetterSpacing={ ( value ) => setAttributes( { markLetterSpacing: value } ) }
							fontFamily={ markTypography }
							onFontFamily={ ( value ) => setAttributes( { markTypography: value } ) }
							onFontChange={ ( select ) => {
								setAttributes( {
									markTypography: select.value,
									markGoogleFont: select.google,
								} );
							} }
							googleFont={ markGoogleFont }
							onGoogleFont={ ( value ) => setAttributes( { markGoogleFont: value } ) }
							loadGoogleFont={ markLoadGoogleFont }
							onLoadGoogleFont={ ( value ) => setAttributes( { markLoadGoogleFont: value } ) }
							fontVariant={ markFontVariant }
							onFontVariant={ ( value ) => setAttributes( { markFontVariant: value } ) }
							fontWeight={ markFontWeight }
							onFontWeight={ ( value ) => setAttributes( { markFontWeight: value } ) }
							fontStyle={ markFontStyle }
							onFontStyle={ ( value ) => setAttributes( { markFontStyle: value } ) }
							fontSubset={ markFontSubset }
							onFontSubset={ ( value ) => setAttributes( { markFontSubset: value } ) }
							padding={ markPadding }
							onPadding={ ( value ) => setAttributes( { markPadding: value } ) }
							paddingControl={ markPaddingControl }
							onPaddingControl={ ( value ) => setAttributes( { markPaddingControl: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Margin Settings' ) }
						initialOpen={ false }
					>
						<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type' ) }>
							{ map( marginTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ marginType === key }
									aria-pressed={ marginType === key }
									onClick={ () => setAttributes( { marginType: key } ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<RangeControl
							label={ __( 'Top Margin' ) }
							value={ ( topMargin ? topMargin : '' ) }
							onChange={ ( value ) => setAttributes( { topMargin: value } ) }
							min={ marginMin }
							max={ marginMax }
							step={ marginStep }
						/>
						<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type' ) }>
							{ map( marginTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ marginType === key }
									aria-pressed={ marginType === key }
									onClick={ () => setAttributes( { marginType: key } ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<RangeControl
							label={ __( 'Bottom Margin' ) }
							value={ ( bottomMargin ? bottomMargin : '' ) }
							onChange={ ( value ) => setAttributes( { bottomMargin: value } ) }
							min={ marginMin }
							max={ marginMax }
							step={ marginStep }
						/>
					</PanelBody>
				</InspectorControls>
				<InspectorAdvancedControls>
					<TextControl
						label={ __( 'HTML Anchor' ) }
						help={ __( 'Anchors lets you link directly to a section on a page.' ) }
						value={ anchor || '' }
						onChange={ ( nextValue ) => {
							nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
							setAttributes( {
								anchor: nextValue,
							} );
						} } />
				</InspectorAdvancedControls>
				<RichText
					formattingControls={ [ 'bold', 'italic', 'link', 'underline', 'mark' ] }
					wrapperClassName={ className }
					tagName={ tagName }
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
					onMerge={ mergeBlocks }
					unstableOnSplit={
						insertBlocksAfter ?
							( before, after, ...blocks ) => {
								setAttributes( { content: before } );
								insertBlocksAfter( [
									...blocks,
									createBlock( 'core/paragraph', { content: after } ),
								] );
							} :
							undefined
					}
					onRemove={ () => onReplace( [] ) }
					style={ {
						textAlign: align,
						color: color,
						fontWeight: fontWeight,
						fontStyle: fontStyle,
						fontSize: size + sizeType,
						lineHeight: lineHeight + lineType,
						letterSpacing: letterSpacing + 'px',
						fontFamily: ( typography ? typography : '' ),
						marginTop: ( topMargin ? topMargin + marginType : '' ),
						marginBottom: ( bottomMargin ? bottomMargin + marginType : '' ),
					} }
					className={ `kt-adv-heading${ uniqueID }` }
					placeholder={ __( 'Write heading…' ) }
				/>
				{ googleFont && (
					<WebfontLoader config={ config }>
					</WebfontLoader>
				) }
				{ markGoogleFont && (
					<WebfontLoader config={ sconfig }>
					</WebfontLoader>
				) }
			</Fragment>
		);
	}
}
export default ( KadenceAdvancedHeading );
