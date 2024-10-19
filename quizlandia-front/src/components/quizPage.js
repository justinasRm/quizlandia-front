import React, { useState } from 'react';
import './quizPage.css';
import ManualQuiz from './../classes/manualQuiz';
import AiQuiz from './../classes/aiQuiz';

const QuizPage = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [createdQuestions, setQuestionCount] = useState(0);
    const [quizKey, setQuizKey] = useState(0);

    const handleQuizTypeChange = (index) => {
        setActiveIndex(index);
    };

    function resetQuiz(){
        setQuizKey(prevKey => prevKey + 1);
    };

    const renderQuizComponent = () => {
        switch (activeIndex) {
            case 0:
                return <ManualQuiz key={quizKey} />;
            case 1:
                return <AiQuiz key={quizKey} />;
            default:
                return null;
        }
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

                {renderQuizComponent()}
            </div>

            <div className='question-helpers'>
                <button id='add-new-question' disabled>Add question</button>
                <button id='reset-question' onClick={resetQuiz}>Reset</button>
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