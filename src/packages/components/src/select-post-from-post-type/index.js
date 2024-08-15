/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

export default function SelectPostFromPostType(props) {
	const { label, onChange, value, postType = 'post', hideLabelFromVision = false, overrideLabel = null } = props;
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
		...(posts || []).map((post) => ({
			label: ( overrideLabel !== null && value === post.id ) ? overrideLabel : stripTags(post.title.raw),
			value: post.id,
		})),
	];
	const hasSelected = value && options.some((option) => option.value === value);
	if (!hasSelected && value) {
		options.push({
			label: overrideLabel !== null ? overrideLabel : __('Unknown Selection', 'kadence-blocks'),
			value,
		});
	}
	return (
		<SelectControl
			label={label}
			options={options}
			onChange={onChange}
			value={value}
			hideLabelFromVision={hideLabelFromVision}
		/>
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
