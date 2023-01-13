/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
import classnames from 'classnames';

import { KadencePanelBody, KadenceIconPicker, IconRender } from '@kadence/components';
import { getUniqueId } from '@kadence/helpers';

import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import {
	RichText,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Build the Pane edit.
 */
function PaneEdit( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
	className,
} ) {

	const { id, uniqueID, title, icon, iconSide, hideLabel, titleTag, ariaLabel } = attributes;
	const HtmlTagOut = ( ! titleTag ? 'div' : titleTag );
	const { addUniqueID, addUniquePane } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, isUniquePane, isUniquePaneBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				isUniquePane: ( value, rootID ) => select( 'kadenceblocks/data' ).isUniquePane( value, rootID ),
				isUniquePaneBlock: ( value, clientId, rootID ) => select( 'kadenceblocks/data' ).isUniquePaneBlock( value, clientId, rootID ),
			};
		},
		[ clientId ]
	);
	const { accordionBlock, rootID } = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlocksByClientId } = select( blockEditorStore );
			const rootID = getBlockRootClientId( clientId );
			const accordionBlock = getBlocksByClientId( rootID );
			return {
				accordionBlock: ( undefined !== accordionBlock ? accordionBlock : '' ),
				rootID: ( undefined !== rootID ? rootID : '' ),
			};
		},
		[ clientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const updatePaneCount = ( value ) => {
		updateBlockAttributes( rootID, { paneCount: value } );
	}
	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
		
		if ( ! id ) {
			const newPaneCount = accordionBlock[0].attributes.paneCount + 1;
			setAttributes( {
				id: newPaneCount,
			} );
			if ( ! isUniquePane( newPaneCount, rootID ) ) {
				addUniquePane( newPaneCount, clientId, rootID );
			}
			updatePaneCount( newPaneCount );
		} else if ( ! isUniquePane( id, rootID ) ) {
			// This checks if we are just switching views, client ID the same means we don't need to update.
			if ( ! isUniquePaneBlock( id, clientId, rootID ) ) {
				const newPaneCount = accordionBlock[0].attributes.paneCount + 1;
				setAttributes( {
					id: newPaneCount,
				} );
				addUniquePane( newPaneCount, clientId, rootID );
				updatePaneCount( newPaneCount );
			}
		} else {
			addUniquePane( id, clientId, rootID );
		}
	}, [] );
	const blockClasses = classnames( {
		'kt-accordion-pane'                   : true,
		[ `kt-accordion-pane-${id}` ]  : id,
		[ `kt-pane${uniqueID}` ]  : uniqueID,
		[ `kt-accordion-panel-active` ]         : undefined !== accordionBlock?.[0]?.attributes?.openPane && ( accordionBlock[0].attributes.openPane + 1 === id ),
	} );
	const blockProps = useBlockProps( {
		className: blockClasses
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'kt-accordion-panel-inner',
		},
		{
			templateLock: false,
		}
	);
	return (
		<div {...blockProps}>
			<InspectorControls>
				<KadencePanelBody
					title={ __( 'Title Icon Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-pane-title-icon' }
				>
					<KadenceIconPicker
						value={ icon }
						onChange={ value => setAttributes( { icon: value } ) }
						allowClear={ true }
					/>
					<SelectControl
						label={ __( 'Icon Side', 'kadence-blocks' ) }
						value={ iconSide }
						options={ [
							{ value: 'right', label: __( 'Right', 'kadence-blocks' ) },
							{ value: 'left', label: __( 'Left', 'kadence-blocks' ) },
						] }
						onChange={ value => setAttributes( { iconSide: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show only Icon', 'kadence-blocks' ) }
						checked={ hideLabel }
						onChange={ value => setAttributes( { hideLabel: value } ) }
					/>
					<TextControl
						label={ __( 'Button Label Attribute for Accessibility', 'kadence-blocks' ) }
						value={ ariaLabel }
						onChange={ value => setAttributes( { ariaLabel: value } ) }
					/>
				</KadencePanelBody>
			</InspectorControls>
			<HtmlTagOut className={ `kt-accordion-header-wrap` } >
				<div className={ `kt-blocks-accordion-header kt-acccordion-button-label-${ ( hideLabel ? 'hide' : 'show' ) }` }>
					<div className="kt-blocks-accordion-title-wrap">
						{ icon && 'left' === iconSide && (
							<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
						) }
						<RichText
							className="kt-blocks-accordion-title"
							tagName={ 'div' }
							placeholder={ __( 'Add Title', 'kadence-blocks' ) }
							onChange={ value => setAttributes( { title: value } ) }
							value={ title }
							keepPlaceholderOnFocus
						/>
						{ icon && 'right' === iconSide && (
							<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ icon } kt-btn-side-${ iconSide }` } name={ icon } />
						) }
					</div>
					<div className="kt-blocks-accordion-icon-trigger"></div>
				</div>
			</HtmlTagOut>
			<div className={ 'kt-accordion-panel' } >
				<div {...innerBlocksProps} >
				</div>
			</div>
		</div>
	);
}
export default ( PaneEdit );
