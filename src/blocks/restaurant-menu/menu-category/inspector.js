/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * External dependencies
 */
import map from 'lodash/map';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls, ContrastChecker, PanelColorSettings, replaceInnerBlocks } = wp.blockEditor;
const {
	TextControl,
	SelectControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	BaseControl,
	ButtonGroup,
	Button,
	ColorPicker,
	TextareaControl,
	CheckboxControl,
	Tooltip,
	TabPanel,
	Dashicon
} = wp.components;


/**
 * Menu category Settings
 */
class Inspector extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes,
		} = this.props;

		const {
			columns,
			columnControl,
			gutter
		} = attributes;


		const columnControlTypes = [
			{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: __( 'Linked', 'kadence-blocks' ) },
			{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: __( 'Individual', 'kadence-blocks' ) },
		];

		const onColumnChange = ( value ) => {
			let columnArray = [];
			if ( 1 === value ) {
				columnArray = [ 1, 1, 1, 1, 1, 1 ];
			} else if ( 2 === value ) {
				columnArray = [ 2, 2, 2, 2, 1, 1 ];
			} else if ( 3 === value ) {
				columnArray = [ 3, 3, 3, 2, 1, 1 ];
			} else if ( 4 === value ) {
				columnArray = [ 4, 4, 4, 3, 2, 2 ];
			} else if ( 5 === value ) {
				columnArray = [ 5, 5, 5, 4, 4, 3 ];
			} else if ( 6 === value ) {
				columnArray = [ 6, 6, 6, 4, 4, 3 ];
			} else if ( 7 === value ) {
				columnArray = [ 7, 7, 7, 5, 5, 4 ];
			} else if ( 8 === value ) {
				columnArray = [ 8, 8, 8, 6, 4, 4 ];
			}
			setAttributes( { columns: columnArray } );
		};

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( "Settings" ) }
						initialOpen={ false }>

						<div className="kt-columns-control">
							<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Column Control Type', 'kadence-blocks' ) }>
								{ map( columnControlTypes, ( { name, key, icon } ) => (
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ columnControl === key }
											aria-pressed={ columnControl === key }
											onClick={ () => setAttributes( { columnControl: key } ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
							{ columnControl !== 'individual' && (
								<RangeControl
									label={ __( 'Columns' ) }
									value={ columns[ 2 ] }
									onChange={ onColumnChange }
									min={ 1 }
									max={ 8 }
								/>
							) }
							{ columnControl === 'individual' && (
								<Fragment>
									<h4>{ __( 'Columns', 'kadence-blocks' ) }</h4>
									<RangeControl
										label={ __( 'Screen Above 1500px', 'kadence-blocks' ) }
										value={ columns[ 0 ] }
										onChange={ ( value ) => setAttributes( { columns: [ value, columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
										min={ 1 }
										max={ 8 }
									/>
									<RangeControl
										label={ __( 'Screen 1200px - 1499px', 'kadence-blocks' ) }
										value={ columns[ 1 ] }
										onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], value, columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
										min={ 1 }
										max={ 8 }
									/>
									<RangeControl
										label={ __( 'Screen 992px - 1199px', 'kadence-blocks' ) }
										value={ columns[ 2 ] }
										onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], value, columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } ) }
										min={ 1 }
										max={ 8 }
									/>
									<RangeControl
										label={ __( 'Screen 768px - 991px', 'kadence-blocks' ) }
										value={ columns[ 3 ] }
										onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], value, columns[ 4 ], columns[ 5 ] ] } ) }
										min={ 1 }
										max={ 8 }
									/>
									<RangeControl
										label={ __( 'Screen 544px - 767px', 'kadence-blocks' ) }
										value={ columns[ 4 ] }
										onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], value, columns[ 5 ] ] } ) }
										min={ 1 }
										max={ 8 }
									/>
									<RangeControl
										label={ __( 'Screen Below 543px', 'kadence-blocks' ) }
										value={ columns[ 5 ] }
										onChange={ ( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], value ] } ) }
										min={ 1 }
										max={ 8 }
									/>
								</Fragment>
							) }
						</div>

						<div className="kt-gutter-control">
							<h2 className="kt-heading-size-title">{ __( 'Gutter', 'kadence-blocks' ) }</h2>
							<TabPanel className="kt-size-tabs"
								activeClass="active-tab"
								tabs={ [
									{
										name: 'desk',
										title: <Dashicon icon="desktop" />,
										className: 'kt-desk-tab',
									},
									{
										name: 'tablet',
										title: <Dashicon icon="tablet" />,
										className: 'kt-tablet-tab',
									},
									{
										name: 'mobile',
										title: <Dashicon icon="smartphone" />,
										className: 'kt-mobile-tab',
									},
								] }>
								{
									( tab ) => {
										let tabout;
										if ( tab.name ) {
											if ( 'mobile' === tab.name ) {
												tabout = (
													<RangeControl
														value={ ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) }
														onChange={ value => setAttributes( { gutter: [ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ), ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ), value ] } ) }
														step={ 2 }
														min={ 0 }
														max={ 100 }
													/>
												);
											} else if ( 'tablet' === tab.name ) {
												tabout = (
													<RangeControl
														value={ ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ) }
														onChange={ value => setAttributes( { gutter: [ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ), value, ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) ] } ) }
														step={ 2 }
														min={ 0 }
														max={ 100 }
													/>
												);
											} else {
												tabout = (
													<RangeControl
														value={ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ) }
														onChange={ value => setAttributes( { gutter: [ value, ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ), ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) ] } ) }
														step={ 2 }
														min={ 0 }
														max={ 100 }
													/>
												);
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
						</div>
					</PanelBody>
	            </InspectorControls>
	        </Fragment>
		);
	}
}

export default Inspector;
