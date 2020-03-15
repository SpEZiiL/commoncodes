interface ManpageReference {
	readonly page: string;
	readonly section: number;
}
namespace ManpageReference {
	export function from(str: string): (ManpageReference | null);
	export function from(tuple: [string, number]): ManpageReference;
	export function from(strOrTuple: string | [string, number]): (ManpageReference | null) {
		if(typeof(strOrTuple) === "object") return {
			page: strOrTuple[0],
			section: strOrTuple[1]
		};

		const match = strOrTuple.match(/^(?<page>.+)\((?<section>\d+)\)$$/);
		if(match === null || match.groups === undefined) return null;

		return {
			page: match.groups["page"],
			section: Number(match.groups["section"])
		};
	}
}
export { ManpageReference };

interface UrlLink {
	readonly url: URL;
	readonly title: (string | null);
}
namespace UrlLink {
	export function from(str: string): (UrlLink | null);
	export function from(tuple: [URL, (string | null)]): UrlLink;
	export function from(strOrTuple: string | [URL, (string | null)]): (UrlLink | null) {
		if(typeof(strOrTuple) === "object") return {
			url: strOrTuple[0],
			title: strOrTuple[1]
		};

		const match = strOrTuple.match(/^(?<url>.+)\s*("(?<title>.*)")?$/);
		if(match === null || match.groups === undefined) return null;

		try {
			return {
				url: new URL(match.groups["url"]),
				title: ((): string => {
					const title = match.groups["title"] as (string | undefined);
					if(title === undefined) return "";
					return title;
				})()
			};
		} catch(err) {
			if(err instanceof TypeError) return null;
			throw err;
		}
	}
}
export { UrlLink };

export class SeeAlsoLink {
	private readonly urlLink: (UrlLink | null);
	private readonly manpageReference: (ManpageReference | null);

	constructor(url: URL, title?: (string | null));
	constructor(page: string, section: number);
	constructor(urlOrPage: (URL | string), titleOrSection?: ((string | null) | number)) {
		if(urlOrPage instanceof URL && (typeof(titleOrSection) === "undefined" ||
		                                typeof(titleOrSection) === "string" ||
		                                titleOrSection === null)) {
			this.urlLink = {
				url: urlOrPage,
				title: (titleOrSection === undefined ? null : titleOrSection)
			};
			this.manpageReference = null;
		} else if(typeof(urlOrPage) === "string" &&
		          typeof(titleOrSection) === "number") {
			this.urlLink = null;
			this.manpageReference = {
				page: urlOrPage,
				section: titleOrSection
			};
		} else {
			throw undefined;
		}
	}

	getLink(): ([UrlLink, null] | [null, ManpageReference]) {
		return [this.urlLink, this.manpageReference] as ([UrlLink, null] | [null, ManpageReference]);
	}

	static from(str: string): (SeeAlsoLink | null) {
		const manpageReference = ManpageReference.from(str);
		if(manpageReference !== null) {
			return new SeeAlsoLink(manpageReference.page,
			                       manpageReference.section);
		}

		const urlLink = UrlLink.from(str);
		if(urlLink !== null) return new SeeAlsoLink(urlLink.url, urlLink.title);

		return null;
	}
}
