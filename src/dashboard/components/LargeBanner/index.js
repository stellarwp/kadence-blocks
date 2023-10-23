/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { Button } from '../../../plugins/prebuilt-library/ai-wizard/components';

export default function LargeBanner({ heading, subHeading, imageSrc, buttonText, buttonLink }) {

	return (
		<div className="kb-large-banner">
			<div className="kb-large-banner_content">
				<div className="kb-large-banner_content-inner">
					<h1>Kadence is better with AI.</h1>
					<h2>A helpful and compelling description of this cta here. Customize your Kadence AI experience.</h2>
				</div>
				<Button>

				</Button>
			</div>
			<div className="kb-large-banner_media">
				<img src="https://images.unsplash.com/photo-1697458170430-9136835c3f15?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1645" />
			</div>
		</div>
	);
}
