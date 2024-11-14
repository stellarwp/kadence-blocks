/**
 * BLOCK: Kadence Pane
 *
 * Registering a basic block with Gutenberg.
 */

import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * Import Icons
 */
import { accordionBlockIcon } from '@kadence/icons';
import { IconSpanTag } from '@kadence/components';

/**
 * Import edit
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Import deprecated.
 */
import deprecated from './deprecated';

/**
 * Internal block libraries
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('kadence/pane', {
	...metadata,
	title: __('Pane', 'kadence-blocks'),
	icon: accordionBlockIcon,
	getEditWrapperProps(attributes) {
		return { 'data-pane': attributes.id };
	},
	edit,
	save({ attributes }) {
		const { id, uniqueID, title, icon, iconSide, hideLabel, titleTag, ariaLabel } = attributes;
		const HtmlTagOut = !titleTag ? 'div' : titleTag;

		const blockProps = useBlockProps.save({
			className: `kt-accordion-pane kt-accordion-pane-${id} kt-pane${uniqueID}`,
		});

		return (
			<div {...blockProps}>
				<HtmlTagOut className={'kt-accordion-header-wrap'}>
					<button
						className={`kt-blocks-accordion-header kt-acccordion-button-label-${
							hideLabel ? 'hide' : 'show'
						}`}
						aria-label={ariaLabel ? ariaLabel : undefined}
						type='button'
					>
						<span className="kt-blocks-accordion-title-wrap">
							{icon && 'left' === iconSide && (
								<IconSpanTag extraClass={`kt-btn-side-${iconSide}`} name={icon} />
							)}
							<RichText.Content className={'kt-blocks-accordion-title'} tagName={'span'} value={title} />
							{icon && 'right' === iconSide && (
								<IconSpanTag extraClass={`kt-btn-side-${iconSide}`} name={icon} />
							)}
						</span>
						<span className="kt-blocks-accordion-icon-trigger"></span>
					</button>
				</HtmlTagOut>
				<div className={'kt-accordion-panel'}>
					<div className={'kt-accordion-panel-inner'}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
	deprecated,
	example: {},
});
