/**
 * Sidebar navigation item atom.
 *
 * @param {object}      props           Component props.
 * @param {boolean}     props.active    Whether this item is selected.
 * @param {boolean}     [props.disabled] Whether the item is disabled.
 * @param {Function}    [props.onClick] Click handler.
 * @param {number}      [props.count]   Optional badge count.
 * @param {import('react').ReactNode} props.children Label content.
 * @return {JSX.Element} Nav item button.
 */
export function NavItem({ active, disabled = false, onClick, count, children }) {
	return (
		<li className="kadence-style-book__nav-item">
			<button
				type="button"
				className={['kadence-style-book__nav-button', active ? 'is-active' : '', disabled ? 'is-disabled' : '']
					.filter(Boolean)
					.join(' ')}
				onClick={disabled ? undefined : onClick}
				disabled={disabled}
			>
				<span className="kadence-style-book__nav-button-label">{children}</span>
				{typeof count === 'number' ? (
					<span className="kadence-style-book__nav-button-count">{count}</span>
				) : null}
			</button>
		</li>
	);
}
