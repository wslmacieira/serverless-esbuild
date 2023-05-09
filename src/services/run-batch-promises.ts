import axios, { AxiosResponse } from "axios"
import getData from "./get-data"

const url = 'https://jsonplaceholder.typicode.com/todos'
axios.interceptors.response.use(({ status, data }) =>
  ({ status, data }) as AxiosResponse)

export default async function runBatchPromises(fileName: string, size?: number) {
  const started = new Date()
  const data = getData()
  const batchSize = size ?? 300
  let result: any[] = []
  for (let i = 0; i < data.length; i += batchSize) {
    const promises = data.slice(i, i + batchSize).map((item) => {
      return axios.get(`${url}/${item}`)
        .catch((err) => ({
          status: err.response?.status,
          data: `[${item}]: Produto-${item}`
        }))
    })
    const response = await Promise.all(promises)
    result.push(response)
  }
  console.log(`Process took: ${new Date().getTime() - started.getTime()}ms`)
  return {
    fileName,
    result
  }
}