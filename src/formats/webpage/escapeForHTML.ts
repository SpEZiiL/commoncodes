export function escapeForHTMLText(str: string): string {
	let esc = "";

	const l = str.length;
	for(let i = 0; i < l; ++i) {
		const c = str.charAt(i);
		const codePoint = c.codePointAt(0) as number;

		if(c === "<") {
			esc += "&lt;";
		} else if(c === ">") {
			// not necessary but for completeness sake
			esc += "&gt;";
		} else if(c === "&") {
			esc += "&amp;";
		} else if(c === "\n") {
			// slash is here not needed, but i like it more with it
			esc += "<br/>";
		} else if((codePoint >= 0x0 && codePoint <= 0x1F) || codePoint >= 0x7F) {
			esc += `&#x${codePoint.toString(16)};`;
		} else {
			esc += c;
		}
	}

	return esc;
}

export function escapeForHTMLAttr(str: string): string {
	let esc = "";

	const l = str.length;
	for(let i = 0; i < l; ++i) {
		const c = str.charAt(i);
		const codePoint = c.codePointAt(0) as number;

		// we don't escape "'", is unnecessary
		if(c === "\"") {
			esc += "&quot;";
		} else if(c === "&") {
			esc += "&amp;";
		} else if(c === "<") {
			esc += "&lt;";
		} else if((codePoint >= 0x0 && codePoint <= 0x1F) || codePoint >= 0x7F) {
			esc += `&#x${codePoint.toString(16)};`;
		} else {
			esc += c;
		}
	}

	return esc;
}
