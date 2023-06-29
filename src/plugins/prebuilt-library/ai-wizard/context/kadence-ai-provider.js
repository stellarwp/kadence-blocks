/**
 * WordPress dependencies
 */
import { createContext, useReducer, useContext } from '@wordpress/element';

const initialState = {
	firstTime: true,
	context: 'kadence',
	currentPageIndex: 0,
	companyName: '',
	entityType: 'COMPANY',
	locationType: '',
	locationInput: '',
	location: '',
	industry: '',
	industrySpecific: '',
	industryOther: '',
	missionStatement: '',
	keywords: [],
	tone: '',
	privacyAgreement: false,
	photoLibrary: 'My Images',
	featuredImages: [],
	backgroundImages: [],
	saving: false,
	saveError: false,
	verticals: []
};

const KadenceAiContext = createContext();

function kadenceAiReducer(state, action) {
	switch (action.type) {
		case 'SET_CURRENT_PAGE_INDEX':
			return {
				...state,
				currentPageIndex: action.payload
			}
		case 'SET_COMPANY_NAME':
			return {
				...state,
				companyName: action.payload
			}
		case 'SET_ENTITY_TYPE':
			return {
				...state,
				entityType: action.payload
			}
		case 'SET_LOCATION':
			return {
				...state,
				location: action.payload
			}
		case 'SET_LOCATION_INPUT':
			return {
				...state,
				locationInput: action.payload
			}
		case 'SET_LOCATION_TYPE':
			return {
				...state,
				locationType: action.payload
			}
		case 'SET_INDUSTRY':
			return {
				...state,
				industry: action.payload
			}
		case 'SET_INDUSTRY_SPECIFIC':
			return {
				...state,
				industrySpecific: action.payload
			}
		case 'SET_INDUSTRY_OTHER':
			return {
				...state,
				industryOther: action.payload
			}
		case 'SET_MISSION_STATEMENT':
			return {
				...state,
				missionStatement: action.payload
			}
		case 'SET_KEYWORDS':
			return {
				...state,
				keywords: action.payload
			}
		case 'SET_TONE':
			return {
				...state,
				tone: action.payload
			}
		case 'SET_PRIVACY_AGREEMENT':
			return {
				...state,
				privacyAgreement: ! state.privacyAgreement
			}
		case 'SET_PHOTO_LIBRARY':
			return {
				...state,
				photoLibrary: action.payload
			}
		case 'SET_FEATURED_IMAGES':
			return {
				...state,
				featuredImages: action.payload
			}
		case 'SET_BACKGROUND_IMAGES':
			return {
				...state,
				backgroundImages: action.payload
			}
		case 'SET_FEATURED_PREVIEW':
			return {
				...state,
				featuredImage: action.payload
			}
		case 'SET_BACKGROUND_PREVIEW':
			return {
				...state,
				backgroundImage: action.payload
			}
		case 'SET_SAVING':
			return {
				...state,
				saving: action.payload
			}
		default:
			return state;
	}
}

function initializeKadenceAiState(data) {
	return {
		...initialState,
		...data
	};
}

function KadenceAiProvider(props) {
	const [ state, dispatch ] = useReducer(kadenceAiReducer, props.value, initializeKadenceAiState);
	const value = { state, dispatch };

	return <KadenceAiContext.Provider value={ value }>
			{ props.children }
		</KadenceAiContext.Provider>
}

function useKadenceAi() {
	const context = useContext(KadenceAiContext);

	if (context === undefined) {
		throw new Error('useKadenceAi must be used with KadenceAiProvider');
	}

	return context;
}

export { KadenceAiProvider, useKadenceAi }

