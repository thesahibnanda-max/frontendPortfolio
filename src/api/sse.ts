/** One parsed SSE frame: an `event:` line's name and its `data:` line's payload. */
export interface SseFrame {
  event: string
  data: string
}

/**
 * Reads a `Response` body as a Spring `SseEmitter`-formatted SSE stream and
 * yields `{event, data}` pairs. Only handles single-line `event:`/`data:`
 * fields separated by a blank line (`\n\n`) — not the full multi-line-`data:`
 * SSE spec — since that's the only shape `SseEmitter.event().name(x).data(y)`
 * produces. Buffers across chunk boundaries since a `\n\n`-terminated block
 * can arrive split across multiple `ReadableStream` reads.
 */
export async function* parseSseStream(response: Response): AsyncGenerator<SseFrame> {
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary: number
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, boundary)
      buffer = buffer.slice(boundary + 2)
      const lines = rawEvent.split('\n')
      const eventLine = lines.find((l) => l.startsWith('event:'))
      const dataLine = lines.find((l) => l.startsWith('data:'))
      if (dataLine) {
        yield { event: eventLine?.slice('event:'.length) ?? 'message', data: dataLine.slice('data:'.length) }
      }
    }
  }
}
