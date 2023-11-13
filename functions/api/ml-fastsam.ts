export interface Env {
  API_URL: string
  API_DOMAIN: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
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
    const bodyResponse: string = await apiResponse.json()
    console.log('onRequest::status:', typeof bodyResponse.status, "|", bodyResponse.status, '#')
    console.log('onRequest::statusCode:', typeof bodyResponse.statusCode, "|", bodyResponse.statusCode, '#')
    console.log('onRequest::bodyResponse:', typeof bodyResponse, "|", bodyResponse.length, "|", bodyResponse, '#')

    try {
      const bodyResponseParsed = JSON.parse(bodyResponse)
      console.log('onRequest:: bodyResponseParsed: ### ', typeof bodyResponseParsed, "|", bodyResponseParsed, '#')

      if (bodyResponseParsed.statusCode === 200) {
        const innerBodyReponseParsed = bodyResponseParsed.body
        console.log('onRequest::innerBodyReponseParsed:', typeof innerBodyReponseParsed, "|", innerBodyReponseParsed, '#')
        return new Response(JSON.stringify(innerBodyReponseParsed))
      } else {
        return new Response(`Error: API statusCode ${bodyResponse.statusCode} / ${bodyResponse.status} / ${bodyResponseParsed.statusCode} from API`, {
          status: bodyResponse.statusCode
        })
      }
    } catch (error_request) {
      console.log(`error_request:${error_request}.`)
      return new Response("error parsing JSON content on API response...", {
        status: 400
      })
    }
  } catch (err) {
    console.error('onRequest::err:', err, '#')
    return new Response('Error parsing JSON content on API request...', {
      status: 400
    })
  }
}
