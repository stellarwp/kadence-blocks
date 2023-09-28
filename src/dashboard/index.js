/**
 * Internal dependencies
 */
import { AiWizard } from '../plugins/prebuilt-library/ai-wizard';
import { getAsyncData } from '../plugins/prebuilt-library/data-fetch/get-async-data';
import Notices from './notices';
/**
 * WordPress dependencies
 */
import { useMemo, useEffect, useState, render } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { TabPanel, Panel, PanelBody, PanelRow, Button } from '@wordpress/components';
import { aiIcon, autoFix, notes, subject, check, playlist, chatBubble } from '@kadence/icons';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
/**
 * Prebuilt Sections.
 */
export default function KadenceBlocksHome() {
	const [ wizardState, setWizardState ] = useState( false );
	const queryParameters = new URLSearchParams(window.location.search);
	const wizard = queryParameters.get("wizard");
	useEffect( () => {
		if ( wizard ) {
			setWizardState( true );
		}
	}, [] );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		noticesStore
	);
	const closeAiWizard = ( info ) => {
		setWizardState( false );
		if ( info && info === 'saved' ) {
			createSuccessNotice( __('Saved'), { type: 'snackbar' } );
		}
	};
	const handleAiWizardPrimaryAction = ( event, rebuild ) => {
		if ( rebuild ) {
			getAllNewData();
		}
		console.log( 'handleAiWizardPrimaryAction - Need to trigger something', event, rebuild );
	}
	const { getAIContentRemaining, getAvailableCredits } = getAsyncData();
	async function getAllNewData() {
		const response = await getAIContentRemaining( true );
		if ( response === 'error' || response === 'failed' ) {
			createErrorNotice( __('Error generating AI content, Please Retry'), { type: 'snackbar' } );
			console.log( 'Error getting AI Content.' );
		} else if ( response?.error && response?.context ) {
			createErrorNotice( __('Error, Some AI Contexts could not be started, Please Retry'), { type: 'snackbar' } );
			console.log( 'Error getting all new AI Content.' );
		}
	}
	return (
		<div className="kadence-blocks-home">
			{ wizardState && (
				<AiWizard
					onClose={ closeAiWizard }
					onPrimaryAction={ handleAiWizardPrimaryAction }
					photographyOnly={ false }
					credits={ false }
					isFullScreen={ true }
				/>
			) }
			<Button
				className='kadence-ai-wizard-button'
				iconPosition='left'
				icon={ aiIcon }
				text={ __('Update Kadence AI Details', 'kadence-blocks') }
				onClick={ () => {
					setWizardState( true );
				}}
			/>
			<Notices />
		</div>
	);
}