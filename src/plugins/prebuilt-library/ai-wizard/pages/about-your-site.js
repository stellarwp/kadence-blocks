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
	const { state, dispatch } = useKadenceAi();
	const maxTags = 10;
	const {
		missionStatement,
		keywords,
		tone
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
								label={ __('About Me/My Organization/My Project', 'kadence-blocks') }
								placeholder="..."
								value={ missionStatement }
								onChange={ (value) => dispatch({ type: 'SET_MISSION_STATEMENT', payload: value }) }
							/>
							<ChipsInput
								id="2"
								label={ __('Keywords', 'kadence-blocks') }
								placeholder="..."
								tags={ keywords }
								maxTags={ maxTags }
								selectedTags={ (selectedTags) => dispatch({ type: 'SET_KEYWORDS', payload: selectedTags }) }
								help={
									<>
										<Flex>{ __('Separate with commas or the Enter key.', 'kadence-blocks') }</Flex>
										<Flex>
											<FlexBlock>{ __('Enter between 5 and 10 keywords', 'kadence-blocks') }</FlexBlock>
											<FlexItem>{ `${ keywords.length }/${ maxTags }`}</FlexItem>
										</Flex>
									</>
								}
							/>
						 	<SelectControl
								label={ __('Tone', 'kadence-blocks') }
								value={ tone }
								onChange={ (value) => dispatch({ type: 'SET_TONE', payload: value }) }
								options={ [
									...[{
										value: '',
										label: __('Select...', 'kadence-blocks'),
										disabled: true
									}],
									...CONTENT_TONE
								] }
							/>
							<Divider style={ { borderBottomColor: '#DFDFDF', marginBottom: 10 } } />
							<p>
								{
									__( 'Our content is generated using a custom integration with OpenAI. Please double-check everything before publishing to avoid any unintended language. Happy creating!', 'kadence-blocks' )
								}
							</p>
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

