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

			// Successfully retrieved data
			setResults(response);
			setAllIcons(response.svgs.icons);
			setHasMore(response.svgs.has_more);
		} catch (error) {
			if (error.code === "rest_forbidden") {
				setError("Invalid or expired license. Please check your license key.");
			} else if (error.code === "rest_no_route") {
				setError("No results found for your search.");
			} else if (error.code === "rest_server_error") {
				setError("A server error occurred. Please try again later.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddSvg = async () => {
		if (results.svgs && selectedIndex >= 0) {
			const selectedSvgUrl = results.svgs.icons[selectedIndex].url;
			setIsLoading(true);

			try {
				// Fetch the raw SVG data using apiFetch
				const response = await apiFetch({
					path: '/kb-custom-svg/v1/search/add',
					method: 'POST',
					data: {
						svgUrl: selectedSvgUrl,
						title: results.svgs.icons[selectedIndex].title,
						id: results.svgs.icons[selectedIndex].id,
					}
				}).then( ( response ) => {
					if ( has( response, 'value' ) && has( response, 'label' ) ) {
						createSuccessNotice( __( 'SVG Saved.', 'kadence-blocks' ), {
							type: 'snackbar',
						} );
						callback( response.value );
						setIsOpen( false );
					}
				});
			} catch (error) {
				setError(__('Failed to add the SVG. Please try again.', 'kadence-blocks'));
			} finally {
				setIsLoading(false);
			}
		} else {
			setError(__("No SVG selected", "kadence-blocks"));
		}
	};

	const loadMoreIcons = async () => {
		if (!hasMore) return; // Do nothing if there's no more data to load

		setError(null);
		setIsLoading(true);

		try {
			const nextPage = currentPage + 1;
			const response = await apiFetch({
				path: addQueryArgs(`/kb-custom-svg/v1/search`, { search, page: nextPage }),
				method: "GET",
			});

			setAllIcons((prevIcons) => [...prevIcons, ...response.svgs.icons]);
			setResults(response);
			setCurrentPage(nextPage);
			setHasMore(response.svgs.has_more);
		} catch (error) {
			setError("Failed to load more icons, please try again.");
		} finally {
			setIsLoading(false);
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
			{/* Show loading spinner */}
			{isLoading && (
				<div className="svg-search-modal__loading">
					<Spinner className="wp-spinner" />
				</div>
			)}

			{/* Show results */}
			{!isLoading && allIcons.length > 0 && (
				<>
					<ul className="svg-search-modal__results">
						{allIcons.map((icon, index) => (
							<li
								key={index}
								onClick={() => handleItemClick(index)}
								style={{
									border: selectedIndex === index ? "2px solid blue" : "2px solid transparent",
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
							disabled={!hasMore || isLoading}
						>
							{__("Load More", "kadence-blocks")}
						</Button>
						<Button
							isPrimary={true}
							onClick={() => handleAddSvg()}
						>
							{__("Add", "kadence-blocks")}
						</Button>
					</div>
				</>
			)}

			{/* Show error message */}
			{error && (
				<p className="svg-search-modal__error" style={{ color: "red" }}>
					{error}
				</p>
			)}

			{/* Show 'No results' message */}
			{!isLoading && !error && (!results || (results.svgs && results.svgs.icons.length === 0)) && (
				<p className="svg-search-modal__no-results">
					{__("No results found. Please try a different search.", "kadence-blocks")}
				</p>
			)}

			{/* Show initial 'Start Search' message */}
			{!isLoading && !results.svgs && !error && (
				<p className="svg-search-modal__start-search">
					{__("Start Search...", "kadence-blocks")}
				</p>
			)}
		</div>
	);
}
