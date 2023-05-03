import axios from "axios"
import runPromises from "./services/run-promises"
import { processRequestAsStream } from "./services/process-requests"

export const handler = async() => {
  // const url = 'https://jsonplaceholder.typicode.com/todos'
  // runPromises(function*() {
  //   yield axios.get(url)
  // })

  const response = await processRequestAsStream()

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'hello lambda!!',
      response
    })
  }
}