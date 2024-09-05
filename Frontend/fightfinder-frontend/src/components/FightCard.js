import React, { useState, useEffect } from 'react';
import './FightCard.css';
import api from './api';

const FightCard = ({ fight, onBookmark, onDeleteBookmark, pageType, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(fight.isBookmarked);
  const [likeStatus, setLikeStatus] = useState(fight.like_status || 0); 

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded && onExpand) {
      // Call the onExpand function to notify parent of height change
      onExpand();
    }
  };

  const handleBookmark = async () => {
    await onBookmark(fight);
    setIsBookmarked(true);
  };

  const handleLikeDislike = async (action) => {
    try {
      const response = await api.post(`/fight/${fight.id}/${action}/`);
      if (response.status === 201 || response.status === 200) {
        const { message } = response.data;
        if (action === 'like') {
          setLikeStatus(1);
        } else if (action === 'dislike') {
          setLikeStatus(-1);
        }
        console.log(message); 
      } else {
        throw new Error('Failed to toggle like/dislike');
      }
    } catch (error) {
      console.error('Error toggling like/dislike:', error);
    }
  };

  const renderButton = () => {
    if (pageType === 'recommendations') {
      return isBookmarked ? (
        <button disabled>Bookmarked</button>
      ) : (
        <button onClick={handleBookmark}>Bookmark Fight</button>
      );
    } else if (pageType === 'yourFights') {
      return (
        <>
          <button onClick={() => onDeleteBookmark(fight.bookmark_id)}>Delete Bookmark</button>
          {likeStatus === 1 ? (
            <button onClick={() => handleLikeDislike('dislike')}>Dislike</button>
          ) : (
            <button onClick={() => handleLikeDislike('like')}>Like</button>
          )}
        </>
      );
    }
  };

  return (
    <div className="fightcard-style-1">
      <h2 onClick={toggleExpand} className="fightcard-style-2">
        {fight.title} (Click to {expanded ? 'collapse' : 'expand'})
      </h2>
      {expanded && (
        <div className="fightcard-content">
          <p>Fighters: {fight.fighter1} vs. {fight.fighter2}</p>
          <p>Event: {fight.card}</p>
          <p>Date: {new Date(fight.date).toLocaleDateString()}</p>
          <p>Details: {fight.details}</p>
          {renderButton()}
        </div>
      )}
    </div>
  );
};

export default FightCard;
