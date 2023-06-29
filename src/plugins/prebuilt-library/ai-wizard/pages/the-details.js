/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import {
	Flex,
	FlexBlock,
	FlexItem,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ChipsInput,
	FormSection,
	SelectControl,
	Slider
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
		maxWidth: 504,
		paddingRight: 32,
		paddingLeft: 32,
	},
	rightContent: {
		backgroundColor: '#000000',
	},
	keywordsLength: {
		'good': 'green',
		'poor': 'red',
	}
}

export function TheDetails() {
	const { state, dispatch } = useKadenceAi();
	const maxTags = 10;
	const {
		keywords,
		tone
	} = state;

	const [ keywordsLengthError, setKeywordsLengthError ] = useState( null );

	useEffect(() => {
		if ( keywords.length > 0 && keywords.length < 5 ) {
			setKeywordsLengthError( 'poor' );
		} else if ( keywords.length >= 5 ) {
			setKeywordsLengthError( 'good' );
		}
	}, [ keywords ])

	function getKeywordsLengthStyle() {
		if ( keywordsLengthError && styles.keywordsLength.hasOwnProperty( keywordsLengthError ) ) {
			return styles.keywordsLength[ keywordsLengthError ];
		}

		return 'inherit';
	}

	return (
		<Flex gap={ 0 } align="normal" style={ styles.container }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<VStack spacing={ 6 } style={{ margin: '0 auto' }}>
						  <FormSection
						    headline={ __( 'Add come keywords', 'kadence-blocks' ) }
						    content={ __( 'Keywords assist the AI in identifying the most relevant topics to write about.', 'kadence-blocks' ) }
						  >
							  <ChipsInput
								  id="2"
								  label={ __('Keywords', 'kadence-blocks') }
								  hideLabelFromVision
								  placeholder={ __('Add Keyword', 'kadence-blocks') }
								  tags={ keywords }
								  maxTags={ maxTags }
								  selectedTags={ (selectedTags) => dispatch({ type: 'SET_KEYWORDS', payload: selectedTags }) }
								  help={
									  <>
										  <Flex>{ __('Separate with commas or the Enter key.', 'kadence-blocks') }</Flex>
										  <Flex>
											  <FlexBlock>{ __('Enter between 5 and 10 keywords', 'kadence-blocks') }</FlexBlock>
											  <FlexItem style={ { color: getKeywordsLengthStyle() } }>
												  { `${ keywords.length }/${ maxTags }` }
											  </FlexItem>
										  </Flex>
									  </>
								  }
							  />
						  </FormSection>
						  <FormSection
						    headline={ __( 'Choose your tone', 'kadence-blocks' ) }
						    content={ __( 'The tone allows the AI to reflect your personality in its communication style. Select a tone that closely aligns with your own.', 'kadence-blocks' ) }
						  >
						 	  <SelectControl
								  label={ __('Tone', 'kadence-blocks') }
								  hideLabelFromVision
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
						  </FormSection>
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

