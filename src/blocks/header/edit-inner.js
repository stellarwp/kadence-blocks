/**
 * BLOCK: Kadence Advanced Heading
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, isEqual } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import {
	useEntityBlockEditor,
	useEntityProp,
} from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/block-editor';
import { formBlockIcon } from '@kadence/icons';
import {
	KadencePanelBody,
	InspectorControlTabs,
	SpacingVisualizer
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	mouseOverVisualizer
} from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	ToolbarGroup,
	ExternalLink,
	Button,
	Placeholder
} from '@wordpress/components';

import {
	FormTitle,
	SelectForm,
} from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useEntityPublish } from './hooks';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
export function EditInner( props ) {

	const {
		attributes,
		setAttributes,
		clientId,
		direct,
		id,
		isSelected,
	} = props;
	const {
		uniqueID
	} = attributes;

	const { previewDevice } = useSelect(
		( select ) => {
			return {
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ],
	);

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	// const [ padding ] = useFormMeta( '_kad_header_padding' );
	// const [ tabletPadding ] = useFormMeta( '_kad_header_tabletPadding' );
	// const [ mobilePadding ] = useFormMeta( '_kad_header_mobilePadding' );
	// const [ paddingUnit ] = useFormMeta( '_kad_header_paddingUnit' );
	//
	// const [ margin ] = useFormMeta( '_kad_header_margin' );
	// const [ tabletMargin ] = useFormMeta( '_kad_header_tabletMargin' );
	// const [ mobileMargin ] = useFormMeta( '_kad_header_mobileMargin' );
	// const [ marginUnit ] = useFormMeta( '_kad_header_marginUnit' );

	const [ className ] = useFormMeta( '_kad_header_className' );
	const [ anchor ] = useFormMeta( '_kad_header_anchor' );

	const [ meta, setMeta ] = useFormProp( 'meta' );

	const setMetaAttribute = ( value, key ) => {
		setMeta( { ...meta, ['_kad_header_' + key]: value } );
	};

	// const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 0 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 0 ] : '' ) );
	// const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 1 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 1 ] : '' ) );
	// const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 2 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 2 ] : '' ) );
	// const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 3 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 3 ] : '' ) );
	//
	// const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 0 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 0 ] : '' ) );
	// const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 1 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 1 ] : '' ) );
	// const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 2 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 2 ] : '' ) );
	// const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 3 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 3 ] : '' ) );

	const formClasses = classnames( {
		'kb-header'          : true,
		[ `kb-header-${id}` ]: true,
		[ `kb-header${uniqueID}` ]: uniqueID,
	} );

	const [ title, setTitle ] = useFormProp( 'title' );

	let [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'kadence_header',
		id,
	);
	const {
		updateBlockAttributes
	} = useDispatch( editorStore );

	let emptyForm = useMemo( () => {
		return [ createBlock( 'kadence/advanced-form', {} ) ];
	}, [ clientId ] );

	if( blocks.length === 0 ) {
		blocks = emptyForm;
	}

	let formInnerBlocks = useMemo( () => {
		return get( blocks, [ 0, 'innerBlocks' ], [] );
	}, [ blocks ] );

	let newBlock = useMemo( () => {
		return get( blocks, [ 0 ], {} );
	}, [ blocks ] );

	const [ isAdding, addNew ] = useEntityPublish( 'kadence_header', id );
	const onAdd = async( title, template, initialDescription ) => {
		try {
			const response = await addNew();

			if ( response.id ) {
				onChange( [ { ...newBlock, innerBlocks: [
						createBlock( 'kadence/column', { } )
					] } ], clientId );

				setTitle(title);

				const updatedMeta = meta;
				updatedMeta._kad_header_description = initialDescription;

				setMeta( { ...meta, updatedMeta } );
				await wp.data.dispatch( 'core' ).saveEditedEntityRecord( 'postType', 'kadence_header', id );
			}
		} catch ( error ) {
			console.error( error );
		}
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: formClasses,
			style: {
				// marginTop   : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
				// marginRight : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
				// marginBottom: ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
				// marginLeft  : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),
				//
				// paddingTop   : ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingUnit ) : undefined ),
				// paddingRight : ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingUnit ) : undefined ),
				// paddingBottom: ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingUnit ) : undefined ),
				// paddingLeft  : ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) : undefined ),
			}
		},
		{
			// allowedBlocks: ALLOWED_BLOCKS,
			value: ! direct ? formInnerBlocks : undefined,
			onInput: ! direct ? ( a, b ) => onInput( [ { ...newBlock, innerBlocks: a } ], b ) : undefined,
			onChange: ! direct ? ( a, b ) => onChange( [ { ...newBlock, innerBlocks: a } ], b ) : undefined,
			templateLock: false,
			// renderAppender: formInnerBlocks.length === 0 ? useFieldBlockAppenderBase : useFieldBlockAppender
		}
	);

	if ( formInnerBlocks.length === 0 ) {
		return (
			<>
				<FormTitle
					onAdd={ onAdd }
					isAdding={ isAdding }
					existingTitle={ title }
				/>
				<div className='kb-form-hide-while-setting-up'>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	}
	if ( typeof pagenow !== 'undefined' && ( 'widgets' === pagenow || 'customize' === pagenow ) ) {
		const editPostLink = addQueryArgs( 'post.php', {
			post: id,
			action: 'edit'
		} );
		return (
			<>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__( 'Kadence Heading', 'kadence-blocks' )}
					icon={ formBlockIcon }
				>
					<p style={{ width: '100%', marginBottom:'10px'}}>{ __( 'Advanced forms can not be edited within the widgets screen.', 'kadence-blocks' ) }</p>
					<Button href={ editPostLink } variant='primary' className='kb-form-edit-link'>
						{ __( 'Edit Form', 'kadence-blocks' ) }
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody
							panelName={'kb-advanced-form-selected-switch'}
							title={ __( 'Selected Form', 'kadence-blocks' ) }
						>
						<SelectForm
							postType="kadence_header"
							label={__( 'Selected Form', 'kadence-blocks' )}
							hideLabelFromVision={ true }
							onChange={ ( nextId ) => {
								setAttributes( { id: parseInt( nextId ) } )
							} }
							value={ id }
						/>
					</KadencePanelBody>
				</InspectorControls>
			</>
		);
	}
	return (
		<>
			<style>
				{ isSelected && (
					<>
					{ `.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }` };
					</>
				)}
			</style>
			<InspectorControls>

				<InspectorControlTabs
					panelName={'advanced-header'}
					setActiveTab={( value ) => setActiveTab( value )}
					activeTab={activeTab}
				/>

				{( activeTab === 'general' ) &&
					<>
						General tab

						<div className="kt-sidebar-settings-spacer"></div>
					</>
				}

				{( activeTab === 'style' ) &&
					<>
						Style tab
					</>
				}

				{( activeTab === 'advanced' ) &&
					<>
						Advanced tab
						{/*<KadencePanelBody panelName={'kb-row-padding'}>*/}
						{/*	<ResponsiveMeasureRangeControl*/}
						{/*		label={__('Padding', 'kadence-blocks')}*/}
						{/*		value={ arrayStringToInt( padding ) }*/}
						{/*		tabletValue={ arrayStringToInt( tabletPadding ) }*/}
						{/*		mobileValue={ arrayStringToInt( mobilePadding ) }*/}
						{/*		onChange={(value) => {*/}
						{/*			setMetaAttribute( value.map(String), 'padding' );*/}
						{/*		}}*/}
						{/*		onChangeTablet={(value) => {*/}
						{/*			setMetaAttribute( value.map(String), 'tabletPadding' );*/}
						{/*		}}*/}
						{/*		onChangeMobile={(value) => {*/}
						{/*			setMetaAttribute( value.map(String), 'mobilePadding' );*/}
						{/*		}}*/}
						{/*		min={0}*/}
						{/*		max={(paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200)}*/}
						{/*		step={(paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1)}*/}
						{/*		unit={paddingUnit}*/}
						{/*		units={['px', 'em', 'rem', '%']}*/}
						{/*		onUnit={(value) => setMetaAttribute( value, 'paddingUnit' )}*/}
						{/*		onMouseOver={paddingMouseOver.onMouseOver}*/}
						{/*		onMouseOut={paddingMouseOver.onMouseOut}*/}
						{/*	/>*/}
						{/*	<ResponsiveMeasureRangeControl*/}
						{/*		label={__('Margin', 'kadence-blocks')}*/}
						{/*		value={ arrayStringToInt( margin ) }*/}
						{/*		tabletValue={ arrayStringToInt( tabletMargin ) }*/}
						{/*		mobileValue={ arrayStringToInt( mobileMargin ) }*/}
						{/*		onChange={(value) => {*/}
						{/*			setMetaAttribute( value.map(String), 'margin' );*/}
						{/*		}}*/}
						{/*		onChangeTablet={(value) => {*/}
						{/*			setMetaAttribute( value.map(String), 'tabletMargin' );*/}
						{/*		}}*/}
						{/*		onChangeMobile={(value) => {*/}
						{/*			setMetaAttribute( value.map(String), 'mobileMargin' );*/}
						{/*		}}*/}
						{/*		min={(marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200)}*/}
						{/*		max={(marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200)}*/}
						{/*		step={(marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1)}*/}
						{/*		unit={marginUnit}*/}
						{/*		units={['px', 'em', 'rem', '%', 'vh']}*/}
						{/*		onUnit={(value) => setMetaAttribute( value, 'marginUnit' )}*/}
						{/*		onMouseOver={marginMouseOver.onMouseOver}*/}
						{/*		onMouseOut={marginMouseOver.onMouseOut}*/}
						{/*		allowAuto={ true}*/}
						{/*	/>*/}
						{/*</KadencePanelBody>*/}
					</>
				}

			</InspectorControls>
			<InspectorAdvancedControls>

				<TextControl
					__nextHasNoMarginBottom
					className="html-anchor-control"
					label={ __( 'HTML anchor' ) }
					help={
						<>
							{ __(
								'Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.'
							) }

							<ExternalLink
								href={ __(
									'https://wordpress.org/documentation/article/page-jumps/'
								) }
							>
								{ __( 'Learn more about anchors' ) }
							</ExternalLink>
						</>
					}
					value={ anchor }
					placeholder={ __( 'Add an anchor' ) }
					onChange={ ( nextValue ) => {
						nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
						setMetaAttribute( nextValue, 'anchor' );
					} }
					autoCapitalize="none"
					autoComplete="off"
				/>

				<TextControl
					__nextHasNoMarginBottom
					autoComplete="off"
					label={ __( 'Additional CSS class(es)' ) }
					value={ className }
					onChange={ ( nextValue ) => {
						setMetaAttribute( ( nextValue !== '' ? nextValue : undefined ), 'className');
					} }
					help={ __(
						'Separate multiple classes with spaces.'
					) }
				/>
			</InspectorAdvancedControls>

			<div {...innerBlocksProps} />
			{/*<SpacingVisualizer*/}
			{/*	style={ {*/}
			{/*		marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),*/}
			{/*		marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),*/}
			{/*		marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),*/}
			{/*		marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),*/}
			{/*	} }*/}
			{/*	type="inside"*/}
			{/*	forceShow={ paddingMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingUnit ), getSpacingOptionOutput( previewPaddingRight, paddingUnit ), getSpacingOptionOutput( previewPaddingBottom, paddingUnit ), getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) ] }*/}
			{/*/>*/}
			{/*<SpacingVisualizer*/}
			{/*	type="inside"*/}
			{/*	forceShow={ marginMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewMarginTop, marginUnit ), getSpacingOptionOutput( previewMarginRight, marginUnit ), getSpacingOptionOutput( previewMarginBottom, marginUnit ), getSpacingOptionOutput( previewMarginLeft, marginUnit ) ] }*/}
			{/*/>*/}

		</>
	);
}
export default ( EditInner );

function useFormProp( prop ) {
	return useEntityProp( 'postType', 'kadence_header', prop );
}

function useFormMeta( key ) {
	const [ meta, setMeta ] = useFormProp( 'meta' );

	return [
		meta[ key ],
		useCallback(
			( newValue ) => {
				setMeta( { ...meta, [ key ]: newValue } );
			},
			[ key, setMeta ],
		),
	];
}
