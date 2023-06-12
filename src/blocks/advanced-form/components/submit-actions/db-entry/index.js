/**
 * Db Entry Controls
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	Fragment,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import {
	TextControl,
	Button,
	Spinner,
	ToggleControl,
	SelectControl,
	ExternalLink,
} from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function DbEntryOptions( { settings, save } ) {

	return (
		<KadencePanelBody
			title={__( 'Database Entry Settings', 'kadence-blocks' )}
			initialOpen={false}
			panelName={'kb-db-entry-settings'}
		>
			<TextControl
				label={__( 'Form Name', 'kadence-blocks' )}
				value={( undefined !== settings.formName ? settings.formName : '' )}
				onChange={( value ) => save( { formName: value } )}
			/>
			<ToggleControl
				label={__( 'Save User IP Address', 'kadence-blocks' )}
				help={__( 'Saves the entrants IP address with the form data', 'kadence-blocks' )}
				checked={( undefined !== settings.userIP ? settings.userIP : true )}
				onChange={( value ) => save( { userIP: value } )}
			/>
			<ToggleControl
				label={__( 'Save User Device', 'kadence-blocks' )}
				help={__( 'Saves the entrants device with form data', 'kadence-blocks' )}
				checked={( undefined !== settings.userDevice ? settings.userDevice : true )}
				onChange={( value ) => save( { userDevice: value } )}
			/>
		</KadencePanelBody>
	);
}

export default ( DbEntryOptions );
