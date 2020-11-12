/**
 * Internal dependencies
 */
import { BlockWidth } from '@components/block-width'
import { BackgroundSettings } from '@components/background';
import { BlockAction } from '@components/block-action';
import Breadcrumb from '@components/block-breadcrumb/index';
import BorderSettings from '@components/border';
import BorderRadiusSettings from '@components/border-radius';
import MarginSettings from '@components/margin';
import PaddingSettings from '@components/padding';
import WrapColorPicker from '@components/color-picker/index';
import BoxShadowControl from '@components/box-shadow/index';
import PatternForm from '@components/patterns/pattern-form';


/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { InspectorControls, PanelColorSettings, URLInput } from '@wordpress/block-editor';
import { TextControl, ColorPicker, SelectControl, PanelBody, RangeControl, ToggleControl, BaseControl, ButtonGroup, Button} from '@wordpress/components';
import { select, dispatch, withSelect, withDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Inspector controls
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
			setAttributes
		} = this.props;

		const {
			background,
			height,
			width,
			heightUnit,
			blockInsertIcon,
			hasInserter,
			isEnableBoxShadow,
			boxShadow
		} = attributes

		const parentId = select( 'core/block-editor' ).getBlockRootClientId( clientId );
		
		return (
			
			<Fragment>
				<InspectorControls>
					<PanelBody	
						title={ __( "Inserter", 'frontrom' ) } 
						initialOpen={ false }
					>
						<ToggleControl
					        label={__( 'Enable', 'frontrom' )}
					        help={ __( '', 'frontrom' ) }
					        checked={ hasInserter }
					        onChange={ ( hasInserter ) => {
	    						setAttributes( { hasInserter: hasInserter } ) ;
	    					} }
					    />
				    </PanelBody>

					<PanelBody	
						title={ __( "Height", 'frontrom' ) } 
						initialOpen={ false }
					>
						<div className="components-base-control">
							<label style={{ fontSize: '13px', marginRight: '10px' }}>{ __( 'Height', 'frontrom' ) }</label>
						    <input
								value={ height ? parseInt(height) : '' }
								onChange={ (el) => {
								
									const value = parseInt(el.target.value);
									setAttributes({ height: value == 0 ? '' : value });
								} }
								min={ 0 }
								max={ 1200 }
								step={ 1 }
								type="number"
								className="components-latter-control__input"
								style={{ marginRight: '10px' }}
							/>
							<ButtonGroup>
						    	<Button
						    		isSmall
						    		isPrimary={ heightUnit == 'px' ? true : false }
						    		onClick={ () => {
						    			setAttributes( { heightUnit: 'px' } );
						    		} }
						    	>
						    		{'px'}
						    	</Button>

						    	<Button
						    		isSmall
						    		isPrimary={ heightUnit == 'vh' ? true : false }
						    		onClick={ () => {
						    			setAttributes( { heightUnit: 'vh' } );
						    		} }
						    	>
						    		{'vh'}
						    	</Button>
						    </ButtonGroup>

						</div>
					</PanelBody>
					
					<BlockWidth {...this.props} />


					{
						!FrontRom.isProduction && <PatternForm {...this.props} />
					}
				
					<BackgroundSettings {...this.props} />

					<BorderSettings {...this.props} />
					<BorderRadiusSettings {...this.props} />
					{/*<MarginSettings {...this.props} />*/}
					<PaddingSettings {...this.props} />

					<PanelBody
						title={ __( "Box Shadow", 'frontrom' ) } 
						initialOpen={ true }>

						<BoxShadowControl
							isEnableBoxShadow={isEnableBoxShadow}
							boxShadow={JSON.parse(boxShadow)}
							onChangeBoxShadow={ (shadow) => {
								
								setAttributes({ boxShadow: JSON.stringify([...shadow]) })
							} }
							onChangeEnable={ (value) => {
								setAttributes( { isEnableBoxShadow: value } ) ;
							} }
							addMore={ () => {
								setAttributes({ 
									boxShadow: JSON.stringify([
										...boxShadow, 
										{
											type: 'outset',
											x: '7',
											y: '7',
											blur: '38',
											spread: '-20',
											color: 'rgba(102,102,102,1)'
										}
									]) 
								})
							} }
							removeItem={ (index) => {

								if ( boxShadow.length > 1 ) {
									boxShadow.splice(index, 1);
									setAttributes({ boxShadow: JSON.stringify( boxShadow ) })
								}
							} }
						/>
					</PanelBody>



					{/*<BlockAction 
						PanelBodyTitle={ __( 'Parent Block Action' ) }
						blockId={ parentId }
						createdBlock={{
							clientId: parentId,
							name: 'frontrom/demo-child',
							attributes: {
								"image": {
									url: `${FrontRom.assetsUrl}/plumber/img/contact-icon.png`
								},
								title: `<a href="#">${__( "Child title", 'frontrom' )}</a>`,
								description: __( "Neque porro quisquam est, qui dolor em ipsum quia dolor sit amet, consec tetur, adipisci velit, sed quia non.", 'frontrom' ),
							}
						}}
					/>*/}

					<Breadcrumb />
					
				</InspectorControls>
			</Fragment>
		);
	}
}

export default Inspector;
