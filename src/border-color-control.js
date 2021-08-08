/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';
import AdvancedPopColorControl from './advanced-pop-color-control';
/**
 * Import External
 */
import map from 'lodash/map';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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
export default function BorderColorControls( {
	label,
	values,
	control,
	onChange,
	onControl,
	colorDefault = '',
	controlTypes = [
		{ key: 'linked', name: __( 'Linked' ), icon: icons.linked },
		{ key: 'individual', name: __( 'Individual' ), icon: icons.individual },
	],
	firstIcon = icons.outlinetop,
	secondIcon = icons.outlineright,
	thirdIcon = icons.outlinebottom,
	fourthIcon = icons.outlineleft,
} ) {
	return [
		onChange && onControl && (
			<Fragment>
				<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Color Control Type' ) }>
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
					<Fragment>
						<p className="kt-setting-label">{ label }</p>
						<AdvancedPopColorControl
							label={ icons.linked }
							colorValue={ ( values && values[ 0 ] ? values[ 0 ] : '' ) }
							colorDefault={ colorDefault }
							onColorChange={ ( value ) => onChange( [ value, value, value, value ] ) }
						/>
					</Fragment>
				) }
				{ control && control === 'individual' && (
					<div className="kt-border-color-array-control">
						<p className="kt-setting-label">{ label }</p>
						<AdvancedPopColorControl
							label={ firstIcon }
							colorValue={ ( values && values[ 0 ] ? values[ 0 ] : '' ) }
							colorDefault={ colorDefault }
							onColorChange={ ( value ) => onChange( [ value, values[ 1 ], values[ 2 ], values[ 3 ] ] ) }
						/>
						<AdvancedPopColorControl
							label={ secondIcon }
							colorValue={ ( values && values[ 0 ] ? values[ 0 ] : '' ) }
							colorDefault={ colorDefault }
							onColorChange={ ( value ) => onChange( [ values[ 0 ], value, values[ 2 ], values[ 3 ] ] ) }
						/>
						<AdvancedPopColorControl
							label={ thirdIcon }
							colorValue={ ( values && values[ 0 ] ? values[ 0 ] : '' ) }
							colorDefault={ colorDefault }
							onColorChange={ ( value ) => onChange( [ values[ 0 ], values[ 1 ], value, values[ 3 ] ] ) }
						/>
						<AdvancedPopColorControl
							label={ fourthIcon }
							colorValue={ ( values && values[ 0 ] ? values[ 0 ] : '' ) }
							colorDefault={ colorDefault }
							onColorChange={ ( value ) => onChange( [ values[ 0 ], values[ 1 ], values[ 2 ], value ] ) }
						/>
					</div>
				) }
			</Fragment>
		),
	];
}
