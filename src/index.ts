// import { processRequestAsStream } from './services/process-streams'
import runBatchPromises from './services/run-batch-promises'

export const handler = async () => {

  // await processRequestAsStream('teste')

  // const response = await runBatchPromises('segmento-1', 20)

  const promises = await Promise.all([
    runBatchPromises('segmento-1'),
    // runBatchPromises('segmento-2', 50),
    // runBatchPromises('segmento-3', 50),
    // runBatchPromises('segmento-4', 50),
    // runBatchPromises('segmento-5', 50)
  ])


  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello lambda!',
      promises
      // response1,
      // response2,
      // response3,
      // response4,
      // response5,
    })
  }
}
