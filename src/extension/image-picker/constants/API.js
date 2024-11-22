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
	},
};
