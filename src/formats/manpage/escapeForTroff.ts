import Exception from "@mfederczuk/custom-exception";

export function escapeForTroff(str: string): string {
	let esc = "";

	const l = str.length;
	for(let i = 0; i < l; ++i) {
		const c = str.charAt(i);
		const codePoint = c.codePointAt(0) as number;

		if(c === "\\") {
			esc += "\\\\";
		} else if(c === "-") {
			esc += "\\-";
		} else if(c === "\n") {
			esc += "\n.br\n";
		} else if((codePoint >= 0 && codePoint <= 0x1F) || (codePoint >= 0x7F && codePoint <= 0xFFFF)) {
			esc += `\\[u${codePoint.toString(16).padStart(4, "0").toUpperCase()}_0000_0000]`;
		} else if(codePoint >= 0x10000 && codePoint <= 0xFFFFF) {
			esc += `\\u[${codePoint.toString(16).padStart(5, "0").toUpperCase()}_0000_0000]`;
		} else if(codePoint >= 0x100000 && codePoint <= 0xFFFFFF) {
			esc += `\\u[${codePoint.toString(16).padStart(6, "0").toUpperCase()}_0000_0000]`;
		} else if(codePoint >= 0x1000000) {
			throw new Exception(`Cannot escape code point ${codePoint} (>= 0x1000000)`);
		} else {
			esc += c;
		}
	}

	return esc;
}
