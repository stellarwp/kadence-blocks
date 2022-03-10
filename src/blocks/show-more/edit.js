/**
 * BLOCK: Kadence Block Template
 */

/**
 * Import Css
 */
import './editor.scss'

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'
import { useBlockProps, BlockAlignmentControl } from '@wordpress/block-editor'
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control'

const {
	InspectorControls,
	BlockControls,
} = wp.blockEditor

const el = wp.element.createElement

const { InnerBlocks } = wp.blockEditor
import uniqueId from 'lodash/uniqueId'

const { apiFetch } = wp
const {
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	Modal,
	SelectControl,
	FormFileUpload,
	Button,
	Notice,
} = wp.components

/**
 * Internal dependencies
 */
import classnames from 'classnames'
import { Fragment } from 'react'

const ktShowMoreUniqueIDs = []

export function Edit ({
	attributes,
	setAttributes,
	className,
	clientId,
}) {

	const {
		uniqueID,
		showHideMore,
		defaultExpandedMobile,
		defaultExpandedTablet,
		defaultExpandedDesktop
	} = attributes

	if (!uniqueID) {
		const blockConfigObject = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : [])
		if (blockConfigObject['kadence/show-more'] !== undefined && typeof blockConfigObject['kadence/show-more'] === 'object') {
			Object.keys(blockConfigObject['kadence/show-more']).map((attribute) => {
				uniqueID = blockConfigObject['kadence/show-more'][attribute]
			})
		}
		setAttributes({
			uniqueID: '_' + clientId.substr(2, 9),
		})
		ktShowMoreUniqueIDs.push('_' + clientId.substr(2, 9))
	} else if (ktShowMoreUniqueIDs.includes(uniqueID)) {
		setAttributes({
			uniqueID: '_' + clientId.substr(2, 9),
		})
		ktShowMoreUniqueIDs.push('_' + clientId.substr(2, 9))
	} else {
		ktShowMoreUniqueIDs.push(uniqueID)
	}

	const childBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId );

	console.log('childBlocks');
	console.log(childBlocks);

	const buttonOneUniqueID = childBlocks[1] ? childBlocks[1].substr( 2, 9 ) : uniqueId('button-one-');
	const buttonTwoUniqueID = childBlocks[3] ? childBlocks[3].substr( 2, 9 ) : uniqueId('button-two-');


	console.log('buttonTwoUniqueID');
	console.log(buttonOneUniqueID);
	console.log(buttonTwoUniqueID);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __('Show More Settings', 'kadence-blocks') }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Display "Hide" button once expanded', 'kadence-blocks' ) }
						checked={ showHideMore }
						onChange={ ( value ) => setAttributes( { showHideMore: value } ) }
					/>
				</PanelBody>
				<PanelBody
					title={ __('Expand Settings', 'kadence-blocks') }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Default Expanded on Desktop', 'kadence-blocks' ) }
						checked={ defaultExpandedDesktop }
						onChange={ ( value ) => setAttributes( { defaultExpandedDesktop: value } ) }
					/>
					<ToggleControl
						label={ __( 'Default Expanded on Tablet', 'kadence-blocks' ) }
						checked={ defaultExpandedTablet }
						onChange={ ( value ) => setAttributes( { defaultExpandedTablet: value } ) }
					/>
					<ToggleControl
						label={ __( 'Default Expanded on Mobile', 'kadence-blocks' ) }
						checked={ defaultExpandedMobile }
						onChange={ ( value ) => setAttributes( { defaultExpandedMobile: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<Fragment>
				{ el(InnerBlocks, {
					template: [
						['core/group', {
							lock: {
								remove: true,
								move: true
							},
							className: 'kt-show-more-preview',
						}, { innerBlocks: ['core/paragraph', { placeholder: __('Add new content to this group blocks to customize your page', 'kadence-blocks') }] }],
						['kadence/advancedbtn', {
							lock: { remove: true, move: true },
							hAlign: 'left',
							uniqueID: buttonOneUniqueID,
							className: 'kt-show-more-button',
							btns: [
								{
									'text': 'Show More',
									'link': '',
									'target': '_self',
									'size': '',
									'paddingBT': '',
									'paddingLR': '',
									'color': '',
									'background': '',
									'border': '',
									'backgroundOpacity': 1,
									'borderOpacity': 1,
									'borderRadius': '',
									'borderWidth': '',
									'colorHover': '',
									'backgroundHover': '',
									'borderHover': '',
									'backgroundHoverOpacity': 1,
									'borderHoverOpacity': 1,
									'icon': '',
									'iconSide': 'right',
									'iconHover': false,
									'cssClass': '',
									'noFollow': false,
									'gap': 5,
									'responsiveSize': [
										'',
										''
									],
									'gradient': [
										'#999999',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'gradientHover': [
										'#777777',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'btnStyle': 'basic',
									'btnSize': 'small',
									'backgroundType': 'solid',
									'backgroundHoverType': 'solid',
									'width': [
										'',
										'',
										''
									],
									'responsivePaddingBT': [
										'',
										''
									],
									'responsivePaddingLR': [
										'',
										''
									],
									'boxShadow': [
										true,
										'#000000',
										0.2,
										1,
										1,
										2,
										0,
										false
									],
									'boxShadowHover': [
										true,
										'#000000',
										0.4,
										2,
										2,
										3,
										0,
										false
									],
									'inheritStyles': 'inherit',
									'borderStyle': '',
									'onlyIcon': [
										false,
										'',
										''
									]
								}
							]
						}],
						['core/group', {
							lock: {
								remove: true,
								move: true
							},
							className: 'kt-show-more-expanded',
						}, { innerBlocks: ['core/paragraph', { placeholder:  __('This group block is initially hidden. Content here will replace the top content when expanded.', 'kadence-blocks') }] }],
						['kadence/advancedbtn', {
							lock: { remove: true, move: true },
							hAlign: 'left',
							uniqueID: buttonTwoUniqueID,
							className: 'kt-hide-more-button',
							btns: [
								{
									'text': 'Show Less',
									'link': '',
									'target': '_self',
									'size': '',
									'paddingBT': '',
									'paddingLR': '',
									'color': '',
									'background': '',
									'border': '',
									'backgroundOpacity': 1,
									'borderOpacity': 1,
									'borderRadius': '',
									'borderWidth': '',
									'colorHover': '',
									'backgroundHover': '',
									'borderHover': '',
									'backgroundHoverOpacity': 1,
									'borderHoverOpacity': 1,
									'icon': '',
									'iconSide': 'right',
									'iconHover': false,
									'cssClass': '',
									'noFollow': false,
									'gap': 5,
									'responsiveSize': [
										'',
										''
									],
									'gradient': [
										'#999999',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'gradientHover': [
										'#777777',
										1,
										0,
										100,
										'linear',
										180,
										'center center'
									],
									'btnStyle': 'basic',
									'btnSize': 'small',
									'backgroundType': 'solid',
									'backgroundHoverType': 'solid',
									'width': [
										'',
										'',
										''
									],
									'responsivePaddingBT': [
										'',
										''
									],
									'responsivePaddingLR': [
										'',
										''
									],
									'boxShadow': [
										true,
										'#000000',
										0.2,
										1,
										1,
										2,
										0,
										false
									],
									'boxShadowHover': [
										true,
										'#000000',
										0.4,
										2,
										2,
										3,
										0,
										false
									],
									'inheritStyles': 'inherit',
									'borderStyle': '',
									'onlyIcon': [
										false,
										'',
										''
									]
								}
							]
						}]
					],
				}) }
			</Fragment>
		</Fragment>
	)

}

export default (Edit)
