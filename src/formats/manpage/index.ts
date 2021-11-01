import Exception from "@mfederczuk/custom-exception";
import dateFormat from "dateformat";
import { PathLike, writeFile } from "fs";
import CommonCodesData from "../../CommonCodesData";
import FormatCreator from "../FormatCreator";
import { descriptionToTroff } from "./descriptionToTroff";
import { escapeForTroff } from "./escapeForTroff";
import { statusMessageToTroff } from "./statusMessageToTroff";

export default class ManpageFormatCreator extends FormatCreator {
	constructor(private readonly generatedDate: Date,
	            private readonly outDir: PathLike) {
		super();
	}

	create(dataSet: readonly CommonCodesData[]): void {
		const latestData = dataSet[dataSet.length - 1];

		let file = "";

		file += `.\\" generated: ${dateFormat(this.generatedDate, "isoUtcDateTime")}`;

		file += "\n\n";

		file += ".TH" +
		        " commoncodes" +
		        " 7" +
		        ` "${latestData.metadata.releaseVersion.format()}"` +
		        ` "${dateFormat(latestData.metadata.releaseDate, "mmmm d, yyyy")}"` +
		        ` "CommonCodes man page"`;

		file += "\n\n";

		file += ".SH NAME\n" +
		        ".P\n" +
		        escapeForTroff("CommonCodes - " + latestData.about);

		file += "\n\n";

		file += ".SH DESCRIPTION\n" +
		        descriptionToTroff(latestData.description, true);

		file += "\n\n";

		file += ".SH EXIT STATUS TABLE\n" +
		        `.IP "\\fBExit Code\\fR" 12\n` +
		        "\\fBMessage\\fR\n" +
		        ".br\n" +
		        "\\fBDescription\\fR\n" +
		        latestData.exitStatusTable.map((status) => {
			        return `.IP "${(typeof(status.code) === "number") ? status.code : status.code.rangeStart + " - " + status.code.rangeEnd}"\n` +
			               statusMessageToTroff(status.message) + "\n" +
			               ".br\n" +
			               descriptionToTroff(status.description, false);
		        }).join("\n") +
		        "\n.P";

		file += "\n\n";

		file += ".SH FOOTNOTES\n" +
		        descriptionToTroff(latestData.footnotes, true);

		file += "\n\n";

		file += ".SH SEE ALSO\n" +
		        ".P\n" +
		        latestData.seeAlso.links.map((seeAlsoLink) => {
			        const link = seeAlsoLink.getLink();
			        if(link[0] !== null) {
				        return `<${link[0].url}>`;
			        } else {
				        return `${link[1].page}(${link[1].section})`;
			        }
		        }).join(", ");

		file += "\n\n";

		file += ".SH AUTHORS\n" +
		        ".P\n" +
		        latestData.metadata.authors.map((author) => {
			        return (author.name  !== undefined ? `${escapeForTroff(author.name)}\n`    : "") +
			               (author.email !== undefined ? `<${escapeForTroff(author.email)}>\n` : "") +
			               (author.url   !== undefined ? `(${escapeForTroff(author.url)})\n`   : "");
		        }).join(".br\n");

		const outFile = this.outDir + "/commoncodes.7";
		const options = { mode: 0o644 }; // -rw-r--r--

		writeFile(outFile, file, options, (err) => {
			if(err !== null) throw Exception.fromError(err);
			console.log(`Finished generating ${outFile}`);
		});
	}
}
