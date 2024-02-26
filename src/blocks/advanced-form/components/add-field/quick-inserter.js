/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, SearchControl, TabPanel } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
	getBlockMenuDefaultClassName,
} from '@wordpress/blocks';
import { sortBy } from 'lodash';
/**
 * Internal dependencies
 */
import useInsertionPoint from './use-insertion-point';
import InserterListItem from './insert-list-item';

const SEARCH_THRESHOLD = 6;
const SHOWN_BLOCK_TYPES = 6;
const SHOWN_BLOCK_PATTERNS = 2;
const SHOWN_BLOCK_PATTERNS_WITH_PRIORITIZATION = 4;
const fieldBlocks = [
	'kadence/advanced-form-text',
	'kadence/advanced-form-email',
	'kadence/advanced-form-textarea',
	'kadence/advanced-form-select',
	'kadence/advanced-form-radio',
	'kadence/advanced-form-telephone',
	'kadence/advanced-form-checkbox',
	'kadence/advanced-form-number',
];
const advancedFieldBlocks = [
	'kadence/advanced-form-file',
	'kadence/advanced-form-time',
	'kadence/advanced-form-date',
	'kadence/advanced-form-accept',
	'kadence/advanced-form-hidden',
];
const submitBlocks = ['kadence/advanced-form-submit', 'kadence/advanced-form-captcha'];
const layoutBlocks = [
	'core/paragraph',
	'kadence/advancedheading',
	'kadence/column',
	'kadence/rowlayout',
	'kadence/spacer',
];

/**
 * Retrieves the block types inserter state.
 *
 * @param {string=}  rootClientId Insertion's root client ID.
 * @param {Function} onInsert     function called when inserter a list of blocks.
 * @return {Array} Returns the block types state. (block types, categories, collections, onSelect handler)
 */
const useBlockTypesState = (rootClientId, onInsert) => {
	const { submitItems, layoutItems, formItems, formAdvItems } = useSelect(
		(select) => {
			const { getInserterItems } = select(blockEditorStore);
			const allItems = getInserterItems(rootClientId);
			let formItems = allItems.filter((item) => fieldBlocks.includes(item.id));
			let formAdvItems = allItems.filter((item) => advancedFieldBlocks.includes(item.id));
			const submitItems = allItems.filter((item) => submitBlocks.includes(item.id));
			let layoutItems = allItems.filter((item) => layoutBlocks.includes(item.id));
			formItems = sortBy(formItems, function (item) {
				return fieldBlocks.indexOf(item.name);
			});
			formAdvItems = sortBy(formAdvItems, function (item) {
				return advancedFieldBlocks.indexOf(item.name);
			});
			layoutItems = sortBy(layoutItems, function (item) {
				return layoutBlocks.indexOf(item.name);
			});
			return {
				submitItems: submitItems,
				layoutItems: layoutItems,
				formItems: formItems,
				formAdvItems: formAdvItems,
			};
		},
		[rootClientId]
	);

	const onSelectItem = useCallback(
		({ name, initialAttributes, innerBlocks }, shouldFocusBlock, destinationIndex) => {
			const insertedBlock = createBlock(
				name,
				initialAttributes,
				createBlocksFromInnerBlocksTemplate(innerBlocks)
			);

			onInsert(insertedBlock, undefined, shouldFocusBlock, destinationIndex);
		},
		[onInsert]
	);

	return [formItems, formAdvItems, layoutItems, submitItems, onSelectItem];
};

