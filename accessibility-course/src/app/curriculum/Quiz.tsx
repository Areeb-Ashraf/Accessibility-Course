"use client"
import React, { useState, useEffect } from 'react';
import '../styles/quiz.css';
import quizData from './quizData.json';

interface QuizProps {
  subTitle: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  xp: number;
}

const Quiz: React.FC<QuizProps> = ({ subTitle }) => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  
  // Find the quiz for this subtitle
  const quiz = quizData.quizzes.find(q => q.subTitle === subTitle);
  const questions: Question[] = quiz?.questions || [];
  
  useEffect(() => {
    // Initialize selectedAnswers array with -1 (no selection) for each question
    if (questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(-1));
    }
  }, [questions]);
  
  const startQuiz = () => {
    setStarted(true);
    setFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setScore(0);
    setTotalXP(0);
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const finishQuiz = () => {
    let correctCount = 0;
    let earnedXP = 0;
    
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
        earnedXP += question.xp;
      }
    });
    
    setScore(correctCount);
    setTotalXP(earnedXP);
    setFinished(true);
  };
  
  const retakeQuiz = () => {
    startQuiz();
  };
  
  if (!quiz) {
    return <div className="quiz-error">No quiz for this section.</div>;
  }
  
  return (
    <div className="quiz-container">
      {!started && !finished ? (
        <div className="quiz-start-container">
            <img src="/quiz-image.svg" alt="Quiz Start" className='quiz-start-image'/>
            <div className="quiz-start">
                <h2>Section Quiz</h2>
                <p>Test your knowledge on {subTitle}</p>
                <p>{questions.length} questions</p>
                <button className="quiz-start-button" onClick={startQuiz}>Start Quiz</button>
            </div>
        </div>
      ) : finished ? (
        <div className="quiz-finish">
            <img src="/quiz-finish-image.svg" alt="Quiz finish" className="quiz-finish-image" />
          <h2>Quiz Completed!</h2>
          <div className="quiz-results">
            <p>You got <span className="quiz-score">{score}</span> out of <span className="quiz-total">{questions.length}</span> questions correct.</p>
            <p>Total XP Earned: <span className="quiz-xp">{totalXP}</span></p>
          </div>
          <button className="quiz-retake-button" onClick={retakeQuiz}>Retake Quiz</button>
        </div>
      ) : (
        <div className="quiz-question-container">
          <div className="quiz-progress">
            Question {currentQuestionIndex + 1} of {questions.length} | {questions[currentQuestionIndex].xp} XP
          </div>
          <div className="quiz-question">
            <h3>{questions[currentQuestionIndex].question}</h3>          
            <div className="quiz-options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div 
                  key={index} 
                  className={`quiz-option ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div className="quiz-navigation">
            <button 
              className="quiz-prev-button" 
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button 
              className="quiz-next-button" 
              onClick={goToNextQuestion}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 