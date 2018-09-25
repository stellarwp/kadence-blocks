/**
 * BLOCK: Kadence Advanced Heading
 *
 */

/**
 * Import Css
 */
import './editor.scss';
import range from 'lodash/range';
import map from 'lodash/map';
import SelectSearch from 'react-select-search';
import fonts from '../../fonts';
import gFonts from '../../gfonts';
import WebfontLoader from '../../fontloader';
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
	RichText,
} = wp.editor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelColor,
	PanelBody,
	Toolbar,
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	IconButton,
	ToggleControl,
	TabPanel,
	SelectControl,
} = wp.components;
class KadenceAdvancedHeading extends Component {
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
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	render() {
		const { attributes: { align, level, content, color, size, sizeType, lineType, lineHeight, tabLineHeight, tabSize, mobileSize, mobileLineHeight, letterSpacing, typography, fontVariant, fontWeight, fontStyle, fontSubset, googleFont, loadGoogleFont, marginType, topMargin, bottomMargin }, className, setAttributes, mergeBlocks, insertBlocksAfter, onReplace } = this.props;
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
		const standardWeights = [
			{ value: 'regular', label: 'Normal' },
			{ value: 'bold', label: 'Bold' },
		];
		const standardStyles = [
			{ value: 'normal', label: 'Normal' },
			{ value: 'italic', label: 'Italic' },
		];
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const config = ( googleFont ? gconfig : '' );
		const typographyWeights = ( googleFont && typography ? gFonts[ typography ].w.map( opt => ( { label: this.capitalizeFirstLetter( opt ), value: opt } ) ) : standardWeights );
		const typographyStyles = ( googleFont && typography ? gFonts[ typography ].i.map( opt => ( { label: this.capitalizeFirstLetter( opt ), value: opt } ) ) : standardStyles );
		const typographySubsets = ( googleFont && typography ? gFonts[ typography ].s.map( opt => ( { label: this.capitalizeFirstLetter( opt ), value: opt } ) ) : '' );
		const fontsarray = fonts.map( ( name ) => {
			return { name: name, value: name, google: true };
		} );
		const options = [
			{
				type: 'group',
				name: 'Standard Fonts',
				items: [
					{ name: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
					{ name: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
					{ name: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', google: false },
					{ name: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
					{ name: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', google: false },
					{ name: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
					{ name: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', google: false },
					{ name: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
					{ name: 'Georgia, serif', value: 'Georgia, serif', google: false },
					{ name: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', google: false },
					{ name: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
					{ name: 'Courier, monospace', value: 'Courier, monospace', google: false },
					{ name: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', google: false },
				],
			},
			{
				type: 'group',
				name: 'Google Fonts',
				items: fontsarray,
			},
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
		const onTypeChange = ( select ) => {
			let variant;
			let weight;
			let subset;
			if ( select.google ) {
				if ( ! gFonts[ select.value ].v.includes( 'regular' ) ) {
					variant = gFonts[ select.value ].v[ 0 ];
				} else {
					variant = '';
				}
				if ( ! gFonts[ select.value ].w.includes( 'regular' ) ) {
					weight = gFonts[ select.value ].w[ 0 ];
				} else {
					weight = '400';
				}
				if ( gFonts[ select.value ].s.length > 1 ) {
					subset = 'latin';
				} else {
					subset = '';
				}
			} else {
				subset = '';
				variant = '';
				weight = '400';
			}
			setAttributes( {
				typography: select.value,
				googleFont: select.google,
				fontVariant: variant,
				fontWeight: weight,
				fontStyle: 'normal',
				fontSubset: subset,
			} );
		};
		const onTypeClear = () => {
			setAttributes( {
				typography: '',
				googleFont: false,
				loadGoogleFont: true,
				fontVariant: '',
				fontSubset: '',
				fontWeight: 'regular',
				fontStyle: 'normal',
			} );
		};
		const onWeightChange = ( select ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === fontStyle ) {
					if ( 'regular' === select ) {
						variant = 'italic';
					} else {
						variant = select + 'italic';
					}
				} else {
					variant = select;
				}
				setAttributes( {
					fontVariant: variant,
					fontWeight: ( 'regular' === select ? '400' : select ),
				} );
			} else {
				setAttributes( {
					fontVariant: '',
					fontWeight: ( 'regular' === select ? '400' : select ),
				} );
			}
		};
		const onGLoadChange = ( select ) => {
			setAttributes( {
				loadGoogleFont: select,
			} );
		};
		const onStyleChange = ( select ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === select ) {
					if ( ! fontWeight || 'regular' === fontWeight ) {
						variant = 'italic';
					} else {
						variant = fontWeight + 'italic';
					}
				} else {
					variant = ( fontWeight ? fontWeight : 'regular' );
				}
				setAttributes( {
					fontVariant: variant,
					fontStyle: select,
				} );
			} else {
				setAttributes( {
					fontVariant: '',
					fontStyle: select,
				} );
			}
		};
		// const callback = status => {
		// 	console.log( status );
		// };
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
					( tabName ) => {
						let tabout;
						if ( 'mobile' === tabName ) {
							tabout = mobileControls;
						} else if ( 'tablet' === tabName ) {
							tabout = tabletControls;
						} else {
							tabout = deskControls;
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		return (
			<Fragment>
				<BlockControls>
					<Toolbar controls={ range( 2, 5 ).map( createLevelControl ) } />
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
						<PanelColor
							title={ __( 'Heading Color' ) }
							colorValue={ color }
						>
							<ColorPalette
								value={ color }
								onChange={ ( value ) => setAttributes( { color: value } ) }
							/>
						</PanelColor>
						<h2 className="kt-heading-fontfamily-title">{ __( 'Font Family' ) }</h2>
						{ typography && (
							<IconButton
								label={ __( 'clear' ) }
								className="kt-font-clear-btn"
								icon="no-alt"
								onClick={ onTypeClear }
							/>
						) }
						<SelectSearch
							height={ 30 }
							search={ true }
							multiple={ false }
							value={ typography }
							onChange={ onTypeChange }
							options={ options }
							placeholder={ __( 'Select a font family' ) }
						/>
						{ typography && (
							<SelectControl
								label={ __( 'Font Weight' ) }
								value={ ( '400' === fontWeight ? 'regular' : fontWeight ) }
								options={ typographyWeights }
								onChange={ onWeightChange }
							/>
						) }
						{ typography && (
							<SelectControl
								label={ __( 'Font Style' ) }
								value={ fontStyle }
								options={ typographyStyles }
								onChange={ onStyleChange }
							/>
						) }
						{ typography && googleFont && (
							<SelectControl
								label={ __( 'Font Subset' ) }
								value={ fontSubset }
								options={ typographySubsets }
								onChange={ ( value ) => setAttributes( { fontSubset: value } ) }
							/>
						) }
						{ typography && googleFont && (
							<ToggleControl
								label={ __( 'Load Google Font on Frontend' ) }
								checked={ loadGoogleFont }
								onChange={ onGLoadChange }
							/>
						) }
						<h2 className="kt-heading-size-title">{ __( 'Size Controls' ) }</h2>
						{ tabControls }
						<RangeControl
							label={ __( 'Letter Spacing' ) }
							value={ ( letterSpacing ? letterSpacing : '' ) }
							onChange={ ( value ) => setAttributes( { letterSpacing: value } ) }
							min={ -5 }
							max={ 15 }
							step={ 0.1 }
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
				<RichText
					wrapperClassName={ className }
					tagName={ tagName }
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
					onMerge={ mergeBlocks }
					onSplit={
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
					className={ className }
					placeholder={ __( 'Write heading…' ) }
				/>
				{ googleFont && (
					<WebfontLoader config={ config }>
					</WebfontLoader>
				) }
			</Fragment>
		);
	}
}
export default ( KadenceAdvancedHeading );
