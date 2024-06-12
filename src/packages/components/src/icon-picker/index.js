import {
	Popover,
	TextControl,
	PanelBody,
	SelectControl,
	Icon
} from '@wordpress/components';
import {__} from '@wordpress/i18n'
import { debounce } from 'lodash';
import {applyFilters} from '@wordpress/hooks'
import { useState, useMemo } from '@wordpress/element';
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
	const [popoverAnchor, setPopoverAnchor] = useState();
	const [isVisible, setIsVisible] = useState(false);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('all');
	const [isOpen, setIsOpen] = useState(false);

	const toggleVisible = () => {
		setIsVisible( ! isVisible );
	}
	const debounceToggle = debounce( toggleVisible, 100 );
	const iconNames = useMemo(() => {
		if ( icons ) {
			const iconNames = icons.map(( slug ) => {
				return {value: slug, label: slug}
			});
			return iconNames;
		}
		return applyFilters('kadence.icon_options_names', kadence_blocks_params.icon_names);
	}, [kadence_blocks_params.icon_names, icons ] );
	const iconOptions = useMemo(() => {
		return applyFilters('kadence.icon_options', {...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons})
	}, [kadence_blocks_params_ico.icons, kadence_blocks_params_fa.icons])
	const iconFilterOptions = useMemo(() => {
		let options = Object.keys(iconNames).map((label, index) => {
			return {value: index, label: label}
		})

		return [{value: 'all', label: __('Show All', 'kadence-blocks')}, ...options]
	}, [kadence_blocks_params.icon_names])
	const iconRender = ( iconSlug ) => {
		return <GenIcon className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} icon={iconOptions[iconSlug]}/>
	}
	const iconRenderFunction = renderFunc ? renderFunc : iconRender;
	const results = useMemo(() => {
		let results = {}
		if ( ! icons ) {
			const searchLower = search.toLowerCase();
			Object.keys(iconNames).map((label, groupIndex) => {
				if (filter === 'all' || groupIndex === parseInt(filter)) {
					{
						iconNames[label].map((icon, iconIndex) => {
							const iconLower = icon.toLowerCase();

							if (search === '' || iconLower.includes(searchLower)) {

								results = {
									...results, [groupIndex]: {
										label: label,
										icons: {...results[groupIndex]?.icons, [icon]: iconOptions[icon]}
									}
								}

								return icon
							}
						})
					}
				}
			})
		}
		return results
	}, [search, filter]);

	return (
		<div className={'kadence-icon-picker'}>
			<SvgModal isOpen={isOpen} setIsOpen={setIsOpen} />
			<div className={ `kadence-icon-picker-selection kadence-icon-picker-theme-${ theme ? theme : 'default' }${ className ? ' ' + className : '' }`}>
				{ label && (
					<div className="kadence-icon-picker__title">
						<label className="components-base-control__label">{ label }</label>
					</div>
				) }
				<div className='kadence-icon-picker-toggle-wrap'>
					<button
						onClick={ () => debounceToggle() }
						ref={ setPopoverAnchor }
						className={'kadence-icon-picker-link kadence-icon-picker-selection-toggle'}
					>
						<span className={ `kadence-icon-picker-selection-value${ ! value ? ' kadence-icon-picker-placeholder' : '' }` }>{ value ? iconRenderFunction( value ) : placeholder }</span>
						<span className='kadence-icon-picker-selection-arrow'><Icon icon={ chevronDown }></Icon></span>
					</button>
					{ value && allowClear && (
						<button className='kadence-icon-picker-clear' onClick={ () => { onChange(''); setIsVisible( false ); } }><Icon icon={ closeSmall }></Icon></button>
					) }
				</div>
			</div>

			{isVisible &&
				<Popover
					headerTitle={ __('Select Icon', 'kadence-blocks') }
					noArrow={false}
					// expandOnMobile={true}
					onClose={debounceToggle}
					placement="bottom-end"
					anchor={popoverAnchor}
					className={ `kadence-icon-picker-pop-selection kadence-icon-picker-pop-theme-${ theme ? theme : 'default' }`}
				>
					<div className="kadence-icon-picker-container">
						{ showSearch && (
							<div className={'kadence-icon-picker-search'}>
								<TextControl
									label={__('Search Icons', 'kadence-blocks')}
									hideLabelFromVision={ true }
									value={search}
									placeholder={__('Search Icons', 'kadence-blocks')}
									onChange={(value) => setSearch(value)}
								/>
								<SelectControl
									label={__('Filter Icons', 'kadence-blocks')}
									hideLabelFromVision={ true }
									value={filter}
									options={iconFilterOptions}
									onChange={value => {
										setFilter(value)
									}}
								/>
							</div>
						) }
						<div className={`kadence-icon-picker-content${ showSearch ? ' has-search' : '' }`}>
							{ icons && (
								<div className='kadence-icon-grid-wrap'>
									{ (icons).map((iconKey) => {
										return (
											<button
												className={'kadence-icon-picker-link'}
												onClick={() => {
													onChange(iconKey);
													debounceToggle();
												}}
											>
												{ iconRenderFunction( iconKey ) }
											</button>
										)
									})}
								</div>
							) }
							{ ! icons && (
								<>
									{Object.keys(results).length === 0 &&
										<div style={ { padding: '15px' } }>
											<p>{__('No icons found', 'kadence-blocks')}</p>
										</div>
									}
									{Object.keys(results).map((groupKey) => {
										return (
											<PanelBody
												title={results[groupKey].label}
											>
												<div className='kadence-icon-grid-wrap'>
													{ results[groupKey].label === 'Kadence Custom SVG' && search === '' && (
														<button
															className={'kadence-icon-picker-link add-custom-svg'}
															onClick={() => {
																console.log( 'Add Custom' );
																setIsOpen(true);
																debounceToggle();
															}}
														>
															<Icon icon={plus} />
														</button>
													)}
													{Object.keys(results[groupKey].icons).map((iconKey) => {
														return (
															<button
																className={'kadence-icon-picker-link'}
																key={ results[groupKey].label + iconKey }
																onClick={() => {
																	onChange(iconKey);
																	debounceToggle();
																}}
															>
																{ iconRenderFunction( iconKey ) }
															</button>
														)
													})}
												</div>

											</PanelBody>
										)
									})}
								</>
							)}
						</div>
					</div>
				</Popover>
			}
		</div>
	)
}


