/**
 * Wordpress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Button } from '../button';


 export const AdvancedSelectInput = ({ onComplete, onCancel }) => {
	const [value, setValue] = useState(null);

	function doNothing(event) {
		event.stopPropagation();
	}

	function onKeyDown(event) {
		event.stopPropagation();
		if (event.key === 'Enter') {
			onComplete(value);
		}
	};

	function saveName(event) {
		event.stopPropagation();
		onComplete(value)
	}

	return (
		<div className="advanced-select-menu__input">
			<input
				className="advanced-select-menu__input-item"
				onChange={ (elem) => setValue(elem.target.value)}
				onKeyDown={onKeyDown}
				placeholder="Rename this collection"
				autoFocus
				onClick={ doNothing }
			/>
			<div className="advanced-select-menu__option-item__actions is-edit">
				<Button size="small" variant="link" onClick={ onCancel }>Cancel</Button>
				<Button size="small" variant="primary" onClick={ saveName }>Save</Button>
			</div>
		</div>
	)
}
