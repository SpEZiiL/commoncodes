import Exception from "./Exception";

export abstract class MessageAtom {
	abstract toString(): string;
}

export namespace MessageAtom {
	// <>
	// <<>>
	export class Placeholder extends MessageAtom {
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
	export class Literal extends MessageAtom {
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
	export class Group extends MessageAtom {
		constructor(readonly atoms: ReadonlyArray<MessageAtom>,
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
	export class Iteration extends MessageAtom {
		constructor(readonly atom: MessageAtom) {
			super();
		}

		toString(): string {
			return `${this.atom}...`;
		}
	}

	// |
	export class Alteration extends MessageAtom {
		constructor(readonly leftAtoms: ReadonlyArray<MessageAtom>,
		            readonly rightAtoms: ReadonlyArray<MessageAtom>) {
			super();
		}

		toString(): string {
			return `${this.leftAtoms}|${this.rightAtoms}`;
		}
	}
}

export class Message {
	constructor(readonly atoms: ReadonlyArray<MessageAtom>) {}

	toString(): string {
		return this.atoms.join("");
	}
}

export class MessageSyntaxError extends Exception {
	constructor(faultyMessage: string,
	            detailMessage: string,
	            cause: (Exception | null) = null) {
		super(`${faultyMessage}: ${detailMessage}`, cause);
	}
}

export function parseMessage(raw: string): Message {
	let atoms: MessageAtom[] = [];

	const l = raw.length;
	for(let i = 0; i < l; ) {
		let c = raw[i];

		if(raw.substr(i, 3) === "...") {
			if(atoms.length === 0) {
				throw new MessageSyntaxError(raw, "Cannot iterate over nothing");
			}

			const lastAtom = atoms[atoms.length - 1];
			if(lastAtom instanceof MessageAtom.Iteration) {
				throw new MessageSyntaxError(raw, "Cannot iterate over another iteration");
			} else if(lastAtom instanceof MessageAtom.Literal) {
				throw new MessageSyntaxError(raw, "Cannot iterate over a literal");
			}

			atoms[atoms.length - 1] = new MessageAtom.Iteration(lastAtom);

			i += 3;
		} else if(c === "<") {
			const special = (raw[i + 1] === "<");

			let placeholder = "";

			i += (!special ? 1 : 2);

			let match = false;
			for(; i < l; ++i) {
				if(!special) {
					match = raw[i] === ">";
				} else {
					match = raw.substr(i, 2) === ">>";
				}
				if(match) break;

				placeholder += raw[i];
			}

			if(!match) {
				const detailMessage = ((): string => {
					if(!special) {
						return "Unmatched placeholder";
					} else {
						return "Unmatched special placeholder";
					}
				})();

				throw new MessageSyntaxError(raw, detailMessage);
			}

			try {
				atoms.push(new MessageAtom.Placeholder(placeholder, special));
			} catch(err) {
				throw new MessageSyntaxError(raw, "Problematic placeholder", err);
			}

			i += (!special ? 1 : 2);
		} else if(c === ">") {
			throw new MessageSyntaxError(raw, "Unmatched placeholder");
		} else if(c === "(" || c === "[") {
			const optional = c === "[";

			let contents = "";

			const parenStack: ("(" | "[")[] = [c];
			for(++i; i < l; ++i) {
				c = raw[i];
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
				throw new MessageSyntaxError(raw, "Unmatched group");
			}

			atoms.push(new MessageAtom.Group(parseMessage(contents).atoms, optional));

			++i;
		} else if(c === ")" || c === "]") {
			throw new MessageSyntaxError(raw, "Unmatched group");
		} else if(c === "|") {
			const leftAtoms = atoms;
			const rightAtoms = parseMessage(raw.substring(i + 1)).atoms;
			atoms = [new MessageAtom.Alteration(leftAtoms, rightAtoms)];
			i = l;
		} else {
			if(c === "\\" && (i + 1) < l) {
				++i;
				c = raw[i];
			}

			const lastAtom = atoms[atoms.length - 1];
			if(lastAtom instanceof MessageAtom.Literal) {
				atoms[atoms.length - 1] = new MessageAtom.Literal(lastAtom.literal + c);
			} else {
				atoms.push(new MessageAtom.Literal(c));
			}

			++i;
		}
	}

	return new Message(atoms);
}
