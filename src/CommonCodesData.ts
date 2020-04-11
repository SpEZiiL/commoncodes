import { Author as Person } from "parse-author";
import { SemVer } from "semver";
import { Description } from "./description";
import { ExitStatusTable } from "./exitStatus";
import { SeeAlsoLink } from "./seeAlsoLink";

export default interface CommonCodesData {
	readonly metadata: {
		readonly authors: readonly Person[];

		readonly copyrightYears: readonly number[];
		readonly copyrightHolder: Person;

		readonly releaseVersion: SemVer;
		readonly releaseDate: Date;
	};

	readonly about: string;
	readonly description: Description;
	readonly exitStatusTable: ExitStatusTable;
	readonly footnotes: Description;
	readonly seeAlso: {
		readonly links: readonly SeeAlsoLink[];
		readonly mansite: string;
	};
// eslint-disable-next-line semi
}
