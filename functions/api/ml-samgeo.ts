export interface Env {
  API_URL: string
  AUTH0_AUTHOURIZER_CLIENT_ID: string
  AUTH0_AUTHOURIZER_CLIENT_SECRET: string
  VITE_AUTH0_AUDIENCE: string
}

export const onRequest: PagesFunction = async (context) => {
  console.log('onRequest::context:', context, '#')
  try {
    const { request, env } = context
    console.log('onRequest::env:', env, '#')
    console.log('onRequest::request:', request, '#')
    
    const bodyRequest = await request.json()
    console.log('onRequest::bodyRequest:', typeof bodyRequest, "|", bodyRequest, '#')
    
    const authHeaderRequest = request.headers.get("Authorization")
    console.log('onRequest::header:', authHeaderRequest, '#')

    // Change just the host
    const urlApiRequest = new URL(env.API_URL);
    urlApiRequest.hostname = env.API_DOMAIN;
    console.log('onRequest::urlApiRequest:', urlApiRequest, "|", env.API_URL, env.API_DOMAIN, '#')

    const apiNewRequest = new Request(urlApiRequest.toString(), {
      method: "POST",
      headers: {"authorization": authHeaderRequest, "Content-type": "application/json"},
      body: JSON.stringify(bodyRequest)
    })
    console.log('onRequest::apiNewRequest:', apiNewRequest, '#')

    const apiResponse = await fetch(apiNewRequest)
    console.log('onRequest::apiResponse:', apiResponse, '#')
    const bodyResponse = await apiResponse.json()
    console.log('onRequest::bodyResponse:', typeof bodyResponse, "|", typeof bodyResponse.statusCode, "|", bodyResponse, '#')

    if (bodyResponse.statusCode === 200) {
      return new Response(JSON.stringify(bodyResponse.body))
    } else {
      return new Response(`Error: API statusCode ${bodyResponse.statusCode} from API`, {
        status: bodyResponse.statusCode
      })
    }
  } catch (err) {
    console.error('onRequest::err:', err, '#')
    return new Response('Error parsing JSON content', {
      status: 400
    })
  }
}
