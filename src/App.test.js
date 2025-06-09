import { render, screen } from '@testing-library/react';
import App from './App';

test.skip('renders canvas', () => {
  render(<App />);
  const canvas = screen.getByRole('img');
  expect(canvas).toBeInTheDocument();
});
