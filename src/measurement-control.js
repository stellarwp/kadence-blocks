/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';

/**
 * Import Css
 */
import './editor-components.scss';

/**
 * Import External
 */
import map from 'lodash/map';
import KadenceRange from './kadence-range-control';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	TextControl,
	ToolbarGroup,
	Tooltip,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function MeasurementControls( {
	label,
	measurement,
	control,
	onChange,
	onControl,
	step = 1,
	max = 100,
	min = 0,
	controlTypes = [
		{ key: 'linked', name: __( 'Linked' ), icon: icons.locked },
		{ key: 'individual', name: __( 'Individual' ), icon: icons.unlocked },
	],
	firstIcon = icons.outlinetop,
	secondIcon = icons.outlineright,
	thirdIcon = icons.outlinebottom,
	fourthIcon = icons.outlineleft,
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
	allowEmpty = false,
} ) {
	const zero = ( allowEmpty ? '' : 0 );
	// const getLockedButtons() {
	// 	const { locked } = this.state;
	// 	if ( locked ) {
	// 		return ( <Button
	// 				className="is-single"
	// 				onClick={ () => {
	// 					let value = this.state.locked;
	// 					value = false;
	// 					this.setState( { locked: value } );
	// 					this.updateValues( { locked: value } );
	// 				} }
	// 				isSmall
	// 			>{ Icons['locked'] }</Button> );
	// 	}
	// 	return ( <Button
	// 				className="is-single"
	// 				isSmall
	// 				onClick={ () => {
	// 					let value = this.state.locked;
	// 					value = true;
	// 					this.setState( { locked: value } );
	// 					this.updateValues( { locked: value } );
	// 				} }
	// 			>{ Icons['unlocked'] }</Button> );
	// }
	// getUnitButtons() {
	// 	let self = this;
	// 	const { units } = this.controlParams;
	// 	if ( units.length === 1 ) {
	// 		return ( <Button
	// 				className="is-active is-single"
	// 				isSmall
	// 				disabled
	// 		>{ ( '%' === self.state.unit ? Icons.percent : Icons[ self.state.unit ] ) }</Button> );
	// 	}
	// 	return <ToolbarGroup
	// 				isCollapsed={ true }
	// 				icon={ ( '%' === self.state.unit ? Icons.percent : Icons[ self.state.unit ] ) }
	// 				label={ __( 'Unit', 'kadence' ) }
	// 				controls={ units.map( (unit) => this.createLevelControlToolbar( unit ) ) }
	// 			/> 
	// }
	/**
	 * Build Toolbar Items.
	 */
	const createLevelControlToolbar = ( selectedUnit ) => {
		return [ {
			icon: ( selectedUnit === '%' ? icons.percent : icons[ selectedUnit ] ),
			isActive: unit === selectedUnit,
			onClick: () => {
				onUnit( unit );
			},
		} ];
	};
	return [
		onChange && onControl && (
			<div className={ `components-base-control kb-measure-control ${ firstIcon !== icons.outlinetop ? 'kb-measure-corners-control' : 'kb-measure-sides-control' }` }>
				{ label && (
					<div className="kadence-title-bar">
						<span className="kadence-control-title">{ label }</span>
					</div>
				) }
				<div className="kadence-controls-content">
					{ control && control !== 'individual' && (
						<KadenceRange
							value={ ( measurement ? measurement[ 0 ] : '' ) }
							onChange={ ( value ) => onChange( [ value, value, value, value ] ) }
							min={ min }
							max={ max }
							step={ step }
						/>
					) }
					{ control && control === 'individual' && (
						<Fragment>
							<div className="measure-input-wrap measure-input-top">
								<TextControl
									label={ __( 'Top', 'kadence-blocks' ) }
									hideLabelFromVision={ true }
									type="number"
									className="measure-inputs"
									value={ ( measurement ? measurement[ 0 ] : '' ) }
									onChange={ ( value ) => onChange( [ value, ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
									min={ min }
									max={ max }
									step={ step }
								/>
								<span className="measure-label">{ firstIcon }</span>
							</div>
							<div className="measure-input-wrap measure-input-right">
								<TextControl
									label={ __( 'Right', 'kadence-blocks' ) }
									hideLabelFromVision={ true }
									type="number"
									className="measure-inputs"
									value={ ( measurement ? measurement[ 1 ] : '' ) }
									onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), value, ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
									min={ min }
									max={ max }
									step={ step }
								/>
								<span className="measure-label">{ secondIcon }</span>
							</div>
							<div className="measure-input-wrap measure-input-bottom">
								<TextControl
									label={ __( 'Bottom', 'kadence-blocks' ) }
									hideLabelFromVision={ true }
									type="number"
									className="measure-inputs"
									value={ ( measurement ? measurement[ 2 ] : '' ) }
									onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), value, ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
									min={ min }
									max={ max }
									step={ step }
								/>
								<span className="measure-label">{ thirdIcon }</span>
							</div>
							<div className="measure-input-wrap measure-input-left">
								<TextControl
									label={ __( 'Left', 'kadence-blocks' ) }
									hideLabelFromVision={ true }
									type="number"
									className="measure-inputs"
									value={ ( measurement ? measurement[ 3 ] : '' ) }
									onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), value ] ) }
									min={ min }
									max={ max }
									step={ step }
								/>
								<span className="measure-label">{ fourthIcon }</span>
							</div>
						</Fragment>
					) }
					<div className="kadence-units kadence-locked">
						{ control && control !== 'individual' ? (
							<Tooltip text={ __( 'Individual', 'kadence-blocks' ) }>
								<Button
									className="is-single"
									isSmall
									onClick={ () => onControl( 'individual' ) }
								>
									{ icons.locked }
								</Button>
							</Tooltip>
						) : (
							<Tooltip text={ __( 'Linked', 'kadence-blocks' ) }>
								<Button
									className="is-single"
									isSmall
									onClick={ () => onControl( 'linked' ) }
								>
									{ icons.unlocked }
								</Button>
							</Tooltip>
						) }
					</div>
					{ ( onUnit || showUnit ) && (
						<div className="kadence-units">
							{ units.length === 1 ? (
								<Button
									className="is-active is-single"
									isSmall
									disabled
								>{ ( '%' === unit ? icons.percent : icons[ unit ] ) }</Button>
							) : (
								<ToolbarGroup
									isCollapsed={ true }
									icon={ ( '%' === unit ? icons.percent : icons[ unit ] ) }
									label={ __( 'Unit', 'kadence-blocks' ) }
									controls={ units.map( ( singleUnit ) => createLevelControlToolbar( singleUnit ) ) }
								/>
							) }
						</div>
					) }
				</div>
			</div>
		),
		onChange && ! onControl && (
			<Fragment>
				<p className="kt-measurement-label">{ label }</p>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ firstIcon }
					value={ ( measurement ? measurement[ 0 ] : '' ) }
					onChange={ ( value ) => onChange( [ value, ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ secondIcon }
					value={ ( measurement ? measurement[ 1 ] : '' ) }
					onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), value, ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ thirdIcon }
					value={ ( measurement ? measurement[ 2 ] : '' ) }
					onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), value, ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ fourthIcon }
					value={ ( measurement ? measurement[ 3 ] : '' ) }
					onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), value ] ) }
					min={ min }
					max={ max }
					step={ step }
				/>
			</Fragment>
		),
	];
}
