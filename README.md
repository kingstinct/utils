# @kingstinct/utils

[![npm (scoped)](https://img.shields.io/npm/v/@kingstinct/utils?style=for-the-badge)](https://www.npmjs.com/package/@kingstinct/utils)

This is a generic utility library that we use across our projects at Kingstinct (still early days for this lib).

There are two main imports, one generic and one for some node-specific stuff:
`import { wait, times, sample, logPrettyData } from '@kingstinct/utils'`

`import { gravatarUrlForEmail } from '@kingstinct/utils/lib/node'`

You can also import utilities directly:
`import wait from '@kingstinct/utils/lib/wait'`

The goal of this library is to:
- Keep the number of dependencies in projects down
- Have a common place to put useful utilities, so we can maintain them in one place
- Quickly get up and running with new projects
