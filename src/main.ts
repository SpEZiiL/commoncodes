import { readdirSync, readFileSync, realpathSync } from "fs";
import * as jsyaml from "js-yaml";
import * as parsePerson from "parse-author";
import { SemVer } from "semver";
import CommonCodesData from "./CommonCodesData";
import { parseDescription } from "./description";
import { ExitStatusTable } from "./exitStatus";
import { SeeAlsoLink } from "./seeAlsoLink";

const ROOT_DIR = realpathSync(__dirname + "/..");
const RAW_DIR = realpathSync(ROOT_DIR + "/raw");

const METADATA_FILENAME = "metadata.yaml";
const NAME_FILENAME = "name.desc";
const DESCRIPTION_FILENAME = "description.desc";
const EXIT_STATUS_TABLE_FILENAME = "exit_status_table";
const FOOTNOTES_FILENAME = "footnotes.desc";
const SEE_ALSO_FILENAME = "see_also.yaml";

const majorVersions = ((): number[] => {
	const entries = readdirSync(RAW_DIR);

	const majorVersions: number[] = [];

	entries.forEach((entry) => {
		const match = entry.match(/^v([1-9][0-9]*)$/);
		if(match !== null) majorVersions.push(Number(match[1]));
	});

	return majorVersions;
})();

const dataSet = majorVersions.map((majorVersion): CommonCodesData => {
	const versionDir = `${RAW_DIR}/v${majorVersion}`;

	const metadataFileContents = readFileSync(`${versionDir}/${METADATA_FILENAME}`).toString();
	const metadata = jsyaml.safeLoad(metadataFileContents) as {
		readonly authors: readonly string[];

		// eslint-disable-next-line camelcase
		readonly copyright_years: readonly number[];
		// eslint-disable-next-line camelcase
		readonly copyright_holder: string;

		// eslint-disable-next-line camelcase
		readonly release_version: string;
		// eslint-disable-next-line camelcase
		readonly release_date: Date;
	};

	const nameFileContents = readFileSync(`${versionDir}/${NAME_FILENAME}`).toString();
	const name = parseDescription(nameFileContents);

	const descriptionFileContents = readFileSync(`${versionDir}/${DESCRIPTION_FILENAME}`).toString();
	const description = parseDescription(descriptionFileContents);

	const exitStatusTableFileContents = readFileSync(`${versionDir}/${EXIT_STATUS_TABLE_FILENAME}`).toString();
	const exitStatusTable = ExitStatusTable.parse(exitStatusTableFileContents);

	const footnotesFileContents = readFileSync(`${versionDir}/${FOOTNOTES_FILENAME}`).toString();
	const footnotes = parseDescription(footnotesFileContents);

	const seeAlsoFileContents = readFileSync(`${versionDir}/${SEE_ALSO_FILENAME}`).toString();
	const seeAlso = jsyaml.safeLoad(seeAlsoFileContents) as {
		readonly links: readonly string[];
		readonly mansite: string;
	};

	return {
		metadata: {
			authors: metadata.authors.map(parsePerson),

			copyrightYears: metadata.copyright_years,
			copyrightHolder: parsePerson(metadata.copyright_holder),

			releaseVersion: new SemVer(metadata.release_version),
			releaseDate: metadata.release_date
		},

		name: name,
		description: description,
		exitStatusTable: exitStatusTable,
		footnotes: footnotes,
		seeAlso: {
			links: seeAlso.links.map(SeeAlsoLink.from).filter((seeAlsoLink) => {
				return seeAlsoLink !== null;
			}) as SeeAlsoLink[],
			mansite: seeAlso.mansite
		}
	};
});
