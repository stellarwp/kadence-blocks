/* global kadence_blocks_advanced_form_params */
(function () {
	'use strict';
	window.kadenceAdvancedForm = {
		error_item: 1,
		clearForm(form) {
			form.reset();
		},
		ensureLiveRegion(form) {
			let liveRegion = form.querySelector('.kb-form-live-region');
			if (!liveRegion) {
				liveRegion = document.createElement('div');
				liveRegion.className = 'kb-form-live-region';
				liveRegion.setAttribute('aria-live', 'polite');
				liveRegion.setAttribute('aria-atomic', 'true');
				liveRegion.setAttribute('role', 'status');
				// Screen reader only - visually hidden
				liveRegion.style.position = 'absolute';
				liveRegion.style.left = '-10000px';
				liveRegion.style.width = '1px';
				liveRegion.style.height = '1px';
				liveRegion.style.overflow = 'hidden';
				form.appendChild(liveRegion);
			}
			return liveRegion;
		},
		announceMessage(form, message, priority = 'polite') {
			const liveRegion = window.kadenceAdvancedForm.ensureLiveRegion(form);
			// Clear previous message
			liveRegion.textContent = '';
			// Set priority
			liveRegion.setAttribute('aria-live', priority);
			// Small delay to ensure screen reader picks up the change
			setTimeout(() => {
				liveRegion.textContent = message;
			}, 100);
		},
		insertAfter(newNode, referenceNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		},
		markError(item, error_type, form, fieldErrorMessages = null) {
			let error_string = '';
			if (!form.classList.contains('kb-adv-form-has-error')) {
				form.classList.add('kb-adv-form-has-error');
			}
			item.classList.add('has-error');
			if (error_type) {
				switch (error_type) {
					case 'required':
						// Check for user provided required message
						const manual_error_string = item.getAttribute('data-kb-required-message');
						if (manual_error_string && '' !== manual_error_string) {
							error_string = manual_error_string;
							break;
						}
						error_string = item.getAttribute('data-required-message');
						if (!error_string || '' === error_string || undefined === error_string) {
							error_string = item.getAttribute('data-label');
							if (!error_string || '' === error_string || undefined === error_string) {
								error_string = kb_adv_form_params.item;
							}
							error_string = error_string + ' ' + kb_adv_form_params[error_type];
						}
						break;
					case 'mismatch':
						error_string = item.getAttribute('data-mismatch-message');
						if (!error_string || '' === error_string || undefined === error_string) {
							error_string = item.getAttribute('data-label');
							if (!error_string || '' === error_string || undefined === error_string) {
								error_string = kb_adv_form_params.item;
							}
							error_string = error_string + ' ' + kb_adv_form_params[error_type];
						}
						break;
					case 'validation':
						error_string = item.getAttribute('data-validation-message');
						if (!error_string || '' === error_string || undefined === error_string) {
							error_string = item.getAttribute('data-label');
							if (!error_string || '' === error_string || undefined === error_string) {
								error_string = kb_adv_form_params.item;
							}
							error_string = error_string + ' ' + kb_adv_form_params[error_type];
						}
						break;
				}
				const next = item.parentNode.querySelector('.kb-adv-form-error-msg');
				if (next) {
					next.remove();
				}
				const error_id = item.getAttribute('name') + '-error';
				item.setAttribute('aria-describedby', error_id);
				item.setAttribute('aria-invalid', 'true');
				const el = document.createElement('div');
				el.id = error_id;
				el.classList.add('kb-adv-form-error-msg');
				el.classList.add('kb-adv-form-message');
				el.classList.add('kb-adv-form-warning');
				el.setAttribute('role', 'alert');
				el.setAttribute('aria-live', 'assertive');
				el.innerHTML = window.kadenceAdvancedForm.strip_tags(error_string, '<div><a><b><i><u><p><ol><ul>');
				if (item.classList.contains('kb-accept-field')) {
					item.parentNode.parentNode.append(el);
				} else if (item.classList.contains('kb-checkbox-field') || item.classList.contains('kb-radio-field')) {
					item.parentNode.append(el);
				} else {
					window.kadenceAdvancedForm.insertAfter(el, item);
				}

				// Add error message and item reference to collection array if provided
				if (fieldErrorMessages && error_string) {
					fieldErrorMessages.push({
						message: error_string,
						item,
					});
				}
			}
			if (1 === window.kadenceAdvancedForm.error_item) {
				item.focus();
			}
			window.kadenceAdvancedForm.error_item++;
		},
		addErrorNotice(form, fieldErrorMessages = [], customErrorMessage = '') {
			let error_message = form.getAttribute('data-error-message');
			if (!error_message || '' === error_message || undefined === error_message) {
				error_message = kb_adv_form_params.error_message;
			}

			// Combine main error message with field error messages
			let fullErrorMessage = customErrorMessage || error_message;
			if (fieldErrorMessages.length > 0) {
				fullErrorMessage += '<ul class="kb-adv-form-field-errors">';
				fieldErrorMessages.forEach(function (errorObj) {
					const errorMsg = errorObj.message;
					const errorItem = errorObj.item;
					const itemId = errorItem.getAttribute('id') || errorItem.getAttribute('name');

					if (itemId) {
						fullErrorMessage +=
							'<li><a href="#' +
							itemId +
							'" class="kb-adv-form-error-link" data-field-id="' +
							itemId +
							'">' +
							window.kadenceAdvancedForm.strip_tags(errorMsg, '<div><a><b><i><u><p><ol><ul>') +
							'</a></li>';
					} else {
						fullErrorMessage +=
							'<li>' +
							window.kadenceAdvancedForm.strip_tags(errorMsg, '<div><a><b><i><u><p><ol><ul>') +
							'</li>';
					}
				});
				fullErrorMessage += '</ul>';
			}

			const el = document.createElement('div');
			el.classList.add('kb-adv-form-message');
			el.classList.add('kb-adv-form-warning');
			el.setAttribute('role', 'alert');
			el.setAttribute('aria-live', 'assertive');
			el.innerHTML = window.kadenceAdvancedForm.strip_tags(fullErrorMessage, '<div><a><b><i><u><p><ol><ul><li>');

			// Announce to screen readers using live region
			window.kadenceAdvancedForm.announceMessage(form, fullErrorMessage, 'assertive');

			// Insert visual message
			window.kadenceAdvancedForm.insertAfter(el, form);
		},
		isValidEmail(email) {
			const pattern = new RegExp(
				/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
			);
			return pattern.test(email);
		},
		isValidURL(url) {
			const urlregex = new RegExp(
				'^(http://www.|https://www.|ftp://www.|www.|http://|https://){1}([0-9A-Za-z]+.)'
			);
			return urlregex.test(url);
		},
		isValidTel(tel) {
			const telregex = new RegExp('/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im');
			return telregex.test(tel);
		},
		removeErrors(item) {
			if (item.classList.contains('kb-adv-form-has-error')) {
				item.classList.remove('kb-adv-form-has-error');
			}
			const errors = item.querySelectorAll('.has-error');
			if (errors.length) {
				for (var n = 0; n < errors.length; n++) {
					errors[n].classList.remove('has-error');
					errors[n].removeAttribute('aria-describedby');
					errors[n].removeAttribute('aria-invalid');
					const next = errors[n].parentNode.querySelector('.kb-adv-form-error-msg');
					if (next) {
						next.remove();
					}
				}
			}
			const message = document.querySelectorAll('.kb-adv-form-message');
			if (message.length) {
				for (var n = 0; n < message.length; n++) {
					message[n].remove();
				}
			}
			const notices = item.querySelectorAll('.kb-adv-form-errors');
			if (notices.length) {
				for (var n = 0; n < notices.length; n++) {
					notices[n].remove();
				}
			}
		},
		serialize(data) {
			const obj = {};
			for (const [key, value] of data) {
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
		validateForm(self) {
			let error = false,
				error_type = '',
				fieldErrorMessages = [];
			// remove all initial errors if any.
			window.kadenceAdvancedForm.removeErrors(self);
			// ===== Validate: Text and Textarea ========
			const required = self.querySelectorAll('[data-required="yes"]:not([disabled])');
			if (false) {
				for (let n = 0; n < required.length; n++) {
					var data_type = required[n].getAttribute('data-type'),
						val = '';
					switch (data_type) {
						case 'textarea':
						case 'text':
							val = required[n].value.trim();

							if (val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;
						case 'tel':
							val = required[n].value.trim();
							if (val !== '') {
								//run the validation
								// if( ! window.kadenceAdvancedForm.isValidTel( val ) ) {
								// 	error = true;
								// 	error_type = 'validation';
								// 	// mark the error in the field.
								// 	window.kadenceAdvancedForm.markError( required[n], error_type, self );
								// }
							} else if (val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;
						case 'accept':
							if (required[n].checked == false) {
								error = true;
								error_type = 'required';
								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;

						case 'select':
							val = required[n].value;
							//console.log(val );
							if (required[n].multiple) {
								if (val === null || val.length === 0) {
									error = true;
									error_type = 'required';

									// mark the error in the field and collect error message.
									window.kadenceAdvancedForm.markError(
										required[n],
										error_type,
										self,
										fieldErrorMessages
									);
								}
							} else if (!val || val === '-1') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;

						case 'radio':
							var length = required[n].querySelector('input:checked');

							if (!length) {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;

						case 'checkbox':
							var length = required[n].querySelector('input:checked');

							if (!length) {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;

						case 'email':
							var val = required[n].value.trim();

							if (val !== '') {
								//run the validation
								if (!window.kadenceAdvancedForm.isValidEmail(val)) {
									error = true;
									error_type = 'validation';

									// mark the error in the field and collect error message.
									window.kadenceAdvancedForm.markError(
										required[n],
										error_type,
										self,
										fieldErrorMessages
									);
								}
							} else if (val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;
						case 'url':
							var val = required[n].value.trim();

							if (val !== '') {
								//run the validation
								if (!window.kadenceAdvancedForm.isValidURL(val)) {
									error = true;
									error_type = 'validation';

									// mark the error in the field and collect error message.
									window.kadenceAdvancedForm.markError(
										required[n],
										error_type,
										self,
										fieldErrorMessages
									);
								}
							} else if (val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;
						case 'file':
							val = required[n].value.trim();

							if (val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;

						case 'number':
							val = required[n].value.trim();

							if (val === '') {
								error = true;
								error_type = 'required';

								// mark the error in the field and collect error message.
								window.kadenceAdvancedForm.markError(required[n], error_type, self, fieldErrorMessages);
							}
							break;
					}
				}
			}

			// if already some error found, bail out
			if (error) {
				// add error notice with collected field error messages
				window.kadenceAdvancedForm.addErrorNotice(self, fieldErrorMessages);

				return false;
			}
			//var form_data = self.serialize();
			const form_data = new FormData(self);
			form_data.set('_kb_form_verify', kb_adv_form_params.nonce);
			//form_data = window.kadenceAdvancedForm.serialize( form_data );
			// form_data = new URLSearchParams(form_data);
			//form_data = form_data + '&_kb_form_verify=' + kb_adv_form_params.nonce;
			return form_data;
		},
		strip_tags(input, allowed) {
			allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
			const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
			return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
				return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
			});
		},
		createElementFromHTML(htmlString) {
			const div = document.createElement('div');
			div.innerHTML = window.kadenceAdvancedForm.strip_tags(htmlString, '<div><a><b><i><u><p><ol><ul><li>');

			// Change this to div.childNodes to support multiple top-level nodes
			return div.firstChild;
		},
		extractTextFromHTML(htmlString) {
			const div = document.createElement('div');
			div.innerHTML = htmlString;
			return div.textContent || div.innerText || '';
		},
		submit(e, form) {
			e.preventDefault();
			const event = new Event('kb-adv-form-start-submit');
			// Dispatch the event.
			window.document.body.dispatchEvent(event);
			const submitButton = form.querySelector('.kb-adv-form-submit-button');
			const form_data = window.kadenceAdvancedForm.validateForm(form);
			if (form_data) {
				const el = document.createElement('div');
				el.classList.add('kb-adv-form-loading');
				el.innerHTML =
					'<div class="kb-adv-form-loading-spin"><div></div><div></div><div></div><div></div></div>';
				form.append(el);
				submitButton.setAttribute('disabled', 'disabled');
				submitButton.classList.add('button-primary-disabled');

				const fetchOptions = {
					method: 'POST',
					body: form_data,
				};
				console.log('fetching');

				fetch(kb_adv_form_params.ajaxurl, fetchOptions)
					.then((response) => {
						if (form.querySelector('.g-recaptcha')) {
							grecaptcha.reset();
						}
						submitButton.removeAttribute('disabled');
						submitButton.classList.remove('button-primary-disabled');
						form.querySelector('.kb-adv-form-loading').remove();

						if (response.status >= 200 && response.status < 400) {
							return response.json();
						}
					})
					.then((body) => {
						const response = body;

						if (response.success) {
							const submissionResults = response?.submissionResults;
							const event = new CustomEvent('kb-advanced-form-success', {
								detail: {
									uniqueId: form.querySelector('input[name="_kb_adv_form_id"]')
										? form.querySelector('input[name="_kb_adv_form_id"]').value
										: '',
									submissionResults,
								},
							});
							// Dispatch the event.
							window.document.body.dispatchEvent(event);
							window.kadenceAdvancedForm.event('submitted', form);
							if (response.redirect) {
								window.location.replace(response.redirect);
							} else {
								// Announce success message to screen readers
								const successText = window.kadenceAdvancedForm.extractTextFromHTML(response.html);
								window.kadenceAdvancedForm.announceMessage(form, successText, 'polite');

								// Insert visual message
								window.kadenceAdvancedForm.insertAfter(
									window.kadenceAdvancedForm.createElementFromHTML(response.html),
									form
								);
								window.kadenceAdvancedForm.clearForm(form);
								if (response?.hide) {
									form.remove();
								}
							}
						} else if (response.data) {
							console.log('failed');
							window.kadenceAdvancedForm.event('failed', form);

							// // Announce error message to screen readers
							// const errorText = window.kadenceAdvancedForm.extractTextFromHTML(response.data.html);
							// window.kadenceAdvancedForm.announceMessage(form, errorText, 'assertive');

							// // Insert visual message
							// window.kadenceAdvancedForm.insertAfter(
							// 	window.kadenceAdvancedForm.createElementFromHTML(response.data.html),
							// 	form
							// );
							const fieldErrorMessages = [];
							if (response.data.fieldErrors) {
								for (const fieldError of response.data.fieldErrors) {
									if (form.querySelector('[name="' + fieldError.field + '"]')) {
										window.kadenceAdvancedForm.markError(
											form.querySelector('[name="' + fieldError.field + '"]'),
											'required',
											form,
											fieldErrorMessages
										);
									}
								}
							}
							window.kadenceAdvancedForm.addErrorNotice(form, fieldErrorMessages, response.data.message);
						}
					})
					.catch(function (error) {
						console.log('Connection error');
					});
			}
		},
		event(type, form) {
			if (form.getAttribute('data-kb-events') === 'yes') {
				const event_data = new FormData();
				event_data.set('action', 'kadence_adv_form_event');
				event_data.set('type', type);
				event_data.set('_kb_form_verify', kb_adv_form_params.nonce);
				event_data.set('_kb_adv_form_post_id', form.querySelector('input[name="_kb_adv_form_post_id"]').value);
				const fetchOptions = {
					method: 'POST',
					body: event_data,
				};
				fetch(kb_adv_form_params.ajaxurl, fetchOptions)
					.then((response) => {
						//console.log( 'event_response', response );
						if (response.status >= 200 && response.status < 400) {
							return response.json();
						}
					})
					.then((body) => {
						//console.log( 'event_body', body );
					})
					.catch(function (error) {
						console.log('Connection error');
					});
			}
		},
		initForms() {
			const forms = document.querySelectorAll('form.kb-advanced-form');
			if (!forms.length) {
				return;
			}
			const start_function = function (form) {
				return function curried_func(e) {
					window.kadenceAdvancedForm.event('started', form);
				};
			};
			const click_function = function (form) {
				return function curried_func(e) {
					window.kadenceAdvancedForm.submit(e, form);
				};
			};
			for (let n = 0; n < forms.length; n++) {
				window.kadenceAdvancedForm.event('viewed', forms[n]);
				forms[n].addEventListener('change', start_function(forms[n]), { once: true });
				forms[n].addEventListener('submit', click_function(forms[n]));
			}
		},
		initFloatingLabels() {
			const inputs = document.querySelectorAll(
				'.kb-adv-form-label-style-float .kb-adv-form-text-type-input input, .kb-adv-form-label-style-float .kb-adv-form-text-type-input textarea'
			);
			if (!inputs.length) {
				return;
			}
			const focus_function = function (input) {
				return function curried_func(e) {
					input.parentNode.classList.add('kb-form-field-focus');
				};
			};
			const blur_function = function (input) {
				return function curried_func(e) {
					if (!input.value) {
						input.parentNode.classList.remove('kb-form-field-focus');
					}
				};
			};
			for (let n = 0; n < inputs.length; n++) {
				if (inputs[n].value) {
					inputs[n].parentNode.classList.add('kb-form-field-focus');
				}
				inputs[n].addEventListener('focus', focus_function(inputs[n]));
				inputs[n].addEventListener('blur', blur_function(inputs[n]));
			}
		},
		init() {
			if (typeof kb_adv_form_params === 'undefined') {
				return false;
			}
			window.kadenceAdvancedForm.initForms();
			window.kadenceAdvancedForm.initFloatingLabels();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceAdvancedForm.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceAdvancedForm.init();
	}
})();
