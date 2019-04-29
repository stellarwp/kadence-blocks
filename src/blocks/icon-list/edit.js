/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icon stuff
 */
import times from 'lodash/times';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import TypographyControls from '../../typography-control';
import FaIco from '../../faicons';
import IcoNames from '../../svgiconsnames';
import WebfontLoader from '../../fontloader';

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
	InspectorControls,
	URLInput,
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
	ColorPalette,
} = wp.editor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	RangeControl,
	SelectControl,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonlistUniqueIDs = [];

class KadenceIconLists extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.saveListItem = this.saveListItem.bind( this );
		this.state = {
			focusIndex: null,
			settings: {},
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/iconlist' ] !== undefined && typeof blockConfigObject[ 'kadence/iconlist' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/iconlist' ] ).map( ( attribute ) => {
					this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/iconlist' ][ attribute ];
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kticonlistUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kticonlistUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kticonlistUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kticonlistUniqueIDs.push( this.props.attributes.uniqueID );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/iconlist' ] !== undefined && typeof blockSettings[ 'kadence/iconlist' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/iconlist' ] } );
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
	saveListItem = ( value, thisIndex ) => {
		const currentItems = this.props.attributes.items;
		const newUpdate = currentItems.map( ( item, index ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		this.props.setAttributes( {
			items: newUpdate,
		} );
	};
	render() {
		const { attributes: { listCount, items, listStyles, columns, listLabelGap, listGap, blockAlignment, uniqueID }, className, setAttributes } = this.props;
		const gconfig = {
			google: {
				families: [ listStyles[ 0 ].family + ( listStyles[ 0 ].variant ? ':' + listStyles[ 0 ].variant : '' ) ],
			},
		};
		const config = ( listStyles[ 0 ].google ? gconfig : '' );
		const saveListStyles = ( value ) => {
			const newUpdate = listStyles.map( ( item, index ) => {
				if ( index === 0 ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			setAttributes( {
				listStyles: newUpdate,
			} );
		};
		const saveAllListItem = ( value ) => {
			const newUpdate = items.map( ( item, index ) => {
				item = { ...item, ...value };
				return item;
			} );
			setAttributes( {
				items: newUpdate,
			} );
		};
		const createNewListItem = ( beforetext, aftertext, previousIndex ) => {
			const amount = Math.abs( 1 + this.props.attributes.listCount );
			const currentItems = this.props.attributes.items;
			const newItems = [ {
				icon: currentItems[ 0 ].icon,
				link: currentItems[ 0 ].link,
				target: currentItems[ 0 ].target,
				size: currentItems[ 0 ].size,
				text: currentItems[ 0 ].text,
				width: currentItems[ 0 ].width,
				color: currentItems[ 0 ].color,
				background: currentItems[ 0 ].background,
				border: currentItems[ 0 ].border,
				borderRadius: currentItems[ 0 ].borderRadius,
				borderWidth: currentItems[ 0 ].borderWidth,
				padding: currentItems[ 0 ].padding,
				style: currentItems[ 0 ].style,
			} ];
			const addin = Math.abs( previousIndex + 1 );
			this.setState( { focusIndex: addin } );
			{
				times( amount, n => {
					let ind = n;
					if ( n === 0 ) {
						if ( 0 === previousIndex ) {
							newItems[ 0 ].text = beforetext;
						}
					} else if ( n === addin ) {
						newItems.push( {
							icon: currentItems[ previousIndex ].icon,
							link: currentItems[ previousIndex ].link,
							target: currentItems[ previousIndex ].target,
							size: currentItems[ previousIndex ].size,
							text: aftertext,
							width: currentItems[ previousIndex ].width,
							color: currentItems[ previousIndex ].color,
							background: currentItems[ previousIndex ].background,
							border: currentItems[ previousIndex ].border,
							borderRadius: currentItems[ previousIndex ].borderRadius,
							borderWidth: currentItems[ previousIndex ].borderWidth,
							padding: currentItems[ previousIndex ].padding,
							style: currentItems[ previousIndex ].style,
						} );
					} else if ( n === previousIndex ) {
						newItems.push( {
							icon: currentItems[ previousIndex ].icon,
							link: currentItems[ previousIndex ].link,
							target: currentItems[ previousIndex ].target,
							size: currentItems[ previousIndex ].size,
							text: beforetext,
							width: currentItems[ previousIndex ].width,
							color: currentItems[ previousIndex ].color,
							background: currentItems[ previousIndex ].background,
							border: currentItems[ previousIndex ].border,
							borderRadius: currentItems[ previousIndex ].borderRadius,
							borderWidth: currentItems[ previousIndex ].borderWidth,
							padding: currentItems[ previousIndex ].padding,
							style: currentItems[ previousIndex ].style,
						} );
					} else {
						if ( n > addin ) {
							ind = Math.abs( n - 1 );
						}
						newItems.push( {
							icon: currentItems[ ind ].icon,
							link: currentItems[ ind ].link,
							target: currentItems[ ind ].target,
							size: currentItems[ ind ].size,
							text: currentItems[ ind ].text,
							width: currentItems[ ind ].width,
							color: currentItems[ ind ].color,
							background: currentItems[ ind ].background,
							border: currentItems[ ind ].border,
							borderRadius: currentItems[ ind ].borderRadius,
							borderWidth: currentItems[ ind ].borderWidth,
							padding: currentItems[ ind ].padding,
							style: currentItems[ ind ].style,
						} );
					}
				} );
				setAttributes( { items: newItems } );
				setAttributes( { listCount: amount } );
			}
		};
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		const renderIconSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Item' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings' ) }
					initialOpen={ ( 1 === listCount ? true : false ) }
				>
					<p className="components-base-control__label">{ __( 'Link' ) }</p>
					<URLInput
						value={ items[ index ].link }
						onChange={ value => {
							this.saveListItem( { link: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Link Target' ) }
						value={ items[ index ].target }
						options={ [
							{ value: '_self', label: __( 'Same Window' ) },
							{ value: '_blank', label: __( 'New Window' ) },
						] }
						onChange={ value => {
							this.saveListItem( { target: value }, index );
						} }
					/>
					<FontIconPicker
						icons={ IcoNames }
						value={ items[ index ].icon }
						onChange={ value => {
							this.saveListItem( { icon: value }, index );
						} }
						appendTo="body"
						renderFunc={ renderSVG }
						theme="default"
						isMulti={ false }
					/>
					<RangeControl
						label={ __( 'Icon Size' ) }
						value={ items[ index ].size }
						onChange={ value => {
							this.saveListItem( { size: value }, index );
						} }
						min={ 5 }
						max={ 250 }
					/>
					{ items[ index ].icon && 'fe' === items[ index ].icon.substring( 0, 2 ) && (
						<RangeControl
							label={ __( 'Line Width' ) }
							value={ items[ index ].width }
							onChange={ value => {
								this.saveListItem( { width: value }, index );
							} }
							step={ 0.5 }
							min={ 0.5 }
							max={ 4 }
						/>
					) }
					<p className="kt-setting-label">{ __( 'Icon Color' ) }</p>
					<ColorPalette
						value={ items[ index ].color }
						onChange={ value => {
							this.saveListItem( { color: value }, index );
						} }
					/>
					<SelectControl
						label={ __( 'Icon Style' ) }
						value={ items[ index ].style }
						options={ [
							{ value: 'default', label: __( 'Default' ) },
							{ value: 'stacked', label: __( 'Stacked' ) },
						] }
						onChange={ value => {
							this.saveListItem( { style: value }, index );
						} }
					/>
					{ items[ index ].style !== 'default' && (
						<Fragment>
							<p className="kt-setting-label">{ __( 'Icon Background' ) }</p>
							<ColorPalette
								value={ items[ index ].background }
								onChange={ value => {
									this.saveListItem( { background: value }, index );
								} }
							/>
						</Fragment>
					) }
					{ items[ index ].style !== 'default' && (
						<Fragment>
							<p className="kt-setting-label">{ __( 'Border Color' ) }</p>
							<ColorPalette
								value={ items[ index ].border }
								onChange={ value => {
									this.saveListItem( { border: value }, index );
								} }
							/>
						</Fragment>
					) }
					{ items[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Border Size (px)' ) }
							value={ items[ index ].borderWidth }
							onChange={ value => {
								this.saveListItem( { borderWidth: value }, index );
							} }
							min={ 0 }
							max={ 20 }
						/>
					) }
					{ items[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Border Radius (%)' ) }
							value={ items[ index ].borderRadius }
							onChange={ value => {
								this.saveListItem( { borderRadius: value }, index );
							} }
							min={ 0 }
							max={ 50 }
						/>
					) }
					{ items[ index ].style !== 'default' && (
						<RangeControl
							label={ __( 'Padding (px)' ) }
							value={ items[ index ].padding }
							onChange={ value => {
								this.saveListItem( { padding: value }, index );
							} }
							min={ 0 }
							max={ 180 }
						/>
					) }
				</PanelBody>
			);
		};
		const renderSettings = (
			<div>
				{ times( listCount, n => renderIconSettings( n ) ) }
			</div>
		);
		const renderIconsPreview = ( index ) => {
			return (
				<div className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index }` } >
					{ items[ index ].icon && (
						<GenIcon className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } icon={ ( 'fa' === items[ index ].icon.substring( 0, 2 ) ? FaIco[ items[ index ].icon ] : Ico[ items[ index ].icon ] ) } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } style={ {
							color: ( items[ index ].color ? items[ index ].color : undefined ),
							backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? items[ index ].background : undefined ),
							padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
							borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? items[ index ].border : undefined ),
							borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
						} } />
					) }
					<RichText
						tagName="div"
						value={ items[ index ].text }
						onChange={ value => {
							this.saveListItem( { text: value }, index );
						} }
						isSelected={ ( this.state.focusIndex === index ? true : false ) }
						unstableOnSplit={ ( before, after ) => {
							createNewListItem( before, after, index );
						} }
						className={ 'kt-svg-icon-list-text' }
					/>
				</div>
			);
		};
		return (
			<div className={ className }>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
				</BlockControls>
				{ this.showSettings( 'allSettings' ) && (
					<InspectorControls>
						<PanelBody
							title={ __( 'List Controls' ) }
							initialOpen={ true }
						>
							<RangeControl
								label={ __( 'Number of Items' ) }
								value={ listCount }
								onChange={ newcount => {
									const newitems = items;
									if ( newitems.length < newcount ) {
										const amount = Math.abs( newcount - newitems.length );
										{ times( amount, n => {
											newitems.push( {
												icon: newitems[ 0 ].icon,
												link: newitems[ 0 ].link,
												target: newitems[ 0 ].target,
												size: newitems[ 0 ].size,
												width: newitems[ 0 ].width,
												color: newitems[ 0 ].color,
												background: newitems[ 0 ].background,
												border: newitems[ 0 ].border,
												borderRadius: newitems[ 0 ].borderRadius,
												borderWidth: newitems[ 0 ].borderWidth,
												padding: newitems[ 0 ].padding,
												style: newitems[ 0 ].style,
											} );
										} ); }
										setAttributes( { items: newitems } );
										this.saveListItem( { size: items[ 0 ].size }, 0 );
									}
									setAttributes( { listCount: newcount } );
								} }
								min={ 1 }
								max={ 40 }
							/>
							{ this.showSettings( 'column' ) && (
								<RangeControl
									label={ __( 'List Columns' ) }
									value={ columns }
									onChange={ value => {
										setAttributes( { columns: value } );
									} }
									min={ 1 }
									max={ 3 }
								/>
							) }
							{ this.showSettings( 'spacing' ) && (
								<Fragment>
									<RangeControl
										label={ __( 'List Vertical Spacing' ) }
										value={ listGap }
										onChange={ value => {
											setAttributes( { listGap: value } );
										} }
										min={ 0 }
										max={ 60 }
									/>
									<RangeControl
										label={ __( 'List Horizontal Icon and Label Spacing' ) }
										value={ listLabelGap }
										onChange={ value => {
											setAttributes( { listLabelGap: value } );
										} }
										min={ 0 }
										max={ 60 }
									/>
								</Fragment>
							) }
						</PanelBody>
						{ this.showSettings( 'textStyle' ) && (
							<PanelBody
								title={ __( 'List Text Styling' ) }
								initialOpen={ false }
							>
								<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
								<ColorPalette
									value={ listStyles[ 0 ].color }
									onChange={ value => saveListStyles( { color: value } ) }
								/>
								<TypographyControls
									fontSize={ listStyles[ 0 ].size }
									onFontSize={ ( value ) => saveListStyles( { size: value } ) }
									fontSizeType={ listStyles[ 0 ].sizeType }
									onFontSizeType={ ( value ) => saveListStyles( { sizeType: value } ) }
									lineHeight={ listStyles[ 0 ].lineHeight }
									onLineHeight={ ( value ) => saveListStyles( { lineHeight: value } ) }
									lineHeightType={ listStyles[ 0 ].lineType }
									onLineHeightType={ ( value ) => saveListStyles( { lineType: value } ) }
									letterSpacing={ listStyles[ 0 ].letterSpacing }
									onLetterSpacing={ ( value ) => saveListStyles( { letterSpacing: value } ) }
									fontFamily={ listStyles[ 0 ].family }
									onFontFamily={ ( value ) => saveListStyles( { family: value } ) }
									onFontChange={ ( select ) => {
										saveListStyles( {
											family: select.value,
											google: select.google,
										} );
									} }
									onFontArrayChange={ ( values ) => saveListStyles( values ) }
									googleFont={ listStyles[ 0 ].google }
									onGoogleFont={ ( value ) => saveListStyles( { google: value } ) }
									loadGoogleFont={ listStyles[ 0 ].loadGoogle }
									onLoadGoogleFont={ ( value ) => saveListStyles( { loadGoogle: value } ) }
									fontVariant={ listStyles[ 0 ].variant }
									onFontVariant={ ( value ) => saveListStyles( { variant: value } ) }
									fontWeight={ listStyles[ 0 ].weight }
									onFontWeight={ ( value ) => saveListStyles( { weight: value } ) }
									fontStyle={ listStyles[ 0 ].style }
									onFontStyle={ ( value ) => saveListStyles( { style: value } ) }
									fontSubset={ listStyles[ 0 ].subset }
									onFontSubset={ ( value ) => saveListStyles( { subset: value } ) }
									textTransform={ listStyles[ 0 ].textTransform }
									onTextTransform={ ( value ) => saveListStyles( { textTransform: value } ) }
								/>
							</PanelBody>
						) }
						{ this.showSettings( 'joinedIcons' ) && (
							<PanelBody
								title={ __( 'Edit All Icon Styles Together' ) }
								initialOpen={ false }
							>
								<p>{ __( 'PLEASE NOTE: This will override individual list item settings.' ) }</p>
								<FontIconPicker
									icons={ IcoNames }
									value={ items[ 0 ].icon }
									onChange={ value => {
										saveAllListItem( { icon: value } );
									} }
									appendTo="body"
									renderFunc={ renderSVG }
									theme="default"
									isMulti={ false }
								/>
								<RangeControl
									label={ __( 'Icon Size' ) }
									value={ items[ 0 ].size }
									onChange={ value => {
										saveAllListItem( { size: value } );
									} }
									min={ 5 }
									max={ 250 }
								/>
								{ items[ 0 ].icon && 'fe' === items[ 0 ].icon.substring( 0, 2 ) && (
									<RangeControl
										label={ __( 'Line Width' ) }
										value={ items[ 0 ].width }
										onChange={ value => {
											saveAllListItem( { width: value } );
										} }
										step={ 0.5 }
										min={ 0.5 }
										max={ 4 }
									/>
								) }
								<p className="kt-setting-label">{ __( 'Icon Color' ) }</p>
								<ColorPalette
									value={ items[ 0 ].color }
									onChange={ value => {
										saveAllListItem( { color: value } );
									} }
								/>
								<SelectControl
									label={ __( 'Icon Style' ) }
									value={ items[ 0 ].style }
									options={ [
										{ value: 'default', label: __( 'Default' ) },
										{ value: 'stacked', label: __( 'Stacked' ) },
									] }
									onChange={ value => {
										saveAllListItem( { style: value } );
									} }
								/>
								{ items[ 0 ].style !== 'default' && (
									<Fragment>
										<p className="kt-setting-label">{ __( 'Icon Background' ) }</p>
										<ColorPalette
											value={ items[ 0 ].background }
											onChange={ value => {
												saveAllListItem( { background: value } );
											} }
										/>
									</Fragment>
								) }
								{ items[ 0 ].style !== 'default' && (
									<Fragment>
										<p className="kt-setting-label">{ __( 'Border Color' ) }</p>
										<ColorPalette
											value={ items[ 0 ].border }
											onChange={ value => {
												saveAllListItem( { border: value } );
											} }
										/>
									</Fragment>
								) }
								{ items[ 0 ].style !== 'default' && (
									<RangeControl
										label={ __( 'Border Size (px)' ) }
										value={ items[ 0 ].borderWidth }
										onChange={ value => {
											saveAllListItem( { borderWidth: value } );
										} }
										min={ 0 }
										max={ 20 }
									/>
								) }
								{ items[ 0 ].style !== 'default' && (
									<RangeControl
										label={ __( 'Border Radius (%)' ) }
										value={ items[ 0 ].borderRadius }
										onChange={ value => {
											saveAllListItem( { borderRadius: value } );
										} }
										min={ 0 }
										max={ 50 }
									/>
								) }
								{ items[ 0 ].style !== 'default' && (
									<RangeControl
										label={ __( 'Padding (px)' ) }
										value={ items[ 0 ].padding }
										onChange={ value => {
											saveAllListItem( { padding: value } );
										} }
										min={ 0 }
										max={ 180 }
									/>
								) }
							</PanelBody>
						) }
						<div className="kt-sidebar-settings-spacer"></div>
						{ this.showSettings( 'individualIcons' ) && (
							<PanelBody
								title={ __( 'Individual list Item Settings' ) }
								initialOpen={ false }
							>
								{ renderSettings }
							</PanelBody>
						) }
					</InspectorControls>
				) }
				<style>
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap:not(:last-child) { margin-bottom: ${ listGap }px; }` }
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-single { margin-right: ${ listLabelGap }px; }` }
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap {
							font-weight: ${ ( listStyles[ 0 ].weight ? listStyles[ 0 ].weight : '' ) };
							font-style: ${ ( listStyles[ 0 ].style ? listStyles[ 0 ].style : '' ) };
							color:  ${ ( listStyles[ 0 ].color ? listStyles[ 0 ].color : '' ) };
							font-size: ${ ( listStyles[ 0 ].size && listStyles[ 0 ].size[ 0 ] ? listStyles[ 0 ].size[ 0 ] + listStyles[ 0 ].sizeType : '' ) };
							line-height: ${ ( listStyles[ 0 ].lineHeight && listStyles[ 0 ].lineHeight[ 0 ] ? listStyles[ 0 ].lineHeight[ 0 ] + listStyles[ 0 ].lineType : '' ) };
							letter-spacing: ${ ( listStyles[ 0 ].letterSpacing ? listStyles[ 0 ].letterSpacing + 'px' : '' ) };
							font-family: ${ ( listStyles[ 0 ].family ? listStyles[ 0 ].family : '' ) };
							text-transform: ${ ( listStyles[ 0 ].textTransform ? listStyles[ 0 ].textTransform : '' ) };
						}`
					}
				</style>
				{ listStyles[ 0 ].google && (
					<WebfontLoader config={ config }>
					</WebfontLoader>
				) }
				<div className={ `kt-svg-icon-list-container kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns }` }>
					{ times( listCount, n => renderIconsPreview( n ) ) }
				</div>
			</div>
		);
	}
}
export default ( KadenceIconLists );

