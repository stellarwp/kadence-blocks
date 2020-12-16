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
			title,
			start,
			end,
			prefix,
			suffix,
			duration,
			separator,
			uniqueID
		} = attributes

		return (
			<div
				className={ classnames( 'kt-counter-up' ) }
				data-start={ start }
				data-end={ end }
				data-prefix={ prefix }
				data-suffix={ suffix }
				data-duration={ duration }
				data-separator={ separator }
			>
				<div className="kt-counter-up-process" />
				<RichText.Content
					tagName="div"
					value={ title }
					className="title"
				/>
			</div>
		)
	}
}
export default KadenceCounterUpSave;
