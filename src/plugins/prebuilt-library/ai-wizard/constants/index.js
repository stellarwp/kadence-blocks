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
		value: 'NEUTRAL',
		label: __('Neutral', 'kadence-blocks'),
		description: __('Provides balanced and unbiased information without any specific emotional tone.', 'kadence-blocks'),
	},
	{
		value: 'PROFESSIONAL',
		label: __('Professional', 'kadence-blocks'),
		description: __('Conveys expertise, reliability, and competence. Suitable for businesses and professional services.', 'kadence-blocks'),
	},
	{
		value: 'FRIENDLY',
		label: __('Friendly', 'kadence-blocks'),
		description: __('Creates a warm and approachable atmosphere, fostering a personal connection with the audience.', 'kadence-blocks'),
	},
	{
		value: 'INFORMATIVE',
		label: __('Informative', 'kadence-blocks'),
		description: __('Focuses on providing clear and helpful information about products, services, or topics of interest.', 'kadence-blocks'),
	},
	{
		value: 'ENGAGING',
		label: __('Engaging', 'kadence-blocks'),
		description: __('Captivates and holds the attention of the audience through compelling and interactive content.', 'kadence-blocks'),
	},
	{
		value: 'TRUSTWORTHY',
		label: __('Trustworthy', 'kadence-blocks'),
		description: __('Establishes credibility, reliability, and trust, essential for building strong relationships with customers.', 'kadence-blocks'),
	},
	{
		value: 'CONVERSATIONAL',
		label: __('Conversational', 'kadence-blocks'),
		description: __('Mimics natural conversation, making the content relatable and easy to understand.', 'kadence-blocks'),
	},
	{
		value: 'PERSUASIVE',
		label: __('Persuasive', 'kadence-blocks'),
		description: __('Influences and convinces the audience to take action through compelling and convincing language.', 'kadence-blocks'),
	},
	{
		value: 'UPBEAT',
		label: __('Upbeat', 'kadence-blocks'),
		description: __('Infuses content with positivity, energy, and enthusiasm, leaving a lasting impression on visitors.', 'kadence-blocks'),
	},
	{
		value: 'FUNNY',
		label: __('Funny', 'kadence-blocks'),
		description: __('Adds humor and entertainment to the content, aiming to create a lighthearted and amusing experience for the audience.', 'kadence-blocks'),
	},
	{
		value: 'INSPIRATIONAL',
		label: __('Inspirational', 'kadence-blocks'),
		description: __('Motivates and inspires the audience, encouraging them to pursue their goals and aspirations.', 'kadence-blocks'),
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

export const ENTITY_TYPE_COMPANY = 'COMPANY';
export const ENTITY_TYPE_INDIVIDUAL = 'INDIVIDUAL';
export const ENTITY_TYPE_ORGANIZATION = 'ORGANIZATION';

export const ENTITY_TYPE = [
	{
		value: ENTITY_TYPE_COMPANY,
		label: __( 'A Company', 'kadence-blocks' ),
	},
	{
		value: ENTITY_TYPE_INDIVIDUAL,
		label: __( 'An Individual', 'kadence-blocks' ),
	},
	{
		value: ENTITY_TYPE_ORGANIZATION,
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
		help: __( 'E.g.: 1234 Street #1, Chicago, IL 60076, USA', 'kadence-blocks' ),
		placeholder: __( 'Street Adress, City, State, Zipcode, Country', 'kadence-blocks' ),
	},
	{
		icon: mapMarker,
		text: __( 'Service Area', 'kadence-blocks' ),
		value: LOCATION_SERVICE_AREA,
		help: __( 'E.g.: Chicago, USA', 'kadence-blocks' ),
		placeholder: __( 'District, City, State, Zipcode, Country', 'kadence-blocks' ),
	},
	{
		icon: desktop,
		text: __( 'Online Only', 'kadence-blocks' ),
		value: LOCATION_ONLINE_ONLY,
		help: '',
		placeholder: '',
	},
];

