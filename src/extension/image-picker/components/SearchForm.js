import { __experimentalInputControl as InputControl, Button } from '@wordpress/components';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ENTER } from '@wordpress/keycodes';
import { chevronRightSmall, close } from '@wordpress/icons';
/**
 * Render the search form as a component.
 *
 * @return {JSX.Element} The SearchForm component.
 */
export default function SearchForm(props) {
	const { query, handleSearch, isSearching } = props;
	const [search, setSearch] = useState(query);
	return (
		<div className="kb-pexels-search">
			<InputControl
				label={__('Search', 'kadence-blocks')}
				placeholder={__('Search Images…', 'kadence-blocks')}
				hideLabelFromVision={true}
				value={search}
				onKeyDown={(event) => {
					if (event.keyCode === ENTER) {
						event.preventDefault();
						handleSearch(search ?? '');
					}
				}}
				onChange={(value) => setSearch(value ?? '')}
			/>
			<Button
				className="kb-pexels-search-send"
				text={__('Search', 'kadence-blocks')}
				icon={chevronRightSmall}
				disabled={!search}
				variant="primary"
				isBusy={isSearching}
				iconPosition="right"
				onClick={() => {
					handleSearch(search ?? '');
				}}
			/>
		</div>
	);
}
