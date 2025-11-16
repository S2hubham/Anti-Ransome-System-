// src/services/wsClient.js
export default class WSClient {
  constructor(url, onMessage) {
    this.url = url
    this.onMessage = onMessage

    this.ws = null
    this.shouldReconnect = true

    this.reconnectDelay = 1000
    this.maxReconnectDelay = 30000
    this.heartbeatInterval = 20000

    this.pingTimer = null

    this.connect()
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("[WS] Connected")
        this.startHeartbeat()
        this.reconnectDelay = 1000
      }

      this.ws.onmessage = evt => {
        try {
          const data = JSON.parse(evt.data)
          this.onMessage?.(data)
        } catch (e) {
          console.error("[WS] Bad JSON:", e)
        }
      }

      this.ws.onclose = () => {
        console.warn("[WS] Closed")
        this.stopHeartbeat()
        if (this.shouldReconnect) this.scheduleReconnect()
      }

      this.ws.onerror = err => {
        console.error("[WS] Error", err)
        this.ws.close()
      }
    } catch (e) {
      console.error("[WS] Connection failed", e)
      this.scheduleReconnect()
    }
  }

  scheduleReconnect() {
    console.log("[WS] Reconnecting in", this.reconnectDelay, "ms")
    setTimeout(() => this.connect(), this.reconnectDelay)
    this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnectDelay)
  }

  startHeartbeat() {
    this.stopHeartbeat()
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ ping: Date.now() }))
      }
    }, this.heartbeatInterval)
  }

  stopHeartbeat() {
    if (this.pingTimer) clearInterval(this.pingTimer)
    this.pingTimer = null
  }

  close() {
    this.shouldReconnect = false
    this.stopHeartbeat()
    this.ws?.close()
  }
}
