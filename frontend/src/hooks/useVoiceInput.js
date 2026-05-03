import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1'

/**
 * useVoiceInput — Records audio and transcribes via Google Cloud STT
 * Returns: { listening, transcript, start, stop, error }
 */
export function useVoiceInput({ onResult } = {}) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const { i18n } = useTranslation()
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const start = useCallback(async () => {
    setError(null)
    setTranscript('')
    setListening(true)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm'
        
      const recorder = new MediaRecorder(stream, { mimeType })
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })
        
        const langMap = {
          'en': 'en-IN',
          'hi': 'hi-IN',
          'mr': 'mr-IN',
          'ta': 'ta-IN'
        }
        const languageCode = langMap[i18n.language] || 'en-IN'

        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.webm')
        formData.append('languageCode', languageCode)

        try {
          const response = await fetch(`${API_BASE_URL}/voice/stt`, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) throw new Error('STT request failed')

          const data = await response.json()
          setTranscript(data.text)
          onResult?.(data.text)
        } catch (err) {
          console.error('Google STT Error:', err)
          setError('Failed to recognize speech')
        } finally {
          setListening(false)
          stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
    } catch (err) {
      console.error('Microphone Error:', err)
      setError('Microphone access denied')
      setListening(false)
    }
  }, [i18n.language, onResult])

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setListening(false)
  }, [])

  return { listening, transcript, start, stop, error }
}
