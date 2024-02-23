/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, TextControl, TextareaControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	formBlockIcon
} from '@kadence/icons';
import { map } from 'lodash';

export default function FormTitle( {
		setTitle,
		isAdding,
		existingTitle,
		onAdd,
	} ) {
	const [ tmpTitle, setTmpTitle ] = useState( existingTitle );
	const [ initialDescription, setTmpDescription ] = useState( '' );
	const [ wizardStep, setWizardStep ] = useState( 'title' );
	const [ template, setTemplate ] = useState( '' );
	const [ isSaving, setIsSaving ] = useState( false );

	const formSteps = [
		{ key: 'start', name: __( 'Layout', 'kadence-blocks' ) },
		{ key: 'style', name: __( 'Style', 'kadence-blocks' ) },
		{ key: 'title', name: __( 'Title', 'kadence-blocks' ) },
	];

	return (
		<Placeholder
			className="kb-select-or-create-placeholder kb-adv-form-select"
			icon={formBlockIcon}
			label={__( 'Advanced Navigation', 'kadence-blocks' )}
		>
			<div className='kb-form-wizard-pagination'>
				{ map( formSteps, ( { name, key }, index ) => (
					<Button
						key={ key }
						className="kb-form-pagination-btn"
						isSmall
						onClick={ () => {
							if ( key === 'style' && ( template === 'skip' || template === '' ) ) {
								setWizardStep( 'start' );
							} else {
								setWizardStep( key );
							}
						} }
						icon={ <span className="kb-form-pagination-icon">{index + 1 }</span> }
						aria-label={ sprintf(
							/* translators: 1: current page number 2: total number of pages */
							__( 'Page %1$d of %2$d', 'kadence-blocks' ),
							index + 1,
							formSteps.length
						) }
						text={ name }
						isPressed={ wizardStep === key }
					/>
				) ) }
			</div>
			<div className="kb-select-or-create-placeholder__actions">
				{ wizardStep === 'title' && (
					<>
						<TextControl
							className={ `kb-form-block-title${ ! tmpTitle ? ' kadence-input-required-warning' : '' }` }
							label={__( 'Give your navigation menu a title (required)', 'kadence-blocks' )}
							placeholder={__( 'Site Navigation', 'kadence-blocks' )}
							help={ __( 'This is used for your reference only.', 'kadence-blocks' )}
							value={tmpTitle}
							onChange={setTmpTitle}
							autoFocus
						/>
						<TextareaControl
							label={__( 'Navigation Description', 'kadence-blocks' )}
							placeholder={__( 'Optionally add an description about your navigation', 'kadence-blocks' )}
							help={ __( 'This is used for your reference only.', 'kadence-blocks' )}
							value={initialDescription}
							onChange={setTmpDescription}
						/>
						<Button
							variant="primary"
							onClick={ () => { setIsSaving( true ); onAdd( tmpTitle, template, initialDescription ); } }
							isBusy={ isAdding }
							disabled={tmpTitle === '' || isSaving}
						>
							{__( 'Create', 'kadence-blocks' )}
						</Button>
					</>
				)}
			</div>
		</Placeholder>
	);
}
