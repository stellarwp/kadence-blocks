/**
 * WordPress dependencies
 */
import {
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalVStack as VStack,
	__experimentalDivider as Divider
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	CheckboxControl,
	ChipsInput,
	SelectControl,
	Slider,
	TextareaControl
} from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { CONTENT_TONE } from '../constants';

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
}

export function AboutYourSite() {
	const {state, dispatch} = useKadenceAi();
	const maxTags = 5;
	const {
		missionStatement,
		keywords,
		tone,
		privacyAgreement
	} = state;

	return (
		<Flex gap={ 0 } align="normal" style={ styles.container }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<VStack spacing={ 6 } style={{ margin: '0 auto' }}>
							<TextareaControl
								label={ __('Your Mission Statement', 'kadence') }
								placeholder="..."
								value={ missionStatement }
								onChange={ (value) => dispatch({ type: 'SET_MISSION_STATEMENT', payload: value }) }
							/>
							<ChipsInput
								id="2"
								label={ __('Keywords', 'kadence') }
								placeholder="..."
								tags={ keywords }
								maxTags={ maxTags }
								selectedTags={ (selectedTags) => dispatch({ type: 'SET_KEYWORDS', payload: selectedTags }) }
								help={
									<Flex>
										<FlexBlock>Help text about this input.</FlexBlock>
										<FlexItem>{ `${ keywords.length }/${ maxTags }`}</FlexItem>
									</Flex>
								}
							/>
						 	<SelectControl
								label={ __('Tone', 'kadence') }
								value={ tone }
								onChange={ (value) => dispatch({ type: 'SET_TONE', payload: value }) }
								options={ [
									...[{
										value: '',
										label: 'Category...',
										disabled: true
									}],
									...CONTENT_TONE
								] }
							/>
							<Divider style={ { borderBottomColor: '#DFDFDF', marginBottom: 10 } } />
							<CheckboxControl
								label={ __('Creating an account means you\'re okay with our Terms of Service and Privacy Policy.', 'kadence') }
								checked={ privacyAgreement }
								onChange={ () => dispatch({ type: 'SET_PRIVACY_AGREEMENT' }) }
							/>
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

