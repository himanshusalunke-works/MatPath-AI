import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguagePicker, { LANGUAGES } from '../../src/components/shared/LanguagePicker';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('LanguagePicker Component', () => {
  it('renders correctly with default language', () => {
    render(<LanguagePicker />);
    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<LanguagePicker />);
    const button = screen.getByRole('button', { name: /select language/i });
    fireEvent.click(button);
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBe(LANGUAGES.length);
  });
});
