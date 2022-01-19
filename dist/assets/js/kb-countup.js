let waitForCountUp = setInterval(function () {
	if (typeof countUp !== 'undefined') {

		document.querySelectorAll('.kt-count-up').forEach(counter => {

			let self = counter,
				start     = self.dataset.start,
				end       = self.dataset.end,
				prefix     = self.dataset.prefix,
				suffix    = self.dataset.suffix,
				duration  = self.dataset.duration,
				seperator = self.dataset.separator,
				el = self.querySelector('.kt-count-up-process');

			let KbCounterOptions = {
				startVal: start ? start : 0,
				duration: duration ? duration : 2,
				prefix: prefix ? prefix : '',
				suffix: suffix ? suffix : '',
				separator: seperator ? ',' : ''
			};

			let KbCountUp = new countUp.CountUp( el, end, KbCounterOptions);

			if (!KbCountUp.error) {
				KbCountUp.start();
			}

		});

		clearInterval(waitForCountUp);
	}
}, 100);
