<?php
/**
 * Form Ajax Handing.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Main plugin class
 */
class KB_Ajax_Form {

	/**
	 * Instance Control
	 *
	 * @var null
	 */
	private static $instance = null;
	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_kb_process_ajax_submit', array( $this, 'process_ajax' ) );
		add_action( 'wp_ajax_nopriv_kb_process_ajax_submit', array( $this, 'process_ajax' ) );
	}

	/**
	 * Process the form submit.
	 */
	public function process_ajax() {
		if ( isset( $_POST['_kb_form_id'] ) && ! empty( $_POST['_kb_form_id'] ) && isset( $_POST['_kb_form_post_id'] ) && ! empty( $_POST['_kb_form_post_id'] ) ) {
			$this->start_buffer();
			$valid = true;
			if ( apply_filters( 'kadence_blocks_form_verify_nonce', false ) ) {
				$valid = check_ajax_referer( 'kb_form_nonce', '_kb_form_verify', false );
			}
			if ( $valid ) {
				// Lets get form data.
				$form_id = sanitize_text_field( wp_unslash( $_POST['_kb_form_id'] ) );
				$post_id = sanitize_text_field( wp_unslash( $_POST['_kb_form_post_id'] ) );
				$form_args = $this->get_form_args( $post_id, $form_id );
				if ( ! $form_args ) {
					$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'Data not Found', 'kadence-blocks' ) );
				}
				// Check for default form actions.
				if ( ! isset( $form_args['actions'] ) ) {
					$form_args['actions'] = array( 'email' );
				}
				if ( ! isset( $form_args['email'] ) ) {
					$form_args['email'] = array(
						0 => array(
							'emailTo' => get_bloginfo( 'admin_email' ),
							'subject' => '[' . get_bloginfo( 'name' ) . ' ' . __( 'Submission', 'kadence-blocks' ) . ']',
							'replyTo' => 'email_field',
							'html'    => true,
						),
					);
				}
				// Check for Message strings.
				$messages = array(
					0 => array(
						'success'          => esc_html__( 'Submission Success, Thanks for getting in touch!', 'kadence-blocks' ),
						'error'            => esc_html__( 'Submission Failed', 'kadence-blocks' ),
						'recaptchaerror'   => esc_html__( 'Submission Failed, reCaptcha spam prevention. Please reload your page and try again.', 'kadence-blocks' ),
					),
				);
				if ( isset( $form_args['messages'] ) && isset( $form_args['messages'][0] ) ) {
					if ( isset( $form_args['messages'][0]['recaptchaerror'] ) && ! empty( $form_args['messages'][0]['recaptchaerror'] ) ) {
						$messages[0]['recaptchaerror'] = $form_args['messages'][0]['recaptchaerror'];
					}
					if ( isset( $form_args['messages'][0]['success'] ) && ! empty( $form_args['messages'][0]['success'] ) ) {
						$messages[0]['success'] = $form_args['messages'][0]['success'];
					}
					if ( isset( $form_args['messages'][0]['error'] ) && ! empty( $form_args['messages'][0]['error'] ) ) {
						$messages[0]['error'] = $form_args['messages'][0]['error'];
					}
					if ( isset( $form_args['messages'][0]['required'] ) && ! empty( $form_args['messages'][0]['required'] ) ) {
						$messages[0]['required'] = $form_args['messages'][0]['required'];
					}
					if ( isset( $form_args['messages'][0]['invalid'] ) && ! empty( $form_args['messages'][0]['invalid'] ) ) {
						$messages[0]['invalid'] = $form_args['messages'][0]['invalid'];
					}
				}
				// Check Honey Pot.
				$honeypot_check_enabled = ! isset( $form_args['honeyPot'] ) || ( isset( $form_args['honeyPot'] ) && true === $form_args['honeyPot'] );
				if ( $honeypot_check_enabled && isset( $_POST['_kb_verify_email'] ) ) {
					$honeypot_check = htmlspecialchars( $_POST['_kb_verify_email'], ENT_QUOTES );
					if ( ! empty( $honeypot_check ) ) {
						$this->process_bail( __( 'Submission Rejected', 'kadence-blocks' ), __( 'Spam Detected', 'kadence-blocks' ) );
					}
				}
				// Check Recaptcha.
				if ( isset( $form_args['recaptcha'] ) && true === $form_args['recaptcha'] ) {
					if ( isset( $form_args['recaptchaVersion'] ) && 'v2' === $form_args['recaptchaVersion'] ) {
						if ( ! isset( $_POST['g-recaptcha-response'] ) || empty( $_POST['g-recaptcha-response'] ) ) {
							$this->process_bail( $messages[0]['recaptchaerror'], __( 'reCAPTCHA Failed', 'kadence-blocks' ) );
						}
						if ( ! $this->verify_recaptcha_v2( $_POST['g-recaptcha-response'] ) ) {
							$this->process_bail( $messages[0]['recaptchaerror'], __( 'reCAPTCHA Failed', 'kadence-blocks' ) );
						}
					} else {
						if ( ! $this->verify_recaptcha( $_POST['recaptcha_response'] ) ) {
							$this->process_bail( $messages[0]['recaptchaerror'], __( 'reCAPTCHA Failed', 'kadence-blocks' ) );
						}
					}
					unset( $_POST['recaptcha_response'] );
				}
				unset( $_POST['_kb_form_sub_id'], $_POST['_kb_verify_email'] );
				// Get fields.
				$fields = array();
				if ( ! isset( $form_args['fields'] ) || ! is_array( $form_args['fields'] ) ) {
					$form_args['fields'] = array(
						0 => array(
							'label'       => 'Name',
							'showLabel'   => true,
							'placeholder' => '',
							'default'     => '',
							'rows'        => 4,
							'options'     => array(),
							'multiSelect' => false,
							'inline'      => false,
							'showLink'    => false,
							'min'         => '',
							'max'         => '',
							'type'        => 'text',
							'required'    => false,
							'width'       => array( '100', '', '' ),
							'auto'        => '',
						),
						1 => array(
							'label'       => 'Email',
							'showLabel'   => true,
							'placeholder' => '',
							'default'     => '',
							'rows'        => 4,
							'options'     => array(),
							'multiSelect' => false,
							'inline'      => false,
							'showLink'    => false,
							'min'         => '',
							'max'         => '',
							'type'        => 'email',
							'required'    => true,
							'width'       => array( '100', '', '' ),
							'auto'        => '',
						),
						2 => array(
							'label'       => 'Message',
							'showLabel'   => true,
							'placeholder' => '',
							'default'     => '',
							'rows'        => 4,
							'options'     => array(),
							'multiSelect' => false,
							'inline'      => false,
							'showLink'    => false,
							'min'         => '',
							'max'         => '',
							'type'        => 'textarea',
							'required'    => true,
							'width'       => array( '100', '', '' ),
							'auto'        => '',
						),
					);
				}
				$privacy_title = ( get_option( 'wp_page_for_privacy_policy' ) ? get_the_title( get_option( 'wp_page_for_privacy_policy' ) ) : '' );
				foreach ( $form_args['fields'] as $key => $data ) {
					// check for required.
					if ( $data['required'] && ( ! isset( $_POST[ 'kb_field_' . $key ] ) || empty( $_POST[ 'kb_field_' . $key ] ) ) ) {
						$this->process_bail( $messages[0]['error'], __( 'Required Field Empty', 'kadence-blocks' ), 'kb_field_' . $key );
					}
					if ( isset( $_POST[ 'kb_field_' . $key ] ) ) {
						$fields[ $key ] = array(
							'type'  => $data['type'],
							'label' => str_replace( '{privacy_policy}', $privacy_title, $data['label'] ),
							'value' => $this->sanitize_field( $data['type'], wp_unslash( $_POST[ 'kb_field_' . $key ] ), $data['multiSelect'] ),
						);
						if ( 'hidden' === $data['type'] ) {
							global $post;
							$refer_id = is_object( $post ) ? $post->ID : url_to_postid( wp_get_referer() );
							$fields[ $key ]['value'] = str_replace( '{page_title}', get_the_title( $refer_id ), $fields[ $key ]['value'] );
							$fields[ $key ]['value'] = str_replace( '{page_url}', wp_get_referer(), $fields[ $key ]['value'] );
							$fields[ $key ]['value'] = str_replace( '{remoteip}', $_SERVER['REMOTE_ADDR'], $fields[ $key ]['value']);
						}
						unset( $_POST[ 'kb_field_' . $key ] );
					}
				}
				$final_data = array(
					'redirect' => false,
				);
				foreach ( $form_args['actions'] as $data ) {
					switch ( $data ) {
						case 'email':
							$to            = isset( $form_args['email'][0]['emailTo'] ) && ! empty( trim( $form_args['email'][0]['emailTo'] ) ) ? trim( $form_args['email'][0]['emailTo'] ) : get_option( 'admin_email' );
							$subject       = isset( $form_args['email'][0]['subject'] ) && ! empty( trim( $form_args['email'][0]['subject'] ) ) ? $form_args['email'][0]['subject'] : '[' . get_bloginfo( 'name' ) . ' ' . __( 'Submission', 'kadence-blocks' ) . ']';
							if ( strpos( $subject, '{field_' ) !== false ) {
								preg_match_all( '/{field_(.*?)}/', $subject, $match ); 
								if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
									foreach ( $match[1] as $field_id ) {
										if ( isset( $field_id ) ) {
											$real_id = absint( $field_id ) - 1;
											if ( isset( $fields[ $real_id ] ) && is_array( $fields[ $real_id ] ) && isset( $fields[ $real_id ]['value'] ) ) {
												$subject = str_replace( '{field_' . $field_id . '}' , $fields[ $real_id ]['value'], $subject );
											}
										}
									}
								}
							}
							if ( strpos( $subject, '{page_title}' ) !== false ) {
								global $post;
								$refer_id = is_object( $post ) ? $post->ID : url_to_postid( wp_get_referer() );
								$subject = str_replace( '{page_title}', get_the_title( $refer_id ), $subject );
							}
							$email_content = '';
							$reply_email   = false;
							foreach ( $fields as $key => $data ) {
								if ( 'email' === $data['type'] ) {
									$reply_email = $data['value'];
								}
							}
							if ( isset( $form_args['email'][0]['replyTo'] ) && 'from_email' === $form_args['email'][0]['replyTo'] ) {
								$reply_email = isset( $form_args['email'][0]['fromEmail'] ) && ! empty( trim( $form_args['email'][0]['fromEmail'] ) ) ? sanitize_email( trim( $form_args['email'][0]['fromEmail'] ) ) : false;
							}
							if ( $form_args['email'][0]['html'] ) {
								$args = array( 'fields' => $fields );
								$email_content = kadence_blocks_get_template_html( 'form-email.php', $args );
							} else {
								foreach ( $fields as $key => $data ) {
									if ( is_array( $data['value'] ) ) {
										$data['value'] = explode( ', ', $data['value'] );
									}
									$email_content .= $data['label'] . ': ' . $data['value'] . "\n\n";
								}
							}
							$body     = $email_content;
							if ( $form_args['email'][0]['html'] ) {
								$headers  = 'Content-Type: text/html; charset=UTF-8' . "\r\n";
							} else {
								$headers  = 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
							}
							if ( $reply_email ) {
								$headers .= 'Reply-To: <' . $reply_email . '>' . "\r\n";
							}
							if ( isset( $form_args['email'][0]['fromEmail'] ) && ! empty( trim( $form_args['email'][0]['fromEmail'] ) ) ) {
								$from_name = ( isset( $form_args['email'][0]['fromName'] ) && ! empty( trim( $form_args['email'][0]['fromName'] ) ) ? trim( $form_args['email'][0]['fromName'] ) . ' ' : '' );
								if ( strpos( $from_name, '{field_' ) !== false ) {
									preg_match_all( '/{field_(.*?)}/', $from_name, $match ); 
									if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
										foreach ( $match[1] as $field_id ) {
											if ( isset( $field_id ) ) {
												$real_id = absint( $field_id ) - 1;
												if ( isset( $fields[ $real_id ] ) && is_array( $fields[ $real_id ] ) && isset( $fields[ $real_id ]['value'] ) ) {
													$from_name = str_replace( '{field_' . $field_id . '}' , $fields[ $real_id ]['value'], $from_name );
												}
											}
										}
									}
								}
								$headers .= 'From: ' . $from_name . '<' . sanitize_email( trim( $form_args['email'][0]['fromEmail'] ) ) . '>' . "\r\n";
							}
							$cc_headers = '';
							if ( isset( $form_args['email'][0]['cc'] ) && ! empty( trim( $form_args['email'][0]['cc'] ) ) ) {
								$cc_headers = 'Cc: ' . sanitize_email( trim( $form_args['email'][0]['cc'] ) ) . "\r\n";
							}

							wp_mail( $to, $subject, $body, $headers . $cc_headers );
							if ( isset( $form_args['email'][0]['bcc'] ) && ! empty( trim( $form_args['email'][0]['bcc'] ) ) ) {
								$bcc_emails = explode( ',', $form_args['email'][0]['bcc'] );
								foreach ( $bcc_emails as $bcc_email ) {
									wp_mail( sanitize_email( trim( $bcc_email ) ), $subject, $body, $headers );
								}
							}
							break;
						case 'redirect':
							if ( isset( $form_args['redirect'] ) && ! empty( trim( $form_args['redirect'] ) ) ) {
								$final_data['redirect'] = apply_filters( 'kadence_blocks_form_redirect', trim( $form_args['redirect'] ), $form_args, $fields, $form_id, $post_id );
							}
							break;
						case 'mailerlite':
							$api_key = get_option( 'kadence_blocks_mailerlite_api' );
							if ( empty( $api_key ) ) {
								return;
							}
							$mailerlite_default = array(
								'map'    => array(),
								'groupe' => '',
							);
							$mailerlite_args = ( isset( $form_args['mailerlite'] ) && is_array( $form_args['mailerlite'] ) && isset( $form_args['mailerlite'][0] ) && is_array( $form_args['mailerlite'][0] ) ? $form_args['mailerlite'][0] : $mailerlite_default );
							$groups = ( isset( $mailerlite_args['group'] ) ? $mailerlite_args['group'] : array() );
							$map = ( isset( $mailerlite_args['map'] ) && is_array( $mailerlite_args['map'] ) ? $mailerlite_args['map'] : array() );
							$body = array(
								'fields' => array(),
							);
							$email = false;
							if ( ! empty( $map ) ) {
								foreach ( $fields as $key => $data ) {
									if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
										if ( 'email' === $map[ $key ] && ! $email ) {
											$email = $data['value'];
											$body['email'] = $data['value'];
										} else {
											$body['fields'][ $map[ $key ] ] = $data['value'];
										}
									}
								}
							} else {
								foreach ( $fields as $key => $data ) {
									if ( 'email' === $data['type'] ) {
										$email = $data['value'];
										$body['email'] = $data['value'];
										break;
									}
								}
							}
							if ( empty( $body['fields'] ) ) {
								unset( $body['fields'] );
							}
							if ( ! empty( $groups ) && is_array( $groups ) && isset( $groups[0] ) && ! empty( $groups[0] ) ) {
								$group_id = $groups[0];
							}
							$body['resubscribe'] = true;
							if ( isset( $body[ 'email' ] ) ) {
								if ( strlen( $api_key ) > 100 ) {
									// New connect API.
									$api_url = 'https://connect.mailerlite.com/api/subscribers';
									if ( ! empty( $group_id ) ) {
										$body['groups'] = array( strval( $group_id ) );
									}
									$auth = 'Authorization';
									$api_key = 'Bearer ' . $api_key;
								} else {
									if ( ! empty( $group_id ) ) {
										$api_url = 'https://api.mailerlite.com/api/v2/groups/' . $group_id . '/subscribers';
									} else {
										$api_url = 'https://api.mailerlite.com/api/v2/subscribers';
									}
									$auth = 'X-MailerLite-ApiKey';
								}
								$response = wp_remote_post(
									$api_url,
									array(
										'method'  => 'POST',
										'timeout' => 15,
										'headers' => array(
											'accept'       => 'application/json',
											'content-type' => 'application/json',
											$auth          => $api_key,
										),
										'body'    => json_encode( $body ),
									)
								);
								if ( is_wp_error( $response ) ) {
									$error_message = $response->get_error_message();
									error_log( "Something went wrong: $error_message" );
								} else {
									if ( ! isset( $response['response'] ) || ! isset( $response['response']['code'] ) ) {
										error_log( __( 'No Response from MailerLite', 'kadence-blocks' ) );
									}
									if ( 400 === $response['response']['code'] ) {
										error_log( print_r( $response['response'], true ) );
										$this->process_bail( $response['response']['message'] . ' ' . __( 'MailerLite Misconfiguration', 'kadence-blocks' ), __( 'MailerLite Failed', 'kadence-blocks' ) );
									}
								}
							}
						break;
						case 'fluentCRM':
							$fluentcrm_default = array(
								'map'         => array(),
								'lists'       => array(),
								'tags'        => array(),
								'doubleOptin' => false,
							);
							$fluentcrm_args = ( isset( $form_args['fluentcrm'] ) && is_array( $form_args['fluentcrm'] ) && isset( $form_args['fluentcrm'][0] ) && is_array( $form_args['fluentcrm'][0] ) ? $form_args['fluentcrm'][0] : $fluentcrm_default );
							$map = ( isset( $fluentcrm_args['map'] ) && is_array( $fluentcrm_args['map'] ) ? $fluentcrm_args['map'] : array() );
							$double_optin = ( isset( $fluentcrm_args['doubleOptin'] ) ? $fluentcrm_args['doubleOptin'] : false );
							$fluent_data = array();
							$lists = ( isset( $fluentcrm_args['lists'] ) ? $fluentcrm_args['lists'] : array() );
							$tags = ( isset( $fluentcrm_args['tags'] ) ? $fluentcrm_args['tags'] : array() );
							if ( $double_optin ) {
								$fluent_data['status'] = 'pending';
							} else {
								$fluent_data['status'] = 'subscribed';
							}
							if ( ! empty( $lists ) ) {
								$fluent_data['lists'] = array();
								foreach ( $lists as $key => $data ) {
									$fluent_data['lists'][] = $data['value'];
								}
							}
							if ( ! empty( $tags ) ) {
								$fluent_data['tags'] = array();
								foreach ( $tags as $key => $data ) {
									$fluent_data['tags'][] = $data['value'];
								}
							}
							$email = false;
							if ( ! empty( $map ) ) {
								foreach ( $fields as $key => $data ) {
									if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
										if ( 'email' === $map[ $key ] && ! $email ) {
											$email = $data['value'];
											$fluent_data['email'] = $data['value'];
										} else {
											$fluent_data[ $map[ $key ] ] = $data['value'];
										}
									}
								}
							} else {
								foreach ( $fields as $key => $data ) {
									if ( 'email' === $data['type'] ) {
										$fluent_data['email'] = $data['value'];
										break;
									}
								}
							}
							if ( isset( $fluent_data['email'] ) && ! empty( $fluent_data['email'] ) && function_exists( 'FluentCrmApi' ) ) {
								$contact_api = FluentCrmApi( 'contacts' );
								$contact = $contact_api->createOrUpdate( $fluent_data );
								if ( $double_optin && 'pending' === $contact->status ) {
									$contact->sendDoubleOptinEmail();
								}
							}
						break;
					}
				}

				do_action( 'kadence_blocks_form_submission', $form_args, $fields, $form_id, $post_id );

				$success = apply_filters( 'kadence_blocks_form_submission_success', true, $form_args, $fields, $form_id, $post_id );
				$messages = apply_filters( 'kadence_blocks_form_submission_messages', $messages );
				if ( ! $success ) {
					$this->process_bail( $messages[0]['error'], __( 'Third Party Failed', 'kadence-blocks' ) );
				} else {
					$final_data['html'] = '<div class="kadence-blocks-form-message kadence-blocks-form-success">' . $messages[0]['success'] . '</div>';
					$this->send_json( $final_data );
				}
			} else {
				$this->process_bail( __( 'Submission rejected, invalid security token. Reload the page and try again.', 'kadence-blocks' ), __( 'Token invalid', 'kadence-blocks' ) );
			}
		} else {
			$this->process_bail( __( 'Submission failed', 'kadence-blocks' ), __( 'No Data', 'kadence-blocks' ) );
		}
	}
	/**
	 * Sanitize the field
	 *
	 * @param string $field_type the field type.
	 * @param mixed  $value the field value.
	 */
	private function sanitize_field( $field_type, $value, $multi_select = false ) {
		switch ( $field_type ) {
			case 'text':
			case 'tel':
			case 'password':
			case 'hidden':
			case 'search':
			case 'select':
				$value = ( $multi_select && is_array( $value ) ? sanitize_text_field( implode( ', ', $value ) ) : sanitize_text_field( $value ) );
				break;
			case 'checkbox':
				$value = ( is_array( $value ) ? sanitize_text_field( implode( ', ', $value ) ) : sanitize_text_field( $value ) );
				break;
			case 'radio':
				$value = ( is_array( $value ) ? sanitize_text_field( implode( ', ', $value ) ) : sanitize_text_field( $value ) );
				break;
			case 'url':
				$value = esc_url_raw( trim( $value ) );
				break;
			case 'textarea':
				$value = sanitize_textarea_field( $value );
				break;
			case 'email':
				$value = sanitize_email( trim( $value ) );
				break;
			case 'accept':
				$value = esc_html__( 'Accept', 'kadence-blocks' );
				break;
			default:
				/**
				 * Sanitize field value.
				 * Filters the value of the form field for sanitization purpose.
				 * The dynamic portion of the hook name, `$field_type`, refers to the field type.
				 *
				 * @param string $value The field value.
				 */
				$value = apply_filters( "kadence_blocks_form_sanitize_{$field_type}", $value );
		}

		return $value;
	}
	/**
	 * Bail out something isn't correct.
	 *
	 * @param string $error Error to display.
	 * @param string $note Note to show in console.
	 * @param string $action action to take if any.
	 */
	public function process_bail( $error, $note, $required = null ) {
		$notices = array();
		$notices['error']['note'] = $error;
		$out = array(
			'html'    => $this->html_from_notices( $notices ),
			'console' => $note,
			'required'  => $required,
		);
		$this->send_json( $out, true );
	}
	/**
	 * Check Recaptcha
	 *
	 * @param string $token Recaptcha token.
	 *
	 * @return bool
	 */
	private function verify_recaptcha( $token ) {
		$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
		$secret = get_option( 'kadence_blocks_recaptcha_secret_key' );
		if ( ! $secret ) {
			return false;
		}
		$args = array(
			'body' => array(
				'secret'   => $secret,
				'response' => $token,
			),
		);
		$verify_request = wp_remote_post( $recaptcha_url, $args );
		if ( is_wp_error( $verify_request ) ) {
			return false;
		}
		$response = wp_remote_retrieve_body( $verify_request );
		if ( is_wp_error( $response ) ) {
			return false;
		}
		$response = json_decode( $response, true );

		if ( ! isset( $response['success'] ) ) {
			return false;
		}
		return $response['success'];

	}

	/**
	 * Check Recaptcha V2
	 *
	 * @param string $token Recaptcha token.
	 *
	 * @return bool
	 */
	private function verify_recaptcha_v2( $token ) {

		$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
		$secret        = get_option( 'kadence_blocks_recaptcha_secret_key' );
		if ( ! $secret ) {
			return false;
		}
		$args = array(
			'body' => array(
				'secret'   => $secret,
				'response' => $token,
				'remoteip' => $_SERVER['REMOTE_ADDR'],
			),
		);
		$verify_request = wp_remote_post( $recaptcha_url, $args );
		if ( is_wp_error( $verify_request ) ) {
			return false;
		}
		$response = wp_remote_retrieve_body( $verify_request );
		if ( is_wp_error( $response ) ) {
			return false;
		}
		$response = json_decode( $response, true );

		if ( ! isset( $response['success'] ) ) {
			return false;
		}
		if ( isset( $response['success'] ) && true === $response['success'] ) {
			return $response['success'];
		}
		if ( isset( $response['error-codes'] ) && is_array( $response['error-codes'] ) ) {
			if ( isset( $response['error-codes'][0] ) && $response['error-codes'][0] === 'timeout-or-duplicate' ) {
				return true;
			}
		}
		return false;
	}
	/**
	 * Create HTML string from notices
	 *
	 * @param array $notices Notices to display.
	 *
	 * @return string
	 */
	public function html_from_notices( $notices = array() ) {
		$html = '';
		foreach ( $notices as $note_type => $notice ) {
			if ( ! empty( $notice['note'] ) ) {
				$html .= '<div class="kadence-blocks-form-message kadence-blocks-form-warning">' . $notice['note'] . '</div>';
			}
		}

		return $html;
	}
	/**
	 * Starts a flushable buffer
	 */
	public function start_buffer() {
		if ( ! did_action( 'kadence_blocks_forms_buffer_started' ) ) {

			ob_start();

			/**
			 * Runs when buffer is started
			 *
			 * Used to prevent starting buffer twice
			 */
			do_action( 'kadence_blocks_forms_buffer_started' );
		}
	}

	/**
	 * Wrapper for wp_send_json() with output buffering
	 *
	 * @since 1.8.0
	 *
	 * @param array $data Data to return
	 * @param bool $is_error Optional. Is this an error. Default false.
	 */
	public function send_json( $data = array(), $is_error = false ) {
		$buffer = ob_get_clean();
		/**
		 * Runs before Kadence Blocks Forms returns json via wp_send_json() exposes output buffer
		 *
		 * @param string|null $buffer Buffer contents
		 * @param bool $is_error If we think this is an error response or not.
		 */
		do_action( 'kadence_blocks_forms_buffer_flushed', $buffer, $is_error );
		$data['headers_sent'] = headers_sent();
		if ( ! $is_error ) {
			//status_header( 200 );
			$data['success'] = true;
			$data['show_message'] = true;
			wp_send_json( $data );
		} else {
			wp_send_json_error( $data );
		}
	}
	/**
	 * Get form args
	 *
	 * @param string $content the post content.
	 */
	public function parse_blocks( $content ) {
		$parser_class = apply_filters( 'block_parser_class', 'WP_Block_Parser' );
		if ( class_exists( $parser_class ) ) {
			$parser = new $parser_class();
			return $parser->parse( $content );
		} elseif ( function_exists( 'gutenberg_parse_blocks' ) ) {
			return gutenberg_parse_blocks( $content );
		} else {
			return false;
		}
	}

	/**
	 * Get form args
	 *
	 * @param integer $post_id the form post id.
	 * @param string  $form_id the form id.
	 */
	private function get_form_args( $post_id, $form_id ) {
		$form_args = false;
		$blocks = '';
		if ( strpos( $post_id, 'block-unknown' ) !== false ) {
			$widget_data = get_option( 'widget_block' );
			if ( is_array( $widget_data ) ) {
				foreach ( $widget_data as $key => $data_array ) {
					if ( ! empty( $data_array['content'] ) && strpos( $data_array['content'], '<!-- wp:kadence/form {"uniqueID":"' . $form_id . '"' ) !== false ) {
						$blocks = $this->parse_blocks( $data_array['content'] );
						break;
					}
				}
			}
		} else if ( strpos( $post_id, 'block' ) !== false ) {
			$widget_data = get_option( 'widget_block' );
			$post_id_int = preg_replace( '/[^0-9]/', '', $post_id );
			if ( ! empty( $widget_data[ absint( $post_id_int ) ] ) ) {
				$form_content = $widget_data[ absint( $post_id_int ) ];
				$blocks = $this->parse_blocks( $form_content['content'] );
			}
		} else {
			$post_data = get_post( absint( $post_id ) );
			if ( is_object( $post_data ) ) {
				$blocks = $this->parse_blocks( $post_data->post_content );
			}
		}
		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			$this->process_bail( __( 'Submission Failed', 'kadence-blocks' ), __( 'Data not found', 'kadence-blocks' ) );
		}
		foreach ( $blocks as $indexkey => $block ) {
			if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {
				if ( 'kadence/form' === $block['blockName'] ) {
					if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) && isset( $block['attrs']['uniqueID'] ) && $form_id === $block['attrs']['uniqueID'] ) {
						$form_args = $block['attrs'];
						break;
					}
				}
				if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
					$form_args = $this->parse_inner_blocks( $block['innerBlocks'], $form_id );
					if ( $form_args ) {
						break;
					}
				}
				if ( 'core/block' === $block['blockName'] ) {
					if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
						$blockattr = $block['attrs'];
						if ( isset( $blockattr['ref'] ) ) {
							$reusable_block = get_post( $blockattr['ref'] );
							if ( $reusable_block && 'wp_block' == $reusable_block->post_type ) {
								$reuse_data_block = $this->parse_blocks( $reusable_block->post_content );
								$form_args        = $this->parse_inner_blocks( $reuse_data_block, $form_id );
								if ( $form_args ) {
									break;
								}
							}
						}
					}
				}
			}
		}
		return $form_args;
	}
	/**
	 * Get form args
	 *
	 * @param array  $blocks the post inner blocks.
	 * @param string $form_id the form Id.
	 */
	private function parse_inner_blocks( $blocks, $form_id ) {
		$form_args = false;
		foreach ( $blocks as $indexkey => $block ) {
			if ( 'kadence/form' === $block['blockName'] ) {
				if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) && isset( $block['attrs']['uniqueID'] ) && $form_id === $block['attrs']['uniqueID'] ) {
					$form_args = $block['attrs'];
					break;
				}
			}
			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$form_args = $this->parse_inner_blocks( $block['innerBlocks'], $form_id );
				if ( $form_args ) {
					break;
				}
			}
			if ( 'core/block' === $block['blockName'] ) {
				if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
					$blockattr = $block['attrs'];
					if ( isset( $blockattr['ref'] ) ) {
						$reusable_block = get_post( $blockattr['ref'] );
						if ( $reusable_block && 'wp_block' == $reusable_block->post_type ) {
							$reuse_data_block = $this->parse_blocks( $reusable_block->post_content );
							$form_args        = $this->parse_inner_blocks( $reuse_data_block, $form_id );
							if ( $form_args ) {
								break;
							}
						}
					}
				}
			}
		}
		return $form_args;
	}
}
KB_Ajax_Form::get_instance();
