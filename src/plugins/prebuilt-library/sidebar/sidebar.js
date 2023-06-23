/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';
import { Panel } from '@wordpress/components';

export const Sidebar = forwardRef( function Sidebar( props, ref ) {
 
  return (
    <Panel ref={ ref } className={ 'kb-library-sidebar' }>
      { props.children }
    </Panel>
  );
})

