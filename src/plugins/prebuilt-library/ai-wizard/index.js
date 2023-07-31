/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';
import { KadenceAiProvider } from './context/kadence-ai-provider';
import { KadenceAiWizard } from './kadence-ai-wizard';
import { useDatabase } from './hooks/use-database';
import './kadence-ai-wizard.scss';

export function AiWizard( {
	photographyOnly = false,
	onClose,
	onPrimaryAction,
	onSecondaryAction
} ) {
	const [ wizardData, setWizardData ] = useState();
	const { loading, getAiWizardData } = useDatabase();

	async function getPreviousData() {
		const response = SafeParseJSON(await getAiWizardData());

		setWizardData(response);
	}

	useEffect(() => {
		// Get previously-saved data for modal.
		getPreviousData();
	}, []);

	return (
		<>
			{ ( wizardData && ! loading) && (
				<KadenceAiProvider value={ wizardData }>
					<KadenceAiWizard
						loading={ loading }
						onWizardClose={ onClose }
						onPrimaryAction={ onPrimaryAction }
						onSecondaryAction={ onSecondaryAction }
						photographyOnly={ photographyOnly }
					/>
				</KadenceAiProvider>
			) }
		</>
	)
}

