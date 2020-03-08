# CommonCodes #

[version-shield]: https://img.shields.io/badge/version-1.0.0-blue.svg
[latest-release]: https://mfederczuk.github.io/commoncodes/v/1.0.0.html "Latest Release"
[![version: 1.0.0][version-shield]][latest-release]

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

I would greatly appreciate it if you would contribute! Just make sure to read
 through the [CONTRIBUTING.md](./CONTRIBUTING.md) file.
