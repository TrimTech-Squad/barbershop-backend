import { Worker, isMainThread, parentPort } from 'worker_threads'

export const runWorker = (task: { callback: () => Promise<unknown> }) => {
  if (isMainThread) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, { workerData: task })
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', code => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`))
      })
    })
  } else {
    const func = async () => {
      parentPort!.postMessage(await task.callback())
    }
    return func()
  }
}
