/**
 * BLOCK: Kadence Row / Layout
 */

import classnames from 'classnames';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
} = wp.editor;

class KadenceRowLayoutSave extends Component {
	render() {
		const { attributes: { columns, blockAlignment, mobileLayout, currentOverlayTab, overlayBgImg, overlay, colLayout, tabletLayout, collapseOrder, uniqueID, columnGutter, bgColor, bgImg, verticalAlignment, htmlTag, bottomSep, bottomSepColor } } = this.props;
		let bottomSVGDivider;
		if ( 'ct' === bottomSep ) {
			bottomSVGDivider = <path className="large-center-triangle" d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
		} else if ( 'ctd' === bottomSep ) {
			bottomSVGDivider = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
		} else if ( 'ctt' === bottomSep ) {
			bottomSVGDivider = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
		}
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
						<div className={ `kt-row-layout-overlay kt-row-overlay-${ overlayType }` }></div>
					) }
					<div className={ innerColumnClasses }>
						<InnerBlocks.Content />
					</div>
					{ bottomSep && 'none' !== bottomSep && (
						<div className={ `kt-row-layout-bottom-sep kt-row-sep-type-${ bottomSep }` }>
							<svg style={ { fill: bottomSepColor } } viewBox="0 0 1000 100" preserveAspectRatio="none">
								{ bottomSVGDivider }
							</svg>
						</div>
					) }
				</div>
			</HtmlTagOut>
		);
	}
}
export default KadenceRowLayoutSave;
