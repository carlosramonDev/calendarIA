import { render, screen } from '@testing-library/react';
import Calendar from './Calendar';

describe('Calendar Component', () => {
  it('should render the Calendar View heading', () => {
    render(<Calendar />);
    const headingElement = screen.getByText(/Calendar View/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    render(<Calendar />);
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should render view selection buttons', () => {
    render(<Calendar />);
    const monthButton = screen.getByRole('button', { name: /Month/i });
    const weekButton = screen.getByRole('button', { name: /Week/i });
    const dayButton = screen.getByRole('button', { name: /Day/i });
    expect(monthButton).toBeInTheDocument();
    expect(weekButton).toBeInTheDocument();
    expect(dayButton).toBeInTheDocument();
  });
});
