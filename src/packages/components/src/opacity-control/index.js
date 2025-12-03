/**
 * Measure Component
 *
 */

/**
 * Internal block libraries
 */
import { Component } from '@wordpress/element';
import {
	Button,
	Popover,
	RangeControl,
	Tooltip,
} from '@wordpress/components';
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

		// @todo: Replace with icon from @kadence/icons once created
		const icons = {};
		icons.opacity = <svg width="20px" height="20px" viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fillRule='evenodd'
							 clipRule='evenodd' strokeLinejoin='round' strokeMiterlimit='1.414'>
			<g fillRule='nonzero'>
				<path d='M14.043,7.612c2.23,2.178 2.23,5.726 0,7.904c-1.081,1.055 -2.515,1.638 -4.042,1.638c-1.527,0 -2.964,-0.583 -4.042,-1.638c-1.08,-1.056 -1.674,-2.46 -1.674,-3.952c0,-1.492 0.594,-2.896 1.676,-3.956l4.04,-4.026l4.038,4.026c0.002,0.002 0.004,0.002 0.004,0.004Z'
					  fill='url(#_Linear1)' />
				<path d='M15.595,6.066c3.082,3.013 3.082,7.917 -0.002,10.931c-1.493,1.461 -3.479,2.265 -5.591,2.265c-2.112,0 -4.097,-0.804 -5.593,-2.265c-1.493,-1.46 -2.315,-3.402 -2.315,-5.467c0,-2.065 0.822,-4.007 2.315,-5.466l5.176,-5.162c0.221,-0.219 0.614,-0.219 0.833,0l5.177,5.164Zm-0.826,10.124c2.629,-2.568 2.629,-6.751 0,-9.32c0,-0.002 -0.003,-0.002 -0.005,-0.004l-4.762,-4.749l-4.764,4.749c-1.276,1.249 -1.976,2.905 -1.976,4.664c0,1.76 0.7,3.416 1.974,4.66c1.272,1.245 2.966,1.932 4.766,1.932c1.801,0 3.493,-0.687 4.767,-1.932Z'
				/>
			</g>
			<defs>
				<linearGradient id='_Linear1' x2='1' gradientUnits='userSpaceOnUse' gradientTransform='matrix(11.4305 0 0 13.5721 4.285 10.368)'>
					<stop offset='0' />
					<stop offset='0.5' stopOpacity='0.749' />
					<stop offset='1' stopOpacity='0' />
				</linearGradient>
			</defs>
		</svg>;

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
						<Button className="kt-opacity-icon" isSecondary onClick={ toggleVisible }>
							{ icons.opacity }
						</Button>
					) }
					{ this.state.isVisible && (
						<Button className="kt-opacity-icon" isSecondary onClick={ toggleClose }>
							{ icons.opacity }
						</Button>
					) }
				</Tooltip>
			</div>
		);
	}
}
export default ( OpacityControl );
