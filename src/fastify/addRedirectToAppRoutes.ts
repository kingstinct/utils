import type { FastifyInstance } from 'fastify'

const addRedirectToAppRoutes = (app: FastifyInstance) => {
  app.route({
    url: '/redirect-to-app/:appScheme/:path',
    method: 'GET',
    handler: async (req, res) => {
      const queryStr = req.url.split('?')[1] // could be anything
      const queryStrPart = queryStr ? `?${queryStr}` : ''
      const params = req.params as {readonly appScheme: string, readonly path: string}
      const redirectTo = `${params.appScheme}://${params.path}${queryStrPart}`

      return res.redirect(redirectTo)
    },
  })

  app.route({
    url: `/redirect-to-app/:appScheme`,
    method: 'GET',
    handler: async (req, res) => {
      const queryStr = req.url.split('?')[1] // could be anything
      const queryStrPart = queryStr ? `?${queryStr}` : ''
      const params = req.params as {readonly appScheme: string}
      const redirectTo = `${params.appScheme}://${queryStrPart}`

      return res.redirect(redirectTo)
    },
  })
}

export const getUrlForApp = (baseUrlToSelf: string, scheme: string, path?: string) => `${baseUrlToSelf}/${scheme}${path ? `/${path}` : ''}`

export default addRedirectToAppRoutes
