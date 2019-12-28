const {
	Component,
} = wp.element;

class SvgPattern extends Component {
	render() {
		const {
			uniqueID = 'a',
			color = '#eeeeee',
			rotate = 40,
			strokeWidth = 9,
			strokeGap = 9,
			opacity = 1,
		} = this.props;
		const gap = ( strokeWidth / 2 ) + strokeGap;
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="kb-pattern-svg-divider kb-stripes-svg">
				<defs>
					<pattern
						id={ 'pat' + uniqueID }
						width={ gap }
						height={ gap }
						patternTransform={ 'rotate(' + rotate + ')' }
						patternUnits="userSpaceOnUse"
					>
						<line x1="0" y="0" x2="0" y2={ gap } stroke={ color } stroke-width={ strokeWidth } />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={ 'url(' + '#pat' + uniqueID + ')' } opacity={ opacity / 100 } ></rect>
			</svg>
		);
	}
}

export default SvgPattern;
