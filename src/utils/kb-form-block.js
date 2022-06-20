/* global kadence_blocks_form_params */
( function() {
	'use strict';
	window.kadenceForm = {
		error_item: 1,
		clearForm( form ) {
			form.reset();
		},
		insertAfter( newNode, referenceNode ) {
			referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
		},
		markError( item, error_type, form ) {
			var error_string = '';
			if ( ! form.classList.contains( 'kb-form-has-error' ) ) {
				form.classList.add( 'kb-form-has-error' );
			}
			item.classList.add( 'has-error' );
			if ( error_type ) {
				switch ( error_type ) {
					case 'required' :
						error_string = item.getAttribute('data-required-message');
						if ( ! error_string || '' === error_string || undefined === error_string ) {
							error_string = item.getAttribute('data-label');
							if ( ! error_string || '' === error_string || undefined === error_string ) {
								error_string = kadence_blocks_form_params[ 'item' ];
							}
							error_string = error_string + ' ' + kadence_blocks_form_params[error_type];
						}
						break;
					case 'mismatch' :
						error_string = item.getAttribute('data-mismatch-message');
						if ( ! error_string || '' === error_string || undefined === error_string ) {
							error_string = item.getAttribute('data-label');
							if ( ! error_string || '' === error_string || undefined === error_string ) {
								error_string = kadence_blocks_form_params[ 'item' ];
							}
							error_string = error_string + ' ' + kadence_blocks_form_params[error_type];
						}
						break;
					case 'validation' :
						error_string = item.getAttribute('data-validation-message');
						if ( ! error_string || '' === error_string || undefined === error_string ) {
							error_string = item.getAttribute('data-label');
							if ( ! error_string || '' === error_string || undefined === error_string ) {
								error_string = kadence_blocks_form_params[ 'item' ];
							}
							error_string = error_string + ' ' + kadence_blocks_form_params[error_type];
						}
						break
				}
				var next = item.parentNode.querySelector( '.kb-form-error-msg' );
				if ( next ) {
					next.remove();
				}
				var error_id = item.getAttribute('name') + '-error';
				item.setAttribute( 'aria-describedby', error_id );
				item.setAttribute( 'aria-invalid', 'true' );
				var el = document.createElement('div');
				el.id = error_id;
				el.classList.add( 'kb-form-error-msg' );
				el.classList.add( 'kadence-blocks-form-warning' );
				el.setAttribute( 'role', 'alert' );
				el.innerHTML = error_string;
				if ( item.classList.contains( 'kb-checkbox-style' ) ) {
					item.parentNode.append( el );
				} else {
					window.kadenceForm.insertAfter( el, item );
				}
			}
			if ( 1 === window.kadenceForm.error_item ) {
				item.focus();
			}
			window.kadenceForm.error_item ++;
		},
		addErrorNotice( form ) {
			var error_message = form.getAttribute('data-error-message');
			if ( ! error_message || '' === error_message || undefined === error_message ) {
				error_message = kadence_blocks_form_params.error_message;
			}
			var el = document.createElement('div');
			el.classList.add( 'kadence-blocks-form-message' );
			el.classList.add( 'kadence-blocks-form-warning' );
			el.innerHTML = error_message;
			window.kadenceForm.insertAfter( el, form );
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
			if ( item.classList.contains( 'kb-form-has-error' ) ) {
				item.classList.remove( 'kb-form-has-error' );
			}
			var errors = item.querySelectorAll( '.has-error' );
			if ( errors.length ) {
				for ( var n = 0; n < errors.length; n++ ) {
					errors[n].classList.remove( 'has-error' );
					errors[n].removeAttribute( 'aria-describedby' );
					errors[n].removeAttribute( 'aria-invalid' );
					var next = errors[n].parentNode.querySelector( '.kb-form-error-msg' );
					if ( next ) {
						next.remove();
					}
				}
			}
			var message = document.querySelectorAll( '.kadence-blocks-form-message' );
			if ( message.length ) {
				for ( var n = 0; n < message.length; n++ ) {
					message[n].remove();
				}
			}
			var notices = item.querySelectorAll( '.kb-form-errors' );
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
			window.kadenceForm.removeErrors( self );
			// ===== Validate: Text and Textarea ========
			var required = self.querySelectorAll( '[data-required="yes"]' );
			if ( required.length ) {
				for ( var n = 0; n < required.length; n++ ) {
					var data_type = required[n].getAttribute('data-type'),
					val = '';
					switch( data_type ) {
						case 'textarea':
						case 'text':

							val = required[n].value.trim();

							if ( val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
							}
							break;
						case 'tel':

							val = required[n].value.trim();
							if ( val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
							}
							break;
						case 'accept':
							if ( required[n].checked == false ){
								error = true;
								error_type = 'required';
								console.log( 'here' );
								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
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
									window.kadenceForm.markError( required[n], error_type, self );
								}
							} else {

								// console.log(val);
								if ( !val || val === '-1' ) {
									error = true;
									error_type = 'required';

									// mark the error in the field.
									window.kadenceForm.markError( required[n], error_type, self );
								}
							}
							break;

						case 'radio':
							var length = required[n].querySelector('input:checked');

							if ( !length ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
							}
							break;

						case 'checkbox':
							var length = required[n].querySelector('input:checked');

							if ( !length ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
							}
							break;
		
						case 'email':
							var val = required[n].value.trim();

							if ( val !== '' ) {
								//run the validation
								if( ! window.kadenceForm.isValidEmail( val ) ) {
									error = true;
									error_type = 'validation';

									// mark the error in the field.
									window.kadenceForm.markError( required[n], error_type, self );
								}
							} else if( val === '' ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
							}
							break;
						case 'url':
							var val = required[n].value.trim();

							if ( val !== '' ) {
								//run the validation
								if( ! window.kadenceForm.isValidURL( val ) ) {
									error = true;
									error_type = 'validation';

									// mark the error in the field.
									window.kadenceForm.markError( required[n], error_type, self );
								}
							} else if( val === '' ) {
								error = true;
								error_type = 'required';

								// mark the error in the field.
								window.kadenceForm.markError( required[n], error_type, self );
							}
							break;

					};
				}

			}

			// if already some error found, bail out
			if ( error ) {
				// add error notice
				window.kadenceForm.addErrorNotice( self );

				return false;
			}
			//var form_data = self.serialize();
			var form_data = new FormData(self);
			form_data.set( '_kb_form_verify', kadence_blocks_form_params.nonce );
			//form_data = window.kadenceForm.serialize( form_data );
			form_data = new URLSearchParams(form_data);
			//form_data = form_data + '&_kb_form_verify=' + kadence_blocks_form_params.nonce;
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
			var event = new Event( 'kb-form-start-submit' );
			// Dispatch the event.
			window.document.body.dispatchEvent(event);
			var submitButton = form.querySelector('.kb-forms-submit');
			var form_data = window.kadenceForm.validateForm( form );
			if ( form_data ) {
				var el = document.createElement('div');
				el.classList.add( 'kb-form-loading' );
				el.innerHTML = '<div class="kb-form-loading-spin"><div></div><div></div><div></div><div></div></div>';
				form.append( el );
				submitButton.setAttribute( 'disabled', 'disabled' )
				submitButton.classList.add( 'button-primary-disabled' );
				var request = new XMLHttpRequest();
				request.open( 'POST', kadence_blocks_form_params.ajaxurl, true );
				request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
				request.onload = function () {
					if ( this.status >= 200 && this.status < 400 ) {
						// If successful
						//console.log( JSON.parse( this.response ) );
						var response = JSON.parse( this.response );
						if ( response.success ) {
							var event = new CustomEvent( 'kb-form-success', {
								'detail': ( form.querySelector( 'input[name="_kb_form_id"]' ) ? form.querySelector( 'input[name="_kb_form_id"]' ).value : '' ),
							} );
							// Dispatch the event.
							window.document.body.dispatchEvent(event);
							if ( response.redirect ) {
								window.location = response.redirect;
							} else {
								window.kadenceForm.insertAfter( window.kadenceForm.createElementFromHTML( response.html ), form );
								if ( form.querySelector('.g-recaptcha') ) {
									grecaptcha.reset();
								}
								window.kadenceForm.clearForm( form );
							}
						} else {
							if ( response.data ) {
								window.kadenceForm.insertAfter( window.kadenceForm.createElementFromHTML( response.data.html ), form );
								if ( response.data.required ) {
									if ( form.querySelector( '[name="' + response.data.required + '"]' ) ) {
										window.kadenceForm.markError( form.querySelector( '[name="' + response.data.required + '"]' ), 'required', form );
									}
								}
							}
						}
					}
					if ( form.querySelector('.g-recaptcha') ) {
						grecaptcha.reset();
					}
					submitButton.removeAttribute( 'disabled' );
					submitButton.classList.remove( 'button-primary-disabled' );
					form.querySelector( '.kb-form-loading' ).remove();
				};
				request.onerror = function() {
					// Connection error
					console.log('Connection error');
				};
				request.send( form_data.toString() );
			}

		},
		checkParentClass( element, classname ) {
			if ( element.className.split(' ').indexOf( classname ) >=0 ) return element.id;
			return element.parentNode && window.kadenceForm.checkParentClass( element.parentNode, classname );
		},
		verifySource( form ) {
			var input = form.querySelector( 'input[name="_kb_form_post_id"]' );
			if ( ! input ) {
				return;
			}
			if ( ! input.value || 'block-unknown' === input.value ) {
				var theID = window.kadenceForm.checkParentClass( form.parentNode, 'widget_block' );
				if ( theID ) {
					input.value = theID;
				}
			}
		},
		initForms() {
			var forms = document.querySelectorAll( 'form.kb-form' );
			if ( ! forms.length ) {
				return;
			}
			var click_function = function( form ) {
				return function curried_func(e) {
					window.kadenceForm.submit( e, form );
				}
			}
			for ( var n = 0; n < forms.length; n++ ) {
				window.kadenceForm.verifySource( forms[n] );
				forms[n].addEventListener('submit', click_function( forms[n] ) );
			}
		},
		init: function() {
			if ( typeof kadence_blocks_form_params === 'undefined' ) {
				return false;
			}
			window.kadenceForm.initForms();
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceForm.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceForm.init();
	}
}() );
		