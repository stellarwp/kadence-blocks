/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const BASE_URL = 'http://prophecywp.lndo.site'; // @todo Remove local BASE_URL.

export const PROPHECY_ROUTE_GET_COLLECTIONS = `${ BASE_URL }/wp-json/prophecy/v1/images/collections`;
export const PROPHECY_ROUTE_GET_VERTICALS = `${ BASE_URL }/wp-json/prophecy/v1/verticals`;

export const API_MAX_ATTEMPTS = 3;
export const API_ROUTE_GET_COLLECTIONS = '/kb-design-library/v1/get_image_collections';
export const API_ROUTE_GET_IMAGES = '/kb-design-library/v1/get_images';
export const API_ROUTE_GET_VERTICALS = '/kb-design-library/v1/get_verticals';
export const COLLECTION_REQUEST_IMAGE_TYPE = 'WEBP';
export const COLLECTION_REQUEST_IMAGE_SIZES = [
	{
		id: 'medium_portrait',
		width: 600,
		height: 800,
		crop: true
	},
	{
		id: 'medium_landscape',
		width: 800,
		height: 600,
		crop: true
	}
];

export const CONTENT_TONE = [
	{
		value: 'APPRECIATIVE',
		label: __('Appreciative', 'kadence'),
	},
	{
		value: 'ASSERTIVE',
		label: __('Assertive', 'kadence'),
	},
	{
		value: 'AWESTRUCK',
		label: __('Awestruck', 'kadence'),
	},
	{
		value: 'CANDID',
		label: __('Candid', 'kadence'),
	},
	{
		value: 'CASUAL',
		label: __('Casual', 'kadence'),
	},
	{
		value: 'CAUTIONARY',
		label: __('Cautionary', 'kadence'),
	},
	{
		value: 'COMPASSIONATE',
		label: __('Compassionate', 'kadence'),
	},
	{
		value: 'CONVINCING',
		label: __('Convincing', 'kadence'),
	},
	{
		value: 'CRITICAL',
		label: __('Critical', 'kadence'),
	},
	{
		value: 'EARNEST',
		label: __('Earnest', 'kadence'),
	},
	{
		value: 'ENTHUSIASTIC',
		label: __('Enthusiastic', 'kadence'),
	},
	{
		value: 'FORMAL',
		label: __('Formal', 'kadence'),
	},
	{
		value: 'FUNNY',
		label: __('Funny', 'kadence'),
	},
	{
		value: 'HUMBLE',
		label: __('Humble', 'kadence'),
	},
	{
		value: 'HUMOROUS',
		label: __('Humorous', 'kadence'),
	},
	{
		value: 'INFORMATIVE',
		label: __('Informative', 'kadence'),
	},
	{
		value: 'INSPIRATIONAL',
		label: __('Inspirational', 'kadence'),
	},
	{
		value: 'JOYFUL',
		label: __('Joyful', 'kadence'),
	},
	{
		value: 'PASSIONATE',
		label: __('Passionate', 'kadence'),
	},
	{
		value: 'THOUGHTFUL',
		label: __('Thoughtful', 'kadence'),
	},
	{
		value: 'URGENT',
		label: __('Urgent', 'kadence'),
	},
	{
		value: 'WORRIED',
		label: __('Worried', 'kadence'),
	},
];

export const VERTICALS_SESSION_KEY = 'kadence_ai_verticals';
export const COLLECTIONS_SESSION_KEY = 'kadence_ai_collections';

export const COLLECTION_REQUEST_BODY = {
	image_type: 'WEBP',
	sizes: [
		{
			id: 'medium_portrait',
			width: 600,
			height: 800,
			crop: true
		},
		{
			id: 'medium_landscape',
			width: 800,
			height: 600,
			crop: true
		}
	]
};

