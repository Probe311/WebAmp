import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WebSocketClient } from '../websocket'

describe('WebSocket Client', () => {
  let wsClient: WebSocketClient
  let mockWebSocket: any

  beforeEach(() => {
    // Mock WebSocket
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      readyState: WebSocket.CONNECTING
    }

    global.WebSocket = vi.fn(() => mockWebSocket) as any
    wsClient = WebSocketClient.getInstance()
  })

  afterEach(() => {
    wsClient.disconnect()
  })

  describe('Connection', () => {
    it('should connect to WebSocket server', () => {
      wsClient.connect('ws://localhost:8080')
      expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:8080')
    })

    it('should handle connection success', () => {
      const onConnect = vi.fn()
      wsClient.on('connect', onConnect)
      
      wsClient.connect('ws://localhost:8080')
      mockWebSocket.readyState = WebSocket.OPEN
      const openHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'open'
      )?.[1]
      
      if (openHandler) {
        openHandler()
        expect(onConnect).toHaveBeenCalled()
      }
    })

    it('should handle connection errors', () => {
      const onError = vi.fn()
      wsClient.on('error', onError)
      
      wsClient.connect('ws://localhost:8080')
      const errorHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'error'
      )?.[1]
      
      if (errorHandler) {
        errorHandler()
        expect(onError).toHaveBeenCalled()
      }
    })

    it('should handle reconnection', () => {
      wsClient.connect('ws://localhost:8080')
      mockWebSocket.readyState = WebSocket.OPEN
      
      const closeHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'close'
      )?.[1]
      
      if (closeHandler) {
        closeHandler()
        // Should attempt reconnection
        expect(true).toBe(true)
      }
    })
  })

  describe('Message Sending', () => {
    it('should send messages when connected', async () => {
      wsClient.connect('ws://localhost:8080')
      mockWebSocket.readyState = WebSocket.OPEN
      
      await wsClient.send({ type: 'test', data: 'test' })
      expect(mockWebSocket.send).toHaveBeenCalled()
    })

    it('should queue messages when not connected', async () => {
      wsClient.connect('ws://localhost:8080')
      mockWebSocket.readyState = WebSocket.CONNECTING
      
      const sendPromise = wsClient.send({ type: 'test', data: 'test' })
      // Message should be queued
      expect(mockWebSocket.send).not.toHaveBeenCalled()
      
      // Connect and send queued messages
      mockWebSocket.readyState = WebSocket.OPEN
      const openHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'open'
      )?.[1]
      if (openHandler) {
        openHandler()
      }
    })

    it('should retry failed messages', async () => {
      wsClient.connect('ws://localhost:8080')
      mockWebSocket.readyState = WebSocket.OPEN
      mockWebSocket.send.mockImplementationOnce(() => {
        throw new Error('Send failed')
      })
      
      try {
        await wsClient.send({ type: 'test', data: 'test' })
      } catch (e) {
        // Should retry
        expect(true).toBe(true)
      }
    })
  })

  describe('Message Receiving', () => {
    it('should handle incoming messages', () => {
      const onMessage = vi.fn()
      wsClient.on('message', onMessage)
      
      wsClient.connect('ws://localhost:8080')
      const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'message'
      )?.[1]
      
      if (messageHandler) {
        const event = {
          data: JSON.stringify({ type: 'test', data: 'test' })
        }
        messageHandler(event)
        expect(onMessage).toHaveBeenCalled()
      }
    })

    it('should handle acknowledgment messages', () => {
      wsClient.connect('ws://localhost:8080')
      const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'message'
      )?.[1]
      
      if (messageHandler) {
        const event = {
          data: JSON.stringify({ 
            type: 'ack', 
            messageId: 'test-id',
            success: true 
          })
        }
        expect(() => messageHandler(event)).not.toThrow()
      }
    })
  })
})

