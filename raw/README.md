# CommonCodes: raw/ directory #

The files in this directory hold the raw data of **CommonCodes**.

* [`name`](./name)  
  The first section in the man page, copied over after trimming and compressing
   whitespace
* [`description`](./description)  
  The first section in the web page and the second in the man page  
  Text around curly braces(`{}`) are specially formatted  
  Dependent on the format, what exactly is done differs
  Read more about this format in the [next section](#description-format) of this
   file
* [`status-code-table`](./status-code-table)  
  The table with all the status codes  
  Each status has three parts to it:
  1. The exit code  
     Which is in the first line, at the beginning of the line  
     If after whitespace there is a dash(`-`) and another number it means that
      this entire range is the same status
  2. The status message  
     Also in the first line after the exit code and whitespace, it has a special
      format, similiar to usage patterns
  3. The description  
     After the first line, each line beginning with two spaces belongs to the
      description  
     The entirety of the description uses the same format as the
      [`description`](./description) file
* [`footnotes`](./footnotes)  
  Section after the status code table  
  Same format as the [`description`](./description) file
* [`see also`](./see-also)  
  The last section with some links and references  
  Lines beginning with `plainlink:` will be put into angle brackets(`<>`) and in
   the we page it will be wrapped inside an `a` tag
  If a line is beginning with `manlink:` nothing is done in the man page format
   but in the web page format the man section and the page will be put into the
    link described by the line beginning with `mansite:`
* [`author`](./author)  
  A list of authors.  
  Each line is on author and they will be separated with commas
* [`version`](./version)  
  A file with three values:
  * `version` - which specified the current version of **CommonCodes**
  * `date` - the last date this version of **CommonCodes** was changed
  * `latest_release` - if this version is the latest release or not  
    used for the web page format to know if to change the notice at the
     beginning of the page

## Description Format ##

A new line translates to an actual new line in the different formats except
 when the next line starts with an extra space.

	Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	 Vestibulum porta purus quis.
	Aenean at nisl vitae urna bibendum scelerisque sed non ex. Curabitur. 

The first two dummy text sentences will be generated in the same line, the rest
 of the text will be generated on a new line.

Any text in curly braces(`{}`) will be differently formatted. How they are
 formatted depends on what command with it is used.  
The command is specified right after the opening brace. After whitespace, the
 text to format is written.

	{p Lorem} ipsum dolor sit amet, consectetur adipiscing elit.
	 {c Pellentesque et} arcu fermentum, cursus erat iaculis. 

In this example the word `Lorem` is formatted with the command `p`, which stands
 for _"proper name"_ and the text `Pellentesque et` is formatted with the
 command `c`, which stands for _"code"_ and will generate the text in a
 monospace font.

These formatting commands are defined:

* `e` - _emphasis_  
  Formats the text italic in web pages and underlined in man pages
* `se` - _strong emphasis_  
  Formats the text bold in web and man pages
* `p` - _proper name_  
  Defines the text as a proper name  
  In the web and man page, this is displayed as bold text
* `c` - _code_  
  Displays this text in a monospace font in the web page  
  In the man page, the text is made bold
* `s` - _synopsis_  
  A special command that formats the text the same way the status message in the
   status code table is formatted
* `sp` - _synopsis placeholder_  
  Formats the text the same way as any text in angle brackets is displayed in
   the `s` command  
  In web pages, the text is made italic and is underlined  
  In man pages, the text is only underlined
* `sc` - _synopsis control_  
  Formats the text the same way as square brackets, parenthesis and ellipsis are
   displayed in the `s` command  
* `cb`/`cbo` - _curly brace (open)_  
  Inserts an open curly brace
* `cbc` - _curly brace closed_  
  Inserts a closed curly brace
