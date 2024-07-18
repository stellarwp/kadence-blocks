/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, SelectControl } from '@wordpress/components';
import { heading } from '@wordpress/icons';
import Select from 'react-select';

export default function SelectOrCreatePlaceholder({
	onSelect,
	isSelecting,
	onAdd,
	isAdding,
	onAddOtherType,
	postType = 'post',
	label = __('Post'),
	instructions = __('Select an existing navigation or create a new one.', 'kadence-blocks'),
	placeholder = __('Select Navigation', 'kadence-blocks'),
}) {
	const [selected, setSelected] = useState(0);
	const { posts, menus } = useSelect(
		(selectData) => ({
			posts: selectData('core').getEntityRecords('postType', postType, {
				per_page: -1,
				orderby: 'title',
				order: 'asc',
			}),
			menus: selectData('core').getEntityRecords('taxonomy', 'nav_menu', {
				order: 'asc',
				orderby: 'name',
			}),
		}),
		[postType]
	);

	console.log('menus');
	console.log(menus);

	const options = [
		...(posts || []).map((post) => ({
			label: stripTags(post.title.rendered),
			value: post.id,
			type: postType,
		})),
	];

	const menuOptions = [
		...(menus || []).map((post) => ({
			label: stripTags(post.name),
			value: post.id,
			type: 'nav_menu',
		})),
	];

	const allOptions = [...options, ...menuOptions];

	const groupedOptions = [
		{
			label: __('Kadence Navigations', 'kadence-blocks'),
			options,
		},
		{
			label: __('WordPress Menus', 'kadence-blocks'),
			options: menuOptions,
		},
	];

	const groupStyles = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	};
	const groupBadgeStyles = {
		backgroundColor: '#EBECF0',
		borderRadius: '2em',
		color: '#172B4D',
		display: 'inline-block',
		fontSize: 12,
		fontWeight: 'normal',
		lineHeight: '1',
		minWidth: 1,
		padding: '0.16666666666667em 0.5em',
		textAlign: 'center',
	};

	const formatGroupLabel = (GroupedOption) => (
		<div style={groupStyles}>
			<span style={{ fontSize: 12 }}>{GroupedOption.label}</span>
			<span style={groupBadgeStyles}>{GroupedOption.options.length}</span>
		</div>
	);

	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		return (
			<Placeholder
				className="kb-select-or-create-placeholder"
				icon={heading}
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
			icon={heading}
			label={label}
			instructions={instructions}
		>
			<form className="kb-select-or-create-placeholder__actions">
				<Select
					styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
					menuPortalTarget={document.body}
					value={undefined !== selected?.id ? allOptions.filter(({ value }) => value === selected.id) : ''}
					options={groupedOptions}
					onChange={(val) => {
						setSelected({ ...val, id: val.value });
					}}
					formatGroupLabel={formatGroupLabel}
				/>
				<Button
					style={{ marginTop: '20px' }}
					variant="primary"
					type="submit"
					disabled={!selected || isAdding}
					isBusy={isSelecting}
					onClick={() => {
						if (selected.type === 'kadence_navigation') {
							onSelect(Number.parseInt(selected.id));
						} else {
							onAddOtherType(selected);
						}
					}}
				>
					{selected.type === 'kadence_navigation'
						? __('Select', 'kadence-blocks')
						: __('Import', 'kadence-blocks')}
				</Button>
				<Button variant="secondary" onClick={onAdd} disabled={isSelecting} isBusy={isAdding}>
					{__('Create New', 'kadence-blocks')}
				</Button>
			</form>
		</Placeholder>
	);
}

// const otherCardSource = get( window, [ 'kb_navigation_import_core' ], false );

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
