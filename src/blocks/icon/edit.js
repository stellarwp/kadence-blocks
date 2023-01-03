/**
 * BLOCK: Kadence Icon
 */
/**
 * Import externals
 */
import { times, map } from 'lodash';
import {
	PopColorControl,
	StepControls,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	VerticalAlignmentIcon,
	ResponsiveRangeControls,
	InspectorControlTabs,
	RangeControl,
	KadenceRadioButtons,
	ResponsiveAlignControls,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	KadenceIconPicker,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer
} from '@kadence/components';
import {
	KadenceColorOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
} from '@kadence/helpers';
import { useSelect, useDispatch, withDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
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
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	useBlockProps,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Fragment,
	useEffect,
	useState
} from '@wordpress/element';
import {
	plusCircle
} from '@wordpress/icons';
import {
	TextControl,
	SelectControl,
	Button,
	Dashicon,
	ToolbarButton,
	TabPanel,
	ToolbarGroup,
} from '@wordpress/components';

function KadenceIcons( { attributes, className, setAttributes, isSelected, iconsBlock, insertIcon, clientId, context } ) {
	const { iconCount, inQueryBlock, icons, blockAlignment, textAlignment, tabletTextAlignment, mobileTextAlignment, uniqueID, verticalAlignment } = attributes;

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		setBlockDefaults( 'kadence/advancedheading', attributes);

		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );

		setAttributes( { inQueryBlock: getInQueryBlock( context, inQueryBlock ) } );
	}, [] );
	const saveArrayUpdate = ( value, index ) => {
		const newItems = icons.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			icons: newItems,
		} );
	};

	const blockProps = useBlockProps( {
		className: className,
	} );
	const verticalAlignOptions = [
		[
			{
				icon    : <VerticalAlignmentIcon value={'top'} isPressed={( verticalAlignment === 'top' ? true : false )}/>,
				title   : __( 'Align Top', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'top' ? true : false ),
				onClick : () => setAttributes( { verticalAlignment: 'top' } ),
			},
		],
		[
			{
				icon    : <VerticalAlignmentIcon value={'middle'} isPressed={( verticalAlignment === 'middle' ? true : false )}/>,
				title   : __( 'Align Middle', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'middle' ? true : false ),
				onClick : () => setAttributes( { verticalAlignment: 'middle' } ),
			},
		],
		[
			{
				icon    : <VerticalAlignmentIcon value={'bottom'} isPressed={( verticalAlignment === 'bottom' ? true : false )}/>,
				title   : __( 'Align Bottom', 'kadence-blocks' ),
				isActive: ( verticalAlignment === 'bottom' ? true : false ),
				onClick : () => setAttributes( { verticalAlignment: 'bottom' } ),
			},
		],
	];

	function selfOrChildSelected( isSelected, clientId ) {
		const childSelected = useSelect( ( select ) =>
			select( 'core/block-editor' ).hasSelectedInnerBlock( clientId, true )
		);
		return isSelected || childSelected;
	}

	const previewTextAlign = getPreviewSize( previewDevice, ( textAlignment ? textAlignment : undefined ), ( undefined !== tabletTextAlignment && tabletTextAlignment ? tabletTextAlignment : undefined ), ( undefined !== mobileTextAlignment && mobileTextAlignment ? mobileTextAlignment : undefined ) );
	return (
		<div {...blockProps}>
			<BlockControls>
				<BlockAlignmentToolbar
					value={blockAlignment}
					controls={[ 'center', 'left', 'right' ]}
					onChange={value => setAttributes( { blockAlignment: value } )}
				/>
				<ToolbarGroup
					isCollapsed={true}
					icon={<VerticalAlignmentIcon value={( verticalAlignment ? verticalAlignment : 'bottom' )}/>}
					label={__( 'Vertical Align', 'kadence-blocks' )}
					controls={verticalAlignOptions}
				/>
				<AlignmentToolbar
					value={textAlignment}
					onChange={value => setAttributes( { textAlignment: value } )}
				/>
				<ToolbarGroup>
					<ToolbarButton
						className="kb-icons-add-icon"
						icon={ plusCircle }
						onClick={ () => {
							const latestAttributes = iconsBlock.innerBlocks[iconsBlock.innerBlocks.length - 1].attributes;
							latestAttributes.uniqueID = '';
							const newBlock = createBlock( 'kadence/single-icon', latestAttributes );
							insertIcon( newBlock );
						} }
						label={  __( 'Add Another Icon', 'kadence-blocks' ) }
						showTooltip={ true }
					/>
				</ToolbarGroup>
			</BlockControls>
			<KadenceInspectorControls blockSlug={ 'kadence/icon' }>

				<InspectorControlTabs
					panelName={ 'icon' }
					allowedTabs={ [ 'general', 'advanced' ] }
					setActiveTab={ ( value ) => setActiveTab( value ) }
					activeTab={ activeTab }
				/>

				{( activeTab === 'general' ) &&
					<KadencePanelBody panelName={'kb-icon-alignment-settings'}>
						<ResponsiveAlignControls
							label={__( 'Icon Alignment', 'kadence-blocks' )}
							value={( textAlignment ? textAlignment : '' )}
							mobileValue={( mobileTextAlignment ? mobileTextAlignment : '' )}
							tabletValue={( tabletTextAlignment ? tabletTextAlignment : '' )}
							onChange={( nextAlign ) => setAttributes( { textAlignment: nextAlign } )}
							onChangeTablet={( nextAlign ) => setAttributes( { tabletTextAlignment: nextAlign } )}
							onChangeMobile={( nextAlign ) => setAttributes( { mobileTextAlignment: nextAlign } )}
						/>
					</KadencePanelBody>
				}

			</KadenceInspectorControls>
			<div className={`kt-svg-icons ${clientId} kt-svg-icons-${uniqueID}${previewTextAlign ? ' kb-icon-halign-' + previewTextAlign : ''}${verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : ''}`}>
				<InnerBlocks
					template={ [ [ 'kadence/single-icon' ] ] }
					templateLock={ false }
					orientation="horizontal"
					templateInsertUpdatesSelection={ true }
					renderAppender={ false }
					allowedBlocks={ [ 'kadence/single-icon' ] }
				/>
			</div>
		</div>
	);
}
const KadenceIconsWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		insertIcon( newBlock ) {
			const { clientId } = ownProps;
			const { insertBlock } = dispatch( blockEditorStore );
			const { getBlock } = registry.select( blockEditorStore );
			const block = getBlock( clientId );
			insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
		},
	} )
)( KadenceIcons );
const KadenceIconsEdit = ( props ) => {
	const { clientId } = props;
	const { iconsBlock } = useSelect(
		( select ) => {
			const {
				getBlock,
			} = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return {
				iconsBlock: block,
			};
		},
		[ clientId ]
	);
	return <KadenceIconsWrapper iconsBlock={ iconsBlock } { ...props } />;
};
export default KadenceIconsEdit;

