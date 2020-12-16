/**
 * BLOCK: Kadence Counter-Up
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
 * Import External
 */
import CountUp from 'react-countup';
import classnames from 'classnames';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	createBlock,
} = wp.blocks;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const {
	Component,
	Fragment,
} = wp.element;
const {
	RichText
} = wp.blockEditor;
const {

} = wp.components;
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;

/**
 * Build the row edit
 */
class KadenceCounterUp extends Component {
	constructor() {
		super( ...arguments );

	}

	componentDidMount() {

		const { attributes } = this.props;
		const { uniqueID } = attributes;

		if ( ! uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
	}

	render() {

		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes
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
			<Fragment>
				{ isSelected && <Inspector {...this.props} /> }
				<div className={ classnames( 'kt-counter-up' ) }>
					<CountUp
					  start={ start }
					  end={ end }
					  duration={ duration }
					  separator={ separator ? ',' : '' }
					  prefix={ prefix }
					  suffix={ suffix }
					/>
					<RichText
						tagName="div"
						value={ title }
						placeholder={ __( 'Type Here...' ) }
						onChange={ (content) => setAttributes({ title: content }) }
					/>
				</div>
			</Fragment>
		)
	}
}
export default KadenceCounterUp
