/**
 * Auto Respond Email Controls
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import { TextControl, TextareaControl, ToggleControl } from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function AutoEmailOptions({ settings, save }) {
	return (
		<KadencePanelBody
			title={__('Auto Respond Email Settings', 'kadence-blocks')}
			initialOpen={false}
			panelName={'kb-auto-email-settings'}
		>
			<TextControl
				label={__('Email Subject', 'kadence-blocks')}
				placeholder={__('Thanks for contacting us!', 'kadence-blocks')}
				value={undefined !== settings && undefined !== settings.subject ? settings.subject : ''}
				onChange={(value) => save({ subject: value })}
			/>
			<TextareaControl
				label={__('Email Message', 'kadence-blocks')}
				placeholder={__(
					'Thanks for getting in touch, we will respond within the next 24 hours.',
					'kadence-blocks'
				)}
				value={undefined !== settings && undefined !== settings.message ? settings.message : ''}
				onChange={(value) => save({ message: value })}
			/>
			<TextControl
				label={__('From Email', 'kadence-blocks')}
				value={undefined !== settings && undefined !== settings.fromEmail ? settings.fromEmail : ''}
				onChange={(value) => save({ fromEmail: value })}
			/>
			<TextControl
				label={__('From Name', 'kadence-blocks')}
				value={undefined !== settings && undefined !== settings.fromName ? settings.fromName : ''}
				onChange={(value) => save({ fromName: value })}
			/>
			<TextControl
				label={__('Reply To', 'kadence-blocks')}
				value={
					undefined !== settings && undefined !== settings && undefined !== settings.replyTo
						? settings.replyTo
						: ''
				}
				onChange={(value) => save({ replyTo: value })}
			/>
			<TextControl
				label={__('Cc', 'kadence-blocks')}
				value={undefined !== settings && undefined !== settings && undefined !== settings.cc ? settings.cc : ''}
				onChange={(value) => save({ cc: value })}
			/>
			<TextControl
				label={__('Bcc', 'kadence-blocks')}
				value={undefined !== settings && undefined !== settings.bcc ? settings.bcc : ''}
				onChange={(value) => save({ bcc: value })}
			/>
			<ToggleControl
				label={__('Send as HTML email?', 'kadence-blocks')}
				help={__('If off, plain text is used.', 'kadence-blocks')}
				checked={undefined !== settings && undefined !== settings.html ? settings.html : true}
				onChange={(value) => save({ html: value })}
			/>
			<TextControl
				label={__('Override Email to Address', 'kadence-blocks')}
				help={__(
					'By default email is sent to the email field, you can use this to override.',
					'kadence-blocks'
				)}
				value={undefined !== settings && undefined !== settings.emailTo ? settings.emailTo : ''}
				onChange={(value) => save({ emailTo: value })}
			/>
		</KadencePanelBody>
	);
}

export default AutoEmailOptions;
