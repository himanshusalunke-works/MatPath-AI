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
  const sessionId = getOrCreateSessionId()
  return useQuery({
    queryKey: ['chat-history', sessionId],
    queryFn: async () => {
      const res = await api.get('/chat/history', { params: { sessionId, limit: 50 } })
      return res.data.messages || []
    },
    staleTime: 0,
  })
}

export function useChat() {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)

  const sendMessage = useCallback(async (text, language = 'en', userData = {}) => {
    const sessionId = getOrCreateSessionId()
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])

    // Placeholder AI message for streaming
    const aiMsgId = Date.now() + 1
    setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date().toISOString(), loading: true }])
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
              setMessages((prev) =>
                prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated, loading: false } : m))
              )
            } catch { /* ignore parse errors */ }
          }
        }
      } else {
        // Non-streaming JSON
        const data = await response.json()
        const responseText = data.response || 'I could not process your request.'
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: responseText, loading: false } : m))
        )
      }
    } catch {
      setMessages((prev) =>
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

  return { messages, setMessages, sendMessage, streaming }
}
