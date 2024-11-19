/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { PostSelectorCheckbox, KadenceRadioButtons } from '@kadence/components';
import { createBlock } from '@wordpress/blocks';
import { TextControl, Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import MenuEdit from './edit';
import './editor.scss';

export default function MenuEditor({
	clientId,
	closeModal,
	title,
	setTitle,
	updateBlocksCallback,
	orientation,
	orientationTablet,
	setMetaAttribute,
}) {
	const [sidebarTab, setSidebarTab] = useState('page');

	const { blocks } = useSelect(
		(select) => {
			const { getBlock, getBlockOrder } = select('core/block-editor');
			const topLevelIds = getBlockOrder(clientId);

			return {
				blocks: topLevelIds.map((_id) => getBlock(_id)),
			};
		},
		[clientId]
	);

	const { addStash } = useDispatch('kadenceblocks/data');
	useEffect(() => {
		addStash('open-navigation-builder', clientId);
	}, [clientId]);

	const onSelect = (posts) => {
		const navItems = [];

		posts.forEach((post) => {
			navItems.push(
				createBlock('kadence/navigation-link', {
					label: post.title.rendered,
					url: post.link,
					id: post.id,
					type: post.type,
					kind: 'post-type',
					uniqueID: Math.random().toString(36).substr(2, 9),
				})
			);
		});

		if (navItems.length !== 0) {
			updateBlocksCallback(navItems);
			// wp.data.dispatch('core/block-editor').insertBlocks(navItems, 99999, clientId, false, null);
		}
	};

	return (
		<div className="kb-menu-visual-editor">
			<div className="left-column">
				<div className="menu-container">
					<KadenceRadioButtons
						label={__('Desktop Orientation', 'kadence-blocks')}
						value={orientation !== '' ? orientation : 'horizontal'}
						options={[
							{ value: 'vertical', label: __('Vertical', 'kadence-blocks') },
							{ value: 'horizontal', label: __('Horizontal', 'kadence-blocks') },
						]}
						hideLabel={false}
						onChange={(value) => {
							setMetaAttribute(value, 'orientation');
						}}
					/>

					<KadenceRadioButtons
						label={__('Tablet Orientation', 'kadence-blocks')}
						value={
							orientationTablet !== ''
								? orientationTablet
								: orientation !== ''
								? orientation
								: 'horizontal'
						}
						// technically there should be a third option here, 'inherit', as the default. but that doesn't fit into the design well..
						options={[
							{ value: 'vertical', label: __('Vertical', 'kadence-blocks') },
							{ value: 'horizontal', label: __('Horizontal', 'kadence-blocks') },
						]}
						hideLabel={false}
						onChange={(value) => {
							setMetaAttribute(value, 'orientationTablet');
						}}
					/>

					{kadence_blocks_params.postTypesSearchable.map((postType) => (
						<PostSelectorCheckbox
							key={postType.value}
							forceOpen={sidebarTab === postType.value}
							useForceState={true}
							onPanelBodyToggle={() =>
								setSidebarTab(sidebarTab === postType.value ? null : postType.value)
							}
							postType={postType.value}
							title={postType.label}
							onSelect={onSelect}
						/>
					))}
				</div>
				<div className={'add-menu'}></div>
			</div>
			<div className="right-column">
				<div>
					<TextControl
						value={title === 'Auto Draft' ? '' : title}
						onChange={setTitle}
						label={__('Navigation Name', 'kadence-blocks')}
						help={__('This is used for your reference only.', 'kadence-blocks')}
					/>

					<MenuEdit blocks={blocks} />
				</div>

				<div className={'footer'}>
					<Button
						isSecondary
						onClick={() => {
							updateBlocksCallback([
								createBlock('kadence/navigation-link', {
									label: __('New Link', 'kadence-blocks'),
									url: '',
									kind: 'custom',
									uniqueID: Math.random().toString(36).substr(2, 9),
									forceOpenInEditor: true,
								}),
							]);
						}}
						icon={plus}
					>
						{__('Custom link', 'kadence-blocks')}
					</Button>
					<Button isPrimary onClick={closeModal}>
						{__('Done Editing', 'kadence-blocks')}
					</Button>
				</div>
			</div>
		</div>
	);
}
