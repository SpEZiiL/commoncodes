import Exception from "@mfederczuk/custom-exception";
import { Description, DescriptionBlockElement, DescriptionInlineElement } from "../../description";
import { parseStatusMessage, StatusMessage, StatusMessageAtom } from "../../statusMessage";
import { escapeForHTMLText } from "./escapeForHTML";
import { statusMessageToHTML } from "./statusMessageToHTML";

function descriptionInlineElementToHTML(inlineElement: DescriptionInlineElement, pretty: boolean): string {
	if(inlineElement instanceof DescriptionInlineElement.TextSpan) {
		const html = escapeForHTMLText(inlineElement.text);

		if(!pretty) return html;

		return html.replace(/<br(\s*)\/>/g, (_, ws) => {
			return `<br${ws}/>\n`;
		});
	}

	if(inlineElement instanceof DescriptionInlineElement.CommandSpan) {
		const text = inlineElement.textSpan.text;
		const htmlText = descriptionInlineElementToHTML(inlineElement.textSpan, pretty);

		switch(inlineElement.type) {
			case(DescriptionInlineElement.CommandSpan.Type.EMPHASIS): {
				return `<em>${htmlText}</em>`;
			}
			case(DescriptionInlineElement.CommandSpan.Type.STRONG_EMPHASIS): {
				return `<strong>${htmlText}</strong>`;
			}
			case(DescriptionInlineElement.CommandSpan.Type.PROPER_NAME): {
				return `<span class="proper-name">${htmlText}</span>`;
			}
			case(DescriptionInlineElement.CommandSpan.Type.CODE): {
				return `<code class="code-bg">${htmlText}</code>`;
			}
			case(DescriptionInlineElement.CommandSpan.Type.MESSAGE): {
				return statusMessageToHTML(parseStatusMessage(text));
			}
			case(DescriptionInlineElement.CommandSpan.Type.MESSAGE_PLACEHOLDER): {
				const statusMessage = new StatusMessage([new StatusMessageAtom.Placeholder(text)]);
				return statusMessageToHTML(statusMessage);
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

function descriptionInlineElementsToHTML(inlineElements: readonly DescriptionInlineElement[], pretty: boolean): string {
	return inlineElements.map((inlineElement) => {
		return descriptionInlineElementToHTML(inlineElement, pretty);
	}).join("");
}

function descriptionBlockElementToHTML(blockElement: DescriptionBlockElement, pretty: boolean): string {
	if(blockElement instanceof DescriptionBlockElement.Paragraph) {
		const elements = blockElement.elements;

		if(elements.length === 0) return "<p></p>";

		const html = descriptionInlineElementsToHTML(elements, pretty);

		if(html.length === 0) return `<p>${pretty ? "\n" : ""}</p>`;

		if(!pretty) return `<p>${html}</p>`;
		return "<p>\n\t" + html.replace(/\n/g, "\n\t") + "\n</p>";
	}

	if(blockElement instanceof DescriptionBlockElement.List) {
		const items = blockElement.items;

		if(items.length === 0) return "<ul></ul>";

		const html = items.map((item) => {
			if(item.length === 0) return "<li></li>";

			const html = descriptionInlineElementsToHTML(item, pretty);

			if(html.length === 0) return `<li>${pretty ? "\n" : ""}</li>`;

			if(!pretty) return `<li>${html}</li>`;
			return "<li>\n\t" + html.replace(/\n/g, "\n\t") + "\n</li>";
		}).join(pretty ? "\n" : "");

		if(html.length === 0) return `<ul>${pretty ? "\n" : ""}</ul>`;

		if(!pretty) return `<ul>${html}</ul>`;
		return "<ul>\n\t" + html.replace(/\n/g, "\n\t") + "\n</ul>";
	}

	throw new Exception("Unsupported description block element");
}

export function descriptionToHTML(description: Description, pretty: boolean): string {
	let html = "";

	description.elements.forEach((atom, i) => {
		if(pretty && i > 0) html += "\n\n";
		html += descriptionBlockElementToHTML(atom, pretty);
	});

	return html;
}
