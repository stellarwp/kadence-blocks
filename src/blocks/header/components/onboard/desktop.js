import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import * as DesktopIcons from './icons/desktop';

const HeaderDesktop = ({ data, onChange, handleNextStep }) => {
	const [activeTab, setActiveTab] = useState('basic');

	useEffect(() => {
		if (data.meta.isValid && (!data.headerDesktop || data.headerDesktop === '')) {
			onChange({ ...data, meta: { ...data.meta, isValid: false } });
		} else if (!data.meta.isValid && data.headerDesktop && data.headerDesktop !== '') {
			onChange({ ...data, meta: { ...data.meta, isValid: true } });
		}
	}, [data, onChange]);

	const basicOptions = {
		'basic-1': {
			title: __('Basic 1', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr1 />,
		},
		'basic-2': {
			title: __('Basic 2', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr2 />,
		},
		'basic-3': {
			title: __('Basic 3', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr3 />,
		},
		'basic-4': {
			title: __('Basic 4', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr4 />,
		},
		'basic-5': {
			title: __('Basic 5', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr5 />,
		},
		'basic-6': {
			title: __('Basic 6', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr6 />,
		},
		'basic-7': {
			title: __('Basic 7', 'kadence-blocks'),
			icon: <DesktopIcons.BasicHdr7 />,
		},
	};

	const muiltiRowOptions = {
		'multi-row-1': {
			title: __('Multi Row 1', 'kadence-blocks'),
			icon: <DesktopIcons.MultiHeader1 />,
		},
		'multi-row-2': {
			title: __('Multi Row 2', 'kadence-blocks'),
			icon: <DesktopIcons.MultiHeader2 />,
		},
		'multi-row-3': {
			title: __('Multi Row 3', 'kadence-blocks'),
			icon: <DesktopIcons.MultiHeader3 />,
		},
		'multi-row-4': {
			title: __('Multi Row 4', 'kadence-blocks'),
			icon: <DesktopIcons.MultiHeader4 />,
		},
		'multi-row-5': {
			title: __('Multi Row 5', 'kadence-blocks'),
			icon: <DesktopIcons.MultiHeader5 />,
		},
	};

	return (
		<div className={'body'}>
			<div className="width-l">
				<h1>{__('Desktop Layout', 'kadence-blocks')}</h1>
				<p>{__('Choose a header layout for desktop.', 'kadence-blocks')}</p>

				<div className="type-selection">
					<Button className="basic" onClick={() => setActiveTab('basic')} isPressed={activeTab === 'basic'}>
						{__('Basic', 'kadence-blocks')}
					</Button>
					<Button
						className="multi-row"
						onClick={() => setActiveTab('multi-row')}
						isPressed={activeTab === 'multi-row'}
					>
						{__('Multi Row', 'kadence-blocks')}
					</Button>
				</div>

				<div className="options">
					<div
						className={'option blank' + (data.headerDesktop === 'blank' ? ' is-selected' : '')}
						onClick={() => {
							onChange({ headerDesktop: 'blank' });
							handleNextStep();
						}}
					>
						<Button>{__('Create blank desktop header.', 'kadence-blocks')}</Button>
					</div>

					{activeTab === 'basic' &&
						Object.keys(basicOptions).map((key) => (
							<div key={key} className={'option'}>
								<div
									className={'option-image' + (data.headerDesktop === key ? ' is-selected' : '')}
									onClick={() => {
										onChange({ headerDesktop: key });
										handleNextStep();
									}}
								>
									{basicOptions[key].icon}
								</div>
								<span>{basicOptions[key].title}</span>
							</div>
						))}

					{activeTab === 'multi-row' &&
						Object.keys(muiltiRowOptions).map((key) => (
							<div key={key} className={'option'}>
								<div
									className={'option-image' + (data.headerDesktop === key ? ' is-selected' : '')}
									onClick={() => {
										onChange({ headerDesktop: key });
										handleNextStep();
									}}
								>
									{muiltiRowOptions[key].icon}
								</div>
								<span>{muiltiRowOptions[key].title}</span>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default HeaderDesktop;
