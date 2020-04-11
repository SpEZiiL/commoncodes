import Exception from "@mfederczuk/custom-exception";
import * as ejs from "ejs";
import { PathLike, writeFile } from "fs";
import CommonCodesData from "../../CommonCodesData";
import FormatCreator from "../FormatCreator";

export default class WebpageFormatCreator extends FormatCreator {
	constructor(private readonly generatedDate: Date,
	            private readonly baseFile: PathLike,
	            private readonly outDir: PathLike,
	            private readonly pretty: boolean = false) {
		super();
	}

	create(dataSet: readonly CommonCodesData[]): void {
		dataSet.forEach((data) => {
			const ejsData = {
				// TODO
			};

			ejs.renderFile(this.baseFile.toString(), ejsData, (err, page) => {
				if(err !== null) throw Exception.fromError(err);

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
