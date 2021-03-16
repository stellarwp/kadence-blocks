/* global kadence_blocks_countdown */
( function() {
	'use strict';
	window.kadenceCountdown = {
		cache: {},
		timers: JSON.parse( kadence_blocks_countdown.timers ),
		updateTimerInterval( element, id, parent ) {
			var currentTimeStamp = new Date;
			var total = Math.floor( window.kadenceCountdown.timers[ id ].timestamp - currentTimeStamp.getTime() );
			// Check if completed.
			if ( total < 0  ) { 
				if ( 'redirect' === window.kadenceCountdown.timers[ id ].action ) {
					if ( window.kadenceCountdown.timers[ id ].redirect ) {
						window.location.href = window.kadenceCountdown.timers[ id ].redirect;
					}
				} else if ( 'hide' === window.kadenceCountdown.timers[ id ].action ) {
					parent.style.display = 'none';
				} else if ( 'message' === window.kadenceCountdown.timers[ id ].action ) {
					if ( parent.querySelector( '.kb-countdown-inner-first' ) ) {
						parent.querySelector( '.kb-countdown-inner-first' ).style.display = 'none';
					}
					if ( parent.querySelector( '.kb-countdown-timer' ) ) {
						parent.querySelector( '.kb-countdown-timer' ).style.display = 'none';
					}
					if ( parent.querySelector( '.kb-countdown-inner-second' ) ) {
						parent.querySelector( '.kb-countdown-inner-second' ).style.display = 'none';
					}
					if ( parent.querySelector( '.kb-countdown-inner-complete' ) ) {
						parent.querySelector( '.kb-countdown-inner-complete' ).style.display = 'block';
					}
					parent.style.opacity = 1;
				} else {
					if ( window.kadenceCountdown.timers[ id ].timer ) {
						var units = window.kadenceCountdown.timers[ id ].units;
						var labels = {};
						labels.days = window.kadenceCountdown.timers[ id ].daysLabel;
						labels.hours = window.kadenceCountdown.timers[ id ].hoursLabel;
						labels.minutes = window.kadenceCountdown.timers[ id ].minutesLabel;
						labels.seconds = window.kadenceCountdown.timers[ id ].secondsLabel;
						var parts = {};
						if ( undefined !== units && undefined !== units[0] && undefined !== units[0].days && ! units[0].days ) {
							//Do nothing.
							if ( undefined !== units && undefined !== units[0]  && undefined !== units[0].hours && ! units[0].hours ) {
								//Do nothing.
								if ( undefined !== units && undefined !== units[0] && undefined !== units[0].minutes && ! units[0].minutes ) {
									parts.seconds = 0;
								} else {
									parts.minutes = 0;
									parts.seconds = 0;
								}
							} else {
								parts.hours = 0;
								parts.minutes = 0;
								parts.seconds = 0;
							}
						} else {
							parts.days = 0;
							parts.hours = 0;
							parts.minutes = 0;
							parts.seconds = 0;
						}
						var preText = ( window.kadenceCountdown.timers[ id ].preLabel ? `<div class="kb-countdown-item kb-pre-timer">${ window.kadenceCountdown.timers[ id ].preLabel }</div>` : '' );
						var postText = ( window.kadenceCountdown.timers[ id ].postLabel ? `<div class="kb-countdown-item kb-post-timer">${ window.kadenceCountdown.timers[ id ].postLabel }</div>` : '' );
						var remaining = Object.keys(parts).map( ( part ) => {
							return `<div class="kb-countdown-item kb-countdown-date-item kb-countdown-date-item-${ part }"><span class="kb-countdown-number">${ parts[part] }</span><span class="kb-countdown-label">${ labels[part] }</span></div>`;
						}).join(" ");
						element.innerHTML = preText + remaining + postText;
					}
					parent.style.opacity = 1;
				}
				if ( window.kadenceCountdown.cache[ id ].interval ) {
					clearInterval( window.kadenceCountdown.cache[ id ].interval );
				}
				return;
			}
			if ( window.kadenceCountdown.timers[ id ].timer ) {
				var units = window.kadenceCountdown.timers[ id ].units;
				var labels = {};
				labels.days = window.kadenceCountdown.timers[ id ].daysLabel;
				labels.hours = window.kadenceCountdown.timers[ id ].hoursLabel;
				labels.minutes = window.kadenceCountdown.timers[ id ].minutesLabel;
				labels.seconds = window.kadenceCountdown.timers[ id ].secondsLabel;
				var calculateHours = Math.floor( ( total / ( 1000 * 60 * 60 ) ) % 24 );
				var calculateMinutes = Math.floor( ( total / 1000 / 60) % 60 );
				var calculateSeconds = Math.floor( ( total / 1000 ) % 60 );
				var parts = {};
				if ( undefined !== units && undefined !== units[0] && undefined !== units[0].days && ! units[0].days ) {
					//Do nothing.
					calculateHours = Math.floor( ( total / ( 1000 * 60 * 60 ) ) );
					if ( undefined !== units && undefined !== units[0]  && undefined !== units[0].hours && ! units[0].hours ) {
						//Do nothing.
						calculateMinutes = Math.floor( ( total / 1000 / 60) );
						if ( undefined !== units && undefined !== units[0] && undefined !== units[0].minutes && ! units[0].minutes ) {
							//Do nothing.
							calculateSeconds = Math.floor( ( total / 1000 ) );
							parts.seconds = calculateSeconds;
						} else {
							parts.minutes = calculateMinutes;
							parts.seconds = calculateSeconds;
						}
					} else {
						parts.hours = calculateHours;
						parts.minutes = calculateMinutes;
						parts.seconds = calculateSeconds;
					}
				} else {
					parts.days = Math.floor( total / ( 1000 * 60 * 60 * 24 ) );
					parts.hours = calculateHours;
					parts.minutes = calculateMinutes;
					parts.seconds = calculateSeconds;
				}
				var preText = ( window.kadenceCountdown.timers[ id ].preLabel ? `<div class="kb-countdown-item kb-pre-timer">${ window.kadenceCountdown.timers[ id ].preLabel }</div>` : '' );
				var postText = ( window.kadenceCountdown.timers[ id ].postLabel ? `<div class="kb-countdown-item kb-post-timer">${ window.kadenceCountdown.timers[ id ].postLabel }</div>` : '' );
				var remaining = Object.keys(parts).map( ( part ) => {
					return `<div class="kb-countdown-item kb-countdown-date-item kb-countdown-date-item-${ part }"><span class="kb-countdown-number">${ parts[part] }</span><span class="kb-countdown-label">${ labels[part] }</span></div>`;
				}).join(" ");
				element.innerHTML = preText + remaining + postText;
			}
			if ( 0 === window.kadenceCountdown.cache[ id ].run ) {
				parent.style.opacity = 1;
			}
			window.kadenceCountdown.cache[ id ].run ++;
		},
		updateTimer( element, id, parent ) {
			window.kadenceCountdown.cache[ id ] = {};
			window.kadenceCountdown.cache[ id ].run = 0;
			window.kadenceCountdown.updateTimerInterval( element, id, parent );
			window.kadenceCountdown.cache[ id ].interval = setInterval( function () {
				window.kadenceCountdown.updateTimerInterval( element, id, parent );
			}, 1000);
		},
		initTimer() {
			var countdowns = document.querySelectorAll( '.kb-countdown-container' );
			if ( ! countdowns.length ) {
				return;
			}
			for ( var n = 0; n < countdowns.length; n++ ) {
				var id = countdowns[n].getAttribute( 'data-id' );
				if ( id && window.kadenceCountdown.timers[ id ] ) {
					var el = countdowns[n].querySelector( '.kb-countdown-timer' );
					window.kadenceCountdown.updateTimer( el, id, countdowns[n] );
				}
			}
		},
		init: function() {
			window.kadenceCountdown.initTimer();
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceCountdown.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceCountdown.init();
	}
}() );