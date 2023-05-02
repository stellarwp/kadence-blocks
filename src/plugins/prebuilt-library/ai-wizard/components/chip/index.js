/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button as CoreButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './chip.scss';

/**
 * @param {object} props
 * @param {function} props.onDelete Event handler for delete button click
 * @param {string} props.text Chip text
 *
 * @return {ReactNode}
 */
export function Chip(props) {
	const {
		onDelete,
		text
	} = props;

	const classes = classnames('stellarwp', 'chip', {
		'has-icon': onDelete
	});

	function handleDeleteClick(event) {
		if (onDelete) {
			onDelete(event);
		}
	}

	let deleteButton = null;
	if (onDelete) {
		deleteButton = <CoreButton
			icon="no-alt"
			label={ __('Delete Selection', 'kadence')}
			isSmall
			onClick={ handleDeleteClick }
		/>;
	}

	return (
		<div className={ classes }>
			{ text && <span>{ text }</span> }
			{ deleteButton }
		</div>
	);
}

