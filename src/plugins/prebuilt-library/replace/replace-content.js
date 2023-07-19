/**
 * WordPress dependencies
 */
const stripStringRender = ( string ) => {
	return string.toLowerCase().replace( /[^0-9a-z-]/g, '' );
};

export default function replaceContent( content, aiContent, categories, context, variation, isHTML = false ) {
	if ( ! content ) {
		return content;
	}
	if ( ! aiContent?.[context]?.content ) {
		return content;
	}
	const currentCategory = categories ? categories[0] : '';
	const contextAI = aiContent?.[context]?.content;
	const baseContent = contextAI.find( x => x.id === context );
	const columnsContent = contextAI.find( x => x.id === context + '-columns' );
	const listContent = contextAI.find( x => x.id === context + '-list' );
	const videoContent = contextAI.find( x => x.id === context + '-videos' );
	const tabsContent = contextAI.find( x => x.id === context + '-tabs' );
	const accordionContent = contextAI.find( x => x.id === context + '-accordion' );
	switch (currentCategory) {
		case "columns":
			// Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Write a short headline/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Compose a captivating title for this section./g, baseContent?.heading?.medium );
			}
			// Paragraph
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Support your idea with a clear, descriptive sentence or phrase that has a consistent writing style./g, baseContent?.sentence?.short );
			}
			if ( columnsContent?.columns ) {
				for (let index = 0; index < columnsContent?.columns.length; index++) {
					// Title.
					if ( columnsContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a descriptive title for the column.", columnsContent?.columns?.[index]?.['title-medium'] );
					}
					// Paragraph.
					if ( columnsContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", columnsContent?.columns?.[index]?.['sentence-short'] );
					}
				}
			}
			break;
		case "text":
			// Headline Short.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Type a short headline/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, baseContent?.heading?.medium );
			}
			// Paragraph long
			if ( baseContent?.sentence?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Write about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style. Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, baseContent?.sentence?.long );
			}
			// Paragraph Medium
			if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors. /g, baseContent?.sentence?.medium );
			}

			// Paragraph
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. /g, baseContent?.sentence?.short );
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging./g, baseContent?.sentence?.short );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /2018 - Current/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			if ( columnsContent?.columns ) {
				for (let index = 0; index < columnsContent?.columns.length; index++) {
					// Title.
					if ( columnsContent?.columns?.[index]?.['title-short'] ) {
						content = content.replace( "Add a short title", columnsContent?.columns?.[index]?.['title-short'] );
					}
					// Paragraph.
					if ( columnsContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this space to add a short description.", columnsContent?.columns?.[index]?.['sentence-short'] );
					}
					// Paragraph medium.
					if ( columnsContent?.columns?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn their attention.", columnsContent?.columns?.[index]?.['sentence-medium'] );
					}
				}
			}
			break;
		case "hero":
			const heroContent = contextAI.find( x => x.id === context + '-hero' );
			// Headline.
			if ( heroContent?.heading?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, heroContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, baseContent?.heading?.medium );
			}
			// Short Headline.
			if ( heroContent?.heading?.short ) {
				content = content.replace( /Write a brief title/g, heroContent?.heading?.short );
			} else if ( baseContent?.heading?.short ) {
				content = content.replace( /Write a brief title/g, baseContent?.heading?.short );
			}
			// overline
			if ( heroContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, heroContent?.overline?.short );
				content = content.replace( /Add an overline text/g, heroContent?.overline?.short );
				content = content.replace( /Overline/g, heroContent?.overline?.short );
			} else if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Paragraph
			if ( heroContent?.sentence?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, heroContent?.sentence?.short );
			} else if ( baseContent?.sentence?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, baseContent?.sentence?.short );
			}
			// Button
			if ( heroContent?.button?.short ) {
				content = content.replace( /Call To Action/g, heroContent?.button?.short );
				content = content.replace( /Call to Action/g, heroContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Secondary Button
			if ( heroContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, heroContent?.['secondary-button']?.short );
			} else if ( baseContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, baseContent?.['secondary-button']?.short );
			}
			// Cards 
			if ( heroContent?.cards ) {
				for (let index = 0; index < heroContent?.cards.length; index++) {
					// Title.
					if ( heroContent?.cards?.[index]?.['title-short'] ) {
						content = content.replace( "Add a Title", heroContent?.cards?.[index]?.['title-short']);
					}
					// Paragraph.
					if ( heroContent?.cards?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this space to add a short description.", heroContent?.cards?.[index]?.['sentence-short']);
					}
					// Paragraph medium.
					if ( heroContent?.cards?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn a click.", heroContent?.cards?.[index]?.['sentence-medium'])
					}
					// Button.
					if ( heroContent?.cards?.[index]?.['button-short'] ) {
						content = content.replace( "CTA", heroContent?.cards?.[index]?.['button-short']);
						content = content.replace( "CTA", heroContent?.cards?.[index]?.['button-short']);
					}
				}
			}
			break;
		case "image":
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Add a short, consistent heading for your image./g, baseContent?.heading?.medium );
			}
			// Short Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, baseContent?.heading?.short );
			}
			// Paragraph
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Use this paragraph to add supporting context. Consider your audience and what matters to them, and provide insights that support your topic./g, baseContent?.sentence?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			break;
		case "title-or-header":
			// Title Uses Hero AI Content
			const titleContent = contextAI.find( x => x.id === context + '-hero' );
			// Headline.
			if ( titleContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, titleContent?.heading?.medium );
				content = content.replace( /Craft a captivating title for the upcoming section to attract your audience./g, titleContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, baseContent?.heading?.medium );
				content = content.replace( /Craft a captivating title for the upcoming section to attract your audience./g, baseContent?.heading?.medium );
			}
			// Short Headline.
			if ( titleContent?.heading?.short ) {
				content = content.replace( /Add a short & sweet headline/g, titleContent?.heading?.short );
				content = content.replace( /Add a short &amp; sweet headline/g, titleContent?.heading?.short );
			} else if ( baseContent?.heading?.short ) {
				content = content.replace( /Add a short & sweet headline/g, baseContent?.heading?.short );
				content = content.replace( /Add a short &amp; sweet headline/g, baseContent?.heading?.short );
			}
			// overline
			if ( titleContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, titleContent?.overline?.short );
				content = content.replace( /Add an overline text/g, titleContent?.overline?.short );
				content = content.replace( /Overline/g, titleContent?.overline?.short );
			} else if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( titleContent?.button?.short ) {
				content = content.replace( /Call To Action/g, titleContent?.button?.short );
				content = content.replace( /Call to Action/g, titleContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			break;
		case "media-text":
			// Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Write a short headline/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, baseContent?.heading?.medium );
			}
			// Paragraph
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, baseContent?.sentence?.short );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Secondary Button
			if ( baseContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, baseContent?.['secondary-button']?.short );
			}
			// List
			if ( listContent?.list ) {
				for (let index = 0; index < listContent?.list.length; index++) {
					// List Item.
					if ( listContent?.list?.[index]?.['list-item-short'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Add a list item"`, `"text":"${ listContent?.list?.[index]?.['list-item-short'] }"` );
						}
						content = content.replace( "Add a list item", listContent?.list?.[index]?.['list-item-short']);
					}
				}
			}
			// Columns
			if ( columnsContent?.columns ) {
				for (let index = 0; index < columnsContent?.columns.length; index++) {
					// Columns Item.
					if ( columnsContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a descriptive title for the column.", columnsContent?.columns?.[index]?.['title-medium']);
					}
					// Column sentence.
					if ( columnsContent?.columns?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn their attention.", columnsContent?.columns?.[index]?.['sentence-medium']);
					}
				}
			}
			break;
		case "accordion":
			// Headline short.
			if ( accordionContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, accordionContent?.heading?.short );
			} else if ( baseContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( accordionContent?.heading?.medium ) {
				content = content.replace( /A brief headline here will add context for the section/g, accordionContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /A brief headline here will add context for the section/g, baseContent?.heading?.medium );
			}
			// Paragraph
			if ( accordionContent?.sentence?.medium ) {
				content = content.replace( /Use this space to provide your website visitors with a brief description on what to expect before clicking on a section title./g, accordionContent?.sentence?.medium );
			} else if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Use this space to provide your website visitors with a brief description on what to expect before clicking on a section title./g, baseContent?.sentence?.medium );
			}
			// Accordion
			if ( accordionContent?.accordion ) {
				for (let index = 0; index < accordionContent?.accordion.length; index++) {
					// Title.
					if ( accordionContent?.accordion?.[index]?.['title-medium'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Add a section title that is relevant for your readers."`, `"text":"${ accordionContent?.accordion?.[index]?.['title-medium'] }"` );
						}
					}
				}
				for (let index = 0; index < accordionContent?.accordion.length; index++) {
					// Title.
					if ( accordionContent?.accordion?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a section title that is relevant for your readers.", accordionContent?.accordion?.[index]?.['title-medium']);
						content = content.replace( "tab-addasectiontitlethatisrelevantforyourreaders", `tab-${ stripStringRender( accordionContent?.accordion?.[index]?.['title-medium'].toString() )}`);
						content = content.replace( "tab-addasectiontitlethatisrelevantforyourreaders", `tab-${ stripStringRender( accordionContent?.accordion?.[index]?.['title-medium'].toString() )}`);
					}
					// Paragraph.
					if ( accordionContent?.accordion?.[index]?.['paragraph-medium'] ) {
						content = content.replace( "By default, this panel is concealed and appears when the user clicks on the section title. Input relevant information about its title using paragraphs or bullet points. Accordions can enhance the user experience when utilized effectively. They allow users to choose what they want to read and disregard the rest. Accordions are often utilized for frequently asked questions (FAQs).", accordionContent?.accordion?.[index]?.['paragraph-medium']);
					}
				}
			}
			break;
		case "tabs":
			// Headline short.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, baseContent?.heading?.short );
			}
			// Sentence.
			if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Tabs are a helpful way that allow users to view a group of related data one at a time. Add a brief description of what your tabbed section is about./g, baseContent?.sentence?.medium );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Tabs
			if ( tabsContent?.tabs ) {
				for (let index = 0; index < tabsContent?.tabs.length; index++) {
					// Title.
					if ( tabsContent?.tabs?.[index]?.['title-short'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Tab name"`, `"text":"${ tabsContent?.tabs?.[index]?.['title-short'] }"` );
						}
					}
					if ( tabsContent?.tabs?.[index]?.['title-medium'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Give this tab a concise name"`, `"text":"${ tabsContent?.tabs?.[index]?.['title-medium'] }"` );
						}
					}
				}
				for (let index = 0; index < tabsContent?.tabs.length; index++) {
					// Title.
					if ( tabsContent?.tabs?.[index]?.['title-short'] ) {
						content = content.replace( "Tab name", tabsContent?.tabs?.[index]?.['title-short']);
						content = content.replace( "tab-tabname", `tab-${ stripStringRender( tabsContent?.tabs?.[index]?.['title-short'].toString() )}`);
						content = content.replace( "tab-tabname", `tab-${ stripStringRender( tabsContent?.tabs?.[index]?.['title-short'].toString() )}`);
						content = content.replace( "Add a brief title", tabsContent?.tabs?.[index]?.['title-short']);
						content = content.replace( "Short title", tabsContent?.tabs?.[index]?.['title-short']);
					}
					// Title Medium.
					if ( tabsContent?.tabs?.[index]?.['title-medium'] ) {
						content = content.replace( "Scribe a concise title", tabsContent?.tabs?.[index]?.['title-medium']);
						content = content.replace( "Give this tab a concise name", tabsContent?.tabs?.[index]?.['title-medium']);
						content = content.replace( "tab-givethistabaconcisename", `tab-${ stripStringRender( tabsContent?.tabs?.[index]?.['title-medium'].toString() )}`);
						content = content.replace( "tab-givethistabaconcisename", `tab-${ stripStringRender( tabsContent?.tabs?.[index]?.['title-medium'].toString() )}`);
						//content = content.replace( "Add a descriptive title for the column.", tabsContent?.tabs?.[index]?.['title-medium']);
					}
					// Title Long.
					if ( tabsContent?.tabs?.[index]?.['title-long'] ) {
						content = content.replace( "Type a brief and clear title for this panel.", tabsContent?.tabs?.[index]?.['title-long']);
					}
					// Overline.
					if ( tabsContent?.tabs?.[index]?.['overline-short'] ) {
						content = content.replace( "Overline", tabsContent?.tabs?.[index]?.['overline-short']);
					}
					// Button.
					if ( tabsContent?.tabs?.[index]?.['button-short'] ) {
						content = content.replace( "Call To Action", tabsContent?.tabs?.[index]?.['button-short']);
					}
					// List Title.
					if ( tabsContent?.tabs?.[index]?.['list-title'] ) {
						content = content.replace( "Featured subhead", tabsContent?.tabs?.[index]?.['list-title']);
					}
					// List Item 1.
					if ( tabsContent?.tabs?.[index]?.['list-item-1'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Add a single and succinct list item"`, `"text":"${ tabsContent?.tabs?.[index]?.['list-item-1'] }"` );
						}
						content = content.replace( "Add a single and succinct list item", tabsContent?.tabs?.[index]?.['list-item-1']);
						content = content.replace( "Add a descriptive title for the column.", tabsContent?.tabs?.[index]?.['list-item-1']);
					}
					// List Item 2.
					if ( tabsContent?.tabs?.[index]?.['list-item-2'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Add a single and succinct list item"`, `"text":"${ tabsContent?.tabs?.[index]?.['list-item-2'] }"` );
						}
						content = content.replace( "Add a single and succinct list item", tabsContent?.tabs?.[index]?.['list-item-2']);
						content = content.replace( "Add a descriptive title for the column.", tabsContent?.tabs?.[index]?.['list-item-2']);
					}
					// List Item 3.
					if ( tabsContent?.tabs?.[index]?.['list-item-3'] ) {
						if ( ! isHTML ) {
							content = content.replace( `"text":"Add a single and succinct list item"`, `"text":"${ tabsContent?.tabs?.[index]?.['list-item-3'] }"` );
						}
						content = content.replace( "Add a single and succinct list item", tabsContent?.tabs?.[index]?.['list-item-3']);
						content = content.replace( "Add a descriptive title for the column.", tabsContent?.tabs?.[index]?.['list-item-3']);
					}
					// Description 1.
					if ( tabsContent?.tabs?.[index]?.['description-1'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", tabsContent?.tabs?.[index]?.['description-1']);
						content = content.replace( "Write a short descriptive paragraph about your tab that will help users find what they are looking for and get access to content without further exploration.", tabsContent?.tabs?.[index]?.['description-1']);
						content = content.replace( "Write a short text about your tab that will help users find what they are looking for and get access to content without further exploration.", tabsContent?.tabs?.[index]?.['description-1']);
					}
					// Description 2.
					if ( tabsContent?.tabs?.[index]?.['description-2'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", tabsContent?.tabs?.[index]?.['description-2']);

						content = content.replace( "This panel is hidden by default and revealed when a user clicks on the tab title. Fill it in with relevant information about its title. You can use paragraphs or bullet points to add your content here.", tabsContent?.tabs?.[index]?.['description-2']);
					}
					// Description 3.
					if ( tabsContent?.tabs?.[index]?.['description-3'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", tabsContent?.tabs?.[index]?.['description-3']);
						content = content.replace( "Tabs help users navigate through grouped content giving them control over what to read. Use them to connect related information and as a tool to save space.", tabsContent?.tabs?.[index]?.['description-3']);
					}
				}
			}
			break;
		case "video":
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Add a brief headline for impact and \/ or context here/g, baseContent?.heading?.medium );
			}
			// Headline short.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Write a succinct headline here/g, baseContent?.heading?.short );
			}
			// Headline Long.
			if ( baseContent?.heading?.long ) {
				content = content.replace( /Write a compelling and inviting headline to re-hook your visitors through your content./g, baseContent?.heading?.long );
			}
			// Sentence
			if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Use this paragraph to provide more insights writing with clear and concise language that is easy to understand. Edit and proofread your content./g, baseContent?.sentence?.medium );
			}
			// Sentence Short
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Support your idea with a clear, descriptive sentence or phrase that has a consistent writing style./g, baseContent?.sentence?.short );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Video Title.
			if ( videoContent?.videos ) {
				for (let index = 0; index < videoContent?.videos.length; index++) {
					// Title.
					if ( videoContent?.videos?.[index]?.['title-short'] ) {
						content = content.replace( "Short title", videoContent?.videos?.[index]?.['title-short']);
					}
				}
			}
			break;
		case "cards":
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, baseContent?.heading?.medium );
				content = content.replace( /A short and sweet title for this section./g, baseContent?.heading?.medium );
			}
			// Paragraph
			if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, baseContent?.sentence?.medium );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Secondary Button
			if ( baseContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, baseContent?.['secondary-button']?.short );
			}
			// Cards 
			if ( columnsContent?.columns ) {
				for (let index = 0; index < columnsContent?.columns.length; index++) {
					// Title.
					if ( columnsContent?.columns?.[index]?.['title-short'] ) {
						content = content.replace( "Add a Title", columnsContent?.columns?.[index]?.['title-short'] );
					}
					// Title.
					if ( columnsContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a Short Title Here", columnsContent?.columns?.[index]?.['title-medium'] );
					}
					// Paragraph.
					if ( columnsContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this space to add a short description. It gives enough info to earn a click.", columnsContent?.columns?.[index]?.['sentence-short'] );
						content = content.replace( "Add a brief description to your card.", columnsContent?.columns?.[index]?.['sentence-short'] );
					}
					// Paragraph.
					if ( columnsContent?.columns?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn a click.", columnsContent?.columns?.[index]?.['sentence-medium'] );
					}
					// overline.
					if ( columnsContent?.columns?.[index]?.['overline-short'] ) {
						content = content.replace( "Overline", columnsContent?.columns?.[index]?.['overline-short'] );
					}
					// button.
					if ( columnsContent?.columns?.[index]?.['button-short'] ) {
						content = content.replace( "Call To Action", columnsContent?.columns?.[index]?.['button-short'] );
						content = content.replace( "Call to Action", columnsContent?.columns?.[index]?.['button-short'] );
					}
				}
			}
			break;
		case "testimonials":
			const testimonialContent = contextAI.find( x => x.id === context + '-testimonials' );
			// Headline.
			if ( testimonialContent?.heading?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, testimonialContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, baseContent?.heading?.medium );
			}
			// Paragraph long
			if ( testimonialContent?.sentence?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, testimonialContent?.sentence?.long );
			} else if ( baseContent?.sentence?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, baseContent?.sentence?.long );
			}
			if ( testimonialContent?.testimonials ) {
				for (let index = 0; index < testimonialContent?.testimonials.length; index++) {
					// Title.
					if ( testimonialContent?.testimonials?.[index]?.['customer'] ) {
						content = content.replace( "Customer Name", testimonialContent?.testimonials?.[index]?.['customer'] );
					}
					// Testimonial.
					if ( testimonialContent?.testimonials?.[index]?.['testimonial'] ) {
						content = content.replace( "Testimonials are a social proof, a powerful way to inspire trust.", testimonialContent?.testimonials?.[index]?.['testimonial'] );
						content = content.replace( "Testimonials, as authentic endorsements from satisfied customers, serve as potent social proof, significantly inspiring trust in potential consumers.", testimonialContent?.testimonials?.[index]?.['testimonial'] );
					}
				}
			}
			break;
		case "pricing-table":
			const pricingTableContent = contextAI.find( x => x.id === 'pricing-' + context );
			// Headline.
			if ( pricingTableContent?.heading?.short ) {
				content = content.replace( /Write a short headline/g, pricingTableContent?.heading?.short );
			}
			// Headline.
			if ( pricingTableContent?.heading?.short ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, pricingTableContent?.heading?.short );
			}
			// Paragraph short
			if ( pricingTableContent?.sentence?.short ) {
				content = content.replace( /Add a gripping description for this featured plan/g, pricingTableContent?.sentence?.short );
			}
			// Paragraph long
			if ( pricingTableContent?.sentence?.medium ) {
				content = content.replace( /A pricing table assists users in selecting a suitable plan by simply and clearly differentiating product\/service features and prices. Use this as supporting text for your plans./g, pricingTableContent?.sentence?.medium );
			}
			// Paragraph medium
			if ( pricingTableContent?.sentence?.long ) {
				content = content.replace( /A pricing table assists users in selecting a suitable plan by simply and clearly differentiating product\/service features and prices. Use this as supporting text for your plans./g, pricingTableContent?.sentence?.long );
			}
			// overline
			if ( pricingTableContent?.overline?.short ) {
				content = content.replace( /add an overline text/g, pricingTableContent?.overline?.short );
				content = content.replace( /Add an overline text/g, pricingTableContent?.overline?.short );
			}
			if ( pricingTableContent?.plans ) {
				for (let index = 0; index < pricingTableContent?.plans.length; index++) {
					// Title.
					if ( pricingTableContent?.plans?.[index]?.['title-short'] ) {
						content = content.replace( "Tab Title", pricingTableContent?.plans?.[index]?.['title-short'] );
						//content = content.replace( "Name your plan", pricingTableContent?.plans?.[index]?.['title-short'] );
					}
					// Title.
					if ( pricingTableContent?.plans?.[index]?.['title-medium'] ) {
						content = content.replace( "Name your plan", pricingTableContent?.plans?.[index]?.['title-medium'] );
					}
					// Title.
					if ( pricingTableContent?.plans?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a descriptive title for your plan.", pricingTableContent?.plans?.[index]?.['title-medium'] );
					}
					// Price.
					if ( 0 === index ) {

					}
					if ( pricingTableContent?.plans?.[index]?.['price'] ) {
						// Remove monthyl, yearly, etc.
						let pricingTablePrice = pricingTableContent?.plans?.[index]?.['price'].replace( "/month", '' );
						pricingTablePrice = pricingTablePrice.replace( "/year", '' );
						if ( 0 === index ) {
							content = content.replace( "$60", pricingTablePrice );
						} else if ( 1 === index ) {
							content = content.replace( "$80", pricingTablePrice );
						} else if ( 2 === index ) {
							content = content.replace( "$120", pricingTablePrice );
						} else if ( 3 === index ) {
							content = content.replace( "$200", pricingTablePrice );
						}
					}
					// Sentence Short.
					if ( pricingTableContent?.plans?.[index]?.['sentence-short'] ) {
						content = content.replace( "Let your user know what to expect when choosing this plan. Inform users of plan benefits, not features.", pricingTableContent?.plans?.[index]?.['sentence-short'] );
					}
					// Buttons.
					if ( pricingTableContent?.plans?.[index]?.['button-short'] ) {
						content = content.replace( "Call To Action", pricingTableContent?.plans?.[index]?.['button-short'] );
					}
					// Feature 1.
					if ( pricingTableContent?.plans?.[index]?.['feature-1'] ) {
						content = content.replace( "Focus on the differences", pricingTableContent?.plans?.[index]?.['feature-1'] );
						if ( ! isHTML ) {
							content = content.replace( "Focus on the differences", pricingTableContent?.plans?.[index]?.['feature-1'] );
						}
					}
					// Feature 2.
					if ( pricingTableContent?.plans?.[index]?.['feature-2'] ) {
						content = content.replace( "Use a consistent language", pricingTableContent?.plans?.[index]?.['feature-2'] );
						if ( ! isHTML ) {
							content = content.replace( "Use a consistent language", pricingTableContent?.plans?.[index]?.['feature-2'] );
						}
					}
					// Feature 2.
					if ( pricingTableContent?.plans?.[index]?.['feature-3'] ) {
						content = content.replace( "Transmit benefits clearly", pricingTableContent?.plans?.[index]?.['feature-3'] );
						if ( ! isHTML ) {
							content = content.replace( "Transmit benefits clearly", pricingTableContent?.plans?.[index]?.['feature-3'] );
						}
					}
				}
			}
			break;
		case "counter-or-stats":
			const counterContent = contextAI.find( x => x.id === context + '-counter-stats' );
			// Headline.
			if ( counterContent?.heading?.medium ) {
				content = content.replace( /Tell your story in numbers, and give your visitors useful insights./g, counterContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /Tell your story in numbers, and give your visitors useful insights./g, baseContent?.heading?.medium );
			}
			// Paragraph medium
			if ( counterContent?.sentence?.medium ) {
				content = content.replace( /Make an impact, and share your organization's stats or achievements to interest your website visitors into learning more about you./g, counterContent?.sentence?.medium );
			} else if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Make an impact, and share your organization's stats or achievements to interest your website visitors into learning more about you./g, baseContent?.sentence?.medium );
			}
			// overline
			if ( counterContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, counterContent?.overline?.short );
				content = content.replace( /Add an overline text/g, counterContent?.overline?.short );
				content = content.replace( /Overline/g, counterContent?.overline?.short );
			} else if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( counterContent?.button?.short ) {
				content = content.replace( /Call To Action/g, counterContent?.button?.short );
				content = content.replace( /Call to Action/g, counterContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Metrics
			if ( counterContent?.metrics ) {
				for (let index = 0; index < counterContent?.metrics.length; index++) {
					// Title.
					if ( counterContent?.metrics?.[index]?.['title-short'] ) {
						content = content.replace( "Stat title", counterContent?.metrics?.[index]?.['title-short'] );
					}
					// Price.
					if ( counterContent?.metrics?.[index]?.['value-short'] ) {
						if ( 0 === index ) {
							content = content.replace( "50%", counterContent?.metrics?.[index]?.['value-short'] );
						} else if ( 1 === index ) {
							content = content.replace( "98%", counterContent?.metrics?.[index]?.['value-short'] );
						} else if ( 2 === index ) {
							content = content.replace( "100,110", counterContent?.metrics?.[index]?.['value-short'] );
						} else if ( 3 === index ) {
							content = content.replace( "8/mo", counterContent?.metrics?.[index]?.['value-short'] );
						} else if ( 4 === index ) {
							content = content.replace( "20yr", counterContent?.metrics?.[index]?.['value-short'] );
						}
					}
				}
			}
			// List
			if ( listContent?.list ) {
				for (let index = 0; index < listContent?.list.length; index++) {
					// list item.
					if ( listContent?.list?.[index]?.['list-item-short'] ) {
						content = content.replace( "Add a single and succinct list item", listContent?.list?.[index]?.['list-item-short'] );
						if ( ! isHTML ) {
							content = content.replace( "Add a single and succinct list item", listContent?.list?.[index]?.['list-item-short'] );
						}
					}
					// list item long.
					if ( listContent?.list?.[index]?.['list-item-long'] ) {
						content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", listContent?.list?.[index]?.['list-item-long'] );
						if ( ! isHTML ) {
							content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", listContent?.list?.[index]?.['list-item-long'] );
						}
					}
				}
			}
			break;
		case "list":
			// Headline Short.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Write a short and relevant headline/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Write a clear and relevant header to keep your visitors engaged/g, baseContent?.heading?.medium );
			}
			// Paragraph medium
			if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, baseContent?.sentence?.medium );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline text/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Columns
			if ( columnsContent?.columns ) {
				for (let index = 0; index < columnsContent?.columns.length; index++) {
					// Title.
					if ( columnsContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Give your list item a title", columnsContent?.columns?.[index]?.['title-medium'] );
					}
					// Sentence Short.
					if ( columnsContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this short paragraph to write a supporting description of your list item. Remember to let your readers know why this list item is essential.", columnsContent?.columns?.[index]?.['sentence-short'] );
					}
				}
			}
			// List
			if ( listContent?.list ) {
				for (let index = 0; index < listContent?.list.length; index++) {
					// list item.
					if ( listContent?.list?.[index]?.['list-item-short'] ) {
						content = content.replace( "Add a single and succinct list item", listContent?.list?.[index]?.['list-item-short'] );
						if ( ! isHTML ) {
							content = content.replace( "Add a single and succinct list item", listContent?.list?.[index]?.['list-item-short'] );
						}
					}
					// list item long.
					if ( listContent?.list?.[index]?.['list-item-long'] ) {
						content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", listContent?.list?.[index]?.['list-item-long'] );
						if ( ! isHTML ) {
							content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", listContent?.list?.[index]?.['list-item-long'] );
						}
					}
				}
			}
			break;
		case "slider":
			// Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Short Headline/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title to attract your audience./g, baseContent?.heading?.medium );
			}
			// Headline.
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, baseContent?.sentence?.short );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			break;
		case "post-loop":
			const postLoopContent = contextAI.find( x => x.id === context + '-post-loop' );
			// Headline.
			if ( postLoopContent?.heading?.short ) {
				content = content.replace( /Selected posts title/g, postLoopContent?.heading?.short );
			} else if ( baseContent?.heading?.short ) {
				content = content.replace( /Selected posts title/g, baseContent?.heading?.short );
			}
			// Headline.
			if ( postLoopContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, postLoopContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, baseContent?.heading?.medium );
			}
			// Headline.
			if ( postLoopContent?.sentence?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, postLoopContent?.sentence?.short );
			} else if ( baseContent?.sentence?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, baseContent?.sentence?.short );
			}
			// overline
			if ( postLoopContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, postLoopContent?.overline?.short );
				content = content.replace( /Add an overline/g, postLoopContent?.overline?.short );
				content = content.replace( /Overline/g, postLoopContent?.overline?.short );
			} else if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( postLoopContent?.button?.short ) {
				content = content.replace( /Call To Action/g, postLoopContent?.button?.short );
				content = content.replace( /Call to Action/g, postLoopContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			break;
		case "team":
			const peopleContent = contextAI.find( x => x.id === context + '-people' );
			// Headline.
			if ( peopleContent?.heading?.medium ) {
				content = content.replace( /A short and sweet title for this section./g, peopleContent?.heading?.medium );
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, peopleContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /A short and sweet title for this section./g, baseContent?.heading?.medium );
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, baseContent?.heading?.medium );
			}
			// Headline.
			if ( peopleContent?.sentence?.short ) {
				content = content.replace( /Use this space to write about your company, employee profiles and organizational culture; share your story and connect with customers./g, peopleContent?.sentence?.short );
			} else if ( baseContent?.sentence?.short ) {
				content = content.replace( /Use this space to write about your company, employee profiles and organizational culture; share your story and connect with customers./g, baseContent?.sentence?.short );
			}
			// overline
			if ( peopleContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, peopleContent?.overline?.short );
				content = content.replace( /Add an overline/g, peopleContent?.overline?.short );
				content = content.replace( /Overline/g, peopleContent?.overline?.short );
			} else if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( peopleContent?.button?.short ) {
				content = content.replace( /Call To Action/g, peopleContent?.button?.short );
				content = content.replace( /Call to Action/g, peopleContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// People.
			if ( peopleContent?.people ) {
				for (let index = 0; index < peopleContent?.people.length; index++) {
					// Name.
					if ( peopleContent?.people?.[index]?.['name'] ) {
						content = content.replace( "Name Lastname", peopleContent?.people?.[index]?.['name'] );
					}
					// position.
					if ( peopleContent?.people?.[index]?.['position'] ) {
						content = content.replace( "Position or title", peopleContent?.people?.[index]?.['position'] );
					}
					// sentence.
					if ( peopleContent?.people?.[index]?.['sentence-short'] ) {
						content = content.replace( "Brief profile bio for this person will live here. Add an overview of this person's role or any key information.", peopleContent?.people?.[index]?.['sentence-short'] );
						content = content.replace( "Brief profile bio for this person will live here. Add an overview of this person’s role or any key information.", peopleContent?.people?.[index]?.['sentence-short'] );
					}
				}
			}
			break;
		case "logo-farm":
			// Headline.
			if ( baseContent?.heading?.medium ) {
				content = content.replace( /Tell your audience about your achievements, partners or customers./g, baseContent?.heading?.medium );
			}
			// overline
			if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			break;
		case "location":
			// Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Find us/g, baseContent?.heading?.short );
			}
			// Sentence.
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Use a brief and inviting sentence to encourage visitors to get in touch./g, baseContent?.sentence?.short );
			}
			break;
		case "gallery":
			// Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Add a succinct headline/g, baseContent?.heading?.short );
			}
			// Sentence.
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Write with clear, concise language to inform and engage your audience. Consider what matters to them and provide valuable insights./g, baseContent?.sentence?.short );
			}
			break;
		case "featured-products":
			const featuredContent = contextAI.find( x => x.id === context + '-single' );
			// Headline.
			if ( featuredContent?.heading?.medium ) {
				content = content.replace( /An engaging product or feature headline here/g, featuredContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /An engaging product or feature headline here/g, baseContent?.heading?.medium );
			}
			// Sentence.
			if ( featuredContent?.sentence?.medium ) {
				content = content.replace( /Write a short descriptive paragraph about your product. Focus on your ideal buyer. Entice with benefits of using your product./g, featuredContent?.sentence?.medium );
			} else if ( baseContent?.sentence?.medium ) {
				content = content.replace( /Write a short descriptive paragraph about your product. Focus on your ideal buyer. Entice with benefits of using your product./g, baseContent?.sentence?.medium );
			}
			// price.
			if ( featuredContent?.price ) {
				content = content.replace( /$19.99/g, featuredContent?.price );
			}
			// Button
			if ( featuredContent?.button?.short ) {
				content = content.replace( /Call To Action/g, featuredContent?.button?.short );
				content = content.replace( /Call to Action/g, featuredContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Benefits.
			if ( featuredContent?.['product-features-and-benefits'] ) {
				for (let index = 0; index < featuredContent?.['product-features-and-benefits'].length; index++) {
					// Item.
					if (index % 2 !== 0) {
						if ( featuredContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] ) {
							content = content.replace( "Another short feature description", featuredContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] );
						}
					} else {
						if ( featuredContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] ) {
							content = content.replace( "Short feature description", featuredContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] );
						}
					}
				}
			}
			break;
		case "form":
			// Headline.
			if ( baseContent?.heading?.short ) {
				content = content.replace( /Add A Title For Your Form/g, baseContent?.heading?.short );
				content = content.replace( /Contact Us/g, baseContent?.heading?.short );
			}
			// Sentence.
			if ( baseContent?.sentence?.short ) {
				content = content.replace( /Briefly describe what the form is for or provide additional context if required. Use inviting language./g, baseContent?.sentence?.short );
			}
			break;
		case "table-of-contents":
			const tocContent = contextAI.find( x => x.id === context + '-table-contents' );
			// Headline.
			if ( tocContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, tocContent?.heading?.medium );
			} else if ( baseContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, baseContent?.heading?.medium );
			}
			// overline
			if ( tocContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, tocContent?.overline?.short );
				content = content.replace( /Add an overline/g, tocContent?.overline?.short );
				content = content.replace( /Overline/g, tocContent?.overline?.short );
			} else if ( baseContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, baseContent?.overline?.short );
				content = content.replace( /Add an overline/g, baseContent?.overline?.short );
				content = content.replace( /Overline/g, baseContent?.overline?.short );
			}
			// Button
			if ( tocContent?.button?.short ) {
				content = content.replace( /Call To Action/g, tocContent?.button?.short );
				content = content.replace( /Call to Action/g, tocContent?.button?.short );
			} else if ( baseContent?.button?.short ) {
				content = content.replace( /Call To Action/g, baseContent?.button?.short );
				content = content.replace( /Call to Action/g, baseContent?.button?.short );
			}
			// Subtitles.
			if ( tocContent?.subtitles ) {
				for (let index = 0; index < tocContent?.subtitles.length; index++) {
					// Title.
					if ( tocContent?.subtitles?.[index]?.['title-short'] ) {
						content = content.replace( "Write a title for your section or related content here", tocContent?.subtitles?.[index]?.['title-short'] );
					}
				}
			}
			break;
		default:
			break;
	}
	
	return content;
}
