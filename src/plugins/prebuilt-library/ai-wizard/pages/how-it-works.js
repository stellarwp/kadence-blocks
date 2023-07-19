/**
 * WordPress dependencies
 */
import { Flex, FlexBlock } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AiModalIntro from '../../../../../includes/assets/images/ai-modal-intro.png';

const styles = {
	background: {
		flexGrow: 1,
		background: 'linear-gradient(90deg, rgba(0, 115, 230, 0) 0, rgba(0, 115, 230, 0) 60%, #0073E6 99.44%)',
	},
	headline: {
		maxWidth: 420,
	},
	content: {
		maxWidth: 480,
		marginLeft: 32,
	},
	imageWrapper: {
		overflow: 'hidden',
	},
	image: {
		maxHeight: '60vh',
		borderRadius: 8,
	}
}

const headline = __( 'Elevate Your Website Creation: Design Library + Kadence AI', 'kadence-blocks' );
const content1 = __( 'Introducing Kadence AI, our AI-powered engine for creating websites.', 'kadence-blocks' );
const content2 = __( 'Forget about learning AI - just tell us about yourself, and let Kadence AI take care of the rest. Say goodbye to blank screen anxiety. Welcome effective content that represents your brand.', 'kadence-blocks' );

export function HowItWorks() {
	return (
		<Flex style={ styles.background }>
			<Flex gap={ 22.5 }>
				<FlexBlock>
					<Flex
						className={ 'inner' }
						justify="end"
					>
						<FlexBlock style={ styles.content } className={ 'stellarwp-body' }>
							<h1 className="stellarwp-h1" style={ styles.headline }>
								{ headline }
							</h1>
							<p>
								{ content1 }
							</p>
							<p>
								{ content2 }
							</p>
						</FlexBlock>
				</Flex>
				</FlexBlock>
				<FlexBlock style={ styles.imageWrapper }>
					<img
						src={ AiModalIntro }
						style={ styles.image }
					/>
				</FlexBlock>
			</Flex>
		</Flex>
	);
}

