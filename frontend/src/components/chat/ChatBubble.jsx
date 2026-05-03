import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/outline'
import { useVoiceOutput } from '../../hooks/useVoiceOutput'

export function ChatBubble({ message, language }) {
  const { playing, speak, stop } = useVoiceOutput()
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'up' | 'down' | null
  const isUser = message.role === 'user'

  const handleListen = () => {
    if (playing) {
      stop()
    } else {
      // Strip markdown symbols and extra spaces for cleaner speech
      const cleanText = message.content
        .replace(/[*_~`#]/g, '') // Basic markdown symbols
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links: keep label
        .replace(/\n+/g, ' ') // Newlines to spaces
        .trim()
      
      speak(cleanText)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading state — typing indicator
  if (message.loading) {
    return (
      <div className="ct-bubble ct-bubble--ai animate-fade-in">
        <div className="ct-bubble__avatar ct-bubble__avatar--ai">
          <span className="ct-bubble__avatar-emoji">✨</span>
        </div>
        <div className="ct-bubble__content">
          <div className="ct-bubble__card ct-bubble__card--ai ct-bubble__card--loading">
            <div className="ct-typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // User message
  if (isUser) {
    return (
      <div className="ct-bubble ct-bubble--user animate-fade-in">
        <div className="ct-bubble__content ct-bubble__content--user">
          <div className="ct-bubble__card ct-bubble__card--user">
            <p className="ct-bubble__text">{message.content}</p>
          </div>
          <span className="ct-bubble__time ct-bubble__time--user">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="ct-bubble__avatar ct-bubble__avatar--user">
          <span className="ct-bubble__avatar-emoji">👤</span>
        </div>
      </div>
    )
  }

  // AI message
  return (
    <div className="ct-bubble ct-bubble--ai animate-fade-in">
      <div className="ct-bubble__avatar ct-bubble__avatar--ai">
        <span className="ct-bubble__avatar-emoji">✨</span>
      </div>
      <div className="ct-bubble__content">
        <div className="ct-bubble__card ct-bubble__card--ai group">
          <div className="ct-bubble__markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Action toolbar */}
        {message.content && (
          <div className="ct-bubble__actions">
            <span className="ct-bubble__time">
              {formatTime(message.timestamp)}
            </span>
            <div className="ct-bubble__action-btns">
              <button
                onClick={handleCopy}
                className="ct-action-btn"
                title={copied ? 'Copied!' : 'Copy'}
                aria-label="Copy message"
              >
                {copied
                  ? <CheckIcon className="ct-action-btn__icon ct-action-btn__icon--success" />
                  : <DocumentDuplicateIcon className="ct-action-btn__icon" />
                }
              </button>
              <button
                onClick={handleListen}
                className={`ct-action-btn ${playing ? 'ct-action-btn--active' : ''}`}
                title={playing ? 'Stop' : 'Listen'}
                aria-label={playing ? 'Stop listening' : 'Listen to response'}
              >
                {playing
                  ? <SpeakerXMarkIcon className="ct-action-btn__icon" />
                  : <SpeakerWaveIcon className="ct-action-btn__icon" />
                }
              </button>
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`ct-action-btn ${feedback === 'up' ? 'ct-action-btn--active' : ''}`}
                title="Helpful"
                aria-label="Mark as helpful"
              >
                <HandThumbUpIcon className="ct-action-btn__icon" />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`ct-action-btn ${feedback === 'down' ? 'ct-action-btn--active' : ''}`}
                title="Not helpful"
                aria-label="Mark as not helpful"
              >
                <HandThumbDownIcon className="ct-action-btn__icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ChatInput({ onSend, disabled, language }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [text])

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }, [text, disabled, onSend])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="ct-input">
      <textarea
        ref={textareaRef}
        id="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about elections, voting, documents..."
        disabled={disabled}
        rows={1}
        aria-label="Type your message"
        className="ct-input__textarea"
      />
      <button
        id="chat-send-btn"
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        className="ct-input__send"
      >
        <svg className="ct-input__send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
