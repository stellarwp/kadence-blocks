/**
 * Sidebar section label atom.
 *
 * @param {{ children: string }} props Component props.
 * @return {JSX.Element} Section label.
 */
export function NavSectionLabel({ children }) {
	return <div className="kadence-style-book__nav-section-label">{children}</div>;
}
