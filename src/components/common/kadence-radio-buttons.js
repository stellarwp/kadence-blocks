/**
 * Radio Buttons control.
 *
 */
const {
	Button,
	ButtonGroup,
} = wp.components;
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function KadenceRadioButtons( {
	label,
	value,
	onChange,
	options = [],
	...props
} ) {
	return (
		<div className="kadence-radio-buttons-wrap">
			<h2>{ label }</h2>
			<ButtonGroup className="kadence-radio-container-control">
				{ options.map( ( option, index ) =>
					<Button
						key={ `${ option.label }-${ option.value }-${ index }` }
						isTertiary={ value !== option.value }
						className={ 'kadence-radio-item radio-' + option.value }
						isPrimary={ value === option.value }
						aria-pressed={ value === option.value }
						onClick={ () => onChange( option.value ) }
					>
						{ option.label }
					</Button>
				) }
			</ButtonGroup>
		</div>
	);
}
