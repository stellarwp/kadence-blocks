/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import MenuEdit from './edit';
import './editor.scss';

// Register the blocks for use outside the block editor
// import '../../../navigation/index';
// import '../../../navigation-link/index';
// import '../../../rowlayout/index';
// import '../../../column/index';
// import '../../../advancedheading/block';

export default function MenuEditor() {
	const [selectedPostId, setSelectedPostId] = useState(0);

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
									{post.title.rendered}
								</Button>
								<Button
									key={'edit' + post.id}
									className={'menu-options'}
									onClick={() => {
										console.log('edit popup: ' + post.id);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="22"
										height="22"
										aria-hidden="true"
										focusable="false"
									>
										<path d="M13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2V5h2v2z"></path>
									</svg>
								</Button>
							</div>
						))
					)}

					<div className="menu-create">
						<Button className="create-menu-button" icon={plus} iconPosition="left" label="Create New Menu">
							Create New Menu
						</Button>
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
