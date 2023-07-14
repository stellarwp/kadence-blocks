/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store, mapMarker, desktop } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import BusinessBg from '../assets/business-bg.jpg';
import EducationBg from '../assets/education-bg.jpg';
import SpaBg from '../assets/spa-bg.jpg';
import TaxesBg from '../assets/taxes-bg.jpg';

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
	},
	{
		value: 'PROFESSIONAL',
		label: __('Professional', 'kadence-blocks'),
	},
	{
		value: 'FRIENDLY',
		label: __('Friendly', 'kadence-blocks'),
	},
	{
		value: 'INFORMATIVE',
		label: __('Informative', 'kadence-blocks'),
	},
	{
		value: 'ENGAGING',
		label: __('Engaging', 'kadence-blocks'),
	},
	{
		value: 'TRUSTWORTHY',
		label: __('Trustworthy', 'kadence-blocks'),
	},
	{
		value: 'CONVERSATIONAL',
		label: __('Conversational', 'kadence-blocks'),
	},
	{
		value: 'PERSUASIVE',
		label: __('Persuasive', 'kadence-blocks'),
	},
	{
		value: 'UPBEAT',
		label: __('Upbeat', 'kadence-blocks'),
	},
	{
		value: 'FUNNY',
		label: __('Funny', 'kadence-blocks'),
	},
	{
		value: 'INSPIRATIONAL',
		label: __('Inspirational', 'kadence-blocks'),
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
	'COMPANY': {
		label: __( 'Company Name', 'kadence-blocks' ),
		placeholder: __( 'Your Company', 'kadence-blocks' ),
	},
	'INDIVIDUAL': {
		label: __( 'Name', 'kadence-blocks' ),
		placeholder: __( 'Your Name', 'kadence-blocks' ),
	}, 
	'ORGANIZATION': {
		label: __( 'Organization Name', 'kadence-blocks' ),
		placeholder: __( 'Your Organization', 'kadence-blocks' ),
	}
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

export const MISSION_STATEMENT_GOAL = 300;

export const MISSION_STATEMENT_STATUS = {
	'weak': {
		color: '#DF3416',
		message: __( 'For better, more accurate copy enter a bit more content.', 'kadence-blocks' ),
	},
	'medium': {
		color: '#B35F00',
		message: __( 'This is a great start. Try adding a bit more if you can.', 'kadence-blocks' ),
	},
	'strong': {
		color: '#1B8F6D',
		message: __( 'Excellent work, this should help generate great content!', 'kadence-blocks' )
	}
}

export const INDUSTRY_BACKGROUNDS = [ SpaBg, BusinessBg, TaxesBg, EducationBg ];
