/**
 * Wordpress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import { AdvancedSelectInput } from "./advanced-select-input";

const editIcon = <svg viewBox="0 0 18 18" fill="none"><path d="M2.25 12.9374V15.7499H5.0625L13.3575 7.45492L10.545 4.64242L2.25 12.9374ZM15.5325 5.27992C15.825 4.98742 15.825 4.51492 15.5325 4.22242L13.7775 2.46742C13.485 2.17492 13.0125 2.17492 12.72 2.46742L11.3475 3.83992L14.16 6.65242L15.5325 5.27992Z" fill="currentColor"/></svg>
const deleteIcon = <svg viewBox="0 0 18 18" fill="none"><path d="M4.5 14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25H4.5V14.25ZM6 6.75H12V14.25H6V6.75ZM11.625 3L10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3H11.625Z" fill="currentColor"/></svg>
const sparklesIcon = <svg viewBox="0 0 18 16" fill="none"><path d="M6.99984 10.1458L8.04315 7.87665L10.3123 6.83333L8.04315 5.79002L6.99984 3.52083L5.95653 5.79002L3.68734 6.83333L5.95653 7.87665L6.99984 10.1458ZM6.99984 13.1667L5.02067 8.8125L0.666504 6.83333L5.02067 4.85417L6.99984 0.5L8.979 4.85417L13.3332 6.83333L8.979 8.8125L6.99984 13.1667ZM14.1665 15.5L13.1873 13.3125L10.9998 12.3333L13.1873 11.3333L14.1665 9.16667L15.1665 11.3333L17.3332 12.3333L15.1665 13.3125L14.1665 15.5Z" fill="currentColor"/></svg>

export const AdvancedSelectOption = ({ option, onOptionSelect, isActive, doNotClose, updateRecord, deleteRecord }) => {
	const [action, setAction] = useState('default');

	useEffect(() => {
		doNotClose(action !== 'default');
	}, [action]);

	const updateAction = (actionName) => (e) => {
		e.stopPropagation();
		setAction(actionName);
	}

	function onUpdate(newName) {
		// option.label = newName || option.label;
		updateRecord(newName || option.label, option.value);
		setAction('default');
	}

	function onDelete(event) {
		event.stopPropagation();
		deleteRecord(option.value);
		setAction('default');
	}

	return (
		<div
			className={`advanced-select-menu__option-item${isActive ? ' is-active' : ''}${option.useActions ? ' use-actions' : ''}`}
		>
			{ action !== 'edit' && (
				<div className="advanced-select-menu__option-item__label" onClick={ (_e) => onOptionSelect(option) }>
					{ option.value === 'aiGenerated' && <Icon icon={sparklesIcon} size={17} />}
					{ option.label }
				</div>
			)}

			{ action === 'default' && option.useActions && (
				<div className="advanced-select-menu__option-item__actions is-icons">
					<Icon icon={editIcon} size={17} onClick={ updateAction('edit')} />
					<Icon icon={deleteIcon} size={17} onClick={ updateAction('delete')}  />
				</div>
			) }
			{ action === 'edit' && (
				<AdvancedSelectInput
					onComplete={ onUpdate }
					onCancel={ updateAction('default') }
				/>
			) }
			{ action === 'delete' && (
				<div className="advanced-select-menu__option-item__actions is-delete">
					<Button size="small" variant="link" onClick={ updateAction('default')}>Cancel</Button>
					<Button size="small" isDestructive onClick={ onDelete }>Delete Collection</Button>
				</div>
			) }
		</div>
	)
}
