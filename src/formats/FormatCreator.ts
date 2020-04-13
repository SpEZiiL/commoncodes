import CommonCodesData from "../CommonCodesData";

export default abstract class FormatCreator {
	abstract create(dataSet: readonly CommonCodesData[]): void;
}
