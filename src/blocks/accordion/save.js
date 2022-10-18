/**
 * BLOCK: Kadence Accordion
 */
import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';

function KadenceAccordionSave( { attributes } ) {

	const { uniqueID, paneCount, align, maxWidth, titleAlignment, startCollapsed, linkPaneCollapse, showIcon, iconStyle, iconSide, openPane } = attributes;
	const classes = classnames( `align${( align ? align : 'none' )}` );
	const innerClasses = classnames( `kt-accordion-wrap kt-accordion-id${uniqueID} kt-accordion-has-${paneCount}-panes kt-active-pane-${openPane} kt-accordion-block kt-pane-header-alignment-${ titleAlignment ? titleAlignment : 'left' } kt-accodion-icon-style-${( iconStyle && showIcon ? iconStyle : 'none' )} kt-accodion-icon-side-${( iconSide ? iconSide : 'right' )}` );

	const blockProps = useBlockProps.save( {
		className: classes,
	} );

	return (
		<div {...blockProps}>
			<div className={innerClasses} style={{
				maxWidth: ( maxWidth ? maxWidth + 'px' : 'none' ),
			}}>
				<div className="kt-accordion-inner-wrap" data-allow-multiple-open={( !linkPaneCollapse ? 'true' : 'false' )} data-start-open={( !startCollapsed ? openPane : 'none' )}>
					<InnerBlocks.Content/>
				</div>
			</div>
		</div>
	);

}

export default KadenceAccordionSave;
