/* global kadenceHeaderConfig */

/**
 * The frontend class for the Kadence query block.
 */
class KBHeader {
	/**
	 * The collection of all component objects.
	 */
	components = {};

	/**
	 * The current state.
	 */
	_state;

	/**
	 * The root header container element.
	 */
	root;

	/**
	 * The root header container element.
	 */
	rootID;

	/**
	 * The root header container element.
	 */
	autoTransparentSpacing;

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
		this.autoTransparentSpacing = this.root.dataset?.autoTransparentSpacing === '1';
		this._state = 'CREATED';

		if (this.autoTransparentSpacing) {
			this.initAutoTransparentSpacing();
		}

		var event = new Event('MOUNTED', {
			bubbles: true,
		});
		event.qlID = this.rootID;

		this.root.dispatchEvent(event);
		this._state = 'IDLE';
	}

	initAutoTransparentSpacing() {
		const self = this;

		this.setAutoTransparentSpacing();

		document.onresize = self.setAutoTransparentSpacing;
	}

	setAutoTransparentSpacing() {
		const self = this;

		const height = this.getHeight();

		const elementToApply = this.root.nextElementSibling;

		elementToApply.style.paddingTop = height + 'px';
	}

	getHeight() {
		return this.root.querySelector('div').clientHeight;
	}

	/**
	 * Returns options.
	 *
	 * @return An object with the latest options.
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
window.KBHeader = KBHeader;

const init = () => {
	// Testing var, can remove
	window.KBHeaderBlocks = [];

	var headerBlocks = document.querySelectorAll('.wp-block-kadence-header');

	for (let i = 0; i < headerBlocks.length; i++) {
		var headerBlock = headerBlocks[i];
		const kbHeaderBlock = new KBHeader(headerBlock);
		window.KBHeaderBlocks.push(kbHeaderBlock);
	}
};

if ('loading' === document.readyState) {
	// The DOM has not yet been loaded.
	document.addEventListener('DOMContentLoaded', init);
} else {
	// The DOM has already been loaded.
	init();
}
