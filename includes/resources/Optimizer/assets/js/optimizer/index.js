import { initOptimizer } from './initializer.js';
import { initBulkActions } from '../bulk-actions';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		initOptimizer();
		initBulkActions();
	});
} else {
	initOptimizer();
	initBulkActions();
}
