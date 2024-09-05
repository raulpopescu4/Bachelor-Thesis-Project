import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourFights from '../components/YourFights';
import api from '../components/api';

jest.mock('../components/api');

describe('YourFights Component', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'mocked_token');
  });

  test('displays loading initially', () => {
    render(<YourFights />);
    expect(screen.getByText('Loading your bookmarked fights...')).toBeInTheDocument();
  });

  test('displays fights after fetching bookmarked fights', async () => {
    const mockFights = [
      {
        bookmark_id: 1,
        title: 'UFC 229',
        fighter1: 'Khabib Nurmagomedov',
        fighter2: 'Conor McGregor',
        card: 'UFC 229 Main Event',
        date: '2018-10-06',
        details: 'Khabib won by submission in the fourth round.'
      },
      {
        bookmark_id: 2,
        title: 'UFC 217',
        fighter1: 'Michael Bisping',
        fighter2: 'Georges St-Pierre',
        card: 'UFC 217 Main Event',
        date: '2017-11-04',
        details: 'GSP won by submission in the third round.'
      }
    ];

    api.get.mockResolvedValue({ data: mockFights });

    render(<YourFights />);

    await waitFor(() => {
      expect(screen.getByText('Your Bookmarked Fights')).toBeInTheDocument();
    });

    expect(screen.getByText('UFC 229')).toBeInTheDocument();
    expect(screen.getByText('UFC 217')).toBeInTheDocument();
  });

  test('displays error message if fetching bookmarked fights fails', async () => {
    api.get.mockRejectedValue(new Error('Error fetching bookmarked fights'));

    render(<YourFights />);

    await waitFor(() => {
      expect(screen.queryByText('Your Bookmarked Fights')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('No fights available.')).toBeInTheDocument();
  });

  test('deletes a bookmarked fight and updates the list', async () => {
    const mockFights = [
      {
        bookmark_id: 1,
        title: 'UFC 229',
        fighter1: 'Khabib Nurmagomedov',
        fighter2: 'Conor McGregor',
        card: 'UFC 229 Main Event',
        date: '2018-10-06',
        details: 'Khabib won by submission in the fourth round.'
      },
      {
        bookmark_id: 2,
        title: 'UFC 217',
        fighter1: 'Michael Bisping',
        fighter2: 'Georges St-Pierre',
        card: 'UFC 217 Main Event',
        date: '2017-11-04',
        details: 'GSP won by submission in the third round.'
      }
    ];

    api.get.mockResolvedValue({ data: mockFights });
    api.delete.mockResolvedValue({ status: 204 });

    render(<YourFights />);

    await waitFor(() => {
      expect(screen.getByText('Your Bookmarked Fights')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete Bookmark')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/delete-bookmark/1/');
    });

    expect(screen.queryByText('UFC 229')).not.toBeInTheDocument();
    expect(screen.getByText('UFC 217')).toBeInTheDocument();
  });

  test('handles errors when deleting a bookmarked fight', async () => {
    const mockFights = [
      {
        bookmark_id: 1,
        title: 'UFC 229',
        fighter1: 'Khabib Nurmagomedov',
        fighter2: 'Conor McGregor',
        card: 'UFC 229 Main Event',
        date: '2018-10-06',
        details: 'Khabib won by submission in the fourth round.'
      }
    ];

    api.get.mockResolvedValue({ data: mockFights });
    api.delete.mockRejectedValue(new Error('Error deleting bookmark'));

    render(<YourFights />);

    await waitFor(() => {
      expect(screen.getByText('Your Bookmarked Fights')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete Bookmark');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
    });

    expect(screen.getByText('UFC 229')).toBeInTheDocument();
  });
});
