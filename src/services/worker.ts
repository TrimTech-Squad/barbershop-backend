import { Worker, isMainThread, parentPort } from 'worker_threads'

// menjalankan worker thread
export const runWorker = (task: { callback: () => Promise<unknown> }) => {

  // Cek apakah kode sedang berjalan di thread utama atau bukan
  if (isMainThread) {

     // Jika di thread utama, kembalikan promise
    return new Promise((resolve, reject) => {

      // Buat instance worker dengan menggunakan file ini sendiri (__filename)
      const worker = new Worker(__filename, { workerData: task })

      // Event listener untuk menerima pesan dari worker thread
      worker.on('message', resolve)

      // Event listener untuk menangani error pada worker thread
      worker.on('error', reject)

      // Event listener untuk menangani ketika worker thread berhenti
      worker.on('exit', code => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`))
      })
    })
  } else {

     // Jika bukan di thread utama, eksekusi tugas dan kirim hasilnya ke thread utama
    const func = async () => {

      // Kirim hasil tugas ke thread utama melalui parentPort
      parentPort!.postMessage(await task.callback())
    }
    return func()
  }
}
