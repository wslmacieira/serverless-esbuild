import axios from "axios"
import runPromises from "./services/run-promises"
import { processRequestAsStream } from "./services/process-streams"
import jwt from 'jsonwebtoken'

let cachedToken: any;

export const handler = async () => {
  console.log('>>> JWT Cached: ', cachedToken);
  getToken()


  // const response = await processRequestAsStream()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello lambda!',
      // response
    })
  }
}

function getToken() {
  if (cachedToken) {
    const decode = JSON.parse(Buffer.from(cachedToken.access_token?.split('.')[1], 'base64').toString())
    if (decode.exp * 1000 > new Date().getTime()) {
      console.log('>>> JWT Cached: ', cachedToken);
      return cachedToken
    }
    console.log('Token Expired');
  }
  const access_token = jwt.sign({}, 'secret', { expiresIn: 10 })

  cachedToken = {
    access_token,
  }
  console.log('>>> JWT Service: ', cachedToken);
}