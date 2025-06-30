/**
 * External dependencies
 */
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

/**
 * Wordpress dependencies
 */
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { search, chevronDown, closeSmall } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SEARCH_APP_ID, SEARCH_API_KEY, SEARCH_INDEX } from '../../constants';
import './autocomplete.scss';

const searchClient = algoliasearch(SEARCH_APP_ID, SEARCH_API_KEY);

export function Autocomplete(props) {
	const [autocompleteState, setAutocompleteState] = useState({});
	const [showCreate, setShowCreate] = useState(true);
	const [allowNewCreate, setAllowNewCreate] = useState(true);
	const [initialQuery, setInitialQuery] = useState('');

	const controlRef = useRef(null);
	const formRef = useRef(null);
	const inputRef = useRef(null);
	const panelRef = useRef(null);

	useEffect(() => {
		setAutocompleteState((previousState) => ({
			...previousState,
			query: props.currentValue,
		}));
	}, []);

	useEffect(() => {
		setInitialQuery(props.currentValue);
	}, [props.currentValue]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (controlRef.current && !controlRef.current.contains(event.target)) {
				autocomplete.setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [controlRef]);

	useEffect(() => {
		setShowCreate(isShowingCreate());
	}, [autocompleteState.query, autocompleteState.collections]);

	useEffect(() => {
		const pageElement = document.querySelector('.components-modal__frame.stellarwp');
		const pageRectangle = pageElement.getBoundingClientRect();
		const panelRectangle = panelRef.current.getBoundingClientRect();
		const panelPosition = panelRectangle.bottom + 180 > pageRectangle.bottom ? 'top' : 'bottom';

		if (!!autocompleteState.isOpen) {
			const panelSourceElement = document.querySelector('.aa-PanelWrapper');
			const panelSourceHeight = panelSourceElement.clientHeight;

			if (panelPosition === 'top') {
				panelSourceElement.style.top = `-${56 + panelSourceHeight}px`;
			}
		}
	}, [autocompleteState.isOpen]);

	function handleResetClick() {
		props.onSelect('');
		autocomplete.setQuery('');
		autocomplete.refresh();
		inputRef.current.focus();
		setAllowNewCreate(true);
	}

	function handleKeyDown() {
		setAllowNewCreate(true);
	}

	function handleItemCreate() {
		props.onSelect(autocompleteState.query);
		setAutocompleteState((previousState) => ({
			...previousState,
			isOpen: false,
		}));
		setAllowNewCreate(true);
		setShowCreate(false);
	}

	function isMatchingIndex() {
		const { collections, query } = autocompleteState;

		if (Array.isArray(collections) && Array.isArray(collections[0]?.items)) {
			const match = collections[0].items.filter((result) => result.name.toLowerCase() === query.toLowerCase());
			return match.length ? true : false;
		}

		return false;
	}

	function isShowingCreate() {
		const { query, collections } = autocompleteState;

		if (initialQuery !== '' && initialQuery === query) {
			return false;
		}

		if (!query || query.trim() === '') {
			return false;
		}

		const queryInCollection = isMatchingIndex();
		if (queryInCollection) {
			return false;
		}

		if (!allowNewCreate && query && collections?.[0]?.items && collections[0].items.length === 0) {
			return false;
		}

		return true;
	}

	const autocomplete = useMemo(
		() =>
			createAutocomplete({
				onStateChange({ state }) {
					setAutocompleteState(state);
				},
				getSources() {
					return [
						{
							sourceId: 'industries',
							getItemInputValue({ item }) {
								return item.query;
							},
							getItems({ query }) {
								return getAlgoliaResults({
									searchClient,
									queries: [
										{
											indexName: SEARCH_INDEX,
											query,
											params: {
												hitsPerPage: 8,
												highlightPreTag: '<mark>',
												highlightPostTag: '</mark>',
											},
										},
									],
								});
							},
							onSelect: (event) => {
								props.onSelect(event.item.name);
								event.setQuery(event.item.name);

								setAllowNewCreate(false);
							},
						},
					];
				},
				openOnFocus: false,
				...props,
			}),
		[]
	);

	return (
		<div ref={controlRef} className="stellarwp-autocomplete-control">
			{props.label ? <label className="components-input-control__label">{props.label}</label> : null}
			<div className="components-input-control__container">
				<div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
					<form
						className="aa-Form"
						ref={formRef}
						{...autocomplete.getFormProps({ inputElement: inputRef.current })}
					>
						<div className="aa-InputWrapperPrefix">
							<Button
								className="aa-SubmitButton"
								icon={search}
								type="submit"
								title={__('Submit', 'kadence-blocks')}
							/>
						</div>
						<div className="aa-InputWrapper">
							<input
								className="aa-Input"
								ref={inputRef}
								{...autocomplete.getInputProps({})}
								onKeyDown={handleKeyDown}
							/>
						</div>
						<div className="aa-InputWrapperSuffix">
							{autocompleteState.query && (
								<Button className="aa-ClearButton" onClick={handleResetClick} icon={closeSmall} />
							)}
							{/* <span className="aa-InputSeparator" />
              <Button
                className="aa-Chevron"
                onClick={ () => inputRef.current.focus() }
                icon={ chevronDown }
              /> */}
						</div>
					</form>
					<div
						ref={panelRef}
						className={['aa-Panel', autocompleteState.status === 'stalled' && 'aa-Panel--stalled']
							.filter(Boolean)
							.join(' ')}
						{...autocomplete.getPanelProps({})}
					>
						{(autocompleteState.isOpen || showCreate) && (
							<div className="aa-PanelWrapper">
								{autocompleteState.collections &&
									autocompleteState.collections.map((collection, index) => {
										const { source, items } = collection;

										return (
											<div key={`source-${index}`} className="aa-Source">
												{items.length > 0 && (
													<ul className="aa-List" {...autocomplete.getListProps()}>
														{items.map((item) => (
															<li
																key={item.objectID}
																className="aa-Item"
																{...autocomplete.getItemProps({
																	item,
																	source,
																})}
																dangerouslySetInnerHTML={{
																	__html: item?._highlightResult?.name?.value
																		? item._highlightResult.name.value
																		: item.name,
																}}
															/>
														))}
													</ul>
												)}
											</div>
										);
									})}
								{showCreate && (
									<Button
										className="aa-ItemCreate"
										text={`+ ${__('Add', 'kadence-blocks')}: "${autocompleteState.query}"`}
										onClick={handleItemCreate}
									/>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
