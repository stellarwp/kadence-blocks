/**
 * Internal dependencies
 */
import { AiWizard } from '../plugins/prebuilt-library/ai-wizard';
import { getAsyncData } from '../plugins/prebuilt-library/data-fetch/get-async-data';
import Notices from './notices';
import { ActionCard, ArticleSlider, SectionTitle, UpsellContent } from './components';
import { AUTHENTICATED_CONTENT, UNAUTHENTICATED_CONTENT } from './constants';
import { AiBanner } from './components/large-banner/ai-banner';
import { aiIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './editor.scss';
/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { Icon, SVG, Spinner } from '@wordpress/components';

export default function KadenceBlocksHome() {
	const [wizardState, setWizardState] = useState(false);
	const queryParameters = new URLSearchParams(window.location.search);
	const wizard = queryParameters.get('uplink_token');
	const { getInitialAIContent, getAllAIContentData, getAvailableCredits } = getAsyncData();
	const [aiStatus, setAIStatus] = useState('start');
	const [triggerNotice, setShouldTriggerNotice] = useState(false);
	// Get if user is authenticated
	const authenticated = kadenceHomeParams.isAuthorized ? true : false;
	const isNetworkAdmin = kadenceHomeParams.isNetworkAdmin ? true : false;
	const isNetworkEnabled = kadenceHomeParams.isNetworkEnabled ? true : false;
	const hasPro = window?.kadenceHomeParams?.pro && kadenceHomeParams.pro === 'true' ? true : false;
	const showControls = (isNetworkAdmin && isNetworkEnabled) || (!isNetworkAdmin && !isNetworkEnabled) ? true : false;

	const content = authenticated ? AUTHENTICATED_CONTENT : UNAUTHENTICATED_CONTENT;
	const homeContent = window?.kadenceHomeParams?.homeContent || {};
	const cardIcon = (
		<Icon
			icon={
				<SVG xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
					<g clipPath="url(#clip0_3059_18235)">
						<path
							d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
							fill="#161A1E"
						/>
					</g>
					<defs>
						<clipPath id="clip0_3059_18235">
							<rect width="23.875" height="25" fill="white" transform="translate(0.5625)" />
						</clipPath>
					</defs>
				</SVG>
			}
		/>
	);
	const getInitialAIStatus = () => {
		if (authenticated && 'start' === aiStatus) {
			checkAIStatus();
		} else {
			setAIStatus('not-authenticated');
		}
	};
	useEffect(() => {
		if (wizard) {
			queryParameters.delete('uplink_token');
			queryParameters.delete('uplink_license');
			queryParameters.delete('uplink_slug');
			queryParameters.delete('_uplink_nonce');
			history.pushState(null, '', window.location.pathname + '?' + queryParameters.toString());
		}
		if (wizard && authenticated) {
			setWizardState(true);
		}
		getInitialAIStatus();
	}, []);
	const { createErrorNotice, createSuccessNotice, createNotice } = useDispatch(noticesStore);
	const closeAiWizard = (info) => {
		setWizardState(false);
		if (info && info === 'saved') {
			createSuccessNotice(__('Saved'), { type: 'snackbar' });
		}
	};
	const handleAiWizardPrimaryAction = (event, rebuild) => {
		if (rebuild) {
			setAIStatus('getInitial');
			console.log('Rebuild AI Content', aiStatus);
			getAllNewData();
		}
	};
	async function checkAIStatus() {
		const localContent = await getAllAIContentData(true);
		//console.log( 'localContent', localContent );
		if ('empty' === localContent) {
			console.log('No Local AI Content');
			setAIStatus('empty');
		} else if ('loading' === localContent) {
			if (aiStatus !== 'getInitial') {
				setAIStatus('getInitial');
			}
			console.log('Still Loading');
			setTimeout(() => {
				checkAIStatus();
			}, 5000);
		} else if ('error' === localContent) {
			console.log('Error to load Local');
			setAIStatus('failed');
		} else if (localContent) {
			setAIStatus('infoLoaded');
		}
	}
	async function getAllNewData() {
		createSuccessNotice(__('Generating AI Content'), { type: 'snackbar' });
		const response = await getInitialAIContent();
		console.log('response', response);
		if (response === 'error' || response === 'failed') {
			createErrorNotice(__('Error generating AI content, Please Retry'), {
				type: 'snackbar',
			});
			console.log('Error getting AI Content.');
			setAIStatus('failed');
		} else if (response?.error && response?.context) {
			setAIStatus('failed');
			createErrorNotice(__('Error, Some AI Contexts could not be started, Please Retry'), { type: 'snackbar' });
			console.log('Error getting all new AI Content.');
		} else {
			setTimeout(() => {
				checkAIStatus();
			}, 10000);
		}
	}
	useEffect(() => {
		if (triggerNotice && aiStatus === 'infoLoaded') {
			createNotice(
				'info',
				__(
					'AI Content generated. You can find AI content in your design library in the editor.',
					'kadence-blocks'
				),
				{ type: 'default' }
			);
		}
		if (aiStatus === 'getInitial') {
			setShouldTriggerNotice(true);
		}
	}, [aiStatus]);
	const footerText = (
		<>
			{__('AI access authorized.', 'kadence-blocks')}{' '}
			<a href={kadenceHomeParams.disconnectUrl}>{__('Disconnect?', 'kadence-blocks')}</a>
		</>
	);
	return (
		<>
			<AiBanner
				onUpdateWizard={() => setWizardState(true)}
				isUserAuthenticated={authenticated}
				showControls={showControls}
				isNetworkAdmin={isNetworkAdmin}
				aiStatus={aiStatus}
			/>
			{aiStatus === 'getInitial' && (
				<div className="components-notice kadence-ai-notice is-info">
					<div className="components-notice__content">
						<Spinner />
						{__(
							'Generating AI Content, this happens in the background, you can leave this page. You can find AI content in your design library in the editor.',
							'kadence-blocks'
						)}
					</div>
				</div>
			)}
			<Notices />
			<div className="kb-container">
				<div className="kb-section">
					<SectionTitle
						title={homeContent?.actionCards?.title}
						icon={homeContent?.actionCards?.showAiIcon ? aiIcon : null}
					/>
					{homeContent?.actionCards?.cards?.length > 0 && (
						<div className="kb-auto-grid">
							{homeContent.actionCards.cards.map((card) => (
								<ActionCard key={card.heading} icon={cardIcon} {...card} />
							))}
						</div>
					)}
				</div>

				{!hasPro &&
					content.upsellContents.length > 0 &&
					content.upsellContents.map((upsellContent) => {
						return (
							<div className="kb-section" key={upsellContent.heading}>
								<UpsellContent {...upsellContent} />
							</div>
						);
					})}

				{!isNetworkAdmin && wizardState && (
					<AiWizard
						onClose={closeAiWizard}
						onPrimaryAction={handleAiWizardPrimaryAction}
						photographyOnly={false}
						credits={false}
						isFullScreen={true}
					/>
				)}
			</div>
			<div className="kb-section kb-section--dark">
				<div className="kb-container">
					<SectionTitle title={homeContent?.knowledgeBase?.heading} variant="white" />
					<ArticleSlider articles={homeContent?.knowledgeBase?.articles || []} />
				</div>
			</div>
			<div className="kb-footer-status">
				{showControls && (
					<p>{authenticated ? footerText : __('AI access is not authorized.', 'kadence-blocks')}</p>
				)}
				{!showControls && (
					<p>
						{authenticated
							? __('AI access authorized.', 'kadence-blocks')
							: __('AI access is not authorized.', 'kadence-blocks')}
					</p>
				)}
			</div>
		</>
	);
}
