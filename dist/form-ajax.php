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
				//error_log( print_r( $_POST, true ) );
				// Lets get form data.
				$form_id = sanitize_text_field( wp_unslash( $_POST['_kb_form_id'] ) );
				$post_id = absint( wp_unslash( $_POST['_kb_form_post_id'] ) );
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
				if ( isset( $form_args['honeyPot'] ) && true === $form_args['honeyPot'] ) {
					$honeypot_check = filter_input( INPUT_POST, '_kb_verify_email', FILTER_SANITIZE_STRING );
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
								if ( preg_match( '/{field_(.*?)}/', $subject, $match) == 1 ) {
									$field_id = $match[1];
									if ( isset( $field_id ) ) {
										$real_id = absint( $field_id ) - 1;
										if ( isset( $fields[ $real_id ] ) && is_array( $fields[ $real_id ] ) && isset( $fields[ $real_id ]['value'] ) ) {
											$subject = str_replace( '{field_' . $field_id . '}' , $fields[ $real_id ]['value'], $subject );
										}
									}
								}
							}
							if ( strpos( $subject, '{page_title}' ) !== false ) {
								global $post;
								$subject = str_replace( '{page_title}', get_the_title( $post->$ID ), $subject );
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
								$headers .= 'From: ' . ( isset( $form_args['email'][0]['fromName'] ) && ! empty( trim( $form_args['email'][0]['fromName'] ) ) ? trim( $form_args['email'][0]['fromName'] ) . ' ' : '' ) . '<' . sanitize_email( trim( $form_args['email'][0]['fromEmail'] ) ) . '>' . "\r\n";
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
		$post_data = get_post( $post_id );
		$content   = $post_data->post_content;

		$blocks = $this->parse_blocks( $post_data->post_content );
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
