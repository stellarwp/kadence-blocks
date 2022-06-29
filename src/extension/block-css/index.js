/**
 * External dependencies
 */
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import 'ace-builds/src-noconflict/snippets/css';
import "ace-builds/src-noconflict/theme-textmate";
import { assign } from 'lodash';
 /**
 * Import WordPress Internals
 */
import { Component, Fragment } from '@wordpress/element';
import {
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	addFilter,
} from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';

 /**
 * Add Block CSS attributes
 *
 * @param {array} settings The block settings.
 * @returns {array} The block settings with block css added.
 */
export function blockCSSAttribute( settings, name ) {
	if ( hasBlockSupport( settings, 'kbcss' ) ) {
		settings.attributes = assign( settings.attributes, {
			kadenceBlockCSS: {
				type: 'string',
				default: '',
			},
		} );
	}
	return settings;
}
addFilter( 'blocks.registerBlockType', 'kadence/blockCSS', blockCSSAttribute );

/**
 * Build the block css control
 */
 const BlockCSSComponent = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const hasBlockCSS = hasBlockSupport( props.name, 'kbcss' );
		if ( hasBlockCSS ) {
			const { attributes: { kadenceBlockCSS }, setAttributes } = props;
			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __( 'Custom CSS', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<Fragment>
								<AceEditor
									mode="css"
									theme="textmate"
									onLoad={ ( editor ) => {
										editor.renderer.setScrollMargin( 16, 16, 16, 16 );
										editor.renderer.setPadding( 16 );
									} }
									onChange={ ( value ) => {
										if ( value !== 'selector {\n\n}' ) {
											setAttributes( {
												kadenceBlockCSS: value,
											} );
										}
									} }
									showPrintMargin={false}
									highlightActiveLine={ false }
									showGutter={true}
									fontSize={12}
									value={ kadenceBlockCSS || 'selector {\n\n}' }
									maxLines={ 20 }
									minLines={ 5 }
									width="100%"
									height="300px"
									setOptions={ {
										enableBasicAutocompletion: true,
										enableLiveAutocompletion: true,
										enableSnippets: true,
										showLineNumbers: true,
										tabSize: 2,
									} }
								/>
								<p style={ { marginBottom: 20 } } />
								
								{ /* translators: The %s is for selector code */ }
								<p dangerouslySetInnerHTML={ {
									__html: sprintf(
										/* translators: The %s is for selector code */
										__( 'Use %s rule to change block styles.', 'kadence-blocks' ),
										'<code>selector</code>'
									)
								 } } />
							</Fragment>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		}
		return <BlockEdit { ...props } />;
	};
}, 'BlockCSSComponent' );
addFilter( 'editor.BlockEdit', 'kadence/blockCSSControls', BlockCSSComponent );
