import Exception from "@mfederczuk/custom-exception";
import { StatusMessage, StatusMessageAtom } from "../../statusMessage";
import { escapeForTroff } from "./escapeForTroff";

function italic(str: string, escape: boolean): string {
	return `\\fI\\,${escape ? escapeForTroff(str) : str}\\/\\fR`;
}
function bold(str: string, escape: boolean): string {
	return `\\fB${escape ? escapeForTroff(str) : str}\\fR`;
}

function statusMessageAtomToTroff(atom: StatusMessageAtom): string {
	if(atom instanceof StatusMessageAtom.Placeholder) {
		if(atom.special) {
			return bold(atom.placeholder, true);
		} else {
			return italic(atom.placeholder, true);
		}
	}

	if(atom instanceof StatusMessageAtom.Literal) {
		return escapeForTroff(atom.literal);
	}

	if(atom instanceof StatusMessageAtom.Group) {
		const parenPair: [string, string] = (atom.optional ? ["[", "]"] : ["(", ")"]);

		return bold(parenPair[0], true) +
		       statusMessageAtomsToTroff(atom.atoms) +
		       bold(parenPair[1], true);
	}

	if(atom instanceof StatusMessageAtom.Iteration) {
		return statusMessageAtomToTroff(atom.atom) +
		       bold("...", true);
	}

	if(atom instanceof StatusMessageAtom.Alteration) {
		return statusMessageAtomsToTroff(atom.leftAtoms) +
		       bold("|", true) +
		       statusMessageAtomsToTroff(atom.rightAtoms);
	}

	throw new Exception("Unsupported status message atom");
}

function statusMessageAtomsToTroff(atoms: readonly StatusMessageAtom[]): string {
	return atoms.map((atom) => {
		return statusMessageAtomToTroff(atom);
	}).join("");
}

export function statusMessageToTroff(statusMessage: StatusMessage): string {
	return statusMessageAtomsToTroff(statusMessage.atoms);
}
