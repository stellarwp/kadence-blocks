const axios = require('axios');
const fs = require('fs').promises;

async function fetchGoogleFonts() {
	const API_KEY = process.env.GOOGLE_FONTS_API_KEY;
	const response = await axios.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`);
	return response.data;
}

function generateFontsArrayContent(fonts) {
	let content = `<?php
          /**
           * Returns an array of Google fonts and their properties for the frontend font selector
           * Generated automatically by GitHub Action
           */\n\nreturn array(`;

	fonts.items.forEach((font, index) => {
		content += `'${font.family}' => array('v' => array(`;
		content += font.variants.map((v) => `'${v}'`).join(',');
		content += `), 'c' => array('${font.category}'))`;
		content += index === fonts.items.length - 1 ? '' : ',';
	});

	content += ');';
	return content;
}

function generateFontNamesArrayContent(fonts) {
	let content = `<?php
          /**
           * Returns a simple array of Google font names
           * Generated automatically by GitHub Action
           */\n\nreturn array(`;

	content += fonts.items.map((font) => `'${font.family}'`).join(',');
	content += ');';
	return content;
}

async function main() {
	try {
		console.log('Fetching Google Fonts data...');
		const fonts = await fetchGoogleFonts();

		// Validation check for minimum number of fonts
		if (fonts.items.length < 20) {
			console.error(`Error: Only ${fonts.items.length} fonts found. Expected at least 20 fonts.`);
			console.error('This might indicate an API error or rate limiting. Aborting update.');
			process.exit(1);
		}

		console.log('Generating PHP content...');
		const fontsArrayContent = generateFontsArrayContent(fonts);
		const fontNamesContent = generateFontNamesArrayContent(fonts);

		console.log('Writing to files...');
		await Promise.all([
			fs.writeFile('./includes/gfonts-array.php', fontsArrayContent),
			fs.writeFile('./includes/gfonts-names-array.php', fontNamesContent),
		]);

		console.log('Successfully updated ./includes/gfonts-array.php');
	} catch (error) {
		console.error('Error:', error);
		process.exit(1);
	}
}

main();
