/**
 * BLOCK: Kadence Count-Up
 */

/**
 * Import External
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { RichText } = wp.blockEditor;

/**
 * Build the count up save
 */
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
			titleFont,
		} = attributes

		const titleTagName = 'h' + titleFont[ 0 ].level;

		return (
			<div
				id={ `kt-count-up-${uniqueID}` }
				className={ classnames( 'kt-count-up' ) }
				data-start={ start }
				data-end={ end }
				data-prefix={ prefix }
				data-suffix={ suffix }
				data-duration={ duration }
				data-separator={ separator }
			>
				<div className={ classnames( 'kt-count-up-process kt-count-up-number' ) } />
				<RichText.Content
					tagName={ titleTagName }
					className={ classnames( 'kt-count-up-title' ) }
					value={ title }
				/>
			</div>
		)
	}
}
export default KadenceCounterUpSave;
