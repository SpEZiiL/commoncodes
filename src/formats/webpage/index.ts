import { PathLike } from "fs";
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
		// TODO
	}
}
