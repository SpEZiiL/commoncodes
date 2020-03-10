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
	constructor(faultyMessage: string,
	            detailMessage: string,
	            cause: (Exception | null) = null) {
		super(`${faultyMessage}: ${detailMessage}`, cause);
	}
}

export function parseStatusMessage(str: string): StatusMessage {
	let atoms: StatusMessageAtom[] = [];

	const l = str.length;
	for(let i = 0; i < l; ) {
		let c = str[i];

		if(str.substr(i, 3) === "...") {
			if(atoms.length === 0) {
				throw new StatusMessageSyntaxError(str, "Cannot iterate over nothing");
			}

			const lastAtom = atoms[atoms.length - 1];
			if(lastAtom instanceof StatusMessageAtom.Iteration) {
				throw new StatusMessageSyntaxError(str, "Cannot iterate over another iteration");
			} else if(lastAtom instanceof StatusMessageAtom.Literal) {
				throw new StatusMessageSyntaxError(str, "Cannot iterate over a literal");
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
				const detailMessage = ((): string => {
					if(!special) {
						return "Unmatched placeholder";
					} else {
						return "Unmatched special placeholder";
					}
				})();

				throw new StatusMessageSyntaxError(str, detailMessage);
			}

			try {
				atoms.push(new StatusMessageAtom.Placeholder(placeholder, special));
			} catch(err) {
				throw new StatusMessageSyntaxError(str, "Problematic placeholder", err);
			}

			i += (!special ? 1 : 2);
		} else if(c === ">") {
			throw new StatusMessageSyntaxError(str, "Unmatched placeholder");
		} else if(c === "(" || c === "[") {
			const optional = c === "[";

			let contents = "";

			const parenStack: ("(" | "[")[] = [c];
			for(++i; i < l; ++i) {
				c = str[i];
				if(c === "(" || c === "[") {
					parenStack.push(c);
				} else if(c === ")" || c === "]") {
					const lastParen = parenStack[parenStack.length - 1];
					if((lastParen === "(" && c === ")") ||
					   (lastParen === "[" && c === "]")) {
						parenStack.pop();
					}
				}

				if(parenStack.length === 0) break;
				contents += c;
			}
			if(parenStack.length !== 0) {
				throw new StatusMessageSyntaxError(str, "Unmatched group");
			}

			atoms.push(new StatusMessageAtom.Group(parseStatusMessage(contents).atoms, optional));

			++i;
		} else if(c === ")" || c === "]") {
			throw new StatusMessageSyntaxError(str, "Unmatched group");
		} else if(c === "|") {
			const leftAtoms = atoms;
			const rightAtoms = parseStatusMessage(str.substring(i + 1)).atoms;
			atoms = [new StatusMessageAtom.Alteration(leftAtoms, rightAtoms)];
			i = l;
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
