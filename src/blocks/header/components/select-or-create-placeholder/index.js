/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, SelectControl } from '@wordpress/components';
import { headerBlockIcon } from '@kadence/icons';

export default function SelectOrCreatePlaceholder({
	onSelect,
	isSelecting,
	onAdd,
	isAdding,
	postType = 'post',
	label = __('Post'),
	instructions = __('Select an existing header or create a new one.', 'kadence-blocks'),
	placeholder = __('Select Header', 'kadence-blocks'),
}) {
	const [selected, setSelected] = useState(0);
	const { posts } = useSelect(
		(selectData) => ({
			posts: selectData('core').getEntityRecords('postType', postType, {
				per_page: -1,
				orderby: 'title',
				order: 'asc',
			}),
		}),
		[postType]
	);
	const options = [
		{ label: placeholder, value: 0 },
		...(posts || []).map((post) => ({
			label: stripTags(post.title.rendered),
			value: post.id,
		})),
	];
	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		return (
			<Placeholder
				className="kb-select-or-create-placeholder"
				icon={headerBlockIcon}
				label={label}
				instructions={instructions}
			>
				<form className="kb-select-or-create-placeholder__actions">
					<SelectControl
						label={label}
						hideLabelFromVision
						options={options}
						onChange={setSelected}
						value={selected}
					/>
					<Button
						variant="primary"
						type="submit"
						disabled={!selected || isAdding}
						isBusy={isSelecting}
						onClick={() => onSelect(Number.parseInt(selected))}
					>
						{__('Select', 'kadence-blocks')}
					</Button>
				</form>
			</Placeholder>
		);
	}

	return (
		<Placeholder
			className="kb-select-or-create-placeholder"
			icon={headerBlockIcon}
			label={label}
			instructions={instructions}
		>
			<form className="kb-select-or-create-placeholder__actions">
				<SelectControl
					label={label}
					hideLabelFromVision
					options={options}
					onChange={setSelected}
					value={selected}
				/>
				<Button
					variant="primary"
					type="submit"
					disabled={!selected || isAdding}
					isBusy={isSelecting}
					onClick={() => onSelect(Number.parseInt(selected))}
				>
					{__('Select', 'kadence-blocks')}
				</Button>
				<Button variant="secondary" onClick={onAdd} disabled={isSelecting} isBusy={isAdding}>
					{__('Create New', 'kadence-blocks')}
				</Button>
			</form>
		</Placeholder>
	);
}

// From wp-sanitize.js
function stripTags(text) {
	text = text || '';

	// Do the replacement.
	const _text = text
		.replace(/<!--[\s\S]*?(-->|$)/g, '')
		.replace(/<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/gi, '')
		.replace(/<\/?[a-z][\s\S]*?(>|$)/gi, '');

	// If the initial text is not equal to the modified text,
	// do the search-replace again, until there is nothing to be replaced.
	if (_text !== text) {
		return stripTags(_text);
	}

	// Return the text with stripped tags.
	return _text;
}
