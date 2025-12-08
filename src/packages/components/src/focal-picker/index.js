/**
 * Focal Point control.
 */
import { Component } from '@wordpress/element';
import { FocalPointPicker } from '@wordpress/components';
/**
 * Focal Point control
 */
class KadenceFocalPicker extends Component {
	constructor() {
		super( ...arguments );
		this.onPositionChange = this.onPositionChange.bind( this );
		this.convertPosition = this.convertPosition.bind( this );
		this.state = {
			position: null,
		};
	}
	convertPosition( position ) {
		if ( ! position ) {
			return { x: 0.5, y: 0.5 };
		}
		let positionX = 0.5;
		let positionY = 0.5;
		const positionArray = position.split( ' ' );
		if ( positionArray && positionArray[ 0 ] ) {
			switch ( positionArray[ 0 ] ) {
				case 'left':
					positionX = 0;
					break;
				case 'right':
					positionX = 1;
					break;
				case 'center':
					positionX = 0.5;
					break;
				default:
					positionX = parseInt( positionArray[ 0 ], 10 ) / 100;
					break;
			}
		}
		if ( positionArray && positionArray[ 1 ] ) {
			switch ( positionArray[ 1 ] ) {
				case 'top':
					positionY = 0;
					break;
				case 'bottom':
					positionY = 1;
					break;
				case 'center':
					positionY = 0.5;
					break;
				default:
					positionY = parseInt( positionArray[ 1 ], 10 ) / 100;
					break;
			}
		}
		return { x: positionX, y: positionY };
	}
	onPositionChange( position ) {
		this.setState( { position } );
		let focalPoint;
		if ( position && undefined !== position.x && '' !== position.x ) {
			focalPoint = ( position.x * 100 ) + '% ' + ( position.y * 100 ) + '%';
		}
		this.props.onChange( focalPoint );
	}
	render() {
		const imagePosition = this.state.position ? this.state.position : this.convertPosition( this.props.value );
		return (
			<FocalPointPicker
				url={ this.props.url }
				value={ imagePosition }
				onChange={ ( focalPoint ) => this.onPositionChange( focalPoint ) }
			/>
		);
	}
}
export default ( KadenceFocalPicker );
