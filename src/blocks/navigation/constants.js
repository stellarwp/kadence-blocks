export const DEFAULT_BLOCK = {
	name: 'kadence/navigation-link',
};

export const ALLOWED_BLOCKS = [
	'kadence/navigation-link',
	'core/navigation-link',
	'core/search',
	'core/social-links',
	'core/page-list',
	'core/spacer',
	'core/home-link',
	'core/site-title',
	'core/site-logo',
	'core/navigation-submenu',
	'core/loginout',
	'core/buttons',
];

export const PRIORITIZED_INSERTER_BLOCKS = [
	'kadence/navigation-link',
	// 'core/navigation-link/page',
	// 'core/navigation-link',
];

// These parameters must be kept aligned with those in
// lib/compat/wordpress-6.3/navigation-block-preloading.php
// and
// edit-site/src/components/sidebar-navigation-screen-navigation-menus/constants.js
export const PRELOADED_NAVIGATION_MENUS_QUERY = {
	per_page: 100,
	status: ['publish', 'draft'],
	order: 'desc',
	orderby: 'date',
};

export const SELECT_NAVIGATION_MENUS_ARGS = ['postType', 'kadence_navigation', PRELOADED_NAVIGATION_MENUS_QUERY];