// function sanitizeSVG(svgContent) {
// 	const allowedTags = [
// 		'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan',
// 		'use', 'defs', 'symbol', 'linearGradient', 'radialGradient', 'stop', 'pattern', 'mask', 'filter',
// 		'feGaussianBlur', 'feOffset', 'feBlend', 'feColorMatrix'
// 	];
//
// 	const allowedAttributes = [
// 		'id', 'class', 'style', 'x', 'y', 'width', 'height', 'viewBox', 'fill', 'stroke', 'd', 'transform',
// 		'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2', 'points', 'gradientUnits', 'gradientTransform',
// 		'href', 'startOffset', 'mask', 'filter', 'stdDeviation', 'in', 'result', 'values'
// 	];
//
// 	const parser = new DOMParser();
// 	const serializer = new XMLSerializer();
// 	const dom = parser.parseFromString(svgContent, 'text/xml');
// 	const elements = dom.getElementsByTagName('*');
//
// 	for (let i = elements.length - 1; i >= 0; i--) {
// 		const element = elements[i];
//
// 		// Remove element if it's not allowed
// 		if (!allowedTags.includes(element.nodeName)) {
// 			element.parentNode.removeChild(element);
// 			continue;
// 		}
//
// 		// Remove disallowed attributes
// 		for (let j = element.attributes.length - 1; j >= 0; j--) {
// 			const attribute = element.attributes[j];
// 			if (!allowedAttributes.includes(attribute.nodeName) || /^on/i.test(attribute.nodeName)) {
// 				element.removeAttribute(attribute.nodeName);
// 			}
// 		}
// 	}
//
// 	if( dom.documentElement ) {
// 		return serializer.serializeToString(dom.documentElement);
// 	}
//
// 	return '';
// }
