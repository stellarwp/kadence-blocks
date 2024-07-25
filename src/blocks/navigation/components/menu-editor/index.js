/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PostSelectorCheckbox, KadenceRadioButtons } from '@kadence/components';
import { createBlock } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';

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
	const [sidebarTab, setSidebarTab] = useState('posts');
	const [direction, setDirection] = useState('vertical');
	const [directionTablet, setDirectionTablet] = useState('vertical');

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

	const onSelect = (posts) => {
		const navItems = [];

		posts.forEach((post) => {
			navItems.push(
				createBlock('kadence/navigation-link', {
					label: post.title.rendered,
					url: post.link,
					kind: 'custom',
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
						value={orientationTablet !== '' ? orientationTablet : 'horizontal'}
						options={[
							{ value: 'vertical', label: __('Vertical', 'kadence-blocks') },
							{ value: 'horizontal', label: __('Horizontal', 'kadence-blocks') },
						]}
						hideLabel={false}
						onChange={(value) => {
							setMetaAttribute(value, 'orientationTablet');
						}}
					/>

					<PostSelectorCheckbox
						forceOpen={sidebarTab === 'posts'}
						useForceState={true}
						title={__('Posts', 'kadence-blocks')}
						onPanelBodyToggle={() => setSidebarTab(sidebarTab === 'posts' ? null : 'posts')}
						onSelect={onSelect}
					/>

					<PostSelectorCheckbox
						forceOpen={sidebarTab === 'pages'}
						useForceState={true}
						onPanelBodyToggle={() => setSidebarTab(sidebarTab === 'pages' ? null : 'pages')}
						postType={'pages'}
						title={__('Pages', 'kadence-blocks')}
						onSelect={onSelect}
					/>

					{kadence_blocks_params.hasProducts && (
						<PostSelectorCheckbox
							forceOpen={sidebarTab === 'product'}
							useForceState={true}
							onPanelBodyToggle={() => setSidebarTab(sidebarTab === 'product' ? null : 'product')}
							postType={'product'}
							title={__('Products', 'kadence-blocks')}
							onSelect={onSelect}
						/>
					)}
				</div>
				<div className={'add-menu'}></div>
			</div>
			<div className="right-column">
				<TextControl
					value={title === 'Auto Draft' ? '' : title}
					onChange={setTitle}
					label={__('Menu Name', 'kadence-blocks')}
					help={__('This is used for your reference only.', 'kadence-blocks')}
				/>

				<MenuEdit blocks={blocks} closeModal={closeModal} />
			</div>
		</div>
	);
}
