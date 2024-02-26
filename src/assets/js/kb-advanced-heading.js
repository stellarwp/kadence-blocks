let kbAdvHeadingTypedListener = setInterval(function () {
	if (typeof Typed !== 'undefined') {
		clearInterval(kbAdvHeadingTypedListener);

		let kbTypedDefaults = {
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

		let typedHeadings = document.querySelectorAll('.kt-typed-text');

		typedHeadings.forEach(function (element) {
			let strings = element.getAttribute('data-strings');
			let stringsArray = [];
			let kbTypedSettings = { ...kbTypedDefaults };

			try {
				if (strings) {
					strings = JSON.parse(strings.replaceAll('&', '&amp;'));
				}
			} catch (e) {
				console.log('Could decode typed text strings');
			}

			if (!strings) {
				stringsArray = [];
			} else {
				stringsArray = [...strings];
			}

			stringsArray.unshift(element.textContent.replaceAll('&', '&amp;'));

			kbTypedSettings.strings = stringsArray;

			element.getAttribute('data-cursor-char')
				? (kbTypedSettings.cursorChar = element.getAttribute('data-cursor-char'))
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
