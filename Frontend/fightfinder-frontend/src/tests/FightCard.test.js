import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FightCard from '../components/FightCard';
import api from '../components/api';

describe('FightCard Component', () => {
  const mockFight = {
    title: 'UFC 229',
    fighter1: 'Khabib Nurmagomedov',
    fighter2: 'Conor McGregor',
    card: 'UFC 229 Main Event',
    date: '2018-10-06',
    details: 'Khabib won by submission in the fourth round.',
    bookmark_id: 123
  };

  test('renders with minimal props', () => {
    render(<FightCard fight={mockFight} isBookmarked={false} onBookmark={() => {}} onDeleteBookmark={() => {}} />);
    expect(screen.getByText('UFC 229 (Click to expand)')).toBeInTheDocument();
  });

  test('expands and collapses on title click', () => {
    render(<FightCard fight={mockFight} isBookmarked={false} onBookmark={() => {}} onDeleteBookmark={() => {}} />);
    const title = screen.getByText('UFC 229 (Click to expand)');
    fireEvent.click(title);
    expect(screen.getByText('Details: Khabib won by submission in the fourth round.')).toBeInTheDocument();
    fireEvent.click(title);
    expect(screen.queryByText('Details: Khabib won by submission in the fourth round.')).not.toBeInTheDocument();
  });

  test('shows bookmark button when not bookmarked', () => {
    render(<FightCard fight={mockFight} isBookmarked={false} onBookmark={() => {}} onDeleteBookmark={() => {}} />);
    const title = screen.getByText('UFC 229 (Click to expand)');
    fireEvent.click(title);
    expect(screen.getByText('Bookmark Fight')).toBeInTheDocument();
    expect(screen.queryByText('Delete Bookmark')).not.toBeInTheDocument();
  });

  test('shows delete bookmark button when bookmarked', () => {
    render(<FightCard fight={mockFight} isBookmarked={true} onBookmark={() => {}} onDeleteBookmark={() => {}} />);
    const title = screen.getByText('UFC 229 (Click to expand)');
    fireEvent.click(title);
    expect(screen.getByText('Delete Bookmark')).toBeInTheDocument();
    expect(screen.queryByText('Bookmark Fight')).not.toBeInTheDocument();
  });

  test('calls onBookmark when bookmark button is clicked', () => {
    const onBookmarkMock = jest.fn();
    render(<FightCard fight={mockFight} isBookmarked={false} onBookmark={onBookmarkMock} onDeleteBookmark={() => {}} />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    fireEvent.click(screen.getByText('Bookmark Fight'));
    expect(onBookmarkMock).toHaveBeenCalledWith(mockFight);
  });

  test('calls onDeleteBookmark when delete bookmark button is clicked', () => {
    const onDeleteBookmarkMock = jest.fn();
    render(<FightCard fight={mockFight} isBookmarked={true} onBookmark={() => {}} onDeleteBookmark={onDeleteBookmarkMock} />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    fireEvent.click(screen.getByText('Delete Bookmark'));
    expect(onDeleteBookmarkMock).toHaveBeenCalledWith(mockFight.bookmark_id);
  });
});


jest.mock('../components/api'); //mock the API module

describe('FightCard Component - Like/Dislike Functionality', () => {
  const mockFight = {
    id: 1,
    title: 'UFC 229',
    fighter1: 'Khabib Nurmagomedov',
    fighter2: 'Conor McGregor',
    card: 'UFC 229 Main Event',
    date: '2018-10-06',
    details: 'Khabib won by submission in the fourth round.',
    bookmark_id: 123,
    like_status: 0, // 0 for no like/dislike, 1 for like, -1 for dislike
  };

  test('renders "Like" button when like_status is 0', () => {
    render(<FightCard fight={mockFight} onBookmark={() => {}} onDeleteBookmark={() => {}} pageType="yourFights" />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    expect(screen.getByText('Like')).toBeInTheDocument();
    expect(screen.queryByText('Dislike')).not.toBeInTheDocument();
  });

  test('renders "Dislike" button when like_status is 1', () => {
    const likedFight = { ...mockFight, like_status: 1 };
    render(<FightCard fight={likedFight} onBookmark={() => {}} onDeleteBookmark={() => {}} pageType="yourFights" />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    expect(screen.getByText('Dislike')).toBeInTheDocument();
    expect(screen.queryByText('Like')).not.toBeInTheDocument();
  });

  test('calls handleLikeDislike with "like" when Like button is clicked', async () => {
    api.post.mockResolvedValue({ status: 200, data: { message: 'Fight liked.' } });
    
    render(<FightCard fight={mockFight} onBookmark={() => {}} onDeleteBookmark={() => {}} pageType="yourFights" />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    fireEvent.click(screen.getByText('Like'));

    expect(api.post).toHaveBeenCalledWith('/fight/1/like/');
    expect(await screen.findByText('Dislike')).toBeInTheDocument();
  });

  test('calls handleLikeDislike with "dislike" when Dislike button is clicked', async () => {
    const likedFight = { ...mockFight, like_status: 1 };
    api.post.mockResolvedValue({ status: 200, data: { message: 'Fight disliked.' } });

    render(<FightCard fight={likedFight} onBookmark={() => {}} onDeleteBookmark={() => {}} pageType="yourFights" />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    fireEvent.click(screen.getByText('Dislike'));

    expect(api.post).toHaveBeenCalledWith('/fight/1/dislike/');
    expect(await screen.findByText('Like')).toBeInTheDocument();
  });

  test('handles API errors gracefully during like/dislike', async () => {
    api.post.mockRejectedValue(new Error('Failed to toggle like/dislike'));

    render(<FightCard fight={mockFight} onBookmark={() => {}} onDeleteBookmark={() => {}} pageType="yourFights" />);
    fireEvent.click(screen.getByText('UFC 229 (Click to expand)'));
    fireEvent.click(screen.getByText('Like'));

    expect(api.post).toHaveBeenCalledWith('/fight/1/like/');
    // Error will be logged, and the button should not change
    expect(screen.getByText('Like')).toBeInTheDocument();
  });
});