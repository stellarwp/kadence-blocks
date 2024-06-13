import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Icon,
	Modal,
	TextareaControl,
	DropZone,
	FormFileUpload
} from '@wordpress/components';
import { has, get } from 'lodash';
import apiFetch from '@wordpress/api-fetch';


export default function SvgModal( { isOpen, setIsOpen }) {
	const [uploadView, setUploadView ] = useState( 'upload');
	const [pastedSVG, setPastedSVG] = useState('');
	const [saveError, setSaveError] = useState('');
	const [file, setFile] = useState( null );

	function parseAndUpload() {
		const fileread = new FileReader();
		const source = file !== null ? 'upload' : 'paste';

		let fileBlob;
		if( source === 'upload' ) {
			if (!file || file.length === 0) {
				console.log('No file selected');
				setSaveError(__('No file selected', 'kadence-blocks'));
				return;
			}
			fileBlob = file[0];
		} else {
			if (!pastedSVG.trim()) {
				console.log('No SVG content pasted');
				setSaveError(__('No SVG content pasted', 'kadence-blocks'));
				return;
			}
			fileBlob = new Blob([pastedSVG], { type: 'image/svg+xml' });
		}

		fileread.onload = function (e) {
			const fileContent = e.target.result;

			console.log( 'fileContent' );
			console.log( fileContent );

			if (typeof fileContent === 'object') {
				apiFetch({
					path: '/kb-custom-svg/v1/upload',
					data: { file: fileContent, title: 'title' },
					method: 'POST',
				}).then((response) => {
					if (has(response, 'value') && has(response, 'label')) {
						// Success
					} else if (has(response, 'error') && has(response, 'message')) {
						setSaveError(response.message);
					} else {
						setSaveError(__('An error occurred when uploading your file', 'kadence-blocks'));
					}
				});
			}
		};

		fileread.readAsText(fileBlob);
	}

	return (
		<>
			{isOpen && (
				<Modal title={__( 'Add an SVG' )} className={'upload-svg-modal'} size={'medium'} onRequestClose={() => setIsOpen( false )}>
					<div className={'modal-body'}>
						<div className={'security-notice'}>
							<h4>{__( 'Important: SVG Safety', 'kadence-blocks' )}</h4>
							<p>
								SVGs can contain malicious code. For your security, we suggest sanitizing your files before uploading.
								Learn more about SVG security here.
							</p>
						</div>

						{uploadView === 'upload' && (
							<div className={'drag-drop-container'}>
								<div className={'drag-drop-target'} style={{ position: 'relative' }}>
									<DropZone
										label={__( 'Upload SVG', 'kadence-blocks' )}
										onFilesDrop={( file ) => {
											console.log( 'onFilesDrop' );
											console.log( file );
											setFile( file );
										}}
									/>
									<h3>{__( 'Select a file or drop it here', 'kadence-blocks' )}</h3>
									<p>{__( 'SVG dimensions: 24px by 24px', 'kadence-blocks' )}</p>
									<FormFileUpload
										accept="image/svg+xml"
										onChange={ ( event ) => setFile( event.currentTarget.files ) }
										render={ ( { openFileDialog } ) => (
											<Button onClick={ openFileDialog } isPrimary={true}>
												Browse
											</Button>
										) }
									/>
								</div>

								<Button type={'link'} onClick={() => {
									setUploadView( 'paste' );
									setFile( null );
								}}>{__( 'Paste an SVG', 'kadence-blocks' )}</Button>
							</div>
						)}

						{uploadView === 'paste' && (
							<div className={'paste-container'}>
								<h3>{__( 'Paste your SVG', 'kadence-blocks' )}</h3>
								{/*Textarea*/}

								<TextareaControl value={pastedSVG} onChange={( value ) => setPastedSVG( value )}/>

								<Button type={'link'} onClick={() => {
									setUploadView( 'upload' );
									setPastedSVG( '' );
								}}>{__( 'Upload an SVG', 'kadence-blocks' )}</Button>
							</div>
						)}
					</div>

					<div className={'footer'}>
						<Button isSecondary={true} onClick={() => setIsOpen( false )}>
							{__( 'Cancel', 'kadence-blocks' )}
						</Button>

						<Button isPrimary={true} onClick={() => { parseAndUpload(); }}>
							{__( 'Add', 'kadence-blocks' )}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);

}
