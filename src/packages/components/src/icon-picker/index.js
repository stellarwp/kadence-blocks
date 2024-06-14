import {
	Popover,
	TextControl,
	PanelBody,
	SelectControl,
	Icon
} from '@wordpress/components';
import {__} from '@wordpress/i18n'
import { debounce, isEqual } from 'lodash';
import {applyFilters} from '@wordpress/hooks'
import { useState, useMemo, useEffect, useCallback } from '@wordpress/element';
import {default as GenIcon} from '../icons/gen-icon';
import { plus } from '@wordpress/icons';
import './editor.scss';
import SvgModal from './svg-modal';
import {
	chevronDown,
	closeSmall,
} from '@wordpress/icons';
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
											  icons = null,
										  }) {
	const [ popoverAnchor, setPopoverAnchor ] = useState();
	const [ isVisible, setIsVisible ] = useState( false );
	const [ search, setSearch ] = useState( '' );
	const [ filter, setFilter ] = useState( 'all' );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ customSvgs, setCustomSvgs ] = useState( false );
	const [ customSvgContent, setCustomSvgContent ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( false );

	const toggleVisible = () => {
		setIsVisible( !isVisible );
	}
	const debounceToggle = debounce( toggleVisible, 100 );

	const getCustomSvgs = async ( force = false) => {
		console.log( 'Calling getCustomSvgs ' );
		if ( force || ( customSvgs === false && !isLoading ) ) {
			try {
				setIsLoading( true );
				const response = await fetchCustomSvgs();
				const svgIds = response.map( svg => svg.id.toString() );
				const svgContent = response.reduce( ( acc, svg ) => {
					acc[ svg.id ] = svg.content.rendered.replace('<p>', '').replace('</p>', '');
					return acc;
				});

				if ( !isEqual( svgIds, customSvgs ) ) {
					setCustomSvgs( svgIds );
					setCustomSvgContent( svgContent );
				}
			} catch ( error ) {
				console.error( 'Failed to fetch custom SVGs:', error );
			}
			setIsLoading( false );
		}
	};
	useEffect( () => { getCustomSvgs(), [] } );

	const deletePost = async ( id ) => {
		const response = await fetch(`/wp-json/wp/v2/kadence_custom_svg/manage/${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		return response.json();
	}

	const handleDelete = ( id ) => {
		console.log( 'id: ' + id );
		deletePost( id ).then( ( response ) => {

			console.log( response );
			getCustomSvgs( true );
		});

	}

	const iconNames = useMemo( () => {
		if ( icons ) {
			const iconNames = icons.map( ( slug ) => {
				return { value: slug, label: slug }
			} );

			if ( customSvgs ) {
				return { 'Kadence Custom SVG': customSvgs, ...iconNames };
			} else {
				return iconNames;
			}
		}
		const svgs = applyFilters( 'kadence.icon_options_names', kadence_blocks_params.icon_names );

		if ( customSvgs ) {
			return { 'Kadence Custom SVG': customSvgs, ...svgs };
		}

		return svgs;
	}, [ kadence_blocks_params.icon_names, icons, customSvgs ] );

	const iconOptions = useMemo( () => {
		const customAppen = customSvgs ? customSvgs : [];
		console.log( { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons, ...customSvgs } );

		return applyFilters( 'kadence.icon_options', { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons } )
	}, [ kadence_blocks_params_ico.icons, kadence_blocks_params_fa.icons, customSvgs ] )
	const iconFilterOptions = useMemo( () => {
		let options = Object.keys( iconNames ).map( ( label, index ) => {
			return { value: index, label: label }
		} )

		return [ { value: 'all', label: __( 'Show All', 'kadence-blocks' ) }, ...options ]
	}, [ kadence_blocks_params.icon_names, iconNames ] )

	const iconRender = useCallback( ( iconSlug ) => {
		return <GenIcon className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} icon={iconOptions[ iconSlug ]}/>;
	}, [ iconOptions ] );
	const iconRenderFunction = renderFunc ? renderFunc : iconRender;

	const results = useMemo( () => {
		let results = {}
		if ( !icons ) {
			const searchLower = search.toLowerCase();
			Object.keys( iconNames ).map( ( label, groupIndex ) => {
				if ( filter === 'all' || groupIndex === parseInt( filter ) ) {
					{
						iconNames[ label ].map( ( icon, iconIndex ) => {
							const iconLower = icon.toLowerCase();

							if ( search === '' || iconLower.includes( searchLower ) ) {

								results = {
									...results, [ groupIndex ]: {
										label: label,
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
			<SvgModal isOpen={isOpen} setIsOpen={setIsOpen}/>
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
											>
												<div className='kadence-icon-grid-wrap'>
													{results[ groupKey ].label === 'Kadence Custom SVG' && search === '' && (
														<button
															className={'kadence-icon-picker-link add-custom-svg'}
															onClick={() => {
																console.log( 'Add Custom' );
																setIsOpen( true );
																debounceToggle();
															}}
														>
															<Icon icon={plus}/>
														</button>
													)}
													{Object.keys( results[ groupKey ].icons ).map( ( iconKey ) => {
														if ( results[ groupKey ].label === 'Kadence Custom SVG' ) {
															return (
																<div className={'kb-custom-svg'}>
																	<div className={'custom-svg-delete'}
																		 onClick={() => {
																			 console.log( 'Delete Custo: ' + iconKey );
																			 handleDelete( iconKey );
																		 }}>
																		<Icon icon={closeSmall} size={20}/>
																	</div>
																	<button
																		className={'kadence-icon-picker-link'}
																		key={results[ groupKey ].label + iconKey}
																		onClick={() => {
																			onChange( iconKey );
																			debounceToggle();
																		}}
																		dangerouslySetInnerHTML={{__html: customSvgContent[ iconKey ]}}

																	/>
																</div>
															);
														} else {
															return (
																<button
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
														}
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

const fetchCustomSvgs = async () => {
	const response = await fetch('/wp-json/wp/v2/kadence_custom_svg', {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
};
