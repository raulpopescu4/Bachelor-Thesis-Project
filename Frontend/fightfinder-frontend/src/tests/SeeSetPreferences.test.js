import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeePreferences from '../components/SeePreferences';
import api from '../components/api';

jest.mock('../components/api');

describe('SeePreferences Component', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'mocked_token');
  });

  test('displays loading initially', () => {
    render(<SeePreferences />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays preferences after fetching data', async () => {
    const mockPreferences = { "1": "I wanna see a finish!", "2": "Technical Grappling" };
    api.get.mockResolvedValue({ data: { preferences: JSON.stringify(mockPreferences) } });

    render(<SeePreferences />);

    await waitFor(() => {
      expect(screen.getByText('Your Preferences')).toBeInTheDocument();
    });

    expect(screen.getByText('Do you like matches that finish or that go the distance?')).toBeInTheDocument();
    expect(screen.getByText('I wanna see a finish!')).toBeInTheDocument();
    expect(screen.getByText('Do you prefer technical grappling show-downs or a flashy stand-up fight?')).toBeInTheDocument();
    expect(screen.getByText('Technical Grappling')).toBeInTheDocument();
  });

  test('displays message when no preferences are set', async () => {
    api.get.mockResolvedValue({ data: { preferences: '{}' } });

    render(<SeePreferences />);

    await waitFor(() => {
      expect(screen.getByText('Your Preferences')).toBeInTheDocument();
    });

    expect(screen.getByText('No preferences set.')).toBeInTheDocument();
  });

  test('handles errors during fetching preferences', async () => {
    api.get.mockRejectedValue(new Error('Error fetching preferences'));

    render(<SeePreferences />);

    await waitFor(() => {
      expect(screen.getByText('Your Preferences')).toBeInTheDocument();
    });

    expect(screen.getByText('No preferences set.')).toBeInTheDocument();
  });
});


describe('SetPreferences Component', () => {
    beforeEach(() => {
      localStorage.setItem('access_token', 'mocked_token');
    });
  
    test('displays the first question initially', () => {
      render(
        <MemoryRouter>
          <SetPreferences />
        </MemoryRouter>
      );
      expect(screen.getByText('Do you like matches that finish or that go the distance?')).toBeInTheDocument();
    });
  
    test('advances to the next question after answering', () => {
      render(
        <MemoryRouter>
          <SetPreferences />
        </MemoryRouter>
      );
      fireEvent.click(screen.getByText('I wanna see a finish!'));
      expect(screen.getByText('Do you prefer technical grappling show-downs or a flashy stand-up fight?')).toBeInTheDocument();
    });
  
    test('displays submit button after last question', () => {
      render(
        <MemoryRouter>
          <SetPreferences />
        </MemoryRouter>
      );
  
      // Answer all the questions
      fireEvent.click(screen.getByText('I wanna see a finish!'));
      fireEvent.click(screen.getByText('Technical Grappling'));
      fireEvent.click(screen.getByText('Fast-paced'));
      fireEvent.click(screen.getByText('Welterweight'));
      fireEvent.click(screen.getByText('Favorites winning'));
  
      expect(screen.getByText('Your preferences are ready to be updated based on your answers.')).toBeInTheDocument();
      expect(screen.getByText('Submit Preferences')).toBeInTheDocument();
    });
  
    test('submits preferences successfully', async () => {
      api.post.mockResolvedValue({ data: { message: 'Preferences updated successfully' } });
      render(
        <MemoryRouter>
          <SetPreferences />
        </MemoryRouter>
      );
  
      // Answer all the questions
      fireEvent.click(screen.getByText('I wanna see a finish!'));
      fireEvent.click(screen.getByText('Technical Grappling'));
      fireEvent.click(screen.getByText('Fast-paced'));
      fireEvent.click(screen.getByText('Welterweight'));
      fireEvent.click(screen.getByText('Favorites winning'));
  
      fireEvent.click(screen.getByText('Submit Preferences'));
  
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/user/preferences/', {
          preferences: {
            1: 'I wanna see a finish!',
            2: 'Technical Grappling',
            3: 'Fast-paced',
            4: 'Welterweight',
            5: 'Favorites winning'
          }
        });
      });
    });
  
    test('handles errors during submission of preferences', async () => {
      api.post.mockRejectedValue(new Error('Error updating preferences'));
  
      render(
        <MemoryRouter>
          <SetPreferences />
        </MemoryRouter>
      );
  
      // Answer all the questions
      fireEvent.click(screen.getByText('I wanna see a finish!'));
      fireEvent.click(screen.getByText('Technical Grappling'));
      fireEvent.click(screen.getByText('Fast-paced'));
      fireEvent.click(screen.getByText('Welterweight'));
      fireEvent.click(screen.getByText('Favorites winning'));
  
      fireEvent.click(screen.getByText('Submit Preferences'));
  
      await waitFor(() => {
        expect(api.post).toHaveBeenCalled();
      });
  
      expect(api.post).toHaveBeenCalledWith('/user/preferences/', {
        preferences: {
          1: 'I wanna see a finish!',
          2: 'Technical Grappling',
          3: 'Fast-paced',
          4: 'Welterweight',
          5: 'Favorites winning'
        }
      });
    });
  });