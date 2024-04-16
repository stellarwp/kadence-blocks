/**
 * The frontend javascript for the Kadence image.
 */
class KBImage {
	/**
	 * The collection of all component objects.
	 */
	components = {};

	/**
	 * The current state.
	 */
	_state;

	/**
	 * The root image container element.
	 */
	root;

	/**
	 * The root image container element.
	 */
	rootID;

	/**
	 * The stick elem.
	 */
	stickyElem = null;

	/**
	 * The standard elem.
	 */
	standardElem = null;

	/**
	 * if this image is in sticky state.
	 */
	isSticking = false;

	/**
	 * The main constructor.
	 *
	 * @param target  - The selector for the target element, or the element itself.
	 * @param options - Optional. An object with options.
	 */
	constructor(target, options = {}) {
		//target the target
		const self = this;
		this.root = 'string' == typeof target ? document.querySelector(target) : target;
		//TODO get a real root id parsed from the block unique id.
		this.rootID = 'aaa';
		this._state = 'CREATED';
		this.standardElem = this.root.querySelector('.kb-img');
		this.stickyElem = this.root.querySelector('.kb-img-sticky');

		if (this.stickyElem) {
			this.initStickyTrack();
		}

		var event = new Event('MOUNTED', {
			bubbles: true,
		});
		event.qlID = this.rootID;

		this.root.dispatchEvent(event);
		this._state = 'IDLE';
	}

	initStickyTrack() {
		const self = this;

		window.addEventListener('KADENCE_HEADER_STICKY_CHANGED', this.toggleSticky.bind(self));
	}

	toggleSticky(e) {
		const self = this;

		if (e.isSticking) {
			this.isSticking = true;
			this.setStickyStyles();
		} else {
			this.isSticking = false;
			this.setStandardStyles();
		}
	}

	setStickyStyles() {
		if (this.stickyElem) {
			this.stickyElem.style.display = 'initial';
			this.standardElem.style.display = 'none';
		}
	}

	setStandardStyles() {
		if (this.standardElem) {
			this.stickyElem.style.display = 'none';
			this.standardElem.style.display = 'initial';
		}
	}

	/**
	 * Returns options.
	 *
	 * @return {string} An object with the latest options.
	 */
	get state() {
		return this._state;
	}

	/**
	 * Merges options to the current options and emits `updated` event.
	 *
	 * @param options - An object with new options.
	 */
	set state(val) {
		this._state = val;

		var event = new Event('STATE');
		event.val = val;
		event.qlID = this.rootID;

		this.root.dispatchEvent(event);
	}
}
window.KBImage = KBImage;

const initKBImage = () => {
	// Testing var, can remove
	window.KBImageBlocks = [];
	console.log(0);

	var imageBlocks = document.querySelectorAll('.wp-block-kadence-image');

	for (let i = 0; i < imageBlocks.length; i++) {
		var imageBlock = imageBlocks[i];
		const KBImageBlock = new KBImage(imageBlock);
		window.KBImageBlocks.push(KBImageBlock);
	}
};

if ('loading' === document.readyState) {
	// The DOM has not yet been loaded.
	document.addEventListener('DOMContentLoaded', initKBImage);
} else {
	// The DOM has already been loaded.
	initKBImage();
}
