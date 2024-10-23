import React, { useState, useRef, useEffect  } from 'react';
import './quizPage.css';
import QuizQuestions from './../classes/quizQuestions';
import ManualQuiz from './../classes/manualQuiz';
import AiQuiz from './../classes/aiQuiz';

const QuizPage = () => {

    const questionsRef = useRef();
    const manualQuizRef = useRef();
    const aiQuizRef = useRef();

    const [currentQuizIndex, setQuizIndex] = useState(0);
    const [createdQuestionsCount, setQuestionCount] = useState(0);
    const [isFormValid, setFormValidity] = useState(false);

    useEffect(() => {
        if(questionsRef.current) {
            setQuestionCount(questionsRef.current.getQuestionCount());
        }
    }, [questionsRef]);

    // Used for correct rendering
    const [quizKey, setQuizKey] = useState(0);

    // Checks if current form is valid for saving
    const handleForm = (value) => {
        setFormValidity(value);
    }

    const updateCreatedQuestions = (value) => {
        setQuestionCount(value);
    }
    
    const handleQuizTypeChange = (index) => {
        setQuizIndex(index);
        setFormValidity(false);
    };

    function resetQuiz() {
        setQuizKey(prevKey => prevKey + 1);
        setFormValidity(false);
    };
    
    function addQuestion() {
        if (currentQuizIndex === 0 && manualQuizRef.current) {
            manualQuizRef.current.saveQuizQuestion()
        } else if (currentQuizIndex === 1 && aiQuizRef.current) {
            aiQuizRef.current.test(); //TODO when AI type implemented
        }
        
        // Resets form when new question added
        setFormValidity(false);
    }

    function updateQuizQuestions(question) {
        questionsRef.current.addQuestion(question);
    }

    const renderQuizComponent = () => {
        switch (currentQuizIndex) {
            case 0:
                return <ManualQuiz key={quizKey} ref={manualQuizRef} onFormChange={handleForm} onSubmit={updateQuizQuestions}/>;
            case 1:
                return <AiQuiz key={quizKey} ref={aiQuizRef} />;
            default:
                return null;
        }
    };
  
    return (
      <div className='quiz-page-container'>
        <div className='quiz-creation-block'>
            <div>
                <div className='quiz-types'>

                    <span>Klausimyno tipas:</span>
            
                    <div>
                        <button className={currentQuizIndex === 0 ? 'active-type' : ''} onClick={() => handleQuizTypeChange(0)}>Rankinis</button>
                        <button className={currentQuizIndex === 1 ? 'active-type' : ''} onClick={() => handleQuizTypeChange(1)}>AI</button>
                    </div>

                </div>

                {renderQuizComponent()}
            </div>

            <div className='question-helpers'>
                <button id='add-new-question' disabled={!isFormValid} onClick={addQuestion}>Pridėti klausimą</button>
                <button id='reset-question' onClick={resetQuiz}>Atnaujinti</button>
            </div>
        </div>

        <div className='quiz-summary-block'>
            <div>
                <span>Klausimai: {createdQuestionsCount}</span>
                <button id='save-quiz' disabled={createdQuestionsCount === 0} onClick={questionsRef.current?.saveQuizToDatabase}>Išsaugoti klausimyną</button>
            </div>
            <div className='created-questions'>
                <QuizQuestions ref={questionsRef}  onUpdateQuestions={updateCreatedQuestions} />
            </div>
        </div>
      </div>
    );
};

export default QuizPage;