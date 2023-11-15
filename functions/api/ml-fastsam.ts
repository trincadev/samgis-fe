export interface Env {
  API_URL: string
  API_DOMAIN: string
}

interface HtmlStatusMessages {
  code: number,
  phrase: string
}

import {htmlStatusMessages} from '../../src/components/constants'

const getHtmlMessageStatus = (htmlStatusMessagesJSON: HtmlStatusMessages[], status: number) => {
  const currentHtmlErrorStatus = htmlStatusMessagesJSON.find((el) => el.code == status);
  return currentHtmlErrorStatus.phrase
}

function parsingResponseBody(bodyParsedResponseCustom: Response|string): Response {
  console.log('parsingResponseBody:: bodyParsedResponseCustom: ### ', typeof bodyParsedResponseCustom, "|", bodyParsedResponseCustom, '#')
  if (bodyParsedResponseCustom?.statusCode === 200) {
    const innerBodyReponseParsed = bodyParsedResponseCustom.body
    console.log('onRequest::innerBodyReponseParsed:', typeof innerBodyReponseParsed, "|", innerBodyReponseParsed, '#')
    return new Response(JSON.stringify(innerBodyReponseParsed))
  } else {
    console.log('onRequest:: error bodyParsedResponseCustom :', typeof bodyParsedResponseCustom, "|", bodyParsedResponseCustom, '#')
    let requestId;
    try {
      const errorBodyReponseParsed = JSON.parse(bodyParsedResponseCustom.body)
      console.log('onRequest:: error errorBodyReponseParsed :', typeof errorBodyReponseParsed, "|", errorBodyReponseParsed, '#')
      requestId = errorBodyReponseParsed.request_id
      console.log('onRequest:: error requestId :', typeof requestId, "|", requestId, '#')
    } catch (error_body) {
      console.log('onRequest:: error_body :', error_body, '#')
    }
    const statusCode = bodyParsedResponseCustom?.statusCode
    console.log('onRequest:: statusCode :', typeof statusCode, "|", statusCode, '#')
    const errorMessage = getHtmlMessageStatus(htmlStatusMessages, Number(statusCode))
    console.log('onRequest:: errorMessage :', typeof errorMessage, "|", errorMessage, '#')
    return new Response(`requestId: ${requestId}, got "${errorMessage}" error message as API response.`, {
      status: Number(statusCode)
    })
  }
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
      console.log('onRequest:: bodyResponse: ### ', typeof bodyResponse, "|", bodyResponse, '#')
      const bodyResponseParsed = JSON.parse(bodyResponse)
      console.log('onRequest:: bodyResponseParsed: ### ', typeof bodyResponseParsed, "|", bodyResponseParsed, '#')
      return parsingResponseBody(bodyResponseParsed)
    } catch (error_request1) {
      console.error(`error_response1:${error_request1}.`)
      try {
        console.log('onRequest:: error_response1 => parsingResponseBody, bodyResponse ### ', typeof bodyResponse, "|", bodyResponse, '#')
        return parsingResponseBody(bodyResponse)
      } catch (error_request2) {
        console.error(`error_request2:${error_request2}.`)
        return new Response("Error/2 parsing JSON content on API response...", {
          status: 400
        })
      }
    }
  } catch (err) {
    console.error('onRequest::err:', err, '#')
    return new Response('Error/0 parsing JSON content on API request...', {
      status: 400
    })
  }
}
