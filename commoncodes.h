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

/* See <https://speziil.github.io/commoncodes/v/0.4.0.html> for more info */

#define CC_SUCCESS        0 /* success */
#define CC_GEN_ERR        1 /* generic error */
#define CC_GEN_USAGE_ERR  2 /* generic usage error */
#define CC_MISS_ARGS      3 /* missing arguments */
#define CC_TOO_MANY_ARGS  4 /* too many arguments */
#define CC_INV_OPT        5 /* invalid option */
#define CC_UNEX_OPT       6 /* unexpected option */
#define CC_INV_ARG        7 /* invalid argument */
#define CC_UNKNOWN_SUBCMD 8 /* unknown subcommand */
#define CC_UNKNOWN_CMD    8 /* unknown command */
#define CC_NO_EMPTY_ARG   9 /* may not be empty */
#define CC_NO_BLANK_ARG   9 /* may not be blank */
#define CC_NO_NUM         10 /* not a number */
#define CC_NO_INT         10 /* not an integer */
#define CC_OUT_OF_RANGE   11 /* out of range */
#define CC_NO_MATCH       12 /* does not match */
/* 13 - 23: custom usage errors */
#define CC_NO_SUCH_ITEMTYPE 24 /* no such itemtype */
#define CC_NOT_A_ITEMTYPE   25 /* not a itemtype */
#define CC_NOT_AN_ITEMTYPE  25 /* not an itemtype */
#define CC_NET_ERR          26 /* network error */
#define CC_NO_NET_CON       27 /* no network connection */
#define CC_CON_TIMED_OUT    28 /* connection timed out */
#define CC_ARIT_ERR         29 /* arithmetic error */
#define CC_DIV_BY_0_ERR     30 /* divied by 0 error */
#define CC_OFLOW_ERR        31 /* overflow error */
#define CC_UFLOW_ERR        31 /* underflow error */
/* 32 - 47: custom feedback statuses */
/* 48 - 63: custom errors */
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
/* 79 - 98: custom configuration errors */
#define CC_MEM_ERR           99 /* memory error */
#define CC_NO_MEM           100 /* not enough memory */
#define CC_NO_HMEM          100 /* not enough heap memory */
#define CC_STACK_OFLOW_ERR  101 /* stack overflow error */
#define CC_GEN_INTERN_FAULT 100 /* generic internal fault */
/* 101 - 122: custom internal faults */
#define CC_EMERG_STOP                      123 /* emergency stop */
#define CC_SCRIPT_CALLED_INTERACTIVELY     124 /* script was called interactively */
#define CC_SCRIPT_NOT_CALLED_INTERACTIVELY 124 /* script was not called interactively */
#define CC_UNKNOWN_ERR                     125 /* unknown error */

#endif /* _COMMONCODES_H */
