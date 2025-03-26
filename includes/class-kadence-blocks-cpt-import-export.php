<?php

/**
 * Class Kadence_Blocks_Import_Export
 *
 * Creates a zip file for Kadence Custom Post Types.
 * Will include all related sub custom post types and post meta.
 */

if (!defined('ABSPATH')) {
	exit;
}

class Kadence_Blocks_Cpt_Import_Export
{
	/**
	 * Post type slug
	 *
	 * @var string
	 */
	private $slug = '';

	/**
	 * Blocks that are based on CPT
	 *
	 * @var array
	 */
	private $kadence_cpt_blocks = array(
		'kadence/header',
		'kadence/navigation',
		'kadence/query',
		'kadence/query-card',
		'kadence/advanced-form',
	);

	/*
	 * Post meta keys to exclude from export.
	 */
	private $excluded_meta_keys = array(
		'_edit_lock',
	);

	/**
	 * Posts to process
	 *
	 * @var array
	 */
	private $processed_posts = array();

	/**
	 * ID map for related posts
	 *
	 * @var array
	 */
	private $relationship_map = array();

	public function __construct($slug = '') {
		if (!empty($slug)) {
			$this->slug = $slug;
			add_action('admin_menu', array($this, 'add_import_export_buttons'), 20);
			add_action('admin_post_kadence_export_posts-' . $slug, array($this, 'handle_export'));
			add_action('admin_post_kadence_import_posts-' . $slug, array($this, 'handle_import'));
			add_action('admin_notices', array($this, 'display_import_notices'));

			add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
			add_action('admin_footer', array($this, 'add_import_modal_styles'));
			add_filter('bulk_actions-edit-' . $slug, array($this, 'register_bulk_export_action'));
			add_filter('handle_bulk_actions-edit-' . $slug, array($this, 'handle_bulk_export'), 10, 3);

		}
	}

	public function handle_bulk_export($redirect_to, $action, $post_ids)
	{
		if ($action !== 'export_selected') {
			return $redirect_to;
		}

		if (!current_user_can('manage_options')) {
			wp_die(__('You do not have sufficient permissions to export content.', 'kadence-blocks'));
		}

		$this->handle_export($post_ids, false);
	}

