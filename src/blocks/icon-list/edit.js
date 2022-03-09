/**
 * BLOCK: Kadence Icon
 */

 /**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import Icon stuff
 */
import times from 'lodash/times';
import MeasurementControls from '../../measurement-control';
import TypographyControls from '../../components/typography/typography-control';
import WebfontLoader from '../../components/typography/fontloader';
import map from 'lodash/map';
import debounce from 'lodash/debounce';
import IconControl from '../../components/icons/icon-control';
import IconRender from '../../components/icons/icon-render';
import StepControl from '../../step-control';
import filter from 'lodash/filter';
import KadenceColorOutput from '../../kadence-color-output';
import AdvancedPopColorControl from '../../advanced-pop-color-control';
import URLInputControl from '../../components/links/link-control';
import DynamicTextControl from '../../components/common/dynamic-text-control';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

const {
	InspectorControls,
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
} = wp.blockEditor;
const {
	Component,
	Fragment,
	findDOMNode,
} = wp.element;
const {
	PanelBody,
	RangeControl,
	ButtonGroup,
	Tooltip,
	IconButton,
	Button,
	SelectControl,
} = wp.components;

import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import {
	plus,
	chevronUp,
	chevronDown,
	close,
} from '@wordpress/icons';
import {
	applyFilters,
} from '@wordpress/hooks';
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonlistUniqueIDs = [];

