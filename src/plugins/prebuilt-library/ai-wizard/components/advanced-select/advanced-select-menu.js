/**
 * External dependencies
 */

/**
 * Wordpress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Icon, plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import { AdvancedSelectOption } from './advanced-select-option';
import { AdvancedSelectInput } from './advanced-select-input';


export const AdvancedSelectMenu = function (props) {
	const { width, options, onSelect, value, allowClose, createRecord, updateRecord, deleteRecord } = props;
	const [formattedOptions, setFormattedOptions] = useState([]);
	const [creating, setCreating] = useState(false);

	useEffect(() => {
		if(options && options.length > 0) {
			setFormattedOptions(
				options.reduce((acc, opt) => {
					if(!opt.options || opt.options.length === 0) {
						return acc;
					}
					return [...acc, opt];
				}, [])
			)
		}
	}, [options]);

	const toggleCreate = (bool) => (e) => {
		e.stopPropagation();
		setCreating(bool);
	}

	function onOptionSelect(option) {
		onSelect(option);
	}

	function finalizeRecord(recordName) {
		createRecord(recordName);
		setCreating(false);
	}

    return (
		<div className="stellarwp advanced-select-menu" style={{ width }}>

			{creating ? (
				<div className="advanced-select-menu__create-input">
					<AdvancedSelectInput
						onComplete={ finalizeRecord }
						onCancel={ toggleCreate(false) }
					/>
				</div>
			) : (
				<Button className="advanced-select-menu__create" onClick={ toggleCreate(true) }>
					{ __('Make My Own Collection', 'kadence-blocks') }
					<Icon icon={plus} size={20} />
				</Button>
			)}
			{ formattedOptions && formattedOptions.length > 0 && formattedOptions.map((opt) => (
				<div className="advanced-select-menu__option-wrapper" key={opt.label}>
					<div className="advanced-select-menu__option-category">{ opt.label }</div>
					{ opt.options.map((option) => (
						<AdvancedSelectOption
							key={option.value}
							option={ option }
							onOptionSelect={ onOptionSelect }
							isActive={ value === option.value }
							doNotClose={ (bool) => allowClose(!bool) }
							updateRecord={ updateRecord }
							deleteRecord={ deleteRecord }
						/>
					))}
				</div>
			))}
		</div>
    )
}
