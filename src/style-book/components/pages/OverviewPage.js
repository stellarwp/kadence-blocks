/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { sampleColorValues } from '../../helpers/colors';
import { filterTokensByGroup } from '../../helpers/navigation';

/**
 * Overview card linking into a sidebar section.
 *
 * @param {object}   props            Component props.
 * @param {string}   props.title       Card title.
 * @param {string}   [props.subtitle]  Optional subtitle.
 * @param {Function} props.onClick     Navigate handler.
 * @param {import('react').ReactNode} props.children Preview content.
 * @return {JSX.Element} Overview card.
 */
function OverviewCard({ title, subtitle, onClick, children }) {
	return (
		<button type="button" className="kadence-style-book__overview-card" onClick={onClick}>
			<div className="kadence-style-book__overview-card-head">
				<strong>{title}</strong>
				{subtitle ? <span>{subtitle}</span> : null}
			</div>
			<div className="kadence-style-book__overview-card-body">{children}</div>
		</button>
	);
}

/**
 * Style Book overview with at-a-glance previews per foundation group.
 *
 * @param {object}   props            Component props.
 * @param {object[]} props.sections   Navigation sections (excluding overview).
 * @param {object[]} props.tokens     Flat token list.
 * @param {Record<string, string>} props.values Resolved values.
 * @param {Function} props.onNavigate Section change handler.
 * @return {JSX.Element} Overview page.
 */
export function OverviewPage({ sections, tokens, values, onNavigate }) {
	const foundationSections = sections.filter((section) => section.kind === 'foundation');

	return (
		<div className="kadence-style-book__overview">
			<header className="kadence-style-book__page-header">
				<h2>{__('Overview', 'kadence-blocks')}</h2>
				<p>
					{__(
						'A snapshot of your design tokens. Choose a section in the sidebar or click a card to edit.',
						'kadence-blocks'
					)}
				</p>
			</header>

			<div className="kadence-style-book__overview-grid">
				{foundationSections.map((section) => {
					const groupTokens = filterTokensByGroup(tokens, section.groupName);
					const colorSamples = section.showColorPreview
						? sampleColorValues(groupTokens, values)
						: [];

					return (
						<OverviewCard
							key={section.id}
							title={section.label}
							subtitle={
								section.count === 1
									? __('1 token', 'kadence-blocks')
									: `${section.count} ${__('tokens', 'kadence-blocks')}`
							}
							onClick={() => onNavigate(section.id)}
						>
							{section.showColorPreview ? (
								<div className="kadence-style-book__overview-swatches">
									{colorSamples.map((color) => (
										<span
											key={color}
											className="kadence-style-book__overview-swatch"
											style={{ backgroundColor: color }}
										/>
									))}
								</div>
							) : (
								<p className="kadence-style-book__overview-hint">{section.description}</p>
							)}
						</OverviewCard>
					);
				})}
			</div>
		</div>
	);
}
