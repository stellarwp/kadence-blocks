/**
 * Express a preset's stored font weight as the variant a Google Fonts request takes.
 *
 * A preset carries its family and its weight as two independent properties: the family reaches the
 * font loader, while the weight reaches the page as a `font-weight` declaration through its own
 * binding. Loading the family without asking for the weight is what makes the browser synthesize a
 * bold rather than paint the real face -- the exact outcome narrowing the weight picker to a family's
 * shipped weights exists to prevent. This turns the stored weight into the variant that closes that
 * gap.
 *
 * `render_preset_typography()` in `includes/blocks/class-kadence-blocks-advanced-heading-block.php`
 * holds the PHP twin of this mapping, so the editor and the front end ask Google for the same face.
 * Keep the two in step.
 *
 * The vocabulary is Google's own variant spelling, which both endpoints in play understand: the v1
 * `family=Inter:700` form the front end builds, and the css2 form `KadenceWebfontLoader` builds
 * through `parseVariant`. A weight this does not recognize yields `''`, which asks for no variant at
 * all and so leaves the family loading exactly as it does without this bridge.
 *
 * @param {*} weight The preset's stored font weight.
 *
 * @since TBD
 *
 * @return {string} The Google variant, or '' when the weight names no face to ask for.
 */
export function presetFontVariant(weight) {
	const value = String(weight ?? '')
		.trim()
		.toLowerCase();

	// `regular` rather than `400`: it is the v1 spelling the rest of this plugin already uses for the
	// upright default (see `render_font_weight`), and `parseVariant` reads it as 400 all the same.
	if (value === 'normal' || value === 'regular' || value === '400') {
		return 'regular';
	}

	if (value === 'bold') {
		return '700';
	}

	return /^[1-9]00$/.test(value) ? value : '';
}
