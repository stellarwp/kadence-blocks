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
import { verticalsHelper } from './utils/verticals-helper';
import { collectionsHelper } from './utils/collections-helper';
import './kadence-ai-wizard.scss';

export function AiWizard( {
	photographyOnly = false,
	onClose,
	onPrimaryAction,
	onSecondaryAction,
	credits = '',
} ) {
	const [ wizardData, setWizardData ] = useState();
	const { loading, getAiWizardData } = useDatabase();
	const { setVerticals } = verticalsHelper();
	const { setCollections } = collectionsHelper();

	async function getPreviousData() {
		const response = SafeParseJSON(await getAiWizardData());

		setWizardData(response);
	}

	useEffect(() => {
		// Set verticals data in session storage.
		setVerticals();
		// Set collections data in session storage.
		setCollections();
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
						credits={ credits }
					/>
				</KadenceAiProvider>
			) }
		</>
	)
}

