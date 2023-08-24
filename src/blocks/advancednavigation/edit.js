/**
 * BLOCK: Kadence Advanced Navigation
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import External
 */
import classnames from 'classnames';

/**
 * Import Css
 */
import './editor.scss';

import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import {
	useSelect,
	useDispatch
} from '@wordpress/data';

import {
	setBlockDefaults,
	getUniqueId,
	getPostOrFseId,
	getInQueryBlock,
	getPreviewSize,
	mouseOverVisualizer,
	getSpacingOptionOutput,
} from '@kadence/helpers';

import {
	KadencePanelBody,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes
} from '@kadence/components';

import {
	useEffect,
	useState,
} from '@wordpress/element';

import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';

import { 
	store as editNavigationStore,
	useNavigationEditor 
} from '../../extension/navigation-store';

/**
 * Build Kadence Navigation Block.
 */
function KadenceAdvancedNavigation( props ) {
	const { attributes, className, setAttributes, clientId, context } = props;

	const {
		uniqueID,
		inQueryBlock,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
	} = attributes;

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
				parentData: {
					rootBlock: select( 'core/block-editor' ).getBlock( select( 'core/block-editor' ).getBlockHierarchyRootClientId( clientId ) ),
					postId: select( 'core/editor' )?.getCurrentPostId() ? select( 'core/editor' )?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes( select('core/block-editor').getBlockParentsByBlockName( clientId, 'core/block' ).slice(-1)[0] ),
					editedPostId: select( 'core/edit-site' ) ? select( 'core/edit-site' ).getEditedPostId() : false
				}
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		setBlockDefaults( 'kadence/advancednavigation', attributes);

		const postOrFseId = getPostOrFseId( props, parentData );
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId );
		if ( uniqueId !== uniqueID ) {
			attributes.uniqueID = uniqueId;
			setAttributes( { uniqueID: uniqueId } );
			addUniqueID( uniqueId, clientId );
		} else {
			addUniqueID( uniqueID, clientId );
		}

		setAttributes( { inQueryBlock: getInQueryBlock( context, inQueryBlock ) } );
	}, [] );

	const { saveNavigationPost } = useDispatch( editNavigationStore );

	const {
		menus,
		hasLoadedMenus,
		hasFinishedInitialLoad,
		selectedMenuId,
		navigationPost,
		isMenuBeingDeleted,
		selectMenu,
		deleteMenu,
		isMenuSelected,
	} = useNavigationEditor();

	const savePost = () => saveNavigationPost( navigationPost );

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const previewPaddingType = ( undefined !== paddingType ? paddingType : 'px' );
	const previewMarginType = ( undefined !== marginType ? marginType : 'px' );

	// Margin.
	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== margin ? margin[0] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[0] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== margin && undefined !== margin[1] && '' !== margin[1] ? margin[1] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[1] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== margin ? margin[2] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2] : '' ), ( undefined !== mobileMargin ? mobileMargin[2] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== margin && undefined !== margin[3] && '' !== margin[3] ? ( margin[3] ) : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[3] : '' ) );
	// Padding.
	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== padding ? padding[0] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[0] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== padding && undefined !== padding[1] && '' !== padding[1] ? padding[1] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[1] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== padding ? padding[2] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2] : '' ), ( undefined !== mobilePadding ? mobilePadding[2] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== padding && undefined !== padding[3] && '' !== padding[3] ? ( padding[3] ) : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[3] : '' ) );

	const nonTransAttrs = [];

	const blockClasses = classnames( {
		[ className ]: className,
		'wp-block-kadence-advancednavigation' : true,
		[ `wp-block-kadence-advancednavigation${uniqueID}` ] : uniqueID,
	} );

	const blockProps = useBlockProps( {
		className: blockClasses
	} );

	return (
		<div {...blockProps} style={ {
			paddingLeft: ( undefined !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, previewPaddingType ) : undefined ),
			paddingRight: ( undefined !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, previewPaddingType ) : undefined ),
			paddingTop: ( undefined !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, previewPaddingType ) : undefined ),
			paddingBottom: ( undefined !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, previewPaddingType ) : undefined ),
			marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, previewMarginType ) : undefined ),
			marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, previewMarginType ) : undefined ),
			marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, previewMarginType ) : undefined ),
			marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, previewMarginType ) : undefined ),
		} }>
			<BlockControls>
				<CopyPasteAttributes
					attributes={ attributes }
					excludedAttrs={ nonTransAttrs }
					defaultAttributes={ metadata['attributes'] }
					blockSlug={ metadata['name'] }
					onPaste={ attributesToPaste => setAttributes( attributesToPaste ) }
				/>
			</BlockControls>
			<InspectorControls>
				<InspectorControlTabs
					panelName={ 'advancednavigation' }
					setActiveTab={ setActiveTab }
					activeTab={ activeTab }
				/>
				{( activeTab === 'general' ) &&

					<>
						<KadencePanelBody>
							General Panel Content
						</KadencePanelBody>
					</>
				}
				{ ( activeTab === 'style' ) &&
					<>
						<KadencePanelBody>
							Style Panel Content
						</KadencePanelBody>
					</>
				}
				{ ( activeTab === 'advanced' ) && (
					<>
						<KadencePanelBody>
							<ResponsiveMeasureRangeControl
								label={__( 'Padding', 'kadence-blocks' )}
								value={ padding }
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={( value ) => { setAttributes( { padding: value } ); }}
								onChangeTablet={( value ) => { setAttributes( { tabletPadding: value } ); }}
								onChangeMobile={( value ) => { setAttributes( { mobilePadding: value } ); }}
								min={ 0 }
								max={ ( paddingType === 'em' || paddingType === 'rem' ? 24 : 500 ) }
								step={ ( paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1 ) }
								unit={ paddingType }
								units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
								onUnit={( value ) => setAttributes( { paddingType: value } )}
								onMouseOver={ paddingMouseOver.onMouseOver }
								onMouseOut={ paddingMouseOver.onMouseOut }
							/>
							<ResponsiveMeasureRangeControl
								label={__( 'Margin', 'kadence-blocks' )}
								value={margin}
								tabletValue={tabletMargin}
								mobileValue={mobileMargin}
								onChange={( value ) => { setAttributes( { margin: value } ); }}
								onChangeTablet={( value ) => { setAttributes( { tabletMargin: value } ); }}
								onChangeMobile={( value ) => { setAttributes( { mobileMargin: value } ); }}
								min={ ( marginType === 'em' || marginType === 'rem' ? -24 : -500 ) }
								max={ ( marginType === 'em' || marginType === 'rem' ? 24 : 500 ) }
								step={ ( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 ) }
								unit={ marginType }
								units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
								onUnit={ ( value ) => setAttributes( { marginType: value } ) }
								onMouseOver={ marginMouseOver.onMouseOver }
								onMouseOut={ marginMouseOver.onMouseOut }
							/>
						</KadencePanelBody>

						<div className="kt-sidebar-settings-spacer"></div>

						<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ metadata['name'] } excludedAttrs={ nonTransAttrs } />
					</>
				)}
			</InspectorControls>
			
			Block Content

			<SpacingVisualizer
				type="outside"
				forceShow={ marginMouseOver.isMouseOver }
				spacing={ [ getSpacingOptionOutput( previewMarginTop, marginType ), getSpacingOptionOutput( previewMarginRight, marginType ), getSpacingOptionOutput( previewMarginBottom, marginType ), getSpacingOptionOutput( previewMarginLeft, marginType ) ] }
			/>
			<SpacingVisualizer
				type="inside"
				forceShow={ paddingMouseOver.isMouseOver }
				spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingType ), getSpacingOptionOutput( previewPaddingRight, paddingType ), getSpacingOptionOutput( previewPaddingBottom, paddingType ), getSpacingOptionOutput( previewPaddingLeft, paddingType ) ] }
			/>
		</div>
	);
}
export default ( KadenceAdvancedNavigation );
