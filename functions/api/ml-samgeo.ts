export interface Env {
  API_URL: string
  AUTH0_AUTHOURIZER_CLIENT_ID: string
  AUTH0_AUTHOURIZER_CLIENT_SECRET: string
  VITE_AUTH0_AUDIENCE: string
}

export async function onRequest(context) {
  const authorizerUrl = `https://${context.env.VITE_AUTH0_DOMAIN}/oauth/token`

  const authorizerBody = {
    client_id: context.env.AUTH0_AUTHOURIZER_CLIENT_ID,
    client_secret: context.env.AUTH0_AUTHOURIZER_CLIENT_SECRET,
    audience: context.env.VITE_AUTH0_AUDIENCE,
    grant_type: 'client_credentials'
  }
  const authorizerReponse = await fetch(authorizerUrl, {
    method: "POST",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(authorizerBody)
  })
  const token = await authorizerReponse.json()

  const apiResponse = await fetch(context.env.API_URL, {
    method: "POST",
    headers: {"authorization": `Bearer ${token.access_token}`},
    body: JSON.stringify({"bbox": [1, 2, 3, 4], "points": [[3, 777]]})
  })
  const apiBody = await apiResponse.json()

  return new Response(`api url: ${JSON.stringify(apiBody)}.`)
  // return new Response(`api url`)
}
