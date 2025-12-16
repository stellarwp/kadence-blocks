/**
 * Measure Component
 *
 */

import PopColorControl from '../../pop-color-control';

/**
 * Import External
 */
import { map } from 'lodash';


/**
 * Import Css
 */
 import './editor.scss';
 
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useRef } from '@wordpress/element';
import {
	Button,
	ButtonGroup,
	Tooltip,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

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
export default function BorderColorControls( {
		label,
		swatchLabel = '',
		value,
		onChange,
		defaultColor = '',
		value2,
		swatchLabel2 = '',
		onChange2,
		defaultColor2 = '',
		value3,
		swatchLabel3 = '',
		onChange3,
		defaultColor3 = '',
		control,
		onControl,
		firstIcon = outlineTopIcon,
		secondIcon = outlineRightIcon,
		thirdIcon = outlineBottomIcon,
		fourthIcon = outlineLeftIcon,
		linkIcon = linkedIcon,
		unlinkIcon = individualIcon,
		className = '',
		reset = false,
	} ) {
	const measureIcons = {
		first: firstIcon,
		second: secondIcon,
		third: thirdIcon,
		fourth: fourthIcon,
		link: linkIcon,
		unlink: unlinkIcon,
	}
	const [ localControl, setLocalControl ] = useState( 'individual' );
	const realControl = control ? control : localControl;
	const realOnChangeControl = onControl ? onControl : setLocalControl;
	const containerRef = useRef();
	return (
		<div ref={ containerRef } className={ `components-base-control kb-border-color-control ${ '' !== className ? ' ' + className : '' }` }>
			<div className="kadence-title-bar">
				{ label && (
					<span className="kadence-control-title">{ label }</span>
				) }
				{ realOnChangeControl && (
					<div className="kadence-units kadence-locked">
						{ realControl !== 'individual' ? (
							<Tooltip text={ __( 'Individual', 'kadence-blocks' ) }>
								<Button
									className="is-single"
									isSmall
									onClick={ () => realOnChangeControl( 'individual' ) }
								>
									{ measureIcons.link }
								</Button>
							</Tooltip>
						) : (
							<Tooltip text={ __( 'Linked', 'kadence-blocks' ) }>
								<Button
									className="is-single"
									isSmall
									onClick={ () => realOnChangeControl( 'linked' ) }
								>
									{ measureIcons.unlink }
								</Button>
							</Tooltip>
						) }
					</div>
				) }
			</div>
			<div className="kadence-controls-content-border">
				{ realControl !== 'individual' && (
					<Fragment>
						<PopColorControl
							label={ measureIcons.link }
							swatchLabel={ swatchLabel ? swatchLabel : '' }
							value={ ( value && value[ 0 ] ? value[ 0 ] : '' ) }
							default={ defaultColor ? defaultColor : '' }
							onChange={ ( update ) => onChange( [ update, update, update, update ] ) }
							swatchLabel2={ swatchLabel2 ? swatchLabel2 : ''  }
							value2={ ( value2 && value2[ 0 ] ? value2[ 0 ] : '' ) }
							default2={ defaultColor2 ? defaultColor2 : '' }
							onChange2={ onChange2 ? update => onChange2( [ update, update, update, update ] ) : undefined }
							swatchLabel3={ swatchLabel3 ? swatchLabel3 : ''  }
							value3={ ( value3 && value3[ 0 ] ? value3[ 0 ] : '' ) }
							default3={ defaultColor3 ? defaultColor3 : '' }
							onChange3={ onChange3 ? update => onChange3( [ update, update, update, update ] ) : undefined }
						/>
					</Fragment>
				) }
				{ realControl === 'individual' && (
					<div className="kt-border-color-array-control">
						<PopColorControl
							label={ firstIcon }
							swatchLabel={ swatchLabel ? swatchLabel : '' }
							value={ ( value && value[ 0 ] ? value[ 0 ] : '' ) }
							default={ defaultColor ? defaultColor : '' }
							onChange={ ( update ) => onChange( [ update, value[ 1 ], value[ 2 ], value[ 3 ] ] ) }
							swatchLabel2={ swatchLabel2 ? swatchLabel2 : ''  }
							value2={ ( value2 && value2[ 0 ] ? value2[ 0 ] : '' ) }
							default2={ defaultColor2 ? defaultColor2 : '' }
							onChange2={ onChange2 ? update => onChange2( [ update, value2[ 1 ], value2[ 2 ], value2[ 3 ] ] ) : undefined }
							value3={ ( value3 && value3[ 0 ] ? value3[ 0 ] : '' ) }
							swatchLabel3={ swatchLabel3 ? swatchLabel3 : ''  }
							default3={ defaultColor3 ? defaultColor3 : '' }
							onChange3={ onChange3 ? update => onChange3( [ update, value3[ 1 ], value3[ 2 ], value3[ 3 ] ] ) : undefined }
						/>
						<PopColorControl
							label={ secondIcon }
							value={ ( value && value[ 1 ] ? value[ 1 ] : '' ) }
							swatchLabel={ swatchLabel ? swatchLabel : '' }
							default={ defaultColor ? defaultColor : '' }
							onChange={ ( update ) => onChange( [ value[ 0 ], update, value[ 2 ], value[ 3 ] ] ) }
							swatchLabel2={ swatchLabel2 ? swatchLabel2 : ''  }
							value2={ ( value2 && value2[ 1 ] ? value2[ 1 ] : '' ) }
							default2={ defaultColor2 ? defaultColor2 : '' }
							onChange2={ onChange2 ? update => onChange2( [ value2[ 0 ], update, value2[ 2 ], value2[ 3 ] ] ) : undefined }
							value3={ ( value3 && value3[ 1 ] ? value3[ 1 ] : '' ) }
							swatchLabel3={ swatchLabel3 ? swatchLabel3 : ''  }
							default3={ defaultColor3 ? defaultColor3 : '' }
							onChange3={ onChange3 ? update => onChange3( [ value3[ 0 ], update, value3[ 2 ], value3[ 3 ] ] ) : undefined }
						/>
						<PopColorControl
							label={ thirdIcon }
							value={ ( value && value[ 2 ] ? value[ 2 ] : '' ) }
							swatchLabel={ swatchLabel ? swatchLabel : '' }
							default={ defaultColor ? defaultColor : '' }
							onChange={ ( update ) => onChange( [ value[ 0 ], value[ 1 ], update, value[ 3 ] ] ) }
							value2={ ( value2 && value2[ 2 ] ? value2[ 2 ] : '' ) }
							swatchLabel2={ swatchLabel2 ? swatchLabel2 : ''  }
							default2={ defaultColor2 ? defaultColor2 : '' }
							onChange2={ onChange2 ? update => onChange2( [ value2[ 0 ], value2[ 1 ], update, value2[ 3 ] ] ) : undefined }
							value3={ ( value3 && value3[ 2 ] ? value3[ 2 ] : '' ) }
							swatchLabel3={ swatchLabel3 ? swatchLabel3 : ''  }
							default3={ defaultColor3 ? defaultColor3 : '' }
							onChange3={ onChange3 ? update => onChange3( [ value3[ 0 ], value3[ 1 ], update, value3[ 3 ] ] ) : undefined }
						/>
						<PopColorControl
							label={ fourthIcon }
							value={ ( value && value[ 3 ] ? value[ 3 ] : '' ) }
							swatchLabel={ swatchLabel ? swatchLabel : '' }
							default={ defaultColor ? defaultColor : '' }
							onChange={ ( update ) => onChange( [ value[ 0 ], value[ 1 ], value[ 2 ], update ] ) }
							value2={ ( value2 && value2[ 3 ] ? value2[ 3 ] : '' ) }
							swatchLabel2={ swatchLabel2 ? swatchLabel2 : ''  }
							default2={ defaultColor2 ? defaultColor2 : '' }
							onChange2={ onChange2 ? update => onChange2( [ value2[ 0 ], value2[ 1 ], value2[ 2 ], update ] ) : undefined }
							value3={ ( value3 && value3[ 3 ] ? value3[ 3 ] : '' ) }
							swatchLabel3={ swatchLabel3 ? swatchLabel3 : ''  }
							default3={ defaultColor3 ? defaultColor3 : '' }
							onChange3={ onChange3 ? update => onChange3( [ value3[ 0 ], value3[ 1 ], value3[ 2 ], update ] ) : undefined }
						/>
					</div>
				) }
			</div>
		</div>
	);
}
