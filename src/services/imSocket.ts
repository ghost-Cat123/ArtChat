type IMIncomingMessage = {
  chat_type?: string
  from?: string
  content?: string
  action?: string
}

type MessageHandler = (payload: IMIncomingMessage) => void
type ConnectionHandler = (connected: boolean) => void

class IMSocketClient {
  private socket: WebSocket | null = null
  private readonly messageHandlers = new Set<MessageHandler>()
  private readonly connectionHandlers = new Set<ConnectionHandler>()
  private pingTimer: number | null = null

  connect(wsBaseUrl: string, token: string) {
    if (!token) {
      throw new Error('缺少 token，无法连接 IM 网关')
    }
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return
    }
    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      return
    }

    const cleanBase = wsBaseUrl.replace(/\/$/, '')
    const wsUrl = `${cleanBase}/ws?token=${encodeURIComponent(token)}`
    const socket = new WebSocket(wsUrl)
    this.socket = socket

    socket.onopen = () => {
      this.emitConnection(true)
      this.startHeartbeat()
    }

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as IMIncomingMessage
        this.messageHandlers.forEach(handler => handler(payload))
      } catch (err) {
        console.error('解析后端消息失败', err)
      }
    }

    socket.onclose = () => {
      this.stopHeartbeat()
      this.emitConnection(false)
    }

    socket.onerror = () => {
      this.emitConnection(false)
    }
  }

  disconnect() {
    this.stopHeartbeat()
    this.socket?.close()
    this.socket = null
  }

  sendSingleChat(receiver: number, message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接')
    }
    this.socket.send(JSON.stringify({
      chat_type: 'single_chat',
      receiver,
      message
    }))
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onConnectionChange(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler)
    return () => this.connectionHandlers.delete(handler)
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN
  }

  private emitConnection(connected: boolean) {
    this.connectionHandlers.forEach(handler => handler(connected))
  }

  private startHeartbeat() {
    this.stopHeartbeat()
    this.pingTimer = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ chat_type: 'ping' }))
      }
    }, 15000)
  }

  private stopHeartbeat() {
    if (this.pingTimer !== null) {
      window.clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }
}

export const imSocket = new IMSocketClient()
export type { IMIncomingMessage }
