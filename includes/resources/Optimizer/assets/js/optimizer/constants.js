export const OPTIMIZE_ROUTE = '/kb-optimizer/v1/optimize';

// Get localized strings from WordPress.
const l10n = window.kbOptimizerL10n || {};

// UI State Constants.
export const UI_STATES = {
	OPTIMIZE: {
		class: 'kb-optimize-post',
		text: l10n.runOptimizer || 'Run Optimizer',
	},
	REMOVE: {
		class: 'kb-remove-post-optimization',
		text: l10n.removeOptimization || 'Remove Optimization',
	},
	OPTIMIZED: {
		text: l10n.optimized || 'Optimized',
	},
	NOT_OPTIMIZED: {
		text: l10n.notOptimized || 'Not Optimized',
	},
	NOT_OPTIMIZABLE: {
		text: l10n.notOptimizable || 'Not Optimizable',
	},
};
