/**
 * WordPress dependencies
 */

import { parse } from '@wordpress/blocks';
import {
	Button,
	Dropdown,
	CheckboxControl,
	ToggleControl,
	TextControl,
	SelectControl,
	VisuallyHidden,
	ExternalLink,
	Spinner,
	Tooltip,
	Icon,
	SearchControl,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { kadenceNewIcon, aiIcon, aiSettings } from '@kadence/icons';
import { tryParseJSON } from '@kadence/helpers';
import { useMemo, useEffect, useState, memo, useCallback } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';
import { speak } from '@wordpress/a11y';
import { searchItems } from './search-items';
import replaceColors from './replace/replace-colors';
import replaceImages from './replace/replace-images';
import replaceContent from './replace/replace-content';
import deleteContent from './replace/remove-content';
import replaceAddressContent from './replace/replace-address-content';
import wooContent from './replace/woo-content';
import replaceMasks from './replace/replace-masks';
import KadenceBlockPatternList from './block-pattern-list';
import { useSelect, useDispatch } from '@wordpress/data';
import { CONTEXT_PROMPTS } from './data-fetch/constants';
import { sendEvent } from '../../extension/analytics/send-event';
import { getAsyncData } from './data-fetch/get-async-data';

const decodeHTMLEntities = (text) => {
	if (!text) return '';
	const textarea = document.createElement('textarea');
	textarea.innerHTML = text;
	return textarea.value;
};

function PatternsListHeader({ filterValue, filteredBlockPatternsLength }) {
	if (!filterValue) {
		return null;
	}
	return (
		<Heading level={2} lineHeight={'48px'} className="block-editor-block-patterns-explorer__search-results-count">
			{sprintf(
				/* translators: %d: number of patterns. %s: block pattern search query */
				_n('%1$d pattern found for "%2$s"', '%1$d patterns found for "%2$s"', filteredBlockPatternsLength),
				filteredBlockPatternsLength,
				filterValue
			)}
		</Heading>
	);
}
function BannerHeader({ selectedCategory }) {
	if (!selectedCategory) {
		return null;
	}
	const productLabel = !kadence_blocks_params.hasWoocommerce
		? __('Add WooCommerce and create some products.', 'kadence-blocks')
		: __('Add some products here.', 'kadence-blocks');
	return (
		<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice">
			{(selectedCategory == 'featured-products' || selectedCategory == 'product-loop') && (
				<>
					{__('These patterns require you to have some products.', 'kadence-blocks')}{' '}
					<ExternalLink
						href={kadence_blocks_params.addProductsLink ? kadence_blocks_params.addProductsLink : '#'}
					>
						{productLabel}
					</ExternalLink>
				</>
			)}
			{selectedCategory === 'post-loop' && (
				<>
					{__('These patterns require you to have some posts.', 'kadence-blocks')}{' '}
					<ExternalLink href={kadence_blocks_params.addPostsLink ? kadence_blocks_params.addPostsLink : '#'}>
						{__('Add some posts here.', 'kadence-blocks')}
					</ExternalLink>
				</>
			)}
		</Heading>
	);
}

const LoadingHeader = memo(({ type }) => {
	if ('error' === type) {
		return (
			<Heading
				level={2}
				lineHeight={'48px'}
				className="kb-patterns-banner-notice kb-patterns-banner-notice-error"
			>
				{__('Error Generating AI Content', 'kadence-blocks')}
			</Heading>
		);
	}
	return (
		<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice">
			<Spinner />
			{'processing' === type
				? __('Generating AI Content.', 'kadence-blocks')
				: __('Loading AI Content.', 'kadence-blocks')}
		</Heading>
	);
});

const GenerateHeader = memo(({ context, contextLabel, contextState, generateContext }) => {
	const [loading, setLoading] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);
	useEffect(() => {
		setLoading(false);
		if ('credits' === contextState || 'error' === contextState || 'failed' === contextState) {
			setBtnDisabled(true);
		}
	}, [context, contextState]);
	const data_key =
		kadence_blocks_params.proData && kadence_blocks_params.proData.api_key
			? kadence_blocks_params.proData.api_key
			: '';
	const isAuthorized = window?.kadence_blocks_params?.isAuthorized;
	const activateLink = window?.kadence_blocks_params?.homeLink ? kadence_blocks_params.homeLink : '';
	return (
		<div className="kb-patterns-banner-generate-notice">
			<Icon className="kadence-generate-icons" icon={aiIcon} />
			<Heading level={2} lineHeight={'1.2'} className="kb-patterns-heading-notice">
				{sprintf(
					/* translators: %s: the current context */
					__('Would you like to generate AI powered content for the %s context?', 'kadence-blocks'),
					contextLabel
				)}
			</Heading>
			<p>
				{sprintf(
					/* translators: %s: the current context */
					__(
						'Using the site information you provided we will generate copy for the %s context.',
						'kadence-blocks'
					),
					contextLabel
				)}
			</p>
			{!isAuthorized && !loading && (
				<Button
					className="kadence-generate-copy-button"
					iconPosition="right"
					icon={aiIcon}
					text={__('Activate Kadence AI', 'kadence-blocks')}
					disabled={activateLink ? false : true}
					target={activateLink ? '_blank' : ''}
					href={activateLink ? activateLink : ''}
				/>
			)}
			{isAuthorized && !data_key && !loading && (
				<>
					<Button
						className="kadence-generate-copy-button"
						iconPosition="right"
						icon={aiIcon}
						text={__('Activate Kadence AI', 'kadence-blocks')}
						disabled={activateLink ? false : true}
						target={activateLink ? '_blank' : ''}
						href={activateLink ? activateLink : ''}
					/>
				</>
			)}
			{isAuthorized && data_key && !loading && (
				<Button
					className="kadence-generate-copy-button"
					iconPosition="right"
					icon={aiIcon}
					disabled={btnDisabled}
					text={sprintf(
						/* translators: %s is the credit amount */
						__('Generate Content (%s Credits)', 'kadence-blocks'),
						CONTEXT_PROMPTS?.[context] ? CONTEXT_PROMPTS[context] : '1'
					)}
					onClick={() => {
						setLoading(true);
						generateContext(context);
					}}
				/>
			)}
			{loading && <Spinner />}
		</div>
	);
});

