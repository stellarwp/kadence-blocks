/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Panel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { SidebarPanel } from './sidebar-panel';

export function Sidebar({ panels, maxHeight, resizing }) {
  const [ activePanel, setActivePanel ] = useState(0);
  const [ sidebarRef, setSidebarRef ] = useState();
  const [ toggleOffset, setToggleOffset ] = useState(0);

  useEffect(() => {
    let toggleHeight = 0;

    if (sidebarRef) {
      const panelToggles = sidebarRef.querySelectorAll('.components-panel__body-title');

      panelToggles.forEach((toggle) => {
        toggleHeight += toggle.clientHeight;
      })
    }

    setToggleOffset(toggleHeight);
  }, [ sidebarRef ])

  useEffect(() => {
    // The resize event is used to ensure proper sidebar sizing.
    window.dispatchEvent(new Event('resize'));
  }, [ activePanel ])

  const handlePanelToggle = (panelIndex) => {
    setActivePanel(panelIndex);
  }

  if (! panels || panels.length === 0) {
    return;
  }

  const classes = classnames('kb-library-sidebar', {
    'is-resizing': resizing,
  })

  return (
    <Panel
      ref={ setSidebarRef }
      className={ classes }
    >
      {
        panels.map( ( panel, index ) => (
          <SidebarPanel
            key={ index }
            panel={ panel }
            panelCount={ panels.legth }
            maxHeight={ maxHeight - toggleOffset }
            opened={ activePanel === index }
            onToggle={ () => handlePanelToggle(index) }
          />
        ))
      }
    </Panel>
  );
}

