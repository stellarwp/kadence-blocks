import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import * as MobileIcons from './icons/mobile';

const HeaderMobile = ({ data, onChange, handleFinish }) => {
	const [handleFinishTrigger, setHandleFinishTrigger] = useState(false);

	useEffect(() => {
		if (data?.meta?.isValid && (!data.headerMobile || data.headerMobile === '')) {
			onChange({ ...data, meta: { ...data.meta, isValid: false } });
		} else if (!data?.meta?.isValid && data.headerMobile && data.headerMobile !== '') {
			onChange({ ...data, meta: { ...data.meta, isValid: true } });
		}
	}, [data, onChange]);

	//we need a cycle for the headerMobile data to set up in the state
	//so lets wait for the trigger to set, then finish
	useEffect(() => {
		if (handleFinishTrigger) {
			handleFinish();
		}
	}, [handleFinishTrigger]);

	const basicOptions = {
		'mobile-1': {
			title: __('Mobile 1', 'kadence-blocks'),
			icon: <MobileIcons.Mobile1 />,
		},
		'mobile-2': {
			title: __('Mobile 2', 'kadence-blocks'),
			icon: <MobileIcons.Mobile2 />,
		},
		'mobile-3': {
			title: __('Mobile 3', 'kadence-blocks'),
			icon: <MobileIcons.Mobile3 />,
		},
		'mobile-4': {
			title: __('Mobile 4', 'kadence-blocks'),
			icon: <MobileIcons.Mobile4 />,
		},
	};

	return (
		<div className={'body'}>
			<div className="width-l">
				<h1>{__('Tablet / mobile Layout', 'kadence-blocks')}</h1>
				<p>{__('Choose a header layout for tablet / mobile.', 'kadence-blocks')}</p>

				<div className="type-selection">
					<Button className="basic" isPressed={true}>
						{__('Basic', 'kadence-blocks')}
					</Button>
				</div>

				<div className="options options-mobile">
					<div
						className={'option blank' + (data.headerMobile === 'blank' ? ' is-selected' : '')}
						onClick={() => {
							onChange({ headerMobile: 'blank' });
							handleFinish();
						}}
					>
						<Button>{__('Create blank tablet / mobile header.', 'kadence-blocks')}</Button>
					</div>

					{Object.keys(basicOptions).map((key) => (
						<div key={key} className={'option'}>
							<div
								className={'option-image' + (data.headerMobile === key ? ' is-selected' : '')}
								onClick={() => {
									onChange({ headerMobile: key });
									setHandleFinishTrigger(true);
								}}
							>
								{basicOptions[key].icon}
							</div>
							<span>{basicOptions[key].title}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HeaderMobile;
