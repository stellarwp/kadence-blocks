<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Header_Block;
use Tests\Support\Classes\KadenceBlocksUnit;
use WP_HTML_Tag_Processor;

class HeaderTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'header';

	/**
	 * Post type for the form.
	 *
	 * @var string
	 */
	protected $post_type = 'kadence_header';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Header_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Header_Block();
	}

	protected function _after() {
	}

	public function testHeaderCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Header CPT is registered' );
	}

	/**
	 * Boolean transparent settings still render as "1", the value the header script reads.
	 *
	 * @return void
	 */
	public function testBooleanTransparentSettingsRenderAsOne() {
		$header_id = static::factory()->post->create(
			[
				'post_type'   => $this->post_type,
				'post_status' => 'publish',
			]
		);

		/*
		 * Saved meta comes back as "1", but the Kadence theme's per-page "Transparent: Enable"
		 * override hands the header a boolean true. The theme isn't loaded in wpunit, so feed the
		 * boolean through the header's meta instead.
		 */
		add_filter(
			'get_post_metadata',
			static function ( $value, $object_id, $meta_key ) use ( $header_id ) {
				if ( $object_id !== $header_id || '' !== $meta_key ) {
					return $value;
				}

				return [ '_kad_header_isTransparent' => [ true ] ];
			},
			10,
			3
		);

		$processor = new WP_HTML_Tag_Processor( do_blocks( '<!-- wp:kadence/header {"id":' . $header_id . '} /-->' ) );

		$this->assertTrue( $processor->next_tag( [ 'class_name' => 'wp-block-kadence-header' ] ) );
		$this->assertSame( '1', $processor->get_attribute( 'data-transparent' ) );
		$this->assertSame( '1', $processor->get_attribute( 'data-transparent-tablet' ) );
		$this->assertSame( '1', $processor->get_attribute( 'data-transparent-mobile' ) );
	}
}
