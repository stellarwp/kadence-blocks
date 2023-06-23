import {createReduxStore, register, createRegistrySelector, createRegistryControl} from '@wordpress/data';
import { get } from 'lodash';
import { object } from 'prop-types';
import { CONTEXTS_IN_PAGES } from './../data-fetch/constants';
const DEFAULT_STATE = {
	contextStates: {
		'value-prop': false,
		'products-services': false,
		'about': false,
		'achievements': false,
		'call-to-action': false,
		'testimonials': false,
		'get-started': false,
		'pricing-table': false,
		'location': false,
		'history': false,
		'mission': false,
		'profile': false,
		'team': false,
		'work': false,
		'faq': false,
		'welcome': false,
		'news': false,
		'blog': false,
		'contact-form': false,
		'subscribe-form': false,
		'careers': false,
		'donate': false,
		'events': false,
		'partners': false,
		'industries': false,
		'volunteer': false,
		'support': false,
	},
	context: {
		'value-prop': false,
		'products-services': false,
		'about': false,
		'achievements': false,
		'call-to-action': false,
		'testimonials': false,
		'get-started': false,
		'pricing-table': false,
		'location': false,
		'history': false,
		'mission': false,
		'profile': false,
		'team': false,
		'work': false,
		'faq': false,
		'welcome': false,
		'news': false,
		'blog': false,
		'contact-form': false,
		'subscribe-form': false,
		'careers': false,
		'donate': false,
		'events': false,
		'partners': false,
		'industries': false,
		'volunteer': false,
		'support': false,
	},
};
const controls = {
};

const actions = {
	updateContextState( context, contextState ) {
		return {
			type: 'UPDATE_CONTEXT_STATE',
			context,
			contextState
		};
	},
	updateMassContextState( contexts, contextState ) {
		return {
			type: 'UPDATE_MASS_CONTEXT_STATE',
			contexts,
			contextState
		};
	},
	updateContext( slug, context ) {
		return {
			type: 'UPDATE_CONTEXT',
			slug,
			context
		};
	},
	updateMassContext( slugs, contexts ) {
		return {
			type: 'UPDATE_MASS_CONTEXT',
			slugs,
			contexts
		};
	},
};

const store = createReduxStore( 'kadence/library', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'UPDATE_CONTEXT_STATE':
				let updatedContextStates = state.contextStates;
				updatedContextStates[action.context] = action.contextState;
				return {
					...state,
					contextStates:updatedContextStates,
				};
			case 'UPDATE_MASS_CONTEXT_STATE':
				let updatedMassContextStates = state.contextStates;
				action.contexts.forEach(tempContext => {
					updatedMassContextStates[tempContext] = action.contextState;
				});
				return {
					...state,
					contextStates:updatedMassContextStates,
				};
			case 'UPDATE_CONTEXT':
				let updatedContext = state.context;
				updatedContext[action.slug] = action.context;
				return {
					...state,
					context:updatedContext,
				};
			case 'UPDATE_MASS_CONTEXT':
				let updatedMassContext = state.context;
				action.slugs.forEach(slug => {
					updatedMassContext[slug] = action.contexts[slug];
				});
				return {
					...state,
					context:updatedMassContext,
				};
			default:
				return state;
		}
	},
	actions,
	controls,
	selectors: {
		getContextStates( state ) {
			const { contextStates } = state;
			return contextStates;
		},
		getContextState( state, context ) {
			const { contextStates } = state;
			return contextStates?.[context];
		},
		isContextEmpty( state, context ) {
			const { contextStates } = state;
			let contextIsEmpty = true;
			if ( contextStates?.[context] && false === contextStates?.[context] ) {
				contextIsEmpty = true;
			}
			return contextIsEmpty;
		},
		isContextRunning( state, context ) {
			const { contextStates } = state;
			return contextStates?.[context] === 'processing' || contextStates?.[context] === 'loading';
		},
		getContextContent( state, slug ) {
			const { context } = state;
			return context?.[slug];
		},
		hasContextContent( state, slug ) {
			const { context } = state;
			return context?.[slug] ? true : false;
		},
		getAllContext( state ) {
			const { context } = state;
			return context;
		},
		hasAllPageContext( state ) {
			const { context } = state;
			let hasAllContext = true;
			for ( let slug in CONTEXTS_IN_PAGES ) {
				if ( ! context?.[slug]?.content?.length ) {
					hasAllContext = false;
					break;
				}
			}
			return hasAllContext;
		}
	},
} );

register( store );
