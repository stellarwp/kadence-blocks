/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import {
	Flex,
	FlexBlock,
	__experimentalVStack as VStack
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectControl, Slider, TextControl } from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { verticalsHelper } from '../utils/verticals-helper';

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
	}
}
	

export function IndustryInformation() {
	const [ verticals, setVerticals ] = useState([]);
	const [ industries, setIndustries ] = useState([]);
	const [ industriesSpecific, setIndustriesSpecific ] = useState([]);
	const { getVerticals } = verticalsHelper();
	const { state, dispatch } = useKadenceAi();
	const {
		companyName,
		location,
		industry,
		industrySpecific,
		industryOther
	} = state;

	useEffect(() => {
		setVerticalsData();
	}, []);
	
	useEffect(() => {
		const industriesSpecificOptions = (verticals && industry && verticals?.[industry]) ? verticals[industry].map((industry) => ({
			label: industry,
			value: industry
		})) : [];
		
		setIndustriesSpecific(formatSelectControlOptions(industriesSpecificOptions));
	}, [industries, industry]);

	async function setVerticalsData() {
		const verticalsData = await getVerticals();
		const industriesOptions = verticalsData ? Object.keys(verticalsData).map((industry) => ({
			label: industry,
			value: industry
		})) : []

		setIndustries(formatSelectControlOptions(industriesOptions));
		setVerticals(verticalsData);
	}

	function formatSelectControlOptions(data) {
		if (! data || ! Array.isArray(data)) {
			return [];
		}

		return [
			{
				value: '',
				label: 'Category...',
				disabled: true
			},
			...data,
			{
				label: __('Other', 'kadence'),
				value: __('Other', 'kadence')
			}
		]
	}

	function handleIndustryChange(value) {
		dispatch({ type: 'SET_INDUSTRY', payload: value });
		// Reset specific industry select on industry change.
		dispatch({ type: 'SET_INDUSTRY_SPECIFIC', payload: '' });

		// @todo: Remove guard and set photoLibrary to selected category value.
		if (value === 'Other') {
			dispatch({ type: 'SET_PHOTO_LIBRARY', payload: 'Default' })
		}
	}

	function handleIndustrySpecificChange(value) {
		dispatch({ type: 'SET_INDUSTRY_SPECIFIC', payload: value });

		// @todo: Figure out final solution for photoLibrary selection/behavior.
		// If 'Other' use the first sub-category w/in the choosen vertical.
		const librarySelection = value === 'Other' ? verticals[industry][0] : value;
		dispatch({ type: 'SET_PHOTO_LIBRARY', payload: librarySelection })
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
							<TextControl
								label={ __('Company Name', 'kadence') }
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
								label={ __('What Industry are you in?', 'kadence') }
								value={ industry }
								onChange={ handleIndustryChange }
								disabled={ (! industries || industries.length === 0) }
								options={ industries }
							/>
							{ (industry && industry !== 'Other') && (
						 		<SelectControl
									label={ __('Can you be more specific?', 'kadence') }
									value={ industrySpecific }
									onChange={ handleIndustrySpecificChange }
									disabled={ (! industries || industries.length === 0) }
									options={ industriesSpecific }
								/>
							) }
							{ (industry === 'Other' || industrySpecific === 'Other') && (
								<TextControl
									label={ __('Your Industry', 'kadence') }
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

