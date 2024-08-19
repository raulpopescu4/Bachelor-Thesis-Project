import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FightCard from '../components/FightCard';

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
