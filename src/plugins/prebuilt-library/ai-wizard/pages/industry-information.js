/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Flex, FlexBlock, __experimentalVStack as VStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Autocomplete, FormSection, SelectControl, Slider, TextControl, LocationSelectControl } from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import {
	ENTITY_TYPE,
	LANG_TYPE,
	ENTITY_TO_NAME,
	LOCATION_TYPES,
	LOCATION_BUSINESS_ADDRESS,
	LOCATION_SERVICE_AREA,
	LOCATION_ONLINE_ONLY,
	INDUSTRY_BACKGROUNDS,
} from '../constants';
import { Education4All, HealingTouch, Prospera, SpencerSharp } from './slides/industry-information';

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
	inputError: {
		fontSize: 11,
		color: 'red',
	},
};

const headline = __('Your Information', 'kadence-blocks');
const content = __(
	'Please provide detailed information about yourself, your company, or your organization to enhance the quality of our results.',
	'kadence-blocks'
);

export function IndustryInformation() {
	const [currentEntityType, setCurrentEntityType] = useState(null);
	const [currentLanguageType, setCurrentLanguageType] = useState('');
	const [backgroundImage, setBackgroundImage] = useState(0);
	const { state, dispatch } = useKadenceAi();
	const { companyName, entityType, locationInput, lang, locationType, industry } = state;

	useEffect(() => {
		const entityObject = ENTITY_TYPE.filter((option) => option.value === entityType);
		if (entityObject.length) {
			setCurrentEntityType(entityObject[0]);
		}
	}, [entityType]);
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
	useEffect(() => {
		switch (locationType) {
			case LOCATION_BUSINESS_ADDRESS:
				dispatch({
					type: 'SET_LOCATION',
					payload: `${LOCATION_BUSINESS_ADDRESS}: ${locationInput}`,
				});
				return;
			case LOCATION_SERVICE_AREA:
				dispatch({
					type: 'SET_LOCATION',
					payload: `${LOCATION_SERVICE_AREA}: ${locationInput}`,
				});
		}
	}, [locationInput, locationType]);

	function handleIndustryChange(industry) {
		if (industry && industry.length > 75) {
			industry = industry.substring(0, 75);
		}
		dispatch({ type: 'SET_INDUSTRY', payload: industry });
	}
	function handleLangChange(langType) {
		dispatch({ type: 'SET_LANG', payload: langType.value });
	}
	function handleEntityTypeChange(entityType) {
		dispatch({ type: 'SET_ENTITY_TYPE', payload: entityType.value });
	}

	function handleLocationTypeChange(value) {
		if (value === LOCATION_ONLINE_ONLY) {
			dispatch({ type: 'SET_LOCATION', payload: LOCATION_ONLINE_ONLY });
			dispatch({ type: 'SET_LOCATION_TYPE', payload: LOCATION_ONLINE_ONLY });
		}

		dispatch({ type: 'SET_LOCATION_TYPE', payload: value });
	}

	function getNameInputText(property) {
		if (entityType && ENTITY_TO_NAME?.[entityType]?.[property]) {
			return ENTITY_TO_NAME[entityType][property];
		}

		return '...';
	}

	function getLocationPlaceholderText() {
		if (locationType !== LOCATION_ONLINE_ONLY) {
			const currentLocation = LOCATION_TYPES.filter((location) => location.value === locationType);

			return currentLocation.length && currentLocation[0]?.placeholder ? currentLocation[0].placeholder : '...';
		}

		return '...';
	}

	function getLocationHelpText() {
		if (locationType !== LOCATION_ONLINE_ONLY) {
			const currentLocation = LOCATION_TYPES.filter((location) => location.value === locationType);

			return currentLocation.length && currentLocation[0]?.help ? currentLocation[0].help : '';
		}

		return '';
	}

	return (
		<Flex gap={0} align="normal" style={styles.container}>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex justify="center" style={styles.leftContent}>
					<FlexBlock style={styles.formWrapper} className={'stellarwp-body'}>
						<FormSection
							headline={
								<span className="has-beta-pill">
									{__("Your Sites's Language", 'kadence-blocks')}{' '}
									<span className="beta-pill">Beta</span>
								</span>
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
						</FormSection>
						<FormSection headline={headline} content={content}>
							<VStack spacing={4} style={{ margin: '0 auto' }}>
								<SelectControl
									label={__('I am', 'kadence-blocks')}
									value={currentEntityType}
									onChange={handleEntityTypeChange}
									options={ENTITY_TYPE}
								/>
								<TextControl
									label={getNameInputText('label')}
									autoFocus
									placeholder={getNameInputText('placeholder')}
									value={companyName}
									onChange={(value) => {
										// Prevent a super long string.
										if (value && value.length > 75) {
											value = value.substring(0, 75);
										}
										dispatch({ type: 'SET_COMPANY_NAME', payload: value });
									}}
								/>
								<LocationSelectControl
									label={__('Where are you based?', 'kadence-blocks')}
									locations={LOCATION_TYPES}
									selected={locationType}
									onChange={handleLocationTypeChange}
								/>
								{locationType && locationType !== LOCATION_ONLINE_ONLY ? (
									<TextControl
										label="Location"
										placeholder={getLocationPlaceholderText()}
										value={locationInput}
										onChange={(value) => {
											if (value && value.length > 140) {
												value = value.substring(0, 140);
											}
											dispatch({ type: 'SET_LOCATION_INPUT', payload: value });
										}}
										help={getLocationHelpText()}
									/>
								) : null}
								<Autocomplete
									label={__('What Industry are you in?', 'kadence-blocks')}
									placeholder={__('Find your industry', 'kadence-blocks')}
									detachedMediaQuery="none"
									onSelect={handleIndustryChange}
									currentValue={industry ? industry : ''}
									initialState={{
										isOpen: false,
										query: industry ? industry : '',
										params: {
											hitsPerPage: 8,
											highlightPreTag: '<mark>',
											highlightPostTag: '</mark>',
										},
									}}
								/>
							</VStack>
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
