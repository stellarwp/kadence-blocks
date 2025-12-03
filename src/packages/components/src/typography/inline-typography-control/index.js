/**
 * Inline Typography Component
 *
 */


/**
 * Import External
 */
//import gFonts from './gfonts';
//import fonts from './fonts';
import { capitalizeFirstLetter } from '@kadence/helpers'
import Select from 'react-select';
import { map } from 'lodash';
import './editor.scss';

import { applyFilters } from '@wordpress/hooks';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import ResponsiveFontSizeControl from '../../font-size/responsive';
import ResponsiveUnitControl from '../../unit/responsive';
import {
	Button,
	ButtonGroup,
	Dashicon,
	Tooltip,
	Dropdown,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
class InlineTypographyControls extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			controlSize: 'desk',
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
				label: 'Standard Fonts',
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
				label: 'Google Fonts',
				options: fontsarray,
			},
		];
		if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.c_fonts ) {
			const newOptions = [];
			Object.keys( kadence_blocks_params.c_fonts ).forEach(function ( font ) {
				const name = kadence_blocks_params.c_fonts[font].name;
				const label = kadence_blocks_params.c_fonts[font].label ? kadence_blocks_params.c_fonts[font].label : name;
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
					label,
					value: name,
					google: false,
					weights,
					styles,
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
		if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params?.isKadenceT ) {
			const themeOptions = [
				{ label: 'Inherit Heading Font Family', value: 'var( --global-heading-font-family, inherit )', google: false },
				{ label: 'Inherit Body Font Family', value: 'var( --global-body-font-family, inherit )', google: false },
			];
			const theme_fonts = [
				{
					type: 'group',
					label: __( 'Theme Global Fonts', 'kadence-blocks' ),
					options: themeOptions,
				},
			];
			options = theme_fonts.concat( options );
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
		this.setState( { typographyOptions } );
		this.setState( { typographySelectOptions } );
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
		const standardStyles = [
			{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
			{ value: 'italic', label: __( 'Italic', 'kadence-blocks' ) },
		];
		const isKadenceT = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.isKadenceT ? true : false );
		const headingWeights = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.headingWeights ? kadence_blocks_params.headingWeights : [] );
		const bodyWeights = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.bodyWeights ? kadence_blocks_params.bodyWeights : [] );
		const buttonWeights = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.buttonWeights ? kadence_blocks_params.buttonWeights : [] );
		if ( isKadenceT && this.props.fontGroup === 'heading' && headingWeights && Array.isArray( headingWeights ) && headingWeights.length ) {
			standardWeights = headingWeights;
		}
		if ( isKadenceT && this.props.fontGroup === 'body' && bodyWeights && Array.isArray( bodyWeights ) && bodyWeights.length ) {
			standardWeights = bodyWeights;
		}
		if ( isKadenceT && this.props.fontGroup === 'button' && buttonWeights && Array.isArray( buttonWeights ) && buttonWeights.length ) {
			standardWeights = buttonWeights;
		}
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
		if ( this.props.fontFamily === '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' ) {
			fontStandardWeights = systemWeights;
		} else if ( this.props.fontFamily === 'var( --global-heading-font-family, inherit )' ) {
			fontStandardWeights = headingWeights;
		} else if ( this.props.fontFamily === 'var( --global-body-font-family, inherit )' ) {
			fontStandardWeights = bodyWeights;
		} else if ( this.props.googleFont && this.props.fontFamily && typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && kadence_blocks_params.g_fonts[ this.props.fontFamily ] ) {
			fontStandardWeights = kadence_blocks_params.g_fonts[ this.props.fontFamily ].w.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) );
			fontStandardStyles = kadence_blocks_params.g_fonts[ this.props.fontFamily ].i.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) );
			typographySubsets = kadence_blocks_params.g_fonts[ this.props.fontFamily ].s.map( opt => ( { label: capitalizeFirstLetter( opt ), value: opt } ) );
		}
		this.setState( { typographyWeights: fontStandardWeights } );
		this.setState( { typographyStyles: fontStandardStyles } );
		this.setState( { typographySubsets } );
		this.setState( { fontFamilyValue: activeFont } );
	}
	render() {
		const { uniqueID, lineHeight, lineHeightType, fontSize, fontSizeType, googleFont, loadGoogleFont, fontFamily, fontVariant, fontWeight, fontStyle, fontSubset, letterSpacing, onLineHeight, onFontSize, onFontFamily, onFontVariant, onFontWeight, onFontStyle, onFontSubset, onFontChange, onFontArrayChange, onLoadGoogleFont, onGoogleFont, onLetterSpacing, onFontSizeType, onLineHeightType, textTransform, onTextTransform, fontSizeArray, tabSize, tabLineHeight, onTabLineHeight, onTabSize, mobileSize, mobileLineHeight, onMobileLineHeight, onMobileSize } = this.props;
		const { controlSize, typographySelectOptions, typographyOptions, typographySubsets, typographyStyles, typographyWeights, fontFamilyValue } = this.state;
		const onControlSize = ( size ) => {
			this.setState( { controlSize: size } );
		};
		const deviceControlTypes = [
			{ key: 'desk', name: __( 'Desktop' ), icon: <Dashicon icon="desktop" /> },
			{ key: 'tablet', name: __( 'Tablet' ), icon: <Dashicon icon="tablet" /> },
			{ key: 'mobile', name: __( 'Mobile' ), icon: <Dashicon icon="smartphone" /> },
		];
		const onFontSizeInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onFontSize( undefined );
				return;
			}
			if ( newValue > fontMax ) {
				onFontSize( fontMax );
			} else if ( newValue < -0.1 ) {
				onFontSize( fontMin );
			} else {
				onFontSize( newValue );
			}
		};
		const onTabFontSizeInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onTabSize( undefined );
				return;
			}
			if ( newValue > fontMax ) {
				onTabSize( fontMax );
			} else if ( newValue < -0.1 ) {
				onTabSize( fontMin );
			} else {
				onTabSize( newValue );
			}
		};
		const onMobileFontSizeInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onMobileSize( undefined );
				return;
			}
			if ( newValue > fontMax ) {
				onMobileSize( fontMax );
			} else if ( newValue < -0.1 ) {
				onMobileSize( fontMin );
			} else {
				onMobileSize( newValue );
			}
		};
		const onLineHeightInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onLineHeight( undefined );
				return;
			}
			if ( newValue > lineMax ) {
				onLineHeight( lineMax );
			} else if ( newValue < -0.1 ) {
				onLineHeight( lineMin );
			} else {
				onLineHeight( newValue );
			}
		};
		const onTabLineHeightInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onTabLineHeight( undefined );
				return;
			}
			if ( newValue > lineMax ) {
				onTabLineHeight( lineMax );
			} else if ( newValue < -0.1 ) {
				onTabLineHeight( lineMin );
			} else {
				onTabLineHeight( newValue );
			}
		};
		const onMobileLineHeightInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onMobileLineHeight( undefined );
				return;
			}
			if ( newValue > lineMax ) {
				onMobileLineHeight( lineMax );
			} else if ( newValue < -0.1 ) {
				onMobileLineHeight( lineMin );
			} else {
				onMobileLineHeight( newValue );
			}
		};
		const onLetterSpacingInput = ( event ) => {
			const newValue = Number( event.target.value );
			if ( newValue === '' ) {
				onLetterSpacing( undefined );
				return;
			}
			if ( newValue > 15 ) {
				onLetterSpacing( 15 );
			} else if ( newValue < -5 ) {
				onLetterSpacing( -5 );
			} else {
				onLetterSpacing( newValue );
			}
		};
		const onTypoFontChange = ( selected ) => {
			if ( selected === null ) {
				onTypoFontClear();
			} else {
				let variant;
				let weight;
				let subset;
				if ( selected.google ) {
					if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && ! kadence_blocks_params.g_fonts[ selected.value ].v.includes( 'regular' ) ) {
						variant = kadence_blocks_params.g_fonts[ selected.value ].v[ 0 ];
					} else {
						variant = 'regular';
					}
					if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && ! kadence_blocks_params.g_fonts[ selected.value ].w.includes( 'regular' ) ) {
						weight = kadence_blocks_params.g_fonts[ selected.value ].w[ 0 ];
					} else {
						weight = '400';
					}
					if ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && kadence_blocks_params.g_fonts[ selected.value ].s.length > 1 ) {
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
					onFontArrayChange( { google: selected.google, family: selected.value, variant, weight, style: 'normal', subset } );
				} else {
					onFontChange( selected );
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
		const onTypoFontWeightChange = ( selected ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === fontStyle ) {
					if ( 'regular' === selected ) {
						variant = 'italic';
					} else {
						variant = selected + 'italic';
					}
				} else {
					variant = selected;
				}
				if ( onFontArrayChange ) {
					onFontArrayChange( { variant, weight: ( 'regular' === selected ? '400' : selected ) } );
				} else {
					onFontVariant( variant );
					onFontWeight( ( 'regular' === selected ? '400' : selected ) );
				}
			} else if ( onFontArrayChange ) {
				onFontArrayChange( { variant: '', weight: ( 'regular' === selected ? '400' : selected ) } );
			} else {
				onFontVariant( '' );
				onFontWeight( ( 'regular' === selected ? '400' : selected ) );
			}
		};
		const onTypoFontStyleChange = ( selected ) => {
			if ( googleFont ) {
				let variant;
				if ( 'italic' === selected ) {
					if ( ! fontWeight || 'regular' === fontWeight ) {
						variant = 'italic';
					} else {
						variant = fontWeight + 'italic';
					}
				} else {
					variant = ( fontWeight ? fontWeight : 'regular' );
				}
				if ( onFontArrayChange ) {
					onFontArrayChange( { variant, style: selected } );
				} else {
					onFontVariant( variant );
					onFontStyle( selected );
				}
			} else if ( onFontArrayChange ) {
				onFontArrayChange( { variant: '', style: selected } );
			} else {
				onFontVariant( '' );
				onFontStyle( selected );
			}
		};
		const textTransformOptions = [
			{ value: 'none', label: 'None' },
			{ value: 'capitalize', label: 'Capitalize' },
			{ value: 'uppercase', label: 'Uppercase' },
			{ value: 'lowercase', label: 'Lowercase' },
		];
		const fontMin = ( fontSizeType !== 'px' ? 0 : 0 );
		const fontMax = ( fontSizeType !== 'px' ? 120 : 3000 );
		const fontStep = ( fontSizeType !== 'px' ? 0.1 : 1 );
		const lineMin = ( lineHeightType !== 'px' ? 0.2 : 5 );
		const lineMax = ( lineHeightType !== 'px' ? 120 : 3000 );
		const lineStep = ( lineHeightType !== 'px' ? 0.1 : 1 );
		const usingReg = typographyWeights.some(function(el) {
			return el.value === 'regular';
		});

		// @todo: Replace with icon from @kadence/icons once created
		const icons = {};
		icons.fontfamily = <svg width="16px" height="16px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd"
								clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414">
			<path d="M39.939,7.124l0,-3.751l-11.251,0l0,3.751l3.75,0l0,33.752l-3.75,0l0,3.751l11.251,0l0,-3.751l-3.751,0l0,-33.752l3.751,0Zm-11.251,4.391c0,-0.195 -0.366,-0.429 -0.6,-0.596c-1.033,-0.771 -2.175,-1.273 -3.443,-1.506c-1.268,-0.234 -2.747,-0.35 -4.45,-0.35c-1.234,0 -2.501,0.195 -3.797,0.592c-1.297,0.396 -2.4,0.876 -3.311,1.446c-1.056,0.667 -1.911,1.429 -2.569,2.278c-0.658,0.852 -0.988,1.744 -0.988,2.676c0,0.893 0.238,1.697 0.714,2.417c0.476,0.72 1.221,1.078 2.233,1.078c1.135,0 2.022,-0.292 2.661,-0.883c0.639,-0.585 0.958,-1.234 0.958,-1.944c0,-0.668 -0.097,-1.397 -0.289,-2.189c-0.195,-0.789 -0.288,-1.387 -0.288,-1.792c0.324,-0.345 0.887,-0.674 1.687,-0.989c0.799,-0.315 1.667,-0.47 2.599,-0.47c1.358,0 2.406,0.277 3.147,0.834c0.74,0.559 1.312,1.212 1.717,1.962c0.364,0.669 0.269,2.186 0.269,2.186l0,4.472c0,0.527 -2.545,1.257 -5.333,2.189c-2.789,0.931 -4.484,1.569 -5.397,1.914c-0.728,0.285 -1.429,0.666 -2.261,1.14c-0.831,0.478 -1.463,1.018 -1.971,1.628c-0.649,0.729 -1.116,1.549 -1.44,2.46c-0.325,0.911 -0.475,1.944 -0.475,3.101c0,2.23 0.73,4.034 2.179,5.412c1.448,1.376 3.3,2.068 5.549,2.068c2.128,0 3.947,-0.834 5.456,-1.603c1.514,-0.774 2.928,-1.92 4.244,-3.795l0.184,0c0.264,1.875 0.851,2.946 1.792,3.686l1.223,0.064l0,-27.486Zm-3.259,22.286c-0.75,0.955 -1.673,1.78 -2.766,2.483c-1.095,0.699 -2.363,1.052 -3.801,1.052c-1.359,0 -2.477,-0.396 -3.358,-1.191c-0.883,-0.791 -1.322,-2.029 -1.322,-3.712c0,-1.3 0.292,-2.425 0.883,-3.368c0.585,-0.947 1.388,-1.763 2.398,-2.453c1.118,-0.733 2.322,-1.341 3.619,-1.83c1.296,-0.488 2.622,-0.934 4.347,-1.438l0,10.457Z"
				  fill="#0e9cd1" fillRule="nonzero" />
		</svg>;

		return (
			<Fragment>
				<Dropdown
					className="kt-popover-font-family-container components-dropdown-menu components-toolbar"
					contentClassName="kt-popover-font-family"
					placement="top"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Fragment>
							<Button
								className="components-dropdown-menu__toggle kt-font-family-icon"
								label={ __( 'Typography Settings' ) }
								tooltip={ __( 'Typography Settings' ) }
								icon={ icons.fontfamily }
								onClick={ onToggle }
								aria-expanded={ isOpen }>
								<span className="components-dropdown-menu__indicator" />
							</Button>
						</Fragment>
					) }
					renderContent={ () => (
						<Fragment>
							{ onFontFamily && (
								<Fragment>
									<h2 className="kt-heading-fontfamily-title">{ __( 'Font Family' ) }</h2>
									<div className="typography-family-select-form-row block-editor-block-toolbar">
										<Select
											options={ typographyOptions }
											className="kt-inline-typography-select"
											classNamePrefix="kt-typography"
											value={ fontFamilyValue }
											isMulti={ false }
											isSearchable={ true }
											isClearable={ true }
											maxMenuHeight={ 200 }
											placeholder={ __( 'Default' ) }
											onChange={ onTypoFontChange }
										/>
									</div>
								</Fragment>
							) }
							<div className="typography-row-settings">
								{ onFontWeight && (
									<SelectControl
										label={ __( 'Weight', 'kadence-blocks' ) }
										value={ ( '400' === fontWeight && usingReg ? 'regular' : fontWeight ) }
										options={ typographyWeights }
										onChange={ onTypoFontWeightChange }
									/>
								) }
								{ onTextTransform && (
									<SelectControl
										label={ __( 'Transform' ) }
										value={ textTransform }
										options={ textTransformOptions }
										onChange={ ( value ) => onTextTransform( value ) }
									/>
								) }
								{ fontFamily && onFontStyle && (
									<SelectControl
										label={ __( 'Style' ) }
										value={ fontStyle }
										options={ typographyStyles }
										onChange={ onTypoFontStyleChange }
									/>
								) }
							</div>
							<div className="typography-row-settings">
								{ onLetterSpacing && (
									<div className="kt-type-input-wrap">
										<div className="components-base-control kt-typography-number-input">
											<div className="components-base-control__field">
												<label className="components-base-control__label" htmlFor={ `kt-inline-spacing${ uniqueID }` }>{ __( 'Spacing' ) }</label>
												<input
													id={ `kt-inline-spacing${ uniqueID }` }
													value={ ( undefined !== letterSpacing ? letterSpacing : '' ) }
													onChange={ onLetterSpacingInput }
													min={ -5 }
													max={ 15 }
													step={ 0.1 }
													type="number"
													className="components-text-control__input"
												/>
											</div>
										</div>
										<span className="kt-unit">{ __( 'px' ) }</span>
									</div>
								) }
								{ fontFamily && googleFont && onFontSubset && (
									<SelectControl
										label={ __( 'Subset' ) }
										value={ fontSubset }
										options={ typographySubsets }
										onChange={ ( value ) => onFontSubset( value ) }
									/>
								) }
								{ fontFamily && googleFont && onLoadGoogleFont && (
									<ToggleControl
										label={ __( 'Load Font' ) }
										checked={ loadGoogleFont }
										onChange={ onLoadGoogleFont }
									/>
								) }
							</div>
							<div className="typography-row-settings typography-size-row-settings">
								{ onFontSize && onFontSizeType && ! fontSizeArray && (
									<div className="kt-size-input-wrap">
										{ onFontSize && (
											<div className="kt-type-size-input-wrap">
												<ResponsiveFontSizeControl
													label={ __( 'Size', 'kadence-blocks' ) }
													value={ ( fontSize ? fontSize : '' ) }
													onChange={ value => onFontSize( value ) }
													tabletValue={ ( tabSize ? tabSize : '' ) }
													onChangeTablet={ ( value ) => onTabletSize( value ) }
													mobileValue={ ( mobileSize ? mobileSize : '' ) }
													onChangeMobile={ ( value ) => onMobileSize( value ) }
													min={ 0 }
													max={ fontSizeType !== 'px' ? 12 : 300 }
													step={ fontSizeType !== 'px' ? 0.001 : 1 }
													unit={ ( fontSizeType ? fontSizeType : 'px' ) }
													onUnit={ ( value ) => onFontSizeType( value ) }
													units={[ 'px', 'em', 'rem', 'vw' ]}
													radio={ false }
													compressedDevice={ true }
												/>
											</div>
										) }
									</div>
								) }
								{ onLineHeight && onLineHeightType && ! fontSizeArray && (
									<div className="kt-size-input-wrap">
										<div className="kt-type-size-input-wrap">
											<ResponsiveUnitControl
												label={__( 'Height', 'kadence-blocks' )}
												value={( lineHeight ? lineHeight : '' )}
												onChange={value => onLineHeight( value )}
												tabletValue={( tabLineHeight ? tabLineHeight : '' )}
												onChangeTablet={( value ) => onTabLineHeight( value )}
												mobileValue={( mobileLineHeight ? mobileLineHeight : '' )}
												onChangeMobile={( value ) => onMobileLineHeight( value )}
												min={0}
												max={( lineHeightType === 'px' ? 300 : 12 )}
												step={( lineHeightType === 'px' ? 1 : 0.1 )}
												unit={ lineHeightType ? lineHeightType : '' }
												onUnit={( value ) => onLineHeightType( value )}
												units={[ '-', 'px', 'em', 'rem' ]}
												compressedDevice={ true }
											/>
										</div>
									</div>
								) }
							</div>
						</Fragment>
					) }
				/>
			</Fragment>
		);
	}
}
export default ( InlineTypographyControls );
