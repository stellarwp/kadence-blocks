/**
 * The line style (`solid`, `dashed`, ...) a border side carries at a device, or '' when none is set.
 *
 * Falls back through the wider devices like the other border helpers.
 *
 * @param {string}   device The preview device: 'Desktop', 'Tablet' or 'Mobile'.
 * @param {string}   side   The border side: 'top', 'right', 'bottom' or 'left'.
 * @param {Object[]} values The desktop, tablet and mobile border attributes, in that order.
 *
 * @since TBD
 *
 * @return {string} The line style, or ''.
 */
function borderLineStyle(device, side, [desktop, tablet, mobile]) {
	const chain = 'Mobile' === device ? [mobile, tablet, desktop] : 'Tablet' === device ? [tablet, desktop] : [desktop];

	return chain.map((value) => value?.[0]?.[side]?.[1]).find((style) => style) || '';
}

/**
 * The CSS declarations for a block's border sides, as `[property, value]` pairs.
 *
 * A side with a width carries the whole `width style color` shorthand. A side stored without a width
 * has no shorthand to write, because the width comes from the active preset, so its color and line
 * style come back on their own instead. Without them the preset's width paints a border with no line
 * style. This is the front end's own split.
 *
 * @param {string}   device The preview device: 'Desktop', 'Tablet' or 'Mobile'.
 * @param {Object[]} values The desktop, tablet and mobile border attributes, in that order.
 * @param {Object}   sides  Each side (`top`, `right`, `bottom`, `left`) mapped to its `[shorthand, color]` pair.
 *
 * @since TBD
 *
 * @return {Array<[string, string]>} The declarations to write, in side order.
 */
export function borderSideDeclarations(device, values, sides) {
	return Object.entries(sides).flatMap(([side, [shorthand, color]]) => {
		const property = `border-${side}`;

		if (shorthand) {
			return [[property, shorthand]];
		}

		const declarations = [];
		const lineStyle = borderLineStyle(device, side, values);

		if (color) {
			declarations.push([`${property}-color`, color]);
		}

		if (lineStyle) {
			declarations.push([`${property}-style`, lineStyle]);
		}

		return declarations;
	});
}
