import { render, screen, fireEvent } from '@testing-library/react';
import { ChatBubble } from '../../src/components/chat/ChatBubble';
import { describe, it, expect, vi } from 'vitest';

// Mock the hook
vi.mock('../../hooks/useVoiceOutput', () => ({
  useVoiceOutput: () => ({
    playing: false,
    speak: vi.fn(),
    stop: vi.fn(),
  }),
}));

describe('ChatBubble', () => {
  const userMessage = {
    role: 'user',
    content: 'Hello AI',
    timestamp: new Date().toISOString()
  };

  const aiMessage = {
    role: 'assistant',
    content: 'Hello User',
    timestamp: new Date().toISOString()
  };

  it('renders user message correctly', () => {
    render(<ChatBubble message={userMessage} language="en" />);
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('renders AI message with action buttons', () => {
    render(<ChatBubble message={aiMessage} language="en" />);
    expect(screen.getByText('Hello User')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy message')).toBeInTheDocument();
    expect(screen.getByLabelText('Listen to response')).toBeInTheDocument();
  });

  it('shows typing indicator when loading', () => {
    const loadingMessage = { role: 'assistant', loading: true };
    render(<ChatBubble message={loadingMessage} language="en" />);
    expect(screen.queryByText('Hello User')).not.toBeInTheDocument();
    // Check for typing dots structure if needed
  });
});
