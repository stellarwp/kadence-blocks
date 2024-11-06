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
	SelectControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { Ai, Visibility, VisibilityOff } from '../components/icons';
/**
 * Internal dependencies
 */
import { Button, FormSection, TextareaProgress, TextControl } from '../components';
import { LANG_TYPE, PAGE_CONTEXT_GOAL, PAGE_CONTEXT_STATUS, THOUGHT_STARTERS } from '../constants.js';
import { useKadencePageWizardAi } from '../context-provider.js';
import { page } from '@wordpress/icons';

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

export function AboutYourPage() {
	const [indicator, setIndicator] = useState();
	const [progress, setProgress] = useState(0);
	const [backgroundImage, setBackgroundImage] = useState(0);
	const [showTooltip, setShowTooltip] = useState(false);
	const [aiSuggestion, setAiSuggestion] = useState('');
	const [currentLanguageType, setCurrentLanguageType] = useState('');
	const { state, dispatch } = useKadencePageWizardAi();
	const { pageContext, pageTitle, lang } = state;
	const title = __('Tell us about the page you want to build', 'kadence-blocks');
	const langObject = LANG_TYPE.filter((option) => option.value === (lang ? lang : 'en-US'));
	const language = sprintf(
		// translators: %s: language
		__('This should be written in %s.', 'kadence-blocks'),
		langObject?.[0]?.label ? langObject[0].label : 'your site language'
	);
	const content = __('Craft a brief description that explains what your page is about.', 'kadence-blocks');
	useEffect(() => {
		const tempProgress = Math.round((pageContext.length / 400) * 100);
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
	}, [pageContext]);
	useEffect(() => {
		const langObject = LANG_TYPE.filter((option) => option.value === lang);
		if (langObject.length) {
			setCurrentLanguageType(langObject[0]);
		} else {
			const english = LANG_TYPE.filter((option) => option.value === 'en-US');
			if (english.length) {
				setCurrentLanguageType(english[0]);
			}
		}
	}, [lang]);
	function handleLangChange(langType) {
		dispatch({ type: 'SET_LANG', payload: langType.value });
	}
	return (
		<Flex gap={0} align="normal" style={styles.container}>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex justify="center" style={styles.leftContent}>
					<FlexBlock style={styles.formWrapper} className={'stellarwp-body'}>
						{/* <FormSection
							headline={
								<span className="has-beta-pill">{__("Your Sites's Language", 'kadence-blocks')} </span>
							}
							content={__(
								'Select your preferred language for AI-generated content on your site. Note: AI content quality varies by language due to available training data; English is best supported.',
								'kadence-blocks'
							)}
						>
							<VStack spacing={4} style={{ margin: '0 auto 30px' }}>
								<SelectControl
									label={''}
									value={currentLanguageType}
									onChange={handleLangChange}
									options={LANG_TYPE}
								/>
							</VStack>
						</FormSection> */}
						<FormSection
							headline={title}
							content={lang && lang !== 'en-US' ? language + ' ' + content : content}
						>
							<VStack spacing={4} style={{ margin: '0 auto 30px' }}>
								<TextControl
									label={__('Page Title', 'kadence-blocks')}
									autoFocus
									placeholder={__('My New Page', 'kadence-blocks')}
									value={pageTitle}
									onChange={(value) => {
										dispatch({ type: 'SET_PAGE_TITLE', payload: value });
									}}
								/>
							</VStack>
							<View style={styles.textareaWrapper}>
								<label htmlFor="pageContext">{__('Page Context', 'kadence-blocks')}</label>
								<TextareaProgress
									label={''}
									placeholder={__('My new page is about…', 'kadence-blocks')}
									value={pageContext}
									onChange={(value) => {
										dispatch({ type: 'SET_PAGE_CONTEXT', payload: value });
									}}
									progressBarProps={{
										value: progress >= 100 ? 100 : progress,
										color: PAGE_CONTEXT_STATUS?.[indicator]?.color
											? PAGE_CONTEXT_STATUS[indicator].color
											: 'red',
										message: PAGE_CONTEXT_STATUS?.[indicator]?.message
											? PAGE_CONTEXT_STATUS[indicator].message
											: '',
									}}
								/>
								{showTooltip && (
									<VStack style={styles.tooltip}>
										<Text style={styles.tooltip.title}>
											{__('Thought Starters', 'kadence-blocks')}
										</Text>

										{THOUGHT_STARTERS.length > 0 && (
											<ul style={styles.tooltip.content}>
												{THOUGHT_STARTERS.map((thoughtStarter) => (
													<li key={thoughtStarter}>{thoughtStarter}</li>
												))}
											</ul>
										)}
									</VStack>
								)}
							</View>
							<Flex justify="space-between">
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
						</FormSection>
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}
