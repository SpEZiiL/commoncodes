import Exception from "./Exception";

export abstract class Element {
	abstract toString(): string;
}

export abstract class InlineElement extends Element {
	abstract toString(): string;
}
export namespace InlineElement {
	export class TextSpan extends InlineElement {
		readonly text: string;

		constructor(text: string) {
			super();

			if(text.includes("\n\n")) {
				throw new Exception("Text may not contain multiple line breaks in sequence");
			}

			// compress whitespace
			this.text = text.replace(/\s+/g, (substring) => (substring[0]));
		}

		toString(): string {
			return this.text;
		}
	}

	export class CommandSpan extends InlineElement {
		constructor(readonly type: CommandSpan.Type, readonly textSpan: TextSpan) {
			super();
		}

		toString(): string {
			let str = "{" + this.type.getCommands()[0];

			const escapedText = this.textSpan.text.replace(/^[\\{}]$/g, (substring) => {
				return `\\${substring}`;
			});
			if(escapedText !== "") str += ` ${escapedText}`;

			return str + "}";
		}
	}
	export namespace CommandSpan {
		export class Type {
			private static _values: Type[] = [];

			private readonly commands: readonly string[];

			private constructor(ordinal: number,
			                    name: string,
			                    command: string);
			private constructor(ordinal: number,
			                    name: string,
			                    commands: string[]);
			private constructor(readonly ordinal: number,
			                    private readonly name: string,
			                    commandOrCommands: string | string[]) {
				if(typeof(commandOrCommands) === "string") {
					this.commands = [commandOrCommands];
				} else {
					this.commands = commandOrCommands;
				}

				Type._values.push(this);
			}

			getCommands(): readonly string[] {
				return this.commands;
			}

			toString(): string {
				return this.name;
			}

			static readonly EMPHASIS            = new Type(0, "EMPHASIS",            "e");
			static readonly STRONG_EMPHASIS     = new Type(1, "STRONG_EMPHASIS",     "s");
			static readonly PROPER_NAMES        = new Type(2, "PROPER_NAMES",        "p");
			static readonly CODE                = new Type(3, "CODE",                "c");
			static readonly MESSAGE             = new Type(4, "MESSAGE",             "m");
			static readonly MESSAGE_PLACEHOLDER = new Type(5, "MESSAGE_PLACEHOLDER", "mp");
			static readonly MESSAGE_CONTROL     = new Type(6, "MESSAGE_CONTROL",     "mc");
			static readonly CURLY_BRACE_OPEN    = new Type(7, "CURLY_BRACE_OPEN",    ["cb", "cbo"]);
			static readonly CURLY_BRACE_CLOSED  = new Type(8, "CURLY_BRACE_CLOSED",  "cbc");

			static from(name: string): (Type | null) {
				for(const value of Type._values) {
					if(value.name === name) return value;
				}
				return null;
			}

			static fromCommand(command: string): (Type | null) {
				for(const value of Type._values) {
					if(value.commands.includes(command)) return value;
				}
				return null;
			}

			static values(): readonly Type[] {
				return Type._values;
			}
		}
	}
}

export abstract class BlockElement extends Element {
	abstract toString(): string;
}
export namespace BlockElement {
	export class Paragraph extends BlockElement {
		constructor(readonly elements: readonly InlineElement[]) {
			super();
		}

		toString(): string {
			return "\n" + this.elements.join("") + "\n";
		}
	}

	export class List extends BlockElement {
		constructor(readonly items: ReadonlyArray<readonly InlineElement[]>) {
			super();
		}

		toString(): string {
			let str = "";

			const s = this.items.length;
			if(s > 0) str = "* " + this.items[0].join("").replace(/\n/, "\n  ");

			for(let i = 1; i < s; ++i) {
				str += "\n* " + this.items[i].join("").replace(/\n/, "\n  ");
			}

			return "\n" + str + "\n";
		}
	}
}

export class Description {
	constructor(readonly atoms: readonly BlockElement[]) {}

	toString(): string {
		return this.atoms.join("").trim();
	}
}

