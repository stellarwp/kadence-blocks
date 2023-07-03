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
import {
	Education4All,
	HealingTouch,
	Prospera,
	SpencerSharp
} from './slides/about-your-site';
import { ENTITY_TYPE_INDIVIDUAL } from '../constants';
import { useKadenceAi } from '../context/kadence-ai-provider';
import backgroundImage from '../assets/spa-bg.jpg';

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

const title = __( 'Tell us about your', 'kadence-blocks' );
const content = __( 'Compose a concise paragraph that explains who you are, your primary attributes and highlight what differentiates you.', 'kadence-blocks' );
const entityToTitle = {
	'COMPANY': __( 'business', 'kadence-blocks' ),
	'INDIVIDUAL': __( 'self', 'kadence-blocks' ),
	'ORGANIZATION': __( 'organization', 'kadence-blocks' ),
};

export function AboutYourSite() {
	const { state, dispatch } = useKadenceAi();
	const { missionStatement, entityType } = state;
	// Compose title based on entityType value.
	const customTitle = `${ title }${ entityType === ENTITY_TYPE_INDIVIDUAL ? '' : ' '}${ entityToTitle[ entityType ] }`

	return (
		<Flex gap={ 0 } align="normal" style={ styles.container }>
			<FlexBlock style={{ alignSelf: 'center' }}>
				<Flex
					justify="center"
					style={ styles.leftContent }
				>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<FormSection
							headline={ customTitle }
							content={ content }
						>
							<TextareaControl
								style={{ height: 440 }}
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
			<FlexBlock display="flex">
				<Flex justify="center">
					<FlexBlock style={ styles.rightContent }>
						<Slider
							backgroundImage={ backgroundImage }
							text={ __('Not sure where to start? Here\'s some real life examples!', 'kadence-blocks') }
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

