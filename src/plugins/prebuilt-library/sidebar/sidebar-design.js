/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Sidebar, SidebarPanel, useSidebar } from '.';

export function SidebarDesign(props) {
  const {
    panels,
    maxHeight,
    onSidebarClick,
    selected
  } = props;

  const sidebarRef = useRef( null );
  const { hasPanels, getPanelToggleOffset } = useSidebar( panels, sidebarRef );
  const [ toggleOffset, setToggleOffset ] = useState( 0 );
  const [ activePanel, setActivePanel ] = useState( 0 );

  useEffect( () => {
    if ( sidebarRef ) {
      const offset = getPanelToggleOffset();

      setToggleOffset(offset);
    }
  }, [ sidebarRef ] )

  const handlePanelToggle = ( panelIndex ) => {
    setActivePanel( panelIndex );
  }

  if ( ! hasPanels ) {
    return;
  }

  return (
    <Sidebar ref={ sidebarRef }>
      {
        panels.map( ( panel, index ) => {
          // If options are empty, skip current panel.
          if ( ! panel?.options || panel.options.length === 0 ) {
            return;
          }

          return (
            <SidebarPanel
              key={ index }
              panel={ panel }
              panelCount={ panels.legth }
              maxHeight={ maxHeight - toggleOffset }
              opened={ activePanel === index }
              onToggle={ () => handlePanelToggle( index ) }
            >
              {
                panel.options.map( ( option ) => {
                  const buttonClasses = classnames('kb-category-button', {
                    'is-pressed': selected === option.value
                  });

                  return (
                    <Button
                      key={ option.value }
                      aria-pressed={ selected === option.value }
                      className={ buttonClasses }
                      onClick={ () => onSidebarClick( option.value ) }
                      text={ option.label }
                    />
                  )
                } )
              }
            </SidebarPanel>
          )
        })
      }
    </Sidebar>
  );
}