	public function enqueue_scripts($hook) {
		if ('edit.php' === $hook && $this->slug === get_current_screen()->post_type) {
			wp_register_script(
				'kadence-cpt-import-export',
				'', // Empty source as we're using inline script
				array('jquery'),
				'1.0',
				true
			);

			wp_enqueue_script('kadence-cpt-import-export');

			wp_add_inline_script('kadence-cpt-import-export', '
            jQuery(document).ready(function($) {
                // Move buttons to after views
                var $buttons = $(".kadence-import-export-buttons");
                $buttons.insertAfter(".subsubsub");

                // Handle import button click
                $("#kadence-reveal-import").on("click", function(e) {
                    e.preventDefault();
                    $(".kadence-import-form").slideToggle();
                });
            });
        ');
		}
	}

	/**
	 * Register bulk action
	 */
	public function register_bulk_export_action($bulk_actions) {
		$bulk_actions['export_selected'] = __('Export', 'kadence-blocks');
		return $bulk_actions;
	}

	/**
	 * Add styles for import modal
	 */
	public function add_import_modal_styles() {
		if (get_current_screen()->post_type !== $this->slug) {
			return;
		}
		?>
		<style>
			.subsubsub {
				margin-bottom: 0;
				float: left;
			}
			.kadence-import-export-buttons {
				float: left;
				margin: 5px 0 0 15px;
				padding: 0;
			}
			.kadence-import-export-buttons form {
				display: inline-block;
			}
			.kadence-import-form {
				display: none;
				clear: both;
				margin: 10px 0;
				padding: 10px;
				background: #fff;
				border: 1px solid #ccd0d4;
				border-radius: 4px;
				box-shadow: 0 1px 1px rgba(0,0,0,.04);
			}
			.kadence-import-form form {
				display: flex;
				gap: 10px;
				align-items: center;
			}
			.kadence-import-form:before {
				content: "";
				display: table;
				clear: both;
			}
			.search-box {
				float: right;
			}
			@media screen and (max-width: 782px) {
				.kadence-import-export-buttons {
					display: none;
				}
			}
		</style>
		<?php
	}

	/**
	 * Display admin notices for import success/failure
	 */
	public function display_import_notices() {
		if ( empty($_GET['post_type']) || $_GET['post_type'] !== $this->slug || empty($_GET['import_status'])) {
			return;
		}

		if ($_GET['import_status'] === 'success') {
			?>
			<div class="notice notice-success is-dismissible">
				<p><?php _e('Import completed successfully!', 'kadence-blocks'); ?></p>
			</div>
			<?php
		} elseif ($_GET['import_status'] === 'error' && isset($_GET['error_message'])) {
			?>
			<div class="notice notice-error is-dismissible">
				<p><?php echo esc_html(urldecode($_GET['error_message'])); ?></p>
			</div>
			<?php
		}
	}

	/**
	 * Add import/export buttons to the post type admin page
	 */
	public function add_import_export_buttons() {
		global $pagenow, $typenow;

		if ('edit.php' === $pagenow && $this->slug === $typenow && current_user_can('manage_options') ) {
			add_action('admin_notices', array($this, 'render_import_export_buttons'));
		}
	}

	/**
	 * Render the import/export buttons
	 */
	public function render_import_export_buttons() {
		?>
		<div class="kadence-import-export-buttons">
			<form method="post" action="<?php echo admin_url('admin-post.php'); ?>" style="display: inline-block; margin-right: 10px;">
				<?php wp_nonce_field('kadence_export_posts_nonce', 'kadence_export_nonce'); ?>
				<input type="hidden" name="action" value="kadence_export_posts-<?php echo esc_attr($this->slug); ?>">
				<input type="hidden" name="post_type" value="<?php echo esc_attr($this->slug); ?>">
				<input type="submit" class="button button-secondary" value="<?php esc_attr_e('Export All', 'kadence-blocks'); ?>">
			</form>

			<button id="kadence-reveal-import" class="button button-secondary">
				<?php esc_html_e('Import', 'kadence-blocks'); ?>
			</button>

			<div class="kadence-import-form">
				<form method="post" action="<?php echo admin_url('admin-post.php'); ?>" enctype="multipart/form-data">
					<?php wp_nonce_field('kadence_import_posts_nonce', 'kadence_import_nonce'); ?>
					<input type="hidden" name="action" value="kadence_import_posts-<?php echo esc_attr($this->slug); ?>">
					<input type="hidden" name="post_type" value="<?php echo esc_attr($this->slug); ?>">
					<input type="file" name="import_file" accept=".zip" required>
					<input type="submit" class="button button-primary" value="<?php esc_attr_e('Upload & Import', 'kadence-blocks'); ?>">
				</form>
			</div>
		</div>
		<?php
	}

	/**
	 * Export to zip and download.
	 */
	public function handle_export( $post_ids = array(), $check_referrer = true ) {
		if (!current_user_can('manage_options')) {
			$this->redirect_with_error( __('You do not have sufficient permissions to export content.', 'kadence-blocks') );
		}

		if( $check_referrer ) {
			check_admin_referer('kadence_export_posts_nonce', 'kadence_export_nonce');
		}

		$posts_args = array(
			'post_type' => $this->slug,
			'posts_per_page' => -1,
			'post_status' => 'any',
		);

		if( ! empty( $post_ids ) ) {
			$posts_args['post__in'] = $post_ids;
		}

		$posts = get_posts($posts_args);

		$export_data = array(
			'post_type' => $this->slug,
			'posts' => array(),
			'related_posts' => array(),
			'relationship_map' => array()
		);

		$this->processed_posts = array();
		$this->relationship_map = array();


		foreach ($posts as $post) {
			$post_data = $this->prepare_post_for_export($post);
			$export_data['posts'][] = $post_data;
			$this->processed_posts[] = $post->ID;

			$this->get_related_posts_recursive($post->post_content, $export_data['related_posts'], $post->ID);
		}

		$export_data['related_posts'] = array_values(array_unique($export_data['related_posts'], SORT_REGULAR));
		$export_data['relationship_map'] = $this->relationship_map;

		$temp_dir = get_temp_dir();
		$filename = $this->slug . '_export_' . date('Y-m-d_H-i-s');
		$json_file = $temp_dir . $filename . '.json';
		$zip_file = $temp_dir . $filename . '.zip';

		file_put_contents($json_file, wp_json_encode($export_data));

		$zip = new ZipArchive();
		$zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);
		$zip->addFile($json_file, 'export.json');
		$zip->close();

		header('Content-Type: application/zip');
		header('Content-Disposition: attachment; filename=' . basename($zip_file));
		header('Content-Length: ' . filesize($zip_file));
		readfile($zip_file);

		unlink($json_file);
		unlink($zip_file);
	}

