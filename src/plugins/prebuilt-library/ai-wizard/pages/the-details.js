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
	Slider,
	ToneSelectControl
} from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import { useSelectPlacement } from '../hooks/use-select-placement';
import { CONTENT_TONE, INDUSTRY_BACKGROUNDS } from '../constants';
import { SlideOne, SlideTwo, SlideThree, SlideFour } from './slides/the-details';

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
	keywordsLength: {
		'good': 'green',
		'poor': 'red',
	}
}

export function TheDetails() {
	const { state, dispatch } = useKadenceAi();
	const maxTags = 10;
	const { keywords, tone } = state;
	const [ keywordsLengthError, setKeywordsLengthError ] = useState( null );
	const [ currentTone, setCurrentTone ] = useState( null );
	const [ pageRef, setPageRef ] = useState( null );
	const [ controlRef, setControlRef ] = useState( null );
	const { menuHeight, menuPlacement } = useSelectPlacement( pageRef, controlRef );

	useEffect(() => {
		if ( keywords.length > 0 && keywords.length < 5 ) {
			setKeywordsLengthError( 'poor' );
		} else if ( keywords.length >= 5 ) {
			setKeywordsLengthError( 'good' );
		}
	}, [ keywords ])

	useEffect(() => {
		const toneObject = CONTENT_TONE.filter((option) => option.value === tone);
		if (toneObject.length) {
			setCurrentTone(toneObject[0]);
		}
	}, [ tone ])

	function getKeywordsLengthStyle() {
		if ( keywordsLengthError && styles.keywordsLength.hasOwnProperty( keywordsLengthError ) ) {
			return styles.keywordsLength[ keywordsLengthError ];
		}

		return 'inherit';
	}

	return (
		<Flex gap={ 0 } align="normal" style={ styles.container } ref={ setPageRef }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<VStack spacing="8" style={{ margin: '0 auto' }}>
						  <FormSection
						    headline={ __( 'Add some keywords', 'kadence-blocks' ) }
						    content={ __( 'Keywords assist the AI in identifying the most relevant topics to write about.', 'kadence-blocks' ) }
						  >
							  <ChipsInput
								  id="2"
								  label={ __('Keywords', 'kadence-blocks') }
								  hideLabelFromVision
								  placeholder={ __('Add Keyword...', 'kadence-blocks') }
								  tags={ keywords }
								  maxTags={ maxTags }
								  selectedTags={ (selectedTags) => dispatch({ type: 'SET_KEYWORDS', payload: selectedTags }) }
								  help={
									  <>
										  <Flex align="flex-start">
											  <FlexBlock>{ __('Separate with commas or the Enter key. Enter between 5 and 10 keywords', 'kadence-blocks') }</FlexBlock>
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
						  	<ToneSelectControl
						  		ref={ setControlRef }
						  		maxMenuHeight={ menuHeight }
						  		menuPlacement={ menuPlacement }
						  		options={ CONTENT_TONE }
								  value={ currentTone }
						  		onChange={ (tone) => dispatch({ type: 'SET_TONE', payload: tone.value }) }
						  	/>
						  </FormSection>
						</VStack>
					</FlexBlock>
			</Flex>
			</FlexBlock>
			<FlexBlock display="flex">
				<Flex justify="center">
					<FlexBlock style={ styles.rightContent }>
						<Slider
							backgroundImage={ INDUSTRY_BACKGROUNDS[ 0 ] }
							text={ __('Not sure where to start? Here\'s some real life examples!', 'kadence-blocks') }
							slides={[
								<SlideOne />,
								<SlideTwo />,
								<SlideThree />,
								<SlideFour />
							]}
						/>
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}