/** paramer str shouldn't contain line breaks */
function parseInlineElementes(str: string): readonly InlineElement[] {
	const elements: InlineElement[] = [];

	let commandType: (InlineElement.CommandSpan.Type | null) = null;
	let text = "";

	function pushTextSpan(): void {
		if(text !== "") {
			elements.push(new InlineElement.TextSpan(text));
			text = "";
		}
	}

	const l = str.length;
	for(let i = 0; i < l; ) {
		const c = str[i];

		if(commandType === null && c === "{") {
			pushTextSpan();

			let commandStr = "";
			for(++i; i < l && (str[i].match(/^\s$/) === null) &&
			                  str[i] !== "}"; ++i) {
				commandStr += str[i];
			}

			if(commandStr === "") throw new Exception("Braces without command");

			// skip whitespace
			for(; i < l && (str[i].match(/^\s$/) !== null); ++i);

			commandType = InlineElement.CommandSpan.Type.fromCommand(commandStr);
			if(commandType === null) {
				throw new Exception(`Unknown command "${commandStr}"`);
			}

			continue;
		}

		if(commandType !== null) {
			if(c === "}") {
				elements.push(new InlineElement.CommandSpan(commandType, new InlineElement.TextSpan(text)));
				commandType = null;
				text = "";

				++i;
				continue;
			}

			if(c === "\\" && i + 1 < l) {
				const escChar = str[i + 1];

				if(escChar === "\\" || escChar === "{" || escChar === "}") {
					text += escChar;
					i += 2;
					continue;
				}
			}
		}

		text += c;
		++i;
	}

	if(commandType !== null) throw new Exception("Unclosed command");
	pushTextSpan();

	return elements;
}

function optimizeElements(elements: readonly InlineElement[]): readonly InlineElement[] {
	const optimizedElements: InlineElement[] = [];

	elements.forEach((element) => {
		const lastOptimizedElement = optimizedElements[optimizedElements.length - 1] as (InlineElement | undefined);
		if(lastOptimizedElement === undefined) {
			optimizedElements.push(element);
			return; // continue forEach
		}

		if(element instanceof InlineElement.TextSpan) {
			if(element.text !== "") {
				if(lastOptimizedElement instanceof InlineElement.TextSpan) {
					optimizedElements[optimizedElements.length - 1] = new InlineElement.TextSpan(lastOptimizedElement.text + element.text);
				} else {
					optimizedElements.push(element);
				}
			}
		} else {
			optimizedElements.push(element);
		}
	});

	return optimizedElements;
}

export function parseDescription(str: string): Description {
	str = str.trim().replace(/\n{3,}/g, "\n\n");

	const blocks: BlockElement[] = [];

	str.split("\n\n").forEach((block) => {
		let paragraphElements = null as (InlineElement[] | null);
		let listItems = null as (InlineElement[][] | null);

		function pushParagraphElements(): void {
			if(paragraphElements !== null) {
				blocks.push(new BlockElement.Paragraph(optimizeElements(paragraphElements)));
				paragraphElements = null;
			}
		}
		function pushListItems(): void {
			if(listItems !== null) {
				blocks.push(new BlockElement.List(listItems.map(optimizeElements)));
				listItems = null;
			}
		}

		block.split("\n").forEach((line) => {
			if(line.startsWith("* ")) {
				pushParagraphElements();
				if(listItems === null) listItems = [];

				listItems.push([]);
				listItems[listItems.length - 1].push(...parseInlineElementes(line.substring(2)));
			} else if(listItems !== null && line.startsWith("  ")) {
				if(listItems[listItems.length - 1].length > 0 && !line.startsWith("   ")) {
					listItems[listItems.length - 1].push(new InlineElement.TextSpan("\n"));
				}
				listItems[listItems.length - 1].push(...parseInlineElementes(line.substring(2)));
			} else {
				pushListItems();
				if(paragraphElements === null) paragraphElements = [];

				if(paragraphElements.length > 0 && !line.startsWith(" ")) {
					paragraphElements.push(new InlineElement.TextSpan("\n"));
				}
				paragraphElements.push(...parseInlineElementes(line));
			}
		});

		pushParagraphElements();
		pushListItems();
	});

	return new Description(blocks);
}
