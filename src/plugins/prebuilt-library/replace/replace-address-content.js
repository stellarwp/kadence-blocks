export default function replaceAddressContent(content, address) {
	if (!content) {
		return content;
	}
	if (!address) {
		return content;
	}
	content = content.replace(
		`1234 N Street 
	City, State, Country`,
		address
	);
	content = content.replace(
		`1234 N Street 
	City, State
	Country`,
		address
	);
	content = content.replace(/1234 N Street<br>City, State, Country/g, address);
	content = content.replace(/1234 N Street <br>City, State, Country/g, address);
	content = content.replace(/1234 N Street <br>City, State<br>Country/g, address);
	content = content.replace(/1234 N Street <br>City, State <br>Country/g, address);
	content = content.replace(/1234 N Street City, State, Country/g, address);
	content = content.replace('1234 N Street <br/>City, State, Country', address);
	content = content.replace(/Los angeles/g, address);
	content = content.replace(/Las angeles/g, address);
	content = content.replace(/Los Angeles/g, address);
	content = content.replace(/Las Angeles/g, address);
	return content;
}
