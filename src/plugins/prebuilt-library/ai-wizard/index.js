/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { KadenceAiProvider } from './context/kadence-ai-provider';
import { KadenceAiWizard } from './kadence-ai-wizard';
import { useDatabase } from './hooks/use-database';
import { verticalsHelper } from './utils/verticals-helper';
import { collectionsHelper } from './utils/collections-helper';

export function AiWizard() {
	const [ wizardData, setWizardData ] = useState();
	const [ wizardOpen, setWizardOpen ] = useState(false);
	const { loading, getAiWizardData } = useDatabase();
	const { setVerticals } = verticalsHelper();
	const { setCollections } = collectionsHelper();

	useEffect(() => {
		// Set verticals data in session storage.
		setVerticals();
		// Set collections data in session storage.
		setCollections();
	}, []);
	
	useEffect(() => {
		if (wizardOpen) {
			// Get previously-saved wizard data.
			getPreviousData();
		}
	}, [ wizardOpen ]);

	async function getPreviousData() {
		const response = await getAiWizardData();
		const data = response ? JSON.parse(response) : {};

		setWizardData(data);
	}

	function handleWizardClose() {
		setWizardOpen(false);
	}

	function handleButtonClick() {
		setWizardOpen(true);
	}

	return (
		<>
			<Button
				variant="primary"
				text={ __('AI Me', 'kadence') }
				onClick={ handleButtonClick }
			/>
			{ (wizardOpen && wizardData && ! loading) && (
				<KadenceAiProvider value={ wizardData }>
					<KadenceAiWizard loading={ loading } handleWizardClose={ handleWizardClose }/>
				</KadenceAiProvider>
			) }
		</>
	)
}

