<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Bridge;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Builders;
use RuntimeException;
use Tests\Support\Classes\TestCase;

/**
 * The factory finds the builder file of a block, loads it and runs the builder with a context for the block.
 */
final class BuildersTest extends TestCase {

	/**
	 * A directory with a builder file, in the temporary directory.
	 *
	 * @var string
	 */
	private $directory;

	protected function setUp(): void {
		parent::setUp();

		$this->directory = sys_get_temp_dir() . '/kb-builders-' . uniqid( '', true ) . '/';

		wp_mkdir_p( $this->directory );
	}

	protected function tearDown(): void {
		array_map( 'unlink', glob( $this->directory . '*.php' ) );
		rmdir( $this->directory ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.directory_rmdir -- Test cleanup of its own temp directory.

		parent::tearDown();
	}

	/**
	 * The builder file is found in a registered directory, and the builder gets the block name and the block helpers.
	 *
	 * @return void
	 */
	public function testBuildsWithTheBuilderOfARegisteredDirectory(): void {
		$class = $this->write_builder();

		Kadence_Blocks_Css_Builders::add_directory( $this->directory );

		$block  = new Fake_Block();
		$result = Kadence_Blocks_Css_Builders::build( $class, $block, 'fake', [ 'a' => 1 ], new Kadence_Blocks_CSS(), 'abc', 'def' );

		$this->assertSame( 'fake|public from builder|1|abc|def', $result );
		$this->assertSame( [ 'public:from builder' ], $block->log );
	}

	/**
	 * A directory is only registered once, and the directory of Kadence Blocks is always searched first.
	 *
	 * @return void
	 */
	public function testDirectories(): void {
		Kadence_Blocks_Css_Builders::add_directory( $this->directory );
		Kadence_Blocks_Css_Builders::add_directory( rtrim( $this->directory, '/' ) );

		$directories = Kadence_Blocks_Css_Builders::directories();

		$this->assertSame( KADENCE_BLOCKS_PATH . 'includes/css-builders/', $directories[0] );
		$this->assertSame( 1, count( array_keys( $directories, $this->directory, true ) ) );
	}

	/**
	 * A builder class that is already loaded is not loaded again, so its file does not have to be on disk.
	 *
	 * @return void
	 */
	public function testALoadedBuilderNeedsNoFile(): void {
		$builder = Kadence_Blocks_Css_Builders::create( 'Kadence_Blocks_Spacer_Css', new Fake_Block(), 'spacer' );

		$this->assertInstanceOf( 'Kadence_Blocks_Spacer_Css', $builder );
	}

	/**
	 * A builder nobody registered fails with a message that names the file it looked for.
	 *
	 * @return void
	 */
	public function testMissingBuilderThrows(): void {
		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'No CSS builder file class-kadence-blocks-nothing-here-css.php in the registered directories.' );

		Kadence_Blocks_Css_Builders::create( 'Kadence_Blocks_Nothing_Here_Css', new Fake_Block(), 'nothing' );
	}

	/**
	 * Write a builder file that reports what it was given, and return the class name.
	 *
	 * @return string
	 */
	private function write_builder(): string {
		$class = 'Kadence_Blocks_Test_' . str_replace( '.', '_', uniqid( '', true ) ) . '_Css';
		$file  = $this->directory . 'class-' . strtolower( str_replace( '_', '-', $class ) ) . '.php';
		$code  = <<<'PHP'
<?php
final class %s {
	private $context;
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		return $this->context->block_name() . '|' . $this->context->call( 'public_helper', 'from builder' ) . '|' . $attributes['a'] . '|' . $unique_id . '|' . $unique_style_id;
	}
}
PHP;

		file_put_contents( $file, sprintf( $code, $class ) );

		return $class;
	}
}
