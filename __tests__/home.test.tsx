import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

it('test home page', () => {
  render(<Home />);

  expect(screen.getByText('Welcome to my app')).toBeInTheDocument();
})