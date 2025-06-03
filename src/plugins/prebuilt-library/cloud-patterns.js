/**
 * Handle Cloud Connections.
 */
const { localStorage } = window;

/**
 * External dependencies
 */
import Masonry from 'react-masonry-css';

/**
 * WordPress dependencies
 */
import { useSelect, withDispatch, useDispatch } from '@wordpress/data';
import { parse, rawHandler } from '@wordpress/blocks';
import { debounce, isEqual } from 'lodash';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState, useMemo, useCallback } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { getAsyncData } from './data-fetch/get-async-data';
import {
	Button,
	SearchControl,
	TextControl,
	SelectControl,
	VisuallyHidden,
	Spinner,
	Dropdown,
} from '@wordpress/components';
import { previous, update, next, cloud, settings } from '@wordpress/icons';
import { __, _n, sprintf } from '@wordpress/i18n';
import { searchItems } from './search-items';
import replaceMasks from './replace/replace-masks';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

function PatternSortDropdown({ selectedItems }) {
	const sortOptions = [
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
		{ value: 'id_desc', label: __('Latest', 'kadence-blocks') },
		{ value: 'name_asc', label: __('Pattern Name A-Z', 'kadence-blocks') },
		{ value: 'name_desc', label: __('Pattern Name Z-A', 'kadence-blocks') },
	];
	// Default to 'Last Added'
	const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);

	useEffect(() => {
		if (selectedItems) {
			selectedItems(selectedSort);
		}
	}, [selectedSort]);

	const filterIcon = (
		<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1.175 0.158203L5 3.97487L8.825 0.158203L10 1.3332L5 6.3332L0 1.3332L1.175 0.158203Z"
				fill="#020129"
			/>
		</svg>
	);

	const getSelectedLabel = useCallback(() => {
		const selected = sortOptions.find((option) => option.value === selectedSort);
		return selected ? selected.label : '';
	}, [selectedSort]);

	return (
		<Dropdown
			variant="unstyled"
			className="kb-patterns-filter-dropdown kb-patterns-sort-dropdown"
			contentClassName="kb-patterns-filter-dropdown-content kb-patterns-sort-dropdown-content"
			popoverProps={{ placement: 'bottom-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} aria-expanded={isOpen} className="kb-toggle-button">
					<div className="kb-toggle-button-wrapper">
						<span>{getSelectedLabel()}</span>
						{filterIcon}
					</div>
				</Button>
			)}
			renderContent={({ onToggle }) => (
				<div>
					<div className="kb-patterns-filter-dropdown-sort-inner">
						{sortOptions.map((option) => (
							<div className="kb-pattern-sort-item" key={option.value}>
								<Button
									isPressed={selectedSort === option.value}
									variant={'tertiary'}
									className={`kb-pattern-sort-item-label ${
										selectedSort === option.value ? 'is-active' : ''
									}`}
									onClick={() => {
										setSelectedSort(option.value);
										onToggle();
									}}
								>
									{option.label}
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		/>
	);
}

function CloudLibraryPatterns({
	connection,
	category,
	patterns,
	search,
	setSearch,
	onInsertContent,
	sortBy,
	setSortBy,
}) {
	const breakpointColumnsObj = {
		default: 3,
		1600: 2,
		1200: 2,
		500: 1,
	};
	const [rootScroll, setRootScroll] = useState();
	const activeCategorySlug = connection?.slug && category?.[connection.slug] ? category?.[connection.slug] : 'all';
	const thePatterns = useMemo(() => {
		const allPatterns = [];
		let variation = 0;
		Object.keys(patterns).map(function (key, index) {
			const temp = [];
			if (variation === 11) {
				variation = 0;
			}
			temp.title = patterns[key].name;
			temp.name = patterns[key].name;
			temp.image = patterns[key].image;
			temp.imageWidth = patterns[key].imageW;
			temp.imageHeight = patterns[key].imageH;
			temp.id = patterns[key].id;
			temp.slug = patterns[key].slug;
			temp.description = patterns[key]?.description;
			temp.categories = patterns[key].categories ? Object.keys(patterns[key].categories) : [];
			temp.layouts = patterns[key]?.layouts ? Object.keys(patterns[key].layouts) : [];
			temp.components = patterns[key]?.components ? Object.keys(patterns[key].components) : [];

			temp.keywords = patterns[key].keywords ? patterns[key].keywords : [];

			// // Process newCategory with decoded HTML entities if needed
			// temp.categories = patterns[key]?.categories ? { ...patterns[key].categories } : null;
			// if (temp.categories && typeof temp.categories === 'object') {
			// 	// Decode category labels within the categories object
			// 	Object.keys(temp.categories).forEach((slug) => {
			// 		if (temp.categories[slug]?.name) {
			// 			temp.categories[slug].name = decodeHTMLEntities(temp.categories[slug].name);
			// 		}
			// 	});
			// }

			if (patterns[key]?.html) {
				temp.html = replaceMasks(patterns[key].html);
			}
			temp.content = patterns[key]?.content || '';
			temp.pro = patterns[key].pro;
			temp.locked = patterns[key].locked;
			temp.viewportWidth = 1200;
			temp.variation = variation;
			variation++;
			allPatterns.push(temp);
		});
		return allPatterns;
	}, [patterns]);

	const filteredPatterns = useMemo(() => {
		let allPatterns = thePatterns;

		if (!search && activeCategorySlug && activeCategorySlug !== 'all') {
			allPatterns = allPatterns.filter((pattern) => pattern.categories?.includes(activeCategorySlug));
		}
		// Apply Sorting
		if (sortBy === 'name_asc') {
			allPatterns.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortBy === 'name_desc') {
			allPatterns.sort((a, b) => b.name.localeCompare(a.name));
		} else if (sortBy === 'id_desc') {
			// Default sort: id_desc (Last Added)
			allPatterns.sort((a, b) => b.id - a.id);
		}

		return searchItems(allPatterns, search);
	}, [search, activeCategorySlug, thePatterns, sortBy]);

	const roundAccurately = (number, decimalPlaces) =>
		Number(Math.round(Number(number + 'e' + decimalPlaces)) + 'e' + decimalPlaces * -1);

	return (
		<div ref={setRootScroll} className="kb-cloud-patterns-explorer__wrap">
			<div className="kb-cloud-patterns-explorer">
				<div className="kb-patterns-filter-wrapper">
					<SearchControl
						className="kb-pattern-search-control"
						value={search}
						placeholder={__('Search Patterns', 'kadence-blocks')}
						onChange={(value) => setSearch(value)}
					/>
					<span className="kb-patterns-count-message">
						{search
							? sprintf(
									/* translators: %d: number of patterns. %s: block pattern search query */
									_n('%1$d pattern for "%2$s"', '%1$d patterns for "%2$s"', filteredPatterns.length),
									filteredPatterns.length,
									search
							  )
							: sprintf(
									/* translators: %d: number of patterns. */
									_n('%d pattern', '%d patterns', filteredPatterns.length),
									filteredPatterns.length
							  )}
					</span>
					{setSortBy && (
						<div className="kb-patterns-filter-wrapper-sort-by">
							<span className="kb-pattern-filter-label">{__('Sort by:', 'kadence-blocks')}</span>
							<PatternSortDropdown selectedItems={setSortBy} />
						</div>
					)}
				</div>
				<div className="kb-cloud-library-outer-wrap">
					<Masonry
						breakpointCols={breakpointColumnsObj}
						className={`kb-css-masonry kb-cloud-library-wrap`}
						columnClassName="kb-css-masonry_column"
						// className={ 'kb-prebuilt-grid kb-prebuilt-masonry-grid' }
						// elementType={ 'div' }
						// options={ {
						// 	transitionDuration: 0,
						// } }
						// disableImagesLoaded={ false }
						// enableResizableChildren={ true }
						// updateOnEachImageLoad={ false }
					>
						{filteredPatterns.map((pattern, index) => {
							const name = pattern.name;
							const slug = pattern.slug;
							const image = pattern.image;
							const imageWidth = pattern.imageWidth;
							const imageHeight = pattern.imageHeight;
							const description = pattern.description;
							const pro = pattern.pro;
							const locked = pattern.locked;
							const descriptionId = `${slug}_kb_cloud__item-description`;
							let paddingBottom =
								imageWidth && imageHeight ? roundAccurately((imageHeight / imageWidth) * 100, 2) : 61;
							const paddingOnBottom = paddingBottom;
							let paddingOffset = 0;
							let hasMaxHeight = false;
							if (paddingBottom > 140) {
								paddingOffset = ((paddingBottom - 140) / paddingBottom) * 100;
								paddingBottom = 140;
								hasMaxHeight = true;
							}
							const trans_scroll_speed =
								paddingOnBottom > 140 ? ((paddingOnBottom - paddingOffset) / 100) * 600 : 800;
							const transitionSpeed = `transform ${trans_scroll_speed}ms linear`;
							return (
								<div
									className="kb-css-masonry-inner"
									style={{
										'--scroll-height-offset': '-' + paddingOffset + '%',
										'--scroll-height-speed': transitionSpeed,
									}}
									key={index}
								>
									<Button
										key={index}
										className={`kb-css-masonry-btn${
											hasMaxHeight ? ' kb-css-masonry-btn-max-height' : ''
										}`}
										aria-label={sprintf(
											/* translators: %s is Prebuilt Name */
											__('Add %s', 'kadence-blocks'),
											name
										)}
										aria-describedby={description ? descriptionId : undefined}
										isDisabled={locked}
										onClick={() => (!locked ? onInsertContent(pattern) : '')}
									>
										<div
											className="kb-css-masonry-btn-inner"
											style={{
												paddingBottom:
													imageWidth && imageHeight ? paddingBottom + '%' : undefined,
											}}
										>
											<img src={image} loading={'lazy'} alt={name} />
											<span
												className="kb-import-btn-title"
												dangerouslySetInnerHTML={{ __html: name }}
											/>
										</div>
									</Button>
									{!!description && <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden>}
									{undefined !== pro && pro && (
										<>
											<span className="kb-pro-template">{__('Pro', 'kadence-blocks')}</span>
											{locked && (
												<div className="kb-popover-pro-notice">
													<h2>{__('Pro required for this item', 'kadence-blocks')} </h2>
												</div>
											)}
										</>
									)}
								</div>
							);
						})}
					</Masonry>
				</div>
			</div>
		</div>
	);
}

export default CloudLibraryPatterns;
