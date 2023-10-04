/**
 * Wordpress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

export function useSelectPlacement(pageRef, controlRef) {
	const [ menuHeight, setMenuHeight ] = useState( 300 );
	const [ menuPlacement, setMenuPlacement ] = useState( 'auto' );

	useEffect(() => {
		function handleResize() {
			if ( pageRef && controlRef ) {
				const pageRectangle = pageRef.getBoundingClientRect();
				const controlRectangle = controlRef.getBoundingClientRect();
				const proposedHeight = pageRectangle.bottom - (controlRectangle.bottom + 30);
				const placement = proposedHeight < 150 ? 'top' : 'auto';

				setMenuPlacement( placement );
				setMenuHeight( placement === 'top' ? 300 : proposedHeight );
			}
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, [ pageRef, controlRef ])

  return {
    menuPlacement,
    menuHeight
  }
}

