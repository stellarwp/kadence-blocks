/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { EntityProvider } from '@wordpress/core-data';

import MenuEdit from './edit';

// Register the blocks for use outside the block editor
import '../../../navigation/index';
import '../../../navigation-link/index';
import '../../../rowlayout/index';
import '../../../column/index';
import '../../../advancedheading/block';

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
		<div className="modal-wrapper">
			<>
				<Flex>
					<FlexItem>
						<div className="left-column">
							<div className="menu-list">
								{!posts ? (
									<>Loading navigation items</>
								) : (
									posts.map((post) => (
										<div
											key={post.id}
											onClick={() => {
												setSelectedPostId(post.id);
											}}
										>
											{post.title.rendered}
										</div>
									))
								)}
							</div>
						</div>
					</FlexItem>
					<FlexBlock>
						<div className="right-column">
							<div className="menu-list">
								{selectedPostId ? (
									<MenuEdit selectedPostId={selectedPostId} />
								) : (
									<>{__('Select or create a navigation item to continue', 'kadence-blocks')}</>
								)}
							</div>
						</div>
					</FlexBlock>
				</Flex>
			</>
		</div>
	);
}
