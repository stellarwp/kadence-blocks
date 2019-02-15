/**
 * BLOCK: Kadence Tabs
 */
import classnames from 'classnames';
const {
	Component,
} = wp.element;
const {
	InnerBlocks,
} = wp.editor;

class KadenceTabsSave extends Component {
	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g, '' );
	}
	render() {
		const { attributes: { uniqueID, paneCount, blockAlignment, maxWidth, titleAlignment, startCollapsed, linkPaneCollapse, showIcon, iconStyle, iconSide, openPane } } = this.props;
		const classes = classnames( `align${ ( blockAlignment ? blockAlignment : 'none' ) }` );
		const innerClasses = classnames( `kt-accordion-wrap kt-accordion-wrap kt-accordion-id${ uniqueID } kt-accordion-has-${ paneCount }-panes kt-active-pane-${ openPane } kt-accordion-block kt-pane-header-alignment-${ titleAlignment } kt-accodion-icon-style-${ ( iconStyle && showIcon ? iconStyle : 'none' ) } kt-accodion-icon-side-${ ( iconSide ? iconSide : 'right' ) }` );
		return (
			<div className={ classes } >
				<div className={ innerClasses } style={ {
					maxWidth: ( maxWidth ? maxWidth + 'px' : 'none' ),
				} }>
					<div className="kt-accordion-inner-wrap" data-allow-multiple-open={ ( ! linkPaneCollapse ? 'true' : 'false' ) } data-start-open={ ( ! startCollapsed ? openPane : 'none' ) } >
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}
export default KadenceTabsSave;
