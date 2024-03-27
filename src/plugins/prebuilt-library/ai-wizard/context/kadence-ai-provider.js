/**
 * WordPress dependencies
 */
import { createContext, useReducer, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { ENTITY_TYPE_INDIVIDUAL } from '../constants';

const initialState = {
	isComplete: false,
	firstTime: true,
	isSubmitted: false,
	context: 'kadence',
	currentPageIndex: 0,
	companyName: '',
	entityType: ENTITY_TYPE_INDIVIDUAL,
	locationType: '',
	locationInput: '',
	location: '',
	industry: '',
	missionStatement: '',
	keywords: [],
	tone: 'NEUTRAL',
	privacyAgreement: false,
	photoLibrary: 'aiGenerated',
	photoCollectionChanged: false,
	featuredImages: [],
	backgroundImages: [],
	customCollections: [
		{
			label: __('My Images', 'kadence-blocks-pro'),
			value: 'my-images',
			galleries: [
				{ name: 'featured', isLocal: true, images: [] },
				{ name: 'background', isLocal: true, images: [] },
			],
		},
	],
	saving: false,
	saveError: false,
	verticals: [],
	suggestedKeywords: [],
	suggestedKeywordsState: '',
	imageSearchQuery: '',
	lang: '',
	goals: [],
};

const KadenceAiContext = createContext();

function kadenceAiReducer(state, action) {
	switch (action.type) {
		case 'SET_CURRENT_PAGE_INDEX':
			return {
				...state,
				currentPageIndex: action.payload,
			};
		case 'SET_COMPANY_NAME':
			return {
				...state,
				companyName: action.payload,
			};
		case 'SET_LANG':
			return {
				...state,
				lang: action.payload,
			};
		case 'SET_SITE_GOALS':
			return {
				...state,
				goals: action.payload,
			};
		case 'SET_ENTITY_TYPE':
			return {
				...state,
				entityType: action.payload,
			};
		case 'SET_LOCATION':
			return {
				...state,
				location: action.payload,
			};
		case 'SET_LOCATION_INPUT':
			return {
				...state,
				locationInput: action.payload,
			};
		case 'SET_LOCATION_TYPE':
			return {
				...state,
				locationType: action.payload,
			};
		case 'SET_INDUSTRY':
			return {
				...state,
				industry: action.payload,
			};
		case 'SET_MISSION_STATEMENT':
			return {
				...state,
				missionStatement: action.payload,
			};
		case 'SET_KEYWORDS':
			return {
				...state,
				keywords: action.payload,
			};
		case 'SET_TONE':
			return {
				...state,
				tone: action.payload,
			};
		case 'SET_PRIVACY_AGREEMENT':
			return {
				...state,
				privacyAgreement: !state.privacyAgreement,
			};
		case 'SET_PHOTO_LIBRARY':
			return {
				...state,
				photoLibrary: action.payload,
			};
		case 'SET_PHOTO_LIBRARY_CHANGED':
			return {
				...state,
				photoCollectionChanged: action.payload,
			};
		case 'SET_FEATURED_IMAGES':
			return {
				...state,
				featuredImages: action.payload,
			};
		case 'SET_BACKGROUND_IMAGES':
			return {
				...state,
				backgroundImages: action.payload,
			};
		case 'SET_CUSTOM_COLLECTIONS':
			return {
				...state,
				customCollections: action.payload,
			};
		case 'SET_FEATURED_PREVIEW':
			return {
				...state,
				featuredImage: action.payload,
			};
		case 'SET_BACKGROUND_PREVIEW':
			return {
				...state,
				backgroundImage: action.payload,
			};
		case 'SET_SAVING':
			return {
				...state,
				saving: action.payload,
			};
		case 'SET_IMAGE_SEARCH_QUERY':
			return {
				...state,
				imageSearchQuery: action.payload,
			};
		case 'SET_SUGGESTED_KEYWORDS':
			return {
				...state,
				suggestedKeywords: action.payload,
			};
		case 'SET_SUGGESTED_KEYWORDS_STATE':
			return {
				...state,
				suggestedKeywordsState: action.payload,
			};
		default:
			return state;
	}
}

function initializeKadenceAiState(data) {
	return {
		...initialState,
		...data,
	};
}

function KadenceAiProvider(props) {
	const [state, dispatch] = useReducer(kadenceAiReducer, props.value, initializeKadenceAiState);
	const value = { state, dispatch };

	return <KadenceAiContext.Provider value={value}>{props.children}</KadenceAiContext.Provider>;
}

function useKadenceAi() {
	const context = useContext(KadenceAiContext);

	if (context === undefined) {
		throw new Error('useKadenceAi must be used with KadenceAiProvider');
	}

	return context;
}

export { KadenceAiProvider, useKadenceAi };
