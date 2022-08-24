<?php

class AdvancedFormSubmitActions {

	public function __construct( $form_args, $responses, $post_id ) {
		$this->form_args = $form_args;
		$this->responses = $responses;
		$this->post_id   = $post_id;
	}

	public function email() {

		$to      = isset( $this->form_args['attributes']['email']['emailTo'] ) && ! empty( trim( $this->form_args['attributes']['email']['emailTo'] ) ) ? trim( $this->form_args['attributes']['email']['emailTo'] ) : get_option( 'admin_email' );
		$subject = isset( $this->form_args['attributes']['email']['subject'] ) && ! empty( trim( $this->form_args['attributes']['email']['subject'] ) ) ? $this->form_args['attributes']['email']['subject'] : '[' . get_bloginfo( 'name' ) . ' ' . __( 'Submission', 'kadence-blocks' ) . ']';

		if ( strpos( $subject, '{field_' ) !== false ) {
			preg_match_all( '/{field_(.*?)}/', $subject, $match );
			if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
				foreach ( $match[1] as $field_id ) {
					if ( isset( $field_id ) ) {
						$real_id = absint( $field_id ) - 1;
						if ( isset( $this->responses[ $real_id ] ) && is_array( $this->responses[ $real_id ] ) && isset( $this->responses[ $real_id ]['value'] ) ) {
							$subject = str_replace( '{field_' . $field_id . '}', $this->responses[ $real_id ]['value'], $subject );
						}
					}
				}
			}
		}

		if ( strpos( $subject, '{page_title}' ) !== false ) {
			global $post;
			$refer_id = is_object( $post ) ? $post->ID : url_to_postid( wp_get_referer() );
			$subject  = str_replace( '{page_title}', get_the_title( $refer_id ), $subject );
		}

		$email_content = '';
		$reply_email   = false;

		foreach ( $this->responses as $key => $data ) {
			if ( 'email' === $data['type'] ) {
				$reply_email = $data['value'];
			}
		}

		if ( isset( $this->form_args['attributes']['email']['replyTo'] ) && 'from_email' === $this->form_args['attributes']['email']['replyTo'] ) {
			$reply_email = isset( $this->form_args['attributes']['email']['fromEmail'] ) && ! empty( trim( $this->form_args['attributes']['email']['fromEmail'] ) ) ? sanitize_email( trim( $this->form_args['attributes']['email']['fromEmail'] ) ) : false;
		}

		if ( $this->form_args['attributes']['email']['html'] ) {
			$args          = array( 'fields' => $this->responses );
			$email_content = kadence_blocks_get_template_html( 'form-email.php', $args );
		} else {
			foreach ( $this->responses as $key => $data ) {
				if ( is_array( $data['value'] ) ) {
					$data['value'] = explode( ', ', $data['value'] );
				}
				$email_content .= $data['label'] . ': ' . $data['value'] . "\n\n";
			}
		}

		$body = $email_content;

		if ( $this->form_args['attributes']['email']['html'] ) {
			$headers = 'Content-Type: text/html; charset=UTF-8' . "\r\n";
		} else {
			$headers = 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
		}

		if ( $reply_email ) {
			$headers .= 'Reply-To: <' . $reply_email . '>' . "\r\n";
		}

		if ( isset( $this->form_args['attributes']['email']['fromEmail'] ) && ! empty( trim( $this->form_args['attributes']['email']['fromEmail'] ) ) ) {
			$from_name = ( isset( $this->form_args['attributes']['email']['fromName'] ) && ! empty( trim( $this->form_args['attributes']['email']['fromName'] ) ) ? trim( $this->form_args['attributes']['email']['fromName'] ) . ' ' : '' );
			if ( strpos( $from_name, '{field_' ) !== false ) {
				preg_match_all( '/{field_(.*?)}/', $from_name, $match );
				if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
					foreach ( $match[1] as $field_id ) {
						if ( isset( $field_id ) ) {
							$real_id = absint( $field_id ) - 1;
							if ( isset( $this->responses[ $real_id ] ) && is_array( $this->responses[ $real_id ] ) && isset( $this->responses[ $real_id ]['value'] ) ) {
								$from_name = str_replace( '{field_' . $field_id . '}', $this->responses[ $real_id ]['value'], $from_name );
							}
						}
					}
				}
			}

