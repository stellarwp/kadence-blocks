/**
 * Wordpress dependencies
 */

import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Wizard, KadenceK } from './components';
import { HowItWorks, IndustryInformation, AboutYourSite, TheDetails, Photography } from './pages';
import { useKadenceAi } from './context/kadence-ai-provider';
import { useAiWizardHelper } from './hooks/use-ai-wizard-helper';
import { useDatabase } from './hooks/use-database';
import { getAsyncData } from '../data-fetch/get-async-data';
import { sendEvent } from '../../../extension/analytics/send-event';

const pages = [
	{
		id: 'how-it-works',
		content: <HowItWorks />,
		step: 'How it Works',
		required: [],
	},
	{
		id: 'industry-information',
		content: <IndustryInformation />,
		step: 'Industry Information',
		required: ['entityType', 'companyName', 'location', 'industry'],
	},
	{
		id: 'about-your-site',
		content: <AboutYourSite />,
		step: 'About Your Site',
		required: ['missionStatement'],
	},
	{
		id: 'the-details',
		content: <TheDetails />,
		step: 'The Details',
		required: ['keywords', 'tone'],
	},
	{
		id: 'photography',
		content: <Photography />,
		step: 'Photography',
		required: [],
	},
];
const photographyOnlyPages = [
	{
		id: 'photography',
		content: <Photography photographyOnly={true} />,
		step: 'Photography',
		required: [],
	},
];
function getPages(photographyOnly) {
	const {
		state: { firstTime },
	} = useKadenceAi();

	if (photographyOnly) {
		return photographyOnlyPages;
	}

	return !firstTime ? pages.filter((page) => page.id !== 'how-it-works') : pages;
}

export function KadenceAiWizard(props) {
	const { loading, onWizardClose, onPrimaryAction, photographyOnly, credits, isFullScreen } = props;

	const { state, dispatch } = useKadenceAi();
	const { isComplete, firstTime, isSubmitted, currentPageIndex, saving, saveError, ...rest } = state;

	const { isForwardButtonDisabled, isFinishButtonDisabled } = useAiWizardHelper(state, getPages(photographyOnly));
	const { saveAiWizardData, getAiWizardData } = useDatabase();

	async function handleSave() {
		if (firstTime) {
			sendEvent('ai_wizard_started');
		}
		const saveStatus = await saveAiWizardData({
			firstTime: false,
			isSubmitted: true,
			isComplete,
			...rest,
		});

		if (saveStatus) {
			onWizardClose('saved');
			handleEvent('ai_wizard_update');
		}
	}

	async function handleComplete() {
		const complete = await saveAiWizardData({
			firstTime: false,
			isSubmitted: true,
			isComplete: true,
			...rest,
		});

		if (complete) {
			handleEvent('ai_wizard_complete');
		}
	}

	async function handleEvent(event) {
		const wizardData = await getAiWizardData();
		if (wizardData) {
			sendEvent(event, JSON.parse(wizardData));
		}
	}

	function handleOnPrimaryClick(event) {
		// No action on blur or escape keydown.
		if (event.type === 'blur' || (event.keyCode === 27 && event.type === 'keydown')) {
			return;
		}

		// Submit wizard data on finish button click.
		if (event.type === 'click' && event.target.classList.contains('components-wizard__primary-button')) {
			if (photographyOnly) {
				// Fire off collection_updated event after data has saved.
				handleSave().then(() => {
					handleEvent('collection_updated');
				});
			} else {
				handleComplete();
				onPrimaryAction(event, true);
			}
		}

		onWizardClose();
	}

	function handleOnSecondaryClick(event) {
		// No action on blur or escape keydown.
		if (event.type === 'blur' || (event.keyCode === 27 && event.type === 'keydown')) {
			return;
		}

		// Submit wizard data on finish button click.
		if (event.type === 'click' && event.target.classList.contains('components-wizard__secondary-button')) {
			if (state.photoCollectionChanged) {
				// Fire off collection_updated event after data has saved.
				handleSave().then(() => {
					handleEvent('collection_updated');
				});
			} else {
				handleSave();
			}
		}

		onWizardClose();
	}

	function handleOnClose(event) {
		// No action on blur or escape keydown.
		if (event.type === 'blur' || (event.keyCode === 27 && event.type === 'keydown')) {
			return;
		}

		return onWizardClose();
	}

	if (loading) {
		return <></>;
	}

	return (
		<Wizard
			isFirstTime={firstTime}
			logo={<KadenceK />}
			pages={getPages(photographyOnly)}
			forwardButtonDisabled={isForwardButtonDisabled()}
			onPageChange={(pageIndex) => dispatch({ type: 'SET_CURRENT_PAGE_INDEX', payload: pageIndex })}
			onClose={handleOnClose}
			onPrimaryClick={handleOnPrimaryClick}
			primaryButtonText={
				photographyOnly
					? __('Update My Design Library', 'kadence-blocks')
					: __('Generate Initial Content', 'kadence-blocks')
			}
			primaryButtonDisabled={isFinishButtonDisabled()}
			onSecondaryClick={!photographyOnly ? handleOnSecondaryClick : null}
			secondaryButtonText={__('Save', 'kadence-blocks')}
			credits={credits}
			photographyOnly={photographyOnly}
			isFullScreen={isFullScreen}
		/>
	);
}
