import { Button, Icon, Tooltip, SVG, Popover, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { kadenceNewIcon, aiIcon, aiSettings } from '@kadence/icons';
import { SafeParseJSON } from '@kadence/helpers';
import { DashboardButton } from '../dashboard-button';
import { useEffect, useState } from '@wordpress/element';

import './large-banner.scss';
import { getAsyncData } from '../../../plugins/prebuilt-library/data-fetch/get-async-data';

const kbLogo = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fillRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit="2"
		clipRule="evenodd"
		viewBox="0 0 1600 240"
	>
		<path fill="none" d="M0 0H1600V240H0z"></path>
		<g fill="#fff">
			<path d="M221.13 222.132h-57.915c-6.271 0-11.361-5.092-11.361-11.363 0-6.269 5.09-11.361 11.361-11.361h37.831c5.904-.405 10.574-5.328 10.574-11.333 0-6.271-5.091-11.361-11.362-11.361h-27.659v-.002H141.06c-6.262 0-11.346-5.083-11.346-11.345 0-6.262 5.084-11.347 11.346-11.347h7.146l-.015-.014h10.624c6.259 0 11.341-5.081 11.341-11.34 0-6.259-5.082-11.339-11.341-11.339h-26.721v-.01H76.061c-6.259 0-11.341-5.082-11.341-11.342 0-6.259 5.082-11.342 11.341-11.342h56.033v-.031h21.94c6.253 0 11.33-5.077 11.33-11.331s-5.077-11.331-11.33-11.331h-5.001l.001-.002-23.3-.001c-6.262.001-11.345-5.084-11.345-11.345 0-6.263 5.083-11.347 11.345-11.347h53.802c.269 0 .534.01.797.027h19.232c6.269 0 11.36-5.089 11.36-11.361 0-6.269-5.091-11.36-11.36-11.36h-28.27c-5.884-.427-10.53-5.341-10.53-11.331 0-6.271 5.09-11.362 11.361-11.362h44.532l.15.001h52.506l-92.001 100.473 111.279 103.81h-67.161l-.016-.015a6.714 6.714 0 01-.285.005zm-109.01-22.724c6.249 0 11.322 5.073 11.322 11.321 0 6.249-5.073 11.321-11.322 11.321H70.575c-6.248 0-11.32-5.072-11.32-11.321 0-6.248 5.073-11.321 11.321-11.321h41.544zM95.673 154.02c6.267 0 11.355 5.088 11.355 11.356 0 6.266-5.088 11.355-11.355 11.355-6.268 0-11.356-5.089-11.356-11.355 0-6.268 5.088-11.356 11.356-11.356zm-59.331-45.387c6.269 0 11.357 5.088 11.357 11.356 0 6.267-5.088 11.355-11.356 11.355-6.267 0-11.355-5.088-11.355-11.355 0-6.268 5.088-11.356 11.355-11.356zm44.005-45.387c6.267 0 11.356 5.088 11.356 11.356 0 6.267-5.089 11.354-11.356 11.354-6.267 0-11.356-5.087-11.356-11.354 0-6.268 5.089-11.356 11.356-11.356zm40.723-45.388c6.249 0 11.321 5.073 11.321 11.321 0 6.249-5.072 11.322-11.321 11.322H94.81c-6.248 0-11.321-5.073-11.321-11.322 0-6.248 5.072-11.321 11.321-11.321h26.26z"></path>
			<path
				fillRule="nonzero"
				d="M1340.97 132.65l19.465-73.534h30.948l18.687 73.312 18.688-73.312h31.771l-32.927 123.475h-30.124l-21.981-80.594-21.98 80.594h-30.124l-33.009-123.475h31.771l18.815 73.533zm131.561 49.942V59.118h59.264c28.811 0 43.217 11.854 43.217 35.561 0 24.584-14.378 36.878-43.134 36.878h-29.223v51.035h-30.124zm59.515-100.343h-29.391v26.259h29.144c9.932-.165 15.036-4.692 15.311-13.582-.275-8.122-5.296-12.348-15.064-12.677z"
			></path>
			<g fillRule="nonzero">
				<path d="M365.698 58.581h24.695v49.39l41.158-49.39h27.741l-48.32 57.622 58.445 65.852h-32.104l-46.92-53.34v53.34h-24.695V58.581zM476.97 182.055L526.36 58.58h24.695l49.308 123.393-26.259.082-7.409-18.933H510.72l-7.408 18.933H476.97zm62.396-90.548l-18.768 46.92h37.043l-18.275-46.92zM642.654 157.442V83.276h22.884c21.896 0 32.872 12.346 32.927 37.042-.055 24.694-11.031 37.069-32.927 37.124h-22.884zm22.884 24.613c38.415 0 57.622-20.579 57.622-61.738 0-41.213-19.207-61.819-57.622-61.819h-47.579v123.557h47.579zM748.494 182.055V58.662l90.712-.082v23.049h-66.017v26.341h49.472v22.966h-49.472v28.07h65.853v23.049h-90.548zM863.223 182.055V58.58h8.232l77.378 77.378V58.58h24.695v123.475h-9.055L887.918 105.5v76.555h-24.695zM1053.85 182.055c-17.451-.055-32.09-5.968-43.916-17.739-11.826-11.772-17.739-26.519-17.739-44.245.055-17.341 5.981-31.925 17.78-43.751 11.799-11.826 26.424-17.739 43.875-17.739 17.616 0 32.734 5.488 45.356 16.463l-16.463 18.028c-8.396-6.586-18.027-9.878-28.893-9.878-11.085.054-20.017 3.512-26.794 10.371-6.778 6.86-10.166 15.641-10.166 26.342.055 11.469 3.484 20.579 10.289 27.329s15.75 10.125 26.836 10.125c11.085 0 20.661-3.265 28.728-9.796l16.463 18.028c-12.567 10.975-27.685 16.463-45.356 16.463zM1124.62 182.055V58.662l90.713-.082v23.049h-66.018v26.341h49.473v22.966h-49.473v28.07h65.854v23.049h-90.549z"></path>
			</g>
		</g>
	</svg>
);

