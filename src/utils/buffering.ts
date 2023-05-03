import { Transform } from 'stream'

export const bufferingObjectStream = (size: number) => {
  // console.log(size);
  let buffer: any[] = [];
    return new Transform({
      objectMode: true,
      transform(chunk, _encoding, callback) {
        buffer.push(chunk);
        if (buffer.length >= size) {
            this.push(buffer);
            // console.log('>>> Transform Chunks: ', buffer);
            buffer = [];
          }
          callback()
      },
      flush(callback) {
        if (buffer.length > 0) {
          this.push(buffer);
          // console.log('>>> Flush Chunks: ', buffer);
        }
        callback()
      }
    })
}
