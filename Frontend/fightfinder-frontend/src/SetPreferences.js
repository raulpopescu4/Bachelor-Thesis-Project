import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const questions = [
  { id: 1, question: "Do you like matches that finish or that go the distance?", options: ["I wanna see a finish!", "Going to the distance"] },
  { id: 2, question: "Do you prefer technical grappling show-downs or a flashy stand-up fight?", options: ["Grappling", "Stand-up fighting"] },
];

const SetPreferences = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnswers({});
    setCurrentQuestionIndex(0);
  }, []);

  const handleAnswer = (option) => {
    const question = questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [question.id]: option }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(questions.length); // Mark that all questions have been answered
    }
  };

  const submitPreferences = async () => {
    const formattedData = {
      preferences: answers // Sending as a JSON object directly
    };

    try {
      const response = await api.post('/user/preferences/', formattedData);
      console.log('Preferences updated:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

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

export default SetPreferences;