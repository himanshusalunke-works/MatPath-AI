import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../hooks/useChat'
import { ChatBubble, ChatInput } from '../components/chat/ChatBubble'
import VoiceButton from '../components/chat/VoiceButton'
import {
  SparklesIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'

const QUICK_PROMPTS = [
  { icon: '📋', text: 'How do I register to vote?', color: 'var(--primary)' },
  { icon: '📄', text: 'Documents needed on election day', color: 'var(--tertiary)' },
  { icon: '🗺️', text: 'Find my nearest polling booth', color: 'var(--secondary)' },
  { icon: '🖥️', text: 'How does the EVM work?', color: '#7C3AED' },
]

export default function ChatPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { messages, setMessages, sendMessage, streaming } = useChat()
  const messagesEndRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const scrollContainerRef = useRef(null)

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const firstName = user?.displayName?.split(' ')[0] || 'Voter'
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Namaste ${firstName}! I am MatPath AI, your dedicated Indian Election Assistant. 🇮🇳\n\nI can help you with voter registration, finding your polling booth, understanding EVMs, or checking election dates. How can I assist you today?`,
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [messages.length, setMessages, user?.displayName])

  // Scroll to bottom on new messages
  const initialScrollRef = useRef(true)
  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      const el = scrollContainerRef.current
      if (initialScrollRef.current) {
        el.scrollTop = el.scrollHeight
        initialScrollRef.current = false
      } else {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }, [messages])

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 200)
  }

  const handleVoiceResult = (text) => {
    if (text?.trim()) sendMessage(text, i18n.language, user)
  }

  const handleSend = (text) => {
    sendMessage(text, i18n.language, user)
  }

  const hasConversation = messages.length > 1

  return (
    <div className="chat-page">
      {/* ── Ambient background orbs ── */}
      <div className="chat-ambient" aria-hidden="true">
        <div className="chat-ambient__orb chat-ambient__orb--1" />
        <div className="chat-ambient__orb chat-ambient__orb--2" />
      </div>

      {/* ── Header ── */}
      <header className="chat-header">
        <div className="chat-header__inner">
          <div className="chat-header__left">
            <div className="chat-header__avatar">
              <div className="chat-header__avatar-inner">
                <SparklesIcon className="chat-header__avatar-icon" aria-hidden="true" />
              </div>
              <span className="chat-header__status-dot" aria-hidden="true" />
            </div>
            <div className="chat-header__info">
              <h1 className="chat-header__title">MatPath AI</h1>
              <p className="chat-header__status">
                {streaming ? (
                  <span className="chat-header__typing">
                    <span className="chat-typing-wave">
                      <span /><span /><span />
                    </span>
                    Thinking...
                  </span>
                ) : (
                  <>
                    <span className="chat-header__online-dot" />
                    Election Assistant • Online
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            className="chat-header__menu"
            aria-label="Chat options"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
        id="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="chat-messages__inner">
          {/* Show quick prompts only when conversation hasn't started */}
          {!hasConversation && (
            <div className="chat-prompts animate-fade-in">
              <p className="chat-prompts__label">Quick questions to get started</p>
              <div className="chat-prompts__grid">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => handleSend(p.text)}
                    className="chat-prompt-card"
                  >
                    <span className="chat-prompt-card__icon" style={{ background: `${p.color}14`, color: p.color }}>
                      {p.icon}
                    </span>
                    <span className="chat-prompt-card__text">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} language={i18n.language} />
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      </main>

      {/* Scroll-to-bottom FAB */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="chat-scroll-btn animate-fade-in"
          aria-label="Scroll to latest message"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* ── Input Footer ── */}
      <footer className="chat-footer">
        <div className="chat-footer__inner">
          <div className="chat-input-bar">
            <VoiceButton
              onResult={handleVoiceResult}
              language={`${i18n.language}-IN`}
            />
            <div className="chat-input-bar__field">
              <ChatInput
                onSend={handleSend}
                disabled={streaming}
                language={i18n.language}
              />
            </div>
          </div>
          <p className="chat-footer__disclaimer">
            MatPath AI provides guidance based on official ECI data
          </p>
        </div>
      </footer>
    </div>
  )
}
