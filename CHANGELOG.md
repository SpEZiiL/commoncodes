<!-- markdownlint-disable MD024 MD007 MD033 -->

# Changelog #

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2019-05-06 ##

### Added ###

* `commoncodes.h` C header file
* **See Also** page section with GitHub repo link

### Changed ###

* Status 100 & 124: Tweaked description a bit
* Inserted status "_option_: invalid option" between status "too many arguments" and "_argument_: invalid argument"
	* Status "too many arguments" stays code 4
	* Status "_option_: invalid option" is now 5
	* Status "_argument_: invalid argument" is now 6
* Inserted status "argument #_n_: may not be empty/blank" between status "_argument_: invalid argument" and "_argument_: not a number/integer"
	* Status "_argument_: invalid argument" is now code 6
	* Status "argument #_n_: may not be empty/blank" is now code 7
	* Status "_argument_: not a number/integer" is now code 8

[Unreleased]: https://github.com/SpEZiiL/commoncodes/compare/v0.2.0...develop

## [0.2.0] - 2019-05-05 ##

### Added ###

* Status 21: network error
* Status 22: no network connection
* Status 23: connection timed out
* Status 30: stack overflow error

### Changed ###

* Status 29: Tweaked message a bit
	* "not enough memory" → "not enough <b>[</b>heap <b>]</b>memory"

[0.2.0]: https://speziil.github.io/commoncodes/v/0.2.0.html

## [0.1.0] - 2019-05-03 ##

### Added ###

* Usage Errors
	* 2 - 15
* Some Other Errors
	* 16, 17, 24 - 26, 28, 29, 31 - 63
* **BSD** Errors
	* 64 - 78
* Miscellaneous Errors
	* 1, 79 - 125

[0.1.0]: https://speziil.github.io/commoncodes/v/0.1.0.html
