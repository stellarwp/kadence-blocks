/**
 * BLOCK: Kadence Row / Layout
 */

import classnames from 'classnames';
const {
	Component,
} = wp.element;
const {
	InnerBlocks,
} = wp.editor;

class KadenceRowLayoutSave extends Component {
	render() {
		const { attributes: { columns, blockAlignment, mobileLayout, currentOverlayTab, overlayBgImg, overlay, colLayout, tabletLayout, collapseOrder, uniqueID, columnGutter, bgColor, bgImg, verticalAlignment, htmlTag } } = this.props;
		const layoutClass = ( ! colLayout ? 'equal' : colLayout );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const HtmlTagOut = ( ! htmlTag ? 'div' : htmlTag );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classId = ( ! uniqueID ? 'notset' : uniqueID );
		const hasBG = ( bgColor || bgImg || overlay || overlayBgImg ? 'kt-row-has-bg' : '' );
		const overlayType = ( ! currentOverlayTab || 'grad' !== currentOverlayTab ? 'normal' : 'gradient')
		const classes = classnames( `align${ blockAlignment }` );
		const innerClasses = classnames( `kt-row-layout-inner ${ hasBG } kt-layout-id${ classId }` );
		const innerColumnClasses = classnames( `kt-row-column-wrap kt-has-${ columns }-columns kt-gutter-${ columnGutter } kt-row-valign-${ verticalAlignment } kt-row-layout-${ layoutClass } kt-tab-layout-${ tabLayoutClass } kt-m-colapse-${ collapseOrder } kt-mobile-layout-${ mobileLayoutClass }` );

		return (
			<HtmlTagOut className={ classes }>
				<div id={ `kt-layout-id${ uniqueID }` } className={ innerClasses }>
					{ ( overlay || overlayBgImg ) && (
						<div className={ `kt-row-layout-overlay kt-row-overlay-${overlayType}` }></div>
					) }
					<div className={ innerColumnClasses }>
						<InnerBlocks.Content />
					</div>
				</div>
			</HtmlTagOut>
		);
	}
}
export default KadenceRowLayoutSave;
