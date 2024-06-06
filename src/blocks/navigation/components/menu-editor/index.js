/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { PostSelectorCheckbox } from '@kadence/components';
import { createBlock } from '@wordpress/blocks';

import MenuEdit from './edit';
import './editor.scss';

export default function MenuEditor({ clientId, closeModal }) {
	const [sidebarTab, setSidebarTab] = useState('posts');

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
			wp.data.dispatch('core/block-editor').insertBlocks(navItems, 99999, clientId, false, null);
		}
	};

	return (
		<div className="kb-menu-visual-editor">
			<div className="left-column">
				<div className="menu-container">
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
				{blocks.length !== 0 ? (
					<MenuEdit blocks={blocks} closeModal={closeModal} />
				) : (
					<>{__('Insert some blocks to get started.', 'kadence-blocks')}</>
				)}
			</div>
		</div>
	);
}
