/**
 * BLOCK: Kadence Timer Block
 *
 * Registering a basic block with Gutenberg.
 */
import Countdown from 'react-countdown';

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { compose } from '@wordpress/compose';
import { Fragment, useEffect } from '@wordpress/element';

import { withSelect, useSelect, useDispatch } from '@wordpress/data';

import { uniqueIdHelper } from '@kadence/helpers';

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbTimerUniqueIDs = [];

/**
 * Build the spacer edit
 */
function KadenceCoundownTimer(props) {
	const { attributes, setAttributes, clientId, parentBlock } = props;
	const { uniqueID } = attributes;

	// eslint-disable-next-line no-undef
	const parentID = undefined !== parentBlock[0].attributes.uniqueID ? parentBlock[0].attributes.uniqueID : rootID;

	uniqueIdHelper(props);

	const displayUnits = parentBlock[0].attributes.units;
	const labels = {};
	labels.days = parentBlock[0].attributes.daysLabel
		? parentBlock[0].attributes.daysLabel
		: __('Days', 'kadence-blocks');
	labels.hours = parentBlock[0].attributes.hoursLabel
		? parentBlock[0].attributes.hoursLabel
		: __('Hrs', 'kadence-blocks');
	labels.minutes = parentBlock[0].attributes.minutesLabel
		? parentBlock[0].attributes.minutesLabel
		: __('Mins', 'kadence-blocks');
	labels.seconds = parentBlock[0].attributes.secondsLabel
		? parentBlock[0].attributes.secondsLabel
		: __('Secs', 'kadence-blocks');
	const preText = parentBlock[0].attributes.preLabel ? (
		<div className="kb-countdown-item kb-pre-timer">
			<span className="kb-pre-timer-inner">{parentBlock[0].attributes.preLabel}</span>
		</div>
	) : (
		''
	);
	const postText = parentBlock[0].attributes.postLabel ? (
		<div className="kb-countdown-item kb-post-timer">
			<span className="kb-post-timer-inner">{parentBlock[0].attributes.postLabel}</span>
		</div>
	) : (
		''
	);
	const timeNumbers = parentBlock[0].attributes.timeNumbers ? true : false;
	const enableDividers =
		undefined !== parentBlock[0].attributes.timerLayout &&
		'inline' !== parentBlock[0].attributes.timerLayout &&
		parentBlock[0].attributes.countdownDivider
			? true
			: false;
	const calculateNumberDesign = (number) => {
		if (timeNumbers) {
			return number > 9 ? '' + number : '0' + number;
		}
		return number;
	};
	const renderer = ({ total, days, hours, minutes, seconds, completed }) => {
		if (completed) {
			const parts = {};
			if (
				undefined !== displayUnits &&
				undefined !== displayUnits[0] &&
				undefined !== displayUnits[0].days &&
				!displayUnits[0].days
			) {
				if (
					undefined !== displayUnits &&
					undefined !== displayUnits[0] &&
					undefined !== displayUnits[0].hours &&
					!displayUnits[0].hours
				) {
					if (
						undefined !== displayUnits &&
						undefined !== displayUnits[0] &&
						undefined !== displayUnits[0].minutes &&
						!displayUnits[0].minutes
					) {
						parts.seconds = 0;
					} else {
						parts.minutes = 0;
						parts.seconds = 0;
					}
				} else {
					parts.hours = 0;
					parts.minutes = 0;
					parts.seconds = 0;
				}
			} else {
				parts.days = 0;
				parts.hours = 0;
				parts.minutes = 0;
				parts.seconds = 0;
			}
			const remaining = Object.keys(parts).map((part) => {
				if ('seconds' !== part && enableDividers) {
					return (
						<Fragment>
							<div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}>
								<span className="kb-countdown-number">{calculateNumberDesign(parts[part])}</span>
								<span className="kb-countdown-label">{labels[part]}</span>
							</div>
							<div
								className={`kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${part}`}
							>
								<span className="kb-countdown-number">:</span>
								<span className="kb-countdown-label">&nbsp;</span>
							</div>
						</Fragment>
					);
				}
				return (
					<div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}>
						<span className="kb-countdown-number">{calculateNumberDesign(parts[part])}</span>
						<span className="kb-countdown-label">{labels[part]}</span>
					</div>
				);
			});
			return (
				<Fragment>
					{preText}
					{remaining}
					{postText}
				</Fragment>
			);
		}
		// Render a countdown
		const parts = {};
		let calculateHours = Math.floor((total / (1000 * 60 * 60)) % 24);
		let calculateMinutes = Math.floor((total / 1000 / 60) % 60);
		let calculateSeconds = Math.floor((total / 1000) % 60);
		if (
			undefined !== displayUnits &&
			undefined !== displayUnits[0] &&
			undefined !== displayUnits[0].days &&
			!displayUnits[0].days
		) {
			//Do nothing.
			calculateHours = Math.floor(total / (1000 * 60 * 60));
			if (
				undefined !== displayUnits &&
				undefined !== displayUnits[0] &&
				undefined !== displayUnits[0].hours &&
				!displayUnits[0].hours
			) {
				//Do nothing.
				calculateMinutes = Math.floor(total / 1000 / 60);
				if (
					undefined !== displayUnits &&
					undefined !== displayUnits[0] &&
					undefined !== displayUnits[0].minutes &&
					!displayUnits[0].minutes
				) {
					//Do nothing.
					calculateSeconds = Math.floor(total / 1000);
					parts.seconds = calculateSeconds;
				} else {
					parts.minutes = calculateMinutes;
					parts.seconds = calculateSeconds;
				}
			} else {
				parts.hours = calculateHours;
				parts.minutes = calculateMinutes;
				parts.seconds = calculateSeconds;
			}
		} else {
			parts.days = Math.floor(total / (1000 * 60 * 60 * 24));
			parts.hours = calculateHours;
			parts.minutes = calculateMinutes;
			parts.seconds = calculateSeconds;
		}
		const remaining = Object.keys(parts).map((part) => {
			if ('seconds' !== part && enableDividers) {
				return (
					<Fragment>
						<div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}>
							<span className="kb-countdown-number">{calculateNumberDesign(parts[part])}</span>
							<span className="kb-countdown-label">{labels[part]}</span>
						</div>
						<div
							className={`kb-countdown-item kb-countdown-date-item kb-countdown-divider-item kb-countdown-divider-item-${part}`}
						>
							<span className="kb-countdown-number">:</span>
							<span className="kb-countdown-label">&nbsp;</span>
						</div>
					</Fragment>
				);
			}
			return (
				<div className={`kb-countdown-date-item kb-countdown-item kb-countdown-date-item-${part}`}>
					<span className="kb-countdown-number">{calculateNumberDesign(parts[part])}</span>
					<span className="kb-countdown-label">{labels[part]}</span>
				</div>
			);
		});
		return (
			<Fragment>
				{preText}
				{remaining}
				{postText}
			</Fragment>
		);
	};

	const blockProps = useBlockProps({
		className: `kb-countdown-timer kb-countdown-timer-${uniqueID}`,
	});

	const calculateDate = () => {
		const currentDate = new Date();
		const initialDate = new Date(parentBlock[0].attributes.timestamp);
		const stopRepeating = !parentBlock[0].attributes.stopRepeating
			? true
			: new Date(parentBlock[0].attributes.endDate) <= new Date(currentDate)
				? false
				: true;
		if (
			currentDate >= initialDate &&
			parentBlock[0].attributes.repeat &&
			parentBlock[0].attributes.frequency !== '' &&
			stopRepeating
		) {
			const seconds = initialDate.getSeconds();
			const minutes = initialDate.getMinutes();
			const hours = initialDate.getHours();
			let futureDate = new Date();
			const daysPassed = Math.floor((currentDate.getTime() - initialDate.getTime()) / (1000 * 3600 * 24));
			let offsetDays = 0;
			let dayOfMonth = initialDate.getDate();
			const futureDayOfMonth = currentDate.getDate();
			const initialMonth = initialDate.getMonth();
			const futureMonth =
				currentDate.getMonth() === 11
					? 0
					: futureDayOfMonth >= dayOfMonth
						? currentDate.getMonth() + 1
						: currentDate.getMonth();
			let futureYear = currentDate.getMonth() === 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
			const nextMonthDays = new Date(futureYear, futureMonth + 1, 0).getDate();

			switch (parentBlock[0].attributes.frequency) {
				case 'daily':
					// Check if the target time has already passed today
					const todayTargetTime = new Date();
					todayTargetTime.setHours(hours, minutes, seconds, 0);

					if (currentDate.getTime() >= todayTargetTime.getTime()) {
						// Target time has passed today, set for tomorrow
						offsetDays = 1;
					} else {
						// Target time hasn't passed today, set for today
						offsetDays = 0;
					}

					futureDate.setDate(currentDate.getDate() + offsetDays);
					futureDate.setHours(hours);
					futureDate.setMinutes(minutes);
					futureDate.setSeconds(seconds);
					break;
				case 'weekly':
					// Check if the target time has already passed today
					const todayWeeklyTargetTime = new Date();
					todayWeeklyTargetTime.setHours(hours, minutes, seconds, 0);

					// Calculate days since the initial date
					const daysSinceInitial = Math.floor(
						(currentDate.getTime() - initialDate.getTime()) / (1000 * 3600 * 24)
					);

					if (currentDate.getTime() >= todayWeeklyTargetTime.getTime()) {
						// Target time has passed today, find next week's occurrence
						offsetDays = 7 - (daysSinceInitial % 7);
					} else {
						// Target time hasn't passed today, check if today is the right day of week
						const dayOfWeekDiff = (currentDate.getDay() - initialDate.getDay() + 7) % 7;
						if (dayOfWeekDiff === 0) {
							// Today is the right day of week and time hasn't passed
							offsetDays = 0;
						} else {
							// Find next occurrence
							offsetDays = 7 - dayOfWeekDiff;
						}
					}

					futureDate.setDate(currentDate.getDate() + offsetDays);
					futureDate.setHours(hours);
					futureDate.setMinutes(minutes);
					futureDate.setSeconds(seconds);
					break;
				case 'monthly':
					if (dayOfMonth === 31 && nextMonthDays === 30) {
						dayOfMonth = 30;
					} else if (futureMonth === 0 && dayOfMonth >= 29) {
						dayOfMonth = dayOfMonth === 29 ? dayOfMonth : 28;
					}

					futureDate = new Date(futureYear, futureMonth, dayOfMonth, hours, minutes, seconds);
					break;
				case 'yearly':
					const datePassed =
						currentDate.getMonth() <= initialDate.getMonth() &&
						currentDate.getDate() <= initialDate.getDate() &&
						currentDate.getHours() <= hours &&
						currentDate.getMinutes() <= minutes &&
						currentDate.getSeconds() <= seconds;
					futureYear = datePassed ? currentDate.getFullYear() : currentDate.getFullYear() + 1;
					futureDate = new Date(futureYear, initialMonth, dayOfMonth, hours, minutes, seconds);
					break;
				default:
					break;
			}

			return futureDate;
		}

		return new Date(parentBlock[0].attributes.timestamp);
	};

	return (
		<div {...blockProps} id={`kb-timer-${parentID}`}>
			<Countdown date={calculateDate()} renderer={renderer} />
		</div>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlockRootClientId, getBlocksByClientId } = select('core/block-editor');
		const rootID = getBlockRootClientId(clientId);
		const parentBlock = getBlocksByClientId(rootID);
		return {
			parentBlock,
			rootID,
		};
	}),
])(KadenceCoundownTimer);
