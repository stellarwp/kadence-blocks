const { Component } = wp.element;
const { Button, TextControl, Popover } = wp.components;
import { createRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { search } from '@wordpress/icons';

/**
 * Build Link Toolbar
 */
class TagSearch extends Component {
	constructor() {
		super(...arguments);

		this.toggle = this.toggle.bind(this);
		this.state = {
			open: false,
		};
		this.popRef = createRef();
	}
	toggle() {
		this.setState({ open: !this.state.open });
	}
	render() {
		const { open } = this.state;
		return (
			<>
				{open && (
					<Popover
						className="kb-dynamic-popover"
						position="bottom center"
						onClick={() => {}}
						expandOnMobile={true}
						onClose={this.toggle}
						ref={this.popRef}
					>
						<div className="kb-dynamic-popover-inner-wrap">
							<div className="kb-tag-search-inner-wrap">
								<TextControl
									label={__('Search for Tag', 'kadence-blocks-pro')}
									value={this.props.value}
									onChange={(value) => {
										this.props.onChange(value);
									}}
								/>
								<Button
									className="kb-tag-action-search"
									isPrimary
									icon={search}
									onClick={() => {
										this.props.onAction();
										this.toggle;
									}}
									label={__('Search', 'kadence-blocks-pro')}
									showTooltip={true}
								/>
							</div>
						</div>
					</Popover>
				)}
				<Button
					className="kb-tag-search"
					icon={search}
					onClick={this.toggle}
					isPressed={this.props.value ? true : false}
					aria-haspopup="true"
					aria-expanded={open}
					label={__('Search', 'kadence-blocks-pro')}
					showTooltip={true}
				/>
			</>
		);
	}
}
export default TagSearch;
