import { Button } from '@wordpress/components';

const DesktopRow = ({ position }) => {
	return (
		<div className={'visual-row-wrapper'}>
			<Button
				icon="admin-generic"
				onClick={() => {
					console.log('Clicked settings for desktop ' + position + ' row');
				}}
			/>
			<div className={'visual-desktop-row visual-desktop-row-' + position}>
				<div className={'visual-section-wrapper visual-section-wrapper-left'}>Left</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center-left'}>Center Left</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center'}>Center</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center-center-right'}>Center Right</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center-right'}>Right</div>
			</div>
		</div>
	);
};

export default function Desktop({}) {
	return (
		<div className={'visual-desktop-container'}>
			<DesktopRow position={'top'} />
			<DesktopRow position={'middle'} />
			<DesktopRow position={'bottom'} />
		</div>
	);
}
