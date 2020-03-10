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
		if(match === null || match.groups === undefined) {
			return null;
		}

		return {
			page: match.groups["page"],
			section: Number(match.groups["section"])
		};
	}
}

export default ManpageReference;