export default function QuickInserter({
	onSelect,
	rootClientId,
	clientId,
	isAppender,
	insertionIndex,
	prioritizePatterns,
	selectBlockOnInsert,
	orderInitialBlockItems,
}) {
	const [filterValue, setFilterValue] = useState('');
	const [destinationRootClientId, onInsertBlocks] = useInsertionPoint({
		onSelect,
		rootClientId,
		clientId,
		isAppender,
		selectBlockOnInsert,
	});
	const [blockTypes, formAdvItems, blockLayoutItems, blockSubmitItems, onSelectBlockType] = useBlockTypesState(
		destinationRootClientId,
		onInsertBlocks
	);
	const { setInserterIsOpened, insertIndex } = useSelect(
		(select) => {
			const { getSettings, getBlockIndex, getBlockCount } = select(blockEditorStore);
			const settings = getSettings();
			const index = getBlockIndex(clientId);
			const blockCount = getBlockCount();

			return {
				setInserterIsOpened: settings.__experimentalSetIsInserterOpened,
				insertIndex: index === -1 ? blockCount - 1 : index,
			};
		},
		[clientId]
	);
	useEffect(() => {
		if (setInserterIsOpened) {
			setInserterIsOpened(false);
		}
	}, [setInserterIsOpened]);
	const BlockSelectList = ({ name }) => {
		switch (name) {
			case 'layout':
				return (
					<>
						{blockLayoutItems.map((item, j) => (
							<InserterListItem
								key={item.id}
								item={item}
								className={getBlockMenuDefaultClassName(item.id)}
								onSelect={(selectItem, evt) =>
									onSelectBlockType(selectItem, true, insertionIndex ? insertionIndex : insertIndex)
								}
							/>
						))}
					</>
				);
				break;
			case 'extra':
				return (
					<>
						{blockSubmitItems.map((item, j) => (
							<InserterListItem
								key={item.id}
								item={item}
								className={getBlockMenuDefaultClassName(item.id)}
								onSelect={(selectItem, evt) =>
									onSelectBlockType(selectItem, true, insertionIndex ? insertionIndex : insertIndex)
								}
							/>
						))}
					</>
				);
				break;
			case 'advanced':
				return (
					<>
						{formAdvItems.map((item, j) => (
							<InserterListItem
								key={item.id}
								item={item}
								className={getBlockMenuDefaultClassName(item.id)}
								onSelect={(selectItem, evt) =>
									onSelectBlockType(selectItem, true, insertionIndex ? insertionIndex : insertIndex)
								}
							/>
						))}
					</>
				);
				break;
			default:
				return (
					<>
						{blockTypes.map((item, j) => (
							<InserterListItem
								key={item.id}
								item={item}
								className={getBlockMenuDefaultClassName(item.id)}
								onSelect={(selectItem, evt) =>
									onSelectBlockType(selectItem, true, insertionIndex ? insertionIndex : insertIndex)
								}
							/>
						))}
					</>
				);
				break;
		}
	};

	return (
		<div
			className={classnames('block-editor-inserter__quick-inserter', {
				'has-expand': setInserterIsOpened,
			})}
		>
			{/* { showSearch && (
				<SearchControl
					__nextHasNoMarginBottom
					className="block-editor-inserter__search"
					value={ filterValue }
					onChange={ ( value ) => {
						setFilterValue( value );
					} }
					label={ __( 'Search for blocks and patterns' ) }
					placeholder={ __( 'Search' ) }
				/>
			) } */}

			<div className="kb-custom-insert">
				<TabPanel
					className="kb-custom-insert_tabs"
					activeClass="active-insert-list"
					tabs={[
						{
							name: 'fields',
							title: (
								<span className="insert-tab-title-wrap">
									<span className="insert-tab-subtitle">{__('Standard', 'kadence-blocks')}</span>
									<span className="insert-tab-title">{__('Fields', 'kadence-blocks')}</span>
								</span>
							),
						},
						{
							name: 'advanced',
							title: (
								<span className="insert-tab-title-wrap">
									<span className="insert-tab-subtitle">{__('Advanced', 'kadence-blocks')}</span>
									<span className="insert-tab-title">{__('Fields', 'kadence-blocks')}</span>
								</span>
							),
						},
						{
							name: 'layout',
							title: __('Layout', 'kadence-blocks'),
						},
						{
							name: 'extra',
							title: __('Misc', 'kadence-blocks'),
						},
					]}
				>
					{(tab) => (
						<div className="kb-custom-insert__list">
							<BlockSelectList name={tab.name} />
						</div>
					)}
				</TabPanel>
			</div>
		</div>
	);
}
