const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleancss = require('gulp-clean-css');
const { Transform } = require('stream');
const config = require('../config');

/**
 * Create gulp pipeline for scss/css files.
 *
 * @param {*} sources
 * @returns
 */
function stylesPipe(sources) {
	return src(sources).pipe(sass(config.sass)).pipe(cleancss(config.cleancss));
}

function miscStyles() {
	return stylesPipe(['src/assets/css/*.scss', 'includes/resources/Optimizer/assets/css/*.scss'])
		.pipe(
			rename((file) => {
				file.basename += '.min';
			})
		)
		.pipe(dest(config.dirs.dist + '/css'));
}

/**
 * Stylesheets with the Fill button's default rule: `style-*` on the front end, the others in the editor.
 */
const FSE_SOURCES = ['dist/style-blocks-advancedbtn.css', 'dist/blocks-advancedbtn.css', 'dist/blocks-advanced-form.css'];

/**
 * The Fill button's default rule, as each stylesheet selects it.
 */
const FILL_DEFAULT_SELECTORS = new Set(['.kb-button.kb-btn-global-fill', '.kt-button.kb-btn-global-fill']);

/**
 * Single Button's core keys, named after the last part of each `site_styles_attributes_map()`
 * path, and the default rule's properties core's value for each key replaces.
 */
const CORE_KEYS = {
	background: ['background', 'background-color'],
	text: ['color'],
};

/**
 * Every combination of core keys a site can set, e.g. `['background', 'text']`.
 */
const KEY_SETS = Object.keys(CORE_KEYS).reduce((sets, key) => [...sets, ...sets.map((set) => [...set, key]), [key]], []);

/**
 * Moves the given core keys' properties out of the Fill button's default rule
 * into `:where(.kb-button).kb-btn-global-fill`, which has the specificity of
 * core's Global Styles rule for the block and comes before it, so core's value
 * wins. The rest of the default rule keeps its strength.
 *
 * @param {string}   css  Minified CSS.
 * @param {string[]} keys The core keys the site sets.
 * @return {string} The CSS with those properties weakened.
 */
function weakenDefaultButtonColors(css, keys) {
	const properties = new Set(keys.flatMap((key) => CORE_KEYS[key]));
	let found = false;

	const weakened = css.replace(/(?<=^|[{}])([^{}@]+)\{([^{}]*)\}/g, (rule, prefix, body) => {
		const selector = prefix.trim();

		if (!FILL_DEFAULT_SELECTORS.has(selector)) {
			return rule;
		}

		found = true;
		const declarations = body.split(';').filter(Boolean);
		const isMoved = (declaration) => properties.has(declaration.split(':')[0].trim());
		const weak = selector.replace(/^(\.[a-z]+-button)/, ':where($1)');

		return `${prefix}{${declarations.filter((declaration) => !isMoved(declaration)).join(';')}}${weak}{${declarations
			.filter(isMoved)
			.join(';')}}`;
	});

	if (!found) {
		throw new Error('No Fill button default rule found; the FSE copy would not let core colors win.');
	}

	return weakened;
}

/**
 * Writes the FSE-mode copies of the stylesheets with the Fill button's default
 * rule, one per combination of core keys (`*-fse-background.css`,
 * `*-fse-text.css`, `*-fse-background-text.css`). The originals stay as they
 * are for classic mode and for sites without site colors.
 *
 * @param {string[]} keys The core keys the copy weakens.
 * @return {Function} The gulp task.
 */
function fseCopies(keys) {
	const task = () =>
		src(FSE_SOURCES)
			.pipe(
				new Transform({
					objectMode: true,
					transform(file, encoding, callback) {
						try {
							file.contents = Buffer.from(weakenDefaultButtonColors(file.contents.toString(), keys));
							callback(null, file);
						} catch (error) {
							callback(new Error(`${file.relative}: ${error.message}`));
						}
					},
				})
			)
			.pipe(
				rename((file) => {
					file.basename += `-fse-${keys.join('-')}`;
				})
			)
			.pipe(dest('dist'));

	task.displayName = `fseStyles:${keys.join('-')}`;

	return task;
}

const fseStyles = parallel(...KEY_SETS.map(fseCopies));

exports.miscStyles = miscStyles;
exports.fseStyles = fseStyles;
exports.fseSources = FSE_SOURCES;
exports.weakenDefaultButtonColors = weakenDefaultButtonColors;

exports.buildStyles = parallel(miscStyles);
exports.styles = parallel(miscStyles);
