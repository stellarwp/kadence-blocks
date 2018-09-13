/**
 * BLOCK: Kadence Tabs
 */
import classnames from 'classnames';
import times from 'lodash/times';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.editor;

class KadenceTabsSave extends Component {
	render() {
		const { attributes: { tabCount, blockAlignment, currentTab, mobileLayout, layout, tabletLayout, uniqueID, titles, bgColor, innerPadding, size, borderRadius, titleBorderWidth, maxWidth, minHeight } } = this.props;
		const layoutClass = ( ! layout ? 'tabs' : layout );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classId = ( ! uniqueID ? 'notset' : uniqueID );
		const classes = classnames( `align${ blockAlignment }` );
		const innerClasses = classnames( `kt-tabs-wrap kt-tabs-id${ classId } kt-tabs-has-${ tabCount }-tabs kt-tabs-layout-${ layoutClass } kt-tabs-tablet-layout-${ tabLayoutClass } kt-tabs-mobile-layout-${ mobileLayoutClass }` );
		const renderTitles = ( index ) => {
			return (
				<Fragment>
					<li className={ `kt-title-item kt-title-item-${ index } kt-tabs-svg-show-${ ( ! titles[ index ].onlyIcon ? 'always' : 'only' ) } kt-tab-title-${ ( 1 + index === currentTab ? 'active' : 'inactive' ) }` }>
						<span className={ `kt-tab-title kt-tab-title-${ 1 + index } ` } style={ {
							borderTopLeftRadius: borderRadius + 'px',
							borderTopRightRadius: borderRadius + 'px',
							borderWidth: titleBorderWidth[ 0 ] + 'px' + titleBorderWidth[ 1 ] + 'px' + titleBorderWidth[ 2 ] + 'px' + titleBorderWidth[ 3 ] + 'px',
						} } >
							{ titles[ index ].icon && 'left' === titles[ index ].iconSide && (
								<GenIcon className={ `kt-tab-svg-icon kt-tab-svg-icon-${ titles[ index ].icon } kt-title-svg-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! size ? '14' : size ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } />
							) }
							<RichText.Content
								tagName="span"
								value={ titles[ index ].text }
								className={ 'kt-button-text' }
							/>
							{ titles[ index ].icon && 'left' !== titles[ index ].iconSide && (
								<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ titles[ index ].icon } kt-btn-side-${ titles[ index ].iconSide }` } name={ titles[ index ].icon } size={ ( ! size ? '14' : size ) } icon={ ( 'fa' === titles[ index ].icon.substring( 0, 2 ) ? FaIco[ titles[ index ].icon ] : Ico[ titles[ index ].icon ] ) } />
							) }
						</span>
					</li>
				</Fragment>
			);
		};
		return (
			<div className={ classes } >
				<div className={ innerClasses } style={ {
					maxWidth: ( maxWidth ? maxWidth + 'px' : '' ),
				} }>
					<ul className="kt-tabs-title-list">
						{ times( tabCount, n => renderTitles( n ) ) }
					</ul>
					<div className="kt-tabs-content-wrap" style={ {
						minHeight: ( minHeight ? minHeight + 'px' : '' ),
						padding: ( innerPadding ? innerPadding + 'px' : '' ),
					} } >
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}
export default KadenceTabsSave;
