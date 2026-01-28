const kbAdvHeadingTypedListener = setInterval(function () {
	if (typeof Typed !== 'undefined') {
		clearInterval(kbAdvHeadingTypedListener);

		const kbTypedDefaults = {
			strings: JSON.stringify(['']),
			cursorChar: '_',
			startDelay: 0,
			backDelay: 700,
			typeSpeed: 40,
			backSpeed: 30,
			smartBackspace: false,
			loop: true,
			loopCount: false,
			showCursor: true,
			shuffle: false,
		};

		function sanitizeString(input) {
			const map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#x27;',
				'/': '&#x2F;',
			};
			const reg = /[&<>"'/]/gi;
			return input.replace(reg, (match) => map[match]);
		}

		const typedHeadings = document.querySelectorAll('.kt-typed-text');

		// Check if user prefers reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		typedHeadings.forEach(function (element) {
			// If user prefers reduced motion, skip animation and show original text
			if (prefersReducedMotion) {
				return;
			}

			let strings = element.getAttribute('data-strings');
			let stringsArray = [];
			let sanitizedStrings;
			const kbTypedSettings = { ...kbTypedDefaults };

			try {
				if (strings) {
					strings = JSON.parse(strings.replaceAll('&', '&amp;'));
					sanitizedStrings = strings.map((str) => sanitizeString(str));
				}
			} catch (e) {
				console.log('Could decode typed text strings');
			}

			if (!sanitizedStrings) {
				stringsArray = [];
			} else {
				stringsArray = [...sanitizedStrings];
			}

			stringsArray.unshift(element.textContent.replaceAll('&', '&amp;'));

			kbTypedSettings.strings = stringsArray;

			element.getAttribute('data-cursor-char')
				? (kbTypedSettings.cursorChar = sanitizeString(element.getAttribute('data-cursor-char')))
				: null;
			element.getAttribute('data-cursor-char') === '' ? (kbTypedSettings.showCursor = false) : null;

			element.getAttribute('data-start-delay')
				? (kbTypedSettings.startDelay = parseInt(element.getAttribute('data-start-delay')))
				: null;
			element.getAttribute('data-back-delay')
				? (kbTypedSettings.backDelay = parseInt(element.getAttribute('data-back-delay')))
				: null;
			element.getAttribute('data-loop')
				? (kbTypedSettings.loop = element.getAttribute('data-loop') === 'true')
				: null;
			element.getAttribute('data-loop-count')
				? (kbTypedSettings.loopCount = element.getAttribute('data-loop-count'))
				: null;
			element.getAttribute('data-shuffle')
				? (kbTypedSettings.shuffle = element.getAttribute('data-shuffle') === 'true' ? true : false)
				: null;

			element.getAttribute('data-type-speed')
				? (kbTypedSettings.typeSpeed = parseInt(element.getAttribute('data-type-speed')))
				: null;
			element.getAttribute('data-back-speed')
				? (kbTypedSettings.backSpeed = parseInt(element.getAttribute('data-back-speed')))
				: null;

			element.getAttribute('data-smart-backspace')
				? (kbTypedSettings.smartBackspace = element.getAttribute('data-smart-backspace') === 'true')
				: null;

			// Create a hidden live region for screen reader announcements
			const liveRegion = document.createElement('span');
			liveRegion.className = 'kt-typed-text-sr-only';
			liveRegion.setAttribute('aria-live', 'polite');
			liveRegion.setAttribute('aria-atomic', 'true');
			liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;';
			
			// Insert the live region right after the element
			element.parentNode.insertBefore(liveRegion, element.nextSibling);

			// Store the cursor character to remove it from announcements
			const cursorChar = kbTypedSettings.cursorChar || '_';

			// Use Typed.js callbacks to announce strings when they're complete
			kbTypedSettings.onStringTyped = function (arrayPos, self) {
				// Announce the complete string when it's fully typed
				const currentString = self.strings[arrayPos];
				if (currentString) {
					const cleanString = currentString.replace(cursorChar, '').trim(); // Remove cursor character
					if (cleanString) {
						// Update the live region to trigger screen reader announcement
						liveRegion.textContent = '';
						liveRegion.textContent = cleanString;
					}
				}
			};

			element.innerHTML = '';

			new Typed(element, kbTypedSettings);
		});
	}
}, 125);
