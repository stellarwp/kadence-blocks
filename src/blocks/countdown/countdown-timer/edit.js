/**
 * BLOCK: Kadence Timer Block
 *
 * Registering a basic block with Gutenberg.
 */
import Countdown from 'react-countdown';

const {
	InnerBlocks,
} = wp.blockEditor;
const { withSelect } = wp.data;
const { compose } = wp.compose;
const {
	Fragment,
} = wp.element;
const {
	Component,
} = wp.element;
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
		// 	parts.seconds = Math.floor((difference / 1000) % 60);
			console.log( this.props.parentBlock[0].attributes.date );
		const renderer = ( { hours, minutes, seconds, completed } ) => {
			if (completed) {
			  // Render a completed state
			  return <Completionist />;
			} else {
			  // Render a countdown
			 // <div class="kb-countdown-date-item"><span class="kb-countdown-number">${ parts[part] }</span> <span class="kb-countdown-label">${ part }</span></div>
			  return <span>{hours}:{minutes}:{seconds}</span>;
			}
		};
		return (
			<div id={ `kb-timer-${ this.props.rootID }` } className={ `kb-countdown-timer kb-countdown-timer${ uniqueID }` } >
				 <Countdown
					date={ new Date( this.props.parentBlock[0].attributes.timestamp ) }
					//renderer={ renderer }
				/>
			</div>
		);
	}
}
//export default ( KadenceCoundownTimer );
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