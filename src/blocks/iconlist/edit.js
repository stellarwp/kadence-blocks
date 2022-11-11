/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icons
 */
import { alignTopIcon, alignMiddleIcon, alignBottomIcon } from '@kadence/icons';

/**
 * Import Externals
 */
import { times, filter, map, get } from 'lodash';
/**
 * Import Kadence Components
 */
import {
	KadenceColorOutput,
	showSettings,
	getPreviewSize,
	mouseOverVisualizer,
	getSpacingOptionOutput
} from '@kadence/helpers';

import {
	WebfontLoader,
	PopColorControl,
	StepControls,
	TypographyControls,
	KadenceIconPicker,
	ResponsiveRangeControls,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	DynamicTextControl,
	MeasurementControls,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
} from '@kadence/components';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

/**
 * Import Block Specific.
 */
import MoveItem from './moveItem';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import {
	InspectorControls,
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
} from '@wordpress/block-editor';

import {
	useEffect,
	useState,
	Fragment,
} from '@wordpress/element';

import {
	RangeControl,
	ButtonGroup,
	Tooltip,
	Button,
	SelectControl,
} from '@wordpress/components';

import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import {
	plus,
} from '@wordpress/icons';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kticonlistUniqueIDs = [];

function KadenceIconLists( { attributes, className, setAttributes, isSelected, container, getPreviewDevice, clientId } ) {

	const { listCount, items, listStyles, columns, listLabelGap, listGap, blockAlignment, uniqueID, listMargin, tabletListMargin, mobileListMargin, listMarginType, iconAlign, tabletColumns, mobileColumns } = attributes;

	const [ focusIndex, setFocusIndex ] = useState( null );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	useEffect( () => {
		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/iconlist' ] !== undefined && typeof blockConfigObject[ 'kadence/iconlist' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/iconlist' ] ).map( ( attribute ) => {
					if ( attribute === 'items' ) {
						attributes[ attribute ] = attributes[ attribute ].map( ( item, index ) => {
							item.icon = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].icon;
							item.size = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].size;
							item.color = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].color;
							item.background = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].background;
							item.border = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].border;
							item.borderRadius = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].borderRadius;
							item.padding = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].padding;
							item.borderWidth = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].borderWidth;
							item.style = blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ].style;
							item.level = get( blockConfigObject[ 'kadence/iconlist' ][ attribute ][ 0 ], 'level', 0 );
							return item;
						} );
					} else {
						attributes[ attribute ] = blockConfigObject[ 'kadence/iconlist' ][ attribute ];
					}
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kticonlistUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kticonlistUniqueIDs.includes( uniqueID ) ) {
			if( uniqueID !== '_' + clientId.substr( 2, 9 ) ) {
				setAttributes( { uniqueID: '_' + clientId.substr( 2, 9 ) } );
				kticonlistUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
			}
		} else {
			kticonlistUniqueIDs.push( uniqueID );
		}

	}, [] );

	const previewListMarginTop = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[0] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 0 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 0 ] : '' ) );
	const previewListMarginRight = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[1] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 1 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 1 ] : '' ) );
	const previewListMarginBottom = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[2] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 2 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 2 ] : '' ) );
	const previewListMarginLeft = getPreviewSize( getPreviewDevice, ( undefined !== listMargin ? listMargin[3] : '' ), ( undefined !== tabletListMargin ? tabletListMargin[ 3 ] : '' ), ( undefined !== mobileListMargin ? mobileListMargin[ 3 ] : '' ) );

	const listMarginMouseOver = mouseOverVisualizer();

	const createNewListItem = ( value, entireOld, previousIndex ) => {
		const previousValue = entireOld.replace( value, '' );
		const amount = Math.abs( 1 + listCount );
		const currentItems = items;
		const newItems = [ {
			icon        : currentItems[ 0 ].icon,
			link        : currentItems[ 0 ].link,
			target      : currentItems[ 0 ].target,
			size        : currentItems[ 0 ].size,
			text        : currentItems[ 0 ].text,
			width       : currentItems[ 0 ].width,
			color       : currentItems[ 0 ].color,
			background  : currentItems[ 0 ].background,
			border      : currentItems[ 0 ].border,
			borderRadius: currentItems[ 0 ].borderRadius,
			borderWidth : currentItems[ 0 ].borderWidth,
			padding     : currentItems[ 0 ].padding,
			style       : currentItems[ 0 ].style,
			level       : get( currentItems[ 0 ], 'level', 0 ),
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
						icon        : currentItems[ previousIndex ].icon,
						link        : currentItems[ previousIndex ].link,
						target      : currentItems[ previousIndex ].target,
						size        : currentItems[ previousIndex ].size,
						text        : value,
						width       : currentItems[ previousIndex ].width,
						color       : currentItems[ previousIndex ].color,
						background  : currentItems[ previousIndex ].background,
						border      : currentItems[ previousIndex ].border,
						borderRadius: currentItems[ previousIndex ].borderRadius,
						borderWidth : currentItems[ previousIndex ].borderWidth,
						padding     : currentItems[ previousIndex ].padding,
						style       : currentItems[ previousIndex ].style,
						level       : get( currentItems[ previousIndex ], 'level', 0 ),
					} );
				} else if ( n === previousIndex ) {
					newItems.push( {
						icon        : currentItems[ previousIndex ].icon,
						link        : currentItems[ previousIndex ].link,
						target      : currentItems[ previousIndex ].target,
						size        : currentItems[ previousIndex ].size,
						text        : previousValue,
						width       : currentItems[ previousIndex ].width,
						color       : currentItems[ previousIndex ].color,
						background  : currentItems[ previousIndex ].background,
						border      : currentItems[ previousIndex ].border,
						borderRadius: currentItems[ previousIndex ].borderRadius,
						borderWidth : currentItems[ previousIndex ].borderWidth,
						padding     : currentItems[ previousIndex ].padding,
						style       : currentItems[ previousIndex ].style,
						level       : get( currentItems[ previousIndex ], 'level', 0 ),
					} );
				} else {
					if ( n > addin ) {
						ind = Math.abs( n - 1 );
					}
					newItems.push( {
						icon        : currentItems[ ind ].icon,
						link        : currentItems[ ind ].link,
						target      : currentItems[ ind ].target,
						size        : currentItems[ ind ].size,
						text        : currentItems[ ind ].text,
						width       : currentItems[ ind ].width,
						color       : currentItems[ ind ].color,
						background  : currentItems[ ind ].background,
						border      : currentItems[ ind ].border,
						borderRadius: currentItems[ ind ].borderRadius,
						borderWidth : currentItems[ ind ].borderWidth,
						padding     : currentItems[ ind ].padding,
						style       : currentItems[ ind ].style,
						level       : get( currentItems[ ind ], 'level', 0 ),
					} );
				}
			} );
			setAttributes( { items: newItems } );
			setAttributes( { listCount: amount } );
			setFocusIndex( addin );
			setFocusOnNewItem( addin, uniqueID );
		}
	};

	// Silly Hack to handle focus.
	const setFocusOnNewItem = ( index, uniqueID ) => {
		setTimeout( function() {
			if ( document.querySelector( `.kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-item-${index}` ) ) {
				const parent = document.querySelector( `.kt-svg-icon-list-items${uniqueID} .kt-svg-icon-list-item-${index}` );
				const rich = parent.querySelector( '.rich-text' );
				rich.focus();
			}
		}, 100 );
	};

	const onSelectItem = ( index ) => {
		return () => {
			if ( focusIndex !== index ) {
				setFocusIndex( { index } );
			}
		};
	};
	const onMoveVertical = ( oldIndex, newIndex ) => {
		const items = [ ...items ];
		items.splice( newIndex, 1, items[ oldIndex ] );
		items.splice( oldIndex, 1, items[ newIndex ] );
		setFocusIndex( newIndex );
		setAttributes( { items } );
	};

	const onMoveHorizontal = ( index, newLevel ) => {
		const items = [ ...items ];
		items[ index ].level = newLevel;

		setAttributes( { items } );
	};

	const onMoveDown = ( oldIndex ) => {
		return () => {
			if ( oldIndex === items.length - 1 ) {
				return;
			}
			onMoveVertical( oldIndex, oldIndex + 1 );
		};
	};

	const onMoveUp = ( oldIndex ) => {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			onMoveVertical( oldIndex, oldIndex - 1 );
		};
	};

	const onMoveLeft = ( index ) => {
		return () => {
			if ( items[ index ].level === 0 ) {
				return;
			}
			onMoveHorizontal( index, items[ index ].level - 1 );
		};
	};

	const onMoveRight = ( index ) => {
		return () => {
			let currentLevel = get( items[ index ], 'level', 0 );

			if ( currentLevel === 5 ) {
				return;
			}

			onMoveHorizontal( index, currentLevel + 1 );
		};
	};

	const saveListItem = ( value, thisIndex ) => {
		const currentItems = items;
		const newUpdate = currentItems.map( ( item, index ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			items: newUpdate,
		} );
	};

	const gconfig = {
		google: {
			families: [ listStyles[ 0 ].family + ( listStyles[ 0 ].variant ? ':' + listStyles[ 0 ].variant : '' ) ],
		},
	};

	const config = ( listStyles[ 0 ].google ? gconfig : '' );
	const previewFontSize = getPreviewSize( getPreviewDevice, ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 0 ] ? listStyles[ 0 ].size[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 1 ] ? listStyles[ 0 ].size[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].size && undefined !== listStyles[ 0 ].size[ 2 ] ? listStyles[ 0 ].size[ 2 ] : '' ) );
	const previewLineHeight = getPreviewSize( getPreviewDevice, ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 0 ] ? listStyles[ 0 ].lineHeight[ 0 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 1 ] ? listStyles[ 0 ].lineHeight[ 1 ] : '' ), ( undefined !== listStyles[ 0 ].lineHeight && undefined !== listStyles[ 0 ].lineHeight[ 2 ] ? listStyles[ 0 ].lineHeight[ 2 ] : '' ) );

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
		{ key: 'top', name: __( 'Top', 'kadence-blocks' ), icon: alignTopIcon },
		{ key: 'middle', name: __( 'Middle', 'kadence-blocks' ), icon: alignMiddleIcon },
		{ key: 'bottom', name: __( 'Bottom', 'kadence-blocks' ), icon: alignBottomIcon },
	];

	const stopOnReplace = ( value, index ) => {
		if ( value && undefined !== value[ 0 ] && undefined !== value[ 0 ].attributes && value[ 0 ].attributes.content ) {
			saveListItem( { text: value[ 0 ].attributes.content }, index );
		}
	};
	const removeListItem = ( value, previousIndex ) => {
		const amount = Math.abs( listCount );
		if ( amount === 1 ) {
			// Remove Block.
			onDelete();
		} else {
			const newAmount = Math.abs( amount - 1 );
			const currentItems = filter( items, ( item, i ) => previousIndex !== i );
			const addin = Math.abs( previousIndex - 1 );
			setFocusIndex( addin );
			setAttributes( {
				items    : currentItems,
				listCount: newAmount,
			} );
		}
	};
	const blockToolControls = ( index ) => {
		const isLineSelected = ( isSelected && focusIndex === index && kadence_blocks_params.dynamic_enabled );
		if ( !isLineSelected ) {
			return;
		}
		return <DynamicTextControl dynamicAttribute={'items:' + index + ':text'} {...attributes} />;
	};
	const renderIconSettings = ( index ) => {
		return (
			<KadencePanelBody
				title={__( 'Item', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' )}
				initialOpen={( 1 === listCount ? true : false )}
				panelName={'kb-icon-item-' + index}
			>
				<URLInputControl
					label={__( 'Link', 'kadence-blocks' )}
					url={items[ index ].link}
					onChangeUrl={value => {
						saveListItem( { link: value }, index );
					}}
					additionalControls={true}
					opensInNewTab={( items[ index ].target && '_blank' == items[ index ].target ? true : false )}
					onChangeTarget={value => {
						if ( value ) {
							saveListItem( { target: '_blank' }, index );
						} else {
							saveListItem( { target: '_self' }, index );
						}
					}}
					dynamicAttribute={'items:' + index + ':link'}
					allowClear={true}
					{...attributes}
				/>
				<KadenceIconPicker
					value={items[ index ].icon}
					onChange={value => {
						saveListItem( { icon: value }, index );
					}}
				/>
				<RangeControl
					label={__( 'Icon Size' )}
					value={items[ index ].size}
					onChange={value => {
						saveListItem( { size: value }, index );
					}}
					min={5}
					max={250}
				/>
				{items[ index ].icon && 'fe' === items[ index ].icon.substring( 0, 2 ) && (
					<RangeControl
						label={__( 'Line Width' )}
						value={items[ index ].width}
						onChange={value => {
							saveListItem( { width: value }, index );
						}}
						step={0.5}
						min={0.5}
						max={4}
					/>
				)}
				<PopColorControl
					label={__( 'Icon Color' )}
					value={( items[ index ].color ? items[ index ].color : '' )}
					default={''}
					onChange={value => {
						saveListItem( { color: value }, index );
					}}
				/>
				<SelectControl
					label={__( 'Icon Style' )}
					value={items[ index ].style}
					options={[
						{ value: 'default', label: __( 'Default' ) },
						{ value: 'stacked', label: __( 'Stacked' ) },
					]}
					onChange={value => {
						saveListItem( { style: value }, index );
					}}
				/>
				{items[ index ].style !== 'default' && (
					<PopColorControl
						label={__( 'Icon Background' )}
						value={( items[ index ].background ? items[ index ].background : '' )}
						default={''}
						onChange={value => {
							saveListItem( { background: value }, index );
						}}
					/>
				)}
				{items[ index ].style !== 'default' && (
					<PopColorControl
						label={__( 'Border Color' )}
						value={( items[ index ].border ? items[ index ].border : '' )}
						default={''}
						onChange={value => {
							saveListItem( { border: value }, index );
						}}
					/>
				)}
				{items[ index ].style !== 'default' && (
					<RangeControl
						label={__( 'Border Size (px)' )}
						value={items[ index ].borderWidth}
						onChange={value => {
							saveListItem( { borderWidth: value }, index );
						}}
						min={0}
						max={20}
					/>
				)}
				{items[ index ].style !== 'default' && (
					<RangeControl
						label={__( 'Border Radius (%)' )}
						value={items[ index ].borderRadius}
						onChange={value => {
							saveListItem( { borderRadius: value }, index );
						}}
						min={0}
						max={50}
					/>
				)}
				{items[ index ].style !== 'default' && (
					<RangeControl
						label={__( 'Padding (px)' )}
						value={items[ index ].padding}
						onChange={value => {
							saveListItem( { padding: value }, index );
						}}
						min={0}
						max={180}
					/>
				)}
			</KadencePanelBody>
		);
	};
	const renderSettings = (
		<div>
			{times( listCount, n => renderIconSettings( n ) )}
		</div>
	);
	const renderToolControls = (
		<div>
			{times( listCount, n => blockToolControls( n ) )}
		</div>
	);
	const renderIconsPreview = ( index ) => {
		return (
			<div className={`kt-svg-icon-list-style-${items[ index ].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index} kt-svg-icon-list-level-${get( items[ index ], 'level', 0 )}`}>
				{items[ index ].icon && (
					<IconRender className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[ index ].icon}`} name={items[ index ].icon} size={items[ index ].size}
								strokeWidth={( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined )} style={{
						color          : ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
						backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
						padding        : ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
						borderColor    : ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
						borderWidth    : ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
						borderRadius   : ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
					}}/>
				)}
				{/* { applyFilters( 'kadence.dynamicContent', <RichText
						tagName="div"
						value={ items[ index ].text }
						onChange={ value => {
							saveListItem( { text: value }, index );
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
						//isSelected={ focusIndex === index }
						unstableOnFocus={ onSelectItem( index ) }
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
							saveListItem( { text: value }, index );
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
						unstableOnFocus={ () => onSelectItem( index ) }
						onReplace={ ( value ) => {
							stopOnReplace( value, index );
						} }
						className={ 'kt-svg-icon-list-text' }
					/>
				</div>
			);
		};

		const blockProps = useBlockProps( {
			className: className,
			'data-align': ( 'center' === blockAlignment || 'left' === blockAlignment || 'right' === blockAlignment ? blockAlignment : undefined )
		} );

		return (
			<div {...blockProps}>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'left', 'right' ] }
						onChange={ value => setAttributes( { blockAlignment: value } ) }
					/>
					<MoveItem
						onMoveUp={ value => onMoveUp( value ) }
						onMoveDown={ value => onMoveDown( value ) }
						onMoveRight={ value => onMoveRight( value ) }
						onMoveLeft={ value => onMoveLeft( value ) }
						focusIndex={ focusIndex }
						itemCount={ items.length }
						level={  get( items[ ( focusIndex ? focusIndex : 0 ) ], 'level', 0) }
					/>
				</BlockControls>
				{ showSettings( 'allSettings', 'kadence/iconlist' ) && (
					<InspectorControls>

						<InspectorControlTabs
							panelName={ 'icon-list' }
							setActiveTab={ ( value ) => setActiveTab( value ) }
							activeTab={ activeTab }
						/>

						{( activeTab === 'general' ) &&
							<>
								<KadencePanelBody
									title={__( 'List Controls' )}
									initialOpen={true}
									panelName={'kb-icon-list-controls'}
								>
									<StepControls
										label={__( 'Number of Items' )}
										value={listCount}
										onChange={( newcount ) => {
											const newitems = items;
											if ( newitems.length < newcount ) {
												const amount = Math.abs( newcount - newitems.length );
												{
													times( amount, n => {
														newitems.push( {
															icon        : newitems[ 0 ].icon,
															link        : newitems[ 0 ].link,
															target      : newitems[ 0 ].target,
															size        : newitems[ 0 ].size,
															width       : newitems[ 0 ].width,
															color       : newitems[ 0 ].color,
															background  : newitems[ 0 ].background,
															border      : newitems[ 0 ].border,
															borderRadius: newitems[ 0 ].borderRadius,
															borderWidth : newitems[ 0 ].borderWidth,
															padding     : newitems[ 0 ].padding,
															style       : newitems[ 0 ].style,
															level       : get( newitems[ 0 ], 'level', 0 )
														} );
													} );
												}
												setAttributes( { items: newitems } );
												saveListItem( { size: items[ 0 ].size }, 0 );
											}
											setAttributes( { listCount: newcount } );
										}}
										min={1}
										max={40}
										step={1}
									/>
									{ showSettings( 'column', 'kadence/iconlist' ) && (
										<ResponsiveRangeControls
											label={__( 'List Columns', 'kadence-blocks' )}
											value={columns}
											onChange={value => setAttributes( { columns: value } )}
											tabletValue={( tabletColumns ? tabletColumns : '' )}
											onChangeTablet={( value ) => setAttributes( { tabletColumns: value } )}
											mobileValue={( mobileColumns ? mobileColumns : '' )}
											onChangeMobile={( value ) => setAttributes( { mobileColumns: value } )}
											min={1}
											max={3}
											step={1}
											showUnit={false}
										/>
									)}
									{ showSettings( 'spacing', 'kadence/iconlist' ) && (
										<Fragment>
											<RangeControl
												label={__( 'List Vertical Spacing' )}
												value={listGap}
												onChange={value => {
													setAttributes( { listGap: value } );
												}}
												min={0}
												max={60}
											/>
											<RangeControl
												label={__( 'List Horizontal Icon and Label Spacing' )}
												value={listLabelGap}
												onChange={value => {
													setAttributes( { listLabelGap: value } );
												}}
												min={0}
												max={60}
											/>
											<div className="kt-btn-size-settings-container">
												<h2 className="kt-beside-btn-group">{__( 'Icon Align' )}</h2>
												<ButtonGroup className="kt-button-size-type-options" aria-label={__( 'Icon Align' )}>
													{map( iconAlignOptions, ( { name, icon, key } ) => (
														<Tooltip text={name}>
															<Button
																key={key}
																className="kt-btn-size-btn"
																isSmall
																isPrimary={iconAlign === key}
																aria-pressed={iconAlign === key}
																onClick={() => setAttributes( { iconAlign: key } )}
															>
																{icon}
															</Button>
														</Tooltip>
													) )}
												</ButtonGroup>
											</div>
											<ResponsiveMeasureRangeControl
												label={__( 'List Margin', 'kadence-blocks' )}
												value={ listMargin }
												tabletValue={ tabletListMargin}
												mobileValue={ mobileListMargin}
												onChange={( value ) => setAttributes( { listMargin: value } )}
												onChangeTablet={( value ) => setAttributes( { tabletListMargin: value } )}
												onChangeMobile={( value ) => setAttributes( { mobileListMargin: value } )}
												min={( listMarginType === 'em' || listMarginType === 'rem' ? -24 : -200 )}
												max={( listMarginType === 'em' || listMarginType === 'rem' ? 24 : 200 )}
												step={( listMarginType === 'em' || listMarginType === 'rem' ? 0.1 : 1 )}
												unit={listMarginType}
												units={[ 'px', 'em', 'rem', '%' ]}
												onUnit={( value ) => setAttributes( { listMarginType: value } )}
												onMouseOver={ listMarginMouseOver.onMouseOver }
												onMouseOut={ listMarginMouseOver.onMouseOut }
											/>
										</Fragment>
									)}
								</KadencePanelBody>

								<div className="kt-sidebar-settings-spacer"></div>
								{ showSettings( 'individualIcons', 'kadence/iconlist' ) && (
									<KadencePanelBody
										title={ __( 'Individual list Item Settings', 'kadence-blocks' ) }
										initialOpen={ false }
										panelName={ 'kb-list-individual-item-settings' }
									>
										{ renderSettings }
									</KadencePanelBody>
								) }
							</>
						}

						{( activeTab === 'style' ) &&
							<>
								{ showSettings( 'textStyle', 'kadence/iconlist' ) && (
									<KadencePanelBody
										title={__( 'List Text Styling' )}
										panelName={'kb-list-text-styling'}
									>
										<PopColorControl
											label={__( 'Color Settings' )}
											value={( listStyles[ 0 ].color ? listStyles[ 0 ].color : '' )}
											default={''}
											onChange={value => {
												saveListStyles( { color: value } );
											}}
										/>
										<TypographyControls
											fontSize={listStyles[ 0 ].size}
											onFontSize={( value ) => saveListStyles( { size: value } )}
											fontSizeType={listStyles[ 0 ].sizeType}
											onFontSizeType={( value ) => saveListStyles( { sizeType: value } )}
											lineHeight={listStyles[ 0 ].lineHeight}
											onLineHeight={( value ) => saveListStyles( { lineHeight: value } )}
											lineHeightType={listStyles[ 0 ].lineType}
											onLineHeightType={( value ) => saveListStyles( { lineType: value } )}
											letterSpacing={listStyles[ 0 ].letterSpacing}
											onLetterSpacing={( value ) => saveListStyles( { letterSpacing: value } )}
											fontFamily={listStyles[ 0 ].family}
											onFontFamily={( value ) => saveListStyles( { family: value } )}
											onFontChange={( select ) => {
												saveListStyles( {
													family: select.value,
													google: select.google,
												} );
											}}
											onFontArrayChange={( values ) => saveListStyles( values )}
											googleFont={listStyles[ 0 ].google}
											onGoogleFont={( value ) => saveListStyles( { google: value } )}
											loadGoogleFont={listStyles[ 0 ].loadGoogle}
											onLoadGoogleFont={( value ) => saveListStyles( { loadGoogle: value } )}
											fontVariant={listStyles[ 0 ].variant}
											onFontVariant={( value ) => saveListStyles( { variant: value } )}
											fontWeight={listStyles[ 0 ].weight}
											onFontWeight={( value ) => saveListStyles( { weight: value } )}
											fontStyle={listStyles[ 0 ].style}
											onFontStyle={( value ) => saveListStyles( { style: value } )}
											fontSubset={listStyles[ 0 ].subset}
											onFontSubset={( value ) => saveListStyles( { subset: value } )}
											textTransform={listStyles[ 0 ].textTransform}
											onTextTransform={( value ) => saveListStyles( { textTransform: value } )}
										/>
									</KadencePanelBody>
								)}
							</>
						}

						{( activeTab === 'advanced' ) &&
							<>
								{ showSettings( 'joinedIcons', 'kadence/iconlist' ) && (
									<KadencePanelBody
										title={__( 'Edit All Icon Styles Together' )}
										panelName={'kb-icon-all-styles'}
									>
										<p>{__( 'PLEASE NOTE: This will override individual list item settings.' )}</p>
										<KadenceIconPicker
											value={items[ 0 ].icon}
											onChange={value => {
												if ( value !== items[ 0 ].icon ) {
													saveAllListItem( { icon: value } );
												}
											}}
										/>
										<RangeControl
											label={__( 'Icon Size' )}
											value={items[ 0 ].size}
											onChange={value => {
												saveAllListItem( { size: value } );
											}}
											min={5}
											max={250}
										/>
										{items[ 0 ].icon && 'fe' === items[ 0 ].icon.substring( 0, 2 ) && (
											<RangeControl
												label={__( 'Line Width' )}
												value={items[ 0 ].width}
												onChange={value => {
													saveAllListItem( { width: value } );
												}}
												step={0.5}
												min={0.5}
												max={4}
											/>
										)}
										<PopColorControl
											label={__( 'Icon Color' )}
											value={( items[ 0 ].color ? items[ 0 ].color : '' )}
											default={''}
											onChange={value => {
												saveAllListItem( { color: value } );
											}}
										/>
										<SelectControl
											label={__( 'Icon Style' )}
											value={items[ 0 ].style}
											options={[
												{ value: 'default', label: __( 'Default' ) },
												{ value: 'stacked', label: __( 'Stacked' ) },
											]}
											onChange={value => {
												saveAllListItem( { style: value } );
											}}
										/>
										{items[ 0 ].style !== 'default' && (
											<PopColorControl
												label={__( 'Icon Background' )}
												value={( items[ 0 ].background ? items[ 0 ].background : '' )}
												default={''}
												onChange={value => {
													saveAllListItem( { background: value } );
												}}
											/>
										)}
										{items[ 0 ].style !== 'default' && (
											<PopColorControl
												label={__( 'Border Color' )}
												value={( items[ 0 ].border ? items[ 0 ].border : '' )}
												default={''}
												onChange={value => {
													saveAllListItem( { border: value } );
												}}
											/>
										)}
										{items[ 0 ].style !== 'default' && (
											<RangeControl
												label={__( 'Border Size (px)' )}
												value={items[ 0 ].borderWidth}
												onChange={value => {
													saveAllListItem( { borderWidth: value } );
												}}
												min={0}
												max={20}
											/>
										)}
										{items[ 0 ].style !== 'default' && (
											<RangeControl
												label={__( 'Border Radius (%)' )}
												value={items[ 0 ].borderRadius}
												onChange={value => {
													saveAllListItem( { borderRadius: value } );
												}}
												min={0}
												max={50}
											/>
										)}
										{items[ 0 ].style !== 'default' && (
											<RangeControl
												label={__( 'Padding (px)' )}
												value={items[ 0 ].padding}
												onChange={value => {
													saveAllListItem( { padding: value } );
												}}
												min={0}
												max={180}
											/>
										)}
									</KadencePanelBody>
								)}

								<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/iconlist' } excludedAttrs={ [ 'listCount' ] } preventMultiple={ [ 'items' ] } />

							</>
						}

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
			{listStyles[ 0 ].google && (
				<WebfontLoader config={config}>
				</WebfontLoader>
			)}
			<div ref={container}
				 className={`kt-svg-icon-list-container kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns}${( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' )}${( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' )}${( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' )}`}
				 style={{
					 marginTop: getSpacingOptionOutput( previewListMarginTop, listMarginType),
					 marginRight: getSpacingOptionOutput( previewListMarginRight, listMarginType),
					 marginBottom: getSpacingOptionOutput( previewListMarginBottom, listMarginType),
					 marginLeft: getSpacingOptionOutput( previewListMarginLeft, listMarginType),
				 }}>
				{times( listCount, n => renderIconsPreview( n ) )}
				{isSelected && (
					<Fragment>
						<Button
							isSecondary
							icon={plus}
							onClick={() => {
								const newitems = items;
								const newcount = listCount + 1;
								if ( newitems.length < newcount ) {
									const amount = Math.abs( newcount - newitems.length );
									{
										times( amount, n => {
											newitems.push( {
												icon        : newitems[ 0 ].icon,
												link        : newitems[ 0 ].link,
												target      : newitems[ 0 ].target,
												size        : newitems[ 0 ].size,
												width       : newitems[ 0 ].width,
												color       : newitems[ 0 ].color,
												background  : newitems[ 0 ].background,
												border      : newitems[ 0 ].border,
												borderRadius: newitems[ 0 ].borderRadius,
												borderWidth : newitems[ 0 ].borderWidth,
												padding     : newitems[ 0 ].padding,
												style       : newitems[ 0 ].style,
												level       : get( newitems[ 0 ], 'level', 0 ),
											} );
										} );
									}
									setAttributes( { items: newitems } );
									saveListItem( { size: items[ 0 ].size }, 0 );
								}
								setAttributes( { listCount: newcount } );
							}}
							label={__( 'Add List Item', 'kadence-blocks' )}
						/>
					</Fragment>
				)}
			</div>
		</div>
	);
}

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
