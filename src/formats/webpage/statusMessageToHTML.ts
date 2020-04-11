import Exception from "@mfederczuk/custom-exception";
import { StatusMessage, StatusMessageAtom } from "../../statusMessage";
import { escapeForHTMLText } from "./escapeForHTML";

function inSpanTag(className: string, text: string, escape: boolean): string {
	if(escape) text = escapeForHTMLText(text);
	return `<span class="${className}">${text}</span>`;
}

const MESSAGE_CLASS_NAME                     = "message";
const MESSAGE_CONTROL_CLASS_NAME             = "message_control";
const MESSAGE_PLACEHOLDER_CLASS_NAME         = "message_placeholder";
const MESSAGE_SPECIAL_PLACEHOLDER_CLASS_NAME = "message_special-placeholder";
const MESSAGE_LITERAL_CLASS_NAME             = "message_literal";

function statusMessageAtomToHTML(atom: StatusMessageAtom): string {
	if(atom instanceof StatusMessageAtom.Placeholder) {
		const className = (atom.special ? MESSAGE_SPECIAL_PLACEHOLDER_CLASS_NAME : MESSAGE_PLACEHOLDER_CLASS_NAME);
		return inSpanTag(className, atom.placeholder, true);
	}

	if(atom instanceof StatusMessageAtom.Literal) {
		return inSpanTag(MESSAGE_LITERAL_CLASS_NAME, atom.literal, true);
	}

	if(atom instanceof StatusMessageAtom.Group) {
		const parenPair: [string, string] = (atom.optional ? ["[", "]"] : ["(", ")"]);

		return inSpanTag(MESSAGE_CONTROL_CLASS_NAME, parenPair[0], true) +
		       statusMessageAtomsToHTML(atom.atoms) +
		       inSpanTag(MESSAGE_CONTROL_CLASS_NAME, parenPair[1], true);
	}

	if(atom instanceof StatusMessageAtom.Iteration) {
		return statusMessageAtomToHTML(atom.atom) +
		       inSpanTag(MESSAGE_CONTROL_CLASS_NAME, "...", true);
	}

	if(atom instanceof StatusMessageAtom.Alteration) {
		return statusMessageAtomsToHTML(atom.leftAtoms) +
		       inSpanTag(MESSAGE_CONTROL_CLASS_NAME, "|", true) +
		       statusMessageAtomsToHTML(atom.rightAtoms);
	}

	throw new Exception("Unsupported status message atom");
}

function statusMessageAtomsToHTML(atoms: readonly StatusMessageAtom[]): string {
	return atoms.map((atom) => {
		return statusMessageAtomToHTML(atom);
	}).join("");
}

export function statusMessageToHTML(statusMessage: StatusMessage): string {
	return `<code class="code-bg">` +
	       inSpanTag(MESSAGE_CLASS_NAME, statusMessageAtomsToHTML(statusMessage.atoms), false) +
	       "</code>";
}
