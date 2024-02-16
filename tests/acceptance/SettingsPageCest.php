<?php

class SettingsPageCest {

	private $telemetry_notice_heading = 'Help us make Kadence Blocks even better.';

	public function seeKadenceSettingsPage( AcceptanceTester $I ) {
		$I->loginAsAdmin();
		$I->amOnAdminPage( '/admin.php?page=kadence-blocks' );
		$I->seeResponseCodeIs( 200 );
		$I->see( 'Create rows with nested blocks either in columns or as a container' );
	}

	public function canSkipTelemetry( AcceptanceTester $I ) {
		$I->loginAsAdmin();
		$I->amOnAdminPage( '/admin.php?page=kadence-blocks' );
		$I->see( $this->telemetry_notice_heading );

		$I->seeLink( 'Skip' );
		$I->click( '.stellarwp-telemetry-btn-text--skip' );

		$I->dontSee($this->telemetry_notice_heading );
	}
	
}
