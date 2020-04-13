import chalk from "chalk";

function log(msg: string): void {
	console.log(msg);
}
namespace log {
	export const sourceStyle = chalk.bold;
	export const errorStyle = chalk.red.bold;
	export const warningStyle = chalk.yellow.bold;

	const errorTag = errorStyle("error:");
	const warningTag = warningStyle("warning:");

	export function source(source: string): {
		error(msg: string): void;
		warning(msg: string): void;
	} {
		source = `${source}:`;
		source = sourceStyle(source);

		return {
			error(msg: string): void {
				console.error(`${source} ${errorTag} ${msg}`);
			},
			warning(msg: string): void {
				console.warn(`${source} ${warningTag} ${msg}`);
			}
		};
	}

	export function error(msg: string): void {
		console.error(`${errorTag} ${msg}`);
	}
	export function warning(msg: string): void {
		console.warn(`${warningTag} ${msg}`);
	}
}

export default log;
