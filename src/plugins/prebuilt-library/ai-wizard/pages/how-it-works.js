/**
 * WordPress dependencies
 */
import { Flex, FlexBlock } from '@wordpress/components';

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
								Create Stunning & Unique Designs with the Kadence Pattern Design Library
							</h1>
							<p>
								Explaining why you dont wanna skip this: Lorem ipsum dolor sit amet, 
								consectetur adipiscing elit. Phasellus vulputate, metus et iaculis tincidunt, 
								nibh ante sollicitudin libero, in varius elit velit sed nibh. Cras dapibus, nulla 
								vitae hendrerit consequat, lectus nulla blandit eros, sed malesuada lorem lectus 
								eu lacus. Vivamus et suscipit lacus.
							</p>
							<h5 className="stellarwp-overline">
								Benefits
							</h5>
							<ul className="stellarwp-ul">
								<li>
									Something something about AI
								</li>
								<li>
									Something about Pexels imagery
								</li>
								<li>
									I dont even know if we need a benefits list
								</li>
							</ul>
						</FlexBlock>
				</Flex>
				</FlexBlock>
				<FlexBlock style={ styles.imageWrapper }>
					<img
						src="https://placehold.co/2000x1400"
						style={ styles.image }
					/>
				</FlexBlock>
			</Flex>
		</Flex>
	);
}

