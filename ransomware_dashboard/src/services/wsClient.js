// Lightweight WebSocket client that reconnects automatically
export default class WSClient {
  constructor(url, onMessage){
    this.url = url
    this.onMessage = onMessage
    this.ws = null
    this.backoff = 1000
    this.connect()
  }

  connect(){
    try {
      this.ws = new WebSocket(this.url)
      this.ws.onopen = () => {
        console.log('[WS] Connected')
        this.backoff = 1000
      }
      this.ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data)
          this.onMessage(data)
        } catch(e){
          console.error('Invalid ws payload', e)
        }
      }
      this.ws.onclose = () => {
        console.log('[WS] Closed. reconnecting...')
        setTimeout(() => this.connect(), this.backoff)
        this.backoff = Math.min(30000, this.backoff * 1.5)
      }
      this.ws.onerror = (e) => {
        console.error('[WS] Error', e)
        this.ws.close()
      }
    } catch(e){
      console.error('[WS] Connect failed', e)
      setTimeout(() => this.connect(), this.backoff)
      this.backoff = Math.min(30000, this.backoff * 1.5)
    }
  }

  close(){
    if(this.ws) this.ws.close()
  }
}
