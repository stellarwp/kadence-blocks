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
import {default as IconRender} from '../icons/icon-render'
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

                { iconNames[label].map((icon, iconIndex) => {

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
        .kadence-icon-picker-search {
        	padding: 10px;
        }
		.kadence-icon-picker-container {
			min-width: 260px;
			height: 50vh;
			max-height: 400px;
		}
		.kadence-icon-picker-container .components-panel__body button.is-secondary, .kadence-icon-picker button.is-secondary {
		    margin-right: 7px;
		    margin-bottom: 7px;
		    color: #000;
		    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
		}
		`

    return (
        <>
            <style>{styles}</style>


            <div className={ 'kadence-icon-picker' }>
                <span>{ value == '' ? __('Select Icon', 'kadence-blocks') : __('Change Icon', 'kadence-blocks') }</span>

                <Button
                    variant="secondary"
                    onClick={toggleVisible}
                    ref={setPopoverAnchor}
                    style={ { float: 'right' } }
                >
                    <GenIcon name={value} icon={iconOptions[value]} style={ { marginTop: '3px'} }/>
                </Button>

            </div>

            {isVisible &&
                <Popover
                    headerTitle={__('Select Icon', 'kadence-blocks')}
                    noArrow={false}
                    expandOnMobile={true}
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

                        {  Object.keys(results).length === 0 &&
                            <p>{__('No icons found', 'kadence-blocks')}</p>
                        }


                        {Object.keys(results).map((groupKey) => {

                            return (

                                <PanelBody
                                    title={results[groupKey].label}
                                >

                                    {Object.keys(results[groupKey].icons).map((iconKey) => {

                                        return (
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    onChange(iconKey)
                                                    toggleVisible()
                                                }}
                                            >
                                                <GenIcon
                                                    name={iconKey}
                                                    icon={results[groupKey].icons[iconKey]}
                                                />
                                            </Button>
                                        )
                                    })}

                                </PanelBody>
                            )

                        })}

                    </div>
                </Popover>
            }
        </>
    )
}
