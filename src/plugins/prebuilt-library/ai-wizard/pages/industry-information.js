/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	Flex,
	FlexBlock,
	__experimentalVStack as VStack
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';
import { SelectControl, Slider, TextControl } from '../components';
import { SelectControlRefresh } from '../components/select-control/refresh';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { verticalsHelper } from '../utils/verticals-helper';
import { ENTITY_TYPE, ENTITY_TO_NAME } from '../constants';

const styles = {
	container: {
		flexGrow: 1,
	},
	leftContent: {
		maxWidth: 640,
		marginLeft: 'auto'
	},
	formWrapper: {
		maxWidth: 380,
		paddingRight: 32,
		paddingLeft: 32,
	},
	rightContent: {
		backgroundColor: '#000000',
	},
	inputError: {
 		fontSize: 11,
 		color: 'red' 
	}
}
	

export function IndustryInformation() {
	const [ verticals, setVerticals ] = useState([]);
	const [ industries, setIndustries ] = useState([{
		value: '',
		label: '...',
		disabled: true
	}]);
	const [ verticalsError, setVerticalsError ] = useState(false);
	const [ industriesSpecific, setIndustriesSpecific ] = useState([]);
	const { loading, getVerticals } = verticalsHelper();
	const { state, dispatch } = useKadenceAi();
	const {
		companyName,
		entityType,
		location,
		industry,
		industrySpecific,
		industryOther
	} = state;

	useEffect(() => {
		setVerticalsData();
	}, []);

	useEffect(() => {
		if (! verticalsError) {
			return;
		}

		if (industry) {
			setIndustries([{
				label: industry,
				value: industry,
				disabled: true
			}]);
		}

		if (industrySpecific) {
			setIndustriesSpecific([{
				label: industrySpecific,
				value: industrySpecific,
				disabled: true
			}]);
		}
	}, [ verticalsError ])

	useEffect(() => {
		const industriesSpecificOptions = (verticals && industry && verticals?.[industry]) ? verticals[industry].map((subIndustry) => ({
			label: subIndustry,
			value: subIndustry
		})) : [];

		setIndustriesSpecific(
			formatSelectControlOptions(industriesSpecificOptions, __('Subindustry...', 'kadence-blocks'))
		);
	}, [ verticals, industry ])

	useEffect(() => {

	}, [ entityType ])

	async function setVerticalsData() {
		let verticalsData = SafeParseJSON(await getVerticals(), false);

		// If data is not what we're expecting, set error.
		if (! verticalsData) {
			console.log('1. Verticals Error Set');
			setVerticalsError(true);
			return;
		}

		const industriesOptions = verticalsData ? Object.keys(verticalsData).map((industry) => ({
			label: industry,
			value: industry
		})) : []

		setVerticalsError(false);
		setIndustries(formatSelectControlOptions(industriesOptions));
		setVerticals(verticalsData);
	}

	function formatSelectControlOptions(data, placeholderLabel = __('Industry...', 'kadence-blocks')) {
		if (! data || ! Array.isArray(data)) {
			return [];
		}

		return [
			{
				value: '',
				label: placeholderLabel,
				disabled: true
			},
			...data,
			{
				label: __('Other', 'kadence-blocks'),
				value: 'Other'
			}
		]
	}

	function handleIndustryChange(value) {
		dispatch({ type: 'SET_INDUSTRY', payload: value });
		// Reset specific industry select on industry change.
		dispatch({ type: 'SET_INDUSTRY_SPECIFIC', payload: '' });
	}

	function handleIndustrySpecificChange(value) {
		dispatch({ type: 'SET_INDUSTRY_SPECIFIC', payload: value });
	}

	function handleEntityTypeChange(value) {
		dispatch({ type: 'SET_ENTITY_TYPE', payload: value });
	}

	function getErrorMessage() {
		return (
			<span style={ styles.inputError }>
				{ __('We couldn\'t load other options, please ', 'kadence-blocks') }
				<Button style={ styles.inputError } variant="link" onClick={ setVerticalsData }>{ __('refresh', 'kadence-blocks') }</Button>
			</span>
		)
	}

	return (
		<Flex gap={ 0 } align="normal" style={ styles.container }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
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
							<TextControl
								label="Location"
								placeholder="..."
								value={ location }
								onChange={ (value) => dispatch({ type: 'SET_LOCATION', payload: value }) }
							/>
						 	<SelectControl
								label={ __('What Industry are you in?', 'kadence-blocks') }
								value={ industry }
								onChange={ handleIndustryChange }
								disabled={ verticalsError || loading }
								options={ industries }
								suffix={ (verticalsError || loading) ? <SelectControlRefresh loading={ loading }  onClick={ setVerticalsData } /> : null }
								error={ verticalsError }
								help={ verticalsError ? getErrorMessage() : null }
							/>
							{ (industry && industry !== 'Other') && (
						 		<SelectControl
									label={ __('Can you be more specific?', 'kadence-blocks') }
									value={ industrySpecific }
									onChange={ handleIndustrySpecificChange }
									disabled={ loading || verticalsError }
									options={ industriesSpecific }
								/>
							) }
							{ (industry === 'Other' || industrySpecific === 'Other') && (
								<TextControl
									label={ __('Your Industry', 'kadence-blocks') }
									placeholder="..."
									autoFocus
									value={ industryOther }
									onChange={ (value) => dispatch({ type: 'SET_INDUSTRY_OTHER', payload: value }) }
								/>
							) }
						</VStack>
					</FlexBlock>
			</Flex>
			</FlexBlock>
			<FlexBlock display="flex" style={ styles.rightContent }>
				<Flex justify="center" align="center">
					<FlexBlock>
						<Slider />
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}

