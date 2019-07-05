<!-- markdownlint-disable MD024 MD007 MD033 -->

# Changelog #

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] ##

[Unreleased]: https://github.com/SpEZiiL/commoncodes/compare/v1.0.0...develop

### Added ###

* Inserted between Status 97 & 98: &lt;path&gt;: too many levels of symbolic link
* Inserted between Status 98 & 99: &lt;path&gt;: filename too long

## [1.0.0] - 2019-05-11 ##

[1.0.0]: https://speziil.github.io/commoncodes/v/0.3.0...1.0.0.html

### Added ###

* Inserted between status 5 & 6: &lt;option&gt;: unexpected option
* Inserted between status 7 & 8: &lt;argument&gt;: unknown [sub]command
* Inserted between status 10 & 11: [&lt;option&gt;: ]&lt;argument&gt;: out of
  range[ (&lt;relational_op&gt; &lt;limit&gt;)]
* Common placeholder and CommonCodes usage explanation to description
* Status 3 & 4: Added explanation for placeholder to description
* grep(1) to See Also page section

### Changed ###

* Status 7 & 3: Tweaked messages a bit
* Status 9: Added to description a bit
* Status 8: Tweaked message and description
* Statuses 10 - 15 → 13 - 23
* Status 16 → 20
* Status 17 → 21
* Moved memory errors and emergency stop error up inbetween the custom
  configuration errors and the internal faults
* Statuses 32 - 47: custom feedback statuses

## [0.3.0] - 2019-05-06 ##

[0.3.0]: https://speziil.github.io/commoncodes/v/0.2.0...0.3.0.html

### Added ###

* `commoncodes.h` C header file
* Inserted between status 4 & 5: &lt;option&gt;: invalid option
* Inserted between status 6 & 7: argument #&lt;n&gt;: may not be empty/blank
* **See Also** page section with GitHub repo link

### Changed ###

* Status 100 & 124: Tweaked description a bit
* Moved statuses 21 - 26 one code up  
  e.g.: 21 → 22, and 26 → 27

## [0.2.0] - 2019-05-05 ##

[0.2.0]: https://speziil.github.io/commoncodes/v/0.1.0...0.2.0.html

### Added ###

* Status 21: network error
* Status 22: no network connection
* Status 23: connection timed out
* Status 30: stack overflow error
* Explanation for the message synopsis to description

### Changed ###

* Status 29: Tweaked message a bit
	* "not enough memory" → "not enough [heap ]memory"

## [0.1.0] - 2019-05-03 ##

[0.1.0]: https://speziil.github.io/commoncodes/v/0.1.0.html

### Added ###

* Usage Errors
	* 2 - 15
* Some Other Errors
	* 16, 17, 24 - 26, 28, 29, 31 - 63
* **BSD** Errors
	* 64 - 78
* Miscellaneous Errors
	* 1, 79 - 125
