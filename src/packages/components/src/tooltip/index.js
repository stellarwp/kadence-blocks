import { useState } from '@wordpress/element';
import {
useFloating,
autoUpdate,
offset,
flip,
shift,
useHover,
useFocus,
useDismiss,
useRole,
useInteractions,
FloatingPortal
} from "@floating-ui/react";

import './editor.scss';


export default function Tooltip({
	children,
	text,
	className,
	TagName = "span",
	placement = "top"
}) {
	if ( ! text ) {
		return (
			<TagName className={`tooltip-ref-wrap${className ? ' ' + className : ''}`}>
				{children}
			</TagName>
		);
	}
	const [isOpen, setIsOpen] = useState(false);
	let tooltipPlacement = placement;
	switch (placement) {
		case 'auto':
			tooltipPlacement = 'top';
			break;
		case 'auto-start':
			tooltipPlacement = 'top-start';
			break;
		case 'auto-end':
			tooltipPlacement = 'top-end';
			break;
	}
	const { refs, floatingStyles, context } = useFloating({
	open: isOpen,
	onOpenChange: setIsOpen,
	placement: tooltipPlacement,
	// Make sure the tooltip stays on the screen
	whileElementsMounted: autoUpdate,
	middleware: [
		offset(5),
		flip({
		fallbackAxisSideDirection: "start"
		}),
		shift()
	]
	});

	// Event listeners to change the open state
	const hover = useHover(context, { move: false });
	const focus = useFocus(context);
	const dismiss = useDismiss(context);
	// Role props for screen readers
	const role = useRole(context, { role: "tooltip" });
	const strip_tags = (input, allowed) => {
		allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
		const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
			return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
	};

	// Merge all the interactions into prop getters
	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role
	]);
	return (
		<>
			<TagName className={`tooltip-ref-wrap tooltip-ref-has-tip${className ? ' ' + className : ''}`} ref={refs.setReference} {...getReferenceProps()}>
				{children}
			</TagName>
			<FloatingPortal>
				{isOpen && (
					<div
						className="kb-floating-tooltip"
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
						data-placement={tooltipPlacement}
					>
						<span className="kb-tooltip-content" dangerouslySetInnerHTML={{ __html: strip_tags( text, '<br><b><i><u><p><ol><ul><li><strong><small>' ) }} />
						<span className="kb-tooltip-arrow" />
					</div>
				)}
			</FloatingPortal>
		</>
	);
}