function LaunchWizard({ launchWizard }) {
	const launchWizardHeadline = __('Supercharge your web design process with Kadence AI', 'kadence-blocks');
	// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
	const launchWizardBody = __(
		`To fill your library with thoughtful, relevant, and unique content, simply enter your site goals and information into our prompt wizard.
		Our design library includes context-driven design patterns that are easy to use, saving you time and effort during the design process. It
		only takes a few minutes to get started.`,
		'kadence-blocks'
	);
	return (
		<div className="kb-patterns-banner-generate-notice">
			<Icon className="kadence-generate-icons" icon={aiIcon} />
			<Heading level={2} lineHeight={'1.2'} className="kb-patterns-heading-notice">
				{launchWizardHeadline}
			</Heading>
			<p>{launchWizardBody}</p>
			<Button
				className="kadence-generate-copy-button"
				iconPosition="right"
				icon={aiIcon}
				text={__('Launch AI Startup', 'kadence-blocks')}
				onClick={() => {
					launchWizard();
				}}
			/>
		</div>
	);
}
function LoadingFailedHeader({ type }) {
	if ('license' === type) {
		return (
			<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice ai-failed-loading">
				{__('Error Generating AI Content, verify license and available credits.', 'kadence-blocks')}
			</Heading>
		);
	}
	if ('credits' === type) {
		return (
			<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice ai-failed-loading">
				{__('Error, Can not generate AI Content because of insufficient credits.', 'kadence-blocks')}
			</Heading>
		);
	}
	return (
		<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice ai-failed-loading">
			{'reload' === type
				? __('AI Content Failed to Load, Please reload this browser window.', 'kadence-blocks')
				: __('AI Content Failed to Load.', 'kadence-blocks')}
		</Heading>
	);
}
function FailedHeader({ type }) {
	if ('license' === type) {
		return (
			<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice failed-loading">
				{__(
					'Error importing because of license validation, please verify your license key is valid and activated.',
					'kadence-blocks'
				)}
			</Heading>
		);
	}
	return (
		<Heading level={2} lineHeight={'48px'} className="kb-patterns-banner-notice failed-loading">
			{__(
				'Error importing, the requested content could not be fetched, try reloading your page.',
				'kadence-blocks'
			)}
		</Heading>
	);
}

