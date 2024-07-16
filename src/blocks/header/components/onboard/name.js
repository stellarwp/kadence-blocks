import { __ } from '@wordpress/i18n';
import { TextControl, Button, TextareaControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

const HeaderName = ({ data, onChange }) => {
	// Require a header name
	useEffect(() => {
		if (data.meta.isValid && (!data.headerName || data.headerName === '')) {
			onChange({ ...data, meta: { ...data.meta, isValid: false } });
		} else if (!data.meta.isValid && data.headerName && data.headerName !== '') {
			onChange({ ...data, meta: { ...data.meta, isValid: true } });
		}
	}, [data]);

	return (
		<div className={'width-m'}>
			<h1>{__('Header Name', 'kadence-blocks')}</h1>
			<p>{__('Give your header a name and a description', 'kadence-blocks')}</p>
			<TextControl
				label={__('Header Name', 'kadence-blocks')}
				placeholder={__('My New Header', 'kadence-blocks')}
				value={data?.headerName}
				onChange={(headerName) => onChange({ headerName })}
				autoFocus={true}
			/>

			<TextareaControl
				label={__('Header Description', 'kadence-blocks')}
				placeholder={__('My New Header is', 'kadence-blocks')}
				value={data?.headerDescription}
				onChange={(headerDescription) => onChange({ headerDescription })}
			/>
		</div>
	);
};

export default HeaderName;
