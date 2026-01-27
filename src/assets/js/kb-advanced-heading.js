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
			element.innerHTML = '';

			new Typed(element, kbTypedSettings);
		});
	}
}, 125);
