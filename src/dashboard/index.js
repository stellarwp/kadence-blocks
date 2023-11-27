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
import { Button } from "@wordpress/components";

export default function KadenceBlocksHome() {
	const [wizardState, setWizardState] = useState(false);
	const queryParameters = new URLSearchParams(window.location.search);
	const wizard = queryParameters.get("uplink_token");
	const { getAIContentRemaining, getAvailableCredits } = getAsyncData();

	// Get if user is authenticated
	const authenticated = kadenceHomeParams.isAuthorized ? true : false;
	const content = authenticated
		? AUTHENTICATED_CONTENT
		: UNAUTHENTICATED_CONTENT;

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
			getAllNewData();
			setTimeout(() => {
				createNotice('info', __("Generating AI Content, this happens in the background, you can leave this page. You can find AI content in your design library in the editor."), { type: "default" });
			}, 400 );
		}
	};

	async function getAllNewData() {
		createSuccessNotice(__("Generating AI Content"), { type: "snackbar" });
		const response = await getAIContentRemaining(true);
		console.log("response", response);
		if (response === "error" || response === "failed") {
			createErrorNotice(__("Error generating AI content, Please Retry"), {
				type: "snackbar",
			});
			console.log("Error getting AI Content.");
		} else if (response?.error && response?.context) {
			createErrorNotice(
				__("Error, Some AI Contexts could not be started, Please Retry"),
				{ type: "snackbar" }
			);
			console.log("Error getting all new AI Content.");
		}
	}
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
			/>
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

				{content.upsellContents.length > 0 &&
					content.upsellContents.map((upsellContent) => {
						return (
							<div className="kb-section" key={upsellContent.heading}>
								<UpsellContent {...upsellContent} />
							</div>
						);
					})}

				{wizardState && (
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
				<p>{ authenticated ? footerText : __( 'AI access is not authorized.')}</p>
			</div>
		</>
	);
}
