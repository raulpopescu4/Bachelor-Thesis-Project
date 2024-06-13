import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

test('renders registration form', () => {
  render(<Register />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
});

test('handles registration input correctly', () => {
  render(<Register />);
  
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password' } });
  
  expect(screen.getByLabelText(/username/i).value).toBe('newuser');
  expect(screen.getByLabelText(/password/i).value).toBe('password');
  expect(screen.getByLabelText(/confirm password/i).value).toBe('password');
});
    