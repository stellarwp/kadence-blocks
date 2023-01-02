/**
 * BLOCK: Kadence Buttons
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getUniqueId,
	setBlockDefaults,
} from '@kadence/helpers';

/**
 * Import externals
 */
import classnames from 'classnames';
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
	ResponsiveGapSizeControl,
	KadenceInspectorControls,
	SmallResponsiveControl,
	KadenceBlockDefaults,
	KadenceIconPicker,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer
} from '@kadence/components';
import {
	KadenceColorOutput,
	getPreviewSize,
	setBlockDefaults,
	getSpacingOptionOutput,
	getGapSizeOptionOutput,
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
	BlockVerticalAlignmentControl,
	useBlockProps,
	InnerBlocks,
	JustifyContentControl,
	useInnerBlocksProps,
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
const DEFAULT_BLOCK = {
	name: 'kadence/singlebtn',
	attributesToCopy: [
		'background',
		'backgroundHover',
		'backgroundType',
		'backgroundHoverType',
		'borderStyle',
		'typography',
		'borderRadius',
		'borderRadiusHover',
		'borderHoverStyle',
		'gradient',
		'gradientHover',
		'inheritStyles',
		'color',
		'colorHover',
		'width',
		'widthType',
	],
};
function KadenceButtons( { attributes, className, setAttributes, isSelected, buttonsBlock, insertButton, clientId, context } ) {
	const {
		uniqueID,
		hAlign,
		thAlign,
		mhAlign,
		vAlign,
		tvAlign,
		mvAlign,
		margin,
		marginUnit,
		collapseFullwidth,
		lockBtnCount,
		orientation,
		inQueryBlock,
		gap,
		gapUnit,
	} = attributes;

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
		let smallID = '_' + clientId.substr( 2, 9 );
		if ( ! uniqueID ) {
			if ( ! isUniqueID( smallID ) ) {
				smallID = uniqueId( smallID );
			}
			setAttributes( {
				uniqueID: smallID,
			} );
			addUniqueID( smallID, clientId );
		} else if ( ! isUniqueID( uniqueID ) ) {
			// This checks if we are just switching views, client ID the same means we don't need to update.
			if ( ! isUniqueBlock( uniqueID, clientId ) ) {
				attributes.uniqueID = smallID;
				addUniqueID( smallID, clientId );
			}
		} else {
			addUniqueID( uniqueID, clientId );
		}
		if ( context && ( context.queryId || Number.isFinite( context.queryId ) ) && context.postId ) {
			if ( ! attributes.inQueryBlock ) {
				setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( attributes.inQueryBlock ) {
			setAttributes( {
				inQueryBlock: false,
			} );
		}
	}, [] );
	const previewGap = getPreviewSize( previewDevice, ( undefined !== gap?.[0] ? gap[0] : '' ), ( undefined !== gap?.[1] ? gap[1] : '' ), ( undefined !== gap?.[2] ? gap[2] : '' ) );
	const previewAlign = getPreviewSize( previewDevice, ( undefined !== hAlign ? hAlign : '' ), ( undefined !== thAlign ? thAlign : '' ), ( undefined !== mhAlign ? mhAlign : '' ) );
	const previewVertical = getPreviewSize( previewDevice, ( undefined !== vAlign ? vAlign : '' ), ( undefined !== tvAlign ? tvAlign : '' ), ( undefined !== mvAlign ? mvAlign : '' ) );
	const previewOrientation = getPreviewSize( previewDevice, ( undefined !== orientation?.[0] ? orientation[0] : '' ), ( undefined !== orientation?.[1] ? orientation[1] : '' ), ( undefined !== orientation?.[2] ? orientation[2] : '' ) );

	const outerClasses = classnames( {
		className                   : className,
		[ `kb-btns-${uniqueID}` ]  : true,
	} );
	const blockProps = useBlockProps( {
		className: outerClasses,
	} );
	const innerClasses = classnames( {
		'kb-btns-outer-wrap'                   : true,
		[ `kt-btn-align-${previewAlign}` ]  : previewAlign,
		[ `kt-btn-valign-${previewVertical}` ]  : previewVertical,
		[ `kb-direction-columns` ]         : ( previewOrientation && ( 'column' === previewOrientation || 'column-reverse' === previewOrientation ) ),
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerClasses,
		},
		{
			orientation: 'horizontal',
			templateLock: lockBtnCount ? true : false,
            templateInsertUpdatesSelection: true,
			__experimentalDefaultBlock: DEFAULT_BLOCK,
			__experimentalDirectInsert:true,
            template: [ [ 'kadence/singlebtn' ] ],
            allowedBlocks: [ 'kadence/singlebtn' ],
		}
	);
	return (
		<div {...blockProps}>
			<style>
				{ previewGap && (
					`.wp-block-kadence-advancedbtn.kb-btns-${uniqueID} .kb-btns-outer-wrap {
						gap: ${getGapSizeOptionOutput( previewGap, ( gapUnit ? gapUnit : 'px' ) )};
					}`
				) }
				{ previewOrientation && (
					`.wp-block-kadence-advancedbtn.kb-btns-${uniqueID} .kb-btns-outer-wrap {
						flex-direction: ${previewOrientation};
					}`
				) }
			</style>
			<BlockControls>
				<ToolbarGroup>
					<JustifyContentControl
						value={ previewAlign }
						onChange={ value => {
							if ( previewDevice === 'Mobile' ) {
								setAttributes( { mhAlign: ( value ? value : '' ) } );
							} else if ( previewDevice === 'Tablet' ) {
								setAttributes( { thAlign: ( value ? value : '' ) } );
							} else {
								setAttributes( { hAlign: ( value ? value : 'center' ) } );
							}
						} }
					/>
					<BlockVerticalAlignmentControl
						value={previewVertical}
						onChange={ value => {
							if ( previewDevice === 'Mobile' ) {
								setAttributes( { mvAlign: ( value ? value : '' ) } );
							} else if ( previewDevice === 'Tablet' ) {
								setAttributes( { tvAlign: ( value ? value : '' ) } );
							} else {
								setAttributes( { vAlign: ( value ? value : 'center' ) } );
							}
						}}
					/>
				</ToolbarGroup>
				{ ! lockBtnCount && (
					<ToolbarGroup>
						<ToolbarButton
							className="kb-icons-add-icon"
							icon={ plusCircle }
							onClick={ () => {
								const latestAttributes = buttonsBlock.innerBlocks[buttonsBlock.innerBlocks.length - 1].attributes;
								latestAttributes.uniqueID = '';
								const newBlock = createBlock( 'kadence/singlebtn', latestAttributes );
								insertButton( newBlock );
							} }
							label={  __( 'Add Another Button', 'kadence-blocks' ) }
							showTooltip={ true }
						/>
					</ToolbarGroup>
				)}
			</BlockControls>
			<KadenceInspectorControls blockSlug={ 'kadence/advancedbtn' }>

				<InspectorControlTabs
					panelName={ 'kadence/advancedbtn' }
					allowedTabs={ [ 'general', 'advanced' ] }
					setActiveTab={ ( value ) => setActiveTab( value ) }
					activeTab={ activeTab }
				/>

				{( activeTab === 'general' ) &&
					<KadencePanelBody panelName={'kb-icon-alignment-settings'}>
						<ResponsiveAlignControls
							label={__( 'Alignment', 'kadence-blocks' )}
							value={( hAlign ? hAlign : '' )}
							mobileValue={( mhAlign ? mhAlign : '' )}
							tabletValue={( thAlign ? thAlign : '' )}
							onChange={( nextAlign ) => setAttributes( { hAlign: ( nextAlign ? nextAlign : 'center' ) } )}
							onChangeTablet={( nextAlign ) => setAttributes( { thAlign: ( nextAlign ? nextAlign : '' ) } )}
							onChangeMobile={( nextAlign ) => setAttributes( { mhAlign: ( nextAlign ? nextAlign : '' ) } )}
							type={ 'justify' }
						/>
						<ResponsiveAlignControls
							label={__( 'Vertical Alignment', 'kadence-blocks' )}
							value={( vAlign ? vAlign : '' )}
							mobileValue={( mvAlign ? mvAlign : '' )}
							tabletValue={( tvAlign ? tvAlign : '' )}
							onChange={( nextAlign ) => setAttributes( { vAlign: ( nextAlign ? nextAlign : 'center' ) } )}
							onChangeTablet={( nextAlign ) => setAttributes( { tvAlign: ( nextAlign ? nextAlign : '' ) } )}
							onChangeMobile={( nextAlign ) => setAttributes( { mvAlign: ( nextAlign ? nextAlign : '' ) } )}
							type={ 'vertical' }
						/>
						<ResponsiveAlignControls
							label={__( 'Orientation', 'kadence-blocks' )}
							value={( undefined !== orientation?.[0] ? orientation[0] : '' )}
							tabletValue={( undefined !== orientation?.[1] ? orientation[1] : '' )}
							mobileValue={( undefined !== orientation?.[2] ? orientation[2] : '' )}
							onChange={( value ) => setAttributes( { orientation: [ value, ( undefined !== orientation?.[1] ? orientation[1] : '' ), ( undefined !== orientation?.[2] ? orientation[2] : '' ) ] } ) }
							onChangeTablet={( value ) => setAttributes( { orientation: [ ( undefined !== orientation?.[0] ? orientation[0] : '' ), value, ( undefined !== orientation?.[2] ? orientation[2] : '' ) ] } ) }
							onChangeMobile={( value ) => setAttributes( { orientation: [ ( undefined !== orientation?.[0] ? orientation[0] : '' ), ( undefined !== orientation?.[1] ? orientation[1] : '' ), value ] } ) }
							type={ 'orientation' }
						/>
						{ undefined !== buttonsBlock?.innerBlocks?.length && buttonsBlock.innerBlocks.length > 1 && (
							<ResponsiveGapSizeControl
								label={__( 'Button Gap', 'kadence-blocks' )}
								value={ ( undefined !== gap?.[0] ? gap[0] : '' ) }
								onChange={ value => setAttributes( { gap: [value,( undefined !== gap[1] ? gap[1] : '' ),( undefined !== gap[2] ? gap[2] : '' )] } )}
								tabletValue={( undefined !== gap?.[1] ? gap[1] : '' )}
								onChangeTablet={( value ) => setAttributes( { gap: [( undefined !== gap[0] ? gap[0] : '' ),value,( undefined !== gap[2] ? gap[2] : '' )] } )}
								mobileValue={( undefined !== gap?.[2] ? gap[2] : '' )}
								onChangeMobile={( value ) => setAttributes( { gap: [( undefined !== gap[0] ? gap[0] : '' ),( undefined !== gap[1] ? gap[1] : '' ),value] } )}
								min={0}
								max={( gapUnit === 'px' ? 200 : 12 )}
								step={( gapUnit === 'px' ? 1 : 0.1 )}
								unit={ gapUnit ? gapUnit : 'px' }
								onUnit={( value ) => {
									setAttributes( { gapUnit: value } );
								}}
								units={[ 'px', 'em', 'rem' ]}
							/>
						) }
					</KadencePanelBody>
				}

			</KadenceInspectorControls>
			<div {...innerBlocksProps}>
			</div>
		</div>
	);
}
const KadenceButtonsWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		insertButton( newBlock ) {
			const { clientId } = ownProps;
			const { insertBlock } = dispatch( blockEditorStore );
			const { getBlock } = registry.select( blockEditorStore );
			const block = getBlock( clientId );
			insertBlock( newBlock, parseInt( block.innerBlocks.length ), clientId );
		},
	} )
)( KadenceButtons );
const KadenceButtonsEdit = ( props ) => {
	const { clientId } = props;
	const { buttonsBlock } = useSelect(
		( select ) => {
			const {
				getBlock,
			} = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return {
				buttonsBlock: block,
			};
		},
		[ clientId ]
	);
	return <KadenceButtonsWrapper buttonsBlock={ buttonsBlock } { ...props } />;
};
export default KadenceButtonsEdit;

