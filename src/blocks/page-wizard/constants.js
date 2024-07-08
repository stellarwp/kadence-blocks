/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const SEARCH_APP_ID = 'A3VQNQXTF3';
export const SEARCH_API_KEY = '1490aefba5f869d86cc5e27099af3306';
export const SEARCH_INDEX = 'ai_modal_industries';
export const API_MAX_ATTEMPTS = 3;
export const API_ROUTE_GET_COLLECTIONS = '/kb-design-library/v1/get_image_collections';
export const API_ROUTE_GET_IMAGES = '/kb-design-library/v1/get_images';
export const API_ROUTE_GET_VERTICALS = '/kb-design-library/v1/get_verticals';
export const COLLECTION_REQUEST_IMAGE_TYPE = 'JPEG';
export const API_URL = 'https://content.startertemplatecloud.com/wp-json/prophecy/v1/';
export const API_ROUTE_GET_KEYWORDS = '/kb-design-library/v1/get_keywords';
export const API_ROUTE_GET_SEARCH_QUERY = '/kb-design-library/v1/get_search_query';

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
export const COLLECTIONS_CUSTOM_SESSION_KEY = 'kadence_ai_custom_collections';

export const COLLECTION_REQUEST_BODY = {
	image_type: 'JPEG',
	sizes: [
		{
			id: 'medium_square',
			width: 600,
			height: 600,
			crop: true,
		},
		{
			id: 'download',
			width: 2048,
			height: 2048,
			crop: false,
		},
	],
};

export const LANG_TYPE = [
	{
		value: 'cs-CZ',
		label: __('Czech', 'kadence-blocks'),
	},
	{
		value: 'da-DK',
		label: __('Danish (Denmark)', 'kadence-blocks'),
	},
	{
		value: 'nl-BE',
		label: __('Dutch (Belgium)', 'kadence-blocks'),
	},
	{
		value: 'nl-N',
		label: __('Dutch (Netherlands)', 'kadence-blocks'),
	},
	{
		value: 'en-AU',
		label: __('English (Australia)', 'kadence-blocks'),
	},
	{
		value: 'en-CA',
		label: __('English (Canada)', 'kadence-blocks'),
	},
	{
		value: 'en-IN',
		label: __('English (India)', 'kadence-blocks'),
	},
	{
		value: 'en-NZ',
		label: __('English (New Zealand)', 'kadence-blocks'),
	},
	{
		value: 'en-GB',
		label: __('English (UK)', 'kadence-blocks'),
	},
	{
		value: 'en-US',
		label: __('English (US)', 'kadence-blocks'),
	},
	{
		value: 'fi-FI',
		label: __('Finnish', 'kadence-blocks'),
	},
	{
		value: 'fr-BE',
		label: __('French (Belgium)', 'kadence-blocks'),
	},
	{
		value: 'fr-CA',
		label: __('French (Canada)', 'kadence-blocks'),
	},
	{
		value: 'fr-FR',
		label: __('French (France)', 'kadence-blocks'),
	},
	{
		value: 'de-AT',
		label: __('German (Austria)', 'kadence-blocks'),
	},
	{
		value: 'de-BE',
		label: __('German (Belgium)', 'kadence-blocks'),
	},
	{
		value: 'de-DE',
		label: __('German (Germany)', 'kadence-blocks'),
	},
	{
		value: 'de-CH',
		label: __('German (Switzerland)', 'kadence-blocks'),
	},
	{
		value: 'hu-HU',
		label: __('Hungarian', 'kadence-blocks'),
	},
	{
		value: 'it-IT',
		label: __('Italian (Italy)', 'kadence-blocks'),
	},
	{
		value: 'pt-BR',
		label: __('Portuguese (Brazil)', 'kadence-blocks'),
	},
	{
		value: 'pt-PT',
		label: __('Portuguese (Portugal)', 'kadence-blocks'),
	},
	{
		value: 'es-AR',
		label: __('Spanish (Argentina)', 'kadence-blocks'),
	},
	{
		value: 'es-CO',
		label: __('Spanish (Colombia)', 'kadence-blocks'),
	},
	{
		value: 'es-419',
		label: __('Spanish (Latin America)', 'kadence-blocks'),
	},
	{
		value: 'es-MX',
		label: __('Spanish (Mexico)', 'kadence-blocks'),
	},
	{
		value: 'es-ES',
		label: __('Spanish (Spain)', 'kadence-blocks'),
	},
	{
		value: 'sv-SE',
		label: __('Swedish (Sweden)', 'kadence-blocks'),
	},
	{
		value: 'tr-TR',
		label: __('Turkish', 'kadence-blocks'),
	},
];

export const PAGE_CONTEXT_GOAL = 300;

export const PAGE_CONTEXT_STATUS = {
	initial: {
		color: '#757575',
		message: __('The more detail you add, the better.', 'kadence-blocks'),
	},
	weak: {
		color: '#DF3416',
		message: __('For better, more accurate copy enter a bit more content.', 'kadence-blocks'),
	},
	medium: {
		color: '#B35F00',
		message: __('This is a great start. Try adding a bit more information to your description.', 'kadence-blocks'),
	},
	strong: {
		color: '#1B8F6D',
		message: __('Excellent work! Want to add more? Keep going! More info means better content.', 'kadence-blocks'),
	},
	enough: {
		color: '#1B8F6D',
		message: __('Excellent work! You have added enough information.', 'kadence-blocks'),
	},
	less: {
		color: '#B35F00',
		message: __(
			"ok, you've added a lot of information. Try removing some to get better results.",
			'kadence-blocks'
		),
	},
	muchLess: {
		color: '#DF3416',
		message: __("You've added too much information. Remove some to move forward.", 'kadence-blocks'),
	},
};

export const THOUGHT_STARTERS = [
	'What is your core offering or skill?',
	'Tell your story. Be sure to feature your expertise and standout skills.',
	'Describe your process, services, or products you offer.',
	'What makes you stand out? Highlight your competitive edge and the value you bring?',
	'Do you have work and recognitions to highlight?',
	'What is the action you want visitors to take?',
];

export const KEYWORD_SUGGESTION_STATES = {
	loading: 'loading',
	notFound: 'notFound',
	error: 'error',
	success: 'success',
	allAdded: 'allAdded',
};
