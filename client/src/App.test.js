import { render, screen } from '@testing-library/react';
import BasicExample from './App';

test('renders learn react link', () => {
  render(<BasicExample />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
