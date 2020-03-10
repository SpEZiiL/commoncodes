import Exception from "./Exception";

export abstract class StatusMessageAtom {
	abstract toString(): string;
}

export namespace StatusMessageAtom {
	// <>
	// <<>>
	export class Placeholder extends StatusMessageAtom {
		constructor(readonly placeholder: string,
		            readonly special: boolean = false) {
			super();

			if(!special) {
				if(placeholder.match(/^\w+$/i) === null) {
					throw Error("Invalid placeholder");
				}
			} else {
				if(placeholder.includes(">>")) {
					throw Error("Invalid placeholder");
				}
			}

		}

		toString(): string {
			if(!this.special) {
				return `<${this.placeholder}>`;
			} else {
				return `<<${this.placeholder}>>`;
			}
		}
	}

	// foobar
	export class Literal extends StatusMessageAtom {
		constructor(readonly literal: string) {
			super();
		}

		toString(): string {
			return this.literal.replace("<", "\\<")
			                   .replace(">", "\\>")
			                   .replace("(", "\\(")
			                   .replace(")", "\\)")
			                   .replace("[", "\\[")
			                   .replace("]", "\\]")
			                   .replace("...", "\\...")
			                   .replace("|", "\\|")
			                   .replace("\\", "\\\\");
		}
	}

	// ()
	// []
	export class Group extends StatusMessageAtom {
		constructor(readonly atoms: readonly StatusMessageAtom[],
		            readonly optional: boolean = false) {
			super();
		}

		toString(): string {
			if(!this.optional) {
				return `(${this.atoms.join("")})`;
			} else {
				return `[${this.atoms.join("")}]`;
			}
		}
	}

	// ...
	export class Iteration extends StatusMessageAtom {
		constructor(readonly atom: StatusMessageAtom) {
			super();
		}

		toString(): string {
			return `${this.atom}...`;
		}
	}

	// |
	export class Alteration extends StatusMessageAtom {
		constructor(readonly leftAtoms: readonly StatusMessageAtom[],
		            readonly rightAtoms: readonly StatusMessageAtom[]) {
			super();
		}

		toString(): string {
			return `${this.leftAtoms}|${this.rightAtoms}`;
		}
	}
}

export class StatusMessage {
	constructor(readonly atoms: readonly StatusMessageAtom[]) {}

	toString(): string {
		return this.atoms.join("");
	}
}

export class StatusMessageSyntaxError extends Exception {
	constructor(readonly faultyStatusMessage: string,
	            readonly rangeStart: number,
	            readonly rangeLength: number,
	            readonly problem: StatusMessageSyntaxError.Problem,
	            cause: (Exception | null) = null) {
		super(`${faultyStatusMessage}: ${problem.getMessage()}`, cause);
	}
}

export namespace StatusMessageSyntaxError {
	export class Problem {
		private static _values: Problem[] = [];

		private constructor(readonly ordinal: number,
		                    private readonly name: string,
		                    private readonly message: string) {
		}

		getMessage(): string {
			return this.message;
		}

		toString(): string {
			return this.name;
		}

		static readonly ITERATED_OVER_NOTHING               = new Problem(0,  "ITERATED_OVER_NOTHING",               "Iteration over nothing");
		static readonly ITERATED_OVER_ITERATION             = new Problem(1,  "ITERATED_OVER_ITERATION",             "Iteration over iteration");
		static readonly ITERATED_OVER_LITERAL               = new Problem(2,  "ITERATED_OVER_LITERAL",               "Iteration over literal");
		static readonly UNMATCHED_PLACEHOLDER_BEGIN         = new Problem(3,  "UNMATCHED_PLACEHOLDER_BEGIN",         "Placeholder was never closed");
		static readonly UNMATCHED_PLACEHOLDER_END           = new Problem(4,  "UNMATCHED_PLACEHOLDER_END",           "Placeholder was never opened");
		static readonly UNMATCHED_SPECIAL_PLACEHOLDER_BEGIN = new Problem(5,  "UNMATCHED_SPECIAL_PLACEHOLDER_BEGIN", "Special placeholder was never closed");
		static readonly UNMATCHED_SPECIAL_PLACEHOLDER_END   = new Problem(6,  "UNMATCHED_SPECIAL_PLACEHOLDER_END",   "Special placeholder was never opened");
		static readonly INVALID_PLACEHOLDER                 = new Problem(7,  "INVALID_PLACEHOLDER",                 "Invalid placeholder");
		static readonly INVALID_SPECIAL_PLACEHOLDER         = new Problem(8,  "INVALID_SPECIAL_PLACEHOLDER",         "Invalid special placeholder");
		static readonly UNMATCHED_GROUP_OPEN                = new Problem(9,  "UNMATCHED_GROUP_OPEN",                "Group was never closed");
		static readonly UNMATCHED_GROUP_CLOSE               = new Problem(10, "UNMATCHED_GROUP_CLOSE",               "Group was never opened");
		static readonly UNMATCHED_OPTIONAL_GROUP_OPEN       = new Problem(10, "UNMATCHED_OPTIONAL_GROUP_OPEN",       "Optional group was never closed");
		static readonly UNMATCHED_OPTIONAL_GROUP_CLOSE      = new Problem(11, "UNMATCHED_OPTIONAL_GROUP_CLOSE",      "Optional group was never opened");

		static from(name: string): (Problem | null) {
			for(const value of Problem._values) {
				if(value.name === name) return value;
			}
			return null;
		}

		static values(): readonly Problem[] {
			return Problem._values;
		}
	}
}

