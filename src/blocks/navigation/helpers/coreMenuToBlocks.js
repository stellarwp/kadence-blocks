import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { createBlock } from '@wordpress/blocks';

export const coreMenuToBlocks = (id) => {
	const buildMenuTree = (menuItems, parentId = 0) => {
		return menuItems
			.filter((item) => item.parent === parentId)
			.map((item) => {
				const children = buildMenuTree(menuItems, item.id);
				return {
					...item,
					children,
				};
			});
	};

	const createBlockFromMenuItem = (menuItem) => {
		const innerBlocks = menuItem.children.map((child) => createBlockFromMenuItem(child));
		return createBlock(
			'kadence/navigation-link',
			{
				kind: 'custom',
				label: menuItem.title.rendered,
				url: menuItem.url,
				uniqueID: Math.random().toString(36).substr(2, 9),
			},
			innerBlocks
		);
	};

	const createBlocksFromMenuItems = (menuItems) => {
		const menuTree = buildMenuTree(menuItems);
		return menuTree.map((menuItem) => createBlockFromMenuItem(menuItem));
	};

	const fetchMenuItems = async () => {
		try {
			const path = addQueryArgs('/wp/v2/menu-items', {
				menus: id,
				per_page: 100,
			});

			const response = await apiFetch({ path });

			return createBlocksFromMenuItems(response);
		} catch (error) {
			console.error('Error fetching menu items:', error);
			return false;
		}
	};

	return fetchMenuItems();
};
