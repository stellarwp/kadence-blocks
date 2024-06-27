/**
 * WordPress dependencies
 */
const getStringBetween = (str, start, end, verify) => {
	// Check if form is there?
	if (!str.includes(verify)) {
		return '';
	}
	// get the start of the submit button.
	const startpos = str.indexOf(start);
	if (!startpos) {
		return '';
	}
	const pos = startpos + start.length;
	return str.substring(pos, str.indexOf(end, pos));
};
/**
 * WordPress dependencies
 */
const getStringBetweenWhen = (str, start, end, verify, from) => {
	// Check if form is there?
	if (!str.includes(verify)) {
		return '';
	}
	// get the start of the submit button.
	const startpos = str.indexOf(start, from);
	if (!startpos) {
		return '';
	}
	const pos = startpos + start.length;
	const endPost = str.indexOf(end, pos);
	const sub = str.substring(pos, endPost);
	if (!sub) {
		return '';
	}
	if (!sub.includes(verify)) {
		return getStringBetweenWhen(str, start, end, verify, endPost + end.length);
	}
	return sub;
};
export default function replaceColors(content, style) {
	if (!content) {
		return content;
	}
	if (!style) {
		return content;
	}
	if ('dark' !== style && 'highlight' !== style) {
		return content;
	}

	// Swap Logos (NEW).
	content = content.replaceAll('logo-placeholder.png', 'logo-placeholder-white.png');
	content = content.replaceAll('logo-placeholder-1.png', 'logo-placeholder-1-white.png');
	content = content.replaceAll('logo-placeholder-2.png', 'logo-placeholder-2-white.png');
	content = content.replaceAll('logo-placeholder-3.png', 'logo-placeholder-3-white.png');
	content = content.replaceAll('logo-placeholder-4.png', 'logo-placeholder-4-white.png');
	content = content.replaceAll('logo-placeholder-5.png', 'logo-placeholder-5-white.png');
	content = content.replaceAll('logo-placeholder-6.png', 'logo-placeholder-6-white.png');
	content = content.replaceAll('logo-placeholder-7.png', 'logo-placeholder-7-white.png');
	content = content.replaceAll('logo-placeholder-8.png', 'logo-placeholder-8-white.png');
	content = content.replaceAll('logo-placeholder-9.png', 'logo-placeholder-9-white.png');
	content = content.replaceAll('logo-placeholder-10.png', 'logo-placeholder-10-white.png');

	const replacements = [];

	if ('dark' === style) {
		// Handle tabs.
		let tab_content = getStringBetween(
			content,
			'wp:kadence/tabs',
			'wp:kadence/tab',
			'kb-pattern-active-tab-highlight'
		);
		if (tab_content) {
			const tab_content_org = tab_content;
			tab_content = tab_content.replaceAll('"titleColorActive":"palette9"', '"titleColorActive":"ph-kb-pal9"');
			tab_content = tab_content.replaceAll('"titleColorHover":"palette9"', '"titleColorHover":"ph-kb-pal9"');
			content = content.replace(tab_content_org, tab_content);
		}

		// Handle Dividers.
		let row_divider_content = getStringBetween(
			content,
			'wp:kadence/rowlayout',
			'wp:kadence/rowlayout',
			'kb-divider-static'
		);
		if (row_divider_content) {
			const row_divider_content_org = row_divider_content;
			row_divider_content = row_divider_content.replaceAll(
				'"bottomSepColor":"palette9"',
				'"bottomSepColor":"ph-kb-pal9"'
			);
			row_divider_content = row_divider_content.replaceAll(
				'"bottomSepColor":"palette8"',
				'"bottomSepColor":"ph-kb-pal8"'
			);
			row_divider_content = row_divider_content.replaceAll(
				'"topSepColor":"palette9"',
				'"topSepColor":"ph-kb-pal9"'
			);
			row_divider_content = row_divider_content.replaceAll(
				'"topSepColor":"palette8"',
				'"topSepColor":"ph-kb-pal8"'
			);
			content = content.replace(row_divider_content_org, row_divider_content);
		}

		// Special testimonial issue.
		let white_text_content = getStringBetweenWhen(
			content,
			'<!-- wp:kadence/column',
			'kt-inside-inner-col',
			'kb-pattern-light-color',
			0
		);
		if (white_text_content) {
			const white_text_content_org = white_text_content;
			white_text_content = white_text_content.replaceAll('"textColor":"palette9"', '"textColor":"ph-kb-pal9"');
			white_text_content = white_text_content.replaceAll('"linkColor":"palette9"', '"linkColor":"ph-kb-pal9"');
			white_text_content = white_text_content.replaceAll(
				'"linkHoverColor":"palette9"',
				'"linkHoverColor":"ph-kb-pal9"'
			);
			content = content.replace(white_text_content_org, white_text_content);
		}
		// Color Map Switch
		// 3 => 9
		// 4 => 8
		// 5 => 7
		// 6 => 7
		// 7 => 3
		// 8 => 3
		// 9 => 4
		replacements.push({ from: 'has-theme-palette-3', to: 'ph-kb-class9' });
		replacements.push({ from: 'has-theme-palette-4', to: 'ph-kb-class8' });
		replacements.push({ from: 'has-theme-palette-5', to: 'ph-kb-class7' });
		replacements.push({ from: 'has-theme-palette-6', to: 'ph-kb-class7' });
		replacements.push({ from: 'has-theme-palette-7', to: 'ph-kb-class3' });
		replacements.push({ from: 'has-theme-palette-8', to: 'ph-kb-class3' });
		replacements.push({ from: 'has-theme-palette-9', to: 'ph-kb-class4' });
		replacements.push({ from: 'theme-palette3', to: 'ph-class-kb-pal9' });
		replacements.push({ from: 'theme-palette4', to: 'ph-class-kb-pal8' });
		replacements.push({ from: 'theme-palette5', to: 'ph-class-kb-pal7' });
		replacements.push({ from: 'theme-palette6', to: 'ph-class-kb-pal7' });
		replacements.push({ from: 'theme-palette7', to: 'ph-class-kb-pal3' });
		replacements.push({ from: 'theme-palette8', to: 'ph-class-kb-pal3' });
		replacements.push({ from: 'theme-palette9', to: 'ph-class-kb-pal4' });
		replacements.push({ from: 'palette3', to: 'ph-kb-pal9' });
		replacements.push({ from: 'palette4', to: 'ph-kb-pal8' });
		replacements.push({ from: 'palette5', to: 'ph-kb-pal7' });
		replacements.push({ from: 'palette6', to: 'ph-kb-pal7' });
		replacements.push({ from: 'palette7', to: 'ph-kb-pal3' });
		replacements.push({ from: 'palette8', to: 'ph-kb-pal3' });
		replacements.push({ from: 'palette9', to: 'ph-kb-pal4' });
	} else if ('highlight' === style) {
		// Handle Forms.
		let form_content = getStringBetween(content, '"submit":[{', ']}', 'wp:kadence/form');
		if (form_content) {
			const form_content_org = form_content;
			form_content = form_content.replaceAll('"color":""', '"color":"ph-kb-pal9"');
			form_content = form_content.replaceAll('"background":""', '"background":"ph-kb-pal3"');
			form_content = form_content.replaceAll('"colorHover":""', '"colorHover":"ph-kb-pal9"');
			form_content = form_content.replaceAll('"backgroundHover":""', '"backgroundHover":"ph-kb-pal4"');
			content = content.replace(form_content_org, form_content);
		}
		// Handle Dividers.
		let row_divider_content = getStringBetween(
			content,
			'wp:kadence/rowlayout',
			'wp:kadence/rowlayout',
			'kb-divider-static'
		);
		if (row_divider_content) {
			const row_divider_content_org = row_divider_content;
			row_divider_content = row_divider_content.replaceAll(
				'"bottomSepColor":"palette9"',
				'"bottomSepColor":"ph-kb-pal9"'
			);
			row_divider_content = row_divider_content.replaceAll(
				'"bottomSepColor":"palette8"',
				'"bottomSepColor":"ph-kb-pal8"'
			);
			row_divider_content = row_divider_content.replaceAll(
				'"topSepColor":"palette9"',
				'"topSepColor":"ph-kb-pal9"'
			);
			row_divider_content = row_divider_content.replaceAll(
				'"topSepColor":"palette8"',
				'"topSepColor":"ph-kb-pal8"'
			);
			content = content.replace(row_divider_content_org, row_divider_content);
		}
		// Handle Buttons differently.
		content = content.replaceAll(
			'"inheritStyles":"inherit"',
			'"color":"ph-kb-pal9","background":"ph-kb-pal3","colorHover":"ph-kb-pal9","backgroundHover":"ph-kb-pal4","inheritStyles":"inherit"'
		);
		// // Outline Buttons.
		content = content.replaceAll(
			'"inheritStyles":"outline"',
			'"color":"ph-kb-pal9","colorHover":"ph-kb-pal9","borderStyle":[{"top":["ph-kb-pal9","",""],"right":["ph-kb-pal9","",""],"bottom":["ph-kb-pal9","",""],"left":["ph-kb-pal9","",""],"unit":"px"}],"borderHoverStyle":[{"top":["ph-kb-pal9","",""],"right":["ph-kb-pal9","",""],"bottom":["ph-kb-pal9","",""],"left":["ph-kb-pal9","",""],"unit":"px"}],"inheritStyles":"outline"'
		);

		// Color Map Switch
		// 1 => 9
		// 2 => 8
		// 3 => 9
		// 4 => 9
		// 5 => 8
		// 6 => 7
		// 7 => 2
		// 8 => 2
		// 9 => 1
		replacements.push({ from: 'has-theme-palette-1', to: 'ph-kb-class9' });
		replacements.push({ from: 'has-theme-palette-2', to: 'ph-kb-class8' });
		replacements.push({ from: 'has-theme-palette-3', to: 'ph-kb-class9' });
		replacements.push({ from: 'has-theme-palette-4', to: 'ph-kb-class9' });
		replacements.push({ from: 'has-theme-palette-5', to: 'ph-kb-class8' });
		replacements.push({ from: 'has-theme-palette-6', to: 'ph-kb-class7' });
		replacements.push({ from: 'has-theme-palette-7', to: 'ph-kb-class2' });
		replacements.push({ from: 'has-theme-palette-8', to: 'ph-kb-class2' });
		replacements.push({ from: 'has-theme-palette-9', to: 'ph-kb-class1' });
		replacements.push({ from: 'theme-palette1', to: 'ph-class-kb-pal9' });
		replacements.push({ from: 'theme-palette2', to: 'ph-class-kb-pal8' });
		replacements.push({ from: 'theme-palette3', to: 'ph-class-kb-pal9' });
		replacements.push({ from: 'theme-palette4', to: 'ph-class-kb-pal9' });
		replacements.push({ from: 'theme-palette5', to: 'ph-class-kb-pal8' });
		replacements.push({ from: 'theme-palette6', to: 'ph-class-kb-pal8' });
		replacements.push({ from: 'theme-palette7', to: 'ph-class-kb-pal2' });
		replacements.push({ from: 'theme-palette8', to: 'ph-class-kb-pal2' });
		replacements.push({ from: 'theme-palette9', to: 'ph-class-kb-pal1' });
		replacements.push({ from: 'palette1', to: 'ph-kb-pal9' });
		replacements.push({ from: 'palette2', to: 'ph-kb-pal8' });
		replacements.push({ from: 'palette3', to: 'ph-kb-pal9' });
		replacements.push({ from: 'palette4', to: 'ph-kb-pal9' });
		replacements.push({ from: 'palette5', to: 'ph-kb-pal8' });
		replacements.push({ from: 'palette6', to: 'ph-kb-pal7' });
		replacements.push({ from: 'palette7', to: 'ph-kb-pal2' });
		replacements.push({ from: 'palette8', to: 'ph-kb-pal2' });
		replacements.push({ from: 'palette9', to: 'ph-kb-pal1' });
	}
	// Convert Placeholders
	const finalReplacements = [
		{ from: 'ph-kb-class1', to: 'has-theme-palette-1' },
		{ from: 'ph-kb-class2', to: 'has-theme-palette-2' },
		{ from: 'ph-kb-class3', to: 'has-theme-palette-3' },
		{ from: 'ph-kb-class4', to: 'has-theme-palette-4' },
		{ from: 'ph-kb-class5', to: 'has-theme-palette-5' },
		{ from: 'ph-kb-class6', to: 'has-theme-palette-6' },
		{ from: 'ph-kb-class7', to: 'has-theme-palette-7' },
		{ from: 'ph-kb-class8', to: 'has-theme-palette-8' },
		{ from: 'ph-kb-class9', to: 'has-theme-palette-9' },
		{ from: 'ph-class-kb-pal1', to: 'theme-palette1' },
		{ from: 'ph-class-kb-pal2', to: 'theme-palette2' },
		{ from: 'ph-class-kb-pal3', to: 'theme-palette3' },
		{ from: 'ph-class-kb-pal4', to: 'theme-palette4' },
		{ from: 'ph-class-kb-pal5', to: 'theme-palette5' },
		{ from: 'ph-class-kb-pal6', to: 'theme-palette6' },
		{ from: 'ph-class-kb-pal7', to: 'theme-palette7' },
		{ from: 'ph-class-kb-pal8', to: 'theme-palette8' },
		{ from: 'ph-class-kb-pal9', to: 'theme-palette9' },
		{ from: 'ph-kb-pal1', to: 'palette1' },
		{ from: 'ph-kb-pal2', to: 'palette2' },
		{ from: 'ph-kb-pal3', to: 'palette3' },
		{ from: 'ph-kb-pal4', to: 'palette4' },
		{ from: 'ph-kb-pal5', to: 'palette5' },
		{ from: 'ph-kb-pal6', to: 'palette6' },
		{ from: 'ph-kb-pal7', to: 'palette7' },
		{ from: 'ph-kb-pal8', to: 'palette8' },
		{ from: 'ph-kb-pal9', to: 'palette9' },
	];

	replacements.push(...finalReplacements);

	for (const replacement of replacements) {
		content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
	}

	return content;
}
