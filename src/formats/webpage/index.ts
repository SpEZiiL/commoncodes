import Exception from "@mfederczuk/custom-exception";
import dateFormat from "dateformat";
import * as ejs from "ejs";
import { PathLike, writeFile } from "fs";
import { minify as minifyHTML, Options as HTMLMinifierOptions } from "html-minifier";
import CommonCodesData from "../../CommonCodesData";
import FormatCreator from "../FormatCreator";
import { escapeForHTMLAttr, escapeForHTMLText } from "./escapeForHTML";

const HTML_MINIFIER_OPTIONS: HTMLMinifierOptions = {
	collapseInlineTagWhitespace: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	removeComments: true
};

export default class WebpageFormatCreator extends FormatCreator {
	constructor(private readonly generatedDate: Date,
	            private readonly baseFile: PathLike,
	            private readonly outDir: PathLike,
	            private readonly pretty: boolean = false) {
		super();
	}

	create(dataSet: readonly CommonCodesData[]): void {
		const releaseVersions = dataSet.map((data) => (data.metadata.releaseVersion));

		dataSet.forEach((data) => {
			const ejsData = {
				escapeForHTMLText: escapeForHTMLText,
				escapeForHTMLAttr: escapeForHTMLAttr,

				generatedDate: this.generatedDate,
				currentReleaseVersion: data.metadata.releaseVersion,
				authors: data.metadata.authors,
				releaseVersions: releaseVersions,

				dateFormat: dateFormat

				// TODO
			};

			ejs.renderFile(this.baseFile.toString(), ejsData, (err, page) => {
				if(err !== null) throw Exception.fromError(err);

				if(!this.pretty) {
					page = minifyHTML(page, HTML_MINIFIER_OPTIONS);
				}

				const majorVersion = data.metadata.releaseVersion.major;
				const pageFile = `${this.outDir}/v${majorVersion}.html`;
				const options = { mode: 0o644 };

				writeFile(pageFile, page, options, (err) => {
					if(err !== null) throw Exception.fromError(err);
					console.log(`Finished generating ${pageFile}`);
				});
			});
		});
	}
}
