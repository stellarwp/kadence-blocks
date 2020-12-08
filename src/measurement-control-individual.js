/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';

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
	Tooltip,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function MeasurementIndividualControls( {
	label,
	top,
	bottom,
	left,
	right,
	control,
	onChangeTop,
	onChangeBottom,
	onChangeLeft,
	onChangeRight,
	onControl,
	step = 1,
	max = 100,
	min = 0,
	controlTypes = [
		{ key: 'linked', name: __( 'Linked' ), icon: icons.linked },
		{ key: 'individual', name: __( 'Individual' ), icon: icons.individual },
	],
	firstIcon = icons.outlinetop,
	secondIcon = icons.outlineright,
	thirdIcon = icons.outlinebottom,
	fourthIcon = icons.outlineleft,
	allowEmpty = false,
} ) {
	const zero = ( allowEmpty ? '' : 0 );
	return [
		onControl && (
			<Fragment>
				<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Measurement Control Type' ) }>
					{ map( controlTypes, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-size-btn"
								isSmall
								isPrimary={ control === key }
								aria-pressed={ control === key }
								onClick={ () => onControl( key ) }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
				{ control && control !== 'individual' && (
					<KadenceRange
						label={ label }
						value={ ( undefined !== top ? top : '' ) }
						onChange={ ( value ) => {
							onChangeTop( value );
							onChangeRight( value );
							onChangeBottom( value );
							onChangeLeft( value );
						} }
						min={ min }
						max={ max }
						step={ step }
					/>
				) }
				{ control && control === 'individual' && (
					<Fragment>
						<p>{ label }</p>
						<KadenceRange
							className="kt-icon-rangecontrol"
							beforeIcon={ firstIcon }
							value={ ( undefined !== top ? top : '' ) }
							onChange={ ( value ) => onChangeTop( value ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						<KadenceRange
							className="kt-icon-rangecontrol"
							beforeIcon={ secondIcon }
							value={ ( undefined !== right ? right : '' ) }
							onChange={ ( value ) => onChangeRight( value ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						<KadenceRange
							className="kt-icon-rangecontrol"
							beforeIcon={ thirdIcon }
							value={ ( undefined !== bottom ? bottom : '' ) }
							onChange={ ( value ) => onChangeBottom( value ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						<KadenceRange
							className="kt-icon-rangecontrol"
							beforeIcon={ fourthIcon }
							value={ ( undefined !== left ? left : '' ) }
							onChange={ ( value ) => onChangeLeft( value ) }
							min={ min }
							max={ max }
							step={ step }
						/>
					</Fragment>
				) }
			</Fragment>
		),
		! onControl && (
			<Fragment>
				<p className="kt-measurement-label">{ label }</p>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ firstIcon }
					value={ ( undefined !== top ? top : '' ) }
					onChange={ ( value ) => onChangeTop( value ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ secondIcon }
					value={ ( undefined !== right ? right : '' ) }
					onChange={ ( value ) => onChangeRight( value ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ thirdIcon }
					value={ ( undefined !== bottom ? bottom : '' ) }
					onChange={ ( value ) => onChangeBottom( value ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<KadenceRange
					className="kt-icon-rangecontrol"
					beforeIcon={ fourthIcon }
					value={ ( undefined !== left ? left : '' ) }
					onChange={ ( value ) => onChangeLeft( value ) }
					min={ min }
					max={ max }
					step={ step }
				/>
			</Fragment>
		),
	];
}
