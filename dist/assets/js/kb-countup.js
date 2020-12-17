jQuery( function( $ ) {
	var kadenceCounterUp = {
		init: function() {
			$('.kt-counter-up').each(function() {
				var self = $(this),
					start     = self.data('start')
					end       = self.data('end')
					prefix     = self.data('prefix')
					suffix    = self.data('suffix')
					duration  = self.data('duration')
					seperator = self.data('separator'),
					el = self.find('.kt-counter-up-process');

				var options = {
					startVal: start ? start : 0,
					duration: duration ? duration : 2,
					prefix: prefix ? prefix : '',
					suffix: suffix ? suffix : '',
					separator: seperator ? ',' : ''
				};

				let demo = new countUp.CountUp( el.get(0), end, options);
				if (!demo.error) {
				  demo.start();
				} else {

				}
			})
		},
	};

	kadenceCounterUp.init();

} );
