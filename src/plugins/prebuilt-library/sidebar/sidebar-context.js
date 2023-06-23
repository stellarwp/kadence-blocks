/**
 * External dependencies
 */
import classnames from 'classnames';
import debounce from 'lodash/debounce';

import { useEffect, useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { Button, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { update } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { aiIcon } from '@kadence/icons';
import { Sidebar, SidebarPanel, useSidebar } from '.';

export function SidebarContext( props ) {
	const {
		panels,
		maxHeight,
		onSidebarClick,
		onSidebarAiReloadClick,
		selected,
		localContexts
	} = props;

  const sidebarRef = useRef(null);
  const { hasPanels, getPanelToggleOffset } = useSidebar(panels, sidebarRef);
  const [ toggleOffset, setToggleOffset ] = useState(0);
  const [ activePanel, setActivePanel ] = useState(0);
	const [ isContextReloadVisible, setIsContextReloadVisible ] = useState( false );
	const [ popoverContextAnchor, setPopoverContextAnchor ] = useState();

	const { isContextRunning } = useSelect(
		( select ) => {
			return {
				isContextRunning: ( value ) => select( 'kadence/library' ).isContextRunning( value ),
			};
		},
		[]
	);

  useEffect(() => {
    if (sidebarRef) {
      const offset = getPanelToggleOffset();

      setToggleOffset(offset);
    }
  }, [ sidebarRef ])

  const handlePanelToggle = (panelIndex) => {
    setActivePanel(panelIndex);
  }

	const toggleReloadVisible = () => {
		setIsContextReloadVisible( ( state ) => ! state );
	};

  if (! hasPanels) {
    return;
  }

  return (
		<Sidebar ref={ sidebarRef }>
			{
				panels.map( ( panel, index ) => {
					// If options are empty, skip current panel.
					if (! panel?.options || panel.options.length === 0) {
						return;
					}

					return (
						<SidebarPanel
							key={ index }
							panel={ panel }
							panelCount={ panels.legth }
							maxHeight={ maxHeight - toggleOffset }
							opened={ activePanel === index }
							onToggle={ () => handlePanelToggle(index) }
						>
							{
								panel.options.map( ( option, index ) => {
									const wrapClasses = classnames('context-category-wrap', {
											'has-content': localContexts && localContexts.includes( option.value ),
										})
										const buttonClasses = classnames('kb-category-button', {
											'is-pressed': selected === option.value
										})
										const reloadButtonClasses = classnames('kb-reload-context-popover-toggle', {
											'is-pressed': isContextReloadVisible
										})

									return (
										<div key={ `${ option.value }-${ index }` } className={ wrapClasses }>
											<Button
												className={ buttonClasses }
												aria-pressed={ selected === option.value }
												onClick={ () => onSidebarClick( option.value ) }
											>
												{ isContextRunning( option.value ) ? <Spinner /> : ''}
												{ option.label }
											</Button>
											{ selected === option.value && (
												<>
													<Button
														className={ reloadButtonClasses }
														aria-pressed={ isContextReloadVisible }
														ref={ setPopoverContextAnchor }
														icon={ update }
														disabled={ isContextReloadVisible }
														onClick={ debounce( toggleReloadVisible, 100 ) }
														>
													</Button>
													{ isContextReloadVisible && (
														<Popover
															className='kb-library-extra-settings'
															placement='top-end'
															onClose={ debounce( toggleReloadVisible, 100 ) }
															anchor={ popoverContextAnchor }
															>
															<p>{__('You can regenerate ai content for this context. This will use one credit and your current ai text will be forever lost. Would you like to regenerate ai content for this context?', 'kadence-blocks')}</p>
															<Button
																variant='primary'
																icon={ aiIcon }
																iconSize={ 16 }
																disabled={ isContextRunning( option.value ) } // @todo: Figure out how to reference this function.
																iconPosition='right'
																text={ __( 'Regenerate AI Content', 'kadence-blocks' ) }
																className={ 'kb-reload-context-confirm' }
																onClick={ onSidebarAiReloadClick }
															/>
														</Popover>
													) }
												</>
											)}
										</div>
									)
								})
							}
						</SidebarPanel>
					)
				})
			}
		</Sidebar>
	)
}
