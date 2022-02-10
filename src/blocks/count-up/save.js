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
			displayTitle,
		} = attributes
		const classes = classnames( {
			[ `kb-count-up-${ uniqueID }` ]: uniqueID,
			'kb-count-up': true
		} );
		const tagName = titleFont[ 0 ].htmlTag && titleFont[ 0 ].htmlTag !== 'heading' ? titleFont[ 0 ].htmlTag : 'h' + titleFont[ 0 ].level;
		return (
			<div
				className={ classes }
				data-start={ start }
				data-end={ end }
				data-prefix={ prefix }
				data-suffix={ suffix }
				data-duration={ duration }
				data-separator={ separator }
			>
				<div className={ 'kb-count-up-process kb-count-up-number' } />
				{ title && displayTitle && (
					<RichText.Content
						tagName={ tagName }
						className={ 'kb-count-up-title' }
						value={ title }
					/>
				) }
			</div>
		)
	}
}
export default KadenceCounterUpSave;
