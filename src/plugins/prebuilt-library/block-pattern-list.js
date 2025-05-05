/**
 * Handle Section Library.
 */
/**
 * External dependencies
 */
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroller';
/**
 * WordPress dependencies
 */
import { parse } from '@wordpress/blocks';
import {
	Button,
	TextControl,
	SelectControl,
	VisuallyHidden,
	Spinner,
	ExternalLink,
	Tooltip,
	__unstableUseCompositeState as useCompositeState,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { BlockPreview } from './block-preview';
import { PatternPreview } from './pattern-preview';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce, useAsyncList, useInstanceId } from '@wordpress/compose';
import { store as blockEditorStore } from '@wordpress/block-editor';
import replaceMasks from './replace/replace-masks';
import { debounce } from 'lodash';
import { useCompatibilityStyles } from './iframe/use-compatibility-styles';
function useParsedAssets(html) {
	return useMemo(() => {
		const doc = document.implementation.createHTMLDocument('');
		doc.body.innerHTML = html;
		return Array.from(doc.body.children);
	}, [html]);
}

const WithToolTip = ({ showTooltip, title, children }) => {
	if (showTooltip) {
		return <Tooltip text={title}>{children}</Tooltip>;
	}
	return <>{children}</>;
};
const roundAccurately = (number, decimalPlaces) =>
	Number(Math.round(Number(number + 'e' + decimalPlaces)) + 'e' + decimalPlaces * -1);
function KadenceBlockPattern({
	pattern,
	patternHTML,
	onClick,
	showTooltip,
	customStyles,
	previewMode,
	selectedStyle,
	editorStyles,
	shadowStyles,
	// baseCompatStyles,
	// neededCompatStyles,
	shadowCompatStyles,
	patternType,
	rootScroll,
	key,
}) {
	const { content, viewportWidth, pro, locked, proRender, image, imageHeight, imageWidth, html } = pattern;
	let htmlContent = html;
	if (!html && patternHTML) {
		htmlContent = replaceMasks(patternHTML);
	} else if (!html) {
		htmlContent = ' ';
	}
	//const instanceId = useInstanceId(KadenceBlockPattern);
	const descriptionId = `block-editor-block-patterns-list__item-description-${key}`;
	function getFooter() {
		if ('page' === patternType) {
			return (
				<div className="block-editor-block-patterns-list__item-title kb-pattern-type-page">
					<div className="kb-pattern-footer-top">
						<span className="kb-pattern-title" dangerouslySetInnerHTML={{ __html: pattern.title }}></span>
						{pattern?.pageStyles &&
							pattern.pageStyles.length &&
							Object.values(pattern.pageStyles).map((style) => (
								<span className="kb-pattern-style-tag">{style}</span>
							))}
					</div>
					{pattern.description ? <div className="kb-pattern-description">{pattern.description}</div> : null}
				</div>
			);
		}
		return (
			<div className="block-editor-block-patterns-list__item-title">
				<span className="kb-pattern-inline-title" dangerouslySetInnerHTML={{ __html: pattern.title }}></span>
				{undefined !== pro && pro && (
					<span className="kb-pattern-pro-item">{__('Premium', 'kadence-blocks')}</span>
				)}
			</div>
		);
	}

	return (
		<div key={key} className={`block-editor-block-patterns-list__list-item kb-pattern-style-${selectedStyle}`}>
			<WithToolTip showTooltip={showTooltip} title={pattern.title}>
				<div
					role="option"
					className={`block-editor-block-patterns-list__item${locked ? ' kb-pattern-item-locked' : ''}`}
					onClick={() => {
						if (!locked) {
							onClick(pattern, content);
						} else {
							console.log('Can not install');
						}
					}}
					aria-disabled={locked ? true : undefined}
					aria-label={pattern.title}
					aria-describedby={pattern.description ? descriptionId : undefined}
				>
					{proRender && 'image' !== previewMode && !htmlContent && (
						<div className="kb-pattern-requires-pro-item-wrap block-editor-block-preview__container">
							<span className="kb-pattern-requires-pro-item">
								{__('Requires Kadence Blocks Pro to Render Preview', 'kadence-blocks')}
							</span>
						</div>
					)}
					{content && !proRender && 'image' !== previewMode && !htmlContent && (
						<BlockPreview
							blocks={parse(content, {
								__unstableSkipMigrationLogs: true,
							})}
							viewportWidth={viewportWidth}
							additionalStyles={customStyles}
							editorStyles={editorStyles}
							shadowCompatStyles={shadowCompatStyles}
						/>
					)}
					{'image' !== previewMode && htmlContent && (
						<PatternPreview
							html={htmlContent}
							title={pattern.title}
							viewportWidth={viewportWidth}
							additionalStyles={customStyles}
							ratio={
								imageWidth && imageHeight
									? roundAccurately((imageHeight / imageWidth) * 100, 2) + '%'
									: undefined
							}
							shadowStyles={shadowStyles}
							shadowCompatStyles={shadowCompatStyles}
							patternType={patternType}
							rootScroll={rootScroll}
						/>
					)}
					{'image' === previewMode && (
						<div
							className="kb-pattern-image-wrap"
							style={{
								paddingBottom:
									imageWidth && imageHeight
										? roundAccurately((imageHeight / imageWidth) * 100, 2) + '%'
										: undefined,
							}}
						>
							<img src={image} loading={'lazy'} alt={pattern.title} />
						</div>
					)}
					{locked && (
						<div className="kb-pattern-requires-active-pro">
							<span className="kb-pattern-requires-active-pro-item">
								<ExternalLink
									href={
										'https://www.kadencewp.com/pricing/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=patterns'
									}
								>
									{__('Requires Kadence Premium Designs', 'kadence-blocks')}
								</ExternalLink>
							</span>
						</div>
					)}
					{!showTooltip && getFooter()}
					{!!pattern.description && <VisuallyHidden id={descriptionId}>{pattern.description}</VisuallyHidden>}
				</div>
			</WithToolTip>
		</div>
	);
}

