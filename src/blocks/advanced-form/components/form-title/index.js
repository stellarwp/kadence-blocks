/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, TextControl } from '@wordpress/components';
import { KadenceRadioButtons } from '@kadence/components';
import { useState } from '@wordpress/element';
import { formBlockIcon } from '@kadence/icons';
import { applyFilters } from '@wordpress/hooks';


export default function FormTitle( {
		setTitle,
		isAdding,
		onAdd,
	} ) {
	const [ tmpTitle, setTmpTitle ] = useState( '' );
	const [ tmpTempalte, setTmpTempalte ] = useState( 'blank' );
	const typeOptions = [
		{ value: 'blank', label: __( 'Blank', 'kadence-blocks' ), icon: formBlockIcon, isDisabled: false },
		{ value: 'simple', label: __( 'Simple', 'kadence-blocks' ), icon: formBlockIcon, isDisabled: false },
		{ value: 'subscribe', label: __( 'Subscribe', 'kadence-blocks' ), icon: formBlockIcon, isDisabled: false },
		// { value: 'fluidcarousel', label: __( 'Fluid Carousel', 'kadence-blocks' ), icon: galleryFluidIcon, isDisabled: false },
		// { value: 'slider', label: __( 'Slider', 'kadence-blocks' ), icon: gallerySliderIcon, isDisabled: false },
		// { value: 'thumbslider', label: __( 'Thumbnail Slider (Pro addon)', 'kadence-blocks' ), icon: galleryThumbSliderIcon, isDisabled: true },
		// { value: 'tiles', label: __( 'Tiles (Pro addon)', 'kadence-blocks' ), icon: galleryTilesIcon, isDisabled: true },
	];
	const formTemplates = applyFilters( 'kadence.formTemplates', typeOptions );
	return (
		<Placeholder
			className="kb-select-or-create-placeholder"
			icon={formBlockIcon}
			label={__( 'Kadence Form', 'kadence-form' )}
		>
			<div className="kb-select-or-create-placeholder__actions">
				<TextControl
					label={__( 'Give your div a title', 'kadence-blocks' )}
					placeholder={__( 'Contact Us', 'kadence-blocks' )}
					value={tmpTitle}
					onChange={setTmpTitle}
				/>
				<KadenceRadioButtons
					value={ tmpTempalte }
					options={ formTemplates }
					//wrap={true}
					//hideLabel={true}
					label={ __( 'Choose a Template', 'kadence-blocks' ) }
					className={ 'kb-form-block-template' }
					onChange={ value => {
						setTmpTempalte( value );
					}}
				/>
				<Button
					variant="primary"
					onClick={ () => onAdd( tmpTitle, tmpTempalte ) }
					isBusy={ isAdding }
					disabled={tmpTitle === ''}
				>
					{__( 'Create', 'kadence-blocks' )}
				</Button>
			</div>
		</Placeholder>
	);
}