class KadenceIconLists extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.saveListItem = this.saveListItem.bind( this );
		this.onSelectItem = this.onSelectItem.bind( this );
		this.onMove = this.onMove.bind( this );
		this.onMoveDown = this.onMoveDown.bind( this );
		this.onMoveUp = this.onMoveUp.bind( this );
		this.createNewListItem = this.createNewListItem.bind( this );
		this.setFocusOnNewItem = this.setFocusOnNewItem.bind( this );
		this.getPreviewSize = this.getPreviewSize.bind( this );
		this.state = {
			focusIndex: null,
			settings: {},
			marginControl: 'individual',
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
		};
		this.debouncedCreateListItem = debounce( this.createNewListItem.bind( this ), 100 );
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/iconlist' ] !== undefined && typeof blockConfigObject[ 'kadence/iconlist' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/iconlist' ] ).map( ( attribute ) => {
					if ( attribute === 'items' ) {
						this.props.attributes[ attribute ] = this.props.attributes[ attribute ].map( ( item, index ) => {
							item.icon = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].icon;
							item.size = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].size;
							item.color = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].color;
							item.background = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].background;
							item.border = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].border;
							item.borderRadius = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].borderRadius;
							item.padding = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].padding;
							item.borderWidth = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].borderWidth;
							item.style = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].style;
							return item;
						} );
					} else {
						this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/iconlist' ][ attribute ];
					}
				} );
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kticonlistUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kticonlistUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			kticonlistUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kticonlistUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( undefined !== this.props.attributes.listMargin && undefined !== this.props.attributes.listMargin[ 0 ] && this.props.attributes.listMargin[ 0 ] === this.props.attributes.listMargin[ 1 ] && this.props.attributes.listMargin[ 0 ] === this.props.attributes.listMargin[ 2 ] && this.props.attributes.listMargin[ 0 ] === this.props.attributes.listMargin[ 3 ] ) {
			this.setState( { marginControl: 'linked' } );
		} else {
			this.setState( { marginControl: 'individual' } );
		}
		const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( blockSettings[ 'kadence/iconlist' ] !== undefined && typeof blockSettings[ 'kadence/iconlist' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/iconlist' ] } );
		}
	}
	componentDidUpdate( prevProps ) {
		// Deselect images when deselecting the block
		if ( ! this.props.isSelected && prevProps.isSelected ) {
			this.setState( {
				focusIndex: null,
			} );
		}
	}
	createNewListItem( value, entireOld, previousIndex ) {
		const previousValue = entireOld.replace( value, '' );
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
		{
			times( amount, n => {
				let ind = n;
				if ( n === 0 ) {
					if ( 0 === previousIndex ) {
						newItems[ 0 ].text = previousValue;
					}
				} else if ( n === addin ) {
					newItems.push( {
						icon: currentItems[ previousIndex ].icon,
						link: currentItems[ previousIndex ].link,
						target: currentItems[ previousIndex ].target,
						size: currentItems[ previousIndex ].size,
						text: value,
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
						text: previousValue,
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
			this.props.setAttributes( { items: newItems } );
			this.props.setAttributes( { listCount: amount } );
			this.setState( { focusIndex: addin } );
			this.setFocusOnNewItem( addin, this.props.attributes.uniqueID );
		}
	};
	// Silly Hack to handle focus.
	setFocusOnNewItem( index, uniqueID ) {
		setTimeout( function(){ 
			if ( document.querySelector( `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-${ index }` ) ) {
				const parent = document.querySelector( `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-${ index }` );
				const rich = parent.querySelector( '.rich-text' );
				rich.focus();
			}
		}, 100);
	}
	onSelectItem( index ) {
		return () => {
			if ( this.state.focusIndex !== index ) {
				this.setState( {
					focusIndex: index,
				} );
			}
		};
	}
	onMove( oldIndex, newIndex ) {
		const items = [ ...this.props.attributes.items ];
		items.splice( newIndex, 1, this.props.attributes.items[ oldIndex ] );
		items.splice( oldIndex, 1, this.props.attributes.items[ newIndex ] );
		this.setState( { focusIndex: newIndex } );
		this.props.setAttributes( { items } );
	}

	onMoveDown( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.attributes.items.length - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveUp( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
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
	saveListItem( value, thisIndex ) {
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
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	render() {
		const { attributes: { listCount, items, listStyles, columns, listLabelGap, listGap, blockAlignment, uniqueID, listMargin, iconAlign, tabletColumns, mobileColumns }, attributes, className, setAttributes, isSelected } = this.props;
		const { marginControl } = this.state;
		const gconfig = {
			google: {
				families: [ listStyles[ 0 ].family + ( listStyles[ 0 ].variant ? ':' + listStyles[ 0 ].variant : '' ) ],
			},
		};
		const config = ( listStyles[ 0 ].google ? gconfig : '' );
		const previewFontSize = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 0 ] ? listStyles[ 0 ].size[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 1 ] ? listStyles[ 0 ].size[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 2 ] ? listStyles[ 0 ].size[ 2 ] : '' ) );
		const previewLineHeight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 0 ] ? listStyles[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 1 ] ? listStyles[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 2 ] ? listStyles[ 0 ].lineHeight[ 2 ] : '' ) );
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
		const iconAlignOptions = [
			{ key: 'top', name: __( 'Top', 'kadence-blocks' ), icon: icons.aligntop },
			{ key: 'middle', name: __( 'Middle', 'kadence-blocks' ), icon: icons.alignmiddle },
			{ key: 'bottom', name: __( 'Bottom', 'kadence-blocks' ), icon: icons.alignbottom },
		];
		const stopOnReplace = ( value, index ) => {
			if ( value && undefined !== value[ 0 ] && undefined !== value[ 0 ].attributes && value[ 0 ].attributes.content ) {
				this.saveListItem( { text: value[ 0 ].attributes.content }, index );
			}
		};
		const removeListItem = ( value, previousIndex ) => {
			const amount = Math.abs( this.props.attributes.listCount );
			if ( amount === 1 ) {
				// Remove Block.
				this.props.onDelete();
			} else {
				const newAmount = Math.abs( amount - 1 );
				const currentItems = filter( this.props.attributes.items, ( item, i ) => previousIndex !== i );
				const addin = Math.abs( previousIndex - 1 );
				this.setState( { focusIndex: addin } );
				setAttributes( {
					items: currentItems,
					listCount: newAmount,
				} );
			}
		};
		const blockToolControls = ( index ) => {
			const isLineSelected = ( isSelected && this.state.focusIndex === index && kadence_blocks_params.dynamic_enabled );
			if ( ! isLineSelected ) {
				return;
			}
			return <DynamicTextControl dynamicAttribute={ 'items:' + index + ':text' } {...this.props} />;
		}
		const renderIconSettings = ( index ) => {
			return (
				<PanelBody
					title={ __( 'Item', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
					initialOpen={ ( 1 === listCount ? true : false ) }
				>
					<URLInputControl
						label={ __( 'Link', 'kadence-blocks' ) }
						url={ items[ index ].link }
						onChangeUrl={ value => {
							this.saveListItem( { link: value }, index );
						} }
						additionalControls={ true }
						opensInNewTab={ ( items[ index ].target && '_blank' == items[ index ].target ? true : false ) }
						onChangeTarget={ value => {
							if ( value ) {
									this.saveListItem( { target: '_blank' }, index );
							} else {
									this.saveListItem( { target: '_self' }, index );
							}
						} }
						dynamicAttribute={ 'items:' + index + ':link' }
						allowClear={ true }
						{ ...this.props }
					/>
					<IconControl
						value={ items[ index ].icon }
						onChange={ value => {
							this.saveListItem( { icon: value }, index );
						} }
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
					<AdvancedPopColorControl
						label={ __( 'Icon Color' ) }
						colorValue={ ( items[ index ].color ? items[ index ].color : '' ) }
						colorDefault={ '' }
						onColorChange={ value => {
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
						<AdvancedPopColorControl
							label={ __( 'Icon Background' ) }
							colorValue={ ( items[ index ].background ? items[ index ].background : '' ) }
							colorDefault={ '' }
							onColorChange={ value => {
								this.saveListItem( { background: value }, index );
							} }
						/>
					) }
					{ items[ index ].style !== 'default' && (
						<AdvancedPopColorControl
							label={ __( 'Border Color' ) }
							colorValue={ ( items[ index ].border ? items[ index ].border : '' ) }
							colorDefault={ '' }
							onColorChange={ value => {
								this.saveListItem( { border: value }, index );
							} }
						/>
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
		const renderToolControls = (
			<div>
				{ times( listCount, n => blockToolControls( n ) ) }
			</div>
		);
		const renderIconsPreview = ( index ) => {
			return (
				<div className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index }` } >
					{ items[ index ].icon && (
						<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } style={ {
							color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
							backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
							padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
							borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
							borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
						} } />
					) }
					{/* { applyFilters( 'kadence.dynamicContent', <RichText
						tagName="div"
						value={ items[ index ].text }
						onChange={ value => {
							this.saveListItem( { text: value }, index );
						} }
						onSplit={ ( value ) => {
							if ( ! value ) {
								return createNewListItem( '', items[ index ].text, index );
							}
							return createNewListItem( value, items[ index ].text, index );
						} }
						onRemove={ ( value ) => {
							removeListItem( value, index );
						} }
						//isSelected={ this.state.focusIndex === index }
						unstableOnFocus={ this.onSelectItem( index ) }
						onReplace={ ( value ) => {
							stopOnReplace( value, index );
						} }
						className={ 'kt-svg-icon-list-text' }
						allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'core/bold', 'core/italic', 'core/link', 'core/strikethrough', 'core/subscript', 'core/superscript', 'core/text-color', 'toolset/inline-field' ], 'kadence/iconlist' ) }
					/>, attributes, 'items:' + index + ':text' ) } */}
					<RichText
						tagName="div"
						value={ items[ index ].text }
						onChange={ value => {
							this.saveListItem( { text: value }, index );
						} }
						onSplit={ ( value ) => {
							if ( ! value ) {
								return this.debouncedCreateListItem( '', items[ index ].text, index );
							}
							return this.debouncedCreateListItem( value, items[ index ].text, index );
						} }
						onRemove={ ( value ) => {
							removeListItem( value, index );
						} }
						//isSelected={ this.state.focusIndex === index }
						unstableOnFocus={ this.onSelectItem( index ) }
						onReplace={ ( value ) => {
							stopOnReplace( value, index );
						} }
						className={ 'kt-svg-icon-list-text' }
					/>
					<div className="kadence-blocks-list-item__control-menu">
						<Button
							icon="arrow-up"
							onClick={ index === 0 ? undefined : this.onMoveUp( index ) }
							className="kadence-blocks-list-item__move-up"
							label={ __( 'Move Item Up', 'kadence-blocks' ) }
							aria-disabled={ index === 0 }
							disabled={ ! this.state.focusIndex === index }
						/>
						<Button
							icon="arrow-down"
							onClick={ ( index + 1 ) === listCount ? undefined : this.onMoveDown( index ) }
							className="kadence-blocks-list-item__move-down"
							label={ __( 'Move Item Down', 'kadence-blocks' ) }
							aria-disabled={ ( index + 1 ) === listCount }
							disabled={ ! this.state.focusIndex === index }
						/>
						<Button
							icon="no-alt"
							onClick={ () => removeListItem( null, index ) }
							className="kadence-blocks-list-item__remove"
							label={ __( 'Remove Item', 'kadence-blocks' ) }
							disabled={ ! this.state.focusIndex === index }
						/>
					</div>
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
							<StepControl
								label={ __( 'Number of Items' ) }
								value={ listCount }
								onChange={ ( newcount ) => {
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
								step={ 1 }
							/>
							{ this.showSettings( 'column' ) && (
								<ResponsiveRangeControls
									label={ __( 'List Columns', 'kadence-blocks' ) }
									value={ columns }
									onChange={ value => setAttributes( { columns: value } ) }
									tabletValue={ ( tabletColumns ? tabletColumns : '' ) }
									onChangeTablet={ ( value ) => setAttributes( { tabletColumns: value } ) }
									mobileValue={ ( mobileColumns ? mobileColumns : '' ) }
									onChangeMobile={ ( value ) => setAttributes( { mobileColumns: value } ) }
									min={ 1 }
									max={ 3 }
									step={ 1 }
									showUnit={ false }
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
									<div className="kt-btn-size-settings-container">
										<h2 className="kt-beside-btn-group">{ __( 'Icon Align' ) }</h2>
										<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Icon Align' ) }>
											{ map( iconAlignOptions, ( { name, icon, key } ) => (
												<Tooltip text={ name }>
													<Button
														key={ key }
														className="kt-btn-size-btn"
														isSmall
														isPrimary={ iconAlign === key }
														aria-pressed={ iconAlign === key }
														onClick={ () => setAttributes( { iconAlign: key } ) }
													>
														{ icon }
													</Button>
												</Tooltip>
											) ) }
										</ButtonGroup>
									</div>
									<MeasurementControls
										label={ __( 'List Margin' ) }
										measurement={ undefined !== listMargin ? listMargin : [ 0, 0, 10, 0 ] }
										control={ marginControl }
										onChange={ ( value ) => setAttributes( { listMargin: value } ) }
										onControl={ ( value ) => this.setState( { marginControl: value } ) }
										min={ -200 }
										max={ 200 }
										step={ 1 }
									/>
								</Fragment>
							) }
						</PanelBody>
						{ this.showSettings( 'textStyle' ) && (
							<PanelBody
								title={ __( 'List Text Styling' ) }
								initialOpen={ false }
							>
								<AdvancedPopColorControl
									label={ __( 'Color Settings' ) }
									colorValue={ ( listStyles[ 0 ].color ? listStyles[ 0 ].color : '' ) }
									colorDefault={ '' }
									onColorChange={ value => {
										saveListStyles( { color: value } );
									} }
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
								<IconControl
									value={ items[ 0 ].icon }
									onChange={ value => {
										if ( value !== items[ 0 ].icon ) {
											saveAllListItem( { icon: value } );
										}
									} }
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
								<AdvancedPopColorControl
									label={ __( 'Icon Color' ) }
									colorValue={ ( items[ 0 ].color ? items[ 0 ].color : '' ) }
									colorDefault={ '' }
									onColorChange={ value => {
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
									<AdvancedPopColorControl
										label={ __( 'Icon Background' ) }
										colorValue={ ( items[ 0 ].background ? items[ 0 ].background : '' ) }
										colorDefault={ '' }
										onColorChange={ value => {
											saveAllListItem( { background: value } );
										} }
									/>
								) }
								{ items[ 0 ].style !== 'default' && (
									<AdvancedPopColorControl
										label={ __( 'Border Color' ) }
										colorValue={ ( items[ 0 ].border ? items[ 0 ].border : '' ) }
										colorDefault={ '' }
										onColorChange={ value => {
											saveAllListItem( { border: value } );
										} }
									/>
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
								title={ __( 'Individual list Item Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								{ renderSettings }
							</PanelBody>
						) }
					</InspectorControls>
				) }
				<style>
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap:not(:last-child) { margin-bottom: ${ listGap }px; }` }
					{ `body:not(.rtl) .kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-single { margin-right: ${ listLabelGap }px; }` }
					{ `body.rtl .kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-single { margin-left: ${ listLabelGap }px; }` }
					{ `.kt-svg-icon-list-items${ uniqueID } .kt-svg-icon-list-item-wrap {
							font-weight: ${ ( listStyles[ 0 ].weight ? listStyles[ 0 ].weight : '' ) };
							font-style: ${ ( listStyles[ 0 ].style ? listStyles[ 0 ].style : '' ) };
							color:  ${ ( listStyles[ 0 ].color ? KadenceColorOutput( listStyles[ 0 ].color ) : '' ) };
							font-size: ${ ( previewFontSize ? previewFontSize + listStyles[ 0 ].sizeType : '' ) };
							line-height: ${ ( previewLineHeight ? previewLineHeight + listStyles[ 0 ].lineType : '' ) };
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
				<div ref={ this.container } className={ `kt-svg-icon-list-container kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns }${ ( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' ) }${ ( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' ) }${ ( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' ) }` } style={ {
					margin: ( listMargin && undefined !== listMargin[ 0 ] && null !== listMargin[ 0 ] ? listMargin[ 0 ] + 'px ' + listMargin[ 1 ] + 'px ' + listMargin[ 2 ] + 'px ' + listMargin[ 3 ] + 'px' : '' ),
				} } >
					{ times( listCount, n => renderIconsPreview( n ) ) }
					{ isSelected && (
						<Fragment>
							<Button
								isDefault={ true }
								icon={ plus }
								onClick={ () => {
									const newitems = items;
									const newcount = listCount + 1;
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
								label={ __( 'Add List Item', 'kadence-blocks' ) }
							/>
						</Fragment>
					) }
				</div>
			</div>
		);
	}
}
//export default ( KadenceIconLists );

export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch, { clientId, rootClientId } ) => {
		const { removeBlock } = dispatch( 'core/block-editor' );
		return {
			onDelete: () => {
				removeBlock( clientId, rootClientId );
			},
		};
	} ),
] )( KadenceIconLists );
