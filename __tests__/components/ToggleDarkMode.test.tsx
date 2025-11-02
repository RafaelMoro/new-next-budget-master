import { ToggleDarkMode } from '@/shared/ui/atoms/ToggleDarkMode'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'mocked-theme' })),
    set: jest.fn(),
  })),
}));

function mockFetch() {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      success: true,
      themeChangedTo: "light"
    }),
  );
}

describe('ToggleDarkMode', () => {
  it('Should show toggle dark mode button', () => {
    render(<ToggleDarkMode />)

    expect(screen.getByTestId('toggle-theme-mode-button')).toBeInTheDocument()
  })

  it('Should change to light mode when clicked', async() => {
    const user = userEvent.setup()
    window.fetch = mockFetch()
    render(<ToggleDarkMode />)

    const button = screen.getByTestId('toggle-theme-mode-button')
    await user.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('Given a user clicking the button twice, it should return to dark mode', async() => {
    const user = userEvent.setup()
    window.fetch = mockFetch()
    render(<ToggleDarkMode />)

    const button = screen.getByTestId('toggle-theme-mode-button')
    await user.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    await user.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})