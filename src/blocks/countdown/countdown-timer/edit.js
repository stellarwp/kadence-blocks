/**
 * BLOCK: Kadence Timer Block
 *
 * Registering a basic block with Gutenberg.
 */
import Countdown from 'react-countdown';

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	Fragment,
	useEffect,
} from '@wordpress/element';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbTimerUniqueIDs = [];

/**
 * Build the spacer edit
 */
function KadenceCoundownTimer( props ) {

	const { attributes: { uniqueID }, clientId, parentBlock } = props;
	const parentID = ( undefined !== parentBlock[ 0 ].attributes.uniqueID ? parentBlock[ 0 ].attributes.uniqueID : rootID );

	useEffect( () => {
		if ( !uniqueID ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kbTimerUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kbTimerUniqueIDs.includes( uniqueID ) ) {
			uniqueID = '_' + clientId.substr( 2, 9 );
			kbTimerUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			kbTimerUniqueIDs.push( uniqueID );
		}
	}, [] );

	const displayUnits = parentBlock[ 0 ].attributes.units;
	const labels = {};
	labels.days = parentBlock[ 0 ].attributes.daysLabel ? parentBlock[ 0 ].attributes.daysLabel : __( 'Days', 'kadence-blocks' );
	labels.hours = parentBlock[ 0 ].attributes.hoursLabel ? parentBlock[ 0 ].attributes.hoursLabel : __( 'Hrs', 'kadence-blocks' );
	labels.minutes = parentBlock[ 0 ].attributes.minutesLabel ? parentBlock[ 0 ].attributes.minutesLabel : __( 'Mins', 'kadence-blocks' );
	labels.seconds = parentBlock[ 0 ].attributes.secondsLabel ? parentBlock[ 0 ].attributes.secondsLabel : __( 'Secs', 'kadence-blocks' );
	const preText = ( parentBlock[ 0 ].attributes.preLabel ?
		<div className="kb-countdown-item kb-pre-timer"><span className="kb-pre-timer-inner">{parentBlock[ 0 ].attributes.preLabel}</span></div> : '' );
	const postText = ( parentBlock[ 0 ].attributes.postLabel ?
		<div className="kb-countdown-item kb-post-timer"><span className="kb-post-timer-inner">{parentBlock[ 0 ].attributes.postLabel}</span></div> : '' );
	const timeNumbers = ( parentBlock[ 0 ].attributes.timeNumbers ? true : false );
	const enableDividers = ( undefined !== parentBlock[ 0 ].attributes.timerLayout && 'inline' !== parentBlock[ 0 ].attributes.timerLayout && parentBlock[ 0 ].attributes.countdownDivider ? true : false );
	const calculateNumberDesign = ( number ) => {
		if ( timeNumbers ) {
			return number > 9 ? '' + number : '0' + number;
		}
		return number;
	};
	const renderer = ( { total, days, hours, minutes, seconds, completed } ) => {
		if ( completed ) {
			const parts = {};
			if ( undefined !== displayUnits && undefined !== displayUnits[ 0 ] && undefined !== displayUnits[ 0 ].days && !displayUnits[ 0 ].days ) {
				if ( undefined !== displayUnits && undefined !== displayUnits[ 0 ] && undefined !== displayUnits[ 0 ].hours && !displayUnits[ 0 ].hours ) {
					if ( undefined !== displayUnits && undefined !== displayUnits[ 0 ] && undefined !== displayUnits[ 0 ].minutes && !displayUnits[ 0 ].minutes ) {
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
			const remaining = Object.keys( parts ).map( ( part ) => {
				if ( 'seconds' !== part && enableDividers ) {
					return <Fragment>
						<div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}><span className="kb-countdown-number">{calculateNumberDesign( parts[ part ] )}</span><span
							className="kb-countdown-label">{labels[ part ]}</span></div>
						<div className={`kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${part}`}><span className="kb-countdown-number">:</span><span
							className="kb-countdown-label">&nbsp;</span></div>
					</Fragment>;
				}
				return <div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}><span
					className="kb-countdown-number">{calculateNumberDesign( parts[ part ] )}</span><span className="kb-countdown-label">{labels[ part ]}</span></div>;
			} );
			return (
				<Fragment>
					{preText}
					{remaining}
					{postText}
				</Fragment>
			);
		} else {
			// Render a countdown
			const parts = {};
			let calculateHours = Math.floor( ( total / ( 1000 * 60 * 60 ) ) % 24 );
			let calculateMinutes = Math.floor( ( total / 1000 / 60 ) % 60 );
			let calculateSeconds = Math.floor( ( total / 1000 ) % 60 );
			if ( undefined !== displayUnits && undefined !== displayUnits[ 0 ] && undefined !== displayUnits[ 0 ].days && !displayUnits[ 0 ].days ) {
				//Do nothing.
				calculateHours = Math.floor( ( total / ( 1000 * 60 * 60 ) ) );
				if ( undefined !== displayUnits && undefined !== displayUnits[ 0 ] && undefined !== displayUnits[ 0 ].hours && !displayUnits[ 0 ].hours ) {
					//Do nothing.
					calculateMinutes = Math.floor( ( total / 1000 / 60 ) );
					if ( undefined !== displayUnits && undefined !== displayUnits[ 0 ] && undefined !== displayUnits[ 0 ].minutes && !displayUnits[ 0 ].minutes ) {
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
			const remaining = Object.keys( parts ).map( ( part ) => {
				if ( 'seconds' !== part && enableDividers ) {
					return <Fragment>
						<div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}><span className="kb-countdown-number">{calculateNumberDesign( parts[ part ] )}</span><span
							className="kb-countdown-label">{labels[ part ]}</span></div>
						<div className={`kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${part}`}><span className="kb-countdown-number">:</span><span
							className="kb-countdown-label">&nbsp;</span></div>
					</Fragment>;
				}
				return <div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}><span
					className="kb-countdown-number">{calculateNumberDesign( parts[ part ] )}</span><span className="kb-countdown-label">{labels[ part ]}</span></div>;
			} );
			return (
				<Fragment>
					{preText}
					{remaining}
					{postText}
				</Fragment>
			);
		}
	};

	const blockProps = useBlockProps( {
		className: `kb-countdown-timer kb-countdown-timer-${uniqueID}`,
	} );

	return (
		<div {...blockProps} id={`kb-timer-${parentID}`}>
			<Countdown
				date={new Date( parentBlock[ 0 ].attributes.timestamp )}
				renderer={renderer}
			/>
		</div>
	);
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
			rootID     : rootID,
		};
	} ),
] )( KadenceCoundownTimer );
