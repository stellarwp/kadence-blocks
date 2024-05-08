/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { trash } from '@wordpress/icons';
import CreateNew from './createNew';

import MenuEdit from './edit';
import './editor.scss';

// Register the blocks for use outside the block editor
// import '../../../navigation/index';
// import '../../../navigation-link/index';
// import '../../../rowlayout/index';
// import '../../../column/index';
// import '../../../advancedheading/block';

export default function MenuEditor({ id = 0 }) {
	const [selectedPostId, setSelectedPostId] = useState(id);
	const { saveEntityRecord } = useDispatch('core');

	const { posts } = useSelect(
		(selectData) => ({
			posts: selectData('core').getEntityRecords('postType', 'kadence_navigation', {
				per_page: -1,
				orderby: 'title',
				order: 'asc',
			}),
		}),
		[]
	);

	const trashPost = async (id) => {
		try {
			await saveEntityRecord('postType', 'kadence_navigation', {
				id,
				status: 'private',
			});
			console.log('Post trashed successfully');
		} catch (error) {
			console.error('Error trashing post:', error);
		}
	};

	return (
		<div className="kb-menu-visual-editor">
			<div className="left-column">
				<div className="menu-container">
					{!posts ? (
						<>Loading navigation items</>
					) : (
						posts.map((post) => (
							<div className={'menu-item' + (selectedPostId === post.id ? ' selected' : '')}>
								<Button
									key={post.id}
									className={'menu-name'}
									onClick={() => {
										setSelectedPostId(post.id);
									}}
								>
									{post.title.rendered === ''
										? __('(no title)', 'kadence-blocks')
										: post.title.rendered}
								</Button>
								<DropdownMenu icon={'ellipsis'} className={'menu-options'} label="Select a direction">
									{({ onClose }) => (
										<>
											<MenuGroup>
												<MenuItem
													icon={trash}
													onClick={() => {
														trashPost(post.id);
														onClose();
													}}
												>
													Trash
												</MenuItem>
											</MenuGroup>
										</>
									)}
								</DropdownMenu>
							</div>
						))
					)}

					<div className="menu-create">
						<CreateNew />
					</div>
				</div>
				<div className={'add-menu'}></div>
			</div>
			<div className="right-column">
				{selectedPostId ? (
					<MenuEdit selectedPostId={selectedPostId} />
				) : (
					<>{__('Select or create a navigation item to continue', 'kadence-blocks')}</>
				)}
			</div>
		</div>
	);
}
