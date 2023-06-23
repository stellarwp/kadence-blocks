export function useSidebar(panels, sidebarRef) {

  function hasPanels() {
    return Array.isArray(panels) && panels.length > 0;
  }

  function getPanelToggleOffset() {
    let toggleHeight = 0;

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

