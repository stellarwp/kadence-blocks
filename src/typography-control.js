/**
 * Typography Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';
/**
 * Import External
 */
import gFonts from './gfonts';
import fonts from './fonts';
import capitalizeFirstLetter from './capitalfirst';
import Select from 'react-select';
import map from 'lodash/map';
import range from 'lodash/range';

const {
	applyFilters,
} = wp.hooks;

/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	Fragment,
	Component,
} = wp.element;
const {
	Button,
	ButtonGroup,
	IconButton,
	TabPanel,
	Dashicon,
	PanelBody,
	Tooltip,
	RangeControl,
	Toolbar,
	ToggleControl,
	SelectControl,
} = wp.components;

/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
class TypographyControls extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			typographyOptions: [],
			typographySelectOptions: [],
			typographyWeights: [],
			typographyStyles: [],
			typographySubsets: '',
		};
	}
	componentDidMount() {
		const fontsarray = fonts.map( ( name ) => {
			return { label: name, value: name, google: true };
		} );
		const options = [
			{
				type: 'group',
				label: 'Standard Fonts',
				options: [
					{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
					{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
					{ label: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', google: false },
					{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
					{ label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', google: false },
					{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
					{ label: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', google: false },
					{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
					{ label: 'Georgia, serif', value: 'Georgia, serif', google: false },
					{ label: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', google: false },
					{ label: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
					{ label: 'Courier, monospace', value: 'Courier, monospace', google: false },
					{ label: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', google: false },
				],
			},
			{
				type: 'group',
				label: 'Google Fonts',
				options: fontsarray,
			},
		];
		let typographyOptions = applyFilters( 'kadence.typography_options', options );
		let typographySelectOptions = [].concat.apply( [], typographyOptions.map( option => option.options ) );
		const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
		if ( blockConfigObject[ 'kadence/typography' ] !== undefined && typeof blockConfigObject[ 'kadence/typography' ] === 'object' ) {
			if ( blockConfigObject[ 'kadence/typography' ].showAll !== undefined && ! blockConfigObject[ 'kadence/typography' ].showAll ) {
				typographyOptions = blockConfigObject[ 'kadence/typography' ].choiceArray;
				typographySelectOptions = blockConfigObject[ 'kadence/typography' ].choiceArray;
			}
		}
		this.setState( { typographyOptions: typographyOptions } );
		this.setState( { typographySelectOptions: typographySelectOptions } );
		this.setTypographyOptions( typographySelectOptions );
	}
	componentDidUpdate( prevProps ) {
		if ( this.props.fontFamily !== prevProps.fontFamily ) {
			this.setTypographyOptions( this.state.typographySelectOptions );
		}
	}
	setTypographyOptions( typographySelectOptions ) {
		const standardWeights = [
			{ value: 'regular', label: 'Normal' },
			{ value: 'bold', label: 'Bold' },
		];
		const standardStyles = [
			{ value: 'normal', label: 'Normal' },
			{ value: 'italic', label: 'Italic' },
		];
		const typographyWeights = ( this.props.googleFont && this.props.fontFamily ? gFonts[ this.props.fontFamily ].w.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) ) : standardWeights );
		const typographyStyles = ( this.props.googleFont && this.props.fontFamily ? gFonts[ this.props.fontFamily ].i.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) ) : standardStyles );
		const typographySubsets = ( this.props.googleFont && this.props.fontFamily ? gFonts[ this.props.fontFamily ].s.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) ) : '' );
		this.setState( { typographyWeights: typographyWeights } );
		this.setState( { typographyStyles: typographyStyles } );
		this.setState( { typographySubsets: typographySubsets } );
		this.setState( { fontFamilyValue: ( typographySelectOptions ? typographySelectOptions.filter( ( { value } ) => value === this.props.fontFamily ) : '' ) } );
	}
	render() {
		const { tagLevel,
			tagLowLevel = 1,
			tagHighLevel = 7,
			lineHeight,
			lineHeightType = 'px',
			fontSize,
			fontSizeType = 'px',
			googleFont,
			loadGoogleFont,
			fontFamily,
			fontVariant,
			fontWeight,
			fontStyle,
			fontSubset,
			letterSpacing,
			margin,
			marginControl,
			padding,
			paddingControl,
			onTagLevel,
			onLineHeight,
			onFontSize,
			onFontFamily,
			onFontVariant,
			onFontWeight,
			onFontStyle,
			onFontSubset,
			onFontChange,
			onFontArrayChange,
			onLoadGoogleFont,
			onGoogleFont,
			onLetterSpacing,
			onFontSizeType,
			onLineHeightType,
			onPadding,
			onPaddingControl,
			onMargin,
			onMarginControl,
			textTransform,
			onTextTransform } = this.props;
		const { controlSize, typographySelectOptions, typographyOptions, typographySubsets, typographyStyles, typographyWeights, fontFamilyValue } = this.state;
		const onTypoFontChange = ( select ) => {
			if ( select === null ) {
				onTypoFontClear();
			} else {
				let variant;
				let weight;
				let subset;
				if ( select.google ) {
					if ( ! gFonts[ select.value ].v.includes( 'regular' ) ) {
						variant = gFonts[ select.value ].v[ 0 ];
					} else {
						variant = 'regular';
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
				if ( onFontArrayChange ) {
					onFontArrayChange( { google: select.google, family: select.value, variant: variant, weight: weight, style: 'normal', subset: subset } );
				} else {
					onFontChange( select );
					onFontVariant( variant );
					onFontWeight( weight );
					onFontStyle( 'normal' );
					onFontSubset( subset );
				}
			}
		};
		const onTypoFontClear = () => {
			if ( onFontArrayChange ) {
				onFontArrayChange( { google: false, family: '', variant: '', weight: 'regular', style: 'normal', subset: '' } );
			} else {
				onGoogleFont( false );
				onFontFamily( '' );
				onFontVariant( '' );
				onFontWeight( 'regular' );
				onFontStyle( 'normal' );
				onFontSubset( '' );
			}
		};
		const onTypoFontWeightChange = ( select ) => {
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
				if ( onFontArrayChange ) {
					onFontArrayChange( { variant: variant, weight: ( 'regular' === select ? '400' : select ) } );
				} else {
					onFontVariant( variant );
					onFontWeight( ( 'regular' === select ? '400' : select ) );
				}
			} else if ( onFontArrayChange ) {
				onFontArrayChange( { variant: '', weight: ( 'regular' === select ? '400' : select ) } );
			} else {
				onFontVariant( '' );
				onFontWeight( ( 'regular' === select ? '400' : select ) );
			}
		};
		const onTypoFontStyleChange = ( select ) => {
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
				if ( onFontArrayChange ) {
					onFontArrayChange( { variant: variant, style: select } );
				} else {
					onFontVariant( variant );
					onFontStyle( select );
				}
			} else if ( onFontArrayChange ) {
				onFontArrayChange( { variant: '', style: select } );
			} else {
				onFontVariant( '' );
				onFontStyle( select );
			}
		};
		const createLevelControl = ( targetLevel ) => {
			return [ {
				icon: 'heading',
				// translators: %s: heading level e.g: "1", "2", "3"
				title: sprintf( __( 'Heading %d' ), targetLevel ),
				isActive: targetLevel === tagLevel,
				onClick: () => onTagLevel( targetLevel ),
				subscript: String( targetLevel ),
			} ];
		};
		const textTransformOptions = [
			{ value: 'none', label: 'None' },
			{ value: 'capitalize', label: 'Capitalize' },
			{ value: 'uppercase', label: 'Uppercase' },
			{ value: 'lowercase', label: 'Lowercase' },
		];
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		const borderTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: icons.linked },
			{ key: 'individual', name: __( 'Individual' ), icon: icons.individual },
		];
		const fontMin = ( fontSizeType === 'em' ? 0.2 : 5 );
		const fontMax = ( fontSizeType === 'em' ? 12 : 200 );
		const fontStep = ( fontSizeType === 'em' ? 0.1 : 1 );
		const lineMin = ( lineHeightType === 'em' ? 0.2 : 5 );
		const lineMax = ( lineHeightType === 'em' ? 12 : 200 );
		const lineStep = ( lineHeightType === 'em' ? 0.1 : 1 );
		const sizeDeskControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ fontSizeType === key }
							aria-pressed={ fontSizeType === key }
							onClick={ () => onFontSizeType( key ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Font Size' ) }
					value={ ( fontSize ? fontSize[ 0 ] : '' ) }
					onChange={ ( value ) => onFontSize( [ value, ( ! fontSize[ 1 ] ? fontSize[ 1 ] : '' ), ( ! fontSize[ 2 ] ? fontSize[ 2 ] : '' ) ] ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				{ onLineHeight && onLineHeightType && (
					<Fragment>
						<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
							{ map( sizeTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ lineHeightType === key }
									aria-pressed={ lineHeightType === key }
									onClick={ () => onLineHeightType( key ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<RangeControl
							label={ __( 'Line Height' ) }
							value={ ( lineHeight ? lineHeight[ 0 ] : '' ) }
							onChange={ ( value ) => onLineHeight( [ value, lineHeight[ 1 ], lineHeight[ 2 ] ] ) }
							min={ lineMin }
							max={ lineMax }
							step={ lineStep }
						/>
					</Fragment>
				) }
			</PanelBody>
		);
		const sizeTabletControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ fontSizeType === key }
							aria-pressed={ fontSizeType === key }
							onClick={ () => onFontSizeType( key ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Tablet Font Size' ) }
					value={ ( fontSize ? fontSize[ 1 ] : '' ) }
					onChange={ ( value ) => onFontSize( [ fontSize[ 0 ], value, fontSize[ 2 ] ] ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				{ onLineHeight && onLineHeightType && (
					<Fragment>
						<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
							{ map( sizeTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ lineHeightType === key }
									aria-pressed={ lineHeightType === key }
									onClick={ () => onLineHeightType( key ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<RangeControl
							label={ __( 'Tablet Line Height' ) }
							value={ ( lineHeight ? lineHeight[ 1 ] : '' ) }
							onChange={ ( value ) => onLineHeight( [ lineHeight[ 0 ], value, lineHeight[ 2 ] ] ) }
							min={ lineMin }
							max={ lineMax }
							step={ lineStep }
						/>
					</Fragment>
				) }
			</PanelBody>
		);
		const sizeMobileControls = (
			<PanelBody>
				<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
					{ map( sizeTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ fontSizeType === key }
							aria-pressed={ fontSizeType === key }
							onClick={ () => onFontSizeType( key ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<RangeControl
					label={ __( 'Mobile Font Size' ) }
					value={ ( fontSize ? fontSize[ 2 ] : '' ) }
					onChange={ ( value ) => onFontSize( [ fontSize[ 0 ], fontSize[ 1 ], value ] ) }
					min={ fontMin }
					max={ fontMax }
					step={ fontStep }
				/>
				{ onLineHeight && onLineHeightType && (
					<Fragment>
						<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Size Type' ) }>
							{ map( sizeTypes, ( { name, key } ) => (
								<Button
									key={ key }
									className="kt-size-btn"
									isSmall
									isPrimary={ lineHeightType === key }
									aria-pressed={ lineHeightType === key }
									onClick={ () => onLineHeightType( key ) }
								>
									{ name }
								</Button>
							) ) }
						</ButtonGroup>
						<RangeControl
							label={ __( 'Mobile Line Height' ) }
							value={ ( lineHeight ? lineHeight[ 2 ] : '' ) }
							onChange={ ( value ) => onLineHeight( [ lineHeight[ 0 ], lineHeight[ 1 ], value ] ) }
							min={ lineMin }
							max={ lineMax }
							step={ lineStep }
						/>
					</Fragment>
				) }
			</PanelBody>
		);
		return (
			<Fragment>
				{ onTagLevel && (
					<Fragment>
						<p>{ __( 'HTML Tag' ) }</p>
						<Toolbar controls={ range( tagLowLevel, tagHighLevel ).map( createLevelControl ) } />
					</Fragment>
				) }
				{ onFontSize && onFontSizeType && (
					<Fragment>
						<h2 className="kt-heading-size-title">{ __( 'Size Controls' ) }</h2>
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
											tabout = sizeMobileControls;
										} else if ( 'tablet' === tab.name ) {
											tabout = sizeTabletControls;
										} else {
											tabout = sizeDeskControls;
										}
									}
									return <div>{ tabout }</div>;
								}
							}
						</TabPanel>
					</Fragment>
				) }
				{ onLetterSpacing && (
					<RangeControl
						label={ __( 'Letter Spacing' ) }
						value={ ( undefined !== letterSpacing ? letterSpacing : '' ) }
						onChange={ ( value ) => onLetterSpacing( value ) }
						min={ -5 }
						max={ 15 }
						step={ 0.1 }
					/>
				) }
				{ onTextTransform && (
					<SelectControl
						label={ __( 'Text Transform' ) }
						value={ textTransform }
						options={ textTransformOptions }
						onChange={ ( value ) => onTextTransform( value ) }
					/>
				) }
				{ onFontFamily && onTypoFontClear && (
					<Fragment>
						<h2 className="kt-heading-fontfamily-title">{ __( 'Font Family' ) }</h2>
						<div className="typography-family-select-form-row">
							<Select
								options={ typographyOptions }
								value={ fontFamilyValue }
								isMulti={ false }
								maxMenuHeight={ 300 }
								isClearable={ true }
								placeholder={ __( 'Select a font family' ) }
								onChange={ onTypoFontChange }
							/>
						</div>
						{ onFontWeight && (
							<SelectControl
								label={ __( 'Font Weight' ) }
								value={ ( '400' === fontWeight ? 'regular' : fontWeight ) }
								options={ typographyWeights }
								onChange={ onTypoFontWeightChange }
							/>
						) }
						{ fontFamily && onFontStyle && (
							<SelectControl
								label={ __( 'Font Style' ) }
								value={ fontStyle }
								options={ typographyStyles }
								onChange={ onTypoFontStyleChange }
							/>
						) }
						{ fontFamily && googleFont && onFontSubset && (
							<SelectControl
								label={ __( 'Font Subset' ) }
								value={ fontSubset }
								options={ typographySubsets }
								onChange={ ( value ) => onFontSubset( value ) }
							/>
						) }
						{ fontFamily && googleFont && onLoadGoogleFont && (
							<ToggleControl
								label={ __( 'Load Google Font on Frontend' ) }
								checked={ loadGoogleFont }
								onChange={ onLoadGoogleFont }
							/>
						) }
					</Fragment>
				) }
				{ onPadding && onPaddingControl && (
					<Fragment>
						<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Padding Control Type' ) }>
							{ map( borderTypes, ( { name, key, icon } ) => (
								<Tooltip text={ name }>
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ paddingControl === key }
										aria-pressed={ paddingControl === key }
										onClick={ () => onPaddingControl( key ) }
									>
										{ icon }
									</Button>
								</Tooltip>
							) ) }
						</ButtonGroup>
						{ paddingControl && paddingControl !== 'individual' && (
							<RangeControl
								label={ __( 'Padding (px)' ) }
								value={ ( padding ? padding[ 0 ] : '' ) }
								onChange={ ( value ) => onPadding( [ value, value, value, value ] ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
						) }
						{ paddingControl && paddingControl === 'individual' && (
							<Fragment>
								<p>{ __( 'Padding (px)' ) }</p>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinetop }
									value={ ( padding ? padding[ 0 ] : '' ) }
									onChange={ ( value ) => onPadding( [ value, padding[ 1 ], padding[ 2 ], padding[ 3 ] ] ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineright }
									value={ ( padding ? padding[ 1 ] : '' ) }
									onChange={ ( value ) => onPadding( [ padding[ 0 ], value, padding[ 2 ], padding[ 3 ] ] ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinebottom }
									value={ ( padding ? padding[ 2 ] : '' ) }
									onChange={ ( value ) => onPadding( [ padding[ 0 ], padding[ 1 ], value, padding[ 3 ] ] ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineleft }
									value={ ( padding ? padding[ 3 ] : '' ) }
									onChange={ ( value ) => onPadding( [ padding[ 0 ], padding[ 1 ], padding[ 2 ], value ] ) }
									min={ 0 }
									max={ 100 }
									step={ 1 }
								/>
							</Fragment>
						) }
					</Fragment>
				) }
				{ onMargin && onMarginControl && (
					<Fragment>
						<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Margin Control Type' ) }>
							{ map( borderTypes, ( { name, key, icon } ) => (
								<Tooltip text={ name }>
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ marginControl === key }
										aria-pressed={ marginControl === key }
										onClick={ () => onMarginControl( key ) }
									>
										{ icon }
									</Button>
								</Tooltip>
							) ) }
						</ButtonGroup>
						{ marginControl && marginControl !== 'individual' && (
							<RangeControl
								label={ __( 'Margin (px)' ) }
								value={ ( margin ? margin[ 0 ] : '' ) }
								onChange={ ( value ) => onMargin( [ value, value, value, value ] ) }
								min={ -100 }
								max={ 100 }
								step={ 1 }
							/>
						) }
						{ marginControl && marginControl === 'individual' && (
							<Fragment>
								<p>{ __( 'Margin (px)' ) }</p>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinetop }
									value={ ( margin ? margin[ 0 ] : '' ) }
									onChange={ ( value ) => onMargin( [ value, margin[ 1 ], margin[ 2 ], margin[ 3 ] ] ) }
									min={ -100 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineright }
									value={ ( margin ? margin[ 1 ] : '' ) }
									onChange={ ( value ) => onMargin( [ margin[ 0 ], value, margin[ 2 ], margin[ 3 ] ] ) }
									min={ -100 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlinebottom }
									value={ ( margin ? margin[ 2 ] : '' ) }
									onChange={ ( value ) => onMargin( [ margin[ 0 ], margin[ 1 ], value, margin[ 3 ] ] ) }
									min={ -100 }
									max={ 100 }
									step={ 1 }
								/>
								<RangeControl
									className="kt-icon-rangecontrol"
									label={ icons.outlineleft }
									value={ ( margin ? margin[ 3 ] : '' ) }
									onChange={ ( value ) => onMargin( [ margin[ 0 ], margin[ 1 ], margin[ 2 ], value ] ) }
									min={ -100 }
									max={ 100 }
									step={ 1 }
								/>
							</Fragment>
						) }
					</Fragment>
				) }
			</Fragment>
		);
	}
}
export default ( TypographyControls );
