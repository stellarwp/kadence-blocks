/**
 * Internal dependencies
 */
import { AiWizard } from "../plugins/prebuilt-library/ai-wizard";
import { getAsyncData } from "../plugins/prebuilt-library/data-fetch/get-async-data";
import Notices from "./notices";
import {
	ActionCard,
	ArticleSlider,
	LargeBanner,
	SectionTitle,
	UpsellContent,
} from "./components";
import { AUTHENTICATED_CONTENT, UNAUTHENTICATED_CONTENT } from "./constants";

/**
 * Import Css
 */
import './editor.scss';
/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { useDispatch } from "@wordpress/data";
import { Button, Spinner, } from "@wordpress/components";

export default function KadenceBlocksHome() {
	const [wizardState, setWizardState] = useState(false);
	const queryParameters = new URLSearchParams(window.location.search);
	const wizard = queryParameters.get("uplink_token");
	const { getInitialAIContent, getAllAIContentData, getAvailableCredits } = getAsyncData();
	const [aiStatus, setAIStatus] = useState('start');
	const [triggerNotice, setShouldTriggerNotice] = useState(false);
	// Get if user is authenticated
	const authenticated    = kadenceHomeParams.isAuthorized ? true : false;
	const isNetworkAdmin   = kadenceHomeParams.isNetworkAdmin ? true : false;
	const isNetworkEnabled = kadenceHomeParams.isNetworkEnabled ? true : false;
	const hasPro = ( window?.kadenceHomeParams?.pro && kadenceHomeParams.pro === 'true' ? true : false );
	const showControls     = ( isNetworkAdmin && isNetworkEnabled ) || ( ! isNetworkAdmin && ! isNetworkEnabled ) ? true : false;

	const content = authenticated
		? AUTHENTICATED_CONTENT
		: UNAUTHENTICATED_CONTENT;
	const getInitialAIStatus = () => {
		if ( authenticated && 'start' === aiStatus ) {
			checkAIStatus();
		} else {
			setAIStatus( 'not-authenticated' );
		}
	};
	useEffect(() => {
		if ( wizard ) {
			queryParameters.delete('uplink_token');
			queryParameters.delete('uplink_license');
			queryParameters.delete('uplink_slug');
			queryParameters.delete('_uplink_nonce');
			history.pushState(null, '', window.location.pathname + '?' + queryParameters.toString());
		}
		if ( wizard && authenticated ) {
			setWizardState(true);
		}
		getInitialAIStatus();
	}, []);
	const { createErrorNotice, createSuccessNotice, createNotice } = useDispatch(noticesStore);
	const closeAiWizard = (info) => {
		setWizardState(false);
		if (info && info === "saved") {
			createSuccessNotice(__("Saved"), { type: "snackbar" });
		}
	};
	const handleAiWizardPrimaryAction = (event, rebuild) => {
		if (rebuild) {
			setAIStatus( 'getInitial' );
			console.log( 'Rebuild AI Content', aiStatus );
			getAllNewData();
		}
	};
	async function checkAIStatus() {
		const localContent = await getAllAIContentData( true );
		//console.log( 'localContent', localContent );
		if ( 'empty' === localContent ) {
			console.log( 'No Local AI Content' );
			setAIStatus( 'empty' );
		} else if ( 'loading' === localContent ) {
			if ( aiStatus !== 'getInitial' ) {
				setAIStatus( 'getInitial' );
			}
			console.log( 'Still Loading' );
			setTimeout( () => {
				checkAIStatus();
			}, 5000 );
		} else if ( 'error' === localContent ) {
			console.log( 'Error to load Local' );
			setAIStatus( 'failed' );
		} else if ( localContent ) {
			setAIStatus( 'infoLoaded' );
		}
	}
	async function getAllNewData() {
		createSuccessNotice(__("Generating AI Content"), { type: "snackbar" });
		const response = await getInitialAIContent();
		console.log("response", response);
		if (response === "error" || response === "failed") {
			createErrorNotice(__("Error generating AI content, Please Retry"), {
				type: "snackbar",
			});
			console.log("Error getting AI Content.");
			setAIStatus( 'failed' );
		} else if (response?.error && response?.context) {
			setAIStatus( 'failed' );
			createErrorNotice(
				__("Error, Some AI Contexts could not be started, Please Retry"),
				{ type: "snackbar" }
			);
			console.log("Error getting all new AI Content.");
		} else {
			setTimeout( () => {
				checkAIStatus();
			}, 10000 );
		}
	}
	useEffect(() => {
		if ( triggerNotice && aiStatus === 'infoLoaded' ) {
			createNotice('info', __("AI Content generated. You can find AI content in your design library in the editor.", 'kadence-blocks'), { type: "default" });
		}
		if ( aiStatus === 'getInitial' ) {
			setShouldTriggerNotice( true );
		}
	}, [ aiStatus ] );
	const footerText = <>
		{ __( 'AI access authorized.','kadence-blocks' ) } <a href={ kadenceHomeParams.disconnectUrl }>{ __( 'Disconnect?', 'kadence-blocks' ) }</a>
	</>;
	return (
		<>
			<LargeBanner
				{...content?.largeBanner}
				activateUrl={ kadenceHomeParams.authUrl }
				onUpdateWizard={() => setWizardState(true)}
				isUserAuthenticated={authenticated}
				showControls={showControls}
				isNetworkAdmin={isNetworkAdmin}
			/>
			{ aiStatus === 'getInitial' && (
				<div className="components-notice kadence-ai-notice is-info"><div className="components-notice__content">
					<Spinner/>
					{__("Generating AI Content, this happens in the background, you can leave this page. You can find AI content in your design library in the editor.", 'kadence-blocks' )}
				</div></div>
			) }
			<Notices />
			<div className="kb-container">
				<div className="kb-section">
					{content.actionCards.title}
					{content.actionCards.cards.length > 0 && (
						<div className="kb-auto-grid">
							{content.actionCards.cards.map((card) => {
								return <ActionCard key={card.heading} {...card} />;
							})}
						</div>
					)}
				</div>

				{ ! hasPro && content.upsellContents.length > 0 &&
					content.upsellContents.map((upsellContent) => {
						return (
							<div className="kb-section" key={upsellContent.heading}>
								<UpsellContent {...upsellContent} />
							</div>
						);
					})}

				{ ! isNetworkAdmin && wizardState && (
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
					<SectionTitle title={content.knowledgeBase.heading} variant="white" />
					<ArticleSlider articles={content.knowledgeBase.articles} />
				</div>
			</div>
			<div className="kb-footer-status">
				{ showControls && (
					<p>{ authenticated ? footerText : __( 'AI access is not authorized.', 'kadence-blocks' ) }</p>
				) }
				{ ! showControls && (
					<p>{ authenticated ? __( 'AI access authorized.', 'kadence-blocks' ) : __( 'AI access is not authorized.', 'kadence-blocks' ) }</p>
				) }
			</div>
		</>
	);
}
