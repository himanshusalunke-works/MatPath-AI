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
    if (playing) stop()
    else speak(message.content, language + '-IN')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading state — typing indicator
  if (message.loading) {
    return (
      <div className="chat-bubble chat-bubble--ai animate-fade-in">
        <div className="chat-bubble__avatar chat-bubble__avatar--ai">
          <span className="chat-bubble__avatar-emoji">✨</span>
        </div>
        <div className="chat-bubble__content">
          <div className="chat-bubble__card chat-bubble__card--ai chat-bubble__card--loading">
            <div className="chat-typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User message
  if (isUser) {
    return (
      <div className="chat-bubble chat-bubble--user animate-fade-in">
        <div className="chat-bubble__content chat-bubble__content--user">
          <div className="chat-bubble__card chat-bubble__card--user">
            <p className="chat-bubble__text">{message.content}</p>
          </div>
          <span className="chat-bubble__time chat-bubble__time--user">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="chat-bubble__avatar chat-bubble__avatar--user">
          <span className="chat-bubble__avatar-emoji">👤</span>
        </div>
      </div>
    )
  }

  // AI message
  return (
    <div className="chat-bubble chat-bubble--ai animate-fade-in">
      <div className="chat-bubble__avatar chat-bubble__avatar--ai">
        <span className="chat-bubble__avatar-emoji">✨</span>
      </div>
      <div className="chat-bubble__content">
        <div className="chat-bubble__card chat-bubble__card--ai group">
          <div className="chat-bubble__markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Action toolbar */}
        {message.content && (
          <div className="chat-bubble__actions">
            <span className="chat-bubble__time">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="chat-bubble__action-btns">
              <button
                onClick={handleCopy}
                className="chat-action-btn"
                title={copied ? 'Copied!' : 'Copy'}
                aria-label="Copy message"
              >
                {copied
                  ? <CheckIcon className="chat-action-btn__icon chat-action-btn__icon--success" />
                  : <DocumentDuplicateIcon className="chat-action-btn__icon" />
                }
              </button>
              <button
                onClick={handleListen}
                className={`chat-action-btn ${playing ? 'chat-action-btn--active' : ''}`}
                title={playing ? 'Stop' : 'Listen'}
                aria-label={playing ? 'Stop listening' : 'Listen to response'}
              >
                {playing
                  ? <SpeakerXMarkIcon className="chat-action-btn__icon" />
                  : <SpeakerWaveIcon className="chat-action-btn__icon" />
                }
              </button>
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`chat-action-btn ${feedback === 'up' ? 'chat-action-btn--active' : ''}`}
                title="Helpful"
                aria-label="Mark as helpful"
              >
                <HandThumbUpIcon className="chat-action-btn__icon" />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`chat-action-btn ${feedback === 'down' ? 'chat-action-btn--active' : ''}`}
                title="Not helpful"
                aria-label="Mark as not helpful"
              >
                <HandThumbDownIcon className="chat-action-btn__icon" />
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
    <div className="chat-input">
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
        className="chat-input__textarea"
      />
      <button
        id="chat-send-btn"
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        className="chat-input__send"
      >
        <svg className="chat-input__send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
