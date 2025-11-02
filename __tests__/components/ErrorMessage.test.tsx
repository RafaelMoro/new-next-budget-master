import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage";

describe('ErrorMessage', () => {
  it('renders children text when isAnimated is false', () => {
    render(<ErrorMessage isAnimated={false}>This is an error</ErrorMessage>);
    
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('renders as motion.p when isAnimated is true', () => {
    render(<ErrorMessage isAnimated={true}>Animated error</ErrorMessage>);
    
    expect(screen.getByText('Animated error')).toBeInTheDocument();
  });

  it('renders complex children content', () => {
    render(
      <ErrorMessage isAnimated={false}>
        <span>Complex error with <strong>bold text</strong></span>
      </ErrorMessage>
    );
    
    expect(screen.getByText(/Complex error with/i)).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
  });
});
