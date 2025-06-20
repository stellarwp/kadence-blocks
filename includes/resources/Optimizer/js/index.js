import { analyzeWebsite, isSupported } from '@stellarwp/perf-analyzer-client';

export function analyzeSite() {
	console.log('🎯 Kadence Analyzer loaded!');
	if (isSupported()) {
		analyzeWebsite('https://local.lndo.site/kadence-test/')
			.then((results) => {
				console.log('✅ Analysis complete:', results);
				window.kadenceResults = results; // Store for inspection
			})
			.catch(console.error);
	} else {
		console.log('❌ Not supported');
	}
}

analyzeSite();
