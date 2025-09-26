import {
	Popover,
	TextControl,
	PanelBody,
	SelectControl,
	Icon,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { debounce, get } from 'lodash';
import { applyFilters } from '@wordpress/hooks';
import { useState, useMemo, useEffect, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useInView } from 'react-intersection-observer';
import { default as GenIcon } from '../icons/gen-icon';
import { plus, chevronDown, closeSmall } from '@wordpress/icons';
import './editor.scss';
import SvgAddModal from './svg-add-modal';
import SvgDeleteModal from './svg-delete-modal';
import { compareVersions } from '@kadence/helpers';
import { default as IconRender } from '../icons/icon-render';

const IconGroup = ({
	group,
	iconRenderFunction,
	handleSelect,
	debounceToggle,
	translatedCustomSvgString,
	search,
	isSupportedProVersion,
	hasPro,
	setIsOpen,
	setDeleteId,
	setIsDeleteOpen,
}) => {
	const { ref, inView } = useInView({ threshold: 0 });
	const [limit, setLimit] = useState(150);
	const iconKeys = Object.keys(group?.icons || {});

	useEffect(() => {
		if (inView) {
			setLimit((current) => Math.min(current + 150, iconKeys.length));
		}
	}, [inView, iconKeys.length]);

	useEffect(() => {
		setLimit(150);
	}, [search, group?.label]);

	if (iconKeys.length === 0) {
		return null;
	}

	const visibleKeys = iconKeys.slice(0, limit);

	return (
		<PanelBody title={group.label} key={group.label}>
			<div className="kadence-icon-grid-wrap">
				{group.label === translatedCustomSvgString && search === '' && isSupportedProVersion && hasPro && (
					<button
						className={'kadence-icon-picker-link add-custom-svg'}
						onClick={() => {
							setIsOpen(true);
							debounceToggle();
						}}
					>
						<Icon icon={plus} />
					</button>
				)}
				{visibleKeys.map((iconKey) => {
					if (group.label === translatedCustomSvgString && iconKey === 'placeholder') {
						return null;
					}

					const iconData = group.icons[iconKey];

					if (!iconData || !iconData.slug) {
						return null;
					}

					if (group.label === translatedCustomSvgString) {
						return (
							<div className={'kb-custom-svg'} key={iconKey}>
								{hasPro && isSupportedProVersion && (
									<div
										className={'custom-svg-delete'}
										onClick={() => {
											setDeleteId(iconKey);
											setIsDeleteOpen(true);
										}}
									>
										<Icon icon={closeSmall} size={20} />
									</div>
								)}
								<button
									className={'kadence-icon-picker-link'}
									onClick={() => {
										handleSelect(iconData.slug);
										debounceToggle();
									}}
								>
									{iconRenderFunction(iconData.slug)}
								</button>
							</div>
						);
					}

					return (
						<button
							className={'kadence-icon-picker-link'}
							key={`${group.label}${iconKey}`}
							onClick={() => {
								handleSelect(iconData.slug);
								debounceToggle();
							}}
						>
							{iconRenderFunction(iconData.slug)}
						</button>
					);
				})}
			</div>
			{limit < iconKeys.length && <div style={{ height: '100px' }} ref={ref} />}
		</PanelBody>
	);
};

export default function KadenceIconPicker({
	value,
	onChange,
	label,
	placeholder = __('Select Icon', 'kadence-blocks'),
	showSearch = true,
	renderFunc = null,
	className,
	theme = 'default',
	allowClear = false,
	icons = null,
}) {
	const [popoverAnchor, setPopoverAnchor] = useState();
	const [isVisible, setIsVisible] = useState(false);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('all');
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const { storeIcons, areIconsLoaded } = useSelect(
		(select) => {
			const dataStore = select('kadenceblocks/data');
			if (!dataStore) {
				return {
					storeIcons: null,
					areIconsLoaded: false,
				};
			}
			return {
				storeIcons: dataStore.getIcons(),
				areIconsLoaded: dataStore.areIconsLoaded(),
			};
		},
		[]
	);

	const dispatchers = useDispatch('kadenceblocks/data');
	const fetchIcons = dispatchers?.fetchIcons;

	useEffect(() => {
		if (!icons && typeof fetchIcons === 'function' && !areIconsLoaded) {
			fetchIcons();
		}
	}, [icons, fetchIcons, areIconsLoaded]);

	const hasPro =
		typeof kadence_blocks_params !== 'undefined' &&
		kadence_blocks_params &&
		kadence_blocks_params.pro &&
		kadence_blocks_params.pro === 'true';
	const proVersion = window?.kbpData ? get(window.kbpData, ['pVersion'], '1.0.0') : '1.0.0';
	const isSupportedProVersion = compareVersions(proVersion, '2.4.0') >= 0;

	const toggleVisible = useCallback(() => {
		setIsVisible((previous) => !previous);
	}, []);

	const debounceToggle = useMemo(() => debounce(toggleVisible, 100), [toggleVisible]);

	useEffect(() => () => debounceToggle.cancel(), [debounceToggle]);

	const translatedCustomSvgString = __('My Icons', 'kadence-blocks');

	const iconOptions = useMemo(() => {
		if (!storeIcons || !areIconsLoaded) {
			return {};
		}

		const combinedIcons = storeIcons?.combinedIcons || {};
		return applyFilters('kadence.icon_options', combinedIcons);
	}, [storeIcons, areIconsLoaded]);

	const iconNames = useMemo(() => {
		if (icons) {
			return icons;
		}

		if (!storeIcons || !areIconsLoaded) {
			return {};
		}

		const iconNamesData = {};
		const lineIcons = Object.keys(storeIcons.lineIcons || {});
		const solidIcons = Object.keys(storeIcons.solidIcons || {});
		const customIcons = Object.keys(storeIcons.custom || {});

		if (lineIcons.length) {
			iconNamesData[__('Line Icons', 'kadence-blocks')] = lineIcons;
		}
		if (solidIcons.length) {
			iconNamesData[__('Solid Icons', 'kadence-blocks')] = solidIcons;
		}

		const filteredGroups = applyFilters('kadence.icon_options_names', iconNamesData);

		if (customIcons.length > 0) {
			return { [translatedCustomSvgString]: customIcons, ...filteredGroups };
		}

		if (hasPro && isSupportedProVersion) {
			return { [translatedCustomSvgString]: ['placeholder'], ...filteredGroups };
		}

		return filteredGroups;
	}, [
		icons,
		storeIcons,
		areIconsLoaded,
		translatedCustomSvgString,
		hasPro,
		isSupportedProVersion,
	]);

	const iconFilterOptions = useMemo(() => {
		if (icons) {
			return [{ value: 'all', label: __('Show All', 'kadence-blocks') }];
		}

		if (!iconNames || Array.isArray(iconNames) || Object.keys(iconNames).length === 0) {
			return [{ value: 'all', label: __('Show All', 'kadence-blocks') }];
		}

		const groups = Object.keys(iconNames).map((groupLabel, index) => ({
			value: index,
			label: groupLabel,
		}));

		return [{ value: 'all', label: __('Show All', 'kadence-blocks') }, ...groups];
	}, [icons, iconNames]);

	const iconRenderFunc = useCallback(
		(iconSlug) => {
			if (!iconSlug) {
				return null;
			}

			if (!iconOptions[iconSlug]) {
				return <IconRender className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} />;
			}

			return <GenIcon className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} icon={iconOptions[iconSlug]} />;
		},
		[iconOptions]
	);

	const iconRenderFunction = useCallback(
		(iconSlug) => {
			if (renderFunc) {
				return renderFunc(iconSlug, iconOptions[iconSlug]);
			}

			return iconRenderFunc(iconSlug);
		},
		[renderFunc, iconOptions, iconRenderFunc]
	);

	const results = useMemo(() => {
		if (icons) {
			return {};
		}

		if (!iconNames || Array.isArray(iconNames) || Object.keys(iconNames).length === 0) {
			return {};
		}

		const searchLower = search.toLowerCase();
		const labels = Object.keys(iconNames);

		return labels.reduce((accumulator, label, groupIndex) => {
			const iconList = iconNames[label];

			if (!Array.isArray(iconList) || iconList.length === 0) {
				return accumulator;
			}

			if (filter !== 'all' && groupIndex !== parseInt(filter, 10)) {
				return accumulator;
			}

			let iconsToDisplay = iconList.filter((icon) => {
				if (label === translatedCustomSvgString && icon === 'placeholder') {
					return search === '';
				}
				const iconLower = icon.toLowerCase();
				return search === '' || iconLower.includes(searchLower);
			});

			if (!iconsToDisplay.length) {
				if (label !== translatedCustomSvgString || search !== '') {
					return accumulator;
				}

				iconsToDisplay = ['placeholder'];
			}

			const iconsMap = iconsToDisplay.reduce((map, icon) => {
				map[icon] = { slug: icon };
				return map;
			}, {});

			const hasRenderableIcon = Object.keys(iconsMap).some((key) => {
				return !(label === translatedCustomSvgString && key === 'placeholder');
			});

			if (!hasRenderableIcon && label !== translatedCustomSvgString) {
				return accumulator;
			}

			accumulator[groupIndex.toString()] = {
				label,
				icons: iconsMap,
			};

			return accumulator;
		}, {});
	}, [icons, iconNames, filter, search, translatedCustomSvgString]);

	const shouldShowSpinner = !icons && !areIconsLoaded;
	const showNoResultsMessage = !icons && areIconsLoaded && Object.keys(results).length === 0;

	const handleSelectIcon = useCallback(
		(iconSlug) => {
			if (typeof onChange === 'function') {
				onChange(iconSlug);
			}
		},
		[onChange]
	);

	const deleteCallback = useCallback(() => {
		if (typeof fetchIcons === 'function') {
			fetchIcons();
		}
		setDeleteId(null);
	}, [fetchIcons]);

	const addCallback = useCallback(
		(postId) => {
			if (typeof onChange === 'function') {
				onChange(`kb-custom-${postId.toString()}`);
			}
			if (typeof fetchIcons === 'function') {
				fetchIcons();
			}
		},
		[onChange, fetchIcons]
	);

	const selectedDisplay = value ? iconRenderFunction(value) || value : placeholder;

	return (
		<div className={'kadence-icon-picker'}>
			<SvgAddModal isOpen={isOpen} setIsOpen={setIsOpen} callback={addCallback} proVersion={proVersion} />
			<SvgDeleteModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} id={deleteId} callback={deleteCallback} />
			<div className={`kadence-icon-picker-selection kadence-icon-picker-theme-${theme ? theme : 'default'}${className ? ' ' + className : ''}`}>
				{label && (
					<div className="kadence-icon-picker__title">
						<label className="components-base-control__label">{label}</label>
					</div>
				)}
				<div className='kadence-icon-picker-toggle-wrap'>
					<button
						onClick={() => debounceToggle()}
						ref={setPopoverAnchor}
						className={'kadence-icon-picker-link kadence-icon-picker-selection-toggle'}
					>
						<span className={`kadence-icon-picker-selection-value${!value ? ' kadence-icon-picker-placeholder' : ''}`}>{selectedDisplay}</span>
						<span className='kadence-icon-picker-selection-arrow'><Icon icon={chevronDown}></Icon></span>
					</button>
					{value && allowClear && (
						<button
							className='kadence-icon-picker-clear'
							onClick={() => {
								onChange('');
								setIsVisible(false);
							}}
						>
							<Icon icon={closeSmall}></Icon>
						</button>
					)}
				</div>
			</div>

			{isVisible &&
				<Popover
					headerTitle={__( 'Select Icon', 'kadence-blocks' )}
					noArrow={false}
					onClose={debounceToggle}
					placement="bottom-end"
					anchor={popoverAnchor}
					className={`kadence-icon-picker-pop-selection kadence-icon-picker-pop-theme-${theme ? theme : 'default'}`}
				>
					<div className="kadence-icon-picker-container">
						{showSearch && (
							<div className={'kadence-icon-picker-search'}>
								<TextControl
									label={__( 'Search Icons', 'kadence-blocks' )}
									hideLabelFromVision={true}
									value={search}
									placeholder={__( 'Search Icons', 'kadence-blocks' )}
									onChange={( newValue ) => setSearch( newValue )}
								/>
								<SelectControl
									label={__( 'Filter Icons', 'kadence-blocks' )}
									hideLabelFromVision={true}
									value={filter}
									options={iconFilterOptions}
									onChange={setFilter}
								/>
							</div>
						)}
						<div className={`kadence-icon-picker-content${showSearch ? ' has-search' : ''}`}>
							{icons && (
								<div className='kadence-icon-grid-wrap'>
									{icons.map((iconKey) => (
										<button
											className={'kadence-icon-picker-link'}
											onClick={() => {
												onChange(iconKey);
												debounceToggle();
											}}
										>
											{iconRenderFunction(iconKey)}
										</button>
									))}
								</div>
							)}
							{!icons && (
								<>
									{shouldShowSpinner && (
										<div className='kadence-icon-grid-loading'>
											<Spinner />
										</div>
									)}
									{showNoResultsMessage && (
										<div style={{ padding: '15px' }}>
											<p>{__( 'No icons found', 'kadence-blocks' )}</p>
										</div>
									)}
									{Object.keys(results).map((groupKey) => (
										<IconGroup
											key={groupKey}
											group={results[groupKey]}
											iconRenderFunction={iconRenderFunction}
											handleSelect={handleSelectIcon}
											debounceToggle={debounceToggle}
											translatedCustomSvgString={translatedCustomSvgString}
											search={search}
											isSupportedProVersion={isSupportedProVersion}
											hasPro={hasPro}
											setIsOpen={setIsOpen}
											setDeleteId={setDeleteId}
											setIsDeleteOpen={setIsDeleteOpen}
										/>
									))}
								</>
							)}
						</div>
					</div>
				</Popover>
			}
		</div>
	);
}
