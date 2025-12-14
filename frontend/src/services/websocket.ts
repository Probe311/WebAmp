// Client WebSocket pour communication avec le Native Helper

const DEFAULT_WS_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8765'

interface WebSocketMessage {
  type: string
  [key: string]: any
}

interface PendingAck {
  resolve: (value: any) => void
  reject: (error: Error) => void
  timeout: NodeJS.Timeout
}

export class WebSocketClient {
  private static instance: WebSocketClient | null = null
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pendingAcks: Map<string, PendingAck> = new Map()
  private messageIdCounter = 0
  private isConnecting = false

  private constructor(url: string = DEFAULT_WS_URL) {
    this.url = url
  }

  public static getInstance(url?: string): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(url)
    }
    return WebSocketClient.instance
  }

  public connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve()
          } else if (!this.isConnecting) {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
      })
    }

    this.isConnecting = true

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.isConnecting = false
          this.reconnectAttempts = 0
          console.log('[WebSocket] Connecté au Native Helper')
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('[WebSocket] Erreur parsing message:', error)
          }
        }

        this.ws.onerror = (error) => {
          this.isConnecting = false
          console.error('[WebSocket] Erreur:', error)
          if (this.reconnectAttempts === 0) {
            reject(new Error('Impossible de se connecter au Native Helper'))
          }
        }

        this.ws.onclose = () => {
          this.isConnecting = false
          console.log('[WebSocket] Connexion fermée')
          this.attemptReconnect()
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[WebSocket] Nombre maximum de tentatives de reconnexion atteint')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`[WebSocket] Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`)

    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect().catch(() => {
          // Erreur déjà gérée dans connect()
        })
      }
    }, delay)
  }

  private handleMessage(message: WebSocketMessage): void {
    // Gérer les ACK
    if (message.type === 'ack' && message.messageId) {
      const pending = this.pendingAcks.get(message.messageId)
      if (pending) {
        clearTimeout(pending.timeout)
        this.pendingAcks.delete(message.messageId)
        pending.resolve(message)
      }
      return
    }

    // Gérer les erreurs
    if (message.type === 'error' && message.messageId) {
      const pending = this.pendingAcks.get(message.messageId)
      if (pending) {
        clearTimeout(pending.timeout)
        this.pendingAcks.delete(message.messageId)
        pending.reject(new Error(message.message || 'Erreur WebSocket'))
      }
      return
    }

    // Gérer la synchronisation d'état
    if (message.type === 'stateSync' && this.onStateSync) {
      this.onStateSync(message)
      return
    }
  }

  public send(message: WebSocketMessage, requireAck: boolean = false): Promise<any> {
    if (!this.isConnected()) {
      // Tentative de connexion automatique
      return this.connect().then(() => this.send(message, requireAck))
    }

    if (requireAck) {
      const messageId = `msg_${this.messageIdCounter++}`
      message.messageId = messageId

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.pendingAcks.delete(messageId)
          reject(new Error('Timeout WebSocket'))
        }, 5000)

        this.pendingAcks.set(messageId, {
          resolve,
          reject,
          timeout
        })

        try {
          this.ws!.send(JSON.stringify(message))
        } catch (error) {
          clearTimeout(timeout)
          this.pendingAcks.delete(messageId)
          reject(error)
        }
      })
    } else {
      try {
        this.ws!.send(JSON.stringify(message))
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.pendingAcks.clear()
    this.reconnectAttempts = 0
  }

  public setOnMessage(handler: (message: WebSocketMessage) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handler(message)
        } catch (error) {
          console.error('[WebSocket] Erreur parsing message:', error)
        }
      }
    }
  }

  // Callback pour la synchronisation d'état
  public onStateSync: ((message: WebSocketMessage) => void) | null = null
}

