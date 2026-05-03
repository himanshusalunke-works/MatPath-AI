import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useChat, useChatHistory } from '../hooks/useChat'
import { ChatBubble, ChatInput } from '../components/chat/ChatBubble'
import VoiceButton from '../components/chat/VoiceButton'
import {
  SparklesIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const QUICK_PROMPTS = [
  { icon: '📋', key: 'prompt_register', color: 'var(--primary)' },
  { icon: '📄', key: 'prompt_docs', color: 'var(--tertiary)' },
  { icon: '🗺️', key: 'prompt_booth', color: 'var(--secondary)' },
  { icon: '🖥️', key: 'prompt_evm', color: '#7C3AED' },
]

export default function ChatPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { messages, setMessages, sendMessage, clearChat, streaming } = useChat()
  const { data: history, isLoading: historyLoading } = useChatHistory()
  const messagesEndRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const scrollContainerRef = useRef(null)

  // Initialize messages with history and ensure welcome message is first
  const initializedRef = useRef(false)
  useEffect(() => {
    if (initializedRef.current) return

    const firstName = user?.displayName?.split(' ')[0] || 'Voter'
    const welcomeMsg = {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste ${firstName}! I am MatPath AI, your dedicated Indian Election Assistant. 🇮🇳\n\nI can help you with voter registration, finding your polling booth, understanding EVMs, or checking election dates. How can I assist you today?`,
      timestamp: new Date().toISOString(),
    }

    if (history && history.length > 0) {
      if (history[0].id === 'welcome' || history[0].content.includes('MatPath AI')) {
        setMessages(history)
      } else {
        setMessages([welcomeMsg, ...history])
      }
      initializedRef.current = true
    } else if (!historyLoading) {
      setMessages((prev) => prev.length === 0 ? [welcomeMsg] : prev)
      initializedRef.current = true
    }
  }, [history, historyLoading, setMessages, user?.displayName])

  // Scroll to bottom on new messages
  const initialScrollRef = useRef(true)
  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      const el = scrollContainerRef.current
      // If we're already near bottom, auto-scroll. Otherwise let user read.
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150
      
      if (initialScrollRef.current || isNearBottom) {
        requestAnimationFrame(() => {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: initialScrollRef.current ? 'auto' : 'smooth'
          })
          initialScrollRef.current = false
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
    <div className="ct-page">
      {/* ── Ambient background orbs ── */}
      <div className="ct-ambient" aria-hidden="true">
        <div className="ct-ambient__orb ct-ambient__orb--1" />
        <div className="ct-ambient__orb ct-ambient__orb--2" />
      </div>

      {/* ── Header ── */}
      <header className="ct-header">
        <div className="ct-header__inner">
          <div className="ct-header__left">
            <div className="ct-header__avatar">
              <div className="ct-header__avatar-inner">
                <SparklesIcon className="ct-header__avatar-icon" aria-hidden="true" />
              </div>
              <span className="ct-header__status-dot" aria-hidden="true" />
            </div>
            <div className="ct-header__info">
              <h1 className="ct-header__title">MatPath AI</h1>
              <p className="ct-header__status">
                {streaming ? (
                  <span className="ct-header__typing">
                    <span className="ct-typing-wave">
                      <span /><span /><span />
                    </span>
                    Thinking...
                  </span>
                ) : (
                  <>
                    <span className="ct-header__online-dot" />
                    Election Assistant • Online
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="ct-header__right">
            <button
              className="ct-header__menu"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Chat options"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="ct-header__dropdown glass animate-slide-up">
                <button 
                  className="ct-header__dropdown-item text-red-500"
                  onClick={() => {
                    clearChat();
                    setShowMenu(false);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="ct-messages"
        id="ct-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="ct-messages__inner">
          {/* Show quick prompts only when conversation hasn't started */}
          {!hasConversation && (
            <div className="ct-prompts animate-fade-in">
              <p className="ct-prompts__label">{t('prompt_label', 'Quick questions to get started')}</p>
              <div className="ct-prompts__grid">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handleSend(t(p.key))}
                    className="ct-prompt-card"
                  >
                    <span className="ct-prompt-card__icon" style={{ background: `${p.color}14`, color: p.color }}>
                      {p.icon}
                    </span>
                    <span className="ct-prompt-card__text">{t(p.key)}</span>
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
          className="ct-scroll-btn animate-fade-in"
          aria-label="Scroll to latest message"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* ── Input Footer ── */}
      <footer className="ct-footer">
        <div className="ct-footer__inner">
          <div className="ct-input-bar">
            <VoiceButton
              onResult={handleVoiceResult}
              language={`${i18n.language}-IN`}
            />
            <div className="ct-input-bar__field">
              <ChatInput
                onSend={handleSend}
                disabled={streaming}
                language={i18n.language}
              />
            </div>
          </div>
          <p className="ct-footer__disclaimer">
            MatPath AI provides guidance based on official ECI data
          </p>
        </div>
      </footer>
    </div>
  )
}
