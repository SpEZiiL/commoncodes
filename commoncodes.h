/*
 * CommonCodes C header file - Standardized list of commonly used exit statuses.
 * Copyright (C) 2019 Michael Federczuk
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

#ifndef _COMMONCODES_H
#define _COMMONCODES_H

/* See <https://speziil.github.io/commoncodes/v/0.3.0.html> for more info */

#define CC_SUCCESS       0 /* success */
#define CC_GEN_ERR       1 /* generic error */
#define CC_GEN_USAGE_ERR 2 /* generic usage error */
#define CC_MISS_ARGS     3 /* missing arguments */
#define CC_TOO_MANY_ARGS 4 /* too many arguments */
#define CC_INV_OPT       5 /* invalid option */
#define CC_INV_ARG       6 /* invalid argument */
#define CC_NO_EMPTY_ARG  7 /* may not be empty */
#define CC_NO_BLANK_ARG  7 /* may not be blank */
#define CC_NO_NUM        8 /* not a number */
#define CC_NO_NO_NEG_NUM 8 /* not a non-negative number */
#define CC_NO_INT        8 /* not an integer */
#define CC_NO_UINT       8 /* not an unsigned integer */
#define CC_NO_MATCH      9 /* does not match */
/* 10 - 15: custom usage errors */
#define CC_NO_SUCH_ITEMTYPE 16 /* no such itemtype */
#define CC_NOT_A_ITEMTYPE   17 /* not a itemtype */
#define CC_NOT_AN_ITEMTYPE  17 /* not an itemtype */
/* #define CC_ 18 */
/* #define CC_ 19 */
/* #define CC_ 20 */
/* #define CC_ 21 */
#define CC_NET_ERR         22 /* network error */
#define CC_NO_NET_CON      23 /* no network connection */
#define CC_CON_TIMED_OUT   24 /* connection timed out */
#define CC_ARIT_ERR        25 /* arithmetic error */
#define CC_DIV_BY_0_ERR    26 /* divied by 0 error */
#define CC_OFLOW_ERR       27 /* overflow error */
#define CC_UFLOW_ERR       27 /* underflow error */
#define CC_MEM_ERR         28 /* memory error */
#define CC_NO_MEM          29 /* not enough memory */
#define CC_NO_HMEM         29 /* not enough heap memory */
#define CC_STACK_OFLOW_ERR 30 /* stack overflow error */
#define CC_EMERG_STOP      31 /* emergency stop */
/* 32 - 63: custom errors */
/* BSD errors */
#define CC_USAGE       64 /* command line usage error */
#define CC_DATAERR     65 /* data format error */
#define CC_NOINPUT     66 /* cannot open input */
#define CC_NOUSER      67 /* addresse unknown */
#define CC_NOHOST      68 /* host name unknown */
#define CC_UNAVAILABLE 69 /* service unavailable */
#define CC_SOFTWARE    70 /* internal software error */
#define CC_OSERR       71 /* system error (e.g., can't fork) */
#define CC_OSFILE      72 /* critical OS file missing */
#define CC_CANTCREAT   73 /* can't create (user) output file */
#define CC_IOERR       74 /* inout/output error */
#define CC_TEMPFAIL    75 /* temp failure; user is invited to retry */
#define CC_PROTOCOL    76 /* remote error in protocol */
#define CC_NOPERM      77 /* permission denied */
#define CC_CONFIG      78 /* configuration error */
/* BSD errors end */
/* 79 - 99: custom configuration errors */
#define CC_GEN_INTERN_FAULT 100 /* generic internal fault */
/* 101 - 123: custom internal faults */
#define CC_SCRIPT_CALLED_INTERACTIVELY     124 /* script was called interactively */
#define CC_SCRIPT_NOT_CALLED_INTERACTIVELY 124 /* script was not called interactively */
#define CC_UNKNOWN_ERR                     125 /* unknown error */

#endif /* _COMMONCODES_H */
