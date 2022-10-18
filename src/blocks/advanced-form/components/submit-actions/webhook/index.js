/**
 * Webhook Controls
 *
 */

/**
 * Imports
 */
import { getFormFields } from '../../';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	useMemo,
} from '@wordpress/element';
import {
	TextControl,
} from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function WebhookOptions( { settings, save, parentClientId } ) {

	const fields = useMemo( () => getFormFields( parentClientId ), [ parentClientId ] );
	const SLUG_REGEX = /[\s#]/g;

	const saveWebhookMap = ( value, index ) => {

		const newItems = fields.map( ( item, thisIndex ) => {
			let newString = '';
			if ( index === thisIndex ) {
				newString = value;
			} else if ( undefined !== settings.map && undefined !== settings.map[ thisIndex ] ) {
				newString = settings.map[ thisIndex ];
			} else {
				newString = '';
			}

			return newString;
		} );

		save( { map: newItems } );
	};

	return (
		<KadencePanelBody
			title={__( 'Webhook Settings', 'kadence-blocks' )}
			initialOpen={false}
			panelName={'kb-webhook-settings'}
		>
			<TextControl
				label={__( 'Webhook URL', 'kadence-blocks' )}
				help={__( 'Enter the URL that will receive the form submitted data.', 'kadence-blocks' )}
				value={( undefined !== settings.url ? settings.url : '' )}
				onChange={( value ) => save( { url: value } )}
			/>

			<>
				<h2 className="kt-heading-size-title">{__( 'Map Fields', 'kadence-blocks' )}</h2>
				{fields && (
					fields.map( ( item, index ) => {
						return (
							<div key={index} className="kb-field-map-item">
								<div className="kb-field-map-item-form">
									<p className="kb-field-map-item-label">{__( 'Form Field', 'kadence-blocks' )}</p>
									<p className="kb-field-map-item-name">{item.label}</p>
								</div>
								<TextControl
									label={__( 'Webhook Field Name', 'kadence-blocks' )}
									value={( undefined !== settings.map && undefined !== settings.map[ index ] && settings.map[ index ] ? settings.map[ index ] : '' )}
									onChange={( nextValue ) => {
										nextValue = nextValue.replace( SLUG_REGEX, '-' );
										saveWebhookMap( nextValue, index );
									}}
								/>
							</div>
						);
					} )
				)}
			</>
		</KadencePanelBody>
	);
}

export default ( WebhookOptions );
