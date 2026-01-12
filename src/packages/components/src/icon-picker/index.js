import {
	Popover,
	TextControl,
	PanelBody,
	SelectControl,
	Icon
} from '@wordpress/components';
import {__} from '@wordpress/i18n'
import { debounce, isEqual, has, get } from 'lodash';
import {applyFilters} from '@wordpress/hooks'
import { useState, useMemo, useEffect, useCallback } from '@wordpress/element';
import {default as GenIcon} from '../icons/gen-icon';
import { plus, chevronDown, closeSmall } from '@wordpress/icons';
import './editor.scss';
import SvgAddModal from './svg-add-modal';
import SvgDeleteModal from './svg-delete-modal';
import { compareVersions } from '@kadence/helpers';
import { default as IconRender } from '../icons/icon-render';
export default function KadenceIconPicker({
		value,
		onChange,
		label,
		placeholder = __( 'Select Icon', 'kadence-blocks' ),
		showSearch = true,
		renderFunc = null,
		className,
		theme = 'default',
		allowClear = false,
		icons = null
	}) {
	const [ popoverAnchor, setPopoverAnchor ] = useState();
	const [ isVisible, setIsVisible ] = useState( false );
	const [ search, setSearch ] = useState( '' );
	const [ filter, setFilter ] = useState( 'all' );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isDeleteOpen, setIsDeleteOpen ] = useState( false );
	const [ deleteId, setDeleteId ] = useState( null );
	const [ customSvgs, setCustomSvgs ] = useState( false );
	const [ customSvgTitles, setCustomSvgTitles ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	// Make sure user has pro and the appropriate version that has the rest endpoint to accept SVGs
	const hasPro = kadence_blocks_params.pro && kadence_blocks_params.pro === 'true' ? true : false;
	const proVersion = window?.kbpData ? get( window.kbpData, ['pVersion'], '1.0.0' ) : '1.0.0';
	const isSupportedProVersion = compareVersions(proVersion, '2.4.0') >= 0;
	const toggleVisible = () => {
		setIsVisible( !isVisible );
	}
	const debounceToggle = debounce( toggleVisible, 100 );

	const getCustomSvgs = async ( force = false) => {
		if ( force || ( hasPro && isSupportedProVersion && customSvgs === false && !isLoading ) ) {
			try {
				setIsLoading( true );
				const response = await fetchCustomSvgs( force );

				if( response.length > 0 ) {
					const svgIds = response.map( svg => svg.id.toString() );
					const svgTitles = {};
					response.forEach( item => {
						svgTitles[ item.id.toString() ] = item.title.rendered.toLowerCase();
					});

					if ( !isEqual( svgIds, customSvgs ) && svgIds.length > 0 ) {
						setCustomSvgs( svgIds );
						setCustomSvgTitles( svgTitles );
					}
				} else {
					setCustomSvgs( [] );
				}
			} catch ( error ) {
				setCustomSvgs( [] );
				console.error( 'Failed to fetch custom SVGs (picker):', error );
			}
			setIsLoading( false );
		}
	};
	useEffect( () => { getCustomSvgs(), [] } );

	const deleteCallback = () => {
		getCustomSvgs( true );
		setDeleteId( null );
	};

	const addCallback = ( postId ) => {
		onChange('kb-custom-' + postId.toString() );
		getCustomSvgs( true );
	};

	const translatedCustomSvgString = __( 'My Icons', 'kadence-blocks' );

	const iconNames = useMemo( () => {

		if ( icons ) {
			const iconNames = icons.map( ( slug ) => {
				return { value: slug, label: slug }
			} );

			if ( customSvgs.length > 0 ) {
				return { [translatedCustomSvgString]: customSvgs, ...iconNames };
			} else if( hasPro && isSupportedProVersion ) {
				return { [translatedCustomSvgString]: [ 'placeholder' ], ...iconNames };
			} 
				return iconNames;
			
		}
		const svgs = applyFilters( 'kadence.icon_options_names', kadence_blocks_params.icon_names );

		if ( customSvgs.length > 0 ) {
			return { [translatedCustomSvgString]: customSvgs, ...svgs };
		} else if( hasPro && isSupportedProVersion ) {
			return { [translatedCustomSvgString]: [ 'placeholder' ], ...svgs };
		}

		return svgs;
	}, [ kadence_blocks_params.icon_names, icons, customSvgs ] );

	const iconOptions = useMemo( () => {
		return applyFilters( 'kadence.icon_options', { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons, ...kadence_blocks_params_kbcustomicons.icons } )
	}, [ kadence_blocks_params_ico.icons, kadence_blocks_params_fa.icons, kadence_blocks_params_kbcustomicons.icons, customSvgs ] )
	const iconFilterOptions = useMemo( () => {
		const options = Object.keys( iconNames ).map( ( label, index ) => {
			return { value: index, label }
		} )

		return [ { value: 'all', label: __( 'Show All', 'kadence-blocks' ) }, ...options ]
	}, [ kadence_blocks_params.icon_names, iconNames ] )

	const iconRenderFunc = useCallback( ( iconSlug ) => {
		// Using GenIcon directly is less overhead, but IconRender allows for custom SVGs to be fetched and rendered
		if( iconSlug.startsWith( 'kb-custom' ) ) {
			return <IconRender className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} />;
		}

		return <GenIcon className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} icon={iconOptions[ iconSlug ]}/>;
	}, [ iconOptions ] );

	const iconRenderFunction = renderFunc ? renderFunc : iconRenderFunc;

	const results = useMemo( () => {
		let results = {}
		if ( !icons ) {
			const searchLower = search.toLowerCase();
			Object.keys( iconNames ).map( ( label, groupIndex ) => {
				if ( filter === 'all' || groupIndex === parseInt( filter ) ) {
					{
						iconNames[ label ].map( ( icon, iconIndex ) => {
							const iconLower = icon.toLowerCase();

							if ( search === '' || iconLower.includes( searchLower ) || ( groupIndex === 0 && has(customSvgTitles, iconLower.toString()) && customSvgTitles[iconLower.toString() ].includes( searchLower ) ) ) {

								results = {
									...results, [ groupIndex ]: {
										label,
										icons: { ...results[ groupIndex ]?.icons, [ icon ]: iconOptions[ icon ] }
									}
								}

								return icon
							}
						} )
					}
				}
			} )
		}
		return results
	}, [ search, filter, iconNames ] );

	return (
		<div className={'kadence-icon-picker'}>
			<SvgAddModal isOpen={isOpen} setIsOpen={setIsOpen} callback={addCallback} proVersion={proVersion} />
			<SvgDeleteModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} id={deleteId} callback={deleteCallback}/>
			<div className={`kadence-icon-picker-selection kadence-icon-picker-theme-${theme ? theme : 'default'}${className ? ' ' + className : ''}`}>
				{label && (
					<div className="kadence-icon-picker__title">
						<label className="components-base-control__label">{label}</label>
					</div>
				)}
				<div className='kadence-icon-picker-toggle-wrap'>
					<button
						onClick={() => debounceToggle()}
						ref={setPopoverAnchor}
						className={'kadence-icon-picker-link kadence-icon-picker-selection-toggle'}
					>
						<span className={`kadence-icon-picker-selection-value${!value ? ' kadence-icon-picker-placeholder' : ''}`}>{value ? iconRenderFunction( value ) : placeholder}</span>
						<span className='kadence-icon-picker-selection-arrow'><Icon icon={chevronDown}></Icon></span>
					</button>
					{value && allowClear && (
						<button className='kadence-icon-picker-clear' onClick={() => {
							onChange( '' );
							setIsVisible( false );
						}}><Icon icon={closeSmall}></Icon></button>
					)}
				</div>
			</div>

			{isVisible &&
				<Popover
					headerTitle={__( 'Select Icon', 'kadence-blocks' )}
					noArrow={false}
					// expandOnMobile={true}
					onClose={debounceToggle}
					placement="bottom-end"
					anchor={popoverAnchor}
					className={`kadence-icon-picker-pop-selection kadence-icon-picker-pop-theme-${theme ? theme : 'default'}`}
				>
					<div className="kadence-icon-picker-container">
						{showSearch && (
							<div className={'kadence-icon-picker-search'}>
								<TextControl
									label={__( 'Search Icons', 'kadence-blocks' )}
									hideLabelFromVision={true}
									value={search}
									placeholder={__( 'Search Icons', 'kadence-blocks' )}
									onChange={( value ) => setSearch( value )}
								/>
								<SelectControl
									label={__( 'Filter Icons', 'kadence-blocks' )}
									hideLabelFromVision={true}
									value={filter}
									options={iconFilterOptions}
									onChange={setFilter}
								/>
							</div>
						)}
						<div className={`kadence-icon-picker-content${showSearch ? ' has-search' : ''}`}>
							{icons && (
								<div className='kadence-icon-grid-wrap'>
									{( icons ).map( ( iconKey ) => {
										return (
											<button
												className={'kadence-icon-picker-link'}
												onClick={() => {
													onChange( iconKey );
													debounceToggle();
												}}
											>
												{iconRenderFunction( iconKey )}
											</button>
										)
									} )}
								</div>
							)}
							{!icons && (
								<>
									{Object.keys( results ).length === 0 &&
										<div style={{ padding: '15px' }}>
											<p>{__( 'No icons found', 'kadence-blocks' )}</p>
										</div>
									}
									{Object.keys( results ).map( ( groupKey ) => {
										return (
											<PanelBody
												title={results[ groupKey ].label}
												key={groupKey}
											>
												<div className='kadence-icon-grid-wrap'>
													{results[ groupKey ].label === translatedCustomSvgString && search === '' && isSupportedProVersion && hasPro && (
														<button
															className={'kadence-icon-picker-link add-custom-svg'}
															onClick={() => {
																setIsOpen( true );
																debounceToggle();
															}}
														>
															<Icon icon={plus}/>
														</button>
													)}
													{Object.keys( results[ groupKey ].icons ).map( ( iconKey ) => {
														if ( results[ groupKey ].label === translatedCustomSvgString ) {
															if( iconKey === 'placeholder'){
																return;
															}

															return (
																<div className={'kb-custom-svg'}>
																	{ hasPro && isSupportedProVersion && ( <div className={'custom-svg-delete'}
																		 onClick={() => {
																			setDeleteId( iconKey );
																			setIsDeleteOpen( true );
																		 }}>
																		<Icon icon={closeSmall} size={20}/>
																	</div> ) }
																	<button
																		title={ iconKey }
																		className={'kadence-icon-picker-link'}
																		key={results[ groupKey ].label + iconKey}
																		onClick={() => {
																			onChange( 'kb-custom-' + iconKey );
																			debounceToggle();
																		}}
																	>
																		{iconRenderFunction( 'kb-custom-' + iconKey )}
																	</button>
																</div>
															);
														} 
															return (
																<button
																	title={ iconKey }
																	className={'kadence-icon-picker-link'}
																	key={results[ groupKey ].label + iconKey}
																	onClick={() => {
																		onChange( iconKey );
																		debounceToggle();
																	}}
																>
																	{iconRenderFunction( iconKey )}
																</button>
															);
														
													} )
													}
												</div>

											</PanelBody>
										)
									} )}
								</>
							)}
						</div>
					</div>
				</Popover>
			}
		</div>
	)
}

const fetchCustomSvgs = async ( cacheBust = false ) => {
	const params = {
		per_page: 100,
	};

	if ( cacheBust ) {
		params.cache_bust = new Date().getTime();
	}

	const urlParams = new URLSearchParams( params );

	const response = await fetch( kadence_blocks_params.rest_url + `wp/v2/kadence_custom_svg?${ urlParams.toString() }`, {
		method: 'GET',
	} );

	if ( ! response.ok ) {
		throw new Error( 'Network response was not ok' );
	}

	return response.json();
};
