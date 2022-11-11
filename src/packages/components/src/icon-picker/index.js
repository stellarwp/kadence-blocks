import {
    Button,
    Popover,
    TextControl,
    PanelBody,
    SelectControl,
    Icon,
    CheckboxControl,
} from '@wordpress/components'
import {__} from '@wordpress/i18n'
import {applyFilters} from '@wordpress/hooks'
import {useState, useEffect, useMemo} from '@wordpress/element'
import {default as GenIcon} from '../icons/gen-icon'

export default function KadenceIconPicker({value, onChange}) {

    const [popoverAnchor, setPopoverAnchor] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const toggleVisible = () => {
        setIsVisible((state) => !state)
    }

    const iconNames = useMemo(() => applyFilters('kadence.icon_options_names', kadence_blocks_params.icon_names), [kadence_blocks_params.icon_names])
    const iconOptions = useMemo(() => {
        return applyFilters('kadence.icon_options', {...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons})
    }, [kadence_blocks_params_ico.icons, kadence_blocks_params_fa.icons])
    const iconFilterOptions = useMemo(() => {
        let options = Object.keys(iconNames).map((label, index) => {
            return {value: index, label: label}
        })

        return [{value: 'all', label: __('Show All', 'kadence-blocks')}, ...options]
    }, [kadence_blocks_params.icon_names])

    const results = useMemo(() => {

        let results = {}

        Object.keys(iconNames).map((label, groupIndex) => {

            if (filter === 'all' || groupIndex === parseInt(filter)) {

                {
                    iconNames[label].map((icon, iconIndex) => {

                        if (search === '' || icon.includes(search)) {

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

        return results

    }, [search, filter])

    const styles = `
        .kadence-icon-picker {
            margin-bottom: 24px;
        }
        .kadence-icon-picker-selection {
            display: inline-flex;
        }
        .kadence-icon-picker-search {
        	position: fixed;
            z-index: 999;
            background-color: #fff;
            padding: 10px 10px 5px 10px;
            width: 305px;
        }
		.kadence-icon-picker-container {
			min-width: 305px;
			height: 50vh;
			max-height: 400px;
		}
		.kadence-icon-picker-container .components-panel__body button.is-secondary, .kadence-icon-picker button.is-secondary {
		    margin-right: 7px;
		    margin-bottom: 7px;
		    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
		}
		.kadence-icon-picker-content {
		    padding-top: 150px;
		}
		.kadence-icon-picker-link {
		    display: inline-flex;
		    padding-left: 10px;
		    background: #f5f5f5;
		    margin-right: 1px;
		    margin-bottom: 1px;
		    color: #424242;
		    padding-top: 7px;
		    padding-bottom: 7px;
		}
        a.kadence-icon-picker-link:hover {
            background: #e5e5e5;
        }   
		`

    return (
        <div className={'kadence-icon-picker'}>
            <style>{styles}</style>


            <div className={'kadence-icon-picker-selection'}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {value == '' ? __('Select Icon', 'kadence-blocks') : __('Change Icon', 'kadence-blocks')}
                </div>

                <a
                    href={'#'}
                    variant="secondary"
                    onClick={() => toggleVisible()}
                    ref={setPopoverAnchor}
                    className={'kadence-icon-picker-link'}
                    style={{marginLeft: '25px'}}
                >
                    <GenIcon className={`kt-svg-icon-list-single kt-svg-icon-list-single-${value}`} name={value}
                             icon={iconOptions[value]}/>
                </a>

            </div>

            {isVisible &&
                <Popover
                    headerTitle={__('Select Icon', 'kadence-blocks')}
                    noArrow={false}
                    // expandOnMobile={true}
                    onClose={toggleVisible}
                    placement="bottom-end"
                    referenceElement={popoverAnchor}
                >
                    <div className="kadence-icon-picker-container">
                        <div className={'kadence-icon-picker-search'}>
                            <TextControl
                                label={__('Search Icons', 'kadence-blocks')}
                                value={search}
                                placeholder={__('Search Icons', 'kadence-blocks')}
                                onChange={(value) => setSearch(value)}
                            />

                            <SelectControl
                                label={__('Filter Icons', 'kadence-blocks')}
                                value={filter}
                                options={iconFilterOptions}
                                onChange={value => {
                                    setFilter(value)
                                }}
                            />

                        </div>
                        <div className={'kadence-icon-picker-content'}>

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

                                        {Object.keys(results[groupKey].icons).map((iconKey) => {

                                            return (
                                                <a
                                                    className={'kadence-icon-picker-link'}
                                                    variant="secondary"
                                                    onClick={() => {
                                                        onChange(iconKey)
                                                        toggleVisible()
                                                    }}
                                                >
                                                    <GenIcon
                                                        className={`kt-svg-icon-list-single kt-svg-icon-list-single-${value}`}
                                                        name={iconKey}
                                                        icon={results[groupKey].icons[iconKey]}
                                                    />
                                                </a>
                                            )
                                        })}

                                    </PanelBody>
                                )

                            })}
                        </div>
                    </div>
                </Popover>
            }
        </div>
    )
}
