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
import { __, _n } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { useDispatch } from "@wordpress/data";

export default function KadenceBlocksHome() {
	const [wizardState, setWizardState] = useState(false);
	const queryParameters = new URLSearchParams(window.location.search);
	const wizard = queryParameters.get("wizard");
	const { getAIContentRemaining, getAvailableCredits } = getAsyncData();

	// Get if user is authenticated
	// TODO: Replace with real authentication logic
	const authenticated = false;
	const content = authenticated
		? AUTHENTICATED_CONTENT
		: UNAUTHENTICATED_CONTENT;

	useEffect(() => {
		if (wizard) {
			setWizardState(true);
		}
	}, []);
	const { createErrorNotice, createSuccessNotice } = useDispatch(noticesStore);
	const closeAiWizard = (info) => {
		setWizardState(false);
		if (info && info === "saved") {
			createSuccessNotice(__("Saved"), { type: "snackbar" });
		}
	};
	const handleAiWizardPrimaryAction = (event, rebuild) => {
		if (rebuild) {
			getAllNewData();
		}
		console.log(
			"handleAiWizardPrimaryAction - Need to trigger something",
			event,
			rebuild
		);
	};

	async function getAllNewData() {
		const response = await getAIContentRemaining(true);
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

	return (
		<>
			<LargeBanner
				{...content?.largeBanner}
				onClick={() => setWizardState(true)}
				isUserAuthenticated={authenticated}
			/>
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
				<Notices />
			</div>

			<div className="kb-section kb-section--dark">
				<div className="kb-container">
					<SectionTitle title={content.knowledgeBase.heading} variant="white" />
					<ArticleSlider articles={content.knowledgeBase.articles} />
				</div>
			</div>
		</>
	);
}
