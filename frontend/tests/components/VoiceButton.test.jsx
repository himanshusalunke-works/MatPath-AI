import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VoiceButton from '../../src/components/chat/VoiceButton';
import { useVoiceInput } from '../../src/hooks/useVoiceInput';

// Mock the hook
vi.mock('../../src/hooks/useVoiceInput', () => ({
  useVoiceInput: vi.fn(),
}));

describe('VoiceButton Component', () => {
  it('renders correctly when not listening', () => {
    useVoiceInput.mockReturnValue({
      listening: false,
      start: vi.fn(),
      stop: vi.fn(),
      error: null,
    });

    render(<VoiceButton onResult={vi.fn()} />);
    const button = screen.getByRole('button', { name: /start voice input/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('chat-voice-btn--recording');
  });

  it('renders correctly when listening', () => {
    useVoiceInput.mockReturnValue({
      listening: true,
      start: vi.fn(),
      stop: vi.fn(),
      error: null,
    });

    render(<VoiceButton onResult={vi.fn()} />);
    const button = screen.getByRole('button', { name: /stop voice input/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('chat-voice-btn--recording');
  });

  it('calls start when clicked while not listening', () => {
    const mockStart = vi.fn();
    useVoiceInput.mockReturnValue({
      listening: false,
      start: mockStart,
      stop: vi.fn(),
      error: null,
    });

    render(<VoiceButton onResult={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockStart).toHaveBeenCalled();
  });

  it('shows error message if error exists', () => {
    useVoiceInput.mockReturnValue({
      listening: false,
      start: vi.fn(),
      stop: vi.fn(),
      error: 'Microphone not found',
    });

    render(<VoiceButton onResult={vi.fn()} />);
    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toHaveTextContent('Microphone not found');
  });
});
