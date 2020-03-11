import { Author as Person } from "parse-author";
import { SemVer } from "semver";
import { Description } from "./description";
import { ExitStatusTable } from "./exitStatus";
import ManpageReference from "./ManpageReference";

export default interface CommonCodesData {
	readonly metadata: {
		readonly authors: readonly Person[];

		readonly copyrightYears: readonly number[];
		readonly copyrightHolder: Person;

		readonly releaseVersion: SemVer;
		readonly releaseDate: Date;
	};

	readonly name: Description;
	readonly description: Description;
	readonly exitStatusTable: ExitStatusTable;
	readonly footnotes: Description;
	readonly seeAlso: {
		readonly links: readonly (URL | ManpageReference)[];
		readonly mansite: string;
	};
// eslint-disable-next-line semi
}
