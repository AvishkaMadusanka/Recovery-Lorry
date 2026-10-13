import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

test('home page presents the primary recovery action', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText(/Reliable recovery/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Find a recovery lorry/i })).toBeInTheDocument();
});
