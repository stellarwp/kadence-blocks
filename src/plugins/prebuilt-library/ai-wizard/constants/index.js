/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store, mapMarker, desktop } from '@wordpress/icons';

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
		label: __('Appreciative', 'kadence-blocks'),
	},
	{
		value: 'ASSERTIVE',
		label: __('Assertive', 'kadence-blocks'),
	},
	{
		value: 'AWESTRUCK',
		label: __('Awestruck', 'kadence-blocks'),
	},
	{
		value: 'CANDID',
		label: __('Candid', 'kadence-blocks'),
	},
	{
		value: 'CASUAL',
		label: __('Casual', 'kadence-blocks'),
	},
	{
		value: 'CAUTIONARY',
		label: __('Cautionary', 'kadence-blocks'),
	},
	{
		value: 'COMPASSIONATE',
		label: __('Compassionate', 'kadence-blocks'),
	},
	{
		value: 'CONVINCING',
		label: __('Convincing', 'kadence-blocks'),
	},
	{
		value: 'CRITICAL',
		label: __('Critical', 'kadence-blocks'),
	},
	{
		value: 'EARNEST',
		label: __('Earnest', 'kadence-blocks'),
	},
	{
		value: 'ENTHUSIASTIC',
		label: __('Enthusiastic', 'kadence-blocks'),
	},
	{
		value: 'FORMAL',
		label: __('Formal', 'kadence-blocks'),
	},
	{
		value: 'FUNNY',
		label: __('Funny', 'kadence-blocks'),
	},
	{
		value: 'HUMBLE',
		label: __('Humble', 'kadence-blocks'),
	},
	{
		value: 'HUMOROUS',
		label: __('Humorous', 'kadence-blocks'),
	},
	{
		value: 'INFORMATIVE',
		label: __('Informative', 'kadence-blocks'),
	},
	{
		value: 'INSPIRATIONAL',
		label: __('Inspirational', 'kadence-blocks'),
	},
	{
		value: 'JOYFUL',
		label: __('Joyful', 'kadence-blocks'),
	},
	{
		value: 'PASSIONATE',
		label: __('Passionate', 'kadence-blocks'),
	},
	{
		value: 'THOUGHTFUL',
		label: __('Thoughtful', 'kadence-blocks'),
	},
	{
		value: 'URGENT',
		label: __('Urgent', 'kadence-blocks'),
	},
	{
		value: 'WORRIED',
		label: __('Worried', 'kadence-blocks'),
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

export const ENTITY_TYPE = [
	{
		value: 'COMPANY',
		label: __( 'A Company', 'kadence-blocks' ),
	},
	{
		value: 'INDIVIDUAL',
		label: __( 'An Individual', 'kadence-blocks' ),
	},
	{
		value: 'ORGANIZATION',
		label: __( 'An Organization', 'kadence-blocks' ),
	},
];

export const ENTITY_TO_NAME = {
	'COMPANY': __( 'Company Name', 'kadence-blocks' ),
	'INDIVIDUAL': __( 'Name', 'kadence-blocks' ),
	'ORGANIZATION': __( 'Organization Name', 'kadence-blocks' ),
};

export const LOCATION_BUSINESS_ADDRESS = 'Business Address';
export const LOCATION_SERVICE_AREA = 'Service Area';
export const LOCATION_ONLINE_ONLY = 'Online Only';

export const LOCATION_TYPES = [
	{
		icon: store,
		text: __( 'Business Address', 'kadence-blocks' ),
		value: LOCATION_BUSINESS_ADDRESS,
		zvalue: 'business-address',
		help: __( 'E.g.: 1234 Street #1, Chicago, IL 60076, USA', 'kadence-blocks' ),
		placeholder: __( 'Street Adress, City, State, Zipcode, Country', 'kadence-blocks' ),
	},
	{
		icon: mapMarker,
		text: __( 'Service Area', 'kadence-blocks' ),
		value: LOCATION_SERVICE_AREA,
		zvalue: 'service-area',
		help: __( 'E.g.: Chicago, USA', 'kadence-blocks' ),
		placeholder: __( 'District, City, State, Zipcode, Country', 'kadence-blocks' ),
	},
	{
		icon: desktop,
		text: __( 'Online Only', 'kadence-blocks' ),
		Value: LOCATION_ONLINE_ONLY,
		zvalue: 'online-only',
		help: '',
		placeholder: '',
	},
];

