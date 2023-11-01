/**
 * Internal dependencies
 */
import { AiWizard } from "../plugins/prebuilt-library/ai-wizard";
import { getAsyncData } from "../plugins/prebuilt-library/data-fetch/get-async-data";
import Notices from "./notices";

/**
 * WordPress dependencies
 */
import { useMemo, useEffect, useState, render } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Icon, SVG } from "@wordpress/components";
import {
	aiIcon,
	autoFix,
	notes,
	subject,
	check,
	playlist,
	chatBubble,
} from "@kadence/icons";
import { store as noticesStore } from "@wordpress/notices";
import { useDispatch } from "@wordpress/data";
import {
	ActionCard,
	DashboardButton,
	LargeBanner,
	SectionTitle,
} from "./components";

export default function KadenceBlocksHome() {
	const [wizardState, setWizardState] = useState(false);
	const queryParameters = new URLSearchParams(window.location.search);
	const wizard = queryParameters.get("wizard");
	const { getAIContentRemaining, getAvailableCredits } = getAsyncData();

	const authenticatedContent = {
		largeBanner: {
			heading: (
				<>
					Let’s build, <div>[Company Name]</div>
				</>
			),
			subHeading:
				"Elevate your web development game with Kadence AI. Supercharge your pattern and page library's potential with tailored content - get building pages in no time. Try Kadence AI today with 250 free credits!",
			button: (
				<DashboardButton
					text={__("Activate Kadence AI", "kadence-blocks")}
					onClick={() => {
						setWizardState(true);
					}}
				/>
			),
			imageSrc:
				"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
		actionCards: {
			title: (
				<SectionTitle
					title={__("Start Building with Kadence AI")}
					icon={aiIcon}
				/>
			),
			cards: [
				{
					icon: (
						<Icon
							icon={
								<SVG
									xmlns="http://www.w3.org/2000/svg"
									width="25"
									height="25"
									viewBox="0 0 25 25"
									fill="none"
								>
									<g clipPath="url(#clip0_3059_18235)">
										<path
											d="M1.56776 21.2781C1.8869 21.2781 2.13423 21.2103 2.30975 21.0747C2.48526 20.939 2.62887 20.7076 2.74057 20.3806L4.28438 16.144H11.3452L12.889 20.3806C13.0007 20.7076 13.1443 20.939 13.3198 21.0747C13.4953 21.2103 13.7387 21.2781 14.0499 21.2781C14.369 21.2781 14.6223 21.1904 14.8098 21.0148C14.9973 20.8393 15.091 20.6 15.091 20.2968C15.091 20.1133 15.0471 19.8979 14.9593 19.6506L9.34661 4.71518C9.203 4.34019 9.00753 4.06295 8.76019 3.88344C8.51287 3.70393 8.19773 3.61417 7.81477 3.61417C7.07279 3.61417 6.57016 3.97718 6.30687 4.7032L0.694142 19.6625C0.606381 19.8779 0.5625 20.0934 0.5625 20.3088C0.5625 20.612 0.652256 20.8493 0.831768 21.0208C1.01128 21.1924 1.25661 21.2781 1.56776 21.2781ZM4.89472 14.3131L7.8028 6.25897H7.86264L10.7707 14.3131H4.89472ZM16.6108 24.9162H23.5998C24.1583 24.9162 24.4375 24.6808 24.4375 24.2102C24.4375 23.7474 24.1583 23.5161 23.5998 23.5161H20.9191V1.38822H23.5998C24.1583 1.38822 24.4375 1.15286 24.4375 0.682145C24.4375 0.227382 24.1583 0 23.5998 0H16.6108C16.0604 0 15.7851 0.227382 15.7851 0.682145C15.7851 1.15286 16.0604 1.38822 16.6108 1.38822H19.3036V23.5161H16.6108C16.0604 23.5161 15.7851 23.7474 15.7851 24.2102C15.7851 24.6808 16.0604 24.9162 16.6108 24.9162Z"
											fill="#161A1E"
										/>
									</g>
									<defs>
										<clipPath id="clip0_3059_18235">
											<rect
												width="23.875"
												height="25"
												fill="white"
												transform="translate(0.5625)"
											/>
										</clipPath>
									</defs>
								</SVG>
							}
						/>
					),
					heading: __("Get started with full pages"),
					content: __(
						"Choose from a variety of pages featuring exclusively tailored content for [project name]."
					),
					variant: "blue",
				},
			],
		},
	};

	const unauthenticatedContent = {
		largeBanner: {
			heading: <>Kadence is better with AI. {aiIcon}</>,
			subHeading:
				"Elevate your web development game with Kadence AI. Supercharge your pattern and page library's potential with tailored content - get building pages in no time. Try Kadence AI today with 250 free credits!",
			button: (
				<DashboardButton
					text={__("Activate Kadence AI", "kadence-blocks")}
					onClick={() => {
						setWizardState(true);
					}}
				/>
			),
			imageSrc:
				"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		},
		actionCards: {
			title: <SectionTitle title={__("Streamlined site building")} />,
			cards: [],
		},
	};

	// Get if user is authenticated
	// TODO: Replace with real authentication
	const authenticated = true;
	const content = authenticated ? authenticatedContent : unauthenticatedContent;

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
				heading={content.largeBanner.heading}
				subHeading={content.largeBanner.subHeading}
				button={content.largeBanner.button}
				imageSrc={content.largeBanner.imageSrc}
				isUserAuthenticated={authenticated}
			/>
			<div className="kb-container">
				{content.actionCards.title}

				{content.actionCards.cards.length > 0 &&
					content.actionCards.cards.map((card) => {
						return (
							<ActionCard
								icon={card.icon}
								heading={card.heading}
								content={card.content}
								button={card.button}
								key={card.title}
							/>
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
		</>
	);
}
