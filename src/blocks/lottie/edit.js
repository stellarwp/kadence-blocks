/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Css
 */
import './editor.scss';

import { Player, Controls } from '@lottiefiles/react-lottie-player';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useBlockProps, BlockAlignmentControl } from '@wordpress/block-editor';
import ResponsiveMeasurementControls from '../../components/measurement/responsive-measurement-control';
const { rest_url } = kadence_blocks_params;
import get from 'lodash/get';
import has from 'lodash/has';

const {
	InspectorControls,
	BlockControls,
} = wp.blockEditor;

const { apiFetch } = wp;
const {
	RangeControl,
	ToggleControl,
	TextControl,
	Modal,
	SelectControl,
	FormFileUpload,
	Button,
	Notice,
} = wp.components;

import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
/**
 * Internal dependencies
 */
import classnames from 'classnames';
import KadenceSelectPosts from '../../components/posts/select-posts-control'
import KadencePanelBody from '../../components/KadencePanelBody'
const ktlottieUniqueIDs = [];

export function Edit( {
	attributes,
	setAttributes,
	className,
	clientId,
} ) {

	const {
		fileUrl,
		localFile,
		fileSrc,
		showControls,
		autoplay,
		loop,
		onlyPlayOnHover,
		onlyPlayOnScroll,
		waitUntilInView,
		bouncePlayback,
		playbackSpeed,
		loopLimit,
		uniqueID,
		delay,
		align,
		width,
		startFrame,
		endFrame,
		paddingTablet,
		paddingDesktop,
		paddingMobile,
		paddingUnit,
		marginTablet,
		marginDesktop,
		marginMobile,
		marginUnit,
		label,
	} = attributes;
	const previewDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	const [ rerenderKey, setRerenderKey ] = useState( 'static' );
	const [ lottieAnimationsCacheKey, setLottieAnimationsCacheKey ] = useState( { key: Math.random() } );

	const getPreviewSize = ( device, desktopSize, tabletSize, mobileSize ) => {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	};

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[0] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[1] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[2] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[3] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[0] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[1] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[2] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[3] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const [ marginControl, setMarginControl ] = useState( 'individual');
	const [ paddingControl, setPaddingControl ] = useState( 'individual');

	const classes = classnames( className );
	const blockProps = useBlockProps( {
		className: classes,
	} );

	useEffect( () => {
		if ( ! uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/lottie' ] !== undefined && typeof blockConfigObject[ 'kadence/lottie' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/lottie' ] ).map( ( attribute ) => {
					uniqueID = blockConfigObject[ 'kadence/lottie' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktlottieUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( ktlottieUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );		ktlottieUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			ktlottieUniqueIDs.push( uniqueID );
		}
	}, [] );
	const containerClasses = classnames( {
		'kb-lottie-container': true,
		[ `kb-lottie-container${ uniqueID }` ] : true,
	} );
	function parseAndUpload(file, title, setLottieJsonError) {

		let fileread = new FileReader()
		let lottieJson;

		fileread.onload = function (e) {

			try {
				lottieJson = JSON.parse(e.target.result)
			} catch (e) {
				setLottieJsonError( __( 'Invalid JSON file', 'kadence-blocks' ) );
				return;
			}

			if (typeof lottieJson === 'object') {
				apiFetch( {
					path: '/kb-lottieanimation/v1/animations',
					data: { lottieFile: lottieJson, title: title },
					method: 'POST',
				} ).then( (response) => {
					if( has(response, 'value') && has(response, 'label') ){
						setAttributes( { localFile: [ response ], fileSrc: 'local' } );
						setRerenderKey( Math.random() );
						setLottieAnimationsCacheKey( Math.random() );
					} else if ( has(response, 'error') && has(response, 'message')  ) {
						setLottieJsonError( response.message );
					} else {
						setLottieJsonError( __( 'An error occurred when uploading your file', 'kadence-blocks' ) );
					}
				});
			}

		}

		fileread.readAsText(file)

	}

	const getAnimationUrl= (fileSrc, fileUrl, localFile, rest_url) => {
		let url = '';

		if( fileSrc === 'url') {
			url = fileUrl;
		} else {
			url = rest_url + 'kb-lottieanimation/v1/animations/' + get(localFile, [0, 'value'], '')
		}

		if( url === '' || url === rest_url + 'kb-lottieanimation/v1/animations/') {
			url = 'https://assets10.lottiefiles.com/packages/lf20_rqcjx8hr.json';
		}

		return url;
	}
	const UploadModal = () => {
		const [ isOpen, setOpen ] = useState( false );
		const [ lottieJsonError, setLottieJsonError ] = useState( false );
		const [ newAnimationTitle, setNewAnimationTitle ] = useState( '' );
		const [ lottieJsonFile, setLottieJsonFile ] = useState();

		const openModal = () => setOpen( true );
		const closeModal = () => setOpen( false );

		return (
			<>
				<Button variant="primary" className={ 'is-primary' } onClick={ openModal }>
					{ __( 'Upload a Lottie file', 'kadence-blocks' ) }
				</Button>
				{ isOpen && (
					<Modal title={ __( 'Upload Lottie JSON file', 'kadence-blocks' ) } onRequestClose={ closeModal }>

						{lottieJsonError !== false ?
							<Notice status="error" onRemove={ () => setLottieJsonError( false ) }>
								<p>{ lottieJsonError }</p>
							</Notice>
							: null }

						<TextControl
							label={ __( 'Animation title', 'kadence-blocks' ) }
							value={ newAnimationTitle }
							onChange={ ( value ) => setNewAnimationTitle( value ) }
						/>

						<br/>

						<FormFileUpload
							accept="application/json"
							className={ 'is-primary'}
							align={ 'center' }
							onChange={ ( event ) => { setLottieJsonFile( event.target.files[0] ); } }
						>
							{ __( 'Browse', 'kadence-blocks' ) }
						</FormFileUpload>
						{ lottieJsonFile ? null : __( 'Select a file', 'kadence-blocks' )}

						<br/><br/>

						<Button className={ 'is-secondary' } onClick={ closeModal } text={ __( 'Cancel', 'kadence-blocks' ) } />
						&nbsp;&nbsp;&nbsp;
						<Button className={ 'is-primary' } disabled={ !lottieJsonFile } onClick={ () => parseAndUpload( lottieJsonFile, newAnimationTitle, setLottieJsonError ) } text={ __( 'Upload', 'kadence-blocks' ) }/>

					</Modal>
				) }
			</>
		);
	};

	return (
		<div { ...blockProps }>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={ align }
					onChange={ ( value ) => setAttributes( { align: value } ) }
				/>
			</BlockControls>
			<InspectorControls>
				<KadencePanelBody
					title={ __('Source File', 'kadence-blocks') }
					initialOpen={ true }
					panelName={ 'kb-lottie-source-file' }
				>

					<SelectControl
						label={ __( 'File Source', 'kadence-blocks' ) }
						value={ fileSrc }
						options={ [
							{ value: 'url', label: __( 'Remote URL', 'kadence-blocks' ) },
							{ value: 'file', label: __( 'Local File', 'kadence-blocks' ) },
						] }
						onChange={ value => {
							setAttributes( { fileSrc: value } );
							setRerenderKey( Math.random() );
						} }
					/>

					{ fileSrc === 'url' ?
						<TextControl
							label={ __( 'Lottie Animation URL', 'kadence-blocks') }
							value={ fileUrl }
							onChange={ (value) => {
								setAttributes({ fileUrl: value });
								setRerenderKey( Math.random() );
							} }
						/>
						:
						<>
							<KadenceSelectPosts
								placeholder={ __( 'Select Lottie File', 'kadence-blocks' ) }
								restBase={ 'wp/v2/kadence_lottie' }
								key={ lottieAnimationsCacheKey }
								fieldId={ 'lottie-select-src' }
								value={ localFile }
								onChange={ (value) => {
									setAttributes({ localFile: (value ? [value] : []) });
									setRerenderKey( Math.random() );
								} }
							/>

							<UploadModal />
						</>
					}
					<TextControl
						label={ __( 'Aria Label', 'kadence-blocks' ) }
						value={ label || '' }
						onChange={ ( value ) => {
							setAttributes( { label: value });
						} }
						help={ __( 'Describe the purpose of this animation on the page.', 'kadence-blocks' ) }
					/>



				</KadencePanelBody>

				<KadencePanelBody
					title={ __( 'Playback Settings', 'kadence-blocks' ) }
					initialOpen={ true }
					panelName={ 'kb-lottie-playback-settings' }
				>
					<ToggleControl
						label={ __( 'Show Controls', 'kadence-blocks' ) }
						checked={ showControls }
						onChange={ ( value ) => {
							setAttributes( { showControls: value } );
							setRerenderKey( Math.random() );
						}}
					/>
					<ToggleControl
						label={ __( 'Autoplay', 'kadence-blocks' ) }
						checked={ autoplay }
						onChange={ ( value ) => {
							setAttributes( { autoplay: value, waitUntilInView: ( value ? waitUntilInView : false ), onlyPlayOnHover: (value ? false : onlyPlayOnHover), onlyPlayOnScroll: (value ? false : onlyPlayOnScroll) } );
							setRerenderKey( Math.random() );
						}}
					/>
					<ToggleControl
						label={ __( 'Only play on hover', 'kadence-blocks' ) }
						checked={ onlyPlayOnHover }
						onChange={ ( value ) => {
							setAttributes( { onlyPlayOnHover: value, autoplay: (value ? false : autoplay), onlyPlayOnScroll: (value ? false : onlyPlayOnScroll) } );
							setRerenderKey( Math.random() );
						} }
					/>
					<ToggleControl
						label={ __( 'Only play on page scroll', 'kadence-blocks' ) }
						help={ __( 'This will override most settings such as autoplay, playback speed, bounce, loop, and play on hover. This will not work when previewing in the block editor', 'kadence-blocks' ) }
						checked={ onlyPlayOnScroll }
						onChange={ ( value ) => {
							setAttributes( { onlyPlayOnScroll: value, onlyPlayOnHover: (value ? false : onlyPlayOnHover), autoplay: (value ? false : autoplay), loop: (value ? false : loop), bouncePlayback: (value ? false : bouncePlayback) } );
							setRerenderKey( Math.random() );
						} }
					/>

					{ onlyPlayOnScroll ?
						<>
							<div style={ { marginBottom: '15px'} }>
								<NumberControl
									label={ __( 'Starting Frame' ) }
									value={ startFrame }
									onChange={ (value) => setAttributes({ startFrame: parseInt(value) }) }
									min={ 0 }
									isShiftStepEnabled={ true }
									shiftStep={ 10 }
									help={ __( 'Does not show in preview', 'kadence-blocks' ) }
								/>
							</div>

							<div style={ { marginBottom: '15px'} }>
								<NumberControl
									label={ __( 'Ending Frame' ) }
									value={ endFrame }
									onChange={ (value) => setAttributes({ endFrame: parseInt(value) }) }
									min={ 0 }
									isShiftStepEnabled={ true }
									shiftStep={ 10 }
									help={ __( 'Does not show in preview', 'kadence-blocks' ) }
								/>
							</div>
						</>
					 :
						<div style={ { marginBottom: '15px'} }>
							<ToggleControl
							label={ __( 'Don\'t play until in view', 'kadence-blocks' ) }
							help={ __('Prevent playback from starting until animation is in view', 'kadence-blocks') }
							checked={ waitUntilInView }
							onChange={ (value) => { setAttributes( { waitUntilInView: value, autoplay: ( value ? true : autoplay ) } ) } }
							/>
						</div>
					}

					<RangeControl
						label={ __( 'Playback Speed', 'kadence-blocks' ) }
						value={ playbackSpeed }
						onChange={ ( value ) => { setAttributes( { playbackSpeed: value } ); setRerenderKey( Math.random() ) } }
						step={ 0.1 }
						min={ 0 }
						max={ 10 }
					/>

					<h3>{ __( 'Loop Settings', 'kadence-blocks' ) }</h3>
					<ToggleControl
						label={ __( 'Loop playback', 'kadence-blocks' ) }
						checked={ loop }
						onChange={ ( value ) => {
							setAttributes( { loop: value, onlyPlayOnScroll: (value ? false : onlyPlayOnScroll) } );
							setRerenderKey( Math.random() );
						} }
					/>
					<ToggleControl
						label={ __( 'Bounce playback', 'kadence-blocks' ) }
						checked={ bouncePlayback }
						onChange={ ( value ) => {
							setAttributes( { bouncePlayback: value, loop: (value ? true : loop), onlyPlayOnScroll: (value ? false : onlyPlayOnScroll) } );
						} }
						help={ __( 'Does not show in preview', 'kadence-blocks' ) }
					/>
					<RangeControl
						label={ __( 'Delay between loops (seconds)', 'kadence-blocks' ) }
						value={ delay }
						onChange={ ( value ) => {
							setAttributes( { delay: value } );
						} }
						step={ 0.1 }
						min={ 0 }
						max={ 60 }
						help={ __( 'Does not show in preview', 'kadence-blocks' ) }
					/>
					<RangeControl
						label={ __( 'Limit Loops', 'kadence-blocks' ) }
						value={ loopLimit }
						onChange={ ( value ) => {
							setAttributes( { loopLimit: value } );
						} }
						step={ 1 }
						min={ 0 }
						max={ 100 }
						help={ __( 'Does not show in preview', 'kadence-blocks' ) }
					/>
				</KadencePanelBody>
				<KadencePanelBody
					title={ __( 'Size Controls', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-lottie-size' }
				>
					<ResponsiveMeasurementControls
						label={ __( 'Padding', 'kadence-blocks' ) }
						value={ [ previewPaddingTop, previewPaddingRight, previewPaddingBottom, previewPaddingLeft ] }
						control={ paddingControl }
						tabletValue={ paddingTablet }
						mobileValue={ paddingMobile }
						onChange={ ( value ) => setAttributes( { paddingDesktop: value } ) }
						onChangeTablet={ ( value ) => setAttributes( { paddingTablet: value } ) }
						onChangeMobile={ ( value ) => setAttributes( { paddingMobile: value } ) }
						onChangeControl={ ( value ) => setPaddingControl( value ) }
						min={ 0 }
						max={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200 ) }
						step={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 ) }
						unit={ paddingUnit }
						units={ [ 'px', 'em', 'rem', '%' ] }
						onUnit={ ( value ) => setAttributes( { paddingUnit: value } ) }
					/>
					<ResponsiveMeasurementControls
						label={ __( 'Margin', 'kadence-blocks' ) }
						value={ [ previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft ] }
						control={ marginControl }
						tabletValue={ marginTablet }
						mobileValue={ marginMobile }
						onChange={ ( value ) => {
							setAttributes( { marginDesktop: [ value[ 0 ], value[ 1 ], value[ 2 ], value[ 3 ] ] } );
						} }
						onChangeTablet={ ( value ) => setAttributes( { marginTablet: value } ) }
						onChangeMobile={ ( value ) => setAttributes( { marginMobile: value } ) }
						onChangeControl={ ( value ) => setMarginControl( value ) }
						min={ ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 ) }
						max={ ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 ) }
						step={ ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 ) }
						unit={ marginUnit }
						units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
						onUnit={ ( value ) => setAttributes( { marginUnit: value } ) }
					/>

					<RangeControl
						label={ __( 'Max Width', 'kadence-blocks' ) }
						value={ width }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						allowReset={ true }
						step={ 1 }
						min={ 25 }
						max={ 1000 }
					/>
				</KadencePanelBody>
			</InspectorControls>
			<div className={ containerClasses } style={
				{
					marginTop: ( '' !== previewMarginTop ? previewMarginTop + marginUnit : undefined ),
					marginRight: ( '' !== previewMarginRight ? previewMarginRight + marginUnit : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined ),
					marginLeft: ( '' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined ),

					paddingTop: ( '' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined ),
					paddingRight: ( '' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined ),
					paddingBottom: ( '' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined ),
					paddingLeft: ( '' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined ),
				}
			}>
				<Player
					speed={ undefined !== playbackSpeed ? playbackSpeed : 1 }
					autoplay={ autoplay ? true : false }
					count={ loopLimit !== 0 ? loopLimit : 0 }
					hover={ onlyPlayOnHover ? true : false }
					loop={ loop ? true : false }
					id={ 'kb-lottie-player' + uniqueID }
					key={ rerenderKey }
					src={ getAnimationUrl(fileSrc, fileUrl, localFile, rest_url) }
					style={ {
						maxWidth: (width === '0' ? 'auto' : width + 'px'),
						// height: ( width === "0" ? 'auto' : width + 'px'),
						margin: '0 auto'
					} }
				>
					<Controls visible={ showControls ? true : false } buttons={['play', 'frame']} />
				</Player>
			</div>
		</div>
	);
}

export default ( Edit );
