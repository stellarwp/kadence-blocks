/**
 * Measure Single Component
 *
 */

/**
 * Import External
 */
import { map } from 'lodash';
import RangeControl from '../../range/range-control';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Popover,
	TextControl,
	ButtonGroup,
} from '@wordpress/components';

function useObservableState( initialState ) {
	const [ state, setState ] = useState( initialState );
	return [
		state,
		( value ) => {
			setState( value );
		},
	];
}
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function MeasurementSingleControl( {
		label,
		placement = 'top',
		measurement,
		onChange,
		step = 1,
		max = 100,
		min = 0,
		icon,
		unit = '',
		allowEmpty = false,
		className = '',
		preset = '',
	} ) {
	const zero = ( allowEmpty ? '' : 0 );
	const [ isOpen, setIsOpen ] = useObservableState( false );

	function toggle() {
		setIsOpen( ! isOpen );
	}
	function close() {
		setIsOpen( false );
	}
	const presetSizes = {
		px: [ 0, 10, 20, 40, 60, 80, 100, 140, 160, 200 ],
		em: [ 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5 ],
		rem: [ 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5 ],
		'%': [ 0, 2, 5, 8, 10, 20, 30, 40, 50, 60 ],
		vh: [ 0, 2, 5, 8, 10, 20, 30, 40, 50, 60 ],
		vw: [ 0, 2, 5, 8, 10, 20, 30, 40, 50, 60 ],
	};
	return (
		<div className={ `measure-input-wrap measure-input-${ placement }` }>
			<div
				className={ 'input-setting-toggle' }
			>
				<Button isSmall className={ 'input-setting-toggle-btn' } disabled={ ( measurement && 'auto' == measurement ? true : false ) } tabIndex="-1" onClick={ ( measurement && 'auto' == measurement ? '' : toggle ) }>
					{ label }
				</Button>
				{ isOpen && (
					<Popover
						onClose={ close }
						className={ 'kadence-range-popover-settings' }
					>
						<RangeControl
							beforeIcon={ icon }
							value={ ( undefined !== measurement ? measurement : '' ) }
							onChange={ ( value ) => onChange( ( value ? parseFloat( value ) : value ) ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						{ unit !== '' || ( preset && Array.isArray( preset ) && preset.length > 1 ) && (
						<ButtonGroup className="kb-preset-size-options" aria-label={ __( 'Choose a Preset Size', 'kadence-blocks' ) }>
							{ map( ( preset && Array.isArray( preset ) && preset.length > 1 ? preset : presetSizes[ unit ] ), ( size ) => (
								<Button
									key={ size }
									className="kb-preset-sizes"
									isSmall
									onClick={ () => onChange( parseFloat( size ) ) }
								>
									{ size }
								</Button>
							) ) }
						</ButtonGroup>
						) }
					</Popover>
				) }
			</div>
			<TextControl
				label={ label }
				hideLabelFromVision={ true }
				type="number"
				className="measure-inputs"
				disabled={ ( measurement && 'auto' == measurement ? true : false ) }
				placeholder={ ( measurement && 'auto' == measurement ? __( 'auto', 'kadence-blocks' ) : undefined ) }
				value={ ( undefined !== measurement ? measurement : '' ) }
				onChange={ ( value ) => onChange( ( value ? Number( value ) : value ) ) }
				min={ min }
				max={ max }
				step={ step }
			/>
			<span className="measure-label">{ icon }</span>
		</div>
	);
}
