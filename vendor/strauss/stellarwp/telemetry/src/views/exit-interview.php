<?php
/**
 * $args comes from load_template() in OptinTemplate.php
 *
 * @var array $args
 */

?>
<div id="exit-interview-<?php echo esc_attr( $args['plugin_slug'] ); ?>" class="stellarwp-telemetry stellarwp-telemetry-modal stellarwp-telemetry-modal--exit-interview" data-js="exit-interview-modal" data-plugin-slug="<?php echo esc_attr( $args['plugin_slug'] ); ?>">
	<div class="stellarwp-telemetry-modal__inner">
		<img src="<?php echo esc_url( $args['plugin_logo'] ); ?>" width="<?php echo esc_attr( $args['plugin_logo_width'] ); ?>" height="<?php echo esc_attr( $args['plugin_logo_height'] ); ?>" alt="<?php echo esc_attr( $args['plugin_logo_alt'] ); ?>" class="stellarwp-telemetry-plugin-logo">
		<h1 class="stellarwp-telemetry__title">
			<?php echo esc_attr( $args['heading'] ); ?>
		</h1>
		<div class="stellarwp-telemetry__intro">
			<?php echo esc_attr( $args['intro'] ); ?>
		</div>
		<form method="get" data-js="exit-interview-form">
			<ul class="stellarwp-telemetry-uninstall-reasons">
				<?php foreach ( $args['uninstall_reasons'] as $key => $item ) : ?>
					<li class="stellarwp-telemetry-uninstall-reasons__item">
						<input type="radio" name="uninstall_reason" id="reason-<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $item['uninstall_reason'] ); ?>" data-uninstall-reason-id="<?php echo esc_attr( $item['uninstall_reason_id'] ); ?>">
						<label for="reason-<?php echo esc_attr( $key ); ?>">
							<?php echo esc_attr( $item['uninstall_reason'] ); ?>
							<?php if ( isset( $item['show_comment'] ) && $item['show_comment'] ) { ?>
								<textarea name="comment" placeholder="<?php echo esc_attr__( 'Tell us more...', 'stellarwp-telemetry' ); ?>"></textarea>
							<?php } ?>
						</label>
					</li>
				<?php endforeach; ?>
			</ul>
			<div class="error-message stellarwp-telemetry-error-message">
				<?php echo esc_html__( 'Please select a reason', 'stellarwp-telemetry' ); ?>
			</div>
			<footer>
				<button data-js="skip-interview" class="stellarwp-telemetry-btn-grey" type="button">
					<?php echo esc_html__( 'Skip', 'stellarwp-telemetry' ); ?>
				</button>
				<button data-js="submit-telemetry" class="stellarwp-telemetry-btn-primary" type="submit" name="deactivate" value="true">
					<?php echo esc_html__( 'Deactivate', 'stellarwp-telemetry' ); ?>
				</button>
			</footer>
		</form>
	</div>
</div>
