/**
 * WordPress dependencies
 */
export default function replaceContent( content, aiContent, categories, context, variation ) {
	if ( ! content ) {
		return content;
	}
	if ( ! aiContent?.[context]?.content ) {
		return content;
	}
	const currentCategory = categories?.[0] ? categories[0] : '';
	const contextAI = aiContent?.[context]?.content;
	const base_aiContent = contextAI.find( x => x.id === context );
	switch (currentCategory) {
		case "columns":
			const columns_aiContent = contextAI.find( x => x.id === context + '-columns' );
			// Headline.
			if ( columns_aiContent?.heading?.short ) {
				content = content.replace( /Write a short headline/g, columns_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Write a short headline/g, base_aiContent?.heading?.[0]?.short );
			}
			// Headline.
			if ( columns_aiContent?.heading?.medium ) {
				content = content.replace( /Compose a captivating title for this section./g, columns_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Compose a captivating title for this section./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Paragraph
			if ( columns_aiContent?.sentence?.short ) {
				content = content.replace( /Support your idea with a clear, descriptive sentence or phrase that has a consistent writing style./g, columns_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Support your idea with a clear, descriptive sentence or phrase that has a consistent writing style./g, base_aiContent?.sentence?.[0]?.short );
			}
			if ( columns_aiContent?.columns ) {
				for (let index = 0; index < columns_aiContent?.columns.length; index++) {
					// Title.
					if ( columns_aiContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a descriptive title for the column.", columns_aiContent?.columns?.[index]?.['title-medium'] );
					}
					// Paragraph.
					if ( columns_aiContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", columns_aiContent?.columns?.[index]?.['sentence-short'] );
					}
				}
			}
			break;
		case "text":
			// Text uses columns ai content.
			const text_aiContent = contextAI.find( x => x.id === context + '-columns' );
			// Headline Short.
			if ( text_aiContent?.heading?.short ) {
				content = content.replace( /Type a short headline/g, text_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Type a short headline/g, base_aiContent?.heading?.[0]?.short );
			}
			// Headline.
			if ( text_aiContent?.heading?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, text_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Paragraph
			if ( text_aiContent?.sentence?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do./g, text_aiContent?.sentence?.short );
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging./g, text_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. /g, base_aiContent?.sentence?.[0]?.short );
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging./g, base_aiContent?.sentence?.[0]?.short );
			}
			// Paragraph Medium
			if ( text_aiContent?.sentence?.medium ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, text_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors. /g, base_aiContent?.sentence?.[0]?.medium );
			}
			// Paragraph long
			if ( text_aiContent?.sentence?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Write about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style. Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, text_aiContent?.sentence?.long );
			} else if ( base_aiContent?.sentence?.[0]?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Write about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style. Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, base_aiContent?.sentence?.[0]?.long );
			}
			// overline
			if ( text_aiContent?.overline?.short ) {
				content = content.replace( /2018 - Current/g, text_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, text_aiContent?.overline?.short );
				content = content.replace( /Overline/g, text_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /2018 - Current/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( text_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, text_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, text_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			if ( text_aiContent?.columns ) {
				for (let index = 0; index < text_aiContent?.columns.length; index++) {
					// Title.
					if ( text_aiContent?.columns?.[index]?.['title-short'] ) {
						content = content.replace( "Add a short title", text_aiContent?.columns?.[index]?.['title-short'] );
					}
					// Paragraph.
					if ( text_aiContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this space to add a short description.", text_aiContent?.columns?.[index]?.['sentence-short'] );
					}
					// Paragraph medium.
					if ( text_aiContent?.columns?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn their attention.", text_aiContent?.columns?.[index]?.['sentence-medium'] );
					}
				}
			}
			break;
		case "hero":
			const hero_aiContent = contextAI.find( x => x.id === context + '-hero' );
			// Headline.
			if ( hero_aiContent?.heading?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, hero_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[1]?.medium ) {
				content = content.replace( /Briefly and concisely explain what you do for your audience./g, base_aiContent?.heading?.[1]?.medium );
			}
			// Short Headline.
			if ( hero_aiContent?.heading?.short ) {
				content = content.replace( /Write a brief title/g, hero_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Write a brief title/g, base_aiContent?.heading?.[1]?.short );
			}
			// overline
			if ( hero_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, hero_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, hero_aiContent?.overline?.short );
				content = content.replace( /Overline/g, hero_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Paragraph
			if ( hero_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, hero_aiContent?.sentence?.[0]?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, base_aiContent?.sentence?.[0]?.short );
			}
			// Button
			if ( hero_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, hero_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, hero_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Secondary Button
			if ( hero_aiContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, hero_aiContent?.button?.short );
			} else if ( base_aiContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, base_aiContent?.button?.short );
			}
			// Cards 
			if ( hero_aiContent?.cards ) {
				for (let index = 0; index < hero_aiContent?.cards.length; index++) {
					// Title.
					if ( hero_aiContent?.cards?.[index]?.['title-short'] ) {
						content = content.replace( "Add a Title", hero_aiContent?.cards?.[index]?.['title-short']);
					}
					// Paragraph.
					if ( hero_aiContent?.cards?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this space to add a short description.", hero_aiContent?.cards?.[index]?.['sentence-short']);
					}
					// Paragraph medium.
					if ( hero_aiContent?.cards?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn a click.", hero_aiContent?.cards?.[index]?.['sentence-medium'])
					}
					// Button.
					if ( hero_aiContent?.cards?.[index]?.['button-short'] ) {
						content = content.replace( "Call to Action", hero_aiContent?.cards?.[index]?.['button-short']);
						content = content.replace( "Call To Action", hero_aiContent?.cards?.[index]?.['button-short']);
					}
				}
			}
			break;
		case "image":
			const image_aiContent = contextAI.find( x => x.id === context + '-image' );
			// Headline.
			if ( image_aiContent?.heading?.medium ) {
				content = content.replace( /Add a short, consistent heading for your image./g, image_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[1]?.medium ) {
				content = content.replace( /Add a short, consistent heading for your image./g, base_aiContent?.heading?.[1]?.medium );
			}
			// Short Headline.
			if ( image_aiContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, image_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Add a short headline/g, base_aiContent?.heading?.[1]?.short );
			}
			// Paragraph
			if ( image_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use this paragraph to add supporting context. Consider your audience and what matters to them, and provide insights that support your topic./g, image_aiContent?.sentence?.[0]?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use this paragraph to add supporting context. Consider your audience and what matters to them, and provide insights that support your topic./g, base_aiContent?.sentence?.[0]?.short );
			}
			// Button
			if ( image_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, image_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, image_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			break;
		case "title-or-header":
			// Title Uses Hero AI Content
			const title_aiContent = contextAI.find( x => x.id === context + '-hero' );
			// Headline.
			if ( title_aiContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, title_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[1]?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, base_aiContent?.heading?.[1]?.medium );
			}
			// Short Headline.
			if ( title_aiContent?.heading?.short ) {
				content = content.replace( /Add a short & sweet headline/g, title_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Add a short & sweet headline/g, base_aiContent?.heading?.[1]?.short );
			}
			// overline
			if ( title_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, title_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, title_aiContent?.overline?.short );
				content = content.replace( /Overline/g, title_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( title_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, title_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, title_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			break;
		case "media-text":
			const media_aiContent = contextAI.find( x => x.id === context + '-media-text' );
			// Headline.
			if ( media_aiContent?.heading?.short ) {
				content = content.replace( /Write a short headline/g, media_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Write a short headline/g, base_aiContent?.heading?.[1]?.short );
			}
			// Headline.
			if ( media_aiContent?.heading?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, media_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[1]?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, base_aiContent?.heading?.[1]?.medium );
			}
			// Paragraph
			if ( media_aiContent?.sentence?.short ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, media_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, base_aiContent?.sentence?.[0]?.short );
			}
			// overline
			if ( media_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, media_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, media_aiContent?.overline?.short );
				content = content.replace( /Overline/g, media_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( media_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, media_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, media_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Secondary Button
			if ( media_aiContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, media_aiContent?.['secondary-button']?.short );
			} else if ( base_aiContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, base_aiContent?.['secondary-button']?.short );
			}
			// List
			if ( media_aiContent?.list ) {
				for (let index = 0; index < media_aiContent?.list.length; index++) {
					// List Item.
					if ( media_aiContent?.list?.[index]?.['list-item-short'] ) {
						content = content.replace( "Add a list item", media_aiContent?.list?.[index]?.['list-item-short']);
					}
				}
			}
			break;
		case "accordion":
			const accordion_aiContent = contextAI.find( x => x.id === context + '-accordion' );
			// Headline short.
			if ( accordion_aiContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, accordion_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Add a short headline/g, base_aiContent?.heading?.[1]?.short );
			}
			// Headline.
			if ( accordion_aiContent?.heading?.medium ) {
				content = content.replace( /A brief headline here will add context for the section/g, accordion_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[1]?.medium ) {
				content = content.replace( /A brief headline here will add context for the section/g, base_aiContent?.heading?.[1]?.medium );
			}
			// Paragraph
			if ( accordion_aiContent?.sentence?.medium ) {
				content = content.replace( /Use this space to provide your website visitors with a brief description on what to expect before clicking on a section title./g, accordion_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /Use this space to provide your website visitors with a brief description on what to expect before clicking on a section title./g, base_aiContent?.sentence?.[0]?.medium );
			}
			// Accordion
			if ( accordion_aiContent?.accordion ) {
				for (let index = 0; index < accordion_aiContent?.accordion.length; index++) {
					// Title.
					if ( accordion_aiContent?.accordion?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a section title that is relevant for your readers.", accordion_aiContent?.accordion?.[index]?.['title-medium']);
					}
					// Paragraph.
					if ( accordion_aiContent?.accordion?.[index]?.['paragraph-medium'] ) {
						content = content.replace( "By default, this panel is concealed and appears when the user clicks on the section title. Input relevant information about its title using paragraphs or bullet points. Accordions can enhance the user experience when utilized effectively. They allow users to choose what they want to read and disregard the rest. Accordions are often utilized for frequently asked questions (FAQs).", accordion_aiContent?.accordion?.[index]?.['paragraph-medium']);
					}
				}
			}
			break;
		case "tabs":
			const tabs_aiContent = contextAI.find( x => x.id === context + '-tabs' );
			// Headline short.
			if ( tabs_aiContent?.heading?.short ) {
				content = content.replace( /Add a short headline/g, tabs_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Add a short headline/g, base_aiContent?.heading?.[1]?.short );
			}
			// Sentence.
			if ( tabs_aiContent?.sentence?.medium ) {
				content = content.replace( /Tabs are a helpful way that allow users to view a group of related data one at a time. Add a brief description of what your tabbed section is about./g, tabs_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[1]?.medium ) {
				content = content.replace( /Tabs are a helpful way that allow users to view a group of related data one at a time. Add a brief description of what your tabbed section is about./g, base_aiContent?.sentence?.[1]?.medium );
			}
			// overline
			if ( tabs_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, tabs_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, tabs_aiContent?.overline?.short );
				content = content.replace( /Overline/g, tabs_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( tabs_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, tabs_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, tabs_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Tabs
			if ( tabs_aiContent?.tabs ) {
				for (let index = 0; index < tabs_aiContent?.tabs.length; index++) {
					// Title.
					if ( tabs_aiContent?.tabs?.[index]?.['title-short'] ) {
						content = content.replace( "Tab name", tabs_aiContent?.tabs?.[index]?.['title-short']);
						content = content.replace( "Add a brief title", tabs_aiContent?.tabs?.[index]?.['title-short']);
						content = content.replace( "Short title", tabs_aiContent?.tabs?.[index]?.['title-short']);
					}
					// Title Medium.
					if ( tabs_aiContent?.tabs?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a brief title here", tabs_aiContent?.tabs?.[index]?.['title-medium']);
						content = content.replace( "Give this tab a concise name", tabs_aiContent?.tabs?.[index]?.['title-medium']);
						content = content.replace( "Add a descriptive title for the column.", tabs_aiContent?.tabs?.[index]?.['title-medium']);
					}
					// Title Long.
					if ( tabs_aiContent?.tabs?.[index]?.['title-long'] ) {
						content = content.replace( "Type a brief and clear title for this panel.", tabs_aiContent?.tabs?.[index]?.['title-long']);
					}
					// Overline.
					if ( tabs_aiContent?.tabs?.[index]?.['overline-short'] ) {
						content = content.replace( "Overline", tabs_aiContent?.tabs?.[index]?.['overline-short']);
					}
					// Button.
					if ( tabs_aiContent?.tabs?.[index]?.['button-short'] ) {
						content = content.replace( "Call To Action", tabs_aiContent?.tabs?.[index]?.['button-short']);
					}
					// List Title.
					if ( tabs_aiContent?.tabs?.[index]?.['list-title'] ) {
						content = content.replace( "Featured subhead", tabs_aiContent?.tabs?.[index]?.['list-title']);
					}
					// List Item 1.
					if ( tabs_aiContent?.tabs?.[index]?.['list-item-1'] ) {
						content = content.replace( "Add a single and succinct list item", tabs_aiContent?.tabs?.[index]?.['list-item-1']);
						content = content.replace( "Add a single and succinct list item", tabs_aiContent?.tabs?.[index]?.['list-item-1']);
					}
					// List Item 2.
					if ( tabs_aiContent?.tabs?.[index]?.['list-item-2'] ) {
						content = content.replace( "Add a descriptive title for the column.", tabs_aiContent?.tabs?.[index]?.['list-item-2']);
						content = content.replace( "Add a descriptive title for the column.", tabs_aiContent?.tabs?.[index]?.['list-item-2']);
					}
					// List Item 3.
					if ( tabs_aiContent?.tabs?.[index]?.['list-item-3'] ) {
						content = content.replace( "Add a single and succinct list item", tabs_aiContent?.tabs?.[index]?.['list-item-3']);
						content = content.replace( "Add a single and succinct list item", tabs_aiContent?.tabs?.[index]?.['list-item-3']);
					}
					// Description 1.
					if ( tabs_aiContent?.tabs?.[index]?.['description-1'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", tabs_aiContent?.tabs?.[index]?.['description-1']);
						content = content.replace( "Write a short descriptive paragraph about your tab that will help users find what they are looking for and get access to content without further exploration.", tabs_aiContent?.tabs?.[index]?.['description-1']);
						content = content.replace( "Write a short text about your tab that will help users find what they are looking for and get access to content without further exploration.", tabs_aiContent?.tabs?.[index]?.['description-1']);
					}
					// Description 2.
					if ( tabs_aiContent?.tabs?.[index]?.['description-1'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", tabs_aiContent?.tabs?.[index]?.['description-1']);
						content = content.replace( "This panel is hidden by default and revealed when a user clicks on the tab title. Fill it in with relevant information about its title. You can use paragraphs or bullet points to add your content here.", tabs_aiContent?.tabs?.[index]?.['description-1']);
					}
					// Description 3.
					if ( tabs_aiContent?.tabs?.[index]?.['description-1'] ) {
						content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", tabs_aiContent?.tabs?.[index]?.['description-1']);
						content = content.replace( "Tabs help users navigate through grouped content giving them control over what to read. Use them to connect related information and as a tool to save space.", tabs_aiContent?.tabs?.[index]?.['description-1']);
					}
				}
			}
			break;
		case "video":
			const video_aiContent = contextAI.find( x => x.id === context + '-video' );
			// Headline.
			if ( video_aiContent?.heading?.medium ) {
				content = content.replace( /Add a brief headline for impact and \/ or context here/g, video_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[1]?.medium ) {
				content = content.replace( /Add a brief headline for impact and \/ or context here/g, base_aiContent?.heading?.[1]?.medium );
			}
			// Headline short.
			if ( video_aiContent?.heading?.short ) {
				content = content.replace( /Write a succinct headline here/g, video_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[1]?.short ) {
				content = content.replace( /Write a succinct headline here/g, base_aiContent?.heading?.[1]?.short );
			}
			// Headline Long.
			if ( video_aiContent?.heading?.long ) {
				content = content.replace( /Write a compelling and inviting headline to re-hook your visitors through your content./g, video_aiContent?.heading?.long );
			} else if ( base_aiContent?.heading?.[1]?.long ) {
				content = content.replace( /Write a compelling and inviting headline to re-hook your visitors through your content./g, base_aiContent?.heading?.[1]?.long );
			}
			// Sentence
			if ( video_aiContent?.sentence?.medium ) {
				content = content.replace( /Use this paragraph to provide more insights writing with clear and concise language that is easy to understand. Edit and proofread your content./g, video_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /Use this paragraph to provide more insights writing with clear and concise language that is easy to understand. Edit and proofread your content./g, base_aiContent?.sentence?.[0]?.medium );
			}
			// Sentence Short
			if ( video_aiContent?.sentence?.short ) {
				content = content.replace( /Support your idea with a clear, descriptive sentence or phrase that has a consistent writing style./g, video_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Support your idea with a clear, descriptive sentence or phrase that has a consistent writing style./g, base_aiContent?.sentence?.[0]?.short );
			}
			// overline
			if ( video_aiContent?.overline?.short ) {
				content = content.replace( /Add an overline text/g, video_aiContent?.overline?.short );
				content = content.replace( /Overline/g, video_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( video_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, video_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, video_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// video Title.
			if ( video_aiContent?.videos ) {
				for (let index = 0; index < video_aiContent?.videos.length; index++) {
					// Title.
					if ( video_aiContent?.videos?.[index]?.['title-short'] ) {
						content = content.replace( "Short title", video_aiContent?.videos?.[index]?.['title-short']);
					}
				}
			}
			break;
		case "cards":
			// Cards uses the same AI content as columns.
			const cards_aiContent = contextAI.find( x => x.id === context + '-columns' );
			// Headline.
			if ( cards_aiContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, cards_aiContent?.heading?.medium );
				content = content.replace( /A short and sweet title for this section./g, cards_aiContent?.heading?.medium );
			}
			// Paragraph
			if ( cards_aiContent?.paragraph?.medium ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, cards_aiContent?.paragraph?.medium );
			}
			// overline
			if ( cards_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, cards_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, cards_aiContent?.overline?.short );
				content = content.replace( /Overline/g, cards_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( cards_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, cards_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, cards_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Secondary Button
			if ( cards_aiContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, cards_aiContent?.['secondary-button']?.short );
			} else if ( base_aiContent?.['secondary-button']?.short ) {
				content = content.replace( /Secondary Button/g, base_aiContent?.['secondary-button']?.short );
			}
			// Cards 
			if ( cards_aiContent?.columns ) {
				for (let index = 0; index < cards_aiContent?.columns.length; index++) {
					// Title.
					if ( cards_aiContent?.columns?.[index]?.['title-short'] ) {
						content = content.replace( "Add a Title", cards_aiContent?.columns?.[index]?.['title-short'] );
					}
					// Title.
					if ( cards_aiContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a Short Title Here", cards_aiContent?.columns?.[index]?.['title-medium'] );
					}
					// Paragraph.
					if ( cards_aiContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this space to add a short description. It gives enough info to earn a click.", cards_aiContent?.columns?.[index]?.['sentence-short'] );
						content = content.replace( "Add a brief description to your card. ", cards_aiContent?.columns?.[index]?.['sentence-short'] );
					}
					// Paragraph.
					if ( cards_aiContent?.columns?.[index]?.['sentence-medium'] ) {
						content = content.replace( "Use this space to add a medium length description. Be brief and give enough information to earn a click.", cards_aiContent?.columns?.[index]?.['sentence-medium'] );
					}
					// overline.
					if ( cards_aiContent?.columns?.[index]?.['overline-short'] ) {
						content = content.replace( "Overline", cards_aiContent?.columns?.[index]?.['overline-short'] );
					}
					// button.
					if ( cards_aiContent?.columns?.[index]?.['button-short'] ) {
						content = content.replace( "Call To Action", cards_aiContent?.columns?.[index]?.['button-short'] );
						content = content.replace( "Call to Action", cards_aiContent?.columns?.[index]?.['button-short'] );
					}
				}
			}
			break;
		case "testimonials":
			const testimonial_aiContent = contextAI.find( x => x.id === context + '-testimonials' );
			// Headline.
			if ( testimonial_aiContent?.heading?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, testimonial_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Paragraph long
			if ( testimonial_aiContent?.sentence?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, testimonial_aiContent?.sentence?.long );
			} else if ( base_aiContent?.sentence?.[0]?.long ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, base_aiContent?.sentence?.[0]?.long );
			}
			if ( testimonial_aiContent?.testimonials ) {
				for (let index = 0; index < testimonial_aiContent?.testimonials.length; index++) {
					// Title.
					if ( testimonial_aiContent?.testimonials?.[index]?.['customer'] ) {
						content = content.replace( "Customer Name", testimonial_aiContent?.testimonials?.[index]?.['customer'] );
					}
					// Testimonial.
					if ( testimonial_aiContent?.testimonials?.[index]?.['testimonial'] ) {
						content = content.replace( "Testimonials are a social proof, a powerful way to inspire trust.", testimonial_aiContent?.testimonials?.[index]?.['testimonial'] );
					}
				}
			}
			break;
		case "pricing-table":
			const pricing_table_aiContent = contextAI.find( x => x.id === context );
			// Headline.
			if ( pricing_table_aiContent?.heading?.short ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, pricing_table_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Add a compelling title for your section to engage your audience./g, base_aiContent?.heading?.[0]?.short );
			}
			// Paragraph short
			if ( pricing_table_aiContent?.sentence?.short ) {
				content = content.replace( /Add a gripping description for this featured plan/g, pricing_table_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Add a gripping description for this featured plan/g, base_aiContent?.sentence?.[0]?.short );
			}
			// Paragraph medium
			if ( pricing_table_aiContent?.sentence?.medium ) {
				content = content.replace( /A pricing table assists users in selecting a suitable plan by simply and clearly differentiating product\/service features and prices. Use this as supporting text for your plans./g, pricing_table_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /A pricing table assists users in selecting a suitable plan by simply and clearly differentiating product\/service features and prices. Use this as supporting text for your plans./g, base_aiContent?.sentence?.[0]?.medium );
			}
			// Paragraph long
			if ( pricing_table_aiContent?.sentence?.long ) {
				content = content.replace( /Let your user know what to expect when choosing this plan. Inform users of plan benefits, not features./g, pricing_table_aiContent?.sentence?.long );
			} else if ( base_aiContent?.sentence?.[0]?.long ) {
				content = content.replace( /Let your user know what to expect when choosing this plan. Inform users of plan benefits, not features./g, base_aiContent?.sentence?.[0]?.long );
			}
			if ( pricing_table_aiContent?.plans ) {
				for (let index = 0; index < pricing_table_aiContent?.plans.length; index++) {
					// Title.
					if ( pricing_table_aiContent?.plans?.[index]?.['title-short'] ) {
						content = content.replace( "Tab Title", pricing_table_aiContent?.plans?.[index]?.['title-short'] );
						content = content.replace( "Name your plan", pricing_table_aiContent?.plans?.[index]?.['title-short'] );
					}
					// Title.
					if ( pricing_table_aiContent?.plans?.[index]?.['title-medium'] ) {
						content = content.replace( "Add a descriptive title for your plan.", pricing_table_aiContent?.plans?.[index]?.['title-medium'] );
					}
					// Sentence Short.
					if ( pricing_table_aiContent?.plans?.[index]?.['sentence-short'] ) {
						content = content.replace( "Let your user know what to expect when choosing this plan. Inform users of plan benefits, not features.", pricing_table_aiContent?.plans?.[index]?.['sentence-short'] );
					}
					// Price.
					if ( pricing_table_aiContent?.plans?.[index]?.['price'] ) {
						content = content.replace( "$60", pricing_table_aiContent?.plans?.[index]?.['price'] );
						content = content.replace( "$80", pricing_table_aiContent?.plans?.[index]?.['price'] );
						content = content.replace( "$200", pricing_table_aiContent?.plans?.[index]?.['price'] );
						content = content.replace( "$120", pricing_table_aiContent?.plans?.[index]?.['price'] );
					}
					// Buttons.
					if ( pricing_table_aiContent?.plans?.[index]?.['button-short'] ) {
						content = content.replace( "Call To Action", pricing_table_aiContent?.plans?.[index]?.['button-short'] );
					}
					// Feature 1.
					if ( pricing_table_aiContent?.plans?.[index]?.['feature-1'] ) {
						content = content.replace( "Focus on the differences", pricing_table_aiContent?.plans?.[index]?.['feature-1'] );
						content = content.replace( "Focus on the differences", pricing_table_aiContent?.plans?.[index]?.['feature-1'] );
					}
					// Feature 2.
					if ( pricing_table_aiContent?.plans?.[index]?.['feature-2'] ) {
						content = content.replace( "Use a consistent language", pricing_table_aiContent?.plans?.[index]?.['feature-2'] );
						content = content.replace( "Use a consistent language", pricing_table_aiContent?.plans?.[index]?.['feature-2'] );
					}
					// Feature 2.
					if ( pricing_table_aiContent?.plans?.[index]?.['feature-3'] ) {
						content = content.replace( "Transmit benefits clearly", pricing_table_aiContent?.plans?.[index]?.['feature-3'] );
						content = content.replace( "Transmit benefits clearly", pricing_table_aiContent?.plans?.[index]?.['feature-3'] );
					}
				}
			}
			break;
		case "counter-or-stats":
			const counter_aiContent = contextAI.find( x => x.id === context + '-counter-stats' );
			const counter_list_aiContent = contextAI.find( x => x.id === context + '-list' );
			// Headline.
			if ( counter_aiContent?.heading?.medium ) {
				content = content.replace( /Tell your story in numbers, and give your visitors useful insights./g, counter_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Tell your story in numbers, and give your visitors useful insights./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Paragraph medium
			if ( counter_aiContent?.sentence?.medium ) {
				content = content.replace( /Make an impact, and share your organization's stats or achievements to interest your website visitors into learning more about you./g, counter_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /Make an impact, and share your organization's stats or achievements to interest your website visitors into learning more about you./g, base_aiContent?.sentence?.[0]?.medium );
			}
			// overline
			if ( counter_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, counter_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, counter_aiContent?.overline?.short );
				content = content.replace( /Overline/g, counter_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( counter_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, counter_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, counter_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Metrics
			if ( counter_aiContent?.metrics ) {
				for (let index = 0; index < counter_aiContent?.metrics.length; index++) {
					// Title.
					if ( counter_aiContent?.metrics?.[index]?.['title-short'] ) {
						content = content.replace( "Stat Title", counter_aiContent?.metrics?.[index]?.['title-short'] );
					}
					// Price.
					if ( counter_aiContent?.metrics?.[index]?.['value-short'] ) {
						content = content.replace( "50%", counter_aiContent?.metrics?.[index]?.['value-short'] );
						content = content.replace( "98", counter_aiContent?.metrics?.[index]?.['value-short'] );
						content = content.replace( "8/mo", counter_aiContent?.metrics?.[index]?.['value-short'] );
						content = content.replace( "100,110", counter_aiContent?.metrics?.[index]?.['value-short'] );
						content = content.replace( "20yr", counter_aiContent?.metrics?.[index]?.['value-short'] );
					}
				}
			}
			// List
			if ( counter_list_aiContent?.list ) {
				for (let index = 0; index < counter_list_aiContent?.list.length; index++) {
					// list item.
					if ( counter_list_aiContent?.list?.[index]?.['list-item-short'] ) {
						content = content.replace( "Add a single and succinct list item", counter_list_aiContent?.list?.[index]?.['list-item-short'] );
						content = content.replace( "Add a single and succinct list item", counter_list_aiContent?.list?.[index]?.['list-item-short'] );
					}
					// list item long.
					if ( counter_list_aiContent?.list?.[index]?.['list-item-long'] ) {
						content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", counter_list_aiContent?.list?.[index]?.['list-item-long'] );
						content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", counter_list_aiContent?.list?.[index]?.['list-item-long'] );
					}
				}
			}
			break;
		case "list":
			const list_aiContent = contextAI.find( x => x.id === context + '-list' );
			const list_columns_aiContent = contextAI.find( x => x.id === context + '-columns' );
			// Headline Short.
			if ( list_aiContent?.heading?.short ) {
				content = content.replace( /Write a short and relevant headline/g, list_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Write a short and relevant headline/g, base_aiContent?.heading?.[0]?.short );
			}
			// Headline.
			if ( list_aiContent?.heading?.medium ) {
				content = content.replace( /Write a clear and relevant header to keep your visitors engaged/g, list_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Write a clear and relevant header to keep your visitors engaged/g, base_aiContent?.heading?.[0]?.medium );
			}
			// Paragraph medium
			if ( list_aiContent?.sentence?.medium ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, list_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, base_aiContent?.sentence?.[0]?.medium );
			}
			// overline
			if ( list_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, list_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, list_aiContent?.overline?.short );
				content = content.replace( /Overline/g, list_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE TEXT/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline text/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( list_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, list_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, list_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Columns
			if ( list_aiContent?.columns ) {
				for (let index = 0; index < list_aiContent?.columns.length; index++) {
					// Title.
					if ( list_aiContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Give your list item a title", list_aiContent?.columns?.[index]?.['title-medium'] );
					}
					// Sentence Short.
					if ( list_aiContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this short paragraph to write a supporting description of your list item. Remember to let your readers know why this list item is essential.", list_aiContent?.columns?.[index]?.['sentence-short'] );
					}
				}
			}
			// Columns
			if ( list_columns_aiContent?.columns ) {
				for (let index = 0; index < list_columns_aiContent?.columns.length; index++) {
					// Title.
					if ( list_columns_aiContent?.columns?.[index]?.['title-medium'] ) {
						content = content.replace( "Give your list item a title", list_columns_aiContent?.columns?.[index]?.['title-medium'] );
					}
					// Sentence Short.
					if ( list_columns_aiContent?.columns?.[index]?.['sentence-short'] ) {
						content = content.replace( "Use this short paragraph to write a supporting description of your list item. Remember to let your readers know why this list item is essential.", list_columns_aiContent?.columns?.[index]?.['sentence-short'] );
					}
				}
			}
			// List
			if ( list_aiContent?.list ) {
				for (let index = 0; index < list_aiContent?.list.length; index++) {
					// list item.
					if ( list_aiContent?.list?.[index]?.['list-item-short'] ) {
						content = content.replace( "Add a single and succinct list item", list_aiContent?.list?.[index]?.['list-item-short'] );
						content = content.replace( "Add a single and succinct list item", list_aiContent?.list?.[index]?.['list-item-short'] );
					}
					// list item long.
					if ( list_aiContent?.list?.[index]?.['list-item-long'] ) {
						content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", list_aiContent?.list?.[index]?.['list-item-long'] );
						content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", list_aiContent?.list?.[index]?.['list-item-long'] );
					}
				}
			}
			break;
		case "slider":
			const slider_aiContent = contextAI.find( x => x.id === context + '-slider' );
			// Headline.
			if ( slider_aiContent?.heading?.short ) {
				content = content.replace( /Short Headline/g, slider_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Short Headline/g, base_aiContent?.heading?.[0]?.short );
			}
			// Headline.
			if ( slider_aiContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title to attract your audience./g, slider_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Craft a captivating title to attract your audience./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Headline.
			if ( slider_aiContent?.sentence?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, slider_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, base_aiContent?.sentence?.[0]?.short );
			}
			// overline
			if ( slider_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, slider_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, slider_aiContent?.overline?.short );
				content = content.replace( /Overline/g, slider_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( slider_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, slider_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, slider_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			break;
		case "post-loop":
			const post_loop_aiContent = contextAI.find( x => x.id === context + '-post-loop' );
			// Headline.
			if ( post_loop_aiContent?.heading?.short ) {
				content = content.replace( /Selected posts title/g, post_loop_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Selected posts title/g, base_aiContent?.heading?.[0]?.short );
			}
			// Headline.
			if ( post_loop_aiContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, post_loop_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Headline.
			if ( post_loop_aiContent?.sentence?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, post_loop_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, base_aiContent?.sentence?.[0]?.short );
			}
			// overline
			if ( post_loop_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, post_loop_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, post_loop_aiContent?.overline?.short );
				content = content.replace( /Overline/g, post_loop_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( post_loop_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, post_loop_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, post_loop_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			break;
		case "people":
			const people_aiContent = contextAI.find( x => x.id === context + '-people' );
			// Headline.
			if ( people_aiContent?.heading?.medium ) {
				content = content.replace( /A short and sweet title for this section./g, people_aiContent?.heading?.medium );
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, people_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /A short and sweet title for this section./g, base_aiContent?.heading?.[0]?.medium );
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, base_aiContent?.heading?.[0]?.medium );
			}
			// Headline.
			if ( people_aiContent?.sentence?.short ) {
				content = content.replace( /Use this space to write about your company, employee profiles and organizational culture; share your story and connect with customers./g, people_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use this space to write about your company, employee profiles and organizational culture; share your story and connect with customers./g, base_aiContent?.sentence?.[0]?.short );
			}
			// overline
			if ( people_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, people_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, people_aiContent?.overline?.short );
				content = content.replace( /Overline/g, people_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( people_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, people_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, people_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// People.
			if ( people_aiContent?.people ) {
				for (let index = 0; index < people_aiContent?.people.length; index++) {
					// Name.
					if ( people_aiContent?.people?.[index]?.['name'] ) {
						content = content.replace( "Name Lastname", people_aiContent?.people?.[index]?.['name'] );
					}
					// position.
					if ( people_aiContent?.people?.[index]?.['position'] ) {
						content = content.replace( "Position or title", people_aiContent?.people?.[index]?.['position'] );
					}
					// sentence.
					if ( people_aiContent?.people?.[index]?.['sentence-short'] ) {
						content = content.replace( "Brief profile bio for this person will live here. Add an overview of this person's role or any key information.", people_aiContent?.people?.[index]?.['sentence-short'] );
					}
				}
			}
			break;
		case "logo-farm":
			const logo_farm_aiContent = contextAI.find( x => x.id === context + '-logo-farm' );
			// Headline.
			if ( logo_farm_aiContent?.heading?.medium ) {
				content = content.replace( /Tell your audience about your achievements, partners or customers./g, logo_farm_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Tell your audience about your achievements, partners or customers./g, base_aiContent?.heading?.[0]?.medium );
			}
			// overline
			if ( logo_farm_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, logo_farm_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, logo_farm_aiContent?.overline?.short );
				content = content.replace( /Overline/g, logo_farm_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( logo_farm_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, logo_farm_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, logo_farm_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			break;
		case "location":
			const location_aiContent = contextAI.find( x => x.id === context );
			// Headline.
			if ( location_aiContent?.heading?.short ) {
				content = content.replace( /Find us/g, location_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Find us/g, base_aiContent?.heading?.[0]?.short );
			}
			// Sentence.
			if ( location_aiContent?.sentence?.short ) {
				content = content.replace( /Use a brief and inviting sentence to encourage visitors to get in touch./g, location_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Use a brief and inviting sentence to encourage visitors to get in touch./g, base_aiContent?.sentence?.[0]?.short );
			}
			break;
		case "gallery":
			const gallery_aiContent = contextAI.find( x => x.id === context + '-gallery' );
			// Headline.
			if ( gallery_aiContent?.heading?.short ) {
				content = content.replace( /Add a succinct headline/g, gallery_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Add a succinct headline/g, base_aiContent?.heading?.[0]?.short );
			}
			// Sentence.
			if ( gallery_aiContent?.sentence?.short ) {
				content = content.replace( /Write with clear, concise language to inform and engage your audience. Consider what matters to them and provide valuable insights./g, gallery_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Write with clear, concise language to inform and engage your audience. Consider what matters to them and provide valuable insights./g, base_aiContent?.sentence?.[0]?.short );
			}
			break;
		case "featured-products":
			const featured_aiContent = contextAI.find( x => x.id === context + '-single' );
			// Headline.
			if ( featured_aiContent?.heading?.medium ) {
				content = content.replace( /An engaging product or feature headline here/g, featured_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /An engaging product or feature headline here/g, base_aiContent?.heading?.[0]?.medium );
			}
			// Sentence.
			if ( featured_aiContent?.sentence?.medium ) {
				content = content.replace( /Write a short descriptive paragraph about your product. Focus on your ideal buyer. Entice with benefits of using your product./g, featured_aiContent?.sentence?.medium );
			} else if ( base_aiContent?.sentence?.[0]?.medium ) {
				content = content.replace( /Write a short descriptive paragraph about your product. Focus on your ideal buyer. Entice with benefits of using your product./g, base_aiContent?.sentence?.[0]?.medium );
			}
			// price.
			if ( featured_aiContent?.price ) {
				content = content.replace( /$19.99/g, featured_aiContent?.price );
			}
			// Button
			if ( featured_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, featured_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, featured_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Benefits.
			if ( featured_aiContent?.['product-features-and-benefits'] ) {
				for (let index = 0; index < featured_aiContent?.['product-features-and-benefits'].length; index++) {
					// Item.
					if (index % 2 !== 0) {
						if ( featured_aiContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] ) {
							content = content.replace( "Another short feature description", featured_aiContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] );
						}
					} else {
						if ( featured_aiContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] ) {
							content = content.replace( "Short feature description", featured_aiContent?.['product-features-and-benefits']?.[index]?.['list-item-short'] );
						}
					}
				}
			}
			break;
		case "form":
			const form_aiContent = contextAI.find( x => x.id === context );
			// Headline.
			if ( form_aiContent?.heading?.short ) {
				content = content.replace( /Add A Title For Your Form/g, form_aiContent?.heading?.short );
				content = content.replace( /Contact Us/g, form_aiContent?.heading?.short );
			} else if ( base_aiContent?.heading?.[0]?.short ) {
				content = content.replace( /Add A Title For Your Form/g, base_aiContent?.heading?.[0]?.short );
				content = content.replace( /Contact Us/g, base_aiContent?.heading?.[0]?.short );
			}
			// Sentence.
			if ( form_aiContent?.sentence?.short ) {
				content = content.replace( /Briefly describe what the form is for or provide additional context if required. Use inviting language./g, form_aiContent?.sentence?.short );
			} else if ( base_aiContent?.sentence?.[0]?.short ) {
				content = content.replace( /Briefly describe what the form is for or provide additional context if required. Use inviting language./g, base_aiContent?.sentence?.[0]?.short );
			}
			break;
		case "table-of-contents":
			const toc_aiContent = contextAI.find( x => x.id === context + '-table-contents' );
			// Headline.
			if ( toc_aiContent?.heading?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, toc_aiContent?.heading?.medium );
			} else if ( base_aiContent?.heading?.[0]?.medium ) {
				content = content.replace( /Craft a captivating title for this section to attract your audience./g, base_aiContent?.heading?.[0]?.medium );
			}
			// overline
			if ( toc_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, toc_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, toc_aiContent?.overline?.short );
				content = content.replace( /Overline/g, toc_aiContent?.overline?.short );
			} else if ( base_aiContent?.overline?.short ) {
				content = content.replace( /ADD AN OVERLINE/g, base_aiContent?.overline?.short );
				content = content.replace( /Add an overline/g, base_aiContent?.overline?.short );
				content = content.replace( /Overline/g, base_aiContent?.overline?.short );
			}
			// Button
			if ( toc_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, toc_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, toc_aiContent?.button?.short );
			} else if ( base_aiContent?.button?.short ) {
				content = content.replace( /Call To Action/g, base_aiContent?.button?.short );
				content = content.replace( /Call to Action/g, base_aiContent?.button?.short );
			}
			// Subtitles.
			if ( toc_aiContent?.subtitles ) {
				for (let index = 0; index < toc_aiContent?.subtitles.length; index++) {
					// Title.
					if ( toc_aiContent?.subtitles?.[index]?.['title-short'] ) {
						content = content.replace( "Write a title for your section or related content here", toc_aiContent?.subtitles?.[index]?.['title-short'] );
					}
				}
			}
			break;
		default:
			break;
	}
	
	return content;
}
