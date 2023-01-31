/**
 * Inspector Controls
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { createRef, useEffect } from '@wordpress/element';
import {
	blockDefault,
	brush,
	settings,
} from '@wordpress/icons';
import './editor.scss';

function InspectorControlTabs( { allowedTabs = null, activeTab, setActiveTab, openedTab, toggleOpened, tabs = null } ) {

	const defaultTabs = [
		{
			key  : 'general',
			title: __( 'General', 'kadence-blocks' ),
			icon : blockDefault,
		},
		{
			key  : 'style',
			title: __( 'Style', 'kadence-blocks' ),
			icon : brush,
		},
		{
			key  : 'advanced',
			title: __( 'Advanced', 'kadence-blocks' ),
			icon : settings,
		},
	];

	const tabKeys = [ 'general', 'style', 'advanced' ];
	const allowedTabKeys = allowedTabs ? allowedTabs : tabKeys;
	const tabsMap = tabs ? tabs : defaultTabs;
	const tabsContainer = createRef();

	if ( activeTab !== openedTab ) {
		setActiveTab( openedTab );
	}

	const setDataAttr = ( key ) => {
		const componentsPanel = tabsContainer.current.closest( '.components-panel' );

		if ( componentsPanel ) {
			componentsPanel.setAttribute( 'data-kadence-hide-advanced', ( key !== 'advanced' ) );
			componentsPanel.setAttribute( 'data-kadence-active-tab', key );
		}
	};

	const switchTab = ( key ) => {
		toggleOpened( key );
		setActiveTab( key );
	};

	useEffect( () => {
		setDataAttr( activeTab );
	}, [ activeTab ] );

	return (
		<div className="kadence-blocks-inspector-tabs" ref={ tabsContainer }>
			{tabsMap.map( ( {
				key, title, icon,
			}, i ) => {
				if ( allowedTabKeys.includes( key ) ) {
					return (
						<button
							key={key}
							aria-label={title + ' ' + __( 'tab', 'kadence-blocks' ) }
							onClick={() => switchTab( key )}
							className={classnames( {
								[ 'is-active' ]: key === activeTab,
							} )}
						>
							<Icon icon={icon}/> {title}
						</button>
					);
				}
			} )}
		</div>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const initialOpen = ( undefined !== ownProps.initialOpen ? ownProps.initialOpen : 'general' );
		return {
			openedTab: select( 'kadenceblocks/data' ).getOpenSidebarTabKey( ownProps.panelName + select( 'core/block-editor' ).getSelectedBlockClientId(), initialOpen ),
		};
	} ),
	withDispatch( ( dispatch, ownProps, { select } ) => {
		const { getSelectedBlockClientId } = select( 'core/block-editor' );

		return {
			toggleOpened: ( key ) => {
				dispatch( 'kadenceblocks/data' ).switchEditorTabOpened( ownProps.panelName + getSelectedBlockClientId(), key );
			},
		};
	} ),
] )( InspectorControlTabs );
