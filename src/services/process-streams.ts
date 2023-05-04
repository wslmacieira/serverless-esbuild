import { Readable, Transform } from "stream"
import { pipeline } from "stream/promises"
import { bufferingObjectStream } from "../utils/buffering"
import axios, { AxiosResponse } from "axios"

axios.interceptors.response.use((value) => 
  ({ status: value.status, data: value.data }) as AxiosResponse<any, any>
)

const data = Array.from({ length: 200 }, (_, idx) => idx + 1)
const url = 'https://jsonplaceholder.typicode.com/todos'

export const processRequestAsStream = async () => {
  const started = new Date()
  let results: any[] = []
  const stream = Readable.from(selectDataAsStream(data))
  await pipeline(
    stream,
    bufferingObjectStream(20),
    promisesAxiosRequest(url),
    executeAxiosRequest,
    async function* (source) {
      for await (const item of source) {
        // console.log(item);
        results = results.concat(item)
      }
    }
    // process.stdout
  )
  console.log('Stream ended!')
  console.log(`Process took: ${new Date().getTime() - started.getTime()}ms`)
  return results
}

async function* selectDataAsStream(data: any) {
  for (const item of data) yield item
}

const promisesAxiosRequest = (url: string) => new Transform({
  objectMode: true,
  transform(chunks, enc, cb) {
    const promises = chunks.map((chunk: any) => axios.get(`${url}/${chunk}`)
      .catch((err) => ({
        status: err.response?.status,
        data: `[${chunk}]: Produto-${chunk}`
      })))
    cb(null, promises)
  }
})

const executeAxiosRequest = new Transform({
  objectMode: true,
  async transform(chunks, enc, cb) {
    const response = await Promise.all(chunks)
    cb(null, response)
  }
})