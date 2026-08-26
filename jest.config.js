/**
 * Jest configuration for unit tests.
 *
 * Extends the @wordpress/scripts default and forces a single `@wordpress/hooks` instance. In
 * production `@wordpress/hooks` is externalized to the one `wp.hooks` global, so the filter registry
 * is shared between this plugin and the bundled `@kadence/helpers` copy. Under jest, node resolution
 * would otherwise load a nested `@wordpress/hooks` from `node_modules/@kadence/helpers/node_modules`,
 * splitting the registry so helper `applyFilters` calls never see filters this plugin registered.
 * Mapping every `@wordpress/hooks` import to the top-level copy mirrors the production single-instance
 * behavior.
 *
 * `@wordpress/components` is not an installed top-level dependency (production externalizes it to
 * `wp.components`), but jest still needs to resolve it wherever a module references it. Mapped to
 * the copy nested under `@kadence/components` rather than adding a new top-level dependency.
 *
 * That nested `@wordpress/components` copy resolves its own `react`/`react-dom` imports to the
 * `react`/`react-dom` bundled inside `@kadence/components`'s own `node_modules` (Node's normal
 * upward resolution finds the nearer copy first). A test that mounts the top-level `react-dom/client`
 * root and then renders one of its components — `Dropdown`/`Popover`, the only ones this app opens
 * outside a mock — ends up with two separate React module instances in the same tree, which throws
 * "Invalid hook call" the moment the nested copy's hook runs against the top-level renderer. Forcing
 * both to the top-level copies keeps every `react`/`react-dom` import, direct or through the nested
 * `@wordpress/components`, resolving to the same module instance.
 */
const path = require('path');
const baseConfig = require('@wordpress/scripts/config/jest-unit.config.js');

module.exports = {
	...baseConfig,
	// `.worktrees/` holds sibling checkouts of this same repo (see `using-git-worktrees`); without
	// this, jest walks into them too and runs every test a second time against a possibly different
	// branch's source.
	testPathIgnorePatterns: [...(baseConfig.testPathIgnorePatterns || []), '/\\.worktrees/'],
	moduleNameMapper: {
		...(baseConfig.moduleNameMapper || {}),
		'^@wordpress/hooks$': path.join(
			path.dirname(require.resolve('@wordpress/hooks/package.json')),
			'build/index.cjs'
		),
		'^@wordpress/components$': path.join(
			__dirname,
			'node_modules/@kadence/components/node_modules/@wordpress/components/build/index.js'
		),
		'^react$': require.resolve('react'),
		'^react-dom$': require.resolve('react-dom'),
		'^react-dom/client$': require.resolve('react-dom/client'),
		'^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
	},
};
