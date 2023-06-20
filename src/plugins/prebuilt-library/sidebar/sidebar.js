/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect, forwardRef } from '@wordpress/element';
import { Panel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { SidebarPanel } from './sidebar-panel';

export const Sidebar = forwardRef( function Sidebar(props, ref) {
  const { panels, maxHeight, resizing } = props;
  const [ activePanel, setActivePanel ] = useState(0);
  // const [ sidebarRef, setSidebarRef ] = useState();
  const [ toggleOffset, setToggleOffset ] = useState(0);

  // useEffect(() => {
  //   let toggleHeight = 0;
  //
  //   if (ref) {
  //     const panelToggles = ref.querySelectorAll('.components-panel__body-title');
  //
  //     panelToggles.forEach((toggle) => {
  //       toggleHeight += toggle.clientHeight;
  //     })
  //   }
  //
  //   setToggleOffset(toggleHeight);
  // }, [ ref ])

  useEffect(() => {
    // The resize event is used to ensure proper sidebar sizing.
    window.dispatchEvent(new Event('resize'));
  }, [ activePanel ])

  // const handlePanelToggle = (panelIndex) => {
  //   setActivePanel(panelIndex);
  // }

  // if (! panels || panels.length === 0) {
  //   return;
  // }

  const classes = classnames('kb-library-sidebar', {
    'is-resizing': resizing,
  })

  return (
    <Panel
      ref={ ref }
      className={ classes }
    >
      { props.children }
      {/* { */}
      {/*   panels.map( ( panel, index ) => ( */}
      {/*     <SidebarPanel */}
      {/*       key={ index } */}
      {/*       panel={ panel } */}
      {/*       panelCount={ panels.legth } */}
      {/*       maxHeight={ maxHeight - toggleOffset } */}
      {/*       opened={ activePanel === index } */}
      {/*       onToggle={ () => handlePanelToggle(index) } */}
      {/*     /> */}
      {/*   )) */}
      {/* } */}
    </Panel>
  );
})

