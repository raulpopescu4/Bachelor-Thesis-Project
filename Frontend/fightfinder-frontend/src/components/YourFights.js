import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import api from './api';
import FightCard from './FightCard';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './YourFights.css'; // Import the custom CSS

const YourFights = () => {
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null); // Create a reference to the slider
  const [currentHeight, setCurrentHeight] = useState(0); // State to hold current slide height
  const [sliderKey, setSliderKey] = useState(0); // Key to force re-render of slider

  useEffect(() => {
    const fetchBookmarkedFights = async () => {
      try {
        const response = await api.get('/bookmarked-fights/');
        setFights(response.data); 
      } catch (error) {
        console.error('Error fetching bookmarked fights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedFights();
  }, []);

  const deleteBookmark = async (bookmark_id) => {
    try {
      await api.delete(`/delete-bookmark/${bookmark_id}/`);
      const updatedFights = fights.filter(fight => fight.bookmark_id !== bookmark_id);
      setFights(updatedFights);
      setSliderKey(prevKey => prevKey + 1); // Force re-render by updating the key
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleSlideChange = (index) => {
    const activeSlide = document.querySelector(`[data-index="${index}"] .fightcard-style-1`);
    if (activeSlide) {
      setCurrentHeight(activeSlide.offsetHeight); // Update the current height dynamically
    }
  };

  useEffect(() => {
    if (sliderRef.current && fights.length > 0) {
      handleSlideChange(0); // Set initial height on the first slide
    }
  }, [fights]);

  const settings = {
    dots: fights.length > 3, // Show dots only if there are more than 1 fight
    infinite: fights.length > 3, // Disable infinite scroll if there's only 1 fight
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: fights.length > 3, // Show arrows only if there are more than 1 fight
    afterChange: handleSlideChange, // Adjust height after slide change
    adaptiveHeight: false, // We manually handle height changes
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) return <p>Loading your bookmarked fights...</p>;

  return (
    <div className="carousel-container" style={{ height: currentHeight ? `${currentHeight}px` : 'auto' }}>
      <h2 className="title">Your Bookmarked Fights</h2>
      {fights.length > 0 ? (
        <Slider key={sliderKey} {...settings} ref={sliderRef}>
          {fights.map((fight, index) => (
            <div key={index} className="fight-card-slide">
              <FightCard
                fight={fight}
                onDeleteBookmark={() => deleteBookmark(fight.bookmark_id)}
                pageType="yourFights"
                onExpand={() => handleSlideChange(index)} // Handle expand events to adjust height
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p>You have no bookmarked fights.</p>
      )}
    </div>
  );
};

export default YourFights;