	/**
	 * Recursively get related posts
	 */
	private function get_related_posts_recursive($content, &$related_posts, $parent_id = null) {
		$blocks = parse_blocks($content);

		foreach ($blocks as $block) {
			if( in_array( $block['blockName'], $this->kadence_cpt_blocks ) && !empty( $block['attrs']['id'] ) ) {
				$nested_id = $block['attrs']['id'];

				if ($parent_id !== null) {
					if (!isset($this->relationship_map[$parent_id])) {
						$this->relationship_map[$parent_id] = [];
					}
					$this->relationship_map[$parent_id][] = $nested_id;
				}

				if ( ! in_array( $nested_id, $this->processed_posts ) ) {
					$nested_post = get_post( $nested_id );
					if ( $nested_post ) {
						$related_posts[] = $this->prepare_post_for_export( $nested_post );
						$this->processed_posts[] = $nested_id;
						$this->get_related_posts_recursive($nested_post->post_content, $related_posts, $nested_id);
					}
				}
			}

			if (!empty($block['innerBlocks'])) {
				foreach ($block['innerBlocks'] as $inner_block) {
					$this->get_related_posts_recursive(serialize_blocks(array($inner_block)), $related_posts, $parent_id);
				}
			}
		}
	}

	public function handle_import() {
		if (!current_user_can('manage_options')) {
			$this->redirect_with_error( __('You do not have sufficient permissions to import content.', 'kadence-blocks' ) );
			return;
		}

		check_admin_referer('kadence_import_posts_nonce', 'kadence_import_nonce');

		if (!isset($_FILES['import_file'])) {
			$this->redirect_with_error( __( 'Please upload a file to import.', 'kadence-blocks' ) );
			return;
		}

		$file = $_FILES['import_file'];

		if ($file['error'] !== UPLOAD_ERR_OK) {
			$this->redirect_with_error( __('File upload failed.', 'kadence-blocks' ) );
			return;
		}

		if ($file['type'] !== 'application/zip' && $file['type'] !== 'application/x-zip-compressed') {
			$this->redirect_with_error( __('Invalid file type. Please upload a ZIP file.', 'kadence-blocks' ) );
			return;
		}

		$temp_dir = get_temp_dir();

		$zip = new ZipArchive();
		if ($zip->open($file['tmp_name']) === TRUE) {
			if ($zip->numFiles > 5) {
				$this->redirect_with_error( __('Invalid data in import file.', 'kadence-blocks' ) );
				return;
			}

			$zip->extractTo($temp_dir);
			$zip->close();

			if (!file_exists($temp_dir . 'export.json')) {
				$this->redirect_with_error( __( 'Invalid import file structure. Missing export.json', 'kadence-blocks' ) );
				return;
			}

			$json_content = file_get_contents($temp_dir . 'export.json');
			$import_data = json_decode($json_content, true);

			if (json_last_error() !== JSON_ERROR_NONE) {
				$this->redirect_with_error( __('Invalid JSON data in import file.', 'kadence-blocks' ) );
				return;
			}

			try {

				$id_map = array();

				if (!empty($import_data['related_posts'])) {
					foreach ($import_data['related_posts'] as $related_post) {
						$new_id = $this->import_single_post($related_post);
						if ($new_id) {
							$id_map[$related_post['ID']] = $new_id;
						}
					}
				}

				foreach (array_merge($import_data['related_posts'], $import_data['posts']) as $post_data) {
					$post_content = $post_data['post_content'];
					$updated_content = $this->update_block_ids($post_content, $id_map);

					$new_post_id = $id_map[$post_data['ID']] ?? null;

					if ($new_post_id) {
						wp_update_post(array(
							'ID' => $new_post_id,
							'post_content' => $updated_content
						));
					}
				}

				foreach ($import_data['posts'] as $post_data) {
					$this->import_single_post($post_data, $id_map);
				}

				unlink($temp_dir . 'export.json');

				wp_redirect(add_query_arg(
					array(
						'post_type' => $this->slug,
						'import_status' => 'success'
					),
					admin_url('edit.php')
				));
				exit;

			} catch (Exception $e) {
				$this->redirect_with_error('Import failed: ' . $e->getMessage());
				return;
			}
		} else {
			$this->redirect_with_error('Failed to process the import file.');
			return;
		}
	}

