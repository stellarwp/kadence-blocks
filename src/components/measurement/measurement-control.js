/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './../../icons';

/**
 * Import Css
 */
import './../../editor-components.scss';

/**
 * Import External
 */
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import KadenceRange from './../range/range-control';
import MeasurementSingleControl from './single-input-control';
import { undo } from '@wordpress/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Fragment,
} = wp.element;
const {
	Button,
	DropdownMenu,
	TextControl,
	ToolbarGroup,
	ButtonGroup,
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
	firstIcon = icons.outlinetop,
	secondIcon = icons.outlineright,
	thirdIcon = icons.outlinebottom,
	fourthIcon = icons.outlineleft,
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
	allowEmpty = false,
	key,
	className = '',
	reset,
	preset = '',
} ) {
	const zero = ( allowEmpty ? '' : 0 );
	/**
	 * Build Toolbar Items.
	 *
	 * @param {string} mappedUnit the unit.
	 * @returns {array} the unit array.
	 */
	const createLevelControlToolbar = ( mappedUnit ) => {
		return [ {
			icon: ( mappedUnit === '%' ? icons.percent : icons[ mappedUnit ] ),
			isActive: unit === mappedUnit,
			onClick: () => {
				onUnit( mappedUnit );
			},
		} ];
	};
	const POPOVER_PROPS = {
		className: 'kadence-units-popover',
	};
	return [
		onChange && onControl && (
			<div key={ key } className={ `components-base-control kb-measure-control ${ firstIcon !== icons.outlinetop ? 'kb-measure-corners-control' : 'kb-measure-sides-control' }${ '' !== className ? ' ' + className : '' }` }>
				{ label && (
					<div className="kadence-title-bar">
						{ reset && (
							<Button
								className="is-reset is-single"
								isSmall
								disabled={ ( ( isEqual( [ '', '', '', '' ], measurement ) || isEqual( [ '', 'auto', '', 'auto' ], measurement ) ) ? true : false ) }
								icon={ undo }
								onClick={ () => reset() }
							></Button>
						) }
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
							<MeasurementSingleControl
								placement="top"
								label={ __( 'Top', 'kadence-blocks' ) }
								measurement={ ( measurement ? measurement[ 0 ] : '' ) }
								onChange={ ( value ) => onChange( [ ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
								min={ min }
								max={ max }
								step={ step }
								icon={ firstIcon }
								unit={ unit }
								allowEmpty={ allowEmpty }
								preset={ preset }
							/>
							<MeasurementSingleControl
								placement="right"
								label={ __( 'Right', 'kadence-blocks' ) }
								measurement={ ( measurement ? measurement[ 1 ] : '' ) }
								onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
								min={ min }
								max={ max }
								step={ step }
								icon={ secondIcon }
								unit={ unit }
								allowEmpty={ allowEmpty }
								preset={ preset }
							/>
							<MeasurementSingleControl
								placement="bottom"
								label={ __( 'Bottom', 'kadence-blocks' ) }
								measurement={ ( measurement ? measurement[ 2 ] : '' ) }
								onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
								min={ min }
								max={ max }
								step={ step }
								icon={ thirdIcon }
								unit={ unit }
								allowEmpty={ allowEmpty }
								preset={ preset }
							/>
							<MeasurementSingleControl
								placement="left"
								label={ __( 'Left', 'kadence-blocks' ) }
								measurement={ ( measurement ? measurement[ 3 ] : '' ) }
								onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( value ? Number( value ) : value ) ] ) }
								min={ min }
								max={ max }
								step={ step }
								icon={ fourthIcon }
								unit={ unit }
								allowEmpty={ allowEmpty }
								preset={ preset }
							/>
						</Fragment>
					) }
					{ ( onUnit || showUnit ) && (
						<div className="kadence-units">
							{ units.length === 1 ? (
								<Button
									className="is-active is-single"
									isSmall
									disabled
								>{ ( '%' === unit ? icons.percent : icons[ unit ] ) }</Button>
							) : (
								<DropdownMenu
									icon={ ( '%' === unit ? icons.percent : icons[ unit ] ) }
									label={ __( 'Select a Unit', 'kadence-blocks' ) }
									controls={ units.map( ( singleUnit ) => createLevelControlToolbar( singleUnit ) ) }
									className={ 'kadence-units-group' }
									popoverProps={ POPOVER_PROPS }
								/>
							) }
						</div>
					) }
					<div className="kadence-units kadence-locked">
						{ control && control !== 'individual' ? (
							<Tooltip text={ __( 'Individual', 'kadence-blocks' ) }>
								<Button
									className="is-single"
									isSmall
									onClick={ () => onControl( 'individual' ) }
								>
									{ icons.linked }
								</Button>
							</Tooltip>
						) : (
							<Tooltip text={ __( 'Linked', 'kadence-blocks' ) }>
								<Button
									className="is-single"
									isSmall
									onClick={ () => onControl( 'linked' ) }
								>
									{ icons.individual }
								</Button>
							</Tooltip>
						) }
					</div>
				</div>
			</div>
		),
		onChange && ! onControl && (
			<div key={ key } className={ `components-base-control kb-measure-control ${ firstIcon !== icons.outlinetop ? 'kb-measure-corners-control' : 'kb-measure-sides-control' }${ '' !== className ? ' ' + className : '' }` }>
				{ label && (
					<div className="kadence-title-bar">
						{ reset && (
							<Button
								className="is-reset is-single"
								isSmall
								disabled={ ( ( isEqual( [ '', '', '', '' ], measurement ) || isEqual( [ '', 'auto', '', 'auto' ], measurement ) ) ? true : false ) }
								icon={ undo }
								onClick={ () => reset() }
							></Button>
						) }
						<span className="kadence-control-title">{ label }</span>
					</div>
				) }
				<div className="kadence-controls-content">
					<Fragment>
						<MeasurementSingleControl
							placement="top"
							label={ __( 'Top', 'kadence-blocks' ) }
							measurement={ ( measurement ? measurement[ 0 ] : '' ) }
							onChange={ ( value ) => onChange( [ ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
							min={ min }
							max={ max }
							step={ step }
							icon={ firstIcon }
							unit={ unit }
							allowEmpty={ allowEmpty }
							preset={ preset }
						/>
						<MeasurementSingleControl
							placement="right"
							label={ __( 'Right', 'kadence-blocks' ) }
							measurement={ ( measurement ? measurement[ 1 ] : '' ) }
							onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
							min={ min }
							max={ max }
							step={ step }
							icon={ secondIcon }
							unit={ unit }
							allowEmpty={ allowEmpty }
							preset={ preset }
						/>
						<MeasurementSingleControl
							placement="bottom"
							label={ __( 'Bottom', 'kadence-blocks' ) }
							measurement={ ( measurement ? measurement[ 2 ] : '' ) }
							onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
							min={ min }
							max={ max }
							step={ step }
							icon={ thirdIcon }
							unit={ unit }
							allowEmpty={ allowEmpty }
							preset={ preset }
						/>
						<MeasurementSingleControl
							placement="left"
							label={ __( 'Left', 'kadence-blocks' ) }
							measurement={ ( measurement ? measurement[ 3 ] : '' ) }
							onChange={ ( value ) => onChange( [ ( measurement && undefined !== measurement[ 0 ] && '' !== measurement[ 0 ] ? measurement[ 0 ] : zero ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( value ? Number( value ) : value ) ] ) }
							min={ min }
							max={ max }
							step={ step }
							icon={ fourthIcon }
							unit={ unit }
							allowEmpty={ allowEmpty }
							preset={ preset }
						/>
					</Fragment>
					{ ( onUnit || showUnit ) && (
						<div className="kadence-units">
							{ units.length === 1 ? (
								<Button
									className="is-active is-single"
									isSmall
									disabled
								>{ ( '%' === unit ? icons.percent : icons[ unit ] ) }</Button>
							) : (
								<DropdownMenu
									icon={ ( '%' === unit ? icons.percent : icons[ unit ] ) }
									label={ __( 'Select a Unit', 'kadence-blocks' ) }
									controls={ units.map( ( singleUnit ) => createLevelControlToolbar( singleUnit ) ) }
									className={ 'kadence-units-group' }
									popoverProps={ POPOVER_PROPS }
								/>
							) }
						</div>
					) }
				</div>
			</div>
		),
	];
}
