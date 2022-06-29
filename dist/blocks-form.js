/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/***/ ((module) => {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@emotion/hash/dist/hash.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/@emotion/hash/dist/hash.esm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable */
// murmurhash2 via https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash2_32_gc(str) {
  var l = str.length,
      h = l ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (murmurhash2_32_gc);


/***/ }),

/***/ "./node_modules/@emotion/memoize/dist/memoize.esm.js":
/*!***********************************************************!*\
  !*** ./node_modules/@emotion/memoize/dist/memoize.esm.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (memoize);


/***/ }),

/***/ "./node_modules/@emotion/stylis/dist/stylis.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/@emotion/stylis/dist/stylis.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e, m).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e, m).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        switch (d.constructor) {
          case Array:
            for (var c = 0, e = d.length; c < e; ++c) {
              T(d[c]);
            }

            break;

          case Function:
            S[A++] = d;
            break;

          case Boolean:
            Y = !!d | 0;
        }

    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stylis_min);


/***/ }),

/***/ "./node_modules/@emotion/unitless/dist/unitless.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@emotion/unitless/dist/unitless.esm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unitlessKeys);


/***/ }),

/***/ "./src/blocks/form/editor.scss":
/*!*************************************!*\
  !*** ./src/blocks/form/editor.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/form/style.scss":
/*!************************************!*\
  !*** ./src/blocks/form/style.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/form/block.js":
/*!**********************************!*\
  !*** ./src/blocks/form/block.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @kadence/icons */ "@kadence/icons");
/* harmony import */ var _kadence_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_kadence_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/form/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/form/style.scss");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./block.json */ "./src/blocks/form/block.json");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__);


/**
 * BLOCK: Kadence Form Block
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */



/**
 * Import edit
 */


/**
 * Import Css
 */




/**
 * Internal block libraries
 */




/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_7__.registerBlockType)('kadence/form', { ..._block_json__WEBPACK_IMPORTED_MODULE_8__,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Form', 'kadence-blocks'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Create a contact or marketing form for your website.', 'kadence-blocks'),
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('contact', 'kadence-blocks'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('marketing', 'kadence-blocks'), 'KB'],
  icon: {
    src: _kadence_icons__WEBPACK_IMPORTED_MODULE_2__.formBlockIcon
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: props => {
    const {
      attributes: {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha,
        recaptchaVersion,
        honeyPot,
        messages,
        submitLabel
      }
    } = props;

    const fieldOutput = index => {
      if ('hidden' === fields[index].type) {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "hidden",
          name: `kb_field_${index}`,
          value: fields[index].default
        });
      }

      const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        [`kb-form-field-${index}`]: index,
        [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
        [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
        [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
        [`kb-input-size-${style[0].size}`]: style[0].size,
        'kb-accept-form-field': 'accept' === fields[index].type
      });
      let acceptLabel;
      let acceptLabelBefore;
      let acceptLabelAfter;

      if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
        acceptLabelBefore = fields[index].label.split('{')[0];
        acceptLabelAfter = fields[index].label.split('}')[1];
        acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
          target: "blank",
          rel: "noopener noreferrer"
        }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
      } else {
        acceptLabel = fields[index].label;
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: fieldClassName
      }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
        href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
        target: "_blank",
        rel: "noopener noreferrer",
        className: 'kb-accept-link'
      }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), undefined !== fields[index].ariaLabel && fields[index].ariaLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        id: `kb_field_desc_${uniqueID}_${index}`,
        className: "screen-reader-text kb-field-desc-label"
      }, fields[index].ariaLabel), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "checkbox",
        name: `kb_field_${index}`,
        id: `kb_field_${uniqueID}_${index}`,
        className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
        value: 'accept',
        checked: fields[index].inline ? true : false,
        "data-type": fields[index].type,
        "data-required": fields[index].required ? 'yes' : undefined,
        "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
        "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined,
        "aria-describedby": undefined !== fields[index].ariaLabel && fields[index].ariaLabel ? `kb_field_desc_${uniqueID}_${index}` : undefined
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
        htmlFor: `kb_field_${uniqueID}_${index}`
      }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "required"
      }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
        htmlFor: `kb_field_${uniqueID}_${index}`
      }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "required"
      }, "*") : ''), undefined !== fields[index].ariaLabel && fields[index].ariaLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        id: `kb_field_desc_${uniqueID}_${index}`,
        className: "screen-reader-text"
      }, fields[index].ariaLabel), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
        name: `kb_field_${index}`,
        id: `kb_field_${uniqueID}_${index}`,
        "data-label": fields[index].label,
        type: fields[index].type,
        placeholder: fields[index].placeholder,
        value: fields[index].default,
        "data-type": fields[index].type,
        className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
        rows: fields[index].rows,
        "data-required": fields[index].required ? 'yes' : undefined,
        "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
        "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined,
        "aria-describedby": undefined !== fields[index].ariaLabel && fields[index].ariaLabel ? `kb_field_desc_${uniqueID}_${index}` : undefined
      }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
        name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
        id: `kb_field_${uniqueID}_${index}`,
        multiple: fields[index].multiSelect ? true : false,
        "data-label": fields[index].label,
        type: fields[index].type,
        value: fields[index].default,
        "data-type": fields[index].type,
        className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
        "data-required": fields[index].required ? 'yes' : undefined,
        "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
        "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined,
        "aria-describedby": undefined !== fields[index].ariaLabel && fields[index].ariaLabel ? `kb_field_desc_${uniqueID}_${index}` : undefined
      }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
        value: "",
        disabled: true,
        selected: '' === fields[index].default ? true : false
      }, fields[index].placeholder), (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
        key: n,
        selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
        value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
      }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'checkbox' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        "data-type": fields[index].type,
        "data-label": fields[index].label,
        id: `kb_field_${uniqueID}_${index}`,
        className: `kb-field kb-checkbox-style-field kb-${fields[index].type}-field kb-field-${index} kb-radio-style-${fields[index].inline ? 'inline' : 'normal'}`,
        "data-required": fields[index].required ? 'yes' : undefined,
        "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
        "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: n,
        "data-type": fields[index].type,
        className: `kb-checkbox-item kb-checkbox-item-${n}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "checkbox",
        name: `kb_field_${index}[]`,
        id: `kb_field_${index}_${n}`,
        className: 'kb-sub-field kb-checkbox-style',
        value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
        checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
        htmlFor: `kb_field_${index}_${n}`
      }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'radio' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        "data-type": fields[index].type,
        "data-label": fields[index].label,
        id: `kb_field_${uniqueID}_${index}`,
        className: `kb-field kb-radio-style-field kb-${fields[index].type}-field kb-field-${index} kb-radio-style-${fields[index].inline ? 'inline' : 'normal'}`,
        "data-required": fields[index].required ? 'yes' : undefined,
        "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
        "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
      }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: n,
        "data-type": fields[index].type,
        className: `kb-radio-item kb-radio-item-${n}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "radio",
        name: `kb_field_${index}[]`,
        id: `kb_field_${index}_${n}`,
        className: 'kb-sub-field kb-radio-style',
        value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
        checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
        htmlFor: `kb_field_${index}_${n}`
      }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && 'checkbox' !== fields[index].type && 'radio' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        name: `kb_field_${index}`,
        id: `kb_field_${uniqueID}_${index}`,
        "data-label": fields[index].label,
        type: fields[index].type,
        placeholder: fields[index].placeholder,
        value: fields[index].default,
        "data-type": fields[index].type,
        className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
        autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
        "data-required": fields[index].required ? 'yes' : undefined,
        "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
        "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined,
        "aria-describedby": undefined !== fields[index].ariaLabel && fields[index].ariaLabel ? `kb_field_desc_${uniqueID}_${index}` : undefined
      })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: 'kb-field-help'
      }, fields[index].description ? fields[index].description : ''));
    };

    const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
    const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      'kadence-blocks-form-field': true,
      'kb-submit-field': true,
      [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
      [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
      [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
    });
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.useBlockProps.save({
      className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
    });
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
      className: "kb-form",
      action: "",
      method: "post",
      "data-error-message": messages && messages[0] && messages[0].preError ? messages[0].preError : undefined
    }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "hidden",
      name: "_kb_form_id",
      value: uniqueID
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "hidden",
      name: "_kb_form_post_id",
      value: postID
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "hidden",
      name: "action",
      value: "kb_process_ajax_submit"
    }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, recaptchaVersion === 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "kadence-blocks-form-field google-recaptcha-checkout-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      id: "kb-container-g-recaptcha",
      className: "google-recaptcha-container"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      id: `kb_recaptcha_${uniqueID}`,
      className: `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${uniqueID}`,
      style: {
        display: 'inline-block'
      }
    }))), recaptchaVersion !== 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "hidden",
      name: "recaptcha_response",
      className: `kb_recaptcha_response kb_recaptcha_${uniqueID}`
    })), honeyPot && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      className: "kadence-blocks-field verify",
      type: "text",
      name: "_kb_verify_email",
      autoComplete: "off",
      "aria-hidden": "true",
      placeholder: "Email",
      tabIndex: "-1"
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: submitClassName
    }, submitLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      id: `kb_submit_label_${uniqueID}`,
      className: "screen-reader-text kb-submit-desc-label"
    }, submitLabel), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
      tagName: "button",
      "aria-describedby": submitLabel ? `kb_submit_label_${uniqueID}` : undefined,
      value: '' !== submit[0].label ? submit[0].label : 'Submit',
      className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
    }))));
  },
  deprecated: [{
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      postID: {
        type: 'number',
        default: ''
      },
      hAlign: {
        type: 'string',
        default: ''
      },
      fields: {
        type: 'array',
        default: [{
          label: 'Name',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'text',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: false,
          width: ['100', '', ''],
          auto: '',
          errorMessage: '',
          requiredMessage: ''
        }, {
          label: 'Email',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'email',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: '',
          errorMessage: '',
          requiredMessage: ''
        }, {
          label: 'Message',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'textarea',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: '',
          errorMessage: '',
          requiredMessage: ''
        }]
      },
      messages: {
        type: 'array',
        default: [{
          success: '',
          error: '',
          required: '',
          invalid: '',
          recaptchaerror: '',
          preError: ''
        }]
      },
      messageFont: {
        type: 'array',
        default: [{
          colorSuccess: '',
          colorError: '',
          borderSuccess: '',
          borderError: '',
          backgroundSuccess: '',
          backgroundSuccessOpacity: 1,
          backgroundError: '',
          backgroundErrorOpacity: 1,
          borderWidth: ['', '', '', ''],
          borderRadius: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      style: {
        type: 'array',
        default: [{
          showRequired: true,
          size: 'standard',
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          requiredColor: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorActive: '',
          backgroundActive: '',
          borderActive: '',
          backgroundActiveOpacity: 1,
          borderActiveOpacity: 1,
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientActive: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          backgroundType: 'solid',
          backgroundActiveType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowActive: [false, '#000000', 0.4, 2, 2, 3, 0, false],
          fontSize: ['', '', ''],
          fontSizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          rowGap: '',
          rowGapType: 'px',
          gutter: '',
          gutterType: 'px'
        }]
      },
      labelFont: {
        type: 'array',
        default: [{
          color: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      submit: {
        type: 'array',
        default: [{
          label: '',
          width: ['100', '', ''],
          size: 'standard',
          widthType: 'auto',
          fixedWidth: ['', '', ''],
          align: ['', '', ''],
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorHover: '',
          backgroundHover: '',
          borderHover: '',
          backgroundHoverOpacity: 1,
          borderHoverOpacity: 1,
          icon: '',
          iconSide: 'right',
          iconHover: false,
          cssClass: '',
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          btnStyle: 'basic',
          btnSize: 'standard',
          backgroundType: 'solid',
          backgroundHoverType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false]
        }]
      },
      submitMargin: {
        type: 'array',
        default: [{
          desk: ['', '', '', ''],
          tablet: ['', '', '', ''],
          mobile: ['', '', '', ''],
          unit: 'px',
          control: 'linked'
        }]
      },
      submitFont: {
        type: 'array',
        default: [{
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true
        }]
      },
      actions: {
        type: 'array',
        default: ['email']
      },
      email: {
        type: 'array',
        default: [{
          emailTo: '',
          subject: '',
          fromEmail: '',
          fromName: '',
          replyTo: 'email_field',
          cc: '',
          bcc: '',
          html: true
        }]
      },
      redirect: {
        type: 'string',
        default: ''
      },
      recaptcha: {
        type: 'bool',
        default: false
      },
      recaptchaVersion: {
        type: 'string',
        default: 'v3'
      },
      honeyPot: {
        type: 'bool',
        default: true
      },
      mailerlite: {
        type: 'array',
        default: [{
          group: [],
          map: []
        }]
      },
      fluentcrm: {
        type: 'array',
        default: [{
          lists: [],
          tags: [],
          map: [],
          doubleOptin: false
        }]
      },
      containerMarginType: {
        type: 'string',
        default: 'px'
      },
      containerMargin: {
        type: 'array',
        default: ['', '', '', '']
      },
      tabletContainerMargin: {
        type: 'array',
        default: ['', '', '', '']
      },
      mobileContainerMargin: {
        type: 'array',
        default: ['', '', '', '']
      }
    },
    save: _ref => {
      let {
        attributes
      } = _ref;
      const {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha,
        recaptchaVersion,
        honeyPot,
        messages
      } = attributes;

      const fieldOutput = index => {
        if ('hidden' === fields[index].type) {
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
            type: "hidden",
            name: `kb_field_${index}`,
            value: fields[index].default
          });
        }

        const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          'kadence-blocks-form-field': true,
          [`kb-form-field-${index}`]: index,
          [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
          [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
          [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
          [`kb-input-size-${style[0].size}`]: style[0].size
        });
        let acceptLabel;
        let acceptLabelBefore;
        let acceptLabelAfter;

        if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
          acceptLabelBefore = fields[index].label.split('{')[0];
          acceptLabelAfter = fields[index].label.split('}')[1];
          acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
            target: "blank",
            rel: "noopener noreferrer"
          }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
        } else {
          acceptLabel = fields[index].label;
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: fieldClassName
        }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: 'kb-accept-link'
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
          value: 'accept',
          checked: fields[index].inline ? true : false,
          "data-type": fields[index].type,
          "data-required": fields[index].required ? 'yes' : undefined,
          "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
          "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          rows: fields[index].rows,
          "data-required": fields[index].required ? 'yes' : undefined,
          "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
          "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
        }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
          name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          multiple: fields[index].multiSelect ? true : false,
          "data-label": fields[index].label,
          type: fields[index].type,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined,
          "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
          "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          value: "",
          disabled: true,
          selected: '' === fields[index].default ? true : false
        }, fields[index].placeholder), (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          key: n,
          selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'checkbox' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          "data-type": fields[index].type,
          "data-label": fields[index].label,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style-field kb-${fields[index].type}-field kb-field-${index} kb-radio-style-${fields[index].inline ? 'inline' : 'normal'}`,
          "data-required": fields[index].required ? 'yes' : undefined,
          "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
          "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          key: n,
          "data-type": fields[index].type,
          className: `kb-checkbox-item kb-checkbox-item-${n}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}[]`,
          id: `kb_field_${index}_${n}`,
          className: 'kb-sub-field kb-checkbox-style',
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
          checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}_${n}`
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'radio' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          "data-type": fields[index].type,
          "data-label": fields[index].label,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-radio-style-field kb-${fields[index].type}-field kb-field-${index} kb-radio-style-${fields[index].inline ? 'inline' : 'normal'}`,
          "data-required": fields[index].required ? 'yes' : undefined,
          "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
          "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          key: n,
          "data-type": fields[index].type,
          className: `kb-radio-item kb-radio-item-${n}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "radio",
          name: `kb_field_${index}[]`,
          id: `kb_field_${index}_${n}`,
          className: 'kb-sub-field kb-radio-style',
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
          checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}_${n}`
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && 'checkbox' !== fields[index].type && 'radio' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
          "data-required": fields[index].required ? 'yes' : undefined,
          "data-required-message": fields[index].requiredMessage ? fields[index].requiredMessage : undefined,
          "data-validation-message": fields[index].errorMessage ? fields[index].errorMessage : undefined
        })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: 'kb-field-help'
        }, fields[index].description ? fields[index].description : ''));
      };

      const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
      const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        'kb-submit-field': true,
        [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
        [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
        [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
        className: "kb-form",
        action: "",
        method: "post",
        "data-error-message": messages && messages[0] && messages[0].preError ? messages[0].preError : undefined
      }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_id",
        value: uniqueID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_post_id",
        value: postID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "action",
        value: "kb_process_ajax_submit"
      }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, recaptchaVersion === 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kadence-blocks-form-field google-recaptcha-checkout-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        id: "kb-container-g-recaptcha",
        className: "google-recaptcha-container"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        id: `kb_recaptcha_${uniqueID}`,
        className: `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${uniqueID}`,
        style: {
          display: 'inline-block'
        }
      }))), recaptchaVersion !== 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "recaptcha_response",
        className: `kb_recaptcha_response kb_recaptcha_${uniqueID}`
      })), honeyPot && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        className: "kadence-blocks-field verify",
        type: "text",
        name: "_kb_verify_email",
        autoComplete: "off",
        placeholder: "Email",
        tabIndex: "-1"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: submitClassName
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        tagName: "button",
        value: '' !== submit[0].label ? submit[0].label : 'Submit',
        className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
      }))));
    }
  }, {
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      postID: {
        type: 'number',
        default: ''
      },
      hAlign: {
        type: 'string',
        default: ''
      },
      fields: {
        type: 'array',
        default: [{
          label: 'Name',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'text',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: false,
          width: ['100', '', ''],
          auto: '',
          errorMessage: ''
        }, {
          label: 'Email',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'email',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: '',
          errorMessage: ''
        }, {
          label: 'Message',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'textarea',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: '',
          errorMessage: ''
        }]
      },
      messages: {
        type: 'array',
        default: [{
          success: '',
          error: '',
          required: '',
          invalid: '',
          recaptchaerror: ''
        }]
      },
      messageFont: {
        type: 'array',
        default: [{
          colorSuccess: '',
          colorError: '',
          borderSuccess: '',
          borderError: '',
          backgroundSuccess: '',
          backgroundSuccessOpacity: 1,
          backgroundError: '',
          backgroundErrorOpacity: 1,
          borderWidth: ['', '', '', ''],
          borderRadius: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      style: {
        type: 'array',
        default: [{
          showRequired: true,
          size: 'standard',
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          requiredColor: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorActive: '',
          backgroundActive: '',
          borderActive: '',
          backgroundActiveOpacity: 1,
          borderActiveOpacity: 1,
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientActive: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          backgroundType: 'solid',
          backgroundActiveType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowActive: [false, '#000000', 0.4, 2, 2, 3, 0, false],
          fontSize: ['', '', ''],
          fontSizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          rowGap: '',
          rowGapType: 'px',
          gutter: '',
          gutterType: 'px'
        }]
      },
      labelFont: {
        type: 'array',
        default: [{
          color: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      submit: {
        type: 'array',
        default: [{
          label: '',
          width: ['100', '', ''],
          size: 'standard',
          widthType: 'auto',
          fixedWidth: ['', '', ''],
          align: ['', '', ''],
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorHover: '',
          backgroundHover: '',
          borderHover: '',
          backgroundHoverOpacity: 1,
          borderHoverOpacity: 1,
          icon: '',
          iconSide: 'right',
          iconHover: false,
          cssClass: '',
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          btnStyle: 'basic',
          btnSize: 'standard',
          backgroundType: 'solid',
          backgroundHoverType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false]
        }]
      },
      submitMargin: {
        type: 'array',
        default: [{
          desk: ['', '', '', ''],
          tablet: ['', '', '', ''],
          mobile: ['', '', '', ''],
          unit: 'px',
          control: 'linked'
        }]
      },
      submitFont: {
        type: 'array',
        default: [{
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true
        }]
      },
      actions: {
        type: 'array',
        default: ['email']
      },
      email: {
        type: 'array',
        default: [{
          emailTo: '',
          subject: '',
          fromEmail: '',
          fromName: '',
          replyTo: 'email_field',
          cc: '',
          bcc: '',
          html: true
        }]
      },
      redirect: {
        type: 'string',
        default: ''
      },
      recaptcha: {
        type: 'bool',
        default: false
      },
      recaptchaVersion: {
        type: 'string',
        default: 'v3'
      },
      honeyPot: {
        type: 'bool',
        default: true
      },
      mailerlite: {
        type: 'array',
        default: [{
          group: [],
          map: []
        }]
      },
      fluentcrm: {
        type: 'array',
        default: [{
          lists: [],
          tags: [],
          map: [],
          doubleOptin: false
        }]
      },
      containerMarginType: {
        type: 'string',
        default: 'px'
      },
      containerMargin: {
        type: 'array',
        default: ['', '', '', '']
      },
      tabletContainerMargin: {
        type: 'array',
        default: ['', '', '', '']
      },
      mobileContainerMargin: {
        type: 'array',
        default: ['', '', '', '']
      }
    },
    save: _ref2 => {
      let {
        attributes
      } = _ref2;
      const {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha,
        recaptchaVersion,
        honeyPot
      } = attributes;

      const fieldOutput = index => {
        const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          'kadence-blocks-form-field': true,
          [`kb-form-field-${index}`]: index,
          [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
          [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
          [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
          [`kb-input-size-${style[0].size}`]: style[0].size
        });
        let acceptLabel;
        let acceptLabelBefore;
        let acceptLabelAfter;

        if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
          acceptLabelBefore = fields[index].label.split('{')[0];
          acceptLabelAfter = fields[index].label.split('}')[1];
          acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
            target: "blank",
            rel: "noopener noreferrer"
          }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
        } else {
          acceptLabel = fields[index].label;
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: fieldClassName
        }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: 'kb-accept-link'
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
          value: 'accept',
          checked: fields[index].inline ? true : false,
          "data-type": fields[index].type,
          "data-required": fields[index].required ? 'yes' : undefined
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          rows: fields[index].rows,
          "data-required": fields[index].required ? 'yes' : undefined
        }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
          name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          multiple: fields[index].multiSelect ? true : false,
          "data-label": fields[index].label,
          type: fields[index].type,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          value: "",
          disabled: true,
          selected: '' === fields[index].default ? true : false
        }, fields[index].placeholder), (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          key: n,
          selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'checkbox' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          "data-type": fields[index].type,
          "data-label": fields[index].label,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          key: n,
          "data-type": fields[index].type,
          className: `kb-checkbox-item kb-checkbox-item-${n}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}[]`,
          id: `kb_field_${index}_${n}`,
          className: 'kb-sub-field kb-checkbox-style',
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
          checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}_${n}`
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'radio' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          "data-type": fields[index].type,
          "data-label": fields[index].label,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-radio-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          key: n,
          "data-type": fields[index].type,
          className: `kb-radio-item kb-radio-item-${n}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "radio",
          name: `kb_field_${index}[]`,
          id: `kb_field_${index}_${n}`,
          className: 'kb-sub-field kb-radio-style',
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
          checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}_${n}`
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && 'checkbox' !== fields[index].type && 'radio' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
          "data-required": fields[index].required ? 'yes' : undefined
        })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: 'kb-field-help'
        }, fields[index].description ? fields[index].description : ''));
      };

      const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
      const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        'kb-submit-field': true,
        [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
        [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
        [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
        className: "kb-form",
        action: "",
        method: "post"
      }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_id",
        value: uniqueID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_post_id",
        value: postID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "action",
        value: "kb_process_ajax_submit"
      }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, recaptchaVersion === 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kadence-blocks-form-field google-recaptcha-checkout-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        id: "kb-container-g-recaptcha",
        className: "google-recaptcha-container"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        id: `kb_recaptcha_${uniqueID}`,
        className: `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${uniqueID}`,
        style: {
          display: 'inline-block'
        }
      }))), recaptchaVersion !== 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "recaptcha_response",
        className: `kb_recaptcha_response kb_recaptcha_${uniqueID}`
      })), honeyPot && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        className: "kadence-blocks-field verify",
        type: "text",
        name: "_kb_verify_email",
        autoComplete: "off",
        placeholder: "Email",
        tabIndex: "-1"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: submitClassName
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        tagName: "button",
        value: '' !== submit[0].label ? submit[0].label : 'Submit',
        className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
      }))));
    }
  }, {
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      postID: {
        type: 'number',
        default: ''
      },
      hAlign: {
        type: 'string',
        default: ''
      },
      fields: {
        type: 'array',
        default: [{
          label: 'Name',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'text',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: false,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Email',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'email',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Message',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'textarea',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }]
      },
      messages: {
        type: 'array',
        default: [{
          success: '',
          error: '',
          required: '',
          invalid: '',
          recaptchaerror: ''
        }]
      },
      messageFont: {
        type: 'array',
        default: [{
          colorSuccess: '',
          colorError: '',
          borderSuccess: '',
          borderError: '',
          backgroundSuccess: '',
          backgroundSuccessOpacity: 1,
          backgroundError: '',
          backgroundErrorOpacity: 1,
          borderWidth: ['', '', '', ''],
          borderRadius: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      style: {
        type: 'array',
        default: [{
          showRequired: true,
          size: 'standard',
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          requiredColor: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorActive: '',
          backgroundActive: '',
          borderActive: '',
          backgroundActiveOpacity: 1,
          borderActiveOpacity: 1,
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientActive: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          backgroundType: 'solid',
          backgroundActiveType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowActive: [false, '#000000', 0.4, 2, 2, 3, 0, false],
          fontSize: ['', '', ''],
          fontSizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          rowGap: '',
          rowGapType: 'px',
          gutter: '',
          gutterType: 'px'
        }]
      },
      labelFont: {
        type: 'array',
        default: [{
          color: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      submit: {
        type: 'array',
        default: [{
          label: '',
          width: ['100', '', ''],
          size: 'standard',
          widthType: 'auto',
          fixedWidth: ['', '', ''],
          align: ['', '', ''],
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorHover: '',
          backgroundHover: '',
          borderHover: '',
          backgroundHoverOpacity: 1,
          borderHoverOpacity: 1,
          icon: '',
          iconSide: 'right',
          iconHover: false,
          cssClass: '',
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          btnStyle: 'basic',
          btnSize: 'standard',
          backgroundType: 'solid',
          backgroundHoverType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false]
        }]
      },
      submitMargin: {
        type: 'array',
        default: [{
          desk: ['', '', '', ''],
          tablet: ['', '', '', ''],
          mobile: ['', '', '', ''],
          unit: 'px',
          control: 'linked'
        }]
      },
      submitFont: {
        type: 'array',
        default: [{
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true
        }]
      },
      actions: {
        type: 'array',
        default: ['email']
      },
      email: {
        type: 'array',
        default: [{
          emailTo: '',
          subject: '',
          fromEmail: '',
          fromName: '',
          replyTo: 'email_field',
          cc: '',
          bcc: '',
          html: true
        }]
      },
      redirect: {
        type: 'string',
        default: ''
      },
      recaptcha: {
        type: 'bool',
        default: false
      },
      recaptchaVersion: {
        type: 'string',
        default: 'v3'
      },
      honeyPot: {
        type: 'bool',
        default: true
      }
    },
    save: _ref3 => {
      let {
        attributes
      } = _ref3;
      const {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha,
        recaptchaVersion,
        honeyPot
      } = attributes;

      const fieldOutput = index => {
        const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          'kadence-blocks-form-field': true,
          [`kb-form-field-${index}`]: index,
          [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
          [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
          [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
          [`kb-input-size-${style[0].size}`]: style[0].size
        });
        let acceptLabel;
        let acceptLabelBefore;
        let acceptLabelAfter;

        if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
          acceptLabelBefore = fields[index].label.split('{')[0];
          acceptLabelAfter = fields[index].label.split('}')[1];
          acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
            target: "blank",
            rel: "noopener noreferrer"
          }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
        } else {
          acceptLabel = fields[index].label;
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: fieldClassName
        }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: 'kb-accept-link'
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
          value: 'accept',
          checked: fields[index].inline ? true : false,
          "data-type": fields[index].type,
          "data-required": fields[index].required ? 'yes' : undefined
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          rows: fields[index].rows,
          "data-required": fields[index].required ? 'yes' : undefined
        }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
          name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          multiple: fields[index].multiSelect ? true : false,
          "data-label": fields[index].label,
          type: fields[index].type,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          key: n,
          selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'checkbox' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          "data-type": fields[index].type,
          "data-label": fields[index].label,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          key: n,
          "data-type": fields[index].type,
          className: `kb-checkbox-item kb-checkbox-item-${n}`
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}[]`,
          id: `kb_field_${index}_${n}`,
          className: 'kb-sub-field kb-checkbox-style',
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
          checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}_${n}`
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && 'checkbox' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
          "data-required": fields[index].required ? 'yes' : undefined
        })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: 'kb-field-help'
        }, fields[index].description ? fields[index].description : ''));
      };

      const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
      const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        'kb-submit-field': true,
        [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
        [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
        [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
        className: "kb-form",
        action: "",
        method: "post"
      }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_id",
        value: uniqueID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_post_id",
        value: postID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "action",
        value: "kb_process_ajax_submit"
      }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, recaptchaVersion === 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kadence-blocks-form-field google-recaptcha-checkout-wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        id: "kb-container-g-recaptcha",
        className: "google-recaptcha-container"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        id: `kb_recaptcha_${uniqueID}`,
        className: `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${uniqueID}`,
        style: {
          display: 'inline-block'
        }
      }))), recaptchaVersion !== 'v2' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "recaptcha_response",
        className: `kb_recaptcha_response kb_recaptcha_${uniqueID}`
      })), honeyPot && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        className: "kadence-blocks-field verify",
        type: "text",
        name: "_kb_verify_email",
        autoComplete: "off",
        placeholder: "Email",
        tabIndex: "-1"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: submitClassName
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        tagName: "button",
        value: '' !== submit[0].label ? submit[0].label : 'Submit',
        className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
      }))));
    }
  }, {
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      postID: {
        type: 'number',
        default: ''
      },
      hAlign: {
        type: 'string',
        default: ''
      },
      fields: {
        type: 'array',
        default: [{
          label: 'Name',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'text',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: false,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Email',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'email',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Message',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'textarea',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }]
      },
      messages: {
        type: 'array',
        default: [{
          success: '',
          error: '',
          required: '',
          invalid: ''
        }]
      },
      messageFont: {
        type: 'array',
        default: [{
          colorSuccess: '',
          colorError: '',
          borderSuccess: '',
          borderError: '',
          backgroundSuccess: '',
          backgroundSuccessOpacity: 1,
          backgroundError: '',
          backgroundErrorOpacity: 1,
          borderWidth: ['', '', '', ''],
          borderRadius: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      style: {
        type: 'array',
        default: [{
          showRequired: true,
          size: 'standard',
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          requiredColor: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorActive: '',
          backgroundActive: '',
          borderActive: '',
          backgroundActiveOpacity: 1,
          borderActiveOpacity: 1,
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientActive: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          backgroundType: 'solid',
          backgroundActiveType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowActive: [false, '#000000', 0.4, 2, 2, 3, 0, false],
          fontSize: ['', '', ''],
          fontSizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          rowGap: '',
          rowGapType: 'px',
          gutter: '',
          gutterType: 'px'
        }]
      },
      labelFont: {
        type: 'array',
        default: [{
          color: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      submit: {
        type: 'array',
        default: [{
          label: '',
          width: ['100', '', ''],
          size: 'standard',
          widthType: 'auto',
          fixedWidth: ['', '', ''],
          align: ['', '', ''],
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorHover: '',
          backgroundHover: '',
          borderHover: '',
          backgroundHoverOpacity: 1,
          borderHoverOpacity: 1,
          icon: '',
          iconSide: 'right',
          iconHover: false,
          cssClass: '',
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          btnStyle: 'basic',
          btnSize: 'standard',
          backgroundType: 'solid',
          backgroundHoverType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false]
        }]
      },
      submitMargin: {
        type: 'array',
        default: [{
          desk: ['', '', '', ''],
          tablet: ['', '', '', ''],
          mobile: ['', '', '', ''],
          unit: 'px',
          control: 'linked'
        }]
      },
      submitFont: {
        type: 'array',
        default: [{
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true
        }]
      },
      actions: {
        type: 'array',
        default: ['email']
      },
      email: {
        type: 'array',
        default: [{
          emailTo: '',
          subject: '',
          fromEmail: '',
          fromName: '',
          replyTo: 'email_field',
          cc: '',
          bcc: '',
          html: true
        }]
      },
      redirect: {
        type: 'string',
        default: ''
      },
      recaptcha: {
        type: 'bool',
        default: false
      },
      honeyPot: {
        type: 'bool',
        default: true
      }
    },
    save: _ref4 => {
      let {
        attributes
      } = _ref4;
      const {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha,
        honeyPot
      } = attributes;

      const fieldOutput = index => {
        const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          'kadence-blocks-form-field': true,
          [`kb-form-field-${index}`]: index,
          [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
          [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
          [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
          [`kb-input-size-${style[0].size}`]: style[0].size
        });
        let acceptLabel;
        let acceptLabelBefore;
        let acceptLabelAfter;

        if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
          acceptLabelBefore = fields[index].label.split('{')[0];
          acceptLabelAfter = fields[index].label.split('}')[1];
          acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
            target: "blank",
            rel: "noopener noreferrer"
          }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
        } else {
          acceptLabel = fields[index].label;
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: fieldClassName
        }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: 'kb-accept-link'
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
          value: 'accept',
          checked: fields[index].inline ? true : false,
          "data-type": fields[index].type,
          "data-required": fields[index].required ? 'yes' : undefined
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${uniqueID}_${index}`
        }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          rows: fields[index].rows,
          "data-required": fields[index].required ? 'yes' : undefined
        }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
          name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          multiple: fields[index].multiSelect ? true : false,
          "data-label": fields[index].label,
          type: fields[index].type,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          key: n,
          selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          name: `kb_field_${index}`,
          id: `kb_field_${uniqueID}_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
          "data-required": fields[index].required ? 'yes' : undefined
        })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: 'kb-field-help'
        }, fields[index].description ? fields[index].description : ''));
      };

      const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
      const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        'kb-submit-field': true,
        [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
        [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
        [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
        className: "kb-form",
        action: "",
        method: "post"
      }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_id",
        value: uniqueID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_post_id",
        value: postID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "action",
        value: "kb_process_ajax_submit"
      }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "recaptcha_response",
        className: `kb_recaptcha_response kb_recaptcha_${uniqueID}`
      }), honeyPot && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        className: "kadence-blocks-field verify",
        type: "email",
        name: "_kb_verify_email",
        autoComplete: "off",
        placeholder: "Email",
        tabIndex: "-1"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: submitClassName
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        tagName: "button",
        value: '' !== submit[0].label ? submit[0].label : 'Submit',
        className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
      }))));
    }
  }, {
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      postID: {
        type: 'number',
        default: ''
      },
      hAlign: {
        type: 'string',
        default: ''
      },
      fields: {
        type: 'array',
        default: [{
          label: 'Name',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'text',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: false,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Email',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'email',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Message',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'textarea',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }]
      },
      messages: {
        type: 'array',
        default: [{
          success: '',
          error: '',
          required: '',
          invalid: ''
        }]
      },
      messageFont: {
        type: 'array',
        default: [{
          colorSuccess: '',
          colorError: '',
          borderSuccess: '',
          borderError: '',
          backgroundSuccess: '',
          backgroundSuccessOpacity: 1,
          backgroundError: '',
          backgroundErrorOpacity: 1,
          borderWidth: ['', '', '', ''],
          borderRadius: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      style: {
        type: 'array',
        default: [{
          showRequired: true,
          size: 'standard',
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          requiredColor: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorActive: '',
          backgroundActive: '',
          borderActive: '',
          backgroundActiveOpacity: 1,
          borderActiveOpacity: 1,
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientActive: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          backgroundType: 'solid',
          backgroundActiveType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowActive: [false, '#000000', 0.4, 2, 2, 3, 0, false],
          fontSize: ['', '', ''],
          fontSizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          rowGap: '',
          rowGapType: 'px',
          gutter: '',
          gutterType: 'px'
        }]
      },
      labelFont: {
        type: 'array',
        default: [{
          color: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      submit: {
        type: 'array',
        default: [{
          label: '',
          width: ['100', '', ''],
          size: 'standard',
          widthType: 'auto',
          fixedWidth: ['', '', ''],
          align: ['', '', ''],
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorHover: '',
          backgroundHover: '',
          borderHover: '',
          backgroundHoverOpacity: 1,
          borderHoverOpacity: 1,
          icon: '',
          iconSide: 'right',
          iconHover: false,
          cssClass: '',
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          btnStyle: 'basic',
          btnSize: 'standard',
          backgroundType: 'solid',
          backgroundHoverType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false]
        }]
      },
      submitFont: {
        type: 'array',
        default: [{
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true
        }]
      },
      actions: {
        type: 'array',
        default: ['email']
      },
      email: {
        type: 'array',
        default: [{
          emailTo: '',
          subject: '',
          fromEmail: '',
          fromName: '',
          replyTo: 'email_field',
          cc: '',
          bcc: '',
          html: true
        }]
      },
      redirect: {
        type: 'string',
        default: ''
      },
      recaptcha: {
        type: 'bool',
        default: false
      },
      honeyPot: {
        type: 'bool',
        default: true
      }
    },
    save: _ref5 => {
      let {
        attributes
      } = _ref5;
      const {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha,
        honeyPot
      } = attributes;

      const fieldOutput = index => {
        const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          'kadence-blocks-form-field': true,
          [`kb-form-field-${index}`]: index,
          [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
          [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
          [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
          [`kb-input-size-${style[0].size}`]: style[0].size
        });
        let acceptLabel;
        let acceptLabelBefore;
        let acceptLabelAfter;

        if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
          acceptLabelBefore = fields[index].label.split('{')[0];
          acceptLabelAfter = fields[index].label.split('}')[1];
          acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
            target: "blank",
            rel: "noopener noreferrer"
          }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
        } else {
          acceptLabel = fields[index].label;
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: fieldClassName
        }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: 'kb-accept-link'
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}`,
          id: `kb_field_${index}`,
          className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
          value: 'accept',
          checked: fields[index].inline ? true : false,
          "data-type": fields[index].type,
          "data-required": fields[index].required ? 'yes' : undefined
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}`
        }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}`
        }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          name: `kb_field_${index}`,
          id: `kb_field_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          rows: fields[index].rows,
          "data-required": fields[index].required ? 'yes' : undefined
        }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
          name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
          id: `kb_field_${index}`,
          multiple: fields[index].multiSelect ? true : false,
          "data-label": fields[index].label,
          type: fields[index].type,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          key: n,
          selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          name: `kb_field_${index}`,
          id: `kb_field_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
          "data-required": fields[index].required ? 'yes' : undefined
        })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: 'kb-field-help'
        }, fields[index].description ? fields[index].description : ''));
      };

      const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
      const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        'kb-submit-field': true,
        [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
        [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
        [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
        className: "kb-form",
        action: "",
        method: "post"
      }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_id",
        value: uniqueID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_post_id",
        value: postID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "action",
        value: "kb_process_ajax_submit"
      }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "recaptcha_response",
        className: "kb_recaptcha_response"
      }), honeyPot && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        className: "kadence-blocks-field verify",
        type: "email",
        name: "_kb_verify_email",
        autoComplete: "off",
        placeholder: "Email",
        tabIndex: "-1"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: submitClassName
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        tagName: "button",
        value: '' !== submit[0].label ? submit[0].label : 'Submit',
        className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
      }))));
    }
  }, {
    attributes: {
      uniqueID: {
        type: 'string',
        default: ''
      },
      postID: {
        type: 'number',
        default: ''
      },
      hAlign: {
        type: 'string',
        default: ''
      },
      fields: {
        type: 'array',
        default: [{
          label: 'Name',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'text',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: false,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Email',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'email',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }, {
          label: 'Message',
          showLabel: true,
          placeholder: '',
          default: '',
          description: '',
          rows: 4,
          options: [{
            value: '',
            label: ''
          }],
          multiSelect: false,
          inline: false,
          showLink: false,
          min: '',
          max: '',
          type: 'textarea',
          // text, email, textarea, url, tel, radio, select, check, accept
          required: true,
          width: ['100', '', ''],
          auto: ''
        }]
      },
      messages: {
        type: 'array',
        default: [{
          success: '',
          error: '',
          required: '',
          invalid: ''
        }]
      },
      messageFont: {
        type: 'array',
        default: [{
          colorSuccess: '',
          colorError: '',
          borderSuccess: '',
          borderError: '',
          backgroundSuccess: '',
          backgroundSuccessOpacity: 1,
          backgroundError: '',
          backgroundErrorOpacity: 1,
          borderWidth: ['', '', '', ''],
          borderRadius: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      style: {
        type: 'array',
        default: [{
          showRequired: true,
          size: 'standard',
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          requiredColor: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorActive: '',
          backgroundActive: '',
          borderActive: '',
          backgroundActiveOpacity: 1,
          borderActiveOpacity: 1,
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientActive: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          backgroundType: 'solid',
          backgroundActiveType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowActive: [false, '#000000', 0.4, 2, 2, 3, 0, false],
          fontSize: ['', '', ''],
          fontSizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          rowGap: '',
          rowGapType: 'px',
          gutter: '',
          gutterType: 'px'
        }]
      },
      labelFont: {
        type: 'array',
        default: [{
          color: '',
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true,
          padding: ['', '', '', ''],
          margin: ['', '', '', '']
        }]
      },
      submit: {
        type: 'array',
        default: [{
          label: '',
          width: ['100', '', ''],
          size: 'standard',
          widthType: 'auto',
          fixedWidth: ['', '', ''],
          align: ['', '', ''],
          deskPadding: ['', '', '', ''],
          tabletPadding: ['', '', '', ''],
          mobilePadding: ['', '', '', ''],
          color: '',
          background: '',
          border: '',
          backgroundOpacity: 1,
          borderOpacity: 1,
          borderRadius: '',
          borderWidth: ['', '', '', ''],
          colorHover: '',
          backgroundHover: '',
          borderHover: '',
          backgroundHoverOpacity: 1,
          borderHoverOpacity: 1,
          icon: '',
          iconSide: 'right',
          iconHover: false,
          cssClass: '',
          gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
          gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
          btnStyle: 'basic',
          btnSize: 'standard',
          backgroundType: 'solid',
          backgroundHoverType: 'solid',
          boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
          boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false]
        }]
      },
      submitFont: {
        type: 'array',
        default: [{
          size: ['', '', ''],
          sizeType: 'px',
          lineHeight: ['', '', ''],
          lineType: 'px',
          letterSpacing: '',
          textTransform: '',
          family: '',
          google: '',
          style: '',
          weight: '',
          variant: '',
          subset: '',
          loadGoogle: true
        }]
      },
      actions: {
        type: 'array',
        default: ['email']
      },
      email: {
        type: 'array',
        default: [{
          emailTo: '',
          subject: '',
          fromEmail: '',
          fromName: '',
          replyTo: 'email_field',
          cc: '',
          bcc: '',
          html: true
        }]
      },
      redirect: {
        type: 'string',
        default: ''
      },
      recaptcha: {
        type: 'bool',
        default: false
      }
    },
    save: _ref6 => {
      let {
        attributes
      } = _ref6;
      const {
        uniqueID,
        fields,
        submit,
        style,
        postID,
        hAlign,
        recaptcha
      } = attributes;

      const fieldOutput = index => {
        const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
          'kadence-blocks-form-field': true,
          [`kb-form-field-${index}`]: index,
          [`kb-field-desk-width-${fields[index].width[0]}`]: fields[index].width && fields[index].width[0],
          [`kb-field-tablet-width-${fields[index].width[1]}`]: fields[index].width && fields[index].width[1],
          [`kb-field-mobile-width-${fields[index].width[2]}`]: fields[index].width && fields[index].width[2],
          [`kb-input-size-${style[0].size}`]: style[0].size
        });
        let acceptLabel;
        let acceptLabelBefore;
        let acceptLabelAfter;

        if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
          acceptLabelBefore = fields[index].label.split('{')[0];
          acceptLabelAfter = fields[index].label.split('}')[1];
          acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
            href: undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
            target: "blank",
            rel: "noopener noreferrer"
          }, undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
        } else {
          acceptLabel = fields[index].label;
        }

        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: fieldClassName
        }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: 'kb-accept-link'
        }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : 'View Privacy Policy'), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          name: `kb_field_${index}`,
          id: `kb_field_${index}`,
          className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
          value: 'accept',
          checked: fields[index].inline ? true : false,
          "data-type": fields[index].type,
          "data-required": fields[index].required ? 'yes' : undefined
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}`
        }, fields[index].label ? acceptLabel : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          htmlFor: `kb_field_${index}`
        }, fields[index].label ? fields[index].label : '', fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "required"
        }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          name: `kb_field_${index}`,
          id: `kb_field_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          rows: fields[index].rows,
          "data-required": fields[index].required ? 'yes' : undefined
        }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("select", {
          name: fields[index].multiSelect ? `kb_field_${index}[]` : `kb_field_${index}`,
          id: `kb_field_${index}`,
          multiple: fields[index].multiSelect ? true : false,
          "data-label": fields[index].label,
          type: fields[index].type,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
          "data-required": fields[index].required ? 'yes' : undefined
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("option", {
          key: n,
          selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
          value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
        }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'textarea' !== fields[index].type && 'select' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          name: `kb_field_${index}`,
          id: `kb_field_${index}`,
          "data-label": fields[index].label,
          type: fields[index].type,
          placeholder: fields[index].placeholder,
          value: fields[index].default,
          "data-type": fields[index].type,
          className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
          autoComplete: '' !== fields[index].auto ? fields[index].auto : undefined,
          "data-required": fields[index].required ? 'yes' : undefined
        })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: 'kb-field-help'
        }, fields[index].description ? fields[index].description : ''));
      };

      const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));
      const submitClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()({
        'kadence-blocks-form-field': true,
        'kb-submit-field': true,
        [`kb-field-desk-width-${submit[0].width[0]}`]: submit[0].width && submit[0].width[0],
        [`kb-field-tablet-width-${submit[0].width[1]}`]: submit[0].width && submit[0].width[1],
        [`kb-field-mobile-width-${submit[0].width[2]}`]: submit[0].width && submit[0].width[2]
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: `kadence-form-${uniqueID} kb-form-wrap${hAlign ? ' kb-form-align-' + hAlign : ''}`
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
        className: "kb-form",
        action: "",
        method: "post"
      }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_id",
        value: uniqueID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "_kb_form_post_id",
        value: postID
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "action",
        value: "kb_process_ajax_submit"
      }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        type: "hidden",
        name: "recaptcha_response",
        id: "kb_recaptcha_response"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
        className: "kadence-blocks-field verify",
        type: "email",
        name: "_kb_verify_email",
        autoComplete: "off",
        placeholder: "Email",
        tabIndex: "-1"
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: submitClassName
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.RichText.Content, {
        tagName: "button",
        value: '' !== submit[0].label ? submit[0].label : 'Submit',
        className: `kb-forms-submit button kb-button-size-${submit[0].size ? submit[0].size : 'standard'} kb-button-width-${submit[0].widthType ? submit[0].widthType : 'auto'}`
      }))));
    }
  }]
});

/***/ }),

/***/ "./src/blocks/form/edit.js":
/*!*********************************!*\
  !*** ./src/blocks/form/edit.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _mailerlite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mailerlite.js */ "./src/blocks/form/mailerlite.js");
/* harmony import */ var _fluentcrm_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./fluentcrm.js */ "./src/blocks/form/fluentcrm.js");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @kadence/helpers */ "@kadence/helpers");
/* harmony import */ var _kadence_helpers__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./editor.scss */ "./src/blocks/form/editor.scss");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _wordpress_widgets__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/widgets */ "@wordpress/widgets");
/* harmony import */ var _wordpress_widgets__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_widgets__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @wordpress/keycodes */ "@wordpress/keycodes");
/* harmony import */ var _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_wordpress_keycodes__WEBPACK_IMPORTED_MODULE_15__);



/**
 * BLOCK: Kadence Field Overlay
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import External
 */






/**
 * Import Css
 */


/**
 * Internal block libraries
 */









const RETRIEVE_KEY_URL = 'https://g.co/recaptcha/v3';
const HELP_URL = 'https://developers.google.com/recaptcha/docs/v3';
const actionOptionsList = [{
  value: 'email',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email', 'kadence-blocks'),
  help: '',
  isDisabled: false
}, {
  value: 'redirect',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Redirect', 'kadence-blocks'),
  help: '',
  isDisabled: false
}, {
  value: 'mailerlite',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Mailerlite', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Add User to MailerLite list', 'kadence-blocks'),
  isDisabled: false
}, {
  value: 'fluentCRM',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('FluentCRM', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Add User to FluentCRM list', 'kadence-blocks'),
  isDisabled: false
}, {
  value: 'autoEmail',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Auto Respond Email (Pro addon)', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Send instant response to form entrant', 'kadence-blocks'),
  isDisabled: true
}, {
  value: 'entry',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Database Entry (Pro addon)', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Log each form submission', 'kadence-blocks'),
  isDisabled: true
}, {
  value: 'sendinblue',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('SendInBlue (Pro addon)', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Add user to SendInBlue list', 'kadence-blocks'),
  isDisabled: true
}, {
  value: 'mailchimp',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('MailChimp (Pro addon)', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Add user to MailChimp list', 'kadence-blocks'),
  isDisabled: true
}, {
  value: 'webhook',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('WebHook (Pro addon)', 'kadence-blocks'),
  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Send form information to any third party webhook', 'kadence-blocks'),
  isDisabled: true
}];
/**
 * Build the form edit
 */

function KadenceForm(props) {
  const {
    attributes,
    className,
    isSelected,
    setAttributes,
    clientId
  } = props;
  const {
    uniqueID,
    style,
    fields,
    submit,
    actions,
    align,
    labelFont,
    recaptcha,
    redirect,
    messages,
    messageFont,
    email,
    hAlign,
    honeyPot,
    submitFont,
    kadenceAnimation,
    kadenceAOSOptions,
    submitMargin,
    recaptchaVersion,
    mailerlite,
    fluentcrm,
    containerMargin,
    tabletContainerMargin,
    mobileContainerMargin,
    containerMarginType,
    submitLabel
  } = attributes;

  const getID = () => {
    let postID;

    if ((0,_wordpress_widgets__WEBPACK_IMPORTED_MODULE_10__.getWidgetIdFromBlock)(props)) {
      if (!postID) {
        setAttributes({
          postID: (0,_wordpress_widgets__WEBPACK_IMPORTED_MODULE_10__.getWidgetIdFromBlock)(props)
        });
      } else if ((0,_wordpress_widgets__WEBPACK_IMPORTED_MODULE_10__.getWidgetIdFromBlock)(props) !== postID) {
        setAttributes({
          postID: (0,_wordpress_widgets__WEBPACK_IMPORTED_MODULE_10__.getWidgetIdFromBlock)(props)
        });
      }
    } else if (wp.data.select('core/editor')) {
      const {
        getCurrentPostId
      } = wp.data.select('core/editor');

      if (!postID && getCurrentPostId()) {
        setAttributes({
          postID: getCurrentPostId().toString()
        });
      } else if (getCurrentPostId() && getCurrentPostId().toString() !== postID) {
        setAttributes({
          postID: getCurrentPostId().toString()
        });
      }
    } else {
      if (!postID) {
        setAttributes({
          postID: 'block-unknown'
        });
      }
    }
  };

  const {
    addUniqueID
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_11__.useDispatch)('kadenceblocks/data');
  const {
    isUniqueID,
    isUniqueBlock,
    previewDevice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_11__.useSelect)(select => {
    return {
      isUniqueID: value => select('kadenceblocks/data').isUniqueID(value),
      isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
      previewDevice: select('kadenceblocks/data').getPreviewDeviceType()
    };
  }, [clientId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    let smallID = '_' + clientId.substr(2, 9);

    if (!uniqueID) {
      const blockConfigObject = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [];

      if (undefined === attributes.noCustomDefaults || !attributes.noCustomDefaults) {
        if (blockConfigObject['kadence/column'] !== undefined && typeof blockConfigObject['kadence/column'] === 'object') {
          Object.keys(blockConfigObject['kadence/column']).map(attribute => {
            attributes[attribute] = blockConfigObject['kadence/column'][attribute];
          });
        }
      }

      if (!isUniqueID(uniqueID)) {
        smallID = uniqueId(smallID);
      }

      setAttributes({
        uniqueID: smallID
      });
      addUniqueID(smallID, clientId);
    } else if (!isUniqueID(uniqueID)) {
      // This checks if we are just switching views, client ID the same means we don't need to update.
      if (!isUniqueBlock(uniqueID, clientId)) {
        attributes.uniqueID = smallID;
        addUniqueID(smallID, clientId);
      }
    } else {
      addUniqueID(uniqueID, clientId);
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setActionOptions((0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__.applyFilters)('kadence.actionOptions', actionOptionsList));

    if (style && style[0]) {
      if (style[0].deskPadding[0] === style[0].deskPadding[1] && style[0].deskPadding[0] === style[0].deskPadding[2] && style[0].deskPadding[0] === style[0].deskPadding[3]) {
        setDeskPaddingControl('linked');
      } else {
        setDeskPaddingControl('individual');
      }

      if (style[0].tabletPadding[0] === style[0].tabletPadding[1] && style[0].tabletPadding[0] === style[0].tabletPadding[2] && style[0].tabletPadding[0] === style[0].tabletPadding[3]) {
        setTabletPaddingControl('linked');
      } else {
        setTabletPaddingControl('individual');
      }

      if (style[0].mobilePadding[0] === style[0].mobilePadding[1] && style[0].mobilePadding[0] === style[0].mobilePadding[2] && style[0].mobilePadding[0] === style[0].mobilePadding[3]) {
        setMobilePaddingControl('linked');
      } else {
        setMobilePaddingControl('individual');
      }

      if (style[0].borderWidth[0] === style[0].borderWidth[1] && style[0].borderWidth[0] === style[0].borderWidth[2] && style[0].borderWidth[0] === style[0].borderWidth[3]) {
        setBorderControl('linked');
      } else {
        setBorderControl('individual');
      }
    }

    if (submit && submit[0]) {
      if (submit[0].deskPadding[0] === submit[0].deskPadding[1] && submit[0].deskPadding[0] === submit[0].deskPadding[2] && submit[0].deskPadding[0] === submit[0].deskPadding[3]) {
        setSubmitDeskPaddingControl('linked');
      } else {
        setSubmitDeskPaddingControl('individual');
      }

      if (submit[0].tabletPadding[0] === submit[0].tabletPadding[1] && submit[0].tabletPadding[0] === submit[0].tabletPadding[2] && submit[0].tabletPadding[0] === submit[0].tabletPadding[3]) {
        setSubmitTabletPaddingControl('linked');
      } else {
        setSubmitTabletPaddingControl('individual');
      }

      if (submit[0].mobilePadding[0] === submit[0].mobilePadding[1] && submit[0].mobilePadding[0] === submit[0].mobilePadding[2] && submit[0].mobilePadding[0] === submit[0].mobilePadding[3]) {
        setSubmitMobilePaddingControl('linked');
      } else {
        setSubmitMobilePaddingControl('individual');
      }

      if (submit[0].borderWidth[0] === submit[0].borderWidth[1] && submit[0].borderWidth[0] === submit[0].borderWidth[2] && submit[0].borderWidth[0] === submit[0].borderWidth[3]) {
        setSubmitBorderControl('linked');
      } else {
        setSubmitBorderControl('individual');
      }
    }

    if (messageFont && messageFont[0]) {
      if (messageFont[0].borderWidth[0] === messageFont[0].borderWidth[1] && messageFont[0].borderWidth[0] === messageFont[0].borderWidth[2] && messageFont[0].borderWidth[0] === messageFont[0].borderWidth[3]) {
        setMessageFontBorderControl('linked');
      } else {
        setMessageFontBorderControl('individual');
      }
    }

    getID();
    /**
     * Get settings
     */

    let settings;
    wp.api.loadPromise.then(() => {
      settings = new wp.api.models.Settings();
      settings.fetch().then(response => {
        setSiteKey(response.kadence_blocks_recaptcha_site_key);
        setSecretKey(response.kadence_blocks_recaptcha_secret_key);

        if ('' !== siteKey && '' !== secretKey) {
          setIsSavedKey(true);
        }
      });
    });
  }, []);
  const [actionOptions, setActionOptions] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [selectedField, setSelectedField] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [deskPaddingControl, setDeskPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [tabletPaddingControl, setTabletPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [mobilePaddingControl, setMobilePaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [borderControl, setBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [labelPaddingControl, setLabelPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [labelMarginControl, setLabelMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [submitBorderControl, setSubmitBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [submitDeskPaddingControl, setSubmitDeskPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [submitTabletPaddingControl, setSubmitTabletPaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [submitMobilePaddingControl, setSubmitMobilePaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [messageFontBorderControl, setMessageFontBorderControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('linked');
  const [messagePaddingControl, setMessagePaddingControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [messageMarginControl, setMessageMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [deskMarginControl, setDeskMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [tabletMarginControl, setTabletMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [mobileMarginControl, setMobileMarginControl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('individual');
  const [siteKey, setSiteKey] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [secretKey, setSecretKey] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [isSavedKey, setIsSavedKey] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isSaving, setIsSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)('general');

  const fudnctionNfame = prevProps => {
    // Deselect field when deselecting the block
    if (!isSelected && prevProps.isSelected) {
      setSelectedField(null);
    }
  };

  const deselectField = () => {
    setSelectedField(null);
  };

  const onSelectField = index => {
    if (selectedField !== index) {
      setSelectedField(index);
    }
  };

  const onMove = (oldIndex, newIndex) => {
    const fields = [...fields];
    fields.splice(newIndex, 1, fields[oldIndex]);
    fields.splice(oldIndex, 1, fields[newIndex]);
    setSelectedField(newIndex);
    setAttributes({
      fields: fields
    });
  };

  const onMoveForward = oldIndex => {
    if (oldIndex === fields.length - 1) {
      return;
    }

    onMove(oldIndex, oldIndex + 1);
  };

  const onMoveBackward = oldIndex => {
    if (oldIndex === 0) {
      return;
    }

    onMove(oldIndex, oldIndex - 1);
  };

  const onRemoveField = index => {
    const fields = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.filter)(fields, (item, i) => index !== i);
    setSelectedField(null);
    setAttributes({
      fields: fields
    });
  };

  const onKeyRemoveField = index => {
    const fields = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.filter)(fields, (item, i) => index !== i);
    setSelectedField(null);
    setAttributes({
      fields: fields
    });
  };

  const onDuplicateField = index => {
    const duplicate = fields[index];
    fields.splice(index + 1, 0, duplicate);
    setSelectedField(index + 1);
    setAttributes({
      fields: fields
    });
    saveFields({
      multiSelect: fields[0].multiSelect
    }, 0);
  };

  const saveFields = (value, index) => {
    const newItems = fields.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      fields: newItems
    });
  };

  const saveFieldsOptions = (value, index, subIndex) => {
    const newOptions = fields[index].options.map((item, thisIndex) => {
      if (subIndex === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    saveFields({
      options: newOptions
    }, index);
  };

  const saveSubmit = value => {
    const newItems = submit.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      submit: newItems
    });
  };

  const saveSubmitMargin = value => {
    let margin;

    if (undefined === submitMargin || undefined !== submitMargin && undefined === submitMargin[0]) {
      margin = [{
        desk: ['', '', '', ''],
        tablet: ['', '', '', ''],
        mobile: ['', '', '', ''],
        unit: 'px',
        control: 'linked'
      }];
    } else {
      margin = submitMargin;
    }

    const newItems = margin.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      submitMargin: newItems
    });
  };

  const saveSubmitGradient = (value, index) => {
    const newItems = submit[0].gradient.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveSubmit({
      gradient: newItems
    });
  };

  const saveSubmitGradientHover = (value, index) => {
    const newItems = submit[0].gradientHover.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveSubmit({
      gradientHover: newItems
    });
  };

  const saveSubmitBoxShadow = (value, index) => {
    const newItems = submit[0].boxShadow.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveSubmit({
      boxShadow: newItems
    });
  };

  const saveSubmitBoxShadowHover = (value, index) => {
    const newItems = submit[0].boxShadowHover.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveSubmit({
      boxShadowHover: newItems
    });
  };

  const saveSubmitFont = value => {
    const newItems = submitFont.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      submitFont: newItems
    });
  };

  const saveEmail = value => {
    const newItems = email.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      email: newItems
    });
  };

  const saveStyle = value => {
    const newItems = style.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      style: newItems
    });
  };

  const saveStyleGradient = (value, index) => {
    const newItems = style[0].gradient.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveStyle({
      gradient: newItems
    });
  };

  const saveStyleGradientActive = (value, index) => {
    const newItems = style[0].gradientActive.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveStyle({
      gradientActive: newItems
    });
  };

  const saveStyleBoxShadow = (value, index) => {
    const newItems = style[0].boxShadow.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveStyle({
      boxShadow: newItems
    });
  };

  const saveStyleBoxShadowActive = (value, index) => {
    const newItems = style[0].boxShadowActive.map((item, thisIndex) => {
      if (index === thisIndex) {
        item = value;
      }

      return item;
    });
    saveStyle({
      boxShadowActive: newItems
    });
  };

  const saveLabelFont = value => {
    const newItems = labelFont.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      labelFont: newItems
    });
  };

  const saveMessageFont = value => {
    const newItems = messageFont.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      messageFont: newItems
    });
  };

  const saveMessages = value => {
    const newItems = messages.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      messages: newItems
    });
  };

  const addAction = value => {
    const newItems = actions.map((item, thisIndex) => {
      return item;
    });
    newItems.push(value);
    setAttributes({
      actions: newItems
    });
  };

  const removeAction = value => {
    const newItems = actions.filter(item => item !== value);
    setAttributes({
      actions: newItems
    });
  };

  const removeKeys = () => {
    setSiteKey('');
    setSecretKey('');

    if (isSavedKey) {
      setIsSaving(true);
      const settingModel = new wp.api.models.Settings({
        kadence_blocks_recaptcha_site_key: '',
        kadence_blocks_recaptcha_secret_key: ''
      });
      settingModel.save().then(() => {
        setIsSavedKey(false);
        setIsSaving(false);
      });
    }
  };

  const saveKeys = () => {
    setIsSaving(true);
    const settingModel = new wp.api.models.Settings({
      kadence_blocks_recaptcha_site_key: siteKey,
      kadence_blocks_recaptcha_secret_key: secretKey
    });
    settingModel.save().then(response => {
      setIsSaving(false);
      setIsSavedKey(true);
    });
  };

  const onOptionMove = (oldIndex, newIndex, fieldIndex) => {
    const options = fields[fieldIndex] && fields[fieldIndex].options ? [...fields[fieldIndex].options] : [];

    if (!options) {
      return;
    }

    options.splice(newIndex, 1, fields[fieldIndex].options[oldIndex]);
    options.splice(oldIndex, 1, fields[fieldIndex].options[newIndex]);
    saveFields({
      options: options
    }, fieldIndex);
  };

  const onOptionMoveDown = (oldIndex, fieldIndex) => {
    if (oldIndex === fields[fieldIndex].options.length - 1) {
      return;
    }

    onOptionMove(oldIndex, oldIndex + 1, fieldIndex);
  };

  const onOptionMoveUp = (oldIndex, fieldIndex) => {
    if (oldIndex === 0) {
      return;
    }

    onOptionMove(oldIndex, oldIndex - 1, fieldIndex);
  };

  const previewSubmitMarginType = undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].unit ? submitMargin[0].unit : 'px';
  const previewSubmitMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].desk ? submitMargin[0].desk[0] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].tablet ? submitMargin[0].tablet[0] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].mobile ? submitMargin[0].mobile[0] : '');
  const previewSubmitMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].desk ? submitMargin[0].desk[1] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].tablet ? submitMargin[0].tablet[1] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].mobile ? submitMargin[0].mobile[1] : '');
  const previewSubmitMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].desk ? submitMargin[0].desk[2] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].tablet ? submitMargin[0].tablet[2] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].mobile ? submitMargin[0].mobile[2] : '');
  const previewSubmitMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].desk ? submitMargin[0].desk[3] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].tablet ? submitMargin[0].tablet[3] : '', undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].mobile ? submitMargin[0].mobile[3] : '');
  const previewSubmitColumnWidth = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== submit && undefined !== submit[0] && submit[0].width ? submit[0].width[0] : '', undefined !== submit && undefined !== submit[0] && submit[0].width ? submit[0].width[1] : '', undefined !== submit && undefined !== submit[0] && submit[0].width ? submit[0].width[2] : '');
  const previewSubmitLineHeightType = undefined !== submitFont && undefined !== submitFont[0] && submitFont[0].lineType ? submitFont[0].lineType : 'px';
  const previewSubmitLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== submitFont && undefined !== submitFont[0] && submitFont[0].lineHeight ? submitFont[0].lineHeight[0] : '', undefined !== submitFont && undefined !== submitFont[0] && submitFont[0].lineHeight ? submitFont[0].lineHeight[1] : '', undefined !== submitFont && undefined !== submitFont[0] && submitFont[0].lineHeight ? submitFont[0].lineHeight[2] : '');
  const previewContainerMarginType = undefined !== containerMarginType ? containerMarginType : 'px';
  const previewContainerMarginTop = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerMargin && undefined !== containerMargin[0] ? containerMargin[0] : '', undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[0] ? tabletContainerMargin[0] : '', undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[0] ? mobileContainerMargin[0] : '');
  const previewContainerMarginRight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerMargin && undefined !== containerMargin[1] ? containerMargin[1] : '', undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[1] ? tabletContainerMargin[1] : '', undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[1] ? mobileContainerMargin[1] : '');
  const previewContainerMarginBottom = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerMargin && undefined !== containerMargin[2] ? containerMargin[2] : '', undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[2] ? tabletContainerMargin[2] : '', undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[2] ? mobileContainerMargin[2] : '');
  const previewContainerMarginLeft = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== containerMargin && undefined !== containerMargin[3] ? containerMargin[3] : '', undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[3] ? tabletContainerMargin[3] : '', undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[3] ? mobileContainerMargin[3] : '');
  const previewStyleFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, style[0].fontSize[0], style[0].fontSize[1], style[0].fontSize[2]);
  const previewStyleFontSizeType = style[0].fontSizeType;
  const previewStyleLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, style[0].lineHeight[0], style[0].lineHeight[1], style[0].lineHeight[2]);
  const previewStyleLineHeightType = style[0].lineType;
  const previewLabelFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, labelFont[0].size[0], labelFont[0].size[1], labelFont[0].size[2]);
  const previewLabelFontSizeType = labelFont[0].sizeType;
  const previewLabelLineHeight = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, labelFont[0].lineHeight[0], labelFont[0].lineHeight[1], labelFont[0].lineHeight[2]);
  const previewLabelLineHeightType = labelFont[0].lineType;
  const previewSubmitFontSize = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, submitFont[0].size[0], submitFont[0].size[1], submitFont[0].size[2]);
  const previewSubmitFontSizeType = submitFont[0].sizeType;
  const previewRowGap = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== style[0].rowGap && '' !== style[0].rowGap ? style[0].rowGap + 'px' : '', undefined !== style[0].tabletRowGap && '' !== style[0].tabletRowGap ? style[0].tabletRowGap + 'px' : '', undefined !== style[0].mobileRowGap && '' !== style[0].mobileRowGap ? style[0].mobileRowGap + 'px' : '');
  const previewGutter = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.getPreviewSize)(previewDevice, undefined !== style[0].gutter && '' !== style[0].gutter ? style[0].gutter : '', undefined !== style[0].tabletGutter && '' !== style[0].tabletGutter ? style[0].tabletGutter : '', undefined !== style[0].mobileGutter && '' !== style[0].mobileGutter ? style[0].mobileGutter : '');
  const containerMarginMin = containerMarginType === 'em' || containerMarginType === 'rem' ? -2 : -200;
  const containerMarginMax = containerMarginType === 'em' || containerMarginType === 'rem' ? 12 : 200;
  const containerMarginStep = containerMarginType === 'em' || containerMarginType === 'rem' ? 0.1 : 1;

  const saveMailerlite = value => {
    const newItems = mailerlite.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      mailerlite: newItems
    });
  };

  const saveFluentCRM = value => {
    const newItems = fluentcrm.map((item, thisIndex) => {
      if (0 === thisIndex) {
        item = { ...item,
          ...value
        };
      }

      return item;
    });
    setAttributes({
      fluentcrm: newItems
    });
  };

  const saveFluentCRMMap = (value, index) => {
    const newItems = fields.map((item, thisIndex) => {
      let newString = '';

      if (index === thisIndex) {
        newString = value;
      } else if (undefined !== fluentcrm[0].map && undefined !== fluentcrm[0].map[thisIndex]) {
        newString = fluentcrm[0].map[thisIndex];
      } else {
        newString = '';
      }

      return newString;
    });
    saveFluentCRM({
      map: newItems
    });
  };

  const saveMailerliteMap = (value, index) => {
    const newItems = fields.map((item, thisIndex) => {
      let newString = '';

      if (index === thisIndex) {
        newString = value;
      } else if (undefined !== mailerlite[0].map && undefined !== mailerlite[0].map[thisIndex]) {
        newString = mailerlite[0].map[thisIndex];
      } else {
        newString = '';
      }

      return newString;
    });
    saveMailerlite({
      map: newItems
    });
  };

  const btnSizes = [{
    key: 'small',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('S', 'kadence-blocks')
  }, {
    key: 'standard',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('M', 'kadence-blocks')
  }, {
    key: 'large',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('L', 'kadence-blocks')
  }, {
    key: 'custom',
    name: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
      icon: "admin-generic"
    })
  }];
  const recaptchaVersions = [{
    key: 'v3',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('V3', 'kadence-blocks')
  }, {
    key: 'v2',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('V2', 'kadence-blocks')
  }];
  const btnWidths = [{
    key: 'auto',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Auto')
  }, {
    key: 'fixed',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Fixed')
  }, {
    key: 'full',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Full')
  }];
  const gradTypes = [{
    key: 'linear',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Linear', 'kadence-blocks')
  }, {
    key: 'radial',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Radial', 'kadence-blocks')
  }];
  const bgType = [{
    key: 'solid',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Solid', 'kadence-blocks')
  }, {
    key: 'gradient',
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient', 'kadence-blocks')
  }];
  const marginTypes = [{
    key: 'px',
    name: 'px'
  }, {
    key: 'em',
    name: 'em'
  }, {
    key: '%',
    name: '%'
  }, {
    key: 'vh',
    name: 'vh'
  }, {
    key: 'rem',
    name: 'rem'
  }];
  const marginUnit = undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].unit ? submitMargin[0].unit : 'px';
  const marginMin = marginUnit === 'em' || marginUnit === 'rem' ? -12 : -100;
  const marginMax = marginUnit === 'em' || marginUnit === 'rem' ? 12 : 100;
  const marginStep = marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1;
  const lgconfig = {
    google: {
      families: [labelFont[0].family + (labelFont[0].variant ? ':' + labelFont[0].variant : '')]
    }
  };
  const lconfig = labelFont[0].google ? lgconfig : '';
  const bgconfig = {
    google: {
      families: [submitFont[0].family + (submitFont[0].variant ? ':' + submitFont[0].variant : '')]
    }
  };
  const bconfig = submitFont[0].google ? bgconfig : '';
  let btnBG;
  let btnGrad;
  let btnGrad2;

  if (undefined !== submit[0].backgroundType && 'gradient' === submit[0].backgroundType) {
    btnGrad = undefined === submit[0].background ? 'rgba(255,255,255,0)' : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].background, submit[0].backgroundOpacity !== undefined ? submit[0].backgroundOpacity : 1);
    btnGrad2 = undefined !== submit[0].gradient && undefined !== submit[0].gradient[0] && '' !== submit[0].gradient[0] ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].gradient[0], undefined !== submit[0].gradient && submit[0].gradient[1] !== undefined ? submit[0].gradient[1] : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#999999', undefined !== submit[0].gradient && submit[0].gradient[1] !== undefined ? submit[0].gradient[1] : 1);

    if (undefined !== submit[0].gradient && 'radial' === submit[0].gradient[4]) {
      btnBG = `radial-gradient(at ${undefined === submit[0].gradient[6] ? 'center center' : submit[0].gradient[6]}, ${btnGrad} ${undefined === submit[0].gradient[2] ? '0' : submit[0].gradient[2]}%, ${btnGrad2} ${undefined === submit[0].gradient[3] ? '100' : submit[0].gradient[3]}%)`;
    } else if (undefined === submit[0].gradient || 'radial' !== submit[0].gradient[4]) {
      btnBG = `linear-gradient(${undefined !== submit[0].gradient && undefined !== submit[0].gradient[5] ? submit[0].gradient[5] : '180'}deg, ${btnGrad} ${undefined !== submit[0].gradient && undefined !== submit[0].gradient[2] ? submit[0].gradient[2] : '0'}%, ${btnGrad2} ${undefined !== submit[0].gradient && undefined !== submit[0].gradient[3] ? submit[0].gradient[3] : '100'}%)`;
    }
  } else {
    btnBG = undefined === submit[0].background ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].background, submit[0].backgroundOpacity !== undefined ? submit[0].backgroundOpacity : 1);
  }

  let inputBG;
  let inputGrad;
  let inputGrad2;

  if (undefined !== style[0].backgroundType && 'gradient' === style[0].backgroundType) {
    inputGrad = undefined === style[0].background ? 'rgba(255,255,255,0)' : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].background, style[0].backgroundOpacity !== undefined ? style[0].backgroundOpacity : 1);
    inputGrad2 = undefined !== style[0].gradient && undefined !== style[0].gradient[0] && '' !== style[0].gradient[0] ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].gradient[0], undefined !== style[0].gradient && style[0].gradient[1] !== undefined ? style[0].gradient[1] : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#999999', undefined !== style[0].gradient && style[0].gradient[1] !== undefined ? style[0].gradient[1] : 1);

    if (undefined !== style[0].gradient && 'radial' === style[0].gradient[4]) {
      inputBG = `radial-gradient(at ${undefined === style[0].gradient[6] ? 'center center' : style[0].gradient[6]}, ${inputGrad} ${undefined === style[0].gradient[2] ? '0' : style[0].gradient[2]}%, ${inputGrad2} ${undefined === style[0].gradient[3] ? '100' : style[0].gradient[3]}%)`;
    } else if (undefined === style[0].gradient || 'radial' !== style[0].gradient[4]) {
      inputBG = `linear-gradient(${undefined !== style[0].gradient && undefined !== style[0].gradient[5] ? style[0].gradient[5] : '180'}deg, ${inputGrad} ${undefined !== style[0].gradient && undefined !== style[0].gradient[2] ? style[0].gradient[2] : '0'}%, ${inputGrad2} ${undefined !== style[0].gradient && undefined !== style[0].gradient[3] ? style[0].gradient[3] : '100'}%)`;
    }
  } else {
    inputBG = undefined === style[0].background ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].background, style[0].backgroundOpacity !== undefined ? style[0].backgroundOpacity : 1);
  }

  const removeOptionItem = (previousIndex, fieldIndex) => {
    const amount = Math.abs(fields[fieldIndex].options.length);

    if (amount === 1) {
      return;
    }

    const currentItems = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.filter)(fields[fieldIndex].options, (item, i) => previousIndex !== i);
    saveFields({
      options: currentItems
    }, fieldIndex);
  };

  const fieldControls = index => {
    const isFieldSelected = isSelected && selectedField === index;

    if ('hidden' === fields[index].type) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
        title: (undefined !== fields[index].label && null !== fields[index].label && '' !== fields[index].label ? fields[index].label : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field', 'kadence-blocks') + ' ' + (index + 1)) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Settings', 'kadence-blocks'),
        initialOpen: false,
        key: 'field-panel-' + index.toString(),
        opened: true === isFieldSelected ? true : undefined,
        panelName: 'kb-form-field-' + index
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Type', 'kadence-blocks'),
        value: fields[index].type,
        options: [{
          value: 'text',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text', 'kadence-blocks')
        }, {
          value: 'email',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email', 'kadence-blocks')
        }, {
          value: 'textarea',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Textarea', 'kadence-blocks')
        }, {
          value: 'accept',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Accept', 'kadence-blocks')
        }, {
          value: 'select',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Select', 'kadence-blocks')
        }, {
          value: 'tel',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Telephone', 'kadence-blocks')
        }, {
          value: 'checkbox',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Checkboxes', 'kadence-blocks')
        }, {
          value: 'radio',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Radio', 'kadence-blocks')
        }, {
          value: 'hidden',
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hidden', 'kadence-blocks')
        }],
        onChange: value => {
          saveFields({
            type: value
          }, index);
        }
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Name', 'kadence-blocks'),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Name', 'kadence-blocks'),
        value: undefined !== fields[index].label ? fields[index].label : '',
        onChange: value => saveFields({
          label: value
        }, index)
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Input', 'kadence-blocks'),
        value: undefined !== fields[index].default ? fields[index].default : '',
        onChange: value => saveFields({
          default: value
        }, index)
      }));
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
      title: (undefined !== fields[index].label && null !== fields[index].label && '' !== fields[index].label ? fields[index].label : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field', 'kadence-blocks') + ' ' + (index + 1)) + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Settings', 'kadence-blocks'),
      initialOpen: false,
      key: 'field-panel-' + index.toString(),
      opened: true === isFieldSelected ? true : undefined,
      panelName: 'kb-form-field-label-' + index
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Type', 'kadence-blocks'),
      value: fields[index].type,
      options: [{
        value: 'text',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text', 'kadence-blocks')
      }, {
        value: 'email',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email', 'kadence-blocks')
      }, {
        value: 'textarea',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Textarea', 'kadence-blocks')
      }, {
        value: 'accept',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Accept', 'kadence-blocks')
      }, {
        value: 'select',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Select', 'kadence-blocks')
      }, {
        value: 'tel',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Telephone', 'kadence-blocks')
      }, {
        value: 'checkbox',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Checkboxes', 'kadence-blocks')
      }, {
        value: 'radio',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Radio', 'kadence-blocks')
      }, {
        value: 'hidden',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hidden', 'kadence-blocks')
      }],
      onChange: value => {
        saveFields({
          type: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Required?', 'kadence-blocks'),
      checked: undefined !== fields[index].required ? fields[index].required : false,
      onChange: value => saveFields({
        required: value
      }, index)
    }), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Textarea Rows', 'kadence-blocks'),
      value: undefined !== fields[index].rows ? fields[index].rows : '4',
      onChange: value => saveFields({
        rows: value
      }, index),
      min: 1,
      max: 100,
      step: 1
    }), ('select' === fields[index].type || 'radio' === fields[index].type || 'checkbox' === fields[index].type) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "field-options-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      className: 'kb-option-text-control',
      key: n,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Option', 'kadence-blocks') + ' ' + (n + 1),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Option', 'kadence-blocks'),
      value: undefined !== fields[index].options[n].label ? fields[index].options[n].label : '',
      onChange: text => saveFieldsOptions({
        label: text,
        value: text
      }, index, n)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kadence-blocks-list-item__control-menu"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "arrow-up",
      onClick: n === 0 ? undefined : onOptionMoveUp(n, index),
      className: "kadence-blocks-list-item__move-up",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Move Item Up'),
      "aria-disabled": n === 0,
      disabled: n === 0
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "arrow-down",
      onClick: n + 1 === fields[index].options.length ? undefined : onOptionMoveDown(n, index),
      className: "kadence-blocks-list-item__move-down",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Move Item Down'),
      "aria-disabled": n + 1 === fields[index].options.length,
      disabled: n + 1 === fields[index].options.length
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "no-alt",
      onClick: () => removeOptionItem(n, index),
      className: "kadence-blocks-list-item__remove",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Remove Item'),
      disabled: 1 === fields[index].options.length
    }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
      className: "kb-add-option",
      isPrimary: true,
      onClick: () => {
        const newOptions = fields[index].options;
        newOptions.push({
          value: '',
          label: ''
        });
        saveFields({
          options: newOptions
        }, index);
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
      icon: "plus"
    }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Add Option', 'kadence-blocks'))), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Multi Select?'),
      checked: undefined !== fields[index].multiSelect ? fields[index].multiSelect : false,
      onChange: value => saveFields({
        multiSelect: value
      }, index)
    }), ('checkbox' === fields[index].type || 'radio' === fields[index].type) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Show inline?', 'kadence-blocks'),
      checked: undefined !== fields[index].inline ? fields[index].inline : false,
      onChange: value => saveFields({
        inline: value
      }, index)
    }), 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Show Policy Link', 'kadence-blocks'),
      checked: undefined !== fields[index].showLink ? fields[index].showLink : false,
      onChange: value => saveFields({
        showLink: value
      }, index)
    }), 'accept' === fields[index].type && fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Link Text', 'kadence-blocks'),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('View Privacy Policy', 'kadence-blocks'),
      value: undefined !== fields[index].placeholder ? fields[index].placeholder : '',
      onChange: value => saveFields({
        placeholder: value
      }, index)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.URLInputControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Link URL', 'kadence-blocks'),
      url: undefined !== fields[index].default ? fields[index].default : '',
      onChangeUrl: value => saveFields({
        default: value
      }, index),
      additionalControls: false
    }, props))), 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Start checked?', 'kadence-blocks'),
      checked: undefined !== fields[index].inline ? fields[index].inline : false,
      onChange: value => saveFields({
        inline: value
      }, index)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Label', 'kadence-blocks'),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Label', 'kadence-blocks'),
      value: undefined !== fields[index].label ? fields[index].label : '',
      onChange: value => saveFields({
        label: value
      }, index)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Show Label', 'kadence-blocks'),
      checked: undefined !== fields[index].showLabel ? fields[index].showLabel : true,
      onChange: value => saveFields({
        showLabel: value
      }, index)
    }), ('accept' !== fields[index].type || 'select' !== fields[index].type) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Placeholder', 'kadence-blocks'),
      value: undefined !== fields[index].placeholder ? fields[index].placeholder : '',
      onChange: value => saveFields({
        placeholder: value
      }, index)
    }), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Default', 'kadence-blocks'),
      value: undefined !== fields[index].default ? fields[index].default : '',
      onChange: value => saveFields({
        default: value
      }, index)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Help Text', 'kadence-blocks'),
      value: undefined !== fields[index].description ? fields[index].description : '',
      onChange: value => saveFields({
        description: value
      }, index)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input aria description', 'kadence-blocks'),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Provide more context for screen readers', 'kadence-blocks'),
      value: undefined !== fields[index].ariaLabel ? fields[index].ariaLabel : '',
      onChange: value => saveFields({
        ariaLabel: value
      }, index)
    }), ('text' === fields[index].type || 'email' === fields[index].type || 'tel' === fields[index].type) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Auto Fill', 'kadence-blocks'),
      value: fields[index].auto,
      options: [{
        value: '',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Default', 'kadence-blocks')
      }, {
        value: 'name',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Name', 'kadence-blocks')
      }, {
        value: 'given-name',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('First Name', 'kadence-blocks')
      }, {
        value: 'family-name',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Last Name', 'kadence-blocks')
      }, {
        value: 'email',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email', 'kadence-blocks')
      }, {
        value: 'organization',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Organization', 'kadence-blocks')
      }, {
        value: 'street-address',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Street Address', 'kadence-blocks')
      }, {
        value: 'address-line1',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Address Line 1', 'kadence-blocks')
      }, {
        value: 'address-line2',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Address Line 1', 'kadence-blocks')
      }, {
        value: 'country-name',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Country Name', 'kadence-blocks')
      }, {
        value: 'postal-code',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Postal Code', 'kadence-blocks')
      }, {
        value: 'tel',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Telephone', 'kadence-blocks')
      }, {
        value: 'off',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Off', 'kadence-blocks')
      }],
      onChange: value => {
        saveFields({
          auto: value
        }, index);
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
      className: "kt-heading-size-title kt-secondary-color-size"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Column Width', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
      className: "kt-size-tabs",
      activeClass: "active-tab",
      tabs: [{
        name: 'desk',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
          icon: "desktop"
        }),
        className: 'kt-desk-tab'
      }, {
        name: 'tablet',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
          icon: "tablet"
        }),
        className: 'kt-tablet-tab'
      }, {
        name: 'mobile',
        title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
          icon: "smartphone"
        }),
        className: 'kt-mobile-tab'
      }]
    }, tab => {
      let tabout;

      if (tab.name) {
        if ('mobile' === tab.name) {
          tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
            value: fields[index].width[2],
            options: [{
              value: '20',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('20%', 'kadence-blocks')
            }, {
              value: '25',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('25%', 'kadence-blocks')
            }, {
              value: '33',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('33%', 'kadence-blocks')
            }, {
              value: '40',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('40%', 'kadence-blocks')
            }, {
              value: '50',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('50%', 'kadence-blocks')
            }, {
              value: '60',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('60%', 'kadence-blocks')
            }, {
              value: '66',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('66%', 'kadence-blocks')
            }, {
              value: '75',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('75%', 'kadence-blocks')
            }, {
              value: '80',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('80%', 'kadence-blocks')
            }, {
              value: '100',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('100%', 'kadence-blocks')
            }, {
              value: '',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Unset', 'kadence-blocks')
            }],
            onChange: value => {
              saveFields({
                width: [fields[index].width[0] ? fields[index].width[0] : '100', fields[index].width[1] ? fields[index].width[1] : '', value]
              }, index);
            }
          }));
        } else if ('tablet' === tab.name) {
          tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
            value: fields[index].width[1],
            options: [{
              value: '20',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('20%', 'kadence-blocks')
            }, {
              value: '25',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('25%', 'kadence-blocks')
            }, {
              value: '33',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('33%', 'kadence-blocks')
            }, {
              value: '40',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('40%', 'kadence-blocks')
            }, {
              value: '50',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('50%', 'kadence-blocks')
            }, {
              value: '60',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('60%', 'kadence-blocks')
            }, {
              value: '66',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('66%', 'kadence-blocks')
            }, {
              value: '75',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('75%', 'kadence-blocks')
            }, {
              value: '80',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('80%', 'kadence-blocks')
            }, {
              value: '100',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('100%', 'kadence-blocks')
            }, {
              value: '',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Unset', 'kadence-blocks')
            }],
            onChange: value => {
              saveFields({
                width: [fields[index].width[0] ? fields[index].width[0] : '100', value, fields[index].width[2] ? fields[index].width[2] : '']
              }, index);
            }
          }));
        } else {
          tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
            value: fields[index].width[0],
            options: [{
              value: '20',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('20%', 'kadence-blocks')
            }, {
              value: '25',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('25%', 'kadence-blocks')
            }, {
              value: '33',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('33%', 'kadence-blocks')
            }, {
              value: '40',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('40%', 'kadence-blocks')
            }, {
              value: '50',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('50%', 'kadence-blocks')
            }, {
              value: '60',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('60%', 'kadence-blocks')
            }, {
              value: '66',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('66%', 'kadence-blocks')
            }, {
              value: '75',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('75%', 'kadence-blocks')
            }, {
              value: '80',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('80%', 'kadence-blocks')
            }, {
              value: '100',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('100%', 'kadence-blocks')
            }, {
              value: 'unset',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Unset', 'kadence-blocks')
            }],
            onChange: value => {
              saveFields({
                width: [value, fields[index].width[1] ? fields[index].width[1] : '', fields[index].width[2] ? fields[index].width[2] : '']
              }, index);
            }
          }));
        }
      }

      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
        className: tab.className,
        key: tab.className
      }, tabout);
    }), (undefined !== fields[index].required ? fields[index].required : false) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field error message when required', 'kadence-blocks'),
      value: undefined !== fields[index].requiredMessage ? fields[index].requiredMessage : '',
      onChange: value => saveFields({
        requiredMessage: value
      }, index),
      placeholder: (undefined !== fields[index].label ? fields[index].label : '') + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('is required', 'kadence-blocks')
    }), ('tel' === fields[index].type || 'email' === fields[index].type) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field error message when invalid', 'kadence-blocks'),
      value: undefined !== fields[index].errorMessage ? fields[index].errorMessage : '',
      onChange: value => saveFields({
        errorMessage: value
      }, index),
      placeholder: (undefined !== fields[index].label ? fields[index].label : '') + ' ' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('is not valid', 'kadence-blocks')
    }));
  };

  const renderFieldControls = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldControls(n)));

  const fieldOutput = index => {
    if ('hidden' === fields[index].type) {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", {
        type: "hidden",
        name: `kb_field_${index}`,
        value: fields[index].default
      });
    }

    const isFieldSelected = isSelected && selectedField === index;
    const fieldClassName = classnames__WEBPACK_IMPORTED_MODULE_2___default()({
      'kadence-blocks-form-field': true,
      'is-selected': isFieldSelected,
      [`kb-input-size-${style[0].size}`]: style[0].size
    });
    const ariaLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.sprintf)(
    /* translators: %1$d: field number %2$d: max amount of fields */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field %1$d of %2$d in form', 'kadence-blocks'), index + 1, fields.length);
    let acceptLabel;
    let acceptLabelBefore;
    let acceptLabelAfter;

    if (fields[index].label && fields[index].label.includes('{privacy_policy}')) {
      acceptLabelBefore = fields[index].label.split('{')[0];
      acceptLabelAfter = fields[index].label.split('}')[1];
      acceptLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, acceptLabelBefore, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
        href: '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#',
        target: "blank",
        rel: "noopener noreferrer"
      }, '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy'), acceptLabelAfter);
    } else {
      acceptLabel = fields[index].label;
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: fieldClassName,
      key: 'field-' + index.toString(),
      style: {
        width: ('33' === fields[index].width[0] ? '33.33' : fields[index].width[0]) + '%',
        marginBottom: previewRowGap ? previewRowGap : undefined,
        paddingRight: undefined !== previewGutter && '' !== previewGutter ? previewGutter / 2 + 'px' : undefined,
        paddingLeft: undefined !== previewGutter && '' !== previewGutter ? previewGutter / 2 + 'px' : undefined
      },
      tabIndex: "0",
      "aria-label": ariaLabel,
      role: "button",
      onClick: index => onSelectField(index),
      onFocus: index => onSelectField(index),
      onKeyDown: event => {
        const {
          keyCode
        } = event;

        if (keyCode === _wordpress_keycodes__WEBPACK_IMPORTED_MODULE_15__.DELETE) {
          onKeyRemoveField(index);
        }
      }
    }, 'accept' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, fields[index].showLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
      href: undefined !== fields[index].default && '' !== fields[index].default ? fields[index].default : '#',
      className: 'kb-accept-link'
    }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder ? fields[index].placeholder : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
      className: "kb-placeholder"
    }, 'View Privacy Policy')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", {
      type: "checkbox",
      name: `kb_field_${index}`,
      id: `kb_field_${index}`,
      className: `kb-field kb-checkbox-style kb-${fields[index].type}`,
      value: "accept",
      checked: fields[index].inline ? true : false,
      style: {
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1)
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("label", {
      htmlFor: `kb_field_${index}`,
      style: {
        fontWeight: labelFont[0].weight,
        fontStyle: labelFont[0].style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(labelFont[0].color),
        fontSize: previewLabelFontSize + previewLabelFontSizeType,
        lineHeight: previewLabelLineHeight + previewLabelLineHeightType,
        letterSpacing: labelFont[0].letterSpacing + 'px',
        textTransform: labelFont[0].textTransform ? labelFont[0].textTransform : undefined,
        fontFamily: labelFont[0].family ? labelFont[0].family : undefined,
        paddingTop: '' !== labelFont[0].padding[0] ? labelFont[0].padding[0] + 'px' : undefined,
        paddingRight: '' !== labelFont[0].padding[1] ? labelFont[0].padding[1] + 'px' : undefined,
        paddingBottom: '' !== labelFont[0].padding[2] ? labelFont[0].padding[2] + 'px' : undefined,
        paddingLeft: '' !== labelFont[0].padding[3] ? labelFont[0].padding[3] + 'px' : undefined,
        marginTop: '' !== labelFont[0].margin[0] ? labelFont[0].margin[0] + 'px' : undefined,
        marginRight: '' !== labelFont[0].margin[1] ? labelFont[0].margin[1] + 'px' : undefined,
        marginBottom: '' !== labelFont[0].margin[2] ? labelFont[0].margin[2] + 'px' : undefined,
        marginLeft: '' !== labelFont[0].margin[3] ? labelFont[0].margin[3] + 'px' : undefined
      }
    }, fields[index].label ? acceptLabel : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
      className: "kb-placeholder"
    }, 'Field Label'), " ", fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
      className: "required",
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].requiredColor)
      }
    }, "*") : '')), 'accept' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, fields[index].showLabel && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("label", {
      htmlFor: `kb_field_${index}`,
      style: {
        fontWeight: labelFont[0].weight,
        fontStyle: labelFont[0].style,
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(labelFont[0].color),
        fontSize: previewLabelFontSize + previewLabelFontSizeType,
        lineHeight: previewLabelLineHeight + previewLabelLineHeightType,
        letterSpacing: labelFont[0].letterSpacing + 'px',
        textTransform: labelFont[0].textTransform ? labelFont[0].textTransform : undefined,
        fontFamily: labelFont[0].family ? labelFont[0].family : undefined,
        paddingTop: '' !== labelFont[0].padding[0] ? labelFont[0].padding[0] + 'px' : undefined,
        paddingRight: '' !== labelFont[0].padding[1] ? labelFont[0].padding[1] + 'px' : undefined,
        paddingBottom: '' !== labelFont[0].padding[2] ? labelFont[0].padding[2] + 'px' : undefined,
        paddingLeft: '' !== labelFont[0].padding[3] ? labelFont[0].padding[3] + 'px' : undefined,
        marginTop: '' !== labelFont[0].margin[0] ? labelFont[0].margin[0] + 'px' : undefined,
        marginRight: '' !== labelFont[0].margin[1] ? labelFont[0].margin[1] + 'px' : undefined,
        marginBottom: '' !== labelFont[0].margin[2] ? labelFont[0].margin[2] + 'px' : undefined,
        marginLeft: '' !== labelFont[0].margin[3] ? labelFont[0].margin[3] + 'px' : undefined
      }
    }, fields[index].label ? fields[index].label : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
      className: "kb-placeholder"
    }, 'Field Label'), " ", fields[index].required && style[0].showRequired ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
      className: "required",
      style: {
        color: (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].requiredColor)
      }
    }, "*") : ''), 'textarea' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("textarea", {
      name: `kb_field_${index}`,
      id: `kb_field_${index}`,
      type: fields[index].type,
      placeholder: fields[index].placeholder,
      value: fields[index].default,
      "data-type": fields[index].type,
      className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
      rows: fields[index].rows,
      "data-required": fields[index].required ? 'yes' : undefined,
      readOnly: true,
      style: {
        paddingTop: 'custom' === style[0].size && '' !== style[0].deskPadding[0] ? style[0].deskPadding[0] + 'px' : undefined,
        paddingRight: 'custom' === style[0].size && '' !== style[0].deskPadding[1] ? style[0].deskPadding[1] + 'px' : undefined,
        paddingBottom: 'custom' === style[0].size && '' !== style[0].deskPadding[2] ? style[0].deskPadding[2] + 'px' : undefined,
        paddingLeft: 'custom' === style[0].size && '' !== style[0].deskPadding[3] ? style[0].deskPadding[3] + 'px' : undefined,
        background: undefined !== inputBG ? inputBG : undefined,
        color: undefined !== style[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].color) : undefined,
        fontSize: previewStyleFontSize + previewStyleFontSizeType,
        lineHeight: previewStyleLineHeight + previewStyleLineHeightType,
        borderRadius: undefined !== style[0].borderRadius ? style[0].borderRadius + 'px' : undefined,
        borderTopWidth: style[0].borderWidth && '' !== style[0].borderWidth[0] ? style[0].borderWidth[0] + 'px' : undefined,
        borderRightWidth: style[0].borderWidth && '' !== style[0].borderWidth[1] ? style[0].borderWidth[1] + 'px' : undefined,
        borderBottomWidth: style[0].borderWidth && '' !== style[0].borderWidth[2] ? style[0].borderWidth[2] + 'px' : undefined,
        borderLeftWidth: style[0].borderWidth && '' !== style[0].borderWidth[3] ? style[0].borderWidth[3] + 'px' : undefined,
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1),
        boxShadow: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[0] && style[0].boxShadow[0] ? (undefined !== style[0].boxShadow[7] && style[0].boxShadow[7] ? 'inset ' : '') + (undefined !== style[0].boxShadow[3] ? style[0].boxShadow[3] : 1) + 'px ' + (undefined !== style[0].boxShadow[4] ? style[0].boxShadow[4] : 1) + 'px ' + (undefined !== style[0].boxShadow[5] ? style[0].boxShadow[5] : 2) + 'px ' + (undefined !== style[0].boxShadow[6] ? style[0].boxShadow[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== style[0].boxShadow[1] ? style[0].boxShadow[1] : '#000000', undefined !== style[0].boxShadow[2] ? style[0].boxShadow[2] : 1) : undefined
      }
    }), 'select' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("select", {
      name: `kb_field_${index}`,
      id: `kb_field_${index}`,
      type: fields[index].type,
      "data-type": fields[index].type,
      multiple: fields[index].multiSelect ? true : false,
      className: `kb-field kb-select-style-field kb-${fields[index].type}-field kb-field-${index}`,
      "data-required": fields[index].required ? 'yes' : undefined,
      style: {
        background: undefined !== inputBG ? inputBG : undefined,
        color: undefined !== style[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].color) : undefined,
        fontSize: previewStyleFontSize + previewStyleFontSizeType,
        lineHeight: previewStyleLineHeight + previewStyleLineHeightType,
        borderRadius: undefined !== style[0].borderRadius ? style[0].borderRadius + 'px' : undefined,
        borderTopWidth: style[0].borderWidth && '' !== style[0].borderWidth[0] ? style[0].borderWidth[0] + 'px' : undefined,
        borderRightWidth: style[0].borderWidth && '' !== style[0].borderWidth[1] ? style[0].borderWidth[1] + 'px' : undefined,
        borderBottomWidth: style[0].borderWidth && '' !== style[0].borderWidth[2] ? style[0].borderWidth[2] + 'px' : undefined,
        borderLeftWidth: style[0].borderWidth && '' !== style[0].borderWidth[3] ? style[0].borderWidth[3] + 'px' : undefined,
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1),
        boxShadow: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[0] && style[0].boxShadow[0] ? (undefined !== style[0].boxShadow[7] && style[0].boxShadow[7] ? 'inset ' : '') + (undefined !== style[0].boxShadow[3] ? style[0].boxShadow[3] : 1) + 'px ' + (undefined !== style[0].boxShadow[4] ? style[0].boxShadow[4] : 1) + 'px ' + (undefined !== style[0].boxShadow[5] ? style[0].boxShadow[5] : 2) + 'px ' + (undefined !== style[0].boxShadow[6] ? style[0].boxShadow[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== style[0].boxShadow[1] ? style[0].boxShadow[1] : '#000000', undefined !== style[0].boxShadow[2] ? style[0].boxShadow[2] : 1) : undefined
      }
    }, undefined !== fields[index].placeholder && '' !== fields[index].placeholder && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("option", {
      value: "",
      disabled: true,
      selected: '' === fields[index].default ? true : false
    }, fields[index].placeholder), (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("option", {
      key: n,
      selected: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
      value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : ''
    }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : ''))), 'checkbox' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      "data-type": fields[index].type,
      className: `kb-field kb-checkbox-style-field kb-${fields[index].type}-field kb-field-${index} kb-radio-style-${fields[index].inline ? 'inline' : 'normal'}`
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      key: n,
      "data-type": fields[index].type,
      className: `kb-checkbox-item kb-checkbox-item-${n}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", {
      type: "checkbox",
      name: `kb_field_${index}[]${n}`,
      id: `kb_field_${index}[]${n}`,
      className: 'kb-sub-field kb-checkbox-style',
      value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
      checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
      style: {
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1)
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("label", {
      htmlFor: `kb_field_${index}[]${n}`
    }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'radio' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      "data-type": fields[index].type,
      className: `kb-field kb-radio-style-field kb-${fields[index].type}-field kb-field-${index} kb-radio-style-${fields[index].inline ? 'inline' : 'normal'}`
    }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields[index].options.length, n => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      key: n,
      "data-type": fields[index].type,
      className: `kb-radio-item kb-radio-item-${n}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", {
      type: "radio",
      name: `kb_field_${index}[]${n}`,
      id: `kb_field_${index}[]${n}`,
      className: 'kb-sub-field kb-radio-style',
      value: undefined !== fields[index].options[n].value ? fields[index].options[n].value : '',
      checked: undefined !== fields[index].options[n].value && fields[index].options[n].value === fields[index].default ? true : false,
      style: {
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1)
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("label", {
      htmlFor: `kb_field_${index}[]${n}`
    }, undefined !== fields[index].options[n].label ? fields[index].options[n].label : '')))), 'email' === fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", {
      name: `kb_field_${index}`,
      id: `kb_field_${index}`,
      type: 'text',
      readOnly: true,
      placeholder: fields[index].placeholder,
      value: fields[index].default,
      "data-type": fields[index].type,
      className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
      autoComplete: "off",
      "data-required": fields[index].required ? 'yes' : undefined,
      style: {
        paddingTop: 'custom' === style[0].size && '' !== style[0].deskPadding[0] ? style[0].deskPadding[0] + 'px' : undefined,
        paddingRight: 'custom' === style[0].size && '' !== style[0].deskPadding[1] ? style[0].deskPadding[1] + 'px' : undefined,
        paddingBottom: 'custom' === style[0].size && '' !== style[0].deskPadding[2] ? style[0].deskPadding[2] + 'px' : undefined,
        paddingLeft: 'custom' === style[0].size && '' !== style[0].deskPadding[3] ? style[0].deskPadding[3] + 'px' : undefined,
        background: undefined !== inputBG ? inputBG : undefined,
        color: undefined !== style[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].color) : undefined,
        fontSize: previewStyleFontSize + previewStyleFontSizeType,
        lineHeight: previewStyleLineHeight + previewStyleLineHeightType,
        borderRadius: undefined !== style[0].borderRadius ? style[0].borderRadius + 'px' : undefined,
        borderTopWidth: style[0].borderWidth && '' !== style[0].borderWidth[0] ? style[0].borderWidth[0] + 'px' : undefined,
        borderRightWidth: style[0].borderWidth && '' !== style[0].borderWidth[1] ? style[0].borderWidth[1] + 'px' : undefined,
        borderBottomWidth: style[0].borderWidth && '' !== style[0].borderWidth[2] ? style[0].borderWidth[2] + 'px' : undefined,
        borderLeftWidth: style[0].borderWidth && '' !== style[0].borderWidth[3] ? style[0].borderWidth[3] + 'px' : undefined,
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1),
        boxShadow: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[0] && style[0].boxShadow[0] ? (undefined !== style[0].boxShadow[7] && style[0].boxShadow[7] ? 'inset ' : '') + (undefined !== style[0].boxShadow[3] ? style[0].boxShadow[3] : 1) + 'px ' + (undefined !== style[0].boxShadow[4] ? style[0].boxShadow[4] : 1) + 'px ' + (undefined !== style[0].boxShadow[5] ? style[0].boxShadow[5] : 2) + 'px ' + (undefined !== style[0].boxShadow[6] ? style[0].boxShadow[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== style[0].boxShadow[1] ? style[0].boxShadow[1] : '#000000', undefined !== style[0].boxShadow[2] ? style[0].boxShadow[2] : 1) : undefined
      }
    }), 'textarea' !== fields[index].type && 'select' !== fields[index].type && 'checkbox' !== fields[index].type && 'radio' !== fields[index].type && 'email' !== fields[index].type && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("input", {
      name: `kb_field_${index}`,
      id: `kb_field_${index}`,
      type: fields[index].type,
      placeholder: fields[index].placeholder,
      value: fields[index].default,
      "data-type": fields[index].type,
      className: `kb-field kb-text-style-field kb-${fields[index].type}-field kb-field-${index}`,
      autoComplete: "off",
      readOnly: true,
      "data-required": fields[index].required ? 'yes' : undefined,
      style: {
        paddingTop: 'custom' === style[0].size && '' !== style[0].deskPadding[0] ? style[0].deskPadding[0] + 'px' : undefined,
        paddingRight: 'custom' === style[0].size && '' !== style[0].deskPadding[1] ? style[0].deskPadding[1] + 'px' : undefined,
        paddingBottom: 'custom' === style[0].size && '' !== style[0].deskPadding[2] ? style[0].deskPadding[2] + 'px' : undefined,
        paddingLeft: 'custom' === style[0].size && '' !== style[0].deskPadding[3] ? style[0].deskPadding[3] + 'px' : undefined,
        background: undefined !== inputBG ? inputBG : undefined,
        color: undefined !== style[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].color) : undefined,
        fontSize: previewStyleFontSize + previewStyleFontSizeType,
        lineHeight: previewStyleLineHeight + previewStyleLineHeightType,
        borderRadius: undefined !== style[0].borderRadius ? style[0].borderRadius + 'px' : undefined,
        borderTopWidth: style[0].borderWidth && '' !== style[0].borderWidth[0] ? style[0].borderWidth[0] + 'px' : undefined,
        borderRightWidth: style[0].borderWidth && '' !== style[0].borderWidth[1] ? style[0].borderWidth[1] + 'px' : undefined,
        borderBottomWidth: style[0].borderWidth && '' !== style[0].borderWidth[2] ? style[0].borderWidth[2] + 'px' : undefined,
        borderLeftWidth: style[0].borderWidth && '' !== style[0].borderWidth[3] ? style[0].borderWidth[3] + 'px' : undefined,
        borderColor: undefined === style[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].border, style[0].borderOpacity !== undefined ? style[0].borderOpacity : 1),
        boxShadow: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[0] && style[0].boxShadow[0] ? (undefined !== style[0].boxShadow[7] && style[0].boxShadow[7] ? 'inset ' : '') + (undefined !== style[0].boxShadow[3] ? style[0].boxShadow[3] : 1) + 'px ' + (undefined !== style[0].boxShadow[4] ? style[0].boxShadow[4] : 1) + 'px ' + (undefined !== style[0].boxShadow[5] ? style[0].boxShadow[5] : 2) + 'px ' + (undefined !== style[0].boxShadow[6] ? style[0].boxShadow[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== style[0].boxShadow[1] ? style[0].boxShadow[1] : '#000000', undefined !== style[0].boxShadow[2] ? style[0].boxShadow[2] : 1) : undefined
      }
    })), undefined !== fields[index].description && '' !== fields[index].description && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
      className: 'kb-field-help'
    }, fields[index].description ? fields[index].description : ''), isFieldSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kadence-blocks-field-item-controls kadence-blocks-field-item__move-menu"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "arrow-up",
      onClick: index === 0 ? undefined : onMoveBackward(index),
      className: "kadence-blocks-field-item__move-backward",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Move Field Up', 'kadence-blocks'),
      "aria-disabled": index === 0,
      disabled: !isFieldSelected || index === 0
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "arrow-down",
      onClick: index + 1 === fields.length ? undefined : onMoveForward(index),
      className: "kadence-blocks-field-item__move-forward",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Move Field Down', 'kadence-blocks'),
      "aria-disabled": index + 1 === fields.length,
      disabled: !isFieldSelected || index + 1 === fields.length
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: "kadence-blocks-field-item-controls kadence-blocks-field-item__inline-menu"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "admin-page",
      onClick: () => onDuplicateField(index),
      className: "kadence-blocks-field-item__duplicate",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Duplicate Field', 'kadence-blocks'),
      disabled: !isFieldSelected
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(IconButton, {
      icon: "no-alt",
      onClick: () => onRemoveField(index),
      className: "kadence-blocks-field-item__remove",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Remove Field', 'kadence-blocks'),
      disabled: !isFieldSelected || 1 === fields.length
    }))));
  };

  const renderFieldOutput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(fields.length, n => fieldOutput(n)));

  const actionControls = index => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.CheckboxControl, {
      key: 'action-controls-' + index.toString(),
      label: actionOptions[index].label,
      help: '' !== actionOptions[index].help ? actionOptions[index].help : undefined,
      checked: actions.includes(actionOptions[index].value),
      disabled: actionOptions[index].isDisabled,
      onChange: isChecked => {
        if (isChecked && !actionOptions[index].isDisabled) {
          addAction(actionOptions[index].value);
        } else {
          removeAction(actionOptions[index].value);
        }
      }
    });
  };

  const renderCSS = () => {
    let inputBGA = '';
    let inputGradA;
    let inputGradA2;
    let inputBox = '';
    let btnHBG = '';
    let btnHBGnorm;
    let btnHGrad;
    let btnHGrad2;
    let btnHBox = '';
    let btnRad = '0';
    let btnBox2 = '';

    if (undefined !== style[0].backgroundActiveType && 'gradient' === style[0].backgroundActiveType && undefined !== style[0].gradientActive) {
      inputGradA = undefined === style[0].backgroundActive ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#ffffff', style[0].backgroundActiveOpacity !== undefined ? style[0].backgroundActiveOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].backgroundActive, style[0].backgroundActiveOpacity !== undefined ? style[0].backgroundActiveOpacity : 1);
      inputGradA2 = undefined === style[0].gradientActive[0] ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#777777', style[0].gradientActive[1] !== undefined ? style[0].gradientActive[1] : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].gradientActive[0], style[0].gradientActive[1] !== undefined ? style[0].gradientActive[1] : 1);

      if ('radial' === style[0].gradientActive[4]) {
        inputBGA = `radial-gradient(at ${undefined === style[0].gradientActive[6] ? 'center center' : style[0].gradientActive[6]}, ${inputGradA} ${undefined === style[0].gradientActive[2] ? '0' : style[0].gradientActive[2]}%, ${inputGradA2} ${undefined === style[0].gradientActive[3] ? '100' : style[0].gradientActive[3]}%)`;
      } else if ('linear' === style[0].gradientActive[4]) {
        inputBGA = `linear-gradient(${undefined === style[0].gradientActive[5] ? '180' : style[0].gradientActive[5]}deg, ${inputGradA} ${undefined === style[0].gradientActive[2] ? '0' : style[0].gradientActive[2]}%, ${inputGradA2} ${undefined === style[0].gradientActive[3] ? '100' : style[0].gradientActive[3]}%)`;
      }
    } else if (undefined !== style[0].backgroundActive && '' !== style[0].backgroundActive) {
      inputBGA = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].backgroundActive, style[0].backgroundActiveOpacity !== undefined ? style[0].backgroundActiveOpacity : 1);
    }

    if (undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[0] && style[0].boxShadowActive[0]) {
      inputBox = `${undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[0] && style[0].boxShadowActive[0] ? (undefined !== style[0].boxShadowActive[7] && style[0].boxShadowActive[7] ? 'inset ' : '') + (undefined !== style[0].boxShadowActive[3] ? style[0].boxShadowActive[3] : 1) + 'px ' + (undefined !== style[0].boxShadowActive[4] ? style[0].boxShadowActive[4] : 1) + 'px ' + (undefined !== style[0].boxShadowActive[5] ? style[0].boxShadowActive[5] : 2) + 'px ' + (undefined !== style[0].boxShadowActive[6] ? style[0].boxShadowActive[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== style[0].boxShadowActive[1] ? style[0].boxShadowActive[1] : '#000000', undefined !== style[0].boxShadowActive[2] ? style[0].boxShadowActive[2] : 1) : undefined}`;
    }

    if (undefined !== submit[0].backgroundHoverType && 'gradient' === submit[0].backgroundHoverType && undefined !== submit[0].gradientHover) {
      btnHGrad = undefined === submit[0].backgroundHover ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#ffffff', submit[0].backgroundHoverOpacity !== undefined ? submit[0].backgroundHoverOpacity : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].backgroundHover, submit[0].backgroundHoverOpacity !== undefined ? submit[0].backgroundHoverOpacity : 1);
      btnHGrad2 = undefined === submit[0].gradientHover[0] ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)('#777777', submit[0].gradientHover[1] !== undefined ? submit[0].gradientHover[1] : 1) : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].gradientHover[0], submit[0].gradientHover[1] !== undefined ? submit[0].gradientHover[1] : 1);

      if ('radial' === submit[0].gradientHover[4]) {
        btnHBG = `radial-gradient(at ${undefined === submit[0].gradientHover[6] ? 'center center' : submit[0].gradientHover[6]}, ${btnHGrad} ${undefined === submit[0].gradientHover[2] ? '0' : submit[0].gradientHover[2]}%, ${btnHGrad2} ${undefined === submit[0].gradientHover[3] ? '100' : submit[0].gradientHover[3]}%)`;
      } else if ('linear' === submit[0].gradientHover[4]) {
        btnHBG = `linear-gradient(${undefined === submit[0].gradientHover[5] ? '180' : submit[0].gradientHover[5]}deg, ${btnHGrad} ${undefined === submit[0].gradientHover[2] ? '0' : submit[0].gradientHover[2]}%, ${btnHGrad2} ${undefined === submit[0].gradientHover[3] ? '100' : submit[0].gradientHover[3]}%)`;
      }
    } else if (undefined !== submit[0].backgroundHover && '' !== submit[0].backgroundHover) {
      btnHBGnorm = (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].backgroundHover, submit[0].backgroundHoverOpacity !== undefined ? submit[0].backgroundHoverOpacity : 1);
    }

    if (undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[0] && submit[0].boxShadowHover[0] && undefined !== submit[0].boxShadowHover[7] && false === submit[0].boxShadowHover[7]) {
      btnHBox = `${undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[0] && submit[0].boxShadowHover[0] ? (undefined !== submit[0].boxShadowHover[7] && submit[0].boxShadowHover[7] ? 'inset ' : '') + (undefined !== submit[0].boxShadowHover[3] ? submit[0].boxShadowHover[3] : 1) + 'px ' + (undefined !== submit[0].boxShadowHover[4] ? submit[0].boxShadowHover[4] : 1) + 'px ' + (undefined !== submit[0].boxShadowHover[5] ? submit[0].boxShadowHover[5] : 2) + 'px ' + (undefined !== submit[0].boxShadowHover[6] ? submit[0].boxShadowHover[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== submit[0].boxShadowHover[1] ? submit[0].boxShadowHover[1] : '#000000', undefined !== submit[0].boxShadowHover[2] ? submit[0].boxShadowHover[2] : 1) : undefined}`;
      btnBox2 = 'none';
      btnRad = '0';
    }

    if (undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[0] && submit[0].boxShadowHover[0] && undefined !== submit[0].boxShadowHover[7] && true === submit[0].boxShadowHover[7]) {
      btnBox2 = `${undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[0] && submit[0].boxShadowHover[0] ? (undefined !== submit[0].boxShadowHover[7] && submit[0].boxShadowHover[7] ? 'inset ' : '') + (undefined !== submit[0].boxShadowHover[3] ? submit[0].boxShadowHover[3] : 1) + 'px ' + (undefined !== submit[0].boxShadowHover[4] ? submit[0].boxShadowHover[4] : 1) + 'px ' + (undefined !== submit[0].boxShadowHover[5] ? submit[0].boxShadowHover[5] : 2) + 'px ' + (undefined !== submit[0].boxShadowHover[6] ? submit[0].boxShadowHover[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== submit[0].boxShadowHover[1] ? submit[0].boxShadowHover[1] : '#000000', undefined !== submit[0].boxShadowHover[2] ? submit[0].boxShadowHover[2] : 1) : undefined}`;
      btnRad = undefined !== submit[0].borderRadius ? submit[0].borderRadius : undefined;
      btnHBox = 'none';
    }

    return `#kb-form-${uniqueID} .kadence-blocks-form-field input.kb-field:focus, #kb-form-${uniqueID} .kadence-blocks-form-field textarea:focus {
					${style[0].colorActive ? 'color:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].colorActive) + '!important;' : ''}
					${inputBGA ? 'background:' + inputBGA + '!important;' : ''}
					${inputBox ? 'box-shadow:' + inputBox + '!important;' : ''}
					${style[0].borderActive ? 'border-color:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(style[0].borderActive) + '!important;' : ''}
				}
				#kb-form-${uniqueID} .kadence-blocks-form-field .kb-forms-submit:hover {
					${submit[0].colorHover ? 'color:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].colorHover) + '!important;' : ''}
					${btnHBGnorm ? 'background:' + btnHBGnorm + '!important;' : ''}
					${btnHBox ? 'box-shadow:' + btnHBox + '!important;' : ''}
					${submit[0].borderHover ? 'border-color:' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].borderHover) + '!important;' : ''}
				}
				#kb-form-${uniqueID} .kadence-blocks-form-field .kb-forms-submit::before {
					${btnHBG ? 'background:' + btnHBG + ';' : ''}
					${btnBox2 ? 'box-shadow:' + btnBox2 + ';' : ''}
					${btnRad ? 'border-radius:' + btnRad + 'px;' : ''}
				}`;
  };

  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.useBlockProps)({
    className: className
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("style", null, renderCSS()), labelFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.WebfontLoader, {
    config: lconfig
  }), submitFont[0].google && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.WebfontLoader, {
    config: bconfig
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.BlockControls, {
    key: "controls"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.AlignmentToolbar, {
    value: hAlign,
    onChange: value => setAttributes({
      hAlign: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.InspectorControlTabs, {
    panelName: 'form',
    setActiveTab: value => setActiveTab(value),
    activeTab: activeTab
  }), activeTab === 'general' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, renderFieldControls, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.PanelRow, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    className: "kb-add-field",
    isPrimary: true,
    onClick: () => {
      const newFields = fields;
      newFields.push({
        label: '',
        showLabel: true,
        placeholder: '',
        default: '',
        rows: 4,
        options: [],
        multiSelect: false,
        inline: false,
        showLink: false,
        min: '',
        max: '',
        type: 'text',
        required: false,
        width: ['100', '', ''],
        auto: '',
        errorMessage: '',
        requiredMessage: ''
      });
      setAttributes({
        fields: newFields
      });
      saveFields({
        multiSelect: fields[0].multiSelect
      }, 0);
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
    icon: "plus"
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Add Field', 'kadence-blocks'))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Actions After Submit', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-action-after-submit'
  }, actionOptions && (0,lodash__WEBPACK_IMPORTED_MODULE_3__.times)(actionOptions.length, n => actionControls(n))), actions.includes('email') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-email-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email To Address', 'kadence-blocks'),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('name@example.com', 'kadence-blocks'),
    value: undefined !== email[0].emailTo ? email[0].emailTo : '',
    onChange: value => saveEmail({
      emailTo: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Seperate with comma for more then one email address.', 'kadence-blocks')
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email Subject', 'kadence-blocks'),
    value: undefined !== email[0].subject ? email[0].subject : '',
    onChange: value => saveEmail({
      subject: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('From Email', 'kadence-blocks'),
    value: undefined !== email[0].fromEmail ? email[0].fromEmail : '',
    onChange: value => saveEmail({
      fromEmail: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('From Name', 'kadence-blocks'),
    value: undefined !== email[0].fromName ? email[0].fromName : '',
    onChange: value => saveEmail({
      fromName: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Reply To', 'kadence-blocks'),
    value: email[0].replyTo,
    options: [{
      value: 'email_field',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Email Field', 'kadence-blocks')
    }, {
      value: 'from_email',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('From Email', 'kadence-blocks')
    }],
    onChange: value => {
      saveEmail({
        replyTo: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Cc', 'kadence-blocks'),
    value: undefined !== email[0].cc ? email[0].cc : '',
    onChange: value => saveEmail({
      cc: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Bcc', 'kadence-blocks'),
    value: undefined !== email[0].bcc ? email[0].bcc : '',
    onChange: value => saveEmail({
      bcc: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Send as HTML email?', 'kadence-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('If off plain text is used.', 'kadence-blocks'),
    checked: undefined !== email[0].html ? email[0].html : true,
    onChange: value => saveEmail({
      html: value
    })
  })), actions.includes('redirect') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Redirect Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-redirect-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.URLInputControl, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Redirect to', 'kadence-blocks'),
    url: redirect,
    onChangeUrl: value => setAttributes({
      redirect: value
    }),
    additionalControls: false
  }, props))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Basic Spam Check', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-basic-spam-check'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Enable Basic Honey Pot Spam Check', 'kadence-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('This adds a hidden field that if filled out prevents the form from submitting.', 'kadence-blocks'),
    checked: honeyPot,
    onChange: value => setAttributes({
      honeyPot: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Google reCAPTCHA', 'kadence-blocks'),
    initialOpen: false,
    panelname: 'kb-form-google-recaptcha'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Enable Google reCAPTCHA', 'kadence-blocks'),
    checked: recaptcha,
    onChange: value => setAttributes({
      recaptcha: value
    })
  }), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-btn-recaptch-settings-container components-base-control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", {
    className: "kb-component-label"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Recaptcha Version', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
    className: "kb-radio-button-flex-fill",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Recaptcha Version', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(recaptchaVersions, _ref => {
    let {
      name,
      key
    } = _ref;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
      key: key,
      className: "kt-btn-size-btn",
      isSmall: true,
      isPrimary: recaptchaVersion === key,
      "aria-pressed": recaptchaVersion === key,
      onClick: () => setAttributes({
        recaptchaVersion: key
      })
    }, name);
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("p", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ExternalLink, {
    href: RETRIEVE_KEY_URL
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Get keys', 'kadence-blocks')), "|\xA0", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ExternalLink, {
    href: HELP_URL
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Get help', 'kadence-blocks')))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Site Key', 'kadence-blocks'),
    value: siteKey,
    onChange: value => setSiteKey(value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Secret Key', 'kadence-blocks'),
    value: secretKey,
    onChange: value => setSecretKey(value)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "components-base-control"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    isPrimary: true,
    onClick: () => saveKeys,
    disabled: '' === siteKey || '' === secretKey
  }, isSaving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Saving', 'kadence-blocks') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Save', 'kadence-blocks')), isSavedKey && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, "\xA0", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
    isDefault: true,
    onClick: () => removeKeys
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Remove', 'kadence-blocks')))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Message Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-message-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Success Message', 'kadence-blocks'),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Submission Success, Thanks for getting in touch!', 'kadence-blocks'),
    value: undefined !== messages[0].success ? messages[0].success : '',
    onChange: value => saveMessages({
      success: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Success Message Colors', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-success-message-colors'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Success Message Color', 'kadence-blocks'),
    value: messageFont[0].colorSuccess ? messageFont[0].colorSuccess : '',
    default: '',
    onChange: value => {
      saveMessageFont({
        colorSuccess: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Success Message Background', 'kadence-blocks'),
    value: messageFont[0].backgroundSuccess ? messageFont[0].backgroundSuccess : '',
    default: '',
    onChange: value => {
      saveMessageFont({
        backgroundSuccess: value
      });
    },
    opacityValue: messageFont[0].backgroundSuccessOpacity,
    onOpacityChange: value => saveMessageFont({
      backgroundSuccessOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Success Message Border', 'kadence-blocks'),
    value: messageFont[0].borderSuccess ? messageFont[0].borderSuccess : '',
    default: '',
    onChange: value => {
      saveMessageFont({
        borderSuccess: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.PanelRow, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Pre Submit Form Validation Error Message', 'kadence-blocks'),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Please fix the errors to proceed', 'kadence-blocks'),
    value: undefined !== messages[0].preError ? messages[0].preError : '',
    onChange: value => saveMessages({
      preError: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.PanelRow, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Error Message', 'kadence-blocks'),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Submission Failed', 'kadence-blocks'),
    value: undefined !== messages[0].error ? messages[0].error : '',
    onChange: value => saveMessages({
      error: value
    })
  })), recaptcha && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.PanelRow, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Recapcha Error Message', 'kadence-blocks'),
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Submission Failed, reCaptcha spam prevention.', 'kadence-blocks'),
    value: undefined !== messages[0].recaptchaerror ? messages[0].recaptchaerror : '',
    onChange: value => saveMessages({
      recaptchaerror: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Error Message Colors', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-error-message-colors'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Error Message Color', 'kadence-blocks'),
    value: messageFont[0].colorError ? messageFont[0].colorError : '',
    default: '',
    onChange: value => {
      saveMessageFont({
        colorError: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Error Message Background', 'kadence-blocks'),
    value: messageFont[0].backgroundError ? messageFont[0].backgroundError : '',
    default: '',
    onChange: value => {
      saveMessageFont({
        backgroundError: value
      });
    },
    opacityValue: messageFont[0].backgroundErrorOpacity,
    onOpacityChange: value => saveMessageFont({
      backgroundErrorOpacity: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Error Message Border', 'kadence-blocks'),
    value: messageFont[0].borderError ? messageFont[0].borderError : '',
    default: '',
    onChange: value => {
      saveMessageFont({
        borderError: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontSize: messageFont[0].size,
    onFontSize: value => saveMessageFont({
      size: value
    }),
    fontSizeType: messageFont[0].sizeType,
    onFontSizeType: value => saveMessageFont({
      sizeType: value
    }),
    lineHeight: messageFont[0].lineHeight,
    onLineHeight: value => saveMessageFont({
      lineHeight: value
    }),
    lineHeightType: messageFont[0].lineType,
    onLineHeightType: value => saveMessageFont({
      lineType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Settings', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Width', 'kadence-blocks'),
    measurement: messageFont[0].borderWidth,
    control: messageFontBorderControl,
    onChange: value => saveMessageFont({
      borderWidth: value
    }),
    onControl: value => setMessageFontBorderControl(value),
    min: 0,
    max: 20,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Radius', 'kadence-blocks'),
    value: messageFont[0].borderRadius,
    onChange: value => {
      saveMessageFont({
        borderRadius: value
      });
    },
    min: 0,
    max: 50
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Advanced Message Font Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-advanced-message-font-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    letterSpacing: messageFont[0].letterSpacing,
    onLetterSpacing: value => saveMessageFont({
      letterSpacing: value
    }),
    fontFamily: messageFont[0].family,
    onFontFamily: value => saveMessageFont({
      family: value
    }),
    onFontChange: select => {
      saveMessageFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveMessageFont(values),
    googleFont: messageFont[0].google,
    onGoogleFont: value => saveMessageFont({
      google: value
    }),
    loadGoogleFont: messageFont[0].loadGoogle,
    onLoadGoogleFont: value => saveMessageFont({
      loadGoogle: value
    }),
    fontVariant: messageFont[0].variant,
    onFontVariant: value => saveMessageFont({
      variant: value
    }),
    fontWeight: messageFont[0].weight,
    onFontWeight: value => saveMessageFont({
      weight: value
    }),
    fontStyle: messageFont[0].style,
    onFontStyle: value => saveMessageFont({
      style: value
    }),
    fontSubset: messageFont[0].subset,
    onFontSubset: value => saveMessageFont({
      subset: value
    }),
    padding: messageFont[0].padding,
    onPadding: value => saveMessageFont({
      padding: value
    }),
    paddingControl: messagePaddingControl,
    onPaddingControl: value => setMessagePaddingControl(value),
    margin: messageFont[0].margin,
    onMargin: value => saveMessageFont({
      margin: value
    }),
    marginControl: messageMarginControl,
    onMarginControl: value => setMessageMarginControl(value)
  })))), activeTab === 'style' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Styles', 'kadence-blocks'),
    panelName: 'kb-form-field-styles'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontSize: style[0].fontSize,
    onFontSize: value => saveStyle({
      fontSize: value
    }),
    fontSizeType: style[0].fontSizeType,
    onFontSizeType: value => saveStyle({
      fontSizeType: value
    }),
    lineHeight: style[0].lineHeight,
    onLineHeight: value => saveStyle({
      lineHeight: value
    }),
    lineHeightType: style[0].lineType,
    onLineHeightType: value => saveStyle({
      lineType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-btn-size-settings-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-beside-btn-group"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Size')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
    className: "kt-button-size-type-options",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Size', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(btnSizes, _ref2 => {
    let {
      name,
      key
    } = _ref2;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
      key: key,
      className: "kt-btn-size-btn",
      isSmall: true,
      isPrimary: style[0].size === key,
      "aria-pressed": style[0].size === key,
      onClick: () => saveStyle({
        size: key
      })
    }, name);
  }))), 'custom' === style[0].size && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-inner-sub-section"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Padding', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Mobile Padding', 'kadence-blocks'),
          measurement: style[0].mobilePadding,
          control: mobilePaddingControl,
          onChange: value => saveStyle({
            mobilePadding: value
          }),
          onControl: value => setMobilePaddingControl(value),
          min: 0,
          max: 100,
          step: 1
        }));
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Tablet Padding', 'kadence-blocks'),
          measurement: style[0].tabletPadding,
          control: tabletPaddingControl,
          onChange: value => saveStyle({
            tabletPadding: value
          }),
          onControl: value => setTabletPaddingControl(value),
          min: 0,
          max: 100,
          step: 1
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Desktop Padding', 'kadence-blocks'),
          measurement: style[0].deskPadding,
          control: deskPaddingControl,
          onChange: value => saveStyle({
            deskPadding: value
          }),
          onControl: value => setDeskPaddingControl(value),
          min: 0,
          max: 100,
          step: 1
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Colors', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-inspect-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Normal', 'kadence-blocks'),
      className: 'kt-normal-tab'
    }, {
      name: 'focus',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Focus', 'kadence-blocks'),
      className: 'kt-focus-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('focus' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Focus Color', 'kadence-blocks'),
          value: style[0].colorActive ? style[0].colorActive : '',
          default: '',
          onChange: value => {
            saveStyle({
              colorActive: value
            });
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(bgType, _ref3 => {
          let {
            name,
            key
          } = _ref3;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (undefined !== style[0].backgroundActiveType ? style[0].backgroundActiveType : 'solid') === key,
            "aria-pressed": (undefined !== style[0].backgroundActiveType ? style[0].backgroundActiveType : 'solid') === key,
            onClick: () => saveStyle({
              backgroundActiveType: key
            })
          }, name);
        }))), 'gradient' !== style[0].backgroundActiveType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Focus Background', 'kadence-blocks'),
          value: style[0].backgroundActive ? style[0].backgroundActive : '',
          default: '',
          onChange: value => {
            saveStyle({
              backgroundActive: value
            });
          },
          opacityValue: style[0].backgroundActiveOpacity,
          onOpacityChange: value => saveStyle({
            backgroundActiveOpacity: value
          }),
          onArrayChange: (color, opacity) => saveStyle({
            backgroundActive: color,
            backgroundActiveOpacity: opacity
          })
        })), 'gradient' === style[0].backgroundActiveType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 1', 'kadence-blocks'),
          value: style[0].backgroundActive ? style[0].backgroundActive : '',
          default: '',
          onChange: value => {
            saveStyle({
              backgroundActive: value
            });
          },
          opacityValue: style[0].backgroundActiveOpacity,
          onOpacityChange: value => saveStyle({
            backgroundActiveOpacity: value
          }),
          onArrayChange: (color, opacity) => saveStyle({
            backgroundActive: color,
            backgroundActiveOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location', 'kadence-blocks'),
          value: style[0].gradientActive && undefined !== style[0].gradientActive[2] ? style[0].gradientActive[2] : 0,
          onChange: value => {
            saveStyleGradientActive(value, 2);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 2', 'kadence-blocks'),
          value: style[0].gradientActive && undefined !== style[0].gradientActive[0] ? style[0].gradientActive[0] : '#999999',
          default: '#999999',
          opacityValue: style[0].gradientActive && undefined !== style[0].gradientActive[1] ? style[0].gradientActive[1] : 1,
          onChange: value => {
            saveStyleGradientActive(value, 0);
          },
          onOpacityChange: value => {
            saveStyleGradientActive(value, 1);
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location'),
          value: style[0].gradientActive && undefined !== style[0].gradientActive[3] ? style[0].gradientActive[3] : 100,
          onChange: value => {
            saveStyleGradientActive(value, 3);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(gradTypes, _ref4 => {
          let {
            name,
            key
          } = _ref4;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (style[0].gradientActive && undefined !== style[0].gradientActive[4] ? style[0].gradientActive[4] : 'linear') === key,
            "aria-pressed": (style[0].gradientActive && undefined !== style[0].gradientActive[4] ? style[0].gradientActive[4] : 'linear') === key,
            onClick: () => {
              saveStyleGradientActive(key, 4);
            }
          }, name);
        }))), 'radial' !== (style[0].gradientActive && undefined !== style[0].gradientActive[4] ? style[0].gradientActive[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Angle', 'kadence-blocks'),
          value: style[0].gradientActive && undefined !== style[0].gradientActive[5] ? style[0].gradientActive[5] : 180,
          onChange: value => {
            saveStyleGradientActive(value, 5);
          },
          min: 0,
          max: 360
        }), 'radial' === (style[0].gradientActive && undefined !== style[0].gradientActive[4] ? style[0].gradientActive[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Position', 'kadence-blocks'),
          value: style[0].gradientActive && undefined !== style[0].gradientActive[6] ? style[0].gradientActive[6] : 'center center',
          options: [{
            value: 'center top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Top', 'kadence-blocks')
          }, {
            value: 'center center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Center', 'kadence-blocks')
          }, {
            value: 'center bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Bottom', 'kadence-blocks')
          }, {
            value: 'left top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Top', 'kadence-blocks')
          }, {
            value: 'left center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Center', 'kadence-blocks')
          }, {
            value: 'left bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Bottom', 'kadence-blocks')
          }, {
            value: 'right top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Top', 'kadence-blocks')
          }, {
            value: 'right center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Center', 'kadence-blocks')
          }, {
            value: 'right bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Bottom', 'kadence-blocks')
          }],
          onChange: value => {
            saveStyleGradientActive(value, 6);
          }
        })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Focus Border', 'kadence-blocks'),
          value: style[0].borderActive ? style[0].borderActive : '',
          default: '',
          onChange: value => {
            saveStyle({
              borderActive: value
            });
          },
          opacityValue: style[0].borderActiveOpacity,
          onOpacityChange: value => saveStyle({
            borderActiveOpacity: value
          }),
          onArrayChange: (color, opacity) => saveStyle({
            borderActive: color,
            borderActiveOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.BoxShadowControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Focus Box Shadow', 'kadence-blocks'),
          enable: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[0] ? style[0].boxShadowActive[0] : false,
          color: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[1] ? style[0].boxShadowActive[1] : '#000000',
          default: '#000000',
          opacity: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[2] ? style[0].boxShadowActive[2] : 0.4,
          hOffset: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[3] ? style[0].boxShadowActive[3] : 2,
          vOffset: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[4] ? style[0].boxShadowActive[4] : 2,
          blur: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[5] ? style[0].boxShadowActive[5] : 3,
          spread: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[6] ? style[0].boxShadowActive[6] : 0,
          inset: undefined !== style[0].boxShadowActive && undefined !== style[0].boxShadowActive[7] ? style[0].boxShadowActive[7] : false,
          onEnableChange: value => {
            saveStyleBoxShadowActive(value, 0);
          },
          onColorChange: value => {
            saveStyleBoxShadowActive(value, 1);
          },
          onOpacityChange: value => {
            saveStyleBoxShadowActive(value, 2);
          },
          onHOffsetChange: value => {
            saveStyleBoxShadowActive(value, 3);
          },
          onVOffsetChange: value => {
            saveStyleBoxShadowActive(value, 4);
          },
          onBlurChange: value => {
            saveStyleBoxShadowActive(value, 5);
          },
          onSpreadChange: value => {
            saveStyleBoxShadowActive(value, 6);
          },
          onInsetChange: value => {
            saveStyleBoxShadowActive(value, 7);
          }
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Color', 'kadence-blocks'),
          value: style[0].color ? style[0].color : '',
          default: '',
          onChange: value => {
            saveStyle({
              color: value
            });
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(bgType, _ref5 => {
          let {
            name,
            key
          } = _ref5;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (undefined !== style[0].backgroundType ? style[0].backgroundType : 'solid') === key,
            "aria-pressed": (undefined !== style[0].backgroundType ? style[0].backgroundType : 'solid') === key,
            onClick: () => saveStyle({
              backgroundType: key
            })
          }, name);
        }))), 'gradient' !== style[0].backgroundType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Background', 'kadence-blocks'),
          value: style[0].background ? style[0].background : '',
          default: '',
          onChange: value => {
            saveStyle({
              background: value
            });
          },
          opacityValue: style[0].backgroundOpacity,
          onOpacityChange: value => saveStyle({
            backgroundOpacity: value
          }),
          onArrayChange: (color, opacity) => saveStyle({
            background: color,
            backgroundOpacity: opacity
          })
        })), 'gradient' === style[0].backgroundType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 1', 'kadence-blocks'),
          value: style[0].background ? style[0].background : '',
          default: '',
          onChange: value => {
            saveStyle({
              background: value
            });
          },
          opacityValue: style[0].backgroundOpacity,
          onOpacityChange: value => saveStyle({
            backgroundOpacity: value
          }),
          onArrayChange: (color, opacity) => saveStyle({
            background: color,
            backgroundOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location', 'kadence-blocks'),
          value: style[0].gradient && undefined !== style[0].gradient[2] ? style[0].gradient[2] : 0,
          onChange: value => {
            saveStyleGradient(value, 2);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 2', 'kadence-blocks'),
          value: style[0].gradient && undefined !== style[0].gradient[0] ? style[0].gradient[0] : '#999999',
          default: '#999999',
          opacityValue: style[0].gradient && undefined !== style[0].gradient[1] ? style[0].gradient[1] : 1,
          onChange: value => {
            saveStyleGradient(value, 0);
          },
          onOpacityChange: value => {
            saveStyleGradient(value, 1);
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location', 'kadence-blocks'),
          value: style[0].gradient && undefined !== style[0].gradient[3] ? style[0].gradient[3] : 100,
          onChange: value => {
            saveStyleGradient(value, 3);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(gradTypes, _ref6 => {
          let {
            name,
            key
          } = _ref6;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (style[0].gradient && undefined !== style[0].gradient[4] ? style[0].gradient[4] : 'linear') === key,
            "aria-pressed": (style[0].gradient && undefined !== style[0].gradient[4] ? style[0].gradient[4] : 'linear') === key,
            onClick: () => {
              saveStyleGradient(key, 4);
            }
          }, name);
        }))), 'radial' !== (style[0].gradient && undefined !== style[0].gradient[4] ? style[0].gradient[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Angle', 'kadence-blocks'),
          value: style[0].gradient && undefined !== style[0].gradient[5] ? style[0].gradient[5] : 180,
          onChange: value => {
            saveStyleGradient(value, 5);
          },
          min: 0,
          max: 360
        }), 'radial' === (style[0].gradient && undefined !== style[0].gradient[4] ? style[0].gradient[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Position', 'kadence-blocks'),
          value: style[0].gradient && undefined !== style[0].gradient[6] ? style[0].gradient[6] : 'center center',
          options: [{
            value: 'center top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Top', 'kadence-blocks')
          }, {
            value: 'center center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Center', 'kadence-blocks')
          }, {
            value: 'center bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Bottom', 'kadence-blocks')
          }, {
            value: 'left top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Top', 'kadence-blocks')
          }, {
            value: 'left center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Center', 'kadence-blocks')
          }, {
            value: 'left bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Bottom', 'kadence-blocks')
          }, {
            value: 'right top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Top', 'kadence-blocks')
          }, {
            value: 'right center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Center', 'kadence-blocks')
          }, {
            value: 'right bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Bottom', 'kadence-blocks')
          }],
          onChange: value => {
            saveStyleGradient(value, 6);
          }
        })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Border', 'kadence-blocks'),
          value: style[0].border ? style[0].border : '',
          default: '',
          onChange: value => {
            saveStyle({
              border: value
            });
          },
          opacityValue: style[0].borderOpacity,
          onOpacityChange: value => saveStyle({
            borderOpacity: value
          }),
          onArrayChange: (color, opacity) => saveStyle({
            border: color,
            borderOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.BoxShadowControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Box Shadow', 'kadence-blocks'),
          enable: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[0] ? style[0].boxShadow[0] : false,
          color: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[1] ? style[0].boxShadow[1] : '#000000',
          default: '#000000',
          opacity: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[2] ? style[0].boxShadow[2] : 0.4,
          hOffset: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[3] ? style[0].boxShadow[3] : 2,
          vOffset: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[4] ? style[0].boxShadow[4] : 2,
          blur: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[5] ? style[0].boxShadow[5] : 3,
          spread: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[6] ? style[0].boxShadow[6] : 0,
          inset: undefined !== style[0].boxShadow && undefined !== style[0].boxShadow[7] ? style[0].boxShadow[7] : false,
          onEnableChange: value => {
            saveStyleBoxShadow(value, 0);
          },
          onColorChange: value => {
            saveStyleBoxShadow(value, 1);
          },
          onOpacityChange: value => {
            saveStyleBoxShadow(value, 2);
          },
          onHOffsetChange: value => {
            saveStyleBoxShadow(value, 3);
          },
          onVOffsetChange: value => {
            saveStyleBoxShadow(value, 4);
          },
          onBlurChange: value => {
            saveStyleBoxShadow(value, 5);
          },
          onSpreadChange: value => {
            saveStyleBoxShadow(value, 6);
          },
          onInsetChange: value => {
            saveStyleBoxShadow(value, 7);
          }
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Settings', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Width', 'kadence-blocks'),
    measurement: style[0].borderWidth,
    control: borderControl,
    onChange: value => saveStyle({
      borderWidth: value
    }),
    onControl: value => setBorderControl(value),
    min: 0,
    max: 20,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Radius', 'kadence-blocks'),
    value: style[0].borderRadius,
    onChange: value => {
      saveStyle({
        borderRadius: value
      });
    },
    min: 0,
    max: 50
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Row Gap', 'kadence-blocks'),
    value: undefined !== style[0].rowGap ? style[0].rowGap : '',
    onChange: value => {
      saveStyle({
        rowGap: value
      });
    },
    tabletValue: undefined !== style[0].tabletRowGap ? style[0].tabletRowGap : '',
    onChangeTablet: value => {
      saveStyle({
        tabletRowGap: value
      });
    },
    mobileValue: undefined !== style[0].mobileRowGap ? style[0].mobileRowGap : '',
    onChangeMobile: value => {
      saveStyle({
        mobileRowGap: value
      });
    },
    min: 0,
    max: 100,
    step: 1,
    showUnit: true,
    unit: 'px',
    units: ['px']
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveRangeControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Field Column Gutter', 'kadence-blocks'),
    value: undefined !== style[0].gutter ? style[0].gutter : '',
    onChange: value => {
      saveStyle({
        gutter: value
      });
    },
    tabletValue: undefined !== style[0].tabletGutter ? style[0].tabletGutter : '',
    onChangeTablet: value => {
      saveStyle({
        tabletGutter: value
      });
    },
    mobileValue: undefined !== style[0].mobileGutter ? style[0].mobileGutter : '',
    onChangeMobile: value => {
      saveStyle({
        mobileGutter: value
      });
    },
    min: 0,
    max: 50,
    step: 2,
    showUnit: true,
    unit: 'px',
    units: ['px']
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Label Styles', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-label-styles'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Label Color', 'kadence-blocks'),
    value: labelFont[0].color ? labelFont[0].color : '',
    default: '',
    onChange: value => {
      saveLabelFont({
        color: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Show Required?', 'kadence-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('If off required asterisk is removed.', 'kadence-blocks'),
    checked: undefined !== style[0].showRequired ? style[0].showRequired : true,
    onChange: value => saveStyle({
      showRequired: value
    })
  }), style[0].showRequired && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Required Color', 'kadence-blocks'),
    value: style[0].requiredColor ? style[0].requiredColor : '',
    default: '',
    onChange: value => {
      saveStyle({
        requiredColor: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontSize: labelFont[0].size,
    onFontSize: value => saveLabelFont({
      size: value
    }),
    fontSizeType: labelFont[0].sizeType,
    onFontSizeType: value => saveLabelFont({
      sizeType: value
    }),
    lineHeight: labelFont[0].lineHeight,
    onLineHeight: value => saveLabelFont({
      lineHeight: value
    }),
    lineHeightType: labelFont[0].lineType,
    onLineHeightType: value => saveLabelFont({
      lineType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Advanced Label Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-advanced-label-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    letterSpacing: labelFont[0].letterSpacing,
    onLetterSpacing: value => saveLabelFont({
      letterSpacing: value
    }),
    textTransform: labelFont[0].textTransform,
    onTextTransform: value => saveLabelFont({
      textTransform: value
    }),
    fontFamily: labelFont[0].family,
    onFontFamily: value => saveLabelFont({
      family: value
    }),
    onFontChange: select => {
      saveLabelFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveLabelFont(values),
    googleFont: labelFont[0].google,
    onGoogleFont: value => saveLabelFont({
      google: value
    }),
    loadGoogleFont: labelFont[0].loadGoogle,
    onLoadGoogleFont: value => saveLabelFont({
      loadGoogle: value
    }),
    fontVariant: labelFont[0].variant,
    onFontVariant: value => saveLabelFont({
      variant: value
    }),
    fontWeight: labelFont[0].weight,
    onFontWeight: value => saveLabelFont({
      weight: value
    }),
    fontStyle: labelFont[0].style,
    onFontStyle: value => saveLabelFont({
      style: value
    }),
    fontSubset: labelFont[0].subset,
    onFontSubset: value => saveLabelFont({
      subset: value
    }),
    padding: labelFont[0].padding,
    onPadding: value => saveLabelFont({
      padding: value
    }),
    paddingControl: labelPaddingControl,
    onPaddingControl: value => setLabelPaddingControl(value),
    margin: labelFont[0].margin,
    onMargin: value => saveLabelFont({
      margin: value
    }),
    marginControl: labelMarginControl,
    onMarginControl: value => setLabelMarginControl(value)
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Submit Styles', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-submit-styles'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Column Width', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          value: submit[0].width[2],
          options: [{
            value: '20',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('20%', 'kadence-blocks')
          }, {
            value: '25',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('25%', 'kadence-blocks')
          }, {
            value: '33',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('33%', 'kadence-blocks')
          }, {
            value: '40',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('40%', 'kadence-blocks')
          }, {
            value: '50',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('50%', 'kadence-blocks')
          }, {
            value: '60',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('60%', 'kadence-blocks')
          }, {
            value: '66',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('66%', 'kadence-blocks')
          }, {
            value: '75',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('75%', 'kadence-blocks')
          }, {
            value: '80',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('80%', 'kadence-blocks')
          }, {
            value: '100',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('100%', 'kadence-blocks')
          }, {
            value: 'unset',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Unset', 'kadence-blocks')
          }],
          onChange: value => {
            saveSubmit({
              width: [submit[0].width[0] ? submit[0].width[0] : '100', submit[0].width[1] ? submit[0].width[1] : '', value]
            });
          }
        }));
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          value: submit[0].width[1],
          options: [{
            value: '20',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('20%', 'kadence-blocks')
          }, {
            value: '25',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('25%', 'kadence-blocks')
          }, {
            value: '33',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('33%', 'kadence-blocks')
          }, {
            value: '40',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('40%', 'kadence-blocks')
          }, {
            value: '50',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('50%', 'kadence-blocks')
          }, {
            value: '60',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('60%', 'kadence-blocks')
          }, {
            value: '66',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('66%', 'kadence-blocks')
          }, {
            value: '75',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('75%', 'kadence-blocks')
          }, {
            value: '80',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('80%', 'kadence-blocks')
          }, {
            value: '100',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('100%', 'kadence-blocks')
          }, {
            value: 'unset',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Unset', 'kadence-blocks')
          }],
          onChange: value => {
            saveSubmit({
              width: [submit[0].width[0] ? submit[0].width[0] : '100', value, submit[0].width[2] ? submit[0].width[2] : '']
            });
          }
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          value: submit[0].width[0],
          options: [{
            value: '20',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('20%', 'kadence-blocks')
          }, {
            value: '25',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('25%', 'kadence-blocks')
          }, {
            value: '33',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('33%', 'kadence-blocks')
          }, {
            value: '40',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('40%', 'kadence-blocks')
          }, {
            value: '50',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('50%', 'kadence-blocks')
          }, {
            value: '60',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('60%', 'kadence-blocks')
          }, {
            value: '66',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('66%', 'kadence-blocks')
          }, {
            value: '75',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('75%', 'kadence-blocks')
          }, {
            value: '80',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('80%', 'kadence-blocks')
          }, {
            value: '100',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('100%', 'kadence-blocks')
          }, {
            value: 'unset',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Unset', 'kadence-blocks')
          }],
          onChange: value => {
            saveSubmit({
              width: [value, submit[0].width[1] ? submit[0].width[1] : '', submit[0].width[2] ? submit[0].width[2] : '']
            });
          }
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-btn-size-settings-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-beside-btn-group"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Size')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
    className: "kt-button-size-type-options",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Size', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(btnSizes, _ref7 => {
    let {
      name,
      key
    } = _ref7;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
      key: key,
      className: "kt-btn-size-btn",
      isSmall: true,
      isPrimary: submit[0].size === key,
      "aria-pressed": submit[0].size === key,
      onClick: () => saveSubmit({
        size: key
      })
    }, name);
  }))), 'custom' === submit[0].size && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-inner-sub-section"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Input Padding', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Mobile Padding', 'kadence-blocks'),
          measurement: submit[0].mobilePadding,
          control: submitMobilePaddingControl,
          onChange: value => saveSubmit({
            mobilePadding: value
          }),
          onControl: value => setSubmitMobilePaddingControl(value),
          min: 0,
          max: 100,
          step: 1
        }));
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Tablet Padding', 'kadence-blocks'),
          measurement: submit[0].tabletPadding,
          control: submitTabletPaddingControl,
          onChange: value => saveSubmit({
            tabletPadding: value
          }),
          onControl: value => setSubmitTabletPaddingControl(value),
          min: 0,
          max: 100,
          step: 1
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Desktop Padding', 'kadence-blocks'),
          measurement: submit[0].deskPadding,
          control: submitDeskPaddingControl,
          onChange: value => saveSubmit({
            deskPadding: value
          }),
          onControl: value => setSubmitDeskPaddingControl(value),
          min: 0,
          max: 100,
          step: 1
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-btn-size-settings-container"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-beside-btn-group"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Width')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
    className: "kt-button-size-type-options",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Width')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(btnWidths, _ref8 => {
    let {
      name,
      key
    } = _ref8;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
      key: key,
      className: "kt-btn-size-btn",
      isSmall: true,
      isPrimary: submit[0].widthType === key,
      "aria-pressed": submit[0].widthType === key,
      onClick: () => saveSubmit({
        widthType: key
      })
    }, name);
  }))), 'fixed' === submit[0].widthType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kt-inner-sub-section"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Fixed Width')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          value: submit[0].fixedWidth && undefined !== submit[0].fixedWidth[2] ? submit[0].fixedWidth[2] : undefined,
          onChange: value => {
            saveSubmit({
              fixedWidth: [undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[0] ? submit[0].fixedWidth[0] : '', undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[1] ? submit[0].fixedWidth[1] : '', value]
            });
          },
          min: 10,
          max: 500
        });
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          value: submit[0].fixedWidth && undefined !== submit[0].fixedWidth[1] ? submit[0].fixedWidth[1] : undefined,
          onChange: value => {
            saveSubmit({
              fixedWidth: [undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[0] ? submit[0].fixedWidth[0] : '', value, undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[2] ? submit[0].fixedWidth[2] : '']
            });
          },
          min: 10,
          max: 500
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          value: submit[0].fixedWidth && undefined !== submit[0].fixedWidth[0] ? submit[0].fixedWidth[0] : undefined,
          onChange: value => {
            saveSubmit({
              fixedWidth: [value, undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[1] ? submit[0].fixedWidth[1] : '', undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[2] ? submit[0].fixedWidth[2] : '']
            });
          },
          min: 10,
          max: 500
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Colors', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-inspect-tabs kt-hover-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'normal',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Normal', 'kadence-blocks'),
      className: 'kt-normal-tab'
    }, {
      name: 'hover',
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Hover', 'kadence-blocks'),
      className: 'kt-hover-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('hover' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Hover Color', 'kadence-blocks'),
          value: submit[0].colorHover ? submit[0].colorHover : '',
          default: '',
          onChange: value => {
            saveSubmit({
              colorHover: value
            });
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(bgType, _ref9 => {
          let {
            name,
            key
          } = _ref9;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (undefined !== submit[0].backgroundHoverType ? submit[0].backgroundHoverType : 'solid') === key,
            "aria-pressed": (undefined !== submit[0].backgroundHoverType ? submit[0].backgroundHoverType : 'solid') === key,
            onClick: () => saveSubmit({
              backgroundHoverType: key
            })
          }, name);
        }))), 'gradient' !== submit[0].backgroundHoverType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Hover Background', 'kadence-blocks'),
          value: submit[0].backgroundHover ? submit[0].backgroundHover : '',
          default: '',
          onChange: value => {
            saveSubmit({
              backgroundHover: value
            });
          },
          opacityValue: submit[0].backgroundHoverOpacity,
          onOpacityChange: value => saveSubmit({
            backgroundHoverOpacity: value
          }),
          onArrayChange: (color, opacity) => saveSubmit({
            backgroundHover: color,
            backgroundHoverOpacity: opacity
          })
        })), 'gradient' === submit[0].backgroundHoverType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 1', 'kadence-blocks'),
          value: submit[0].backgroundHover ? submit[0].backgroundHover : '',
          default: '',
          onChange: value => {
            saveSubmit({
              backgroundHover: value
            });
          },
          opacityValue: submit[0].backgroundHoverOpacity,
          onOpacityChange: value => saveSubmit({
            backgroundHoverOpacity: value
          }),
          onArrayChange: (color, opacity) => saveSubmit({
            backgroundHover: color,
            backgroundHoverOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location', 'kadence-blocks'),
          value: submit[0].gradientHover && undefined !== submit[0].gradientHover[2] ? submit[0].gradientHover[2] : 0,
          onChange: value => {
            saveSubmitGradientHover(value, 2);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 2', 'kadence-blocks'),
          value: submit[0].gradientHover && undefined !== submit[0].gradientHover[0] ? submit[0].gradientHover[0] : '#999999',
          default: '#999999',
          opacityValue: submit[0].gradientHover && undefined !== submit[0].gradientHover[1] ? submit[0].gradientHover[1] : 1,
          onChange: value => {
            saveSubmitGradientHover(value, 0);
          },
          onOpacityChange: value => {
            saveSubmitGradientHover(value, 1);
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location'),
          value: submit[0].gradientHover && undefined !== submit[0].gradientHover[3] ? submit[0].gradientHover[3] : 100,
          onChange: value => {
            saveSubmitGradientHover(value, 3);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(gradTypes, _ref10 => {
          let {
            name,
            key
          } = _ref10;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (submit[0].gradientHover && undefined !== submit[0].gradientHover[4] ? submit[0].gradientHover[4] : 'linear') === key,
            "aria-pressed": (submit[0].gradientHover && undefined !== submit[0].gradientHover[4] ? submit[0].gradientHover[4] : 'linear') === key,
            onClick: () => {
              saveSubmitGradientHover(key, 4);
            }
          }, name);
        }))), 'radial' !== (submit[0].gradientHover && undefined !== submit[0].gradientHover[4] ? submit[0].gradientHover[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Angle', 'kadence-blocks'),
          value: submit[0].gradientHover && undefined !== submit[0].gradientHover[5] ? submit[0].gradientHover[5] : 180,
          onChange: value => {
            saveSubmitGradientHover(value, 5);
          },
          min: 0,
          max: 360
        }), 'radial' === (submit[0].gradientHover && undefined !== submit[0].gradientHover[4] ? submit[0].gradientHover[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Position', 'kadence-blocks'),
          value: submit[0].gradientHover && undefined !== submit[0].gradientHover[6] ? submit[0].gradientHover[6] : 'center center',
          options: [{
            value: 'center top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Top', 'kadence-blocks')
          }, {
            value: 'center center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Center', 'kadence-blocks')
          }, {
            value: 'center bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Bottom', 'kadence-blocks')
          }, {
            value: 'left top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Top', 'kadence-blocks')
          }, {
            value: 'left center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Center', 'kadence-blocks')
          }, {
            value: 'left bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Bottom', 'kadence-blocks')
          }, {
            value: 'right top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Top', 'kadence-blocks')
          }, {
            value: 'right center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Center', 'kadence-blocks')
          }, {
            value: 'right bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Bottom', 'kadence-blocks')
          }],
          onChange: value => {
            saveSubmitGradientHover(value, 6);
          }
        })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Hover Border', 'kadence-blocks'),
          value: submit[0].borderHover ? submit[0].borderHover : '',
          default: '',
          onChange: value => {
            saveSubmit({
              borderHover: value
            });
          },
          opacityValue: submit[0].borderHoverOpacity,
          onOpacityChange: value => saveSubmit({
            borderHoverOpacity: value
          }),
          onArrayChange: (color, opacity) => saveSubmit({
            borderHover: color,
            borderHoverOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.BoxShadowControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Hover Box Shadow', 'kadence-blocks'),
          enable: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[0] ? submit[0].boxShadowHover[0] : false,
          color: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[1] ? submit[0].boxShadowHover[1] : '#000000',
          default: '#000000',
          opacity: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[2] ? submit[0].boxShadowHover[2] : 0.4,
          hOffset: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[3] ? submit[0].boxShadowHover[3] : 2,
          vOffset: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[4] ? submit[0].boxShadowHover[4] : 2,
          blur: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[5] ? submit[0].boxShadowHover[5] : 3,
          spread: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[6] ? submit[0].boxShadowHover[6] : 0,
          inset: undefined !== submit[0].boxShadowHover && undefined !== submit[0].boxShadowHover[7] ? submit[0].boxShadowHover[7] : false,
          onEnableChange: value => {
            saveSubmitBoxShadowHover(value, 0);
          },
          onColorChange: value => {
            saveSubmitBoxShadowHover(value, 1);
          },
          onOpacityChange: value => {
            saveSubmitBoxShadowHover(value, 2);
          },
          onHOffsetChange: value => {
            saveSubmitBoxShadowHover(value, 3);
          },
          onVOffsetChange: value => {
            saveSubmitBoxShadowHover(value, 4);
          },
          onBlurChange: value => {
            saveSubmitBoxShadowHover(value, 5);
          },
          onSpreadChange: value => {
            saveSubmitBoxShadowHover(value, 6);
          },
          onInsetChange: value => {
            saveSubmitBoxShadowHover(value, 7);
          }
        }));
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Text Color', 'kadence-blocks'),
          value: submit[0].color ? submit[0].color : '',
          default: '',
          onChange: value => {
            saveSubmit({
              color: value
            });
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Background Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(bgType, _ref11 => {
          let {
            name,
            key
          } = _ref11;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (undefined !== submit[0].backgroundType ? submit[0].backgroundType : 'solid') === key,
            "aria-pressed": (undefined !== submit[0].backgroundType ? submit[0].backgroundType : 'solid') === key,
            onClick: () => saveSubmit({
              backgroundType: key
            })
          }, name);
        }))), 'gradient' !== submit[0].backgroundType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Background', 'kadence-blocks'),
          value: submit[0].background ? submit[0].background : '',
          default: '',
          onChange: value => {
            saveSubmit({
              background: value
            });
          },
          opacityValue: submit[0].backgroundOpacity,
          onOpacityChange: value => saveSubmit({
            backgroundOpacity: value
          }),
          onArrayChange: (color, opacity) => saveSubmit({
            background: color,
            backgroundOpacity: opacity
          })
        })), 'gradient' === submit[0].backgroundType && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-inner-sub-section"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 1', 'kadence-blocks'),
          value: submit[0].background ? submit[0].background : '',
          default: '',
          onChange: value => {
            saveSubmit({
              background: value
            });
          },
          opacityValue: submit[0].backgroundOpacity,
          onOpacityChange: value => saveSubmit({
            backgroundOpacity: value
          }),
          onArrayChange: (color, opacity) => saveSubmit({
            background: color,
            backgroundOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location', 'kadence-blocks'),
          value: submit[0].gradient && undefined !== submit[0].gradient[2] ? submit[0].gradient[2] : 0,
          onChange: value => {
            saveSubmitGradient(value, 2);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Color 2', 'kadence-blocks'),
          value: submit[0].gradient && undefined !== submit[0].gradient[0] ? submit[0].gradient[0] : '#999999',
          default: '#999999',
          opacityValue: submit[0].gradient && undefined !== submit[0].gradient[1] ? submit[0].gradient[1] : 1,
          onChange: value => {
            saveSubmitGradient(value, 0);
          },
          onOpacityChange: value => {
            saveSubmitGradient(value, 1);
          }
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Location', 'kadence-blocks'),
          value: submit[0].gradient && undefined !== submit[0].gradient[3] ? submit[0].gradient[3] : 100,
          onChange: value => {
            saveSubmitGradient(value, 3);
          },
          min: 0,
          max: 100
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
          className: "kt-btn-size-settings-container"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
          className: "kt-beside-btn-group"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
          className: "kt-button-size-type-options",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Type', 'kadence-blocks')
        }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(gradTypes, _ref12 => {
          let {
            name,
            key
          } = _ref12;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
            key: key,
            className: "kt-btn-size-btn",
            isSmall: true,
            isPrimary: (submit[0].gradient && undefined !== submit[0].gradient[4] ? submit[0].gradient[4] : 'linear') === key,
            "aria-pressed": (submit[0].gradient && undefined !== submit[0].gradient[4] ? submit[0].gradient[4] : 'linear') === key,
            onClick: () => {
              saveSubmitGradient(key, 4);
            }
          }, name);
        }))), 'radial' !== (submit[0].gradient && undefined !== submit[0].gradient[4] ? submit[0].gradient[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Angle', 'kadence-blocks'),
          value: submit[0].gradient && undefined !== submit[0].gradient[5] ? submit[0].gradient[5] : 180,
          onChange: value => {
            saveSubmitGradient(value, 5);
          },
          min: 0,
          max: 360
        }), 'radial' === (submit[0].gradient && undefined !== submit[0].gradient[4] ? submit[0].gradient[4] : 'linear') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Gradient Position', 'kadence-blocks'),
          value: submit[0].gradient && undefined !== submit[0].gradient[6] ? submit[0].gradient[6] : 'center center',
          options: [{
            value: 'center top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Top', 'kadence-blocks')
          }, {
            value: 'center center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Center', 'kadence-blocks')
          }, {
            value: 'center bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Center Bottom', 'kadence-blocks')
          }, {
            value: 'left top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Top', 'kadence-blocks')
          }, {
            value: 'left center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Center', 'kadence-blocks')
          }, {
            value: 'left bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Left Bottom', 'kadence-blocks')
          }, {
            value: 'right top',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Top', 'kadence-blocks')
          }, {
            value: 'right center',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Center', 'kadence-blocks')
          }, {
            value: 'right bottom',
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Right Bottom', 'kadence-blocks')
          }],
          onChange: value => {
            saveSubmitGradient(value, 6);
          }
        })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.PopColorControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Border', 'kadence-blocks'),
          value: submit[0].border ? submit[0].border : '',
          default: '',
          onChange: value => {
            saveSubmit({
              border: value
            });
          },
          opacityValue: submit[0].borderOpacity,
          onOpacityChange: value => saveSubmit({
            borderOpacity: value
          }),
          onArrayChange: (color, opacity) => saveSubmit({
            border: color,
            borderOpacity: opacity
          })
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.BoxShadowControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Button Box Shadow', 'kadence-blocks'),
          enable: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[0] ? submit[0].boxShadow[0] : false,
          color: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[1] ? submit[0].boxShadow[1] : '#000000',
          default: '#000000',
          opacity: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[2] ? submit[0].boxShadow[2] : 0.4,
          hOffset: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[3] ? submit[0].boxShadow[3] : 2,
          vOffset: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[4] ? submit[0].boxShadow[4] : 2,
          blur: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[5] ? submit[0].boxShadow[5] : 3,
          spread: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[6] ? submit[0].boxShadow[6] : 0,
          inset: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[7] ? submit[0].boxShadow[7] : false,
          onEnableChange: value => {
            saveSubmitBoxShadow(value, 0);
          },
          onColorChange: value => {
            saveSubmitBoxShadow(value, 1);
          },
          onOpacityChange: value => {
            saveSubmitBoxShadow(value, 2);
          },
          onHOffsetChange: value => {
            saveSubmitBoxShadow(value, 3);
          },
          onVOffsetChange: value => {
            saveSubmitBoxShadow(value, 4);
          },
          onBlurChange: value => {
            saveSubmitBoxShadow(value, 5);
          },
          onSpreadChange: value => {
            saveSubmitBoxShadow(value, 6);
          },
          onInsetChange: value => {
            saveSubmitBoxShadow(value, 7);
          }
        }));
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Settings', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Width', 'kadence-blocks'),
    measurement: submit[0].borderWidth,
    control: submitBorderControl,
    onChange: value => saveSubmit({
      borderWidth: value
    }),
    onControl: value => setSubmitBorderControl(value),
    min: 0,
    max: 20,
    step: 1
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Border Radius', 'kadence-blocks'),
    value: submit[0].borderRadius,
    onChange: value => {
      saveSubmit({
        borderRadius: value
      });
    },
    min: 0,
    max: 50
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    fontSize: submitFont[0].size,
    onFontSize: value => saveSubmitFont({
      size: value
    }),
    fontSizeType: submitFont[0].sizeType,
    onFontSizeType: value => saveSubmitFont({
      sizeType: value
    }),
    lineHeight: submitFont[0].lineHeight,
    onLineHeight: value => saveSubmitFont({
      lineHeight: value
    }),
    lineHeightType: submitFont[0].lineType,
    onLineHeightType: value => saveSubmitFont({
      lineType: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Advanced Button Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-advanced-button-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.TypographyControls, {
    letterSpacing: submitFont[0].letterSpacing,
    onLetterSpacing: value => saveSubmitFont({
      letterSpacing: value
    }),
    textTransform: submitFont[0].textTransform,
    onTextTransform: value => saveSubmitFont({
      textTransform: value
    }),
    fontFamily: submitFont[0].family,
    onFontFamily: value => saveSubmitFont({
      family: value
    }),
    onFontChange: select => {
      saveSubmitFont({
        family: select.value,
        google: select.google
      });
    },
    onFontArrayChange: values => saveSubmitFont(values),
    googleFont: submitFont[0].google,
    onGoogleFont: value => saveSubmitFont({
      google: value
    }),
    loadGoogleFont: submitFont[0].loadGoogle,
    onLoadGoogleFont: value => saveSubmitFont({
      loadGoogle: value
    }),
    fontVariant: submitFont[0].variant,
    onFontVariant: value => saveSubmitFont({
      variant: value
    }),
    fontWeight: submitFont[0].weight,
    onFontWeight: value => saveSubmitFont({
      weight: value
    }),
    fontStyle: submitFont[0].style,
    onFontStyle: value => saveSubmitFont({
      style: value
    }),
    fontSubset: submitFont[0].subset,
    onFontSubset: value => saveSubmitFont({
      subset: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.ButtonGroup, {
    className: "kt-size-type-options kt-row-size-type-options",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Margin Type', 'kadence-blocks')
  }, (0,lodash__WEBPACK_IMPORTED_MODULE_3__.map)(marginTypes, _ref13 => {
    let {
      name,
      key
    } = _ref13;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
      key: key,
      className: "kt-size-btn",
      isSmall: true,
      isPrimary: marginUnit === key,
      "aria-pressed": marginUnit === key,
      onClick: () => saveSubmitMargin({
        unit: key
      })
    }, name);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title kt-secondary-color-size"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Margin Unit', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("h2", {
    className: "kt-heading-size-title"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Margin', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TabPanel, {
    className: "kt-size-tabs",
    activeClass: "active-tab",
    tabs: [{
      name: 'desk',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "desktop"
      }),
      className: 'kt-desk-tab'
    }, {
      name: 'tablet',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "tablet"
      }),
      className: 'kt-tablet-tab'
    }, {
      name: 'mobile',
      title: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.Dashicon, {
        icon: "smartphone"
      }),
      className: 'kt-mobile-tab'
    }]
  }, tab => {
    let tabout;

    if (tab.name) {
      if ('mobile' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Mobile Margin', 'kadence-blocks'),
          measurement: undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].mobile ? submitMargin[0].mobile : ['', '', '', ''],
          control: undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].control ? submitMargin[0].control : 'linked',
          onChange: value => saveSubmitMargin({
            mobile: value
          }),
          onControl: value => saveSubmitMargin({
            control: value
          }),
          min: marginMin,
          max: marginMax,
          step: marginStep,
          allowEmpty: true
        });
      } else if ('tablet' === tab.name) {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Tablet Margin', 'kadence-blocks'),
          measurement: undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].tablet ? submitMargin[0].tablet : ['', '', '', ''],
          control: undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].control ? submitMargin[0].control : 'linked',
          onChange: value => saveSubmitMargin({
            tablet: value
          }),
          onControl: value => saveSubmitMargin({
            control: value
          }),
          min: marginMin,
          max: marginMax,
          step: marginStep,
          allowEmpty: true
        });
      } else {
        tabout = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.MeasurementControls, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Desktop Margin', 'kadence-blocks'),
          measurement: undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].desk ? submitMargin[0].desk : ['', '', '', ''],
          control: undefined !== submitMargin && undefined !== submitMargin[0] && submitMargin[0].control ? submitMargin[0].control : 'linked',
          onChange: value => saveSubmitMargin({
            desk: value
          }),
          onControl: value => saveSubmitMargin({
            control: value
          }),
          min: marginMin,
          max: marginMax,
          step: marginStep,
          allowEmpty: true
        });
      }
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
      className: tab.className,
      key: tab.className
    }, tabout);
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_13__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Submit aria description', 'kadence-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Provide more context for screen readers', 'kadence-blocks'),
    value: undefined !== submitLabel ? submitLabel : '',
    onChange: value => setAttributes({
      submitLabel: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.KadencePanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Container Settings', 'kadence-blocks'),
    initialOpen: false,
    panelName: 'kb-form-container-settings'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_4__.ResponsiveMeasurementControls, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Container Margin', 'kadence-blocks'),
    control: deskMarginControl,
    tabletControl: tabletMarginControl,
    mobileControl: mobileMarginControl,
    value: undefined !== containerMargin ? containerMargin : ['', '', '', ''],
    tabletValue: undefined !== tabletContainerMargin ? tabletContainerMargin : ['', '', '', ''],
    mobileValue: undefined !== mobileContainerMargin ? mobileContainerMargin : ['', '', '', ''],
    onChange: value => {
      setAttributes({
        containerMargin: value
      });
    },
    onChangeTablet: value => {
      setAttributes({
        tabletContainerMargin: value
      });
    },
    onChangeMobile: value => {
      setAttributes({
        mobileContainerMargin: value
      });
    },
    onChangeControl: value => setDeskMarginControl(value),
    onChangeTabletControl: value => setTabletMarginControl(value),
    onChangeMobileControl: value => setMobileMarginControl(value),
    allowEmpty: true,
    min: containerMarginMin,
    max: containerMarginMax,
    step: containerMarginStep,
    unit: containerMarginType,
    units: ['px', 'em', 'rem', '%', 'vh'],
    onUnit: value => setAttributes({
      containerMarginType: value
    })
  })), actions.includes('mailerlite') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_mailerlite_js__WEBPACK_IMPORTED_MODULE_5__["default"], {
    fields: fields,
    settings: mailerlite,
    save: value => saveMailerlite(value),
    saveMap: (value, i) => saveMailerliteMap(value, i)
  }), actions.includes('fluentCRM') && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_fluentcrm_js__WEBPACK_IMPORTED_MODULE_6__["default"], {
    fields: fields,
    settings: fluentcrm,
    save: value => saveFluentCRM(value),
    saveMap: (value, i) => saveFluentCRMMap(value, i)
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    id: `animate-id${uniqueID}`,
    className: `kb-form-wrap aos-animate${hAlign ? ' kb-form-align-' + hAlign : ''}`,
    "data-aos": kadenceAnimation ? kadenceAnimation : undefined,
    "data-aos-duration": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined,
    "data-aos-easing": kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined,
    style: {
      marginLeft: undefined !== previewContainerMarginLeft ? previewContainerMarginLeft + previewContainerMarginType : undefined,
      marginRight: undefined !== previewContainerMarginRight ? previewContainerMarginRight + previewContainerMarginType : undefined,
      marginTop: undefined !== previewContainerMarginTop ? previewContainerMarginTop + previewContainerMarginType : undefined,
      marginBottom: undefined !== previewContainerMarginBottom ? previewContainerMarginBottom + previewContainerMarginType : undefined
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    id: `kb-form-${uniqueID}`,
    className: 'kb-form',
    style: {
      marginRight: undefined !== style[0].gutter && '' !== style[0].gutter ? '-' + style[0].gutter / 2 + 'px' : undefined,
      marginLeft: undefined !== style[0].gutter && '' !== style[0].gutter ? '-' + style[0].gutter / 2 + 'px' : undefined
    }
  }, renderFieldOutput, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "kadence-blocks-form-field kb-submit-field",
    style: {
      width: submit[0].width[0] + '%',
      paddingRight: undefined !== style[0].gutter && '' !== style[0].gutter ? style[0].gutter / 2 + 'px' : undefined,
      paddingLeft: undefined !== style[0].gutter && '' !== style[0].gutter ? style[0].gutter / 2 + 'px' : undefined
    },
    tabIndex: "0",
    role: "button",
    onClick: () => deselectField,
    onFocus: () => deselectField,
    onKeyDown: () => deselectField
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_12__.RichText, {
    tagName: "div",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__.__)('Submit'),
    onFocus: () => deselectField,
    value: submit[0].label,
    onChange: value => {
      saveSubmit({
        label: value
      });
    },
    allowedFormats: (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_14__.applyFilters)('kadence.whitelist_richtext_formats', ['kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field']),
    className: `kb-forms-submit kb-button-size-${submit[0].size} kb-button-width-${submit[0].widthType}`,
    style: {
      background: undefined !== btnBG ? btnBG : undefined,
      color: undefined !== submit[0].color ? (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].color) : undefined,
      fontSize: previewSubmitFontSize + previewSubmitFontSizeType,
      lineHeight: previewSubmitLineHeight + previewSubmitLineHeightType,
      fontWeight: submitFont[0].weight,
      fontStyle: submitFont[0].style,
      letterSpacing: submitFont[0].letterSpacing + 'px',
      textTransform: submitFont[0].textTransform ? submitFont[0].textTransform : undefined,
      fontFamily: submitFont[0].family ? submitFont[0].family : '',
      borderRadius: undefined !== submit[0].borderRadius ? submit[0].borderRadius + 'px' : undefined,
      borderColor: undefined === submit[0].border ? undefined : (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(submit[0].border, submit[0].borderOpacity !== undefined ? submit[0].borderOpacity : 1),
      width: undefined !== submit[0].widthType && 'fixed' === submit[0].widthType && undefined !== submit[0].fixedWidth && undefined !== submit[0].fixedWidth[0] ? submit[0].fixedWidth[0] + 'px' : undefined,
      paddingTop: 'custom' === submit[0].size && '' !== submit[0].deskPadding[0] ? submit[0].deskPadding[0] + 'px' : undefined,
      paddingRight: 'custom' === submit[0].size && '' !== submit[0].deskPadding[1] ? submit[0].deskPadding[1] + 'px' : undefined,
      paddingBottom: 'custom' === submit[0].size && '' !== submit[0].deskPadding[2] ? submit[0].deskPadding[2] + 'px' : undefined,
      paddingLeft: 'custom' === submit[0].size && '' !== submit[0].deskPadding[3] ? submit[0].deskPadding[3] + 'px' : undefined,
      borderTopWidth: submit[0].borderWidth && '' !== submit[0].borderWidth[0] ? submit[0].borderWidth[0] + 'px' : undefined,
      borderRightWidth: submit[0].borderWidth && '' !== submit[0].borderWidth[1] ? submit[0].borderWidth[1] + 'px' : undefined,
      borderBottomWidth: submit[0].borderWidth && '' !== submit[0].borderWidth[2] ? submit[0].borderWidth[2] + 'px' : undefined,
      borderLeftWidth: submit[0].borderWidth && '' !== submit[0].borderWidth[3] ? submit[0].borderWidth[3] + 'px' : undefined,
      boxShadow: undefined !== submit[0].boxShadow && undefined !== submit[0].boxShadow[0] && submit[0].boxShadow[0] ? (undefined !== submit[0].boxShadow[7] && submit[0].boxShadow[7] ? 'inset ' : '') + (undefined !== submit[0].boxShadow[3] ? submit[0].boxShadow[3] : 1) + 'px ' + (undefined !== submit[0].boxShadow[4] ? submit[0].boxShadow[4] : 1) + 'px ' + (undefined !== submit[0].boxShadow[5] ? submit[0].boxShadow[5] : 2) + 'px ' + (undefined !== submit[0].boxShadow[6] ? submit[0].boxShadow[6] : 0) + 'px ' + (0,_kadence_helpers__WEBPACK_IMPORTED_MODULE_7__.KadenceColorOutput)(undefined !== submit[0].boxShadow[1] ? submit[0].boxShadow[1] : '#000000', undefined !== submit[0].boxShadow[2] ? submit[0].boxShadow[2] : 1) : undefined,
      marginTop: previewSubmitMarginTop + previewSubmitMarginType,
      marginRight: previewSubmitMarginRight + previewSubmitMarginType,
      marginBottom: previewSubmitMarginBottom + previewSubmitMarginType,
      marginLeft: previewSubmitMarginLeft + previewSubmitMarginType
    }
  })))));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KadenceForm);

/***/ }),

/***/ "./src/blocks/form/fluentcrm.js":
/*!**************************************!*\
  !*** ./src/blocks/form/fluentcrm.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);


/**
 * FluentCRM Controls
 *
 */

/* global kadence_blocks_params */

/**
 * Imports
 */

const {
  addQueryArgs
} = wp.url;
const {
  apiFetch
} = wp;

/**
 * Internal block libraries
 */


const {
  Component,
  Fragment
} = wp.element;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */

class FluentCRMControls extends Component {
  constructor(fields, settings, save) {
    super(...arguments);
    this.getLists = this.getLists.bind(this);
    this.getFields = this.getFields.bind(this);
    this.getTags = this.getTags.bind(this);
    this.state = {
      isActive: false,
      isSaving: false,
      list: false,
      listTags: false,
      isFetching: false,
      isFetchingTags: false,
      listsLoaded: false,
      isFetchingFields: false,
      listFields: false,
      listFieldsLoaded: false
    };
  }

  componentDidMount() {
    /**
     * Confirm active.
     */
    if (undefined !== kadence_blocks_params.fluentCRM && kadence_blocks_params.fluentCRM) {
      this.setState({
        isActive: true
      });
    }
  }

  getLists() {
    this.setState({
      isFetching: true
    });
    apiFetch({
      path: addQueryArgs('/kb-fluentcrm/v1/get', {
        endpoint: 'lists'
      })
    }).then(lists => {
      const theLists = [];
      lists.map(item => {
        theLists.push({
          value: item.id,
          label: item.title
        });
      });
      this.setState({
        list: theLists,
        listsLoaded: true,
        isFetching: false
      });
    }).catch(() => {
      this.setState({
        list: [],
        listsLoaded: true,
        isFetching: false
      });
    });
  }

  getTags() {
    this.setState({
      isFetchingTags: true
    });
    apiFetch({
      path: addQueryArgs('/kb-fluentcrm/v1/get', {
        endpoint: 'tags'
      })
    }).then(tags => {
      const theLists = [];
      tags.map(item => {
        theLists.push({
          value: item.id,
          label: item.title
        });
      });
      this.setState({
        listTags: theLists,
        tagsLoaded: true,
        isFetchingTags: false
      });
    }).catch(() => {
      this.setState({
        listTags: [],
        tagsLoaded: true,
        isFetchingTags: false
      });
    });
  }

  getFields() {
    this.setState({
      isFetchingFields: true
    });
    apiFetch({
      path: addQueryArgs('/kb-fluentcrm/v1/get', {
        endpoint: 'fields'
      })
    }).then(fields => {
      const theFields = [];
      theFields.push({
        value: null,
        label: 'None'
      });
      theFields.push({
        value: 'email',
        label: 'Email *'
      });
      fields.map((item, index) => {
        if (item.key !== 'email') {
          theFields.push({
            value: item.key,
            label: item.title
          });
        }
      });
      this.setState({
        listFields: theFields,
        listFieldsLoaded: true,
        isFetchingFields: false
      });
    }).catch(() => {
      const theFields = [];
      theFields.push({
        value: null,
        label: 'None'
      });
      theFields.push({
        value: 'email',
        label: 'Email *'
      });
      this.setState({
        listFields: theFields,
        listFieldsLoaded: true,
        isFetchingFields: false
      });
    });
  }

  render() {
    const {
      list,
      listsLoaded,
      isFetching,
      isActive,
      listFields,
      isFetchingFields,
      listFieldsLoaded,
      tagsLoaded,
      isFetchingTags,
      listTags
    } = this.state;
    const hasList = Array.isArray(list) && list.length;
    const hasFields = Array.isArray(this.state.listFields) && this.state.listFields.length;
    const hasTags = Array.isArray(this.state.listTags) && this.state.listTags.length;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('FluentCRM Settings', 'kadence-blocks-pro'),
      initialOpen: false,
      panelName: 'kb-fluent-crm-settings'
    }, !isActive && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('FluentCRM is not setup/active.', 'kadence-blocks-pro')), isActive && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, isFetching && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null), !isFetching && !hasList && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select List', 'kadence-blocks')), !listsLoaded ? this.getLists() : '', !Array.isArray(list) ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No lists found.', 'kadence-blocks-pro')), !isFetching && hasList && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kb-heading-fln-list-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select List', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
      value: undefined !== this.props.settings[0].lists ? this.props.settings[0].lists : '',
      onChange: value => {
        this.props.save({
          lists: value ? value : []
        });
      },
      id: 'fln-list-selection',
      options: list,
      isMulti: true,
      maxMenuHeight: 200,
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select List')
    }), !this.props.settings[0].lists && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        height: '100px'
      }
    }), undefined !== this.props.settings && undefined !== this.props.settings[0] && this.props.settings[0].lists && this.props.settings[0].lists[0] && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, isFetchingTags && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null), !isFetchingTags && !hasTags && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Tags', 'kadence-blocks')), !tagsLoaded ? this.getTags() : '', !Array.isArray(listTags) ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No Tags found.', 'kadence-blocks-pro')), !isFetchingTags && hasTags && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Tags', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_3__["default"], {
      value: undefined !== this.props.settings && undefined !== this.props.settings[0] && undefined !== this.props.settings[0].tags ? this.props.settings[0].tags : '',
      onChange: value => {
        this.props.save({
          tags: value ? value : []
        });
      },
      id: 'fln-tag-selection',
      isClearable: true,
      options: listTags,
      isMulti: true,
      maxMenuHeight: 200,
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Tags')
    })), isFetchingFields && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null), !isFetchingFields && !hasFields && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Map Fields', 'kadence-blocks')), !listFieldsLoaded ? this.getFields() : '', !Array.isArray(listFields) ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, null) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No Fields found.', 'kadence-blocks-pro')), !isFetchingFields && hasFields && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Map Fields', 'kadence-blocks')), this.props.fields && this.props.fields.map((item, index) => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: index,
        className: "kb-field-map-item"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kb-field-map-item-form"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "kb-field-map-item-label"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Form Field', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "kb-field-map-item-name"
      }, item.label)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Field:'),
        options: listFields,
        value: undefined !== this.props.settings[0].map && undefined !== this.props.settings[0].map[index] && this.props.settings[0].map[index] ? this.props.settings[0].map[index] : '',
        onChange: value => {
          this.props.saveMap(value, index);
        }
      }));
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        height: '10px'
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Require Double Opt In?', 'kadence-blocks'),
      checked: undefined !== this.props.settings && undefined !== this.props.settings[0] && undefined !== this.props.settings[0].doubleOptin ? this.props.settings[0].doubleOptin : false,
      onChange: value => this.props.save({
        doubleOptin: value
      })
    })))));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FluentCRMControls);

/***/ }),

/***/ "./src/blocks/form/mailerlite.js":
/*!***************************************!*\
  !*** ./src/blocks/form/mailerlite.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @kadence/components */ "@kadence/components");
/* harmony import */ var _kadence_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_kadence_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);


/**
 * Mailer Lite Controls
 *
 */

/**
 * Imports
 */

const {
  addQueryArgs
} = wp.url;
const {
  apiFetch
} = wp;

/**
 * Internal block libraries
 */


const {
  Component,
  Fragment
} = wp.element;

const RETRIEVE_API_URL = 'https://app.mailerlite.com/integrations/api/';
const HELP_URL = 'https://help.mailerlite.com/article/show/35040-where-can-i-find-the-api-key';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */

class MailerLiteControls extends Component {
  constructor(fields, settings, save) {
    super(...arguments);
    this.getMailerLiteGroup = this.getMailerLiteGroup.bind(this);
    this.getMailerLiteFields = this.getMailerLiteFields.bind(this);
    this.removeAPI = this.removeAPI.bind(this);
    this.saveAPI = this.saveAPI.bind(this);
    this.state = {
      api: '',
      isSavedAPI: false,
      isSaving: false,
      group: false,
      isFetching: false,
      groupsLoaded: false,
      isFetchingFields: false,
      groupFields: false,
      groupFieldsLoaded: false
    };
  }

  componentDidMount() {
    /**
     * Get settings
     */
    let settings;
    wp.api.loadPromise.then(() => {
      settings = new wp.api.models.Settings();
      settings.fetch().then(response => {
        this.setState({
          api: response.kadence_blocks_mailerlite_api
        });

        if ('' !== this.state.api) {
          this.setState({
            isSavedAPI: true
          });
        }
      });
    });
  }

  getMailerLiteGroup() {
    if (!this.state.api) {
      this.setState({
        group: [],
        groupsLoaded: true
      });
      return;
    }

    this.setState({
      isFetching: true
    });
    apiFetch({
      path: addQueryArgs('/kb-mailerlite/v1/get', {
        apikey: this.state.api,
        endpoint: 'groups',
        queryargs: ['limit=500']
      })
    }).then(groups => {
      const theGroups = [];
      groups.map(item => {
        theGroups.push({
          value: item.id,
          label: item.name
        });
      });
      this.setState({
        group: theGroups,
        groupsLoaded: true,
        isFetching: false
      });
    }).catch(() => {
      this.setState({
        group: [],
        groupsLoaded: true,
        isFetching: false
      });
    });
  }

  getMailerLiteFields() {
    if (!this.state.api) {
      const theFields = [];
      theFields.push({
        value: null,
        label: 'None'
      });
      theFields.push({
        value: 'email',
        label: 'Email *'
      });
      this.setState({
        groupFields: theFields,
        groupFieldsLoaded: true
      });
      return;
    }

    this.setState({
      isFetchingFields: true
    });
    apiFetch({
      path: addQueryArgs('/kb-mailerlite/v1/get', {
        apikey: this.state.api,
        endpoint: 'fields'
      })
    }).then(fields => {
      const theFields = [];
      theFields.push({
        value: null,
        label: 'None'
      });
      theFields.push({
        value: 'email',
        label: 'Email *'
      });
      fields.map((item, index) => {
        if (item.key !== 'email') {
          theFields.push({
            value: item.key,
            label: item.title
          });
        }
      });
      this.setState({
        groupFields: theFields,
        groupFieldsLoaded: true,
        isFetchingFields: false
      });
    }).catch(() => {
      const theFields = [];
      theFields.push({
        value: null,
        label: 'None'
      });
      theFields.push({
        value: 'email',
        label: 'Email *'
      });
      this.setState({
        groupFields: theFields,
        groupFieldsLoaded: true,
        isFetchingFields: false
      });
    });
  }

  removeAPI() {
    this.setState({
      api: ''
    });

    if (this.state.isSavedAPI) {
      this.setState({
        isSaving: true
      });
      const settingModel = new wp.api.models.Settings({
        kadence_blocks_mailerlite_api: ''
      });
      settingModel.save().then(() => {
        this.setState({
          isSavedAPI: false,
          isSaving: false
        });
      });
    }
  }

  saveAPI() {
    this.setState({
      isSaving: true
    });
    const settingModel = new wp.api.models.Settings({
      kadence_blocks_mailerlite_api: this.state.api
    });
    settingModel.save().then(response => {
      this.setState({
        isSaving: false,
        isSavedAPI: true
      });
    });
  }

  render() {
    const {
      group,
      groupsLoaded,
      isFetching,
      isSavedAPI,
      groupFields,
      isFetchingFields,
      groupFieldsLoaded
    } = this.state;
    const hasGroup = Array.isArray(group) && group.length;
    const hasFields = Array.isArray(this.state.groupFields) && this.state.groupFields.length;
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_kadence_components__WEBPACK_IMPORTED_MODULE_1__.KadencePanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('MailerLite Settings', 'kadence-blocks-pro'),
      initialOpen: false,
      panelName: 'kb-mailerlite-settings'
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ExternalLink, {
      href: RETRIEVE_API_URL
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Get API Key', 'kadence-blocks-pro')), "|\xA0", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ExternalLink, {
      href: HELP_URL
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Get help', 'kadence-blocks-pro')))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('API Key', 'kadence-blocks'),
      value: this.state.api,
      onChange: value => this.setState({
        api: value
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "components-base-control"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isPrimary: true,
      onClick: this.saveAPI,
      disabled: '' === this.state.api
    }, this.state.isSaving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Saving', 'kadence-blocks-pro') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Save', 'kadence-blocks-pro')), this.state.isSavedKey && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, "\xA0", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      isDefault: true,
      onClick: this.removeAPI
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove', 'kadence-blocks-pro')))), isSavedAPI && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, isFetching && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null), !isFetching && !hasGroup && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Group', 'kadence-blocks')), !groupsLoaded ? this.getMailerLiteGroup() : '', !Array.isArray(group) ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No group found.', 'kadence-blocks-pro')), !isFetching && hasGroup && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Group', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "mailerlite-select-form-row"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(react_select__WEBPACK_IMPORTED_MODULE_4__["default"], {
      value: group ? group.filter(_ref => {
        let {
          value
        } = _ref;
        return value.toString() === (undefined !== this.props.settings[0].group && this.props.settings[0].group[0] ? this.props.settings[0].group[0].toString() : '');
      }) : '',
      onChange: value => {
        this.props.save({
          group: value.value ? [value.value] : []
        });
      },
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select a Group', 'kadence-blocks'),
      maxMenuHeight: 300,
      options: group
    })), !this.props.settings[0].group && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        height: '100px'
      }
    }), this.props.settings[0].group && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, isFetchingFields && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null), !isFetchingFields && !hasFields && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Map Fields', 'kadence-blocks')), !groupFieldsLoaded ? this.getMailerLiteFields() : '', !Array.isArray(groupFields) ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No Fields found.', 'kadence-blocks-pro')), !isFetchingFields && hasFields && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "kt-heading-size-title"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Map Fields', 'kadence-blocks')), this.props.fields && this.props.fields.map((item, index) => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        key: index,
        className: "kb-field-map-item"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "kb-field-map-item-form"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "kb-field-map-item-label"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Form Field', 'kadence-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
        className: "kb-field-map-item-name"
      }, item.label)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select Field:'),
        options: groupFields,
        value: undefined !== this.props.settings[0].map && undefined !== this.props.settings[0].map[index] && this.props.settings[0].map[index] ? this.props.settings[0].map[index] : '',
        onChange: value => {
          this.props.saveMap(value, index);
        }
      }));
    }))))));
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MailerLiteControls);

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/create-emotion/dist/index.esm.js":
/*!*******************************************************!*\
  !*** ./node_modules/create-emotion/dist/index.esm.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_memoize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/memoize */ "./node_modules/@emotion/memoize/dist/memoize.esm.js");
/* harmony import */ var _emotion_unitless__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/unitless */ "./node_modules/@emotion/unitless/dist/unitless.esm.js");
/* harmony import */ var _emotion_hash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/hash */ "./node_modules/@emotion/hash/dist/hash.esm.js");
/* harmony import */ var _emotion_stylis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/stylis */ "./node_modules/@emotion/stylis/dist/stylis.esm.js");
/* harmony import */ var stylis_rule_sheet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! stylis-rule-sheet */ "./node_modules/stylis-rule-sheet/index.js");
/* harmony import */ var stylis_rule_sheet__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(stylis_rule_sheet__WEBPACK_IMPORTED_MODULE_4__);






var hyphenateRegex = /[A-Z]|^ms/g;
var processStyleName = (0,_emotion_memoize__WEBPACK_IMPORTED_MODULE_0__["default"])(function (styleName) {
  return styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});
var processStyleValue = function processStyleValue(key, value) {
  if (value == null || typeof value === 'boolean') {
    return '';
  }

  if (_emotion_unitless__WEBPACK_IMPORTED_MODULE_1__["default"][key] !== 1 && key.charCodeAt(1) !== 45 && // custom properties
  !isNaN(value) && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (true) {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    return oldProcessStyleValue(key, value);
  };
}

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'function':
        if (true) {
          console.error('Passing functions to cx is deprecated and will be removed in the next major version of Emotion.\n' + 'Please call the function before passing it to cx.');
        }

        toAdd = classnames([arg()]);
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};
var isBrowser = typeof document !== 'undefined';

/*

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance
- 'polyfills' on server side

// usage

import StyleSheet from 'glamor/lib/sheet'
let styleSheet = new StyleSheet()

styleSheet.inject()
- 'injects' the stylesheet into the page (or into memory if on server)

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function makeStyleTag(opts) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', opts.key || '');

  if (opts.nonce !== undefined) {
    tag.setAttribute('nonce', opts.nonce);
  }

  tag.appendChild(document.createTextNode('')) // $FlowFixMe
  ;
  (opts.container !== undefined ? opts.container : document.head).appendChild(tag);
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = "development" === 'production'; // the big drawback here is that the css won't be editable in devtools

    this.tags = [];
    this.ctr = 0;
    this.opts = options;
  }

  var _proto = StyleSheet.prototype;

  _proto.inject = function inject() {
    if (this.injected) {
      throw new Error('already injected!');
    }

    this.tags[0] = makeStyleTag(this.opts);
    this.injected = true;
  };

  _proto.speedy = function speedy(bool) {
    if (this.ctr !== 0) {
      // cannot change speedy mode after inserting any rule to sheet. Either call speedy(${bool}) earlier in your app, or call flush() before speedy(${bool})
      throw new Error("cannot change speedy now");
    }

    this.isSpeedy = !!bool;
  };

  _proto.insert = function insert(rule, sourceMap) {
    // this is the ultrafast version, works across browsers
    if (this.isSpeedy) {
      var tag = this.tags[this.tags.length - 1];
      var sheet = sheetForTag(tag);

      try {
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (true) {
          console.warn('illegal rule', rule); // eslint-disable-line no-console
        }
      }
    } else {
      var _tag = makeStyleTag(this.opts);

      this.tags.push(_tag);

      _tag.appendChild(document.createTextNode(rule + (sourceMap || '')));
    }

    this.ctr++;

    if (this.ctr % 65000 === 0) {
      this.tags.push(makeStyleTag(this.opts));
    }
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0; // todo - look for remnants in document.styleSheets

    this.injected = false;
  };

  return StyleSheet;
}();

function createEmotion(context, options) {
  if (context.__SECRET_EMOTION__ !== undefined) {
    return context.__SECRET_EMOTION__;
  }

  if (options === undefined) options = {};
  var key = options.key || 'css';

  if (true) {
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var current;

  function insertRule(rule) {
    current += rule;

    if (isBrowser) {
      sheet.insert(rule, currentSourceMap);
    }
  }

  var insertionPlugin = stylis_rule_sheet__WEBPACK_IMPORTED_MODULE_4___default()(insertRule);
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var caches = {
    registered: {},
    inserted: {},
    nonce: options.nonce,
    key: key
  };
  var sheet = new StyleSheet(options);

  if (isBrowser) {
    // 🚀
    sheet.inject();
  }

  var stylis = new _emotion_stylis__WEBPACK_IMPORTED_MODULE_3__["default"](stylisOptions);
  stylis.use(options.stylisPlugins)(insertionPlugin);
  var currentSourceMap = '';

  function handleInterpolation(interpolation, couldBeSelectorInterpolation) {
    if (interpolation == null) {
      return '';
    }

    switch (typeof interpolation) {
      case 'boolean':
        return '';

      case 'function':
        if (interpolation.__emotion_styles !== undefined) {
          var selector = interpolation.toString();

          if (selector === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          return selector;
        }

        if (this === undefined && "development" !== 'production') {
          console.error('Interpolating functions in css calls is deprecated and will be removed in the next major version of Emotion.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        return handleInterpolation.call(this, this === undefined ? interpolation() : // $FlowFixMe
        interpolation(this.mergedProps, this.context), couldBeSelectorInterpolation);

      case 'object':
        return createStringFromObject.call(this, interpolation);

      default:
        var cached = caches.registered[interpolation];
        return couldBeSelectorInterpolation === false && cached !== undefined ? cached : interpolation;
    }
  }

  var objectToStringCache = new WeakMap();

  function createStringFromObject(obj) {
    if (objectToStringCache.has(obj)) {
      // $FlowFixMe
      return objectToStringCache.get(obj);
    }

    var string = '';

    if (Array.isArray(obj)) {
      obj.forEach(function (interpolation) {
        string += handleInterpolation.call(this, interpolation, false);
      }, this);
    } else {
      Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] !== 'object') {
          if (caches.registered[obj[key]] !== undefined) {
            string += key + "{" + caches.registered[obj[key]] + "}";
          } else {
            string += processStyleName(key) + ":" + processStyleValue(key, obj[key]) + ";";
          }
        } else {
          if (key === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
            throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
          }

          if (Array.isArray(obj[key]) && typeof obj[key][0] === 'string' && caches.registered[obj[key][0]] === undefined) {
            obj[key].forEach(function (value) {
              string += processStyleName(key) + ":" + processStyleValue(key, value) + ";";
            });
          } else {
            string += key + "{" + handleInterpolation.call(this, obj[key], false) + "}";
          }
        }
      }, this);
    }

    objectToStringCache.set(obj, string);
    return string;
  }

  var name;
  var stylesWithLabel;
  var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;

  var createClassName = function createClassName(styles, identifierName) {
    return (0,_emotion_hash__WEBPACK_IMPORTED_MODULE_2__["default"])(styles + identifierName) + identifierName;
  };

  if (true) {
    var oldCreateClassName = createClassName;
    var sourceMappingUrlPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;

    createClassName = function createClassName(styles, identifierName) {
      return oldCreateClassName(styles.replace(sourceMappingUrlPattern, function (sourceMap) {
        currentSourceMap = sourceMap;
        return '';
      }), identifierName);
    };
  }

  var createStyles = function createStyles(strings) {
    var stringMode = true;
    var styles = '';
    var identifierName = '';

    if (strings == null || strings.raw === undefined) {
      stringMode = false;
      styles += handleInterpolation.call(this, strings, false);
    } else {
      styles += strings[0];
    }

    for (var _len = arguments.length, interpolations = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    interpolations.forEach(function (interpolation, i) {
      styles += handleInterpolation.call(this, interpolation, styles.charCodeAt(styles.length - 1) === 46 // .
      );

      if (stringMode === true && strings[i + 1] !== undefined) {
        styles += strings[i + 1];
      }
    }, this);
    stylesWithLabel = styles;
    styles = styles.replace(labelPattern, function (match, p1) {
      identifierName += "-" + p1;
      return '';
    });
    name = createClassName(styles, identifierName);
    return styles;
  };

  if (true) {
    var oldStylis = stylis;

    stylis = function stylis(selector, styles) {
      oldStylis(selector, styles);
      currentSourceMap = '';
    };
  }

  function insert(scope, styles) {
    if (caches.inserted[name] === undefined) {
      current = '';
      stylis(scope, styles);
      caches.inserted[name] = current;
    }
  }

  var css = function css() {
    var styles = createStyles.apply(this, arguments);
    var selector = key + "-" + name;

    if (caches.registered[selector] === undefined) {
      caches.registered[selector] = stylesWithLabel;
    }

    insert("." + selector, styles);
    return selector;
  };

  var keyframes = function keyframes() {
    var styles = createStyles.apply(this, arguments);
    var animation = "animation-" + name;
    insert('', "@keyframes " + animation + "{" + styles + "}");
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    var styles = createStyles.apply(this, arguments);
    insert('', styles);
  };

  function getRegisteredStyles(registeredStyles, classNames) {
    var rawClassName = '';
    classNames.split(' ').forEach(function (className) {
      if (caches.registered[className] !== undefined) {
        registeredStyles.push(className);
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }

  function merge(className, sourceMap) {
    var registeredStyles = [];
    var rawClassName = getRegisteredStyles(registeredStyles, className);

    if (registeredStyles.length < 2) {
      return className;
    }

    return rawClassName + css(registeredStyles, sourceMap);
  }

  function cx() {
    for (var _len2 = arguments.length, classNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      classNames[_key2] = arguments[_key2];
    }

    return merge(classnames(classNames));
  }

  function hydrateSingleId(id) {
    caches.inserted[id] = true;
  }

  function hydrate(ids) {
    ids.forEach(hydrateSingleId);
  }

  function flush() {
    if (isBrowser) {
      sheet.flush();
      sheet.inject();
    }

    caches.inserted = {};
    caches.registered = {};
  }

  if (isBrowser) {
    var chunks = document.querySelectorAll("[data-emotion-" + key + "]");
    Array.prototype.forEach.call(chunks, function (node) {
      // $FlowFixMe
      sheet.tags[0].parentNode.insertBefore(node, sheet.tags[0]); // $FlowFixMe

      node.getAttribute("data-emotion-" + key).split(' ').forEach(hydrateSingleId);
    });
  }

  var emotion = {
    flush: flush,
    hydrate: hydrate,
    cx: cx,
    merge: merge,
    getRegisteredStyles: getRegisteredStyles,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    css: css,
    sheet: sheet,
    caches: caches
  };
  context.__SECRET_EMOTION__ = emotion;
  return emotion;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createEmotion);


/***/ }),

/***/ "./node_modules/dom-helpers/class/addClass.js":
/*!****************************************************!*\
  !*** ./node_modules/dom-helpers/class/addClass.js ***!
  \****************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports["default"] = addClass;

var _hasClass = _interopRequireDefault(__webpack_require__(/*! ./hasClass */ "./node_modules/dom-helpers/class/hasClass.js"));

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!(0, _hasClass.default)(element, className)) if (typeof element.className === 'string') element.className = element.className + ' ' + className;else element.setAttribute('class', (element.className && element.className.baseVal || '') + ' ' + className);
}

module.exports = exports["default"];

/***/ }),

/***/ "./node_modules/dom-helpers/class/hasClass.js":
/*!****************************************************!*\
  !*** ./node_modules/dom-helpers/class/hasClass.js ***!
  \****************************************************/
/***/ ((module, exports) => {

"use strict";


exports.__esModule = true;
exports["default"] = hasClass;

function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}

module.exports = exports["default"];

/***/ }),

/***/ "./node_modules/dom-helpers/class/removeClass.js":
/*!*******************************************************!*\
  !*** ./node_modules/dom-helpers/class/removeClass.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp('(^|\\s)' + classToRemove + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}

module.exports = function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else if (typeof element.className === 'string') element.className = replaceClassName(element.className, className);else element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className));
};

/***/ }),

/***/ "./node_modules/emotion/dist/index.esm.js":
/*!************************************************!*\
  !*** ./node_modules/emotion/dist/index.esm.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "caches": () => (/* binding */ caches),
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "cx": () => (/* binding */ cx),
/* harmony export */   "flush": () => (/* binding */ flush),
/* harmony export */   "getRegisteredStyles": () => (/* binding */ getRegisteredStyles),
/* harmony export */   "hydrate": () => (/* binding */ hydrate),
/* harmony export */   "injectGlobal": () => (/* binding */ injectGlobal),
/* harmony export */   "keyframes": () => (/* binding */ keyframes),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "sheet": () => (/* binding */ sheet)
/* harmony export */ });
/* harmony import */ var create_emotion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! create-emotion */ "./node_modules/create-emotion/dist/index.esm.js");


var context = typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : {};

var _createEmotion = (0,create_emotion__WEBPACK_IMPORTED_MODULE_0__["default"])(context),
    flush = _createEmotion.flush,
    hydrate = _createEmotion.hydrate,
    cx = _createEmotion.cx,
    merge = _createEmotion.merge,
    getRegisteredStyles = _createEmotion.getRegisteredStyles,
    injectGlobal = _createEmotion.injectGlobal,
    keyframes = _createEmotion.keyframes,
    css = _createEmotion.css,
    sheet = _createEmotion.sheet,
    caches = _createEmotion.caches;




/***/ }),

/***/ "./node_modules/memoize-one/dist/memoize-one.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (memoizeOne);


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/performance-now/lib/performance-now.js":
/*!*************************************************************!*\
  !*** ./node_modules/performance-now/lib/performance-now.js ***!
  \*************************************************************/
/***/ (function(module) {

// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

//# sourceMappingURL=performance-now.js.map


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/raf/index.js":
/*!***********************************!*\
  !*** ./node_modules/raf/index.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var now = __webpack_require__(/*! performance-now */ "./node_modules/performance-now/lib/performance-now.js")
  , root = typeof window === 'undefined' ? __webpack_require__.g : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}


/***/ }),

/***/ "./node_modules/react-input-autosize/lib/AutosizeInput.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-input-autosize/lib/AutosizeInput.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
	value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sizerStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	visibility: 'hidden',
	height: 0,
	overflow: 'scroll',
	whiteSpace: 'pre'
};

var INPUT_PROPS_BLACKLIST = ['extraWidth', 'injectStyles', 'inputClassName', 'inputRef', 'inputStyle', 'minWidth', 'onAutosize', 'placeholderIsMinWidth'];

var cleanInputProps = function cleanInputProps(inputProps) {
	INPUT_PROPS_BLACKLIST.forEach(function (field) {
		return delete inputProps[field];
	});
	return inputProps;
};

var copyStyles = function copyStyles(styles, node) {
	node.style.fontSize = styles.fontSize;
	node.style.fontFamily = styles.fontFamily;
	node.style.fontWeight = styles.fontWeight;
	node.style.fontStyle = styles.fontStyle;
	node.style.letterSpacing = styles.letterSpacing;
	node.style.textTransform = styles.textTransform;
};

var isIE = typeof window !== 'undefined' && window.navigator ? /MSIE |Trident\/|Edge\//.test(window.navigator.userAgent) : false;

var generateId = function generateId() {
	// we only need an auto-generated ID for stylesheet injection, which is only
	// used for IE. so if the browser is not IE, this should return undefined.
	return isIE ? '_' + Math.random().toString(36).substr(2, 12) : undefined;
};

var AutosizeInput = function (_Component) {
	_inherits(AutosizeInput, _Component);

	function AutosizeInput(props) {
		_classCallCheck(this, AutosizeInput);

		var _this = _possibleConstructorReturn(this, (AutosizeInput.__proto__ || Object.getPrototypeOf(AutosizeInput)).call(this, props));

		_this.inputRef = function (el) {
			_this.input = el;
			if (typeof _this.props.inputRef === 'function') {
				_this.props.inputRef(el);
			}
		};

		_this.placeHolderSizerRef = function (el) {
			_this.placeHolderSizer = el;
		};

		_this.sizerRef = function (el) {
			_this.sizer = el;
		};

		_this.state = {
			inputWidth: props.minWidth,
			inputId: props.id || generateId()
		};
		return _this;
	}

	_createClass(AutosizeInput, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.mounted = true;
			this.copyInputStyles();
			this.updateInputWidth();
		}
	}, {
		key: 'UNSAFE_componentWillReceiveProps',
		value: function UNSAFE_componentWillReceiveProps(nextProps) {
			var id = nextProps.id;

			if (id !== this.props.id) {
				this.setState({ inputId: id || generateId() });
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			if (prevState.inputWidth !== this.state.inputWidth) {
				if (typeof this.props.onAutosize === 'function') {
					this.props.onAutosize(this.state.inputWidth);
				}
			}
			this.updateInputWidth();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.mounted = false;
		}
	}, {
		key: 'copyInputStyles',
		value: function copyInputStyles() {
			if (!this.mounted || !window.getComputedStyle) {
				return;
			}
			var inputStyles = this.input && window.getComputedStyle(this.input);
			if (!inputStyles) {
				return;
			}
			copyStyles(inputStyles, this.sizer);
			if (this.placeHolderSizer) {
				copyStyles(inputStyles, this.placeHolderSizer);
			}
		}
	}, {
		key: 'updateInputWidth',
		value: function updateInputWidth() {
			if (!this.mounted || !this.sizer || typeof this.sizer.scrollWidth === 'undefined') {
				return;
			}
			var newInputWidth = void 0;
			if (this.props.placeholder && (!this.props.value || this.props.value && this.props.placeholderIsMinWidth)) {
				newInputWidth = Math.max(this.sizer.scrollWidth, this.placeHolderSizer.scrollWidth) + 2;
			} else {
				newInputWidth = this.sizer.scrollWidth + 2;
			}
			// add extraWidth to the detected width. for number types, this defaults to 16 to allow for the stepper UI
			var extraWidth = this.props.type === 'number' && this.props.extraWidth === undefined ? 16 : parseInt(this.props.extraWidth) || 0;
			newInputWidth += extraWidth;
			if (newInputWidth < this.props.minWidth) {
				newInputWidth = this.props.minWidth;
			}
			if (newInputWidth !== this.state.inputWidth) {
				this.setState({
					inputWidth: newInputWidth
				});
			}
		}
	}, {
		key: 'getInput',
		value: function getInput() {
			return this.input;
		}
	}, {
		key: 'focus',
		value: function focus() {
			this.input.focus();
		}
	}, {
		key: 'blur',
		value: function blur() {
			this.input.blur();
		}
	}, {
		key: 'select',
		value: function select() {
			this.input.select();
		}
	}, {
		key: 'renderStyles',
		value: function renderStyles() {
			// this method injects styles to hide IE's clear indicator, which messes
			// with input size detection. the stylesheet is only injected when the
			// browser is IE, and can also be disabled by the `injectStyles` prop.
			var injectStyles = this.props.injectStyles;

			return isIE && injectStyles ? _react2.default.createElement('style', { dangerouslySetInnerHTML: {
					__html: 'input#' + this.state.inputId + '::-ms-clear {display: none;}'
				} }) : null;
		}
	}, {
		key: 'render',
		value: function render() {
			var sizerValue = [this.props.defaultValue, this.props.value, ''].reduce(function (previousValue, currentValue) {
				if (previousValue !== null && previousValue !== undefined) {
					return previousValue;
				}
				return currentValue;
			});

			var wrapperStyle = _extends({}, this.props.style);
			if (!wrapperStyle.display) wrapperStyle.display = 'inline-block';

			var inputStyle = _extends({
				boxSizing: 'content-box',
				width: this.state.inputWidth + 'px'
			}, this.props.inputStyle);

			var inputProps = _objectWithoutProperties(this.props, []);

			cleanInputProps(inputProps);
			inputProps.className = this.props.inputClassName;
			inputProps.id = this.state.inputId;
			inputProps.style = inputStyle;

			return _react2.default.createElement(
				'div',
				{ className: this.props.className, style: wrapperStyle },
				this.renderStyles(),
				_react2.default.createElement('input', _extends({}, inputProps, { ref: this.inputRef })),
				_react2.default.createElement(
					'div',
					{ ref: this.sizerRef, style: sizerStyle },
					sizerValue
				),
				this.props.placeholder ? _react2.default.createElement(
					'div',
					{ ref: this.placeHolderSizerRef, style: sizerStyle },
					this.props.placeholder
				) : null
			);
		}
	}]);

	return AutosizeInput;
}(_react.Component);

AutosizeInput.propTypes = {
	className: _propTypes2.default.string, // className for the outer element
	defaultValue: _propTypes2.default.any, // default field value
	extraWidth: _propTypes2.default.oneOfType([// additional width for input element
	_propTypes2.default.number, _propTypes2.default.string]),
	id: _propTypes2.default.string, // id to use for the input, can be set for consistent snapshots
	injectStyles: _propTypes2.default.bool, // inject the custom stylesheet to hide clear UI, defaults to true
	inputClassName: _propTypes2.default.string, // className for the input element
	inputRef: _propTypes2.default.func, // ref callback for the input element
	inputStyle: _propTypes2.default.object, // css styles for the input element
	minWidth: _propTypes2.default.oneOfType([// minimum width for input element
	_propTypes2.default.number, _propTypes2.default.string]),
	onAutosize: _propTypes2.default.func, // onAutosize handler: function(newWidth) {}
	onChange: _propTypes2.default.func, // onChange handler: function(event) {}
	placeholder: _propTypes2.default.string, // placeholder text
	placeholderIsMinWidth: _propTypes2.default.bool, // don't collapse size to less than the placeholder
	style: _propTypes2.default.object, // css styles for the outer element
	value: _propTypes2.default.any // field value
};
AutosizeInput.defaultProps = {
	minWidth: 1,
	injectStyles: true
};

exports["default"] = AutosizeInput;

/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js":
/*!****************************************************************************!*\
  !*** ./node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "polyfill": () => (/* binding */ polyfill)
/* harmony export */ });
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function componentWillMount() {
  // Call this.constructor.gDSFP to support sub-classes.
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
  if (state !== null && state !== undefined) {
    this.setState(state);
  }
}

function componentWillReceiveProps(nextProps) {
  // Call this.constructor.gDSFP to support sub-classes.
  // Use the setState() updater to ensure state isn't stale in certain edge cases.
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
    return state !== null && state !== undefined ? state : null;
  }
  // Binding "this" is important for shallow renderer support.
  this.setState(updater.bind(this));
}

function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props;
    var prevState = this.state;
    this.props = nextProps;
    this.state = nextState;
    this.__reactInternalSnapshotFlag = true;
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    );
  } finally {
    this.props = prevProps;
    this.state = prevState;
  }
}

// React may warn about cWM/cWRP/cWU methods being deprecated.
// Add a flag to suppress these warnings for this special case.
componentWillMount.__suppressDeprecationWarning = true;
componentWillReceiveProps.__suppressDeprecationWarning = true;
componentWillUpdate.__suppressDeprecationWarning = true;

function polyfill(Component) {
  var prototype = Component.prototype;

  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components');
  }

  if (
    typeof Component.getDerivedStateFromProps !== 'function' &&
    typeof prototype.getSnapshotBeforeUpdate !== 'function'
  ) {
    return Component;
  }

  // If new component APIs are defined, "unsafe" lifecycles won't be called.
  // Error if any of these lifecycles are present,
  // Because they would work differently between older and newer (16.3+) versions of React.
  var foundWillMountName = null;
  var foundWillReceivePropsName = null;
  var foundWillUpdateName = null;
  if (typeof prototype.componentWillMount === 'function') {
    foundWillMountName = 'componentWillMount';
  } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
    foundWillMountName = 'UNSAFE_componentWillMount';
  }
  if (typeof prototype.componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'componentWillReceiveProps';
  } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
  }
  if (typeof prototype.componentWillUpdate === 'function') {
    foundWillUpdateName = 'componentWillUpdate';
  } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
    foundWillUpdateName = 'UNSAFE_componentWillUpdate';
  }
  if (
    foundWillMountName !== null ||
    foundWillReceivePropsName !== null ||
    foundWillUpdateName !== null
  ) {
    var componentName = Component.displayName || Component.name;
    var newApiName =
      typeof Component.getDerivedStateFromProps === 'function'
        ? 'getDerivedStateFromProps()'
        : 'getSnapshotBeforeUpdate()';

    throw Error(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        componentName +
        ' uses ' +
        newApiName +
        ' but also contains the following legacy lifecycles:' +
        (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
        (foundWillReceivePropsName !== null
          ? '\n  ' + foundWillReceivePropsName
          : '') +
        (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
        '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks'
    );
  }

  // React <= 16.2 does not support static getDerivedStateFromProps.
  // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
  // Newer versions of React will ignore these lifecycles if gDSFP exists.
  if (typeof Component.getDerivedStateFromProps === 'function') {
    prototype.componentWillMount = componentWillMount;
    prototype.componentWillReceiveProps = componentWillReceiveProps;
  }

  // React <= 16.2 does not support getSnapshotBeforeUpdate.
  // As a workaround, use cWU to invoke the new lifecycle.
  // Newer versions of React will ignore that lifecycle if gSBU exists.
  if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
    if (typeof prototype.componentDidUpdate !== 'function') {
      throw new Error(
        'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
      );
    }

    prototype.componentWillUpdate = componentWillUpdate;

    var componentDidUpdate = prototype.componentDidUpdate;

    prototype.componentDidUpdate = function componentDidUpdatePolyfill(
      prevProps,
      prevState,
      maybeSnapshot
    ) {
      // 16.3+ will not execute our will-update method;
      // It will pass a snapshot value to did-update though.
      // Older versions will require our polyfilled will-update value.
      // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
      // Because for <= 15.x versions this might be a "prevContext" object.
      // We also can't just check "__reactInternalSnapshot",
      // Because get-snapshot might return a falsy value.
      // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
      var snapshot = this.__reactInternalSnapshotFlag
        ? this.__reactInternalSnapshot
        : maybeSnapshot;

      componentDidUpdate.call(this, prevProps, prevState, snapshot);
    };
  }

  return Component;
}




/***/ }),

/***/ "./node_modules/react-select/dist/react-select.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/react-select/dist/react-select.esm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Async": () => (/* binding */ Async),
/* harmony export */   "AsyncCreatable": () => (/* binding */ AsyncCreatable),
/* harmony export */   "Creatable": () => (/* binding */ Creatable),
/* harmony export */   "SelectBase": () => (/* binding */ Select),
/* harmony export */   "components": () => (/* binding */ components),
/* harmony export */   "createFilter": () => (/* binding */ createFilter),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "defaultTheme": () => (/* binding */ defaultTheme),
/* harmony export */   "makeAnimated": () => (/* binding */ index),
/* harmony export */   "makeAsyncSelect": () => (/* binding */ makeAsyncSelect),
/* harmony export */   "makeCreatableSelect": () => (/* binding */ makeCreatableSelect),
/* harmony export */   "mergeStyles": () => (/* binding */ mergeStyles)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var memoize_one__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");
/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! emotion */ "./node_modules/emotion/dist/index.esm.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var raf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! raf */ "./node_modules/raf/index.js");
/* harmony import */ var raf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(raf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_input_autosize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-input-autosize */ "./node_modules/react-input-autosize/lib/AutosizeInput.js");
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-transition-group */ "./node_modules/react-transition-group/index.js");
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_transition_group__WEBPACK_IMPORTED_MODULE_7__);









function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// ==============================
// NO OP
// ==============================
var noop = function noop() {};
// Class Name Prefixer
// ==============================

/**
 String representation of component state for styling with class names.

 Expects an array of strings OR a string/object pair:
 - className(['comp', 'comp-arg', 'comp-arg-2'])
   @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 - className('comp', { some: true, state: false })
   @returns 'react-select__comp react-select__comp--some'
*/

function applyPrefixToName(prefix, name) {
  if (!name) {
    return prefix;
  } else if (name[0] === '-') {
    return prefix + name;
  } else {
    return prefix + '__' + name;
  }
}

function classNames(prefix, cssKey, state, className) {
  var arr = [cssKey, className];

  if (state && prefix) {
    for (var key in state) {
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push("".concat(applyPrefixToName(prefix, key)));
      }
    }
  }

  return arr.filter(function (i) {
    return i;
  }).map(function (i) {
    return String(i).trim();
  }).join(' ');
} // ==============================
// Clean Value
// ==============================

var cleanValue = function cleanValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (_typeof(value) === 'object' && value !== null) return [value];
  return [];
}; // ==============================
// Handle Input Change
// ==============================

function handleInputChange(inputValue, actionMeta, onInputChange) {
  if (onInputChange) {
    var newValue = onInputChange(inputValue, actionMeta);
    if (typeof newValue === 'string') return newValue;
  }

  return inputValue;
} // ==============================
// Scroll Helpers
// ==============================

function isDocumentElement(el) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
} // Normalized Scroll Top
// ------------------------------

function getScrollTop(el) {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }

  return el.scrollTop;
}
function scrollTo(el, top) {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
} // Get Scroll Parent
// ------------------------------

function getScrollParent(element) {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRx = /(auto|scroll)/;
  var docEl = document.documentElement; // suck it, flow...

  if (style.position === 'fixed') return docEl;

  for (var parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);

    if (excludeStaticParent && style.position === 'static') {
      continue;
    }

    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  return docEl;
} // Animated Scroll To
// ------------------------------

/**
  @param t: time (elapsed)
  @param b: initial value
  @param c: amount of change
  @param d: duration
*/

function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

function animatedScrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  var start = getScrollTop(element);
  var change = to - start;
  var increment = 10;
  var currentTime = 0;

  function animateScroll() {
    currentTime += increment;
    var val = easeOutCubic(currentTime, start, change, duration);
    scrollTo(element, val);

    if (currentTime < duration) {
      raf__WEBPACK_IMPORTED_MODULE_3___default()(animateScroll);
    } else {
      callback(element);
    }
  }

  animateScroll();
} // Scroll Into View
// ------------------------------

function scrollIntoView(menuEl, focusedEl) {
  var menuRect = menuEl.getBoundingClientRect();
  var focusedRect = focusedEl.getBoundingClientRect();
  var overScroll = focusedEl.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(menuEl, Math.min(focusedEl.offsetTop + focusedEl.clientHeight - menuEl.offsetHeight + overScroll, menuEl.scrollHeight));
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0));
  }
} // ==============================
// Get bounding client object
// ==============================
// cannot get keys using array notation with DOMRect

function getBoundingClientObj(element) {
  var rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width
  };
}
// Touch Capability Detector
// ==============================

function isTouchCapable() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
} // ==============================
// Mobile Device Detector
// ==============================

function isMobileDevice() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
}

function getMenuPlacement(_ref) {
  var maxHeight = _ref.maxHeight,
      menuEl = _ref.menuEl,
      minHeight = _ref.minHeight,
      placement = _ref.placement,
      shouldScroll = _ref.shouldScroll,
      isFixedPosition = _ref.isFixedPosition,
      theme = _ref.theme;
  var spacing = theme.spacing;
  var scrollParent = getScrollParent(menuEl);
  var defaultState = {
    placement: 'bottom',
    maxHeight: maxHeight
  }; // something went wrong, return default state

  if (!menuEl || !menuEl.offsetParent) return defaultState; // we can't trust `scrollParent.scrollHeight` --> it may increase when
  // the menu is rendered

  var _scrollParent$getBoun = scrollParent.getBoundingClientRect(),
      scrollHeight = _scrollParent$getBoun.height;

  var _menuEl$getBoundingCl = menuEl.getBoundingClientRect(),
      menuBottom = _menuEl$getBoundingCl.bottom,
      menuHeight = _menuEl$getBoundingCl.height,
      menuTop = _menuEl$getBoundingCl.top;

  var _menuEl$offsetParent$ = menuEl.offsetParent.getBoundingClientRect(),
      containerTop = _menuEl$offsetParent$.top;

  var viewHeight = window.innerHeight;
  var scrollTop = getScrollTop(scrollParent);
  var marginBottom = parseInt(getComputedStyle(menuEl).marginBottom, 10);
  var marginTop = parseInt(getComputedStyle(menuEl).marginTop, 10);
  var viewSpaceAbove = containerTop - marginTop;
  var viewSpaceBelow = viewHeight - menuTop;
  var scrollSpaceAbove = viewSpaceAbove + scrollTop;
  var scrollSpaceBelow = scrollHeight - scrollTop - menuTop;
  var scrollDown = menuBottom - viewHeight + scrollTop + marginBottom;
  var scrollUp = scrollTop + menuTop - marginTop;
  var scrollDuration = 160;

  switch (placement) {
    case 'auto':
    case 'bottom':
      // 1: the menu will fit, do nothing
      if (viewSpaceBelow >= menuHeight) {
        return {
          placement: 'bottom',
          maxHeight: maxHeight
        };
      } // 2: the menu will fit, if scrolled


      if (scrollSpaceBelow >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }

        return {
          placement: 'bottom',
          maxHeight: maxHeight
        };
      } // 3: the menu will fit, if constrained


      if (!isFixedPosition && scrollSpaceBelow >= minHeight || isFixedPosition && viewSpaceBelow >= minHeight) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        } // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.


        var constrainedHeight = isFixedPosition ? viewSpaceBelow - marginBottom : scrollSpaceBelow - marginBottom;
        return {
          placement: 'bottom',
          maxHeight: constrainedHeight
        };
      } // 4. Forked beviour when there isn't enough space below
      // AUTO: flip the menu, render above


      if (placement === 'auto' || isFixedPosition) {
        // may need to be constrained after flipping
        var _constrainedHeight = maxHeight;
        var spaceAbove = isFixedPosition ? viewSpaceAbove : scrollSpaceAbove;

        if (spaceAbove >= minHeight) {
          _constrainedHeight = Math.min(spaceAbove - marginBottom - spacing.controlHeight, maxHeight);
        }

        return {
          placement: 'top',
          maxHeight: _constrainedHeight
        };
      } // BOTTOM: allow browser to increase scrollable area and immediately set scroll


      if (placement === 'bottom') {
        scrollTo(scrollParent, scrollDown);
        return {
          placement: 'bottom',
          maxHeight: maxHeight
        };
      }

      break;

    case 'top':
      // 1: the menu will fit, do nothing
      if (viewSpaceAbove >= menuHeight) {
        return {
          placement: 'top',
          maxHeight: maxHeight
        };
      } // 2: the menu will fit, if scrolled


      if (scrollSpaceAbove >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }

        return {
          placement: 'top',
          maxHeight: maxHeight
        };
      } // 3: the menu will fit, if constrained


      if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
        var _constrainedHeight2 = maxHeight; // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.

        if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
          _constrainedHeight2 = isFixedPosition ? viewSpaceAbove - marginTop : scrollSpaceAbove - marginTop;
        }

        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }

        return {
          placement: 'top',
          maxHeight: _constrainedHeight2
        };
      } // 4. not enough space, the browser WILL NOT increase scrollable area when
      // absolutely positioned element rendered above the viewport (only below).
      // Flip the menu, render below


      return {
        placement: 'bottom',
        maxHeight: maxHeight
      };

    default:
      throw new Error("Invalid placement provided \"".concat(placement, "\"."));
  } // fulfil contract with flow: implicit return value of undefined


  return defaultState;
} // Menu Component
// ------------------------------

function alignToControl(placement) {
  var placementToCSSProp = {
    bottom: 'top',
    top: 'bottom'
  };
  return placement ? placementToCSSProp[placement] : 'bottom';
}

var coercePlacement = function coercePlacement(p) {
  return p === 'auto' ? 'bottom' : p;
};

var menuCSS = function menuCSS(_ref2) {
  var _ref3;

  var placement = _ref2.placement,
      _ref2$theme = _ref2.theme,
      borderRadius = _ref2$theme.borderRadius,
      spacing = _ref2$theme.spacing,
      colors = _ref2$theme.colors;
  return _ref3 = {
    label: 'menu'
  }, _defineProperty(_ref3, alignToControl(placement), '100%'), _defineProperty(_ref3, "backgroundColor", colors.neutral0), _defineProperty(_ref3, "borderRadius", borderRadius), _defineProperty(_ref3, "boxShadow", '0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)'), _defineProperty(_ref3, "marginBottom", spacing.menuGutter), _defineProperty(_ref3, "marginTop", spacing.menuGutter), _defineProperty(_ref3, "position", 'absolute'), _defineProperty(_ref3, "width", '100%'), _defineProperty(_ref3, "zIndex", 1), _ref3;
}; // NOTE: internal only

var MenuPlacer =
/*#__PURE__*/
function (_Component) {
  _inherits(MenuPlacer, _Component);

  function MenuPlacer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MenuPlacer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MenuPlacer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      maxHeight: _this.props.maxMenuHeight,
      placement: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getPlacement", function (ref) {
      var _this$props = _this.props,
          minMenuHeight = _this$props.minMenuHeight,
          maxMenuHeight = _this$props.maxMenuHeight,
          menuPlacement = _this$props.menuPlacement,
          menuPosition = _this$props.menuPosition,
          menuShouldScrollIntoView = _this$props.menuShouldScrollIntoView,
          theme = _this$props.theme;
      var getPortalPlacement = _this.context.getPortalPlacement;
      if (!ref) return; // DO NOT scroll if position is fixed

      var isFixedPosition = menuPosition === 'fixed';
      var shouldScroll = menuShouldScrollIntoView && !isFixedPosition;
      var state = getMenuPlacement({
        maxHeight: maxMenuHeight,
        menuEl: ref,
        minHeight: minMenuHeight,
        placement: menuPlacement,
        shouldScroll: shouldScroll,
        isFixedPosition: isFixedPosition,
        theme: theme
      });
      if (getPortalPlacement) getPortalPlacement(state);

      _this.setState(state);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getUpdatedProps", function () {
      var menuPlacement = _this.props.menuPlacement;
      var placement = _this.state.placement || coercePlacement(menuPlacement);
      return _objectSpread({}, _this.props, {
        placement: placement,
        maxHeight: _this.state.maxHeight
      });
    });

    return _this;
  }

  _createClass(MenuPlacer, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children({
        ref: this.getPlacement,
        placerProps: this.getUpdatedProps()
      });
    }
  }]);

  return MenuPlacer;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

_defineProperty(MenuPlacer, "contextTypes", {
  getPortalPlacement: (prop_types__WEBPACK_IMPORTED_MODULE_5___default().func)
});

var Menu = function Menu(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerRef = props.innerRef,
      innerProps = props.innerProps;
  var cn = cx(
  /*#__PURE__*/
  (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('menu', props)), {
    menu: true
  }, className);
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cn
  }, innerProps, {
    ref: innerRef
  }), children);
};
// Menu List
// ==============================

var menuListCSS = function menuListCSS(_ref4) {
  var maxHeight = _ref4.maxHeight,
      baseUnit = _ref4.theme.spacing.baseUnit;
  return {
    maxHeight: maxHeight,
    overflowY: 'auto',
    paddingBottom: baseUnit,
    paddingTop: baseUnit,
    position: 'relative',
    // required for offset[Height, Top] > keyboard scroll
    WebkitOverflowScrolling: 'touch'
  };
};
var MenuList = function MenuList(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isMulti = props.isMulti,
      innerRef = props.innerRef;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('menuList', props)), {
      'menu-list': true,
      'menu-list--is-multi': isMulti
    }, className),
    ref: innerRef
  }, children);
}; // ==============================
// Menu Notices
// ==============================

var noticeCSS = function noticeCSS(_ref5) {
  var _ref5$theme = _ref5.theme,
      baseUnit = _ref5$theme.spacing.baseUnit,
      colors = _ref5$theme.colors;
  return {
    color: colors.neutral40,
    padding: "".concat(baseUnit * 2, "px ").concat(baseUnit * 3, "px"),
    textAlign: 'center'
  };
};

var noOptionsMessageCSS = noticeCSS;
var loadingMessageCSS = noticeCSS;
var NoOptionsMessage = function NoOptionsMessage(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('noOptionsMessage', props)), {
      'menu-notice': true,
      'menu-notice--no-options': true
    }, className)
  }, innerProps), children);
};
NoOptionsMessage.defaultProps = {
  children: 'No options'
};
var LoadingMessage = function LoadingMessage(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('loadingMessage', props)), {
      'menu-notice': true,
      'menu-notice--loading': true
    }, className)
  }, innerProps), children);
};
LoadingMessage.defaultProps = {
  children: 'Loading...'
}; // ==============================
// Menu Portal
// ==============================

var menuPortalCSS = function menuPortalCSS(_ref6) {
  var rect = _ref6.rect,
      offset = _ref6.offset,
      position = _ref6.position;
  return {
    left: rect.left,
    position: position,
    top: offset,
    width: rect.width,
    zIndex: 1
  };
};
var MenuPortal =
/*#__PURE__*/
function (_Component2) {
  _inherits(MenuPortal, _Component2);

  function MenuPortal() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, MenuPortal);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(MenuPortal)).call.apply(_getPrototypeOf3, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "state", {
      placement: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "getPortalPlacement", function (_ref7) {
      var placement = _ref7.placement;
      var initialPlacement = coercePlacement(_this2.props.menuPlacement); // avoid re-renders if the placement has not changed

      if (placement !== initialPlacement) {
        _this2.setState({
          placement: placement
        });
      }
    });

    return _this2;
  }

  _createClass(MenuPortal, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        getPortalPlacement: this.getPortalPlacement
      };
    } // callback for occassions where the menu must "flip"

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          appendTo = _this$props2.appendTo,
          children = _this$props2.children,
          controlElement = _this$props2.controlElement,
          menuPlacement = _this$props2.menuPlacement,
          position = _this$props2.menuPosition,
          getStyles = _this$props2.getStyles;
      var isFixed = position === 'fixed'; // bail early if required elements aren't present

      if (!appendTo && !isFixed || !controlElement) {
        return null;
      }

      var placement = this.state.placement || coercePlacement(menuPlacement);
      var rect = getBoundingClientObj(controlElement);
      var scrollDistance = isFixed ? 0 : window.pageYOffset;
      var offset = rect[placement] + scrollDistance;
      var state = {
        offset: offset,
        position: position,
        rect: rect
      }; // same wrapper element whether fixed or portalled

      var menuWrapper = react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className:
        /*#__PURE__*/

        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('menuPortal', state))
      }, children);
      return appendTo ? (0,react_dom__WEBPACK_IMPORTED_MODULE_2__.createPortal)(menuWrapper, appendTo) : menuWrapper;
    }
  }]);

  return MenuPortal;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

_defineProperty(MenuPortal, "childContextTypes", {
  getPortalPlacement: (prop_types__WEBPACK_IMPORTED_MODULE_5___default().func)
});

var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

function equal(a, b) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true;

  if (a && b && _typeof(a) == 'object' && _typeof(b) == 'object') {
    var arrA = isArray(a),
        arrB = isArray(b),
        i,
        length,
        key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) {
        if (!equal(a[i], b[i])) return false;
      }

      return true;
    }

    if (arrA != arrB) return false;
    var dateA = a instanceof Date,
        dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();
    var regexpA = a instanceof RegExp,
        regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();
    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) {
      return false;
    }

    for (i = length; i-- !== 0;) {
      if (!hasProp.call(b, keys[i])) return false;
    } // end fast-deep-equal
    // Custom handling for React


    for (i = length; i-- !== 0;) {
      key = keys[i];

      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!equal(a[key], b[key])) return false;
      }
    } // fast-deep-equal index.js 2.0.1


    return true;
  }

  return a !== a && b !== b;
} // end fast-deep-equal


function exportedEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if (error.message && error.message.match(/stack|recursion/i)) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
      return false;
    } // some other error. we should definitely know about these


    throw error;
  }
}

var diacritics = [{
  base: 'A',
  letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
}, {
  base: 'AA',
  letters: /[\uA732]/g
}, {
  base: 'AE',
  letters: /[\u00C6\u01FC\u01E2]/g
}, {
  base: 'AO',
  letters: /[\uA734]/g
}, {
  base: 'AU',
  letters: /[\uA736]/g
}, {
  base: 'AV',
  letters: /[\uA738\uA73A]/g
}, {
  base: 'AY',
  letters: /[\uA73C]/g
}, {
  base: 'B',
  letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
}, {
  base: 'C',
  letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
}, {
  base: 'D',
  letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
}, {
  base: 'DZ',
  letters: /[\u01F1\u01C4]/g
}, {
  base: 'Dz',
  letters: /[\u01F2\u01C5]/g
}, {
  base: 'E',
  letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
}, {
  base: 'F',
  letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
}, {
  base: 'G',
  letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
}, {
  base: 'H',
  letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
}, {
  base: 'I',
  letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
}, {
  base: 'J',
  letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g
}, {
  base: 'K',
  letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
}, {
  base: 'L',
  letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
}, {
  base: 'LJ',
  letters: /[\u01C7]/g
}, {
  base: 'Lj',
  letters: /[\u01C8]/g
}, {
  base: 'M',
  letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
}, {
  base: 'N',
  letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
}, {
  base: 'NJ',
  letters: /[\u01CA]/g
}, {
  base: 'Nj',
  letters: /[\u01CB]/g
}, {
  base: 'O',
  letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
}, {
  base: 'OI',
  letters: /[\u01A2]/g
}, {
  base: 'OO',
  letters: /[\uA74E]/g
}, {
  base: 'OU',
  letters: /[\u0222]/g
}, {
  base: 'P',
  letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
}, {
  base: 'Q',
  letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
}, {
  base: 'R',
  letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
}, {
  base: 'S',
  letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
}, {
  base: 'T',
  letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
}, {
  base: 'TZ',
  letters: /[\uA728]/g
}, {
  base: 'U',
  letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
}, {
  base: 'V',
  letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
}, {
  base: 'VY',
  letters: /[\uA760]/g
}, {
  base: 'W',
  letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
}, {
  base: 'X',
  letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
}, {
  base: 'Y',
  letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
}, {
  base: 'Z',
  letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
}, {
  base: 'a',
  letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
}, {
  base: 'aa',
  letters: /[\uA733]/g
}, {
  base: 'ae',
  letters: /[\u00E6\u01FD\u01E3]/g
}, {
  base: 'ao',
  letters: /[\uA735]/g
}, {
  base: 'au',
  letters: /[\uA737]/g
}, {
  base: 'av',
  letters: /[\uA739\uA73B]/g
}, {
  base: 'ay',
  letters: /[\uA73D]/g
}, {
  base: 'b',
  letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
}, {
  base: 'c',
  letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
}, {
  base: 'd',
  letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
}, {
  base: 'dz',
  letters: /[\u01F3\u01C6]/g
}, {
  base: 'e',
  letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
}, {
  base: 'f',
  letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
}, {
  base: 'g',
  letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
}, {
  base: 'h',
  letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
}, {
  base: 'hv',
  letters: /[\u0195]/g
}, {
  base: 'i',
  letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
}, {
  base: 'j',
  letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
}, {
  base: 'k',
  letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
}, {
  base: 'l',
  letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
}, {
  base: 'lj',
  letters: /[\u01C9]/g
}, {
  base: 'm',
  letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
}, {
  base: 'n',
  letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
}, {
  base: 'nj',
  letters: /[\u01CC]/g
}, {
  base: 'o',
  letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
}, {
  base: 'oi',
  letters: /[\u01A3]/g
}, {
  base: 'ou',
  letters: /[\u0223]/g
}, {
  base: 'oo',
  letters: /[\uA74F]/g
}, {
  base: 'p',
  letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
}, {
  base: 'q',
  letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
}, {
  base: 'r',
  letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
}, {
  base: 's',
  letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
}, {
  base: 't',
  letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
}, {
  base: 'tz',
  letters: /[\uA729]/g
}, {
  base: 'u',
  letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
}, {
  base: 'v',
  letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
}, {
  base: 'vy',
  letters: /[\uA761]/g
}, {
  base: 'w',
  letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
}, {
  base: 'x',
  letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
}, {
  base: 'y',
  letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
}, {
  base: 'z',
  letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
}];
var stripDiacritics = function stripDiacritics(str) {
  for (var i = 0; i < diacritics.length; i++) {
    str = str.replace(diacritics[i].letters, diacritics[i].base);
  }

  return str;
};

var trimString = function trimString(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

var defaultStringify = function defaultStringify(option) {
  return "".concat(option.label, " ").concat(option.value);
};

var createFilter = function createFilter(config) {
  return function (option, rawInput) {
    var _ignoreCase$ignoreAcc = _objectSpread({
      ignoreCase: true,
      ignoreAccents: true,
      stringify: defaultStringify,
      trim: true,
      matchFrom: 'any'
    }, config),
        ignoreCase = _ignoreCase$ignoreAcc.ignoreCase,
        ignoreAccents = _ignoreCase$ignoreAcc.ignoreAccents,
        stringify = _ignoreCase$ignoreAcc.stringify,
        trim = _ignoreCase$ignoreAcc.trim,
        matchFrom = _ignoreCase$ignoreAcc.matchFrom;

    var input = trim ? trimString(rawInput) : rawInput;
    var candidate = trim ? trimString(stringify(option)) : stringify(option);

    if (ignoreCase) {
      input = input.toLowerCase();
      candidate = candidate.toLowerCase();
    }

    if (ignoreAccents) {
      input = stripDiacritics(input);
      candidate = stripDiacritics(candidate);
    }

    return matchFrom === 'start' ? candidate.substr(0, input.length) === input : candidate.indexOf(input) > -1;
  };
};

var A11yText = function A11yText(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", _extends({
    className:
    /*#__PURE__*/

    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)({
      label: 'a11yText',
      zIndex: 9999,
      border: 0,
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: 1,
      width: 1,
      position: 'absolute',
      overflow: 'hidden',
      padding: 0,
      whiteSpace: 'nowrap',
      backgroundColor: 'red',
      color: 'blue'
    })
  }, props));
};

var DummyInput =
/*#__PURE__*/
function (_Component) {
  _inherits(DummyInput, _Component);

  function DummyInput() {
    _classCallCheck(this, DummyInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(DummyInput).apply(this, arguments));
  }

  _createClass(DummyInput, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          inProp = _this$props.in,
          out = _this$props.out,
          onExited = _this$props.onExited,
          appear = _this$props.appear,
          enter = _this$props.enter,
          exit = _this$props.exit,
          innerRef = _this$props.innerRef,
          emotion = _this$props.emotion,
          props = _objectWithoutProperties(_this$props, ["in", "out", "onExited", "appear", "enter", "exit", "innerRef", "emotion"]);

      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", _extends({
        ref: innerRef
      }, props, {
        className:
        /*#__PURE__*/

        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)({
          label: 'dummyInput',
          // get rid of any default styles
          background: 0,
          border: 0,
          fontSize: 'inherit',
          outline: 0,
          padding: 0,
          // important! without `width` browsers won't allow focus
          width: 1,
          // remove cursor on desktop
          color: 'transparent',
          // remove cursor on mobile whilst maintaining "scroll into view" behaviour
          left: -100,
          opacity: 0,
          position: 'relative',
          transform: 'scale(0)'
        })
      }));
    }
  }]);

  return DummyInput;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

var NodeResolver =
/*#__PURE__*/
function (_Component) {
  _inherits(NodeResolver, _Component);

  function NodeResolver() {
    _classCallCheck(this, NodeResolver);

    return _possibleConstructorReturn(this, _getPrototypeOf(NodeResolver).apply(this, arguments));
  }

  _createClass(NodeResolver, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.innerRef((0,react_dom__WEBPACK_IMPORTED_MODULE_2__.findDOMNode)(this));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.innerRef(null);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return NodeResolver;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

var STYLE_KEYS = ['boxSizing', 'height', 'overflow', 'paddingRight', 'position'];
var LOCK_STYLES = {
  boxSizing: 'border-box',
  // account for possible declaration `width: 100%;` on body
  overflow: 'hidden',
  position: 'relative',
  height: '100%'
};

function preventTouchMove(e) {
  e.preventDefault();
}
function allowTouchMove(e) {
  e.stopPropagation();
}
function preventInertiaScroll() {
  var top = this.scrollTop;
  var totalScroll = this.scrollHeight;
  var currentScroll = top + this.offsetHeight;

  if (top === 0) {
    this.scrollTop = 1;
  } else if (currentScroll === totalScroll) {
    this.scrollTop = top - 1;
  }
} // `ontouchstart` check works on most browsers
// `maxTouchPoints` works on IE10/11 and Surface

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var activeScrollLocks = 0;

var ScrollLock =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollLock, _Component);

  function ScrollLock() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScrollLock);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollLock)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "originalStyles", {});

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "listenerOptions", {
      capture: false,
      passive: false
    });

    return _this;
  }

  _createClass(ScrollLock, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (!canUseDOM) return;
      var _this$props = this.props,
          accountForScrollbars = _this$props.accountForScrollbars,
          touchScrollTarget = _this$props.touchScrollTarget;
      var target = document.body;
      var targetStyle = target && target.style;

      if (accountForScrollbars) {
        // store any styles already applied to the body
        STYLE_KEYS.forEach(function (key) {
          var val = targetStyle && targetStyle[key];
          _this2.originalStyles[key] = val;
        });
      } // apply the lock styles and padding if this is the first scroll lock


      if (accountForScrollbars && activeScrollLocks < 1) {
        var currentPadding = parseInt(this.originalStyles.paddingRight, 10) || 0;
        var clientWidth = document.body ? document.body.clientWidth : 0;
        var adjustedPadding = window.innerWidth - clientWidth + currentPadding || 0;
        Object.keys(LOCK_STYLES).forEach(function (key) {
          var val = LOCK_STYLES[key];

          if (targetStyle) {
            targetStyle[key] = val;
          }
        });

        if (targetStyle) {
          targetStyle.paddingRight = "".concat(adjustedPadding, "px");
        }
      } // account for touch devices


      if (target && isTouchDevice()) {
        // Mobile Safari ignores { overflow: hidden } declaration on the body.
        target.addEventListener('touchmove', preventTouchMove, this.listenerOptions); // Allow scroll on provided target

        if (touchScrollTarget) {
          touchScrollTarget.addEventListener('touchstart', preventInertiaScroll, this.listenerOptions);
          touchScrollTarget.addEventListener('touchmove', allowTouchMove, this.listenerOptions);
        }
      } // increment active scroll locks


      activeScrollLocks += 1;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this3 = this;

      if (!canUseDOM) return;
      var _this$props2 = this.props,
          accountForScrollbars = _this$props2.accountForScrollbars,
          touchScrollTarget = _this$props2.touchScrollTarget;
      var target = document.body;
      var targetStyle = target && target.style; // safely decrement active scroll locks

      activeScrollLocks = Math.max(activeScrollLocks - 1, 0); // reapply original body styles, if any

      if (accountForScrollbars && activeScrollLocks < 1) {
        STYLE_KEYS.forEach(function (key) {
          var val = _this3.originalStyles[key];

          if (targetStyle) {
            targetStyle[key] = val;
          }
        });
      } // remove touch listeners


      if (target && isTouchDevice()) {
        target.removeEventListener('touchmove', preventTouchMove, this.listenerOptions);

        if (touchScrollTarget) {
          touchScrollTarget.removeEventListener('touchstart', preventInertiaScroll, this.listenerOptions);
          touchScrollTarget.removeEventListener('touchmove', allowTouchMove, this.listenerOptions);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return ScrollLock;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

_defineProperty(ScrollLock, "defaultProps", {
  accountForScrollbars: true
});

// NOTE:
// We shouldn't need this after updating to React v16.3.0, which introduces:
// - createRef() https://reactjs.org/docs/react-api.html#reactcreateref
// - forwardRef() https://reactjs.org/docs/react-api.html#reactforwardref
var ScrollBlock =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ScrollBlock, _PureComponent);

  function ScrollBlock() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScrollBlock);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollBlock)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      touchScrollTarget: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getScrollTarget", function (ref) {
      if (ref === _this.state.touchScrollTarget) return;

      _this.setState({
        touchScrollTarget: ref
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "blurSelectInput", function () {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    });

    return _this;
  }

  _createClass(ScrollBlock, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          isEnabled = _this$props.isEnabled;
      var touchScrollTarget = this.state.touchScrollTarget; // bail early if not enabled

      if (!isEnabled) return children;
      /*
       * Div
       * ------------------------------
       * blocks scrolling on non-body elements behind the menu
        * NodeResolver
       * ------------------------------
       * we need a reference to the scrollable element to "unlock" scroll on
       * mobile devices
        * ScrollLock
       * ------------------------------
       * actually does the scroll locking
       */

      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        onClick: this.blurSelectInput,
        className:
        /*#__PURE__*/

        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)({
          position: 'fixed',
          left: 0,
          bottom: 0,
          right: 0,
          top: 0
        })
      }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NodeResolver, {
        innerRef: this.getScrollTarget
      }, children), touchScrollTarget ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ScrollLock, {
        touchScrollTarget: touchScrollTarget
      }) : null);
    }
  }]);

  return ScrollBlock;
}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent);

var ScrollCaptor =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollCaptor, _Component);

  function ScrollCaptor() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScrollCaptor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollCaptor)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isBottom", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isTop", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scrollTarget", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "touchStart", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "cancelScroll", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleEventDelta", function (event, delta) {
      var _this$props = _this.props,
          onBottomArrive = _this$props.onBottomArrive,
          onBottomLeave = _this$props.onBottomLeave,
          onTopArrive = _this$props.onTopArrive,
          onTopLeave = _this$props.onTopLeave;
      var _this$scrollTarget = _this.scrollTarget,
          scrollTop = _this$scrollTarget.scrollTop,
          scrollHeight = _this$scrollTarget.scrollHeight,
          clientHeight = _this$scrollTarget.clientHeight;
      var target = _this.scrollTarget;
      var isDeltaPositive = delta > 0;
      var availableScroll = scrollHeight - clientHeight - scrollTop;
      var shouldCancelScroll = false; // reset bottom/top flags

      if (availableScroll > delta && _this.isBottom) {
        if (onBottomLeave) onBottomLeave(event);
        _this.isBottom = false;
      }

      if (isDeltaPositive && _this.isTop) {
        if (onTopLeave) onTopLeave(event);
        _this.isTop = false;
      } // bottom limit


      if (isDeltaPositive && delta > availableScroll) {
        if (onBottomArrive && !_this.isBottom) {
          onBottomArrive(event);
        }

        target.scrollTop = scrollHeight;
        shouldCancelScroll = true;
        _this.isBottom = true; // top limit
      } else if (!isDeltaPositive && -delta > scrollTop) {
        if (onTopArrive && !_this.isTop) {
          onTopArrive(event);
        }

        target.scrollTop = 0;
        shouldCancelScroll = true;
        _this.isTop = true;
      } // cancel scroll


      if (shouldCancelScroll) {
        _this.cancelScroll(event);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onWheel", function (event) {
      _this.handleEventDelta(event, event.deltaY);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTouchStart", function (event) {
      // set touch start so we can calculate touchmove delta
      _this.touchStart = event.changedTouches[0].clientY;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTouchMove", function (event) {
      var deltaY = _this.touchStart - event.changedTouches[0].clientY;

      _this.handleEventDelta(event, deltaY);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getScrollTarget", function (ref) {
      _this.scrollTarget = ref;
    });

    return _this;
  }

  _createClass(ScrollCaptor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startListening(this.scrollTarget);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopListening(this.scrollTarget);
    }
  }, {
    key: "startListening",
    value: function startListening(el) {
      // bail early if no scroll available
      if (!el) return;
      if (el.scrollHeight <= el.clientHeight) return; // all the if statements are to appease Flow 😢

      if (typeof el.addEventListener === 'function') {
        el.addEventListener('wheel', this.onWheel, false);
      }

      if (typeof el.addEventListener === 'function') {
        el.addEventListener('touchstart', this.onTouchStart, false);
      }

      if (typeof el.addEventListener === 'function') {
        el.addEventListener('touchmove', this.onTouchMove, false);
      }
    }
  }, {
    key: "stopListening",
    value: function stopListening(el) {
      // bail early if no scroll available
      if (el.scrollHeight <= el.clientHeight) return; // all the if statements are to appease Flow 😢

      if (typeof el.removeEventListener === 'function') {
        el.removeEventListener('wheel', this.onWheel, false);
      }

      if (typeof el.removeEventListener === 'function') {
        el.removeEventListener('touchstart', this.onTouchStart, false);
      }

      if (typeof el.removeEventListener === 'function') {
        el.removeEventListener('touchmove', this.onTouchMove, false);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NodeResolver, {
        innerRef: this.getScrollTarget
      }, this.props.children);
    }
  }]);

  return ScrollCaptor;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

var ScrollCaptorSwitch =
/*#__PURE__*/
function (_Component2) {
  _inherits(ScrollCaptorSwitch, _Component2);

  function ScrollCaptorSwitch() {
    _classCallCheck(this, ScrollCaptorSwitch);

    return _possibleConstructorReturn(this, _getPrototypeOf(ScrollCaptorSwitch).apply(this, arguments));
  }

  _createClass(ScrollCaptorSwitch, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          isEnabled = _this$props2.isEnabled,
          props = _objectWithoutProperties(_this$props2, ["isEnabled"]);

      return isEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ScrollCaptor, props) : this.props.children;
    }
  }]);

  return ScrollCaptorSwitch;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

_defineProperty(ScrollCaptorSwitch, "defaultProps", {
  isEnabled: true
});

var instructionsAriaMessage = function instructionsAriaMessage(event) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isSearchable = context.isSearchable,
      isMulti = context.isMulti,
      label = context.label,
      isDisabled = context.isDisabled;

  switch (event) {
    case 'menu':
      return "Use Up and Down to choose options".concat(isDisabled ? '' : ', press Enter to select the currently focused option', ", press Escape to exit the menu, press Tab to select the option and exit the menu.");

    case 'input':
      return "".concat(label ? label : 'Select', " is focused ").concat(isSearchable ? ',type to refine list' : '', ", press Down to open the menu, ").concat(isMulti ? ' press left to focus selected values' : '');

    case 'value':
      return 'Use left and right to toggle between focused values, press Backspace to remove the currently focused value';
  }
};
var valueEventAriaMessage = function valueEventAriaMessage(event, context) {
  var value = context.value,
      isDisabled = context.isDisabled;
  if (!value) return;

  switch (event) {
    case 'deselect-option':
    case 'pop-value':
    case 'remove-value':
      return "option ".concat(value, ", deselected.");

    case 'select-option':
      return isDisabled ? "option ".concat(value, " is disabled. Select another option.") : "option ".concat(value, ", selected.");
  }
};
var valueFocusAriaMessage = function valueFocusAriaMessage(_ref) {
  var focusedValue = _ref.focusedValue,
      getOptionLabel = _ref.getOptionLabel,
      selectValue = _ref.selectValue;
  return "value ".concat(getOptionLabel(focusedValue), " focused, ").concat(selectValue.indexOf(focusedValue) + 1, " of ").concat(selectValue.length, ".");
};
var optionFocusAriaMessage = function optionFocusAriaMessage(_ref2) {
  var focusedOption = _ref2.focusedOption,
      getOptionLabel = _ref2.getOptionLabel,
      options = _ref2.options;
  return "option ".concat(getOptionLabel(focusedOption), " focused").concat(focusedOption.isDisabled ? ' disabled' : '', ", ").concat(options.indexOf(focusedOption) + 1, " of ").concat(options.length, ".");
};
var resultsAriaMessage = function resultsAriaMessage(_ref3) {
  var inputValue = _ref3.inputValue,
      screenReaderMessage = _ref3.screenReaderMessage;
  return "".concat(screenReaderMessage).concat(inputValue ? ' for search term ' + inputValue : '', ".");
};

var formatGroupLabel = function formatGroupLabel(group) {
  return group.label;
};
var getOptionLabel = function getOptionLabel(option) {
  return option.label;
};
var getOptionValue = function getOptionValue(option) {
  return option.value;
};
var isOptionDisabled = function isOptionDisabled(option) {
  return !!option.isDisabled;
};

var containerCSS = function containerCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      isRtl = _ref.isRtl;
  return {
    label: 'container',
    direction: isRtl ? 'rtl' : null,
    pointerEvents: isDisabled ? 'none' : null,
    // cancel mouse events when disabled
    position: 'relative'
  };
};
var SelectContainer = function SelectContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isDisabled = props.isDisabled,
      isRtl = props.isRtl;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('container', props)), {
      '--is-disabled': isDisabled,
      '--is-rtl': isRtl
    }, className)
  }, innerProps), children);
}; // ==============================
// Value Container
// ==============================

var valueContainerCSS = function valueContainerCSS(_ref2) {
  var spacing = _ref2.theme.spacing;
  return {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    padding: "".concat(spacing.baseUnit / 2, "px ").concat(spacing.baseUnit * 2, "px"),
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    overflow: 'hidden'
  };
};
var ValueContainer =
/*#__PURE__*/
function (_Component) {
  _inherits(ValueContainer, _Component);

  function ValueContainer() {
    _classCallCheck(this, ValueContainer);

    return _possibleConstructorReturn(this, _getPrototypeOf(ValueContainer).apply(this, arguments));
  }

  _createClass(ValueContainer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          cx = _this$props.cx,
          isMulti = _this$props.isMulti,
          getStyles = _this$props.getStyles,
          hasValue = _this$props.hasValue;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: cx(
        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('valueContainer', this.props)), {
          'value-container': true,
          'value-container--is-multi': isMulti,
          'value-container--has-value': hasValue
        }, className)
      }, children);
    }
  }]);

  return ValueContainer;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component); // ==============================
// Indicator Container
// ==============================

var indicatorsContainerCSS = function indicatorsContainerCSS() {
  return {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 0
  };
};
var IndicatorsContainer = function IndicatorsContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('indicatorsContainer', props)), {
      'indicators': true
    }, className)
  }, children);
};

// ==============================
// Dropdown & Clear Icons
// ==============================
var Svg = function Svg(_ref) {
  var size = _ref.size,
      props = _objectWithoutProperties(_ref, ["size"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", _extends({
    height: size,
    width: size,
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    focusable: "false",
    className:
    /*#__PURE__*/

    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)({
      display: 'inline-block',
      fill: 'currentColor',
      lineHeight: 1,
      stroke: 'currentColor',
      strokeWidth: 0
    })
  }, props));
};

var CrossIcon = function CrossIcon(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Svg, _extends({
    size: 20
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
  }));
};
var DownChevron = function DownChevron(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Svg, _extends({
    size: 20
  }, props), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"
  }));
}; // ==============================
// Dropdown & Clear Buttons
// ==============================

var baseCSS = function baseCSS(_ref2) {
  var isFocused = _ref2.isFocused,
      _ref2$theme = _ref2.theme,
      baseUnit = _ref2$theme.spacing.baseUnit,
      colors = _ref2$theme.colors;
  return {
    label: 'indicatorContainer',
    color: isFocused ? colors.neutral60 : colors.neutral20,
    display: 'flex',
    padding: baseUnit * 2,
    transition: 'color 150ms',
    ':hover': {
      color: isFocused ? colors.neutral80 : colors.neutral40
    }
  };
};

var dropdownIndicatorCSS = baseCSS;
var DropdownIndicator = function DropdownIndicator(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({}, innerProps, {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('dropdownIndicator', props)), {
      'indicator': true,
      'dropdown-indicator': true
    }, className)
  }), children || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DownChevron, null));
};
var clearIndicatorCSS = baseCSS;
var ClearIndicator = function ClearIndicator(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({}, innerProps, {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('clearIndicator', props)), {
      'indicator': true,
      'clear-indicator': true
    }, className)
  }), children || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CrossIcon, null));
}; // ==============================
// Separator
// ==============================

var indicatorSeparatorCSS = function indicatorSeparatorCSS(_ref3) {
  var isDisabled = _ref3.isDisabled,
      _ref3$theme = _ref3.theme,
      baseUnit = _ref3$theme.spacing.baseUnit,
      colors = _ref3$theme.colors;
  return {
    label: 'indicatorSeparator',
    alignSelf: 'stretch',
    backgroundColor: isDisabled ? colors.neutral10 : colors.neutral20,
    marginBottom: baseUnit * 2,
    marginTop: baseUnit * 2,
    width: 1
  };
};
var IndicatorSeparator = function IndicatorSeparator(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", _extends({}, innerProps, {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('indicatorSeparator', props)), {
      'indicator-separator': true
    }, className)
  }));
}; // ==============================
// Loading
// ==============================

var keyframesName = 'react-select-loading-indicator';
var keyframesInjected = false;
var loadingIndicatorCSS = function loadingIndicatorCSS(_ref4) {
  var isFocused = _ref4.isFocused,
      size = _ref4.size,
      _ref4$theme = _ref4.theme,
      colors = _ref4$theme.colors,
      baseUnit = _ref4$theme.spacing.baseUnit;
  return {
    label: 'loadingIndicator',
    color: isFocused ? colors.neutral60 : colors.neutral20,
    display: 'flex',
    padding: baseUnit * 2,
    transition: 'color 150ms',
    alignSelf: 'center',
    fontSize: size,
    lineHeight: 1,
    marginRight: size,
    textAlign: 'center',
    verticalAlign: 'middle'
  };
};

var LoadingDot = function LoadingDot(_ref5) {
  var color = _ref5.color,
      delay = _ref5.delay,
      offset = _ref5.offset;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className:
    /*#__PURE__*/

    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)({
      animationDuration: '1s',
      animationDelay: "".concat(delay, "ms"),
      animationIterationCount: 'infinite',
      animationName: keyframesName,
      animationTimingFunction: 'ease-in-out',
      backgroundColor: color,
      borderRadius: '1em',
      display: 'inline-block',
      marginLeft: offset ? '1em' : null,
      height: '1em',
      verticalAlign: 'top',
      width: '1em'
    })
  });
};

var LoadingIndicator = function LoadingIndicator(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isFocused = props.isFocused,
      isRtl = props.isRtl,
      colors = props.theme.colors;
  var color = isFocused ? colors.neutral80 : colors.neutral20;

  if (!keyframesInjected) {
    // eslint-disable-next-line no-unused-expressions
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.injectGlobal)("@keyframes ", keyframesName, "{0%,80%,100%{opacity:0;}40%{opacity:1;}};");
    keyframesInjected = true;
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({}, innerProps, {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('loadingIndicator', props)), {
      'indicator': true,
      'loading-indicator': true
    }, className)
  }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingDot, {
    color: color,
    delay: 0,
    offset: isRtl
  }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingDot, {
    color: color,
    delay: 160,
    offset: true
  }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingDot, {
    color: color,
    delay: 320,
    offset: !isRtl
  }));
};
LoadingIndicator.defaultProps = {
  size: 4
};

var css$1 = function css$$1(_ref) {
  var isDisabled = _ref.isDisabled,
      isFocused = _ref.isFocused,
      _ref$theme = _ref.theme,
      colors = _ref$theme.colors,
      borderRadius = _ref$theme.borderRadius,
      spacing = _ref$theme.spacing;
  return {
    label: 'control',
    alignItems: 'center',
    backgroundColor: isDisabled ? colors.neutral5 : colors.neutral0,
    borderColor: isDisabled ? colors.neutral10 : isFocused ? colors.primary : colors.neutral20,
    borderRadius: borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: isFocused ? "0 0 0 1px ".concat(colors.primary) : null,
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: spacing.controlHeight,
    outline: '0 !important',
    position: 'relative',
    transition: 'all 100ms',
    '&:hover': {
      borderColor: isFocused ? colors.primary : colors.neutral30
    }
  };
};

var Control = function Control(props) {
  var children = props.children,
      cx = props.cx,
      getStyles = props.getStyles,
      className = props.className,
      isDisabled = props.isDisabled,
      isFocused = props.isFocused,
      innerRef = props.innerRef,
      innerProps = props.innerProps,
      menuIsOpen = props.menuIsOpen;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    ref: innerRef,
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('control', props)), {
      'control': true,
      'control--is-disabled': isDisabled,
      'control--is-focused': isFocused,
      'control--menu-is-open': menuIsOpen
    }, className)
  }, innerProps), children);
};

var groupCSS = function groupCSS(_ref) {
  var spacing = _ref.theme.spacing;
  return {
    paddingBottom: spacing.baseUnit * 2,
    paddingTop: spacing.baseUnit * 2
  };
};

var Group = function Group(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      Heading = props.Heading,
      headingProps = props.headingProps,
      label = props.label,
      theme = props.theme,
      selectProps = props.selectProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('group', props)), {
      'group': true
    }, className)
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Heading, _extends({}, headingProps, {
    selectProps: selectProps,
    theme: theme,
    getStyles: getStyles,
    cx: cx
  }), label), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, children));
};

var groupHeadingCSS = function groupHeadingCSS(_ref2) {
  var spacing = _ref2.theme.spacing;
  return {
    label: 'group',
    color: '#999',
    cursor: 'default',
    display: 'block',
    fontSize: '75%',
    fontWeight: '500',
    marginBottom: '0.25em',
    paddingLeft: spacing.baseUnit * 3,
    paddingRight: spacing.baseUnit * 3,
    textTransform: 'uppercase'
  };
};
var GroupHeading = function GroupHeading(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      theme = props.theme,
      selectProps = props.selectProps,
      cleanProps = _objectWithoutProperties(props, ["className", "cx", "getStyles", "theme", "selectProps"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('groupHeading', _objectSpread({
      theme: theme
    }, cleanProps))), {
      'group-heading': true
    }, className)
  }, cleanProps));
};

var inputCSS = function inputCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    margin: spacing.baseUnit / 2,
    paddingBottom: spacing.baseUnit / 2,
    paddingTop: spacing.baseUnit / 2,
    visibility: isDisabled ? 'hidden' : 'visible',
    color: colors.neutral80
  };
};

var inputStyle = function inputStyle(isHidden) {
  return {
    label: 'input',
    background: 0,
    border: 0,
    fontSize: 'inherit',
    opacity: isHidden ? 0 : 1,
    outline: 0,
    padding: 0,
    color: 'inherit'
  };
};

var Input = function Input(_ref2) {
  var className = _ref2.className,
      cx = _ref2.cx,
      getStyles = _ref2.getStyles,
      innerRef = _ref2.innerRef,
      isHidden = _ref2.isHidden,
      isDisabled = _ref2.isDisabled,
      theme = _ref2.theme,
      selectProps = _ref2.selectProps,
      props = _objectWithoutProperties(_ref2, ["className", "cx", "getStyles", "innerRef", "isHidden", "isDisabled", "theme", "selectProps"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className:
    /*#__PURE__*/

    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('input', _objectSpread({
      theme: theme
    }, props)))
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_input_autosize__WEBPACK_IMPORTED_MODULE_4__["default"], _extends({
    className: cx(null, {
      'input': true
    }, className),
    inputRef: innerRef,
    inputStyle: inputStyle(isHidden),
    disabled: isDisabled
  }, props)));
};

var multiValueCSS = function multiValueCSS(_ref) {
  var _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      borderRadius = _ref$theme.borderRadius,
      colors = _ref$theme.colors;
  return {
    label: 'multiValue',
    backgroundColor: colors.neutral10,
    borderRadius: borderRadius / 2,
    display: 'flex',
    margin: spacing.baseUnit / 2,
    minWidth: 0 // resolves flex/text-overflow bug

  };
};
var multiValueLabelCSS = function multiValueLabelCSS(_ref2) {
  var _ref2$theme = _ref2.theme,
      borderRadius = _ref2$theme.borderRadius,
      colors = _ref2$theme.colors,
      cropWithEllipsis = _ref2.cropWithEllipsis;
  return {
    borderRadius: borderRadius / 2,
    color: colors.neutral80,
    fontSize: '85%',
    overflow: 'hidden',
    padding: 3,
    paddingLeft: 6,
    textOverflow: cropWithEllipsis ? 'ellipsis' : null,
    whiteSpace: 'nowrap'
  };
};
var multiValueRemoveCSS = function multiValueRemoveCSS(_ref3) {
  var _ref3$theme = _ref3.theme,
      spacing = _ref3$theme.spacing,
      borderRadius = _ref3$theme.borderRadius,
      colors = _ref3$theme.colors,
      isFocused = _ref3.isFocused;
  return {
    alignItems: 'center',
    borderRadius: borderRadius / 2,
    backgroundColor: isFocused && colors.dangerLight,
    display: 'flex',
    paddingLeft: spacing.baseUnit,
    paddingRight: spacing.baseUnit,
    ':hover': {
      backgroundColor: colors.dangerLight,
      color: colors.danger
    }
  };
};
var MultiValueGeneric = function MultiValueGeneric(_ref4) {
  var children = _ref4.children,
      innerProps = _ref4.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", innerProps, children);
};
var MultiValueContainer = MultiValueGeneric;
var MultiValueLabel = MultiValueGeneric;
var MultiValueRemove =
/*#__PURE__*/
function (_Component) {
  _inherits(MultiValueRemove, _Component);

  function MultiValueRemove() {
    _classCallCheck(this, MultiValueRemove);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultiValueRemove).apply(this, arguments));
  }

  _createClass(MultiValueRemove, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          innerProps = _this$props.innerProps;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", innerProps, children || react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CrossIcon, {
        size: 14
      }));
    }
  }]);

  return MultiValueRemove;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

var MultiValue =
/*#__PURE__*/
function (_Component2) {
  _inherits(MultiValue, _Component2);

  function MultiValue() {
    _classCallCheck(this, MultiValue);

    return _possibleConstructorReturn(this, _getPrototypeOf(MultiValue).apply(this, arguments));
  }

  _createClass(MultiValue, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          className = _this$props2.className,
          components = _this$props2.components,
          cx = _this$props2.cx,
          data = _this$props2.data,
          getStyles = _this$props2.getStyles,
          innerProps = _this$props2.innerProps,
          isDisabled = _this$props2.isDisabled,
          removeProps = _this$props2.removeProps,
          selectProps = _this$props2.selectProps;
      var Container = components.Container,
          Label = components.Label,
          Remove = components.Remove;

      var containerInnerProps = _objectSpread({
        className: cx(
        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('multiValue', this.props)), {
          'multi-value': true,
          'multi-value--is-disabled': isDisabled
        }, className)
      }, innerProps);

      var labelInnerProps = {
        className: cx(
        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('multiValueLabel', this.props)), {
          'multi-value__label': true
        }, className)
      };

      var removeInnerProps = _objectSpread({
        className: cx(
        /*#__PURE__*/
        (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('multiValueRemove', this.props)), {
          'multi-value__remove': true
        }, className)
      }, removeProps);

      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Container, {
        data: data,
        innerProps: containerInnerProps,
        selectProps: selectProps
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Label, {
        data: data,
        innerProps: labelInnerProps,
        selectProps: selectProps
      }, children), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Remove, {
        data: data,
        innerProps: removeInnerProps,
        selectProps: selectProps
      }));
    }
  }]);

  return MultiValue;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

_defineProperty(MultiValue, "defaultProps", {
  cropWithEllipsis: true
});

var optionCSS = function optionCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      isFocused = _ref.isFocused,
      isSelected = _ref.isSelected,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    label: 'option',
    backgroundColor: isSelected ? colors.primary : isFocused ? colors.primary25 : 'transparent',
    color: isDisabled ? colors.neutral20 : isSelected ? colors.neutral0 : 'inherit',
    cursor: 'default',
    display: 'block',
    fontSize: 'inherit',
    padding: "".concat(spacing.baseUnit * 2, "px ").concat(spacing.baseUnit * 3, "px"),
    width: '100%',
    userSelect: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    // provide some affordance on touch devices
    ':active': {
      backgroundColor: !isDisabled && (isSelected ? colors.primary : colors.primary50)
    }
  };
};

var Option = function Option(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isDisabled = props.isDisabled,
      isFocused = props.isFocused,
      isSelected = props.isSelected,
      innerRef = props.innerRef,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    ref: innerRef,
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('option', props)), {
      'option': true,
      'option--is-disabled': isDisabled,
      'option--is-focused': isFocused,
      'option--is-selected': isSelected
    }, className)
  }, innerProps), children);
};

var placeholderCSS = function placeholderCSS(_ref) {
  var _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    label: 'placeholder',
    color: colors.neutral50,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  };
};

var Placeholder = function Placeholder(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('placeholder', props)), {
      'placeholder': true
    }, className)
  }, innerProps), children);
};

var css$2 = function css$$1(_ref) {
  var isDisabled = _ref.isDisabled,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    label: 'singleValue',
    color: isDisabled ? colors.neutral40 : colors.neutral80,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2,
    maxWidth: "calc(100% - ".concat(spacing.baseUnit * 2, "px)"),
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    top: '50%',
    transform: 'translateY(-50%)'
  };
};

var SingleValue = function SingleValue(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isDisabled = props.isDisabled,
      innerProps = props.innerProps;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", _extends({
    className: cx(
    /*#__PURE__*/
    (0,emotion__WEBPACK_IMPORTED_MODULE_1__.css)(getStyles('singleValue', props)), {
      'single-value': true,
      'single-value--is-disabled': isDisabled
    }, className)
  }, innerProps), children);
};

var components = {
  ClearIndicator: ClearIndicator,
  Control: Control,
  DropdownIndicator: DropdownIndicator,
  DownChevron: DownChevron,
  CrossIcon: CrossIcon,
  Group: Group,
  GroupHeading: GroupHeading,
  IndicatorsContainer: IndicatorsContainer,
  IndicatorSeparator: IndicatorSeparator,
  Input: Input,
  LoadingIndicator: LoadingIndicator,
  Menu: Menu,
  MenuList: MenuList,
  MenuPortal: MenuPortal,
  LoadingMessage: LoadingMessage,
  NoOptionsMessage: NoOptionsMessage,
  MultiValue: MultiValue,
  MultiValueContainer: MultiValueContainer,
  MultiValueLabel: MultiValueLabel,
  MultiValueRemove: MultiValueRemove,
  Option: Option,
  Placeholder: Placeholder,
  SelectContainer: SelectContainer,
  SingleValue: SingleValue,
  ValueContainer: ValueContainer
};
var defaultComponents = function defaultComponents(props) {
  return _objectSpread({}, components, props.components);
};

var defaultStyles = {
  clearIndicator: clearIndicatorCSS,
  container: containerCSS,
  control: css$1,
  dropdownIndicator: dropdownIndicatorCSS,
  group: groupCSS,
  groupHeading: groupHeadingCSS,
  indicatorsContainer: indicatorsContainerCSS,
  indicatorSeparator: indicatorSeparatorCSS,
  input: inputCSS,
  loadingIndicator: loadingIndicatorCSS,
  loadingMessage: loadingMessageCSS,
  menu: menuCSS,
  menuList: menuListCSS,
  menuPortal: menuPortalCSS,
  multiValue: multiValueCSS,
  multiValueLabel: multiValueLabelCSS,
  multiValueRemove: multiValueRemoveCSS,
  noOptionsMessage: noOptionsMessageCSS,
  option: optionCSS,
  placeholder: placeholderCSS,
  singleValue: css$2,
  valueContainer: valueContainerCSS
}; // Merge Utility
// Allows consumers to extend a base Select with additional styles

function mergeStyles(source) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // initialize with source styles
  var styles = _objectSpread({}, source); // massage in target styles


  Object.keys(target).forEach(function (key) {
    if (source[key]) {
      styles[key] = function (rsCss, props) {
        return target[key](source[key](rsCss, props), props);
      };
    } else {
      styles[key] = target[key];
    }
  });
  return styles;
}

var colors = {
  primary: '#2684FF',
  primary75: '#4C9AFF',
  primary50: '#B2D4FF',
  primary25: '#DEEBFF',
  danger: '#DE350B',
  dangerLight: '#FFBDAD',
  neutral0: 'hsl(0, 0%, 100%)',
  neutral5: 'hsl(0, 0%, 95%)',
  neutral10: 'hsl(0, 0%, 90%)',
  neutral20: 'hsl(0, 0%, 80%)',
  neutral30: 'hsl(0, 0%, 70%)',
  neutral40: 'hsl(0, 0%, 60%)',
  neutral50: 'hsl(0, 0%, 50%)',
  neutral60: 'hsl(0, 0%, 40%)',
  neutral70: 'hsl(0, 0%, 30%)',
  neutral80: 'hsl(0, 0%, 20%)',
  neutral90: 'hsl(0, 0%, 10%)'
};
var borderRadius = 4;
var baseUnit = 4;
/* Used to calculate consistent margin/padding on elements */

var controlHeight = 38;
/* The minimum height of the control */

var menuGutter = baseUnit * 2;
/* The amount of space between the control and menu */

var spacing = {
  baseUnit: baseUnit,
  controlHeight: controlHeight,
  menuGutter: menuGutter
};
var defaultTheme = {
  borderRadius: borderRadius,
  colors: colors,
  spacing: spacing
};

var defaultProps = {
  backspaceRemovesValue: true,
  blurInputOnSelect: isTouchCapable(),
  captureMenuScroll: !isTouchCapable(),
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabel,
  getOptionLabel: getOptionLabel,
  getOptionValue: getOptionValue,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabled,
  loadingMessage: function loadingMessage() {
    return 'Loading...';
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !isMobileDevice(),
  noOptionsMessage: function noOptionsMessage() {
    return 'No options';
  },
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: function screenReaderStatus(_ref) {
    var count = _ref.count;
    return "".concat(count, " result").concat(count !== 1 ? 's' : '', " available");
  },
  styles: {},
  tabIndex: '0',
  tabSelectsValue: true
};
var instanceId = 1;

var Select =
/*#__PURE__*/
function (_Component) {
  _inherits(Select, _Component);

  // Misc. Instance Properties
  // ------------------------------
  // TODO
  // Refs
  // ------------------------------
  // Lifecycle
  // ------------------------------
  function Select(_props) {
    var _this;

    _classCallCheck(this, Select);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, _props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      ariaLiveSelection: '',
      ariaLiveContext: '',
      focusedOption: null,
      focusedValue: null,
      inputIsHidden: false,
      isFocused: false,
      menuOptions: {
        render: [],
        focusable: []
      },
      selectValue: []
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "blockOptionHover", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isComposing", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "clearFocusValueOnUpdate", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "commonProps", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "components", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hasGroups", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "initialTouchX", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "initialTouchY", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "inputIsHiddenAfterUpdate", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "instancePrefix", '');

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "openAfterFocus", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "scrollToFocusedOptionOnUpdate", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "userIsDragging", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "controlRef", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getControlRef", function (ref) {
      _this.controlRef = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "focusedOptionRef", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getFocusedOptionRef", function (ref) {
      _this.focusedOptionRef = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "menuListRef", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getMenuListRef", function (ref) {
      _this.menuListRef = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "inputRef", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getInputRef", function (ref) {
      _this.inputRef = ref;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "cacheComponents", function (components$$1) {
      _this.components = defaultComponents({
        components: components$$1
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "focus", _this.focusInput);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "blur", _this.blurInput);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onChange", function (newValue, actionMeta) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          name = _this$props.name;
      onChange(newValue, _objectSpread({}, actionMeta, {
        name: name
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setValue", function (newValue) {
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'set-value';
      var option = arguments.length > 2 ? arguments[2] : undefined;
      var _this$props2 = _this.props,
          closeMenuOnSelect = _this$props2.closeMenuOnSelect,
          isMulti = _this$props2.isMulti;

      _this.onInputChange('', {
        action: 'set-value'
      });

      if (closeMenuOnSelect) {
        _this.inputIsHiddenAfterUpdate = !isMulti;

        _this.onMenuClose();
      } // when the select value should change, we should reset focusedValue


      _this.clearFocusValueOnUpdate = true;

      _this.onChange(newValue, {
        action: action,
        option: option
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "selectOption", function (newValue) {
      var _this$props3 = _this.props,
          blurInputOnSelect = _this$props3.blurInputOnSelect,
          isMulti = _this$props3.isMulti;
      var selectValue = _this.state.selectValue;

      if (isMulti) {
        if (_this.isOptionSelected(newValue, selectValue)) {
          var candidate = _this.getOptionValue(newValue);

          _this.setValue(selectValue.filter(function (i) {
            return _this.getOptionValue(i) !== candidate;
          }), 'deselect-option', newValue);

          _this.announceAriaLiveSelection({
            event: 'deselect-option',
            context: {
              value: _this.getOptionLabel(newValue)
            }
          });
        } else {
          if (!_this.isOptionDisabled(newValue, selectValue)) {
            _this.setValue([].concat(_toConsumableArray(selectValue), [newValue]), 'select-option', newValue);

            _this.announceAriaLiveSelection({
              event: 'select-option',
              context: {
                value: _this.getOptionLabel(newValue)
              }
            });
          } else {
            // announce that option is disabled
            _this.announceAriaLiveSelection({
              event: 'select-option',
              context: {
                value: _this.getOptionLabel(newValue),
                isDisabled: true
              }
            });
          }
        }
      } else {
        if (!_this.isOptionDisabled(newValue, selectValue)) {
          _this.setValue(newValue, 'select-option');

          _this.announceAriaLiveSelection({
            event: 'select-option',
            context: {
              value: _this.getOptionLabel(newValue)
            }
          });
        } else {
          // announce that option is disabled
          _this.announceAriaLiveSelection({
            event: 'select-option',
            context: {
              value: _this.getOptionLabel(newValue),
              isDisabled: true
            }
          });
        }
      }

      if (blurInputOnSelect) {
        _this.blurInput();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "removeValue", function (removedValue) {
      var selectValue = _this.state.selectValue;

      var candidate = _this.getOptionValue(removedValue);

      _this.onChange(selectValue.filter(function (i) {
        return _this.getOptionValue(i) !== candidate;
      }), {
        action: 'remove-value',
        removedValue: removedValue
      });

      _this.announceAriaLiveSelection({
        event: 'remove-value',
        context: {
          value: removedValue ? _this.getOptionLabel(removedValue) : ''
        }
      });

      _this.focusInput();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "clearValue", function () {
      var isMulti = _this.props.isMulti;

      _this.onChange(isMulti ? [] : null, {
        action: 'clear'
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "popValue", function () {
      var selectValue = _this.state.selectValue;
      var lastSelectedValue = selectValue[selectValue.length - 1];

      _this.announceAriaLiveSelection({
        event: 'pop-value',
        context: {
          value: lastSelectedValue ? _this.getOptionLabel(lastSelectedValue) : ''
        }
      });

      _this.onChange(selectValue.slice(0, selectValue.length - 1), {
        action: 'pop-value',
        removedValue: lastSelectedValue
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getOptionLabel", function (data) {
      return _this.props.getOptionLabel(data);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getOptionValue", function (data) {
      return _this.props.getOptionValue(data);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getStyles", function (key, props) {
      var base = defaultStyles[key](props);
      base.boxSizing = 'border-box';
      var custom = _this.props.styles[key];
      return custom ? custom(base, props) : base;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getElementId", function (element) {
      return "".concat(_this.instancePrefix, "-").concat(element);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getActiveDescendentId", function () {
      var menuIsOpen = _this.props.menuIsOpen;
      var _this$state = _this.state,
          menuOptions = _this$state.menuOptions,
          focusedOption = _this$state.focusedOption;
      if (!focusedOption || !menuIsOpen) return undefined;
      var index = menuOptions.focusable.indexOf(focusedOption);
      var option = menuOptions.render[index];
      return option && option.key;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "announceAriaLiveSelection", function (_ref2) {
      var event = _ref2.event,
          context = _ref2.context;

      _this.setState({
        ariaLiveSelection: valueEventAriaMessage(event, context)
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "announceAriaLiveContext", function (_ref3) {
      var event = _ref3.event,
          context = _ref3.context;

      _this.setState({
        ariaLiveContext: instructionsAriaMessage(event, _objectSpread({}, context, {
          label: _this.props['aria-label']
        }))
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMenuMouseDown", function (event) {
      if (event.button !== 0) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      _this.focusInput();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMenuMouseMove", function (event) {
      _this.blockOptionHover = false;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onControlMouseDown", function (event) {
      var openMenuOnClick = _this.props.openMenuOnClick;

      if (!_this.state.isFocused) {
        if (openMenuOnClick) {
          _this.openAfterFocus = true;
        }

        _this.focusInput();
      } else if (!_this.props.menuIsOpen) {
        if (openMenuOnClick) {
          _this.openMenu('first');
        }
      } else {
        //$FlowFixMe
        if (event.target.tagName !== 'INPUT') {
          _this.onMenuClose();
        }
      } //$FlowFixMe


      if (event.target.tagName !== 'INPUT') {
        event.preventDefault();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onDropdownIndicatorMouseDown", function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }

      if (_this.props.isDisabled) return;
      var _this$props4 = _this.props,
          isMulti = _this$props4.isMulti,
          menuIsOpen = _this$props4.menuIsOpen;

      _this.focusInput();

      if (menuIsOpen) {
        _this.inputIsHiddenAfterUpdate = !isMulti;

        _this.onMenuClose();
      } else {
        _this.openMenu('first');
      }

      event.preventDefault();
      event.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClearIndicatorMouseDown", function (event) {
      // ignore mouse events that weren't triggered by the primary button
      if (event && event.type === 'mousedown' && event.button !== 0) {
        return;
      }

      _this.clearValue();

      event.stopPropagation();
      _this.openAfterFocus = false;
      setTimeout(function () {
        return _this.focusInput();
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onScroll", function (event) {
      if (typeof _this.props.closeMenuOnScroll === 'boolean') {
        if (event.target instanceof HTMLElement && isDocumentElement(event.target)) {
          _this.props.onMenuClose();
        }
      } else if (typeof _this.props.closeMenuOnScroll === 'function') {
        if (_this.props.closeMenuOnScroll(event)) {
          _this.props.onMenuClose();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onCompositionStart", function () {
      _this.isComposing = true;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onCompositionEnd", function () {
      _this.isComposing = false;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTouchStart", function (_ref4) {
      var touches = _ref4.touches;
      var touch = touches.item(0);

      if (!touch) {
        return;
      }

      _this.initialTouchX = touch.clientX;
      _this.initialTouchY = touch.clientY;
      _this.userIsDragging = false;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTouchMove", function (_ref5) {
      var touches = _ref5.touches;
      var touch = touches.item(0);

      if (!touch) {
        return;
      }

      var deltaX = Math.abs(touch.clientX - _this.initialTouchX);
      var deltaY = Math.abs(touch.clientY - _this.initialTouchY);
      var moveThreshold = 5;
      _this.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onTouchEnd", function (event) {
      if (_this.userIsDragging) return; // close the menu if the user taps outside
      // we're checking on event.target here instead of event.currentTarget, because we want to assert information
      // on events on child elements, not the document (which we've attached this handler to).

      if (_this.controlRef && !_this.controlRef.contains(event.target) && _this.menuListRef && !_this.menuListRef.contains(event.target)) {
        _this.blurInput();
      } // reset move vars


      _this.initialTouchX = 0;
      _this.initialTouchY = 0;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onControlTouchEnd", function (event) {
      if (_this.userIsDragging) return;

      _this.onControlMouseDown(event);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClearIndicatorTouchEnd", function (event) {
      if (_this.userIsDragging) return;

      _this.onClearIndicatorMouseDown(event);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onDropdownIndicatorTouchEnd", function (event) {
      if (_this.userIsDragging) return;

      _this.onDropdownIndicatorMouseDown(event);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleInputChange", function (event) {
      var inputValue = event.currentTarget.value;
      _this.inputIsHiddenAfterUpdate = false;

      _this.onInputChange(inputValue, {
        action: 'input-change'
      });

      _this.onMenuOpen();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onInputFocus", function (event) {
      var _this$props5 = _this.props,
          isSearchable = _this$props5.isSearchable,
          isMulti = _this$props5.isMulti;

      if (_this.props.onFocus) {
        _this.props.onFocus(event);
      }

      _this.inputIsHiddenAfterUpdate = false;

      _this.announceAriaLiveContext({
        event: 'input',
        context: {
          isSearchable: isSearchable,
          isMulti: isMulti
        }
      });

      _this.setState({
        isFocused: true
      });

      if (_this.openAfterFocus || _this.props.openMenuOnFocus) {
        _this.openMenu('first');
      }

      _this.openAfterFocus = false;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onInputBlur", function (event) {
      if (_this.menuListRef && _this.menuListRef.contains(document.activeElement)) {
        _this.inputRef.focus();

        return;
      }

      if (_this.props.onBlur) {
        _this.props.onBlur(event);
      }

      _this.onInputChange('', {
        action: 'input-blur'
      });

      _this.onMenuClose();

      _this.setState({
        focusedValue: null,
        isFocused: false
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onOptionHover", function (focusedOption) {
      if (_this.blockOptionHover || _this.state.focusedOption === focusedOption) {
        return;
      }

      _this.setState({
        focusedOption: focusedOption
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "shouldHideSelectedOptions", function () {
      var _this$props6 = _this.props,
          hideSelectedOptions = _this$props6.hideSelectedOptions,
          isMulti = _this$props6.isMulti;
      if (hideSelectedOptions === undefined) return isMulti;
      return hideSelectedOptions;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyDown", function (event) {
      var _this$props7 = _this.props,
          isMulti = _this$props7.isMulti,
          backspaceRemovesValue = _this$props7.backspaceRemovesValue,
          escapeClearsValue = _this$props7.escapeClearsValue,
          inputValue = _this$props7.inputValue,
          isClearable = _this$props7.isClearable,
          isDisabled = _this$props7.isDisabled,
          menuIsOpen = _this$props7.menuIsOpen,
          onKeyDown = _this$props7.onKeyDown,
          tabSelectsValue = _this$props7.tabSelectsValue,
          openMenuOnFocus = _this$props7.openMenuOnFocus;
      var _this$state2 = _this.state,
          focusedOption = _this$state2.focusedOption,
          focusedValue = _this$state2.focusedValue,
          selectValue = _this$state2.selectValue;
      if (isDisabled) return;

      if (typeof onKeyDown === 'function') {
        onKeyDown(event);

        if (event.defaultPrevented) {
          return;
        }
      } // Block option hover events when the user has just pressed a key


      _this.blockOptionHover = true;

      switch (event.key) {
        case 'ArrowLeft':
          if (!isMulti || inputValue) return;

          _this.focusValue('previous');

          break;

        case 'ArrowRight':
          if (!isMulti || inputValue) return;

          _this.focusValue('next');

          break;

        case 'Delete':
        case 'Backspace':
          if (inputValue) return;

          if (focusedValue) {
            _this.removeValue(focusedValue);
          } else {
            if (!backspaceRemovesValue) return;

            if (isMulti) {
              _this.popValue();
            } else if (isClearable) {
              _this.clearValue();
            }
          }

          break;

        case 'Tab':
          if (_this.isComposing) return;

          if (event.shiftKey || !menuIsOpen || !tabSelectsValue || !focusedOption || // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          openMenuOnFocus && _this.isOptionSelected(focusedOption, selectValue)) {
            return;
          }

          _this.selectOption(focusedOption);

          break;

        case 'Enter':
          if (event.keyCode === 229) {
            // ignore the keydown event from an Input Method Editor(IME)
            // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
            break;
          }

          if (menuIsOpen) {
            if (!focusedOption) return;
            if (_this.isComposing) return;

            _this.selectOption(focusedOption);

            break;
          }

          return;

        case 'Escape':
          if (menuIsOpen) {
            _this.inputIsHiddenAfterUpdate = false;

            _this.onInputChange('', {
              action: 'menu-close'
            });

            _this.onMenuClose();
          } else if (isClearable && escapeClearsValue) {
            _this.clearValue();
          }

          break;

        case ' ':
          // space
          if (inputValue) {
            return;
          }

          if (!menuIsOpen) {
            _this.openMenu('first');

            break;
          }

          if (!focusedOption) return;

          _this.selectOption(focusedOption);

          break;

        case 'ArrowUp':
          if (menuIsOpen) {
            _this.focusOption('up');
          } else {
            _this.openMenu('last');
          }

          break;

        case 'ArrowDown':
          if (menuIsOpen) {
            _this.focusOption('down');
          } else {
            _this.openMenu('first');
          }

          break;

        case 'PageUp':
          if (!menuIsOpen) return;

          _this.focusOption('pageup');

          break;

        case 'PageDown':
          if (!menuIsOpen) return;

          _this.focusOption('pagedown');

          break;

        case 'Home':
          if (!menuIsOpen) return;

          _this.focusOption('first');

          break;

        case 'End':
          if (!menuIsOpen) return;

          _this.focusOption('last');

          break;

        default:
          return;
      }

      event.preventDefault();
    });

    var value = _props.value;
    _this.cacheComponents = (0,memoize_one__WEBPACK_IMPORTED_MODULE_6__["default"])(_this.cacheComponents, exportedEqual).bind(_assertThisInitialized(_assertThisInitialized(_this)));

    _this.cacheComponents(_props.components);

    _this.instancePrefix = 'react-select-' + (_this.props.instanceId || ++instanceId);

    var _selectValue = cleanValue(value);

    var _menuOptions = _this.buildMenuOptions(_props, _selectValue);

    _this.state.menuOptions = _menuOptions;
    _this.state.selectValue = _selectValue;
    return _this;
  }

  _createClass(Select, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startListeningComposition();
      this.startListeningToTouch();

      if (this.props.closeMenuOnScroll && document && document.addEventListener) {
        // Listen to all scroll events, and filter them out inside of 'onScroll'
        document.addEventListener('scroll', this.onScroll, true);
      }

      if (this.props.autoFocus) {
        this.focusInput();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this$props8 = this.props,
          options = _this$props8.options,
          value = _this$props8.value,
          inputValue = _this$props8.inputValue; // re-cache custom components

      this.cacheComponents(nextProps.components); // rebuild the menu options

      if (nextProps.value !== value || nextProps.options !== options || nextProps.inputValue !== inputValue) {
        var selectValue = cleanValue(nextProps.value);
        var menuOptions = this.buildMenuOptions(nextProps, selectValue);
        var focusedValue = this.getNextFocusedValue(selectValue);
        var focusedOption = this.getNextFocusedOption(menuOptions.focusable);
        this.setState({
          menuOptions: menuOptions,
          selectValue: selectValue,
          focusedOption: focusedOption,
          focusedValue: focusedValue
        });
      } // some updates should toggle the state of the input visibility


      if (this.inputIsHiddenAfterUpdate != null) {
        this.setState({
          inputIsHidden: this.inputIsHiddenAfterUpdate
        });
        delete this.inputIsHiddenAfterUpdate;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props9 = this.props,
          isDisabled = _this$props9.isDisabled,
          menuIsOpen = _this$props9.menuIsOpen;
      var isFocused = this.state.isFocused;

      if ( // ensure focus is restored correctly when the control becomes enabled
      isFocused && !isDisabled && prevProps.isDisabled || // ensure focus is on the Input when the menu opens
      isFocused && menuIsOpen && !prevProps.menuIsOpen) {
        this.focusInput();
      } // scroll the focused option into view if necessary


      if (this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate) {
        scrollIntoView(this.menuListRef, this.focusedOptionRef);
      }

      this.scrollToFocusedOptionOnUpdate = false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopListeningComposition();
      this.stopListeningToTouch();
      document.removeEventListener('scroll', this.onScroll, true);
    }
  }, {
    key: "onMenuOpen",
    // ==============================
    // Consumer Handlers
    // ==============================
    value: function onMenuOpen() {
      this.props.onMenuOpen();
    }
  }, {
    key: "onMenuClose",
    value: function onMenuClose() {
      var _this$props10 = this.props,
          isSearchable = _this$props10.isSearchable,
          isMulti = _this$props10.isMulti;
      this.announceAriaLiveContext({
        event: 'input',
        context: {
          isSearchable: isSearchable,
          isMulti: isMulti
        }
      });
      this.onInputChange('', {
        action: 'menu-close'
      });
      this.props.onMenuClose();
    }
  }, {
    key: "onInputChange",
    value: function onInputChange(newValue, actionMeta) {
      this.props.onInputChange(newValue, actionMeta);
    } // ==============================
    // Methods
    // ==============================

  }, {
    key: "focusInput",
    value: function focusInput() {
      if (!this.inputRef) return;
      this.inputRef.focus();
    }
  }, {
    key: "blurInput",
    value: function blurInput() {
      if (!this.inputRef) return;
      this.inputRef.blur();
    } // aliased for consumers

  }, {
    key: "openMenu",
    value: function openMenu(focusOption) {
      var _this$state3 = this.state,
          menuOptions = _this$state3.menuOptions,
          selectValue = _this$state3.selectValue,
          isFocused = _this$state3.isFocused;
      var isMulti = this.props.isMulti;
      var openAtIndex = focusOption === 'first' ? 0 : menuOptions.focusable.length - 1;

      if (!isMulti) {
        var selectedIndex = menuOptions.focusable.indexOf(selectValue[0]);

        if (selectedIndex > -1) {
          openAtIndex = selectedIndex;
        }
      } // only scroll if the menu isn't already open


      this.scrollToFocusedOptionOnUpdate = !(isFocused && this.menuListRef);
      this.inputIsHiddenAfterUpdate = false;
      this.onMenuOpen();
      this.setState({
        focusedValue: null,
        focusedOption: menuOptions.focusable[openAtIndex]
      });
      this.announceAriaLiveContext({
        event: 'menu'
      });
    }
  }, {
    key: "focusValue",
    value: function focusValue(direction) {
      var _this$props11 = this.props,
          isMulti = _this$props11.isMulti,
          isSearchable = _this$props11.isSearchable;
      var _this$state4 = this.state,
          selectValue = _this$state4.selectValue,
          focusedValue = _this$state4.focusedValue; // Only multiselects support value focusing

      if (!isMulti) return;
      this.setState({
        focusedOption: null
      });
      var focusedIndex = selectValue.indexOf(focusedValue);

      if (!focusedValue) {
        focusedIndex = -1;
        this.announceAriaLiveContext({
          event: 'value'
        });
      }

      var lastIndex = selectValue.length - 1;
      var nextFocus = -1;
      if (!selectValue.length) return;

      switch (direction) {
        case 'previous':
          if (focusedIndex === 0) {
            // don't cycle from the start to the end
            nextFocus = 0;
          } else if (focusedIndex === -1) {
            // if nothing is focused, focus the last value first
            nextFocus = lastIndex;
          } else {
            nextFocus = focusedIndex - 1;
          }

          break;

        case 'next':
          if (focusedIndex > -1 && focusedIndex < lastIndex) {
            nextFocus = focusedIndex + 1;
          }

          break;
      }

      if (nextFocus === -1) {
        this.announceAriaLiveContext({
          event: 'input',
          context: {
            isSearchable: isSearchable,
            isMulti: isMulti
          }
        });
      }

      this.setState({
        inputIsHidden: nextFocus === -1 ? false : true,
        focusedValue: selectValue[nextFocus]
      });
    }
  }, {
    key: "focusOption",
    value: function focusOption() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
      var pageSize = this.props.pageSize;
      var _this$state5 = this.state,
          focusedOption = _this$state5.focusedOption,
          menuOptions = _this$state5.menuOptions;
      var options = menuOptions.focusable;
      if (!options.length) return;
      var nextFocus = 0; // handles 'first'

      var focusedIndex = options.indexOf(focusedOption);

      if (!focusedOption) {
        focusedIndex = -1;
        this.announceAriaLiveContext({
          event: 'menu'
        });
      }

      if (direction === 'up') {
        nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
      } else if (direction === 'down') {
        nextFocus = (focusedIndex + 1) % options.length;
      } else if (direction === 'pageup') {
        nextFocus = focusedIndex - pageSize;
        if (nextFocus < 0) nextFocus = 0;
      } else if (direction === 'pagedown') {
        nextFocus = focusedIndex + pageSize;
        if (nextFocus > options.length - 1) nextFocus = options.length - 1;
      } else if (direction === 'last') {
        nextFocus = options.length - 1;
      }

      this.scrollToFocusedOptionOnUpdate = true;
      this.setState({
        focusedOption: options[nextFocus],
        focusedValue: null
      });
      this.announceAriaLiveContext({
        event: 'menu',
        context: {
          isDisabled: isOptionDisabled(options[nextFocus])
        }
      });
    }
  }, {
    key: "getTheme",
    // ==============================
    // Getters
    // ==============================
    value: function getTheme() {
      // Use the default theme if there are no customizations.
      if (!this.props.theme) {
        return defaultTheme;
      } // If the theme prop is a function, assume the function
      // knows how to merge the passed-in default theme with
      // its own modifications.


      if (typeof this.props.theme === 'function') {
        return this.props.theme(defaultTheme);
      } // Otherwise, if a plain theme object was passed in,
      // overlay it with the default theme.


      return _objectSpread({}, defaultTheme, this.props.theme);
    }
  }, {
    key: "getCommonProps",
    value: function getCommonProps() {
      var clearValue = this.clearValue,
          getStyles = this.getStyles,
          setValue = this.setValue,
          selectOption = this.selectOption,
          props = this.props;
      var classNamePrefix = props.classNamePrefix,
          isMulti = props.isMulti,
          isRtl = props.isRtl,
          options = props.options;
      var selectValue = this.state.selectValue;
      var hasValue = this.hasValue();

      var getValue = function getValue() {
        return selectValue;
      };

      var cx = classNames.bind(null, classNamePrefix);
      return {
        cx: cx,
        clearValue: clearValue,
        getStyles: getStyles,
        getValue: getValue,
        hasValue: hasValue,
        isMulti: isMulti,
        isRtl: isRtl,
        options: options,
        selectOption: selectOption,
        setValue: setValue,
        selectProps: props,
        theme: this.getTheme()
      };
    }
  }, {
    key: "getNextFocusedValue",
    value: function getNextFocusedValue(nextSelectValue) {
      if (this.clearFocusValueOnUpdate) {
        this.clearFocusValueOnUpdate = false;
        return null;
      }

      var _this$state6 = this.state,
          focusedValue = _this$state6.focusedValue,
          lastSelectValue = _this$state6.selectValue;
      var lastFocusedIndex = lastSelectValue.indexOf(focusedValue);

      if (lastFocusedIndex > -1) {
        var nextFocusedIndex = nextSelectValue.indexOf(focusedValue);

        if (nextFocusedIndex > -1) {
          // the focused value is still in the selectValue, return it
          return focusedValue;
        } else if (lastFocusedIndex < nextSelectValue.length) {
          // the focusedValue is not present in the next selectValue array by
          // reference, so return the new value at the same index
          return nextSelectValue[lastFocusedIndex];
        }
      }

      return null;
    }
  }, {
    key: "getNextFocusedOption",
    value: function getNextFocusedOption(options) {
      var lastFocusedOption = this.state.focusedOption;
      return lastFocusedOption && options.indexOf(lastFocusedOption) > -1 ? lastFocusedOption : options[0];
    }
  }, {
    key: "hasValue",
    value: function hasValue() {
      var selectValue = this.state.selectValue;
      return selectValue.length > 0;
    }
  }, {
    key: "hasOptions",
    value: function hasOptions() {
      return !!this.state.menuOptions.render.length;
    }
  }, {
    key: "countOptions",
    value: function countOptions() {
      return this.state.menuOptions.focusable.length;
    }
  }, {
    key: "isClearable",
    value: function isClearable() {
      var _this$props12 = this.props,
          isClearable = _this$props12.isClearable,
          isMulti = _this$props12.isMulti; // single select, by default, IS NOT clearable
      // multi select, by default, IS clearable

      if (isClearable === undefined) return isMulti;
      return isClearable;
    }
  }, {
    key: "isOptionDisabled",
    value: function isOptionDisabled$$1(option, selectValue) {
      return typeof this.props.isOptionDisabled === 'function' ? this.props.isOptionDisabled(option, selectValue) : false;
    }
  }, {
    key: "isOptionSelected",
    value: function isOptionSelected(option, selectValue) {
      var _this2 = this;

      if (selectValue.indexOf(option) > -1) return true;

      if (typeof this.props.isOptionSelected === 'function') {
        return this.props.isOptionSelected(option, selectValue);
      }

      var candidate = this.getOptionValue(option);
      return selectValue.some(function (i) {
        return _this2.getOptionValue(i) === candidate;
      });
    }
  }, {
    key: "filterOption",
    value: function filterOption(option, inputValue) {
      return this.props.filterOption ? this.props.filterOption(option, inputValue) : true;
    }
  }, {
    key: "formatOptionLabel",
    value: function formatOptionLabel(data, context) {
      if (typeof this.props.formatOptionLabel === 'function') {
        var inputValue = this.props.inputValue;
        var selectValue = this.state.selectValue;
        return this.props.formatOptionLabel(data, {
          context: context,
          inputValue: inputValue,
          selectValue: selectValue
        });
      } else {
        return this.getOptionLabel(data);
      }
    }
  }, {
    key: "formatGroupLabel",
    value: function formatGroupLabel$$1(data) {
      return this.props.formatGroupLabel(data);
    } // ==============================
    // Mouse Handlers
    // ==============================

  }, {
    key: "startListeningComposition",
    // ==============================
    // Composition Handlers
    // ==============================
    value: function startListeningComposition() {
      if (document && document.addEventListener) {
        document.addEventListener('compositionstart', this.onCompositionStart, false);
        document.addEventListener('compositionend', this.onCompositionEnd, false);
      }
    }
  }, {
    key: "stopListeningComposition",
    value: function stopListeningComposition() {
      if (document && document.removeEventListener) {
        document.removeEventListener('compositionstart', this.onCompositionStart);
        document.removeEventListener('compositionend', this.onCompositionEnd);
      }
    }
  }, {
    key: "startListeningToTouch",
    // ==============================
    // Touch Handlers
    // ==============================
    value: function startListeningToTouch() {
      if (document && document.addEventListener) {
        document.addEventListener('touchstart', this.onTouchStart, false);
        document.addEventListener('touchmove', this.onTouchMove, false);
        document.addEventListener('touchend', this.onTouchEnd, false);
      }
    }
  }, {
    key: "stopListeningToTouch",
    value: function stopListeningToTouch() {
      if (document && document.removeEventListener) {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
      }
    }
  }, {
    key: "buildMenuOptions",
    // ==============================
    // Menu Options
    // ==============================
    value: function buildMenuOptions(props, selectValue) {
      var _this3 = this;

      var _props$inputValue = props.inputValue,
          inputValue = _props$inputValue === void 0 ? '' : _props$inputValue,
          options = props.options;

      var toOption = function toOption(option, id) {
        var isDisabled = _this3.isOptionDisabled(option, selectValue);

        var isSelected = _this3.isOptionSelected(option, selectValue);

        var label = _this3.getOptionLabel(option);

        var value = _this3.getOptionValue(option);

        if (_this3.shouldHideSelectedOptions() && isSelected || !_this3.filterOption({
          label: label,
          value: value,
          data: option
        }, inputValue)) {
          return;
        }

        var onHover = isDisabled ? undefined : function () {
          return _this3.onOptionHover(option);
        };
        var onSelect = isDisabled ? undefined : function () {
          return _this3.selectOption(option);
        };
        var optionId = "".concat(_this3.getElementId('option'), "-").concat(id);
        return {
          innerProps: {
            id: optionId,
            onClick: onSelect,
            onMouseMove: onHover,
            onMouseOver: onHover,
            tabIndex: -1
          },
          data: option,
          isDisabled: isDisabled,
          isSelected: isSelected,
          key: optionId,
          label: label,
          type: 'option',
          value: value
        };
      };

      return options.reduce(function (acc, item, itemIndex) {
        if (item.options) {
          // TODO needs a tidier implementation
          if (!_this3.hasGroups) _this3.hasGroups = true;
          var items = item.options;
          var children = items.map(function (child, i) {
            var option = toOption(child, "".concat(itemIndex, "-").concat(i));
            if (option) acc.focusable.push(child);
            return option;
          }).filter(Boolean);

          if (children.length) {
            var groupId = "".concat(_this3.getElementId('group'), "-").concat(itemIndex);
            acc.render.push({
              type: 'group',
              key: groupId,
              data: item,
              options: children
            });
          }
        } else {
          var option = toOption(item, "".concat(itemIndex));

          if (option) {
            acc.render.push(option);
            acc.focusable.push(item);
          }
        }

        return acc;
      }, {
        render: [],
        focusable: []
      });
    } // ==============================
    // Renderers
    // ==============================

  }, {
    key: "constructAriaLiveMessage",
    value: function constructAriaLiveMessage() {
      var _this$state7 = this.state,
          ariaLiveContext = _this$state7.ariaLiveContext,
          selectValue = _this$state7.selectValue,
          focusedValue = _this$state7.focusedValue,
          focusedOption = _this$state7.focusedOption;
      var _this$props13 = this.props,
          options = _this$props13.options,
          menuIsOpen = _this$props13.menuIsOpen,
          inputValue = _this$props13.inputValue,
          screenReaderStatus = _this$props13.screenReaderStatus; // An aria live message representing the currently focused value in the select.

      var focusedValueMsg = focusedValue ? valueFocusAriaMessage({
        focusedValue: focusedValue,
        getOptionLabel: this.getOptionLabel,
        selectValue: selectValue
      }) : ''; // An aria live message representing the currently focused option in the select.

      var focusedOptionMsg = focusedOption && menuIsOpen ? optionFocusAriaMessage({
        focusedOption: focusedOption,
        getOptionLabel: this.getOptionLabel,
        options: options
      }) : ''; // An aria live message representing the set of focusable results and current searchterm/inputvalue.

      var resultsMsg = resultsAriaMessage({
        inputValue: inputValue,
        screenReaderMessage: screenReaderStatus({
          count: this.countOptions()
        })
      });
      return "".concat(focusedValueMsg, " ").concat(focusedOptionMsg, " ").concat(resultsMsg, " ").concat(ariaLiveContext);
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      var _this$props14 = this.props,
          isDisabled = _this$props14.isDisabled,
          isSearchable = _this$props14.isSearchable,
          inputId = _this$props14.inputId,
          inputValue = _this$props14.inputValue,
          tabIndex = _this$props14.tabIndex;
      var Input = this.components.Input;
      var inputIsHidden = this.state.inputIsHidden;
      var id = inputId || this.getElementId('input');

      if (!isSearchable) {
        // use a dummy input to maintain focus/blur functionality
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DummyInput, {
          id: id,
          innerRef: this.getInputRef,
          onBlur: this.onInputBlur,
          onChange: noop,
          onFocus: this.onInputFocus,
          readOnly: true,
          disabled: isDisabled,
          tabIndex: tabIndex,
          value: ""
        });
      } // aria attributes makes the JSX "noisy", separated for clarity


      var ariaAttributes = {
        'aria-autocomplete': 'list',
        'aria-label': this.props['aria-label'],
        'aria-labelledby': this.props['aria-labelledby']
      };
      var _this$commonProps = this.commonProps,
          cx = _this$commonProps.cx,
          theme = _this$commonProps.theme,
          selectProps = _this$commonProps.selectProps;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Input, _extends({
        autoCapitalize: "none",
        autoComplete: "off",
        autoCorrect: "off",
        cx: cx,
        getStyles: this.getStyles,
        id: id,
        innerRef: this.getInputRef,
        isDisabled: isDisabled,
        isHidden: inputIsHidden,
        onBlur: this.onInputBlur,
        onChange: this.handleInputChange,
        onFocus: this.onInputFocus,
        selectProps: selectProps,
        spellCheck: "false",
        tabIndex: tabIndex,
        theme: theme,
        type: "text",
        value: inputValue
      }, ariaAttributes));
    }
  }, {
    key: "renderPlaceholderOrValue",
    value: function renderPlaceholderOrValue() {
      var _this4 = this;

      var _this$components = this.components,
          MultiValue = _this$components.MultiValue,
          MultiValueContainer = _this$components.MultiValueContainer,
          MultiValueLabel = _this$components.MultiValueLabel,
          MultiValueRemove = _this$components.MultiValueRemove,
          SingleValue = _this$components.SingleValue,
          Placeholder = _this$components.Placeholder;
      var commonProps = this.commonProps;
      var _this$props15 = this.props,
          controlShouldRenderValue = _this$props15.controlShouldRenderValue,
          isDisabled = _this$props15.isDisabled,
          isMulti = _this$props15.isMulti,
          inputValue = _this$props15.inputValue,
          placeholder = _this$props15.placeholder;
      var _this$state8 = this.state,
          selectValue = _this$state8.selectValue,
          focusedValue = _this$state8.focusedValue,
          isFocused = _this$state8.isFocused;

      if (!this.hasValue() || !controlShouldRenderValue) {
        return inputValue ? null : react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Placeholder, _extends({}, commonProps, {
          key: "placeholder",
          isDisabled: isDisabled,
          isFocused: isFocused
        }), placeholder);
      }

      if (isMulti) {
        var selectValues = selectValue.map(function (opt) {
          var isOptionFocused = opt === focusedValue;
          return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MultiValue, _extends({}, commonProps, {
            components: {
              Container: MultiValueContainer,
              Label: MultiValueLabel,
              Remove: MultiValueRemove
            },
            isFocused: isOptionFocused,
            isDisabled: isDisabled,
            key: _this4.getOptionValue(opt),
            removeProps: {
              onClick: function onClick() {
                return _this4.removeValue(opt);
              },
              onTouchEnd: function onTouchEnd() {
                return _this4.removeValue(opt);
              },
              onMouseDown: function onMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();
              }
            },
            data: opt
          }), _this4.formatOptionLabel(opt, 'value'));
        });
        return selectValues;
      }

      if (inputValue) {
        return null;
      }

      var singleValue = selectValue[0];
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SingleValue, _extends({}, commonProps, {
        data: singleValue,
        isDisabled: isDisabled
      }), this.formatOptionLabel(singleValue, 'value'));
    }
  }, {
    key: "renderClearIndicator",
    value: function renderClearIndicator() {
      var ClearIndicator = this.components.ClearIndicator;
      var commonProps = this.commonProps;
      var _this$props16 = this.props,
          isDisabled = _this$props16.isDisabled,
          isLoading = _this$props16.isLoading;
      var isFocused = this.state.isFocused;

      if (!this.isClearable() || !ClearIndicator || isDisabled || !this.hasValue() || isLoading) {
        return null;
      }

      var innerProps = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ClearIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderLoadingIndicator",
    value: function renderLoadingIndicator() {
      var LoadingIndicator = this.components.LoadingIndicator;
      var commonProps = this.commonProps;
      var _this$props17 = this.props,
          isDisabled = _this$props17.isDisabled,
          isLoading = _this$props17.isLoading;
      var isFocused = this.state.isFocused;
      if (!LoadingIndicator || !isLoading) return null;
      var innerProps = {
        'aria-hidden': 'true'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderIndicatorSeparator",
    value: function renderIndicatorSeparator() {
      var _this$components2 = this.components,
          DropdownIndicator = _this$components2.DropdownIndicator,
          IndicatorSeparator = _this$components2.IndicatorSeparator; // separator doesn't make sense without the dropdown indicator

      if (!DropdownIndicator || !IndicatorSeparator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IndicatorSeparator, _extends({}, commonProps, {
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderDropdownIndicator",
    value: function renderDropdownIndicator() {
      var DropdownIndicator = this.components.DropdownIndicator;
      if (!DropdownIndicator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;
      var innerProps = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        'aria-hidden': 'true'
      };
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DropdownIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this5 = this;

      var _this$components3 = this.components,
          Group = _this$components3.Group,
          GroupHeading = _this$components3.GroupHeading,
          Menu$$1 = _this$components3.Menu,
          MenuList$$1 = _this$components3.MenuList,
          MenuPortal$$1 = _this$components3.MenuPortal,
          LoadingMessage$$1 = _this$components3.LoadingMessage,
          NoOptionsMessage$$1 = _this$components3.NoOptionsMessage,
          Option = _this$components3.Option;
      var commonProps = this.commonProps;
      var _this$state9 = this.state,
          focusedOption = _this$state9.focusedOption,
          menuOptions = _this$state9.menuOptions;
      var _this$props18 = this.props,
          captureMenuScroll = _this$props18.captureMenuScroll,
          inputValue = _this$props18.inputValue,
          isLoading = _this$props18.isLoading,
          loadingMessage = _this$props18.loadingMessage,
          minMenuHeight = _this$props18.minMenuHeight,
          maxMenuHeight = _this$props18.maxMenuHeight,
          menuIsOpen = _this$props18.menuIsOpen,
          menuPlacement = _this$props18.menuPlacement,
          menuPosition = _this$props18.menuPosition,
          menuPortalTarget = _this$props18.menuPortalTarget,
          menuShouldBlockScroll = _this$props18.menuShouldBlockScroll,
          menuShouldScrollIntoView = _this$props18.menuShouldScrollIntoView,
          noOptionsMessage = _this$props18.noOptionsMessage,
          onMenuScrollToTop = _this$props18.onMenuScrollToTop,
          onMenuScrollToBottom = _this$props18.onMenuScrollToBottom;
      if (!menuIsOpen) return null; // TODO: Internal Option Type here

      var render = function render(props) {
        // for performance, the menu options in state aren't changed when the
        // focused option changes so we calculate additional props based on that
        var isFocused = focusedOption === props.data;
        props.innerRef = isFocused ? _this5.getFocusedOptionRef : undefined;
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, _extends({}, commonProps, props, {
          isFocused: isFocused
        }), _this5.formatOptionLabel(props.data, 'menu'));
      };

      var menuUI;

      if (this.hasOptions()) {
        menuUI = menuOptions.render.map(function (item) {
          if (item.type === 'group') {
            var type = item.type,
                group = _objectWithoutProperties(item, ["type"]);

            var headingId = "".concat(item.key, "-heading");
            return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Group, _extends({}, commonProps, group, {
              Heading: GroupHeading,
              headingProps: {
                id: headingId
              },
              label: _this5.formatGroupLabel(item.data)
            }), item.options.map(function (option) {
              return render(option);
            }));
          } else if (item.type === 'option') {
            return render(item);
          }
        });
      } else if (isLoading) {
        var message = loadingMessage({
          inputValue: inputValue
        });
        if (message === null) return null;
        menuUI = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoadingMessage$$1, commonProps, message);
      } else {
        var _message = noOptionsMessage({
          inputValue: inputValue
        });

        if (_message === null) return null;
        menuUI = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NoOptionsMessage$$1, commonProps, _message);
      }

      var menuPlacementProps = {
        minMenuHeight: minMenuHeight,
        maxMenuHeight: maxMenuHeight,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition,
        menuShouldScrollIntoView: menuShouldScrollIntoView
      };
      var menuElement = react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MenuPlacer, _extends({}, commonProps, menuPlacementProps), function (_ref6) {
        var ref = _ref6.ref,
            _ref6$placerProps = _ref6.placerProps,
            placement = _ref6$placerProps.placement,
            maxHeight = _ref6$placerProps.maxHeight;
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Menu$$1, _extends({}, commonProps, menuPlacementProps, {
          innerRef: ref,
          innerProps: {
            onMouseDown: _this5.onMenuMouseDown,
            onMouseMove: _this5.onMenuMouseMove
          },
          isLoading: isLoading,
          placement: placement
        }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ScrollCaptorSwitch, {
          isEnabled: captureMenuScroll,
          onTopArrive: onMenuScrollToTop,
          onBottomArrive: onMenuScrollToBottom
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ScrollBlock, {
          isEnabled: menuShouldBlockScroll
        }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MenuList$$1, _extends({}, commonProps, {
          innerRef: _this5.getMenuListRef,
          isLoading: isLoading,
          maxHeight: maxHeight
        }), menuUI))));
      }); // positioning behaviour is almost identical for portalled and fixed,
      // so we use the same component. the actual portalling logic is forked
      // within the component based on `menuPosition`

      return menuPortalTarget || menuPosition === 'fixed' ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MenuPortal$$1, _extends({}, commonProps, {
        appendTo: menuPortalTarget,
        controlElement: this.controlRef,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition
      }), menuElement) : menuElement;
    }
  }, {
    key: "renderFormField",
    value: function renderFormField() {
      var _this6 = this;

      var _this$props19 = this.props,
          delimiter = _this$props19.delimiter,
          isDisabled = _this$props19.isDisabled,
          isMulti = _this$props19.isMulti,
          name = _this$props19.name;
      var selectValue = this.state.selectValue;
      if (!name || isDisabled) return;

      if (isMulti) {
        if (delimiter) {
          var value = selectValue.map(function (opt) {
            return _this6.getOptionValue(opt);
          }).join(delimiter);
          return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
            name: name,
            type: "hidden",
            value: value
          });
        } else {
          var input = selectValue.length > 0 ? selectValue.map(function (opt, i) {
            return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
              key: "i-".concat(i),
              name: name,
              type: "hidden",
              value: _this6.getOptionValue(opt)
            });
          }) : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
            name: name,
            type: "hidden"
          });
          return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, input);
        }
      } else {
        var _value = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';

        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
          name: name,
          type: "hidden",
          value: _value
        });
      }
    }
  }, {
    key: "renderLiveRegion",
    value: function renderLiveRegion() {
      if (!this.state.isFocused) return null;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(A11yText, {
        "aria-live": "assertive"
      }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        id: "aria-selection-event"
      }, "\xA0", this.state.ariaLiveSelection), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        id: "aria-context"
      }, "\xA0", this.constructAriaLiveMessage()));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$components4 = this.components,
          Control = _this$components4.Control,
          IndicatorsContainer = _this$components4.IndicatorsContainer,
          SelectContainer = _this$components4.SelectContainer,
          ValueContainer = _this$components4.ValueContainer;
      var _this$props20 = this.props,
          className = _this$props20.className,
          id = _this$props20.id,
          isDisabled = _this$props20.isDisabled,
          menuIsOpen = _this$props20.menuIsOpen;
      var isFocused = this.state.isFocused;
      var commonProps = this.commonProps = this.getCommonProps();
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SelectContainer, _extends({}, commonProps, {
        className: className,
        innerProps: {
          id: id,
          onKeyDown: this.onKeyDown
        },
        isDisabled: isDisabled,
        isFocused: isFocused
      }), this.renderLiveRegion(), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Control, _extends({}, commonProps, {
        innerRef: this.getControlRef,
        innerProps: {
          onMouseDown: this.onControlMouseDown,
          onTouchEnd: this.onControlTouchEnd
        },
        isDisabled: isDisabled,
        isFocused: isFocused,
        menuIsOpen: menuIsOpen
      }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ValueContainer, _extends({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderPlaceholderOrValue(), this.renderInput()), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IndicatorsContainer, _extends({}, commonProps, {
        isDisabled: isDisabled
      }), this.renderClearIndicator(), this.renderLoadingIndicator(), this.renderIndicatorSeparator(), this.renderDropdownIndicator())), this.renderMenu(), this.renderFormField());
    }
  }]);

  return Select;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

_defineProperty(Select, "defaultProps", defaultProps);

var defaultProps$1 = {
  defaultInputValue: '',
  defaultMenuIsOpen: false,
  defaultValue: null
};

var manageState = function manageState(SelectComponent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inherits(StateManager, _Component);

    function StateManager() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, StateManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StateManager)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "select", void 0);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
        inputValue: _this.props.inputValue !== undefined ? _this.props.inputValue : _this.props.defaultInputValue,
        menuIsOpen: _this.props.menuIsOpen !== undefined ? _this.props.menuIsOpen : _this.props.defaultMenuIsOpen,
        value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onChange", function (value, actionMeta) {
        _this.callProp('onChange', value, actionMeta);

        _this.setState({
          value: value
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onInputChange", function (value, actionMeta) {
        // TODO: for backwards compatibility, we allow the prop to return a new
        // value, but now inputValue is a controllable prop we probably shouldn't
        var newValue = _this.callProp('onInputChange', value, actionMeta);

        _this.setState({
          inputValue: newValue !== undefined ? newValue : value
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMenuOpen", function () {
        _this.callProp('onMenuOpen');

        _this.setState({
          menuIsOpen: true
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMenuClose", function () {
        _this.callProp('onMenuClose');

        _this.setState({
          menuIsOpen: false
        });
      });

      return _this;
    }

    _createClass(StateManager, [{
      key: "focus",
      value: function focus() {
        this.select.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        this.select.blur();
      } // FIXME: untyped flow code, return any

    }, {
      key: "getProp",
      value: function getProp(key) {
        return this.props[key] !== undefined ? this.props[key] : this.state[key];
      } // FIXME: untyped flow code, return any

    }, {
      key: "callProp",
      value: function callProp(name) {
        if (typeof this.props[name] === 'function') {
          var _this$props;

          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          return (_this$props = this.props)[name].apply(_this$props, args);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
            defaultInputValue = _this$props2.defaultInputValue,
            defaultMenuIsOpen = _this$props2.defaultMenuIsOpen,
            defaultValue = _this$props2.defaultValue,
            props = _objectWithoutProperties(_this$props2, ["defaultInputValue", "defaultMenuIsOpen", "defaultValue"]);

        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SelectComponent, _extends({}, props, {
          ref: function ref(_ref) {
            _this2.select = _ref;
          },
          inputValue: this.getProp('inputValue'),
          menuIsOpen: this.getProp('menuIsOpen'),
          onChange: this.onChange,
          onInputChange: this.onInputChange,
          onMenuClose: this.onMenuClose,
          onMenuOpen: this.onMenuOpen,
          value: this.getProp('value')
        }));
      }
    }]);

    return StateManager;
  }(react__WEBPACK_IMPORTED_MODULE_0__.Component), _defineProperty(_class, "defaultProps", defaultProps$1), _temp;
};

var defaultProps$2 = {
  cacheOptions: false,
  defaultOptions: false,
  filterOption: null
};
var makeAsyncSelect = function makeAsyncSelect(SelectComponent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Async, _Component);

    function Async(props) {
      var _this;

      _classCallCheck(this, Async);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Async).call(this));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "select", void 0);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "lastRequest", void 0);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "mounted", false);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "optionsCache", {});

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleInputChange", function (newValue, actionMeta) {
        var _this$props = _this.props,
            cacheOptions = _this$props.cacheOptions,
            onInputChange = _this$props.onInputChange; // TODO

        var inputValue = handleInputChange(newValue, actionMeta, onInputChange);

        if (!inputValue) {
          delete _this.lastRequest;

          _this.setState({
            inputValue: '',
            loadedInputValue: '',
            loadedOptions: [],
            isLoading: false,
            passEmptyOptions: false
          });

          return;
        }

        if (cacheOptions && _this.optionsCache[inputValue]) {
          _this.setState({
            inputValue: inputValue,
            loadedInputValue: inputValue,
            loadedOptions: _this.optionsCache[inputValue],
            isLoading: false,
            passEmptyOptions: false
          });
        } else {
          var request = _this.lastRequest = {};

          _this.setState({
            inputValue: inputValue,
            isLoading: true,
            passEmptyOptions: !_this.state.loadedInputValue
          }, function () {
            _this.loadOptions(inputValue, function (options) {
              if (!_this.mounted) return;

              if (options) {
                _this.optionsCache[inputValue] = options;
              }

              if (request !== _this.lastRequest) return;
              delete _this.lastRequest;

              _this.setState({
                isLoading: false,
                loadedInputValue: inputValue,
                loadedOptions: options || [],
                passEmptyOptions: false
              });
            });
          });
        }

        return inputValue;
      });

      _this.state = {
        defaultOptions: Array.isArray(props.defaultOptions) ? props.defaultOptions : undefined,
        inputValue: typeof props.inputValue !== 'undefined' ? props.inputValue : '',
        isLoading: props.defaultOptions === true ? true : false,
        loadedOptions: [],
        passEmptyOptions: false
      };
      return _this;
    }

    _createClass(Async, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        this.mounted = true;
        var defaultOptions = this.props.defaultOptions;
        var inputValue = this.state.inputValue;

        if (defaultOptions === true) {
          this.loadOptions(inputValue, function (options) {
            if (!_this2.mounted) return;
            var isLoading = !!_this2.lastRequest;

            _this2.setState({
              defaultOptions: options || [],
              isLoading: isLoading
            });
          });
        }
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        // if the cacheOptions prop changes, clear the cache
        if (nextProps.cacheOptions !== this.props.cacheOptions) {
          this.optionsCache = {};
        }

        if (nextProps.defaultOptions !== this.props.defaultOptions) {
          this.setState({
            defaultOptions: Array.isArray(nextProps.defaultOptions) ? nextProps.defaultOptions : undefined
          });
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.mounted = false;
      }
    }, {
      key: "focus",
      value: function focus() {
        this.select.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        this.select.blur();
      }
    }, {
      key: "loadOptions",
      value: function loadOptions(inputValue, callback) {
        var loadOptions = this.props.loadOptions;
        if (!loadOptions) return callback();
        var loader = loadOptions(inputValue, callback);

        if (loader && typeof loader.then === 'function') {
          loader.then(callback, function () {
            return callback();
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props2 = this.props,
            loadOptions = _this$props2.loadOptions,
            props = _objectWithoutProperties(_this$props2, ["loadOptions"]);

        var _this$state = this.state,
            defaultOptions = _this$state.defaultOptions,
            inputValue = _this$state.inputValue,
            isLoading = _this$state.isLoading,
            loadedInputValue = _this$state.loadedInputValue,
            loadedOptions = _this$state.loadedOptions,
            passEmptyOptions = _this$state.passEmptyOptions;
        var options = passEmptyOptions ? [] : inputValue && loadedInputValue ? loadedOptions : defaultOptions || [];
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SelectComponent, _extends({}, props, {
          ref: function ref(_ref) {
            _this3.select = _ref;
          },
          options: options,
          isLoading: isLoading,
          onInputChange: this.handleInputChange
        }));
      }
    }]);

    return Async;
  }(react__WEBPACK_IMPORTED_MODULE_0__.Component), _defineProperty(_class, "defaultProps", defaultProps$2), _temp;
};
var SelectState = manageState(Select);
var Async = makeAsyncSelect(SelectState);

var compareOption = function compareOption() {
  var inputValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var option = arguments.length > 1 ? arguments[1] : undefined;
  var candidate = String(inputValue).toLowerCase();
  var optionValue = String(option.value).toLowerCase();
  var optionLabel = String(option.label).toLowerCase();
  return optionValue === candidate || optionLabel === candidate;
};

var builtins = {
  formatCreateLabel: function formatCreateLabel(inputValue) {
    return "Create \"".concat(inputValue, "\"");
  },
  isValidNewOption: function isValidNewOption(inputValue, selectValue, selectOptions) {
    return !(!inputValue || selectValue.some(function (option) {
      return compareOption(inputValue, option);
    }) || selectOptions.some(function (option) {
      return compareOption(inputValue, option);
    }));
  },
  getNewOptionData: function getNewOptionData(inputValue, optionLabel) {
    return {
      label: optionLabel,
      value: inputValue,
      __isNew__: true
    };
  }
};
var defaultProps$3 = _objectSpread({
  allowCreateWhileLoading: false,
  createOptionPosition: 'last'
}, builtins);
var makeCreatableSelect = function makeCreatableSelect(SelectComponent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Creatable, _Component);

    function Creatable(props) {
      var _this;

      _classCallCheck(this, Creatable);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Creatable).call(this, props));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "select", void 0);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onChange", function (newValue, actionMeta) {
        var _this$props = _this.props,
            getNewOptionData = _this$props.getNewOptionData,
            inputValue = _this$props.inputValue,
            isMulti = _this$props.isMulti,
            onChange = _this$props.onChange,
            onCreateOption = _this$props.onCreateOption,
            value = _this$props.value;

        if (actionMeta.action !== 'select-option') {
          return onChange(newValue, actionMeta);
        }

        var newOption = _this.state.newOption;
        var valueArray = Array.isArray(newValue) ? newValue : [newValue];

        if (valueArray[valueArray.length - 1] === newOption) {
          if (onCreateOption) onCreateOption(inputValue);else {
            var newOptionData = getNewOptionData(inputValue, inputValue);
            var newActionMeta = {
              action: 'create-option'
            };

            if (isMulti) {
              onChange([].concat(_toConsumableArray(cleanValue(value)), [newOptionData]), newActionMeta);
            } else {
              onChange(newOptionData, newActionMeta);
            }
          }
          return;
        }

        onChange(newValue, actionMeta);
      });

      var options = props.options || [];
      _this.state = {
        newOption: undefined,
        options: options
      };
      return _this;
    }

    _createClass(Creatable, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        var allowCreateWhileLoading = nextProps.allowCreateWhileLoading,
            createOptionPosition = nextProps.createOptionPosition,
            formatCreateLabel = nextProps.formatCreateLabel,
            getNewOptionData = nextProps.getNewOptionData,
            inputValue = nextProps.inputValue,
            isLoading = nextProps.isLoading,
            isValidNewOption = nextProps.isValidNewOption,
            value = nextProps.value;
        var options = nextProps.options || [];
        var newOption = this.state.newOption;

        if (isValidNewOption(inputValue, cleanValue(value), options)) {
          newOption = getNewOptionData(inputValue, formatCreateLabel(inputValue));
        } else {
          newOption = undefined;
        }

        this.setState({
          newOption: newOption,
          options: (allowCreateWhileLoading || !isLoading) && newOption ? createOptionPosition === 'first' ? [newOption].concat(_toConsumableArray(options)) : [].concat(_toConsumableArray(options), [newOption]) : options
        });
      }
    }, {
      key: "focus",
      value: function focus() {
        this.select.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        this.select.blur();
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var props = _extends({}, this.props);

        var options = this.state.options;
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SelectComponent, _extends({}, props, {
          ref: function ref(_ref) {
            _this2.select = _ref;
          },
          options: options,
          onChange: this.onChange
        }));
      }
    }]);

    return Creatable;
  }(react__WEBPACK_IMPORTED_MODULE_0__.Component), _defineProperty(_class, "defaultProps", defaultProps$3), _temp;
}; // TODO: do this in package entrypoint

var SelectCreatable = makeCreatableSelect(Select);
var Creatable = manageState(SelectCreatable);

var SelectCreatable$1 = makeCreatableSelect(Select);
var SelectCreatableState = manageState(SelectCreatable$1);
var AsyncCreatable = makeAsyncSelect(SelectCreatableState);

// strip transition props off before spreading onto select component
// note we need to be explicit about innerRef for flow
var AnimatedInput = function AnimatedInput(WrappedComponent) {
  return function (_ref) {
    var inProp = _ref.in,
        onExited = _ref.onExited,
        appear = _ref.appear,
        enter = _ref.enter,
        exit = _ref.exit,
        props = _objectWithoutProperties(_ref, ["in", "onExited", "appear", "enter", "exit"]);

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(WrappedComponent, props);
  };
};

var Fade = function Fade(_ref) {
  var Tag = _ref.component,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 1 : _ref$duration,
      inProp = _ref.in,
      onExited = _ref.onExited,
      props = _objectWithoutProperties(_ref, ["component", "duration", "in", "onExited"]);

  var transition = {
    entering: {
      opacity: 0
    },
    entered: {
      opacity: 1,
      transition: "opacity ".concat(duration, "ms")
    },
    exiting: {
      opacity: 0
    },
    exited: {
      opacity: 0
    }
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_7__.Transition, {
    mountOnEnter: true,
    unmountOnExit: true,
    in: inProp,
    timeout: duration
  }, function (state) {
    var innerProps = {
      style: _objectSpread({}, transition[state])
    };
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Tag, _extends({
      innerProps: innerProps
    }, props));
  });
}; // ==============================
// Collapse Transition
// ==============================

var collapseDuration = 260;
// wrap each MultiValue with a collapse transition; decreases width until
// finally removing from DOM
var Collapse =
/*#__PURE__*/
function (_Component) {
  _inherits(Collapse, _Component);

  function Collapse() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Collapse);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Collapse)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "duration", collapseDuration);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "rafID", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      width: 'auto'
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "transition", {
      exiting: {
        width: 0,
        transition: "width ".concat(_this.duration, "ms ease-out")
      },
      exited: {
        width: 0
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getWidth", function (ref) {
      if (ref && isNaN(_this.state.width)) {
        /*
          Here we're invoking requestAnimationFrame with a callback invoking our
          call to getBoundingClientRect and setState in order to resolve an edge case
          around portalling. Certain portalling solutions briefly remove children from the DOM
          before appending them to the target node. This is to avoid us trying to call getBoundingClientrect
          while the Select component is in this state.
        */
        // cannot use `offsetWidth` because it is rounded
        _this.rafID = window.requestAnimationFrame(function () {
          var _ref$getBoundingClien = ref.getBoundingClientRect(),
              width = _ref$getBoundingClien.width;

          _this.setState({
            width: width
          });
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getStyle", function (width) {
      return {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: width
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getTransition", function (state) {
      return _this.transition[state];
    });

    return _this;
  }

  _createClass(Collapse, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.rafID) {
        window.cancelAnimationFrame(this.rafID);
      }
    } // width must be calculated; cannot transition from `undefined` to `number`

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          inProp = _this$props.in;
      var width = this.state.width;
      return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_7__.Transition, {
        enter: false,
        mountOnEnter: true,
        unmountOnExit: true,
        in: inProp,
        timeout: this.duration
      }, function (state) {
        var style = _objectSpread({}, _this2.getStyle(width), _this2.getTransition(state));

        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
          ref: _this2.getWidth,
          style: style
        }, children);
      });
    }
  }]);

  return Collapse;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);

var AnimatedMultiValue = function AnimatedMultiValue(WrappedComponent) {
  return function (_ref) {
    var inProp = _ref.in,
        onExited = _ref.onExited,
        props = _objectWithoutProperties(_ref, ["in", "onExited"]);

    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Collapse, {
      in: inProp,
      onExited: onExited
    }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(WrappedComponent, _extends({
      cropWithEllipsis: inProp
    }, props)));
  };
};

var AnimatedPlaceholder = function AnimatedPlaceholder(WrappedComponent) {
  return function (props) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Fade, _extends({
      component: WrappedComponent,
      duration: props.isMulti ? collapseDuration : 1
    }, props));
  };
};

var AnimatedSingleValue = function AnimatedSingleValue(WrappedComponent) {
  return function (props) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Fade, _extends({
      component: WrappedComponent
    }, props));
  };
};

// make ValueContainer a transition group
var AnimatedValueContainer = function AnimatedValueContainer(WrappedComponent) {
  return function (props) {
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_7__.TransitionGroup, _extends({
      component: WrappedComponent
    }, props));
  };
};

var makeAnimated = function makeAnimated() {
  var externalComponents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var components$$1 = defaultComponents({
    components: externalComponents
  });

  var Input = components$$1.Input,
      MultiValue = components$$1.MultiValue,
      Placeholder = components$$1.Placeholder,
      SingleValue = components$$1.SingleValue,
      ValueContainer = components$$1.ValueContainer,
      rest = _objectWithoutProperties(components$$1, ["Input", "MultiValue", "Placeholder", "SingleValue", "ValueContainer"]);

  return _objectSpread({
    Input: AnimatedInput(Input),
    MultiValue: AnimatedMultiValue(MultiValue),
    Placeholder: AnimatedPlaceholder(Placeholder),
    SingleValue: AnimatedSingleValue(SingleValue),
    ValueContainer: AnimatedValueContainer(ValueContainer)
  }, rest);
};

var AnimatedComponents = makeAnimated();
var Input$1 = AnimatedComponents.Input;
var MultiValue$1 = AnimatedComponents.MultiValue;
var Placeholder$1 = AnimatedComponents.Placeholder;
var SingleValue$1 = AnimatedComponents.SingleValue;
var ValueContainer$1 = AnimatedComponents.ValueContainer;
var index = (0,memoize_one__WEBPACK_IMPORTED_MODULE_6__["default"])(makeAnimated, exportedEqual);

var index$1 = manageState(Select);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index$1);



/***/ }),

/***/ "./node_modules/react-transition-group/CSSTransition.js":
/*!**************************************************************!*\
  !*** ./node_modules/react-transition-group/CSSTransition.js ***!
  \**************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var PropTypes = _interopRequireWildcard(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _addClass = _interopRequireDefault(__webpack_require__(/*! dom-helpers/class/addClass */ "./node_modules/dom-helpers/class/addClass.js"));

var _removeClass = _interopRequireDefault(__webpack_require__(/*! dom-helpers/class/removeClass */ "./node_modules/dom-helpers/class/removeClass.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _Transition = _interopRequireDefault(__webpack_require__(/*! ./Transition */ "./node_modules/react-transition-group/Transition.js"));

var _PropTypes = __webpack_require__(/*! ./utils/PropTypes */ "./node_modules/react-transition-group/utils/PropTypes.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var addClass = function addClass(node, classes) {
  return node && classes && classes.split(' ').forEach(function (c) {
    return (0, _addClass.default)(node, c);
  });
};

var removeClass = function removeClass(node, classes) {
  return node && classes && classes.split(' ').forEach(function (c) {
    return (0, _removeClass.default)(node, c);
  });
};
/**
 * A transition component inspired by the excellent
 * [ng-animate](http://www.nganimate.org/) library, you should use it if you're
 * using CSS transitions or animations. It's built upon the
 * [`Transition`](https://reactcommunity.org/react-transition-group/transition)
 * component, so it inherits all of its props.
 *
 * `CSSTransition` applies a pair of class names during the `appear`, `enter`,
 * and `exit` states of the transition. The first class is applied and then a
 * second `*-active` class in order to activate the CSSS transition. After the
 * transition, matching `*-done` class names are applied to persist the
 * transition state.
 *
 * ```jsx
 * function App() {
 *   const [inProp, setInProp] = useState(false);
 *   return (
 *     <div>
 *       <CSSTransition in={inProp} timeout={200} classNames="my-node">
 *         <div>
 *           {"I'll receive my-node-* classes"}
 *         </div>
 *       </CSSTransition>
 *       <button type="button" onClick={() => setInProp(true)}>
 *         Click to Enter
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the `in` prop is set to `true`, the child component will first receive
 * the class `example-enter`, then the `example-enter-active` will be added in
 * the next tick. `CSSTransition` [forces a
 * reflow](https://github.com/reactjs/react-transition-group/blob/5007303e729a74be66a21c3e2205e4916821524b/src/CSSTransition.js#L208-L215)
 * between before adding the `example-enter-active`. This is an important trick
 * because it allows us to transition between `example-enter` and
 * `example-enter-active` even though they were added immediately one after
 * another. Most notably, this is what makes it possible for us to animate
 * _appearance_.
 *
 * ```css
 * .my-node-enter {
 *   opacity: 0;
 * }
 * .my-node-enter-active {
 *   opacity: 1;
 *   transition: opacity 200ms;
 * }
 * .my-node-exit {
 *   opacity: 1;
 * }
 * .my-node-exit-active {
 *   opacity: 0;
 *   transition: opacity: 200ms;
 * }
 * ```
 *
 * `*-active` classes represent which styles you want to animate **to**.
 */


var CSSTransition =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(CSSTransition, _React$Component);

  function CSSTransition() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.onEnter = function (node, appearing) {
      var _this$getClassNames = _this.getClassNames(appearing ? 'appear' : 'enter'),
          className = _this$getClassNames.className;

      _this.removeClasses(node, 'exit');

      addClass(node, className);

      if (_this.props.onEnter) {
        _this.props.onEnter(node, appearing);
      }
    };

    _this.onEntering = function (node, appearing) {
      var _this$getClassNames2 = _this.getClassNames(appearing ? 'appear' : 'enter'),
          activeClassName = _this$getClassNames2.activeClassName;

      _this.reflowAndAddClass(node, activeClassName);

      if (_this.props.onEntering) {
        _this.props.onEntering(node, appearing);
      }
    };

    _this.onEntered = function (node, appearing) {
      var appearClassName = _this.getClassNames('appear').doneClassName;

      var enterClassName = _this.getClassNames('enter').doneClassName;

      var doneClassName = appearing ? appearClassName + " " + enterClassName : enterClassName;

      _this.removeClasses(node, appearing ? 'appear' : 'enter');

      addClass(node, doneClassName);

      if (_this.props.onEntered) {
        _this.props.onEntered(node, appearing);
      }
    };

    _this.onExit = function (node) {
      var _this$getClassNames3 = _this.getClassNames('exit'),
          className = _this$getClassNames3.className;

      _this.removeClasses(node, 'appear');

      _this.removeClasses(node, 'enter');

      addClass(node, className);

      if (_this.props.onExit) {
        _this.props.onExit(node);
      }
    };

    _this.onExiting = function (node) {
      var _this$getClassNames4 = _this.getClassNames('exit'),
          activeClassName = _this$getClassNames4.activeClassName;

      _this.reflowAndAddClass(node, activeClassName);

      if (_this.props.onExiting) {
        _this.props.onExiting(node);
      }
    };

    _this.onExited = function (node) {
      var _this$getClassNames5 = _this.getClassNames('exit'),
          doneClassName = _this$getClassNames5.doneClassName;

      _this.removeClasses(node, 'exit');

      addClass(node, doneClassName);

      if (_this.props.onExited) {
        _this.props.onExited(node);
      }
    };

    _this.getClassNames = function (type) {
      var classNames = _this.props.classNames;
      var isStringClassNames = typeof classNames === 'string';
      var prefix = isStringClassNames && classNames ? classNames + '-' : '';
      var className = isStringClassNames ? prefix + type : classNames[type];
      var activeClassName = isStringClassNames ? className + '-active' : classNames[type + 'Active'];
      var doneClassName = isStringClassNames ? className + '-done' : classNames[type + 'Done'];
      return {
        className: className,
        activeClassName: activeClassName,
        doneClassName: doneClassName
      };
    };

    return _this;
  }

  var _proto = CSSTransition.prototype;

  _proto.removeClasses = function removeClasses(node, type) {
    var _this$getClassNames6 = this.getClassNames(type),
        className = _this$getClassNames6.className,
        activeClassName = _this$getClassNames6.activeClassName,
        doneClassName = _this$getClassNames6.doneClassName;

    className && removeClass(node, className);
    activeClassName && removeClass(node, activeClassName);
    doneClassName && removeClass(node, doneClassName);
  };

  _proto.reflowAndAddClass = function reflowAndAddClass(node, className) {
    // This is for to force a repaint,
    // which is necessary in order to transition styles when adding a class name.
    if (className) {
      /* eslint-disable no-unused-expressions */
      node && node.scrollTop;
      /* eslint-enable no-unused-expressions */

      addClass(node, className);
    }
  };

  _proto.render = function render() {
    var props = _extends({}, this.props);

    delete props.classNames;
    return _react.default.createElement(_Transition.default, _extends({}, props, {
      onEnter: this.onEnter,
      onEntered: this.onEntered,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }));
  };

  return CSSTransition;
}(_react.default.Component);

CSSTransition.defaultProps = {
  classNames: ''
};
CSSTransition.propTypes =  true ? _extends({}, _Transition.default.propTypes, {
  /**
   * The animation classNames applied to the component as it enters, exits or
   * has finished the transition. A single name can be provided and it will be
   * suffixed for each stage: e.g.
   *
   * `classNames="fade"` applies `fade-enter`, `fade-enter-active`,
   * `fade-enter-done`, `fade-exit`, `fade-exit-active`, `fade-exit-done`,
   * `fade-appear`, `fade-appear-active`, and `fade-appear-done`.
   *
   * **Note**: `fade-appear-done` and `fade-enter-done` will _both_ be applied.
   * This allows you to define different behavior for when appearing is done and
   * when regular entering is done, using selectors like
   * `.fade-enter-done:not(.fade-appear-done)`. For example, you could apply an
   * epic entrance animation when element first appears in the DOM using
   * [Animate.css](https://daneden.github.io/animate.css/). Otherwise you can
   * simply use `fade-enter-done` for defining both cases.
   *
   * Each individual classNames can also be specified independently like:
   *
   * ```js
   * classNames={{
   *  appear: 'my-appear',
   *  appearActive: 'my-active-appear',
   *  appearDone: 'my-done-appear',
   *  enter: 'my-enter',
   *  enterActive: 'my-active-enter',
   *  enterDone: 'my-done-enter',
   *  exit: 'my-exit',
   *  exitActive: 'my-active-exit',
   *  exitDone: 'my-done-exit',
   * }}
   * ```
   *
   * If you want to set these classes using CSS Modules:
   *
   * ```js
   * import styles from './styles.css';
   * ```
   *
   * you might want to use camelCase in your CSS file, that way could simply
   * spread them instead of listing them one by one:
   *
   * ```js
   * classNames={{ ...styles }}
   * ```
   *
   * @type {string | {
   *  appear?: string,
   *  appearActive?: string,
   *  appearDone?: string,
   *  enter?: string,
   *  enterActive?: string,
   *  enterDone?: string,
   *  exit?: string,
   *  exitActive?: string,
   *  exitDone?: string,
   * }}
   */
  classNames: _PropTypes.classNamesShape,

  /**
   * A `<Transition>` callback fired immediately after the 'enter' or 'appear' class is
   * applied.
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEnter: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'enter-active' or
   * 'appear-active' class is applied.
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'enter' or
   * 'appear' classes are **removed** and the `done` class is added to the DOM node.
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntered: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'exit' class is
   * applied.
   *
   * @type Function(node: HtmlElement)
   */
  onExit: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'exit-active' is applied.
   *
   * @type Function(node: HtmlElement)
   */
  onExiting: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'exit' classes
   * are **removed** and the `exit-done` class is added to the DOM node.
   *
   * @type Function(node: HtmlElement)
   */
  onExited: PropTypes.func
}) : 0;
var _default = CSSTransition;
exports["default"] = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./node_modules/react-transition-group/ReplaceTransition.js":
/*!******************************************************************!*\
  !*** ./node_modules/react-transition-group/ReplaceTransition.js ***!
  \******************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _reactDom = __webpack_require__(/*! react-dom */ "react-dom");

var _TransitionGroup = _interopRequireDefault(__webpack_require__(/*! ./TransitionGroup */ "./node_modules/react-transition-group/TransitionGroup.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * The `<ReplaceTransition>` component is a specialized `Transition` component
 * that animates between two children.
 *
 * ```jsx
 * <ReplaceTransition in>
 *   <Fade><div>I appear first</div></Fade>
 *   <Fade><div>I replace the above</div></Fade>
 * </ReplaceTransition>
 * ```
 */
var ReplaceTransition =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ReplaceTransition, _React$Component);

  function ReplaceTransition() {
    var _this;

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(_args)) || this;

    _this.handleEnter = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _this.handleLifecycle('onEnter', 0, args);
    };

    _this.handleEntering = function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _this.handleLifecycle('onEntering', 0, args);
    };

    _this.handleEntered = function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _this.handleLifecycle('onEntered', 0, args);
    };

    _this.handleExit = function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _this.handleLifecycle('onExit', 1, args);
    };

    _this.handleExiting = function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return _this.handleLifecycle('onExiting', 1, args);
    };

    _this.handleExited = function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return _this.handleLifecycle('onExited', 1, args);
    };

    return _this;
  }

  var _proto = ReplaceTransition.prototype;

  _proto.handleLifecycle = function handleLifecycle(handler, idx, originalArgs) {
    var _child$props;

    var children = this.props.children;

    var child = _react.default.Children.toArray(children)[idx];

    if (child.props[handler]) (_child$props = child.props)[handler].apply(_child$props, originalArgs);
    if (this.props[handler]) this.props[handler]((0, _reactDom.findDOMNode)(this));
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        inProp = _this$props.in,
        props = _objectWithoutPropertiesLoose(_this$props, ["children", "in"]);

    var _React$Children$toArr = _react.default.Children.toArray(children),
        first = _React$Children$toArr[0],
        second = _React$Children$toArr[1];

    delete props.onEnter;
    delete props.onEntering;
    delete props.onEntered;
    delete props.onExit;
    delete props.onExiting;
    delete props.onExited;
    return _react.default.createElement(_TransitionGroup.default, props, inProp ? _react.default.cloneElement(first, {
      key: 'first',
      onEnter: this.handleEnter,
      onEntering: this.handleEntering,
      onEntered: this.handleEntered
    }) : _react.default.cloneElement(second, {
      key: 'second',
      onEnter: this.handleExit,
      onEntering: this.handleExiting,
      onEntered: this.handleExited
    }));
  };

  return ReplaceTransition;
}(_react.default.Component);

ReplaceTransition.propTypes =  true ? {
  in: _propTypes.default.bool.isRequired,
  children: function children(props, propName) {
    if (_react.default.Children.count(props[propName]) !== 2) return new Error("\"" + propName + "\" must be exactly two transition components.");
    return null;
  }
} : 0;
var _default = ReplaceTransition;
exports["default"] = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./node_modules/react-transition-group/Transition.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-transition-group/Transition.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports["default"] = exports.EXITING = exports.ENTERED = exports.ENTERING = exports.EXITED = exports.UNMOUNTED = void 0;

var PropTypes = _interopRequireWildcard(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

var _reactLifecyclesCompat = __webpack_require__(/*! react-lifecycles-compat */ "./node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js");

var _PropTypes = __webpack_require__(/*! ./utils/PropTypes */ "./node_modules/react-transition-group/utils/PropTypes.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var UNMOUNTED = 'unmounted';
exports.UNMOUNTED = UNMOUNTED;
var EXITED = 'exited';
exports.EXITED = EXITED;
var ENTERING = 'entering';
exports.ENTERING = ENTERING;
var ENTERED = 'entered';
exports.ENTERED = ENTERED;
var EXITING = 'exiting';
/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 *
 * ---
 *
 * **Note**: `Transition` is a platform-agnostic base component. If you're using
 * transitions in CSS, you'll probably want to use
 * [`CSSTransition`](https://reactcommunity.org/react-transition-group/css-transition)
 * instead. It inherits all the features of `Transition`, but contains
 * additional features necessary to play nice with CSS transitions (hence the
 * name of the component).
 *
 * ---
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the
 * components. It's up to you to give meaning and effect to those states. For
 * example we can add styles to a component when it enters or exits:
 *
 * ```jsx
 * import { Transition } from 'react-transition-group';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 0 },
 *   entered:  { opacity: 1 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {state => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm a fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * There are 4 main states a Transition can be in:
 *  - `'entering'`
 *  - `'entered'`
 *  - `'exiting'`
 *  - `'exited'`
 *
 * Transition state is toggled via the `in` prop. When `true` the component
 * begins the "Enter" stage. During this stage, the component will shift from
 * its current transition state, to `'entering'` for the duration of the
 * transition and then to the `'entered'` stage once it's complete. Let's take
 * the following example (we'll use the
 * [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook):
 *
 * ```jsx
 * function App() {
 *   const [inProp, setInProp] = useState(false);
 *   return (
 *     <div>
 *       <Transition in={inProp} timeout={500}>
 *         {state => (
 *           // ...
 *         )}
 *       </Transition>
 *       <button onClick={() => setInProp(true)}>
 *         Click to Enter
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state
 * and stay there for 500ms (the value of `timeout`) before it finally switches
 * to `'entered'`.
 *
 * When `in` is `false` the same thing happens except the state moves from
 * `'exiting'` to `'exited'`.
 */

exports.EXITING = EXITING;

var Transition =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Transition, _React$Component);

  function Transition(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context.transitionGroup; // In the context of a TransitionGroup all enters are really appears

    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;

    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }

    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }

  var _proto = Transition.prototype;

  _proto.getChildContext = function getChildContext() {
    return {
      transitionGroup: null // allows for nested Transitions

    };
  };

  Transition.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;

    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }

    return null;
  }; // getSnapshotBeforeUpdate(prevProps) {
  //   let nextStatus = null
  //   if (prevProps !== this.props) {
  //     const { status } = this.state
  //     if (this.props.in) {
  //       if (status !== ENTERING && status !== ENTERED) {
  //         nextStatus = ENTERING
  //       }
  //     } else {
  //       if (status === ENTERING || status === ENTERED) {
  //         nextStatus = EXITING
  //       }
  //     }
  //   }
  //   return { nextStatus }
  // }


  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;

    if (prevProps !== this.props) {
      var status = this.state.status;

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }

    this.updateStatus(false, nextStatus);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };

  _proto.getTimeouts = function getTimeouts() {
    var timeout = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout;

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit;
      enter = timeout.enter; // TODO: remove fallback for next major

      appear = timeout.appear !== undefined ? timeout.appear : enter;
    }

    return {
      exit: exit,
      enter: enter,
      appear: appear
    };
  };

  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }

    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback();

      var node = _reactDom.default.findDOMNode(this);

      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting);
      } else {
        this.performExit(node);
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };

  _proto.performEnter = function performEnter(node, mounting) {
    var _this2 = this;

    var enter = this.props.enter;
    var appearing = this.context.transitionGroup ? this.context.transitionGroup.isMounting : mounting;
    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter; // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set

    if (!mounting && !enter) {
      this.safeSetState({
        status: ENTERED
      }, function () {
        _this2.props.onEntered(node);
      });
      return;
    }

    this.props.onEnter(node, appearing);
    this.safeSetState({
      status: ENTERING
    }, function () {
      _this2.props.onEntering(node, appearing);

      _this2.onTransitionEnd(node, enterTimeout, function () {
        _this2.safeSetState({
          status: ENTERED
        }, function () {
          _this2.props.onEntered(node, appearing);
        });
      });
    });
  };

  _proto.performExit = function performExit(node) {
    var _this3 = this;

    var exit = this.props.exit;
    var timeouts = this.getTimeouts(); // no exit animation skip right to EXITED

    if (!exit) {
      this.safeSetState({
        status: EXITED
      }, function () {
        _this3.props.onExited(node);
      });
      return;
    }

    this.props.onExit(node);
    this.safeSetState({
      status: EXITING
    }, function () {
      _this3.props.onExiting(node);

      _this3.onTransitionEnd(node, timeouts.exit, function () {
        _this3.safeSetState({
          status: EXITED
        }, function () {
          _this3.props.onExited(node);
        });
      });
    });
  };

  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };

  _proto.safeSetState = function safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };

  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;

    var active = true;

    this.nextCallback = function (event) {
      if (active) {
        active = false;
        _this4.nextCallback = null;
        callback(event);
      }
    };

    this.nextCallback.cancel = function () {
      active = false;
    };

    return this.nextCallback;
  };

  _proto.onTransitionEnd = function onTransitionEnd(node, timeout, handler) {
    this.setNextCallback(handler);
    var doesNotHaveTimeoutOrListener = timeout == null && !this.props.addEndListener;

    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }

    if (this.props.addEndListener) {
      this.props.addEndListener(node, this.nextCallback);
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  };

  _proto.render = function render() {
    var status = this.state.status;

    if (status === UNMOUNTED) {
      return null;
    }

    var _this$props = this.props,
        children = _this$props.children,
        childProps = _objectWithoutPropertiesLoose(_this$props, ["children"]); // filter props for Transtition


    delete childProps.in;
    delete childProps.mountOnEnter;
    delete childProps.unmountOnExit;
    delete childProps.appear;
    delete childProps.enter;
    delete childProps.exit;
    delete childProps.timeout;
    delete childProps.addEndListener;
    delete childProps.onEnter;
    delete childProps.onEntering;
    delete childProps.onEntered;
    delete childProps.onExit;
    delete childProps.onExiting;
    delete childProps.onExited;

    if (typeof children === 'function') {
      return children(status, childProps);
    }

    var child = _react.default.Children.only(children);

    return _react.default.cloneElement(child, childProps);
  };

  return Transition;
}(_react.default.Component);

Transition.contextTypes = {
  transitionGroup: PropTypes.object
};
Transition.childContextTypes = {
  transitionGroup: function transitionGroup() {}
};
Transition.propTypes =  true ? {
  /**
   * A `function` child can be used instead of a React element. This function is
   * called with the current transition status (`'entering'`, `'entered'`,
   * `'exiting'`, `'exited'`, `'unmounted'`), which can be used to apply context
   * specific props to a component.
   *
   * ```jsx
   * <Transition in={this.state.in} timeout={150}>
   *   {state => (
   *     <MyComponent className={`fade fade-${state}`} />
   *   )}
   * </Transition>
   * ```
   */
  children: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.element.isRequired]).isRequired,

  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,

  /**
   * By default the child component is mounted immediately along with
   * the parent `Transition` component. If you want to "lazy mount" the component on the
   * first `in={true}` you can set `mountOnEnter`. After the first enter transition the component will stay
   * mounted, even on "exited", unless you also specify `unmountOnExit`.
   */
  mountOnEnter: PropTypes.bool,

  /**
   * By default the child component stays mounted after it reaches the `'exited'` state.
   * Set `unmountOnExit` if you'd prefer to unmount the component after it finishes exiting.
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Normally a component is not transitioned if it is shown when the `<Transition>` component mounts.
   * If you want to transition on the first mount set `appear` to `true`, and the
   * component will transition in as soon as the `<Transition>` mounts.
   *
   * > Note: there are no specific "appear" states. `appear` only adds an additional `enter` transition.
   */
  appear: PropTypes.bool,

  /**
   * Enable or disable enter transitions.
   */
  enter: PropTypes.bool,

  /**
   * Enable or disable exit transitions.
   */
  exit: PropTypes.bool,

  /**
   * The duration of the transition, in milliseconds.
   * Required unless `addEndListener` is provided.
   *
   * You may specify a single timeout for all transitions:
   *
   * ```jsx
   * timeout={500}
   * ```
   *
   * or individually:
   *
   * ```jsx
   * timeout={{
   *  appear: 500,
   *  enter: 300,
   *  exit: 500,
   * }}
   * ```
   *
   * - `appear` defaults to the value of `enter`
   * - `enter` defaults to `0`
   * - `exit` defaults to `0`
   *
   * @type {number | { enter?: number, exit?: number, appear?: number }}
   */
  timeout: function timeout(props) {
    var pt = _PropTypes.timeoutsShape;
    if (!props.addEndListener) pt = pt.isRequired;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return pt.apply(void 0, [props].concat(args));
  },

  /**
   * Add a custom transition end trigger. Called with the transitioning
   * DOM node and a `done` callback. Allows for more fine grained transition end
   * logic. **Note:** Timeouts are still used as a fallback if provided.
   *
   * ```jsx
   * addEndListener={(node, done) => {
   *   // use the css transitionend event to mark the finish of a transition
   *   node.addEventListener('transitionend', done, false);
   * }}
   * ```
   */
  addEndListener: PropTypes.func,

  /**
   * Callback fired before the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired before the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExit: PropTypes.func,

  /**
   * Callback fired after the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the "exited" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExited: PropTypes.func // Name the function so it is clearer in the documentation

} : 0;

function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
Transition.UNMOUNTED = 0;
Transition.EXITED = 1;
Transition.ENTERING = 2;
Transition.ENTERED = 3;
Transition.EXITING = 4;

var _default = (0, _reactLifecyclesCompat.polyfill)(Transition);

exports["default"] = _default;

/***/ }),

/***/ "./node_modules/react-transition-group/TransitionGroup.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-transition-group/TransitionGroup.js ***!
  \****************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _reactLifecyclesCompat = __webpack_require__(/*! react-lifecycles-compat */ "./node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js");

var _ChildMapping = __webpack_require__(/*! ./utils/ChildMapping */ "./node_modules/react-transition-group/utils/ChildMapping.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var values = Object.values || function (obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};

var defaultProps = {
  component: 'div',
  childFactory: function childFactory(child) {
    return child;
  }
  /**
   * The `<TransitionGroup>` component manages a set of transition components
   * (`<Transition>` and `<CSSTransition>`) in a list. Like with the transition
   * components, `<TransitionGroup>` is a state machine for managing the mounting
   * and unmounting of components over time.
   *
   * Consider the example below. As items are removed or added to the TodoList the
   * `in` prop is toggled automatically by the `<TransitionGroup>`.
   *
   * Note that `<TransitionGroup>`  does not define any animation behavior!
   * Exactly _how_ a list item animates is up to the individual transition
   * component. This means you can mix and match animations across different list
   * items.
   */

};

var TransitionGroup =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(TransitionGroup, _React$Component);

  function TransitionGroup(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;

    var handleExited = _this.handleExited.bind(_assertThisInitialized(_assertThisInitialized(_this))); // Initial children should all be entering, dependent on appear


    _this.state = {
      handleExited: handleExited,
      firstRender: true
    };
    return _this;
  }

  var _proto = TransitionGroup.prototype;

  _proto.getChildContext = function getChildContext() {
    return {
      transitionGroup: {
        isMounting: !this.appeared
      }
    };
  };

  _proto.componentDidMount = function componentDidMount() {
    this.appeared = true;
    this.mounted = true;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  TransitionGroup.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
    var prevChildMapping = _ref.children,
        handleExited = _ref.handleExited,
        firstRender = _ref.firstRender;
    return {
      children: firstRender ? (0, _ChildMapping.getInitialChildMapping)(nextProps, handleExited) : (0, _ChildMapping.getNextChildMapping)(nextProps, prevChildMapping, handleExited),
      firstRender: false
    };
  };

  _proto.handleExited = function handleExited(child, node) {
    var currentChildMapping = (0, _ChildMapping.getChildMapping)(this.props.children);
    if (child.key in currentChildMapping) return;

    if (child.props.onExited) {
      child.props.onExited(node);
    }

    if (this.mounted) {
      this.setState(function (state) {
        var children = _extends({}, state.children);

        delete children[child.key];
        return {
          children: children
        };
      });
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        Component = _this$props.component,
        childFactory = _this$props.childFactory,
        props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);

    var children = values(this.state.children).map(childFactory);
    delete props.appear;
    delete props.enter;
    delete props.exit;

    if (Component === null) {
      return children;
    }

    return _react.default.createElement(Component, props, children);
  };

  return TransitionGroup;
}(_react.default.Component);

TransitionGroup.childContextTypes = {
  transitionGroup: _propTypes.default.object.isRequired
};
TransitionGroup.propTypes =  true ? {
  /**
   * `<TransitionGroup>` renders a `<div>` by default. You can change this
   * behavior by providing a `component` prop.
   * If you use React v16+ and would like to avoid a wrapping `<div>` element
   * you can pass in `component={null}`. This is useful if the wrapping div
   * borks your css styles.
   */
  component: _propTypes.default.any,

  /**
   * A set of `<Transition>` components, that are toggled `in` and out as they
   * leave. the `<TransitionGroup>` will inject specific transition props, so
   * remember to spread them through if you are wrapping the `<Transition>` as
   * with our `<Fade>` example.
   *
   * While this component is meant for multiple `Transition` or `CSSTransition`
   * children, sometimes you may want to have a single transition child with
   * content that you want to be transitioned out and in when you change it
   * (e.g. routes, images etc.) In that case you can change the `key` prop of
   * the transition child as you change its content, this will cause
   * `TransitionGroup` to transition the child out and back in.
   */
  children: _propTypes.default.node,

  /**
   * A convenience prop that enables or disables appear animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  appear: _propTypes.default.bool,

  /**
   * A convenience prop that enables or disables enter animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  enter: _propTypes.default.bool,

  /**
   * A convenience prop that enables or disables exit animations
   * for all children. Note that specifying this will override any defaults set
   * on individual children Transitions.
   */
  exit: _propTypes.default.bool,

  /**
   * You may need to apply reactive updates to a child as it is exiting.
   * This is generally done by using `cloneElement` however in the case of an exiting
   * child the element has already been removed and not accessible to the consumer.
   *
   * If you do need to update a child as it leaves you can provide a `childFactory`
   * to wrap every child, even the ones that are leaving.
   *
   * @type Function(child: ReactElement) -> ReactElement
   */
  childFactory: _propTypes.default.func
} : 0;
TransitionGroup.defaultProps = defaultProps;

var _default = (0, _reactLifecyclesCompat.polyfill)(TransitionGroup);

exports["default"] = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./node_modules/react-transition-group/index.js":
/*!******************************************************!*\
  !*** ./node_modules/react-transition-group/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _CSSTransition = _interopRequireDefault(__webpack_require__(/*! ./CSSTransition */ "./node_modules/react-transition-group/CSSTransition.js"));

var _ReplaceTransition = _interopRequireDefault(__webpack_require__(/*! ./ReplaceTransition */ "./node_modules/react-transition-group/ReplaceTransition.js"));

var _TransitionGroup = _interopRequireDefault(__webpack_require__(/*! ./TransitionGroup */ "./node_modules/react-transition-group/TransitionGroup.js"));

var _Transition = _interopRequireDefault(__webpack_require__(/*! ./Transition */ "./node_modules/react-transition-group/Transition.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  Transition: _Transition.default,
  TransitionGroup: _TransitionGroup.default,
  ReplaceTransition: _ReplaceTransition.default,
  CSSTransition: _CSSTransition.default
};

/***/ }),

/***/ "./node_modules/react-transition-group/utils/ChildMapping.js":
/*!*******************************************************************!*\
  !*** ./node_modules/react-transition-group/utils/ChildMapping.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.getChildMapping = getChildMapping;
exports.mergeChildMappings = mergeChildMappings;
exports.getInitialChildMapping = getInitialChildMapping;
exports.getNextChildMapping = getNextChildMapping;

var _react = __webpack_require__(/*! react */ "react");

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {*} children `this.props.children`
 * @return {object} Mapping of key to child
 */
function getChildMapping(children, mapFn) {
  var mapper = function mapper(child) {
    return mapFn && (0, _react.isValidElement)(child) ? mapFn(child) : child;
  };

  var result = Object.create(null);
  if (children) _react.Children.map(children, function (c) {
    return c;
  }).forEach(function (child) {
    // run the map function here instead so that the key is the computed one
    result[child.key] = mapper(child);
  });
  return result;
}
/**
 * When you're adding or removing children some may be added or removed in the
 * same render pass. We want to show *both* since we want to simultaneously
 * animate elements in and out. This function takes a previous set of keys
 * and a new set of keys and merges them with its best guess of the correct
 * ordering. In the future we may expose some of the utilities in
 * ReactMultiChild to make this easy, but for now React itself does not
 * directly have this concept of the union of prevChildren and nextChildren
 * so we implement it here.
 *
 * @param {object} prev prev children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @param {object} next next children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @return {object} a key set that contains all keys in `prev` and all keys
 * in `next` in a reasonable order.
 */


function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};

  function getValueForKey(key) {
    return key in next ? next[key] : prev[key];
  } // For each key of `next`, the list of keys to insert before that key in
  // the combined list


  var nextKeysPending = Object.create(null);
  var pendingKeys = [];

  for (var prevKey in prev) {
    if (prevKey in next) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }

  var i;
  var childMapping = {};

  for (var nextKey in next) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }

    childMapping[nextKey] = getValueForKey(nextKey);
  } // Finally, add the keys which didn't appear before any key in `next`


  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }

  return childMapping;
}

function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop];
}

function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, function (child) {
    return (0, _react.cloneElement)(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, 'appear', props),
      enter: getProp(child, 'enter', props),
      exit: getProp(child, 'exit', props)
    });
  });
}

function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  var nextChildMapping = getChildMapping(nextProps.children);
  var children = mergeChildMappings(prevChildMapping, nextChildMapping);
  Object.keys(children).forEach(function (key) {
    var child = children[key];
    if (!(0, _react.isValidElement)(child)) return;
    var hasPrev = key in prevChildMapping;
    var hasNext = key in nextChildMapping;
    var prevChild = prevChildMapping[key];
    var isLeaving = (0, _react.isValidElement)(prevChild) && !prevChild.props.in; // item is new (entering)

    if (hasNext && (!hasPrev || isLeaving)) {
      // console.log('entering', key)
      children[key] = (0, _react.cloneElement)(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      });
    } else if (!hasNext && hasPrev && !isLeaving) {
      // item is old (exiting)
      // console.log('leaving', key)
      children[key] = (0, _react.cloneElement)(child, {
        in: false
      });
    } else if (hasNext && hasPrev && (0, _react.isValidElement)(prevChild)) {
      // item hasn't changed transition states
      // copy over the last transition props;
      // console.log('unchanged', key)
      children[key] = (0, _react.cloneElement)(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      });
    }
  });
  return children;
}

/***/ }),

/***/ "./node_modules/react-transition-group/utils/PropTypes.js":
/*!****************************************************************!*\
  !*** ./node_modules/react-transition-group/utils/PropTypes.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.classNamesShape = exports.timeoutsShape = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeoutsShape =  true ? _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
  enter: _propTypes.default.number,
  exit: _propTypes.default.number,
  appear: _propTypes.default.number
}).isRequired]) : 0;
exports.timeoutsShape = timeoutsShape;
var classNamesShape =  true ? _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.shape({
  enter: _propTypes.default.string,
  exit: _propTypes.default.string,
  active: _propTypes.default.string
}), _propTypes.default.shape({
  enter: _propTypes.default.string,
  enterDone: _propTypes.default.string,
  enterActive: _propTypes.default.string,
  exit: _propTypes.default.string,
  exitDone: _propTypes.default.string,
  exitActive: _propTypes.default.string
})]) : 0;
exports.classNamesShape = classNamesShape;

/***/ }),

/***/ "./node_modules/stylis-rule-sheet/index.js":
/*!*************************************************!*\
  !*** ./node_modules/stylis-rule-sheet/index.js ***!
  \*************************************************/
/***/ ((module) => {

(function (factory) {
	 true ? (module['exports'] = factory()) :
		0
}(function () {

	'use strict'

	return function (insertRule) {
		var delimiter = '/*|*/'
		var needle = delimiter+'}'

		function toSheet (block) {
			if (block)
				try {
					insertRule(block + '}')
				} catch (e) {}
		}

		return function ruleSheet (context, content, selectors, parents, line, column, length, ns, depth, at) {
			switch (context) {
				// property
				case 1:
					// @import
					if (depth === 0 && content.charCodeAt(0) === 64)
						return insertRule(content+';'), ''
					break
				// selector
				case 2:
					if (ns === 0)
						return content + delimiter
					break
				// at-rule
				case 3:
					switch (ns) {
						// @font-face, @page
						case 102:
						case 112:
							return insertRule(selectors[0]+content), ''
						default:
							return content + (at === 0 ? delimiter : '')
					}
				case -2:
					content.split(needle).forEach(toSheet)
			}
		}
	}
}))


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = window["lodash"];

/***/ }),

/***/ "@kadence/components":
/*!*****************************************!*\
  !*** external ["kadence","components"] ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = window["kadence"]["components"];

/***/ }),

/***/ "@kadence/helpers":
/*!**************************************!*\
  !*** external ["kadence","helpers"] ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = window["kadence"]["helpers"];

/***/ }),

/***/ "@kadence/icons":
/*!************************************!*\
  !*** external ["kadence","icons"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["kadence"]["icons"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/keycodes":
/*!**********************************!*\
  !*** external ["wp","keycodes"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["keycodes"];

/***/ }),

/***/ "@wordpress/widgets":
/*!*********************************!*\
  !*** external ["wp","widgets"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["widgets"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./src/blocks/form/block.json":
/*!************************************!*\
  !*** ./src/blocks/form/block.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"title":"Form","name":"kadence/form","category":"kadence-blocks","keywords":["contact","marketing","KB"],"attributes":{"uniqueID":{"type":"string","default":""},"postID":{"type":"string","default":""},"hAlign":{"type":"string","default":""},"fields":{"type":"array","default":[{"label":"Name","showLabel":true,"placeholder":"","default":"","description":"","rows":4,"options":[{"value":"","label":""}],"multiSelect":false,"inline":false,"showLink":false,"min":"","max":"","type":"text","required":false,"width":["100","",""],"auto":"","errorMessage":"","requiredMessage":"","slug":"","ariaLabel":""},{"label":"Email","showLabel":true,"placeholder":"","default":"","description":"","rows":4,"options":[{"value":"","label":""}],"multiSelect":false,"inline":false,"showLink":false,"min":"","max":"","type":"email","required":true,"width":["100","",""],"auto":"","errorMessage":"","requiredMessage":"","slug":"","ariaLabel":""},{"label":"Message","showLabel":true,"placeholder":"","default":"","description":"","rows":4,"options":[{"value":"","label":""}],"multiSelect":false,"inline":false,"showLink":false,"min":"","max":"","type":"textarea","required":true,"width":["100","",""],"auto":"","errorMessage":"","requiredMessage":"","slug":"","ariaLabel":""}]},"messages":{"type":"array","default":[{"success":"","error":"","required":"","invalid":"","recaptchaerror":"","preError":""}]},"messageFont":{"type":"array","default":[{"colorSuccess":"","colorError":"","borderSuccess":"","borderError":"","backgroundSuccess":"","backgroundSuccessOpacity":1,"backgroundError":"","backgroundErrorOpacity":1,"borderWidth":["","","",""],"borderRadius":"","size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","textTransform":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true,"padding":["","","",""],"margin":["","","",""]}]},"style":{"type":"array","default":[{"showRequired":true,"size":"standard","deskPadding":["","","",""],"tabletPadding":["","","",""],"mobilePadding":["","","",""],"color":"","requiredColor":"","background":"","border":"","backgroundOpacity":1,"borderOpacity":1,"borderRadius":"","borderWidth":["","","",""],"colorActive":"","backgroundActive":"","borderActive":"","backgroundActiveOpacity":1,"borderActiveOpacity":1,"gradient":["#999999",1,0,100,"linear",180,"center center"],"gradientActive":["#777777",1,0,100,"linear",180,"center center"],"backgroundType":"solid","backgroundActiveType":"solid","boxShadow":[false,"#000000",0.2,1,1,2,0,false],"boxShadowActive":[false,"#000000",0.4,2,2,3,0,false],"fontSize":["","",""],"fontSizeType":"px","lineHeight":["","",""],"lineType":"px","rowGap":"","rowGapType":"px","gutter":"","gutterType":"px","tabletRowGap":"","mobileRowGap":"","tabletGutter":"","mobileGutter":""}]},"labelFont":{"type":"array","default":[{"color":"","size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","textTransform":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true,"padding":["","","",""],"margin":["","","",""]}]},"submit":{"type":"array","default":[{"label":"","width":["100","",""],"size":"standard","widthType":"auto","fixedWidth":["","",""],"align":["","",""],"deskPadding":["","","",""],"tabletPadding":["","","",""],"mobilePadding":["","","",""],"color":"","background":"","border":"","backgroundOpacity":1,"borderOpacity":1,"borderRadius":"","borderWidth":["","","",""],"colorHover":"","backgroundHover":"","borderHover":"","backgroundHoverOpacity":1,"borderHoverOpacity":1,"icon":"","iconSide":"right","iconHover":false,"cssClass":"","gradient":["#999999",1,0,100,"linear",180,"center center"],"gradientHover":["#777777",1,0,100,"linear",180,"center center"],"btnStyle":"basic","btnSize":"standard","backgroundType":"solid","backgroundHoverType":"solid","boxShadow":[false,"#000000",0.2,1,1,2,0,false],"boxShadowHover":[false,"#000000",0.4,2,2,3,0,false]}]},"submitMargin":{"type":"array","default":[{"desk":["","","",""],"tablet":["","","",""],"mobile":["","","",""],"unit":"px","control":"linked"}]},"submitFont":{"type":"array","default":[{"size":["","",""],"sizeType":"px","lineHeight":["","",""],"lineType":"px","letterSpacing":"","textTransform":"","family":"","google":"","style":"","weight":"","variant":"","subset":"","loadGoogle":true}]},"actions":{"type":"array","default":["email"]},"email":{"type":"array","default":[{"emailTo":"","subject":"","fromEmail":"","fromName":"","replyTo":"email_field","cc":"","bcc":"","html":true}]},"redirect":{"type":"string","default":""},"recaptcha":{"type":"bool","default":false},"recaptchaVersion":{"type":"string","default":"v3"},"honeyPot":{"type":"bool","default":true},"mailerlite":{"type":"array","default":[{"group":[],"map":[]}]},"fluentcrm":{"type":"array","default":[{"lists":[],"tags":[],"map":[],"doubleOptin":false}]},"containerMarginType":{"type":"string","default":"px"},"containerMargin":{"type":"array","default":["","","",""]},"tabletContainerMargin":{"type":"array","default":["","","",""]},"mobileContainerMargin":{"type":"array","default":["","","",""]},"submitLabel":{"type":"string","default":""}},"supports":{"anchor":true,"align":["wide","full"],"ktanimate":true,"ktanimateadd":true,"ktanimatepreview":true,"ktanimateswipe":true},"usesContext":["postId"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks-form": 0,
/******/ 			"./style-blocks-form": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkkadence"] = globalThis["webpackChunkkadence"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks-form"], () => (__webpack_require__("./src/blocks/form/block.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	(this.kadence = this.kadence || {})["blocks-form"] = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks-form.js.map