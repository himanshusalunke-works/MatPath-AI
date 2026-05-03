import React, { memo } from 'react'
import PropTypes from 'prop-types';
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'

/**
 * VoiceButton component for initiating voice input.
 * @param {Object} props
 * @param {Function} props.onResult - Callback for when voice input is received
 * @param {string} [props.language] - Language code for voice input
 * @param {string} [props.size] - Size of the button
 * @returns {JSX.Element}
 */
const VoiceButton = memo(function VoiceButton({ onResult, language = 'en-IN', size = 'md' }) {
  const { listening, start, stop, error } = useVoiceInput({ onResult, language })

  return (
    <div className="chat-voice-wrap">
      {/* Pulse rings when active */}
      {listening && (
        <>
          <span className="chat-voice-pulse chat-voice-pulse--1" aria-hidden="true" />
          <span className="chat-voice-pulse chat-voice-pulse--2" aria-hidden="true" />
        </>
      )}
      <button
        id="voice-input-btn"
        onClick={listening ? stop : start}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
        aria-pressed={listening}
        className={`chat-voice-btn ${listening ? 'chat-voice-btn--recording' : ''}`}
      >
        {listening
          ? <StopIcon className="chat-voice-btn__icon" aria-hidden="true" />
          : <MicrophoneIcon className="chat-voice-btn__icon" aria-hidden="true" />
        }
      </button>
      {error && (
        <p role="alert" aria-live="assertive" className="chat-voice-error">
          {error}
        </p>
      )}
    </div>
  )
})

VoiceButton.propTypes = {
  onResult: PropTypes.func.isRequired,
  language: PropTypes.string,
  size: PropTypes.string,
};

VoiceButton.displayName = 'VoiceButton';

export default VoiceButton;
