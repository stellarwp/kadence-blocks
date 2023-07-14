/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Flex, FlexBlock } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  FormSection,
	Slider,
	TextareaProgress
} from '../components';
import {
	Education4All,
	HealingTouch,
	Prospera,
	SpencerSharp
} from './slides/about-your-site';
import {
	MISSION_STATEMENT_STATUS,
	MISSION_STATEMENT_GOAL,
	INDUSTRY_BACKGROUNDS
} from '../constants';
import { useKadenceAi } from '../context/kadence-ai-provider';

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
	}
}

const content = __( 'Compose a concise paragraph that explains who you are, your primary attributes and highlight what differentiates you.', 'kadence-blocks' );
const titlePartial = {
	'COMPANY': ` ${ __( 'business', 'kadence-blocks' ) }`,
	'INDIVIDUAL': __( 'self', 'kadence-blocks' ),
	'ORGANIZATION': ` ${ __( 'organization', 'kadence-blocks' ) }`
};

export function AboutYourSite() {
	const [ indicator, setIndicator ] = useState();
	const [ progress, setProgress ] = useState(0);
	const [ backgroundImage, setBackgroundImage ] = useState( 0 );
	const { state, dispatch } = useKadenceAi();
	const { missionStatement, entityType, industry } = state;
	const title = sprintf( __( 'Tell us about your%s', 'kadence-blocks' ), titlePartial[ entityType ]);
	const placeholder = sprintf( __( 'The purpose of my %s website is...', 'kadence-blocks' ), industry.toLowerCase() );

	useEffect(() => {
		const progress = Math.round((missionStatement.length/MISSION_STATEMENT_GOAL) * 100);
		const statementProgress = progress >= 100 ? 100 : progress;

		if (statementProgress < 50) {
			setIndicator('weak')	
		}
		if (statementProgress >= 50) {
			setIndicator('medium')	
		}
		if (statementProgress == 100) {
			setIndicator('strong')	
		}

		setProgress( statementProgress );
	}, [ missionStatement ])

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
							<TextareaProgress
								hideLabelFromVision
								label={ title }
								placeholder={ placeholder }
								value={ missionStatement }
								onChange={ (value) => dispatch({ type: 'SET_MISSION_STATEMENT', payload: value }) }
								showProgressBar={ missionStatement && missionStatement.length > 0 }
								progressBarProps={{
									value: progress,
									color: MISSION_STATEMENT_STATUS?.[ indicator ]?.color ? MISSION_STATEMENT_STATUS[ indicator ].color : 'red',
									message: MISSION_STATEMENT_STATUS?.[ indicator ]?.message ? MISSION_STATEMENT_STATUS[ indicator ].message : ''
								}}
							/>
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

