export const OPTIMIZE_ROUTE = '/kb-optimizer/v1/optimize';

// Get localized strings from WordPress.
const l10n = window.kbOptimizerL10n || {};
// Contains the perf_token.
export const OPTIMIZER_DATA = window.kbOptimizer || {};

// UI State Constants.
// If you update this, match to the Optimizer_Provider.php file.
export const UI_STATES = {
	OPTIMIZE: {
		class: 'kb-optimize-post',
		text: l10n.runOptimizer || 'Run Optimizer',
	},
	REMOVE: {
		class: 'kb-remove-post-optimization',
		text: l10n.removeOptimization || 'Remove Optimization',
	},
	OPTIMIZING: {
		class: 'kb-optimizing',
		text: l10n.optimizing || 'Optimizing',
	},
	OPTIMIZED: {
		text: l10n.optimized || 'Optimized',
	},
	NOT_OPTIMIZED: {
		text: l10n.notOptimized || 'Not Optimized',
	},
	EXCLUDED: {
		text: l10n.excluded || 'Excluded',
	},
	NOT_OPTIMIZABLE: {
		text: l10n.notOptimizable || 'Not Optimizable',
	},
};
