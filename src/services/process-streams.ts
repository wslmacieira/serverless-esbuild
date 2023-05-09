import axios, { AxiosResponse } from "axios"
import { Readable, Transform } from "stream"
import { pipeline } from "stream/promises"
import { bufferingObjectStream } from "../utils/buffering"

axios.interceptors.response.use(({status, data}) => 
  ({ status, data }) as AxiosResponse<any, any>)

const data = Array.from({ length: 200 }, (_, idx) => idx + 1)
const url = 'https://jsonplaceholder.typicode.com/todos'

// let results: any[] = []
export const processRequestAsStream = async (segmento: any) => {
  const started = new Date()
  let results: any[] = []
  const stream = Readable.from(selectDataAsStream(data))
  await pipeline(
    stream,
    bufferingObjectStream(20),
    promiseAxiosRequest,
    resolveAxiosRequest,
    async function*(source) {
      for await (const item of source) {
        console.log(item, segmento);
      }
    },
  )
  // console.log('>>> Results: ', results)
  console.log('Stream ended!')
  console.log(`Process took: ${new Date().getTime() - started.getTime()}ms`)
  return results
}

async function* selectDataAsStream(data: any) {
  for (const item of data) yield item
}

const promiseAxiosRequest = new Transform({
  objectMode: true,
  transform(chunks, _encoding, cb) {
    const promises = chunks.map((chunk: any) => axios.get(`${url}/${chunk}`)
      .catch((err) => ({
        status: err.response?.status,
        data: `[${chunk}]: Produto-${chunk}`
      })))
    cb(null, promises)
  }
})

const resolveAxiosRequest = new Transform({
  objectMode: true,
  async transform(chunks, _encoding, cb) {
    const response = await Promise.all(chunks)
    cb(null, response)
  }
})
