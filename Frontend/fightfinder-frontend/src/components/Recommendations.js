import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import api from './api';
import FightCard from './FightCard';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Recommendations.css'; // Ensure you have this for your body styles

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const sliderRef = useRef(null); // Create a reference to the slider
  const [currentHeight, setCurrentHeight] = useState(0); // State to hold current slide height

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/recommendations/');
        if (response.data && Array.isArray(response.data.fights)) {
          const fightsWithBookmark = response.data.fights.map(fight => ({
            ...fight,
            isBookmarked: fight.isBookmarked || false  
          }));
          setRecommendations(fightsWithBookmark);
        } else {
          throw new Error('Data is not in expected format');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const onBookmark = async (fight) => {
    try {
      const formattedDate = new Date(fight.date).toISOString().split('T')[0];
      const fightData = {
        title: fight.title,
        fighter1: fight.fighter1,
        fighter2: fight.fighter2,
        card: fight.card,
        date: formattedDate,
        details: fight.details
      };
  
      const response = await api.post('/bookmark-fight/', { fight: fightData });
      if (response.status === 200 || response.status === 201) {
        setRecommendations(recommendations.map(f =>
          f.id === fight.id ? { ...f, isBookmarked: true } : f
        ));
      } else {
        throw new Error('Failed to add bookmark');
      }
    } catch (error) {
      console.error('Failed to bookmark:', error);
    }
  };

  const handleSlideChange = (index) => {
    // Get the current slide's height
    const activeSlide = document.querySelector(`[data-index="${index}"] .fightcard-style-1`);
    if (activeSlide) {
      setCurrentHeight(activeSlide.offsetHeight); // Update the current height
    }
  };

  useEffect(() => {
    if (sliderRef.current && recommendations.length > 0) {
      handleSlideChange(0); // Set initial height on the first slide
    }
  }, [recommendations]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: handleSlideChange, // Update height after slide change
    adaptiveHeight: false, // Disable adaptiveHeight, we will handle height ourselves
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="carousel-container" style={{ height: currentHeight ? `${currentHeight}px` : 'auto' }}>
      <h1 className="title">Your Recommendations</h1>
      <Slider {...settings} ref={sliderRef}>
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="fight-card-slide">
              <FightCard 
                fight={rec} 
                isBookmarked={rec.isBookmarked}
                onBookmark={() => onBookmark(rec)}
                pageType="recommendations"
                onExpand={() => handleSlideChange(index)} // Pass down to FightCard to trigger when expanded
              />
            </div>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </Slider>
    </div>
  );
};

export default Recommendations;
