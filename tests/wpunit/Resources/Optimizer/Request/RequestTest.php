<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Request;

use KadenceWP\KadenceBlocks\Optimizer\Request\Request;
use stdClass;
use Tests\Support\Classes\OptimizerTestCase;

final class RequestTest extends OptimizerTestCase {

	private Request $request;

	protected function setUp(): void {
		parent::setUp();

		$this->request = $this->container->get( Request::class );
	}

	protected function tearDown(): void {
		// Clean up globals.
		unset( $_GET[ Request::QUERY_NOCACHE ], $_GET[ Request::QUERY_TOKEN ] );

		parent::tearDown();
	}

	public function testItReturnsTrueForValidOptimizerRequest(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '7a63dea3';
		$_GET[ Request::QUERY_TOKEN ]   = 'b945bb03f5';

		$this->assertTrue( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenNocacheParameterMissing(): void {
		$_GET[ Request::QUERY_TOKEN ] = 'b945bb03f5';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenTokenParameterMissing(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '7a63dea3';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenBothParametersMissing(): void {
		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithEmptyStringValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '';
		$_GET[ Request::QUERY_TOKEN ]   = '';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithZeroValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '0';
		$_GET[ Request::QUERY_TOKEN ]   = '0';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithSpecialCharacters(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '!@#$%^&*()';
		$_GET[ Request::QUERY_TOKEN ]   = 'token-with-special-chars!@#';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsTrueWithLongAlphanumericValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = str_repeat( 'a', 1000 );
		$_GET[ Request::QUERY_TOKEN ]   = str_repeat( 'b', 1000 );

		$this->assertTrue( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithShortNumericValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '123';
		$_GET[ Request::QUERY_TOKEN ]   = '456';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithWhitespaceValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '   ';
		$_GET[ Request::QUERY_TOKEN ]   = "\t\n";

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithUnicodeValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '🚀';
		$_GET[ Request::QUERY_TOKEN ]   = '🎯';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithUrlEncodedValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = urlencode( 'test value' );
		$_GET[ Request::QUERY_TOKEN ]   = urlencode( 'token with spaces' );

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testConstantsAreCorrectlyDefined(): void {
		$this->assertEquals( 'nocache', Request::QUERY_NOCACHE );
		$this->assertEquals( 'perf_token', Request::QUERY_TOKEN );
	}

	public function testItReturnsFalseWhenParametersAreNull(): void {
		$_GET[ Request::QUERY_NOCACHE ] = null;
		$_GET[ Request::QUERY_TOKEN ]   = null;

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenParametersAreFalse(): void {
		$_GET[ Request::QUERY_NOCACHE ] = false;
		$_GET[ Request::QUERY_TOKEN ]   = false;

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenParametersAreTrue(): void {
		$_GET[ Request::QUERY_NOCACHE ] = true;
		$_GET[ Request::QUERY_TOKEN ]   = true;

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenParametersAreArrays(): void {
		$_GET[ Request::QUERY_NOCACHE ] = [ 'value' ];
		$_GET[ Request::QUERY_TOKEN ]   = [ 'token' ];

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWhenParametersAreObjects(): void {
		$_GET[ Request::QUERY_NOCACHE ] = new stdClass();
		$_GET[ Request::QUERY_TOKEN ]   = new stdClass();

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsTrueWithMixedAlphanumericValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'abc123def';
		$_GET[ Request::QUERY_TOKEN ]   = '456ghi789';

		$this->assertTrue( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithHyphenatedValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'abc-123';
		$_GET[ Request::QUERY_TOKEN ]   = 'def-456';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithUnderscoreValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'abc_123';
		$_GET[ Request::QUERY_TOKEN ]   = 'def_456';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithDotValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'abc.123';
		$_GET[ Request::QUERY_TOKEN ]   = 'def.456';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsTrueWithOnlyLetters(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'abcdef';
		$_GET[ Request::QUERY_TOKEN ]   = 'GHIJKL';

		$this->assertTrue( $this->request->is_optimizer_request() );
	}

	public function testItReturnsTrueWithOnlyNumbers(): void {
		$_GET[ Request::QUERY_NOCACHE ] = '123456';
		$_GET[ Request::QUERY_TOKEN ]   = '789012';

		$this->assertTrue( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithShortValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'abc';
		$_GET[ Request::QUERY_TOKEN ]   = 'def';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsFalseWithSingleCharacterValues(): void {
		$_GET[ Request::QUERY_NOCACHE ] = 'a';
		$_GET[ Request::QUERY_TOKEN ]   = '1';

		$this->assertFalse( $this->request->is_optimizer_request() );
	}

	public function testItReturnsTrueWithExactlyMinimumLength(): void {
		$_GET[ Request::QUERY_NOCACHE ] = str_repeat( 'a', Request::MIN_LENGTH );
		$_GET[ Request::QUERY_TOKEN ]   = str_repeat( '1', Request::MIN_LENGTH );

		$this->assertTrue( $this->request->is_optimizer_request() );
	}
}
