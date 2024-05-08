<?php
/**
 * Class to Build the Advanced Form Submit Actions.
 *
 * @package Kadence Blocks
 */
class Kadence_Blocks_Advanced_Form_Submit_Actions {

	public $form_args;

	public $responses;

	public $post_id;

	public function __construct( $form_args, $responses, $post_id ) {
		$this->form_args = $form_args;
		$this->responses = $responses;
		$this->post_id   = $post_id;
	}
	/**
	 * Get the mapped attributes from responses.
	 *
	 * @param array $map the map array.
	 * @param bool  $no_email if no email.
	 * @param bool  $auto_map if auto map.
	 */
	public function get_mapped_attributes_from_responses( $map, $no_email = true, $auto_map = false ) {
		$mapped_attributes = array();

		if ( ! empty( $map ) ) {
			foreach ( $this->responses as $key => $data ) {
				$unique_id = $data['uniqueID'];
				if ( isset( $map[ $unique_id ] ) && ( ! empty( $map[ $unique_id ] ) || $auto_map ) ) {
					if ( $no_email && 'email' === $map[ $unique_id ] ) {
						continue;
					} else if ( 'none' === $map[ $unique_id ] ) {
						continue;
					} else if ( 'OPT_IN' === $map[ $unique_id ] ) {
						if ( $data['value'] ) {
							$mapped_attributes[ $map[ $unique_id ] ] = true;
						} else {
							$mapped_attributes[ $map[ $unique_id ] ] = false;
						}
					} else if ( $auto_map ) {
						$mapped_attributes[ $data['label'] ] = $data['value'];
					} else {
						$mapped_attributes[ $map[ $unique_id ] ] = $data['value'];
					}
				}
			}
		}

		return $mapped_attributes;
	}
	/**
	 * Get email from responses.
	 *
	 * @param array $map the map array.
	 */
	public function get_email_from_responses( $map ) {
		$email = '';
		$mapped_email = '';

		foreach ( $this->responses as $key => $data ) {
			$unique_id = $data['uniqueID'];
			if ( $map && isset( $map[ $unique_id ] ) && 'email' === $map[ $unique_id ] && ! $email ) {
				$mapped_email = $data['value'];
			} else if ( 'email' === $data['type'] ) {
				$email = $data['value'];
			}
		}

		return $mapped_email ? $mapped_email : $email;
	}
	/**
	 * Get the mapped attributes from responses.
	 *
	 * @param array $map the map array.
	 * @param bool  $no_email if no email.
	 * @param bool  $auto_map if auto map.
	 */
	public function get_response_field_by_name( $name ) {
		foreach ( $this->responses as $response ) {
			if ( isset( $response['name'] ) && $response['name'] == $name ) {
				return $response;
			}
		}
		return '';
	}
	/**
	 * Handle Field Replacements.
	 *
	 * @param string $text the text to replace.
	 */
	public function do_field_replacements( $text ) {
		if ( strpos( $text, '{' ) !== false && strpos( $text, '}' ) !== false ) {
			preg_match_all( '/{(.*?)}/', $text, $match );
			if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
				foreach ( $match[1] as $field_name ) {
					if ( isset( $field_name ) ) {
						$field_to_insert = $this->get_response_field_by_name( $field_name );
						if ( $field_to_insert && isset( $field_to_insert['value'] ) ) {
							$text = str_replace( '{' . $field_name . '}', wp_unslash( $field_to_insert['value'] ), $text );
						}
					}
				}
			}
		}
		if ( strpos( $text, '{page_title}' ) !== false ) {
			global $post;
			$refer_id = is_object( $post ) ? $post->ID : url_to_postid( wp_get_referer() );
			$text  = str_replace( '{page_title}', get_the_title( $refer_id ), $text );
		}

