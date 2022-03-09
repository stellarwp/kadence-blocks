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
 * Import External
 */
import classnames from 'classnames';
import times from 'lodash/times';
import filter from 'lodash/filter';
import debounce from 'lodash/debounce';
import MeasurementControls from '../../measurement-control';
import WebfontLoader from '../../components/typography/fontloader';
import TypographyControls from '../../components/typography/typography-control';
import BoxShadowControl from '../../components/common/box-shadow-control';
import KadenceColorOutput from '../../components/color/kadence-color-output';
import PopColorControl from '../../components/color/pop-color-control';
import ResponsiveMeasuremenuControls from '../../components/measurement/responsive-measurement-control';
import ResponsiveRangeControls from '../../components/range/responsive-range-control';
import URLInputControl from '../../components/links/link-control';
import MailerLiteControls from './mailerlite.js';
import FluentCRMControls from './fluentcrm.js';
/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
import { getWidgetIdFromBlock } from '@wordpress/widgets';
const {
	Component,
	Fragment,
} = wp.element;
const {
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
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

import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const {
	applyFilters,
} = wp.hooks;
const { DELETE } = wp.keycodes;

const RETRIEVE_KEY_URL = 'https://g.co/recaptcha/v3';
const HELP_URL = 'https://developers.google.com/recaptcha/docs/v3';

const actionOptionsList = [
	{ value: 'email', label: __( 'Email', 'kadence-blocks' ), help: '', isDisabled: false },
	{ value: 'redirect', label: __( 'Redirect', 'kadence-blocks' ), help: '', isDisabled: false },
	{ value: 'mailerlite', label: __( 'Mailerlite', 'kadence-blocks' ), help: __( 'Add User to MailerLite list', 'kadence-blocks' ), isDisabled: false },
	{ value: 'fluentCRM', label: __( 'FluentCRM', 'kadence-blocks' ), help: __( 'Add User to FluentCRM list', 'kadence-blocks' ), isDisabled: false },
	{ value: 'autoEmail', label: __( 'Auto Respond Email (Pro addon)', 'kadence-blocks' ), help: __( 'Send instant response to form entrant', 'kadence-blocks' ), isDisabled: true },
	{ value: 'entry', label: __( 'Database Entry (Pro addon)', 'kadence-blocks' ), help: __( 'Log each form submission', 'kadence-blocks' ), isDisabled: true },
	{ value: 'sendinblue', label: __( 'SendInBlue (Pro addon)', 'kadence-blocks' ), help: __( 'Add user to SendInBlue list', 'kadence-blocks' ), isDisabled: true },
	{ value: 'mailchimp', label: __( 'MailChimp (Pro addon)', 'kadence-blocks' ), help: __( 'Add user to MailChimp list', 'kadence-blocks' ), isDisabled: true },
	{ value: 'webhook', label: __( 'WebHook (Pro addon)', 'kadence-blocks' ), help: __( 'Send form information to any third party webhook', 'kadence-blocks' ), isDisabled: true },
];
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbFormIDs = [];

/**
 * Build the form edit
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
		this.onKeyRemoveField = this.onKeyRemoveField.bind( this );
		this.onDuplicateField = this.onDuplicateField.bind( this );
		this.deselectField = this.deselectField.bind( this );
		this.saveFields = this.saveFields.bind( this );
		this.saveFieldsOptions = this.saveFieldsOptions.bind( this );
		this.saveSubmit = this.saveSubmit.bind( this );
		this.saveSubmitMargin = this.saveSubmitMargin.bind( this );
		this.saveEmail = this.saveEmail.bind( this );
		this.saveStyle = this.saveStyle.bind( this );
		this.saveStyleGradient = this.saveStyleGradient.bind( this );
		this.saveStyleGradientActive = this.saveStyleGradientActive.bind( this );
		this.saveStyleBoxShadow = this.saveStyleBoxShadow.bind( this );
		this.saveStyleBoxShadowActive = this.saveStyleBoxShadowActive.bind( this );
		this.saveLabelFont = this.saveLabelFont.bind( this );
		this.saveMessageFont = this.saveMessageFont.bind( this );
		this.saveMessages = this.saveMessages.bind( this );
		this.removeAction = this.removeAction.bind( this );
		this.addAction = this.addAction.bind( this );
		this.saveKeys = this.saveKeys.bind( this );
		this.removeKeys = this.removeKeys.bind( this );
		this.onOptionMove = this.onOptionMove.bind( this );
		this.onOptionMoveUp = this.onOptionMoveUp.bind( this );
		this.onOptionMoveDown = this.onOptionMoveDown.bind( this );
		this.getID = this.getID.bind( this );

		this.state = {
			actionOptions: null,
			selectedField: null,
			deskPaddingControl: 'linked',
			tabletPaddingControl: 'linked',
			mobilePaddingControl: 'linked',
			borderControl: 'linked',
			labelPaddingControl: 'individual',
			labelMarginControl: 'individual',
			submitBorderControl: 'linked',
			submitDeskPaddingControl: 'linked',
			submitTabletPaddingControl: 'linked',
			submitMobilePaddingControl: 'linked',
			messageFontBorderControl: 'linked',
			messagePaddingControl: 'individual',
			messageMarginControl: 'individual',
			deskMarginControl: 'individual',
			tabletMarginControl: 'individual',
			mobileMarginControl: 'individual',
			siteKey: '',
			secretKey: '',
			isSavedKey: false,
			isSaving: false,
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
		};
		this.debouncedGetID = debounce( this.getID.bind( this ), 200 );
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
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			kbFormIDs.push( this.props.clientId.substr( 2, 9 ) );
		} else {
			kbFormIDs.push( this.props.attributes.uniqueID );
		}
		this.setState( { actionOptions: applyFilters( 'kadence.actionOptions', actionOptionsList ) } );
		if ( this.props.attributes.style && this.props.attributes.style[ 0 ] ) {
			if ( this.props.attributes.style[ 0 ].deskPadding[ 0 ] === this.props.attributes.style[ 0 ].deskPadding[ 1 ] && this.props.attributes.style[ 0 ].deskPadding[ 0 ] === this.props.attributes.style[ 0 ].deskPadding[ 2 ] && this.props.attributes.style[ 0 ].deskPadding[ 0 ] === this.props.attributes.style[ 0 ].deskPadding[ 3 ] ) {
				this.setState( { deskPaddingControl: 'linked' } );
			} else {
				this.setState( { deskPaddingControl: 'individual' } );
			}
			if ( this.props.attributes.style[ 0 ].tabletPadding[ 0 ] === this.props.attributes.style[ 0 ].tabletPadding[ 1 ] && this.props.attributes.style[ 0 ].tabletPadding[ 0 ] === this.props.attributes.style[ 0 ].tabletPadding[ 2 ] && this.props.attributes.style[ 0 ].tabletPadding[ 0 ] === this.props.attributes.style[ 0 ].tabletPadding[ 3 ] ) {
				this.setState( { tabletPaddingControl: 'linked' } );
			} else {
				this.setState( { tabletPaddingControl: 'individual' } );
			}
			if ( this.props.attributes.style[ 0 ].mobilePadding[ 0 ] === this.props.attributes.style[ 0 ].mobilePadding[ 1 ] && this.props.attributes.style[ 0 ].mobilePadding[ 0 ] === this.props.attributes.style[ 0 ].mobilePadding[ 2 ] && this.props.attributes.style[ 0 ].mobilePadding[ 0 ] === this.props.attributes.style[ 0 ].mobilePadding[ 3 ] ) {
				this.setState( { mobilePaddingControl: 'linked' } );
			} else {
				this.setState( { mobilePaddingControl: 'individual' } );
			}
			if ( this.props.attributes.style[ 0 ].borderWidth[ 0 ] === this.props.attributes.style[ 0 ].borderWidth[ 1 ] && this.props.attributes.style[ 0 ].borderWidth[ 0 ] === this.props.attributes.style[ 0 ].borderWidth[ 2 ] && this.props.attributes.style[ 0 ].borderWidth[ 0 ] === this.props.attributes.style[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { borderControl: 'linked' } );
			} else {
				this.setState( { borderControl: 'individual' } );
			}
		}
		if ( this.props.attributes.submit && this.props.attributes.submit[ 0 ] ) {
			if ( this.props.attributes.submit[ 0 ].deskPadding[ 0 ] === this.props.attributes.submit[ 0 ].deskPadding[ 1 ] && this.props.attributes.submit[ 0 ].deskPadding[ 0 ] === this.props.attributes.submit[ 0 ].deskPadding[ 2 ] && this.props.attributes.submit[ 0 ].deskPadding[ 0 ] === this.props.attributes.submit[ 0 ].deskPadding[ 3 ] ) {
				this.setState( { submitDeskPaddingControl: 'linked' } );
			} else {
				this.setState( { submitDeskPaddingControl: 'individual' } );
			}
			if ( this.props.attributes.submit[ 0 ].tabletPadding[ 0 ] === this.props.attributes.submit[ 0 ].tabletPadding[ 1 ] && this.props.attributes.submit[ 0 ].tabletPadding[ 0 ] === this.props.attributes.submit[ 0 ].tabletPadding[ 2 ] && this.props.attributes.submit[ 0 ].tabletPadding[ 0 ] === this.props.attributes.submit[ 0 ].tabletPadding[ 3 ] ) {
				this.setState( { submitTabletPaddingControl: 'linked' } );
			} else {
				this.setState( { submitTabletPaddingControl: 'individual' } );
			}
			if ( this.props.attributes.submit[ 0 ].mobilePadding[ 0 ] === this.props.attributes.submit[ 0 ].mobilePadding[ 1 ] && this.props.attributes.submit[ 0 ].mobilePadding[ 0 ] === this.props.attributes.submit[ 0 ].mobilePadding[ 2 ] && this.props.attributes.submit[ 0 ].mobilePadding[ 0 ] === this.props.attributes.submit[ 0 ].mobilePadding[ 3 ] ) {
				this.setState( { submitMobilePaddingControl: 'linked' } );
			} else {
				this.setState( { submitMobilePaddingControl: 'individual' } );
			}
			if ( this.props.attributes.submit[ 0 ].borderWidth[ 0 ] === this.props.attributes.submit[ 0 ].borderWidth[ 1 ] && this.props.attributes.submit[ 0 ].borderWidth[ 0 ] === this.props.attributes.submit[ 0 ].borderWidth[ 2 ] && this.props.attributes.submit[ 0 ].borderWidth[ 0 ] === this.props.attributes.submit[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { submitBorderControl: 'linked' } );
			} else {
				this.setState( { submitBorderControl: 'individual' } );
			}
		}
		if ( this.props.attributes.messageFont && this.props.attributes.messageFont[ 0 ] ) {
			if ( this.props.attributes.messageFont[ 0 ].borderWidth[ 0 ] === this.props.attributes.messageFont[ 0 ].borderWidth[ 1 ] && this.props.attributes.messageFont[ 0 ].borderWidth[ 0 ] === this.props.attributes.messageFont[ 0 ].borderWidth[ 2 ] && this.props.attributes.messageFont[ 0 ].borderWidth[ 0 ] === this.props.attributes.messageFont[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { messageFontBorderControl: 'linked' } );
			} else {
				this.setState( { messageFontBorderControl: 'individual' } );
			}
		}
		this.debouncedGetID();
		/**
		 * Get settings
		 */
		let settings;
		wp.api.loadPromise.then( () => {
			settings = new wp.api.models.Settings();
			settings.fetch().then( response => {
				this.setState( {
					siteKey: response.kadence_blocks_recaptcha_site_key,
					secretKey: response.kadence_blocks_recaptcha_secret_key,
				} );
				if ( '' !== this.state.siteKey && '' !== this.state.secretKey ) {
					this.setState( { isSavedKey: true } );
				}
			} );
		} );
	}
	getID() {
		if ( getWidgetIdFromBlock( this.props ) ) {
			if ( ! this.props.attributes.postID ) {
				this.props.setAttributes( {
					postID: getWidgetIdFromBlock( this.props ),
				} );
			} else if ( getWidgetIdFromBlock( this.props ) !== this.props.attributes.postID ) {
				this.props.setAttributes( {
					postID: getWidgetIdFromBlock( this.props ),
				} );
			}
		} else if ( wp.data.select( 'core/editor' ) ) {
			const { getCurrentPostId } = wp.data.select( 'core/editor' );
			if ( ! this.props.attributes.postID && getCurrentPostId() ) {
				this.props.setAttributes( {
					postID: getCurrentPostId().toString(),
				} );
			} else if ( getCurrentPostId() && getCurrentPostId().toString() !== this.props.attributes.postID ) {
				this.props.setAttributes( {
					postID: getCurrentPostId().toString(),
				} );
			}
		} else {
			if ( ! this.props.attributes.postID ) {
				this.props.setAttributes( {
					postID: 'block-unknown',
				} );
			}
		}
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
	onKeyRemoveField( index ) {
		const fields = filter( this.props.attributes.fields, ( item, i ) => index !== i );
		this.setState( { selectedField: null } );
		this.props.setAttributes( {
			fields: fields,
		} );
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
	saveFieldsOptions( value, index, subIndex ) {
		const { attributes } = this.props;
		const { fields } = attributes;
		const newOptions = fields[ index ].options.map( ( item, thisIndex ) => {
			if ( subIndex === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		this.saveFields( { options: newOptions }, index );
	}
	saveSubmit( value ) {
		const { attributes, setAttributes } = this.props;
		const { submit } = attributes;

		const newItems = submit.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			submit: newItems,
		} );
	}
	saveSubmitMargin( value ) {
		const { attributes, setAttributes } = this.props;
		const { submitMargin } = attributes;
		let margin;
		if ( undefined === submitMargin || ( undefined !== submitMargin && undefined === submitMargin[ 0 ] ) ) {
			margin = [ {
				desk: [ '', '', '', '' ],
				tablet: [ '', '', '', '' ],
				mobile: [ '', '', '', '' ],
				unit: 'px',
				control: 'linked',
			} ];
		} else {
			margin = submitMargin;
		}
		const newItems = margin.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			submitMargin: newItems,
		} );
	}
	saveSubmitGradient( value, index ) {
		const { attributes } = this.props;
		const { submit } = attributes;
		const newItems = submit[ 0 ].gradient.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveSubmit( { gradient: newItems } );
	}
	saveSubmitGradientHover( value, index ) {
		const { attributes } = this.props;
		const { submit } = attributes;
		const newItems = submit[ 0 ].gradientHover.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveSubmit( { gradientHover: newItems } );
	}
	saveSubmitBoxShadow( value, index ) {
		const { attributes } = this.props;
		const { submit } = attributes;
		const newItems = submit[ 0 ].boxShadow.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveSubmit( { boxShadow: newItems } );
	}
	saveSubmitBoxShadowHover( value, index ) {
		const { attributes } = this.props;
		const { submit } = attributes;
		const newItems = submit[ 0 ].boxShadowHover.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveSubmit( { boxShadowHover: newItems } );
	}
	saveSubmitFont( value ) {
		const { attributes, setAttributes } = this.props;
		const { submitFont } = attributes;

		const newItems = submitFont.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			submitFont: newItems,
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
	saveStyleGradient( value, index ) {
		const { attributes } = this.props;
		const { style } = attributes;
		const newItems = style[ 0 ].gradient.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveStyle( { gradient: newItems } );
	}
	saveStyleGradientActive( value, index ) {
		const { attributes } = this.props;
		const { style } = attributes;
		const newItems = style[ 0 ].gradientActive.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveStyle( { gradientActive: newItems } );
	}
	saveStyleBoxShadow( value, index ) {
		const { attributes } = this.props;
		const { style } = attributes;
		const newItems = style[ 0 ].boxShadow.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveStyle( { boxShadow: newItems } );
	}
	saveStyleBoxShadowActive( value, index ) {
		const { attributes } = this.props;
		const { style } = attributes;
		const newItems = style[ 0 ].boxShadowActive.map( ( item, thisIndex ) => {
			if ( index === thisIndex ) {
				item = value;
			}

			return item;
		} );
		this.saveStyle( { boxShadowActive: newItems } );
	}
	saveLabelFont( value ) {
		const { attributes, setAttributes } = this.props;
		const { labelFont } = attributes;

		const newItems = labelFont.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			labelFont: newItems,
		} );
	}
	saveMessageFont( value ) {
		const { attributes, setAttributes } = this.props;
		const { messageFont } = attributes;

		const newItems = messageFont.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			messageFont: newItems,
		} );
	}
	saveMessages( value ) {
		const { attributes, setAttributes } = this.props;
		const { messages } = attributes;

		const newItems = messages.map( ( item, thisIndex ) => {
			if ( 0 === thisIndex ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		setAttributes( {
			messages: newItems,
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
	onOptionMove( oldIndex, newIndex, fieldIndex ) {
		const fields = this.props.attributes.fields;
		const options = fields[ fieldIndex ] && fields[ fieldIndex ].options ? [ ...fields[ fieldIndex ].options ] : [];
		if ( ! options ) {
			return;
		}
		options.splice( newIndex, 1, this.props.attributes.fields[ fieldIndex ].options[ oldIndex ] );
		options.splice( oldIndex, 1, this.props.attributes.fields[ fieldIndex ].options[ newIndex ] );
		this.saveFields( { options: options }, fieldIndex );
	}

	onOptionMoveDown( oldIndex, fieldIndex ) {
		return () => {
			if ( oldIndex === this.props.attributes.fields[ fieldIndex ].options.length - 1 ) {
				return;
			}
			this.onOptionMove( oldIndex, oldIndex + 1, fieldIndex );
		};
	}

	onOptionMoveUp( oldIndex, fieldIndex ) {
		return () => {
			if ( oldIndex === 0 ) {
				return;
			}
			this.onOptionMove( oldIndex, oldIndex - 1, fieldIndex );
		};
	}
	getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
		if ( device === 'Mobile' ) {
			if ( undefined !== mobileSize && '' !== mobileSize ) {
				return mobileSize;
			} else if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		} else if ( device === 'Tablet' ) {
			if ( undefined !== tabletSize && '' !== tabletSize ) {
				return tabletSize;
			}
		}
		return desktopSize;
	}
	render() {
		const { attributes: { uniqueID, style, fields, submit, actions, align, labelFont, recaptcha, redirect, messages, messageFont, email, hAlign, honeyPot, submitFont, kadenceAnimation, kadenceAOSOptions, submitMargin, recaptchaVersion, mailerlite, fluentcrm, containerMargin, tabletContainerMargin, mobileContainerMargin, containerMarginType, submitLabel }, className, isSelected, setAttributes } = this.props;
		const { deskPaddingControl, tabletPaddingControl, mobilePaddingControl, borderControl, labelPaddingControl, labelMarginControl, submitDeskPaddingControl, submitTabletPaddingControl, submitMobilePaddingControl, submitBorderControl, messageFontBorderControl, messagePaddingControl, messageMarginControl, deskMarginControl, tabletMarginControl, mobileMarginControl } = this.state;
		const previewContainerMarginType = ( undefined !== containerMarginType ? containerMarginType : 'px' );
		const previewContainerMarginTop = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 0 ] ? containerMargin[ 0 ] : '' ), ( undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[ 0 ] ? tabletContainerMargin[ 0 ] : '' ), ( undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[ 0 ] ? mobileContainerMargin[ 0 ] : '' ) );
		const previewContainerMarginRight = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 1 ] ? containerMargin[ 1 ] : '' ), ( undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[ 1 ] ? tabletContainerMargin[ 1 ] : '' ), ( undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[ 1 ] ? mobileContainerMargin[ 1 ] : '' ) );
		const previewContainerMarginBottom = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 2 ] ? containerMargin[ 2 ] : '' ), ( undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[ 2 ] ? tabletContainerMargin[ 2 ] : '' ), ( undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[ 2 ] ? mobileContainerMargin[ 2 ] : '' ) );
		const previewContainerMarginLeft = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== containerMargin && undefined !== containerMargin[ 3 ] ? containerMargin[ 3 ] : '' ), ( undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[ 3 ] ? tabletContainerMargin[ 3 ] : '' ), ( undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[ 3 ] ? mobileContainerMargin[ 3 ] : '' ) );
		const previewRowGap = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== style[ 0 ].rowGap && '' !== style[ 0 ].rowGap ? style[ 0 ].rowGap + 'px' : '' ), ( undefined !== style[ 0 ].tabletRowGap && '' !== style[ 0 ].tabletRowGap ? style[ 0 ].tabletRowGap + 'px' : '' ), ( undefined !== style[ 0 ].mobileRowGap && '' !== style[ 0 ].mobileRowGap ? style[ 0 ].mobileRowGap + 'px' : '' ) );
		const previewGutter = this.getPreviewSize( this.props.getPreviewDevice, ( undefined !== style[ 0 ].gutter && '' !== style[ 0 ].gutter ? style[ 0 ].gutter : '' ), ( undefined !== style[ 0 ].tabletGutter && '' !== style[ 0 ].tabletGutter ? style[ 0 ].tabletGutter : '' ), ( undefined !== style[ 0 ].mobileGutter && '' !== style[ 0 ].mobileGutter ? style[ 0 ].mobileGutter : '' ) );
		const containerMarginMin = ( containerMarginType === 'em' || containerMarginType === 'rem' ? -2 : -200 );
		const containerMarginMax = ( containerMarginType === 'em' || containerMarginType === 'rem' ? 12 : 200 );
		const containerMarginStep = ( containerMarginType === 'em' || containerMarginType === 'rem' ? 0.1 : 1 );
		const saveMailerlite = ( value ) => {
			const newItems = mailerlite.map( ( item, thisIndex ) => {
				if ( 0 === thisIndex ) {
					item = { ...item, ...value };
				}

				return item;
			} );
			setAttributes( {
				mailerlite: newItems,
			} );
		};
		const saveFluentCRM = ( value ) => {
			const newItems = fluentcrm.map( ( item, thisIndex ) => {
				if ( 0 === thisIndex ) {
					item = { ...item, ...value };
				}

				return item;
			} );
			setAttributes( {
				fluentcrm: newItems,
			} );
		};
		const saveFluentCRMMap = ( value, index ) => {
			const newItems = fields.map( ( item, thisIndex ) => {
				let newString = '';
				if ( index === thisIndex ) {
					newString = value;
				} else if ( undefined !== fluentcrm[ 0 ].map && undefined !== fluentcrm[ 0 ].map[ thisIndex ] ) {
					newString = fluentcrm[ 0 ].map[ thisIndex ];
				} else {
					newString = '';
				}

				return newString;
			} );
			saveFluentCRM( { map: newItems } );
		};
		const saveMailerliteMap = ( value, index ) => {
			const newItems = fields.map( ( item, thisIndex ) => {
				let newString = '';
				if ( index === thisIndex ) {
					newString = value;
				} else if ( undefined !== mailerlite[ 0 ].map && undefined !== mailerlite[ 0 ].map[ thisIndex ] ) {
					newString = mailerlite[ 0 ].map[ thisIndex ];
				} else {
					newString = '';
				}

				return newString;
			} );
			saveMailerlite( { map: newItems } );
		};
		const btnSizes = [
			{ key: 'small', name: __( 'S', 'kadence-blocks' ) },
			{ key: 'standard', name: __( 'M', 'kadence-blocks' ) },
			{ key: 'large', name: __( 'L', 'kadence-blocks' ) },
			{ key: 'custom', name: <Dashicon icon="admin-generic" /> },
		];
		const recaptchaVersions = [
			{ key: 'v3', name: __( 'V3', 'kadence-blocks' ) },
			{ key: 'v2', name: __( 'V2', 'kadence-blocks' ) },
		];
		const btnWidths = [
			{ key: 'auto', name: __( 'Auto' ) },
			{ key: 'fixed', name: __( 'Fixed' ) },
			{ key: 'full', name: __( 'Full' ) },
		];
		const gradTypes = [
			{ key: 'linear', name: __( 'Linear', 'kadence-blocks' ) },
			{ key: 'radial', name: __( 'Radial', 'kadence-blocks' ) },
		];
		const bgType = [
			{ key: 'solid', name: __( 'Solid', 'kadence-blocks' ) },
			{ key: 'gradient', name: __( 'Gradient', 'kadence-blocks' ) },
		];
		const marginTypes = [
			{ key: 'px', name: 'px' },
			{ key: 'em', name: 'em' },
			{ key: '%', name: '%' },
			{ key: 'vh', name: 'vh' },
			{ key: 'rem', name: 'rem' },
		];
		const marginUnit = ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].unit ? submitMargin[ 0 ].unit : 'px' );
		const marginMin = ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -100 );
		const marginMax = ( marginUnit === 'em' || marginUnit === 'rem' ? 12 : 100 );
		const marginStep = ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 );
		const lgconfig = {
			google: {
				families: [ labelFont[ 0 ].family + ( labelFont[ 0 ].variant ? ':' + labelFont[ 0 ].variant : '' ) ],
			},
		};
		const lconfig = ( labelFont[ 0 ].google ? lgconfig : '' );
		const bgconfig = {
			google: {
				families: [ submitFont[ 0 ].family + ( submitFont[ 0 ].variant ? ':' + submitFont[ 0 ].variant : '' ) ],
			},
		};
		const bconfig = ( submitFont[ 0 ].google ? bgconfig : '' );
		let btnBG;
		let btnGrad;
		let btnGrad2;
		if ( undefined !== submit[ 0 ].backgroundType && 'gradient' === submit[ 0 ].backgroundType ) {
			btnGrad = ( undefined === submit[ 0 ].background ? 'rgba(255,255,255,0)' : KadenceColorOutput( submit[ 0 ].background, ( submit[ 0 ].backgroundOpacity !== undefined ? submit[ 0 ].backgroundOpacity : 1 ) ) );
			btnGrad2 = ( undefined !== submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 0 ] && '' !== submit[ 0 ].gradient[ 0 ] ? KadenceColorOutput( submit[ 0 ].gradient[ 0 ], ( undefined !== submit[ 0 ].gradient && submit[ 0 ].gradient[ 1 ] !== undefined ? submit[ 0 ].gradient[ 1 ] : 1 ) ) : KadenceColorOutput( '#999999', ( undefined !== submit[ 0 ].gradient && submit[ 0 ].gradient[ 1 ] !== undefined ? submit[ 0 ].gradient[ 1 ] : 1 ) ) );
			if ( undefined !== submit[ 0 ].gradient && 'radial' === submit[ 0 ].gradient[ 4 ] ) {
				btnBG = `radial-gradient(at ${ ( undefined === submit[ 0 ].gradient[ 6 ] ? 'center center' : submit[ 0 ].gradient[ 6 ] ) }, ${ btnGrad } ${ ( undefined === submit[ 0 ].gradient[ 2 ] ? '0' : submit[ 0 ].gradient[ 2 ] ) }%, ${ btnGrad2 } ${ ( undefined === submit[ 0 ].gradient[ 3 ] ? '100' : submit[ 0 ].gradient[ 3 ] ) }%)`;
			} else if ( undefined === submit[ 0 ].gradient || 'radial' !== submit[ 0 ].gradient[ 4 ] ) {
				btnBG = `linear-gradient(${ ( undefined !== submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 5 ] ? submit[ 0 ].gradient[ 5 ] : '180' ) }deg, ${ btnGrad } ${ ( undefined !== submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 2 ] ? submit[ 0 ].gradient[ 2 ] : '0' ) }%, ${ btnGrad2 } ${ ( undefined !== submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 3 ] ? submit[ 0 ].gradient[ 3 ] : '100' ) }%)`;
			}
		} else {
			btnBG = ( undefined === submit[ 0 ].background ? undefined : KadenceColorOutput( submit[ 0 ].background, ( submit[ 0 ].backgroundOpacity !== undefined ? submit[ 0 ].backgroundOpacity : 1 ) ) );
		}
		let inputBG;
		let inputGrad;
		let inputGrad2;
		if ( undefined !== style[ 0 ].backgroundType && 'gradient' === style[ 0 ].backgroundType ) {
			inputGrad = ( undefined === style[ 0 ].background ? 'rgba(255,255,255,0)' : KadenceColorOutput( style[ 0 ].background, ( style[ 0 ].backgroundOpacity !== undefined ? style[ 0 ].backgroundOpacity : 1 ) ) );
			inputGrad2 = ( undefined !== style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 0 ] && '' !== style[ 0 ].gradient[ 0 ] ? KadenceColorOutput( style[ 0 ].gradient[ 0 ], ( undefined !== style[ 0 ].gradient && style[ 0 ].gradient[ 1 ] !== undefined ? style[ 0 ].gradient[ 1 ] : 1 ) ) : KadenceColorOutput( '#999999', ( undefined !== style[ 0 ].gradient && style[ 0 ].gradient[ 1 ] !== undefined ? style[ 0 ].gradient[ 1 ] : 1 ) ) );
			if ( undefined !== style[ 0 ].gradient && 'radial' === style[ 0 ].gradient[ 4 ] ) {
				inputBG = `radial-gradient(at ${ ( undefined === style[ 0 ].gradient[ 6 ] ? 'center center' : style[ 0 ].gradient[ 6 ] ) }, ${ inputGrad } ${ ( undefined === style[ 0 ].gradient[ 2 ] ? '0' : style[ 0 ].gradient[ 2 ] ) }%, ${ inputGrad2 } ${ ( undefined === style[ 0 ].gradient[ 3 ] ? '100' : style[ 0 ].gradient[ 3 ] ) }%)`;
			} else if ( undefined === style[ 0 ].gradient || 'radial' !== style[ 0 ].gradient[ 4 ] ) {
				inputBG = `linear-gradient(${ ( undefined !== style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 5 ] ? style[ 0 ].gradient[ 5 ] : '180' ) }deg, ${ inputGrad } ${ ( undefined !== style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 2 ] ? style[ 0 ].gradient[ 2 ] : '0' ) }%, ${ inputGrad2 } ${ ( undefined !== style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 3 ] ? style[ 0 ].gradient[ 3 ] : '100' ) }%)`;
			}
		} else {
			inputBG = ( undefined === style[ 0 ].background ? undefined : KadenceColorOutput( style[ 0 ].background, ( style[ 0 ].backgroundOpacity !== undefined ? style[ 0 ].backgroundOpacity : 1 ) ) );
		}
		const removeOptionItem = ( previousIndex, fieldIndex ) => {
			const amount = Math.abs( fields[ fieldIndex ].options.length );
			if ( amount === 1 ) {
				return;
			}
			const currentItems = filter( fields[ fieldIndex ].options, ( item, i ) => previousIndex !== i );
			this.saveFields( { options: currentItems }, fieldIndex );
		};
		const fieldControls = ( index ) => {
			const isFieldSelected = ( isSelected && this.state.selectedField === index );
			if ( 'hidden' === fields[ index ].type ) {
				return (
					<PanelBody
						title={ ( undefined !== fields[ index ].label && null !== fields[ index ].label && '' !== fields[ index ].label ? fields[ index ].label : __( 'Field', 'kadence-blocks' ) + ' ' + ( index + 1 ) ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
						initialOpen={ false }
						key={ 'field-panel-' + index.toString() }
						opened={ ( true === isFieldSelected ? true : undefined ) }
					>
						<SelectControl
							label={ __( 'Field Type', 'kadence-blocks' ) }
							value={ fields[ index ].type }
							options={ [
								{ value: 'text', label: __( 'Text', 'kadence-blocks' ) },
								{ value: 'email', label: __( 'Email', 'kadence-blocks' ) },
								{ value: 'textarea', label: __( 'Textarea', 'kadence-blocks' ) },
								{ value: 'accept', label: __( 'Accept', 'kadence-blocks' ) },
								{ value: 'select', label: __( 'Select', 'kadence-blocks' ) },
								{ value: 'tel', label: __( 'Telephone', 'kadence-blocks' ) },
								{ value: 'checkbox', label: __( 'Checkboxes', 'kadence-blocks' ) },
								{ value: 'radio', label: __( 'Radio', 'kadence-blocks' ) },
								{ value: 'hidden', label: __( 'Hidden', 'kadence-blocks' ) },
							] }
							onChange={ value => {
								this.saveFields( { type: value }, index );
							} }
						/>
						<TextControl
							label={ __( 'Field Name', 'kadence-blocks' ) }
							placeholder={ __( 'Field Name', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].label ? fields[ index ].label : '' ) }
							onChange={ ( value ) => this.saveFields( { label: value }, index ) }
						/>
						<TextControl
							label={ __( 'Field Input', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].default ? fields[ index ].default : '' ) }
							onChange={ ( value ) => this.saveFields( { default: value }, index ) }
						/>
					</PanelBody>
				);
			}
			return (
				<PanelBody
					title={ ( undefined !== fields[ index ].label && null !== fields[ index ].label && '' !== fields[ index ].label ? fields[ index ].label : __( 'Field', 'kadence-blocks' ) + ' ' + ( index + 1 ) ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					key={ 'field-panel-' + index.toString() }
					opened={ ( true === isFieldSelected ? true : undefined ) }
				>
					<SelectControl
						label={ __( 'Field Type', 'kadence-blocks' ) }
						value={ fields[ index ].type }
						options={ [
							{ value: 'text', label: __( 'Text', 'kadence-blocks' ) },
							{ value: 'email', label: __( 'Email', 'kadence-blocks' ) },
							{ value: 'textarea', label: __( 'Textarea', 'kadence-blocks' ) },
							{ value: 'accept', label: __( 'Accept', 'kadence-blocks' ) },
							{ value: 'select', label: __( 'Select', 'kadence-blocks' ) },
							{ value: 'tel', label: __( 'Telephone', 'kadence-blocks' ) },
							{ value: 'checkbox', label: __( 'Checkboxes', 'kadence-blocks' ) },
							{ value: 'radio', label: __( 'Radio', 'kadence-blocks' ) },
							{ value: 'hidden', label: __( 'Hidden', 'kadence-blocks' ) },
						] }
						onChange={ value => {
							this.saveFields( { type: value }, index );
						} }
					/>
					<ToggleControl
						label={ __( 'Required?', 'kadence-blocks' ) }
						checked={ ( undefined !== fields[ index ].required ? fields[ index ].required : false ) }
						onChange={ ( value ) => this.saveFields( { required: value }, index ) }
					/>
					{ 'textarea' === fields[ index ].type && (
						<RangeControl
							label={ __( 'Textarea Rows', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].rows ? fields[ index ].rows : '4' ) }
							onChange={ value => this.saveFields( { rows: value }, index ) }
							min={ 1 }
							max={ 100 }
							step={ 1 }
						/>
					) }
					{ ( 'select' === fields[ index ].type || 'radio' === fields[ index ].type || 'checkbox' === fields[ index ].type ) && (
						<Fragment>
							<Fragment>
								{ times( fields[ index ].options.length, n => (
									<div className="field-options-wrap">
										
										<TextControl
											className={ 'kb-option-text-control' }
											key={ n }
											label={ __( 'Option', 'kadence-blocks' ) + ' ' + ( n + 1 ) }
											placeholder={ __( 'Option', 'kadence-blocks' ) }
											value={ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }
											onChange={ ( text ) => this.saveFieldsOptions( { label: text, value: text }, index, n ) }
										/>
										<div className="kadence-blocks-list-item__control-menu">
											<IconButton
												icon="arrow-up"
												onClick={ n === 0 ? undefined : this.onOptionMoveUp( n, index ) }
												className="kadence-blocks-list-item__move-up"
												label={ __( 'Move Item Up' ) }
												aria-disabled={ n === 0 }
												disabled={ n === 0 }
											/>
											<IconButton
												icon="arrow-down"
												onClick={ ( n + 1 ) === fields[ index ].options.length ? undefined : this.onOptionMoveDown( n, index ) }
												className="kadence-blocks-list-item__move-down"
												label={ __( 'Move Item Down' ) }
												aria-disabled={ ( n + 1 ) === fields[ index ].options.length }
												disabled={ ( n + 1 ) === fields[ index ].options.length }
											/>
											<IconButton
												icon="no-alt"
												onClick={ () => removeOptionItem( n, index ) }
												className="kadence-blocks-list-item__remove"
												label={ __( 'Remove Item' ) }
												disabled={ 1 === fields[ index ].options.length }
											/>
										</div>
									</div>
								) ) }
							</Fragment>
							<Button
								className="kb-add-option"
								isPrimary={ true }
								onClick={ () => {
									const newOptions = fields[ index ].options;
									newOptions.push( {
										value: '',
										label: '',
									} );
									this.saveFields( { options: newOptions }, index );
								} }
							>
								<Dashicon icon="plus" />
								{ __( 'Add Option', 'kadence-blocks' ) }
							</Button>
						</Fragment>
					) }
					{ 'select' === fields[ index ].type && (
						<ToggleControl
							label={ __( 'Multi Select?' ) }
							checked={ ( undefined !== fields[ index ].multiSelect ? fields[ index ].multiSelect : false ) }
							onChange={ ( value ) => this.saveFields( { multiSelect: value }, index ) }
						/>
					) }
					{ ( 'checkbox' === fields[ index ].type || 'radio' === fields[ index ].type ) && (
						<ToggleControl
							label={ __( 'Show inline?', 'kadence-blocks' ) }
							checked={ ( undefined !== fields[ index ].inline ? fields[ index ].inline : false ) }
							onChange={ ( value ) => this.saveFields( { inline: value }, index ) }
						/>
					) }
					{ ( 'accept' === fields[ index ].type ) && (
						<ToggleControl
							label={ __( 'Show Policy Link', 'kadence-blocks' ) }
							checked={ ( undefined !== fields[ index ].showLink ? fields[ index ].showLink : false ) }
							onChange={ ( value ) => this.saveFields( { showLink: value }, index ) }
						/>
					) }
					{ ( 'accept' === fields[ index ].type && fields[ index ].showLink ) && (
						<Fragment>
							<TextControl
								label={ __( 'Link Text', 'kadence-blocks' ) }
								placeholder={ __( 'View Privacy Policy', 'kadence-blocks' ) }
								value={ ( undefined !== fields[ index ].placeholder ? fields[ index ].placeholder : '' ) }
								onChange={ ( value ) => this.saveFields( { placeholder: value }, index ) }
							/>
							<URLInputControl
								label={ __( 'Link URL', 'kadence-blocks' ) }
								url={ ( undefined !== fields[ index ].default ? fields[ index ].default : '' ) }
								onChangeUrl={ ( value ) => this.saveFields( { default: value }, index ) }
								additionalControls={ false }
								{ ...this.props }
							/>
						</Fragment>
					) }
					{ ( 'accept' === fields[ index ].type ) && (
						<ToggleControl
							label={ __( 'Start checked?', 'kadence-blocks' ) }
							checked={ ( undefined !== fields[ index ].inline ? fields[ index ].inline : false ) }
							onChange={ ( value ) => this.saveFields( { inline: value }, index ) }
						/>
					) }
					<TextControl
						label={ __( 'Field Label', 'kadence-blocks' ) }
						placeholder={ __( 'Field Label', 'kadence-blocks' ) }
						value={ ( undefined !== fields[ index ].label ? fields[ index ].label : '' ) }
						onChange={ ( value ) => this.saveFields( { label: value }, index ) }
					/>
					<ToggleControl
						label={ __( 'Show Label', 'kadence-blocks' ) }
						checked={ ( undefined !== fields[ index ].showLabel ? fields[ index ].showLabel : true ) }
						onChange={ ( value ) => this.saveFields( { showLabel: value }, index ) }
					/>
					{ ( 'accept' !== fields[ index ].type || 'select' !== fields[ index ].type ) && (
						<TextControl
							label={ __( 'Field Placeholder', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].placeholder ? fields[ index ].placeholder : '' ) }
							onChange={ ( value ) => this.saveFields( { placeholder: value }, index ) }
						/>
					) }
					{ ( 'accept' !== fields[ index ].type ) && (
						<TextControl
							label={ __( 'Input Default', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].default ? fields[ index ].default : '' ) }
							onChange={ ( value ) => this.saveFields( { default: value }, index ) }
						/>
					) }
					<TextControl
						label={ __( 'Help Text', 'kadence-blocks' ) }
						value={ ( undefined !== fields[ index ].description ? fields[ index ].description : '' ) }
						onChange={ ( value ) => this.saveFields( { description: value }, index ) }
					/>
					<TextControl
							label={ __( 'Input aria description', 'kadence-blocks' ) }
							help={ __( 'Provide more context for screen readers', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].ariaLabel ? fields[ index ].ariaLabel : '' ) }
							onChange={ ( value ) => this.saveFields( { ariaLabel: value }, index ) }
						/>
					{ ( 'text' === fields[ index ].type || 'email' === fields[ index ].type || 'tel' === fields[ index ].type ) && (
						<SelectControl
							label={ __( 'Field Auto Fill', 'kadence-blocks' ) }
							value={ fields[ index ].auto }
							options={ [
								{ value: '', label: __( 'Default', 'kadence-blocks' ) },
								{ value: 'name', label: __( 'Name', 'kadence-blocks' ) },
								{ value: 'given-name', label: __( 'First Name', 'kadence-blocks' ) },
								{ value: 'family-name', label: __( 'Last Name', 'kadence-blocks' ) },
								{ value: 'email', label: __( 'Email', 'kadence-blocks' ) },
								{ value: 'organization', label: __( 'Organization', 'kadence-blocks' ) },
								{ value: 'street-address', label: __( 'Street Address', 'kadence-blocks' ) },
								{ value: 'address-line1', label: __( 'Address Line 1', 'kadence-blocks' ) },
								{ value: 'address-line2', label: __( 'Address Line 1', 'kadence-blocks' ) },
								{ value: 'country-name', label: __( 'Country Name', 'kadence-blocks' ) },
								{ value: 'postal-code', label: __( 'Postal Code', 'kadence-blocks' ) },
								{ value: 'tel', label: __( 'Telephone', 'kadence-blocks' ) },
								{ value: 'off', label: __( 'Off', 'kadence-blocks' ) },
							] }
							onChange={ value => {
								this.saveFields( { auto: value }, index );
							} }
						/>
					) }
					<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Column Width', 'kadence-blocks' ) }</h2>
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
														{ value: '20', label: __( '20%', 'kadence-blocks' ) },
														{ value: '25', label: __( '25%', 'kadence-blocks' ) },
														{ value: '33', label: __( '33%', 'kadence-blocks' ) },
														{ value: '40', label: __( '40%', 'kadence-blocks' ) },
														{ value: '50', label: __( '50%', 'kadence-blocks' ) },
														{ value: '60', label: __( '60%', 'kadence-blocks' ) },
														{ value: '66', label: __( '66%', 'kadence-blocks' ) },
														{ value: '75', label: __( '75%', 'kadence-blocks' ) },
														{ value: '80', label: __( '80%', 'kadence-blocks' ) },
														{ value: '100', label: __( '100%', 'kadence-blocks' ) },
														{ value: '', label: __( 'Unset', 'kadence-blocks' ) },
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
														{ value: '20', label: __( '20%', 'kadence-blocks' ) },
														{ value: '25', label: __( '25%', 'kadence-blocks' ) },
														{ value: '33', label: __( '33%', 'kadence-blocks' ) },
														{ value: '40', label: __( '40%', 'kadence-blocks' ) },
														{ value: '50', label: __( '50%', 'kadence-blocks' ) },
														{ value: '60', label: __( '60%', 'kadence-blocks' ) },
														{ value: '66', label: __( '66%', 'kadence-blocks' ) },
														{ value: '75', label: __( '75%', 'kadence-blocks' ) },
														{ value: '80', label: __( '80%', 'kadence-blocks' ) },
														{ value: '100', label: __( '100%', 'kadence-blocks' ) },
														{ value: '', label: __( 'Unset', 'kadence-blocks' ) },
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
														{ value: '20', label: __( '20%', 'kadence-blocks' ) },
														{ value: '25', label: __( '25%', 'kadence-blocks' ) },
														{ value: '33', label: __( '33%', 'kadence-blocks' ) },
														{ value: '40', label: __( '40%', 'kadence-blocks' ) },
														{ value: '50', label: __( '50%', 'kadence-blocks' ) },
														{ value: '60', label: __( '60%', 'kadence-blocks' ) },
														{ value: '66', label: __( '66%', 'kadence-blocks' ) },
														{ value: '75', label: __( '75%', 'kadence-blocks' ) },
														{ value: '80', label: __( '80%', 'kadence-blocks' ) },
														{ value: '100', label: __( '100%', 'kadence-blocks' ) },
														{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
													] }
													onChange={ value => {
														this.saveFields( { width: [ value, ( fields[ index ].width[ 1 ] ? fields[ index ].width[ 1 ] : '' ), ( fields[ index ].width[ 2 ] ? fields[ index ].width[ 2 ] : '' ) ] }, index );
													} }
												/>
											</Fragment>
										);
									}
								}
								return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
							}
						}
					</TabPanel>
					{ ( undefined !== fields[ index ].required ? fields[ index ].required : false ) && (
						<TextControl
							label={ __( 'Field error message when required', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].requiredMessage ? fields[ index ].requiredMessage : '' ) }
							onChange={ ( value ) => this.saveFields( { requiredMessage: value }, index ) }
							placeholder={ ( undefined !== fields[ index ].label ? fields[ index ].label : '' ) + ' ' + __( 'is required', 'kadence-blocks' ) }
						/>
					) }
					{ ( 'tel' === fields[ index ].type || 'email' === fields[ index ].type ) && (
						<TextControl
							label={ __( 'Field error message when invalid', 'kadence-blocks' ) }
							value={ ( undefined !== fields[ index ].errorMessage ? fields[ index ].errorMessage : '' ) }
							onChange={ ( value ) => this.saveFields( { errorMessage: value }, index ) }
							placeholder={ ( undefined !== fields[ index ].label ? fields[ index ].label : '' ) + ' ' + __( 'is not valid', 'kadence-blocks' ) }
						/>
					) }
				</PanelBody>
			);
		};
		const renderFieldControls = (
			<Fragment>
				{ times( fields.length, n => fieldControls( n ) ) }
			</Fragment>
		);
		const fieldOutput = ( index ) => {
			if ( 'hidden' === fields[ index ].type ) {
				return (
					<input type="hidden" name={ `kb_field_${ index }` } value={ fields[ index ].default } />
				);
			}
			const isFieldSelected = ( isSelected && this.state.selectedField === index );
			const fieldClassName = classnames( {
				'kadence-blocks-form-field': true,
				'is-selected': isFieldSelected,
				[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
			} );
			const ariaLabel = sprintf(
				/* translators: %1$d: field number %2$d: max amount of fields */
				__( 'Field %1$d of %2$d in form', 'kadence-blocks' ),
				( index + 1 ),
				fields.length
				);
			let acceptLabel;
			let acceptLabelBefore;
			let acceptLabelAfter;
			if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
				acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
				acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
				acceptLabel = (
					<Fragment>
						{ acceptLabelBefore }<a href={ ( '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
					</Fragment>
				);
			} else {
				acceptLabel = fields[ index ].label;
			}
			return (
				<div
					key={ 'field-' + index.toString() }
					className={ fieldClassName }
					style={ {
						width: ( '33' === fields[ index ].width[ 0 ] ? '33.33' : fields[ index ].width[ 0 ] ) + '%',
						marginBottom: ( previewRowGap ? previewRowGap : undefined ),
						paddingRight: ( undefined !== previewGutter && '' !== previewGutter ? ( previewGutter / 2 ) + 'px' : undefined ),
						paddingLeft: ( undefined !== previewGutter && '' !== previewGutter ? ( previewGutter / 2 ) + 'px' : undefined ),
					} }
					tabIndex="0"
					ref={ this.bindContainer }
					aria-label={ ariaLabel }
					role="button"
					onClick={ this.onSelectField( index ) }
					onFocus={ this.onSelectField( index ) }
					onKeyDown={ ( event ) => {
						const { keyCode } = event;
						if ( keyCode === DELETE ) {
							this.onKeyRemoveField( index );
						}
					} }
				>
					{ 'accept' === fields[ index ].type && (
						<Fragment>
							{ fields[ index ].showLink && (
								<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : <span className="kb-placeholder">{ 'View Privacy Policy' }</span> ) }</a>
							) }
							<input type="checkbox" name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` }value="accept" checked={ fields[ index ].inline ? true : false } style={ {
								borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
							} } />
							<label htmlFor={ `kb_field_${ index }` } style={ {
								fontWeight: labelFont[ 0 ].weight,
								fontStyle: labelFont[ 0 ].style,
								color: KadenceColorOutput( labelFont[ 0 ].color ),
								fontSize: labelFont[ 0 ].size[ 0 ] + labelFont[ 0 ].sizeType,
								lineHeight: ( labelFont[ 0 ].lineHeight && labelFont[ 0 ].lineHeight[ 0 ] ? labelFont[ 0 ].lineHeight[ 0 ] + labelFont[ 0 ].lineType : undefined ),
								letterSpacing: labelFont[ 0 ].letterSpacing + 'px',
								textTransform: ( labelFont[ 0 ].textTransform ? labelFont[ 0 ].textTransform  : undefined ),
								fontFamily: ( labelFont[ 0 ].family ? labelFont[ 0 ].family : undefined ),
								paddingTop: ( '' !== labelFont[ 0 ].padding[ 0 ] ? labelFont[ 0 ].padding[ 0 ] + 'px' : undefined ),
								paddingRight: ( '' !== labelFont[ 0 ].padding[ 1 ] ? labelFont[ 0 ].padding[ 1 ] + 'px' : undefined ),
								paddingBottom: ( '' !== labelFont[ 0 ].padding[ 2 ] ? labelFont[ 0 ].padding[ 2 ] + 'px' : undefined ),
								paddingLeft: ( '' !== labelFont[ 0 ].padding[ 3 ] ? labelFont[ 0 ].padding[ 3 ] + 'px' : undefined ),
								marginTop: ( '' !== labelFont[ 0 ].margin[ 0 ] ? labelFont[ 0 ].margin[ 0 ] + 'px' : undefined ),
								marginRight: ( '' !== labelFont[ 0 ].margin[ 1 ] ? labelFont[ 0 ].margin[ 1 ] + 'px' : undefined ),
								marginBottom: ( '' !== labelFont[ 0 ].margin[ 2 ] ? labelFont[ 0 ].margin[ 2 ] + 'px' : undefined ),
								marginLeft: ( '' !== labelFont[ 0 ].margin[ 3 ] ? labelFont[ 0 ].margin[ 3 ] + 'px' : undefined ),
							} }>{ ( fields[ index ].label ? acceptLabel : <span className="kb-placeholder">{ 'Field Label' }</span> ) } { ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required" style={ { color: KadenceColorOutput( style[ 0 ].requiredColor ) } }>*</span> : '' ) }</label>
						</Fragment>
					) }
					{ 'accept' !== fields[ index ].type && (
						<Fragment>
							{ fields[ index ].showLabel && (
								<label htmlFor={ `kb_field_${ index }` } style={ {
									fontWeight: labelFont[ 0 ].weight,
									fontStyle: labelFont[ 0 ].style,
									color: KadenceColorOutput( labelFont[ 0 ].color ),
									fontSize: labelFont[ 0 ].size[ 0 ] + labelFont[ 0 ].sizeType,
									lineHeight: ( labelFont[ 0 ].lineHeight && labelFont[ 0 ].lineHeight[ 0 ] ? labelFont[ 0 ].lineHeight[ 0 ] + labelFont[ 0 ].lineType : undefined ),
									letterSpacing: labelFont[ 0 ].letterSpacing + 'px',
									textTransform: ( labelFont[ 0 ].textTransform ? labelFont[ 0 ].textTransform  : undefined ),
									fontFamily: ( labelFont[ 0 ].family ? labelFont[ 0 ].family : undefined ),
									paddingTop: ( '' !== labelFont[ 0 ].padding[ 0 ] ? labelFont[ 0 ].padding[ 0 ] + 'px' : undefined ),
									paddingRight: ( '' !== labelFont[ 0 ].padding[ 1 ] ? labelFont[ 0 ].padding[ 1 ] + 'px' : undefined ),
									paddingBottom: ( '' !== labelFont[ 0 ].padding[ 2 ] ? labelFont[ 0 ].padding[ 2 ] + 'px' : undefined ),
									paddingLeft: ( '' !== labelFont[ 0 ].padding[ 3 ] ? labelFont[ 0 ].padding[ 3 ] + 'px' : undefined ),
									marginTop: ( '' !== labelFont[ 0 ].margin[ 0 ] ? labelFont[ 0 ].margin[ 0 ] + 'px' : undefined ),
									marginRight: ( '' !== labelFont[ 0 ].margin[ 1 ] ? labelFont[ 0 ].margin[ 1 ] + 'px' : undefined ),
									marginBottom: ( '' !== labelFont[ 0 ].margin[ 2 ] ? labelFont[ 0 ].margin[ 2 ] + 'px' : undefined ),
									marginLeft: ( '' !== labelFont[ 0 ].margin[ 3 ] ? labelFont[ 0 ].margin[ 3 ] + 'px' : undefined ),
								} }>{ ( fields[ index ].label ? fields[ index ].label : <span className="kb-placeholder">{ 'Field Label' }</span> ) } { ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required" style={ { color: KadenceColorOutput( style[ 0 ].requiredColor ) } }>*</span> : '' ) }</label>
							) }
							{ 'textarea' === fields[ index ].type && (
								<textarea name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } readOnly style={ {
									paddingTop: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 0 ] ? style[ 0 ].deskPadding[ 0 ] + 'px' : undefined ),
									paddingRight: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 1 ] ? style[ 0 ].deskPadding[ 1 ] + 'px' : undefined ),
									paddingBottom: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 2 ] ? style[ 0 ].deskPadding[ 2 ] + 'px' : undefined ),
									paddingLeft: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 3 ] ? style[ 0 ].deskPadding[ 3 ] + 'px' : undefined ),
									background: ( undefined !== inputBG ? inputBG : undefined ),
									color: ( undefined !== style[ 0 ].color ? KadenceColorOutput( style[ 0 ].color ) : undefined ),
									fontSize: ( style[ 0 ].fontSize && style[ 0 ].fontSize[ 0 ] ? style[ 0 ].fontSize[ 0 ] + style[ 0 ].fontSizeType : undefined ),
									lineHeight: ( style[ 0 ].lineHeight && style[ 0 ].lineHeight[ 0 ] ? style[ 0 ].lineHeight[ 0 ] + style[ 0 ].lineType : undefined ),
									borderRadius: ( undefined !== style[ 0 ].borderRadius ? style[ 0 ].borderRadius + 'px' : undefined ),
									borderTopWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 0 ] ? style[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
									borderRightWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 1 ] ? style[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
									borderBottomWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 2 ] ? style[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
									borderLeftWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 3 ] ? style[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
									borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
									boxShadow: ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 0 ] && style[ 0 ].boxShadow[ 0 ] ? ( undefined !== style[ 0 ].boxShadow[ 7 ] && style[ 0 ].boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== style[ 0 ].boxShadow[ 3 ] ? style[ 0 ].boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 4 ] ? style[ 0 ].boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 5 ] ? style[ 0 ].boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 6 ] ? style[ 0 ].boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== style[ 0 ].boxShadow[ 1 ] ? style[ 0 ].boxShadow[ 1 ] : '#000000' ), ( undefined !== style[ 0 ].boxShadow[ 2 ] ? style[ 0 ].boxShadow[ 2 ] : 1 ) ) : undefined ),
								} } />
							) }
							{ 'select' === fields[ index ].type && (
								<select name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } type={ fields[ index ].type } data-type={ fields[ index ].type } multiple={ ( fields[ index ].multiSelect ? true : false ) } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } style={ {
									background: ( undefined !== inputBG ? inputBG : undefined ),
									color: ( undefined !== style[ 0 ].color ? KadenceColorOutput( style[ 0 ].color ) : undefined ),
									fontSize: ( style[ 0 ].fontSize && style[ 0 ].fontSize[ 0 ] ? style[ 0 ].fontSize[ 0 ] + style[ 0 ].fontSizeType : undefined ),
									lineHeight: ( style[ 0 ].lineHeight && style[ 0 ].lineHeight[ 0 ] ? style[ 0 ].lineHeight[ 0 ] + style[ 0 ].lineType : undefined ),
									borderRadius: ( undefined !== style[ 0 ].borderRadius ? style[ 0 ].borderRadius + 'px' : undefined ),
									borderTopWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 0 ] ? style[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
									borderRightWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 1 ] ? style[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
									borderBottomWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 2 ] ? style[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
									borderLeftWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 3 ] ? style[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
									borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
									boxShadow: ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 0 ] && style[ 0 ].boxShadow[ 0 ] ? ( undefined !== style[ 0 ].boxShadow[ 7 ] && style[ 0 ].boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== style[ 0 ].boxShadow[ 3 ] ? style[ 0 ].boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 4 ] ? style[ 0 ].boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 5 ] ? style[ 0 ].boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 6 ] ? style[ 0 ].boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== style[ 0 ].boxShadow[ 1 ] ? style[ 0 ].boxShadow[ 1 ] : '#000000' ), ( undefined !== style[ 0 ].boxShadow[ 2 ] ? style[ 0 ].boxShadow[ 2 ] : 1 ) ) : undefined ),
								} } >
									{ undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder && (
										<option
											value=""
											disabled={ true }
											selected={ '' === fields[ index ].default ? true : false }
										>
											{ fields[ index ].placeholder }
										</option>
									) }
									{ times( fields[ index ].options.length, n => (
										<option
											key={ n }
											selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
											value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
										>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
									) ) }
								</select>
							) }
							{ 'checkbox' === fields[ index ].type && (
								<div data-type={ fields[ index ].type } className={ `kb-field kb-checkbox-style-field kb-${ fields[ index ].type }-field kb-field-${ index } kb-radio-style-${ fields[ index ].inline ? 'inline' : 'normal' }` }>
									{ times( fields[ index ].options.length, n => (
										<div key={ n } data-type={ fields[ index ].type } className={ `kb-checkbox-item kb-checkbox-item-${ n }` }>
											<input type="checkbox" name={ `kb_field_${ index }[]${ n }` } id={ `kb_field_${ index }[]${ n }` } className={ 'kb-sub-field kb-checkbox-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } style={ {
												borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
											} } />
											<label htmlFor={ `kb_field_${ index }[]${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
										</div>
									) ) }
								</div>
							) }
							{ 'radio' === fields[ index ].type && (
								<div data-type={ fields[ index ].type } className={ `kb-field kb-radio-style-field kb-${ fields[ index ].type }-field kb-field-${ index } kb-radio-style-${ fields[ index ].inline ? 'inline' : 'normal' }` }>
									{ times( fields[ index ].options.length, n => (
										<div key={ n } data-type={ fields[ index ].type } className={ `kb-radio-item kb-radio-item-${ n }` }>
											<input type="radio" name={ `kb_field_${ index }[]${ n }` } id={ `kb_field_${ index }[]${ n }` } className={ 'kb-sub-field kb-radio-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } style={ {
												borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
											} } />
											<label htmlFor={ `kb_field_${ index }[]${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
										</div>
									) ) }
								</div>
							) }
							{ 'email' === fields[ index ].type && (
								<input
									name={ `kb_field_${ index }` }
									id={ `kb_field_${ index }` }
									type={ 'text' }
									readOnly
									placeholder={ fields[ index ].placeholder }
									value={ fields[ index ].default }
									data-type={ fields[ index ].type }
									className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` }
									autoComplete="off"
									data-required={ ( fields[ index ].required ? 'yes' : undefined ) }
									style={ {
										paddingTop: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 0 ] ? style[ 0 ].deskPadding[ 0 ] + 'px' : undefined ),
										paddingRight: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 1 ] ? style[ 0 ].deskPadding[ 1 ] + 'px' : undefined ),
										paddingBottom: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 2 ] ? style[ 0 ].deskPadding[ 2 ] + 'px' : undefined ),
										paddingLeft: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 3 ] ? style[ 0 ].deskPadding[ 3 ] + 'px' : undefined ),
										background: ( undefined !== inputBG ? inputBG : undefined ),
										color: ( undefined !== style[ 0 ].color ? KadenceColorOutput( style[ 0 ].color ) : undefined ),
										fontSize: ( style[ 0 ].fontSize && style[ 0 ].fontSize[ 0 ] ? style[ 0 ].fontSize[ 0 ] + style[ 0 ].fontSizeType : undefined ),
										lineHeight: ( style[ 0 ].lineHeight && style[ 0 ].lineHeight[ 0 ] ? style[ 0 ].lineHeight[ 0 ] + style[ 0 ].lineType : undefined ),
										borderRadius: ( undefined !== style[ 0 ].borderRadius ? style[ 0 ].borderRadius + 'px' : undefined ),
										borderTopWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 0 ] ? style[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
										borderRightWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 1 ] ? style[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
										borderBottomWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 2 ] ? style[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
										borderLeftWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 3 ] ? style[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
										borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
										boxShadow: ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 0 ] && style[ 0 ].boxShadow[ 0 ] ? ( undefined !== style[ 0 ].boxShadow[ 7 ] && style[ 0 ].boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== style[ 0 ].boxShadow[ 3 ] ? style[ 0 ].boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 4 ] ? style[ 0 ].boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 5 ] ? style[ 0 ].boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 6 ] ? style[ 0 ].boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== style[ 0 ].boxShadow[ 1 ] ? style[ 0 ].boxShadow[ 1 ] : '#000000' ), ( undefined !== style[ 0 ].boxShadow[ 2 ] ? style[ 0 ].boxShadow[ 2 ] : 1 ) ) : undefined ),
									} }
								/>
							) }
							{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && 'checkbox' !== fields[ index ].type && 'radio' !== fields[ index ].type && 'email' !== fields[ index ].type && (
								<input
									name={ `kb_field_${ index }` }
									id={ `kb_field_${ index }` }
									type={ fields[ index ].type }
									placeholder={ fields[ index ].placeholder }
									value={ fields[ index ].default }
									data-type={ fields[ index ].type }
									className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` }
									autoComplete="off"
									readOnly
									data-required={ ( fields[ index ].required ? 'yes' : undefined ) }
									style={ {
										paddingTop: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 0 ] ? style[ 0 ].deskPadding[ 0 ] + 'px' : undefined ),
										paddingRight: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 1 ] ? style[ 0 ].deskPadding[ 1 ] + 'px' : undefined ),
										paddingBottom: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 2 ] ? style[ 0 ].deskPadding[ 2 ] + 'px' : undefined ),
										paddingLeft: ( 'custom' === style[ 0 ].size && '' !== style[ 0 ].deskPadding[ 3 ] ? style[ 0 ].deskPadding[ 3 ] + 'px' : undefined ),
										background: ( undefined !== inputBG ? inputBG : undefined ),
										color: ( undefined !== style[ 0 ].color ? KadenceColorOutput( style[ 0 ].color ) : undefined ),
										fontSize: ( style[ 0 ].fontSize && style[ 0 ].fontSize[ 0 ] ? style[ 0 ].fontSize[ 0 ] + style[ 0 ].fontSizeType : undefined ),
										lineHeight: ( style[ 0 ].lineHeight && style[ 0 ].lineHeight[ 0 ] ? style[ 0 ].lineHeight[ 0 ] + style[ 0 ].lineType : undefined ),
										borderRadius: ( undefined !== style[ 0 ].borderRadius ? style[ 0 ].borderRadius + 'px' : undefined ),
										borderTopWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 0 ] ? style[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
										borderRightWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 1 ] ? style[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
										borderBottomWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 2 ] ? style[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
										borderLeftWidth: ( style[ 0 ].borderWidth && '' !== style[ 0 ].borderWidth[ 3 ] ? style[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
										borderColor: ( undefined === style[ 0 ].border ? undefined : KadenceColorOutput( style[ 0 ].border, ( style[ 0 ].borderOpacity !== undefined ? style[ 0 ].borderOpacity : 1 ) ) ),
										boxShadow: ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 0 ] && style[ 0 ].boxShadow[ 0 ] ? ( undefined !== style[ 0 ].boxShadow[ 7 ] && style[ 0 ].boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== style[ 0 ].boxShadow[ 3 ] ? style[ 0 ].boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 4 ] ? style[ 0 ].boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 5 ] ? style[ 0 ].boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== style[ 0 ].boxShadow[ 6 ] ? style[ 0 ].boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== style[ 0 ].boxShadow[ 1 ] ? style[ 0 ].boxShadow[ 1 ] : '#000000' ), ( undefined !== style[ 0 ].boxShadow[ 2 ] ? style[ 0 ].boxShadow[ 2 ] : 1 ) ) : undefined ),
									} }
								/>
							) }
						</Fragment>
					) }
					{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
						<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
					) }
					{ isFieldSelected && (
						<Fragment>
							<div className="kadence-blocks-field-item-controls kadence-blocks-field-item__move-menu">
								<IconButton
									icon="arrow-up"
									onClick={ index === 0 ? undefined : this.onMoveBackward( index ) }
									className="kadence-blocks-field-item__move-backward"
									label={ __( 'Move Field Up', 'kadence-blocks' ) }
									aria-disabled={ index === 0 }
									disabled={ ! isFieldSelected || index === 0 }
								/>
								<IconButton
									icon="arrow-down"
									onClick={ ( index + 1 ) === fields.length ? undefined : this.onMoveForward( index ) }
									className="kadence-blocks-field-item__move-forward"
									label={ __( 'Move Field Down', 'kadence-blocks' ) }
									aria-disabled={ ( index + 1 ) === fields.length }
									disabled={ ! isFieldSelected || ( index + 1 ) === fields.length }
								/>
							</div>
							<div className="kadence-blocks-field-item-controls kadence-blocks-field-item__inline-menu">
								<IconButton
									icon="admin-page"
									onClick={ this.onDuplicateField( index ) }
									className="kadence-blocks-field-item__duplicate"
									label={ __( 'Duplicate Field', 'kadence-blocks' ) }
									disabled={ ! isFieldSelected }
								/>
								<IconButton
									icon="no-alt"
									onClick={ this.onRemoveField( index ) }
									className="kadence-blocks-field-item__remove"
									label={ __( 'Remove Field', 'kadence-blocks' ) }
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
					key={ 'action-controls-' + index.toString() }
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
		const renderCSS = () => {
			let inputBGA = '';
			let inputGradA;
			let inputGradA2;
			let inputBox = '';
			let btnHBG = '';
			let btnHBGnorm;
			let btnHGrad;
			let btnHGrad2;
			let btnHBox = '';
			let btnRad = '0';
			let btnBox2 = '';
			if ( undefined !== style[ 0 ].backgroundActiveType && 'gradient' === style[ 0 ].backgroundActiveType && undefined !== style[ 0 ].gradientActive ) {
				inputGradA = ( undefined === style[ 0 ].backgroundActive ? KadenceColorOutput( '#ffffff', ( style[ 0 ].backgroundActiveOpacity !== undefined ? style[ 0 ].backgroundActiveOpacity : 1 ) ) : KadenceColorOutput( style[ 0 ].backgroundActive, ( style[ 0 ].backgroundActiveOpacity !== undefined ? style[ 0 ].backgroundActiveOpacity : 1 ) ) );
				inputGradA2 = ( undefined === style[ 0 ].gradientActive[ 0 ] ? KadenceColorOutput( '#777777', ( style[ 0 ].gradientActive[ 1 ] !== undefined ? style[ 0 ].gradientActive[ 1 ] : 1 ) ) : KadenceColorOutput( style[ 0 ].gradientActive[ 0 ], ( style[ 0 ].gradientActive[ 1 ] !== undefined ? style[ 0 ].gradientActive[ 1 ] : 1 ) ) );
				if ( 'radial' === style[ 0 ].gradientActive[ 4 ] ) {
					inputBGA = `radial-gradient(at ${ ( undefined === style[ 0 ].gradientActive[ 6 ] ? 'center center' : style[ 0 ].gradientActive[ 6 ] ) }, ${ inputGradA } ${ ( undefined === style[ 0 ].gradientActive[ 2 ] ? '0' : style[ 0 ].gradientActive[ 2 ] ) }%, ${ inputGradA2 } ${ ( undefined === style[ 0 ].gradientActive[ 3 ] ? '100' : style[ 0 ].gradientActive[ 3 ] ) }%)`;
				} else if ( 'linear' === style[ 0 ].gradientActive[ 4 ] ) {
					inputBGA = `linear-gradient(${ ( undefined === style[ 0 ].gradientActive[ 5 ] ? '180' : style[ 0 ].gradientActive[ 5 ] ) }deg, ${ inputGradA } ${ ( undefined === style[ 0 ].gradientActive[ 2 ] ? '0' : style[ 0 ].gradientActive[ 2 ] ) }%, ${ inputGradA2 } ${ ( undefined === style[ 0 ].gradientActive[ 3 ] ? '100' : style[ 0 ].gradientActive[ 3 ] ) }%)`;
				}
			} else if ( undefined !== style[ 0 ].backgroundActive && '' !== style[ 0 ].backgroundActive ) {
				inputBGA = KadenceColorOutput( style[ 0 ].backgroundActive, ( style[ 0 ].backgroundActiveOpacity !== undefined ? style[ 0 ].backgroundActiveOpacity : 1 ) );
			}
			if ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 0 ] && style[ 0 ].boxShadowActive[ 0 ] ) {
				inputBox = `${ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 0 ] && style[ 0 ].boxShadowActive[ 0 ] ? ( undefined !== style[ 0 ].boxShadowActive[ 7 ] && style[ 0 ].boxShadowActive[ 7 ] ? 'inset ' : '' ) + ( undefined !== style[ 0 ].boxShadowActive[ 3 ] ? style[ 0 ].boxShadowActive[ 3 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadowActive[ 4 ] ? style[ 0 ].boxShadowActive[ 4 ] : 1 ) + 'px ' + ( undefined !== style[ 0 ].boxShadowActive[ 5 ] ? style[ 0 ].boxShadowActive[ 5 ] : 2 ) + 'px ' + ( undefined !== style[ 0 ].boxShadowActive[ 6 ] ? style[ 0 ].boxShadowActive[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== style[ 0 ].boxShadowActive[ 1 ] ? style[ 0 ].boxShadowActive[ 1 ] : '#000000' ), ( undefined !== style[ 0 ].boxShadowActive[ 2 ] ? style[ 0 ].boxShadowActive[ 2 ] : 1 ) ) : undefined ) }`;
			}
			if ( undefined !== submit[ 0 ].backgroundHoverType && 'gradient' === submit[ 0 ].backgroundHoverType && undefined !== submit[ 0 ].gradientHover ) {
				btnHGrad = ( undefined === submit[ 0 ].backgroundHover ? KadenceColorOutput( '#ffffff', ( submit[ 0 ].backgroundHoverOpacity !== undefined ? submit[ 0 ].backgroundHoverOpacity : 1 ) ) : KadenceColorOutput( submit[ 0 ].backgroundHover, ( submit[ 0 ].backgroundHoverOpacity !== undefined ? submit[ 0 ].backgroundHoverOpacity : 1 ) ) );
				btnHGrad2 = ( undefined === submit[ 0 ].gradientHover[ 0 ] ? KadenceColorOutput( '#777777', ( submit[ 0 ].gradientHover[ 1 ] !== undefined ? submit[ 0 ].gradientHover[ 1 ] : 1 ) ) : KadenceColorOutput( submit[ 0 ].gradientHover[ 0 ], ( submit[ 0 ].gradientHover[ 1 ] !== undefined ? submit[ 0 ].gradientHover[ 1 ] : 1 ) ) );
				if ( 'radial' === submit[ 0 ].gradientHover[ 4 ] ) {
					btnHBG = `radial-gradient(at ${ ( undefined === submit[ 0 ].gradientHover[ 6 ] ? 'center center' : submit[ 0 ].gradientHover[ 6 ] ) }, ${ btnHGrad } ${ ( undefined === submit[ 0 ].gradientHover[ 2 ] ? '0' : submit[ 0 ].gradientHover[ 2 ] ) }%, ${ btnHGrad2 } ${ ( undefined === submit[ 0 ].gradientHover[ 3 ] ? '100' : submit[ 0 ].gradientHover[ 3 ] ) }%)`;
				} else if ( 'linear' === submit[ 0 ].gradientHover[ 4 ] ) {
					btnHBG = `linear-gradient(${ ( undefined === submit[ 0 ].gradientHover[ 5 ] ? '180' : submit[ 0 ].gradientHover[ 5 ] ) }deg, ${ btnHGrad } ${ ( undefined === submit[ 0 ].gradientHover[ 2 ] ? '0' : submit[ 0 ].gradientHover[ 2 ] ) }%, ${ btnHGrad2 } ${ ( undefined === submit[ 0 ].gradientHover[ 3 ] ? '100' : submit[ 0 ].gradientHover[ 3 ] ) }%)`;
				}
			} else if ( undefined !== submit[ 0 ].backgroundHover && '' !== submit[ 0 ].backgroundHover ) {
				btnHBGnorm = KadenceColorOutput( submit[ 0 ].backgroundHover, ( submit[ 0 ].backgroundHoverOpacity !== undefined ? submit[ 0 ].backgroundHoverOpacity : 1 ) );
			}
			if ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 0 ] && submit[ 0 ].boxShadowHover[ 0 ] && undefined !== submit[ 0 ].boxShadowHover[ 7 ] && false === submit[ 0 ].boxShadowHover[ 7 ] ) {
				btnHBox = `${ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 0 ] && submit[ 0 ].boxShadowHover[ 0 ] ? ( undefined !== submit[ 0 ].boxShadowHover[ 7 ] && submit[ 0 ].boxShadowHover[ 7 ] ? 'inset ' : '' ) + ( undefined !== submit[ 0 ].boxShadowHover[ 3 ] ? submit[ 0 ].boxShadowHover[ 3 ] : 1 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadowHover[ 4 ] ? submit[ 0 ].boxShadowHover[ 4 ] : 1 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadowHover[ 5 ] ? submit[ 0 ].boxShadowHover[ 5 ] : 2 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadowHover[ 6 ] ? submit[ 0 ].boxShadowHover[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== submit[ 0 ].boxShadowHover[ 1 ] ? submit[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( undefined !== submit[ 0 ].boxShadowHover[ 2 ] ? submit[ 0 ].boxShadowHover[ 2 ] : 1 ) ) : undefined ) }`;
				btnBox2 = 'none';
				btnRad = '0';
			}
			if ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 0 ] && submit[ 0 ].boxShadowHover[ 0 ] && undefined !== submit[ 0 ].boxShadowHover[ 7 ] && true === submit[ 0 ].boxShadowHover[ 7 ] ) {
				btnBox2 = `${ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 0 ] && submit[ 0 ].boxShadowHover[ 0 ] ? ( undefined !== submit[ 0 ].boxShadowHover[ 7 ] && submit[ 0 ].boxShadowHover[ 7 ] ? 'inset ' : '' ) + ( undefined !== submit[ 0 ].boxShadowHover[ 3 ] ? submit[ 0 ].boxShadowHover[ 3 ] : 1 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadowHover[ 4 ] ? submit[ 0 ].boxShadowHover[ 4 ] : 1 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadowHover[ 5 ] ? submit[ 0 ].boxShadowHover[ 5 ] : 2 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadowHover[ 6 ] ? submit[ 0 ].boxShadowHover[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== submit[ 0 ].boxShadowHover[ 1 ] ? submit[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( undefined !== submit[ 0 ].boxShadowHover[ 2 ] ? submit[ 0 ].boxShadowHover[ 2 ] : 1 ) ) : undefined ) }`;
				btnRad = ( undefined !== submit[ 0 ].borderRadius ? submit[ 0 ].borderRadius : undefined );
				btnHBox = 'none';
			}
			return (
				`#kb-form-${ uniqueID } .kadence-blocks-form-field input.kb-field:focus, #kb-form-${ uniqueID } .kadence-blocks-form-field textarea:focus {
					${ ( style[ 0 ].colorActive ? 'color:' + KadenceColorOutput( style[ 0 ].colorActive ) + '!important;' : '' ) }
					${ ( inputBGA ? 'background:' + inputBGA + '!important;' : '' ) }
					${ ( inputBox ? 'box-shadow:' + inputBox + '!important;' : '' ) }
					${ ( style[ 0 ].borderActive ? 'border-color:' + KadenceColorOutput( style[ 0 ].borderActive ) + '!important;' : '' ) }
				}
				#kb-form-${ uniqueID } .kadence-blocks-form-field .kb-forms-submit:hover {
					${ ( submit[ 0 ].colorHover ? 'color:' + KadenceColorOutput( submit[ 0 ].colorHover ) + '!important;' : '' ) }
					${ ( btnHBGnorm ? 'background:' + btnHBGnorm + '!important;' : '' ) }
					${ ( btnHBox ? 'box-shadow:' + btnHBox + '!important;' : '' ) }
					${ ( submit[ 0 ].borderHover ? 'border-color:' + KadenceColorOutput( submit[ 0 ].borderHover ) + '!important;' : '' ) }
				}
				#kb-form-${ uniqueID } .kadence-blocks-form-field .kb-forms-submit::before {
					${ ( btnHBG ? 'background:' + btnHBG + ';' : '' ) }
					${ ( btnBox2 ? 'box-shadow:' + btnBox2 + ';' : '' ) }
					${ ( btnRad ? 'border-radius:' + btnRad + 'px;' : '' ) }
				}`
			);
		};
		return (
			<div className={ className }>
				<style>
					{ renderCSS() }
				</style>
				{ labelFont[ 0 ].google && (
					<WebfontLoader config={ lconfig }>
					</WebfontLoader>
				) }
				{ submitFont[ 0 ].google && (
					<WebfontLoader config={ bconfig }>
					</WebfontLoader>
				) }
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ hAlign }
						onChange={ value => setAttributes( { hAlign: value } ) }
					/>
				</BlockControls>
				<InspectorControls>
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
									showLink: false,
									min: '',
									max: '',
									type: 'text',
									required: false,
									width: [ '100', '', '' ],
									auto: '',
									errorMessage: '',
									requiredMessage: '',
								} );
								setAttributes( { fields: newFields } );
								this.saveFields( { multiSelect: fields[ 0 ].multiSelect }, 0 );
							} }
						>
							<Dashicon icon="plus" />
							{ __( 'Add Field', 'kadence-blocks' ) }
						</Button>
					</PanelRow>
					<PanelBody
						title={ __( 'Actions After Submit', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						{ this.state.actionOptions &&
							times( this.state.actionOptions.length, n => actionControls( n ) )
						}
					</PanelBody>
					{ actions.includes( 'email' ) && (
						<PanelBody
							title={ __( 'Email Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<TextControl
								label={ __( 'Email To Address', 'kadence-blocks' ) }
								placeholder={ __( 'name@example.com', 'kadence-blocks' ) }
								value={ ( undefined !== email[ 0 ].emailTo ? email[ 0 ].emailTo : '' ) }
								onChange={ ( value ) => this.saveEmail( { emailTo: value } ) }
								help={ __( 'Seperate with comma for more then one email address.', 'kadence-blocks' ) }
							/>
							<TextControl
								label={ __( 'Email Subject', 'kadence-blocks' ) }
								value={ ( undefined !== email[ 0 ].subject ? email[ 0 ].subject : '' ) }
								onChange={ ( value ) => this.saveEmail( { subject: value } ) }
							/>
							<TextControl
								label={ __( 'From Email', 'kadence-blocks' ) }
								value={ ( undefined !== email[ 0 ].fromEmail ? email[ 0 ].fromEmail : '' ) }
								onChange={ ( value ) => this.saveEmail( { fromEmail: value } ) }
							/>
							<TextControl
								label={ __( 'From Name', 'kadence-blocks' ) }
								value={ ( undefined !== email[ 0 ].fromName ? email[ 0 ].fromName : '' ) }
								onChange={ ( value ) => this.saveEmail( { fromName: value } ) }
							/>
							<SelectControl
								label={ __( 'Reply To', 'kadence-blocks' ) }
								value={ email[ 0 ].replyTo }
								options={ [
									{ value: 'email_field', label: __( 'Email Field', 'kadence-blocks' ) },
									{ value: 'from_email', label: __( 'From Email', 'kadence-blocks' ) },
								] }
								onChange={ value => {
									this.saveEmail( { replyTo: value } );
								} }
							/>
							<TextControl
								label={ __( 'Cc', 'kadence-blocks' ) }
								value={ ( undefined !== email[ 0 ].cc ? email[ 0 ].cc : '' ) }
								onChange={ ( value ) => this.saveEmail( { cc: value } ) }
							/>
							<TextControl
								label={ __( 'Bcc', 'kadence-blocks' ) }
								value={ ( undefined !== email[ 0 ].bcc ? email[ 0 ].bcc : '' ) }
								onChange={ ( value ) => this.saveEmail( { bcc: value } ) }
							/>
							<ToggleControl
								label={ __( 'Send as HTML email?', 'kadence-blocks' ) }
								help={ __( 'If off plain text is used.', 'kadence-blocks' ) }
								checked={ ( undefined !== email[ 0 ].html ? email[ 0 ].html : true ) }
								onChange={ ( value ) => this.saveEmail( { html: value } ) }
							/>
						</PanelBody>
					) }
					{ actions.includes( 'redirect' ) && (
						<PanelBody
							title={ __( 'Redirect Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<URLInputControl
								label={ __( 'Redirect to', 'kadence-blocks' ) }
								url={ redirect }
								onChangeUrl={ value=> setAttributes( { redirect: value } ) }
								additionalControls={ false }
								{ ...this.props }
							/>
						</PanelBody>
					) }
					<PanelBody
						title={ __( 'Basic Spam Check', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Enable Basic Honey Pot Spam Check', 'kadence-blocks' ) }
							help={ __( 'This adds a hidden field that if filled out prevents the form from submitting.', 'kadence-blocks' ) }
							checked={ honeyPot }
							onChange={ ( value ) => setAttributes( { honeyPot: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Google reCAPTCHA', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __( 'Enable Google reCAPTCHA', 'kadence-blocks' ) }
							checked={ recaptcha }
							onChange={ ( value ) => setAttributes( { recaptcha: value } ) }
						/>
						{ recaptcha && (
							<Fragment>
								<div className="kt-btn-recaptch-settings-container components-base-control">
									<p className="kb-component-label">{ __( 'Recaptcha Version', 'kadence-blocks' ) }</p>
									<ButtonGroup className="kb-radio-button-flex-fill" aria-label={ __( 'Recaptcha Version', 'kadence-blocks' ) }>
										{ map( recaptchaVersions, ( { name, key } ) => (
											<Button
												key={ key }
												className="kt-btn-size-btn"
												isSmall
												isPrimary={ recaptchaVersion === key }
												aria-pressed={ recaptchaVersion === key }
												onClick={ () => setAttributes( { recaptchaVersion: key } ) }
											>
												{ name }
											</Button>
										) ) }
									</ButtonGroup>
								</div>
								<p>
									<Fragment>
										<ExternalLink href={ RETRIEVE_KEY_URL }>{ __( 'Get keys', 'kadence-blocks' ) }</ExternalLink>
										|&nbsp;
										<ExternalLink href={ HELP_URL }>{ __( 'Get help', 'kadence-blocks' ) }</ExternalLink>
									</Fragment>
								</p>
								<TextControl
									label={ __( 'Site Key', 'kadence-blocks' ) }
									value={ this.state.siteKey }
									onChange={ value => this.setState( { siteKey: value } ) }
								/>
								<TextControl
									label={ __( 'Secret Key', 'kadence-blocks' ) }
									value={ this.state.secretKey }
									onChange={ value => this.setState( { secretKey: value } ) }
								/>
								<div className="components-base-control">
									<Button
										isPrimary
										onClick={ this.saveKeys }
										disabled={ '' === this.state.siteKey || '' === this.state.secretKey }
									>
										{ this.state.isSaving ? __( 'Saving', 'kadence-blocks' ) : __( 'Save', 'kadence-blocks' ) }
									</Button>
									{ this.state.isSavedKey && (
										<Fragment>
												&nbsp;
											<Button
												isDefault
												onClick={ this.removeKeys }
											>
												{ __( 'Remove', 'kadence-blocks' ) }
											</Button>
										</Fragment>
									) }
								</div>
							</Fragment>
						) }
					</PanelBody>
					<PanelBody
						title={ __( 'Field Styles', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<TypographyControls
							fontSize={ style[ 0 ].fontSize }
							onFontSize={ ( value ) => this.saveStyle( { fontSize: value } ) }
							fontSizeType={ style[ 0 ].fontSizeType }
							onFontSizeType={ ( value ) => this.saveStyle( { fontSizeType: value } ) }
							lineHeight={ style[ 0 ].lineHeight }
							onLineHeight={ ( value ) => this.saveStyle( { lineHeight: value } ) }
							lineHeightType={ style[ 0 ].lineType }
							onLineHeightType={ ( value ) => this.saveStyle( { lineType: value } ) }
						/>
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{ __( 'Input Size' ) }</h2>
							<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Input Size', 'kadence-blocks' ) }>
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
								<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Input Padding', 'kadence-blocks' ) }</h2>
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
																label={ __( 'Mobile Padding', 'kadence-blocks' ) }
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
															label={ __( 'Tablet Padding', 'kadence-blocks' ) }
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
															label={ __( 'Desktop Padding', 'kadence-blocks' ) }
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
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</div>
						) }
						<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Input Colors', 'kadence-blocks' ) }</h2>
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
													<PopColorControl
														label={ __( 'Input Focus Color', 'kadence-blocks' ) }
														value={ ( style[ 0 ].colorActive ? style[ 0 ].colorActive : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveStyle( { colorActive: value } );
														} }
													/>
													<div className="kt-btn-size-settings-container">
														<h2 className="kt-beside-btn-group">{ __( 'Background Type', 'kadence-blocks' ) }</h2>
														<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type', 'kadence-blocks' ) }>
															{ map( bgType, ( { name, key } ) => (
																<Button
																	key={ key }
																	className="kt-btn-size-btn"
																	isSmall
																	isPrimary={ ( undefined !== style[ 0 ].backgroundActiveType ? style[ 0 ].backgroundActiveType : 'solid' ) === key }
																	aria-pressed={ ( undefined !== style[ 0 ].backgroundActiveType ? style[ 0 ].backgroundActiveType : 'solid' ) === key }
																	onClick={ () => this.saveStyle( { backgroundActiveType: key } ) }
																>
																	{ name }
																</Button>
															) ) }
														</ButtonGroup>
													</div>
													{ 'gradient' !== style[ 0 ].backgroundActiveType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Input Focus Background', 'kadence-blocks' ) }
																value={ ( style[ 0 ].backgroundActive ? style[ 0 ].backgroundActive : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveStyle( { backgroundActive: value } );
																} }
																opacityValue={ style[ 0 ].backgroundActiveOpacity }
																onOpacityChange={ value => this.saveStyle( { backgroundActiveOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveStyle( { backgroundActive: color, backgroundActiveOpacity: opacity } ) }
															/>
														</div>
													) }
													{ 'gradient' === style[ 0 ].backgroundActiveType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Gradient Color 1', 'kadence-blocks' ) }
																value={ ( style[ 0 ].backgroundActive ? style[ 0 ].backgroundActive : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveStyle( { backgroundActive: value } );
																} }
																opacityValue={ style[ 0 ].backgroundActiveOpacity }
																onOpacityChange={ value => this.saveStyle( { backgroundActiveOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveStyle( { backgroundActive: color, backgroundActiveOpacity: opacity } ) }
															/>
															<RangeControl
																label={ __( 'Location', 'kadence-blocks' ) }
																value={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 2 ] ? style[ 0 ].gradientActive[ 2 ] : 0 ) }
																onChange={ ( value ) => {
																	this.saveStyleGradientActive( value, 2 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<PopColorControl
																label={ __( 'Gradient Color 2', 'kadence-blocks' ) }
																value={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 0 ] ? style[ 0 ].gradientActive[ 0 ] : '#999999' ) }
																default={ '#999999' }
																opacityValue={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 1 ] ? style[ 0 ].gradientActive[ 1 ] : 1 ) }
																onChange={ value => {
																	this.saveStyleGradientActive( value, 0 );
																} }
																onOpacityChange={ value => {
																	this.saveStyleGradientActive( value, 1 );
																} }
															/>
															<RangeControl
																label={ __( 'Location' ) }
																value={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 3 ] ? style[ 0 ].gradientActive[ 3 ] : 100 ) }
																onChange={ ( value ) => {
																	this.saveStyleGradientActive( value, 3 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<div className="kt-btn-size-settings-container">
																<h2 className="kt-beside-btn-group">{ __( 'Gradient Type', 'kadence-blocks' ) }</h2>
																<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type', 'kadence-blocks' ) }>
																	{ map( gradTypes, ( { name, key } ) => (
																		<Button
																			key={ key }
																			className="kt-btn-size-btn"
																			isSmall
																			isPrimary={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 4 ] ? style[ 0 ].gradientActive[ 4 ] : 'linear' ) === key }
																			aria-pressed={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 4 ] ? style[ 0 ].gradientActive[ 4 ] : 'linear' ) === key }
																			onClick={ () => {
																				this.saveStyleGradientActive( key, 4 );
																			} }
																		>
																			{ name }
																		</Button>
																	) ) }
																</ButtonGroup>
															</div>
															{ 'radial' !== ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 4 ] ? style[ 0 ].gradientActive[ 4 ] : 'linear' ) && (
																<RangeControl
																	label={ __( 'Gradient Angle', 'kadence-blocks' ) }
																	value={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 5 ] ? style[ 0 ].gradientActive[ 5 ] : 180 ) }
																	onChange={ ( value ) => {
																		this.saveStyleGradientActive( value, 5 );
																	} }
																	min={ 0 }
																	max={ 360 }
																/>
															) }
															{ 'radial' === ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 4 ] ? style[ 0 ].gradientActive[ 4 ] : 'linear' ) && (
																<SelectControl
																	label={ __( 'Gradient Position', 'kadence-blocks' ) }
																	value={ ( style[ 0 ].gradientActive && undefined !== style[ 0 ].gradientActive[ 6 ] ? style[ 0 ].gradientActive[ 6 ] : 'center center' ) }
																	options={ [
																		{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
																		{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
																		{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
																		{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
																		{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
																		{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
																		{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
																		{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
																		{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
																	] }
																	onChange={ value => {
																		this.saveStyleGradientActive( value, 6 );
																	} }
																/>
															) }
														</div>
													) }
													<PopColorControl
														label={ __( 'Input Focus Border', 'kadence-blocks' ) }
														value={ ( style[ 0 ].borderActive ? style[ 0 ].borderActive : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveStyle( { borderActive: value } );
														} }
														opacityValue={ style[ 0 ].borderActiveOpacity }
														onOpacityChange={ value => this.saveStyle( { borderActiveOpacity: value } ) }
														onArrayChange={ ( color, opacity ) => this.saveStyle( { borderActive: color, borderActiveOpacity: opacity } ) }
													/>
													<BoxShadowControl
														label={ __( 'Input Focus Box Shadow', 'kadence-blocks' ) }
														enable={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 0 ] ? style[ 0 ].boxShadowActive[ 0 ] : false ) }
														color={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 1 ] ? style[ 0 ].boxShadowActive[ 1 ] : '#000000' ) }
														default={ '#000000' }
														opacity={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 2 ] ? style[ 0 ].boxShadowActive[ 2 ] : 0.4 ) }
														hOffset={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 3 ] ? style[ 0 ].boxShadowActive[ 3 ] : 2 ) }
														vOffset={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 4 ] ? style[ 0 ].boxShadowActive[ 4 ] : 2 ) }
														blur={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 5 ] ? style[ 0 ].boxShadowActive[ 5 ] : 3 ) }
														spread={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 6 ] ? style[ 0 ].boxShadowActive[ 6 ] : 0 ) }
														inset={ ( undefined !== style[ 0 ].boxShadowActive && undefined !== style[ 0 ].boxShadowActive[ 7 ] ? style[ 0 ].boxShadowActive[ 7 ] : false ) }
														onEnableChange={ value => {
															this.saveStyleBoxShadowActive( value, 0 );
														} }
														onColorChange={ value => {
															this.saveStyleBoxShadowActive( value, 1 );
														} }
														onOpacityChange={ value => {
															this.saveStyleBoxShadowActive( value, 2 );
														} }
														onHOffsetChange={ value => {
															this.saveStyleBoxShadowActive( value, 3 );
														} }
														onVOffsetChange={ value => {
															this.saveStyleBoxShadowActive( value, 4 );
														} }
														onBlurChange={ value => {
															this.saveStyleBoxShadowActive( value, 5 );
														} }
														onSpreadChange={ value => {
															this.saveStyleBoxShadowActive( value, 6 );
														} }
														onInsetChange={ value => {
															this.saveStyleBoxShadowActive( value, 7 );
														} }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<PopColorControl
														label={ __( 'Input Color', 'kadence-blocks' ) }
														value={ ( style[ 0 ].color ? style[ 0 ].color : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveStyle( { color: value } );
														} }
													/>
													<div className="kt-btn-size-settings-container">
														<h2 className="kt-beside-btn-group">{ __( 'Background Type', 'kadence-blocks' ) }</h2>
														<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type', 'kadence-blocks' ) }>
															{ map( bgType, ( { name, key } ) => (
																<Button
																	key={ key }
																	className="kt-btn-size-btn"
																	isSmall
																	isPrimary={ ( undefined !== style[ 0 ].backgroundType ? style[ 0 ].backgroundType : 'solid' ) === key }
																	aria-pressed={ ( undefined !== style[ 0 ].backgroundType ? style[ 0 ].backgroundType : 'solid' ) === key }
																	onClick={ () => this.saveStyle( { backgroundType: key } ) }
																>
																	{ name }
																</Button>
															) ) }
														</ButtonGroup>
													</div>
													{ 'gradient' !== style[ 0 ].backgroundType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Input Background', 'kadence-blocks' ) }
																value={ ( style[ 0 ].background ? style[ 0 ].background : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveStyle( { background: value } );
																} }
																opacityValue={ style[ 0 ].backgroundOpacity }
																onOpacityChange={ value => this.saveStyle( { backgroundOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveStyle( { background: color, backgroundOpacity: opacity } ) }
															/>
														</div>
													) }
													{ 'gradient' === style[ 0 ].backgroundType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Gradient Color 1', 'kadence-blocks' ) }
																value={ ( style[ 0 ].background ? style[ 0 ].background : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveStyle( { background: value } );
																} }
																opacityValue={ style[ 0 ].backgroundOpacity }
																onOpacityChange={ value => this.saveStyle( { backgroundOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveStyle( { background: color, backgroundOpacity: opacity } ) }
															/>
															<RangeControl
																label={ __( 'Location', 'kadence-blocks' ) }
																value={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 2 ] ? style[ 0 ].gradient[ 2 ] : 0 ) }
																onChange={ ( value ) => {
																	this.saveStyleGradient( value, 2 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<PopColorControl
																label={ __( 'Gradient Color 2', 'kadence-blocks' ) }
																value={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 0 ] ? style[ 0 ].gradient[ 0 ] : '#999999' ) }
																default={ '#999999' }
																opacityValue={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 1 ] ? style[ 0 ].gradient[ 1 ] : 1 ) }
																onChange={ value => {
																	this.saveStyleGradient( value, 0 );
																} }
																onOpacityChange={ value => {
																	this.saveStyleGradient( value, 1 );
																} }
															/>
															<RangeControl
																label={ __( 'Location', 'kadence-blocks' ) }
																value={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 3 ] ? style[ 0 ].gradient[ 3 ] : 100 ) }
																onChange={ ( value ) => {
																	this.saveStyleGradient( value, 3 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<div className="kt-btn-size-settings-container">
																<h2 className="kt-beside-btn-group">{ __( 'Gradient Type', 'kadence-blocks' ) }</h2>
																<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type', 'kadence-blocks' ) }>
																	{ map( gradTypes, ( { name, key } ) => (
																		<Button
																			key={ key }
																			className="kt-btn-size-btn"
																			isSmall
																			isPrimary={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 4 ] ? style[ 0 ].gradient[ 4 ] : 'linear' ) === key }
																			aria-pressed={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 4 ] ? style[ 0 ].gradient[ 4 ] : 'linear' ) === key }
																			onClick={ () => {
																				this.saveStyleGradient( key, 4 );
																			} }
																		>
																			{ name }
																		</Button>
																	) ) }
																</ButtonGroup>
															</div>
															{ 'radial' !== ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 4 ] ? style[ 0 ].gradient[ 4 ] : 'linear' ) && (
																<RangeControl
																	label={ __( 'Gradient Angle', 'kadence-blocks' ) }
																	value={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 5 ] ? style[ 0 ].gradient[ 5 ] : 180 ) }
																	onChange={ ( value ) => {
																		this.saveStyleGradient( value, 5 );
																	} }
																	min={ 0 }
																	max={ 360 }
																/>
															) }
															{ 'radial' === ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 4 ] ? style[ 0 ].gradient[ 4 ] : 'linear' ) && (
																<SelectControl
																	label={ __( 'Gradient Position', 'kadence-blocks' ) }
																	value={ ( style[ 0 ].gradient && undefined !== style[ 0 ].gradient[ 6 ] ? style[ 0 ].gradient[ 6 ] : 'center center' ) }
																	options={ [
																		{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
																		{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
																		{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
																		{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
																		{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
																		{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
																		{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
																		{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
																		{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
																	] }
																	onChange={ value => {
																		this.saveStyleGradient( value, 6 );
																	} }
																/>
															) }
														</div>
													) }
													<PopColorControl
														label={ __( 'Input Border', 'kadence-blocks' ) }
														value={ ( style[ 0 ].border ? style[ 0 ].border : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveStyle( { border: value } );
														} }
														opacityValue={ style[ 0 ].borderOpacity }
														onOpacityChange={ value => this.saveStyle( { borderOpacity: value } ) }
														onArrayChange={ ( color, opacity ) => this.saveStyle( { border: color, borderOpacity: opacity } ) }
													/>
													<BoxShadowControl
														label={ __( 'Input Box Shadow', 'kadence-blocks' ) }
														enable={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 0 ] ? style[ 0 ].boxShadow[ 0 ] : false ) }
														color={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 1 ] ? style[ 0 ].boxShadow[ 1 ] : '#000000' ) }
														default={ '#000000' }
														opacity={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 2 ] ? style[ 0 ].boxShadow[ 2 ] : 0.4 ) }
														hOffset={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 3 ] ? style[ 0 ].boxShadow[ 3 ] : 2 ) }
														vOffset={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 4 ] ? style[ 0 ].boxShadow[ 4 ] : 2 ) }
														blur={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 5 ] ? style[ 0 ].boxShadow[ 5 ] : 3 ) }
														spread={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 6 ] ? style[ 0 ].boxShadow[ 6 ] : 0 ) }
														inset={ ( undefined !== style[ 0 ].boxShadow && undefined !== style[ 0 ].boxShadow[ 7 ] ? style[ 0 ].boxShadow[ 7 ] : false ) }
														onEnableChange={ value => {
															this.saveStyleBoxShadow( value, 0 );
														} }
														onColorChange={ value => {
															this.saveStyleBoxShadow( value, 1 );
														} }
														onOpacityChange={ value => {
															this.saveStyleBoxShadow( value, 2 );
														} }
														onHOffsetChange={ value => {
															this.saveStyleBoxShadow( value, 3 );
														} }
														onVOffsetChange={ value => {
															this.saveStyleBoxShadow( value, 4 );
														} }
														onBlurChange={ value => {
															this.saveStyleBoxShadow( value, 5 );
														} }
														onSpreadChange={ value => {
															this.saveStyleBoxShadow( value, 6 );
														} }
														onInsetChange={ value => {
															this.saveStyleBoxShadow( value, 7 );
														} }
													/>
												</Fragment>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
						<h2>{ __( 'Border Settings', 'kadence-blocks' ) }</h2>
						<MeasurementControls
							label={ __( 'Border Width', 'kadence-blocks' ) }
							measurement={ style[ 0 ].borderWidth }
							control={ borderControl }
							onChange={ ( value ) => this.saveStyle( { borderWidth: value } ) }
							onControl={ ( value ) => this.setState( { borderControl: value } ) }
							min={ 0 }
							max={ 20 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Border Radius', 'kadence-blocks' ) }
							value={ style[ 0 ].borderRadius }
							onChange={ value => {
								this.saveStyle( { borderRadius: value } );
							} }
							min={ 0 }
							max={ 50 }
						/>
						<ResponsiveRangeControls
							label={ __( 'Field Row Gap', 'kadence-blocks' ) }
							value={ ( undefined !== style[ 0 ].rowGap ? style[ 0 ].rowGap : '' ) }
							onChange={ value => {
								this.saveStyle( { rowGap: value } );
							} }
							tabletValue={ ( undefined !== style[ 0 ].tabletRowGap ? style[ 0 ].tabletRowGap : '' ) }
							onChangeTablet={ value => {
								this.saveStyle( { tabletRowGap: value } );
							} }
							mobileValue={ ( undefined !== style[ 0 ].mobileRowGap ? style[ 0 ].mobileRowGap : '' ) }
							onChangeMobile={ value => {
								this.saveStyle( { mobileRowGap: value } );
							} }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							showUnit={ true }
							unit={ 'px' }
							units={ [ 'px' ] }
						/>
						<ResponsiveRangeControls
							label={ __( 'Field Column Gutter', 'kadence-blocks' ) }
							value={ ( undefined !== style[ 0 ].gutter ? style[ 0 ].gutter : '' ) }
							onChange={ value => {
								this.saveStyle( { gutter: value } );
							} }
							tabletValue={ ( undefined !== style[ 0 ].tabletGutter ? style[ 0 ].tabletGutter : '' ) }
							onChangeTablet={ value => {
								this.saveStyle( { tabletGutter: value } );
							} }
							mobileValue={ ( undefined !== style[ 0 ].mobileGutter ? style[ 0 ].mobileGutter : '' ) }
							onChangeMobile={ value => {
								this.saveStyle( { mobileGutter: value } );
							} }
							min={ 0 }
							max={ 50 }
							step={ 2 }
							showUnit={ true }
							unit={ 'px' }
							units={ [ 'px' ] }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Label Styles', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<PopColorControl
							label={ __( 'Label Color', 'kadence-blocks' ) }
							value={ ( labelFont[ 0 ].color ? labelFont[ 0 ].color : '' ) }
							default={ '' }
							onChange={ value => {
								this.saveLabelFont( { color: value } );
							} }
						/>
						<ToggleControl
							label={ __( 'Show Required?', 'kadence-blocks' ) }
							help={ __( 'If off required asterisk is removed.', 'kadence-blocks' ) }
							checked={ ( undefined !== style[ 0 ].showRequired ? style[ 0 ].showRequired : true ) }
							onChange={ ( value ) => this.saveStyle( { showRequired: value } ) }
						/>
						{ style[ 0 ].showRequired && (
							<PopColorControl
								label={ __( 'Required Color', 'kadence-blocks' ) }
								value={ ( style[ 0 ].requiredColor ? style[ 0 ].requiredColor : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveStyle( { requiredColor: value } );
								} }
							/>
						) }
						<TypographyControls
							fontSize={ labelFont[ 0 ].size }
							onFontSize={ ( value ) => this.saveLabelFont( { size: value } ) }
							fontSizeType={ labelFont[ 0 ].sizeType }
							onFontSizeType={ ( value ) => this.saveLabelFont( { sizeType: value } ) }
							lineHeight={ labelFont[ 0 ].lineHeight }
							onLineHeight={ ( value ) => this.saveLabelFont( { lineHeight: value } ) }
							lineHeightType={ labelFont[ 0 ].lineType }
							onLineHeightType={ ( value ) => this.saveLabelFont( { lineType: value } ) }
						/>
						<PanelBody
							title={ __( 'Advanced Label Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<TypographyControls
								letterSpacing={ labelFont[ 0 ].letterSpacing }
								onLetterSpacing={ ( value ) => this.saveLabelFont( { letterSpacing: value } ) }
								textTransform={ labelFont[ 0 ].textTransform }
								onTextTransform={ ( value ) => this.saveLabelFont( { textTransform: value } ) }
								fontFamily={ labelFont[ 0 ].family }
								onFontFamily={ ( value ) => this.saveLabelFont( { family: value } ) }
								onFontChange={ ( select ) => {
									this.saveLabelFont( {
										family: select.value,
										google: select.google,
									} );
								} }
								onFontArrayChange={ ( values ) => this.saveLabelFont( values ) }
								googleFont={ labelFont[ 0 ].google }
								onGoogleFont={ ( value ) => this.saveLabelFont( { google: value } ) }
								loadGoogleFont={ labelFont[ 0 ].loadGoogle }
								onLoadGoogleFont={ ( value ) => this.saveLabelFont( { loadGoogle: value } ) }
								fontVariant={ labelFont[ 0 ].variant }
								onFontVariant={ ( value ) => this.saveLabelFont( { variant: value } ) }
								fontWeight={ labelFont[ 0 ].weight }
								onFontWeight={ ( value ) => this.saveLabelFont( { weight: value } ) }
								fontStyle={ labelFont[ 0 ].style }
								onFontStyle={ ( value ) => this.saveLabelFont( { style: value } ) }
								fontSubset={ labelFont[ 0 ].subset }
								onFontSubset={ ( value ) => this.saveLabelFont( { subset: value } ) }
								padding={ labelFont[ 0 ].padding }
								onPadding={ ( value ) => this.saveLabelFont( { padding: value } ) }
								paddingControl={ labelPaddingControl }
								onPaddingControl={ ( value ) => this.setState( { labelPaddingControl: value } ) }
								margin={ labelFont[ 0 ].margin }
								onMargin={ ( value ) => this.saveLabelFont( { margin: value } ) }
								marginControl={ labelMarginControl }
								onMarginControl={ ( value ) => this.setState( { labelMarginControl: value } ) }
							/>
						</PanelBody>
					</PanelBody>
					<PanelBody
						title={ __( 'Submit Styles', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Column Width', 'kadence-blocks' ) }</h2>
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
														value={ submit[ 0 ].width[ 2 ] }
														options={ [
															{ value: '20', label: __( '20%', 'kadence-blocks' ) },
															{ value: '25', label: __( '25%', 'kadence-blocks' ) },
															{ value: '33', label: __( '33%', 'kadence-blocks' ) },
															{ value: '40', label: __( '40%', 'kadence-blocks' ) },
															{ value: '50', label: __( '50%', 'kadence-blocks' ) },
															{ value: '60', label: __( '60%', 'kadence-blocks' ) },
															{ value: '66', label: __( '66%', 'kadence-blocks' ) },
															{ value: '75', label: __( '75%', 'kadence-blocks' ) },
															{ value: '80', label: __( '80%', 'kadence-blocks' ) },
															{ value: '100', label: __( '100%', 'kadence-blocks' ) },
															{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
														] }
														onChange={ value => {
															this.saveSubmit( { width: [ ( submit[ 0 ].width[ 0 ] ? submit[ 0 ].width[ 0 ] : '100' ), ( submit[ 0 ].width[ 1 ] ? submit[ 0 ].width[ 1 ] : '' ), value ] } );
														} }
													/>
												</Fragment>
											);
										} else if ( 'tablet' === tab.name ) {
											tabout = (
												<Fragment>
													<SelectControl
														value={ submit[ 0 ].width[ 1 ] }
														options={ [
															{ value: '20', label: __( '20%', 'kadence-blocks' ) },
															{ value: '25', label: __( '25%', 'kadence-blocks' ) },
															{ value: '33', label: __( '33%', 'kadence-blocks' ) },
															{ value: '40', label: __( '40%', 'kadence-blocks' ) },
															{ value: '50', label: __( '50%', 'kadence-blocks' ) },
															{ value: '60', label: __( '60%', 'kadence-blocks' ) },
															{ value: '66', label: __( '66%', 'kadence-blocks' ) },
															{ value: '75', label: __( '75%', 'kadence-blocks' ) },
															{ value: '80', label: __( '80%', 'kadence-blocks' ) },
															{ value: '100', label: __( '100%', 'kadence-blocks' ) },
															{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
														] }
														onChange={ value => {
															this.saveSubmit( { width: [ ( submit[ 0 ].width[ 0 ] ? submit[ 0 ].width[ 0 ] : '100' ), value, ( submit[ 0 ].width[ 2 ] ? submit[ 0 ].width[ 2 ] : '' ) ] } );
														} }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<SelectControl
														value={ submit[ 0 ].width[ 0 ] }
														options={ [
															{ value: '20', label: __( '20%', 'kadence-blocks' ) },
															{ value: '25', label: __( '25%', 'kadence-blocks' ) },
															{ value: '33', label: __( '33%', 'kadence-blocks' ) },
															{ value: '40', label: __( '40%', 'kadence-blocks' ) },
															{ value: '50', label: __( '50%', 'kadence-blocks' ) },
															{ value: '60', label: __( '60%', 'kadence-blocks' ) },
															{ value: '66', label: __( '66%', 'kadence-blocks' ) },
															{ value: '75', label: __( '75%', 'kadence-blocks' ) },
															{ value: '80', label: __( '80%', 'kadence-blocks' ) },
															{ value: '100', label: __( '100%', 'kadence-blocks' ) },
															{ value: 'unset', label: __( 'Unset', 'kadence-blocks' ) },
														] }
														onChange={ value => {
															this.saveSubmit( { width: [ value, ( submit[ 0 ].width[ 1 ] ? submit[ 0 ].width[ 1 ] : '' ), ( submit[ 0 ].width[ 2 ] ? submit[ 0 ].width[ 2 ] : '' ) ] } );
														} }
													/>
												</Fragment>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{ __( 'Button Size' ) }</h2>
							<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Button Size', 'kadence-blocks' ) }>
								{ map( btnSizes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-btn-size-btn"
										isSmall
										isPrimary={ submit[ 0 ].size === key }
										aria-pressed={ submit[ 0 ].size === key }
										onClick={ () => this.saveSubmit( { size: key } ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
						{ 'custom' === submit[ 0 ].size && (
							<div className="kt-inner-sub-section">
								<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Input Padding', 'kadence-blocks' ) }</h2>
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
																label={ __( 'Mobile Padding', 'kadence-blocks' ) }
																measurement={ submit[ 0 ].mobilePadding }
																control={ submitMobilePaddingControl }
																onChange={ ( value ) => this.saveSubmit( { mobilePadding: value } ) }
																onControl={ ( value ) => this.setState( { submitMobilePaddingControl: value } ) }
																min={ 0 }
																max={ 100 }
																step={ 1 }
															/>
														</Fragment>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<MeasurementControls
															label={ __( 'Tablet Padding', 'kadence-blocks' ) }
															measurement={ submit[ 0 ].tabletPadding }
															control={ submitTabletPaddingControl }
															onChange={ ( value ) => this.saveSubmit( { tabletPadding: value } ) }
															onControl={ ( value ) => this.setState( { submitTabletPaddingControl: value } ) }
															min={ 0 }
															max={ 100 }
															step={ 1 }
														/>
													);
												} else {
													tabout = (
														<MeasurementControls
															label={ __( 'Desktop Padding', 'kadence-blocks' ) }
															measurement={ submit[ 0 ].deskPadding }
															control={ submitDeskPaddingControl }
															onChange={ ( value ) => this.saveSubmit( { deskPadding: value } ) }
															onControl={ ( value ) => this.setState( { submitDeskPaddingControl: value } ) }
															min={ 0 }
															max={ 100 }
															step={ 1 }
														/>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</div>
						) }
						<div className="kt-btn-size-settings-container">
							<h2 className="kt-beside-btn-group">{ __( 'Button Width' ) }</h2>
							<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Button Width' ) }>
								{ map( btnWidths, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-btn-size-btn"
										isSmall
										isPrimary={ submit[ 0 ].widthType === key }
										aria-pressed={ submit[ 0 ].widthType === key }
										onClick={ () => this.saveSubmit( { widthType: key } ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
						{ 'fixed' === submit[ 0 ].widthType && (
							<div className="kt-inner-sub-section">
								<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Fixed Width' ) }</h2>
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
															<RangeControl
																value={ ( submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 2 ] ? submit[ 0 ].fixedWidth[ 2 ] : undefined ) }
																onChange={ value => {
																	this.saveSubmit( { fixedWidth: [ ( undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 0 ] ? submit[ 0 ].fixedWidth[ 0 ] : '' ), ( undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 1 ] ? submit[ 0 ].fixedWidth[ 1 ] : '' ), value ] } );
																} }
																min={ 10 }
																max={ 500 }
															/>
														</Fragment>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<Fragment>
															<RangeControl
																value={ ( submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 1 ] ? submit[ 0 ].fixedWidth[ 1 ] : undefined ) }
																onChange={ value => {
																	this.saveSubmit( { fixedWidth: [ ( undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 0 ] ? submit[ 0 ].fixedWidth[ 0 ] : '' ), value, ( undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 2 ] ? submit[ 0 ].fixedWidth[ 2 ] : '' ) ] } );
																} }
																min={ 10 }
																max={ 500 }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<RangeControl
																value={ ( submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 0 ] ? submit[ 0 ].fixedWidth[ 0 ] : undefined ) }
																onChange={ value => {
																	this.saveSubmit( { fixedWidth: [ value, ( undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 1 ] ? submit[ 0 ].fixedWidth[ 1 ] : '' ), ( undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 2 ] ? submit[ 0 ].fixedWidth[ 2 ] : '' ) ] } );
																} }
																min={ 10 }
																max={ 500 }
															/>
														</Fragment>
													);
												}
											}
											return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
										}
									}
								</TabPanel>
							</div>
						) }
						<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Button Colors', 'kadence-blocks' ) }</h2>
						<TabPanel className="kt-inspect-tabs kt-hover-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'normal',
									title: __( 'Normal', 'kadence-blocks' ),
									className: 'kt-normal-tab',
								},
								{
									name: 'hover',
									title: __( 'Hover', 'kadence-blocks' ),
									className: 'kt-hover-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'hover' === tab.name ) {
											tabout = (
												<Fragment>
													<PopColorControl
														label={ __( 'Text Hover Color', 'kadence-blocks' ) }
														value={ ( submit[ 0 ].colorHover ? submit[ 0 ].colorHover : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveSubmit( { colorHover: value } );
														} }
													/>
													<div className="kt-btn-size-settings-container">
														<h2 className="kt-beside-btn-group">{ __( 'Background Type', 'kadence-blocks' ) }</h2>
														<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type', 'kadence-blocks' ) }>
															{ map( bgType, ( { name, key } ) => (
																<Button
																	key={ key }
																	className="kt-btn-size-btn"
																	isSmall
																	isPrimary={ ( undefined !== submit[ 0 ].backgroundHoverType ? submit[ 0 ].backgroundHoverType : 'solid' ) === key }
																	aria-pressed={ ( undefined !== submit[ 0 ].backgroundHoverType ? submit[ 0 ].backgroundHoverType : 'solid' ) === key }
																	onClick={ () => this.saveSubmit( { backgroundHoverType: key } ) }
																>
																	{ name }
																</Button>
															) ) }
														</ButtonGroup>
													</div>
													{ 'gradient' !== submit[ 0 ].backgroundHoverType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Button Hover Background', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].backgroundHover ? submit[ 0 ].backgroundHover : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveSubmit( { backgroundHover: value } );
																} }
																opacityValue={ submit[ 0 ].backgroundHoverOpacity }
																onOpacityChange={ value => this.saveSubmit( { backgroundHoverOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveSubmit( { backgroundHover: color, backgroundHoverOpacity: opacity } ) }
															/>
														</div>
													) }
													{ 'gradient' === submit[ 0 ].backgroundHoverType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Gradient Color 1', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].backgroundHover ? submit[ 0 ].backgroundHover : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveSubmit( { backgroundHover: value } );
																} }
																opacityValue={ submit[ 0 ].backgroundHoverOpacity }
																onOpacityChange={ value => this.saveSubmit( { backgroundHoverOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveSubmit( { backgroundHover: color, backgroundHoverOpacity: opacity } ) }
															/>
															<RangeControl
																label={ __( 'Location', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 2 ] ? submit[ 0 ].gradientHover[ 2 ] : 0 ) }
																onChange={ ( value ) => {
																	this.saveSubmitGradientHover( value, 2 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<PopColorControl
																label={ __( 'Gradient Color 2', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 0 ] ? submit[ 0 ].gradientHover[ 0 ] : '#999999' ) }
																default={ '#999999' }
																opacityValue={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 1 ] ? submit[ 0 ].gradientHover[ 1 ] : 1 ) }
																onChange={ value => {
																	this.saveSubmitGradientHover( value, 0 );
																} }
																onOpacityChange={ value => {
																	this.saveSubmitGradientHover( value, 1 );
																} }
															/>
															<RangeControl
																label={ __( 'Location' ) }
																value={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 3 ] ? submit[ 0 ].gradientHover[ 3 ] : 100 ) }
																onChange={ ( value ) => {
																	this.saveSubmitGradientHover( value, 3 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<div className="kt-btn-size-settings-container">
																<h2 className="kt-beside-btn-group">{ __( 'Gradient Type', 'kadence-blocks' ) }</h2>
																<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type', 'kadence-blocks' ) }>
																	{ map( gradTypes, ( { name, key } ) => (
																		<Button
																			key={ key }
																			className="kt-btn-size-btn"
																			isSmall
																			isPrimary={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 4 ] ? submit[ 0 ].gradientHover[ 4 ] : 'linear' ) === key }
																			aria-pressed={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 4 ] ? submit[ 0 ].gradientHover[ 4 ] : 'linear' ) === key }
																			onClick={ () => {
																				this.saveSubmitGradientHover( key, 4 );
																			} }
																		>
																			{ name }
																		</Button>
																	) ) }
																</ButtonGroup>
															</div>
															{ 'radial' !== ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 4 ] ? submit[ 0 ].gradientHover[ 4 ] : 'linear' ) && (
																<RangeControl
																	label={ __( 'Gradient Angle', 'kadence-blocks' ) }
																	value={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 5 ] ? submit[ 0 ].gradientHover[ 5 ] : 180 ) }
																	onChange={ ( value ) => {
																		this.saveSubmitGradientHover( value, 5 );
																	} }
																	min={ 0 }
																	max={ 360 }
																/>
															) }
															{ 'radial' === ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 4 ] ? submit[ 0 ].gradientHover[ 4 ] : 'linear' ) && (
																<SelectControl
																	label={ __( 'Gradient Position', 'kadence-blocks' ) }
																	value={ ( submit[ 0 ].gradientHover && undefined !== submit[ 0 ].gradientHover[ 6 ] ? submit[ 0 ].gradientHover[ 6 ] : 'center center' ) }
																	options={ [
																		{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
																		{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
																		{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
																		{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
																		{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
																		{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
																		{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
																		{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
																		{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
																	] }
																	onChange={ value => {
																		this.saveSubmitGradientHover( value, 6 );
																	} }
																/>
															) }
														</div>
													) }
													<PopColorControl
														label={ __( 'Button Hover Border', 'kadence-blocks' ) }
														value={ ( submit[ 0 ].borderHover ? submit[ 0 ].borderHover : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveSubmit( { borderHover: value } );
														} }
														opacityValue={ submit[ 0 ].borderHoverOpacity }
														onOpacityChange={ value => this.saveSubmit( { borderHoverOpacity: value } ) }
														onArrayChange={ ( color, opacity ) => this.saveSubmit( { borderHover: color, borderHoverOpacity: opacity } ) }
													/>
													<BoxShadowControl
														label={ __( 'Button Hover Box Shadow', 'kadence-blocks' ) }
														enable={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 0 ] ? submit[ 0 ].boxShadowHover[ 0 ] : false ) }
														color={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 1 ] ? submit[ 0 ].boxShadowHover[ 1 ] : '#000000' ) }
														default={ '#000000' }
														opacity={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 2 ] ? submit[ 0 ].boxShadowHover[ 2 ] : 0.4 ) }
														hOffset={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 3 ] ? submit[ 0 ].boxShadowHover[ 3 ] : 2 ) }
														vOffset={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 4 ] ? submit[ 0 ].boxShadowHover[ 4 ] : 2 ) }
														blur={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 5 ] ? submit[ 0 ].boxShadowHover[ 5 ] : 3 ) }
														spread={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 6 ] ? submit[ 0 ].boxShadowHover[ 6 ] : 0 ) }
														inset={ ( undefined !== submit[ 0 ].boxShadowHover && undefined !== submit[ 0 ].boxShadowHover[ 7 ] ? submit[ 0 ].boxShadowHover[ 7 ] : false ) }
														onEnableChange={ value => {
															this.saveSubmitBoxShadowHover( value, 0 );
														} }
														onColorChange={ value => {
															this.saveSubmitBoxShadowHover( value, 1 );
														} }
														onOpacityChange={ value => {
															this.saveSubmitBoxShadowHover( value, 2 );
														} }
														onHOffsetChange={ value => {
															this.saveSubmitBoxShadowHover( value, 3 );
														} }
														onVOffsetChange={ value => {
															this.saveSubmitBoxShadowHover( value, 4 );
														} }
														onBlurChange={ value => {
															this.saveSubmitBoxShadowHover( value, 5 );
														} }
														onSpreadChange={ value => {
															this.saveSubmitBoxShadowHover( value, 6 );
														} }
														onInsetChange={ value => {
															this.saveSubmitBoxShadowHover( value, 7 );
														} }
													/>
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<PopColorControl
														label={ __( 'Text Color', 'kadence-blocks' ) }
														value={ ( submit[ 0 ].color ? submit[ 0 ].color : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveSubmit( { color: value } );
														} }
													/>
													<div className="kt-btn-size-settings-container">
														<h2 className="kt-beside-btn-group">{ __( 'Background Type', 'kadence-blocks' ) }</h2>
														<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type', 'kadence-blocks' ) }>
															{ map( bgType, ( { name, key } ) => (
																<Button
																	key={ key }
																	className="kt-btn-size-btn"
																	isSmall
																	isPrimary={ ( undefined !== submit[ 0 ].backgroundType ? submit[ 0 ].backgroundType : 'solid' ) === key }
																	aria-pressed={ ( undefined !== submit[ 0 ].backgroundType ? submit[ 0 ].backgroundType : 'solid' ) === key }
																	onClick={ () => this.saveSubmit( { backgroundType: key } ) }
																>
																	{ name }
																</Button>
															) ) }
														</ButtonGroup>
													</div>
													{ 'gradient' !== submit[ 0 ].backgroundType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Button Background', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].background ? submit[ 0 ].background : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveSubmit( { background: value } );
																} }
																opacityValue={ submit[ 0 ].backgroundOpacity }
																onOpacityChange={ value => this.saveSubmit( { backgroundOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveSubmit( { background: color, backgroundOpacity: opacity } ) }
															/>
														</div>
													) }
													{ 'gradient' === submit[ 0 ].backgroundType && (
														<div className="kt-inner-sub-section">
															<PopColorControl
																label={ __( 'Gradient Color 1', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].background ? submit[ 0 ].background : '' ) }
																default={ '' }
																onChange={ value => {
																	this.saveSubmit( { background: value } );
																} }
																opacityValue={ submit[ 0 ].backgroundOpacity }
																onOpacityChange={ value => this.saveSubmit( { backgroundOpacity: value } ) }
																onArrayChange={ ( color, opacity ) => this.saveSubmit( { background: color, backgroundOpacity: opacity } ) }
															/>
															<RangeControl
																label={ __( 'Location', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 2 ] ? submit[ 0 ].gradient[ 2 ] : 0 ) }
																onChange={ ( value ) => {
																	this.saveSubmitGradient( value, 2 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<PopColorControl
																label={ __( 'Gradient Color 2', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 0 ] ? submit[ 0 ].gradient[ 0 ] : '#999999' ) }
																default={ '#999999' }
																opacityValue={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 1 ] ? submit[ 0 ].gradient[ 1 ] : 1 ) }
																onChange={ value => {
																	this.saveSubmitGradient( value, 0 );
																} }
																onOpacityChange={ value => {
																	this.saveSubmitGradient( value, 1 );
																} }
															/>
															<RangeControl
																label={ __( 'Location', 'kadence-blocks' ) }
																value={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 3 ] ? submit[ 0 ].gradient[ 3 ] : 100 ) }
																onChange={ ( value ) => {
																	this.saveSubmitGradient( value, 3 );
																} }
																min={ 0 }
																max={ 100 }
															/>
															<div className="kt-btn-size-settings-container">
																<h2 className="kt-beside-btn-group">{ __( 'Gradient Type', 'kadence-blocks' ) }</h2>
																<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type', 'kadence-blocks' ) }>
																	{ map( gradTypes, ( { name, key } ) => (
																		<Button
																			key={ key }
																			className="kt-btn-size-btn"
																			isSmall
																			isPrimary={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 4 ] ? submit[ 0 ].gradient[ 4 ] : 'linear' ) === key }
																			aria-pressed={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 4 ] ? submit[ 0 ].gradient[ 4 ] : 'linear' ) === key }
																			onClick={ () => {
																				this.saveSubmitGradient( key, 4 );
																			} }
																		>
																			{ name }
																		</Button>
																	) ) }
																</ButtonGroup>
															</div>
															{ 'radial' !== ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 4 ] ? submit[ 0 ].gradient[ 4 ] : 'linear' ) && (
																<RangeControl
																	label={ __( 'Gradient Angle', 'kadence-blocks' ) }
																	value={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 5 ] ? submit[ 0 ].gradient[ 5 ] : 180 ) }
																	onChange={ ( value ) => {
																		this.saveSubmitGradient( value, 5 );
																	} }
																	min={ 0 }
																	max={ 360 }
																/>
															) }
															{ 'radial' === ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 4 ] ? submit[ 0 ].gradient[ 4 ] : 'linear' ) && (
																<SelectControl
																	label={ __( 'Gradient Position', 'kadence-blocks' ) }
																	value={ ( submit[ 0 ].gradient && undefined !== submit[ 0 ].gradient[ 6 ] ? submit[ 0 ].gradient[ 6 ] : 'center center' ) }
																	options={ [
																		{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
																		{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
																		{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
																		{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
																		{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
																		{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
																		{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
																		{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
																		{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
																	] }
																	onChange={ value => {
																		this.saveSubmitGradient( value, 6 );
																	} }
																/>
															) }
														</div>
													) }
													<PopColorControl
														label={ __( 'Button Border', 'kadence-blocks' ) }
														value={ ( submit[ 0 ].border ? submit[ 0 ].border : '' ) }
														default={ '' }
														onChange={ value => {
															this.saveSubmit( { border: value } );
														} }
														opacityValue={ submit[ 0 ].borderOpacity }
														onOpacityChange={ value => this.saveSubmit( { borderOpacity: value } ) }
														onArrayChange={ ( color, opacity ) => this.saveSubmit( { border: color, borderOpacity: opacity } ) }
													/>
													<BoxShadowControl
														label={ __( 'Button Box Shadow', 'kadence-blocks' ) }
														enable={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 0 ] ? submit[ 0 ].boxShadow[ 0 ] : false ) }
														color={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 1 ] ? submit[ 0 ].boxShadow[ 1 ] : '#000000' ) }
														default={ '#000000' }
														opacity={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 2 ] ? submit[ 0 ].boxShadow[ 2 ] : 0.4 ) }
														hOffset={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 3 ] ? submit[ 0 ].boxShadow[ 3 ] : 2 ) }
														vOffset={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 4 ] ? submit[ 0 ].boxShadow[ 4 ] : 2 ) }
														blur={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 5 ] ? submit[ 0 ].boxShadow[ 5 ] : 3 ) }
														spread={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 6 ] ? submit[ 0 ].boxShadow[ 6 ] : 0 ) }
														inset={ ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 7 ] ? submit[ 0 ].boxShadow[ 7 ] : false ) }
														onEnableChange={ value => {
															this.saveSubmitBoxShadow( value, 0 );
														} }
														onColorChange={ value => {
															this.saveSubmitBoxShadow( value, 1 );
														} }
														onOpacityChange={ value => {
															this.saveSubmitBoxShadow( value, 2 );
														} }
														onHOffsetChange={ value => {
															this.saveSubmitBoxShadow( value, 3 );
														} }
														onVOffsetChange={ value => {
															this.saveSubmitBoxShadow( value, 4 );
														} }
														onBlurChange={ value => {
															this.saveSubmitBoxShadow( value, 5 );
														} }
														onSpreadChange={ value => {
															this.saveSubmitBoxShadow( value, 6 );
														} }
														onInsetChange={ value => {
															this.saveSubmitBoxShadow( value, 7 );
														} }
													/>
												</Fragment>
											);
										}
									}
									return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
								}
							}
						</TabPanel>
						<h2>{ __( 'Border Settings', 'kadence-blocks' ) }</h2>
						<MeasurementControls
							label={ __( 'Border Width', 'kadence-blocks' ) }
							measurement={ submit[ 0 ].borderWidth }
							control={ submitBorderControl }
							onChange={ ( value ) => this.saveSubmit( { borderWidth: value } ) }
							onControl={ ( value ) => this.setState( { submitBorderControl: value } ) }
							min={ 0 }
							max={ 20 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Border Radius', 'kadence-blocks' ) }
							value={ submit[ 0 ].borderRadius }
							onChange={ value => {
								this.saveSubmit( { borderRadius: value } );
							} }
							min={ 0 }
							max={ 50 }
						/>
						<TypographyControls
							fontSize={ submitFont[ 0 ].size }
							onFontSize={ ( value ) => this.saveSubmitFont( { size: value } ) }
							fontSizeType={ submitFont[ 0 ].sizeType }
							onFontSizeType={ ( value ) => this.saveSubmitFont( { sizeType: value } ) }
							lineHeight={ submitFont[ 0 ].lineHeight }
							onLineHeight={ ( value ) => this.saveSubmitFont( { lineHeight: value } ) }
							lineHeightType={ submitFont[ 0 ].lineType }
							onLineHeightType={ ( value ) => this.saveSubmitFont( { lineType: value } ) }
						/>
						<PanelBody
							title={ __( 'Advanced Button Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<TypographyControls
								letterSpacing={ submitFont[ 0 ].letterSpacing }
								onLetterSpacing={ ( value ) => this.saveSubmitFont( { letterSpacing: value } ) }
								textTransform={ submitFont[ 0 ].textTransform }
								onTextTransform={ ( value ) => this.saveSubmitFont( { textTransform: value } ) }
								fontFamily={ submitFont[ 0 ].family }
								onFontFamily={ ( value ) => this.saveSubmitFont( { family: value } ) }
								onFontChange={ ( select ) => {
									this.saveSubmitFont( {
										family: select.value,
										google: select.google,
									} );
								} }
								onFontArrayChange={ ( values ) => this.saveSubmitFont( values ) }
								googleFont={ submitFont[ 0 ].google }
								onGoogleFont={ ( value ) => this.saveSubmitFont( { google: value } ) }
								loadGoogleFont={ submitFont[ 0 ].loadGoogle }
								onLoadGoogleFont={ ( value ) => this.saveSubmitFont( { loadGoogle: value } ) }
								fontVariant={ submitFont[ 0 ].variant }
								onFontVariant={ ( value ) => this.saveSubmitFont( { variant: value } ) }
								fontWeight={ submitFont[ 0 ].weight }
								onFontWeight={ ( value ) => this.saveSubmitFont( { weight: value } ) }
								fontStyle={ submitFont[ 0 ].style }
								onFontStyle={ ( value ) => this.saveSubmitFont( { style: value } ) }
								fontSubset={ submitFont[ 0 ].subset }
								onFontSubset={ ( value ) => this.saveSubmitFont( { subset: value } ) }
							/>
							<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={ __( 'Margin Type', 'kadence-blocks' ) }>
								{ map( marginTypes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ marginUnit === key }
										aria-pressed={ marginUnit === key }
										onClick={ () => this.saveSubmitMargin( { unit: key } ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
							<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Margin Unit', 'kadence-blocks' ) }</h2>
							<h2 className="kt-heading-size-title">{ __( 'Margin', 'kadence-blocks' ) }</h2>
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
															label={ __( 'Mobile Margin', 'kadence-blocks' ) }
															measurement={ ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].mobile ? submitMargin[ 0 ].mobile : [ '', '', '', '' ] ) }
															control={ ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].control ? submitMargin[ 0 ].control : 'linked' ) }
															onChange={ ( value ) => this.saveSubmitMargin( { mobile: value } ) }
															onControl={ ( value ) => this.saveSubmitMargin( { control: value } ) }
															min={ marginMin }
															max={ marginMax }
															step={ marginStep }
															allowEmpty={ true }
														/>
													</Fragment>
												);
											} else if ( 'tablet' === tab.name ) {
												tabout = (
													<Fragment>
														<MeasurementControls
															label={ __( 'Tablet Margin', 'kadence-blocks' ) }
															measurement={ ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].tablet ? submitMargin[ 0 ].tablet : [ '', '', '', '' ] ) }
															control={ ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].control ? submitMargin[ 0 ].control : 'linked' ) }
															onChange={ ( value ) => this.saveSubmitMargin( { tablet: value } ) }
															onControl={ ( value ) => this.saveSubmitMargin( { control: value } ) }
															min={ marginMin }
															max={ marginMax }
															step={ marginStep }
															allowEmpty={ true }
														/>
													</Fragment>
												);
											} else {
												tabout = (
													<Fragment>
														<MeasurementControls
															label={ __( 'Desktop Margin', 'kadence-blocks' ) }
															measurement={ ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].desk ? submitMargin[ 0 ].desk : [ '', '', '', '' ] ) }
															control={ ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && submitMargin[ 0 ].control ? submitMargin[ 0 ].control : 'linked' ) }
															onChange={ ( value ) => this.saveSubmitMargin( { desk: value } ) }
															onControl={ ( value ) => this.saveSubmitMargin( { control: value } ) }
															min={ marginMin }
															max={ marginMax }
															step={ marginStep }
															allowEmpty={ true }
														/>
													</Fragment>
												);
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
						</PanelBody>
						<TextControl
							label={ __( 'Submit aria description', 'kadence-blocks' ) }
							help={ __( 'Provide more context for screen readers', 'kadence-blocks' ) }
							value={ ( undefined !== submitLabel ? submitLabel : '' ) }
							onChange={ ( value ) => setAttributes( { submitLabel: value } ) }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Message Settings', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<TextControl
							label={ __( 'Success Message', 'kadence-blocks' ) }
							placeholder={ __( 'Submission Success, Thanks for getting in touch!', 'kadence-blocks' ) }
							value={ ( undefined !== messages[ 0 ].success ? messages[ 0 ].success : '' ) }
							onChange={ ( value ) => this.saveMessages( { success: value } ) }
						/>
						<PanelBody
							title={ __( 'Success Message Colors', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<PopColorControl
								label={ __( 'Success Message Color', 'kadence-blocks' ) }
								value={ ( messageFont[ 0 ].colorSuccess ? messageFont[ 0 ].colorSuccess : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveMessageFont( { colorSuccess: value } );
								} }
							/>
							<PopColorControl
								label={ __( 'Success Message Background', 'kadence-blocks' ) }
								value={ ( messageFont[ 0 ].backgroundSuccess ? messageFont[ 0 ].backgroundSuccess : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveMessageFont( { backgroundSuccess: value } );
								} }
								opacityValue={ messageFont[ 0 ].backgroundSuccessOpacity }
								onOpacityChange={ value => this.saveMessageFont( { backgroundSuccessOpacity: value } ) }
							/>
							<PopColorControl
								label={ __( 'Success Message Border', 'kadence-blocks' ) }
								value={ ( messageFont[ 0 ].borderSuccess ? messageFont[ 0 ].borderSuccess : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveMessageFont( { borderSuccess: value } );
								} }
							/>
						</PanelBody>
						<PanelRow>
							<TextControl
								label={ __( 'Pre Submit Form Validation Error Message', 'kadence-blocks' ) }
								placeholder={ __( 'Please fix the errors to proceed', 'kadence-blocks' ) }
								value={ ( undefined !== messages[ 0 ].preError ? messages[ 0 ].preError : '' ) }
								onChange={ ( value ) => this.saveMessages( { preError: value } ) }
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								label={ __( 'Error Message', 'kadence-blocks' ) }
								placeholder={ __( 'Submission Failed', 'kadence-blocks' ) }
								value={ ( undefined !== messages[ 0 ].error ? messages[ 0 ].error : '' ) }
								onChange={ ( value ) => this.saveMessages( { error: value } ) }
							/>
						</PanelRow>
						{ recaptcha && (
							<PanelRow>
								<TextControl
									label={ __( 'Recapcha Error Message', 'kadence-blocks' ) }
									placeholder={ __( 'Submission Failed, reCaptcha spam prevention.', 'kadence-blocks' ) }
									value={ ( undefined !== messages[ 0 ].recaptchaerror ? messages[ 0 ].recaptchaerror : '' ) }
									onChange={ ( value ) => this.saveMessages( { recaptchaerror: value } ) }
								/>
							</PanelRow>
						) }
						<PanelBody
							title={ __( 'Error Message Colors', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<PopColorControl
								label={ __( 'Error Message Color', 'kadence-blocks' ) }
								value={ ( messageFont[ 0 ].colorError ? messageFont[ 0 ].colorError : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveMessageFont( { colorError: value } );
								} }
							/>
							<PopColorControl
								label={ __( 'Error Message Background', 'kadence-blocks' ) }
								value={ ( messageFont[ 0 ].backgroundError ? messageFont[ 0 ].backgroundError : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveMessageFont( { backgroundError: value } );
								} }
								opacityValue={ messageFont[ 0 ].backgroundErrorOpacity }
								onOpacityChange={ value => this.saveMessageFont( { backgroundErrorOpacity: value } ) }
							/>
							<PopColorControl
								label={ __( 'Error Message Border', 'kadence-blocks' ) }
								value={ ( messageFont[ 0 ].borderError ? messageFont[ 0 ].borderError : '' ) }
								default={ '' }
								onChange={ value => {
									this.saveMessageFont( { borderError: value } );
								} }
							/>
						</PanelBody>
						<TypographyControls
							fontSize={ messageFont[ 0 ].size }
							onFontSize={ ( value ) => this.saveMessageFont( { size: value } ) }
							fontSizeType={ messageFont[ 0 ].sizeType }
							onFontSizeType={ ( value ) => this.saveMessageFont( { sizeType: value } ) }
							lineHeight={ messageFont[ 0 ].lineHeight }
							onLineHeight={ ( value ) => this.saveMessageFont( { lineHeight: value } ) }
							lineHeightType={ messageFont[ 0 ].lineType }
							onLineHeightType={ ( value ) => this.saveMessageFont( { lineType: value } ) }
						/>
						<h2>{ __( 'Border Settings', 'kadence-blocks' ) }</h2>
						<MeasurementControls
							label={ __( 'Border Width', 'kadence-blocks' ) }
							measurement={ messageFont[ 0 ].borderWidth }
							control={ messageFontBorderControl }
							onChange={ ( value ) => this.saveMessageFont( { borderWidth: value } ) }
							onControl={ ( value ) => this.setState( { messageFontBorderControl: value } ) }
							min={ 0 }
							max={ 20 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Border Radius', 'kadence-blocks' ) }
							value={ messageFont[ 0 ].borderRadius }
							onChange={ value => {
								this.saveMessageFont( { borderRadius: value } );
							} }
							min={ 0 }
							max={ 50 }
						/>
						<PanelBody
							title={ __( 'Advanced Message Font Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<TypographyControls
								letterSpacing={ messageFont[ 0 ].letterSpacing }
								onLetterSpacing={ ( value ) => this.saveMessageFont( { letterSpacing: value } ) }
								fontFamily={ messageFont[ 0 ].family }
								onFontFamily={ ( value ) => this.saveMessageFont( { family: value } ) }
								onFontChange={ ( select ) => {
									this.saveMessageFont( {
										family: select.value,
										google: select.google,
									} );
								} }
								onFontArrayChange={ ( values ) => this.saveMessageFont( values ) }
								googleFont={ messageFont[ 0 ].google }
								onGoogleFont={ ( value ) => this.saveMessageFont( { google: value } ) }
								loadGoogleFont={ messageFont[ 0 ].loadGoogle }
								onLoadGoogleFont={ ( value ) => this.saveMessageFont( { loadGoogle: value } ) }
								fontVariant={ messageFont[ 0 ].variant }
								onFontVariant={ ( value ) => this.saveMessageFont( { variant: value } ) }
								fontWeight={ messageFont[ 0 ].weight }
								onFontWeight={ ( value ) => this.saveMessageFont( { weight: value } ) }
								fontStyle={ messageFont[ 0 ].style }
								onFontStyle={ ( value ) => this.saveMessageFont( { style: value } ) }
								fontSubset={ messageFont[ 0 ].subset }
								onFontSubset={ ( value ) => this.saveMessageFont( { subset: value } ) }
								padding={ messageFont[ 0 ].padding }
								onPadding={ ( value ) => this.saveMessageFont( { padding: value } ) }
								paddingControl={ messagePaddingControl }
								onPaddingControl={ ( value ) => this.setState( { messagePaddingControl: value } ) }
								margin={ messageFont[ 0 ].margin }
								onMargin={ ( value ) => this.saveMessageFont( { margin: value } ) }
								marginControl={ messageMarginControl }
								onMarginControl={ ( value ) => this.setState( { messageMarginControl: value } ) }
							/>
						</PanelBody>
					</PanelBody>
					<PanelBody
						title={ __( 'Container Settings', 'kadence-blocks' ) }
						initialOpen={ false }
					>
						<ResponsiveMeasuremenuControls
							label={ __( 'Container Margin', 'kadence-blocks' ) }
							control={ deskMarginControl }
							tabletControl={ tabletMarginControl }
							mobileControl={ mobileMarginControl }
							value={ ( undefined !== containerMargin ? containerMargin : [ '', '', '', '' ] ) }
							tabletValue={ ( undefined !== tabletContainerMargin ? tabletContainerMargin : [ '', '', '', '' ] ) }
							mobileValue={ ( undefined !== mobileContainerMargin ? mobileContainerMargin : [ '', '', '', '' ] ) }
							onChange={ ( value ) => {
								setAttributes( { containerMargin: value } );
							} }
							onChangeTablet={ ( value ) => {
								setAttributes( { tabletContainerMargin: value } );
							} }
							onChangeMobile={ ( value ) => {
								setAttributes( { mobileContainerMargin: value } );
							} }
							onChangeControl={ ( value ) => this.setState( { deskMarginControl: value } ) }
							onChangeTabletControl={ ( value ) => this.setState( { tabletMarginControl: value } ) }
							onChangeMobileControl={ ( value ) => this.setState( { mobileMarginControl: value } ) }
							allowEmpty={ true }
							min={ containerMarginMin }
							max={ containerMarginMax }
							step={ containerMarginStep }
							unit={ containerMarginType }
							units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
							onUnit={ ( value ) => setAttributes( { containerMarginType: value } ) }
						/>
					</PanelBody>
					{ actions.includes( 'mailerlite' ) && (
						<MailerLiteControls
							fields={ fields }
							settings={ mailerlite }
							save={ ( value ) => saveMailerlite( value ) }
							saveMap={ ( value, i ) => saveMailerliteMap( value, i ) }
						/>
					) }
					{ actions.includes( 'fluentCRM' ) && (
						<FluentCRMControls
							fields={ fields }
							settings={ fluentcrm }
							save={ ( value ) => saveFluentCRM( value ) }
							saveMap={ ( value, i ) => saveFluentCRMMap( value, i ) }
						/>
					) }
				</InspectorControls>
				<div id={ `animate-id${ uniqueID }` } className={ `kb-form-wrap aos-animate${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` } data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) } style={ {
					marginLeft: ( undefined !== previewContainerMarginLeft ? previewContainerMarginLeft + previewContainerMarginType : undefined ),
					marginRight: ( undefined !== previewContainerMarginRight ? previewContainerMarginRight + previewContainerMarginType : undefined ),
					marginTop: ( undefined !== previewContainerMarginTop ? previewContainerMarginTop + previewContainerMarginType : undefined ),
					marginBottom: ( undefined !== previewContainerMarginBottom ? previewContainerMarginBottom + previewContainerMarginType : undefined ),
				} }>
					<div id={ `kb-form-${ uniqueID }` } className={ 'kb-form' } style={ {
						marginRight: ( undefined !== style[ 0 ].gutter && '' !== style[ 0 ].gutter ? '-' + ( style[ 0 ].gutter / 2 ) + 'px' : undefined ),
						marginLeft: ( undefined !== style[ 0 ].gutter && '' !== style[ 0 ].gutter ? '-' + ( style[ 0 ].gutter / 2 ) + 'px' : undefined ),
					} }>
						{ renderFieldOutput }
						<div
							className="kadence-blocks-form-field kb-submit-field"
							style={ {
								width: submit[ 0 ].width[ 0 ] + '%',
								paddingRight: ( undefined !== style[ 0 ].gutter && '' !== style[ 0 ].gutter ? ( style[ 0 ].gutter / 2 ) + 'px' : undefined ),
								paddingLeft: ( undefined !== style[ 0 ].gutter && '' !== style[ 0 ].gutter ? ( style[ 0 ].gutter / 2 ) + 'px' : undefined ),
							} }
							tabIndex="0"
							role="button"
							onClick={ this.deselectField }
							onFocus={ this.deselectField }
							onKeyDown={ this.deselectField }
						>
							<RichText
								tagName="div"
								placeholder={ __( 'Submit' ) }
								onFocus={ this.deselectField }
								value={ submit[ 0 ].label }
								onChange={ value => {
									this.saveSubmit( { label: value } );
								} }
								allowedFormats={ applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] ) }
								className={ `kb-forms-submit kb-button-size-${ submit[ 0 ].size } kb-button-width-${ submit[ 0 ].widthType }` }
								style={ {
									background: ( undefined !== btnBG ? btnBG : undefined ),
									color: ( undefined !== submit[ 0 ].color ? KadenceColorOutput( submit[ 0 ].color ) : undefined ),
									fontSize: ( submitFont[ 0 ].size && submitFont[ 0 ].size[ 0 ] ? submitFont[ 0 ].size[ 0 ] + submitFont[ 0 ].sizeType : undefined ),
									lineHeight: ( submitFont[ 0 ].lineHeight && submitFont[ 0 ].lineHeight[ 0 ] ? submitFont[ 0 ].lineHeight[ 0 ] + submitFont[ 0 ].lineType : undefined ),
									fontWeight: submitFont[ 0 ].weight,
									fontStyle: submitFont[ 0 ].style,
									letterSpacing: submitFont[ 0 ].letterSpacing + 'px',
									textTransform: ( submitFont[ 0 ].textTransform ? submitFont[ 0 ].textTransform  : undefined ),
									fontFamily: ( submitFont[ 0 ].family ? submitFont[ 0 ].family : '' ),
									borderRadius: ( undefined !== submit[ 0 ].borderRadius ? submit[ 0 ].borderRadius + 'px' : undefined ),
									borderColor: ( undefined === submit[ 0 ].border ? undefined : KadenceColorOutput( submit[ 0 ].border, ( submit[ 0 ].borderOpacity !== undefined ? submit[ 0 ].borderOpacity : 1 ) ) ),
									width: ( undefined !== submit[ 0 ].widthType && 'fixed' === submit[ 0 ].widthType && undefined !== submit[ 0 ].fixedWidth && undefined !== submit[ 0 ].fixedWidth[ 0 ] ? submit[ 0 ].fixedWidth[ 0 ] + 'px' : undefined ),
									paddingTop: ( 'custom' === submit[ 0 ].size && '' !== submit[ 0 ].deskPadding[ 0 ] ? submit[ 0 ].deskPadding[ 0 ] + 'px' : undefined ),
									paddingRight: ( 'custom' === submit[ 0 ].size && '' !== submit[ 0 ].deskPadding[ 1 ] ? submit[ 0 ].deskPadding[ 1 ] + 'px' : undefined ),
									paddingBottom: ( 'custom' === submit[ 0 ].size && '' !== submit[ 0 ].deskPadding[ 2 ] ? submit[ 0 ].deskPadding[ 2 ] + 'px' : undefined ),
									paddingLeft: ( 'custom' === submit[ 0 ].size && '' !== submit[ 0 ].deskPadding[ 3 ] ? submit[ 0 ].deskPadding[ 3 ] + 'px' : undefined ),
									borderTopWidth: ( submit[ 0 ].borderWidth && '' !== submit[ 0 ].borderWidth[ 0 ] ? submit[ 0 ].borderWidth[ 0 ] + 'px' : undefined ),
									borderRightWidth: ( submit[ 0 ].borderWidth && '' !== submit[ 0 ].borderWidth[ 1 ] ? submit[ 0 ].borderWidth[ 1 ] + 'px' : undefined ),
									borderBottomWidth: ( submit[ 0 ].borderWidth && '' !== submit[ 0 ].borderWidth[ 2 ] ? submit[ 0 ].borderWidth[ 2 ] + 'px' : undefined ),
									borderLeftWidth: ( submit[ 0 ].borderWidth && '' !== submit[ 0 ].borderWidth[ 3 ] ? submit[ 0 ].borderWidth[ 3 ] + 'px' : undefined ),
									boxShadow: ( undefined !== submit[ 0 ].boxShadow && undefined !== submit[ 0 ].boxShadow[ 0 ] && submit[ 0 ].boxShadow[ 0 ] ? ( undefined !== submit[ 0 ].boxShadow[ 7 ] && submit[ 0 ].boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== submit[ 0 ].boxShadow[ 3 ] ? submit[ 0 ].boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadow[ 4 ] ? submit[ 0 ].boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadow[ 5 ] ? submit[ 0 ].boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== submit[ 0 ].boxShadow[ 6 ] ? submit[ 0 ].boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== submit[ 0 ].boxShadow[ 1 ] ? submit[ 0 ].boxShadow[ 1 ] : '#000000' ), ( undefined !== submit[ 0 ].boxShadow[ 2 ] ? submit[ 0 ].boxShadow[ 2 ] : 1 ) ) : undefined ),
									marginTop: ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 0 ] ? submitMargin[ 0 ].desk[ 0 ] + marginUnit : undefined ),
									marginRight: ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 1 ] ? submitMargin[ 0 ].desk[ 1 ] + marginUnit : undefined ),
									marginBottom: ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 2 ] ? submitMargin[ 0 ].desk[ 2 ] + marginUnit : undefined ),
									marginLeft: ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 3 ] ? submitMargin[ 0 ].desk[ 3 ] + marginUnit : undefined ),
								} }
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
//export default ( KadenceForm );
export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
] )( KadenceForm );
