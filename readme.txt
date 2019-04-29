=== Kadence Blocks – Gutenberg Page Builder Toolkit ===
Contributors: britner
Tags: gutenberg, blocks, page builder, google fonts, dual buttons, svg icons, editor width,
Donate link: https://www.kadencethemes.com/about-us/
Requires at least: 4.4
Tested up to: 5.1.1
Stable tag: 1.5.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Custom Blocks for for Gutenberg to help extend the editing capablitlies.

== Description ==

This plugin adds custom blocks to extend Gutenberg's editing capabilities to better build custom layouts and make Gutenberg able to do more closely what popular page builders can do. With the [Kadence Row Layout Block](https://www.kadenceblocks.com/row-layout-block/) you can better control columns for different screen sizes plus it gives you full row editing tools like padding, backgrounds, overlays with gradients, vertical align and much more.

= Try Kadence Blocks =
[Demo Testing](http://demo.kadencethemes.com/kadence-blocks/)

= Custom Blocks Include =
* Row Layout - [demo](https://www.kadenceblocks.com/row-layout-block/)
* Advanced Heading - [demo](https://www.kadenceblocks.com/advanced-heading-block/) 
* Advanced Button - [demo](https://www.kadenceblocks.com/advanced-button-block/)
* Tabs - [demo](https://www.kadenceblocks.com/tabs-block/)
* Accordion - [demo](https://www.kadenceblocks.com/accordion-block/) 
* Testimonials - [demo](https://www.kadenceblocks.com/testimonial-block/) 
* Icon - [demo](https://www.kadenceblocks.com/icon-block/)
* Spacer / Divider - [demo](https://www.kadenceblocks.com/spacer-divider-block/) 
* Info Box - [demo](https://www.kadenceblocks.com/info-box-block/)
* Icon List - [demo](https://www.kadenceblocks.com/icon-list-block/) 

= Overview Video =
https://www.youtube.com/watch?v=pSrCYcOeuMc

= Key Block Features =
The Row Layout block can have 1-6 columns and any other blocks can be nested inside. So as a single column block it's a powerful wrapper because you can create very custom backgrounds and define padding and margin both for desktop and mobile layouts.

The Advanced Heading block provides full control for your heading, including font family (all google fonts), font weight, font style, font size (with tablet and mobile control), line height, color, letter spacing, alignment and margin.

The Advanced Button block allows you to have up to 5 buttons side by side. Plus, you can control each individually, both with static and hover styles, and each button can have an added icon next to the text.

The Tabs Block is highly customizable with unique tab title settings for spacing, color, icons, and text. You can set up vertical or horizontal tabs, plus there are options to switch to an accordion setup for mobile. Each tab content is an empty canvas able to contain any other block within it. 

The Icon block allows you to add an SVG icon right into you page. There are over 1500 icons to choose from and with each you can control the size, color, background, border and add a link.

The Spacer / Divider block allows you to optionally show a divider inside an area with a drag-able height. The divider has style options allowing you to set the width, height, color, line style, and opacity.

The Info Box Block is a box link containing an icon or image and optionally a title, description and learn more text. Configure padding, fonts, backgrounds, borders and style static and hover colors even show a box shadow.

= Editor Max Width =
One of the challenges with creating custom column and row layouts in Gutenberg is the width of the editor in your admin. By default, Gutenberg uses a 650px max width for the content editor. When adding text to a sidebar template this works great, as the max width in the editor is comparable to the content width when using a sidebar. However, for content going into pages where you don’t have a sidebar, it is a poor representation of what you are actually going to get on the front end of your site. Not to mention it makes for a cramped space to work in if you are trying to manage a row with three columns.

In an effort to create an easier way to use Gutenberg in a more “page building experience” we created a simple way that allows you to change the default max width for pages and for posts as well as individually change that through a page by page setting. 


= Source files =

[github](https://github.com/kadencethemes/kadence-blocks)

= Support =

We are happy to help as best we can with questions! Please use the support forums.

== Installation ==

Install the plugin into the `/wp-content/plugins/` folder, and activate it.

== Screenshots ==

1. Initial Row Layout editing

2. Example single column Row Layout with gradient Background overlay

3. Three column Row Layout example

4. Icon Block example

5. Advanced Button example

6. Editor Width settings inside Gutenberg

== Changelog ==

= 1.5.3 =
* Fix: Issue with icon list then typing return.
* Add: Prebuilt Accordion Styles.

= 1.5.2 =
* Add: Fullwidth setting to Advanced Button.
* Add: Text Transform to Testimonials.
* Add: Image Ratio to Card Testimonial style.

= 1.5.1 =
* Tweak: Testimonial Grid CSS.

= 1.5.0 =
* Fix: Testimonial Carousel Pagination not showing.
* Tweak: Testimonial Carousel CSS.

= 1.4.9 =
* Fix: Update not showing.

= 1.4.8 =
* Add: NEW Testimonial Block!
* Fix: IE issue with images in info box.
* Fix: FireFox issue with Icon flip.
* Fix: IE issue with parallax scrolling.
* Fix: Gutenberg 5.5 broke add accordion item button.
* Fix: A few Typos.

= 1.4.7 =
* Add: Inline Typography Settings for Advanced Heading Block.
* Update: Improve Typography Settings Performance.
* Fix: Issue with list block clearing when using return to create a new line.
* Fix: Issue where error showed if you didn't have any typography options selected.

= 1.4.6 =
* Update: Add Opacity options to Info Box.
* Add: New Icon List Block. 

= 1.4.5 =
* Fix: Issue with buttons if you cleared the colors.

= 1.4.4 =
* Fix: Issue with parallax margin on mobile on some themes.
* Add: Video Popup target to Button!
* Update: Button Defaults moved to Kadence Control Plugin.
* Add: Button Settings visibility
* Add: nofollow option to buttons.
* Add: Opacity to Buttons Background and Border.
* Add: Button Gap.
* Add: Background Image option to columns.

= 1.4.3 =
* Fix: Issue with chrome cutting content white (again)

= 1.4.2 =
* Fix: Inner Block Selection.
* Fix: Prebuilt error.

= 1.4.1 =
* Fix: Duplication issue with row styles.
* Fix: Issue with chrome cutting content white.
* Add: Tablet and Mobile specific control for background and background overlay.

= 1.4.0 =
* Add: column resizing for three column layouts.
* Add: option to resize columns on a grid of every 5% or fluid.
* Add: Collapse Order Attribute for Columns.
* Add: Preset Styles for Info Box.
* Add: Infobox default controls.
* Add: Infobox settings visiblity controls.
* Add: Better SVG image support for InfoBox.
* Add: Icon Margin Control.
* Add: Category Icon.
* Update: Block Icons.

= 1.3.9 =
* Add: Differnet size units to Margin, maxwidth and minheight controls in row layout.
* Update: Add some fallback support for content imported to a muitisite where it strips html.
* Updates: Better Mobile Parallax.
* Fix: Attempt fix for Tabs in widget area.

= 1.3.8 =
* Fix: Anchor in Header issue.

= 1.3.7 =
* Fix: Icons Link Issue.
* Add: Accordion to Block Controls (set defaults, limit setting visiblity).
* Add: Font Family options to create a custom options set.

= 1.3.6 =
* Fix: Much smoother accordion animation.
* Fix: Info Box Prebuilt error.
* Fix: Issue with parallax on mobile.
* Update: Allow Accordion Panes to be rearanged.
* Update: Move accodion wrap tag into main accordion settings panel.

= 1.3.5 =
* Fix: Font Weight tab titles, remove underline if theme adding.
* Add: Tablet Padding and margin controls to row layout.
* Add: Allow for wrapping of the accordion button with heading tag.

= 1.3.4 =
* Fix: Error buttons.

= 1.3.3 =
* Fix: Error with tabs and spacer.
* Add: Text transform for accordion title.

= 1.3.2 =
* Fix: Error with Control plugin if no settings.

= 1.3.1 =
* Fix: Pane Title not selectable in Firefox.
* Add: VH unit options to Spacer.
* Add: Kadence Blocks Control Plugin! 
You can now define which settings users see based on user role. Currently just added for Tabs and Spacer Block.
You can also set the block defaults.

= 1.3.0 =
* Fix: Jerky Accordion Animation.

= 1.2.9 =
* Fix: some of the Accordion styling.

= 1.2.8 =
* Add: New Accordion block!
* Add: Presets for Tabs Block.
* Add: You can now define which Tab should be open regardless of what is open in the editor.
* Fix: Small change with parallax settings.
* Fix: Unique IDs causing revisions needlessly.
* Tweek: Setting Page styles.
* Add: BorderRadius Property to columns - thanks @DizzySquirrel
* Fix: Correct naming for 'Left Bottom' background - thanks @DizzySquirrel

= 1.2.7 =
* Update: Prep for three column controls.
* Add: Collapse row gutter control.
* Add: Parallax for Background Images!!

= 1.2.6 =
* Fix: CSS loading for rest api calls.
* Add: Anchor support for Advanced Heading.
* Add: New Four Prebuilt items.
* Fix: Issue with columns being insertable.
* Add: Youtube Video to description.

= 1.2.5 =
* Fix: Tabs Styles.
* Add: Search for Prebuilt.

= 1.2.4 =
* Update: Info box, add in settings.

= 1.2.3 =
* Add: NEW Info Box Block!
* Update: CSS placed in head if possible, reverts to inline if outside content area.
* Update: Blocks now added to a category.
* Update: improve selection for block row.

= 1.2.2 =
* Update: render CSS inline per Gutenberg Hook, future need to add an option for rendering in head.
* Add: Border control to columns.

= 1.2.1 =
* Update: Font family select box for easier select.
* Add: Tablet and Moble height to spacer block.
* Fix: Highlight option in Gutenberg 4.8
* Fix: Column 60/40 css missing - thanks @bucketpress
* Add: Footer and Header tag options - thanks @bucketpress
* Fix: Firefox issue with swtiching tabs - thanks @bucketpress

= 1.2.0 =
* Fix: Typography bug when selecting google to non google font.
* Fix: Row layout Text more specific css.
* Fix: Tab titles not editable in FireFox.
* Add: Custom css class options to buttons.
* Add: Visual Select for Dividers.
* Add: Left and Right Margins for columns. Allow Negative Margins.
* Add: Z-index option to columns.
* Update: Move Heading Tag Level controls to dropdown. 

= 1.1.9 =
* Add: NEW Highlight options for Heading Block.
* Add: Text color, link color and link hover color to row layout options.
* Update: Filter for Typography Font Options.

= 1.1.8 =
* Fix: Nested tabs in tabs styling.
* Tweak: Row Layout editor css for better selecting row.
* Tweak: Tabs for better accessibility.
* Update: Increase the amount of possible tabs.
* Add: Tab Default controls.

= 1.1.7 =
* Add: Granular control over two column Layouts.
* Add: Background color options for columns.
* Add: 'noreferrer noopener' to external buttons.
* Add: Default Controls for Row layout, button and spacer blocks.
* Fix: Issue with button top and bottom padding.

= 1.1.6 =
* Update: Layouts css tweek.

= 1.1.5 =
* Add: Support for tabs within tabs.
* Fix: Top Divider height.

= 1.1.4 =
* Fix: nested columns css.

= 1.1.3 =
* Fix: Output CSS for non WordPress 5.0.
* Tweak Limited Margin CSS.

= 1.1.2 =
* Fix: WordPress 5 stuff.

= 1.1.1 =
* Fix: Update not showing WordPress.

= 1.1.0 =
* Fix: Button link width.
* Fix: Font weight setting.
* Fix: Reusable Blocks issue.
* Update: Add more to Prebuilt Library

= 1.0.9 =
* Updates: Various fixes for Gutenberg 4.2
* Add: Prebuilt Libray to row block.

= 1.0.8 =
* Updates: Various fixes for Gutenberg 4.1
* Fix: Nested columns.

= 1.0.7 =
* Updates: Various fixes for Gutenberg 4.0
* Fix: Typo in layout background.

= 1.0.6 =
* Fix: Tab title not saving.
* Fix: Button text not always saving.

= 1.0.5 =
* Add: Minimal Margin css option.
* Add: Waves divider to row.
* Add: New Tabs Block
* Update: Option to turn off the editor width settings.
* Update: Tweak  admin google font load so duplicates are not loaded.
* Fix: Editor Width name issue.
* Fix: Vertical alignment when minimum height is used.
* Fix: Typography font when regular is reselected.

= 1.0.4 =
* Fix: Min Height so it doesn't add to padding.
* Update: Add extra space when using larger gutter.
* Update: Change Sidebar to small and No sidebar to Large.
* Add: New Dividers to Row Layout!
* Fix: Issue with fullwidth if set as default.
* Add: Link to Demo Tester.

= 1.0.3 =
* Fix: Row Inner max width.
* Update: CSS build for Gutenberg update.
* Fix: Support forms link.
* Update: Buttons with font family selection.

= 1.0.2 =
* Fix: Small JS error in the admin.

= 1.0.1 =
* Add: github link.
* Update: Editor width to change image max width.
* Update: Spacer/Divider block to show height while resizing.
* Update: Icons Block to copy styles from previous icon when adding more.
* Update: Button Block to copy styles from previous Button when adding more.
* Add: New Advanced Header Block with full Google font support.

= 1.0.0 =
* Initial Release.