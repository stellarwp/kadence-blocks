import { useInView } from 'react-intersection-observer';

const LazyLoad = ({ rootScroll, className, onContentVisible, children }) => {
	const options = {
		// root: rootScroll ? rootScroll : undefined,
		triggerOnce: true,
		rootMargin: '600px 0px',
		onChange: (inView) => {
			if (inView) {
				onContentVisible();
			}
		},
	};
	const { ref, inView } = useInView(options);
	return (
		<div ref={ref} className={`LazyLoad${inView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}>
			{inView ? [children] : null}
		</div>
	);
};

export default LazyLoad;