	private function prepare_post_for_export($post) {
		$post_data = array(
			'ID' => $post->ID,
			'post_content' => $post->post_content,
			'post_title' => $post->post_title,
			'post_excerpt' => $post->post_excerpt,
			'post_status' => $post->post_status,
			'post_type' => $post->post_type,
			'meta' => array()
		);

		$meta = get_post_custom($post->ID);
		foreach ($meta as $key => $values) {
			if ( ! in_array( $key, $this->excluded_meta_keys ) ) {
				$post_data['meta'][$key] = array_map('maybe_unserialize', $values);
			}
		}

		return $post_data;
	}

	private function import_single_post($post_data, $id_map = array()) {
		$temp_content = $post_data['post_content'];
		$post_data['post_content'] = '';
		unset($post_data['ID']);

		$new_post_id = wp_insert_post($post_data, true);

		if (!is_wp_error($new_post_id)) {
			if (!empty($post_data['meta'])) {
				foreach ($post_data['meta'] as $meta_key => $meta_values) {
					foreach ($meta_values as $meta_value) {
						add_post_meta($new_post_id, $meta_key, $meta_value);
					}
				}
			}

			$updated_content = $this->update_block_ids($temp_content, $id_map);
			wp_update_post(array(
				'ID' => $new_post_id,
				'post_content' => $updated_content
			));

			return $new_post_id;
		}

		return false;
	}

	/**
	 * Update block ID in content with new ID
	 */
	private function update_block_ids($content, $id_map) {
		$blocks = parse_blocks($content);

		foreach ($blocks as &$block) {
			if ( in_array( $block['blockName'], $this->kadence_cpt_blocks )
				&& !empty($block['attrs']['id'])
				&& isset($id_map[$block['attrs']['id']])) {
				$block['attrs']['id'] = $id_map[$block['attrs']['id']];
			}

			if (!empty($block['innerBlocks'])) {
				$inner_content = serialize_blocks($block['innerBlocks']);
				$updated_inner_content = $this->update_block_ids($inner_content, $id_map);
				$block['innerBlocks'] = parse_blocks($updated_inner_content);
			}
		}

		return serialize_blocks($blocks);
	}

	private function redirect_with_error($message) {
		wp_redirect(add_query_arg(
			array(
				'post_type' => $this->slug,
				'import_status' => 'error',
				'error_message' => urlencode($message)
			),
			admin_url('edit.php')
		),
			302
		);
		exit;
	}
}