		return $text;
	}
	/**
	 * Handle the email action.
	 */
	public function email() {
		$to      = isset( $this->form_args['attributes']['email']['emailTo'] ) && ! empty( trim( $this->form_args['attributes']['email']['emailTo'] ) ) ? trim( $this->form_args['attributes']['email']['emailTo'] ) : get_option( 'admin_email' );
		$subject = isset( $this->form_args['attributes']['email']['subject'] ) && ! empty( trim( $this->form_args['attributes']['email']['subject'] ) ) ? $this->form_args['attributes']['email']['subject'] : '[' . get_bloginfo( 'name' ) . ' ' . __( 'Submission', 'kadence-blocks' ) . ']';
		$from_email = isset( $this->form_args['attributes']['email']['fromEmail'] ) && ! empty( trim( $this->form_args['attributes']['email']['fromEmail'] ) ) ? sanitize_email( $this->do_field_replacements( trim( $this->form_args['attributes']['email']['fromEmail'] ) ) ) : '';
		$from_name = ( isset( $this->form_args['attributes']['email']['fromName'] ) && ! empty( trim( $this->form_args['attributes']['email']['fromName'] ) ) ? trim( $this->form_args['attributes']['email']['fromName'] ) . ' ' : '' );
		$email_cc = isset( $this->form_args['attributes']['email']['cc'] ) && ! empty( trim( $this->form_args['attributes']['email']['cc'] ) ) ? sanitize_email( $this->do_field_replacements( trim( $this->form_args['attributes']['email']['cc'] ) ) ) : '';
		$email_bcc = isset( $this->form_args['attributes']['email']['bcc'] ) && ! empty( trim( $this->form_args['attributes']['email']['bcc'] ) ) ? $this->form_args['attributes']['email']['bcc'] : '';

		$to = $this->do_field_replacements( $to );
		$subject = $this->do_field_replacements( $subject );
		$from_name = $this->do_field_replacements( $from_name );
		$email_bcc = $this->do_field_replacements( $email_bcc );

		$email_content = '';
		$reply_email   = false;
		foreach ( $this->responses as $key => $data ) {
			if ( 'email' === $data['type'] ) {
				$reply_email = $data['value'];
			}
		}

		if ( isset( $this->form_args['attributes']['email']['replyTo'] ) && 'from_email' === $this->form_args['attributes']['email']['replyTo'] ) {
			$reply_email = $from_email ? $from_email : false;
		}

		if ( ! isset( $this->form_args['attributes']['email']['html'] ) || ( isset( $this->form_args['attributes']['email']['html'] ) && $this->form_args['attributes']['email']['html'] ) ) {
			$args          = array( 'fields' => $this->responses );
			$email_content = kadence_blocks_get_template_html( 'form-email.php', $args );
			$headers = 'Content-Type: text/html; charset=UTF-8' . "\r\n";
		} else {
			foreach ( $this->responses as $key => $data ) {
				if ( is_array( $data['value'] ) ) {
					$data['value'] = explode( ', ', $data['value'] );
				}
				$email_content .= strip_tags( $data['label'] ) . ': ' . wp_unslash( $data['value'] ) . "\n\n";
			}
			$headers = 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
		}

		$body = $email_content;

		if ( $reply_email ) {
			$headers .= 'Reply-To: <' . $reply_email . '>' . "\r\n";
		}

		if ( $from_email ) {
			$headers .= 'From: ' . $from_name . '<' . $from_email . '>' . "\r\n";
		}

		$cc_headers = '';
		if ( $email_cc ) {
			$cc_headers = 'Cc: ' . $email_cc . "\r\n";
		}
		$mail = wp_mail( $to, $subject, $body, $headers . $cc_headers );
		if ( $email_bcc ) {
			$bcc_emails = explode( ',', $email_bcc );
			foreach ( $bcc_emails as $bcc_email ) {
				wp_mail( sanitize_email( trim( $bcc_email ) ), $subject, $body, $headers );
			}
		}
	}
	/**
	 * Mailerlite rest call.
	 *
	 * @param string $api_url api url.
	 * @param string $method method.
	 * @param array  $body body.
	 */
	public function mailerlite_rest_call( $api_url, $method, $body ) {
		$api_key = get_option( 'kadence_blocks_mailerlite_api' );

		if ( empty( $api_key ) ) {
			return;
		}

		$response = wp_remote_post(
			$api_url,
			array(
				'method'  => $method,
				'timeout' => 10,
				'headers' => array(
					'accept'              => 'application/json',
					'content-type'        => 'application/json',
					'X-MailerLite-ApiKey' => $api_key,
				),
				'body'    => json_encode( $body ),
			)
		);

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			error_log( "Something went wrong: $error_message" );
			return false;
		} else {
			if ( ! isset( $response['response'] ) || ! isset( $response['response']['code'] ) ) {
				error_log( __( 'No Response from MailerLite', 'kadence-blocks' ) );
				return false;
			}
			if ( 400 === $response['response']['code'] ) {
				error_log( print_r( $response['response'], true ) );
				$this->process_bail( $response['response']['message'] . ' ' . __( 'MailerLite Misconfiguration', 'kadence-blocks' ), __( 'MailerLite Failed', 'kadence-blocks' ) );
				return false;
			}
		}
		return $response;
	}
	/**
	 * Mailerlite.
	 */
	public function mailerlite() {

		$mailerlite_default = array(
			'map'   => array(),
			'group' => '',
		);

		$mailerlite_args = ( isset( $this->form_args['attributes']['mailerlite'] ) && is_array( $this->form_args['attributes']['mailerlite'] ) && isset( $this->form_args['attributes']['mailerlite'] ) ? $this->form_args['attributes']['mailerlite'] : $mailerlite_default );
		$group           = ( isset( $mailerlite_args['group'] ) ? $mailerlite_args['group'] : '' );
		$map             = ( isset( $mailerlite_args['map'] ) && is_array( $mailerlite_args['map'] ) ? $mailerlite_args['map'] : array() );
		$body            = array( 'fields' => array() );
		$email           = false;

		$mapped_attributes = $this->get_mapped_attributes_from_responses( $map );
		$email = $this->get_email_from_responses( $map );

		$body['fields'] = $mapped_attributes;
		$body['email'] = $email;

		if ( empty( $body['fields'] ) ) {
			unset( $body['fields'] );
		}

		$group_id = '';
		if ( ! empty( $group ) && is_array( $group ) ) {
			$group_id = ( isset( $group['value'] ) && ! empty( $group['value'] ) ? $group['value'] : '' );
		}
		if ( ! $group_id ) {
			return;
		}

		$body['resubscribe'] = true;

		if ( isset( $body['email'] ) ) {
			if ( ! empty( $group_id ) ) {
				$api_url = 'https://api.mailerlite.com/api/v2/groups/' . $group_id . '/subscribers';
			} else {
				$api_url = 'https://api.mailerlite.com/api/v2/subscribers';
			}

			$response = $this->mailerlite_rest_call( $api_url, 'POST', $body );
			$temp = 1;
		}
	}

	public function fluentCRM() {
		$fluentcrm_default = array(
			'map'         => array(),
			'lists'       => array(),
			'tags'        => array(),
			'doubleOptin' => false,
		);

		$fluentcrm_args = ( isset( $this->form_args['attributes']['fluentcrm'] ) && is_array( $this->form_args['attributes']['fluentcrm'] ) && isset( $this->form_args['attributes']['fluentcrm'] ) ? $this->form_args['attributes']['fluentcrm'] : $fluentcrm_default );
		$map            = ( isset( $fluentcrm_args['map'] ) && is_array( $fluentcrm_args['map'] ) ? $fluentcrm_args['map'] : array() );
		$double_optin   = ( isset( $fluentcrm_args['doubleOptin'] ) ? $fluentcrm_args['doubleOptin'] : false );
		$fluent_data    = array();
		$lists          = ( isset( $fluentcrm_args['lists'] ) ? $fluentcrm_args['lists'] : array() );
		$tags           = ( isset( $fluentcrm_args['tags'] ) ? $fluentcrm_args['tags'] : array() );

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

		$mapped_attributes = $this->get_mapped_attributes_from_responses( $map );
		$email = $this->get_email_from_responses( $map );

		$fluent_data = array_merge( $fluent_data, $mapped_attributes );
		$fluent_data['email'] = $email;

		if ( isset( $fluent_data['email'] ) && ! empty( $fluent_data['email'] ) && function_exists( 'FluentCrmApi' ) ) {
			$contact_api = FluentCrmApi( 'contacts' );
			$contact     = $contact_api->createOrUpdate( $fluent_data );
			if ( $double_optin && 'pending' === $contact->status ) {
				$contact->sendDoubleOptinEmail();
			}
		}
	}
}
