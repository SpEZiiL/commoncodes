# CommonCodes #

[version_shield]: https://img.shields.io/badge/version-3.0.0-blue.svg
[latest_release]: https://mfederczuk.github.io/commoncodes "Latest Release"
[![version: 3.0.0][version_shield]][latest_release]
[![Changelog](https://img.shields.io/badge/-Changelog-blue.svg)](./CHANGELOG.md "Changelog")

## About ##

**CommonCodes** is an attempt to create a standardized list of program exit
 statuses.

---

So one day I wondered if there was any standard for exit statuses/codes, because
 I, like (hopefully) many other people like following pre-existing standards.  
I was rather disappointed to see that there wasn't really anything like that.  
I could only find **Bash**s definition for codes above 125, that were used for
 special cases like termination through a sent signal, and
 [`sysexits.h`](https://man.openbsd.org/sysexits), which is kinda what I was
 looking for, but there weren't many definitions, and the ones that did exist
 were just too generic.

Now, you can't really call this a proper standardization. I wanted a full list
 of statuses, where every code from 0 to 255 was defined to have some meaning.
 But this was just something that did not exist... until now.

## Contributing ##

Read through the [CommonCodes Contribution Guidelines](./CONTRIBUTING.md)
 if you want to contribute to this project.

## License ##

[GNU GPLv3+](./LICENSE)