export function LargeBanner({
	heading,
	subHeading,
	subHeadingPro,
	imageSrc,
	buttonText,
	isUserAuthenticated,
	activateUrl,
	onUpdateWizard,
	showControls,
	isNetworkAdmin,
	siteName = '',
}) {
	const hasPro = window?.kadenceHomeParams?.pro && kadenceHomeParams.pro === 'true' ? true : false;
	const [isVisible, setIsVisible] = useState(false);
	const [availableCredits, setAvailableCredits] = useState(false);
	const toggleVisible = () => {
		if (availableCredits === false) {
			getRemoteAvailableCredits();
		}
		setIsVisible((state) => !state);
	};
	const { getAIContentRemaining, getAvailableCredits } = getAsyncData();
	async function getRemoteAvailableCredits() {
		const response = await getAvailableCredits();
		const tempActiveStorage = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
		if (response === 'error') {
			console.log('Error getting credits');
			tempActiveStorage['credits'] = 'fetch';
			localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
			setAvailableCredits(0);
		} else if (response === '') {
			tempActiveStorage['credits'] = 0;
			localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
			setAvailableCredits(0);
		} else {
			tempActiveStorage['credits'] = parseInt(response);
			localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
			setAvailableCredits(parseInt(response));
		}
	}
	const companyName = siteName || __('Something Great!', 'kadence-blocks');
	const addedHeading = isUserAuthenticated ? <div> {companyName}</div> : '';
	return (
		<div className="kb-large-banner">
			<div className="kb-large-banner__logo">{kbLogo}</div>
			<div className="kb-large-banner__content">
				<div className="kb-large-banner__heading">
					{heading}
					{addedHeading}
				</div>
				{!isUserAuthenticated && (
					<>
						<div className="kb-large-banner__subheading">{hasPro ? subHeadingPro : subHeading}</div>
						{showControls && (
							<a className="uplink-authorize" href={activateUrl}>
								{hasPro ? __('Activate Kadence Blocks Pro', 'kadence-blocks') : buttonText}
							</a>
						)}
						{!showControls && (
							<p className="uplink-authorize-note">
								{__('Authorization needed from network admin', 'kadence-blocks')}
							</p>
						)}
					</>
				)}
				{isUserAuthenticated && !isNetworkAdmin && (
					<>
						<Button
							onClick={onUpdateWizard}
							iconPosition="left"
							icon={aiIcon}
							text={__('Update Kadence AI Details', 'kadence-blocks')}
							className="kadence-update-ai-wizard"
							variant="link"
						/>
					</>
				)}
			</div>

			{/* {isUserAuthenticated && (
				<div className="kb-large-banner__media">
					<img src={imageSrc} />
				</div>
			)} */}
			{isUserAuthenticated && (
				<div className="kb-large-banner__tooltip">
					<Button
						onClick={toggleVisible}
						variant="link"
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
					>
						{isVisible && (
							<Popover
								className="kb-large-banner__tooltip_popup"
								placement={'left'}
								onClose={() => {
									console.log('close');
									setIsVisible(false);
								}}
							>
								{availableCredits === false ? <Spinner /> : ''}
								{availableCredits === false
									? __('Fetching Available Credits')
									: availableCredits + ' ' + __('Credits Available', 'kadence-blocks')}
							</Popover>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
