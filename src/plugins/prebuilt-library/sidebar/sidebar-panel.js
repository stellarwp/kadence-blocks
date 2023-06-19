/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Button, PanelBody, PanelRow, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import * as kadenceIcons from '@kadence/icons';

export function SidebarPanel({ panel, opened, onToggle, maxHeight }) {
  const [ panelRef, setPanelRef ] = useState();
  const [ panelHeight, setPanelHeight ] = useState();
  const [ hasOverflow, setHasOverflow ] = useState(false);

  // Set panel height.
  useEffect(() => {
    if (panelRef?.clientHeight && opened && ! panelHeight) {
      setPanelHeight(panelRef.clientHeight);
    }
  }, [ panelRef?.clientHeight ])

  // Check overflow if maxHeight value changes.
  useEffect(() => {
    if (maxHeight && panelHeight && opened) {
      setHasOverflow(panelHeight > maxHeight);

      return;
    }

    setHasOverflow(false);
  }, [ maxHeight, panelHeight, opened ])

  const handlePanelToggle = () => {
    onToggle();
  }

  const classes = classnames('scrollable', {
    'has-overflow': hasOverflow,
  })

  const getIcon = () => {
    if (panel?.icon) {
      const CustomIcon = kadenceIcons[panel.icon];

      return CustomIcon ? <Icon icon={ CustomIcon } /> : null;
    }

    return null;
  }

  return (
    <PanelBody
      title={ panel.label }
      icon={ getIcon() }
      opened={ opened }
      onToggle={ handlePanelToggle }
    >
      <PanelRow>
        <div
          ref={ setPanelRef }
          className={ classes }
          style={{ 
            maxHeight: hasOverflow ? maxHeight : undefined,
          }}
        >
          {
            panel.options.map((option) => (
              <Button
								className={ 'kb-category-button' }
                key={ option.value }>
                { option.label }
              </Button>
            ))
          }
        </div>
      </PanelRow>
    </PanelBody>
  )
}

