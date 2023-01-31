(function ( $ ) {

	/**
	 * jQuery code to handle the opt-in modal.
	 */
	$('body').find('[data-js="optin-modal"]').each(function () {
		let $optin         = $(this);
		let $other_plugins = $optin.find('[data-js="other-plugins-toggle"]');

		if ( $other_plugins.length ) {
			$other_plugins.click(function (e) {
				let $this = $(this).closest('.stellarwp-telemetry-other-plugins');
				$this.find('.stellarwp-telemetry-other-plugins__list').slideToggle();
			});
		}
	});

	/**
	 * jQuery code to handle the exit interview modal.
	 */
	$('body').find('[data-js="exit-interview-modal"]').each( function () {
		let $exitInterview = $(this);
		let pluginSlug     = $exitInterview.data('plugin-slug');
		let redirectLink   = null;

		// Deactivate Button
		$('body').on( 'click', '#the-list .deactivate > a', function ( e ) {
			if ( 0 === $( this ).next( '[data-plugin-slug].telemetry-plugin-slug' ).length ) {
				return true;
			}

			if ( $( this ).next( '[data-plugin-slug].telemetry-plugin-slug' ).data( 'plugin-slug' ) !== pluginSlug ) {
				return true;
			}

			e.preventDefault();

			redirectLink = $(this).attr('href');
			$exitInterview.addClass('stellarwp-telemetry-modal--active');

			// Skip Button
			$exitInterview.on( 'click', '[data-js="skip-interview"]', function ( e ) {
				e.preventDefault();
				$exitInterview.removeClass('stellarwp-telemetry-modal--active');
				window.location.href = redirectLink;
			});

			// Answer Click
			$exitInterview.on( 'change', '[name="uninstall_reason"]', function () {
				let $this = $(this);
				let $wrapper = $this.closest('li');
				let $reason = $wrapper.find('[name="comment"]');

				$exitInterview.find('.stellarwp-telemetry-uninstall-reasons__item--active').removeClass('stellarwp-telemetry-uninstall-reasons__item--active');
				$exitInterview.find('.stellarwp-telemetry-uninstall-reasons__item [name="comment"]').val('');
				$exitInterview.find('.stellarwp-telemetry-error-message').hide();

				if ( ! $reason.length ) {
					return;
				}

				$wrapper.addClass('stellarwp-telemetry-uninstall-reasons__item--active');
			});

			// Submit Button
			$exitInterview.on( 'click', '[data-js="submit-telemetry"]', function ( e ) {
				e.preventDefault();
				this.disabled = true;

				let $form = $('[data-js="exit-interview-form"]');

				let data = {
					action: stellarwpTelemetry.exit_interview.action,
					nonce: stellarwpTelemetry.exit_interview.nonce,
					plugin_slug: pluginSlug,
				};

				// Get uninstall_reason value
				let $reason = $form.find('[name="uninstall_reason"]:checked');

				if ( ! $reason.length ) {
					$exitInterview.find('.stellarwp-telemetry-error-message').show();
					return;
				}

				data['uninstall_reason_id'] = $reason.data('uninstall-reason-id');
				data['uninstall_reason']    = $reason.val();

				// Get comment value if exists
				let $comment = $reason.closest('li').find('[name="comment"]');

				if ( $comment.length ) {
					if ( ! $comment.val() ) {
						$exitInterview.find('.stellarwp-telemetry-error-message').show();
						return;
					}

					data['comment'] = $comment.val();
				}

				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: data,
				}).done(function () {
					// Redirect to the plugin page.
					window.location.href = redirectLink;
				});
			} );
		});
	});

}( jQuery ));
