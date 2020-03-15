import Exception from "@mfederczuk/custom-exception";
import { Description, parseDescription } from "./description";
import { parseStatusMessage, StatusMessage } from "./statusMessage";

export interface ExitStatus {
	readonly code: number | {
		readonly rangeStart: number;
		readonly rangeEnd: number;
	};
	readonly message: StatusMessage;
	readonly description: Description;
}

export type ExitStatusTable = readonly ExitStatus[];
export type MutableExitStatusTable = ExitStatus[];

export namespace MutableExitStatusTable {
	export function parse(str: string): MutableExitStatusTable {
		const lines = str.split("\n").filter((line) => {
			return !line.startsWith("#");
		});
		const statuses: MutableExitStatusTable = [];

		const s = lines.length;
		for(let i = 0; i < s; ) {
			let line = lines[i];

			const match = line.match(/^((?<code>\d+)|(?<codeRangeStart>\d+)-(?<codeRangeEnd>\d+))\s+(?<message>.*)$/);
			if(match !== null && match.groups !== undefined) {
				const message = parseStatusMessage(match.groups["message"]);
				const codeStr = match.groups["code"] as (string | undefined);

				const description = ((): Description => {
					const descriptionLines: string[] = [];

					for(++i; i < s; ++i) {
						line = lines[i];
						let match: RegExpMatchArray | null = null;
						if((match = line.match(/^( ){,2}$/)) !== null) {
							descriptionLines.push("");
						} else if((match = line.match(/^  (?<descriptionLine>.+)$/)) !== null &&
							match.groups !== undefined) {
							descriptionLines.push(match.groups["descriptionLine"]);
						} else {
							break;
						}
					}

					return parseDescription(descriptionLines.join("\n"));
				})();

				if(codeStr !== undefined) {
					const code = Number(codeStr);

					statuses.push({
						code: code,
						message: message,
						description: description
					});
				} else {
					const codeRangeStart = Number(match.groups["codeRangeStart"]);
					const codeRangeEnd = Number(match.groups["codeRangeEnd"]);

					statuses.push({
						code: {
							rangeStart: codeRangeStart,
							rangeEnd: codeRangeEnd
						},
						message: message,
						description: description
					});
				}
			} else if(line.match(/^\s*$/) !== null) {
				++i;
			} else {
				throw new Exception("Weird line in status table: " + line);
			}
		}

		return statuses;
	}
}
export namespace ExitStatusTable {
	export function parse(str: string): ExitStatusTable {
		return MutableExitStatusTable.parse(str);
	}
}
