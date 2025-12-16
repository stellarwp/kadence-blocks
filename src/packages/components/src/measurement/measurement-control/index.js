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
import { undo, settings, link, linkOff } from '@wordpress/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import {
	Button,
	DropdownMenu,
	ButtonGroup,
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
	linkIcon = link,
	unlinkIcon = linkOff,
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
	const liveValue = ( measurement ? measurement : [ '', '', '', '' ] );
	const zero = ( allowEmpty ? '' : 0 );
	const [ localControl, setLocalControl ] = useState( control );
	const realControl = onControl ? control : localControl;
	const realSetOnControl = onControl ? onControl : setLocalControl;
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
						<div className="kadence-component__header kadence-title-bar">
							{ label && (
								<div className="kadence-component__header__title kadence-measure-control__title">
									<label className="components-base-control__label">{ label }</label>
									{ reset && (
										<div className='title-reset-wrap'>
											<Button
												className="is-reset is-single"
												label='reset'
												isSmall
												disabled={ ( ( isEqual( [ '', '', '', '' ], liveValue ) || isEqual( [ '', 'auto', '', 'auto' ], liveValue ) ) ? true : false ) }
												icon={ undo }
												onClick={ () => onReset() }
											/>
										</div>
									) }
								</div>
							) }
							{ realSetOnControl && (
								<Button
									isSmall={ true }
									className={'kadence-radio-item kadence-control-toggle radio-custom is-single only-icon'}
									label={ realControl !== 'individual' ? __( 'Individual', 'kadence-blocks' ) : __( 'Linked', 'kadence-blocks' )  }
									icon={ realControl !== 'individual' ? linkIcon : unlinkIcon }
									onClick={ () => realSetOnControl( realControl !== 'individual' ? 'individual' : 'linked' ) }
									isPressed={ realControl !== 'individual' ? true : false }
									isTertiary={ realControl !== 'individual' ? false : true }
								/>
							) }
						</div>
					) }
					<div className="kadence-controls-content">
						{ realControl !== 'individual' && (
							<RangeControl
								value={ ( measurement ? measurement[ 0 ] : '' ) }
								onChange={ ( value ) => onChange( [ value, value, value, value ] ) }
								min={ min }
								max={ max }
								step={ step }
							/>
						) }
						{ realControl === 'individual' && (
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
							<div className={ 'kadence-measure-control-select-wrapper' }>
								<select
									className={ 'kadence-measure-control-select components-unit-control__select' }
									onChange={ ( event ) => {
										if ( onUnit ) {
											onUnit( event.target.value );
										}
									} }
									value={ unit }
								>
									{ units.map( ( option ) => (
										<option value={ option } selected={ unit === option ? true : undefined } key={ option }>
											{ option }
										</option>
									) ) }
								</select>
							</div>
						) }
					</div>
				</div>
			) }
		</>
	);
}
