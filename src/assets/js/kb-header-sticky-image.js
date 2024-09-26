/**
 * Frontend JS to show/hide images based on sticky header state.
 */
class KBStickyImage {
	constructor(target, options = {}) {
		this.root = typeof target === 'string' ? document.querySelector(target) : target;
		this.state = 'CREATED';
		this.isLogo = this.root.classList.contains('kb-identity');
		this.standardElem = this.isLogo
			? this.root.querySelector('.custom-logo')
			: this.root.querySelector('.kb-img:not(.kb-img-sticky):not(.kb-img-transparent)');
		this.stickyElem = this.root.querySelector('.kb-img-sticky');
		this.transparentElem = this.root.querySelector('.kb-img-transparent');
		this.isSticking = false;

		if (this.stickyElem) {
			this.initStickyTracking();
		}

		this.emitEvent('MOUNTED');
		this.state = 'IDLE';
	}

	initStickyTracking() {
		window.addEventListener('KADENCE_HEADER_STICKY_CHANGED', this.toggleSticky.bind(this));
	}

	toggleSticky({ isSticking }) {
		this.isSticking = isSticking;
		if (isSticking) {
			this.setStickyStyles();
		} else {
			this.setStandardStyles();
		}
	}

	setStickyStyles() {
		if (this.stickyElem) {
			this.stickyElem.style.display = 'initial';
		}
		if (this.standardElem) {
			this.standardElem.style.display = 'none';
		}
		if (this.transparentElem) {
			this.transparentElem.style.display = 'none';
		}
	}

	setStandardStyles() {
		if (this.standardElem) {
			this.standardElem.style.display = 'initial';
		}
		if (this.stickyElem) {
			this.stickyElem.style.display = 'none';
		}
		// Keep transparent image visible for logo blocks
		if (this.transparentElem && !this.isLogo) {
			this.transparentElem.style.display = 'none';
		}
	}

	get state() {
		return this._state;
	}

	set state(value) {
		this._state = value;
		this.emitEvent('STATE', { val: value });
	}

	emitEvent(eventName, detail = {}) {
		const event = new CustomEvent(eventName, {
			bubbles: true,
			detail,
		});
		this.root.dispatchEvent(event);
	}
}

/**
 * Initializes KBImage instances for image and logo blocks.
 */
function initKBImages() {
	const stickyBlocks = document.querySelectorAll('.wp-block-kadence-image, .wp-block-kadence-identity');
	window.KBStickyBlocks = Array.from(stickyBlocks).map((block) => new KBStickyImage(block));
}

// Initialize KBImages when the DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initKBImages);
} else {
	initKBImages();
}

window.KBStickyImage = KBStickyImage;
