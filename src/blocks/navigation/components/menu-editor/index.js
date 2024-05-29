/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { PostSelectorCheckbox } from '@kadence/components';

import MenuEdit from './edit';
import './editor.scss';

export default function MenuEditor({ clientId }) {
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
		console.log('onSelect Posts');
		console.log(posts);
	};

	return (
		<div className="kb-menu-visual-editor">
			<div className="left-column">
				<div className="menu-container">
					<PostSelectorCheckbox title={__('Posts', 'kadence-blocks')} onSelect={onSelect} />

					<PostSelectorCheckbox
						initialOpen={false}
						postType={'pages'}
						title={__('Pages', 'kadence-blocks')}
						onSelect={onSelect}
					/>
				</div>
				<div className={'add-menu'}></div>
			</div>
			<div className="right-column">
				{blocks.length !== 0 ? (
					<MenuEdit blocks={blocks} />
				) : (
					<>{__('Insert some blocks to get started.', 'kadence-blocks')}</>
				)}
			</div>
		</div>
	);
}
