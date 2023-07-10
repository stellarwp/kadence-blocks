/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import {
	Flex,
	FlexBlock,
	Icon,
	__experimentalVStack as VStack
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	FormSection,
	CreatableControl,
	SelectControl,
	Slider,
	TextControl,
	LocationSelectControl
} from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { useSelectPlacement } from '../hooks/use-select-placement';
import {
	ENTITY_TYPE,
	ENTITY_TO_NAME,
	LOCATION_TYPES,
	LOCATION_BUSINESS_ADDRESS,
	LOCATION_SERVICE_AREA,
	LOCATION_ONLINE_ONLY,
	INDUSTRY_BACKGROUNDS
} from '../constants';
import INDUSTRIES from '../constants/industries';
import {
	Education4All,
	HealingTouch,
	Prospera,
	SpencerSharp
} from './slides/industry-information';

const styles = {
	container: {
		flexGrow: 1,
	},
	leftContent: {
		maxWidth: 640,
		marginLeft: 'auto'
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
 		color: 'red' 
	}
}

const headline = __( 'Your Information', 'kadence-blocks' );
const content = __( 'Please provide detailed information about yourself, your company, or your organization to enhance the quality of our results.', 'kadence-blocks' );	

export function IndustryInformation() {
	const [ industries, setIndustries ] = useState([{
		value: '',
		label: '...',
		disabled: true
	}]);
	const [ pageRef, setPageRef ] = useState( null );
	const [ controlRef, setControlRef ] = useState( null );
	const [ currentIndustry, setCurrentIndustry ] = useState( null );
	const [ backgroundImage, setBackgroundImage ] = useState( 0 );
	const { menuHeight, menuPlacement } = useSelectPlacement(pageRef, controlRef);
	const { state, dispatch } = useKadenceAi();
	const {
		companyName,
		entityType,
		locationInput,
		locationType,
		industry
	} = state;

	useEffect(() => {
		setIndustries( INDUSTRIES.map((industry) => ({
			label: industry,
			value: industry
		})) );
	}, []);

	useEffect(() => {
		if (industry) {
			setCurrentIndustry({
				label: industry,
				value: industry
			});
		}
	}, [ industry ])
	
	useEffect(() => {
		switch (locationType) {
			case LOCATION_BUSINESS_ADDRESS:
				dispatch({ type: 'SET_LOCATION', payload: `${ LOCATION_BUSINESS_ADDRESS }: ${ locationInput }` });
				return;
			case LOCATION_SERVICE_AREA:
				dispatch({ type: 'SET_LOCATION', payload: `${ LOCATION_SERVICE_AREA }: ${ locationInput }` });
				return;
		}
	}, [ locationInput, locationType ])

	function handleIndustryChange(industry) {
		dispatch({ type: 'SET_INDUSTRY', payload: industry.value });
	}

	function handleEntityTypeChange(value) {
		dispatch({ type: 'SET_ENTITY_TYPE', payload: value });
	}

	function handleLocationTypeChange(value) {
		if (value === LOCATION_ONLINE_ONLY) {
 			dispatch({ type: 'SET_LOCATION', payload: LOCATION_ONLINE_ONLY });
 			dispatch({ type: 'SET_LOCATION_TYPE', payload: LOCATION_ONLINE_ONLY });
		}

		dispatch({ type: 'SET_LOCATION_TYPE', payload: value });
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
		<Flex gap={ 0 } align="normal" style={ styles.container } ref={ setPageRef }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<FormSection
							headline={ headline }
							content={ content }
						>
							<VStack spacing={ 4 } style={{ margin: '0 auto' }}>
						 		<SelectControl
									label={ __('I am', 'kadence-blocks') }
									value={ entityType }
									onChange={ handleEntityTypeChange }
									options={ ENTITY_TYPE }
								/>
								<TextControl
									label={ entityType && ENTITY_TO_NAME.hasOwnProperty(entityType) ? ENTITY_TO_NAME[ entityType ] : ENTITY_TO_NAME.COMPANY }
									autoFocus
									placeholder="..."
									value={ companyName }
									onChange={ (value) => dispatch({ type: 'SET_COMPANY_NAME', payload: value }) }
								/>
						 		<LocationSelectControl
						 			label={ __('Where are you based?', 'kadence-blocks') }
						 			locations={ LOCATION_TYPES }
						 			selected={ locationType }
						 			onChange={ handleLocationTypeChange }
						 		/>
						 		{ locationType && locationType !== LOCATION_ONLINE_ONLY ? (
									<TextControl
										label="Location"
										placeholder={ getLocationPlaceholderText() }
										value={ locationInput }
										onChange={ (value) => dispatch({ type: 'SET_LOCATION_INPUT', payload: value }) }
										help={ getLocationHelpText() }
									/>
						 		) : null }
								<CreatableControl
									ref={ setControlRef }
									menuPlacement={ menuPlacement }
									maxMenuHeight={ menuHeight }
									label={ __('What Industry are you in?', 'kadence-blocks') }
									value={ currentIndustry }
									options={ industries }
									prefix={ <Icon icon={ search } /> }
									onChange={ handleIndustryChange }
								/>
							</VStack>
						</FormSection>
					</FlexBlock>
			</Flex>
			</FlexBlock>
			<FlexBlock display="flex">
				<Flex justify="center">
					<FlexBlock style={ styles.rightContent }>
						<Slider
							backgroundImage={ INDUSTRY_BACKGROUNDS[ backgroundImage ] }
							text={ __('Not sure where to start? Here\'s some real life examples!', 'kadence-blocks') }
							doBeforeSlide={ (data) => setBackgroundImage( data.nextSlide ) }
							slides={[
								<HealingTouch />,
								<SpencerSharp />,
								<Prospera />,
								<Education4All />
							]}
						/>
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}

