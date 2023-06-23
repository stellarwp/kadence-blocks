/**
 * Utility function for returning proper data structure for Design Library sidebar.
 *
 * Works for both Pattern and Page data.
 *
 * @param {object} menu
 * @param {object} data
 *
 * @return {array}
 */
export default function getSidebarStructure( menu, data ) {
  let sidebarData = [];

  if ( ! menu && ! data ) {
    return sidebarData;
  }

  if ( ! menu && data ) {
    return data;
  }

  // Loop through menu (necessary for menu order).
  Object.keys( menu ).forEach( ( menuKey ) => {
    // Loop through pages.
    Object.keys( data ).forEach( ( pageKey ) => {
      // If the current page matches the current menu.
      if ( data[ pageKey ].menuPosition[ menuKey ] ) {
        // If the current menu doesn't exist.
        if ( ! sidebarData?.[ menuKey ] ) {
          // Create object and add value to array.
          // sidebarData[menuKey] = [ data[pageKey] ];
          sidebarData[ menuKey ] = {
            label: menu[ menuKey ].label,
            icon: menu[ menuKey ].icon,
            options: [
              data[ pageKey ]
            ]
          }
        } else {
          sidebarData[ menuKey ].options.push( data[ pageKey ] );
        }
      }
    })
  })

  return sidebarData;
}