function PatternFilterDropdown({ label, items, selectedItems }) {
	const [options, setOptions] = useState(items.filter((pattern) => pattern.label !== 'All'));
	const [selectedPatterns, setSelectedPatterns] = useState([]);
	useEffect(() => {
		if (options && options.length) {
			const temp = options.filter((pattern) => pattern.checked);
			setSelectedPatterns(temp);

			if (selectedItems) {
				selectedItems(temp);
			}
		}
	}, [options]);

	const filterIcon = (
		<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1.175 0.158203L5 3.97487L8.825 0.158203L10 1.3332L5 6.3332L0 1.3332L1.175 0.158203Z"
				fill="#020129"
			/>
		</svg>
	);

	const clearFilter = useCallback(() => {
		setOptions(options.map((pattern) => ({ ...pattern, checked: false })));
	}, [options]);

	const updateSelection = (bool, index) => {
		const cloned = [...options];
		cloned[index].checked = bool;
		setOptions(cloned);

		// Update selectedPatterns state
		const patternSelections = cloned.filter((pattern) => pattern.checked);
		setSelectedPatterns(patternSelections);

		// Notify parent component about selected items
		if (selectedItems) {
			selectedItems(selectedPatterns);
		}
	};

	return (
		<Dropdown
			variant="unstyled"
			className="kb-patterns-filter-dropdown"
			contentClassName="kb-patterns-filter-dropdown-content"
			popoverProps={{ placement: 'bottom-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} aria-expanded={isOpen} className="kb-toggle-button">
					<div className="kb-toggle-button-wrapper">
						<span>
							{label} {selectedPatterns.length > 0 ? `(${selectedPatterns.length})` : ''}
						</span>
						{filterIcon}
					</div>
				</Button>
			)}
			renderContent={() => (
				<div>
					<div className="kb-patterns-filter-dropdown-content-inner">
						{options &&
							options.map(
								(pattern, i) =>
									pattern.value && (
										<div className="kb-pattern-filter-item" key={pattern.value}>
											<CheckboxControl
												checked={pattern.checked}
												id={pattern.value}
												label={pattern.label}
												onChange={(bool) => updateSelection(bool, i)}
											/>
										</div>
									)
							)}
					</div>
					<div className="kb-pattern-filter-dropdown-content-clear" onClick={(_e) => clearFilter()}>
						{__('Clear', 'kadence-blocks')}
					</div>
				</div>
			)}
		/>
	);
}
function PatternLayoutDropdown({ selectedItems }) {
	const [layoutOptions, setLayoutOptions] = useState([
		{
			heading: __('Media Placement', 'kadence-blocks'),
			options: [
				{ value: 'media-top', label: __('Media top', 'kadence-blocks'), checked: false },
				{ value: 'media-center', label: __('Media center', 'kadence-blocks'), checked: false },
				{ value: 'media-bottom', label: __('Media bottom', 'kadence-blocks'), checked: false },
				{ value: 'media-left', label: __('Media left', 'kadence-blocks'), checked: false },
				{ value: 'media-right', label: __('Media right', 'kadence-blocks'), checked: false },
				{ value: 'media-background', label: __('Media background', 'kadence-blocks'), checked: false },
				{ value: 'no-media', label: __('No media', 'kadence-blocks'), checked: false },
			],
		},
		{
			heading: __('Columns', 'kadence-blocks'),
			options: [
				{ value: '1-column', label: __('1 column', 'kadence-blocks'), checked: false },
				{ value: '2-columns', label: __('2 columns', 'kadence-blocks'), checked: false },
				{ value: '3-columns', label: __('3 columns', 'kadence-blocks'), checked: false },
				{ value: '4-columns', label: __('4 columns', 'kadence-blocks'), checked: false },
				{ value: '5-columns', label: __('5+ columns', 'kadence-blocks'), checked: false },
			],
		},
		{
			options: [
				{ value: 'off-grid', label: __('Off-Grid', 'kadence-blocks'), checked: false, type: 'toggle' },
				{ value: 'grid', label: __('Bento & Grid', 'kadence-blocks'), checked: false, type: 'toggle' },
			],
		},
	]);
	const [selectedLayoutsCount, setSelectedLayoutsCount] = useState(0);

	useEffect(() => {
		let count = 0;
		const selectedValues = [];
		layoutOptions.forEach((group) => {
			group.options.forEach((option) => {
				if (option.checked) {
					count++;
					selectedValues.push(option.value);
				}
			});
		});
		setSelectedLayoutsCount(count);

		if (selectedItems) {
			selectedItems(selectedValues);
		}
	}, [layoutOptions]);

	const filterIcon = (
		<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1.175 0.158203L5 3.97487L8.825 0.158203L10 1.3332L5 6.3332L0 1.3332L1.175 0.158203Z"
				fill="#020129"
			/>
		</svg>
	);

	const clearFilter = useCallback(() => {
		setLayoutOptions((prevOptions) =>
			prevOptions.map((group) => ({
				...group,
				options: group.options.map((option) => ({ ...option, checked: false })),
			}))
		);
	}, []);

	const updateSelection = useCallback((bool, groupIndex, optionIndex) => {
		setLayoutOptions((prevOptions) => {
			// Create a deep copy to avoid modifying the previous state directly
			let newOptions = JSON.parse(JSON.stringify(prevOptions));

			// Determine the type of the clicked option
			const clickedOptionType = newOptions[groupIndex].options[optionIndex]?.type;

			// Update the clicked option's checked state
			newOptions[groupIndex].options[optionIndex].checked = bool;

			// If the clicked option is a toggle and it's being turned on (bool is true)
			if (clickedOptionType === 'toggle' && bool) {
				// Iterate through all options to uncheck other toggles
				newOptions = newOptions.map((group, gIndex) => ({
					...group,
					options: group.options.map((option, oIndex) => {
						// If it's a toggle and NOT the one that was just clicked
						if (option.type === 'toggle' && !(gIndex === groupIndex && oIndex === optionIndex)) {
							// Set its checked state to false
							return { ...option, checked: false };
						}
						// Otherwise, keep the option as is
						return option;
					}),
				}));
			}

			// Return the updated options array to set the state
			return newOptions;
		});
	}, []);

	return (
		<Dropdown
			variant="unstyled"
			className="kb-patterns-filter-dropdown"
			contentClassName="kb-patterns-filter-dropdown-content"
			popoverProps={{ placement: 'bottom-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} aria-expanded={isOpen} className="kb-toggle-button">
					<div className="kb-toggle-button-wrapper">
						<span>
							{__('Layout', 'kadence-blocks')}{' '}
							{selectedLayoutsCount > 0 ? `(${selectedLayoutsCount})` : ''}
						</span>
						{filterIcon}
					</div>
				</Button>
			)}
			renderContent={({ onToggle }) => (
				<div>
					<div className="kb-patterns-filter-dropdown-content-inner">
						{layoutOptions.map((group, groupIndex) => (
							<div key={group.heading} className="kb-pattern-filter-group">
								{group.heading && <h4 className="kb-pattern-filter-group-heading">{group.heading}</h4>}
								{group.options.map(
									(option, optionIndex) =>
										option.value && (
											<div className="kb-pattern-filter-item" key={option.value}>
												{option.type === 'toggle' ? (
													<ToggleControl
														checked={option.checked}
														id={option.value}
														label={option.label}
														onChange={(bool) =>
															updateSelection(bool, groupIndex, optionIndex)
														}
													/>
												) : (
													<CheckboxControl
														checked={option.checked}
														id={option.value}
														label={option.label}
														onChange={(bool) =>
															updateSelection(bool, groupIndex, optionIndex)
														}
													/>
												)}
											</div>
										)
								)}
							</div>
						))}
					</div>
					<div
						className="kb-pattern-filter-dropdown-content-clear"
						onClick={(_e) => {
							clearFilter();
							onToggle();
						}}
					>
						{__('Clear All', 'kadence-blocks')}
					</div>
				</div>
			)}
		/>
	);
}

