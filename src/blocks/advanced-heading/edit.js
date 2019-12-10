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
import InlineTypographyControls from '../../inline-typography-control';
import AdvancedColorControl from '../../advanced-color-control';
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
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
} = wp.blockEditor;
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

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktadvancedheadingUniqueIDs = [];

class KadenceAdvancedHeading extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			isVisible: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/advancedheading' ] !== undefined && typeof blockConfigObject[ 'kadence/advancedheading' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/advancedheading' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/advancedheading' ][ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedheadingUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktadvancedheadingUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedheadingUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktadvancedheadingUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/advancedheading' ] !== undefined && typeof blockSettings[ 'kadence/advancedheading' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/advancedheading' ] } );
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
	render() {
		const { attributes, className, setAttributes, mergeBlocks, onReplace } = this.props;
		const { uniqueID, align, level, content, color, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, marginType, topMargin, bottomMargin, markSize, markSizeType, markLineHeight, markLineType, markLetterSpacing, markTypography, markGoogleFont, markLoadGoogleFont, markFontSubset, markFontVariant, markFontWeight, markFontStyle, markPadding, markPaddingControl, markColor, markBG, markBGOpacity, markBorder, markBorderWidth, markBorderOpacity, markBorderStyle, anchor, textTransform, markTextTransform, kadenceAnimation, kadenceAOSOptions } = attributes;
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
			{ key: 'vh', name: __( 'vh' ) },
			{ key: 'rem', name: __( 'rem' ) },
		];
		const fontMin = ( sizeType === 'em' ? 0.2 : 5 );
		const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -100 );
		const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 100 );
		const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
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
		const headingContent = (
			<RichText
				formattingControls={ [ 'bold', 'italic', 'link', 'mark' ] }
				allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'kadence/mark' ] }
				wrapperClassName={ className }
				tagName={ tagName }
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				onMerge={ mergeBlocks }
				onSplit={ ( value ) => {
					if ( ! value ) {
						return createBlock( 'core/paragraph' );
					}
					return createBlock( 'kadence/advancedheading', {
						...attributes,
						content: value,
					} );
				} }
				onReplace={ onReplace }
				onRemove={ () => onReplace( [] ) }
				style={ {
					textAlign: align,
					color: color,
					fontWeight: fontWeight,
					fontStyle: fontStyle,
					fontSize: size + sizeType,
					lineHeight: lineHeight + lineType,
					letterSpacing: letterSpacing + 'px',
					textTransform: ( textTransform ? textTransform : undefined ),
					fontFamily: ( typography ? typography : '' ),
					marginTop: ( undefined !== topMargin ? topMargin + marginType : '' ),
					marginBottom: ( undefined !== bottomMargin ? bottomMargin + marginType : '' ),
				} }
				className={ `kt-adv-heading${ uniqueID }` }
				placeholder={ __( 'Write heading…' ) }
			/>
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
						text-transform: ${ ( markTextTransform ? markTextTransform : 'inherit' ) };
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
					{ this.showSettings( 'allSettings' ) && this.showSettings( 'toolbarTypography' ) && (
						<InlineTypographyControls
							uniqueID={ uniqueID }
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
							textTransform={ textTransform }
							onTextTransform={ ( value ) => setAttributes( { textTransform: value } ) }
							fontSizeArray={ false }
							fontSize={ size }
							onFontSize={ ( value ) => setAttributes( { size: value } ) }
							fontSizeType={ sizeType }
							onFontSizeType={ ( value ) => setAttributes( { sizeType: value } ) }
							lineHeight={ lineHeight }
							onLineHeight={ ( value ) => setAttributes( { lineHeight: value } ) }
							lineHeightType={ lineType }
							onLineHeightType={ ( value ) => setAttributes( { lineType: value } ) }
							tabSize={ tabSize }
							onTabSize={ ( value ) => setAttributes( { tabSize: value } ) }
							tabLineHeight={ tabLineHeight }
							onTabLineHeight={ ( value ) => setAttributes( { tabLineHeight: value } ) }
							mobileSize={ mobileSize }
							onMobileSize={ ( value ) => setAttributes( { mobileSize: value } ) }
							mobileLineHeight={ mobileLineHeight }
							onMobileLineHeight={ ( value ) => setAttributes( { mobileLineHeight: value } ) }
						/>
					) }
					<AlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						<PanelBody title={ __( 'Heading Settings' ) }>
							<div className="kb-tag-level-control">
								<p>{ __( 'HTML Tag' ) }</p>
								<Toolbar controls={ range( 1, 7 ).map( createLevelControl ) } />
							</div>
							<p>{ __( 'Text Alignment' ) }</p>
							<AlignmentToolbar
								value={ align }
								onChange={ ( nextAlign ) => {
									setAttributes( { align: nextAlign } );
								} }
							/>
							{ this.showSettings( 'colorSettings' ) && (
								<AdvancedColorControl
									label={ __( 'Heading Color' ) }
									colorValue={ ( color ? color : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { color: value } ) }
								/>
							) }
							{ this.showSettings( 'sizeSettings' ) && (
								<Fragment>
									<h2 className="kt-heading-size-title">{ __( 'Size Controls' ) }</h2>
									{ tabControls }
								</Fragment>
							) }
						</PanelBody>
						{ this.showSettings( 'advancedSettings' ) && (
							<PanelBody
								title={ __( 'Advanced Typography Settings' ) }
								initialOpen={ false }
							>
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
									textTransform={ textTransform }
									onTextTransform={ ( value ) => setAttributes( { textTransform: value } ) }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'highlightSettings' ) && (
							<PanelBody
								title={ __( 'Highlight Settings' ) }
								initialOpen={ false }
							>
								<AdvancedColorControl
									label={ __( 'Highlight Color' ) }
									colorValue={ ( markColor ? markColor : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markColor: value } ) }
								/>
								<AdvancedColorControl
									label={ __( 'Highlight Background' ) }
									colorValue={ ( markBG ? markBG : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markBG: value } ) }
									opacityValue={ markBGOpacity }
									onOpacityChange={ value => setAttributes( { markBGOpacity: value } ) }
								/>
								<AdvancedColorControl
									label={ __( 'Highlight Border Color' ) }
									colorValue={ ( markBorder ? markBorder : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markBorder: value } ) }
									opacityValue={ markBorderOpacity }
									onOpacityChange={ value => setAttributes( { markBorderOpacity: value } ) }
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
									textTransform={ markTextTransform }
									onTextTransform={ ( value ) => setAttributes( { markTextTransform: value } ) }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'marginSettings' ) && (
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
									value={ ( undefined !== topMargin ? topMargin : '' ) }
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
									value={ ( undefined !== bottomMargin ? bottomMargin : '' ) }
									onChange={ ( value ) => setAttributes( { bottomMargin: value } ) }
									min={ marginMin }
									max={ marginMax }
									step={ marginStep }
								/>
							</PanelBody>
						) }
					</InspectorControls>
				) }
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
				{ kadenceAnimation && (
					<div className={ `kt-animation-wrap-${ kadenceAnimation }` }>
						<div id={ `animate-id${ uniqueID }` } className={ 'aos-animate kt-animation-wrap' } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
							data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
							data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
						>
							{ headingContent }
						</div>
					</div>
				) }
				{ ! kadenceAnimation && (
					headingContent
				) }
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
