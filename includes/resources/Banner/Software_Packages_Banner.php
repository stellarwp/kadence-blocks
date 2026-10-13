<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Banner;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Nexcess\Banners\Banner;
use KadenceWP\KadenceBlocks\Nexcess\Banners\BannerFields;
use KadenceWP\KadenceBlocks\Nexcess\Banners\Registry;

/**
 * The Nexcess software packages banner.
 *
 * @since TBD
 */
final class Software_Packages_Banner {

	/**
	 * Shared by every Nexcess plugin that shows this banner, so dismissing it in one dismisses it in all.
	 */
	public const ID = 'nexcess-software-packages-2026-10-14';

	/**
	 * When the banner starts showing, in New York time.
	 */
	private const START = '2026-10-14 12:00:00';

	/**
	 * Who sees the banner, and where.
	 *
	 * @var Audience
	 */
	private Audience $audience;

	/**
	 * @param Audience $audience Who sees the banner, and where.
	 */
	public function __construct( Audience $audience ) {
		$this->audience = $audience;
	}

	/**
	 * Registers the banner.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register(): void {
		$fields          = new BannerFields();
		$fields->heading = __( 'Changes are coming to your plan at your next renewal.', 'kadence-blocks' );
		$fields->body    = __( 'Watch your inbox for details.', 'kadence-blocks' );

		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- Named by the stellarwp/banners library.
		$fields->ctaLabel     = __( 'Learn more', 'kadence-blocks' );
		$fields->ctaUrl       = 'https://explore.nexcess.com/software-packages';
		$fields->dismissLabel = __( 'Dismiss this banner', 'kadence-blocks' );
		// phpcs:enable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		$package_url = KADENCE_BLOCKS_URL . 'vendor/vendor-prefixed/stellarwp/banners/';
		$start       = new DateTimeImmutable( self::START, new DateTimeZone( 'America/New_York' ) );

		( new Registry() )->register( new Banner( self::ID, '1.0.0', $fields, $package_url, $start, null ) );
	}

	/**
	 * Renders the banner, when the audience allows it.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function render(): void {
		$registry = new Registry();

		if ( ! $registry->has( self::ID ) ) {
			return;
		}

		$registry->get( self::ID )->render( [ $this->audience, 'should_display' ] );
	}
}
