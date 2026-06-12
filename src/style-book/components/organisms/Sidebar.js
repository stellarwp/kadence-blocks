/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { NavItem } from '../atoms/NavItem';
import { NavSectionLabel } from '../atoms/NavSectionLabel';

/**
 * Style Book sidebar with overview and foundation groups.
 *
 * @param {object}   props            Component props.
 * @param {string}   props.section    Active section id.
 * @param {object[]} props.sections   Built navigation sections.
 * @param {Function} props.onNavigate Section change handler.
 * @return {JSX.Element} Sidebar navigation.
 */
export function Sidebar({ section, sections, onNavigate }) {
	const overview = sections.filter((item) => item.kind === 'overview');
	const foundations = sections.filter((item) => item.kind === 'foundation');

	return (
		<aside className="kadence-style-book__sidebar">
			{overview.length > 0 && (
				<div className="kadence-style-book__nav-section">
					<NavSectionLabel>{__('Style Book', 'kadence-blocks')}</NavSectionLabel>
					<ul className="kadence-style-book__nav-list">
						{overview.map((item) => (
							<NavItem key={item.id} active={section === item.id} onClick={() => onNavigate(item.id)}>
								{item.label}
							</NavItem>
						))}
					</ul>
				</div>
			)}

			{foundations.length > 0 && (
				<div className="kadence-style-book__nav-section">
					<NavSectionLabel>{__('Foundations', 'kadence-blocks')}</NavSectionLabel>
					<ul className="kadence-style-book__nav-list">
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
