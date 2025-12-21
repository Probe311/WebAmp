// Client WebSocket pour communication avec le Native Helper

import { createLogger } from './logger'
import { 
  WEBSOCKET_DEFAULT_URL, 
  WEBSOCKET_MAX_RECONNECT_ATTEMPTS, 
  WEBSOCKET_RECONNECT_DELAY,
  WEBSOCKET_ACK_TIMEOUT 
} from '../config/constants'

const logger = createLogger('WebSocket')

// Types stricts pour les messages WebSocket
export type WebSocketMessageType = 
  | 'start' 
  | 'stop' 
  | 'addEffect' 
  | 'removeEffect' 
  | 'setParameter' 
  | 'getStats'
  | 'ack'
  | 'error'
  | 'stateSync'
  | 'status'
  | 'clearEffects'
  | 'toggleBypass'
  | 'moveEffect'
  | 'setAmplifierPower'
  | 'setEqualizerParameter'
  | 'saveEqualizerConfig'

export interface BaseWebSocketMessage {
  type: WebSocketMessageType
  messageId?: string
}

export interface WebSocketMessage extends BaseWebSocketMessage {
  [key: string]: unknown
}

export interface WebSocketAckMessage extends BaseWebSocketMessage {
  type: 'ack'
  messageId: string
}

export interface WebSocketErrorMessage extends BaseWebSocketMessage {
  type: 'error'
  messageId: string
  message?: string
}

export interface WebSocketStateSyncMessage extends BaseWebSocketMessage {
  type: 'stateSync'
  [key: string]: unknown
}

interface PendingAck {
  resolve: (value: WebSocketMessage) => void
  reject: (error: Error) => void
  timeout: ReturnType<typeof setTimeout>
}

export class WebSocketClient {
  private static instance: WebSocketClient | null = null
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = WEBSOCKET_MAX_RECONNECT_ATTEMPTS
  private reconnectDelay = WEBSOCKET_RECONNECT_DELAY
  private pendingAcks: Map<string, PendingAck> = new Map()
  private messageIdCounter = 0
  private isConnecting = false

  private constructor(url: string = WEBSOCKET_DEFAULT_URL) {
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
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage
            this.handleMessage(message)
          } catch (error) {
            logger.error('Erreur de parsing du message WebSocket', error, { data: event.data })
          }
        }

        this.ws.onerror = (_error) => {
          this.isConnecting = false
          if (this.reconnectAttempts === 0) {
            reject(new Error('Impossible de se connecter au Native Helper'))
          }
        }

        this.ws.onclose = () => {
          this.isConnecting = false
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
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    // tentative de reconnexion silencieuse
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect().catch((error) => {
          logger.debug('Tentative de reconnexion WebSocket échouée', { error })
        })
      }
    }, delay)
  }

  private handleMessage(message: WebSocketMessage): void {
    // Gérer les ACK
    if (message.type === 'ack' && message.messageId) {
      const ackMessage = message as WebSocketAckMessage
      const pending = this.pendingAcks.get(ackMessage.messageId)
      if (pending) {
        clearTimeout(pending.timeout)
        this.pendingAcks.delete(ackMessage.messageId)
        pending.resolve(message)
      }
      return
    }

    // Gérer les erreurs
    if (message.type === 'error' && message.messageId) {
      const errorMessage = message as WebSocketErrorMessage
      const pending = this.pendingAcks.get(errorMessage.messageId)
      if (pending) {
        clearTimeout(pending.timeout)
        this.pendingAcks.delete(errorMessage.messageId)
        pending.reject(new Error(errorMessage.message || 'Erreur WebSocket'))
      }
      return
    }

    // Gérer la synchronisation d'état
    if (message.type === 'stateSync' && this.onStateSync) {
      this.onStateSync(message as WebSocketStateSyncMessage)
      return
    }

    // Message non géré
    logger.debug('Message WebSocket non géré', { messageType: message.type })
  }

  public send(message: WebSocketMessage, requireAck: boolean = false): Promise<WebSocketMessage> {
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
        }, WEBSOCKET_ACK_TIMEOUT)

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
        return Promise.resolve(message)
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
          const message = JSON.parse(event.data) as WebSocketMessage
          handler(message)
        } catch (error) {
          logger.error('Erreur de parsing du message WebSocket (handler personnalisé)', error, { data: event.data })
        }
      }
    }
  }

  // Callback pour la synchronisation d'état
  public onStateSync: ((message: WebSocketStateSyncMessage) => void) | null = null
}

