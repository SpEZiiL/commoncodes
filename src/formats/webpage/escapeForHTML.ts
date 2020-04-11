export function escapeForHTMLText(str: string): string {
	let esc = "";

	const l = str.length;
	for(let i = 0; i < l; ++i) {
		const c = str.charAt(i);
		const codePoint = c.codePointAt(0) as number;

		if(c === "<") {
			esc += "&lt;";
		} else if(c === "&") {
			esc += "&amp;";
		} else if(c === "\n") {
			esc += "<br/>";
		} else if((codePoint >= 0 && codePoint < 20) || codePoint >= 127) {
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

		if(c === "\"") {
			esc += "&quot;";
		} else if(c === "&") {
			esc += "&amp;";
		} else if(c === "<") {
			esc += "&lt;";
		} else if((codePoint >= 0 && codePoint < 20) || codePoint >= 127) {
			esc += `&#x${codePoint.toString(16)};`;
		} else {
			esc += c;
		}
	}

	return esc;
}
