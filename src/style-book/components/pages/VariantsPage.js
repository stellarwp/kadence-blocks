/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Block presets / variants overview with resolved preview values.
 *
 * @param {object}   props            Component props.
 * @param {Record<string, object>} props.variants Variants feed keyed by block name.
 * @return {JSX.Element} Variants page.
 */
export function VariantsPage({ variants }) {
	const blocks = Object.entries(variants);

	return (
		<div className="kadence-style-book__variants-page">
			<header className="kadence-style-book__page-header">
				<h2>{__('Block Presets', 'kadence-blocks')}</h2>
				<p>
					{__(
						'Variant sets registered for Kadence blocks. Resolved preview values are shown read-only for now.',
						'kadence-blocks'
					)}
				</p>
			</header>

			{blocks.length === 0 ? (
				<p className="kadence-style-book__empty">{__('No block presets registered.', 'kadence-blocks')}</p>
			) : (
				<div className="kadence-style-book__variants-list">
					{blocks.map(([block, data]) => (
						<section key={block} className="kadence-style-book__variant-block">
							<header className="kadence-style-book__variant-block-head">
								<h3>{block}</h3>
								<span className="kadence-style-book__variant-default">
									{__('Default:', 'kadence-blocks')} {data.default}
								</span>
							</header>

							<div className="kadence-style-book__variant-grid">
								{(data.names ?? []).map((variantName) => (
									<article key={variantName} className="kadence-style-book__variant-card">
										<h4>{variantName}</h4>
										<dl className="kadence-style-book__variant-props">
											{Object.entries(data.values?.[variantName] ?? {}).map(
												([prop, propValue]) => (
													<div key={prop} className="kadence-style-book__variant-prop">
														<dt>{prop}</dt>
														<dd>
															{prop.includes('bg') || prop.includes('color') ? (
																<span className="kadence-style-book__variant-value">
																	<span
																		className="kadence-style-book__swatch"
																		style={{ backgroundColor: propValue }}
																	/>
																	<code>{propValue}</code>
																</span>
															) : (
																<code>{propValue}</code>
															)}
														</dd>
													</div>
												)
											)}
										</dl>
									</article>
								))}
							</div>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
