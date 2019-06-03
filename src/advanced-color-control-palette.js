/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';
import map from 'lodash/map';
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	Fragment,
	Component,
} = wp.element;
const {
	Button,
	Popover,
	RangeControl,
	ColorIndicator,
	ColorPicker,
	TextControl,
	Tooltip,
	Dashicon,
} = wp.components;
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class AdvancedColorControlPalette extends Component {
	constructor( label, colorValue, onSave ) {
		super( ...arguments );
		this.state = {
			isVisible: false,
			color: '',
			name: '',
		};
	}
	componentDidMount() {
		this.setState( { color: this.props.colorValue } );
		this.setState( { name: this.props.nameValue } );
	}
	render() {
		const toggleVisible = () => {
			this.setState( { isVisible: true } );
		};
		const toggleClose = () => {
			if ( this.state.isVisible === true ) {
				this.props.onSave( this.state.color, this.state.name );
				this.setState( { isVisible: false } );
			}
		};
		const changeColor = ( value ) => {
			this.setState( { color: value } );
		};
		return (
			<div className="kt-advanced-color-settings-container">
				{ this.state.isVisible && (
					<Popover position="top left" className="kt-popover-color" onClose={ toggleClose }>
						<ColorPicker
							color={ ( undefined === this.state.color || '' === this.state.color ? this.props.colorValue : this.state.color ) }
							onChangeComplete={ ( color ) => changeColor( color.hex ) }
							disableAlpha
						/>
						<TextControl
							label={ __( 'Name:' ) }
							value={ ( undefined === this.state.name || '' === this.state.name ? this.props.nameValue : this.state.name ) }
							onChange={ ( value ) => this.setState( { name: value } ) }
						/>
					</Popover>
				) }
				{ this.state.isVisible && (
					<Tooltip text={ __( 'Edit Color' ) }>
						<Button className={ 'kt-color-icon-indicate' } onClick={ toggleClose }>
							<ColorIndicator className="kt-advanced-color-indicate" colorValue={ ( 'transparent' === this.state.color || undefined === this.state.color || '' === this.state.color ? this.props.colorDefault : this.state.color ) } />
						</Button>
					</Tooltip>
				) }
				{ ! this.state.isVisible && (
					<Tooltip text={ __( 'Edit Color' ) }>
						<Button className={ 'kt-color-icon-indicate' } onClick={ toggleVisible }>
							<ColorIndicator className="kt-advanced-color-indicate" colorValue={ ( 'transparent' === this.state.color || undefined === this.state.color || '' === this.state.color ? this.props.colorDefault : this.state.color ) } />
						</Button>
					</Tooltip>
				) }
			</div>
		);
	}
}
export default ( AdvancedColorControlPalette );
