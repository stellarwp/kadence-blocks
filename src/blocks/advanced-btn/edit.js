/**
 * BLOCK: Kadence Advanced Btn
 *
 * Editor for Advanced Btn
 */
import times from 'lodash/times';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
import IcoNames from '../../svgiconsnames';
import TypographyControls from '../../typography-control';
import WebfontLoader from '../../fontloader';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	RichText,
	URLInput,
	ColorPalette,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} = wp.editor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	IconButton,
	TabPanel,
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktadvancedbuttonUniqueIDs = [];

class KadenceAdvancedButton extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			btnFocused: 'false',
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/advancedbtn' ];
			if ( blockConfig !== undefined && typeof blockConfig === 'object' ) {
				Object.keys( blockConfig ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfig[ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedbuttonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktadvancedbuttonUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktadvancedbuttonUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktadvancedbuttonUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	componentDidUpdate( prevProps ) {
		if ( ! this.props.isSelected && prevProps.isSelected && this.state.btnFocused ) {
			this.setState( {
				btnFocused: 'false',
			} );
		}
	}
	saveArrayUpdate( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { btns } = attributes;

		const newItems = btns.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			btns: newItems,
		} );
	}
	render() {
		const { attributes: { uniqueID, btnCount, btns, hAlign, letterSpacing, fontStyle, fontWeight, typography, googleFont, loadGoogleFont, fontSubset, fontVariant }, className, setAttributes, isSelected } = this.props;
		const gconfig = {
			google: {
				families: [ typography + ( fontVariant ? ':' + fontVariant : '' ) ],
			},
		};
		const config = ( googleFont ? gconfig : '' );
		const renderBtns = ( index ) => {
			return (
				<div className={ `btn-area-wrap kt-btn-${ index }-area` }>
					<span className={ `kt-button-wrap kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) }` }>
						<span className={ `kt-button kt-button-${ index }` } style={ {
							backgroundColor: btns[ index ].background,
							color: btns[ index ].color,
							fontSize: btns[ index ].size + 'px',
							fontWeight: fontWeight,
							fontStyle: fontStyle,
							letterSpacing: letterSpacing + 'px',
							fontFamily: ( typography ? typography : '' ),
							borderRadius: btns[ index ].borderRadius + 'px',
							borderWidth: btns[ index ].borderWidth + 'px',
							borderColor: btns[ index ].border,
							paddingLeft: btns[ index ].paddingLR + 'px',
							paddingRight: btns[ index ].paddingLR + 'px',
							paddingTop: btns[ index ].paddingBT + 'px',
							paddingBottom: btns[ index ].paddingBT + 'px',
						} } >
							{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
							) }
							<RichText
								tagName="div"
								placeholder={ __( 'Button...' ) }
								value={ btns[ index ].text }
								unstableOnFocus={ () => {
									if ( 1 === index ) {
										onFocusBtn1();
									} else if ( 2 === index ) {
										onFocusBtn2();
									} else if ( 3 === index ) {
										onFocusBtn3();
									} else if ( 4 === index ) {
										onFocusBtn4();
									} else {
										onFocusBtn();
									}
								} }
								onChange={ value => {
									this.saveArrayUpdate( { text: value }, index );
								} }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								className={ 'kt-button-text' }
								keepPlaceholderOnFocus
							/>
							{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
							) }
						</span>
					</span>
					{ isSelected && ( ( this.state.btnFocused && 'btn' + [ index ] === this.state.btnFocused ) || ( this.state.btnFocused && 'false' === this.state.btnFocused && '0' === index ) ) && (
						<form
							key={ 'form-link' }
							onSubmit={ ( event ) => event.preventDefault() }
							className="blocks-button__inline-link">
							<URLInput
								value={ btns[ index ].link }
								onChange={ value => {
									this.saveArrayUpdate( { link: value }, index );
								} }
							/>
							<IconButton
								icon={ 'editor-break' }
								label={ __( 'Apply' ) }
								type={ 'submit' }
							/>
						</form>
					) }
				</div>
			);
		};
		const onFocusBtn = () => {
			if ( 'btn0' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn0',
				} );
			}
		};
		const onFocusBtn1 = () => {
			if ( 'btn1' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn1',
				} );
			}
		};
		const onFocusBtn2 = () => {
			if ( 'btn2' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn2',
				} );
			}
		};
		const onFocusBtn3 = () => {
			if ( 'btn3' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn3',
				} );
			}
		};
		const onFocusBtn4 = () => {
			if ( 'btn4' !== this.state.btnFocused ) {
				this.setState( {
					btnFocused: 'btn4',
				} );
			}
		};
		const tabControls = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Button' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings' ) }
					initialOpen={ false }
				>
					<p className="components-base-control__label">{ __( 'Link' ) }</p>
					<URLInput
						value={ btns[ index ].link }
						onChange={ value => {
							this.saveArrayUpdate( { link: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Link Target' ) }
						value={ btns[ index ].target }
						options={ [
							{ value: '_self', label: __( 'Same Window' ) },
							{ value: '_blank', label: __( 'New Window' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { target: value }, index );
						} }
					/>
					<RangeControl
						beforeIcon="editor-textcolor"
						afterIcon="editor-textcolor"
						label={ __( 'Button Text Size' ) }
						value={ btns[ index ].size }
						onChange={ value => {
							this.saveArrayUpdate( { size: value }, index );
						} }
						min={ 10 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Top and Bottom Padding' ) }
						value={ btns[ index ].paddingBT }
						onChange={ value => {
							this.saveArrayUpdate( { paddingBT: value }, index );
						} }
						min={ 0 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Left and Right Padding' ) }
						value={ btns[ index ].paddingLR }
						onChange={ value => {
							this.saveArrayUpdate( { paddingLR: value }, index );
						} }
						min={ 0 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Border Thickness' ) }
						value={ btns[ index ].borderWidth }
						onChange={ value => {
							this.saveArrayUpdate( { borderWidth: value }, index );
						} }
						min={ 0 }
						max={ 20 }
					/>
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ btns[ index ].borderRadius }
						onChange={ value => {
							this.saveArrayUpdate( { borderRadius: value }, index );
						} }
						min={ 0 }
						max={ 50 }
					/>
					<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
					<TabPanel className="kt-inspect-tabs kt-hover-tabs"
						activeClass="active-tab"
						tabs={ [
							{
								name: 'normal' + index,
								title: __( 'Normal' ),
								className: 'kt-normal-tab',
							},
							{
								name: 'hover' + index,
								title: __( 'Hover' ),
								className: 'kt-hover-tab',
							},
						] }>
						{
							( tab ) => {
								let tabout;
								if ( tab.name ) {
									if ( 'hover' + index === tab.name ) {
										tabout = hoverSettings( index );
									} else {
										tabout = buttonSettings( index );
									}
								}
								return <div>{ tabout }</div>;
							}
						}
					</TabPanel>
					<h2 className="kt-tool">{ __( 'Icon Settings' ) }</h2>
					<FontIconPicker
						icons={ IcoNames }
						value={ btns[ index ].icon }
						onChange={ value => {
							this.saveArrayUpdate( { icon: value }, index );
						} }
						appendTo="body"
						renderFunc={ renderSVG }
						theme="default"
						isMulti={ false }
					/>
					<SelectControl
						label={ __( 'Icon Location' ) }
						value={ btns[ index ].iconSide }
						options={ [
							{ value: 'right', label: __( 'Right' ) },
							{ value: 'left', label: __( 'Left' ) },
						] }
						onChange={ value => {
							this.saveArrayUpdate( { iconSide: value }, index );
						} }
					/>
					<TextControl
						label={ __( 'Add Custom CSS Class' ) }
						value={ ( btns[ index ].cssClass ? btns[ index ].cssClass : '' ) }
						onChange={ ( value ) => this.saveArrayUpdate( { cssClass: value }, index ) }
					/>
				</PanelBody>
			);
		};
		const hoverSettings = ( index ) => {
			return (
				<div>
					<p className="kt-setting-label">{ __( 'Hover Font Color' ) }</p>
					<ColorPalette
						value={ btns[ index ].colorHover }
						onChange={ value => {
							this.saveArrayUpdate( { colorHover: value }, index );
						} }
					/>
					<p className="kt-setting-label">{ __( 'Hover Background Color' ) }</p>
					<ColorPalette
						value={ btns[ index ].backgroundHover }
						onChange={ value => {
							this.saveArrayUpdate( { backgroundHover: value }, index );
						} }
					/>
					<p className="kt-setting-label">{ __( 'Button Hover Border Color' ) }</p>
					<ColorPalette
						value={ btns[ index ].borderHover }
						onChange={ value => {
							this.saveArrayUpdate( { borderHover: value }, index );
						} }
					/>
				</div>
			);
		};
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const buttonSettings = ( index ) => {
			return (
				<div>
					<p className="kt-setting-label">{ __( 'Font Color' ) }</p>
					<ColorPalette
						value={ btns[ index ].color }
						onChange={ value => {
							this.saveArrayUpdate( { color: value }, index );
						} }
					/>
					<p className="kt-setting-label">{ __( 'Background Color' ) }</p>
					<ColorPalette
						value={ btns[ index ].background }
						onChange={ value => {
							this.saveArrayUpdate( { background: value }, index );
						} }
					/>
					<p className="kt-setting-label">{ __( 'Border Color' ) }</p>
					<ColorPalette
						value={ btns[ index ].border }
						onChange={ value => {
							this.saveArrayUpdate( { border: value }, index );
						} }
					/>
				</div>
			);
		};
		const renderArray = (
			<Fragment>
				{ times( btnCount, n => tabControls( n ) ) }
			</Fragment>
		);
		const renderPreviewArray = (
			<div>
				{ times( btnCount, n => renderBtns( n ) ) }
			</div>
		);
		const renderBtnCSS = ( index ) => {
			return (
				`#kt-btns_${ uniqueID } .kt-button-${ index }:hover {
					color: ${ btns[ index ].colorHover } !important;
					border-color: ${ btns[ index ].borderHover } !important;
					background-color: ${ btns[ index ].backgroundHover } !important;
				}`
			);
		};
		const renderCSS = (
			<style>
				{ times( btnCount, n => renderBtnCSS( n ) ) }
			</style>
		);
		return (
			<Fragment>
				{ renderCSS }
				<div id={ `kt-btns_${ uniqueID }` } className={ `${ className } kt-btn-align-${ hAlign }` }>
					<BlockControls>
						<AlignmentToolbar
							value={ hAlign }
							onChange={ ( value ) => setAttributes( { hAlign: value } ) }
						/>
					</BlockControls>
					<InspectorControls>
						<PanelBody
							title={ __( 'Button Count' ) }
							initialOpen={ true }
						>
							<RangeControl
								label={ __( 'Number of Buttons' ) }
								value={ btnCount }
								onChange={ newcount => {
									const newbtns = btns;
									if ( newbtns.length < newcount ) {
										const amount = Math.abs( newcount - newbtns.length );
										{ times( amount, n => {
											newbtns.push( {
												text: newbtns[ 0 ].text,
												link: newbtns[ 0 ].link,
												target: newbtns[ 0 ].target,
												size: newbtns[ 0 ].size,
												paddingBT: newbtns[ 0 ].paddingBT,
												paddingLR: newbtns[ 0 ].paddingLR,
												color: newbtns[ 0 ].color,
												background: newbtns[ 0 ].background,
												border: newbtns[ 0 ].border,
												borderRadius: newbtns[ 0 ].borderRadius,
												borderWidth: newbtns[ 0 ].borderWidth,
												colorHover: newbtns[ 0 ].colorHover,
												backgroundHover: newbtns[ 0 ].backgroundHover,
												borderHover: newbtns[ 0 ].borderHover,
												icon: newbtns[ 0 ].icon,
												iconSide: newbtns[ 0 ].iconSide,
												iconHover: newbtns[ 0 ].iconHover,
												cssClass: ( newbtns[ 0 ].cssClass ? newbtns[ 0 ].cssClass : '' ),
											} );
										} ); }
										setAttributes( { btns: newbtns } );
									}
									setAttributes( { btnCount: newcount } );
								} }
								min={ 1 }
								max={ 5 }
							/>
						</PanelBody>
						{ renderArray }
						<PanelBody
							title={ __( 'Font Family' ) }
							initialOpen={ false }
							className="kt-font-family-area"
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
							/>
						</PanelBody>
					</InspectorControls>
					<div className={ 'btn-inner-wrap' } >
						{ renderPreviewArray }
						{ googleFont && (
							<WebfontLoader config={ config }>
							</WebfontLoader>
						) }
					</div>
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceAdvancedButton );
