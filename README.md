# @kingstinct/utils

[![npm (scoped)](https://img.shields.io/npm/v/@kingstinct/utils?style=for-the-badge)](https://www.npmjs.com/package/@kingstinct/utils)

This is a generic utility library that we use across our projects at Kingstinct (still early days for this lib).

There are two main imports, one generic and one for some node-specific stuff:
`import { wait, times, sample, logPrettyData } from '@kingstinct/utils'`

`import { gravatarUrlForEmail } from '@kingstinct/utils/lib/node'`

You can also import utilities directly:
`import wait from '@kingstinct/utils/lib/wait'`

The goal of this library (and the related [@kingstinct/react](https://github.com/Kingstinct/react)) is to:
- Keep the number of dependencies in projects down
- Have a common place to put useful utilities, so they're easier to maintain and find
- Quickly get up and running with new projects

We believe this is a better approach than the alternatives:
- Using one single utility library for everything, which would introduce unnecessary dependencies
- Using lots of micro-libs. Micro-libs does have it's advantages, but is harder to maintain and means loosing oversight of the dependencies in a project.
- Copy pasting between projects :)

## Timeoutify

Timeoutify is a utility to handle timeouts making it easy to clean up resources when a timeout occurs, and it can also be aborted for other reasons (client disconnects for example). 

The easiest way to use it is through the Fastify plugin:
  
  ```ts
  import fastify from 'fastify'
  import timeoutify from '@kingstinct/utils/fastify/timeoutifyPlugin'
  import mongodb from 'mongodb'

  const app = fastify()
  app.register(timeoutify, { timeout: 30000 }) // <- time out your request after 30 seconds

  const db = await mongodb.connect('mongodb://localhost:27017', { timeout: req.timeoutify.timeout })

  app.get('/callSomeOtherApi', async (req, res) => {    
    const result = await fetch('https://api.slow.app', { signal: req.timeoutify.abortSignal });
    return result;
  })

  app.get('/callMongoDb', async (req, res) => {    
    const result = await req.timeoutify.runMongoOpWithTimeout(
      db.collection('users').find({})
    );
    return result;
  })
  ```
This will take care of the following:
- If the timeout (of 30s in this example) is hit a 504 response will be sent to the client.
- If the client disconnects (ex: closes browser tab) a 499 response will be sent to the client.
- If the request is aborted (by either a timeout or client disconnect) the fetch request will be aborted.
- If the request times out the mongodb query will time out at the same time.