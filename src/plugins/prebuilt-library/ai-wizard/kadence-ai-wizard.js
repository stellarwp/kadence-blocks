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

export function KadenceAiWizard({ loading, handleWizardClose, photographyOnly }) {
	const { state, dispatch } = useKadenceAi();
	const {
		isForwardButtonDisabled,
		isFinishButtonDisabled
	} = useAiWizardHelper(state, getPages(photographyOnly));
	const { saveAiWizardData } = useDatabase();

	async function handleOnFinish(event) {
		// No action on blur or escape keydown.
		if (event.type === 'blur' || (event.keyCode === 27 && event.type === 'keydown')) {
			return;
		}

		// Submit wizard data on finish buttton click.
		if (event.type === 'click' && event.target.classList.contains('components-wizard__finish-button')) {
			dispatch({ type: 'SET_SAVING', payload: true });

			const {
				firstTime,
				saving,
				saveError,
				...rest
			} = state;

			const saveStatus = await saveAiWizardData({
				firstTime: false,
				...rest
			});

			if (saveStatus) {
				dispatch({ type: 'SET_SAVING', payload: false });
				handleWizardClose(false);

				return;
			}
		} else if (event.type === 'click' && event.target.classList.contains('components-wizard__finish-build-button')) {
			dispatch({ type: 'SET_SAVING', payload: true });

			const {
				firstTime,
				saving,
				saveError,
				...rest
			} = state;

			const saveStatus = await saveAiWizardData({
				firstTime: false,
				...rest
			});

			if (saveStatus) {
				dispatch({ type: 'SET_SAVING', payload: false });
				handleWizardClose(true);

				return;
			}
		}
	
		// Close wizard.
		handleWizardClose(false);
	}

	if (loading) {
		return <></>;
	}

	return (
		<Wizard
			logo={ <KadenceK /> }
			pages={ getPages(photographyOnly) }
			forwardButtonDisabled={ isForwardButtonDisabled() }
			finishButtonDisabled={ isFinishButtonDisabled() }
			onPageChange={ (pageIndex) => dispatch({ type: 'SET_CURRENT_PAGE_INDEX', payload: pageIndex }) }
			onFinish={ (event) => handleOnFinish(event) }
			photographyOnly={ photographyOnly }
		/>
	)
}
