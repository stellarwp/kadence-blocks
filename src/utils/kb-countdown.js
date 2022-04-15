/* global kadence_blocks_countdown */
( function() {
	'use strict';
	window.kadenceCountdown = {
		cache: {},
		timers: JSON.parse( kadence_blocks_countdown.timers ),
		createCookie: function( name, value, length, unit ) {
			if ( length ) {
				var date = new Date();
				if ( 'minutes' == unit ) {
					date.setTime( date.getTime() + ( length * 60 * 1000 ) );
				} else if ( 'hours' == unit ) {
					date.setTime( date.getTime() + ( length * 60 * 60 * 1000 ) );
				} else {
					date.setTime( date.getTime()+(length*24*60*60*1000));
				}
				var expires = "; expires="+date.toGMTString();
			} else {
				var expires = "";
			}
	
			document.cookie = kadence_blocks_countdown.site_slug + '-' + name+"="+value+expires+"; path=/";
		},
		getCookie( name ) {
			var value = "; " + document.cookie;
			var parts = value.split("; " + kadence_blocks_countdown.site_slug + '-' + name + "=");
			if ( parts.length == 2 ) {
				return parts.pop().split(";").shift();
			}
			return '';
		},
		updateTimerInterval( element, id, parent ) {
			var currentTimeStamp = new Date;
			var total = '';
			if ( window.kadenceCountdown.timers[ id ].type === 'evergreen' ) {
				//Check for cookie.
				if ( '' !== window.kadenceCountdown.cache[ id ].cookie ) {
					total = Math.floor( window.kadenceCountdown.cache[ id ].cookie - currentTimeStamp.getTime() );
				}
				// Check for database storage only for strict.
				if ( ! total && window.kadenceCountdown.timers[ id ].strict && 'query' === window.kadenceCountdown.timers[ id ].evergreen ) {
					// remove query so we don't run this twice.
					window.kadenceCountdown.timers[ id ].evergreen = '';
					window.kadenceCountdown.cache[ id ].request = new XMLHttpRequest();
					window.kadenceCountdown.cache[ id ].request.open( 'POST', kadence_blocks_countdown.ajax_url, true );
					window.kadenceCountdown.cache[ id ].request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
					window.kadenceCountdown.cache[ id ].request.onload = function () {
						if ( this.status >= 200 && this.status < 400 ) {
							// If successful
							window.kadenceCountdown.cache[ id ].evergreen = parseInt( this.response );
							if ( window.kadenceCountdown.cache[ id ].evergreen ) {
								total = Math.floor( window.kadenceCountdown.cache[ id ].evergreen - currentTimeStamp.getTime() );
								window.kadenceCountdown.createCookie( window.kadenceCountdown.timers[ id ].campaign_id, window.kadenceCountdown.cache[ id ].evergreen, 30, 'days' );
								window.kadenceCountdown.cache[ id ].cookie = window.kadenceCountdown.cache[ id ].evergreen;
							}
						} else {
							// If fail
							//console.log(this.response);
						}
					};
					window.kadenceCountdown.cache[ id ].request.onerror = function() {
						// Connection error
					};
					window.kadenceCountdown.cache[ id ].request.send( 'action=kadence_get_evergreen&nonce=' + kadence_blocks_countdown.ajax_nonce + '&site_slug=' + kadence_blocks_countdown.site_slug + '&reset=' + window.kadenceCountdown.cache[ id ].reset + '&countdown_id=' + window.kadenceCountdown.timers[ id ].campaign_id );
				}
				// Check for loaded no cache mode.
				if ( ! total && ! window.kadenceCountdown.timers[ id ].strict && window.kadenceCountdown.timers[ id ].evergreen && 'query' !== window.kadenceCountdown.timers[ id ].evergreen ) {
					total = Math.floor( window.kadenceCountdown.timers[ id ].evergreen - currentTimeStamp.getTime() );
				}
				// We've set the cache and it's counting.
				if ( ! total && window.kadenceCountdown.cache[ id ].evergreen ) {
					total = Math.floor( window.kadenceCountdown.cache[ id ].evergreen - currentTimeStamp.getTime() );
				}
				// Total is negative so past date, let check if we should reset it.
				if ( total && total < 0  ) {
					// check if reset is needed.
					var resetDate = new Date;
					resetDate.setTime( window.kadenceCountdown.cache[ id ].cookie + ( Math.floor( window.kadenceCountdown.cache[ id ].reset )*24*60*60*1000 ) );
					var shouldRest = Math.floor( resetDate.getTime() - currentTimeStamp.getTime() );
					if ( shouldRest < 0  ) {
						total = '';
					}
				}
				// total is empty so lets set it, however if we are in strict mode we need to wait for the ajax request.
				if ( ! total && ( ( window.kadenceCountdown.timers[ id ].strict && window.kadenceCountdown.cache[ id ].request && window.kadenceCountdown.cache[ id ].request.readyState && window.kadenceCountdown.cache[ id ].request.readyState === 4 ) || ! window.kadenceCountdown.timers[ id ].strict ) ) {
					var newDate = new Date;
					newDate.setTime( newDate.getTime() + ( Math.floor( window.kadenceCountdown.timers[ id ].hours )*60*60*1000 ) );
					newDate.setTime( newDate.getTime() + ( Math.floor( window.kadenceCountdown.timers[ id ].minutes )*60*1000 ) );
					window.kadenceCountdown.cache[ id ].evergreen = newDate.getTime() + 100;
					window.kadenceCountdown.createCookie( window.kadenceCountdown.timers[ id ].campaign_id, window.kadenceCountdown.cache[ id ].evergreen, 30, 'days' );
					total = Math.floor( newDate.getTime() - currentTimeStamp.getTime() );
					var request = new XMLHttpRequest();
					request.open( 'POST', kadence_blocks_countdown.ajax_url, true );
					request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
					request.onload = function () {
						if ( this.status >= 200 && this.status < 400 ) {
							// If successful
							//console.log(this.response);
						} else {
							// If fail
							//console.log(this.response);
						}
					};
					request.onerror = function() {
						// Connection error
					};
					request.send( 'action=kadence_evergreen_timestamp&nonce=' + kadence_blocks_countdown.ajax_nonce + '&site_slug=' + kadence_blocks_countdown.site_slug + '&timestamp=' + window.kadenceCountdown.cache[ id ].evergreen + '&countdown_id=' + window.kadenceCountdown.timers[ id ].campaign_id );
				}
			} else {
				total = Math.floor( window.kadenceCountdown.timers[ id ].timestamp - currentTimeStamp.getTime() );
			}
			// Check if completed.
			if ( total && total < 0  ) {
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
					if ( window.kadenceCountdown.timers[ id ].revealOnLoad ) {
						parent.style.height = parent.scrollHeight+"px";
					}
				} else {
					if ( window.kadenceCountdown.timers[ id ].timer ) {
						var enableDividers = window.kadenceCountdown.timers[ id ].dividers;
						var timeNumbers = window.kadenceCountdown.timers[ id ].stopWatch;
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
						var preText = ( window.kadenceCountdown.timers[ id ].preLabel ? `<div class="kb-countdown-item kb-pre-timer"><span class="kb-pre-timer-inner">${ window.kadenceCountdown.timers[ id ].preLabel }</span></div>` : '' );
						var postText = ( window.kadenceCountdown.timers[ id ].postLabel ? `<div class="kb-countdown-item kb-post-timer"><span class="kb-post-timer-inner">${ window.kadenceCountdown.timers[ id ].postLabel }</span></div>` : '' );
						var remaining = Object.keys(parts).map( ( part ) => {
							if ( 'seconds' !== part && enableDividers ) {
								return `<div class="kb-countdown-item kb-countdown-date-item kb-countdown-date-item-${ part }"><span class="kb-countdown-number">${  window.kadenceCountdown.calculateNumberDesign( parts[part], timeNumbers ) }</span><span class="kb-countdown-label">${ labels[part] }</span></div><div class="kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${ part }"><span class="kb-countdown-number">:</span><span class="kb-countdown-label">&nbsp;</span></div>`;
							}
							return `<div class="kb-countdown-item kb-countdown-date-item kb-countdown-date-item-${ part }"><span class="kb-countdown-number">${ window.kadenceCountdown.calculateNumberDesign( parts[part], timeNumbers ) }</span><span class="kb-countdown-label">${ labels[part] }</span></div>`;
						}).join(" ");
						element.innerHTML = preText + remaining + postText;
					}
					parent.style.opacity = 1;
					if ( window.kadenceCountdown.timers[ id ].revealOnLoad ) {
						parent.style.height = parent.scrollHeight+"px";
					}
				}
				if ( window.kadenceCountdown.cache[ id ].interval ) {
					clearInterval( window.kadenceCountdown.cache[ id ].interval );
				}
				return;
			}
			if ( ( total || 0 === total ) && window.kadenceCountdown.timers[ id ].timer ) {
				var enableDividers = window.kadenceCountdown.timers[ id ].dividers;
				var timeNumbers = window.kadenceCountdown.timers[ id ].stopWatch;
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
				var preText = ( window.kadenceCountdown.timers[ id ].preLabel ? `<div class="kb-countdown-item kb-pre-timer"><span class="kb-pre-timer-inner">${ window.kadenceCountdown.timers[ id ].preLabel }</span></div>` : '' );
				var postText = ( window.kadenceCountdown.timers[ id ].postLabel ? `<div class="kb-countdown-item kb-post-timer"><span class="kb-post-timer-inner">${ window.kadenceCountdown.timers[ id ].postLabel }</span></div>` : '' );
				var remaining = Object.keys(parts).map( ( part ) => {
					if ( 'seconds' !== part && enableDividers ) {
						return `<div class="kb-countdown-item kb-countdown-date-item kb-countdown-date-item-${ part }"><span class="kb-countdown-number">${  window.kadenceCountdown.calculateNumberDesign( parts[part], timeNumbers ) }</span><span class="kb-countdown-label">${ labels[part] }</span></div><div class="kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${ part }"><span class="kb-countdown-number">:</span><span class="kb-countdown-label">&nbsp;</span></div>`;
					}
					return `<div class="kb-countdown-item kb-countdown-date-item kb-countdown-date-item-${ part }"><span class="kb-countdown-number">${ window.kadenceCountdown.calculateNumberDesign( parts[part], timeNumbers ) }</span><span class="kb-countdown-label">${ labels[part] }</span></div>`;
				}).join(" ");
				element.innerHTML = preText + remaining + postText;
			}
			if ( ( total || 0 === total ) && ! window.kadenceCountdown.cache[ id ].revealed ) {
				window.kadenceCountdown.cache[ id ].revealed = true;
				parent.style.opacity = 1;
				if ( window.kadenceCountdown.timers[ id ].revealOnLoad ) {
					var sticky = parent.closest( '.kadence-pro-fixed-wrap' );
					if ( sticky && ! window.kadenceCountdown.timers[ id ].timer ) {
						setTimeout( function(){
							parent.style.height = parent.scrollHeight+"px";
							sticky.style.transition = 'height 0.8s ease';
							sticky.style.height = Math.floor( sticky.scrollHeight + parent.scrollHeight ) + "px";
						}, 200 );
						setTimeout( function(){
							var event = new CustomEvent( 'kadence-update-sticky' );
							window.dispatchEvent( event );
							sticky.style.transition = '';
						}, 1000 );
					} else {
						parent.style.height = parent.scrollHeight+"px";
					}
				}
			}
		},
		calculateNumberDesign( number, timeNumbers = false ) {
			if ( timeNumbers ) {
				return number > 9 ? "" + number: "0" + number;
			}
			return number;
		},
		updateTimer( element, id, parent ) {
			window.kadenceCountdown.cache[ id ] = {};
			window.kadenceCountdown.cache[ id ].evergreen = '';
			window.kadenceCountdown.cache[ id ].request = '';
			window.kadenceCountdown.cache[ id ].revealed = false;
			window.kadenceCountdown.cache[ id ].cookie = '';
			if ( window.kadenceCountdown.timers[ id ].type === 'evergreen' && window.kadenceCountdown.timers[ id ].campaign_id ) {
				window.kadenceCountdown.cache[ id ].cookie = window.kadenceCountdown.getCookie( window.kadenceCountdown.timers[ id ].campaign_id );
			}
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
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceCountdown.initTimer );
	} else {
		// The DOM has already been loaded.
		window.kadenceCountdown.initTimer();
	}
}() );