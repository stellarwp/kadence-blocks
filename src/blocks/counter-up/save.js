/**
 * BLOCK: Kadence Counter-Up
 */
import classnames from 'classnames';

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.blockEditor;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

class KadenceCounterUpSave extends Component {

	render() {
		const {
			attributes,
		} = this.props;

		const {
			uniqueID,
			title,
			start,
			end,
			prefix,
			suffix,
			duration,
			separator,
			displayTitle,
			titleFont,
			titleColor,
			titleHoverColor,
			titleMinHeight,
			numberFont,
			numberColor,
			numberHoverColor,
			numberMinHeight,
		} = attributes

		const titleTagName = 'h' + titleFont[ 0 ].level;

		return (
			<div
				id={ `kt-counter-up-${uniqueID}` }
				className={ classnames( 'kt-counter-up' ) }
				data-start={ start }
				data-end={ end }
				data-prefix={ prefix }
				data-suffix={ suffix }
				data-duration={ duration }
				data-separator={ separator }
			>
				<div className={ classnames( 'kt-counter-up-process kt-counter-up-number' ) } />
				<RichText.Content
					tagName={ titleTagName }
					className={ classnames( 'kt-counter-up-title' ) }
					value={ title }
				/>
			</div>
		)
	}
}
export default KadenceCounterUpSave;
