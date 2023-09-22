/**
 * Internal dependencies
 */
import { AiWizard } from '../plugins/prebuilt-library/ai-wizard';

/**
 * WordPress dependencies
 */
import { useMemo, useEffect, useState, render } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { TabPanel, Panel, PanelBody, PanelRow, Button } from '@wordpress/components';
import { aiIcon, autoFix, notes, subject, check, playlist, chatBubble } from '@kadence/icons';
/**
 * Prebuilt Sections.
 */
export default function KadenceBlocksHome() {
	const [ wizardState, setWizardState ] = useState( false );
	const closeAiWizard = () => {
		setWizardState( false );
		console.log( 'closeAiWizard - Need to trigger something' );
	};
	const handleAiWizardPrimaryAction = ( event, rebuild ) => {
		console.log( 'handleAiWizardPrimaryAction - Need to trigger something', event, rebuild );
	}
	return (
		<div className="kadence-blocks-home">
			{ wizardState && (
				<AiWizard
					onClose={ closeAiWizard }
					onPrimaryAction={ handleAiWizardPrimaryAction }
					photographyOnly={ false }
					credits={ false }
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
		</div>
	);
}