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
export default function replaceImages( content, images, categories, context, variation, teamCollection = '' ) {
	if ( ! content ) {
		return content;
	}
	if ( ! images.data?.[0]?.images ) {
		return content;
	}
	const aRoll = images.data?.[0]?.images;
	const bRoll = images.data?.[1]?.images || images.data?.[0]?.images;
	let pRoll = images.data?.[2]?.images;
	if ( ! pRoll && categories?.[0] == 'team' && teamCollection?.data?.[0]?.images ) {
		pRoll = teamCollection?.data?.[0]?.images;
	}
	if ( ! pRoll ) {
		pRoll = images.data?.[1]?.images || images.data?.[0]?.images
	}
	const resetVariation = 0;
	let bvariation = variation;
	if ( bvariation > bRoll.length ) {
		bvariation = bvariation - bRoll.length;
	}
	if ( bvariation > bRoll.length ) {
		bvariation = bvariation - bRoll.length;
	}
	let pvariation = variation;
	if ( pvariation > pRoll.length ) {
		pvariation = pvariation - pRoll.length;
	}
	if ( pvariation > pRoll.length ) {
		pvariation = pvariation - pRoll.length;
	}
	const imgs = {
		a1:aRoll?.[variation]?.sizes?.[0]?.src || aRoll?.[0]?.sizes?.[0]?.src,
		a2:aRoll?.[variation + 1]?.sizes?.[0]?.src || aRoll?.[resetVariation]?.sizes?.[0]?.src || aRoll?.[0]?.sizes?.[0]?.src,
		a3:aRoll?.[variation + 2]?.sizes?.[0]?.src || aRoll?.[resetVariation + 1]?.sizes?.[0]?.src || aRoll?.[0]?.sizes?.[0]?.src,
		a4:aRoll?.[variation + 3]?.sizes?.[0]?.src || aRoll?.[resetVariation + 2]?.sizes?.[0]?.src || aRoll?.[0]?.sizes?.[0]?.src,
		a5:aRoll?.[variation + 4]?.sizes?.[0]?.src || aRoll?.[resetVariation + 3]?.sizes?.[0]?.src || aRoll?.[0]?.sizes?.[0]?.src,
		b1:bRoll?.[bvariation]?.sizes?.[0]?.src || bRoll?.[0]?.sizes?.[0]?.src,
		b2:bRoll?.[bvariation + 1]?.sizes?.[0]?.src || bRoll?.[1]?.sizes?.[0]?.src || bRoll?.[0]?.sizes?.[0]?.src,
		b3:bRoll?.[bvariation + 2]?.sizes?.[0]?.src || bRoll?.[2]?.sizes?.[0]?.src || bRoll?.[1]?.sizes?.[0]?.src || bRoll?.[0]?.sizes?.[0]?.src,
		b4:bRoll?.[bvariation + 3]?.sizes?.[0]?.src || bRoll?.[3]?.sizes?.[0]?.src || bRoll?.[2]?.sizes?.[0]?.src || bRoll?.[1]?.sizes?.[0]?.src,
		b5:bRoll?.[bvariation + 4]?.sizes?.[0]?.src || bRoll?.[4]?.sizes?.[0]?.src || bRoll?.[3]?.sizes?.[0]?.src || bRoll?.[2]?.sizes?.[0]?.src,
		b6:bRoll?.[bvariation + 5]?.sizes?.[0]?.src || bRoll?.[5]?.sizes?.[0]?.src || bRoll?.[4]?.sizes?.[0]?.src || bRoll?.[3]?.sizes?.[0]?.src,
		p1:pRoll?.[pvariation]?.sizes?.[0]?.src || pRoll?.[0]?.sizes?.[0]?.src,
		p2:pRoll?.[pvariation + 1]?.sizes?.[0]?.src || pRoll?.[1]?.sizes?.[0]?.src || pRoll?.[0]?.sizes?.[0]?.src,
		p3:pRoll?.[pvariation + 2]?.sizes?.[0]?.src || pRoll?.[2]?.sizes?.[0]?.src || pRoll?.[1]?.sizes?.[0]?.src || pRoll?.[0]?.sizes?.[0]?.src,
		p4:pRoll?.[pvariation + 3]?.sizes?.[0]?.src || pRoll?.[3]?.sizes?.[0]?.src || pRoll?.[2]?.sizes?.[0]?.src || pRoll?.[1]?.sizes?.[0]?.src,
		p5:pRoll?.[pvariation + 4]?.sizes?.[0]?.src || pRoll?.[4]?.sizes?.[0]?.src || pRoll?.[3]?.sizes?.[0]?.src || pRoll?.[2]?.sizes?.[0]?.src,
		p6:pRoll?.[pvariation + 5]?.sizes?.[0]?.src || pRoll?.[5]?.sizes?.[0]?.src || pRoll?.[4]?.sizes?.[0]?.src || pRoll?.[3]?.sizes?.[0]?.src,
		p7:pRoll?.[pvariation + 6]?.sizes?.[0]?.src || pRoll?.[6]?.sizes?.[0]?.src || pRoll?.[5]?.sizes?.[0]?.src || pRoll?.[4]?.sizes?.[0]?.src,
		p8:pRoll?.[pvariation + 7]?.sizes?.[0]?.src || pRoll?.[7]?.sizes?.[0]?.src || pRoll?.[6]?.sizes?.[0]?.src || pRoll?.[5]?.sizes?.[0]?.src || pRoll?.[0]?.sizes?.[0]?.src,
		p9:pRoll?.[pvariation + 8]?.sizes?.[0]?.src || pRoll?.[8]?.sizes?.[0]?.src || pRoll?.[7]?.sizes?.[0]?.src || pRoll?.[6]?.sizes?.[0]?.src || pRoll?.[1]?.sizes?.[0]?.src,
	};
	if ( context && context.toString() === '14499' ) {
		// Cards 21.
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a4'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a4'] );
	}
	if ( context && ( context.toString() === '15379' || context.toString() === '14885' ) ) {
		// Team 19. Team 21
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p1'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p2'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p3'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p4'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p4'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p5'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p5'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p6'] );
		content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p6'] );
	}
	// Background.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-A-Roll-Image-scaled-1.jpg", imgs['a1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled-600x465.jpg", imgs['a2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1536x1189.jpg", imgs['a3'] );
	
	// Image Block.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a3'] );
	// Background.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image-1024x672.jpg", imgs['a4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Background-Image-1024x672.jpg", imgs['a4'] );
	
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-8-819x1024.jpg", imgs['a5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-6-819x1024.jpg", imgs['a4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-4-819x1024.jpg", imgs['a3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-819x1024.jpg", imgs['a2'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-7-819x1024.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-5-819x1024.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-819x1024.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-819x1024.jpg", imgs['b4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-9-819x1024.jpg", imgs['b5'] );
	
	// Portrait ratio
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-scaled.jpg", imgs['b4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-scaled.jpg", imgs['b5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-scaled.jpg", imgs['b6'] );
	// Smaller file.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b5']);
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b6'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-B-Roll-Image-819x1024-1.jpg", imgs['b5'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b5']);
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b6'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b6'] );

	// // Background.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", imgs['b1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", imgs['b2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", imgs['b3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5-1.jpeg", imgs['b4'] );

	// // People.
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled-1-1224x683.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p5'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p6'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p7'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p8'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p9'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-150x150.jpg", imgs['p4'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p4'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p6'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p6'] );

	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p1'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p2'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p3'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p4'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p5'] );
	content = content.replace( "https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p6'] );
	


	// FTC 
	/*
	// Background.
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['a2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-A-Roll-Image-scaled-1.jpg", imgs['a1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled-600x465.jpg", imgs['a2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['a2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1536x1189.jpg", imgs['a3'] );
	
	// Image Block.
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg", imgs['a3'] );
	// Background.
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image-1024x672.jpg", imgs['a4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Background-Image-1024x672.jpg", imgs['a4'] );
	
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-8-819x1024.jpg", imgs['a5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-6-819x1024.jpg", imgs['a4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-4-819x1024.jpg", imgs['a3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-819x1024.jpg", imgs['a2'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-7-819x1024.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-5-819x1024.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-819x1024.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-819x1024.jpg", imgs['b4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-9-819x1024.jpg", imgs['b5'] );
	
	// Portrait ratio
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-scaled.jpg", imgs['b4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-scaled.jpg", imgs['b5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-scaled.jpg", imgs['b6'] );
	// Smaller file.
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b5']);
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b6'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg", imgs['b5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-B-Roll-Image-819x1024-1.jpg", imgs['b5'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b5']);
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b6'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg", imgs['b6'] );

	// // Background.
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", imgs['b1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", imgs['b2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg", imgs['b3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5-1.jpeg", imgs['b4'] );

	// // People.
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled-1-1224x683.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p5'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p6'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p7'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p8'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p9'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg", imgs['p4'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg", imgs['p6'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg", imgs['p6'] );

	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p1'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p2'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p3'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p4'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p5'] );
	content = content.replace( "https://ftc.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg", imgs['p6'] );
	*/
	return content;
}
