import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ButtonGroup, Icon } from '@wordpress/components';

import { Button } from '../.';

import './button-list.scss';

export function ButtonList({ items = [], selectedItems = [], onChange }) {
	const [allItems, setAllItems] = useState(items);

	useEffect(() => {
		setAllItems(items);
	}, [items]);

	function updateSelected(selectedItemValue) {
		const tempSelected = [...selectedItems];
		// Find the index of the item
		const index = tempSelected.indexOf(selectedItemValue);
		// Ensure the item exists in the array
		if (index !== -1) {
			// Remove the item from the array and store it in a variable
			tempSelected.splice(index, 1);
		} else {
			tempSelected.push(selectedItemValue);
		}

		onChange(tempSelected);
	}
	function updatePrimary(selectedItemValue) {
		const tempSelected = [...selectedItems];
		// Find the index of the item
		const index = tempSelected.indexOf(selectedItemValue);
		// Ensure the item exists in the array
		if (index !== -1) {
			// Remove the item from the array and store it in a variable
			const [item] = tempSelected.splice(index, 1);
			// Insert the item at the beginning of the array
			tempSelected.unshift(item);
			console.log(
				'return selected',
				allItems.filter((page) => tempSelected.includes(page.value))
			);
			onChange(tempSelected);
		}
	}
	return (
		<div className="ai-wizard-button-list">
			<ButtonGroup className="ai-wizard-button-list_wrapper">
				{allItems.map((item) => (
					<div className="ai-wizard-button-list_item_wrap">
						<Button
							className={`ai-wizard-button-list_item${
								selectedItems.includes(item.value) ? ' is-selected' : ''
							}`}
							onClick={(e) => updateSelected(item.value)}
						>
							<div className="ai-wizard-button-list_item-icon">
								<Icon icon={item.icon} />
							</div>
							<div className="ai-wizard-button-list_item-content">
								<div className="ai-wizard-button-list_item-title-area">
									<div className="ai-wizard-button-list_item-title">{item.label}</div>
								</div>
								{item.description && (
									<div className="ai-wizard-button-list_item-description">{item.description}</div>
								)}
							</div>
							<div className="ai-wizard-button-list_item-active">
								<Icon icon="saved" />
								{selectedItems.length > 1 && selectedItems[0] === item.value && (
									<div className="ai-wizard-button-list_item-primary">
										{__('Primary', 'kadence-starter-templates')}
									</div>
								)}
							</div>
						</Button>
						{selectedItems.includes(item.value) &&
							selectedItems.length > 1 &&
							selectedItems[0] !== item.value && (
								<Button
									className="ai-wizard-button-list_item-make-primary"
									onClick={(e) => updatePrimary(item.value)}
								>
									{__('Make Primary', 'kadence-starter-templates')}
								</Button>
							)}
					</div>
				))}
			</ButtonGroup>
		</div>
	);
}
