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
import { useEffect, useState, useMemo } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { getAsyncData } from './data-fetch/get-async-data';
import { Button, TextControl, SelectControl, VisuallyHidden, Spinner } from '@wordpress/components';
import { previous, update, next, cloud, settings, sync } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

function CloudLibrarySidebar({
	connection,
	setSubTab,
	subTab,
	pageCategory,
	setPageCategory,
	pageCategories,
	categories,
	category,
	setCategory,
	search,
}) {
	const [popoverAnchor, setPopoverAnchor] = useState();
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	const activePageCategorySlug = pageCategory?.[connection.slug];
	const activeCategorySlug = category?.[connection.slug];

	return (
		<div className="kt-prebuilt-sidebar kb-section-sidebar">
			<div className="kb-prebuilt-sidebar-header-wrap">
				<div className="kb-prebuilt-sidebar-header kb-prebuilt-library-logo">
					<span className="kb-prebuilt-header-logo">{connection?.logo || cloud}</span>
					{false && (
						<div className="kb-library-style-popover">
							<Button
								className={'kb-trigger-extra-settings'}
								icon={settings}
								ref={setPopoverAnchor}
								isPressed={isVisible}
								disabled={isVisible}
								onClick={toggleVisible}
							/>
							{isVisible && (
								<Popover
									className="kb-library-extra-settings"
									placement="top-end"
									onClose={debounce(toggleVisible, 100)}
									anchor={popoverAnchor}
								>
									<Button
										iconPosition="left"
										icon={sync}
										text={__('Resync Connection Info', 'kadence-blocks')}
										onClick={() => {
											console.log('resync');
										}}
									/>
								</Popover>
							)}
						</div>
					)}
				</div>
				{connection?.pages && (
					<div className="kb-library-sidebar-context-choices">
						<Button
							className={
								'kb-context-tab-button kb-trigger-patterns' +
								(subTab === 'patterns' ? ' is-pressed' : '')
							}
							aria-pressed={subTab === 'patterns'}
							onClick={() => {
								const tempActiveStorage = SafeParseJSON(
									localStorage.getItem('kadenceBlocksPrebuilt'),
									true
								);
								tempActiveStorage.subTab = 'patterns';
								localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
								setSubTab('patterns');
							}}
						>
							{__('Patterns', 'kadence-blocks')}
						</Button>
						<Button
							className={
								'kb-context-tab-button kb-trigger-pages' + (subTab === 'pages' ? ' is-pressed' : '')
							}
							aria-pressed={subTab === 'pages'}
							onClick={() => {
								const tempActiveStorage = SafeParseJSON(
									localStorage.getItem('kadenceBlocksPrebuilt'),
									true
								);
								tempActiveStorage.subTab = 'pages';
								localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
								setSubTab('pages');
							}}
						>
							{__('Pages', 'kadence-blocks')}
						</Button>
					</div>
				)}
			</div>
			<div className="kb-prebuilt-sidebar-body-wrap">
				<div className="kb-library-sidebar-bottom-wrap">
					<div className="kb-library-sidebar-bottom kb-design-library-categories">
						{subTab === 'pages' ? (
							<>
								{!search && (
									<>
										{pageCategories.map((tempPageCategory, index) => (
											<Button
												key={`${tempPageCategory.value}-${index}`}
												className={
													'kb-category-button' +
													(activePageCategorySlug === tempPageCategory.value
														? ' is-pressed'
														: '')
												}
												aria-pressed={activePageCategorySlug === tempPageCategory.value}
												onClick={() => {
													const newCat = category;
													newCat[connection?.slug] = tempPageCategory.value;
													setPageCategory(newCat);
												}}
											>
												{tempPageCategory.label}
											</Button>
										))}
									</>
								)}
							</>
						) : (
							<>
								{!search && (
									<>
										{categories.map((tempCat, index) => (
											<Button
												key={`${tempCat.value}-${index}`}
												className={
													'kb-category-button' +
													(activeCategorySlug === tempCat.value ? ' is-pressed' : '')
												}
												aria-pressed={activeCategorySlug === tempCat.value}
												onClick={() => {
													const newCat = category;
													newCat[connection?.slug] = tempCat.value;
													console.log(newCat);
													setCategory(newCat);
												}}
											>
												{tempCat.label}
											</Button>
										))}
									</>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CloudLibrarySidebar;
