/**
 * WordPress dependencies
 */
const getStringBetween = (str, start, end) => {
	// Check if form is there?
	if (!str.includes('wp:kadence/form')) {
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
export default function replaceImages(content, images, categories, context, variation, teamCollection = '') {
	if (!content) {
		return content;
	}

	if (!images.data?.[0]?.images) {
		return content;
	}
	const aRoll = images.data?.[0]?.images;
	const bRoll = images.data?.[1]?.images || images.data?.[0]?.images;
	let pRoll = images.data?.[2]?.images;
	if (!pRoll && categories?.[0] === 'team' && teamCollection?.data?.[0]?.images) {
		pRoll = teamCollection?.data?.[0]?.images;
	}
	if (!pRoll) {
		pRoll = images.data?.[1]?.images || images.data?.[0]?.images;
	}
	const resetVariation = 0;
	let bvariation = variation;
	if (bvariation > bRoll.length) {
		bvariation = bvariation - bRoll.length;
	}
	if (bvariation > bRoll.length) {
		bvariation = bvariation - bRoll.length;
	}
	let pvariation = variation;
	if (pvariation > pRoll.length) {
		pvariation = pvariation - pRoll.length;
	}
	if (pvariation > pRoll.length) {
		pvariation = pvariation - pRoll.length;
	}
	const imgs = {
		a1: aRoll?.[variation]?.sizes?.[0]?.src || aRoll?.[0]?.sizes?.[0]?.src,
		a2:
			aRoll?.[variation + 1]?.sizes?.[0]?.src ||
			aRoll?.[resetVariation]?.sizes?.[0]?.src ||
			aRoll?.[0]?.sizes?.[0]?.src,
		a3:
			aRoll?.[variation + 2]?.sizes?.[0]?.src ||
			aRoll?.[resetVariation + 1]?.sizes?.[0]?.src ||
			aRoll?.[0]?.sizes?.[0]?.src,
		a4:
			aRoll?.[variation + 3]?.sizes?.[0]?.src ||
			aRoll?.[resetVariation + 2]?.sizes?.[0]?.src ||
			aRoll?.[0]?.sizes?.[0]?.src,
		a5:
			aRoll?.[variation + 4]?.sizes?.[0]?.src ||
			aRoll?.[resetVariation + 3]?.sizes?.[0]?.src ||
			aRoll?.[0]?.sizes?.[0]?.src,
		b1: bRoll?.[bvariation]?.sizes?.[0]?.src || bRoll?.[0]?.sizes?.[0]?.src,
		b2: bRoll?.[bvariation + 1]?.sizes?.[0]?.src || bRoll?.[1]?.sizes?.[0]?.src || bRoll?.[0]?.sizes?.[0]?.src,
		b3:
			bRoll?.[bvariation + 2]?.sizes?.[0]?.src ||
			bRoll?.[2]?.sizes?.[0]?.src ||
			bRoll?.[1]?.sizes?.[0]?.src ||
			bRoll?.[0]?.sizes?.[0]?.src,
		b4:
			bRoll?.[bvariation + 3]?.sizes?.[0]?.src ||
			bRoll?.[3]?.sizes?.[0]?.src ||
			bRoll?.[2]?.sizes?.[0]?.src ||
			bRoll?.[1]?.sizes?.[0]?.src,
		b5:
			bRoll?.[bvariation + 4]?.sizes?.[0]?.src ||
			bRoll?.[4]?.sizes?.[0]?.src ||
			bRoll?.[3]?.sizes?.[0]?.src ||
			bRoll?.[2]?.sizes?.[0]?.src,
		b6:
			bRoll?.[bvariation + 5]?.sizes?.[0]?.src ||
			bRoll?.[5]?.sizes?.[0]?.src ||
			bRoll?.[4]?.sizes?.[0]?.src ||
			bRoll?.[3]?.sizes?.[0]?.src,
		p1: pRoll?.[pvariation]?.sizes?.[0]?.src || pRoll?.[0]?.sizes?.[0]?.src,
		p2: pRoll?.[pvariation + 1]?.sizes?.[0]?.src || pRoll?.[1]?.sizes?.[0]?.src || pRoll?.[0]?.sizes?.[0]?.src,
		p3:
			pRoll?.[pvariation + 2]?.sizes?.[0]?.src ||
			pRoll?.[2]?.sizes?.[0]?.src ||
			pRoll?.[1]?.sizes?.[0]?.src ||
			pRoll?.[0]?.sizes?.[0]?.src,
		p4:
			pRoll?.[pvariation + 3]?.sizes?.[0]?.src ||
			pRoll?.[3]?.sizes?.[0]?.src ||
			pRoll?.[2]?.sizes?.[0]?.src ||
			pRoll?.[1]?.sizes?.[0]?.src,
		p5:
			pRoll?.[pvariation + 4]?.sizes?.[0]?.src ||
			pRoll?.[4]?.sizes?.[0]?.src ||
			pRoll?.[3]?.sizes?.[0]?.src ||
			pRoll?.[2]?.sizes?.[0]?.src,
		p6:
			pRoll?.[pvariation + 5]?.sizes?.[0]?.src ||
			pRoll?.[5]?.sizes?.[0]?.src ||
			pRoll?.[4]?.sizes?.[0]?.src ||
			pRoll?.[3]?.sizes?.[0]?.src,
		p7:
			pRoll?.[pvariation + 6]?.sizes?.[0]?.src ||
			pRoll?.[6]?.sizes?.[0]?.src ||
			pRoll?.[5]?.sizes?.[0]?.src ||
			pRoll?.[4]?.sizes?.[0]?.src,
		p8:
			pRoll?.[pvariation + 7]?.sizes?.[0]?.src ||
			pRoll?.[7]?.sizes?.[0]?.src ||
			pRoll?.[6]?.sizes?.[0]?.src ||
			pRoll?.[5]?.sizes?.[0]?.src ||
			pRoll?.[0]?.sizes?.[0]?.src,
		p9:
			pRoll?.[pvariation + 8]?.sizes?.[0]?.src ||
			pRoll?.[8]?.sizes?.[0]?.src ||
			pRoll?.[7]?.sizes?.[0]?.src ||
			pRoll?.[6]?.sizes?.[0]?.src ||
			pRoll?.[1]?.sizes?.[0]?.src,
	};
	if (context && (context.toString() === '14499' || context.toString() === '18895')) {
		// Cards 21 & Video 23.
		const cardS =
			'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg';
		const cReplacements = [
			{ from: cardS, to: imgs.a1 },
			{ from: cardS, to: imgs.a1 },
			{ from: cardS, to: imgs.a2 },
			{ from: cardS, to: imgs.a2 },
			{ from: cardS, to: imgs.a3 },
			{ from: cardS, to: imgs.a3 },
			{ from: cardS, to: imgs.a4 },
			{ from: cardS, to: imgs.a4 },
		];

		for (const cRep of cReplacements) {
			content = content.replace(cRep.from, cRep.to);
		}
	}
	if (context && (context.toString() === '15379' || context.toString() === '14885')) {
		// Team 19. Team 21
		const teamS =
			'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg';
		const tReplacements = [
			{ from: teamS, to: imgs.p1 },
			{ from: teamS, to: imgs.p1 },
			{ from: teamS, to: imgs.p2 },
			{ from: teamS, to: imgs.p2 },
			{ from: teamS, to: imgs.p3 },
			{ from: teamS, to: imgs.p3 },
			{ from: teamS, to: imgs.p4 },
			{ from: teamS, to: imgs.p4 },
			{ from: teamS, to: imgs.p5 },
			{ from: teamS, to: imgs.p5 },
			{ from: teamS, to: imgs.p6 },
			{ from: teamS, to: imgs.p6 },
		];

		for (const tRep of tReplacements) {
			content = content.replace(tRep.from, tRep.to);
		}
	}

	const aRollS =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled.jpg';
	const aRollS1 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-A-Roll-Image-scaled-1.jpg';
	const aRollSML =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-scaled-600x465.jpg';
	const aRollBG =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-2048x1586.jpg';
	const aRollXL =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1536x1189.jpg';
	const aRollL =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-A-Roll-Image-1024x793.jpg';
	const exampleBG =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Background-Image.jpg';
	const exampleBGL =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Background-Image-1024x672.jpg';
	const aReplacements = [
		{ from: aRollS, to: imgs.a1 },
		{ from: aRollS, to: imgs.a2 },
		{ from: aRollS, to: imgs.a3 },
		{ from: aRollS, to: imgs.a4 },
		{ from: aRollS, to: imgs.a5 },
		{ from: aRollS, to: imgs.a1 },
		{ from: aRollS, to: imgs.a2 },
		{ from: aRollS, to: imgs.b1 },
		{ from: aRollS, to: imgs.b2 },
		{ from: aRollS, to: imgs.b3 },
		{ from: aRollS1, to: imgs.a1 },
		{ from: aRollSML, to: imgs.a2 },
		{ from: aRollBG, to: imgs.a3 },
		{ from: aRollBG, to: imgs.a4 },
		{ from: aRollBG, to: imgs.a5 },
		{ from: aRollBG, to: imgs.a1 },
		{ from: aRollBG, to: imgs.a2 },
		{ from: aRollBG, to: imgs.b1 },
		{ from: aRollBG, to: imgs.b2 },
		{ from: aRollBG, to: imgs.b3 },
		{ from: aRollXL, to: imgs.a3 },
		{ from: aRollL, to: imgs.a1 },
		{ from: aRollL, to: imgs.a2 },
		{ from: aRollL, to: imgs.a3 },
		{ from: aRollL, to: imgs.a4 },
		{ from: aRollL, to: imgs.a5 },
		{ from: aRollL, to: imgs.a3 },
		{ from: exampleBG, to: imgs.a5 },
		{ from: exampleBG, to: imgs.a5 },
		{ from: exampleBG, to: imgs.a5 },
		{ from: exampleBGL, to: imgs.a4 },
		{ from: exampleBGL, to: imgs.a4 },
	];

	for (const aRep of aReplacements) {
		content = content.replace(aRep.from, aRep.to);
	}

	// B Roll.
	const bRoll8L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-8-819x1024.jpg';
	const bRoll6L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-6-819x1024.jpg';
	const bRoll4L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-4-819x1024.jpg';
	const bRoll1L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-819x1024.jpg';
	const bRoll7L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-7-819x1024.jpg';
	const bRoll5L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-5-819x1024.jpg';
	const bRoll3L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-819x1024.jpg';
	const bRoll2L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-819x1024.jpg';
	const bRoll9L =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-9-819x1024.jpg';
	const bRollS =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-scaled.jpg';
	const bRollS1 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-1-scaled.jpg';
	const bRollS2 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-2-scaled.jpg';
	const bRollS3 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-3-scaled.jpg';
	const bRollL =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-819x1024.jpg';
	const bRollL1 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-B-Roll-Image-819x1024-1.jpg';
	const bRollML =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-B-Roll-Image-768x960.jpg';
	const bg5 = 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5.jpeg';
	const bg51 = 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Image-5-1.jpeg';
	const bgReplacements = [
		{ from: bRoll8L, to: imgs.a5 },
		{ from: bRoll6L, to: imgs.a4 },
		{ from: bRoll4L, to: imgs.a3 },
		{ from: bRoll1L, to: imgs.a2 },
		{ from: bRoll7L, to: imgs.b1 },
		{ from: bRoll5L, to: imgs.b2 },
		{ from: bRoll3L, to: imgs.b3 },
		{ from: bRoll2L, to: imgs.b4 },
		{ from: bRoll9L, to: imgs.b5 },
		{ from: bRollS, to: imgs.b1 },
		{ from: bRollS, to: imgs.b2 },
		{ from: bRollS, to: imgs.b3 },
		{ from: bRollS1, to: imgs.b4 },
		{ from: bRollS2, to: imgs.b5 },
		{ from: bRollS3, to: imgs.b6 },
		{ from: bRollL, to: imgs.b1 },
		{ from: bRollL, to: imgs.b2 },
		{ from: bRollL, to: imgs.b3 },
		{ from: bRollL, to: imgs.b4 },
		{ from: bRollL, to: imgs.b5 },
		{ from: bRollL, to: imgs.b6 },
		{ from: bRollL, to: imgs.b1 },
		{ from: bRollL, to: imgs.b2 },
		{ from: bRollL, to: imgs.b3 },
		{ from: bRollL, to: imgs.b4 },
		{ from: bRollL1, to: imgs.b5 },
		{ from: bRollML, to: imgs.b1 },
		{ from: bRollML, to: imgs.b2 },
		{ from: bRollML, to: imgs.b3 },
		{ from: bRollML, to: imgs.b4 },
		{ from: bRollML, to: imgs.b5 },
		{ from: bRollML, to: imgs.b6 },
		{ from: bRollML, to: imgs.b1 },
		{ from: bRollML, to: imgs.b2 },
		{ from: bRollML, to: imgs.b3 },
		{ from: bRollML, to: imgs.b4 },
		{ from: bRollML, to: imgs.b5 },
		{ from: bRollML, to: imgs.b6 },
		{ from: bg5, to: imgs.b1 },
		{ from: bg5, to: imgs.b2 },
		{ from: bg5, to: imgs.b3 },
		{ from: bg51, to: imgs.b4 },
	];

	for (const rep of bgReplacements) {
		content = content.replace(rep.from, rep.to);
	}

	// Convert Portrait.
	const portS1 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled-1-1224x683.jpg';
	const portS =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-scaled.jpg';
	const port = 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image.jpg';
	const portL =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg';
	const portT =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-150x150.jpg';
	const portM =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-300x200.jpg';
	const portraitL =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Example-Portrait-Image-1024x683.jpg';
	const portraitT =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-150x150.jpg';
	const portraitTS =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-150x150.jpg';
	const portraitTS1 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-150x150.jpg';
	const portraitM =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-300x200.jpg';
	const portraitMS =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-300x200.jpg';
	const portraitMS1 =
		'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/03/Example-Portrait-Image-scaled-1-300x200.jpg';
	const portraitReplacements = [
		{ from: portS1, to: imgs.p1 },
		{ from: portS, to: imgs.p1 },
		{ from: portS, to: imgs.p2 },
		{ from: portS, to: imgs.p3 },
		{ from: port, to: imgs.p1 },
		{ from: port, to: imgs.p2 },
		{ from: port, to: imgs.p3 },
		{ from: port, to: imgs.p4 },
		{ from: port, to: imgs.p5 },
		{ from: portL, to: imgs.p1 },
		{ from: portL, to: imgs.p2 },
		{ from: portL, to: imgs.p3 },
		{ from: portL, to: imgs.p4 },
		{ from: portL, to: imgs.p5 },
		{ from: portL, to: imgs.p6 },
		{ from: portL, to: imgs.p7 },
		{ from: portL, to: imgs.p8 },
		{ from: portL, to: imgs.p9 },
		{ from: portT, to: imgs.p1 },
		{ from: portT, to: imgs.p2 },
		{ from: portT, to: imgs.p3 },
		{ from: portT, to: imgs.p4 },
		{ from: portM, to: imgs.p1 },
		{ from: portM, to: imgs.p2 },
		{ from: portM, to: imgs.p3 },
		{ from: portM, to: imgs.p4 },
		{ from: portraitL, to: imgs.p1 },
		{ from: portraitL, to: imgs.p2 },
		{ from: portraitL, to: imgs.p3 },
		{ from: portraitL, to: imgs.p4 },
		{ from: portraitT, to: imgs.p1 },
		{ from: portraitT, to: imgs.p2 },
		{ from: portraitT, to: imgs.p3 },
		{ from: portraitT, to: imgs.p4 },
		{ from: portraitTS, to: imgs.p1 },
		{ from: portraitTS, to: imgs.p2 },
		{ from: portraitTS, to: imgs.p3 },
		{ from: portraitTS, to: imgs.p4 },
		{ from: portraitTS1, to: imgs.p1 },
		{ from: portraitTS1, to: imgs.p2 },
		{ from: portraitTS1, to: imgs.p3 },
		{ from: portraitTS1, to: imgs.p4 },
		{ from: portraitM, to: imgs.p1 },
		{ from: portraitM, to: imgs.p2 },
		{ from: portraitM, to: imgs.p3 },
		{ from: portraitM, to: imgs.p4 },
		{ from: portraitM, to: imgs.p5 },
		{ from: portraitM, to: imgs.p6 },
		{ from: portraitMS, to: imgs.p1 },
		{ from: portraitMS, to: imgs.p2 },
		{ from: portraitMS, to: imgs.p3 },
		{ from: portraitMS, to: imgs.p4 },
		{ from: portraitMS, to: imgs.p5 },
		{ from: portraitMS, to: imgs.p6 },
		{ from: portraitMS1, to: imgs.p1 },
		{ from: portraitMS1, to: imgs.p2 },
		{ from: portraitMS1, to: imgs.p3 },
		{ from: portraitMS1, to: imgs.p4 },
		{ from: portraitMS1, to: imgs.p5 },
		{ from: portraitMS1, to: imgs.p6 },
	];

	for (const replacement of portraitReplacements) {
		content = content.replace(replacement.from, replacement.to);
	}
	return content;
}
