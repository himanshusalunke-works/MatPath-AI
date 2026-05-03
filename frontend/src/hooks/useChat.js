import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { generateSessionId } from '../utils/formatters'

const SESSION_KEY = 'matpath_session_id'

function getOrCreateSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = generateSessionId()
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function useChatHistory() {
  return useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const res = await api.get('/chat/history')
      return res.data || []
    },
    staleTime: 5 * 60 * 1000, // 5 mins
  })
}

const MESSAGES_KEY = 'matpath_chat_messages'

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(MESSAGES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [streaming, setStreaming] = useState(false)

  // Auto-save to sessionStorage
  const updateMessages = useCallback((newMessages) => {
    setMessages((prev) => {
      const msgs = typeof newMessages === 'function' ? newMessages(prev) : newMessages;
      sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
      return msgs;
    });
  }, []);

  const sendMessage = useCallback(async (text, language = 'en', userData = {}) => {
    const sessionId = getOrCreateSessionId()
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() }
    updateMessages((prev) => [...prev, userMsg])

    // Placeholder AI message for streaming
    const aiMsgId = Date.now() + 1
    updateMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date().toISOString(), loading: true }])
    setStreaming(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/v1'}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('matpath_token') || ''}`,
          },
          body: JSON.stringify({ message: text, language, sessionId, userData }),
        }
      )

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('text/event-stream')) {
        // SSE streaming
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter((l) => l.startsWith('data:'))
          for (const line of lines) {
            const data = line.replace('data:', '').trim()
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              accumulated += parsed.text || ''
              updateMessages((prev) =>
                prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated, loading: false } : m))
              )
            } catch { /* ignore parse errors */ }
          }
        }
      } else {
        // Non-streaming JSON
        const data = await response.json()
        const responseText = data.response || 'I could not process your request.'
        updateMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: responseText, loading: false } : m))
        )
      }
    } catch {
      updateMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: 'Sorry, I could not connect to the server. Please try again.', loading: false, error: true }
            : m
        )
      )
    } finally {
      setStreaming(false)
    }
  }, [])

  const clearChat = useCallback(async () => {
    try {
      await api.delete('/chat/history')
    } catch (err) {
      console.error('Failed to clear chat history on server:', err)
    } finally {
      updateMessages([])
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [updateMessages])

  return { messages, setMessages: updateMessages, sendMessage, clearChat, streaming }
}
