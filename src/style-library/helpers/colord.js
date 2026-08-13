/**
 * The app's single `colord` instance, extended with the CSS named-color table.
 *
 * `extend()` mutates `colord` globally, so it has to happen exactly once and before any parse. Every
 * consumer in this app imports `colord` from here rather than from the package, which is what makes
 * that guarantee hold: there is no import path that reaches an un-extended instance.
 *
 * Without the names plugin, `colord('transparent')` and `colord('red')` report themselves invalid,
 * and a keyword-valued swatch renders as opaque black or falls back to a placeholder. Baseline
 * palettes ship such values, so keyword support is a correctness requirement here, not a nicety.
 */

/**
 * External dependencies
 */
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';

extend([namesPlugin]);

export { colord };
