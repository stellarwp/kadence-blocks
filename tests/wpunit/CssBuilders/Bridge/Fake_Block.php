<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Bridge;

/**
 * A block with helpers of every visibility, for testing how builders reach them.
 */
class Fake_Block {

	/**
	 * What the helpers were asked to do, in order.
	 *
	 * @var string[]
	 */
	public $log = [];

	/**
	 * A protected property.
	 *
	 * @var string[]
	 */
	protected $hidden_list = [ 'one', 'two' ];

	/**
	 * A public helper.
	 *
	 * @param string $value The value.
	 *
	 * @return string
	 */
	public function public_helper( string $value ): string {
		$this->log[] = 'public:' . $value;

		return 'public ' . $value;
	}

	/**
	 * A protected helper.
	 *
	 * @param string $first  The first value.
	 * @param string $second The second value.
	 *
	 * @return string
	 */
	protected function protected_helper( string $first, string $second ): string {
		$this->log[] = 'protected:' . $first . $second;

		return 'protected ' . $first . ' ' . $second;
	}

	/**
	 * A private helper.
	 *
	 * @return string
	 */
	private function private_helper(): string {
		$this->log[] = 'private';

		return 'private';
	}
}
