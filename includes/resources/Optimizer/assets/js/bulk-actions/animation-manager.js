import { animateDots } from '../optimizer/ui-manager.js';

/**
 * Manages animation intervals for bulk operations.
 */
export class AnimationManager {
	constructor() {
		this.intervals = new Map();
	}

	/**
	 * Start animation for a post link.
	 *
	 * @param {number}      postId - Post ID.
	 * @param {HTMLElement} link   - Link element.
	 */
	start(postId, link) {
		const interval = animateDots(link);
		this.intervals.set(postId, interval);
	}

	/**
	 * Stop animation for a post.
	 *
	 * @param {number} postId - Post ID.
	 */
	stop(postId) {
		const interval = this.intervals.get(postId);

		if (interval) {
			clearInterval(interval);
			this.intervals.delete(postId);
		}
	}

	/**
	 * Stop all animations.
	 */
	stopAll() {
		this.intervals.forEach((interval) => clearInterval(interval));
		this.intervals.clear();
	}
}