			$headers .= 'From: ' . $from_name . '<' . sanitize_email( trim( $this->form_args['attributes']['email']['fromEmail'] ) ) . '>' . "\r\n";
		}

		$cc_headers = '';

		if ( isset( $this->form_args['attributes']['email']['cc'] ) && ! empty( trim( $this->form_args['attributes']['email']['cc'] ) ) ) {
			$cc_headers = 'Cc: ' . sanitize_email( trim( $this->form_args['attributes']['email']['cc'] ) ) . "\r\n";
		}

		wp_mail( $to, $subject, $body, $headers . $cc_headers );

		if ( isset( $this->form_args['attributes']['email']['bcc'] ) && ! empty( trim( $this->form_args['attributes']['email']['bcc'] ) ) ) {
			$bcc_emails = explode( ',', $this->form_args['attributes']['email']['bcc'] );
			foreach ( $bcc_emails as $bcc_email ) {
				wp_mail( sanitize_email( trim( $bcc_email ) ), $subject, $body, $headers );
			}
		}
	}

	public function mailerlite() {
		$api_key = get_option( 'kadence_blocks_mailerlite_api' );

		if ( empty( $api_key ) ) {
			return;
		}

		$mailerlite_default = array(
			'map'   => array(),
			'group' => '',
		);

		$mailerlite_args = ( isset( $this->form_args['attributes']['mailerlite'] ) && is_array( $this->form_args['attributes']['mailerlite'] ) && isset( $this->form_args['attributes']['mailerlite'] ) && is_array( $this->form_args['attributes']['mailerlite'] ) ? $this->form_args['attributes']['mailerlite'] : $mailerlite_default );
		$groups          = ( isset( $mailerlite_args['group'] ) ? $mailerlite_args['group'] : array() );
		$map             = ( isset( $mailerlite_args['map'] ) && is_array( $mailerlite_args['map'] ) ? $mailerlite_args['map'] : array() );
		$body            = array( 'fields' => array() );
		$email           = false;

		if ( ! empty( $map ) ) {
			foreach ( $this->responses as $key => $data ) {
				if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
					if ( 'email' === $map[ $key ] && ! $email ) {
						$email         = $data['value'];
						$body['email'] = $data['value'];
					} else {
						$body['fields'][ $map[ $key ] ] = $data['value'];
					}
				}
			}
		} else {
			foreach ( $this->responses as $key => $data ) {
				if ( 'email' === $data['type'] ) {
					$email         = $data['value'];
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

		if ( isset( $body['email'] ) ) {
			if ( ! empty( $group_id ) ) {
				$api_url = 'https://api.mailerlite.com/api/v2/groups/' . $group_id . '/subscribers';
			} else {
				$api_url = 'https://api.mailerlite.com/api/v2/subscribers';
			}
			$response = wp_remote_post(
				$api_url,
				array(
					'method'  => 'POST',
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
	}

	public function fluentCRM() {
		$fluentcrm_default = array(
			'map'         => array(),
			'lists'       => array(),
			'tags'        => array(),
			'doubleOptin' => false,
		);

		$fluentcrm_args = ( isset( $this->form_args['attributes']['fluentcrm'] ) && is_array( $this->form_args['attributes']['fluentcrm'] ) && isset( $this->form_args['attributes']['fluentcrm'] ) && is_array( $this->form_args['attributes']['fluentcrm'] ) ? $this->form_args['attributes']['fluentcrm'] : $fluentcrm_default );
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

		if ( ! empty( $map ) ) {
			foreach ( $this->responses as $key => $data ) {
				if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
					if ( 'email' === $map[ $key ] && ! $email ) {
						$email                = $data['value'];
						$fluent_data['email'] = $data['value'];
					} else {
						$fluent_data[ $map[ $key ] ] = $data['value'];
					}
				}
			}
		} else {
			foreach ( $this->responses as $key => $data ) {
				if ( 'email' === $data['type'] ) {
					$fluent_data['email'] = $data['value'];
					break;
				}
			}
		}

		if ( isset( $fluent_data['email'] ) && ! empty( $fluent_data['email'] ) && function_exists( 'FluentCrmApi' ) ) {
			$contact_api = FluentCrmApi( 'contacts' );
			$contact     = $contact_api->createOrUpdate( $fluent_data );
			if ( $double_optin && 'pending' === $contact->status ) {
				$contact->sendDoubleOptinEmail();
			}
		}
	}

	public function sendInBlue() {
		$api_key = get_option( 'kadence_blocks_send_in_blue_api' );
		if ( empty( $api_key ) ) {
			return;
		}
		$sendinblue_default = array(
			'list'           => array(),
			'map'            => array(),
			'doubleOptin'    => false,
			'templateId'     => '',
			'redirectionUrl' => '',
		);
		//error_log( print_r( $this->form_args, true ) );
		$sendinblue_args = ( isset( $this->form_args['sendinblue'] ) && is_array( $this->form_args['sendinblue'] ) && isset( $this->form_args['sendinblue'][0] ) && is_array( $this->form_args['sendinblue'][0] ) ? $this->form_args['sendinblue'][0] : $sendinblue_default );
		$list            = ( isset( $sendinblue_args['list'] ) ? $sendinblue_args['list'] : '' );
		$map             = ( isset( $sendinblue_args['map'] ) && is_array( $sendinblue_args['map'] ) ? $sendinblue_args['map'] : array() );
		$templateId      = ( isset( $sendinblue_args['templateId'] ) && ! empty( $sendinblue_args['templateId'] ) ? $sendinblue_args['templateId'] : false );
		if ( $templateId ) {
			$redirectionUrl = ( isset( $sendinblue_args['redirectionUrl'] ) && ! empty( $sendinblue_args['redirectionUrl'] ) ? $sendinblue_args['redirectionUrl'] : false );
			if ( $redirectionUrl ) {
				$doubleOptin = ( isset( $sendinblue_args['doubleOptin'] ) ? $sendinblue_args['doubleOptin'] : false );
			} else {
				$doubleOptin = false;
			}
		} else {
			$doubleOptin = false;
		}
		$body = array(
			'attributes' => array(),
		);
		if ( $doubleOptin ) {
			$body['templateId']     = $templateId;
			$body['redirectionUrl'] = $redirectionUrl;
		} else {
			$body['updateEnabled'] = true;
		}
		$email = false;
		if ( ! empty( $map ) ) {
			foreach ( $this->responses as $key => $data ) {
				if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
					if ( 'email' === $map[ $key ] && ! $email ) {
						$email         = $data['value'];
						$body['email'] = $data['value'];
					} elseif ( 'OPT_IN' === $map[ $key ] ) {
						if ( $data['value'] ) {
							$body['attributes'][ $map[ $key ] ] = true;
						} else {
							$body['attributes'][ $map[ $key ] ] = false;
						}
					} else {
						$body['attributes'][ $map[ $key ] ] = $data['value'];
					}
				}
			}
		} else {
			foreach ( $this->responses as $key => $data ) {
				if ( 'email' === $data['type'] ) {
					$email         = $data['value'];
					$body['email'] = $data['value'];
					break;
				}
			}
		}
		if ( empty( $body['attributes'] ) ) {
			unset( $body['attributes'] );
		}
		if ( ! empty( $list ) ) {
			$lists = array(
				'listIds' => array(),
			);
			foreach ( $list as $key => $value ) {
				$lists['listIds'][] = $value['value'];
			}
		} else {
			$lists = array(
				'listIds' => array(),
			);
		}
		if ( $doubleOptin ) {
			$body['includeListIds'] = $lists['listIds'];
		} else {
			$body['listIds'] = $lists['listIds'];
		}
		//error_log( print_r( $body, true ) );
		if ( isset( $body['email'] ) ) {
			$api_url  = ( $doubleOptin ? 'https://api.sendinblue.com/v3/contacts/doubleOptinConfirmation' : 'https://api.sendinblue.com/v3/contacts' );
			$response = wp_remote_post(
				$api_url,
				array(
					'method'  => 'POST',
					'timeout' => 10,
					'headers' => array(
						'accept'       => 'application/json',
						'content-type' => 'application/json',
						'api-key'      => $api_key,
					),
					'body'    => json_encode( $body ),
				)
			);

			if ( is_wp_error( $response ) ) {
				$error_message = $response->get_error_message();
				error_log( "Something went wrong: $error_message" );
			} else {
				if ( ! isset( $response['response'] ) || ! isset( $response['response']['code'] ) ) {
					error_log( __( 'No Response from SendInBlue', 'kadence-blocks-pro' ) );

					return;
				}
				if ( 400 === $response['response']['code'] ) {
					error_log( $response['response']['message'] );

					return;
				}

			}
		}
	}

	public function mailchimp() {
		$api_key = get_option( 'kadence_blocks_mail_chimp_api' );
		if ( empty( $api_key ) ) {
			return;
		}

		$mailchimp_default = array(
			'list'        => array(),
			'groups'      => array(),
			'tags'        => array(),
			'map'         => array(),
			'doubleOptin' => false,
		);

		$mailchimp_args = ( isset( $this->form_args['attributes']['mailchimp'] ) && is_array( $this->form_args['attributes']['mailchimp'] ) && isset( $this->form_args['attributes']['mailchimp'] ) && is_array( $this->form_args['attributes']['mailchimp'] ) ? $this->form_args['attributes']['mailchimp'] : $mailchimp_default );
		$list           = ( isset( $mailchimp_args['list'] ) ? $mailchimp_args['list'] : '' );
		$groups         = ( isset( $mailchimp_args['groups'] ) && is_array( $mailchimp_args['groups'] ) ? $mailchimp_args['groups'] : array() );
		$tags           = ( isset( $mailchimp_args['tags'] ) && is_array( $mailchimp_args['tags'] ) ? $mailchimp_args['tags'] : array() );
		$map            = ( isset( $mailchimp_args['map'] ) && is_array( $mailchimp_args['map'] ) ? $mailchimp_args['map'] : array() );
		$doubleOptin    = ( isset( $mailchimp_args['doubleOptin'] ) ? $mailchimp_args['doubleOptin'] : false );
		$body           = array(
			'email_address' => '',
			'status_if_new' => 'subscribed',
			'status'        => 'subscribed',
		);
		if ( $doubleOptin ) {
			$body['status_if_new'] = 'pending';
			$body['double_optin']  = true;
		}


		if ( empty( $list ) || ! is_array( $list ) ) {
			return;
		}
		$key_parts = explode( '-', $api_key );
		if ( empty( $key_parts[1] ) || 0 !== strpos( $key_parts[1], 'us' ) ) {
			return;
		}
		$base_url = 'https://' . $key_parts[1] . '.api.mailchimp.com/3.0/';
		$email    = false;
		if ( ! empty( $groups ) ) {
			foreach ( $groups as $id => $label ) {
				if ( ! isset( $body['interests'] ) ) {
					$body['interests'] = array();
				}
				$body['interests'][ $label['value'] ] = true;
			}
		}
		$tags_array = array();
		if ( ! empty( $tags ) ) {
			foreach ( $tags as $id => $tag_item ) {
				if ( ! isset( $body['tags'] ) ) {
					$body['tags'] = array();
				}
				$body['tags'][] = $tag_item['label'];
				$tags_array[]   = array(
					'name'   => $tag_item['label'],
					'status' => 'active',
				);
			}
		}
		if ( ! empty( $map ) ) {
			foreach ( $this->responses as $key => $data ) {
				if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
					if ( 'email' === $map[ $key ] && ! $email ) {
						$email                 = $data['value'];
						$body['email_address'] = $data['value'];
					} else {
						if ( ! isset( $body['merge_fields'] ) ) {
							$body['merge_fields'] = array();
						}
						$body['merge_fields'][ $map[ $key ] ] = $data['value'];
					}
				}
			}
		} else {
			foreach ( $this->responses as $key => $data ) {
				if ( 'email' === $data['type'] ) {
					$email                 = $data['value'];
					$body['email_address'] = $data['value'];
					break;
				}
			}
		}


		$list_id = ( isset( $list['value'] ) && ! empty( $list['value'] ) ? $list['value'] : '' );
		if ( empty( $list_id ) ) {
			return;
		}
		if ( isset( $body['email_address'] ) ) {
			$subscriber_hash = md5( strtolower( $body['email_address'] ) );
			$api_url         = $base_url . 'lists/' . $list_id . '/members/' . $subscriber_hash;
			//error_log( $api_url );
			$response = wp_remote_post(
				$api_url,
				array(
					'method'  => 'PUT',
					'timeout' => 10,
					'headers' => array(
						'accept'        => 'application/json',
						'content-type'  => 'application/json',
						'Authorization' => 'Basic ' . base64_encode( 'user:' . $api_key ),
					),
					'body'    => json_encode( $body ),
				)
			);
			if ( is_wp_error( $response ) ) {
				$error_message = $response->get_error_message();
				//error_log( "Something went wrong: $error_message" );

			} else {

				if ( ! isset( $response['response'] ) || ! isset( $response['response']['code'] ) ) {
					//error_log( __('Failed to Connect to MailChimp', 'kadence-blocks-pro' ) );
					return;
				}
				if ( 400 === $response['response']['code'] || 404 === $response['response']['code'] ) {
					//error_log( $response['response']['message'] );
					return;
				} elseif ( 200 === $response['response']['code'] ) {
					// need to check if tags were added.
					$needs_update = false;
					$body         = json_decode( wp_remote_retrieve_body( $response ), true );
					if ( ! empty( $tags_array ) && empty( $body['tags'] ) ) {
						$needs_update = true;
					} elseif ( ! empty( $tags_array ) && ! empty( $body['tags'] ) && is_array( $body['tags'] ) ) {
						$current_tags = array();
						foreach ( $body['tags'] as $key => $data ) {
							$current_tags[] = $data['name'];
						}
						foreach ( $tags_array as $key => $data ) {
							if ( ! in_array( $data['name'], $current_tags ) ) {
								$needs_update = true;
								break;
							}
						}
					}
					if ( $needs_update ) {
						$tag_url      = $base_url . 'lists/' . $list_id . '/members/' . $subscriber_hash . '/tags';
						$tag_response = wp_remote_post(
							$tag_url,
							array(
								'method'  => 'POST',
								'timeout' => 10,
								'headers' => array(
									'accept'        => 'application/json',
									'content-type'  => 'application/json',
									'Authorization' => 'Basic ' . base64_encode( 'user:' . $api_key ),
								),
								'body'    => json_encode( array( 'tags' => $tags_array ) ),
							)
						);
						if ( is_wp_error( $tag_response ) ) {
							$error_message = $tag_response->get_error_message();
							//error_log( "Something went wrong: $error_message" );
						} else {
							if ( ! isset( $tag_response['response'] ) || ! isset( $tag_response['response']['code'] ) ) {
								//error_log( __('Failed to Connect to MailChimp', 'kadence-blocks-pro' ) );
								return;
							}
							if ( 204 === $tag_response['response']['code'] ) {
								//error_log( 'success' );
								return;
							}
						}
					}
				}
			}
		}
	}

	public function convertkit() {
		$api_key            = get_option( 'kadence_blocks_convertkit_api' );
		$base_url           = 'https://api.convertkit.com/v3/';
		$convertKitSettings = $this->form_args['attributes']['convertkit'];

		if ( empty( $api_key ) || empty( $convertKitSettings['map'] ) ) {
			return;
		}

		$email_key = array_search( 'email', $convertKitSettings['map'] );

		if ( empty( $this->responses[ $email_key ]['value'] ) || ! filter_var( $this->responses[ $email_key ]['value'], FILTER_VALIDATE_EMAIL ) ) {
			return;
		}

		$request_args = array(
			'method'  => 'POST',
			'timeout' => 10,
			'headers' => array(
				'accept'       => 'application/json',
				'content-type' => 'application/json',
			),
			'body'    => json_encode( array(
				'api_secret' => $api_key,
				'email'      => $this->responses[ $email_key ]['value'],
			) ),
		);

		// Add to form
		if ( ! empty( $convertKitSettings['form']['value'] ) && is_numeric( $convertKitSettings['form']['value'] ) ) {
			$response = wp_remote_post( $base_url . 'forms/' . $convertKitSettings['form']['value'] . '/subscribe', $request_args );
		}

		// Add to sequence
		if ( ! empty( $convertKitSettings['sequence']['value'] ) && is_numeric( $convertKitSettings['sequence']['value'] ) ) {
			$response = wp_remote_post( $base_url . 'sequences/' . $convertKitSettings['sequence']['value'] . '/subscribe', $request_args );

		}

		// Add tags
		if ( ! empty( $convertKitSettings['tags'] ) ) {
			$tag_ids = array_column( $convertKitSettings['tags'], 'value' );

			foreach ( $tag_ids as $tag_id ) {
				$response = wp_remote_post( $base_url . 'tags/' . $tag_id . '/subscribe', $request_args );
			}

		}

	}

	public function activecampaign() {
		$api_key  = get_option( 'kadence_blocks_activecampaign_api_key' );
		$api_base = get_option( 'kadence_blocks_activecampaign_api_base' );
		$base_url = $api_base . '/api/3';

		$activeCampaignSettings = $this->form_args['attributes']['activecampaign'];

		if ( empty( $api_key ) || empty( $api_base ) || empty( $activeCampaignSettings['map'] ) ) {
			return;
		}

		$fieldMap = array();

		foreach ( $activeCampaignSettings['map'] as $response_key => $field_name ) {

			if ( $field_name === 'None' ) {
				continue;
			}

			if ( in_array( $field_name, [ 'firstName', 'phone', 'lastName', 'email' ] ) ) {
				$fieldMap[ $field_name ] = $this->responses[ $response_key ]['value'];
			} else {
				$fieldMap['fieldValues'][] = array(
					'field' => $field_name,
					'value' => $this->responses[ $response_key ]['value'],
				);
			}

		}

		$email_key = array_search( 'email', $activeCampaignSettings['map'] );


		// Missing or invalid email address
		if ( empty( $this->responses[ $email_key ]['value'] ) || ! filter_var( $this->responses[ $email_key ]['value'], FILTER_VALIDATE_EMAIL ) ) {
			return;
		}

		$request_args = array(
			'headers' => array(
				'Api-Token'    => $api_key,
				'Content-Type' => 'application/json',
			)
		);

		// Create / Update Contact
		$response = wp_remote_post( $base_url . '/contact/sync', array_merge(
			$request_args,
			array(
				'body' => json_encode(
					array(
						'contact' => $fieldMap
					)
				)
			)
		) );

		if ( ! isset( $response['body'] ) ) {
			return;
		}

		$contactInfo = json_decode( $response['body'], true );

		if ( ! is_array( $contactInfo ) || ! isset( $contactInfo['contact']['id'] ) ) {
			return;
		}

		$contactId = $contactInfo['contact']['id'];

		// Add to List
		if ( ! empty( $activeCampaignSettings['list']['value'] ) && is_numeric( $activeCampaignSettings['list']['value'] ) ) {
			$response = wp_remote_post( $base_url . '/contactLists', array_merge(
				$request_args,
				array(
					'body' => json_encode(
						array(
							'contactList' => array(
								'list'    => $activeCampaignSettings['list']['value'],
								'contact' => $contactId,
								'status'  => '1'
							)
						)
					)
				)
			) );
		}

		// Add to automation
		if ( ! empty( $activeCampaignSettings['groups']['value'] ) && is_numeric( $activeCampaignSettings['groups']['value'] ) ) {
			$response = wp_remote_post( $base_url . '/contactAutomations', array_merge(
				$request_args,
				array(
					'body' => json_encode(
						array(
							'contactAutomation' => array(
								'contact'    => $contactId,
								'automation' => $activeCampaignSettings['groups']['value']
							)
						)
					)
				)
			) );
		}

		// Add Tags
		if ( ! empty( $activeCampaignSettings['tags'] ) && is_array( $activeCampaignSettings['tags'] ) ) {

			foreach ( $activeCampaignSettings['tags'] as $key => $tag ) {

				if ( empty( $tag['value'] ) || ! is_numeric( $tag['value'] ) ) {
					continue;
				}

				$response = wp_remote_post( $base_url . '/contactTags', array_merge(
					$request_args,
					array(
						'body' => json_encode(
							array(
								'contactTag' => array(
									'contact' => $contactId,
									'tag'     => $tag['value']
								)
							)
						)
					)
				) );
			}
		}

	}

	public function webhook() {
		$webhook_defaults = array(
			'url' => '',
		);

		$webhookSettings = $this->form_args['attributes']['webhook'];


		$webhook_args = ( isset( $webhookSettings ) && is_array( $webhookSettings ) ) ? $webhookSettings : $webhook_defaults;

		if ( empty( $webhook_args['url'] ) ) {
			return;
		}

		$map     = ( isset( $webhook_args['map'] ) && is_array( $webhook_args['map'] ) ? $webhook_args['map'] : array() );
		$user_ip = $this->get_client_ip();
		$browser = $this->get_browser();

		$name = esc_attr( strip_tags( get_the_title( $this->post_id ) ) );
		$body = array(
			'post_name'    => $name,
			'post_url'     => wp_get_referer(),
			'post_id'      => $this->post_id,
			'form_id'      => 'form_id',
			'user_id'      => get_current_user_id(),
			'user_ip'      => $user_ip,
			'user_device'  => ( $browser ? $browser['name'] . '/' . $browser['platform'] : esc_html__( 'Not Collected', 'kadence-blocks' ) ),
			'date_created' => date_i18n( get_option( 'date_format' ) ),
			'time_created' => date_i18n( get_option( 'time_format' ) ),
		);

		if ( ! empty( $map ) ) {
			foreach ( $this->responses as $key => $data ) {
				if ( isset( $map[ $key ] ) && ! empty( $map[ $key ] ) ) {
					$body[ $map[ $key ] ] = $data['value'];
				} else {
					$body[ $data['label'] ] = $data['value'];
				}
			}
		} else {
			foreach ( $this->responses as $key => $data ) {
				$body[ $data['label'] ] = $data['value'];
			}
		}

		$args     = apply_filters( 'kadence_blocks_pro_webhook_args', array( 'body' => $body ) );
		$response = wp_remote_post( $webhook_args['url'], $args );

		if ( 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return;
		}
	}

	public function entry( $post_id ) {
		$entry_defaults = array(
			'name'       => '',
			'userIP'     => true,
			'userDevice' => true,
		);

		$entry_args = ( isset( $this->form_args['attributes']['entry'] ) && is_array( $this->form_args['attributes']['entry'] ) ) ? $this->form_args['attributes']['entry'] : $entry_defaults;
		$user_ip    = ( ! isset( $entry_args['userIP'] ) || ( isset( $entry_args['userIP'] ) && $entry_args['userIP'] ) ? $this->get_client_ip() : ip2long( '0.0.0.0' ) );
		$browser    = ( ! isset( $entry_args['userDevice'] ) || ( isset( $entry_args['userDevice'] ) && $entry_args['userDevice'] ) ? $this->get_browser() : false );
		$name       = ( isset( $entry_args['name'] ) && ! empty( trim( $entry_args['name'] ) ) ? trim( $entry_args['name'] ) : esc_attr( strip_tags( get_the_title( $this->post_id ) ) ) . ' ' . esc_attr__( 'submission', 'kadence-blocks-pro' ) );

		$data = array(
			'name'         => $name,
			'form_id'      => $post_id,
			'post_id'      => $this->post_id,
			'user_id'      => get_current_user_id(),
			'date_created' => current_time( 'mysql' ),
			'user_ip'      => $user_ip,
			'referer'      => wp_get_referer(),
			'user_device'  => ( $browser ? $browser['name'] . '/' . $browser['platform'] : esc_html__( 'Not Collected', 'kadence-blocks-pro' ) ),
		);

		$entries  = new KBP\Queries\Entry();
		$entry_id = $entries->add_item( $data );

		if ( $entry_id ) {
			foreach ( $this->responses as $key => $meta_data ) {
				$response = $this->add_field( $entry_id, 'kb_field_' . $key, $meta_data );
			}
		}
	}

	public function autoEmail() {
		$auto_defaults = array(
			'subject'   => __( 'Thanks for contacting us!', 'kadence-blocks-pro' ),
			'message'   => __( 'Thanks for getting in touch, we will respond within the next 24 hours.', 'kadence-blocks-pro' ),
			'fromEmail' => '',
			'fromName'  => '',
			'replyTo'   => '',
			'cc'        => '',
			'bcc'       => '',
			'html'      => true,
		);

		$auto_email_args = ( isset( $this->form_args['attributes']['autoEmail'] ) && is_array( $this->form_args['attributes']['autoEmail'] ) ) ? $this->form_args['attributes']['autoEmail'] : $auto_defaults;
		$subject         = isset( $auto_email_args['subject'] ) && ! empty( trim( $auto_email_args['subject'] ) ) ? $auto_email_args['subject'] : __( 'Thanks for contacting us!', 'kadence-blocks-pro' );
		$message         = isset( $auto_email_args['message'] ) && ! empty( trim( $auto_email_args['message'] ) ) ? $auto_email_args['message'] : __( 'Thanks for getting in touch, we will respond within the next 24 hours.', 'kadence-blocks-pro' );
		$reply_email     = isset( $auto_email_args['replyTo'] ) && ! empty( trim( $auto_email_args['replyTo'] ) ) ? sanitize_email( trim( $auto_email_args['replyTo'] ) ) : false;
		$to              = isset( $auto_email_args['emailTo'] ) && ! empty( trim( $auto_email_args['emailTo'] ) ) ? $auto_email_args['emailTo'] : false;

		if ( strpos( $subject, '{field_' ) !== false ) {
			preg_match_all( '/{field_(.*?)}/', $subject, $match );
			if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
				foreach ( $match[1] as $field_id ) {
					if ( isset( $field_id ) ) {
						$real_id = absint( $field_id ) - 1;
						if ( isset( $this->responses[ $real_id ] ) && is_array( $this->responses[ $real_id ] ) && isset( $this->responses[ $real_id ]['value'] ) ) {
							$subject = str_replace( '{field_' . $field_id . '}', $this->responses[ $real_id ]['value'], $subject );
						}
					}
				}
			}
		}

		if ( strpos( $message, '{field_' ) !== false ) {
			preg_match_all( '/{field_(.*?)}/', $message, $match );
			if ( is_array( $match ) && isset( $match[1] ) && is_array( $match[1] ) ) {
				foreach ( $match[1] as $field_id ) {
					if ( isset( $field_id ) ) {
						$real_id = absint( $field_id ) - 1;
						if ( isset( $this->responses[ $real_id ] ) && is_array( $this->responses[ $real_id ] ) && isset( $this->responses[ $real_id ]['value'] ) ) {
							$message = str_replace( '{field_' . $field_id . '}', $this->responses[ $real_id ]['value'], $message );
						}
					}
				}
			}
		}

		if ( ! $to ) {
			foreach ( $this->responses as $key => $data ) {
				if ( 'email' === $data['type'] ) {
					$to = $data['value'];
					break;
				}
			}
		}
		// Can't find someone to email?
		if ( ! $to ) {
			return;
		}

		if ( ! isset( $auto_email_args['html'] ) || ( isset( $auto_email_args['html'] ) && $auto_email_args['html'] ) ) {
			$args          = array(
				'message' => $message,
				'fields'  => $this->responses,
			);
			$email_content = kadence_blocks_pro_get_template_html( 'form-auto-email.php', $args );
		} else {
			$email_content = $message . "\n\n";
		}
		$body = $email_content;
		if ( ! isset( $auto_email_args['html'] ) || ( isset( $auto_email_args['html'] ) && $auto_email_args['html'] ) ) {
			$headers = 'Content-Type: text/html; charset=UTF-8' . "\r\n";
		} else {
			$headers = 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
		}
		if ( $reply_email ) {
			$headers .= 'Reply-To: <' . $reply_email . '>' . "\r\n";
		}
		if ( isset( $auto_email_args['fromEmail'] ) && ! empty( trim( $auto_email_args['fromEmail'] ) ) ) {
			$headers .= 'From: ' . ( isset( $auto_email_args['fromName'] ) && ! empty( trim( $auto_email_args['fromName'] ) ) ? trim( $auto_email_args['fromName'] ) . ' ' : '' ) . '<' . sanitize_email( trim( $auto_email_args['fromEmail'] ) ) . '>' . "\r\n";
		}
		$cc_headers = '';
		if ( isset( $auto_email_args['cc'] ) && ! empty( trim( $auto_email_args['cc'] ) ) ) {
			$cc_headers = 'Cc: ' . sanitize_email( trim( $auto_email_args['cc'] ) ) . "\r\n";
		}

		wp_mail( $to, $subject, $body, $headers . $cc_headers );
		if ( isset( $auto_email_args['bcc'] ) && ! empty( trim( $auto_email_args['bcc'] ) ) ) {
			$bcc_emails = explode( ',', $auto_email_args['bcc'] );
			foreach ( $bcc_emails as $bcc_email ) {
				wp_mail( sanitize_email( trim( $bcc_email ) ), $subject, $body, $headers );
			}
		}
	}


	/**
	 * Add meta data field to a entry
	 *
	 * @since 3.0
	 *
	 * @param string $meta_key   Meta data name.
	 * @param mixed  $meta_value Meta data value. Must be serializable if non-scalar.
	 * @param bool   $unique     Optional. Whether the same key should not be added. Default false.
	 *
	 * @param int    $entry_id   entry ID.
	 *
	 * @return false|int
	 */
	public function add_field( $entry_id, $meta_key, $meta_value, $unique = false ) {

		if ( isset( $meta_value['type'] ) && $meta_value['type'] === 'file' ) {
			$meta_value['value'] = '<a href="' . $meta_value['value'] . '">' . $meta_value['value'] . '</a>';
		}

		return add_metadata( 'kbp_form_entry', $entry_id, $meta_key, $meta_value, $unique );
	}

	/**
	 * Get the client IP address
	 *
	 * @return string
	 */
	public function get_client_ip() {
		$ipaddress = '';

		if ( isset( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
		} elseif ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} elseif ( isset( $_SERVER['HTTP_X_FORWARDED'] ) ) {
			$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
		} elseif ( isset( $_SERVER['HTTP_FORWARDED_FOR'] ) ) {
			$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
		} elseif ( isset( $_SERVER['HTTP_FORWARDED'] ) ) {
			$ipaddress = $_SERVER['HTTP_FORWARDED'];
		} elseif ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
			$ipaddress = $_SERVER['REMOTE_ADDR'];
		} else {
			$ipaddress = 'UNKNOWN';
		}

		return $ipaddress;
	}

	/**
	 * Get User Agent browser and OS type
	 *
	 * @return array
	 */
	public function get_browser() {
		$u_agent  = $_SERVER['HTTP_USER_AGENT'];
		$bname    = 'Unknown';
		$platform = 'Unknown';
		$version  = '';
		$ub       = '';

		// first get the platform
		if ( preg_match( '/linux/i', $u_agent ) ) {
			$platform = 'Linux';
		} elseif ( preg_match( '/macintosh|mac os x/i', $u_agent ) ) {
			$platform = 'MAC OS';
		} elseif ( preg_match( '/windows|win32/i', $u_agent ) ) {
			$platform = 'Windows';
		}

		// next get the name of the useragent yes seperately and for good reason
		if ( preg_match( '/MSIE/i', $u_agent ) && ! preg_match( '/Opera/i', $u_agent ) ) {
			$bname = 'Internet Explorer';
			$ub    = 'MSIE';
		} elseif ( preg_match( '/Trident/i', $u_agent ) ) {
			// this condition is for IE11.
			$bname = 'Internet Explorer';
			$ub    = 'rv';
		} elseif ( preg_match( '/Firefox/i', $u_agent ) ) {
			$bname = 'Mozilla Firefox';
			$ub    = 'Firefox';
		} elseif ( preg_match( '/Chrome/i', $u_agent ) ) {
			$bname = 'Google Chrome';
			$ub    = 'Chrome';
		} elseif ( preg_match( '/Safari/i', $u_agent ) ) {
			$bname = 'Apple Safari';
			$ub    = 'Safari';
		} elseif ( preg_match( '/Opera/i', $u_agent ) ) {
			$bname = 'Opera';
			$ub    = 'Opera';
		} elseif ( preg_match( '/Netscape/i', $u_agent ) ) {
			$bname = 'Netscape';
			$ub    = 'Netscape';
		}

		// finally get the correct version number.
		$known   = array( 'Version', $ub, 'other' );
		$pattern = '#(?<browser>' . join( '|', $known ) .
		           ')[/|: ]+(?<version>[0-9.|a-zA-Z.]*)#';
		if ( ! preg_match_all( $pattern, $u_agent, $matches ) ) {
			// we have no matching number just continue.
		}

		// see how many we have.
		$i = count( $matches['browser'] );

		if ( $i != 1 ) {
			// we will have two since we are not using 'other' argument yet
			// see if version is before or after the name
			if ( strripos( $u_agent, 'Version' ) < strripos( $u_agent, $ub ) ) {
				$version = $matches['version'][0];
			} else {
				$version = $matches['version'][1];
			}
		} else {
			$version = $matches['version'][0];
		}

		// check if we have a number.
		if ( null === $version || '' === $version ) {
			$version = '';
		}

		return array(
			'userAgent' => $u_agent,
			'name'      => $bname,
			'version'   => $version,
			'platform'  => $platform,
			'pattern'   => $pattern,
		);
	}
}
