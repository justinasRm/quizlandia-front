import React, { useState } from 'react';
import './quizPage.css';

const QuizPage = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [createdQuestions, setQuestionCount] = useState(0);

    const handleQuizTypeChange = (index) => {
      setActiveIndex(index);
    };

    const handleQuizCountChange = (operation) => {
        setQuestionCount((prevCount) => {
            if (operation === 'add'){
                return prevCount + 1
            } else if(operation === 'subtract'){
                Math.max(prevCount - 1, 0);
            } else {
                return prevCount;
            } 
        });
    };
  
    return (
      <div className='quiz-page-container'>
        <div className='quiz-creation-block'>
            <div>
                <div className='quiz-types'>

                    <span>Quiz type:</span>
            
                    <div>
                        <button className={activeIndex === 0 ? 'active-type' : ''} onClick={() => handleQuizTypeChange(0)}> Manual </button>
                        <button className={activeIndex === 1 ? 'active-type' : ''} onClick={() => handleQuizTypeChange(1)}> AI </button>
                    </div>

                </div>

                <div className='new-question-block'>
                    <div>
                        <div>
                            <span>Question</span>
                        </div>
                        <textarea placeholder='Enter your question here.'></textarea>
                    </div>
                    <div className='answer-card'>
                        <div>
                            <span>Answer 1</span>

                            <div>
                                <label>Correct</label>
                                <input type='checkbox'></input>
                            </div>
                        </div>
                        <textarea placeholder='Enter your answer here.'></textarea>
                    </div>
                    <div className='answer-card'>
                        <div>
                            <span>Answer 2</span>

                            <div>
                                <label>Correct</label>
                                <input type='checkbox'></input>
                            </div>
                        </div>
                        <textarea placeholder='Enter your answer here.'></textarea>
                    </div>
                    
                </div>
                <button id='add-new-answer'>Add new answer</button>
            </div>

            <div className='question-helpers'>
                <button id='add-new-question'>Add question</button>
                <button id='reset-question'>Reset</button>
            </div>
        </div>

        <div className='quiz-summary-block'>
            <span>Questions: {createdQuestions}</span>
            <button id='save-quiz' disabled={createdQuestions === 0}>Save quiz</button>
        </div>

      </div>
    );
};

export default QuizPage;