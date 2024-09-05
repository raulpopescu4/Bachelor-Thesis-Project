import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Recommendations from '../components/Recommendations';
import api from '../components/api';

jest.mock('../components/api');

describe('Recommendations Component', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'mocked_token');
  });

  test('displays loading initially', () => {
    render(<Recommendations />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays recommendations after fetching data', async () => {
    const mockFights = [
      {
        id: 1,
        title: 'UFC 229',
        fighter1: 'Khabib Nurmagomedov',
        fighter2: 'Conor McGregor',
        card: 'UFC 229 Main Event',
        date: '2018-10-06',
        details: 'Khabib won by submission in the fourth round.',
        isBookmarked: false
      },
      {
        id: 2,
        title: 'UFC 217',
        fighter1: 'Michael Bisping',
        fighter2: 'Georges St-Pierre',
        card: 'UFC 217 Main Event',
        date: '2017-11-04',
        details: 'GSP won by submission in the third round.',
        isBookmarked: true
      }
    ];

    api.get.mockResolvedValue({ data: { fights: mockFights } });

    render(<Recommendations />);

    await waitFor(() => {
      expect(screen.getByText('Your Recommendations')).toBeInTheDocument();
    });

    expect(screen.getByText('UFC 229')).toBeInTheDocument();
    expect(screen.getByText('UFC 217')).toBeInTheDocument();
  });

  test('displays no recommendations message when no data', async () => {
    api.get.mockResolvedValue({ data: { fights: [] } });

    render(<Recommendations />);

    await waitFor(() => {
      expect(screen.getByText('No recommendations available.')).toBeInTheDocument();
    });
  });

  test('handles errors during fetching recommendations', async () => {
    api.get.mockRejectedValue(new Error('Error fetching recommendations'));

    render(<Recommendations />);

    await waitFor(() => {
      expect(screen.getByText('Your Recommendations')).toBeInTheDocument();
    });

    expect(screen.getByText('No recommendations available.')).toBeInTheDocument();
  });

  test('allows bookmarking a fight', async () => {
    const mockFights = [
      {
        id: 1,
        title: 'UFC 229',
        fighter1: 'Khabib Nurmagomedov',
        fighter2: 'Conor McGregor',
        card: 'UFC 229 Main Event',
        date: '2018-10-06',
        details: 'Khabib won by submission in the fourth round.',
        isBookmarked: false
      }
    ];

    api.get.mockResolvedValue({ data: { fights: mockFights } });
    api.post.mockResolvedValue({ status: 201, data: {} });

    render(<Recommendations />);

    await waitFor(() => {
      expect(screen.getByText('Your Recommendations')).toBeInTheDocument();
    });

    const bookmarkButton = screen.getByText('Bookmark Fight');
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/bookmark-fight/', {
        fight: {
          title: 'UFC 229',
          fighter1: 'Khabib Nurmagomedov',
          fighter2: 'Conor McGregor',
          card: 'UFC 229 Main Event',
          date: '2018-10-06',
          details: 'Khabib won by submission in the fourth round.'
        }
      });
    });

    expect(screen.getByText('Bookmarked')).toBeInTheDocument();
  });

  test('handles errors during bookmarking a fight', async () => {
    const mockFights = [
      {
        id: 1,
        title: 'UFC 229',
        fighter1: 'Khabib Nurmagomedov',
        fighter2: 'Conor McGregor',
        card: 'UFC 229 Main Event',
        date: '2018-10-06',
        details: 'Khabib won by submission in the fourth round.',
        isBookmarked: false
      }
    ];

    api.get.mockResolvedValue({ data: { fights: mockFights } });
    api.post.mockRejectedValue(new Error('Failed to bookmark'));

    render(<Recommendations />);

    await waitFor(() => {
      expect(screen.getByText('Your Recommendations')).toBeInTheDocument();
    });

    const bookmarkButton = screen.getByText('Bookmark Fight');
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });

    expect(screen.getByText('Bookmark Fight')).toBeInTheDocument(); // Button remains unchanged
  });
});