export function parseStatusMessage(str: string): StatusMessage {
	let atoms: StatusMessageAtom[] = [];

	const l = str.length;
	for(let i = 0; i < l; ) {
		let c = str[i];

		if(str.substr(i, 3) === "...") {
			if(atoms.length === 0) {
				throw new StatusMessageSyntaxError(str, i, 3, StatusMessageSyntaxError.Problem.ITERATED_OVER_NOTHING);
			}

			const lastAtom = atoms[atoms.length - 1];
			if(lastAtom instanceof StatusMessageAtom.Iteration) {
				throw new StatusMessageSyntaxError(str, i - 3, 6, StatusMessageSyntaxError.Problem.ITERATED_OVER_ITERATION);
			} else if(lastAtom instanceof StatusMessageAtom.Literal) {
				throw new StatusMessageSyntaxError(str, i, 3, StatusMessageSyntaxError.Problem.ITERATED_OVER_LITERAL);
			}

			atoms[atoms.length - 1] = new StatusMessageAtom.Iteration(lastAtom);

			i += 3;
		} else if(c === "<") {
			const special = (str[i + 1] === "<");

			let placeholder = "";

			i += (!special ? 1 : 2);

			let match = false;
			for(; i < l; ++i) {
				if(!special) {
					match = str[i] === ">";
				} else {
					match = str.substr(i, 2) === ">>";
				}
				if(match) break;

				placeholder += str[i];
			}

			if(!match) {
				if(!special) {
					throw new StatusMessageSyntaxError(str, i - placeholder.length - 1, 1, StatusMessageSyntaxError.Problem.UNMATCHED_PLACEHOLDER_BEGIN);
				} else {
					throw new StatusMessageSyntaxError(str, i - placeholder.length - 2, 2, StatusMessageSyntaxError.Problem.UNMATCHED_SPECIAL_PLACEHOLDER_BEGIN);
				}
			}

			try {
				atoms.push(new StatusMessageAtom.Placeholder(placeholder, special));
			} catch(err) {
				if(!special) {
					throw new StatusMessageSyntaxError(str, i - placeholder.length - 1, 1 + placeholder.length, StatusMessageSyntaxError.Problem.INVALID_PLACEHOLDER, err);
				} else {
					throw new StatusMessageSyntaxError(str, i - placeholder.length - 2, 2 + placeholder.length, StatusMessageSyntaxError.Problem.INVALID_SPECIAL_PLACEHOLDER, err);
				}
			}

			i += (!special ? 1 : 2);
		} else if(str.substr(i, 2) === ">>") {
			throw new StatusMessageSyntaxError(str, i, 2, StatusMessageSyntaxError.Problem.UNMATCHED_SPECIAL_PLACEHOLDER_END);
		} else if(c === ">") {
			throw new StatusMessageSyntaxError(str, i, 1, StatusMessageSyntaxError.Problem.UNMATCHED_PLACEHOLDER_END);
		} else if(c === "(" || c === "[") {
			const begin = i;
			let contents = "";

			let parenLvl = 1;
			for(++i; i < l; ++i) {
				if(str[i] === c) {
					++parenLvl;
				} else if((c === "(" && str[i] === ")") ||
				          (c === "[" && str[i] === "]")) {
					--parenLvl;
				}

				if(parenLvl === 0) break;
				contents += str[i];
			}

			if(parenLvl !== 0) {
				if(c === "(") {
					throw new StatusMessageSyntaxError(str, begin, 1, StatusMessageSyntaxError.Problem.UNMATCHED_GROUP_OPEN);
				} else {
					throw new StatusMessageSyntaxError(str, begin, 1, StatusMessageSyntaxError.Problem.UNMATCHED_OPTIONAL_GROUP_OPEN);
				}
			}

			try {
				atoms.push(new StatusMessageAtom.Group(parseStatusMessage(contents).atoms, c !== "("));
			} catch(err) {
				if(err instanceof StatusMessageSyntaxError) {
					throw new StatusMessageSyntaxError(str, begin + 1 + err.rangeStart, err.rangeLength, err.problem, err);
				}
				throw err;
			}

			++i;
		} else if(c === ")") {
			throw new StatusMessageSyntaxError(str, i, 1, StatusMessageSyntaxError.Problem.UNMATCHED_GROUP_CLOSE);
		} else if(c === "]") {
			throw new StatusMessageSyntaxError(str, i, 1, StatusMessageSyntaxError.Problem.UNMATCHED_OPTIONAL_GROUP_CLOSE);
		} else if(c === "|") {
			try {
				const leftAtoms = atoms;
				++i;
				const rightAtoms = parseStatusMessage(str.substring(i)).atoms;
				atoms = [new StatusMessageAtom.Alteration(leftAtoms, rightAtoms)];
				i = l;
			} catch(err) {
				if(err instanceof StatusMessageSyntaxError) {
					throw new StatusMessageSyntaxError(str, i + err.rangeStart, err.rangeLength, err.problem, err);
				}
				throw err;
			}
		} else {
			if(c === "\\" && (i + 1) < l) {
				++i;
				c = str[i];
			}

			const lastAtom = atoms[atoms.length - 1];
			if(lastAtom instanceof StatusMessageAtom.Literal) {
				atoms[atoms.length - 1] = new StatusMessageAtom.Literal(lastAtom.literal + c);
			} else {
				atoms.push(new StatusMessageAtom.Literal(c));
			}

			++i;
		}
	}

	return new StatusMessage(atoms);
}
