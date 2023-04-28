/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { focus } from '@wordpress/dom';

import { Button } from '../button';
import { StepperIcon } from './stepper-icon';

export function Wizard({
	className,
	contentLabel,
	logo,
	finishButtonText = __( 'Finish' ),
	backButtonText = __( 'Back' ),
	forwardButtonText = __( 'Next' ),
	finishButtonDisabled = false,
	backButtonDisabled = false,
	forwardButtonDisabled = false,
	onPageChange = () => {},
	onFinish,
	pages = []
}) {
	const guideContainer = useRef(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [completed, setCompleted] = useState(new Set());

	useEffect( () => {
		// Communicate current page index.
		onPageChange && onPageChange(currentPage);

		// Each time we change the current page, start from the first element of the page.
		// This also solves any focus loss that can happen.
		if ( guideContainer.current ) {
			(
				focus.tabbable.find( guideContainer.current )
			)[ 0 ]?.focus();
		}
	}, [ currentPage ] );

	const pageId = pages && pages?.[currentPage]?.id ? pages[currentPage].id : `page-${ currentPage }`;

	const canGoBack = currentPage > 0;
	const canGoForward = currentPage < pages.length - 1;

	const isStepCompleted = (step) => {
		return completed.has(step);
	}

	const isStepDisabled = (step) => {
		return step > completed.size ? true : null;
	}

	const goBack = () => {
		if (canGoBack) {
			setCurrentPage( currentPage - 1 );
		}
	};

	const goForward = () => {
		if (! canGoForward) {
			return;
		}

		setCurrentPage( currentPage + 1 );
		setCompleted((prevCompleted) => {
			const newCompleted = new Set(prevCompleted.values());
			newCompleted.add(currentPage);

			return newCompleted;
		});
	};

	if ( pages.length === 0 ) {
		return null;
	}

	return (
		<Modal
			title={ logo }
			className={ classnames( 'components-guide', 'stellarwp', className, pageId ) }
			contentLabel={ contentLabel }
			onRequestClose={ onFinish }
			ref={ guideContainer }
		>
			<div className="components-guide__container">
				<div className="components-guide__page">
					{ pages[ currentPage ].image }
					{ pages[ currentPage ].content }
				</div>

				<div className="components-guide__footer">
					{ canGoBack && (
						<Button
							className="components-wizard__back-button"
							disabled={ backButtonDisabled }
							onClick={ goBack }
						>
							{ backButtonText }
						</Button>
					) }
					{ pages.length > 1 && (
						<ul
							className="components-guide__page-control"
							aria-label={ __( 'Guide controls' ) }
						>
							{ pages.map( ( page, index ) => (
								<li
									key={ index }
									// Set aria-current="step" on the active page, see https://www.w3.org/TR/wai-aria-1.1/#aria-current
									aria-current={ index === currentPage ? 'step' : undefined }
								>
									<Button
										key={ index }
										className={ 'wizard-step' }
										disabled={ isStepDisabled(index) }
										// disabled={ isStepCompleted(index) ? null : true }
										icon={
											<StepperIcon
												pageNumber={ index + 1 }
												isComplete={ isStepCompleted(index) }
												isSelected={ index === currentPage }
											/>
										}
										aria-label={ sprintf(
											/* translators: 1: current page number 2: total number of pages */
											__( 'Page %1$d of %2$d' ),
											index + 1,
											pages.length
										) }
										text={ page.step }
										onClick={ () => setCurrentPage( index ) }
									/>
								</li>
							) ) }
						</ul>
					) }
					{ canGoForward && (
						<Button
							variant="primary"
							className={ 'components-wizard__forward-button' }
							disabled={ forwardButtonDisabled }
							onClick={ goForward }
						>
							{ forwardButtonText }
						</Button>
					) }
					{ ! canGoForward && (
						<Button
						 	variant="primary"
							className={ 'components-wizard__finish-button' }
							disabled={ finishButtonDisabled }
							onClick={ onFinish }
						>
							{ finishButtonText }
						</Button>
					) }
				</div>
			</div>
		</Modal>
	);
}

