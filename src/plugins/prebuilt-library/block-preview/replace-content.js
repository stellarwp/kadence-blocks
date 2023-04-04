/**
 * WordPress dependencies
 */
const getStringBetween = (str, start, end) => {
	// Check if form is there?
	if ( ! str.includes( 'wp:kadence/form' ) ) {
		return '';
	}
	// get the start of the submit button.
	const startpos = str.indexOf(start);
	if ( ! startpos ) {
		return '';
	}
	const pos = startpos + start.length;
    return str.substring(pos, str.indexOf(end, pos));
}
export default function replaceContent( content, aiContent, categories, context, variation ) {
	if ( ! content ) {
		return content;
	}
	aiContent = {
		hero: {
			overline:"Join Our Community of Yogis",
			headline_short:"Discover Peace and Strength at our Yoga Studio",
			headline_medium:"Unearth Serenity & Power at Our Supportive Yoga Haven",
			headline_long:"Unlock the Secrets to a Joyful, Vibrant Life at Seattle's Premier Yoga",
			subline_medium:"Our experienced teachers will help you find your path to peace and strength. Tailored classes make our studio accessible for yogis of all levels",
			subline_long:"Discover inner tranquility and unleash your power with the guidance of our seasoned instructors. Customized sessions at our studio cater to every yogi's individual journey!",
		},
		content: {
			headline_short:"Discover a Healthier, Happier You",
			headline_medium:"Discover the Benefits of Yoga and Make Friends for Life!",
			headline_long:"Discover Inner Harmony: Join a Yoga Class and Transform Your Life!",
			paragraph_short:"Our experienced teachers will help you find your path to peace and strength. Tailored classes make our studio accessible for yogis of all levels",
			paragraph_medium:"Yoga has been shown to have a positive impact on mental health, promoting a sense of well-being, relaxation, and mental clarity. It can help reduce anxiety, depression, and promote feelings of happiness and contentment.",
			paragraph_long:"Focusing on care for both the individual and the larger community, our yoga studio provides a warm, welcoming space where yogis from all walks of life come together to care for both their own health and well-being as well as that of the community at large. With an experienced team of teachers, we are dedicated to you in your journey to reconnect with your body, mind, and spirit. Our classes are accessible and tailored to fit each individual's needs. Come join us - care awaits!",
			
		},
		people: {
			headline_medium:"Meet Our Experienced and Passionate Yoga Instructors",

		}
		
	}
	// Text
	content = content.replace( /’/g, "'");
	// Heros.
	content = content.replace( /ADD AN OVERLINE/g, aiContent.hero.overline );
	content = content.replace( /Add an overline text/g, aiContent.hero.overline );
	content = content.replace( /Add an overlinE/g, aiContent.hero.overline );
	content = content.replace( /Add an overline/g, aiContent.hero.overline );
	content = content.replace( /add an overline/g, aiContent.hero.overline );

	content = content.replace( /Briefly and concisely explain what you do for your audience./g, aiContent.hero.headline_short );
	content = content.replace( /Craft a captivating title for this section to attract your audience./g, aiContent.hero.headline_medium );
	content = content.replace( /Craft a captivating title for the upcoming section to attract your audience./g, aiContent.hero.headline_long );

	content = content.replace( /Use a clear and attention-grabbing short paragraph to engage your audience and draw them into reading the rest of your content./g, aiContent.hero.subline_medium );
	content = content.replace( /Consider using this if you need to provide more context on why you do what you do. Be engaging. Focus on delivering value to your visitors./g, aiContent.hero.subline_long );


	// Content.
	content = content.replace( /Write a short headline/g, "Discover a Healthier, Happier You");
	content = content.replace( /Add a short & sweet headline/g, "Discover a Healthier, Happier You");
	content = content.replace( /Add a short headline/g, "Discover a Healthier, Happier You");
	content = content.replace( /Add a short, consistent heading for your image/g, "Discover a Healthier, Happier You");

	content = content.replace( /Write a short and relevant headline/g, "Unlock the Secrets to a Joyful, Vibrant Life");
	content = content.replace( /Add a succinct headline/g, "Discover the Benefits of Yoga and Make Friends for Life!");
	content = content.replace( /Add a compelling title for your section to engage your audience./g, "Discover Inner Harmony: Join a Yoga Class and Transform Your Life!");

	content = content.replace( "Use this paragraph to add supporting context. Consider your audience and what matters to them, and provide insights that support your topic.", aiContent.content.paragraph_medium );

	// People
	content = content.replace( /A short and sweet title for this section./g, aiContent.people.headline_medium );

	// Cards 

	content = content.replace( "Add a Short Title Here", "Personalized yoga classes tailored to your needs");
	content = content.replace( "Add a Short Title Here", "Recharge through self-care practices");
	content = content.replace( "Add a Short Title Here", "Unite your mind, body and spirit through yoga");
	content = content.replace( "Add a Short Title Here", "Feel the connection of being part of a community");
	content = content.replace( "Add a Short Title Here", "Experience transformation with tailored sessions");
	content = content.replace( "Add a Short Title Here", "Transform yourself with the power of yoga");
	content = content.replace( "Add a Short Title Here", "Elevate Your Inner Peace and Wellness");
	content = content.replace( /Add a Short Title Here/g, "Recharge through self-care practices");

	content = content.replace( "Add a Title", "Personalized yoga classes tailored to your needs");
	content = content.replace( "Add a Title", "Recharge through self-care practices");
	content = content.replace( "Add a Title", "Unite your mind, body and spirit through yoga");
	content = content.replace( "Add a Title", "Feel the connection of being part of a community");
	content = content.replace( "Add a Title", "Experience transformation with tailored sessions");
	content = content.replace( "Add a Title", "Transform yourself with the power of yoga");
	content = content.replace( "Add a Title", "Elevate Your Inner Peace and Wellness");
	content = content.replace( /Add a Title/g, "Recharge through self-care practices");

	content = content.replace( "Add a descriptive title for the column.", "Personalized yoga classes tailored to your needs");
	content = content.replace( "Add a descriptive title for the column.", "Recharge through self-care practices");
	content = content.replace( "Add a descriptive title for the column.", "Unite your mind, body and spirit through yoga");
	content = content.replace( "Add a descriptive title for the column.", "Feel the connection of being part of a community");
	content = content.replace( "Add a descriptive title for the column.", "Experience transformation with tailored sessions");
	content = content.replace( "Add a descriptive title for the column.", "Transform yourself with the power of yoga");
	content = content.replace( "Add a descriptive title for the column.", "Elevate Your Inner Peace and Wellness");
	content = content.replace( /Add a descriptive title for the column./g, "Recharge through self-care practices");

	// Stats
	content = content.replace( /Tell your story in numbers, and give your visitors useful insights./g, "Proven by Science: Yoga Improves Your Quality of Life - Here's How!");

	content = content.replace( "overline", "Mindfulness");
	content = content.replace( "overline", "Strength");
	content = content.replace( "overline", "Flexibility");
	content = content.replace( "overline", "Balance");
	content = content.replace( "overline", "Peace");
	content = content.replace( "overline", "Harmony");
	content = content.replace( "overline", "Community");
	content = content.replace( "overline", "Wellness");
	content = content.replace( "overline", "Serenity");
	content = content.replace( "overline", "Tranquility");
	content = content.replace( /overline/g, "Flexibility");

	content = content.replace( "OVERLINE", "Mindfulness");
	content = content.replace( "OVERLINE", "Strength");
	content = content.replace( "OVERLINE", "Flexibility");
	content = content.replace( "OVERLINE", "Balance");
	content = content.replace( "OVERLINE", "Peace");
	content = content.replace( "OVERLINE", "Harmony");
	content = content.replace( "OVERLINE", "Community");
	content = content.replace( "OVERLINE", "Wellness");
	content = content.replace( "OVERLINE", "Serenity");
	content = content.replace( "OVERLINE", "Tranquility");
	content = content.replace( /OVERLINE/g, "Flexibility");

	content = content.replace( "Use this space to add a short description. It gives enough info to earn a click.", "Yoga is known for its calming effects on the mind and body, which can help reduce stress and promote relaxation.");
	content = content.replace( "Use this space to add a short description. It gives enough info to earn a click.", "While yoga is known for its focus on flexibility and relaxation, it is also a great way to build strength and tone muscles.");
	content = content.replace( "Use this space to add a short description. It gives enough info to earn a click.", "Practicing yoga can help improve balance and coordination by focusing on posture and body alignment.");
	content = content.replace( "Use this space to add a short description. It gives enough info to earn a click.", "Yoga has been shown to have a positive impact on mental health, promoting a sense of well-being, relaxation, and mental clarity.");
	content = content.replace( /Use this space to add a short description. It gives enough info to earn a click./g, "Yoga helps to stretch and lengthen the muscles, which can increase flexibility and improve posture.");


	content = content.replace( "Add a brief description to your card.", "Personalized yoga classes tailored to your needs");
	content = content.replace( "Add a brief description to your card.", "Recharge through self-care practices");
	content = content.replace( "Add a brief description to your card.", "Unite your mind, body and spirit through yoga");
	content = content.replace( "Add a brief description to your card.", "Feel the connection of being part of a community");
	content = content.replace( "Add a brief description to your card.", "Experience transformation with tailored sessions");
	content = content.replace( "Add a brief description to your card.", "Transform yourself with the power of yoga");
	content = content.replace( "Add a brief description to your card.", "Elevate Your Inner Peace and Wellness");
	content = content.replace( /Add a brief description to your card./g, "Recharge through self-care practices");

	content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", "Yoga is known for its calming effects on the mind and body, which can help reduce stress and promote relaxation. It has been shown to lower levels of the stress hormone cortisol, leading to a more relaxed and calm state of being.");
	content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", "While yoga is known for its focus on flexibility and relaxation, it is also a great way to build strength and tone muscles. Many poses require holding and supporting your own body weight, which can lead to increased strength and muscular endurance.");
	content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", "Practicing yoga can help improve balance and coordination by focusing on posture and body alignment. This can reduce the risk of falls and improve overall stability and control.");
	content = content.replace( "Add context to your column. Help visitors understand the value they can get from your products and services.", "Yoga has been shown to have a positive impact on mental health, promoting a sense of well-being, relaxation, and mental clarity. It can help reduce anxiety, depression, and promote feelings of happiness and contentment.");
	content = content.replace( /Add context to your column. Help visitors understand the value they can get from your products and services./g, "Yoga helps to stretch and lengthen the muscles, which can increase flexibility and improve posture. This can reduce the risk of injury and improve overall mobility and range of motion.");

	// list
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Elevate Your Mind and Body: Join Our Yoga Studio Today!");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Elevate Your Mind and Body: Join Our Yoga Studio Today!");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Discover a Healthier, Happier You with Our Yoga Studio in Seattle");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Discover a Healthier, Happier You with Our Yoga Studio in Seattle");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Find Inner Peace and Strength at Our Seattle Yoga Studio");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Find Inner Peace and Strength at Our Seattle Yoga Studio");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Join Our Vibrant Community and Transform Your Life through Yoga");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Join Our Vibrant Community and Transform Your Life through Yoga");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Take the First Step Towards Wellness: Join Our Yoga Studio Now");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Take the First Step Towards Wellness: Join Our Yoga Studio Now");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Experience the Benefits of Yoga: Join Our Seattle Studio Now!");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Experience the Benefits of Yoga: Join Our Seattle Studio Now!");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Embrace Mindful Movement: Sign Up for Yoga Classes Today");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Embrace Mindful Movement: Sign Up for Yoga Classes Today");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Elevate Your Practice and Unleash Your Inner Yogi with Our Studio");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Elevate Your Practice and Unleash Your Inner Yogi with Our Studio");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Unwind, De-Stress, and Recharge at Our Seattle Yoga Studio");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Unwind, De-Stress, and Recharge at Our Seattle Yoga Studio");

	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Discover the Magic of Yoga: Join Our Studio and Transform Your Life");
	content = content.replace( "Add unique list items while keeping a consistent phrasing style and similar line lengths", "Discover the Magic of Yoga: Join Our Studio and Transform Your Life");

	content = content.replace( /Add unique list items while keeping a consistent phrasing style and similar line lengths/g, "Elevate Your Mind and Body: Join Our Yoga Studio Today!");

	content = content.replace( "Add a single and succinct list item", "Increases flexibility");
	content = content.replace( "Add a single and succinct list item", "Increases flexibility");
	content = content.replace( "Add a single and succinct list item", "Strengthens muscles");
	content = content.replace( "Add a single and succinct list item", "Strengthens muscles");
	content = content.replace( "Add a single and succinct list item", "Reduces stress");
	content = content.replace( "Add a single and succinct list item", "Reduces stress");
	content = content.replace( "Add a single and succinct list item", "Improves balance");
	content = content.replace( "Add a single and succinct list item", "Improves balance");
	content = content.replace( "Add a single and succinct list item", "Enhances focus");
	content = content.replace( "Add a single and succinct list item", "Enhances focus");
	content = content.replace( "Add a single and succinct list item", "Boosts energy");
	content = content.replace( "Add a single and succinct list item", "Boosts energy");
	content = content.replace( "Add a single and succinct list item", "Lowers blood pressure");
	content = content.replace( "Add a single and succinct list item", "Lowers blood pressure");
	content = content.replace( "Add a single and succinct list item", "Relieves anxiety");
	content = content.replace( "Add a single and succinct list item", "Relieves anxiety");
	content = content.replace( "Add a single and succinct list item", "Improves posture");
	content = content.replace( "Add a single and succinct list item", "Improves posture");
	content = content.replace( "Add a single and succinct list item", "Helps with weight loss");
	content = content.replace( "Add a single and succinct list item", "Helps with weight loss");
	content = content.replace( "Add a single and succinct list item", "Improves immune system");
	content = content.replace( "Add a single and succinct list item", "Improves immune system");
	content = content.replace( "Add a single and succinct list item", "Reduces inflammation");
	content = content.replace( "Add a single and succinct list item", "Reduces inflammation");
	content = content.replace( "Add a single and succinct list item", "Enhances mood");
	content = content.replace( "Add a single and succinct list item", "Enhances mood");
	content = content.replace( "Add a single and succinct list item", "Boosts mental clarity");
	content = content.replace( "Add a single and succinct list item", "Boosts mental clarity");
	content = content.replace( "Add a single and succinct list item", "Improves balance");
	content = content.replace( "Add a single and succinct list item", "Improves balance");
	content = content.replace( "Add a single and succinct list item", "Reduces stress");
	content = content.replace( "Add a single and succinct list item", "Reduces stress");
	content = content.replace( "Add a single and succinct list item", "Enhances focus");
	content = content.replace( "Add a single and succinct list item", "Enhances focus");
	content = content.replace( /Add a single and succinct list item/g, "Increases self-awareness");

	content = content.replace( /Write a clear and relevant header to keep your visitors engaged/g, "Discover the wonders of yoga and how it can work magic for people of all ages!");

	// Long Paragraphs
	content = content.replace( /Use this paragraph section to get your website visitors to know you. Consider writing about you or your organization, the products or services you offer, or why you exist. Keep a consistent communication style./g, "Focusing on care for both the individual and the larger community, our yoga studio provides a warm, welcoming space where yogis from all walks of life come together to care for both their own health and well-being as well as that of the community at large. Come join us - care awaits!");

	content = content.replace( /Write a medium length paragraph about your tab that will help users find what they are looking for. Tabs are really helpful when used to facilitate access to content avoiding error-prone guessing and additional searching./g, "Focusing on care for both the individual and the larger community, our yoga studio provides a warm, welcoming space where yogis from all walks of life come together to care for both their own health and well-being as well as that of the community at large. With an experienced team of teachers, we are dedicated to you in your journey to reconnect with your body, mind, and spirit. Our classes are accessible and tailored to fit each individual's needs. Come join us - care awaits!");
	content = content.replace( /Write a brief supporting text summarizing or teasing the content of the post. Think about this paragraph as the most important glimpse of your main content. Capture your readers' attention and drive them to read your post./g, "Focusing on care for both the individual and the larger community, our yoga studio provides a warm, welcoming space where yogis from all walks of life come together to care for both their own health and well-being as well as that of the community at large. With an experienced team of teachers, we are dedicated to you in your journey to reconnect with your body, mind, and spirit. Our classes are accessible and tailored to fit each individual's needs. Come join us - care awaits!");

	return content;
}
