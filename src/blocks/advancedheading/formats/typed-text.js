import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { toggleFormat, applyFormat, registerFormatType, useAnchorRef, useAnchor } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	Popover,
	ToggleControl,
	Button,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';
import TypedTextPopover from './typed-text-popover';

const icon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="800"
		height="800"
		version="1.1"
		viewBox="0 0 496.8 496.8"
		xmlSpace="preserve"
	>
		<path
			fill="#FFF"
			d="M480 385.2c0 12.8-10.4 23.2-23.2 23.2H31.2C18.4 408.4 8 398 8 385.2V103.6c0-12.8 10.4-23.2 23.2-23.2h426.4c12.8 0 23.2 10.4 23.2 23.2v281.6h-.8z"
		></path>
		<path
			fill="#000"
			d="M460.8 96.4c6.4 0 11.2 3.2 11.2 9.6v284.8c0 6.4-4.8 9.6-11.2 9.6H35.2c-6.4 0-11.2-3.2-11.2-9.6V106c0-6.4 4.8-9.6 11.2-9.6H464m-3.2-24H35.2C16 72.4 0 86.8 0 106v284.8c0 19.2 16 33.6 35.2 33.6h426.4c19.2 0 35.2-14.4 35.2-33.6V106c-.8-19.2-16.8-33.6-36-33.6z"
		></path>
		<path
			fill="#4C5654"
			d="M420 354c-6.4 0-12-5.6-12-12V154c0-6.4 5.6-12 12-12s12 5.6 12 12v188c0 7.2-5.6 12-12 12z"
		></path>
		<g fill="#000">
			<circle cx="184" cy="248.4" r="45.6"></circle>
			<circle cx="312" cy="248.4" r="45.6"></circle>
		</g>
	</svg>
);

const name = 'kadence/typed';
const allowedBlocks = ['kadence/advancedheading'];

export const kadenceTypedText = {
	title: __('Typed Text', 'kadence-blocks'),
	tagName: 'span',
	className: 'kt-typed-text',
	keywords: [__('typed', 'kadence-blocks'), __('typing', 'kadence-blocks')],
	attributes: {
		strings: 'data-strings',
		cursorChar: 'data-cursor-char',
		startDelay: 'data-start-delay',
		backDelay: 'data-back-delay',
		typeSpeed: 'data-type-speed',
		backSpeed: 'data-back-speed',
		smartBackspace: 'data-smart-backspace',
		loop: 'data-loop',
		loopCount: 'data-loop-count',
		shuffle: 'data-shuffle',
	},
	edit({ activeAttributes, isActive, value, onChange, contentRef }) {
		const selectedBlock = useSelect((select) => {
			return select('core/block-editor').getSelectedBlock();
		}, []);
		if (undefined === selectedBlock?.name) {
			return null;
		}
		if (selectedBlock && !allowedBlocks.includes(selectedBlock.name)) {
			return null;
		}
		const [isEditingTyped, setIsEditingTyped] = useState(false);
		const onToggle = () => onChange(toggleFormat(value, { type: name }));
		const disableIsEditingTyped = useCallback(() => setIsEditingTyped(false), [setIsEditingTyped]);
		const defaultAttributes = {
			strings: JSON.stringify(['']),
			cursorChar: '_',
			startDelay: 0,
			backDelay: 700,
			typeSpeed: 40,
			backSpeed: 30,
			smartBackspace: 'false',
			loop: 'true',
			loopCount: 'false',
			shuffle: 'false',
		};

		const getCurrentSettings = () => {
			const response = { ...defaultAttributes, ...activeAttributes };

			try {
				response.strings = JSON.parse(response.strings);
			} catch (e) {
				console.log('Error parsing strings', e);
			}

			return response;
		};

		const updateFormat = (newValue) => {
			const newAttributes = {
				...activeAttributes,
				...newValue,
			};

			if (typeof newAttributes.strings === 'object') {
				try {
					newAttributes.strings = JSON.stringify(newAttributes.strings);
				} catch (e) {
					console.log('Error encoding strings', e);
				}
			}

			onChange(
				applyFormat(value, {
					type: name,
					attributes: newAttributes,
				})
			);
		};

		const settings = getCurrentSettings();

		useEffect(() => {
			if (isActive) {
				setIsEditingTyped(true);
			} else {
				setIsEditingTyped(false);
			}
		}, [isActive]);
		return (
			<>
				<RichTextToolbarButton
					icon={icon}
					title={__('Typed Text', 'kadence-blocks')}
					onClick={onToggle}
					isActive={isActive}
					className={`toolbar-button-with-text toolbar-button__${name}`}
				/>

				{isActive && isEditingTyped && (
					<TypedTextPopover
						name={name}
						onClose={disableIsEditingTyped}
						activeAttributes={activeAttributes}
						value={value}
						updateFormat={updateFormat}
						contentRef={contentRef}
					/>
				)}
			</>
		);
	},
};

registerFormatType(name, kadenceTypedText);
