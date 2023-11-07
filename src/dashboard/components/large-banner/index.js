import { Button, Icon, Tooltip, SVG } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import logo from "../../../../includes/settings/img/kadence-logo-white.png";
import { DashboardButton } from "../dashboard-button";

import "./large-banner.scss";

export function LargeBanner({
	heading,
	subHeading,
	imageSrc,
	buttonText,
	isUserAuthenticated,
	onClick,
}) {
	return (
		<div className="kb-large-banner">
			<img className="kb-large-banner__logo" src={logo} alt="Kadence" />
			<div className="kb-large-banner__content">
				<div className="kb-large-banner__heading">{heading}</div>
				{!isUserAuthenticated && (
					<>
						<div className="kb-large-banner__subheading">{subHeading}</div>
						<DashboardButton text={buttonText} onClick={onClick} />
					</>
				)}
			</div>

			{isUserAuthenticated && (
				<div className="kb-large-banner__media">
					<img src={imageSrc} />
				</div>
			)}

			<div className="kb-large-banner__tooltip">
				<Tooltip text={__("250 AI credits remaining")} position="middle left">
					<Button variant="link">
						<Icon
							icon={
								<SVG
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
								>
									<path
										d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
										fill="white"
									/>
								</SVG>
							}
						/>
					</Button>
				</Tooltip>
			</div>
		</div>
	);
}
