<?php
/**
 * Class Cpt_To_Template
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Cpt_To_Template.
 */
class Cpt_To_Template {
	/**
	 * Slug.
	 *
	 * @var string
	 */
	private $slug = '';

	/**
	 * Constructor.
	 */
	public function __construct( $slug = '' ) {
		if ( ! empty( $slug ) ) {
			$this->slug = $slug;
			add_action( "admin_action_kadence_export_{$slug}", array( $this, 'export_action' ) );
			add_filter( 'post_row_actions', array( $this, 'export_link' ), 10, 2 );
		}
	}

	/**
	 * Show the "Export" link in admin post list.
	 *
	 * @param array   $actions Array of actions.
	 * @param WP_Post $post Post object.
	 * @return array
	 */
	public function export_link( $actions, $post ) {

		if ( ! is_object( $post ) ) {
			return;
		}
		if ( ! isset( $post->post_type ) ) {
			return $actions;
		}
		if ( $this->slug !== $post->post_type ) {
			return $actions;
		}

		$actions['export'] = '<a href="' . wp_nonce_url( admin_url( 'edit.php?post_type=' . $this->slug . '&action=kadence_export_' . $this->slug . '&amp;post=' . $post->ID ), 'kadence_export_post_' . $post->ID ) . '" aria-label="' . esc_attr__( 'Make a export from this.', 'kadence-blocks' )
			. '" rel="permalink" target="_blank">' . esc_html__( 'Export', 'kadence-blocks' ) . '</a>';

		return $actions;
	}

	/**
	 * Export a post action.
	 */
	public function export_action() {
		if ( empty( $_REQUEST['post'] ) ) {
			wp_die( esc_html__( 'No post to export has been supplied!', 'kadence-blocks' ) );
		}

		$post_id = isset( $_REQUEST['post'] ) ? absint( $_REQUEST['post'] ) : '';
		check_admin_referer( 'kadence_export_post_' . $post_id );

		$this->export( $post_id );

		// Redirect to the edit screen for the new draft page.
//		wp_redirect( admin_url( 'post.php?action=edit&post=' . $export_id ) );
		exit;
	}

	/**
	 * Function to export of the post.
	 *
	 * @param POST $post The post to export.
	 */
	public function export( $post_id ) {
		$meta_to_js = new \MetaToJs();
		$meta_to_js->meta_to_js( $post_id );

		die();
	}

}

class MetaToJs {

	private $output = '';

	private $nav_count = 0;
	public function meta_to_js( $post_id ) {
		$this->output = file_get_contents(plugin_dir_path( __FILE__ ) . 'header-template.tpl');

		$post_title = get_the_title( $post_id );
		$post_type = get_post_type( $post_id );
		$post_meta = $this->post_meta( $post_id);
		$inner_blocks = $this->inner_blocks( $post_id, $post_title );

		$this->output = str_replace( '{post_title}', $post_title, $this->output);
		$this->output = str_replace( '{post_type}', $post_type, $this->output);
		$this->output = str_replace( '{post_meta}', $post_meta, $this->output);
		$this->output = str_replace( '{inner_blocks}', $inner_blocks, $this->output);
		$file_name = str_replace( '--', '-', preg_replace('/[^A-Za-z0-9_\-]/', '-', $post_type . ' - ' .$post_title) ) . time() . '.js';

//		header('Content-Disposition: attachment; filename="'. $file_name .'"');
//		header('Content-Type: text/javascript');
//		header('Content-Length: ' . strlen($this->output));
//		header('Connection: close');

		echo $this->output;
		die();
	}


	public function inner_blocks( $post_id, $post_title ) {
		$blocks = parse_blocks( get_post_field( 'post_content', $post_id ) );
		$blocks_array =  $this->parseBlocks( $blocks, $post_title );

		$return = 'function innerBlocks() { return [ ';

		$return .= $blocks_array;

		$return .= ']; }';

		return $return;
	}

	public function parseBlocks($blocks, $post_title, $navs = null) {
		$result = '';
		$navs = empty( $navs ) ? $this->getPlaceholderNavsForTemplate( $post_title ) : $navs;

		foreach ($blocks as $block) {
			$blockName = $block['blockName'];

			// Remove liked id to nav block
			if( $blockName === 'kadence/navigation') {
				unset( $block['attrs']['id']);
				$templateKey = !empty ( $navs[ $this->nav_count ] ) ? $navs[ $this->nav_count ] : 'short';
				$this->nav_count++;
				$block['attrs']['templateKey'] = $templateKey;
			}

			if( $blockName === 'kadence/image') {
				$id = isset( $block['attrs']['id'] ) ? $block['attrs']['id'] : 0;
				unset( $block['attrs']['id']);

				$image = 'logo-dark.png';
				if( $id === 71 ) {
					$image = 'logo-light.png';
				} else if (  $id === 97 ) {
					$image = 'logo-light-lg.png';
				}

				$block['attrs']['url'] = '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/' . $image;
			}

			$attrs = empty( $block['attrs'] ) ? '{}' :  json_encode( $block['attrs']);

			// If there are inner blocks, recursively parse them
			$innerBlocks = '';
			if (!empty($block['innerBlocks'])) {
				$innerBlocks = $this->parseBlocks($block['innerBlocks'], $post_title, $navs);
			}

			$result .= "createBlock('". $blockName . "', " . $attrs . ", [ " . $innerBlocks . " ] ), ";
		}



		return $result;
	}

	public function post_meta ( $post_id ) {

		$all_meta = get_post_meta( $post_id );
		$return = 'const postMeta = {';

		foreach( $all_meta as $key => $value) {
			if( str_starts_with( $key, '_kad_header_' ) && $value[0] !== '' ) {
				if ( str_starts_with( $value[0], 'a:' ) ) {
					$return .= $key . ': ' . json_encode( maybe_unserialize( $value[0] ) ) . ', ';
				} else {
					$output = $value[0];
					if( is_numeric( $value[0] )) {
						$output = '"' . $value[0] . '"';
					} else if ( $key === '_kad_header_widthUnit' ) {
						$output = '"' . $value[0] . '"';
					}

					$return .= $key . ': ' . $output . ', ';
				}
			}
		}
		$return .= '};';

		return $return;
	}

	public function getPlaceholderNavsForTemplate( $template_name ) {
		$long_templates = [ 'Basic: 2 buttons', 'Multi-row 1', 'Multi-row 2', 'Multi-Row 5'];

		if( in_array($template_name, $long_templates) ) {
			return [ 'long', 'long-vertical' ];
		} else if( $template_name === 'Multi-Row 4' ) {
			return [ 'short', 'long', 'long-vertical' ];
		}

		return [ 'short', 'short-vertical' ];
	}

}
