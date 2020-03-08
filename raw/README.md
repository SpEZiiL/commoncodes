# CommonCodes: raw/ directory #

The files in this directory hold the raw data of **CommonCodes**.

* [`name`](./v2/name)  
  The first section in the man page, copied over after trimming and compressing
   whitespace
* [`description`](./v2/description)  
  The first section in the web page and the second in the man page.  
  Text around curly braces(`{}`) are specially formatted.  
  Dependent on the format, what exactly is done differs.  
  Read more about this format in the [next section](#description-format) of this
   file
* [`status-code-table`](./v2/status-code-table)  
  The table with all the status codes.  
  Each status has three parts to it:
  1. The exit code(s)  
     Placed at the beginning of a line. Needs to be a number.  
     If there are two codes, separated by a dash(`-`), the two numbers are
      interpreted as beginning and end of a code range
  2. The status message  
     After the exit code, separated by whitespace, it has a special format,
     similar to command usage patterns
  3. The description  
     Written after the exit code and status message line.  
     Each line of the description needs to start with two spaces.  
     The entirety of the description uses the same format as the
      [`description`](./v2/description) file
* [`footnotes`](./v2/footnotes)  
  Section after the status code table.  
  Same format as the [`description`](./v2/description) file
* [`see also`](./v2/see-also)  
  The last section with some links and references.  
  Lines beginning with `plainlink:` will be put into angle brackets(`<>`) in the
   manpage and in the web page it will be wrapped inside an `a` tag.  
  If a line begins with `manlink:` nothing is done in the man page format but in
   the web page format the man section and the page will be put into the link
   described by the line that beginns with `mansite:`
* [`author`](./v2/author)  
  A list of authors.  
  Each line is one author and they will be separated with commas
* [`version`](./v2/version)  
  A file with three values:
  * `version` - the full version name of **CommonCodes**
  * `date` - the last date this version of **CommonCodes** was changed
  * `latest_release` - if this version is the latest release or not  
    used for the status line at the beginning of the web page format
* [copyright](./v2/copyright)  
  A file with two values:
  * `years` - all years in which a revision of **CommonCodes** was released
  * `holder` - the copyright holder of **CommonCodes**

## Description Format ##

### Line Breaks ###

A new line translates to an actual new line in the different formats except
 when the next line starts with an extra space.

	Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	 Vestibulum porta purus quis.
	Aenean at nisl vitae urna bibendum scelerisque sed non ex. Curabitur.

The first two dummy text sentences will be generated in the same line, the rest
 of the text will be generated on a new line.

### Paragraphs ###

A new paragraph starts with two new lines

	Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	Vestibulum porta purus quis.
	
	Aenean at nisl vitae urna bibendum scelerisque sed non ex.
	Curabitur.

### Lists ###

Lists can be created by putting an asterisk(`*`) at the beginning of a paragraph.  
Any new asterisk at the beginning of a line is another item in the list.

	* foo
	* bar

A list is NOT created after a single line break.

	Lorem ipsum dolor sit amet.
	* foo
	* bar

### Formatting Commands ###

Any text in curly braces(`{}`) will be differently formatted. How they are
 formatted depends on what command is used.  
The command is specified after the opening brace. After whitespace, the text to
 format is written.

	{p Lorem} ipsum dolor sit amet, consectetur adipiscing elit.
	 {c Pellentesque et} arcu fermentum, cursus erat iaculis.

In this example the word `Lorem` is formatted with the command `p`, which stands
 for _"proper name"_ and the text `Pellentesque et` is formatted with the
 command `c`, which stands for _"code"_ and will generate the text in a
 monospace font.

These formatting commands are defined:

* `e` - _emphasis_  
  Formats the text italic in web pages and underlined in man pages
* `s` - _strong emphasis_  
  Formats the text bold in web and man pages
* `p` - _proper name_  
  Defines the text as a proper name  
  In the web and man page, this is displayed as bold text
* `c` - _code_  
  Displays this text in a monospace font in the web page  
  In the man page, the text is made bold
* `m` - _message_  
  A special command that formats the text the same way the status message in the
   status code table is formatted
* `mp` - _message placeholder_  
  Formats the text the same way as any text in angle brackets is displayed in
   the `m` command  
  In web pages, the text is made italic and is underlined  
  In man pages, the text is only underlined
* `mc` - _message control_  
  Formats the text the same way as square brackets, parenthesis and ellipsis are
   displayed in the `m` command  
* `cb`/`cbo` - _curly brace (open)_  
  Inserts an open curly brace
* `cbc` - _curly brace closed_  
  Inserts a closed curly brace
