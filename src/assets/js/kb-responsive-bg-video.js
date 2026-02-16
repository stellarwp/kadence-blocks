(function() {
	var TABLET = 1024, MOBILE = 767;

	function getDevice() {
		var w = window.innerWidth;
		return w <= MOBILE ? 'mobile' : w <= TABLET ? 'tablet' : 'desktop';
	}

	function activate(c) {
		var v = c.querySelector('video');
		if (v) {
			v.removeAttribute('preload');
			v.setAttribute('autoplay', '');
			v.play && v.play().catch(function() {});
		}
		var f = c.querySelector('iframe[data-src]');
		if (f && f.getAttribute('data-src') !== f.src) {
			f.src = f.getAttribute('data-src');
		}
	}

	function deactivate(c) {
		var v = c.querySelector('video');
		if (v) {
			v.pause();
			v.removeAttribute('autoplay');
		}
		var f = c.querySelector('iframe[data-src]');
		if (f && f.src) {
			f.src = 'about:blank';
		}
	}

	function init() {
		var rows = document.querySelectorAll('.kb-row-layout-wrap');
		rows.forEach(function(row) {
			var desk = row.querySelector(':scope > .kb-blocks-bg-video-container:not(.kb-blocks-bg-video-tablet):not(.kb-blocks-bg-video-mobile)');
			var tab = row.querySelector(':scope > .kb-blocks-bg-video-tablet');
			var mob = row.querySelector(':scope > .kb-blocks-bg-video-mobile');
			if (!tab && !mob) {
				return;
			}
			var dev = getDevice();
			[{el: desk, d: 'desktop'}, {el: tab, d: 'tablet'}, {el: mob, d: 'mobile'}].forEach(function(o) {
				if (!o.el) {
					return;
				}
				var on = o.d === dev
					|| (dev === 'mobile' && o.d === 'tablet' && !mob)
					|| (dev === 'tablet' && o.d === 'desktop' && !tab)
					|| (dev === 'mobile' && o.d === 'desktop' && !tab && !mob);
				on ? activate(o.el) : deactivate(o.el);
			});
		});
	}

	document.readyState === 'loading'
		? document.addEventListener('DOMContentLoaded', init)
		: init();

	var t;
	window.addEventListener('resize', function() {
		clearTimeout(t);
		t = setTimeout(init, 250);
	});
})();
