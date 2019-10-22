/**
 * BLOCK: Kadence Field Overlay
 *
 * Registering a basic block with Gutenberg.
 */

 /**
 * Import External
 */
import map from 'lodash/map';

/**
 * Import Icons
 */
import icons from '../../icons';

/**
 * Import External
 */
import classnames from 'classnames';
import times from 'lodash/times';
import filter from 'lodash/filter';
import MeasurementControls from '../../measurement-control';
import WebfontLoader from '../../fontloader';
import range from 'lodash/range';
import TypographyControls from '../../typography-control';
import hexToRGBA from '../../hex-to-rgba';
import AdvancedColorControl from '../../advanced-color-control';
import Select from 'react-select';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	RichText,
	MediaUpload,
	URLInput,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
	PlainText,
} = wp.blockEditor;
const {
	Button,
	IconButton,
	PanelBody,
	Tooltip,
	ToggleControl,
	PanelRow,
	ButtonGroup,
	TextControl,
	Dashicon,
	RangeControl,
	CheckboxControl,
	TextareaControl,
	Toolbar,
	SelectControl,
	TabPanel,
	ExternalLink,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;

const { getCurrentPostId } = wp.data.select( 'core/editor' );
const RETRIEVE_KEY_URL = 'https://g.co/recaptcha/v3';
const HELP_URL = 'https://developers.google.com/recaptcha/docs/v3';

const actionOptionsList = [
	{ value: 'email', label: __( 'Email', 'kadence-blocks' ), help: '', isDisabled: false },
	{ value: 'redirect', label: __( 'Redirect', 'kadence-blocks' ), help: '', isDisabled: false },
	//{ value: 'autoEmail', label: __( 'Auto Respond Email (Pro addon)', 'kadence-blocks' ), help: __( 'Send instant response to form entrant', 'kadence-blocks' ), isDisabled: true },
	{ value: 'entry', label: __( 'Database Entry (Pro addon)', 'kadence-blocks' ), help: __( 'Log each form submission', 'kadence-blocks' ), isDisabled: true },
];
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbFormIDs = [];
/**
 * Get settings
 */
let settings;
wp.api.loadPromise.then( () => {
	settings = new wp.api.models.Settings();
} );
/**
 * Build the overlay edit
 */
class KadenceForm extends Component {
	constructor() {
		super( ...arguments );

		this.showSettings = this.showSettings.bind( this );
		this.onSelectField = this.onSelectField.bind( this );
		this.onMoveForward = this.onMoveForward.bind( this );
		this.onMove = this.onMove.bind( this );
		this.bindContainer = this.bindContainer.bind( this );
		this.onMoveBackward = this.onMoveBackward.bind( this );
		this.onRemoveField = this.onRemoveField.bind( this );
		this.onDuplicateField = this.onDuplicateField.bind( this );
		this.deselectField = this.deselectField.bind( this );
		this.saveFields = this.saveFields.bind( this );
		this.saveSubmit = this.saveSubmit.bind( this );
		this.saveEmail = this.saveEmail.bind( this );
		this.saveStyle = this.saveStyle.bind( this );
		this.saveAutoEmail = this.saveAutoEmail.bind( this );
		this.removeAction = this.removeAction.bind( this );
		this.addAction = this.addAction.bind( this );
		this.saveKeys = this.saveKeys.bind( this );
		this.removeKeys = this.removeKeys.bind( this );

		this.state = {
			actionOptions: null,
			selectedField: null,
			marginDeskControl: 'linked',
			marginTabletControl: 'linked',
			marginMobileControl: 'linked',
			radiusControl: 'linked',
			deskPaddingControl: 'linked',
			tabletPaddingControl: 'linked',
			mobilePaddingControl: 'linked',
			borderControl: 'linked',
			siteKey: '',
			secretKey: '',
			isSavedKey: false,
			isSaving: false,
		};

		settings.fetch().then( response => {
			this.setState( {
				siteKey: response.kadence_blocks_recaptcha_site_key,
				secretKey: response.kadence_blocks_recaptcha_secret_key,
			} );
			if ( '' !== this.state.siteKey && '' !== this.state.secretKey ) {
				this.setState( { isSavedKey: true } );
			}
		} );
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbFormIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else if ( kbFormIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbFormIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else {
			kbFormIDs.push( this.props.attributes.uniqueID );
		}
		if ( ! this.props.attributes.postID ) {
			this.props.setAttributes( {
				postID: getCurrentPostId(),
			} );
		} else if ( getCurrentPostId() !== this.props.attributes.postID ) {
			this.props.setAttributes( {
				postID: getCurrentPostId(),
			} );
		}
		this.setState( { actionOptions: applyFilters( 'kadence.actionOptions', actionOptionsList ) } );
	}
	componentDidUpdate( prevProps ) {
		// Deselect field when deselecting the block
		if ( ! this.props.isSelected && prevProps.isSelected ) {
			this.setState( {
				selectedField: null,
			} );
		}
	}
	deselectField() {
		this.setState( {
			selectedField: null,
		} );
	}
	bindContainer( ref ) {
		this.container = ref;
	}
	onSelectField( index ) {
		return () => {
			if ( this.state.selectedField !== index ) {
				this.setState( {
					selectedField: index,
				} );
			}
		};
	}
	onMove( oldIndex, newIndex ) {
		const fields = [ ...this.props.attributes.fields ];
		fields.splice( newIndex, 1, this.props.attributes.fields[ oldIndex ] );
		fields.splice( oldIndex, 1, this.props.attributes.fields[ newIndex ] );
		this.setState( { selectedField: newIndex } );
		this.props.setAttributes( {
			fields: fields,
		} );
	}

	onMoveForward( oldIndex ) {
		return () => {
			if ( oldIndex === this.props.attributes.fields.length - 1 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex + 1 );
		};
	}

	onMoveBackward( oldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onMove( oldIndex, oldIndex - 1 );
		};
	}

	onRemoveField( index ) {
		return () => {
			const fields = filter( this.props.attributes.fields, ( item, i ) => index !== i );
			this.setState( { selectedField: null } );
			this.props.setAttributes( {
				fields: fields,
			} );
		};
	}
	onDuplicateField( index ) {
		return () => {
			const fields = this.props.attributes.fields;
			const duplicate = fields[ index ];
			fields.splice( index + 1, 0, duplicate );
			this.setState( { selectedField: index + 1 } );
			this.props.setAttributes( {
				fields: fields,
			} );
			this.saveFields( { multiSelect: fields[ 0 ].multiSelect }, 0 );
		};
	}
	saveFields( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { fields } = attributes;

		const newItems = fields.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			fields: newItems,
		} );
	}
	saveSubmit( value, index ) {
		const { attributes, setAttributes } = this.props;
		const { submit } = attributes;

		const newItems = submit.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			submit: newItems,
		} );
	}
	saveEmail( value ) {
		const { attributes, setAttributes } = this.props;
		const { email } = attributes;

		const newItems = email.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			email: newItems,
		} );
	}
	saveStyle( value ) {
		const { attributes, setAttributes } = this.props;
		const { style } = attributes;

		const newItems = style.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			style: newItems,
		} );
	}
	saveAutoEmail( value ) {
		const { attributes, setAttributes } = this.props;
		const { autoEmail } = attributes;

		const newItems = autoEmail.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			autoEmail: newItems,
		} );
	}
	addAction( value ) {
		const { attributes, setAttributes } = this.props;
		const { actions } = attributes;

		const newItems = actions.map( ( item, thisIndex ) => {
			return item;
		} );
		newItems.push( value );
		setAttributes( {
			actions: newItems,
		} );
	}
	removeAction( value ) {
		const { attributes, setAttributes } = this.props;
		const { actions } = attributes;
		const newItems = actions.filter( item => item !== value );
		setAttributes( {
			actions: newItems,
		} );
	}
	removeKeys() {
		this.setState( {
			siteKey: '',
			secretKey: '',
		} );
		if ( this.state.isSavedKey ) {
			this.setState( { isSaving: true } );
			const settingModel = new wp.api.models.Settings( {
				kadence_blocks_recaptcha_site_key: '',
				kadence_blocks_recaptcha_secret_key: '',
			} );
			settingModel.save().then( () => {
				this.setState( { isSavedKey: false, isSaving: false } );
			} );
		}
	}
	saveKeys() {
		this.setState( { isSaving: true } );
		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_recaptcha_site_key: this.state.siteKey,
			kadence_blocks_recaptcha_secret_key: this.state.secretKey,
		} );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, isSavedKey: true } );
		} );
	}
	render() {
		const { attributes: { uniqueID, postID, style, formName, fields, submit, actions, align, recaptcha, redirect, autoEmail, email, hAlign, kadenceAnimation, kadenceAOSOptions }, className, isSelected, setAttributes } = this.props;
		const { deskPaddingControl, tabletPaddingControl, mobilePaddingControl, borderControl } = this.state;
		const btnSizes = [
			{ key: 'small', name: __( 'S' ) },
			{ key: 'standard', name: __( 'M' ) },
			{ key: 'large', name: __( 'L' ) },
			{ key: 'custom', name: <Dashicon icon="admin-generic" /> },
		];
		const fieldControls = ( index ) => {
			const isFieldSelected = ( isSelected && this.state.selectedField === index );
			return (
				<PanelBody
					title={ ( undefined !== fields[ index ].label && null !== fields[ index ].label && '' !== fields[ index ].label ? fields[ index ].label : __( 'Field' ) + ' ' + ( index + 1 ) ) + ' ' + __( 'Settings' ) }
					initialOpen={ false }
					opened={ ( true === isFieldSelected ? true : undefined ) }
				>
					<SelectControl
						label={ __( 'Field Type' ) }
						value={ fields[ index ].type }
						options={ [
							{ value: 'text', label: __( 'Text' ) },
							{ value: 'email', label: __( 'Email' ) },
							{ value: 'textarea', label: __( 'Textarea' ) },
						] }
						onChange={ value => {
							this.saveFields( { type: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Required?' ) }
						checked={ ( undefined !== fields[ index ].required ? fields[ index ].required : false ) }
						onChange={ ( value ) => this.saveFields( { required: value }, index ) }
					/>
					{ 'textarea' === fields[ index ].type && (
						<RangeControl
							label={ __( 'Textarea Rows' ) }
							value={ ( undefined !== fields[ index ].rows ? fields[ index ].rows : '4' ) }
							onChange={ value => this.saveFields( { rows: value }, index ) }
							min={ 1 }
							max={ 100 }
							step={ 1 }
						/>
					) }
					{ 'select' === fields[ index ].type && (
						<ToggleControl
							label={ __( 'Multi?' ) }
							checked={ ( undefined !== fields[ index ].multiSelect ? fields[ index ].multiSelect : false ) }
							onChange={ ( value ) => this.saveFields( { multiSelect: value }, index ) }
						/>
					) }
					{ ( 'checkbox' === fields[ index ].type || 'radio' === fields[ index ].type ) && (
						<ToggleControl
							label={ __( 'showLabel?' ) }
							checked={ ( undefined !== fields[ index ].inline ? fields[ index ].inline : false ) }
							onChange={ ( value ) => this.saveFields( { inline: value }, index ) }
						/>
					) }
					<TextControl
						label={ __( 'Field Label' ) }
						placeholder={ __( 'Field Label' ) }
						value={ ( undefined !== fields[ index ].label ? fields[ index ].label : '' ) }
						onChange={ ( value ) => this.saveFields( { label: value }, index ) }
					/>
					<ToggleControl
						label={ __( 'Show Label' ) }
						checked={ ( undefined !== fields[ index ].showLabel ? fields[ index ].showLabel : true ) }
						onChange={ ( value ) => this.saveFields( { showLabel: value }, index ) }
					/>
					<TextControl
						label={ __( 'Field Placeholder' ) }
						value={ ( undefined !== fields[ index ].placeholder ? fields[ index ].placeholder : '' ) }
						onChange={ ( value ) => this.saveFields( { placeholder: value }, index ) }
					/>
					<TextControl
						label={ __( 'Input Default' ) }
						value={ ( undefined !== fields[ index ].default ? fields[ index ].default : '' ) }
						onChange={ ( value ) => this.saveFields( { default: value }, index ) }
					/>
					<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Column Width' ) }</h2>
					<TabPanel className="kt-size-tabs"
						activeClass="active-tab"
						tabs={ [
							{
								name: 'desk',
								title: <Dashicon icon="desktop" />,
								className: 'kt-desk-tab',
							},
							{
								name: 'tablet',
								title: <Dashicon icon="tablet" />,
								className: 'kt-tablet-tab',
							},
							{
								name: 'mobile',
								title: <Dashicon icon="smartphone" />,
								className: 'kt-mobile-tab',
							},
						] }>
						{
							( tab ) => {
								let tabout;
								if ( tab.name ) {
									if ( 'mobile' === tab.name ) {
										tabout = (
											<Fragment>
												<SelectControl
													value={ fields[ index ].width[ 2 ] }
													options={ [
														{ value: '20', label: __( '20%' ) },
														{ value: '25', label: __( '25%' ) },
														{ value: '33', label: __( '33%' ) },
														{ value: '40', label: __( '40%' ) },
														{ value: '50', label: __( '50%' ) },
														{ value: '60', label: __( '33%' ) },
														{ value: '66', label: __( '66%' ) },
														{ value: '75', label: __( '75%' ) },
														{ value: '80', label: __( '80%' ) },
														{ value: '100', label: __( '100%' ) },
														{ value: 'unset', label: __( 'Unset' ) },
													] }
													onChange={ value => {
														this.saveFields( { width: [ ( fields[ index ].width[ 0 ] ? fields[ index ].width[ 0 ] : '100' ), ( fields[ index ].width[ 1 ] ? fields[ index ].width[ 1 ] : '' ), value ] }, index );
													} }
												/>
											</Fragment>
										);
									} else if ( 'tablet' === tab.name ) {
										tabout = (
											<Fragment>
												<SelectControl
													value={ fields[ index ].width[ 1 ] }
													options={ [
														{ value: '20', label: __( '20%' ) },
														{ value: '25', label: __( '25%' ) },
														{ value: '33', label: __( '33%' ) },
														{ value: '40', label: __( '40%' ) },
														{ value: '50', label: __( '50%' ) },
														{ value: '60', label: __( '33%' ) },
														{ value: '66', label: __( '66%' ) },
														{ value: '75', label: __( '75%' ) },
														{ value: '80', label: __( '80%' ) },
														{ value: '100', label: __( '100%' ) },
														{ value: 'unset', label: __( 'Unset' ) },
													] }
													onChange={ value => {
														this.saveFields( { width: [ ( fields[ index ].width[ 0 ] ? fields[ index ].width[ 0 ] : '100' ), value, ( fields[ index ].width[ 2 ] ? fields[ index ].width[ 2 ] : '' ) ] }, index );
													} }
												/>
											</Fragment>
										);
									} else {
										tabout = (
											<Fragment>
												<SelectControl
													value={ fields[ index ].width[ 0 ] }
													options={ [
														{ value: '20', label: __( '20%' ) },
														{ value: '25', label: __( '25%' ) },
														{ value: '33', label: __( '33%' ) },
														{ value: '40', label: __( '40%' ) },
														{ value: '50', label: __( '50%' ) },
														{ value: '60', label: __( '33%' ) },
														{ value: '66', label: __( '66%' ) },
														{ value: '75', label: __( '75%' ) },
														{ value: '80', label: __( '80%' ) },
														{ value: '100', label: __( '100%' ) },
														{ value: 'unset', label: __( 'Unset' ) },
													] }
													onChange={ value => {
														this.saveFields( { width: [ value, ( fields[ index ].width[ 1 ] ? fields[ index ].width[ 1 ] : '' ), ( fields[ index ].width[ 2 ] ? fields[ index ].width[ 2 ] : '' ) ] }, index );
													} }
												/>
											</Fragment>
										);
									}
								}
								return <div>{ tabout }</div>;
							}
						}
					</TabPanel>
				</PanelBody>
			);
		};
		const renderFieldControls = (
			<Fragment>
				{ times( fields.length, n => fieldControls( n ) ) }
			</Fragment>
		);
		const fieldOutput = ( index ) => {
			const isFieldSelected = ( isSelected && this.state.selectedField === index );
			const fieldClassName = classnames( {
				'kadence-blocks-form-field': true,
				'is-selected': isFieldSelected,
				[ `input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
			} );
			const ariaLabel = sprintf( __( 'Feild %1$d of %2$d in form' ), ( index + 1 ), fields.length );
			return (
				<div
					className={ fieldClassName }
					style={ {
						width: fields[ index ].width[ 0 ] + '%',
					} }
					tabIndex="0"
					ref={ this.bindContainer }
					aria-label={ ariaLabel }
					role="button"
					onClick={ this.onSelectField( index ) }
					unstableOnFocus={ this.onSelectField( index ) }
					onKeyDown={ this.onRemoveField( index ) }
				>
					{ fields[ index ].showLabel && (
						<label htmlFor={ `kb_field_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : 'Field Label' ) } { ( fields[ index ].required ? <span className="required">*</span> : '' ) }</label>
					) }
					{ 'textarea' === fields[ index ].type && (
						<textarea name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
					) }
					{ 'textarea' !== fields[ index ].type && (
						<input name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
					) }
					{ isFieldSelected && (
						<Fragment>
							<div className="kadence-blocks-field-item-controls kadence-blocks-field-item__move-menu">
								<IconButton
									icon="arrow-up"
									onClick={ index === 0 ? undefined : this.onMoveBackward( index ) }
									className="kadence-blocks-field-item__move-backward"
									label={ __( 'Move Field Up' ) }
									aria-disabled={ index === 0 }
									disabled={ ! isFieldSelected || index === 0 }
								/>
								<IconButton
									icon="arrow-down"
									onClick={ ( index + 1 ) === fields.length ? undefined : this.onMoveForward( index ) }
									className="kadence-blocks-field-item__move-forward"
									label={ __( 'Move Field Down' ) }
									aria-disabled={ ( index + 1 ) === fields.length }
									disabled={ ! isFieldSelected || ( index + 1 ) === fields.length }
								/>
							</div>
							<div className="kadence-blocks-field-item-controls kadence-blocks-field-item__inline-menu">
								<IconButton
									icon="admin-page"
									onClick={ this.onDuplicateField( index ) }
									className="kadence-blocks-field-item__duplicate"
									label={ __( 'Duplicate Field' ) }
									disabled={ ! isFieldSelected }
								/>
								<IconButton
									icon="no-alt"
									onClick={ this.onRemoveField( index ) }
									className="kadence-blocks-field-item__remove"
									label={ __( 'Remove Field' ) }
									disabled={ ! isFieldSelected || 1 === fields.length }
								/>
							</div>
						</Fragment>
					) }
				</div>
			);
		};
		const renderFieldOutput = (
			<Fragment>
				{ times( fields.length, n => fieldOutput( n ) ) }
			</Fragment>
		);
		const actionControls = ( index ) => {
			const actionOptions = this.state.actionOptions;
			return (
				<CheckboxControl
					label={ actionOptions[ index ].label }
					help={ ( '' !== actionOptions[ index ].help ? actionOptions[ index ].help : undefined ) }
					checked={ actions.includes( actionOptions[ index ].value ) }
					disabled={ actionOptions[ index ].isDisabled }
					onChange={ ( isChecked ) => {
						if ( isChecked && ! actionOptions[ index ].isDisabled ) {
							this.addAction( actionOptions[ index ].value );
						} else {
							this.removeAction( actionOptions[ index ].value );
						}
					} }
				/>
			);
		};
		return (
			<div className={ className }>
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ hAlign }
						onChange={ value => setAttributes( { hAlign: value } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<div className={ 'components-panel__row' } style={ {
						padding: '0 16px',
					} }
					>
						<TextControl
							label={ __( 'Form Name' ) }
							value={ ( undefined !== formName ? formName : '' ) }
							onChange={ ( value ) => setAttributes( { formName: value } ) }
						/>
					</div>
					{ renderFieldControls }
					<PanelRow>
						<Button
							className="kb-add-field"
							isPrimary={ true }
							onClick={ () => {
								const newFields = fields;
								newFields.push( {
									label: '',
									showLabel: true,
									placeholder: '',
									default: '',
									rows: 4,
									options: [],
									multiSelect: false,
									inline: false,
									min: '',
									max: '',
									type: 'text',
									required: false,
									width: [ '100', '', '' ],
									auto: '',
								} );
								setAttributes( { fields: newFields } );
								this.saveFields( { multiSelect: fields[ 0 ].multiSelect }, 0 );
							} }
						>
							<Dashicon icon="plus" />
							{ __( 'Add Field' ) }
						</Button>
					</PanelRow>
					<PanelBody
						title={ __( 'Actions After Submit' ) }
						initialOpen={ false }
					>
						{ this.state.actionOptions &&
							times( this.state.actionOptions.length, n => actionControls( n ) )
						}
					</PanelBody>
					{ actions.includes( 'email' ) && (
						<PanelBody
							title={ __( 'Email Settings' ) }
							initialOpen={ false }
						>
							<TextControl
								label={ __( 'Email To Address' ) }
								placeholder={ __( 'name@example.com' ) }
								value={ ( undefined !== email[ 0 ].emailTo ? email[ 0 ].emailTo : '' ) }
								onChange={ ( value ) => this.saveEmail( { emailTo: value } ) }
							/>
							<TextControl
								label={ __( 'Email Subject' ) }
								value={ ( undefined !== email[ 0 ].subject ? email[ 0 ].subject : '' ) }
								onChange={ ( value ) => this.saveEmail( { subject: value } ) }
							/>
							<TextControl
								label={ __( 'From Email' ) }
								value={ ( undefined !== email[ 0 ].fromEmail ? email[ 0 ].fromEmail : '' ) }
								onChange={ ( value ) => this.saveEmail( { fromEmail: value } ) }
							/>
							<TextControl
								label={ __( 'From Name' ) }
								value={ ( undefined !== email[ 0 ].fromName ? email[ 0 ].fromName : '' ) }
								onChange={ ( value ) => this.saveEmail( { fromName: value } ) }
							/>
							<SelectControl
								label={ __( 'Reply To' ) }
								value={ email[ 0 ].replyTo }
								options={ [
									{ value: 'email_field', label: __( 'Email Field' ) },
									{ value: 'from_email', label: __( 'From Email' ) },
								] }
								onChange={ value => {
									this.saveEmail( { replyTo: value } );
								} }
							/>
							<TextControl
								label={ __( 'Cc' ) }
								value={ ( undefined !== email[ 0 ].cc ? email[ 0 ].cc : '' ) }
								onChange={ ( value ) => this.saveEmail( { cc: value } ) }
							/>
							<TextControl
								label={ __( 'Bcc' ) }
								value={ ( undefined !== email[ 0 ].bcc ? email[ 0 ].bcc : '' ) }
								onChange={ ( value ) => this.saveEmail( { bcc: value } ) }
							/>
							<ToggleControl
								label={ __( 'Send as HTMl email?' ) }
								help={ __( 'If off plain text is used.' ) }
								checked={ ( undefined !== email[ 0 ].html ? email[ 0 ].html : true ) }
								onChange={ ( value ) => this.saveEmail( { html: value } ) }
							/>
						</PanelBody>
					) }
					{ actions.includes( 'email2' ) && (
						<PanelBody
							title={ __( 'Auto Response Settings' ) }
							initialOpen={ false }
						>
							<TextControl
								label={ __( 'Email Subject' ) }
								value={ ( undefined !== autoEmail[ 0 ].subject ? autoEmail[ 0 ].subject : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { subject: value } ) }
							/>
							<TextareaControl
								label={ __( 'Email Message' ) }
								placeholder={ __( 'Thanks for getting in touch, we will respond within the next 24 hours.' ) }
								value={ ( undefined !== autoEmail[ 0 ].message ? autoEmail[ 0 ].message : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { message: value } ) }
							/>
							<TextControl
								label={ __( 'From Email' ) }
								value={ ( undefined !== autoEmail[ 0 ].fromEmail ? autoEmail[ 0 ].fromEmail : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { fromEmail: value } ) }
							/>
							<TextControl
								label={ __( 'From Name' ) }
								value={ ( undefined !== autoEmail[ 0 ].fromName ? autoEmail[ 0 ].fromName : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { fromName: value } ) }
							/>
							<TextControl
								label={ __( 'Reply To' ) }
								value={ ( undefined !== autoEmail[ 0 ].replyTo ? autoEmail[ 0 ].replyTo : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { replyTo: value } ) }
							/>
							<TextControl
								label={ __( 'Cc' ) }
								value={ ( undefined !== autoEmail[ 0 ].cc ? autoEmail[ 0 ].cc : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { cc: value } ) }
							/>
							<TextControl
								label={ __( 'Bcc' ) }
								value={ ( undefined !== autoEmail[ 0 ].bcc ? autoEmail[ 0 ].bcc : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { bcc: value } ) }
							/>
							<ToggleControl
								label={ __( 'Send as HTMl email?' ) }
								help={ __( 'If off plain text is used.' ) }
								checked={ ( undefined !== autoEmail[ 0 ].html ? autoEmail[ 0 ].html : true ) }
								onChange={ ( value ) => this.saveAutoEmail( { html: value } ) }
							/>
							<TextControl
								label={ __( 'Override Email to Address' ) }
								help={ __( 'By default email is sent to the email field, you can use this to override.' ) }
								value={ ( undefined !== autoEmail[ 0 ].emailTo ? autoEmail[ 0 ].emailTo : '' ) }
								onChange={ ( value ) => this.saveAutoEmail( { emailTo: value } ) }
							/>
						</PanelBody>
					) }
					{ actions.includes( 'redirect' ) && (
						<PanelBody
							title={ __( 'Redirect Settings' ) }
							initialOpen={ false }
						>
							<p className="components-base-control__label">{ __( 'Redirect to' ) }</p>
							<URLInput
								value={ redirect }
								onChange={ value=> setAttributes( { redirect: value } ) }
							/>
						</PanelBody>
					) }
					<PanelBody
						title={ __( 'Google reCAPTCHA' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Enable Google reCAPTCHA V3' ) }
							checked={ recaptcha }
							onChange={ ( value ) => setAttributes( { recaptcha: value } ) }
						/>
						{ recaptcha && (
							<Fragment>
								<p>
									<Fragment>
										<ExternalLink href={ RETRIEVE_KEY_URL }>{ __( 'Get keys' ) }</ExternalLink>
										|&nbsp;
										<ExternalLink href={ HELP_URL }>{ __( 'Get help' ) }</ExternalLink>
									</Fragment>
								</p>
								<TextControl
									label={ __( 'Site Key' ) }
									value={ this.state.siteKey }
									onChange={ value => this.setState( { siteKey: value } ) }
								/>
								<TextControl
									label={ __( 'Secret Key' ) }
									value={ this.state.secretKey }
									onChange={ value => this.setState( { secretKey: value } ) }
								/>
								<div className="components-base-control">
									<Button
										isPrimary
										onClick={ this.saveKeys }
										disabled={ '' === this.state.siteKey || '' === this.state.secretKey }
									>
										{ this.state.isSaving ? __( 'Saving' ) : __( 'Save' ) }
									</Button>
									{ this.state.isSavedKey && (
										<Fragment>
												&nbsp;
											<Button
												isDefault
												onClick={ this.removeKeys }
											>
												{ __( 'Remove' ) }
											</Button>
										</Fragment>
									) }
								</div>
							</Fragment>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Input Styles' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Show Required?' ) }
							help={ __( 'If off required asterisk is removed.' ) }
							checked={ ( undefined !== style[ 0 ].showRequired ? style[ 0 ].showRequired : true ) }
							onChange={ ( value ) => this.saveStyle( { showRequired: value } ) }
						/>
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{ __( 'Input Size' ) }</h2>
							<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Input Size' ) }>
								{ map( btnSizes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-btn-size-btn"
										isSmall
										isPrimary={ style[ 0 ].size === key }
										aria-pressed={ style[ 0 ].size === key }
										onClick={ () => this.saveStyle( { size: key } ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
						{ 'custom' === style[ 0 ].size && (
							<div className="kt-inner-sub-section">
								<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Input Padding' ) }</h2>
								<TabPanel className="kt-size-tabs"
									activeClass="active-tab"
									tabs={ [
										{
											name: 'desk',
											title: <Dashicon icon="desktop" />,
											className: 'kt-desk-tab',
										},
										{
											name: 'tablet',
											title: <Dashicon icon="tablet" />,
											className: 'kt-tablet-tab',
										},
										{
											name: 'mobile',
											title: <Dashicon icon="smartphone" />,
											className: 'kt-mobile-tab',
										},
									] }>
									{
										( tab ) => {
											let tabout;
											if ( tab.name ) {
												if ( 'mobile' === tab.name ) {
													tabout = (
														<Fragment>
															<MeasurementControls
																label={ __( 'Mobile Padding' ) }
																measurement={ style[ 0 ].mobilePadding }
																control={ mobilePaddingControl }
																onChange={ ( value ) => this.saveStyle( { mobilePadding: value } ) }
																onControl={ ( value ) => this.setState( { mobilePaddingControl: value } ) }
																min={ 0 }
																max={ 100 }
																step={ 1 }
															/>
														</Fragment>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<MeasurementControls
															label={ __( 'Tablet Padding' ) }
															measurement={ style[ 0 ].tabletPadding }
															control={ tabletPaddingControl }
															onChange={ ( value ) => this.saveStyle( { tabletPadding: value } ) }
															onControl={ ( value ) => this.setState( { tabletPaddingControl: value } ) }
															min={ 0 }
															max={ 100 }
															step={ 1 }
														/>
													);
												} else {
													tabout = (
														<MeasurementControls
															label={ __( 'Desktop Padding' ) }
															measurement={ style[ 0 ].deskPadding }
															control={ deskPaddingControl }
															onChange={ ( value ) => this.saveStyle( { deskPadding: value } ) }
															onControl={ ( value ) => this.setState( { deskPaddingControl: value } ) }
															min={ 0 }
															max={ 100 }
															step={ 1 }
														/>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
							</div>
						) }
						<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Input Colors' ) }</h2>
						<TabPanel className="kt-inspect-tabs kt-hover-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'normal',
									title: __( 'Normal', 'kadence-blocks' ),
									className: 'kt-normal-tab',
								},
								{
									name: 'focus',
									title: __( 'Focus', 'kadence-blocks' ),
									className: 'kt-focus-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'focus' === tab.name ) {
											tabout = (
												<Fragment>
													<AdvancedColorControl
														label={ __( 'Input Focus Color' ) }
														colorValue={ ( style[ 0 ].colorActive ? style[ 0 ].colorActive : '' ) }
														colorDefault={ '' }
														onColorChange={ value => {
															this.saveStyle( { colorActive: value } );
														} }
													/>
													<AdvancedColorControl
														label={ __( 'Input Focus Background' ) }
														colorValue={ ( style[ 0 ].backgroundActive ? style[ 0 ].backgroundActive : '' ) }
														colorDefault={ '' }
														onColorChange={ value => {
															this.saveStyle( { backgroundActive: value } );
														} }
														opacityValue={ style[ 0 ].backgroundActiveOpacity }
														onOpacityChange={ value => this.saveStyle( { backgroundActiveOpacity: value } ) }
													/>
													<AdvancedColorControl
														label={ __( 'Input Focus Border' ) }
														colorValue={ ( style[ 0 ].borderActive ? style[ 0 ].borderActive : '' ) }
														colorDefault={ '' }
														onColorChange={ value => {
															this.saveStyle( { borderActive: value } );
														} }
														opacityValue={ style[ 0 ].borderActiveOpacity }
														onOpacityChange={ value => this.saveStyle( { borderActiveOpacity: value } ) }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<AdvancedColorControl
														label={ __( 'Input Color' ) }
														colorValue={ ( style[ 0 ].color ? style[ 0 ].color : '' ) }
														colorDefault={ '' }
														onColorChange={ value => {
															this.saveStyle( { color: value } );
														} }
													/>
													<AdvancedColorControl
														label={ __( 'Input Background' ) }
														colorValue={ ( style[ 0 ].background ? style[ 0 ].background : '' ) }
														colorDefault={ '' }
														onColorChange={ value => {
															this.saveStyle( { background: value } );
														} }
														opacityValue={ style[ 0 ].backgroundOpacity }
														onOpacityChange={ value => this.saveStyle( { backgroundOpacity: value } ) }
													/>
													<AdvancedColorControl
														label={ __( 'Input Border' ) }
														colorValue={ ( style[ 0 ].border ? style[ 0 ].border : '' ) }
														colorDefault={ '' }
														onColorChange={ value => {
															this.saveStyle( { border: value } );
														} }
														opacityValue={ style[ 0 ].borderOpacity }
														onOpacityChange={ value => this.saveStyle( { borderOpacity: value } ) }
													/>
												</Fragment>
											);
										}
									}
									return <div>{ tabout }</div>;
								}
							}
						</TabPanel>
						<h2>{ __( 'Border Settings' ) }</h2>
						<MeasurementControls
							label={ __( 'Border Width' ) }
							measurement={ style[ 0 ].borderWidth }
							control={ borderControl }
							onChange={ ( value ) => this.saveStyle( { borderWidth: value } ) }
							onControl={ ( value ) => this.setState( { borderControl: value } ) }
							min={ 0 }
							max={ 20 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ style[ 0 ].borderRadius }
							onChange={ value => {
								this.saveStyle( { borderRadius: value } );
							} }
							min={ 0 }
							max={ 50 }
						/>
												{/*
					requiredColor: '',
					gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
					gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
					backgroundType: 'solid',
					backgroundActiveType: 'solid',
					boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
					boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ], */}
						<AdvancedColorControl
							label={ __( 'Input Color' ) }
							colorValue={ ( style[ 0 ].colorHover ? style[ 0 ].colorHover : '' ) }
							colorDefault={ '' }
							onColorChange={ value => {
								this.saveStyle( { colorHover: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Reply To' ) }
							value={ email[ 0 ].replyTo }
							options={ [
								{ value: 'email_field', label: __( 'Email Field' ) },
								{ value: 'from_email', label: __( 'From Email' ) },
							] }
							onChange={ value => {
								this.saveEmail( { replyTo: value } );
							} }
						/>
						<TextControl
							label={ __( 'Cc' ) }
							value={ ( undefined !== email[ 0 ].cc ? email[ 0 ].cc : '' ) }
							onChange={ ( value ) => this.saveEmail( { cc: value } ) }
						/>
						<TextControl
							label={ __( 'Bcc' ) }
							value={ ( undefined !== email[ 0 ].bcc ? email[ 0 ].bcc : '' ) }
							onChange={ ( value ) => this.saveEmail( { bcc: value } ) }
						/>
						<ToggleControl
							label={ __( 'Send as HTMl email?' ) }
							help={ __( 'If off plain text is used.' ) }
							checked={ ( undefined !== email[ 0 ].html ? email[ 0 ].html : true ) }
							onChange={ ( value ) => this.saveEmail( { html: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div id={ `animate-id${ uniqueID }` } className={ 'kb-form-wrap aos-animate' } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }>
					<div className={ 'kb-form' }>
						{ renderFieldOutput }
						<div
							className="kadence-blocks-form-field kb-submit-field"
							style={ {
								width: submit[ 0 ].width[ 0 ] + '%',
							} }
							tabIndex="0"
							role="button"
							onClick={ this.deselectField }
							unstableOnFocus={ this.deselectField }
							onKeyDown={ this.deselectField }
						>
							<RichText
								tagName="div"
								placeholder={ __( 'Submit' ) }
								unstableOnFocus={ this.deselectField }
								value={ submit[ 0 ].label }
								onChange={ value => {
									this.saveSubmit( { label: value }, 0 );
								} }
								allowedFormats={ [ 'core/bold', 'core/italic', 'core/strikethrough' ] }
								className={ 'kb-forms-submit' }
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default ( KadenceForm );
