/**
 * File kb-off-canvas-trigger.js.
 *
 * Handles toggling the off canvas navigation.
 */
(function () {
	const handleOffCanvas = function (triggerButtons, offCanvasArea, closeButton) {
		const focusableElementsString =
			'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
		let focusableElements = offCanvasArea.querySelectorAll(focusableElementsString);
		focusableElements = Array.prototype.slice.call(focusableElements);
		const firstFocusableElement = focusableElements[0];
		const lastFocusableElement = focusableElements[focusableElements.length - 1];

		const openOffCanvas = function (event) {
			event.target.classList.add('triggered');
			offCanvasArea.classList.add('show-off-canvas');
			setTimeout(function () {
				offCanvasArea.classList.add('active');
				triggerButtons.forEach((button) => button.setAttribute('aria-expanded', 'true'));
				firstFocusableElement.focus();
			}, 10);
		};

		const closeOffCanvas = function () {
			offCanvasArea.classList.remove('active');
			triggerButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
			for (let i = 0; i < triggerButtons.length; i++) {
				if (triggerButtons[i].classList.contains('triggered')) {
					triggerButtons[i].focus();
					triggerButtons[i].classList.remove('triggered');
				}
			}
			setTimeout(function () {
				offCanvasArea.classList.remove('show-off-canvas');
			}, 250);
		};

		triggerButtons.forEach((button) => {
			button.addEventListener('click', openOffCanvas);
		});

		closeButton.addEventListener('click', closeOffCanvas);

		function handleKeyDown(event) {
			const isTabPressed = event.key === 'Tab' || event.keyCode === 9;

			if (!isTabPressed) {
				return;
			}

			if (event.shiftKey) {
				if (document.activeElement === firstFocusableElement) {
					event.preventDefault();
					lastFocusableElement.focus();
				}
			} else if (document.activeElement === lastFocusableElement) {
				event.preventDefault();
				firstFocusableElement.focus();
			}
		}

		function handleEscape(event) {
			if (event.key === 'Escape' || event.keyCode === 27) {
				closeOffCanvas();
			}
		}

		// Close modal on outside click.
		document.addEventListener('click', function (event) {
			var target = event.target;
			var modal = document.querySelector('.kb-off-canvas-overlay');
			if (target === modal) {
				closeOffCanvas();
			}
		});

		offCanvasArea.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keydown', handleEscape);
		// Handle closing off canvas when a link is clicked.
		var menuLinks = offCanvasArea.querySelectorAll('a:not(.kt-tab-title)');
		// No point if no links.
		if (menuLinks.length) {
			for (let i = 0; i < menuLinks.length; i++) {
				menuLinks[i].addEventListener('click', function (event) {
					closeOffCanvas();
				});
			}
		}
	};

	const initOffCanvas = function () {
		const triggerButtons = document.querySelectorAll('.wp-block-kadence-off-canvas-trigger');
		const offCanvasArea = document.querySelector('.wp-block-kadence-off-canvas');
		const closeButton = offCanvasArea.querySelector('.kb-off-canvas-close');

		if (triggerButtons.length > 0 && offCanvasArea && closeButton) {
			handleOffCanvas(triggerButtons, offCanvasArea, closeButton);
		}
	};

	// Initialize immediately for already loaded DOM
	initOffCanvas();
})();
