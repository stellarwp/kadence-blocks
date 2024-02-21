<?php

class AdvancedFormCest {

	public function canViewAdvancedFormCpt( AcceptanceTester $I ) {
		$I->loginAsAdmin();
		$I->amOnAdminPage( '/edit.php?post_type=kadence_form' );
		$I->seeResponseCodeIs( 200 );
		$I->dontSee( 'Invalid post type' );
	}

}
