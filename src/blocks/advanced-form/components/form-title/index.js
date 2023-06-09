/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, TextControl, ButtonGroup } from '@wordpress/components';
import { KadenceRadioButtons } from '@kadence/components';
import { useState } from '@wordpress/element';
import {
	formBlockIcon,
    formTemplateContactIcon,
    formTemplateContactAdvancedIcon,
    formTemplateSubscribeIcon,
    formTemplateSubscribeAdvancedIcon,
    formTemplateFeedbackIcon,
} from '@kadence/icons';
import { applyFilters } from '@wordpress/hooks';
import { map } from 'lodash';


export default function FormTitle( {
		setTitle,
		isAdding,
		onAdd,
	} ) {
	const [ tmpTitle, setTmpTitle ] = useState( '' );
	const [ tmpTemplate, settmpTemplate ] = useState( 'contact' );
	// const typeOptions = [
	// 	{ value: 'blank', label: __( 'Blank', 'kadence-blocks' ), icon: formBlockIcon, isDisabled: false },
	// 	{ value: 'simple', label: __( 'Simple', 'kadence-blocks' ), icon: formBlockIcon, isDisabled: false },
	// 	{ value: 'subscribe', label: __( 'Subscribe', 'kadence-blocks' ), icon: formBlockIcon, isDisabled: false },
	// 	// { value: 'fluidcarousel', label: __( 'Fluid Carousel', 'kadence-blocks' ), icon: galleryFluidIcon, isDisabled: false },
	// 	// { value: 'slider', label: __( 'Slider', 'kadence-blocks' ), icon: gallerySliderIcon, isDisabled: false },
	// 	// { value: 'thumbslider', label: __( 'Thumbnail Slider (Pro addon)', 'kadence-blocks' ), icon: galleryThumbSliderIcon, isDisabled: true },
	// 	// { value: 'tiles', label: __( 'Tiles (Pro addon)', 'kadence-blocks' ), icon: galleryTilesIcon, isDisabled: true },
	// ];

	const startlayoutOptions = [
		{ key: 'skip', name: __( 'Skip (blank)' ), icon: '', isDisabled: false},
		{ key: 'contact', name: __( 'Contact', 'kadence-blocks' ), icon: formTemplateContactIcon, isDisabled: false },
		{ key: 'contactAdvanced', name: __( 'Contact With Options', 'kadence-blocks' ), icon: formTemplateContactAdvancedIcon, isDisabled: false },
		{ key: 'subscribe', name: __( 'Subscribe', 'kadence-blocks' ), icon: formTemplateSubscribeIcon, isDisabled: false },
		// { key: 'simple', name: __( 'Simple' ), icon: tabsSimpleIcon },
		// { key: 'boldbg', name: __( 'Boldbg' ), icon: tabsBoldIcon },
		// { key: 'center', name: __( 'Center' ), icon: tabsCenterIcon },
		// { key: 'vertical', name: __( 'Vertical' ), icon: tabsVerticalIcon },
	];


	const formTemplates = applyFilters( 'kadence.formTemplates', startlayoutOptions );
	return (
		<Placeholder
			className="kb-select-or-create-placeholder"
			icon={formBlockIcon}
			label={__( 'Kadence Form', 'kadence-form' )}
		>
			<div className="kb-select-or-create-placeholder__actions">
				<TextControl
					label={__( 'Give your form a title (required)', 'kadence-blocks' )}
					placeholder={__( 'Contact Us', 'kadence-blocks' )}
					value={tmpTitle}
					onChange={setTmpTitle}
				/>
				{/* <KadenceRadioButtons
					value={ tmpTemplate  }
					options={ formTemplates }
					//wrap={true}
					//hideLabel={true}
					label={ __( 'Choose a Template', 'kadence-blocks' ) }
					className={ 'kb-form-block-template' }
					onChange={ value => {
						settmpTemplate( value );
					}}
				/> */}



				<div className="kt-select-starter-style-tabs">
					<div className="kt-select-starter-style-tabs-title">
						{ __( 'Select Initial Style' ) }
					</div>
					<ButtonGroup className="kt-init-tabs-btn-group" aria-label={ __( 'Initial Style', 'kadence-blocks' ) }>
						{ map( formTemplates, ( { name, key, icon, isDisabled } ) => (
							<Button
								key={ key }
								className="kt-inital-tabs-style-btn"
								isSmall
								onClick={ () => {
									settmpTemplate( key );
									if ( 'skip' == key && tmpTitle !== '' ) {
										onAdd( tmpTitle, key )
									}
								} }
								disabled={ isDisabled || ( 'skip' == key && tmpTitle === '' ) }
								isPressed={ tmpTemplate == key }
								label={name}
							>
								{ name }
								{ icon }
							</Button>
						) ) }
					</ButtonGroup>
				</div>


				<Button
					variant="primary"
					onClick={ () => onAdd( tmpTitle, tmpTemplate ) }
					isBusy={ isAdding }
					disabled={tmpTitle === ''}
				>
					{__( 'Create', 'kadence-blocks' )}
				</Button>
			</div>
		</Placeholder>
	);
}
