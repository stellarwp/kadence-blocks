/**
 * WordPress dependencies
 */
const getStringBetween = (str, start, end) => {
	// Check if form is there?
	if ( ! str.includes( 'wp:kadence/form' ) ) {
		return '';
	}
	// get the start of the submit button.
	const startpos = str.indexOf(start);
	if ( ! startpos ) {
		return '';
	}
	const pos = startpos + start.length;
    return str.substring(pos, str.indexOf(end, pos));
}
export default function replaceImages( content, images, categories, context, variation ) {
	if ( ! content ) {
		return content;
	}
	// Images
	if ( variation === 1 ) {
		// Background.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", images['aRoll1'] );
		// Image Block.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll4'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll5'] );
		// Background.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", images['aRoll5'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image-1024x672.jpg", images['aRoll4'] );
		
	} else if ( variation === 2 ) {
		// Background.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", images['aRoll3'] );
		// Image Block.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll5'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll4'] );
		// Background.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", images['aRoll4'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image-1024x672.jpg", images['aRoll1'] );
	} else {
		// Background.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", images['aRoll2'] );
		// Image Block.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll5'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", images['aRoll3'] );
		// Background.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", images['aRoll3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image-1024x672.jpg", images['aRoll5'] );
	}
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-8-819x1024.jpg", images['aRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-6-819x1024.jpg", images['aRoll4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-4-819x1024.jpg", images['aRoll3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-819x1024.jpg", images['aRoll2'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-7-819x1024.jpg", images['bRoll1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-5-819x1024.jpg", images['bRoll2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-819x1024.jpg", images['bRoll3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-819x1024.jpg", images['bRoll4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-9-819x1024.jpg", images['bRoll5'] );
	

	// Portrait ratio
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", images['bRoll5'] );
	// Smaller file.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll4']);
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll6'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", images['bRoll5'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll4']);
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll6'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", images['bRoll5'] );

	// Background.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", images['bg1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", images['bg1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", images['bg1'] );

	// People.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", images['pp1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp5'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp6'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp7'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp8'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp9'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", images['pp10'] );

	return content;
}
