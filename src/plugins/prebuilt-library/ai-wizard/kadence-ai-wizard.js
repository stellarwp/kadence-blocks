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

const pages = [
	{
		id: 'how-it-works',
		content: <HowItWorks />,
		step: 'How it Works',
		required: []
	},
	{
		id: 'industry-information',
		content: <IndustryInformation />,
		step: 'Industry Information',
		required: ['entityType', 'companyName', 'location', 'industry']
	},
	{
		id: 'about-your-site',
		content: <AboutYourSite />,
		step: 'About Your Site',
		required: ['missionStatement']
	},
	{
		id: 'the-details',
		content: <TheDetails />,
		step: 'The Details',
		required: ['keywords', 'tone']
	},
	{
		id: 'photography',
		content: <Photography />,
		step: 'Photography',
		required: []
	},
];

function getPages(photographyOnly) {
	const { state: { firstTime } } = useKadenceAi();

	if (photographyOnly) {
		return pages.filter((page) => page.id === 'photography');
	}

	return ! firstTime ? pages.filter((page) => page.id !== 'how-it-works') : pages;
}

export function KadenceAiWizard( props ) {
	const {
		loading,
		onWizardClose,
		onPrimaryAction,
		photographyOnly
	} = props;

	const { state, dispatch } = useKadenceAi();
	const {
		firstTime,
		isSubmitted,
		currentPageIndex,
		saving,
		saveError,
		...rest
	} = state;

	const {
		isForwardButtonDisabled,
		isFinishButtonDisabled
	} = useAiWizardHelper(state, getPages(photographyOnly));
	const { saveAiWizardData } = useDatabase();

	async function handleSave() {
		const saveStatus = await saveAiWizardData({
			firstTime: false,
			isSubmitted: true,
			...rest
		});

		if (saveStatus) {
			onWizardClose();
		}
	}

	function handleOnPrimaryClick(event) {
		// No action on blur or escape keydown.
		if (event.type === 'blur' || (event.keyCode === 27 && event.type === 'keydown')) {
			return;
		}

		// Submit wizard data on finish buttton click.
		if (event.type === 'click' && event.target.classList.contains('components-wizard__primary-button')) {
			handleSave();
			
			if (! photographyOnly) {
				onPrimaryAction(event, true);
			}

			return;
		}

		onWizardClose();
	}
	
	function handleOnSecondaryClick(event) {
		// No action on blur or escape keydown.
		if (event.type === 'blur' || (event.keyCode === 27 && event.type === 'keydown')) {
			return;
		}

		// Submit wizard data on finish buttton click.
		if (event.type === 'click' && event.target.classList.contains('components-wizard__secondary-button')) {
			handleSave();
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
			isFirstTime={ firstTime }
			logo={ <KadenceK /> }
			pages={ getPages(photographyOnly) }
			forwardButtonDisabled={ isForwardButtonDisabled() }
			onPageChange={ (pageIndex) => dispatch({ type: 'SET_CURRENT_PAGE_INDEX', payload: pageIndex }) }
			onClose={ handleOnClose }
			onPrimaryClick={ handleOnPrimaryClick }
			primaryButtonText={ photographyOnly ? __( 'Save', 'kadence-blocks' ) : __( 'Generate Content', 'kadence-blocks' ) }
			primaryButtonDisabled={ isFinishButtonDisabled() }
			onSecondaryClick={ isSubmitted && ! photographyOnly ? handleOnSecondaryClick : null }
			secondaryButtonText={ __( 'Save', 'kadence-blocks' ) }
		/>
	)
}
