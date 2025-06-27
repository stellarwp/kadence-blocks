/**
 * Performance monitoring utilities for Kadence Blocks
 */

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @param {Function} callback - Function to measure
 * @returns {*} Result of the callback
 */
export function measureRenderTime(componentName, callback) {
	if (typeof window === 'undefined' || !window.performance) {
		return callback();
	}

	const startMark = `${componentName}-render-start`;
	const endMark = `${componentName}-render-end`;
	const measureName = `${componentName}-render`;

	performance.mark(startMark);
	const result = callback();
	performance.mark(endMark);
	performance.measure(measureName, startMark, endMark);

	// Log in development mode
	if (process.env.NODE_ENV === 'development') {
		const measure = performance.getEntriesByName(measureName)[0];
		if (measure && measure.duration > 16) {
			// Log if render takes more than 16ms (1 frame)
			console.warn(`[Kadence Blocks] ${componentName} render took ${measure.duration.toFixed(2)}ms`);
		}
	}

	// Clean up marks
	performance.clearMarks(startMark);
	performance.clearMarks(endMark);
	performance.clearMeasures(measureName);

	return result;
}

/**
 * Debounce function with performance tracking
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {string} name - Name for performance tracking
 * @returns {Function} Debounced function
 */
export function performanceDebounce(func, wait, name) {
	let timeout;
	let callCount = 0;

	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			
			if (name && window.performance) {
				performance.mark(`${name}-debounced-start`);
			}
			
			func(...args);
			
			if (name && window.performance) {
				performance.mark(`${name}-debounced-end`);
				performance.measure(`${name}-debounced`, `${name}-debounced-start`, `${name}-debounced-end`);
				
				if (process.env.NODE_ENV === 'development') {
					callCount++;
					if (callCount % 10 === 0) {
						console.log(`[Kadence Blocks] ${name} debounced function called ${callCount} times`);
					}
				}
			}
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Track block initialization time
 * @param {string} blockName - Name of the block
 * @returns {Function} End function to call when initialization is complete
 */
export function trackBlockInit(blockName) {
	if (typeof window === 'undefined' || !window.performance) {
		return () => {};
	}

	const startMark = `${blockName}-init-start`;
	performance.mark(startMark);

	return () => {
		const endMark = `${blockName}-init-end`;
		const measureName = `${blockName}-init`;

		performance.mark(endMark);
		performance.measure(measureName, startMark, endMark);

		if (process.env.NODE_ENV === 'development') {
			const measure = performance.getEntriesByName(measureName)[0];
			if (measure) {
				console.log(`[Kadence Blocks] ${blockName} initialized in ${measure.duration.toFixed(2)}ms`);
			}
		}

		performance.clearMarks(startMark);
		performance.clearMarks(endMark);
		performance.clearMeasures(measureName);
	};
}

/**
 * Monitor memory usage (development only)
 * @param {string} context - Context for the memory check
 */
export function checkMemoryUsage(context) {
	if (process.env.NODE_ENV === 'development' && window.performance && window.performance.memory) {
		const memory = window.performance.memory;
		const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
		const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
		const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);

		console.log(`[Kadence Blocks Memory] ${context}:`, {
			used: `${usedMB} MB`,
			total: `${totalMB} MB`,
			limit: `${limitMB} MB`,
			percentage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}%`,
		});
	}
}

/**
 * Create a performance observer for long tasks
 * @param {number} threshold - Threshold in milliseconds (default 50ms)
 */
export function observeLongTasks(threshold = 50) {
	if (typeof window === 'undefined' || !window.PerformanceObserver || process.env.NODE_ENV !== 'development') {
		return () => {};
	}

	try {
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.duration > threshold) {
					console.warn(`[Kadence Blocks] Long task detected:`, {
						duration: `${entry.duration.toFixed(2)}ms`,
						startTime: `${entry.startTime.toFixed(2)}ms`,
						name: entry.name,
					});
				}
			}
		});

		observer.observe({ entryTypes: ['longtask'] });

		// Return cleanup function
		return () => observer.disconnect();
	} catch (e) {
		// PerformanceObserver might not support longtask
		return () => {};
	}
}

/**
 * Profile a React component render
 * @param {string} id - Component ID
 * @param {string} phase - Either "mount" or "update"
 * @param {number} actualDuration - Time spent rendering
 * @param {number} baseDuration - Estimated render time without memoization
 * @param {number} startTime - When React began rendering
 * @param {number} commitTime - When React committed the render
 */
export function onRenderProfile(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (process.env.NODE_ENV === 'development' && actualDuration > 16) {
		console.warn(`[Kadence Blocks Profile] ${id} (${phase}):`, {
			actual: `${actualDuration.toFixed(2)}ms`,
			base: `${baseDuration.toFixed(2)}ms`,
			saved: `${(baseDuration - actualDuration).toFixed(2)}ms`,
			start: `${startTime.toFixed(2)}ms`,
			commit: `${commitTime.toFixed(2)}ms`,
		});
	}
}