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
import { getAiWizardData } from './utils/database';
import { verticalsHelper } from './utils/verticals-helper';
import { collectionsHelper } from './utils/collections-helper';

export function AiWizard() {
	const [ wizardData, setWizardData ] = useState();
	const [ wizardOpen, setWizardOpen ] = useState(false);
	const { setVerticals } = verticalsHelper();
	const { setCollections } = collectionsHelper();

	useEffect(() => {
		// Set verticals data in session storage.
		setVerticals();
		// Set collections data in session storage.
		setCollections();

		// Get previously saved wizard data.
		async function getData() {
			const response = await getAiWizardData();
			const data = response ? JSON.parse(response) : {};

			setWizardData(data);
		}

		getData();
	}, []);

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
			{ (wizardOpen && wizardData) && (
				<KadenceAiProvider value={ wizardData }>
					<KadenceAiWizard handleWizardClose={ handleWizardClose }/>
				</KadenceAiProvider>
			) }
		</>
	)
}

