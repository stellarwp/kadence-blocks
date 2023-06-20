/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

export function useSidebar(panels, sidebarRef) {

  useEffect(() => {
    console.log(sidebarRef);
  }, [sidebarRef])

  function hasPanels() {
    return Array.isArray(panels) && panels.length > 0;
  }

  function getPanelToggleOffset() {
    let toggleHeight = 0;

    console.log(sidebarRef);

    if (sidebarRef?.current) {
      const panelToggles = sidebarRef.current.querySelectorAll('.components-panel__body-title');

      panelToggles.forEach((toggle) => {
        toggleHeight += toggle.clientHeight;
      })
    }

    return toggleHeight;
  }

  return {
    hasPanels,
    getPanelToggleOffset
  }
}