function PatternSortDropdown({ selectedItems }) {
	const sortOptions = [
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
function ProOnlyHeader({ launchWizard }) {
	const isAuthorized = window?.kadence_blocks_params?.isAuthorized;
	const data_key = window?.kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '';
	const activateLink = window?.kadence_blocks_params?.homeLink ? kadence_blocks_params.homeLink : '';
	// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
	const launchWizardBody = __(
		`Fill your library with thoughtful, relevant, and unique content. It
		only takes a few minutes to get started.`,
		'kadence-blocks'
	);

	return (
		<div className="kb-patterns-banner-generate-notice">
			<Icon className="kadence-generate-icons" icon={aiIcon} />
			<Heading level={2} lineHeight={'1.2'} className="kb-patterns-heading-notice">
				{__('Supercharge your web design process with Kadence AI', 'kadence-blocks')}
			</Heading>
			<p>{launchWizardBody}</p>
			{!isAuthorized && (
				<Button
					className="kadence-generate-copy-button"
					iconPosition="right"
					icon={aiIcon}
					text={__('Activate Kadence AI', 'kadence-blocks')}
					target={activateLink ? '_blank' : ''}
					disabled={activateLink ? false : true}
					href={activateLink ? activateLink : ''}
				/>
			)}
			{isAuthorized && !data_key && (
				<>
					<Button
						className="kadence-generate-copy-button"
						iconPosition="right"
						icon={aiIcon}
						text={__('Activate Kadence AI', 'kadence-blocks')}
						target={activateLink ? '_blank' : ''}
						disabled={activateLink ? false : true}
						href={activateLink ? activateLink : ''}
					/>
				</>
			)}
			{isAuthorized && data_key && (
				<Button
					className="kadence-generate-copy-button"
					iconPosition="right"
					icon={aiIcon}
					text={__('Generate Content AI Content', 'kadence-blocks')}
					onClick={() => {
						launchWizard();
					}}
				/>
			)}
		</div>
	);
}

function PatternList({
	patterns,
	patternsHTML,
	filterValue,
	selectedCategory,
	selectedNewCategory,
	selectedStyle = 'light',
	breakpointCols,
	onSelect,
	previewMode = 'iframe',
	selectedFontSize,
	aiContext,
	aINeedsData,
	contextTab,
	imageCollection,
	teamCollection,
	contextStatesRef,
	useImageReplace,
	generateContext,
	contextLabel,
	launchWizard,
	categories,
	userData,
	styles,
	search,
	setSearch,
}) {
	const [failedAI, setFailedAI] = useState(false);
	const [failed, setFailed] = useState(false);
	const [importing, setImporting] = useState(false);
	const [failedAIType, setFailedAIType] = useState('general');
	const [failedType, setFailedType] = useState('general');
	const [rootScroll, setRootScroll] = useState();
	const [categoryFilter, setCategoryFilter] = useState([]);
	const [styleFilter, setStyleFilter] = useState([]);
	const [layoutFilter, setLayoutFilter] = useState([]);
	const [componentFilter, setComponentFilter] = useState([]);
	const [sortBy, setSortBy] = useState('id_desc');
	const debouncedSpeak = useDebounce(speak, 500);
	const { getPattern } = getAsyncData();
	const { getContextState, getContextContent, getAllContext } = useSelect((select) => {
		return {
			getContextState: (value) => select('kadence/library').getContextState(value),
			getContextContent: (value) => select('kadence/library').getContextContent(value),
			getAllContext: () => select('kadence/library').getAllContext(),
		};
	}, []);
	const isAuthorized = window?.kadence_blocks_params?.isAuthorized;
	const isAIDisabled = window?.kadence_blocks_params?.isAIDisabled ? true : false;
	const data_key = window?.kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '';

	const onSelectBlockPattern = useCallback(
		async (pattern) => {
			setImporting(true);
			// eslint-disable-next-line @wordpress/no-unused-vars-before-return
			const allContext = getAllContext();
			const patternSend = {
				id: pattern.id,
				slug: pattern.slug,
				type: 'pattern',
				style: selectedStyle ? selectedStyle : 'light',
			};
			const response = await getPattern(
				patternSend?.type === 'page' ? 'pages' : 'section',
				patternSend?.type ? patternSend.type : 'patternSend',
				patternSend?.id ? patternSend.id : '',
				patternSend?.style ? patternSend.style : 'light'
			);
			let newInfo = ''; // info.content;
			if (response && 'invalid_access' === response) {
				setFailed(true);
				setFailedType('license');
				setImporting(false);
				return;
			}
			if (response) {
				try {
					const tempContent = JSON.parse(response);
					if (tempContent) {
						if (tempContent?.content) {
							newInfo = tempContent.content;
							if (tempContent?.cpt_blocks) {
								patternSend.cpt_blocks = tempContent.cpt_blocks;
							}
						} else {
							newInfo = response;
						}
					}
				} catch (e) {}
			}
			if (!newInfo && pattern?.content) {
				newInfo = pattern.content;
			}
			sendEvent('pattern_added_to_page', {
				categories: pattern.categories,
				id: pattern.id,
				slug: pattern.slug,
				name: pattern.name,
				style: selectedStyle ? selectedStyle : 'light',
				is_ai: contextTab === 'context',
				// Only send context when using AI patterns.
				context: contextTab === 'context' ? contextLabel : '',
			});

			newInfo = replaceImages(
				newInfo,
				imageCollection,
				pattern.categories,
				pattern.id,
				pattern.variation,
				teamCollection
			);
			if (contextTab === 'context') {
				newInfo = replaceContent(newInfo, allContext, pattern.categories, aiContext, pattern.variation);
			}
			newInfo = wooContent(newInfo);
			if (userData?.locationType && 'Online Only' !== userData?.locationType && userData?.locationInput) {
				newInfo = replaceAddressContent(newInfo, userData.locationInput);
			}
			newInfo = deleteContent(newInfo);
			if (!selectedStyle || 'light' === selectedStyle) {
				// Perhaps do something later.
			} else if ('dark' === selectedStyle) {
				newInfo = replaceColors(newInfo, 'dark');
			} else if ('highlight' === selectedStyle) {
				newInfo = replaceColors(newInfo, 'highlight');
			}
			patternSend.content = newInfo;
			onSelect(patternSend);
		},
		[
			getAllContext,
			getPattern,
			imageCollection,
			contextTab,
			aiContext,
			selectedStyle,
			teamCollection,
			userData,
			onSelect,
			contextLabel,
		]
	);

	const thePatterns = useMemo(() => {
		const allPatterns = [];
		const hasPremiumAccess =
			'true' !== kadence_blocks_params.pro || 'true' !== kadence_blocks_params.creativeKit ? true : false;
		let variation = 0;
		Object.keys(patterns).map(function (key, index) {
			const temp = [];
			if (
				'true' !== kadence_blocks_params.pro &&
				patterns[key]?.requiredPlugins &&
				Object.keys(patterns[key].requiredPlugins).includes('blocks-pro')
			) {
				return;
			}
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
			temp.categories = patterns[key].categories ? Object.keys(patterns[key].categories) : [];
			temp.styles = patterns[key].styles ? Object.keys(patterns[key].styles) : [];
			temp.contexts = patterns[key].contexts ? Object.keys(patterns[key].contexts) : [];
			temp.hpcontexts = patterns[key].hpcontexts ? Object.keys(patterns[key].hpcontexts) : [];
			temp.keywords = patterns[key].keywords ? patterns[key].keywords : [];

			// Process newCategory with decoded HTML entities if needed
			temp.newCategory = patterns[key]?.newCategory ? { ...patterns[key].newCategory } : null;
			if (temp.newCategory && typeof temp.newCategory === 'object') {
				// Decode category labels within the newCategory object
				Object.keys(temp.newCategory).forEach((slug) => {
					if (temp.newCategory[slug]?.name) {
						temp.newCategory[slug].name = decodeHTMLEntities(temp.newCategory[slug].name);
					}
				});
			}

			temp.sidebarHeading = patterns[key]?.sidebarHeading || null;
			if (patterns[key]?.html) {
				temp.html = replaceMasks(patterns[key].html);
			}
			temp.content = patterns[key]?.content || '';
			temp.pro = patterns[key].pro;
			temp.locked = patterns[key].pro && !hasPremiumAccess ? true : false;
			temp.proRender = false;
			temp.viewportWidth = 1200;
			temp.variation = variation;
			temp.layout = patterns[key].layout;
			temp.component = patterns[key].component || {};
			temp.labels = patterns[key]?.label || {};
			variation++;
			allPatterns.push(temp);
		});
		return allPatterns;
	}, [patterns]);

	const uniqueComponentOptions = useMemo(() => {
		const allComponents = {};
		thePatterns.forEach((pattern) => {
			if (pattern.component && typeof pattern.component === 'object') {
				Object.keys(pattern.component).forEach((key) => {
					if (!allComponents[key]) {
						// Use the label provided in the component data if available, otherwise format the key.
						const label =
							typeof pattern.component[key] === 'string' && pattern.component[key]
								? pattern.component[key]
								: key.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
						allComponents[key] = { value: key, label, checked: false };
					}
				});
			}
		});
		return Object.values(allComponents).sort((a, b) => a.label.localeCompare(b.label));
	}, [thePatterns]);

	const updateCategoryFilter = useCallback((categoryList) => {
		const selectedCategoryValues = categoryList.map((category) => category.value);
		setCategoryFilter(selectedCategoryValues);
	}, []);

	const updateStyleFilter = useCallback((stylesList) => {
		const selectedStyleValues = stylesList.map((style) => style.value);
		setStyleFilter(selectedStyleValues);
	}, []);

	const updateLayoutFilter = useCallback((layoutList) => {
		setLayoutFilter(layoutList);
	}, []);

	const updateComponentFilter = useCallback((componentList) => {
		const selectedComponentValues = componentList.map((component) => component.value);
		setComponentFilter(selectedComponentValues);
	}, []);

	const filteredBlockPatterns = useMemo(() => {
		let contextTax = 'contact-form' === aiContext ? 'contact' : aiContext;
		contextTax = 'subscribe-form' === contextTax ? 'subscribe' : contextTax;
		contextTax = 'pricing-table' === contextTax ? 'pricing' : contextTax;
		if (contextTab === 'context') {
			if (aINeedsData) {
				console.log('AI Needed');
				return [];
			} else if (!getContextState(aiContext)) {
				console.log('AI Needed');
				return [];
			} else if ('loading' === getContextState(aiContext)) {
				console.log('Loading AI Content');
				setFailedAI(false);
				return [];
			} else if ('processing' === getContextState(aiContext)) {
				console.log('Generating AI Content');
				setFailedAI(false);
				return [];
			} else if ('error' === getContextState(aiContext)) {
				console.log('Error Generating AI Content, perhaps licensing?');
				setFailedAI(true);
				setFailedAIType('license');
			} else if ('credits' === getContextState(aiContext)) {
				console.log('Error not enough credits');
				setFailedAI(true);
				setFailedAIType('credits');
			} else if (getContextContent(aiContext) === 'failed') {
				console.log('AI Content has failed');
				setFailedAI(true);
				setFailedAIType('general');
			} else if (getContextContent(aiContext) === 'failedReload') {
				console.log('AI Content has failed, reload page required.');
				setFailedAI(true);
				setFailedAIType('reload');
			}
		}
		let allPatterns = thePatterns;

		if (!filterValue && contextTab === 'design') {
			if (selectedCategory && 'all' !== selectedCategory && selectedCategory === 'new') {
				// Filter for "New" patterns
				allPatterns = allPatterns.filter((pattern) => pattern.labels?.new);
			} else if (selectedNewCategory && selectedNewCategory !== '') {
				// Filter by newCategory
				allPatterns = allPatterns.filter((pattern) => {
					// Check if the selectedNewCategory exists as a key in the pattern's newCategory object
					return pattern.newCategory && pattern.newCategory.hasOwnProperty(selectedNewCategory);
				});
			} else if (selectedCategory && 'all' !== selectedCategory) {
				// Legacy category filtering as a fallback
				allPatterns = allPatterns.filter((pattern) => pattern.categories?.includes(selectedCategory));
			}
		}

		if (contextTab === 'design' && layoutFilter && layoutFilter.length > 0) {
			allPatterns = allPatterns.filter((pattern) => {
				return pattern.layout && Object.keys(pattern.layout).some((key) => layoutFilter.includes(key));
			});
		}
		if (contextTab === 'design' && componentFilter && componentFilter.length > 0) {
			allPatterns = allPatterns.filter((pattern) => {
				// Check if the pattern has a component object and if any of its keys are in the componentFilter array
				return pattern.component && Object.keys(pattern.component).some((key) => componentFilter.includes(key));
			});
		}
		if (contextTab === 'context' && contextTax) {
			allPatterns = allPatterns.filter((pattern) => pattern.contexts?.includes(contextTax));
			//allPatterns.reverse();

			allPatterns = allPatterns.sort((pattern) => (pattern?.hpcontexts?.includes(contextTax + '-hp') ? -1 : 1));
		}

		if (
			contextTab === 'context' &&
			categoryFilter &&
			categoryFilter.length > 0 &&
			styleFilter &&
			styleFilter.length > 0
		) {
			allPatterns = allPatterns.filter((pattern) => {
				return (
					pattern.categories.some((cat) => categoryFilter.includes(cat)) &&
					pattern.styles.some((style) => styleFilter.includes(style))
				);
			});
		} else if (contextTab === 'context' && categoryFilter && categoryFilter.length > 0) {
			allPatterns = allPatterns.filter((pattern) => {
				return pattern.categories.some((cat) => categoryFilter.includes(cat));
			});
		} else if (contextTab === 'context' && styleFilter && styleFilter.length > 0) {
			allPatterns = allPatterns.filter((pattern) => {
				return pattern.styles.some((style) => styleFilter.includes(style));
			});
		}

		if (useImageReplace === 'all' && imageCollection) {
			let variation = 0;
			allPatterns = allPatterns.map((item) => {
				if (variation === 11) {
					variation = 0;
				}
				if (item?.html) {
					item.html = replaceImages(
						item.html,
						imageCollection,
						item.categories,
						item.id,
						item.variation,
						teamCollection
					);
					item.content = replaceImages(
						item.content,
						imageCollection,
						item.categories,
						item.id,
						item.variation,
						teamCollection
					);
				} else {
					item.content = replaceImages(
						item.content,
						imageCollection,
						item.categories,
						item.id,
						item.variation,
						teamCollection
					);
				}
				variation++;
				return item;
			});
		}
		if (contextTab === 'context') {
			const allContext = getAllContext();
			let variation = 0;
			allPatterns = allPatterns.map((item) => {
				if (variation === 11) {
					variation = 0;
				}
				if (item?.html) {
					item.html = replaceContent(item.html, allContext, item.categories, aiContext, item.variation, true);
					// item.content = replaceContent(item.content, allContext, item.categories, aiContext, item.variation);
					if (userData?.locationType && 'Online Only' !== userData?.locationType && userData?.locationInput) {
						item.html = replaceAddressContent(item.html, userData.locationInput);
					}
				} else {
					item.content = replaceContent(item.content, allContext, item.categories, aiContext, item.variation);
				}
				variation++;
				return item;
			});
		}

		// Apply Sorting
		if (sortBy === 'name_asc') {
			allPatterns.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortBy === 'name_desc') {
			allPatterns.sort((a, b) => b.name.localeCompare(a.name));
		} else {
			// Default sort: id_desc (Last Added)
			allPatterns.sort((a, b) => b.id - a.id);
		}

		return searchItems(allPatterns, filterValue);
	}, [
		filterValue,
		selectedCategory,
		selectedNewCategory,
		thePatterns,
		aiContext,
		contextTab,
		imageCollection,
		useImageReplace,
		aINeedsData,
		categoryFilter,
		styleFilter,
		layoutFilter,
		componentFilter,
		sortBy,
		getContextState,
		getContextContent,
		getAllContext,
		userData,
		teamCollection,
	]);

	const hasHTml = useMemo(() => {
		return patterns[Object.keys(patterns)[0]]?.html ? true : false;
	}, [patterns]);

	// Announce search results on change.
	useEffect(() => {
		if (!filterValue) {
			return;
		}
		const count = filteredBlockPatterns.length;
		const resultsFoundMessage = sprintf(
			/* translators: %d: number of results. */
			_n('%d pattern found.', '%d patterns found.', count),
			count
		);
		debouncedSpeak(resultsFoundMessage);
	}, [filterValue, debouncedSpeak, filteredBlockPatterns.length]);

	// Define selected style.
	const customStyles = useMemo(() => {
		let tempStyles = '';
		if (!selectedStyle || 'light' === selectedStyle) {
			tempStyles = tempStyles.concat(
				`body {--global-content-edge-padding: 3rem;padding:0px !important;}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}`
			);
		}
		if ('dark' === selectedStyle) {
			tempStyles =
				tempStyles.concat(`body {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/12/logo-placeholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-divider-bottom-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}.kb-divider-static.kb-divider-top-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}`);
		} else if ('highlight' === selectedStyle) {
			tempStyles =
				tempStyles.concat(`body {--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important; }.kb-submit-field .kb-forms-submit, .kb-btns-outer-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btns-outer-wrap .kb-button.kb-btn-global-outline {color:${kadence_blocks_params.global_colors['--global-palette3']};border-color:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/12/logo-placeholder"] {filter: invert(1);}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}`);
		}
		if ('sm' === selectedFontSize) {
			tempStyles =
				tempStyles.concat(`.block-editor-block-list__layout.is-root-container {--global-kb-font-size-xxxl:${kadence_blocks_params.font_sizes.xxl};
			--global-kb-font-size-xxl:${kadence_blocks_params.font_sizes.xl};
			--global-kb-font-size-xl:${kadence_blocks_params.font_sizes.lg};
			--global-kb-font-size-lg:${kadence_blocks_params.font_sizes.md}; }`);
		}
		const newStyles = [{ css: tempStyles }];
		return newStyles;
	}, [selectedStyle, selectedFontSize]);

	const customShadowStyles = useMemo(() => {
		let tempStyles =
			'.pattern-shadow-wrap .single-iframe-content {--global-content-width:1200px; --global-vw:1200px !important;}img{max-width:100%}svg { height: 1em; width: 1em;}';
		if (!selectedStyle || 'light' === selectedStyle) {
			tempStyles = tempStyles.concat(
				`.single-iframe-content {--global-content-edge-padding: 3rem;padding:0px !important;}`
			);
		}
		tempStyles = tempStyles.concat(`.pattern-shadow-wrap .single-iframe-content {
			--wp--preset--color--theme-palette-1: var(--global-palette1);
			--wp--preset--color--theme-palette-2: var(--global-palette2);
			--wp--preset--color--theme-palette-3: var(--global-palette3);
			--wp--preset--color--theme-palette-4: var(--global-palette4);
			--wp--preset--color--theme-palette-5: var(--global-palette5);
			--wp--preset--color--theme-palette-6: var(--global-palette6);
			--wp--preset--color--theme-palette-7: var(--global-palette7);
			--wp--preset--color--theme-palette-8: var(--global-palette8);
			--wp--preset--color--theme-palette-9: var(--global-palette9);
		}`);

		if (!kadence_blocks_params.isKadenceT) {
			const colorClasses = `.single-iframe-content .has-theme-palette-1-color { color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette-2-color { color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette-3-color { color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette-4-color { color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette-5-color { color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette-6-color { color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette-7-color { color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette-8-color { color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette-9-color { color: var(--global-palette9); }
			.single-iframe-content .has-theme-palette1-background-color { background-color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette2-background-color { background-color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette3-background-color { background-color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette4-background-color { background-color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette5-background-color { background-color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette6-background-color { background-color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette7-background-color { background-color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette8-background-color { background-color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette9-background-color { background-color: var(--global-palette9); }`;
			tempStyles = tempStyles.concat(colorClasses);
		}
		if ('dark' === selectedStyle) {
			tempStyles =
				tempStyles.concat(`.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/12/logo-placeholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-divider-bottom-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}.kb-divider-static.kb-divider-top-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}`);
		} else if ('highlight' === selectedStyle) {
			tempStyles =
				tempStyles.concat(`.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important; }.single-iframe-content .kb-form .kadence-blocks-form-field .kb-forms-submit, .kb-buttons-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-buttons-wrap .kb-button.kb-btn-global-outline {color:${kadence_blocks_params.global_colors['--global-palette3']};border-color:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-buttons-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/12/logo-placeholder"] {filter: invert(1);}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette9']}!important}.kb-divider-static.kb-divider-bottom-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-bottom-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}.kb-divider-static.kb-divider-top-p8.kb-row-layout-wrap.wp-block-kadence-rowlayout > .kt-row-layout-top-sep svg{fill:${kadence_blocks_params.global_colors['--global-palette8']}!important}`);
		}
		if ('sm' === selectedFontSize) {
			tempStyles =
				tempStyles.concat(`.single-iframe-content {--global-kb-font-size-xxxl:${kadence_blocks_params.font_sizes.xxl};
			--global-kb-font-size-xxl:${kadence_blocks_params.font_sizes.xl};
			--global-kb-font-size-xl:${kadence_blocks_params.font_sizes.lg};
			--global-kb-font-size-lg:${kadence_blocks_params.font_sizes.md}; }`);
		}
		const newStyles = [{ css: tempStyles }];
		return newStyles;
	}, [selectedStyle, selectedFontSize]);

	const hasItems = !!filteredBlockPatterns?.length;
	if (isAIDisabled && contextTab === 'context') {
		return (
			<div className="kb-ai-dropdown-container-content-wrap activation-needed">
				<p className="kb-disabled-authorize-note">
					{__('Kadence AI is disabled by site admin.', 'kadence-blocks')}
				</p>
			</div>
		);
	}
	if (importing) {
		return (
			<div className="block-editor-block-patterns-explorer__wrap">
				<div
					className={`block-editor-block-patterns-explorer__list${
						contextTab === 'context' ? ' kb-ai-patterns-explorer' : ''
					}`}
				>
					<div className="preparing-importing-images">
						<Spinner />
						<h2>{__('Preparing Content…', 'kadence-blocks')}</h2>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div ref={setRootScroll} className="block-editor-block-patterns-explorer__wrap">
			<div
				className={`block-editor-block-patterns-explorer__list${
					(contextTab === 'context' ? ' kb-ai-patterns-explorer' : '') +
					(failedAI ? ' kb-ai-patterns-explorer-failed' : '')
				}`}
			>
				{/* Removed PatternsListHeader call */}
				{/* { ! hasItems && ( selectedCategory && ( selectedCategory === 'posts-loop' || selectedCategory === 'featured-products' || selectedCategory === 'product-loop' ) ) && (
					<BannerHeader
						selectedCategory={ selectedCategory }
					/>
				) } */}
				{contextTab === 'context' && (!isAuthorized || !data_key) && (
					<ProOnlyHeader launchWizard={launchWizard} />
				)}
				{contextTab === 'context' && isAuthorized && data_key && aINeedsData && (
					<LaunchWizard launchWizard={() => launchWizard()} />
				)}
				{contextTab === 'context' && failedAI && <LoadingFailedHeader type={failedAIType} />}
				{contextTab !== 'context' && failed && <FailedHeader type={failedType} />}
				{contextTab === 'context' &&
					!aINeedsData &&
					('processing' === getContextState(aiContext) || 'loading' === getContextState(aiContext)) && (
						<LoadingHeader type={getContextState(aiContext)} />
					)}
				{contextTab === 'context' &&
					!aINeedsData &&
					(!getContextState(aiContext) || 'credits' === getContextState(aiContext)) && (
						<GenerateHeader
							context={aiContext}
							contextLabel={contextLabel}
							contextState={getContextState(aiContext)}
							generateContext={(tempCon) => generateContext(tempCon)}
						/>
					)}
				{/* Ensure filters/search show even when filterValue exists */}
				{contextTab === 'context' && hasItems && !failedAI && (
					<div className="kb-patterns-filter-wrapper">
						<SearchControl
							className="kb-pattern-search-control"
							value={filterValue}
							placeholder={__('Search Patterns', 'kadence-blocks')}
							onChange={(value) => setSearch(value)}
						/>
						<span className="kb-pattern-filter-label">Filter by:</span>
						{categories.length > 0 && (
							<PatternFilterDropdown
								label="Categories"
								items={categories}
								selectedItems={updateCategoryFilter}
							/>
						)}
						{
							/* Hold off until starter templates are ready */
							// styles.length > 0 && <PatternFilterDropdown label="Styles" items={ styles } selectedItems={ updateStyleFilter } />
						}
						<span className="kb-patterns-count-message">
							{filterValue
								? sprintf(
										/* translators: %d: number of patterns. %s: block pattern search query */
										_n(
											'%1$d pattern for "%2$s"',
											'%1$d patterns for "%2$s"',
											filteredBlockPatterns.length
										),
										filteredBlockPatterns.length,
										filterValue
								  )
								: sprintf(
										/* translators: %d: number of patterns. */
										_n('%d pattern', '%d patterns', filteredBlockPatterns.length),
										filteredBlockPatterns.length
								  )}
						</span>
						<div className="kb-patterns-filter-wrapper-sort-by">
							<span className="kb-pattern-filter-label">Sort by:</span>
							<PatternSortDropdown selectedItems={setSortBy} />
						</div>
					</div>
				)}
				{/* Ensure filters/search show even when filterValue exists */}
				{contextTab === 'design' && !failedAI && (
					<div className="kb-patterns-filter-wrapper">
						<SearchControl
							className="kb-pattern-search-control"
							value={filterValue}
							placeholder={__('Search Patterns', 'kadence-blocks')}
							onChange={(value) => setSearch(value)}
						/>
						<span className="kb-pattern-filter-label">Filter by:</span>
						<PatternLayoutDropdown selectedItems={updateLayoutFilter} />
						{uniqueComponentOptions.length > 0 && (
							<PatternComponentDropdown
								label={__('Components', 'kadence-blocks')}
								items={uniqueComponentOptions}
								selectedItems={updateComponentFilter}
							/>
						)}
						<span className="kb-patterns-count-message">
							{filterValue
								? sprintf(
										/* translators: %d: number of patterns. %s: block pattern search query */
										_n(
											'%1$d pattern for "%2$s"',
											'%1$d patterns for "%2$s"',
											filteredBlockPatterns.length
										),
										filteredBlockPatterns.length,
										filterValue
								  )
								: sprintf(
										/* translators: %d: number of patterns. */
										_n('%d pattern', '%d patterns', filteredBlockPatterns.length),
										filteredBlockPatterns.length
								  )}
						</span>
						<div className="kb-patterns-filter-wrapper-sort-by">
							<span className="kb-pattern-filter-label">Sort by:</span>
							<PatternSortDropdown selectedItems={setSortBy} />
						</div>
					</div>
				)}
				{hasItems && !failedAI && (
					<KadenceBlockPatternList
						selectedCategory={selectedCategory}
						blockPatterns={filteredBlockPatterns}
						patternsHTML={patternsHTML}
						onClickPattern={onSelectBlockPattern}
						showTitlesAsTooltip={false}
						customStyles={customStyles}
						customShadowStyles={customShadowStyles}
						breakpointCols={breakpointCols}
						previewMode={previewMode}
						selectedStyle={selectedStyle}
						rootScroll={rootScroll}
					/>
				)}
				{!hasItems && !failedAI && getContextState(aiContext) && (
					<div className="kb-patterns-filter-wrapper">
						{__('No patterns were found based on the selected filters.', 'kadence-blocks')}
					</div>
				)}
			</div>
		</div>
	);
}

function PatternComponentDropdown({ label, items, selectedItems }) {
	const [componentOptions, setComponentOptions] = useState(items);
	const [selectedComponents, setSelectedComponents] = useState([]);

	// Update internal state if items prop changes
	useEffect(() => {
		setComponentOptions((prevOptions) => {
			// Preserve checked state when items update
			const currentSelectedValues = new Set(prevOptions.filter((o) => o.checked).map((o) => o.value));
			return items.map((item) => ({
				...item,
				checked: currentSelectedValues.has(item.value),
			}));
		});
	}, [items]);

	useEffect(() => {
		if (componentOptions && componentOptions.length) {
			const temp = componentOptions.filter((component) => component.checked);
			setSelectedComponents(temp);

			if (selectedItems) {
				selectedItems(temp);
			}
		}
	}, [componentOptions, selectedItems]);

	const filterIcon = (
		<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1.175 0.158203L5 3.97487L8.825 0.158203L10 1.3332L5 6.3332L0 1.3332L1.175 0.158203Z"
				fill="#020129"
			/>
		</svg>
	);

	const clearFilter = () => {
		setComponentOptions(componentOptions.map((component) => ({ ...component, checked: false })));
	};

	const updateSelection = (bool, index) => {
		setComponentOptions((prevOptions) => {
			const cloned = [...prevOptions];
			cloned[index] = { ...cloned[index], checked: bool };
			return cloned;
		});
	};

	return (
		<Dropdown
			variant="unstyled"
			className="kb-patterns-filter-dropdown"
			contentClassName="kb-patterns-filter-dropdown-content"
			popoverProps={{ placement: 'bottom-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} aria-expanded={isOpen} className="kb-toggle-button">
					<div className="kb-toggle-button-wrapper">
						<span>
							{label} {selectedComponents.length > 0 ? `(${selectedComponents.length})` : ''}
						</span>
						{filterIcon}
					</div>
				</Button>
			)}
			renderContent={() => (
				<div>
					<div className="kb-patterns-filter-dropdown-content-inner">
						{componentOptions && componentOptions.length > 0 ? (
							componentOptions.map(
								(component, i) =>
									component.value && (
										<div className="kb-pattern-filter-item" key={component.value}>
											<CheckboxControl
												checked={component.checked}
												id={component.value}
												label={component.label}
												onChange={(bool) => updateSelection(bool, i)}
											/>
										</div>
									)
							)
						) : (
							<div className="kb-pattern-filter-item">{__('No components found', 'kadence-blocks')}</div>
						)}
					</div>
					{componentOptions && componentOptions.length > 0 && (
						<div className="kb-pattern-filter-dropdown-content-clear" onClick={(_e) => clearFilter()}>
							{__('Clear', 'kadence-blocks')}
						</div>
					)}
				</div>
			)}
		/>
	);
}

export default PatternList;
