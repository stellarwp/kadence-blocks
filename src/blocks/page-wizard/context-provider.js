/**
 * WordPress dependencies
 */
import { createContext, useReducer, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const initialState = {
	isComplete: false,
	context: 'kadence',
	currentPageIndex: 0,
	wizardData: {},
	pageTitle: '',
	pageContext: '',
	pageStructure: [],
	pagePatterns: [],
	style: '',
	tone: 'NEUTRAL',
	privacyAgreement: false,
	photoLibrary: 'aiGenerated',
	photoCollectionChanged: false,
	featuredImages: [],
	backgroundImages: [],
	customCollections: [
		{
			label: __('My Images', 'kadence-blocks'),
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
};

const KadencePageWizardContext = createContext();

function kadencePageWizardAiReducer(state, action) {
	switch (action.type) {
		case 'SET_CURRENT_PAGE_INDEX':
			return {
				...state,
				currentPageIndex: action.payload,
			};
		case 'SET_WIZARD_DATA':
			return {
				...state,
				wizardData: action.payload,
			};
		case 'SET_LANG':
			return {
				...state,
				lang: action.payload,
			};
		case 'SET_PAGE_TITLE':
			return {
				...state,
				pageTitle: action.payload,
			};
		case 'SET_PAGE_CONTEXT':
			return {
				...state,
				pageContext: action.payload,
			};
		case 'SET_PAGE_STRUCTURE':
			return {
				...state,
				pageStructure: action.payload,
			};
		case 'SET_PAGE_PATTERNS':
			return {
				...state,
				pagePatterns: action.payload,
			};
		case 'SET_LOCATION_TYPE':
			return {
				...state,
				locationType: action.payload,
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

function initializeKadencePageWizardAiState(data) {
	return {
		...initialState,
		...data,
	};
}

function KadencePageWizardAiProvider(props) {
	const [state, dispatch] = useReducer(kadencePageWizardAiReducer, props.value, initializeKadencePageWizardAiState);
	const value = { state, dispatch };

	return <KadencePageWizardContext.Provider value={value}>{props.children}</KadencePageWizardContext.Provider>;
}

function useKadencePageWizardAi() {
	const context = useContext(KadencePageWizardContext);

	if (context === undefined) {
		throw new Error('useKadenceAi must be used with KadencePageWizardAiProvider');
	}

	return context;
}

export { KadencePageWizardAiProvider, useKadencePageWizardAi };
