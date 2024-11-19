import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import HeaderRender from './render';

const HeaderExisting = ({ data, onChange, handleNextStep }) => {
	// Require a selection
	useEffect(() => {
		if (data.meta.isValid && !data.headerExisting) {
			onChange({ ...data, meta: { ...data.meta, isValid: false } });
		} else if (data.headerExisting && data.headerExisting !== '') {
			if (data.headerExisting !== undefined && data.headerExisting !== 'blank') {
				onChange({
					...data,
					meta: { ...data.meta, isValid: true, exitAndCallbackStep: 0 },
				});
			} else if (data.headerExisting === 'blank' && !data.meta.isValid) {
				onChange({
					...data,
					meta: { ...data.meta, isValid: true, exitAndCallbackStep: false },
				});
			}
		}
	}, [data]);

	const { posts } = useSelect(
		(selectData) => ({
			posts: selectData('core').getEntityRecords('postType', 'kadence_header', {
				per_page: -1,
				orderby: 'title',
				order: 'asc',
			}),
		}),
		[]
	);

	const options = [
		...(posts || []).map((post) => ({
			label: stripTags(post.title.rendered),
			value: post.id,
		})),
	];

	return (
		<div className={'body'}>
			<div className="width-l">
				<h1>{__('Header Selection', 'kadence-blocks')}</h1>
				<p>{__('Select an existing header or create a new one.', 'kadence-blocks')}</p>

				<div className="options">
					<div
						className={'option blank' + (data.headerExisting === 'blank' ? ' is-selected' : '')}
						onClick={() => {
							onChange({ headerExisting: 'blank' });
							handleNextStep();
						}}
					>
						<Button>{__('Create new header.', 'kadence-blocks')}</Button>
					</div>

					{Object.keys(options).map((key) => (
						<div key={key} className={'option'}>
							<div
								className={
									'option-image' + (data.headerExisting === options[key].value ? ' is-selected' : '')
								}
								onClick={() => {
									onChange({ headerExisting: options[key].value });
								}}
								style={{ padding: '20px' }}
							>
								<HeaderRender id={options[key].value} />
							</div>
							<span>{options[key].label}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HeaderExisting;

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
