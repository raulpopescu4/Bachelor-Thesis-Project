import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom'; 

const questions = [
  { id: 1, question: "Do you like matches that finish or that go the distance? ", options: ["I wanna see a finish!", "Going to the distance"] },
  { id: 2, question: "Do you prefer tehnical grapling show-downs or a flashy stand-up fight?", options: ["Grapling", "Stand-up fighting"] },
  
];

const UserPreferences = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    api.get('/user/preferences/')
      .then(response => {
        
        setAnswers(JSON.parse(response.data.preferences || '{}')); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching preferences:', error);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (option) => {
    const question = questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [question.id]: option }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const submitPreferences = async () => {
    const formattedData = {
      preferences: JSON.stringify(answers) 
    };

    try {
      const response = await api.post('/user/preferences/', formattedData);
      console.log('Preferences updated:', response.data);
      navigate('/'); 
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Update Your Preferences</h1>
      {currentQuestionIndex < questions.length ? (
        <div>
          <p>{questions[currentQuestionIndex].question}</p>
          {questions[currentQuestionIndex].options.map(option => (
            <button key={option} onClick={() => handleAnswer(option)}>{option}</button>
          ))}
        </div>
      ) : (
        <div>
          <p>Your preferences are ready to be updated based on your answers.</p>
          <button onClick={submitPreferences}>Submit Preferences</button>
        </div>
      )}
    </div>
  );
};

export default UserPreferences;
