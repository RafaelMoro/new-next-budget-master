import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

it('renders the home page with welcome message', () => {
  render(<Home />);

  expect(screen.getByRole('heading', { name: /welcome to my app/i })).toBeInTheDocument();
})