import { __ } from '@wordpress/i18n';
import { TextControl, Button, TextareaControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

const HeaderName = ({ data, onChange, componentData }) => {
	// Require a header name
	useEffect(() => {
		if (data.meta.isValid && (!data.headerName || data.headerName === '')) {
			onChange({ ...data, meta: { ...data.meta, isValid: false } });
		} else if (!data.meta.isValid && data.headerName && data.headerName !== '') {
			onChange({ ...data, meta: { ...data.meta, isValid: true } });
		}
	}, [data, componentData]);

	useEffect(() => {
		if (componentData?.postId && (!data.headerName || data.headerName === '')) {
			onChange({ headerName: __('Header') + ' ' + componentData.postId, meta: { ...data.meta, isValid: true } });
		}
	}, []);

	return (
		<div className={'body-name'}>
			<div className={'width-f'}>
				<div className={'image'}>
					<img
						alt={__('Headers you can build with Kadence Blocks', 'kadence-blocks')}
						src={kadence_blocks_params.kadenceBlocksUrl + '/includes/header/img/onboarding.png'}
					/>
				</div>
				<div className={'form-container'}>
					<h1>{__('Header Name', 'kadence-blocks')}</h1>
					<p>{__('Give your header a name and an optional description', 'kadence-blocks')}</p>
					<TextControl
						label={__('Header Name', 'kadence-blocks')}
						placeholder={__('My New Header', 'kadence-blocks')}
						value={data?.headerName}
						onChange={(value) => {
							onChange({ headerName: value });
						}}
						autoFocus={true}
					/>

					<TextareaControl
						label={__('Header Description', 'kadence-blocks')}
						placeholder={__('My New Header is', 'kadence-blocks')}
						value={data?.headerDescription}
						onChange={(headerDescription) => onChange({ headerDescription })}
					/>
				</div>
			</div>
		</div>
	);
};

export default HeaderName;
