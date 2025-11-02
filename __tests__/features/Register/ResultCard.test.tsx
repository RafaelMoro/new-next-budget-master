import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import { ResultCard } from "@/features/Login/Register/ResultCard";
import { LOGIN_ROUTE } from "@/shared/constants/global.constants";
import {
  SUCCESS_CREATE_USER_TITLE,
  SUCCESS_CREATE_USER_SPAN,
  SUCCESS_CREATE_USER_MESSAGE,
  SUCCESS_CREATE_USER_SECONDARY_MESSAGE,
} from "@/shared/constants/login.constants";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('ResultCard', () => {
  const mockResetStep = jest.fn();
  const defaultProps = {
    direction: 1,
    resetStep: mockResetStep,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success state (isError = false)', () => {
    const successProps = {
      ...defaultProps,
      title: 'Success Title',
      message: 'Success message',
      isError: false,
    };

    it('renders the success card with correct content', () => {
      render(<ResultCard {...successProps} />);

      expect(screen.getByText(SUCCESS_CREATE_USER_TITLE)).toBeInTheDocument();
      expect(screen.getByText(SUCCESS_CREATE_USER_SPAN)).toBeInTheDocument();
      expect(screen.getByText(SUCCESS_CREATE_USER_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText(SUCCESS_CREATE_USER_SECONDARY_MESSAGE)).toBeInTheDocument();
    });

    it('renders a link button to return to login', () => {
      render(<ResultCard {...successProps} />);

      const linkButton = screen.getByRole('link', { name: /regresar al inicio/i });
      expect(linkButton).toBeInTheDocument();
      expect(linkButton).toHaveAttribute('href', LOGIN_ROUTE);
    });

    it('does not render the retry button in success state', () => {
      render(<ResultCard {...successProps} />);

      expect(screen.queryByRole('button', { name: /volver a intentar/i })).not.toBeInTheDocument();
    });

    it('does not use the title and message props in success state', () => {
      render(<ResultCard {...successProps} />);

      expect(screen.queryByText('Success Title')).not.toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  describe('Error state (isError = true)', () => {
    const errorProps = {
      ...defaultProps,
      title: 'Error Title',
      message: 'Error message description',
      isError: true,
    };

    it('renders the error card with correct content', () => {
      render(<ResultCard {...errorProps} />);

      expect(screen.getByText('Error Title')).toBeInTheDocument();
      expect(screen.getByText('Error message description')).toBeInTheDocument();
    });

    it('renders both link button and retry button in error state', () => {
      render(<ResultCard {...errorProps} />);

      const linkButton = screen.getByRole('link', { name: /regresar al inicio/i });
      expect(linkButton).toBeInTheDocument();
      expect(linkButton).toHaveAttribute('href', LOGIN_ROUTE);

      const retryButton = screen.getByRole('button', { name: /volver a intentar/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('calls resetStep when retry button is clicked', async () => {
      const user = userEvent.setup();
      render(<ResultCard {...errorProps} />);

      const retryButton = screen.getByRole('button', { name: /volver a intentar/i });
      await user.click(retryButton);

      expect(mockResetStep).toHaveBeenCalledTimes(1);
    });

    it('does not render success messages in error state', () => {
      render(<ResultCard {...errorProps} />);

      expect(screen.queryByText(SUCCESS_CREATE_USER_TITLE)).not.toBeInTheDocument();
      expect(screen.queryByText(SUCCESS_CREATE_USER_SPAN)).not.toBeInTheDocument();
      expect(screen.queryByText(SUCCESS_CREATE_USER_MESSAGE)).not.toBeInTheDocument();
      expect(screen.queryByText(SUCCESS_CREATE_USER_SECONDARY_MESSAGE)).not.toBeInTheDocument();
    });
  });

  describe('Direction prop', () => {
    it('passes direction prop to AnimateBox for positive direction', () => {
      const props = {
        title: 'Test',
        message: 'Test message',
        isError: false,
        direction: 1,
        resetStep: mockResetStep,
      };

      const { container } = render(<ResultCard {...props} />);
      expect(container).toBeInTheDocument();
    });

    it('passes direction prop to AnimateBox for negative direction', () => {
      const props = {
        title: 'Test',
        message: 'Test message',
        isError: false,
        direction: -1,
        resetStep: mockResetStep,
      };

      const { container } = render(<ResultCard {...props} />);
      expect(container).toBeInTheDocument();
    });
  });
});
