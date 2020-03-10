import { readdirSync, realpathSync } from "fs";

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
