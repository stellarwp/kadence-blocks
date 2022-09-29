/**
 * Measure Component
 *
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Import External
 */
import { isEqual } from 'lodash';
import MeasurementSingleControl from '../single-input-control';
import RangeControl from '../../range/range-control';
import { undo } from '@wordpress/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import {
	Button,
	DropdownMenu,
	Tooltip,
} from '@wordpress/components';

import {
	outlineTopIcon,
	outlineRightIcon,
	outlineBottomIcon,
	outlineLeftIcon,
	pxIcon,
	emIcon,
	remIcon,
	vhIcon,
	vwIcon,
	percentIcon,
	individualIcon,
	linkedIcon,
	topLeftIcon,
	topRightIcon,
	bottomRightIcon,
	bottomLeftIcon,
	radiusLinkedIcon,
	radiusIndividualIcon
} from '@kadence/icons';

let icons = {
	px: pxIcon,
	em: emIcon,
	rem: remIcon,
	vh: vhIcon,
	vw: vwIcon,
	percent: percentIcon,
};

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function MeasurementControls( {
	label,
	measurement,
	control = 'individual',
	onChange,
	onControl = false,
	step = 1,
	max = 100,
	min = 0,
	firstIcon = outlineTopIcon,
	secondIcon = outlineRightIcon,
	thirdIcon = outlineBottomIcon,
	fourthIcon = outlineLeftIcon,
	linkIcon = linkedIcon,
	unlinkIcon = individualIcon,
	isBorderRadius = false,
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
	const measureIcons = {
		first: isBorderRadius ? topLeftIcon : firstIcon,
		second: isBorderRadius ? topRightIcon : secondIcon,
		third: isBorderRadius ? bottomRightIcon : thirdIcon,
		fourth: isBorderRadius ? bottomLeftIcon : fourthIcon,
		link: isBorderRadius ? radiusLinkedIcon : linkIcon,
		unlink: isBorderRadius ? radiusIndividualIcon : unlinkIcon,
	}
	const zero = ( allowEmpty ? '' : 0 );
	const [ localControl, setLocalControl ] = useState( control );

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
	const onReset = () => {
		if ( typeof reset === 'function' ){
			reset();
		} else {
			onChange( [ '', '', '', '' ] );
		}
	}
	return (
		<>
			{ onChange && (
				<div key={ key } className={ `components-base-control kb-measure-control ${ measureIcons.first !== outlineTopIcon ? 'kb-measure-corners-control' : 'kb-measure-sides-control' }${ '' !== className ? ' ' + className : '' }` }>
					{ label && (
						<div className="kadence-title-bar">
							{ reset && (
								<Button
									className="is-reset is-single"
									isSmall
									disabled={ ( ( isEqual( [ '', '', '', '' ], measurement ) || isEqual( [ '', 'auto', '', 'auto' ], measurement ) ) ? true : false ) }
									icon={ undo }
									onClick={ () => onReset() }
								></Button>
							) }
							<span className="kadence-control-title">{ label }</span>
						</div>
					) }
					<div className="kadence-controls-content">
						{ localControl !== 'individual' && (
							<RangeControl
								value={ ( measurement ? measurement[ 0 ] : '' ) }
								onChange={ ( value ) => onChange( [ value, value, value, value ] ) }
								min={ min }
								max={ max }
								step={ step }
							/>
						) }
						{ localControl === 'individual' && (
							<Fragment>
								<MeasurementSingleControl
									placement="top"
									label={ __( 'Top', 'kadence-blocks' ) }
									measurement={ ( measurement ? measurement[ 0 ] : '' ) }
									onChange={ ( value ) => onChange( [ ( value ? Number( value ) : value ), ( measurement && undefined !== measurement[ 1 ] && '' !== measurement[ 1 ] ? measurement[ 1 ] : zero ), ( measurement && undefined !== measurement[ 2 ] && '' !== measurement[ 2 ] ? measurement[ 2 ] : zero ), ( measurement && undefined !== measurement[ 3 ] && '' !== measurement[ 3 ] ? measurement[ 3 ] : zero ) ] ) }
									min={ min }
									max={ max }
									step={ step }
									icon={ measureIcons.first }
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
									icon={ measureIcons.second }
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
									icon={ measureIcons.third }
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
									icon={ measureIcons.fourth }
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
						{ localControl && (
							<div className="kadence-units kadence-locked">
								{ localControl !== 'individual' ? (
									<Tooltip text={ __( 'Individual', 'kadence-blocks' ) }>
										<Button
											className="is-single"
											isSmall
											onClick={ () => setLocalControl( 'individual' ) }
										>
											{ measureIcons.link }
										</Button>
									</Tooltip>
								) : (
									<Tooltip text={ __( 'Linked', 'kadence-blocks' ) }>
										<Button
											className="is-single"
											isSmall
											onClick={ () => setLocalControl( 'linked' ) }
										>
											{ measureIcons.unlink }
										</Button>
									</Tooltip>
								) }
							</div>
						) }
					</div>
				</div>
			) }
		</>
	);
}
