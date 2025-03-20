/**
 * External dependencies
 */
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import { assign } from 'lodash';
/**
 * Import WordPress Internals
 */
import { useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { store as blocksStore, hasBlockSupport } from '@wordpress/blocks';
import { PanelBody, Button, Modal } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';
import { showSettings } from '@kadence/helpers';
/**
 * Add Block CSS attributes
 *
 * @param {array} settings The block settings.
 * @returns {array} The block settings with block css added.
 */
export function blockCSSAttribute(settings, name) {
	if (hasBlockSupport(settings, 'kbcss')) {
		settings.attributes = assign(settings.attributes, {
			kadenceBlockCSS: {
				type: 'string',
				default: '',
			},
		});
	}
	return settings;
}
addFilter('blocks.registerBlockType', 'kadence/blockCSS', blockCSSAttribute);

/**
 * Build the block css control
 */
const BlockCSSComponent = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const {
			attributes: { kadenceBlockCSS },
		} = props;
		const isValidCSSRule = kadenceBlockCSS && /^\s*[^{]+\s*\{\s*[^\s}]+\s*[:;][^}]*\}$/.test(kadenceBlockCSS);
		const wrapperProps = {
			...props.wrapperProps,
			className: 'kadence-has-custom-css',
		};

		const globalSettings = kadence_blocks_params.globalSettings
			? JSON.parse(kadence_blocks_params.globalSettings)
			: {};
		const showCSSIndicator =
			globalSettings.enable_custom_css_indicator !== undefined
				? globalSettings.enable_custom_css_indicator
				: true;

		if (!props.isSelected) {
			return <BlockEdit {...props} {...(isValidCSSRule && showCSSIndicator ? { wrapperProps } : {})} />;
		}
		const { hasBlockCSS, openTab } = useSelect((select) => {
			const hasSupport = select(blocksStore).hasBlockSupport(props.name, 'kbcss');
			let openTab = 'general';
			if (hasSupport) {
				openTab =
					typeof select('kadenceblocks/data').getOpenSidebarTabKey === 'function'
						? select('kadenceblocks/data').getOpenSidebarTabKey(
								props.name.replace('kadence/', '') +
									select('core/block-editor').getSelectedBlockClientId(),
								'general'
						  )
						: 'advanced';
			}
			return {
				hasBlockCSS: hasSupport,
				openTab,
			};
		}, []);
		const [isOpen, setOpen] = useState(false);
		const openModal = () => setOpen(true);
		const closeModal = () => setOpen(false);
		if (hasBlockCSS && openTab == 'advanced' && showSettings('show', 'kadence/customcss')) {
			const {
				attributes: { kadenceBlockCSS },
				setAttributes,
			} = props;
			const customCSSEditor = (
				<>
					<AceEditor
						mode="css"
						theme="textmate"
						onLoad={(editor) => {
							editor.renderer.setScrollMargin(16, 16, 16, 16);
							editor.renderer.setPadding(16);
						}}
						onChange={(value) => {
							if (value !== 'selector {\n\n}') {
								setAttributes({
									kadenceBlockCSS: value,
								});
							}
						}}
						showPrintMargin={false}
						highlightActiveLine={false}
						showGutter={true}
						fontSize={12}
						value={kadenceBlockCSS || 'selector {\n\n}'}
						maxLines={undefined}
						minLines={undefined}
						width="100%"
						height="calc(55vh - 50px)"
						setOptions={{
							enableBasicAutocompletion: true,
							enableLiveAutocompletion: true,
							enableSnippets: true,
							showLineNumbers: true,
							tabSize: 2,
						}}
					/>
					{/* translators: The %s is for selector code */}
					<p
						dangerouslySetInnerHTML={{
							__html: sprintf(
								/* translators: The %s is for selector code */
								__('Use %s rule to change block styles.', 'kadence-blocks'),
								'<code>selector</code>'
							),
						}}
					/>
				</>
			);
			return (
				<>
					<BlockEdit {...props} {...(isValidCSSRule && showCSSIndicator ? { wrapperProps } : {})} />
					<InspectorControls>
						<PanelBody title={__('Custom CSS', 'kadence-blocks')} initialOpen={false}>
							<>
								<Button className={'kadence-css-modal-open'} icon={'editor-expand'} onClick={openModal}>
									{__('Edit in Modal', 'kadence-blocks')}
								</Button>
								{isOpen && (
									<Modal
										className={'kadence-css-modal'}
										title={__('Custom CSS', 'kadence-blocks')}
										onRequestClose={closeModal}
									>
										{customCSSEditor}
										<Button variant="secondary" onClick={closeModal}>
											{__('Close', 'kadence-blocks')}
										</Button>
									</Modal>
								)}
								<AceEditor
									mode="css"
									theme="textmate"
									onLoad={(editor) => {
										editor.renderer.setScrollMargin(16, 16, 16, 16);
										editor.renderer.setPadding(16);
									}}
									onChange={(value) => {
										if (value !== 'selector {\n\n}') {
											setAttributes({
												kadenceBlockCSS: value,
											});
										}
									}}
									showPrintMargin={false}
									highlightActiveLine={false}
									showGutter={true}
									fontSize={12}
									value={kadenceBlockCSS || 'selector {\n\n}'}
									maxLines={20}
									minLines={5}
									width="100%"
									height="300px"
									setOptions={{
										enableBasicAutocompletion: true,
										enableLiveAutocompletion: true,
										enableSnippets: true,
										showLineNumbers: true,
										tabSize: 2,
									}}
								/>
								<p style={{ marginBottom: 20 }} />

								{/* translators: The %s is for selector code */}
								<p
									dangerouslySetInnerHTML={{
										__html: sprintf(
											/* translators: The %s is for selector code */
											__('Use %s rule to change block styles.', 'kadence-blocks'),
											'<code>selector</code>'
										),
									}}
								/>
							</>
						</PanelBody>
					</InspectorControls>
				</>
			);
		}
		return <BlockEdit {...props} {...(isValidCSSRule && showCSSIndicator ? { wrapperProps } : {})} />;
	};
}, 'BlockCSSComponent');
addFilter('editor.BlockEdit', 'kadence/blockCSSControls', BlockCSSComponent);
