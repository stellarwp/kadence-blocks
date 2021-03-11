/**
 * BLOCK: Kadence Timer Block
 *
 * Registering a basic block with Gutenberg.
 */
import Countdown from 'react-countdown';

import { __ } from '@wordpress/i18n';
const {
	InnerBlocks,
} = wp.blockEditor;
const { withSelect } = wp.data;
const { compose } = wp.compose;
import {
	Fragment,
	Component,
} from '@wordpress/element';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbTimerUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceCoundownTimer extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbTimerUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kbTimerUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbTimerUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kbTimerUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	render() {
		const { attributes: { uniqueID }, clientId } = this.props;
		// const parts = {};
		// 	//console.log( units );
		// 	//if ( units[0].days ) {
		// 		parts.days = Math.floor(difference / (1000 * 60 * 60 * 24));
		// 	//}
		// 	parts.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		// 	parts.minutes = Math.floor((difference / 1000 / 60) % 60);
		// 	parts.seconds = Math.floor((difference / 1000) % 60);units
		const displayUnits = this.props.parentBlock[0].attributes.units;
		const labels = {};
		labels.days = this.props.parentBlock[0].attributes.daysLabel ? this.props.parentBlock[0].attributes.daysLabel : __( 'Days', 'kadence-blocks' );
		labels.hours = this.props.parentBlock[0].attributes.hoursLabel ? this.props.parentBlock[0].attributes.hoursLabel : __( 'Hours', 'kadence-blocks' );
		labels.minutes = this.props.parentBlock[0].attributes.minutesLabel ? this.props.parentBlock[0].attributes.minutesLabel : __( 'Minutes', 'kadence-blocks' );
		labels.seconds = this.props.parentBlock[0].attributes.secondsLabel ? this.props.parentBlock[0].attributes.secondsLabel : __( 'Seconds', 'kadence-blocks' );
		console.log( displayUnits );
		const renderer = ( { total, days, hours, minutes, seconds, completed } ) => {
			if ( completed ) {
				const parts = {};
				if ( undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].days && ! displayUnits[0].days ) {
					if ( undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].hours && ! displayUnits[0].hours ) {
						if ( undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].minutes && ! displayUnits[0].minutes ) {
							parts.seconds = 0;
						} else {
							parts.minutes = 0;
							parts.seconds = 0;
						}
					} else {
						parts.hours = 0;
						parts.minutes = 0;
						parts.seconds = 0;
					}
				} else {
					parts.days = 0;
					parts.hours = 0;
					parts.minutes = 0;
					parts.seconds = 0;
				}
				const remaining = Object.keys(parts).map( ( part ) => {
					return <div className="kb-countdown-date-item"><span className="kb-countdown-number">{ parts[part] }</span> <span className="kb-countdown-label">{ labels[part] }</span></div>;
				});
				return remaining;
			} else {
				// Render a countdown
				const parts = {};
				let calculateHours = Math.floor( ( total / ( 1000 * 60 * 60 ) ) % 24 );
				let calculateMinutes = Math.floor( ( total / 1000 / 60) % 60 );
				let calculateSeconds = Math.floor( ( total / 1000 ) % 60 );
				if ( undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].days && ! displayUnits[0].days ) {
					//Do nothing.
					calculateHours = Math.floor( ( total / ( 1000 * 60 * 60 ) ) );
					if ( undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].hours && ! displayUnits[0].hours ) {
						//Do nothing.
						calculateMinutes = Math.floor( ( total / 1000 / 60) );
						if ( undefined !== displayUnits && undefined !== displayUnits[0] && undefined !== displayUnits[0].minutes && ! displayUnits[0].minutes ) {
							//Do nothing.
							calculateSeconds = Math.floor( ( total / 1000 ) );
							parts.seconds = calculateSeconds;
						} else {
							parts.minutes = calculateMinutes;
							parts.seconds = calculateSeconds;
						}
					} else {
						parts.hours = calculateHours;
						parts.minutes = calculateMinutes;
						parts.seconds = calculateSeconds;
					}
				} else {
					parts.days = Math.floor( total / ( 1000 * 60 * 60 * 24 ) );
					parts.hours = calculateHours;
					parts.minutes = calculateMinutes;
					parts.seconds = calculateSeconds;
				}
				const remaining = Object.keys(parts).map( ( part ) => {
					return <div className="kb-countdown-date-item"><span className="kb-countdown-number">{ parts[part] }</span> <span className="kb-countdown-label">{ labels[part] }</span></div>;
				});
				return remaining;
			}
		};
		return (
			<div id={ `kb-timer-${ this.props.rootID }` } className={ `kb-countdown-timer kb-countdown-timer${ uniqueID }` } >
				 <Countdown
					date={ new Date( this.props.parentBlock[0].attributes.timestamp ) }
					renderer={ renderer }
				/>
			</div>
		);
	}
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlockRootClientId,
			getBlocksByClientId,
		} = select( 'core/block-editor' );
		const rootID = getBlockRootClientId( clientId );
		const parentBlock = getBlocksByClientId( rootID );
		return {
			parentBlock: parentBlock,
			rootID: rootID,
		};
	} ),
] )( KadenceCoundownTimer );