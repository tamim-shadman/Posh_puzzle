import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Posh Puzzle brand in navbar', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/Posh Puzzle/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
