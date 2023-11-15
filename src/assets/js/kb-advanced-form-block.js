/* global kadence_blocks_advanced_form_params */
( function() {
	'use strict';
	window.kadenceAdvancedForm = {
		error_item: 1,
		clearForm( form ) {
			form.reset();
		},
		insertAfter( newNode, referenceNode ) {
			referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
		},
		markError( item, error_type, form ) {
			var error_string = '';
			if ( ! form.classList.contains( 'kb-adv-form-has-error' ) ) {
				form.classList.add( 'kb-adv-form-has-error' );
			}
			item.classList.add( 'has-error' );
			if ( error_type ) {
				switch ( error_type ) {
					case 'required' :
						// Check for user provided required message
						const manual_error_string = item.getAttribute('data-kb-required-message');
						if( manual_error_string && '' !== manual_error_string ) {
							error_string = manual_error_string;
							break;
						}
						error_string = item.getAttribute('data-required-message');
						if ( ! error_string || '' === error_string || undefined === error_string ) {
							error_string = item.getAttribute('data-label');
							if ( ! error_string || '' === error_string || undefined === error_string ) {
								error_string = kb_adv_form_params[ 'item' ];
							}
							error_string = error_string + ' ' + kb_adv_form_params[error_type];
						}
						break;
					case 'mismatch' :
						error_string = item.getAttribute('data-mismatch-message');
						if ( ! error_string || '' === error_string || undefined === error_string ) {
							error_string = item.getAttribute('data-label');
							if ( ! error_string || '' === error_string || undefined === error_string ) {
								error_string = kb_adv_form_params[ 'item' ];
							}
							error_string = error_string + ' ' + kb_adv_form_params[error_type];
						}
						break;
					case 'validation' :
						error_string = item.getAttribute('data-validation-message');
						if ( ! error_string || '' === error_string || undefined === error_string ) {
							error_string = item.getAttribute('data-label');
							if ( ! error_string || '' === error_string || undefined === error_string ) {
								error_string = kb_adv_form_params[ 'item' ];
							}
							error_string = error_string + ' ' + kb_adv_form_params[error_type];
						}
						break
				}
				var next = item.parentNode.querySelector( '.kb-adv-form-error-msg' );
				if ( next ) {
					next.remove();
				}
				var error_id = item.getAttribute('name') + '-error';
				item.setAttribute( 'aria-describedby', error_id );
				item.setAttribute( 'aria-invalid', 'true' );
				var el = document.createElement('div');
				el.id = error_id;
				el.classList.add( 'kb-adv-form-error-msg' );
				el.classList.add( 'kb-adv-form-message' );
				el.classList.add( 'kb-adv-form-warning' );
				el.setAttribute( 'role', 'alert' );
				el.innerHTML = error_string;
				if ( item.classList.contains( 'kb-accept-field' ) ) {
					item.parentNode.parentNode.append( el );
				} else if ( item.classList.contains( 'kb-checkbox-field' ) || item.classList.contains( 'kb-radio-field' ) ) {
					item.parentNode.append( el );
				} else {
					window.kadenceAdvancedForm.insertAfter( el, item );
				}
			}
			if ( 1 === window.kadenceAdvancedForm.error_item ) {
				item.focus();
			}
			window.kadenceAdvancedForm.error_item ++;
		},
		addErrorNotice( form ) {
			var error_message = form.getAttribute('data-error-message');
			if ( ! error_message || '' === error_message || undefined === error_message ) {
				error_message = kb_adv_form_params.error_message;
			}
			var el = document.createElement('div');
			el.classList.add( 'kb-adv-form-message' );
			el.classList.add( 'kb-adv-form-warning' );
			el.innerHTML = error_message;
			window.kadenceAdvancedForm.insertAfter( el, form );
		},
		isValidEmail( email ) {
			var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
			return pattern.test( email );
		},
		isValidURL( url ) {
			var urlregex = new RegExp("^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.|http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.)");
			return urlregex.test( url );
		},
		isValidTel( tel ) {
			var telregex = new RegExp("/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im");
			return telregex.test( tel );
		},
		removeErrors( item ) {
			if ( item.classList.contains( 'kb-adv-form-has-error' ) ) {
				item.classList.remove( 'kb-adv-form-has-error' );
			}
			var errors = item.querySelectorAll( '.has-error' );
			if ( errors.length ) {
				for ( var n = 0; n < errors.length; n++ ) {
					errors[n].classList.remove( 'has-error' );
					errors[n].removeAttribute( 'aria-describedby' );
					errors[n].removeAttribute( 'aria-invalid' );
					var next = errors[n].parentNode.querySelector( '.kb-adv-form-error-msg' );
					if ( next ) {
						next.remove();
					}
				}
			}
			var message = document.querySelectorAll( '.kb-adv-form-message' );
			if ( message.length ) {
				for ( var n = 0; n < message.length; n++ ) {
					message[n].remove();
				}
			}
			var notices = item.querySelectorAll( '.kb-adv-form-errors' );
			if ( notices.length ) {
				for ( var n = 0; n < notices.length; n++ ) {
					notices[n].remove();
				}
			}
		},
		serialize( data ) {
			var obj = {};
			for (var [key, value] of data) {
				if (obj[key] !== undefined) {
					if (!Array.isArray(obj[key])) {
						obj[key] = [obj[key]];
					}
					obj[key].push(value);
				} else {
					obj[key] = value;
				}
			}
			return obj;
		},
		validateForm( self ) {
			var error       = false,
				error_type  = '';
			// remove all initial errors if any.
			window.kadenceAdvancedForm.removeErrors( self );
			// ===== Validate: Text and Textarea ========
			var required = self.querySelectorAll( '[data-required="yes"]:not([disabled])' );
			if ( required.length ) {
				for ( var n = 0; n < required.length; n++ ) {
					var data_type = required[n].getAttribute('data-type'),
					val = '';
					switch( data_type ) {
						case 'textarea':
						case 'text':

							val = required[n].value.trim();

							if ( val === '' ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;
						case 'tel':

							val = required[n].value.trim();
							if ( val !== '' ) {
								//run the validation
								// if( ! window.kadenceAdvancedForm.isValidTel( val ) ) {
								// 	error = true;
								// 	error_type = 'validation';

								// 	// mark the error in the field.
								// 	window.kadenceAdvancedForm.markError( required[n], error_type, self );
								// }
							} else if ( val === '' ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;
						case 'accept':
							if ( required[n].checked == false ){
								error = true;
								error_type = 'required';
								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;

						case 'select':
							val = required[n].value;
							//console.log(val );
							if ( required[n].multiple ) {
								if ( val === null || val.length === 0 ) {
									error = true;
									error_type = 'required';

									// mark the error in the field.
									window.kadenceAdvancedForm.markError( required[n], error_type, self );
								}
							} else {

								// console.log(val);
								if ( !val || val === '-1' ) {
									error = true;
									error_type = 'required';

									// mark the error in the field.
									window.kadenceAdvancedForm.markError( required[n], error_type, self );
								}
							}
							break;

						case 'radio':
							var length = required[n].querySelector('input:checked');

							if ( !length ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;

						case 'checkbox':
							var length = required[n].querySelector('input:checked');

							if ( ! length ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;

						case 'email':
							var val = required[n].value.trim();

							if ( val !== '' ) {
								//run the validation
								if( ! window.kadenceAdvancedForm.isValidEmail( val ) ) {
									error = true;
									error_type = 'validation';

									// mark the error in the field.
									window.kadenceAdvancedForm.markError( required[n], error_type, self );
								}
							} else if( val === '' ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;
						case 'url':
							var val = required[n].value.trim();

							if ( val !== '' ) {
								//run the validation
								if( ! window.kadenceAdvancedForm.isValidURL( val ) ) {
									error = true;
									error_type = 'validation';

									// mark the error in the field.
									window.kadenceAdvancedForm.markError( required[n], error_type, self );
								}
							} else if( val === '' ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							}
							break;
						case 'file':
								// mark the error in the field.
								window.kadenceAdvancedForm.markError( required[n], error_type, self );
							break;

					};
				}

			}

			// if already some error found, bail out
			if ( error ) {
				// add error notice
				window.kadenceAdvancedForm.addErrorNotice( self );

				return false;
			}
			//var form_data = self.serialize();
			var form_data = new FormData(self);
			form_data.set( '_kb_form_verify', kb_adv_form_params.nonce );
			//form_data = window.kadenceAdvancedForm.serialize( form_data );
			// form_data = new URLSearchParams(form_data);
			//form_data = form_data + '&_kb_form_verify=' + kb_adv_form_params.nonce;
			return form_data;
		},
		createElementFromHTML( htmlString ) {
			var div = document.createElement('div');
			div.innerHTML = htmlString;

			// Change this to div.childNodes to support multiple top-level nodes
			return div.firstChild;
		},
		submit( e, form ) {
			e.preventDefault();
			var event = new Event( 'kb-adv-form-start-submit' );
			// Dispatch the event.
			window.document.body.dispatchEvent(event);
			var submitButton = form.querySelector('.kb-adv-form-submit-button');
			var form_data = window.kadenceAdvancedForm.validateForm( form );
			if ( form_data ) {
				var el = document.createElement('div');
				el.classList.add( 'kb-adv-form-loading' );
				el.innerHTML = '<div class="kb-adv-form-loading-spin"><div></div><div></div><div></div><div></div></div>';
				form.append( el );
				submitButton.setAttribute( 'disabled', 'disabled' )
				submitButton.classList.add( 'button-primary-disabled' );

				let fetchOptions = {
					method: 'POST',
					body  : form_data,
				};

				fetch( kb_adv_form_params.ajaxurl, fetchOptions ).then( ( response ) => {
					if ( form.querySelector( '.g-recaptcha' ) ) {
						grecaptcha.reset();
					}
					submitButton.removeAttribute( 'disabled' );
					submitButton.classList.remove( 'button-primary-disabled' );
					form.querySelector( '.kb-adv-form-loading' ).remove();

					if ( response.status >= 200 && response.status < 400 ) {
						return response.json();
					}

				} ).then( ( body ) => {

					var response = body;

					if ( response.success ) {
						const submissionResults = response?.submissionResults;
						var event = new CustomEvent( 'kb-advanced-form-success', {
							'detail': {
								'uniqueId'         : ( form.querySelector( 'input[name="_kb_adv_form_id"]' ) ? form.querySelector( 'input[name="_kb_adv_form_id"]' ).value : '' ),
								'submissionResults': submissionResults,
							},
						} );
						// Dispatch the event.
						window.document.body.dispatchEvent( event );
						if ( response.redirect ) {
							window.location.replace( response.redirect );
						} else {
							window.kadenceAdvancedForm.insertAfter( window.kadenceAdvancedForm.createElementFromHTML( response.html ), form );
							if ( response?.hide ) {
								form.remove();
							} else {
								window.kadenceAdvancedForm.clearForm( form );
							}
						}
					} else {
						if ( response.data ) {
							window.kadenceAdvancedForm.insertAfter( window.kadenceAdvancedForm.createElementFromHTML( response.data.html ), form );
							if ( response.data.required ) {
								if ( form.querySelector( '[name="' + response.data.required + '"]' ) ) {
									window.kadenceAdvancedForm.markError( form.querySelector( '[name="' + response.data.required + '"]' ), 'required', form );
								}
							}
						}
					}

				} ).catch( function( error ) {
					console.log( 'Connection error' );
				} );

			}

		},
		initForms() {
			var forms = document.querySelectorAll( 'form.kb-advanced-form' );
			if ( ! forms.length ) {
				return;
			}
			var click_function = function( form ) {
				return function curried_func(e) {
					window.kadenceAdvancedForm.submit( e, form );
				}
			}
			for ( var n = 0; n < forms.length; n++ ) {
				forms[n].addEventListener('submit', click_function( forms[n] ) );
			}
		},
		initFloatingLabels() {
			var inputs = document.querySelectorAll( '.kb-adv-form-label-style-float .kb-adv-form-text-type-input input, .kb-adv-form-label-style-float .kb-adv-form-text-type-input textarea' );
			if ( ! inputs.length ) {
				return;
			}
			var focus_function = function( input ) {
				return function curried_func(e) {
					input.parentNode.classList.add( 'kb-form-field-focus' );
				}
			}
			var blur_function = function( input ) {
				return function curried_func(e) {
					if ( ! input.value ) {
						input.parentNode.classList.remove( 'kb-form-field-focus' );
					}
				}
			}
			for ( var n = 0; n < inputs.length; n++ ) {
				if ( inputs[n].value ) {
					inputs[n].parentNode.classList.add( 'kb-form-field-focus' );
				}
				inputs[n].addEventListener('focus', focus_function( inputs[n] ) );
				inputs[n].addEventListener('blur', blur_function( inputs[n] ) );
			}
		},
		init: function() {
			if ( typeof kb_adv_form_params === 'undefined' ) {
				return false;
			}
			window.kadenceAdvancedForm.initForms();
			window.kadenceAdvancedForm.initFloatingLabels();
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceAdvancedForm.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceAdvancedForm.init();
	}
}() );
