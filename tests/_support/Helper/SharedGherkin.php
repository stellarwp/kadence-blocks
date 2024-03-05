<?php

namespace Helper;

trait SharedGherkin {

	private function cli(): \Codeception\Module\WPCLI {
		return $this->getModule( 'WPCLI' );
	}
}
