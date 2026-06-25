<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Prebuilt_Library;
use Kadence_Blocks_Prebuilt_Library_REST_Controller;
use ReflectionClass;
use Tests\wpunit\KadenceBlocksTestCase;

/**
 * Verifies the upload_files capability check on the prebuilt-library image
 * import path. import_image() only performs its work for users who
 * are allowed to upload files.
 */
class PrebuiltLibraryImportImageCapabilityTest extends KadenceBlocksTestCase {

	/**
	 * Build the library without its constructor so the assertions do not depend
	 * on the DI container or the admin-only AJAX hooks registered there.
	 */
	private function library(): Kadence_Blocks_Prebuilt_Library {
		return ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library::class ) )
			->newInstanceWithoutConstructor();
	}

	private function rest_controller(): Kadence_Blocks_Prebuilt_Library_REST_Controller {
		return ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library_REST_Controller::class ) )
			->newInstanceWithoutConstructor();
	}

	/**
	 * Seed an already-imported local image so check_for_local_image() would
	 * match it, letting us prove whether import_image() reached that lookup.
	 *
	 * @return array{0:int,1:string} The attachment id and the remote source URL.
	 */
	private function seed_local_image(): array {
		$source_url    = 'https://images.example.com/example-image.jpg';
		$attachment_id = self::factory()->post->create(
			[
				'post_type'      => 'attachment',
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Attachment Title',
			]
		);
		update_post_meta( $attachment_id, '_kadence_blocks_image_hash', sha1( $source_url ) );

		return [ $attachment_id, $source_url ];
	}

	private function attachment_count(): int {
		return count(
			get_posts(
				[
					'post_type'   => 'attachment',
					'post_status' => 'any',
					'numberposts' => -1,
					'fields'      => 'ids',
				]
			)
		);
	}

	public function testImportImageDeniedForUserWithoutUploadFiles() {
		[ $attachment_id, $source_url ] = $this->seed_local_image();

		$contributor = self::factory()->user->create( [ 'role' => 'contributor' ] );
		wp_set_current_user( $contributor );
		$this->assertFalse( current_user_can( 'upload_files' ), 'Pre-condition: contributors lack upload_files.' );

		$before = $this->attachment_count();
		$result = $this->library()->import_image( [ 'url' => $source_url, 'id' => 0 ] );

		// The capability guard returns the input untouched before any attachment
		// lookup or creation, so the seeded local image is NOT returned.
		$this->assertSame( 0, $result['id'] );
		$this->assertSame( $source_url, $result['url'] );
		$this->assertNotSame( $attachment_id, $result['id'] );
		$this->assertSame( $before, $this->attachment_count(), 'No attachment should be created.' );
	}

	public function testImportImageDeniedForSubscriber() {
		[ $attachment_id, $source_url ] = $this->seed_local_image();

		$subscriber = self::factory()->user->create( [ 'role' => 'subscriber' ] );
		wp_set_current_user( $subscriber );
		$this->assertFalse( current_user_can( 'upload_files' ), 'Pre-condition: subscribers lack upload_files.' );

		$before = $this->attachment_count();
		$result = $this->library()->import_image( [ 'url' => $source_url, 'id' => 0 ] );

		$this->assertSame( 0, $result['id'] );
		$this->assertSame( $source_url, $result['url'] );
		$this->assertNotSame( $attachment_id, $result['id'] );
		$this->assertSame( $before, $this->attachment_count(), 'No attachment should be created.' );
	}

	public function testImportImageAllowedForUserWithUploadFiles() {
		[ $attachment_id, $source_url ] = $this->seed_local_image();

		$administrator = self::factory()->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $administrator );
		$this->assertTrue( current_user_can( 'upload_files' ), 'Pre-condition: administrators have upload_files.' );

		// Passing the capability guard, import_image() reaches check_for_local_image()
		// and returns the existing local attachment (no remote download in the test).
		$result = $this->library()->import_image( [ 'url' => $source_url, 'id' => 0 ] );

		$this->assertEquals( $attachment_id, $result['id'] );
	}

	public function testRestImportImageDeniedForUserWithoutUploadFiles() {
		[ $attachment_id, $source_url ] = $this->seed_local_image();

		$contributor = self::factory()->user->create( [ 'role' => 'contributor' ] );
		wp_set_current_user( $contributor );

		$result = $this->rest_controller()->import_image( [ 'url' => $source_url, 'id' => 0 ] );

		$this->assertSame( 0, $result['id'] );
		$this->assertSame( $source_url, $result['url'] );
		$this->assertNotSame( $attachment_id, $result['id'] );
	}
}
