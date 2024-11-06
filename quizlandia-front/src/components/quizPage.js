import React, { useState, useRef, useEffect  } from 'react';
import './quizPage.css';
import QuizQuestions from './../classes/quizQuestions';
import ManualQuiz from './../classes/manualQuiz';
import AiQuiz from './../classes/aiQuiz';
import { TextField, Slide, Dialog, Button } from '@mui/material';
import { generateRandomCode } from '../functions/generateRandomCode';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {

    const questionsRef = useRef();
    const manualQuizRef = useRef();
    const aiQuizRef = useRef();
    const navigate = useNavigate();


    const [currentQuizIndex, setQuizIndex] = useState(0);
    const [createdQuestionsCount, setQuestionCount] = useState(0);
    const [isFormValid, setFormValidity] = useState(false);
    const [quizName, setQuizName] = useState('');
    const [quizDesc, setQuizDesc] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [quizCode, setQuizCode] = useState(generateRandomCode());
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState('');

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


    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
  
    return (
      <div className='quiz-page-container'>
            <div className='quiz-creation-block'>
                {error && <span style={{color: 'red'}}>{error}</span>}
                <div>
                    <div className='quiz-info'>
                    <span>Klausimyno pavadinimas</span>
                    <TextField value={quizName} onChange={(e)=>{
                        setQuizName(e.target.value);
                    }}></TextField>
                </div>
                <div className='quiz-info'>
                        <span>Klausimyno aprašymas</span>
                             <TextField value={quizDesc} onChange={(e)=>{
                        setQuizDesc(e.target.value);
                    }}></TextField>
                        
                </div>
                <div className='quiz-info'>
                    <span>Laiko limitas sekundėmis(palikite tuščią, jei nepritaikyti)</span>
                    <TextField type='number' value={timeLimit} onChange={(e)=>{setTimeLimit(e.target.value)}}></TextField>
                </div>
                    <div className='quiz-info'>
                    <span>Klausimyno kodas(10 simbolių limitas)</span>
                    <TextField value={quizCode} onChange={(e)=>{setQuizCode(e.target.value)}}></TextField>
                </div>
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
                    <QuizQuestions ref={questionsRef} quizName={quizName} timeLimit={timeLimit} quizCode={quizCode} quizDescription={quizDesc} setError={setError} setConfirmation={setConfirmation} onUpdateQuestions={updateCreatedQuestions} />
            </div>
            </div>
            

            <Dialog
                open={confirmation ? true : false}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                style={{padding: 10}}
            >
                <>
                    <h2 style={{ textAlign: 'center', margin: 50 }}>{confirmation}</h2>
                <Button onClick={()=>{navigate(`/`) }} variant='contained'>Grįžti į pradžią</Button>
                </>
    
            </Dialog>
      </div>
    );
};

export default QuizPage;