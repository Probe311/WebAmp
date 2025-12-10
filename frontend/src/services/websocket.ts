import { WEBSOCKET_URL, ACK_TIMEOUT } from '../config'

export interface WebSocketMessage {
  type: string
  messageId?: string
  [key: string]: any
}

export interface PendingMessage {
  message: WebSocketMessage
  resolve: (value: any) => void
  reject: (error: Error) => void
  timeout: ReturnType<typeof setTimeout>
  retryCount: number
  timestamp: number
}

export class WebSocketClient {
  private static instance: WebSocketClient
  private ws: WebSocket | null = null
  private messageQueue: WebSocketMessage[] = []
  private pendingMessages: Map<string, PendingMessage> = new Map()
  private messageIdCounter = 0
  private maxRetries = 3
  private retryDelay = 1000 // 1 seconde
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected'
  
  public onConnect: (() => void) | null = null
  public onDisconnect: (() => void) | null = null
  public onMessage: ((data: WebSocketMessage) => void) | null = null
  public onError: ((error: Error | Event) => void) | null = null
  public onStateSync: ((state: any) => void) | null = null

  private constructor() {}

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient()
    }
    return WebSocketClient.instance
  }

  public connect(url?: string): void {
    const connectUrl = url || WEBSOCKET_URL
    
    // Ne pas se connecter si l'URL est vide
    if (!connectUrl || connectUrl.trim() === '') {
      // En développement, ne pas logger pour éviter le bruit dans la console
      // Le WebSocket est optionnel et peut ne pas être disponible
      return
    }
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }
    
    this.connectionStatus = 'connecting'

    try {
      this.ws = new WebSocket(connectUrl)
      
      this.ws.onopen = () => {
        this.connectionStatus = 'connected'
        this.flushMessageQueue()
        
        // Retry automatique des messages échoués
        this.retryFailedMessages()
        
        // Demander la synchronisation de l'état initial
        this.requestStateSync()
        
        if (this.onConnect) {
          this.onConnect()
        }
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage
          
          // Gérer les acknowledgments
          if (data.type === 'ack' && data.messageId) {
            const pending = this.pendingMessages.get(data.messageId)
            if (pending) {
              clearTimeout(pending.timeout)
              this.pendingMessages.delete(data.messageId)
              pending.resolve(data)
              return
            }
          }
          
          // Gérer les erreurs
          if (data.type === 'error') {
            const error = new Error(data.message || 'Erreur serveur')
            if (data.messageId) {
              const pending = this.pendingMessages.get(data.messageId)
              if (pending) {
                clearTimeout(pending.timeout)
                this.pendingMessages.delete(data.messageId)
                pending.reject(error)
                return
              }
            }
            if (this.onError) {
              this.onError(error)
            }
            return
          }
          
          // Gérer la synchronisation d'état
          if (data.type === 'state') {
            if (this.onStateSync) {
              this.onStateSync(data)
            }
            return
          }
          
          // Messages normaux
          if (this.onMessage) {
            this.onMessage(data)
          }
        } catch (error) {
          console.error('Erreur parsing message WebSocket:', error)
          if (this.onError) {
            this.onError(error instanceof Error ? error : new Error('Erreur parsing message'))
          }
        }
      }
      
      this.ws.onclose = () => {
        this.connectionStatus = 'disconnected'
        if (this.onDisconnect) {
          this.onDisconnect()
        }
        // Ne pas tenter de reconnexion automatique
      }
      
      this.ws.onerror = () => {
        // Ne pas logger d'erreur en production - silencieux
        // En développement, logger uniquement si c'est une vraie erreur (pas juste une connexion refusée)
        if (import.meta.env.DEV && this.ws?.readyState === WebSocket.CLOSED) {
          // Connexion refusée est normale si le serveur n'est pas démarré
          // Ne pas logger pour éviter le bruit dans la console
        }
        // Ne pas appeler onError pour éviter les notifications
      }
    } catch (error) {
      // Ne pas logger d'erreur - silencieux
      // Ne pas tenter de reconnexion automatique
    }
  }
  
  private requestStateSync(): void {
    this.send({
      type: 'getState'
    }, false) // Pas besoin d'acknowledgment pour getState
  }

  public disconnect(): void {
    this.clearPendingMessages()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  public send(message: WebSocketMessage, requireAck: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      // Ajouter un ID de message si acknowledgment requis
      if (requireAck) {
        const messageId = `msg-${++this.messageIdCounter}-${Date.now()}`
        message.messageId = messageId
        
        // Créer un timeout pour l'acknowledgment avec retry
        const timeout = setTimeout(() => {
          const pending = this.pendingMessages.get(messageId)
          if (pending) {
            if (pending.retryCount < this.maxRetries && this.isConnected()) {
              // Retry le message
              pending.retryCount++
              pending.timestamp = Date.now()
              console.log(`Retry message ${messageId} (tentative ${pending.retryCount}/${this.maxRetries})`)
              
              if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(message))
                // Réinitialiser le timeout
                clearTimeout(pending.timeout)
                pending.timeout = setTimeout(() => {
                  this.handleMessageTimeout(messageId)
                }, ACK_TIMEOUT)
              } else {
                this.handleMessageTimeout(messageId)
              }
            } else {
              this.handleMessageTimeout(messageId)
            }
          }
        }, ACK_TIMEOUT)
        
        // Stocker le message en attente
        this.pendingMessages.set(messageId, {
          message,
          resolve,
          reject,
          timeout,
          retryCount: 0,
          timestamp: Date.now()
        })
      }
      
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message))
        if (!requireAck) {
          resolve(undefined)
        }
      } else {
        // Mettre en queue si pas connecté
        this.messageQueue.push(message)
        if (!requireAck) {
          resolve(undefined)
        } else {
          // Rejeter si pas connecté et acknowledgment requis
          reject(new Error('WebSocket non connecté'))
        }
      }
    })
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message))
      }
    }
  }

  public clearPendingMessages(): void {
    // Annuler tous les messages en attente
    for (const [, pending] of this.pendingMessages.entries()) {
      clearTimeout(pending.timeout)
      pending.reject(new Error('Connexion fermée'))
    }
    this.pendingMessages.clear()
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
  
  public getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.connectionStatus
  }
  
  private handleMessageTimeout(messageId: string): void {
    const pending = this.pendingMessages.get(messageId)
    if (pending) {
      this.pendingMessages.delete(messageId)
      clearTimeout(pending.timeout)
      pending.reject(new Error(`Timeout: pas de réponse pour le message ${messageId} après ${pending.retryCount + 1} tentatives`))
    }
  }
  
  private retryFailedMessages(): void {
    const now = Date.now()
    const messagesToRetry: string[] = []
    
    for (const [messageId, pending] of this.pendingMessages.entries()) {
      // Retry les messages qui ont échoué et qui n'ont pas atteint le max de retries
      if (pending.retryCount < this.maxRetries && (now - pending.timestamp) > this.retryDelay) {
        messagesToRetry.push(messageId)
      }
    }
    
    for (const messageId of messagesToRetry) {
      const pending = this.pendingMessages.get(messageId)
      if (pending && this.ws && this.ws.readyState === WebSocket.OPEN) {
        pending.retryCount++
        pending.timestamp = now
        console.log(`Retry automatique message ${messageId} (tentative ${pending.retryCount}/${this.maxRetries})`)
        this.ws.send(JSON.stringify(pending.message))
      }
    }
  }
}

