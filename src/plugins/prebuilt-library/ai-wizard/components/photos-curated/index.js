/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexBlock,
	Spinner,
	__experimentalText as Text
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Button } from '..';

const content = {
	cta: __('View Entire Collection', 'kadence'),
	description: __('Select a curated photo library that resonates with you, and we will incorporate images throughout your Design Library. Additionally, you have the option to create your own photo library.', 'kadence')
}

const styles = {
	wrapper: {
		boxSizing: 'border-box',
		maxWidth: 1200,
		width: '100%',
		paddingLeft: 32,
		paddingRight: 32,
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 32
	},
	loading: {
		position: 'absolute',
		inset: '0 0 0 0',
		backgroundColor: 'rgba(255,255,255,0.95)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	icon: {
		transition: ''
	},
	narrow: {
		position: 'relative',
		height: 400,
		backgroundColor: '#fcfcfc',
		backgroundSize: 'cover',
		border: '1px solid #000',
		flex: '1 1 25%'
	},
	wide: {
		position: 'relative',
		height: 400,
		backgroundColor: '#fcfcfc',
		backgroundSize: 'cover',
		border: '1px solid #000',
		flex: '1 1 50%'
	},
	img: {
		objectFit: 'cover',
		objectPosition: 'center',
		height: 400,
		width: '100%'
	},
	contentWrapper: {
		marginTop: 16,
		textAlign: 'center'
	},
	description: {
		display: 'inline-block',
		maxWidth: 700,
		marginLeft: 'auto',
		marginRight: 'auto'
	}
}

export function PhotosCurated({ loading, collection, collectionLink }) {
	const images = (collection && collection?.data?.length) ? collection.data[0].images.slice(0, 3) : ['','',''];

	return (
		<div
			className={ 'stellarwp-body' }
			style={ styles.wrapper }
		>
			<Flex gap="5">
				{
					images.map((image, index) => {
						const baseStyle = (index % 2 === 1) ? styles.wide : styles.narrow;
						return (
							<FlexBlock style={ baseStyle }>
								{
									image?.sizes && (
										<img style={ styles.img } src={image.sizes[index % 2].src } />
									)
								}
								{ loading && (
									<FlexBlock style={ styles.loading }>
										<Spinner />
									</FlexBlock>
								) }
							</FlexBlock>
						)
					})
				}
			</Flex>
			<Flex
				direction="column"
				justify="center"
				gap="8"
				style={ styles.contentWrapper }
			>
				{
					collectionLink && (
						<FlexBlock>
							<Button
								variant="link"
								text={ content.cta }
								icon="external"
								iconPosition="right"
								target="_blank"
								href={ collectionLink }
							/>
						</FlexBlock>
					)
				}
				<FlexBlock>
					<Text align="center" style={ styles.description }>
						{ content.description }
					</Text>
				</FlexBlock>
			</Flex>
		</div>
	);
}
