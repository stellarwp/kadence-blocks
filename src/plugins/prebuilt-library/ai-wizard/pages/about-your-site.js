/**
 * WordPress dependencies
 */
import { Flex, FlexBlock } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  FormSection,
	Slider,
	TextareaControl
} from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';

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

const title = __( 'Tell us about your [self/business/org]?', 'kadence-blocks' );
const content = __( 'Compose a concise paragraph that explains who you are, your primary attributes and highlight what differentiates you.', 'kadence-blocks' );

export function AboutYourSite() {
	const { state, dispatch } = useKadenceAi();
	const { missionStatement } = state;

	return (
		<Flex gap={ 0 } align="normal" style={ styles.container }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<FormSection
							headline={ title }
							content={ content }
						>
							<TextareaControl
								label={ __('About Me/My Organization/My Project', 'kadence-blocks') }
								hideLabelFromVision
								placeholder="..."
								value={ missionStatement }
								onChange={ (value) => dispatch({ type: 'SET_MISSION_STATEMENT', payload: value }) }
							/>
						</FormSection>
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

