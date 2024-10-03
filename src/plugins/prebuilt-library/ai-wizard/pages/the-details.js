/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Flex, FlexBlock, FlexItem, __experimentalVStack as VStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ChipsInput, FormSection, SelectControl, Slider } from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { useSelectPlacement } from '../hooks/use-select-placement';
import { CONTENT_TONE, INDUSTRY_BACKGROUNDS, KEYWORD_SUGGESTION_STATES } from '../constants';
import { keywordsHelper } from '../utils/keywords-helper';
const { getSuggestedKeywords } = keywordsHelper();
import { searchQueryHelper } from '../utils/search-query-helper';
const { getImageSearchQuery } = searchQueryHelper();
import { SlideOne, SlideTwo, SlideThree, SlideFour } from './slides/the-details';
import { handle } from '@wordpress/icons';

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
	helperText: {
		fontSize: 12,
	},
	keywordsLength: {
		good: 'green',
		poor: 'red',
	},
};

export function TheDetails() {
	const { state, dispatch } = useKadenceAi();
	const maxTags = 10;
	const {
		companyName,
		entityType,
		industry,
		keywords,
		location,
		missionStatement,
		suggestedKeywords,
		suggestedKeywordsState,
		tone,
		lang,
		imageSearchQuery,
	} = state;
	const [keywordsLengthError, setKeywordsLengthError] = useState(null);
	const [currentTone, setCurrentTone] = useState(null);
	const [pageRef, setPageRef] = useState(null);
	const [controlRef, setControlRef] = useState(null);
	const [initialKeywords, setInitialKeywords] = useState();
	const { menuHeight, menuPlacement } = useSelectPlacement(pageRef, controlRef);

	useEffect(() => {
		if (keywords.length > 0 && keywords.length < 5) {
			setKeywordsLengthError('poor');
		} else if (keywords.length >= 5) {
			setKeywordsLengthError('good');
		}
	}, [keywords]);

	useEffect(() => {
		const toneObject = CONTENT_TONE.filter((option) => option.value === tone);
		if (toneObject.length) {
			setCurrentTone(toneObject[0]);
		}
	}, [tone]);

	useEffect(() => {
		handleFetchSuggestedKeywords();
		if (!imageSearchQuery) {
			handleFetchImageSearchQuery();
		}
	}, []);

	function getKeywordsLengthStyle() {
		if (keywordsLengthError && styles.keywordsLength.hasOwnProperty(keywordsLengthError)) {
			return styles.keywordsLength[keywordsLengthError];
		}

		return 'inherit';
	}
	function handleFetchImageSearchQuery() {
		getImageSearchQuery({
			name: companyName,
			entity_type: entityType,
			industry,
			location,
			description: missionStatement,
		})
			.then((response) => {
				console.log('Image Search AI Terms');
				console.log(response);
				if (response?.query) {
					dispatch({
						type: 'SET_IMAGE_SEARCH_QUERY',
						payload: response.query,
					});
				}
			})
			.catch(() => {
				console.log('error');
			});
	}
	function handleFetchSuggestedKeywords() {
		dispatch({
			type: 'SET_SUGGESTED_KEYWORDS_STATE',
			payload: KEYWORD_SUGGESTION_STATES.loading,
		});
		getSuggestedKeywords({
			name: companyName,
			entity_type: entityType,
			industry,
			location,
			lang,
			description: missionStatement,
		})
			.then((response) => {
				setInitialKeywords(response);
				dispatch({
					type: 'SET_SUGGESTED_KEYWORDS',
					payload: response,
				});
				dispatch({
					type: 'SET_SUGGESTED_KEYWORDS_STATE',
					payload: response?.length ? KEYWORD_SUGGESTION_STATES.success : KEYWORD_SUGGESTION_STATES.notFound,
				});
			})
			.catch(() => {
				dispatch({
					type: 'SET_SUGGESTED_KEYWORDS_STATE',
					payload: KEYWORD_SUGGESTION_STATES.error,
				});
			});
	}
	function handleSuggestedKeywordsRefresh(addedKeyword) {
		const newSuggestedKeywords = suggestedKeywords.filter((keyword) => keyword !== addedKeyword);
		dispatch({
			type: 'SET_SUGGESTED_KEYWORDS',
			payload: newSuggestedKeywords,
		});

		if (newSuggestedKeywords.length === 0) {
			dispatch({
				type: 'SET_SUGGESTED_KEYWORDS_STATE',
				payload: KEYWORD_SUGGESTION_STATES.allAdded,
			});
		}
	}

	function handleDeleteKeyword(keyword) {
		if (initialKeywords?.includes(keyword)) {
			dispatch({
				type: 'SET_SUGGESTED_KEYWORDS',
				payload: [...suggestedKeywords, keyword],
			});
		}
	}

	return (
		<Flex gap={0} align="normal" style={styles.container} ref={setPageRef}>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex justify="center" style={styles.leftContent}>
					<FlexBlock style={styles.formWrapper} className={'stellarwp-body'}>
						<VStack spacing="8" style={{ margin: '0 auto' }}>
							<FormSection
								headline={__('Add some keywords', 'kadence-blocks')}
								content={__(
									'Keywords assist the AI in identifying the most relevant topics to write about.',
									'kadence-blocks'
								)}
							>
								<ChipsInput
									id="2"
									label={__('Keywords', 'kadence-blocks')}
									hideLabelFromVision
									placeholder={__('Add Keyword…', 'kadence-blocks')}
									tags={keywords}
									maxTags={maxTags}
									selectedTags={(selectedTags) =>
										dispatch({ type: 'SET_KEYWORDS', payload: selectedTags })
									}
									suggestedKeywords={suggestedKeywords}
									suggestedKeywordsState={suggestedKeywordsState}
									onSuggestedKeywordAdded={handleSuggestedKeywordsRefresh}
									onTryAgain={handleFetchSuggestedKeywords}
									onTagDeleted={handleDeleteKeyword}
									help={
										<>
											<Flex align="flex-start" as={'span'} style={styles.helperText}>
												<FlexBlock as={'span'}>
													{__(
														'Separate with commas or the Enter key. Enter between 5 and 10 keywords',
														'kadence-blocks'
													)}
												</FlexBlock>
												<FlexItem as={'span'} style={{ color: getKeywordsLengthStyle() }}>
													{`${keywords.length}/${maxTags}`}
												</FlexItem>
											</Flex>
										</>
									}
								/>
							</FormSection>
							<FormSection
								headline={__('Choose your tone', 'kadence-blocks')}
								content={__(
									'The tone allows the AI to reflect your personality in its communication style. Select a tone that closely aligns with your own.',
									'kadence-blocks'
								)}
							>
								<SelectControl
									ref={setControlRef}
									maxMenuHeight={menuHeight}
									menuPlacement={menuPlacement}
									options={CONTENT_TONE}
									value={currentTone}
									onChange={(tone) => dispatch({ type: 'SET_TONE', payload: tone.value })}
								/>
							</FormSection>
						</VStack>
					</FlexBlock>
				</Flex>
			</FlexBlock>
			<FlexBlock display="flex">
				<Flex justify="center">
					<FlexBlock style={styles.rightContent}>
						<Slider
							backgroundImage={INDUSTRY_BACKGROUNDS[0]}
							text={__("Not sure where to start? Here's some real life examples!", 'kadence-blocks')}
							slides={[<SlideOne />, <SlideTwo />, <SlideThree />, <SlideFour />]}
						/>
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}