function KadenceBlockPatternList({
	blockPatterns,
	selectedCategory,
	selectedPageStyles,
	filterValue,
	onClickPattern,
	label = __('Block Patterns', 'kadence-blocks'),
	showTitlesAsTooltip,
	customStyles,
	customShadowStyles,
	breakpointCols,
	previewMode = 'iframe',
	selectedStyle = 'light',
	patternType = 'pattern',
	rootScroll,
	patternsHTML,
}) {
	const { styles, assets } = useSelect((select) => {
		const settings = select(blockEditorStore).getSettings();
		return {
			styles: settings.styles,
			assets: settings.__unstableResolvedAssets,
		};
	}, []);
	const parsedStyles = useParsedAssets(assets?.styles);
	const styleIds = parsedStyles.map((style) => style.id);
	const styleIdsTest = [
		'kadence-blocks-global-editor-styles-inline-css',
		'kadence-editor-global-inline-css',
		'wp-block-library-css',
		'wc-blocks-vendors-style-css',
		'wc-blocks-style-css',
	];
	const styleIdsExclude = ['yoast-seo-metabox-css-css'];
	const baseCompatStyles = parsedStyles.filter((style) => styleIdsTest.includes(style.id));
	const compatStyles = useCompatibilityStyles();
	const neededCompatStyles = compatStyles.filter(
		(style) => style.id && !styleIds.includes(style.id) && !styleIdsExclude.includes(style.id)
	);
	const shadowCompatStyles = useMemo(() => {
		return (
			<>
				{[...neededCompatStyles, ...baseCompatStyles].map(({ tagName, href, id, rel, media, textContent }) => {
					const TagName = tagName.toLowerCase();
					let finalTextContent = textContent.replace(/ .block-editor-block-list__layout/g, '');
					finalTextContent = finalTextContent.replace(/:root/g, '.pattern-shadow-wrap');
					if (TagName === 'style') {
						return (
							<TagName {...{ id }} key={id}>
								{finalTextContent}
							</TagName>
						);
					}

					return <TagName {...{ href, id, rel, media }} key={id} />;
				})}
			</>
		);
	}, [neededCompatStyles, baseCompatStyles]);
	const shadowStyles = useMemo(() => {
		if (styles) {
			return [
				...styles,
				{
					css: '.single-iframe-content{--wp--style--global--content-size:var(--wp--style--global--wide-size )}',
					__unstableType: 'presets',
				},
				...customShadowStyles,
			];
		}

		return styles;
	}, [styles, customShadowStyles]);
	const showAllItems = (patterns) => {
		const items = [];
		for (let i = 0; i < patterns.length; i++) {
			if (undefined !== patterns[i]?.name) {
				items.push(
					<KadenceBlockPattern
						key={patterns[i]?.slug || i}
						pattern={patterns[i]}
						patternHTML={patternsHTML ? patternsHTML?.[patterns[i]?.slug]?.html : null}
						onClick={onClickPattern}
						showTooltip={showTitlesAsTooltip}
						customStyles={customStyles}
						shadowStyles={shadowStyles}
						previewMode={previewMode}
						selectedStyle={selectedStyle}
						editorStyles={''}
						rootScroll={rootScroll}
						// baseCompatStyles={undefined !== baseCompatStyles ? baseCompatStyles : []}
						// neededCompatStyles={undefined !== neededCompatStyles ? neededCompatStyles : []}
						shadowCompatStyles={shadowCompatStyles}
						patternType={patternType}
					/>
				);
			}
		}
		return items;
	};

	return (
		<div className="block-editor-block-patterns-list">
			<div className="block-editor-block-patterns-list-wrap">
				<Masonry
					breakpointCols={breakpointCols}
					className={`kb-css-masonry kb-core-section-library`}
					columnClassName="kb-css-masonry_column"
				>
					{showAllItems(blockPatterns)}
				</Masonry>
			</div>
		</div>
	);
}

export default KadenceBlockPatternList;
