import { initOptimizer } from './initializer.js';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initOptimizer);
} else {
	initOptimizer();
}
