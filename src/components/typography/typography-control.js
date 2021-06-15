/**
 * Typography Component
 *
 */

 /* global kadence_blocks_params */

/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * Import Icons
 */
import icons from './../../icons';
/**
 * Import External
 */
import capitalizeFirstLetter from './../common/capitalfirst';
import Select from 'react-select';
import map from 'lodash/map';
import range from 'lodash/range';
import HeadingLevelIcon from './heading-icons';
import KadenceRange from './../range/range-control';
import MeasurementControls from './../measurement/measurement-control';
import ResponsiveRangeControls from './../range/responsive-range-control';

const {
	applyFilters,
} = wp.hooks;

const {
	Fragment,
	Component,
} = wp.element;
const {
	Button,
	ButtonGroup,
	TabPanel,
	Dashicon,
	PanelBody,
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
		const fontsarray = typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_font_names ? kadence_blocks_params.g_font_names.map( ( name ) => {
			return { label: name, value: name, google: true };
		} ) : {};
		let options = [
			{
				type: 'group',
				label: __( 'Standard Fonts', 'kadence-blocks' ),
				options: [
					{ label: 'System Default', value: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', google: false },
					{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
					{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
					{ label: 'Helvetica, sans-serif', value: 'Helvetica, sans-serif', google: false },
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
				label: __( 'Google Fonts', 'kadence-blocks' ),
				options: fontsarray,
			},
		];
		if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.c_fonts ) {
			const newOptions = [];
			Object.keys( kadence_blocks_params.c_fonts ).forEach(function ( font ) {
				const name = kadence_blocks_params.c_fonts[font].name;
				const weights = [];
				Object.keys( kadence_blocks_params.c_fonts[font].weights ).forEach(function ( weight ) {
					weights.push( {
						value: kadence_blocks_params.c_fonts[font].weights[weight],
						label: kadence_blocks_params.c_fonts[font].weights[weight],
					} ); 
				} );
				const styles = [];
				Object.keys( kadence_blocks_params.c_fonts[font].styles ).forEach(function ( style ) {
					styles.push( {
						value: kadence_blocks_params.c_fonts[font].weights[style],
						label: kadence_blocks_params.c_fonts[font].weights[style],
					} ); 
				} );
				newOptions.push( {
					label: name,
					value: name,
					google: false,
					weights: weights,
					styles: styles,
				} );
			} );
			const custom_fonts = [
				{
					type: 'group',
					label: __( 'Custom Fonts', 'kadence-blocks' ),
					options: newOptions,
				},
			];
			options = custom_fonts.concat( options );
		}
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
		let standardWeights = [
			{ value: 'inherit', label: __( 'Inherit', 'kadence-blocks' ) },
			{ value: '400', label: __( 'Normal', 'kadence-blocks' ) },
			{ value: 'bold', label: __( 'Bold', 'kadence-blocks' ) },
		];
		const systemWeights = [
			{ value: 'inherit', label: __( 'Inherit', 'kadence-blocks' ) },
			{ value: '100', label: __( 'Thin 100', 'kadence-blocks' ) },
			{ value: '200', label: __( 'Extra-Light 200', 'kadence-blocks' ) },
			{ value: '300', label: __( 'Light 300', 'kadence-blocks' ) },
			{ value: '400', label: __( 'Regular', 'kadence-blocks' ) },
			{ value: '500', label: __( 'Medium 500', 'kadence-blocks' ) },
			{ value: '600', label: __( 'Semi-Bold 600', 'kadence-blocks' ) },
			{ value: '700', label: __( 'Bold 700', 'kadence-blocks' ) },
			{ value: '800', label: __( 'Extra-Bold 800', 'kadence-blocks' ) },
			{ value: '900', label: __( 'Ultra-Bold 900', 'kadence-blocks' ) },
		];
		const isKadenceT = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.isKadenceT ? true : false );
		const headingWeights = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.headingWeights ? kadence_blocks_params.headingWeights : [] );
		const buttonWeights = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.buttonWeights ? kadence_blocks_params.buttonWeights : [] );
		if ( isKadenceT && this.props.fontGroup === 'heading' && headingWeights && Array.isArray( headingWeights ) && headingWeights.length ) {
			standardWeights = headingWeights;
		}
		if ( isKadenceT && this.props.fontGroup === 'button' && buttonWeights && Array.isArray( buttonWeights ) && buttonWeights.length ) {
			standardWeights = buttonWeights;
		}
		const standardStyles = [
			{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
			{ value: 'italic', label: __( 'Italic', 'kadence-blocks' ) },
		];
		const activeFont = ( typographySelectOptions ? typographySelectOptions.filter( ( { value } ) => value === this.props.fontFamily ) : '' );
		let fontStandardWeights = standardWeights;
		let fontStandardStyles = standardStyles;
		let typographySubsets = '';
		if ( activeFont && activeFont[ 0 ] ) {
			if ( undefined !== activeFont[ 0 ].weights ) {
				fontStandardWeights = activeFont[ 0 ].weights;
			}
			if ( undefined !== activeFont[ 0 ].styles ) {
				fontStandardStyles = activeFont[ 0 ].styles;
			}
		}
		if ( this.props.googleFont && this.props.fontFamily && typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && kadence_blocks_params.g_fonts[ this.props.fontFamily ] ) {
			fontStandardWeights = kadence_blocks_params.g_fonts[ this.props.fontFamily ].w.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) );
			fontStandardStyles = kadence_blocks_params.g_fonts[ this.props.fontFamily ].i.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) );
			typographySubsets = kadence_blocks_params.g_fonts[ this.props.fontFamily ].s.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) );
		}
		if ( this.props.fontFamily === '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' ) {
			fontStandardWeights = systemWeights;
		}
		this.setState( { typographyWeights: fontStandardWeights } );
		this.setState( { typographyStyles: fontStandardStyles } );
		this.setState( { typographySubsets: typographySubsets } );
		this.setState( { fontFamilyValue: activeFont } );
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
			loadItalic,
			onLoadItalic,
			textTransform,
			onTextTransform,
			reLetterSpacing = false,
			letterSpacingType = 'px',
			onLetterSpacingType } = this.props;
		const { controlSize, typographySelectOptions, typographyOptions, typographySubsets, typographyStyles, typographyWeights, fontFamilyValue } = this.state;
		const onTypoFontChange = ( select ) => {
			if ( select === null ) {
				onTypoFontClear();
			} else {
				let variant;
				let weight;
				let subset;
				if ( select.google ) {
					if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && ! kadence_blocks_params.g_fonts[ select.value ].v.includes( 'regular' ) ) {
						variant = kadence_blocks_params.g_fonts[ select.value ].v[ 0 ];
					} else {
						variant = 'regular';
					}
					if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && ! kadence_blocks_params.g_fonts[ select.value ].w.includes( 'regular' ) ) {
						weight = kadence_blocks_params.g_fonts[ select.value ].w[ 0 ];
					} else {
						weight = '400';
					}
					if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && kadence_blocks_params.g_fonts[ select.value ].s.length > 1 ) {
						subset = 'latin';
					} else {
						subset = '';
					}
				} else {
					subset = '';
					variant = '';
					weight = 'inherit';
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
				onFontArrayChange( { google: false, family: '', variant: '', weight: 'inherit', style: 'normal', subset: '' } );
			} else {
				onGoogleFont( false );
				onFontFamily( '' );
				onFontVariant( '' );
				onFontWeight( 'inherit' );
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
				icon: <HeadingLevelIcon level={ targetLevel } isPressed={ targetLevel === tagLevel } />,
				title: sprintf(
					/* translators: %d: heading level e.g: "1", "2", "3" */
					__( 'Heading %d', 'kadence-blocks' ),
					targetLevel
					),
				isActive: targetLevel === tagLevel,
				onClick: () => onTagLevel( targetLevel ),
			} ];
		};
		const textTransformOptions = [
			{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
			{ value: 'capitalize', label: __( 'Capitalize', 'kadence-blocks' ) },
			{ value: 'uppercase', label: __( 'Uppercase', 'kadence-blocks' ) },
			{ value: 'lowercase', label: __( 'Lowercase', 'kadence-blocks' ) },
		];
		const borderTypes = [
			{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.linked },
			{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.individual },
		];
		const fontMin = ( fontSizeType !== 'px' ? 0.2 : 5 );
		const fontMax = ( fontSizeType !== 'px' ? 12 : 200 );
		const fontStep = ( fontSizeType !== 'px' ? 0.1 : 1 );
		const lineMin = ( lineHeightType !== 'px' ? 0.2 : 5 );
		const lineMax = ( lineHeightType !== 'px' ? 12 : 200 );
		const lineStep = ( lineHeightType !== 'px' ? 0.1 : 1 );
		return (
			<Fragment>
				{ onTagLevel && (
					<div className="kb-tag-level-control">
						<p>{ __( 'HTML Tag', 'kadence-blocks' ) }</p>
						<Toolbar controls={ range( tagLowLevel, tagHighLevel ).map( createLevelControl ) } />
					</div>
				) }
				{ onFontSize && onFontSizeType && (
					<ResponsiveRangeControls
						label={ __( 'Font Size', 'kadence-blocks' ) }
						value={ ( fontSize && undefined !== fontSize[ 0 ] ? fontSize[ 0 ] : '' ) }
						onChange={ value => onFontSize( [ value, ( fontSize && undefined !== fontSize[ 1 ] ? fontSize[ 1 ] : '' ), ( fontSize && undefined !== fontSize[ 2 ] ? fontSize[ 2 ] : '' ) ] ) }
						tabletValue={ ( fontSize && undefined !== fontSize[ 1 ] ? fontSize[ 1 ] : '' ) }
						onChangeTablet={ ( value ) => onFontSize( [ ( fontSize && undefined !== fontSize[ 0 ] ? fontSize[ 0 ] : '' ), value, ( fontSize && undefined !== fontSize[ 2 ] ? fontSize[ 2 ] : '' ) ] ) }
						mobileValue={ ( fontSize && undefined !== fontSize[ 2 ] ? fontSize[ 2 ] : '' ) }
						onChangeMobile={ ( value ) => onFontSize( [ ( fontSize && undefined !== fontSize[ 0 ] ? fontSize[ 0 ] : '' ), ( fontSize && undefined !== fontSize[ 1 ] ? fontSize[ 1 ] : '' ), value ] ) }
						min={ fontMin }
						max={ fontMax }
						step={ fontStep }
						unit={ ( fontSizeType ? fontSizeType : 'px' ) }
						onUnit={ ( value ) => onFontSizeType( value ) }
						units={ [ 'px', 'em', 'rem' ] }
					/>
				) }
				{ onLineHeight && onLineHeightType && (
					<ResponsiveRangeControls
						label={ __( 'Line Height', 'kadence-blocks' ) }
						value={ ( lineHeight && undefined !== lineHeight[ 0 ] ? lineHeight[ 0 ] : '' ) }
						onChange={ value => onLineHeight( [ value, ( lineHeight && undefined !== lineHeight[ 1 ] ? lineHeight[ 1 ] : '' ), ( lineHeight && undefined !== lineHeight[ 2 ] ? lineHeight[ 2 ] : '' ) ] ) }
						tabletValue={ ( lineHeight && undefined !== lineHeight[ 1 ] ? lineHeight[ 1 ] : '' ) }
						onChangeTablet={ ( value ) => onLineHeight( [ ( lineHeight && undefined !== lineHeight[ 0 ] ? lineHeight[ 0 ] : '' ), value, ( lineHeight && undefined !== lineHeight[ 2 ] ? lineHeight[ 2 ] : '' ) ] ) }
						mobileValue={ ( lineHeight && undefined !== lineHeight[ 2 ] ? lineHeight[ 2 ] : '' ) }
						onChangeMobile={ ( value ) => onLineHeight( [ ( lineHeight && undefined !== lineHeight[ 0 ] ? lineHeight[ 0 ] : '' ), ( lineHeight && undefined !== lineHeight[ 1 ] ? lineHeight[ 1 ] : '' ), value ] ) }
						min={ lineMin }
						max={ lineMax }
						step={ lineStep }
						unit={ ( lineHeightType ? lineHeightType : 'px' ) }
						onUnit={ ( value ) => onLineHeightType( value ) }
						units={ [ 'px', 'em', 'rem' ] }
					/>
				) }
				{ onLetterSpacing && ! reLetterSpacing && (
					<KadenceRange
						label={ __( 'Letter Spacing', 'kadence-blocks' ) }
						value={ ( undefined !== letterSpacing ? letterSpacing : '' ) }
						onChange={ ( value ) => onLetterSpacing( value ) }
						min={ -5 }
						max={ 15 }
						step={ 0.1 }
					/>
				) }
				{ onLetterSpacing && reLetterSpacing && (
					<ResponsiveRangeControls
						label={ __( 'Letter Spacing', 'kadence-blocks' ) }
						value={ ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[0] ? reLetterSpacing[0] : '' ) }
						onChange={ value => onLetterSpacing( [ value, ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[1] ? reLetterSpacing[1] : '' ), ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[2] ? reLetterSpacing[2] : '' ) ] ) }
						tabletValue={ ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[1] ? reLetterSpacing[1] : '' ) }
						onChangeTablet={ ( value ) => onLetterSpacing( [ ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[0] ? reLetterSpacing[0] : '' ), value, ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[2] ? reLetterSpacing[2] : '' ) ] ) }
						mobileValue={ ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[2] ? reLetterSpacing[2] : '' ) }
						onChangeMobile={ ( value ) => onLetterSpacing( [ ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[0] ? reLetterSpacing[0] : '' ), ( undefined !== reLetterSpacing && undefined !== reLetterSpacing[1] ? reLetterSpacing[1] : '' ), value ] ) }
						min={ -5 }
						max={ 15 }
						step={ 0.1 }
						unit={ ( onLetterSpacingType ? letterSpacingType : 'px' ) }
						onUnit={ ( value ) => onLetterSpacingType( value ) }
						units={ ( onLetterSpacingType ? [ 'px', 'em', 'rem' ] : [ 'px' ] ) }
					/>
				) }
				{ onTextTransform && (
					<SelectControl
						label={ __( 'Text Transform', 'kadence-blocks' ) }
						value={ textTransform }
						options={ textTransformOptions }
						onChange={ ( value ) => onTextTransform( value ) }
					/>
				) }
				{ onFontFamily && onTypoFontClear && (
					<Fragment>
						<h2 className="kt-heading-fontfamily-title">{ __( 'Font Family', 'kadence-blocks' ) }</h2>
						<div className="typography-family-select-form-row">
							<Select
								options={ typographyOptions }
								value={ fontFamilyValue }
								isMulti={ false }
								maxMenuHeight={ 300 }
								isClearable={ true }
								placeholder={ __( 'Select a font family', 'kadence-blocks' ) }
								onChange={ onTypoFontChange }
							/>
						</div>
						{ onFontWeight && (
							<SelectControl
								label={ __( 'Font Weight', 'kadence-blocks' ) }
								value={ ( 'regular' === fontWeight ? '400' : fontWeight ) }
								options={ typographyWeights }
								onChange={ onTypoFontWeightChange }
							/>
						) }
						{ fontFamily && onFontStyle && (
							<SelectControl
								label={ __( 'Font Style', 'kadence-blocks' ) }
								value={ fontStyle }
								options={ typographyStyles }
								onChange={ onTypoFontStyleChange }
							/>
						) }
						{ fontFamily && googleFont && onFontSubset && (
							<SelectControl
								label={ __( 'Font Subset', 'kadence-blocks' ) }
								value={ fontSubset }
								options={ typographySubsets }
								onChange={ ( value ) => onFontSubset( value ) }
							/>
						) }
						{ fontFamily && googleFont && onLoadGoogleFont && (
							<ToggleControl
								label={ __( 'Load Google Font on Frontend', 'kadence-blocks' ) }
								checked={ loadGoogleFont }
								onChange={ onLoadGoogleFont }
							/>
						) }
						{ fontFamily && googleFont && loadGoogleFont && onFontStyle && 'normal' === fontStyle && onLoadItalic && undefined !== typographyStyles[ 1 ] && undefined !== typographyStyles[ 1 ].value && 'italic' === typographyStyles[ 1 ].value && (
							<ToggleControl
								label={ __( 'Load Italic Styles Also', 'kadence-blocks' ) }
								checked={ loadItalic }
								onChange={ onLoadItalic }
							/>
						) }
					</Fragment>
				) }
				{ onPadding && onPaddingControl && (
					<Fragment>
						<MeasurementControls
							label={ __( 'Padding (px)', 'kadence-blocks' ) }
							measurement={ ( padding ? padding : '' ) }
							control={ paddingControl }
							onChange={ ( value ) => onPadding( value ) }
							onControl={ ( value ) => onPaddingControl( value ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							allowEmpty={ false }
						/>
					</Fragment>
				) }
				{ onMargin && onMarginControl && (
					<Fragment>
						<MeasurementControls
							label={ __( 'Margin (px)', 'kadence-blocks' ) }
							measurement={ ( margin ? margin : '' ) }
							control={ marginControl }
							onChange={ ( value ) => onMargin( value ) }
							onControl={ ( value ) => onMarginControl( value ) }
							min={ -100 }
							max={ 100 }
							step={ 1 }
							allowEmpty={ false }
						/>
					</Fragment>
				) }
			</Fragment>
		);
	}
}
export default ( TypographyControls );
