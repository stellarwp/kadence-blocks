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
	content = content.replaceAll('1234 N Street<br>City, State, Country', address);
	content = content.replaceAll('1234 N Street <br>City, State, Country', address);
	content = content.replaceAll('1234 N Street <br>City, State<br>Country', address);
	content = content.replaceAll('1234 N Street <br>City, State <br>Country', address);
	content = content.replaceAll('1234 N Street City, State, Country', address);
	content = content.replace('1234 N Street <br/>City, State, Country', address);
	content = content.replaceAll('Los angeles', address);
	content = content.replaceAll('Las angeles', address);
	content = content.replaceAll('Los Angeles', address);
	content = content.replaceAll('Las Angeles', address);
	return content;
}
