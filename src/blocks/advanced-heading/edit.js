/**
 * BLOCK: Kadence Advanced Heading
 *
 */
/* global kadence_blocks_params */
/**
 * Internal dependencies
 */
import range from 'lodash/range';
import map from 'lodash/map';
import classnames from 'classnames';
import TypographyControls from '../../typography-control';
import InlineTypographyControls from '../../inline-typography-control';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import InlineAdvancedPopColorControl from '../../advanced-inline-pop-color-control';
import KadenceColorOutput from '../../kadence-color-output';
import WebfontLoader from '../../fontloader';
import TextShadowControl from '../../text-shadow-control';
import KadenceRange from '../../kadence-range-control';

/**
 * Block dependencies
 */
import HeadingLevelIcon from './heading-icons';
import HeadingStyleCopyPaste from './copy-paste-style';
import './markformat';

/**
 * Import Css
 */
import './editor.scss';
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
	ButtonGroup,
	Button,
	ToolbarGroup,
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
		this.saveShadow = this.saveShadow.bind( this );
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
	saveShadow( value ) {
		const { attributes, setAttributes } = this.props;
		const { textShadow } = attributes;

		const newItems = textShadow.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			textShadow: newItems,
		} );
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
		const { uniqueID, align, level, content, color, colorClass, textShadow, mobileAlign, tabletAlign, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, marginType, topMargin, bottomMargin, markSize, markSizeType, markLineHeight, markLineType, markLetterSpacing, markTypography, markGoogleFont, markLoadGoogleFont, markFontSubset, markFontVariant, markFontWeight, markFontStyle, markPadding, markPaddingControl, markColor, markBG, markBGOpacity, markBorder, markBorderWidth, markBorderOpacity, markBorderStyle, anchor, textTransform, markTextTransform, kadenceAnimation, kadenceAOSOptions, htmlTag } = attributes;
		const markBGString = ( markBG ? KadenceColorOutput( markBG, markBGOpacity ) : '' );
		const markBorderString = ( markBorder ? KadenceColorOutput( markBorder, markBorderOpacity ) : '' );
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
		const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: 'rem', name: __( 'rem' ) },
		];
		const marginTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vh', name: __( 'vh' ) },
			{ key: 'rem', name: __( 'rem' ) },
		];
		const fontMin = ( sizeType !== 'px' ? 0.2 : 5 );
		const marginMin = ( marginType === 'em' || marginType === 'rem' ? -2 : -200 );
		const marginMax = ( marginType === 'em' || marginType === 'rem' ? 12 : 200 );
		const marginStep = ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 );
		const fontMax = ( sizeType !== 'px' ? 12 : 200 );
		const fontStep = ( sizeType !== 'px' ? 0.1 : 1 );
		const lineMin = ( lineType !== 'px' ? 0.2 : 5 );
		const lineMax = ( lineType !== 'px' ? 12 : 200 );
		const lineStep = ( lineType !== 'px' ? 0.1 : 1 );
		const createLevelControl = ( targetLevel ) => {
			return [ {
				icon: <HeadingLevelIcon level={ targetLevel } isPressed={ targetLevel === level } />,
				// translators: %s: heading level e.g: "1", "2", "3"
				title: sprintf( __( 'Heading %d' ), targetLevel ),
				isActive: targetLevel === level,
				onClick: () => setAttributes( { level: targetLevel } ),
			} ];
		};
		const headingOptions = [
			[
				{
					icon: <HeadingLevelIcon level={ 1 } isPressed={ ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 1', 'kadence-blocks' ),
					isActive: ( 1 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 1, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 2 } isPressed={ ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 2', 'kadence-blocks' ),
					isActive: ( 2 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 2, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 3 } isPressed={ ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 3', 'kadence-blocks' ),
					isActive: ( 3 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 3, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 4 } isPressed={ ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 4', 'kadence-blocks' ),
					isActive: ( 4 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 4, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 5 } isPressed={ ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 5', 'kadence-blocks' ),
					isActive: ( 5 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 5, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 6 } isPressed={ ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ) } />,
					title: __( 'Heading 6', 'kadence-blocks' ),
					isActive: ( 6 === level && htmlTag && htmlTag === 'heading' ? true : false ),
					onClick: () => setAttributes( { level: 6, htmlTag: 'heading' } ),
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={ 'p' } isPressed={ ( htmlTag && htmlTag === 'p' ? true : false ) } />,
					title: __( 'Paragraph', 'kadence-blocks' ),
					isActive: ( htmlTag && htmlTag === 'p' ? true : false ),
					onClick: () => setAttributes( { htmlTag: 'p' } ),
				},
			],
		];
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
				<KadenceRange
					label={ __( 'Font Size' ) }
					value={ ( size ? size : '' ) }
					onChange={ ( value ) => {
						setAttributes( { size: value } );
					} }
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
				<KadenceRange
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
				<KadenceRange
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
				<KadenceRange
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
				<KadenceRange
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
				<KadenceRange
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
						return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const tabAlignControls = (
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
								tabout = (
									<AlignmentToolbar
										value={ mobileAlign }
										isCollapsed={ false }
										onChange={ ( nextAlign ) => {
											setAttributes( { mobileAlign: nextAlign } );
										} }
									/>
								);
							} else if ( 'tablet' === tab.name ) {
								tabout = (
									<AlignmentToolbar
										value={ tabletAlign }
										isCollapsed={ false }
										onChange={ ( nextAlign ) => {
											setAttributes( { tabletAlign: nextAlign } );
										} }
									/>
								);
							} else {
								tabout = (
									<AlignmentToolbar
										value={ align }
										isCollapsed={ false }
										onChange={ ( nextAlign ) => {
											setAttributes( { align: nextAlign } );
										} }
									/>
								);
							}
						}
						return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const classes = classnames( {
			[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
			[ className ]: className,
		} );
		const headingContent = (
			<RichText
				formattingControls={ [ 'bold', 'italic', 'link', 'mark' ] }
				allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'kadence/mark' ] }
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
					color: color ? KadenceColorOutput( color ) : undefined,
					fontWeight: fontWeight,
					fontStyle: fontStyle,
					fontSize: ( size ? size + sizeType : undefined ),
					lineHeight: ( lineHeight ? lineHeight + lineType : undefined ),
					letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					textTransform: ( textTransform ? textTransform : undefined ),
					fontFamily: ( typography ? typography : '' ),
					marginTop: ( undefined !== topMargin ? topMargin + marginType : '' ),
					marginBottom: ( undefined !== bottomMargin ? bottomMargin + marginType : '' ),
					textShadow: ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
				} }
				className={ classes }
				placeholder={ __( 'Write heading…', 'kadence-blocks' ) }
			/>
		);
		return (
			<Fragment>
				<style>
					{ `.kt-adv-heading${ uniqueID } mark, .kt-adv-heading${ uniqueID }.rich-text:focus mark[data-rich-text-format-boundary] {
						color: ${ KadenceColorOutput( markColor ) };
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
					<ToolbarGroup
						isCollapsed={ true }
						icon={ <HeadingLevelIcon level={ ( htmlTag === 'p' ? 'p' : level ) } /> }
						label={ __( 'Change Heading Level', 'kadence-blocks' ) }
						controls={ headingOptions }
					/>
					{ this.showSettings( 'allSettings' ) && this.showSettings( 'toolbarTypography' ) && (
						<InlineTypographyControls
							uniqueID={ uniqueID }
							fontGroup={ 'heading' }
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
					<InlineAdvancedPopColorControl
						label={ __( 'Heading Color', 'kadence-blocks' ) }
						colorValue={ ( color ? color : '' ) }
						colorDefault={ '' }
						onColorChange={ value => setAttributes( { color: value } ) }
						onColorClassChange={ value => setAttributes( { colorClass: value } ) }
					/>
					<AlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
					/>
					<HeadingStyleCopyPaste
						onPaste={ value => setAttributes( value ) }
						blockAttributes={ this.props.attributes }
					/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						<PanelBody title={ __( 'Heading Settings', 'kadence-blocks' ) }>
							<div className="kb-tag-level-control components-base-control">
								<p className="kb-component-label">{ __( 'HTML Tag', 'kadence-blocks' ) }</p>
								<Toolbar controls={ headingOptions } />
							</div>
							<div className="kb-sidebar-alignment components-base-control">
								<p className="kb-component-label kb-responsive-label">{ __( 'Text Alignment', 'kadence-blocks' ) }</p>
								{ tabAlignControls }
							</div>
							{ this.showSettings( 'colorSettings' ) && (
								<AdvancedPopColorControl
									label={ __( 'Heading Color', 'kadence-blocks' ) }
									colorValue={ ( color ? color : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { color: value } ) }
									onColorClassChange={ value => setAttributes( { colorClass: value } ) }
								/>
							) }
							{ this.showSettings( 'sizeSettings' ) && (
								<Fragment>
									<h2 className="kt-heading-size-title">{ __( 'Size Controls', 'kadence-blocks' ) }</h2>
									{ tabControls }
								</Fragment>
							) }
						</PanelBody>
						{ this.showSettings( 'advancedSettings' ) && (
							<PanelBody
								title={ __( 'Advanced Typography Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<TypographyControls
									fontGroup={ 'heading' }
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
						{ this.showSettings( 'highlightSettings', 'kadence-blocks' ) && (
							<PanelBody
								title={ __( 'Highlight Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<AdvancedPopColorControl
									label={ __( 'Highlight Color', 'kadence-blocks' ) }
									colorValue={ ( markColor ? markColor : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markColor: value } ) }
								/>
								<AdvancedPopColorControl
									label={ __( 'Highlight Background', 'kadence-blocks' ) }
									colorValue={ ( markBG ? markBG : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markBG: value } ) }
									opacityValue={ markBGOpacity }
									onOpacityChange={ value => setAttributes( { markBGOpacity: value } ) }
								/>
								<AdvancedPopColorControl
									label={ __( 'Highlight Border Color', 'kadence-blocks' ) }
									colorValue={ ( markBorder ? markBorder : '' ) }
									colorDefault={ '' }
									onColorChange={ value => setAttributes( { markBorder: value } ) }
									opacityValue={ markBorderOpacity }
									onOpacityChange={ value => setAttributes( { markBorderOpacity: value } ) }
								/>
								<SelectControl
									label={ __( 'Highlight Border Style', 'kadence-blocks' ) }
									value={ markBorderStyle }
									options={ [
										{ value: 'solid', label: __( 'Solid' ) },
										{ value: 'dashed', label: __( 'Dashed' ) },
										{ value: 'dotted', label: __( 'Dotted' ) },
									] }
									onChange={ value => setAttributes( { markBorderStyle: value } ) }
								/>
								<KadenceRange
									label={ __( 'Highlight Border Width', 'kadence-blocks' ) }
									value={ markBorderWidth }
									onChange={ value => setAttributes( { markBorderWidth: value } ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<TypographyControls
									fontGroup={ 'heading' }
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
								title={ __( 'Margin Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
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
								<KadenceRange
									label={ __( 'Top Margin', 'kadence-blocks' ) }
									value={ ( undefined !== topMargin ? topMargin : '' ) }
									onChange={ ( value ) => setAttributes( { topMargin: value } ) }
									min={ marginMin }
									max={ marginMax }
									step={ marginStep }
								/>
								<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
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
								<KadenceRange
									label={ __( 'Bottom Margin', 'kadence-blocks' ) }
									value={ ( undefined !== bottomMargin ? bottomMargin : '' ) }
									onChange={ ( value ) => setAttributes( { bottomMargin: value } ) }
									min={ marginMin }
									max={ marginMax }
									step={ marginStep }
								/>
							</PanelBody>
						) }
						<PanelBody
							title={ __( 'Text Shadow Settings' ) }
							initialOpen={ false }
						>
							<TextShadowControl
								label={ __( 'Text Shadow', 'kadence-blocks' ) }
								enable={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable ? textShadow[ 0 ].enable : false ) }
								color={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].color ? textShadow[ 0 ].color : 'rgba(0, 0, 0, 0.2)' ) }
								colorDefault={ 'rgba(0, 0, 0, 0.2)' }
								hOffset={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) }
								vOffset={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) }
								blur={ ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) }
								onEnableChange={ value => {
									this.saveShadow( { enable: value } );
								} }
								onColorChange={ value => {
									this.saveShadow( { color: value } );
								} }
								onHOffsetChange={ value => {
									this.saveShadow( { hOffset: value } );
								} }
								onVOffsetChange={ value => {
									this.saveShadow( { vOffset: value } );
								} }
								onBlurChange={ value => {
									this.saveShadow( { blur: value } );
								} }
							/>
						</PanelBody>
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
