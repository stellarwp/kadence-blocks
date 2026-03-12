// import { PexelsIcon } from '@kadence/icons';

export const API = {
	proxy: 'https://content.startertemplatecloud.com/',
	defaults: {
		provider: 'pexels',
		order: 'latest',
		per_page: '20',
		query: 'image',
		image_type: 'JPEG',
		locale: 'EN_US',
		arr_key: 'results',
	},
	providers: ['Pexels'],
	pexels: {
		name: 'Pexels',
		requires_key: true,
		new: false,
		api_var: 'key',
		// icon: PexelsIcon,
	},
};

// PexelsIcon is currently not being used and we did not find implementation for it, so we commented it out to avoid build errors.
// slack discussion - https://lw.slack.com/archives/C0A32QSRQUS/p1773298378121059?thread_ts=1773238529.242199&cid=C0A32QSRQUS
