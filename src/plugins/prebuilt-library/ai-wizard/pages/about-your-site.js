/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import {
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalView as View,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { missionStatementHelper } from '../utils/mission-statement-helper';
import { convertStreamDataToJson } from '../utils/convert-stream-data-to-json';
import { Ai, Visibility, VisibilityOff } from '../components/icons';

/**
 * Internal dependencies
 */
import { Button, FormSection, Slider, TextareaProgress } from '../components';
import { Education4All, HealingTouch, Prospera, SpencerSharp } from './slides/about-your-site';
import {
	LANG_TYPE,
	THOUGHT_STARTERS,
	ENTITY_TYPE_INDIVIDUAL,
	MISSION_STATEMENT_STATUS,
	MISSION_STATEMENT_GOAL,
	INDUSTRY_BACKGROUNDS,
} from '../constants';
import { useKadenceAi } from '../context/kadence-ai-provider';

const styles = {
	container: {
		height: '100%',
	},
	leftContent: {
		maxWidth: 640,
		marginInline: 'auto',
	},
	rightContent: {
		marginRight: 32,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	formWrapper: {
		maxWidth: 504,
		paddingRight: 32,
		paddingLeft: 32,
	},
	textareaWrapper: {
		position: 'relative',
	},
	tooltip: {
		position: 'absolute',
		top: 16,
		left: '100%',
		borderRadius: '0px 4px 4px 0px',
		padding: 12,
		backgroundColor: '#FAFAFA',
		width: 200,
		zIndex: 1,

		title: {
			fontSize: 12,
			fontWeight: 600,
		},

		content: {
			fontSize: 11,
			lineHeight: '14px',
			letterSpacing: -0.2,
			listStyle: 'disc',
			paddingLeft: 14,
		},
	},
};

const content = __(
	'Craft a brief description that explains who you are, your primary attributes and highlight what differentiates you.',
	'kadence-blocks'
);
const titlePartial = {
	COMPANY: ` ${__('business', 'kadence-blocks')}`,
	INDIVIDUAL: __('self', 'kadence-blocks'),
	ORGANIZATION: ` ${__('organization', 'kadence-blocks')}`,
};

export function AboutYourSite() {
	const [indicator, setIndicator] = useState();
	const [progress, setProgress] = useState(0);
	const [backgroundImage, setBackgroundImage] = useState(0);
	const [showTooltip, setShowTooltip] = useState(false);
	const [aiSuggestion, setAiSuggestion] = useState('');
	const [aiLoading, setAiLoading] = useState(false);
	const [error, setError] = useState('');
	const { state, dispatch } = useKadenceAi();
	const { missionStatement, entityType, lang, companyName } = state;
	const title = sprintf(
		// translators: %s: entity type
		__('Tell us about your %s', 'kadence-blocks'),
		titlePartial[entityType]
	);
	const langObject = LANG_TYPE.filter((option) => option.value === (lang ? lang : 'en-US'));
	const language = sprintf(
		// translators: %s: language
		__('This should be written in %s.', 'kadence-blocks'),
		langObject?.[0]?.label ? langObject[0].label : 'your site language'
	);
	const { getMissionStatement } = missionStatementHelper();

	useEffect(() => {
		const tempProgress = Math.round((missionStatement.length / MISSION_STATEMENT_GOAL) * 100);
		// console.log("lendth", missionStatement.length);
		if (tempProgress == 0) {
			setIndicator('initial');
		}
		if (tempProgress < 50 && tempProgress > 0) {
			setIndicator('weak');
		}
		if (tempProgress >= 50 && tempProgress < 100) {
			setIndicator('medium');
		}
		if (tempProgress >= 100 && tempProgress < 200) {
			setIndicator('strong');
		}
		if (tempProgress >= 200 && tempProgress < 400) {
			setIndicator('enough');
		}
		if (tempProgress >= 400 && tempProgress < 500) {
			setIndicator('less');
		}
		if (tempProgress >= 500) {
			setIndicator('muchLess');
		}

		setProgress(tempProgress);
	}, [missionStatement]);

	function getPlaceholderText() {
		if (entityType === ENTITY_TYPE_INDIVIDUAL) {
			return sprintf(
				// translators: %s: company or individual name
				__('I am %s, a…', 'kadence-blocks'),
				companyName
			);
		}
		return sprintf(
			// translators: %s: company or individual name
			__('%s is a…', 'kadence-blocks'),
			companyName
		);
	}

	function handleMissionStatement(value) {
		setAiLoading(true);
		setError('');

		getMissionStatement(value, lang)
			.then((readableStream) => {
				const reader = readableStream.getReader();

				reader.read().then(function processText({ done, value }) {
					if (done) {
						setAiLoading(false);
						return;
					}

					const eventData = convertStreamDataToJson(value);

					if (eventData?.content) {
						setAiSuggestion((previousValue) => {
							return previousValue + eventData.content;
						});
					}

					return reader.read().then(processText);
				});
				setAiLoading(false);
			})
			.catch((error) => {
				if (error === 'license') {
					setError('license');
				} else {
					setError('error');
				}
				console.log(error);
				setAiLoading(false);
			});
	}

	return (
		<Flex gap={0} align="normal" style={styles.container}>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex justify="center" style={styles.leftContent}>
					<FlexBlock style={styles.formWrapper} className={'stellarwp-body'}>
						<FormSection
							headline={title}
							content={lang && lang !== 'en-US' ? language + ' ' + content : content}
						>
							<View style={styles.textareaWrapper}>
								<TextareaProgress
									hideLabelFromVision
									label={title}
									placeholder={getPlaceholderText()}
									value={missionStatement}
									onChange={(value) => {
										dispatch({ type: 'SET_MISSION_STATEMENT', payload: value });
										// Make sure search query is empty so it forces a recheck.
										dispatch({ type: 'SET_IMAGE_SEARCH_QUERY', payload: '' });
									}}
									progressBarProps={{
										value: progress >= 100 ? 100 : progress,
										color: MISSION_STATEMENT_STATUS?.[indicator]?.color
											? MISSION_STATEMENT_STATUS[indicator].color
											: 'red',
										message: MISSION_STATEMENT_STATUS?.[indicator]?.message
											? MISSION_STATEMENT_STATUS[indicator].message
											: '',
									}}
									disabled={aiSuggestion}
									aiLoading={aiLoading}
									aiSuggestion={aiSuggestion}
									onUndo={() => setAiSuggestion('')}
									onAccept={() => {
										dispatch({
											type: 'SET_MISSION_STATEMENT',
											payload: aiSuggestion,
										});
										setAiSuggestion('');
									}}
								/>
								{showTooltip && (
									<VStack style={styles.tooltip}>
										<Text style={styles.tooltip.title}>
											{__('Thought Starters', 'kadence-blocks')}
										</Text>

										{THOUGHT_STARTERS[entityType].length > 0 && (
											<ul style={styles.tooltip.content}>
												{THOUGHT_STARTERS[entityType].map((thoughtStarter) => (
													<li key={thoughtStarter}>{thoughtStarter}</li>
												))}
											</ul>
										)}
									</VStack>
								)}
							</View>
							{!aiSuggestion && !aiLoading && (
								<>
									{error && (
										<div className="stellarwp-ai-error-text">
											<div className={'stellarwp-ai-error-content'}>
												{error === 'license'
													? __('Error, license key invalid.')
													: __('Error, AI improve failed, please try again.')}
											</div>
										</div>
									)}
									<Flex justify="space-between">
										<FlexItem>
											{progress >= 100 && progress < 400 && (
												<Button
													className="stellarwp-ai-improve-button"
													icon={Ai}
													onClick={() => handleMissionStatement(missionStatement)}
												>
													{__('Improve with AI', 'kadence-blocks')}
												</Button>
											)}
										</FlexItem>
										<FlexItem>
											<Button
												size="small"
												className="stellarwp-show-tips-button"
												icon={showTooltip ? VisibilityOff : Visibility}
												iconPosition="right"
												onClick={() => setShowTooltip((showTooltip) => !showTooltip)}
											>
												{showTooltip
													? __('Hide Tips', 'kadence-blocks')
													: __('Show Tips', 'kadence-blocks')}
											</Button>
										</FlexItem>
									</Flex>
								</>
							)}
						</FormSection>
					</FlexBlock>
				</Flex>
			</FlexBlock>
			<FlexBlock display="flex">
				<Flex justify="center">
					<FlexBlock style={styles.rightContent}>
						<Slider
							backgroundImage={INDUSTRY_BACKGROUNDS[backgroundImage]}
							text={__("Not sure where to start? Here's some real life examples!", 'kadence-blocks')}
							doBeforeSlide={(data) => setBackgroundImage(data.nextSlide)}
							slides={[<HealingTouch />, <SpencerSharp />, <Prospera />, <Education4All />]}
						/>
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}
