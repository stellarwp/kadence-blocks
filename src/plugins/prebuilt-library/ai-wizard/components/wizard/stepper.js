/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { StepperIcon } from './stepper-icon';

export default function Stepper(props) {
	const {
		pages = [],
		currentPage,
		numberOfPages,
		setCurrentPage,
	} = props;

	return (
		<ul
			className="components-guide__page-control"
			aria-label={ __( 'Guide controls' ) }
		>
			{ pages.map((page, index) => (
				<li
					key={ index }
					// Set aria-current="step" on the active page, see https://www.w3.org/TR/wai-aria-1.1/#aria-current
					aria-current={ index === currentPage ? 'step' : undefined }
				>
					<Button
						key={ index }
						icon={
							<StepperIcon
								pageIndex={ index }
								isComplete={ false }
							/>
						}
						aria-label={ sprintf(
							/* translators: 1: current page number 2: total number of pages */
							__( 'Page %1$d of %2$d' ),
							index + 1,
							numberOfPages
						) }
						text={ page.step }
						onClick={ () => setCurrentPage( index ) }
					/>
				</li>
			) ) }
		</ul>
	);
}
