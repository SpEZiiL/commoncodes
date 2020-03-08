<!-- markdownlint-disable MD024 -->

# Changelog #

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] ##

[Unreleased]: https://github.com/mfederczuk/commoncodes/compare/v1.0.0...develop

### Added ###

* new status 98: `<path>: too many levels of symbolic link`
* new status 99: `<path>: filename too long`
* `glob(7)` and `regex(7)` to **See Also** page section
* to status range 32 - 47 (`(custom feedback statuses)`) description
  * _"**[...]** These should always be documented."_

### Changed ###

* statuses 26 (`network error[: <info>]`) - 29 (`arithmetic error[: <info>]`)
  positions to 28 - 31
* status range 79 - 98 (`(custom configuration errors)`) to 79 - 97 (-1)
* statuses 99 (`memory error`) - 102 (`generic internal fault`) positions to
  100 - 103
* status range 103 - 122 (`(custom internal faults)`) to 104 - 122 (-1)
* status 9 (`may not be empty`) description
  * _"Program can not **[...]**"_ → _"The program can not **[...]**"_

### Fixed ###

* status 12 (`does not match`) message (typo fix)
  * `[<option>: ]<argument>: does not match: <patttern>` →
    `[<option>: ]<argument>: does not match: <pattern>`
* status 74 (`input/output error`) message (typo fix)
  * `input/output errorv` → `input/output error`

### Removed ###

* status 30: `divided by 0 error`
* status 31: `(overflow|underflow) error`

## [1.0.0] - 2019-05-11 ##

[1.0.0]: https://mfederczuk.github.io/commoncodes/v/0.3.0...1.0.0.html

### Added ###

* new status 6: `<option>: unexpected option`
* new status 8: `<argument>: unknown [sub]command`
* new status 11: `[<option>: ]<argument>: out of range[ (<relational_op> <limit>)]`
* new statuses 32 - 47: `(custom feedback error)`
* to status 3 (`missing arguments`) description
  * _"**[...]**¶&lt;arguments&gt; may be the placeholder name of the missing arguments."_
* to status 4 (`too many arguments`) description
  * _"**[...]**¶&lt;n&gt; may be the amount of arguments that are not needed."_
* to status 7 (`may not be empty`) description
  * _"**[...]**¶&lt;n&gt; is the position of the argument that is empty/blank and is only really needed when the program/option needs multiple arguments."_
* `[: <info>]` and `<option>` placeholder explanation to description
* `grep(1)` to "**See Also**" page section

### Changed ###

* status 6 (`invalid argument`) position to 7
* statuses 7 (`may not be empty`) & 8 (`not a number`) positions to 9 & 10
* status 9 (`does not match`) position to 12
* status range 10 - 15 (`(custom usage errors)`) to 13 - 23 (+5)
* statuses 16 (`no such itemtype`) & 17 (`not an itemtype`) positions to 24 & 25
* statuses 22 (`network error`) - 27 (`overflow/underflow error`) positions to
  26 - 31
* statuses 28 (`memory error`) - 30 (`stack overflow`) positions to 99 - 101
* status 31 (`emergency stop`) position to 123
* status range 32 - 63 (`(custom errors)`) to 48 - 63 (-16)
* status range 79 - 99 (`(custom configuration errors)`) to 79 - 98 (-1)
* status 100 (`generic internal fault`) position to 102
* status range 101 - 123 (`(custom internal faults)`) to 103 - 122 (-2)
* status 3 (`missing arguments`) message
  * `[<option>: ]missing argument(s)[: <arguments>...]` →
    `[<option>: ]missing argument[s][: <argument>...]`
* status 7 (`may not be empty`) message
  * `argument #<n>: may not be (empty|blank)` →
    `[<option>:]argument [<n>:]may not be (empty|blank)`

### Removed ###

* from status 8 (`not a number`) description
  * _"**[...]**¶If a valid decimal number has been entered and this exit status is returned then you must convert the decimal number into an integer."_

## [0.3.0] - 2019-05-06 ##

[0.3.0]: https://mfederczuk.github.io/commoncodes/v/0.2.0...0.3.0.html

### Added ###

* new status 5: `<option>: invalid option`
* new status 7: `argument #<n>: may not be (empty|blank)`
* `commoncodes.h` **C** header file
* "**See Also**" page section with GitHub repo link

### Changed ###

* status 5 (`invalid argument`) position: moved one code up
* status 6 (`not a number`) and status 7 (`does not match`) positions: moved two
  codes up
* status 21 (`network error`) to status 26 (`overflow/underflow error`) positions:
  moved one code up
* status 100 (`internal fault`) description
  * _"**[...]** to a stage where user input is awaited."_ →
    _"**[...]** to a next stage of execution."_
* status 124 (`interactive script call`) description
  * _"The script can **[...]**"_ → _"The shell script can **[...]**"_

### Removed ###

* statuses 8 and 9: `(custom usage errors)`

## [0.2.0] - 2019-05-05 ##

[0.2.0]: https://mfederczuk.github.io/commoncodes/v/0.1.0...0.2.0.html

### Added ###

* status 21: `network error[: <info>]`
* status 22: `no network connection`
* status 23: `connection timed out`
* status 30: `stack overflow error`
* explanation for the message synopsis to description

### Changed ###

* status 29 (`not enough memory`) message and description
  * message: `not enough memory` → `not enough [heap ]memory`"
  * description: _"**[...]** not enough memory to allocate **[...]**"_ →
    _"**[...]** not enough free memory on the heap to allocate **[...]**"_

## [0.1.0] - 2019-05-03 ##

[0.1.0]: https://mfederczuk.github.io/commoncodes/v/0.1.0.html

### Added ###

* status 0: `sucess`
* status 1: `generic error[: <info>]`
* status 2: `generic usage error[: <info>]`
* status 3: `[<option>: ]missing argument(s)[: <arguments>...]`
* status 4: `[<option>: ]too many arguments[: <n>]`
* status 5: `[<option>: ]<argument>: invalid argument[: <info>]`
* status 6: `[<option>: ]<argument>: not a[n] (number|integer)`
* status 7: `[<option>: ]<argument>: does not match: <pattern>`
* status 8 - 15: `(custom usage errors)`
* status 16: `<item>: no such <itemtype>[[, <itemtype>]... or <itemtype>]`
* status 17: `<item>: not a[n] <itemtype>[[, <itemtype>]... or <itemtype>]`
* status 24: `arithmetic error[: <info>]`
* status 25: `divided by 0 error`
* status 26: `(overflow|underflow) error`
* status 28: `memory error[: <info>]`
* status 29: `not enough memory`
* status 31: `emergency stop[: <info>]`
* status 32 - 63: `(custom errors)`
* status 64: `command line usage error[: <info>]`
* status 65: `data format eror[: <info>]`
* status 66: `cannot open input[: <info>]`
* status 67: `addressee unknown[: <info>]`
* status 68: `host name unknoen[: <info>]`
* status 69: `service unavailable[: <info>]`
* status 70: `internal software error[: <info>]`
* status 71: `system error[: <info>]`
* status 72: `critical OS file missing[: <info>]`
* status 73: `can't create (user) output file[: <info>]`
* status 74: `input/output error[: <info>]`
* status 75: `temp failure[: <info>]`
* status 76: `remote error in protocol[: <info>]`
* status 77: `permission denied[: <info>]`
* status 78: `configuration error[: <info>]`
* status 79 - 99: `(custom configuration errors)`
* status 100: `generic internal fault[: <info>]`
* status 101 - 123: `(custom internal faults)`
* status 124: `script was [not ]called interactively`
* status 125: `unknown error`
