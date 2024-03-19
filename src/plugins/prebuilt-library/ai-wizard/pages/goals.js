/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	Flex,
	FlexBlock,
	FlexItem,
	Button,
	__experimentalView as View,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components';
/**
 * Internal dependencies
 */
import { SITE_GOALS } from '../constants';
import { FormSection, ButtonList } from '../components';
import { useKadenceAi } from '../context/kadence-ai-provider';
import TaxesBg from '../assets/taxes-bg.jpg';
const styles = {
	container: {
		height: '100%',
	},
	leftContent: {
		maxWidth: 940,
		marginInline: 'auto',
	},
	rightContent: {
		marginRight: 32,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	formWrapper: {
		paddingRight: 32,
		paddingLeft: 32,
	},
	textareaWrapper: {
		position: 'relative',
	},
	image: {
		borderRadius: '20px',
		background: `url(${ TaxesBg }) no-repeat center center`,
		height: '100%',
		backgroundSize: 'cover',
	},
};

export function SiteGoals() {
	const { state, dispatch } = useKadenceAi();
	const [ allGoals, setAllGoals ] = useState( [] );
	useEffect( () => {
		const formattedSites = [];
		Object.keys( SITE_GOALS ).map( ( key ) => {
			formattedSites.push( {
				id: key,
				label: SITE_GOALS[ key ].label,
				value: SITE_GOALS[ key ].value,
				icon: SITE_GOALS[ key ].icon,
				description: SITE_GOALS[ key ]?.description ? SITE_GOALS[ key ].description : '',
				isIncluded: state.goals.includes( SITE_GOALS[ key ].value ),
			} );
		} );

		setAllGoals( formattedSites );
	}, [] );
	function updateSelected( includeGoals ) {
		dispatch( { type: 'SET_SITE_GOALS', payload: includeGoals.map( ( goal ) => goal.value ) } );
	}
	return (
		<Flex gap={ 0 } align="normal" style={ styles.container }>
			<FlexBlock style={ { alignSelf: 'center', flex: '3 1 0%' } }>
				<Flex justify="center" style={ styles.leftContent }>
					<FlexBlock style={ styles.formWrapper } className={ 'stellarwp-body' }>
						<FormSection
							headline={
								<span className="has-beta-pill">
									{ __( 'What are the goals of this site?', 'kadence-blocks' ) }{ ' ' }
									<span className="beta-pill">Beta</span>
								</span>
							}
							content={ __(
								'Select all that apply. This will be used to help display and show content specific to your site',
								'kadence-blocks'
							) }
						>
							<View style={ styles.textareaWrapper }>
								<VStack>
									{ SITE_GOALS.length > 0 && (
										<ButtonList onChange={ updateSelected } items={ allGoals }></ButtonList>
									) }
								</VStack>
							</View>
						</FormSection>
					</FlexBlock>
				</Flex>
			</FlexBlock>
			<FlexBlock display="flex" style={ { flex: '2 1 0%' } }>
				<Flex justify="center">
					<FlexBlock style={ styles.rightContent }>
						<div style={ styles.image } />
					</FlexBlock>
				</Flex>
			</FlexBlock>
		</Flex>
	);
}
