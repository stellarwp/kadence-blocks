import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, TextControl, Spinner } from "@wordpress/components"; // Import Spinner
import { debounce, has } from "lodash";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

export default function SvgSearchModal( {isOpen, setIsOpen, callback} ) {
	const [inputValue, setInputValue] = useState("");
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [allIcons, setAllIcons] = useState([])
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isAddingIcon, setIsAddingIcon] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const { createSuccessNotice } = useDispatch( noticesStore );
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);

	const debouncedSetSearch = useCallback(
		debounce(async (value) => {
			setSearch(value);
			await handleSearchSvg(value);
		}, 300),
		[]
	);

	const handleInputChange = (value) => {
		setInputValue(value);
		debouncedSetSearch(value);
	};

	const handleItemClick = (index) => {
		setSelectedIndex(index);
	};

	const handleSearchSvg = async (searchTerm) => {
		setResults([]);
		setAllIcons([]);
		setError(null);
		setIsLoading(true);
		setCurrentPage(1);
		setSelectedIndex(0);

		if (!searchTerm) {
			setIsLoading(false);
			return;
		}

		try {
			const response = await apiFetch({
				path: addQueryArgs(`/kb-custom-svg/v1/search`, { search: searchTerm, page: 1 }),
				method: "GET",
			});

			if (response.success) {
				setResults(response);
				setAllIcons(response.svgs.icons);
				setHasMore(response.svgs.has_more);
			} else {
				setError(
					`Error ${response.code}: ${response.message || "Unexpected error occurred."}`
				);
			}

		} catch (error) {
			setError(
				`Error ${error.code || "unknown"}: ${error.message || "An unexpected error occurred."}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddSvg = async () => {
		if (allIcons && selectedIndex >= 0) {
			const selectedIcon = allIcons[selectedIndex];

			if (!selectedIcon || !selectedIcon.url) {
				setError(__("Selected SVG is invalid. Please try again.", "kadence-blocks"));
				return;
			}

			const selectedSvgUrl = selectedIcon.url;
			setIsAddingIcon(true);

			try {
				const response = await apiFetch({
					path: '/kb-custom-svg/v1/search/add',
					method: 'POST',
					data: {
						svgUrl: selectedSvgUrl,
						title: selectedIcon.title || '',
						id: selectedIcon.id || '',
					},
				});

				if (response?.value && response?.label) {
					createSuccessNotice(__('SVG Saved.', 'kadence-blocks'), {
						type: 'snackbar',
					});
					callback(response.value);
					setIsOpen(false);
				} else {
					throw new Error(__('Invalid response from the server.', 'kadence-blocks'));
				}
			} catch (error) {
				setError(__('Failed to add the SVG. Please try again.', 'kadence-blocks'));
			} finally {
				setIsAddingIcon(false);
			}
		} else {
			setError(__("No SVG selected", "kadence-blocks"));
		}
	};

	const loadMoreIcons = async () => {
		if (!hasMore) return;

		setError(null);
		setIsLoadingMore(true);

		try {
			const nextPage = currentPage + 1;
			const response = await apiFetch({
				path: addQueryArgs(`/kb-custom-svg/v1/search`, { search, page: nextPage }),
				method: "GET",
			});

			if (response.svgs && response.svgs.icons) {
				setAllIcons((prevIcons) => [...prevIcons, ...response.svgs.icons]);
				setCurrentPage(nextPage);
				setHasMore(response.svgs.has_more);
			} else {
				setError("No further results found.");
			}
		} catch (error) {
			setError("Failed to load more icons, please try again.");
		} finally {
			setIsLoadingMore(false);
		}
	};

	return (
		<div className="svg-search-modal">
			<TextControl
				label={__("Search Icons", "kadence-blocks")}
				hideLabelFromVision={true}
				value={inputValue}
				placeholder={__("Search Icons", "kadence-blocks")}
				onChange={handleInputChange}
			/>
			{isLoading && (
				<div className="svg-search-modal__loading">
					<Spinner className="wp-spinner" />
				</div>
			)}
			{!isLoading && allIcons.length > 0 && (
				<>
					<ul className="svg-search-modal__results">
						{allIcons.map((icon, index) => (
							<li
								key={index}
								onClick={() => handleItemClick(index)}
								style={{
									border: selectedIndex === index ? "2px solid var(--wp-components-color-accent, var(--wp-admin-theme-color, #007cba))" : "2px solid transparent",
								}}
							>
								<img src={icon.url} alt={icon.title} />
							</li>
						))}
					</ul>
					<div className="footer">
						<Button
							isSecondary={true}
							onClick={loadMoreIcons}
							isBusy={isLoadingMore}
							disabled={!hasMore || isAddingIcon}
						>
							{__("Load More", "kadence-blocks")}
						</Button>
						<Button
							isPrimary={true}
							isBusy={isAddingIcon}
							disabled={isLoadingMore}
							onClick={() => handleAddSvg()}
						>
							{__("Add", "kadence-blocks")}
						</Button>
					</div>
				</>
			)}
			{error && (
				<p className="svg-search-modal__error" style={{ color: "red" }}>
					{error}
				</p>
			)}
			{!isLoading && !error && (!results || (results.svgs && results.svgs.icons.length === 0)) && (
				<p className="svg-search-modal__no-results">
					{__("No results found. Please try a different search.", "kadence-blocks")}
				</p>
			)}
			{!isLoading && !results.svgs && !error && (
				<p className="svg-search-modal__start-search">
					{__("Start Search...", "kadence-blocks")}
				</p>
			)}
		</div>
	);
}
