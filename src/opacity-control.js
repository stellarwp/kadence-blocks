/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Fragment,
	Component,
} = wp.element;
const {
	Button,
	Popover,
	RangeControl,
	Tooltip,
} = wp.components;
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class OpacityControl extends Component {
	constructor( label, value, onChanged ) {
		super( ...arguments );
		this.state = {
			isVisible: false,
		};
	}
	render() {
		const toggleVisible = () => {
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			this.setState( { isVisible: false } );
		};
		return (
			<div className="kt-popover-container">
				{ this.state.isVisible && (
					<Popover position="top left" className="kt-popover-opacity" onClose={ toggleClose }>
						<RangeControl
							label={ this.props.label }
							value={ this.props.value }
							onChange={ this.props.onChanged }
							min={ 0 }
							max={ 1 }
							step={ 0.01 }
						/>
					</Popover>
				) }
				<Tooltip text={ this.props.label }>
					{ ! this.state.isVisible && (
						<Button className="kt-opacity-icon" isDefault onClick={ toggleVisible }>
							{ icons.opacity }
						</Button>
					) }
					{ this.state.isVisible && (
						<Button className="kt-opacity-icon" isDefault onClick={ toggleClose }>
							{ icons.opacity }
						</Button>
					) }
				</Tooltip>
			</div>
		);
	}
}
export default ( OpacityControl );
