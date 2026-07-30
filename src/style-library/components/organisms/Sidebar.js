/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { NavItem } from '../atoms/NavItem';
import { NavSectionLabel } from '../atoms/NavSectionLabel';
import './sidebar.scss';

/**
 * Style Library sidebar with overview and foundation groups.
 *
 * @param {object}   props            Component props.
 * @param {string}   props.section    Active section id.
 * @param {object[]} props.sections   Built navigation sections.
 * @param {Function} props.onNavigate Section change handler.
 * @return {JSX.Element} Sidebar navigation.
 */
export function Sidebar({ section, sections, onNavigate }) {
	const primary = sections.filter((item) => item.kind === 'overview' || item.kind === 'palettes');
	const foundations = sections.filter((item) => item.kind === 'foundation');

	return (
		<aside className="kadence-blocks-style-library__sidebar">
			{primary.length > 0 && (
				<div className="kadence-blocks-style-library__nav-section">
					<NavSectionLabel>{__('Style Library', 'kadence-blocks')}</NavSectionLabel>
					<ul className="kadence-blocks-style-library__nav-list">
						{primary.map((item) => (
							<NavItem key={item.id} active={section === item.id} onClick={() => onNavigate(item.id)}>
								{item.label}
							</NavItem>
						))}
					</ul>
				</div>
			)}

			{foundations.length > 0 && (
				<div className="kadence-blocks-style-library__nav-section">
					<NavSectionLabel>{__('Foundations', 'kadence-blocks')}</NavSectionLabel>
					<ul className="kadence-blocks-style-library__nav-list">
						{foundations.map((item) => (
							<NavItem
								key={item.id}
								active={section === item.id}
								count={item.count}
								onClick={() => onNavigate(item.id)}
							>
								{item.label}
							</NavItem>
						))}
					</ul>
				</div>
			)}
		</aside>
	);
}
