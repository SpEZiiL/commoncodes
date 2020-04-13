import Exception from "@mfederczuk/custom-exception";
import { Description, DescriptionBlockElement, DescriptionInlineElement } from "../../description";
import { parseStatusMessage, StatusMessage, StatusMessageAtom } from "../../statusMessage";
import { escapeForTroff } from "./escapeForTroff";
import { statusMessageToTroff } from "./statusMessageToTroff";

function descriptionInlineElementToTroff(inlineElement: DescriptionInlineElement): string {
	if(inlineElement instanceof DescriptionInlineElement.TextSpan) {
		return escapeForTroff(inlineElement.text);
	}

	if(inlineElement instanceof DescriptionInlineElement.CommandSpan) {
		const text = inlineElement.textSpan.text;
		const troffText = descriptionInlineElementToTroff(inlineElement.textSpan);

		switch(inlineElement.type) {
			case(DescriptionInlineElement.CommandSpan.Type.EMPHASIS):
			case(DescriptionInlineElement.CommandSpan.Type.CODE): {
				return `\\fI\\,${troffText}\\/\\fR`;
			}
			case(DescriptionInlineElement.CommandSpan.Type.STRONG_EMPHASIS):
			case(DescriptionInlineElement.CommandSpan.Type.PROPER_NAME): {
				return `\\fB${troffText}\\fR`;
			}
			case(DescriptionInlineElement.CommandSpan.Type.MESSAGE): {
				return statusMessageToTroff(parseStatusMessage(text));
			}
			case(DescriptionInlineElement.CommandSpan.Type.MESSAGE_PLACEHOLDER): {
				const statusMessage = new StatusMessage([new StatusMessageAtom.Placeholder(text)]);
				return statusMessageToTroff(statusMessage);
			}
			case(DescriptionInlineElement.CommandSpan.Type.CURLY_BRACE_OPEN): {
				return "{";
			}
			case(DescriptionInlineElement.CommandSpan.Type.CURLY_BRACE_CLOSED): {
				return "}";
			}
			default: {
				throw new Exception("Unsupported description command span type");
			}
		}
	}

	throw new Exception("Unsupported description inline element");
}

function descriptionInlineElementsToTroff(inlineElements: readonly DescriptionInlineElement[]): string {
	return inlineElements.map((inlineElement) => {
		return descriptionInlineElementToTroff(inlineElement);
	}).join("");
}

function descriptionBlockElementToTroff(blockElement: DescriptionBlockElement): string {
	if(blockElement instanceof DescriptionBlockElement.Paragraph) {
		return ".P\n" +
		       descriptionInlineElementsToTroff(blockElement.elements);
	}

	if(blockElement instanceof DescriptionBlockElement.List) {
		return blockElement.items.map((item, i) => {
			return ".IP \\[bu]" + (i === 0 ? " 2" : "") + "\n" +
			       descriptionInlineElementsToTroff(item);
		}).join("\n") + `\n.P`;
	}

	throw new Exception("Unsupported description block element");
}

export function descriptionToTroff(description: Description): string {
	return description.elements.map((element) => {
		return descriptionBlockElementToTroff(element);
	}).join("\n\n");
}
