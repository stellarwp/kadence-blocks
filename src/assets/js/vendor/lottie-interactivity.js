// Lottie interactivity 1.3.8
!(function (e, t) {
	'object' == typeof exports && 'undefined' != typeof module
		? t(exports)
		: 'function' == typeof define && define.amd
		? define(['exports'], t)
		: t(((e = e || self).LottieInteractivity = {}));
})(this, function (e) {
	'use strict';
	function t(e) {
		return (t =
			'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
				? function (e) {
						return typeof e;
				  }
				: function (e) {
						return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype
							? 'symbol'
							: typeof e;
				  })(e);
	}
	function n(e, t) {
		if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
	}
	function i(e, t) {
		for (var n = 0; n < t.length; n++) {
			var i = t[n];
			(i.enumerable = i.enumerable || !1),
				(i.configurable = !0),
				'value' in i && (i.writable = !0),
				Object.defineProperty(e, i.key, i);
		}
	}
	function a(e, t) {
		if (null == e) return {};
		var n,
			i,
			a = (function (e, t) {
				if (null == e) return {};
				var n,
					i,
					a = {},
					r = Object.keys(e);
				for (i = 0; i < r.length; i++) (n = r[i]), t.indexOf(n) >= 0 || (a[n] = e[n]);
				return a;
			})(e, t);
		if (Object.getOwnPropertySymbols) {
			var r = Object.getOwnPropertySymbols(e);
			for (i = 0; i < r.length; i++)
				(n = r[i]), t.indexOf(n) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, n) && (a[n] = e[n]));
		}
		return a;
	}
	function r(e, t) {
		var n = t.get(e);
		if (!n) throw new TypeError('attempted to get private field on non-instance');
		return n.get ? n.get.call(e) : n.value;
	}
	var o = { player: 'lottie-player' },
		s = '[lottieInteractivity]:',
		l = (function () {
			function e() {
				var i = this,
					l = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o,
					C = l.actions,
					A = l.container,
					T = l.mode,
					H = l.player,
					O = a(l, ['actions', 'container', 'mode', 'player']);
				if (
					(n(this, e),
					c.set(this, {
						writable: !0,
						value: function () {
							if (i.player) {
								var e = function () {
									i.player.addEventListener('enterFrame', r(i, g)),
										i.container.addEventListener('mouseenter', r(i, E)),
										i.container.addEventListener('mouseleave', r(i, w)),
										i.container.addEventListener('touchstart', r(i, E), { passive: !0 }),
										i.container.addEventListener('touchend', r(i, w), { passive: !0 });
								};
								i.stateHandler.set('loop', function () {
									i.actions[i.interactionIdx].loop
										? (i.player.loop = parseInt(i.actions[i.interactionIdx].loop) - 1)
										: (i.player.loop = !0),
										(i.player.autoplay = !0);
								}),
									i.stateHandler.set('autoplay', function () {
										(i.player.loop = !1), (i.player.autoplay = !0);
									}),
									i.stateHandler.set('click', function () {
										(i.player.loop = !1),
											(i.player.autoplay = !1),
											i.container.addEventListener('click', r(i, p));
									}),
									i.stateHandler.set('hover', function () {
										(i.player.loop = !1),
											(i.player.autoplay = !1),
											i.container.addEventListener('mouseenter', r(i, p)),
											i.container.addEventListener('touchstart', r(i, p), { passive: !0 });
									}),
									i.transitionHandler.set('click', function () {
										i.container.addEventListener('click', r(i, h));
									}),
									i.transitionHandler.set('hover', function () {
										i.container.addEventListener('mouseenter', r(i, h)),
											i.container.addEventListener('touchstart', r(i, h), { passive: !0 });
									}),
									i.transitionHandler.set('hold', e),
									i.transitionHandler.set('pauseHold', e),
									i.transitionHandler.set('repeat', function () {
										(i.player.loop = !0), (i.player.autoplay = !0);
										i.player.addEventListener('loopComplete', function e() {
											r(i, f).call(i, { handler: e });
										});
									}),
									i.transitionHandler.set('onComplete', function () {
										'loop' === i.actions[i.interactionIdx].state
											? i.player.addEventListener('loopComplete', r(i, m))
											: i.player.addEventListener('complete', r(i, m));
									}),
									i.transitionHandler.set('seek', function () {
										i.player.stop(),
											i.player.addEventListener('enterFrame', r(i, L)),
											i.container.addEventListener('mousemove', r(i, y)),
											i.container.addEventListener('touchmove', r(i, u), { passive: !1 }),
											i.container.addEventListener('mouseout', r(i, v));
									});
							}
						},
					}),
					p.set(this, {
						writable: !0,
						value: function () {
							var e = i.actions[i.interactionIdx].forceFlag;
							e || !0 !== i.player.isPaused ? e && r(i, b).call(i, !0) : r(i, b).call(i, !0);
						},
					}),
					d.set(this, {
						writable: !0,
						value: function () {
							0 === i.clickCounter
								? (i.player.play(), i.clickCounter++)
								: (i.clickCounter++,
								  i.player.setDirection(-1 * i.player.playDirection),
								  i.player.play());
						},
					}),
					h.set(this, {
						writable: !0,
						value: function () {
							var e = i.actions[i.interactionIdx].forceFlag,
								t = i.actions[i.interactionIdx].state,
								n = i.actions[i.interactionIdx].transition;
							if ('chain' === i.mode) {
								if (i.actions[i.interactionIdx].count) {
									var a = parseInt(i.actions[i.interactionIdx].count);
									if (i.clickCounter < a - 1) return void (i.clickCounter += 1);
								}
								return (
									(i.clickCounter = 0),
									('click' === n && 'click' === t) || ('hover' === n && 'hover' === t)
										? i.transitionHandler.get('onComplete').call()
										: r(i, x).call(i),
									i.container.removeEventListener('click', r(i, h)),
									void i.container.removeEventListener('mouseenter', r(i, h))
								);
							}
							e || !0 !== i.player.isPaused
								? e && i.player.goToAndPlay(0, !0)
								: i.player.goToAndPlay(0, !0);
						},
					}),
					y.set(this, {
						writable: !0,
						value: function (e) {
							r(i, P).call(i, e.clientX, e.clientY);
						},
					}),
					u.set(this, {
						writable: !0,
						value: function (e) {
							e.cancelable && e.preventDefault(),
								r(i, P).call(i, e.touches[0].clientX, e.touches[0].clientY);
						},
					}),
					v.set(this, {
						writable: !0,
						value: function () {
							r(i, P).call(i, -1, -1);
						},
					}),
					m.set(this, {
						writable: !0,
						value: function () {
							'loop' === i.actions[i.interactionIdx].state
								? i.player.removeEventListener('loopComplete', r(i, m))
								: i.player.removeEventListener('complete', r(i, m)),
								r(i, x).call(i);
						},
					}),
					f.set(this, {
						writable: !0,
						value: function (e) {
							var t = e.handler,
								n = 1;
							i.actions[i.interactionIdx].repeat && (n = i.actions[i.interactionIdx].repeat),
								i.playCounter >= n - 1
									? ((i.playCounter = 0),
									  i.player.removeEventListener('loopComplete', t),
									  (i.player.loop = !1),
									  (i.player.autoplay = !1),
									  r(i, x).call(i))
									: (i.playCounter += 1);
						},
					}),
					L.set(this, {
						writable: !0,
						value: function () {
							var e = i.actions[i.interactionIdx].frames;
							e &&
								i.player.currentFrame >= parseInt(e[1]) - 1 &&
								(i.player.removeEventListener('enterFrame', r(i, L)),
								i.container.removeEventListener('mousemove', r(i, y)),
								i.container.removeEventListener('mouseout', r(i, v)),
								setTimeout(r(i, x), 0));
						},
					}),
					g.set(this, {
						writable: !0,
						value: function () {
							var e = i.actions[i.interactionIdx].frames;
							((e && i.player.currentFrame >= e[1]) ||
								i.player.currentFrame >= i.player.totalFrames - 1) &&
								(i.player.removeEventListener('enterFrame', r(i, g)),
								i.container.removeEventListener('mouseenter', r(i, E)),
								i.container.removeEventListener('mouseleave', r(i, w)),
								i.container.removeEventListener('touchstart', r(i, E), { passive: !0 }),
								i.container.removeEventListener('touchend', r(i, w), { passive: !0 }),
								i.player.pause(),
								(i.holdStatus = !1),
								r(i, x).call(i));
						},
					}),
					E.set(this, {
						writable: !0,
						value: function () {
							(-1 !== i.player.playDirection && null !== i.holdStatus && i.holdStatus) ||
								(i.player.setDirection(1), i.player.play(), (i.holdStatus = !0));
						},
					}),
					w.set(this, {
						writable: !0,
						value: function () {
							'hold' === i.actions[i.interactionIdx].transition || 'hold' === i.actions[0].type
								? (i.player.setDirection(-1), i.player.play())
								: ('pauseHold' !== i.actions[i.interactionIdx].transition &&
										'pauseHold' !== i.actions[0].type) ||
								  i.player.pause(),
								(i.holdStatus = !1);
						},
					}),
					I.set(this, {
						writable: !0,
						value: function () {
							var e = i.actions[i.interactionIdx].state;
							('hover' !== e && 'click' !== e) ||
								(i.container.removeEventListener('click', r(i, p)),
								i.container.removeEventListener('mouseenter', r(i, p)));
						},
					}),
					x.set(this, {
						writable: !0,
						value: function () {
							(i.oldInterctionIdx = i.interactionIdx), r(i, I).call(i);
							var e = i.actions[i.interactionIdx].jumpTo;
							e
								? e >= 0 && e < i.actions.length
									? ((i.interactionIdx = e), r(i, S).call(i, { ignorePath: !1 }))
									: ((i.interactionIdx = 0),
									  i.player.goToAndStop(0, !0),
									  r(i, S).call(i, { ignorePath: !1 }))
								: (i.interactionIdx++,
								  i.interactionIdx >= i.actions.length
										? i.actions[i.actions.length - 1].reset
											? ((i.interactionIdx = 0),
											  i.player.resetSegments(!0),
											  i.actions[i.interactionIdx].frames
													? i.player.goToAndStop(i.actions[i.interactionIdx].frames, !0)
													: i.player.goToAndStop(0, !0),
											  r(i, S).call(i, { ignorePath: !1 }))
											: ((i.interactionIdx = i.actions.length - 1),
											  r(i, S).call(i, { ignorePath: !1 }))
										: r(i, S).call(i, { ignorePath: !1 })),
								i.container.dispatchEvent(
									new CustomEvent('transition', {
										bubbles: !0,
										composed: !0,
										detail: { oldIndex: i.oldInterctionIdx, newIndex: i.interactionIdx },
									})
								);
						},
					}),
					b.set(this, {
						writable: !0,
						value: function (e) {
							var t = i.actions[i.interactionIdx].frames;
							if (!t) return i.player.resetSegments(!0), void i.player.goToAndPlay(0, !0);
							'string' == typeof t ? i.player.goToAndPlay(t, e) : i.player.playSegments(t, e);
						},
					}),
					k.set(this, {
						writable: !0,
						value: function () {
							var e = i.actions[i.interactionIdx].path;
							if (!e)
								if (
									'object' === t(i.enteredPlayer) &&
									'AnimationItem' === i.enteredPlayer.constructor.name
								) {
									if (((e = i.enteredPlayer), i.player === e))
										return void r(i, S).call(i, { ignorePath: !0 });
								} else {
									var n = (e = i.loadedAnimation).substr(e.lastIndexOf('/') + 1);
									if (((n = n.substr(0, n.lastIndexOf('.json'))), i.player.fileName === n))
										return void r(i, S).call(i, { ignorePath: !0 });
								}
							var a = i.container.getBoundingClientRect(),
								o =
									'width: ' +
									a.width +
									'px !important; height: ' +
									a.height +
									'px !important; background: ' +
									i.container.style.background;
							if (
								(i.container.setAttribute('style', o),
								'object' !== t(i.enteredPlayer) || 'AnimationItem' !== i.enteredPlayer.constructor.name)
							) {
								if ('string' == typeof i.enteredPlayer) {
									var l = document.querySelector(i.enteredPlayer);
									l &&
										'LOTTIE-PLAYER' === l.nodeName &&
										(i.attachedListeners ||
											(l.addEventListener('ready', function () {
												(i.container.style.width = ''), (i.container.style.height = '');
											}),
											l.addEventListener('load', function () {
												(i.player = l.getLottie()), r(i, S).call(i, { ignorePath: !0 });
											}),
											(i.attachedListeners = !0)),
										l.load(e));
								} else
									i.enteredPlayer instanceof HTMLElement &&
										'LOTTIE-PLAYER' === i.enteredPlayer.nodeName &&
										(i.attachedListeners ||
											(i.enteredPlayer.addEventListener('ready', function () {
												(i.container.style.width = ''), (i.container.style.height = '');
											}),
											i.enteredPlayer.addEventListener('load', function () {
												(i.player = i.enteredPlayer.getLottie()),
													r(i, S).call(i, { ignorePath: !0 });
											}),
											(i.attachedListeners = !0)),
										i.enteredPlayer.load(e));
								if (!i.player)
									throw new Error(''.concat(s, ' Specified player is invalid.'), i.enteredPlayer);
							} else {
								if (!window.lottie) throw new Error(''.concat(s, ' A Lottie player is required.'));
								i.stop(),
									i.player.destroy(),
									(i.container.innerHTML = ''),
									'object' === t(e) && 'AnimationItem' === e.constructor.name
										? (i.player = window.lottie.loadAnimation({
												loop: !1,
												autoplay: !1,
												animationData: e.animationData,
												container: i.container,
										  }))
										: (i.player = window.lottie.loadAnimation({
												loop: !1,
												autoplay: !1,
												path: e,
												container: i.container,
										  })),
									i.player.addEventListener('DOMLoaded', function () {
										(i.container.style.width = ''),
											(i.container.style.height = ''),
											r(i, S).call(i, { ignorePath: !0 });
									});
							}
							(i.clickCounter = 0), (i.playCounter = 0);
						},
					}),
					S.set(this, {
						writable: !0,
						value: function (e) {
							var t = e.ignorePath,
								n = i.actions[i.interactionIdx].state,
								a = i.actions[i.interactionIdx].transition,
								o = i.actions[i.interactionIdx].path,
								s = i.stateHandler.get(n),
								l = i.transitionHandler.get(a),
								c = i.actions[i.interactionIdx].speed ? i.actions[i.interactionIdx].speed : 1,
								p = i.actions[i.interactionIdx].delay ? i.actions[i.interactionIdx].delay : 0;
							t || !(o || (i.actions[i.actions.length - 1].reset && 0 === i.interactionIdx))
								? setTimeout(function () {
										s ? s.call() : 'none' === n && ((i.player.loop = !1), (i.player.autoplay = !1)),
											l && l.call(),
											i.player.autoplay && (i.player.resetSegments(!0), r(i, b).call(i, !0)),
											i.player.setSpeed(c);
								  }, p)
								: r(i, k).call(i);
						},
					}),
					P.set(this, {
						writable: !0,
						value: function (e, t) {
							if (-1 !== e && -1 !== t) {
								var n = i.getContainerCursorPosition(e, t);
								(e = n.x), (t = n.y);
							}
							var a = i.actions.find(function (n) {
								var i = n.position;
								if (i) {
									if (Array.isArray(i.x) && Array.isArray(i.y))
										return e >= i.x[0] && e <= i.x[1] && t >= i.y[0] && t <= i.y[1];
									if (!Number.isNaN(i.x) && !Number.isNaN(i.y)) return e === i.x && t === i.y;
								}
								return !1;
							});
							if (a)
								if ('seek' === a.type || 'seek' === a.transition) {
									var r = (e - a.position.x[0]) / (a.position.x[1] - a.position.x[0]),
										o = (t - a.position.y[0]) / (a.position.y[1] - a.position.y[0]);
									i.player.playSegments(a.frames, !0),
										a.position.y[0] < 0 && a.position.y[1] > 1
											? i.player.goToAndStop(Math.floor(r * i.player.totalFrames), !0)
											: i.player.goToAndStop(Math.ceil(((r + o) / 2) * i.player.totalFrames), !0);
								} else
									'loop' === a.type
										? i.player.playSegments(a.frames, !0)
										: 'play' === a.type
										? (!0 === i.player.isPaused && i.player.resetSegments(),
										  i.player.playSegments(a.frames))
										: 'stop' === a.type &&
										  (i.player.resetSegments(!0), i.player.goToAndStop(a.frames[0], !0));
						},
					}),
					M.set(this, {
						writable: !0,
						value: function () {
							var e = i.getContainerVisibility(),
								t = i.actions.find(function (t) {
									var n = t.visibility;
									return e >= n[0] && e <= n[1];
								});
							if (t)
								if ('seek' === t.type) {
									var n = t.frames[0],
										a = 2 == t.frames.length ? t.frames[1] : i.player.totalFrames - 1;
									null !== i.assignedSegment &&
										(i.player.resetSegments(!0), (i.assignedSegment = null)),
										i.player.goToAndStop(
											n +
												Math.round(
													((e - t.visibility[0]) / (t.visibility[1] - t.visibility[0])) *
														(a - n)
												),
											!0
										);
								} else
									'loop' === t.type
										? ((i.player.loop = !0),
										  (null === i.assignedSegment ||
												i.assignedSegment !== t.frames ||
												!0 === i.player.isPaused) &&
												(i.player.playSegments(t.frames, !0), (i.assignedSegment = t.frames)))
										: 'play' === t.type
										? i.scrolledAndPlayed ||
										  ((i.scrolledAndPlayed = !0),
										  i.player.resetSegments(!0),
										  t.frames ? i.player.playSegments(t.frames, !0) : i.player.play())
										: 'stop' === t.type && i.player.goToAndStop(t.frames[0], !0);
						},
					}),
					(this.enteredPlayer = H),
					'object' !== t(H) || 'AnimationItem' !== H.constructor.name)
				) {
					if ('string' == typeof H) {
						var W = document.querySelector(H);
						W && 'LOTTIE-PLAYER' === W.nodeName && (H = W.getLottie());
					} else H instanceof HTMLElement && 'LOTTIE-PLAYER' === H.nodeName && (H = H.getLottie());
					if (!H) {
						var j = s + 'Specified player:' + H + ' is invalid.';
						throw new Error(j);
					}
				}
				'string' == typeof A && (A = document.querySelector(A)),
					A || (A = H.wrapper),
					(this.player = H),
					(this.loadedAnimation = this.player.path + this.player.fileName + '.json'),
					(this.attachedListeners = !1),
					(this.container = A),
					(this.mode = T),
					(this.actions = C),
					(this.options = O),
					(this.assignedSegment = null),
					(this.scrolledAndPlayed = !1),
					(this.interactionIdx = 0),
					(this.oldInterctionIdx = 0),
					(this.clickCounter = 0),
					(this.playCounter = 0),
					(this.stateHandler = new Map()),
					(this.transitionHandler = new Map());
			}
			var l, C, A;
			return (
				(l = e),
				(C = [
					{
						key: 'getContainerVisibility',
						value: function () {
							var e = this.container.getBoundingClientRect(),
								t = e.top,
								n = e.height;
							return (window.innerHeight - t) / (window.innerHeight + n);
						},
					},
					{
						key: 'getContainerCursorPosition',
						value: function (e, t) {
							var n = this.container.getBoundingClientRect(),
								i = n.top;
							return { x: (e - n.left) / n.width, y: (t - i) / n.height };
						},
					},
					{
						key: 'initScrollMode',
						value: function () {
							this.player.stop(), window.addEventListener('scroll', r(this, M), !0);
						},
					},
					{
						key: 'initCursorMode',
						value: function () {
							this.actions && 1 === this.actions.length
								? 'click' === this.actions[0].type
									? ((this.player.loop = !1),
									  this.player.stop(),
									  this.container.addEventListener('click', r(this, h)))
									: 'hover' === this.actions[0].type
									? ((this.player.loop = !1),
									  this.player.stop(),
									  this.container.addEventListener('mouseenter', r(this, h)),
									  this.container.addEventListener('touchstart', r(this, h), { passive: !0 }))
									: 'toggle' === this.actions[0].type
									? ((this.player.loop = !1),
									  this.player.stop(),
									  this.container.addEventListener('click', r(this, d)))
									: 'hold' === this.actions[0].type || 'pauseHold' === this.actions[0].type
									? (this.container.addEventListener('mouseenter', r(this, E)),
									  this.container.addEventListener('mouseleave', r(this, w)),
									  this.container.addEventListener('touchstart', r(this, E), { passive: !0 }),
									  this.container.addEventListener('touchend', r(this, w), { passive: !0 }))
									: 'seek' === this.actions[0].type &&
									  ((this.player.loop = !0),
									  this.player.stop(),
									  this.container.addEventListener('mousemove', r(this, y)),
									  this.container.addEventListener('touchmove', r(this, u), { passive: !1 }),
									  this.container.addEventListener('mouseout', r(this, v)))
								: ((this.player.loop = !0),
								  this.player.stop(),
								  this.container.addEventListener('mousemove', r(this, y)),
								  this.container.addEventListener('mouseleave', r(this, v)),
								  r(this, P).call(this, -1, -1));
						},
					},
					{
						key: 'initChainMode',
						value: function () {
							r(this, c).call(this),
								(this.player.loop = !1),
								this.player.stop(),
								r(this, S).call(this, { ignorePath: !1 });
						},
					},
					{
						key: 'start',
						value: function () {
							var e = this;
							'scroll' === this.mode
								? this.player.isLoaded
									? this.initScrollMode()
									: this.player.addEventListener('DOMLoaded', function () {
											e.initScrollMode();
									  })
								: 'cursor' === this.mode
								? this.player.isLoaded
									? this.initCursorMode()
									: this.player.addEventListener('DOMLoaded', function () {
											e.initCursorMode();
									  })
								: 'chain' === this.mode &&
								  (this.player.isLoaded
										? this.initChainMode()
										: this.player.addEventListener('DOMLoaded', function () {
												e.initChainMode();
										  }));
						},
					},
					{
						key: 'redefineOptions',
						value: function (e) {
							var n = e.actions,
								i = e.container,
								r = e.mode,
								o = e.player,
								l = a(e, ['actions', 'container', 'mode', 'player']);
							if (
								(this.stop(),
								(this.enteredPlayer = o),
								'object' !== t(o) || 'AnimationItem' !== o.constructor.name)
							) {
								if ('string' == typeof o) {
									var c = document.querySelector(o);
									c && 'LOTTIE-PLAYER' === c.nodeName && (o = c.getLottie());
								} else
									o instanceof HTMLElement && 'LOTTIE-PLAYER' === o.nodeName && (o = o.getLottie());
								if (!o) throw new Error(s + 'Specified player:' + o + ' is invalid.', o);
							}
							'string' == typeof i && (i = document.querySelector(i)),
								i || (i = o.wrapper),
								(this.player = o),
								(this.loadedAnimation = this.player.path + this.player.fileName + '.json'),
								(this.attachedListeners = !1),
								(this.container = i),
								(this.mode = r),
								(this.actions = n),
								(this.options = l),
								(this.assignedSegment = null),
								(this.scrolledAndPlayed = !1),
								(this.interactionIdx = 0),
								(this.clickCounter = 0),
								(this.playCounter = 0),
								(this.holdStatus = null),
								(this.stateHandler = new Map()),
								(this.transitionHandler = new Map()),
								this.start();
						},
					},
					{
						key: 'stop',
						value: function () {
							if (
								('scroll' === this.mode && window.removeEventListener('scroll', r(this, M), !0),
								'cursor' === this.mode &&
									(this.container.removeEventListener('click', r(this, h)),
									this.container.removeEventListener('click', r(this, d)),
									this.container.removeEventListener('mouseenter', r(this, h)),
									this.container.removeEventListener('touchstart', r(this, h)),
									this.container.removeEventListener('touchmove', r(this, u)),
									this.container.removeEventListener('mousemove', r(this, y)),
									this.container.removeEventListener('mouseleave', r(this, v)),
									this.container.removeEventListener('touchstart', r(this, E)),
									this.container.removeEventListener('touchend', r(this, w))),
								'chain' === this.mode &&
									(this.container.removeEventListener('click', r(this, h)),
									this.container.removeEventListener('click', r(this, p)),
									this.container.removeEventListener('mouseenter', r(this, h)),
									this.container.removeEventListener('touchstart', r(this, h)),
									this.container.removeEventListener('touchmove', r(this, u)),
									this.container.removeEventListener('mouseenter', r(this, p)),
									this.container.removeEventListener('touchstart', r(this, p)),
									this.container.removeEventListener('mouseenter', r(this, E)),
									this.container.removeEventListener('touchstart', r(this, E)),
									this.container.removeEventListener('mouseleave', r(this, w)),
									this.container.removeEventListener('mousemove', r(this, y)),
									this.container.removeEventListener('mouseout', r(this, v)),
									this.container.removeEventListener('touchend', r(this, w)),
									this.player))
							)
								try {
									this.player.removeEventListener('loopComplete', r(this, m)),
										this.player.removeEventListener('complete', r(this, m)),
										this.player.removeEventListener('enterFrame', r(this, L)),
										this.player.removeEventListener('enterFrame', r(this, g));
								} catch (e) {}
							this.player = null;
						},
					},
				]) && i(l.prototype, C),
				A && i(l, A),
				e
			);
		})(),
		c = new WeakMap(),
		p = new WeakMap(),
		d = new WeakMap(),
		h = new WeakMap(),
		y = new WeakMap(),
		u = new WeakMap(),
		v = new WeakMap(),
		m = new WeakMap(),
		f = new WeakMap(),
		L = new WeakMap(),
		g = new WeakMap(),
		E = new WeakMap(),
		w = new WeakMap(),
		I = new WeakMap(),
		x = new WeakMap(),
		b = new WeakMap(),
		k = new WeakMap(),
		S = new WeakMap(),
		P = new WeakMap(),
		M = new WeakMap(),
		C = function (e) {
			var t = new l(e);
			return t.start(), t;
		};
	(e.LottieInteractivity = l), (e.create = C), (e.default = C), Object.defineProperty(e, '__esModule', { value: !0 });
});
