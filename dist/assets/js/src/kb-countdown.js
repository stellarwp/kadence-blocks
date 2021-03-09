( function() {
	'use strict';
	window.kadenceCountdown = {
		getTimeZoneOffset( endDate ) {
			return new Date().getTimezoneOffset() - ( endDate.getTimezoneOffset() )
		},
		getOffsetDate( date, offset ) {
			var theDate = new Date( date );
			console.log( theDate.getTimezoneOffset() );
			var utc = theDate.getTime() + ( theDate.getTimezoneOffset() * 60000 );
			return new Date( utc + ( 3600000 * offset ) );
		},
		getUTCDate( date ) {
			return Date.UTC( date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
		},
		getUTCDate2( date ) {
			return Date.UTC( date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() );
		},
		initTimer() {
			var countdowns = document.querySelectorAll( '.kb-countdown-container' );
			if ( ! countdowns.length ) {
				return;
			}
			for ( let n = 0; n < countdowns.length; n++ ) {
				var endDate = countdowns[n].getAttribute( 'data-date' );
				var dateOffset = countdowns[n].getAttribute( 'data-time-offset' );
				var endTimeStamp = parseInt( countdowns[n].getAttribute( 'data-timestamp' ) );
				var el = countdowns[n].querySelector( '.kb-countdown-timer' );
				var _second = 1000;
				var _minute = _second * 60;
				var _hour = _minute * 60;
				var _day = _hour * 24;
				var second = new Date;
				console.log( endTimeStamp );
				console.log( second.getTime() );
				console.log( window.kadenceCountdown.getUTCDate2( second ) );
				// var theEnd = new Date( endDate );
				// console.log( dateOffset );
				// var offset = ( theEnd.getTimezoneOffset() + ( dateOffset * 60 ) ) * 60 * 1000;
				// console.log( theEnd.getTime() + offset );
				// theEnd.setTime( theEnd.getTime() + offset );
				//var theEnd = window.kadenceCountdown.dateWithTimeZone( dateOffset, endDate );
				//var bombay = utc + (3600000*dateOffset);
				//var theEnd = new Date(bombay);
				console.log( window.kadenceCountdown.getOffsetDate( endDate, dateOffset ) );
				var theEnd = window.kadenceCountdown.getUTCDate( window.kadenceCountdown.getOffsetDate( endDate, dateOffset ) );
				console.log( theEnd );
				var difference = endTimeStamp - second.getTime();
				var parts = {};
				parts.days = Math.floor(difference / (1000 * 60 * 60 * 24));
				parts.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
				parts.minutes = Math.floor((difference / 1000 / 60) % 60);
				parts.seconds = Math.floor((difference / 1000) % 60);
				var remaining = Object.keys(parts).map( ( part ) => {
					return `<div class="kb-countdown-date-item"><span class="kb-countdown-number">${ parts[part] }</span> <span class="kb-countdown-label">${ part }</span></div>`;
				}).join(" ");
				el.innerHTML = remaining;
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